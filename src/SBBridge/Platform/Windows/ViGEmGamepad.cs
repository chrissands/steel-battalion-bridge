using System;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;
using SBBridge.Core;

namespace SBBridge.Platform.Windows
{
    /// <summary>
    /// Virtual Xbox 360 controller via the ViGEmBus driver, talking to the bus directly with
    /// DeviceIoControl (protocol from nefarius/ViGEmClient, MIT). No extra DLLs needed.
    /// Windows sees a real wired Xbox 360 pad (VID 045E / PID 028E): XInput games and
    /// Steam Input pick it up natively.
    /// </summary>
    public sealed class ViGEmGamepad : IVirtualGamepad
    {
        static readonly Guid BusGuid = new Guid("96E42B22-F5E9-42F8-B043-ED0F932F014F");

        // CTL_CODE(FILE_DEVICE_BUS_EXTENDER=0x2A, 0x801+n, METHOD_BUFFERED, FILE_WRITE_DATA)
        const uint IOCTL_PLUGIN_TARGET = 0x2AA004;
        const uint IOCTL_UNPLUG_TARGET = 0x2AA008;
        const uint IOCTL_CHECK_VERSION = 0x2AA00C;
        const uint IOCTL_WAIT_DEVICE_READY = 0x2AA010;
        const uint IOCTL_XUSB_SUBMIT_REPORT = 0x2AA808;
        const uint VIGEM_COMMON_VERSION = 0x0001;
        const int ERROR_INVALID_PARAMETER = 87;

        SafeFileHandle bus;
        uint serial;
        readonly byte[] report = new byte[20];

        public bool IsConnected { get { return serial != 0; } }
        public string LastError { get; private set; }

        public bool Connect()
        {
            Disconnect();
            var paths = Native.InterfacePaths(BusGuid);
            if (paths.Count == 0) { LastError = "ViGEmBus driver not installed (see README, step 2)."; return false; }
            int ret;
            foreach (var p in paths)
            {
                var h = Native.CreateFile(p, Native.GENERIC_READ | Native.GENERIC_WRITE,
                    Native.FILE_SHARE_READ | Native.FILE_SHARE_WRITE, IntPtr.Zero, Native.OPEN_EXISTING, Native.FILE_ATTRIBUTE_NORMAL, IntPtr.Zero);
                if (h.IsInvalid) continue;
                var ver = new byte[8]; Put(ver, 0, 8); Put(ver, 4, VIGEM_COMMON_VERSION);
                if (!Native.DeviceIoControl(h, IOCTL_CHECK_VERSION, ver, 8, null, 0, out ret, IntPtr.Zero))
                { h.Dispose(); LastError = "ViGEmBus version mismatch - update ViGEmBus."; continue; }
                bus = h; break;
            }
            if (bus == null) { if (LastError == null) LastError = "Could not open ViGEmBus."; return false; }

            for (uint sn = 1; sn <= 16; sn++)
            {
                // VIGEM_PLUGIN_TARGET { ULONG Size; ULONG SerialNo; VIGEM_TARGET_TYPE TargetType; USHORT VendorId; USHORT ProductId; }
                var plug = new byte[16];
                Put(plug, 0, 16); Put(plug, 4, sn); Put(plug, 8, 0 /* Xbox360Wired */);
                plug[12] = 0x5E; plug[13] = 0x04; plug[14] = 0x8E; plug[15] = 0x02;
                if (!Native.DeviceIoControl(bus, IOCTL_PLUGIN_TARGET, plug, 16, null, 0, out ret, IntPtr.Zero)) continue;

                var wait = new byte[8]; Put(wait, 0, 8); Put(wait, 4, sn);
                if (Native.DeviceIoControl(bus, IOCTL_WAIT_DEVICE_READY, wait, 8, null, 0, out ret, IntPtr.Zero)
                    || Marshal.GetLastWin32Error() == ERROR_INVALID_PARAMETER /* pre-1.17 bus */)
                {
                    serial = sn; LastError = null;
                    Submit(new PadReport());
                    return true;
                }
                Unplug(sn);
            }
            LastError = "ViGEmBus refused to create a virtual pad (all slots busy?).";
            bus.Dispose(); bus = null;
            return false;
        }

        public bool Submit(PadReport r)
        {
            if (serial == 0) return false;
            // XUSB_SUBMIT_REPORT { ULONG Size; ULONG SerialNo; XUSB_REPORT { USHORT wButtons; BYTE LT, RT; SHORT LX, LY, RX, RY; } }
            Put(report, 0, 20); Put(report, 4, serial);
            report[8] = (byte)r.Buttons; report[9] = (byte)(r.Buttons >> 8);
            report[10] = r.LeftTrigger; report[11] = r.RightTrigger;
            P16(report, 12, r.LX); P16(report, 14, r.LY); P16(report, 16, r.RX); P16(report, 18, r.RY);
            int ret;
            if (Native.DeviceIoControl(bus, IOCTL_XUSB_SUBMIT_REPORT, report, 20, null, 0, out ret, IntPtr.Zero)) return true;
            LastError = "ViGEm submit failed (Win32 error " + Marshal.GetLastWin32Error() + ")";
            return false;
        }

        void Unplug(uint sn)
        {
            var u = new byte[8]; Put(u, 0, 8); Put(u, 4, sn);
            int ret; Native.DeviceIoControl(bus, IOCTL_UNPLUG_TARGET, u, 8, null, 0, out ret, IntPtr.Zero);
        }

        public void Disconnect()
        {
            if (bus != null)
            {
                if (serial != 0) Unplug(serial);
                bus.Dispose(); bus = null;
            }
            serial = 0;
        }

        public void Dispose() { Disconnect(); }

        static void Put(byte[] b, int o, uint v) { b[o] = (byte)v; b[o + 1] = (byte)(v >> 8); b[o + 2] = (byte)(v >> 16); b[o + 3] = (byte)(v >> 24); }
        static void P16(byte[] b, int o, short v) { b[o] = (byte)v; b[o + 1] = (byte)(v >> 8); }
    }
}
