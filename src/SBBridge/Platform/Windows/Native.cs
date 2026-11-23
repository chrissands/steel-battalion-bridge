using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using Microsoft.Win32;
using Microsoft.Win32.SafeHandles;

namespace SBBridge.Platform.Windows
{
    public static class Native
    {
        // ---------------- kernel32 ----------------
        public const uint GENERIC_READ = 0x80000000, GENERIC_WRITE = 0x40000000;
        public const uint FILE_SHARE_READ = 1, FILE_SHARE_WRITE = 2, OPEN_EXISTING = 3;
        public const uint FILE_ATTRIBUTE_NORMAL = 0x80, FILE_FLAG_OVERLAPPED = 0x40000000;

        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        public static extern SafeFileHandle CreateFile(string name, uint access, uint share, IntPtr sa, uint creation, uint flags, IntPtr template);

        [DllImport("kernel32.dll", SetLastError = true)]
        public static extern bool DeviceIoControl(SafeFileHandle h, uint code, byte[] inBuf, int inSize, byte[] outBuf, int outSize, out int returned, IntPtr overlapped);

        [DllImport("winmm.dll")] public static extern uint timeBeginPeriod(uint ms);
        [DllImport("winmm.dll")] public static extern uint timeEndPeriod(uint ms);

        // ---------------- setupapi ----------------
        public const int DIGCF_PRESENT = 0x2, DIGCF_ALLCLASSES = 0x4, DIGCF_DEVICEINTERFACE = 0x10;
        public const int DICS_FLAG_GLOBAL = 1, DIREG_DEV = 1, KEY_READ = 0x20019;

        [StructLayout(LayoutKind.Sequential)]
        public struct SP_DEVINFO_DATA { public int cbSize; public Guid ClassGuid; public int DevInst; public IntPtr Reserved; }

        [StructLayout(LayoutKind.Sequential)]
        public struct SP_DEVICE_INTERFACE_DATA { public int cbSize; public Guid InterfaceClassGuid; public int Flags; public IntPtr Reserved; }

        [DllImport("setupapi.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        public static extern IntPtr SetupDiGetClassDevs(ref Guid classGuid, string enumerator, IntPtr hwnd, int flags);
        [DllImport("setupapi.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        public static extern IntPtr SetupDiGetClassDevs(IntPtr classGuid, string enumerator, IntPtr hwnd, int flags);
        [DllImport("setupapi.dll", SetLastError = true)]
        public static extern bool SetupDiEnumDeviceInfo(IntPtr set, int index, ref SP_DEVINFO_DATA data);
        [DllImport("setupapi.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        public static extern bool SetupDiGetDeviceInstanceId(IntPtr set, ref SP_DEVINFO_DATA data, StringBuilder id, int size, out int required);
        [DllImport("setupapi.dll", SetLastError = true)]
        public static extern IntPtr SetupDiOpenDevRegKey(IntPtr set, ref SP_DEVINFO_DATA data, int scope, int hwProfile, int keyType, int samDesired);
        [DllImport("setupapi.dll", SetLastError = true)]
        public static extern bool SetupDiEnumDeviceInterfaces(IntPtr set, IntPtr devInfo, ref Guid guid, int index, ref SP_DEVICE_INTERFACE_DATA data);
        [DllImport("setupapi.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        public static extern bool SetupDiGetDeviceInterfaceDetail(IntPtr set, ref SP_DEVICE_INTERFACE_DATA data, IntPtr detail, int size, out int required, IntPtr devInfo);
        [DllImport("setupapi.dll", SetLastError = true)]
        public static extern bool SetupDiDestroyDeviceInfoList(IntPtr set);

        static readonly IntPtr INVALID = new IntPtr(-1);

        /// <summary>Device paths of all present interfaces of a class GUID.</summary>
        public static List<string> InterfacePaths(Guid guid)
        {
            var result = new List<string>();
            IntPtr set = SetupDiGetClassDevs(ref guid, null, IntPtr.Zero, DIGCF_PRESENT | DIGCF_DEVICEINTERFACE);
            if (set == INVALID) return result;
            try
            {
                var ifd = new SP_DEVICE_INTERFACE_DATA(); ifd.cbSize = Marshal.SizeOf(ifd);
                for (int i = 0; SetupDiEnumDeviceInterfaces(set, IntPtr.Zero, ref guid, i, ref ifd); i++)
                {
                    int req;
                    SetupDiGetDeviceInterfaceDetail(set, ref ifd, IntPtr.Zero, 0, out req, IntPtr.Zero);
                    if (req <= 0) continue;
                    IntPtr buf = Marshal.AllocHGlobal(req);
                    try
                    {
                        Marshal.WriteInt32(buf, IntPtr.Size == 8 ? 8 : 6); // cbSize of SP_DEVICE_INTERFACE_DETAIL_DATA_W
                        if (SetupDiGetDeviceInterfaceDetail(set, ref ifd, buf, req, out req, IntPtr.Zero))
                            result.Add(Marshal.PtrToStringUni(new IntPtr(buf.ToInt64() + 4)));
                    }
                    finally { Marshal.FreeHGlobal(buf); }
                }
            }
            finally { SetupDiDestroyDeviceInfoList(set); }
            return result;
        }

        /// <summary>
        /// For present USB devices matching the hardware-id fragment, read the DeviceInterfaceGUID(s)
        /// that their function driver (WinUSB via Zadig/INF) registered.
        /// </summary>
        public static List<Guid> RegisteredInterfaceGuids(string idFragment, out bool devicePresent)
        {
            devicePresent = false;
            var guids = new List<Guid>();
            IntPtr set = SetupDiGetClassDevs(IntPtr.Zero, "USB", IntPtr.Zero, DIGCF_PRESENT | DIGCF_ALLCLASSES);
            if (set == INVALID) return guids;
            try
            {
                var dev = new SP_DEVINFO_DATA(); dev.cbSize = Marshal.SizeOf(dev);
                var sb = new StringBuilder(512);
                for (int i = 0; SetupDiEnumDeviceInfo(set, i, ref dev); i++)
                {
                    int req;
                    if (!SetupDiGetDeviceInstanceId(set, ref dev, sb, sb.Capacity, out req)) continue;
                    if (sb.ToString().ToUpperInvariant().IndexOf(idFragment, StringComparison.Ordinal) < 0) continue;
                    devicePresent = true;
                    IntPtr hkey = SetupDiOpenDevRegKey(set, ref dev, DICS_FLAG_GLOBAL, 0, DIREG_DEV, KEY_READ);
                    if (hkey == INVALID || hkey == IntPtr.Zero) continue;
                    using (var key = RegistryKey.FromHandle(new SafeRegistryHandle(hkey, true)))
                    {
                        foreach (var name in new[] { "DeviceInterfaceGUIDs", "DeviceInterfaceGUID" })
                        {
                            object v = key.GetValue(name);
                            var arr = v as string[];
                            if (arr == null && v is string) arr = new[] { (string)v };
                            if (arr == null) continue;
                            foreach (var s in arr) { Guid g; if (Guid.TryParse(s, out g) && !guids.Contains(g)) guids.Add(g); }
                        }
                    }
                }
            }
            finally { SetupDiDestroyDeviceInfoList(set); }
            return guids;
        }

        // ---------------- winusb ----------------
        public const uint PIPE_TRANSFER_TIMEOUT = 0x03;
        public const int ERROR_SEM_TIMEOUT = 121, ERROR_IO_PENDING = 997, ERROR_OPERATION_ABORTED = 995;

        [StructLayout(LayoutKind.Sequential, Pack = 1)]
        public struct USB_INTERFACE_DESCRIPTOR
        {
            public byte bLength, bDescriptorType, bInterfaceNumber, bAlternateSetting, bNumEndpoints,
                        bInterfaceClass, bInterfaceSubClass, bInterfaceProtocol, iInterface;
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct WINUSB_PIPE_INFORMATION { public int PipeType; public byte PipeId; public ushort MaximumPacketSize; public byte Interval; }

        [DllImport("winusb.dll", SetLastError = true)] public static extern bool WinUsb_Initialize(SafeFileHandle h, out IntPtr iface);
        [DllImport("winusb.dll", SetLastError = true)] public static extern bool WinUsb_Free(IntPtr iface);
        [DllImport("winusb.dll", SetLastError = true)] public static extern bool WinUsb_QueryInterfaceSettings(IntPtr iface, byte alt, out USB_INTERFACE_DESCRIPTOR d);
        [DllImport("winusb.dll", SetLastError = true)] public static extern bool WinUsb_QueryPipe(IntPtr iface, byte alt, byte index, out WINUSB_PIPE_INFORMATION p);
        [DllImport("winusb.dll", SetLastError = true)] public static extern bool WinUsb_SetPipePolicy(IntPtr iface, byte pipe, uint policy, uint len, ref uint value);
        [DllImport("winusb.dll", SetLastError = true)] public static extern bool WinUsb_ReadPipe(IntPtr iface, byte pipe, byte[] buf, int len, out int transferred, IntPtr ov);
        [DllImport("winusb.dll", SetLastError = true)] public static extern bool WinUsb_WritePipe(IntPtr iface, byte pipe, byte[] buf, int len, out int transferred, IntPtr ov);
        [DllImport("winusb.dll", SetLastError = true)] public static extern bool WinUsb_AbortPipe(IntPtr iface, byte pipe);
        [DllImport("winusb.dll", SetLastError = true)] public static extern bool WinUsb_FlushPipe(IntPtr iface, byte pipe);

        // ---------------- user32 input ----------------
        public const int INPUT_MOUSE = 0, INPUT_KEYBOARD = 1;
        public const uint KEYEVENTF_EXTENDEDKEY = 0x1, KEYEVENTF_KEYUP = 0x2, KEYEVENTF_SCANCODE = 0x8;
        public const uint MOUSEEVENTF_MOVE = 0x1, MOUSEEVENTF_LEFTDOWN = 0x2, MOUSEEVENTF_LEFTUP = 0x4,
            MOUSEEVENTF_RIGHTDOWN = 0x8, MOUSEEVENTF_RIGHTUP = 0x10, MOUSEEVENTF_MIDDLEDOWN = 0x20, MOUSEEVENTF_MIDDLEUP = 0x40,
            MOUSEEVENTF_XDOWN = 0x80, MOUSEEVENTF_XUP = 0x100, MOUSEEVENTF_WHEEL = 0x800;

        [StructLayout(LayoutKind.Sequential)]
        public struct MOUSEINPUT { public int dx, dy; public uint mouseData, dwFlags, time; public IntPtr dwExtraInfo; }
        [StructLayout(LayoutKind.Sequential)]
        public struct KEYBDINPUT { public ushort wVk, wScan; public uint dwFlags, time; public IntPtr dwExtraInfo; }
        [StructLayout(LayoutKind.Explicit)]
        public struct InputUnion { [FieldOffset(0)] public MOUSEINPUT mi; [FieldOffset(0)] public KEYBDINPUT ki; }
        [StructLayout(LayoutKind.Sequential)]
        public struct INPUT { public int type; public InputUnion u; }

        [DllImport("user32.dll", SetLastError = true)] public static extern uint SendInput(uint n, INPUT[] inputs, int size);
        [DllImport("user32.dll")] public static extern uint MapVirtualKey(uint code, uint mapType);
    }
}
