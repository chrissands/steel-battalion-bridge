using System;
using SBBridge.Core;

namespace SBBridge.Linux
{
    /// <summary>
    /// Virtual wired Xbox 360 controller (045E:028E) with the same button/axis layout as the
    /// kernel's xpad driver, so Steam Input, SDL and games treat it like a real 360 pad.
    /// </summary>
    public sealed class UInputGamepad : IVirtualGamepad
    {
        const ushort BTN_A = 0x130, BTN_B = 0x131, BTN_X = 0x133, BTN_Y = 0x134, BTN_TL = 0x136, BTN_TR = 0x137,
                     BTN_SELECT = 0x13a, BTN_START = 0x13b, BTN_MODE = 0x13c, BTN_THUMBL = 0x13d, BTN_THUMBR = 0x13e;
        const ushort ABS_X = 0x00, ABS_Y = 0x01, ABS_Z = 0x02, ABS_RX = 0x03, ABS_RY = 0x04, ABS_RZ = 0x05, ABS_HAT0X = 0x10, ABS_HAT0Y = 0x11;

        static readonly ushort[] Buttons = { BTN_A, BTN_B, BTN_X, BTN_Y, BTN_TL, BTN_TR, BTN_SELECT, BTN_START, BTN_MODE, BTN_THUMBL, BTN_THUMBR };

        UInputDevice dev;
        public bool IsConnected { get { return dev != null; } }
        public string LastError { get; private set; }

        public bool Connect()
        {
            Disconnect();
            string err;
            var d = UInputDevice.Open(out err);
            if (d == null) { LastError = err; return false; }
            try
            {
                d.EnableEvent(UInputDevice.EV_KEY);
                foreach (var b in Buttons) d.EnableKey(b);
                d.EnableEvent(UInputDevice.EV_ABS);
                d.EnableAbs(ABS_X, -32768, 32767, 16, 128);
                d.EnableAbs(ABS_Y, -32768, 32767, 16, 128);
                d.EnableAbs(ABS_RX, -32768, 32767, 16, 128);
                d.EnableAbs(ABS_RY, -32768, 32767, 16, 128);
                d.EnableAbs(ABS_Z, 0, 255, 0, 0);
                d.EnableAbs(ABS_RZ, 0, 255, 0, 0);
                d.EnableAbs(ABS_HAT0X, -1, 1, 0, 0);
                d.EnableAbs(ABS_HAT0Y, -1, 1, 0, 0);
                d.Create(UInputDevice.BUS_USB, 0x045E, 0x028E, 0x0110, "Microsoft X-Box 360 pad");
            }
            catch (Exception ex) { d.Dispose(); LastError = "Could not create virtual pad: " + ex.Message; return false; }
            dev = d; LastError = null;
            return true;
        }

        /// <summary>Converts an XInput-style report to evdev events (exposed for tests).</summary>
        public static UInputDevice.Batch ToEvents(PadReport r)
        {
            var b = new UInputDevice.Batch();
            ushort w = r.Buttons;
            Key(b, BTN_A, w, 0x1000); Key(b, BTN_B, w, 0x2000); Key(b, BTN_X, w, 0x4000); Key(b, BTN_Y, w, 0x8000);
            Key(b, BTN_TL, w, 0x0100); Key(b, BTN_TR, w, 0x0200);
            Key(b, BTN_SELECT, w, 0x0020); Key(b, BTN_START, w, 0x0010); Key(b, BTN_MODE, w, 0x0400);
            Key(b, BTN_THUMBL, w, 0x0040); Key(b, BTN_THUMBR, w, 0x0080);
            b.Add(UInputDevice.EV_ABS, ABS_X, r.LX);
            b.Add(UInputDevice.EV_ABS, ABS_Y, ~r.LY);   // evdev Y grows downward (xpad does the same)
            b.Add(UInputDevice.EV_ABS, ABS_RX, r.RX);
            b.Add(UInputDevice.EV_ABS, ABS_RY, ~r.RY);
            b.Add(UInputDevice.EV_ABS, ABS_Z, r.LeftTrigger);
            b.Add(UInputDevice.EV_ABS, ABS_RZ, r.RightTrigger);
            int hx = ((w & 0x0008) != 0 ? 1 : 0) - ((w & 0x0004) != 0 ? 1 : 0);
            int hy = ((w & 0x0002) != 0 ? 1 : 0) - ((w & 0x0001) != 0 ? 1 : 0);
            b.Add(UInputDevice.EV_ABS, ABS_HAT0X, hx);
            b.Add(UInputDevice.EV_ABS, ABS_HAT0Y, hy);
            b.Sync();
            return b;
        }

        static void Key(UInputDevice.Batch b, ushort code, ushort w, int mask) { b.Add(UInputDevice.EV_KEY, code, (w & mask) != 0 ? 1 : 0); }

        public bool Submit(PadReport r)
        {
            var d = dev;
            if (d == null) return false;
            if (d.Write(ToEvents(r))) return true;
            LastError = "Virtual pad write failed.";
            return false;
        }

        public void Disconnect() { if (dev != null) { dev.Dispose(); dev = null; } }
        public void Dispose() { Disconnect(); }
    }
}
