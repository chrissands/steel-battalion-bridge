using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;
using SBBridge.Core;

namespace SBBridge.Platform.Windows
{
    /// <summary>
    /// Talks to the controller through WinUSB (Microsoft's inbox, signed generic USB driver).
    /// The controller must have WinUSB bound to it - see README (Device Manager or Zadig).
    /// </summary>
    public sealed class WinUsbTransport : IControllerTransport
    {
        // Standard USB device interface class (every USB device exposes this).
        static readonly Guid GUID_DEVINTERFACE_USB_DEVICE = new Guid("A5DCBF10-6530-11D2-901F-00C04FB951ED");
        // GUID used by our own optional INF.
        public static readonly Guid SbBridgeInterfaceGuid = new Guid("5B1E7A11-0A7B-4D00-9C2B-5BB1D6E0D000");
        const string IdFragment = "VID_0A7B&PID_D000";

        SafeFileHandle file;
        IntPtr winusb = IntPtr.Zero;
        byte inPipe = Sbc.InEndpoint, outPipe = Sbc.OutEndpoint;
        uint currentTimeout = 0;
        readonly object writeLock = new object();

        public bool IsOpen { get { return winusb != IntPtr.Zero; } }
        public string LastError { get; private set; }
        public bool DevicePresent { get; private set; }

        public bool TryOpen()
        {
            Close();
            bool present;
            var guids = Native.RegisteredInterfaceGuids(IdFragment, out present);
            DevicePresent = present;
            if (!present) { LastError = "Controller not detected on USB. Check the cable / adapter."; return false; }
            guids.Add(SbBridgeInterfaceGuid);
            guids.Add(GUID_DEVINTERFACE_USB_DEVICE);

            int lastWin32 = 0;
            foreach (var g in guids)
            {
                foreach (var path in Native.InterfacePaths(g))
                {
                    if (path.ToUpperInvariant().IndexOf(IdFragment, StringComparison.Ordinal) < 0) continue;
                    var h = Native.CreateFile(path, Native.GENERIC_READ | Native.GENERIC_WRITE,
                        Native.FILE_SHARE_READ | Native.FILE_SHARE_WRITE, IntPtr.Zero, Native.OPEN_EXISTING,
                        Native.FILE_ATTRIBUTE_NORMAL | Native.FILE_FLAG_OVERLAPPED, IntPtr.Zero);
                    if (h.IsInvalid) { lastWin32 = Marshal.GetLastWin32Error(); continue; }
                    IntPtr iface;
                    if (!Native.WinUsb_Initialize(h, out iface)) { lastWin32 = Marshal.GetLastWin32Error(); h.Dispose(); continue; }
                    file = h; winusb = iface;
                    DiscoverPipes();
                    LastError = null;
                    return true;
                }
            }
            LastError = "Controller found, but WinUSB isn't bound to it (Win32 error " + lastWin32 +
                        "). Install the WinUSB driver for it - see README, step 1.";
            return false;
        }

        void DiscoverPipes()
        {
            Native.USB_INTERFACE_DESCRIPTOR d;
            if (!Native.WinUsb_QueryInterfaceSettings(winusb, 0, out d)) return;
            for (byte i = 0; i < d.bNumEndpoints; i++)
            {
                Native.WINUSB_PIPE_INFORMATION p;
                if (!Native.WinUsb_QueryPipe(winusb, 0, i, out p)) continue;
                if (p.PipeType != 3) continue; // interrupt
                if ((p.PipeId & 0x80) != 0) inPipe = p.PipeId; else outPipe = p.PipeId;
            }
            uint t = 100;
            Native.WinUsb_SetPipePolicy(winusb, outPipe, Native.PIPE_TRANSFER_TIMEOUT, 4, ref t);
            Native.WinUsb_FlushPipe(winusb, inPipe);
            currentTimeout = 0;
        }

        public int Read(byte[] buffer, int timeoutMs)
        {
            IntPtr h = winusb;
            if (h == IntPtr.Zero) return -1;
            if (currentTimeout != (uint)timeoutMs)
            {
                uint t = (uint)timeoutMs;
                Native.WinUsb_SetPipePolicy(h, inPipe, Native.PIPE_TRANSFER_TIMEOUT, 4, ref t);
                currentTimeout = t;
            }
            int n;
            if (Native.WinUsb_ReadPipe(h, inPipe, buffer, buffer.Length, out n, IntPtr.Zero)) return n;
            int err = Marshal.GetLastWin32Error();
            if (err == Native.ERROR_SEM_TIMEOUT) return 0;
            LastError = "USB read failed (Win32 error " + err + ")";
            return -1;
        }

        public bool Write(byte[] data)
        {
            lock (writeLock)
            {
                IntPtr h = winusb;
                if (h == IntPtr.Zero) return false;
                int n;
                return Native.WinUsb_WritePipe(h, outPipe, data, data.Length, out n, IntPtr.Zero);
            }
        }

        public void Close()
        {
            IntPtr h = winusb;
            if (h != IntPtr.Zero)
            {
                Native.WinUsb_AbortPipe(h, inPipe);
                lock (writeLock) { winusb = IntPtr.Zero; Native.WinUsb_Free(h); }
            }
            if (file != null) { file.Dispose(); file = null; }
        }

        public void Dispose() { Close(); }
    }
}
