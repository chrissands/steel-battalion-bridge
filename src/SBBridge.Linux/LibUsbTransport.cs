using System;
using System.Runtime.InteropServices;
using SBBridge.Core;

namespace SBBridge.Linux
{
    /// <summary>Controller access through libusb-1.0 (present on Bazzite/SteamOS/Fedora/Ubuntu).</summary>
    public sealed class LibUsbTransport : IControllerTransport
    {
        IntPtr ctx = IntPtr.Zero, handle = IntPtr.Zero;
        readonly object writeLock = new object();

        public bool IsOpen { get { return handle != IntPtr.Zero; } }
        public string LastError { get; private set; }

        public bool TryOpen()
        {
            Close();
            try
            {
                if (ctx == IntPtr.Zero && LibUsb.libusb_init(out ctx) != 0) { ctx = IntPtr.Zero; LastError = "libusb could not start."; return false; }
            }
            catch (DllNotFoundException) { LastError = "libusb-1.0 is not installed (package libusb1 / libusb-1.0-0)."; return false; }

            IntPtr list;
            long n = LibUsb.libusb_get_device_list(ctx, out list).ToInt64();
            if (n < 0) { LastError = "Could not list USB devices: " + LibUsb.Err((int)n); return false; }
            try
            {
                var desc = new byte[18];
                for (int i = 0; i < n; i++)
                {
                    IntPtr dev = Marshal.ReadIntPtr(list, i * IntPtr.Size);
                    if (LibUsb.libusb_get_device_descriptor(dev, desc) != 0) continue;
                    int vid = desc[8] | (desc[9] << 8), pid = desc[10] | (desc[11] << 8);
                    if (vid != Sbc.VendorId || pid != Sbc.ProductId) continue;

                    IntPtr h;
                    int rc = LibUsb.libusb_open(dev, out h);
                    if (rc == LibUsb.ERROR_ACCESS) { LastError = "Controller found but permission denied. Run the installer's udev setup (install.sh) and replug the controller."; return false; }
                    if (rc != 0) { LastError = "Could not open controller: " + LibUsb.Err(rc); return false; }
                    LibUsb.libusb_set_auto_detach_kernel_driver(h, 1);
                    rc = LibUsb.libusb_claim_interface(h, 0);
                    if (rc != 0)
                    {
                        LibUsb.libusb_close(h);
                        LastError = rc == LibUsb.ERROR_BUSY ? "Controller is in use by another program." : "Could not claim controller: " + LibUsb.Err(rc);
                        return false;
                    }
                    handle = h; LastError = null;
                    return true;
                }
            }
            finally { LibUsb.libusb_free_device_list(list, 1); }
            LastError = "Controller not detected on USB. Check the cable / adapter.";
            return false;
        }

        public int Read(byte[] buffer, int timeoutMs)
        {
            IntPtr h = handle;
            if (h == IntPtr.Zero) return -1;
            int got;
            int rc = LibUsb.libusb_interrupt_transfer(h, Sbc.InEndpoint, buffer, buffer.Length, out got, (uint)timeoutMs);
            if (rc == 0 || (rc == LibUsb.ERROR_TIMEOUT && got > 0)) return got;
            if (rc == LibUsb.ERROR_TIMEOUT || rc == LibUsb.ERROR_INTERRUPTED || rc == LibUsb.ERROR_OVERFLOW) return 0;
            LastError = rc == LibUsb.ERROR_NO_DEVICE ? "Controller unplugged." : "USB read failed: " + LibUsb.Err(rc);
            return -1;
        }

        public bool Write(byte[] data)
        {
            lock (writeLock)
            {
                IntPtr h = handle;
                if (h == IntPtr.Zero) return false;
                int sent;
                return LibUsb.libusb_interrupt_transfer(h, Sbc.OutEndpoint, data, data.Length, out sent, 100) == 0;
            }
        }

        public void Close()
        {
            IntPtr h = handle;
            if (h == IntPtr.Zero) return;
            lock (writeLock) { handle = IntPtr.Zero; }
            LibUsb.libusb_release_interface(h, 0);
            LibUsb.libusb_close(h);
        }

        public void Dispose()
        {
            Close();
            if (ctx != IntPtr.Zero) { LibUsb.libusb_exit(ctx); ctx = IntPtr.Zero; }
        }
    }
}
