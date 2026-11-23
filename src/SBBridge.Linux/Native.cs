using System;
using System.Runtime.InteropServices;

namespace SBBridge.Linux
{
    static class LibC
    {
        public const int O_WRONLY = 1, O_NONBLOCK = 0x800, O_CLOEXEC = 0x80000;
        [DllImport("libc", SetLastError = true)] public static extern int open(string path, int flags);
        [DllImport("libc", SetLastError = true)] public static extern int close(int fd);
        [DllImport("libc", SetLastError = true)] public static extern IntPtr write(int fd, byte[] buf, IntPtr count);
        [DllImport("libc", SetLastError = true)] public static extern int ioctl(int fd, ulong request);
        [DllImport("libc", SetLastError = true)] public static extern int ioctl(int fd, ulong request, int arg);
        [DllImport("libc", SetLastError = true)] public static extern int ioctl(int fd, ulong request, byte[] arg);
        [DllImport("libc")] public static extern IntPtr strerror(int errnum);
        public static string Err(int errno) { return Marshal.PtrToStringAnsi(strerror(errno)) + " (errno " + errno + ")"; }
    }

    static class LibUsb
    {
        const string Lib = "libusb-1.0.so.0";
        public const int SUCCESS = 0, ERROR_IO = -1, ERROR_ACCESS = -3, ERROR_NO_DEVICE = -4, ERROR_BUSY = -6,
                         ERROR_TIMEOUT = -7, ERROR_OVERFLOW = -8, ERROR_PIPE = -9, ERROR_INTERRUPTED = -10;
        [DllImport(Lib)] public static extern int libusb_init(out IntPtr ctx);
        [DllImport(Lib)] public static extern void libusb_exit(IntPtr ctx);
        [DllImport(Lib)] public static extern IntPtr libusb_get_device_list(IntPtr ctx, out IntPtr list);
        [DllImport(Lib)] public static extern void libusb_free_device_list(IntPtr list, int unrefDevices);
        [DllImport(Lib)] public static extern int libusb_get_device_descriptor(IntPtr dev, byte[] desc);
        [DllImport(Lib)] public static extern int libusb_open(IntPtr dev, out IntPtr handle);
        [DllImport(Lib)] public static extern void libusb_close(IntPtr handle);
        [DllImport(Lib)] public static extern int libusb_set_auto_detach_kernel_driver(IntPtr handle, int enable);
        [DllImport(Lib)] public static extern int libusb_claim_interface(IntPtr handle, int iface);
        [DllImport(Lib)] public static extern int libusb_release_interface(IntPtr handle, int iface);
        [DllImport(Lib)] public static extern int libusb_interrupt_transfer(IntPtr handle, byte endpoint, byte[] data, int length, out int transferred, uint timeout);
        [DllImport(Lib)] public static extern IntPtr libusb_strerror(int code);
        public static string Err(int code) { try { return Marshal.PtrToStringAnsi(libusb_strerror(code)) + " (" + code + ")"; } catch { return "libusb error " + code; } }
    }
}
