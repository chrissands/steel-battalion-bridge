using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace SBBridge.Linux
{
    /// <summary>Minimal /dev/uinput writer (kernel uinput API v5).</summary>
    public sealed class UInputDevice : IDisposable
    {
        public const ushort EV_SYN = 0x00, EV_KEY = 0x01, EV_REL = 0x02, EV_ABS = 0x03;
        public const ushort SYN_REPORT = 0;
        public const ushort BUS_USB = 0x03, BUS_VIRTUAL = 0x06;

        // ioctl numbers: _IOW('U', nr, size) = (1<<30) | (size<<16) | ('U'<<8) | nr
        const ulong UI_DEV_CREATE = 0x5501, UI_DEV_DESTROY = 0x5502;
        const ulong UI_DEV_SETUP = 0x405C5503;      // struct uinput_setup (92 bytes)
        const ulong UI_ABS_SETUP = 0x401C5504;      // struct uinput_abs_setup (28 bytes)
        const ulong UI_SET_EVBIT = 0x40045564, UI_SET_KEYBIT = 0x40045565, UI_SET_RELBIT = 0x40045566, UI_SET_ABSBIT = 0x40045567;

        public const int EventSize = 24;  // struct input_event on 64-bit: timeval(16) + type(2) + code(2) + value(4)

        int fd = -1;
        public bool IsOpen { get { return fd >= 0; } }

        public static string DevicePath = "/dev/uinput";

        public static UInputDevice Open(out string error)
        {
            int fd = LibC.open(DevicePath, LibC.O_WRONLY | LibC.O_NONBLOCK | LibC.O_CLOEXEC);
            if (fd < 0)
            {
                int e = Marshal.GetLastWin32Error();
                error = e == 13 ? "No permission for /dev/uinput. Run install.sh (adds a udev rule), then log out and back in."
                      : e == 2 ? "/dev/uinput not found (uinput kernel module not loaded)."
                      : "Cannot open /dev/uinput: " + LibC.Err(e);
                return null;
            }
            error = null;
            return new UInputDevice { fd = fd };
        }

        void Ioctl(ulong req, int arg, string what)
        {
            if (LibC.ioctl(fd, req, arg) < 0) throw new InvalidOperationException(what + ": " + LibC.Err(Marshal.GetLastWin32Error()));
        }

        public void EnableKey(int code) { Ioctl(UI_SET_KEYBIT, code, "UI_SET_KEYBIT"); }
        public void EnableRel(int code) { Ioctl(UI_SET_RELBIT, code, "UI_SET_RELBIT"); }
        public void EnableEvent(int type) { Ioctl(UI_SET_EVBIT, type, "UI_SET_EVBIT"); }

        public static byte[] AbsSetup(ushort code, int min, int max, int fuzz, int flat)
        {
            var b = new byte[28];
            BitConverter.GetBytes(code).CopyTo(b, 0);
            // input_absinfo at offset 4: value, minimum, maximum, fuzz, flat, resolution
            BitConverter.GetBytes(0).CopyTo(b, 4);
            BitConverter.GetBytes(min).CopyTo(b, 8);
            BitConverter.GetBytes(max).CopyTo(b, 12);
            BitConverter.GetBytes(fuzz).CopyTo(b, 16);
            BitConverter.GetBytes(flat).CopyTo(b, 20);
            return b;
        }

        public void EnableAbs(ushort code, int min, int max, int fuzz, int flat)
        {
            Ioctl(UI_SET_ABSBIT, code, "UI_SET_ABSBIT");
            if (LibC.ioctl(fd, UI_ABS_SETUP, AbsSetup(code, min, max, fuzz, flat)) < 0)
                throw new InvalidOperationException("UI_ABS_SETUP: " + LibC.Err(Marshal.GetLastWin32Error()));
        }

        public static byte[] Setup(ushort bus, ushort vendor, ushort product, ushort version, string name)
        {
            var b = new byte[92];
            BitConverter.GetBytes(bus).CopyTo(b, 0);
            BitConverter.GetBytes(vendor).CopyTo(b, 2);
            BitConverter.GetBytes(product).CopyTo(b, 4);
            BitConverter.GetBytes(version).CopyTo(b, 6);
            var n = Encoding.ASCII.GetBytes(name);
            Array.Copy(n, 0, b, 8, Math.Min(n.Length, 79));
            return b; // ff_effects_max (offset 88) = 0
        }

        public void Create(ushort bus, ushort vendor, ushort product, ushort version, string name)
        {
            if (LibC.ioctl(fd, UI_DEV_SETUP, Setup(bus, vendor, product, version, name)) < 0)
                throw new InvalidOperationException("UI_DEV_SETUP: " + LibC.Err(Marshal.GetLastWin32Error()));
            if (LibC.ioctl(fd, UI_DEV_CREATE) < 0)
                throw new InvalidOperationException("UI_DEV_CREATE: " + LibC.Err(Marshal.GetLastWin32Error()));
        }

        /// <summary>Batch of input events, written with one write() call.</summary>
        public sealed class Batch
        {
            readonly List<byte> buf = new List<byte>(EventSize * 24);
            public void Add(ushort type, ushort code, int value)
            {
                var e = new byte[EventSize];
                BitConverter.GetBytes(type).CopyTo(e, 16);
                BitConverter.GetBytes(code).CopyTo(e, 18);
                BitConverter.GetBytes(value).CopyTo(e, 20);
                buf.AddRange(e);
            }
            public void Sync() { Add(EV_SYN, SYN_REPORT, 0); }
            public int Count { get { return buf.Count / EventSize; } }
            public byte[] ToArray() { return buf.ToArray(); }
        }

        public bool Write(Batch batch)
        {
            if (fd < 0 || batch.Count == 0) return fd >= 0;
            var data = batch.ToArray();
            long n = LibC.write(fd, data, new IntPtr(data.Length)).ToInt64();
            return n == data.Length;
        }

        public void Dispose()
        {
            if (fd < 0) return;
            LibC.ioctl(fd, UI_DEV_DESTROY);
            LibC.close(fd);
            fd = -1;
        }
    }
}
