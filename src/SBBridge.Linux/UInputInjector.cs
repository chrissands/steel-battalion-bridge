using System;
using System.Collections.Generic;
using SBBridge.Core;

namespace SBBridge.Linux
{
    /// <summary>Virtual keyboard + mouse via uinput (works on X11, Wayland and in Gaming Mode).</summary>
    public sealed class UInputInjector : IInputInjector, IDisposable
    {
        const ushort BTN_LEFT = 0x110, BTN_RIGHT = 0x111, BTN_MIDDLE = 0x112, BTN_SIDE = 0x113, BTN_EXTRA = 0x114;
        const ushort REL_X = 0x00, REL_Y = 0x01, REL_WHEEL = 0x08;

        UInputDevice dev;
        public string LastError { get; private set; }
        public bool IsReady { get { return dev != null; } }

        public bool Open()
        {
            string err;
            var d = UInputDevice.Open(out err);
            if (d == null) { LastError = err; return false; }
            try
            {
                d.EnableEvent(UInputDevice.EV_KEY);
                foreach (var code in LinuxKeyMap.AllEvdevCodes()) d.EnableKey(code);
                foreach (var b in new[] { BTN_LEFT, BTN_RIGHT, BTN_MIDDLE, BTN_SIDE, BTN_EXTRA }) d.EnableKey(b);
                d.EnableEvent(UInputDevice.EV_REL);
                d.EnableRel(REL_X); d.EnableRel(REL_Y); d.EnableRel(REL_WHEEL);
                d.Create(UInputDevice.BUS_VIRTUAL, 0x0A7B, 0xD001, 1, "Steel Battalion Bridge keyboard/mouse");
            }
            catch (Exception ex) { d.Dispose(); LastError = "Could not create virtual keyboard: " + ex.Message; return false; }
            dev = d; LastError = null;
            return true;
        }

        void Send(ushort type, ushort code, int value)
        {
            var d = dev; if (d == null) return;
            var b = new UInputDevice.Batch(); b.Add(type, code, value); b.Sync(); d.Write(b);
        }

        public void Key(KeyCode key, bool down)
        {
            int code = LinuxKeyMap.ToEvdev(key);
            if (code > 0) Send(UInputDevice.EV_KEY, (ushort)code, down ? 1 : 0);
        }

        public void MouseButton(MouseButtonId button, bool down)
        {
            ushort code;
            switch (button)
            {
                case MouseButtonId.Left: code = BTN_LEFT; break;
                case MouseButtonId.Right: code = BTN_RIGHT; break;
                case MouseButtonId.Middle: code = BTN_MIDDLE; break;
                case MouseButtonId.X1: code = BTN_SIDE; break;
                case MouseButtonId.X2: code = BTN_EXTRA; break;
                default: return;
            }
            Send(UInputDevice.EV_KEY, code, down ? 1 : 0);
        }

        public void Wheel(int notches) { if (notches != 0) Send(UInputDevice.EV_REL, REL_WHEEL, notches); }

        public void MouseMove(int dx, int dy)
        {
            var d = dev; if (d == null || (dx == 0 && dy == 0)) return;
            var b = new UInputDevice.Batch();
            if (dx != 0) b.Add(UInputDevice.EV_REL, REL_X, dx);
            if (dy != 0) b.Add(UInputDevice.EV_REL, REL_Y, dy);
            b.Sync(); d.Write(b);
        }

        public void Dispose() { if (dev != null) { dev.Dispose(); dev = null; } }
    }

    /// <summary>Windows virtual-key (KeyCode) to Linux evdev KEY_* codes.</summary>
    public static class LinuxKeyMap
    {
        static readonly Dictionary<KeyCode, int> map = new Dictionary<KeyCode, int>();

        static LinuxKeyMap()
        {
            void M(KeyCode k, int c) { map[k] = c; }
            M(KeyCode.Back, 14); M(KeyCode.Tab, 15); M(KeyCode.Enter, 28); M(KeyCode.ShiftKey, 42); M(KeyCode.ControlKey, 29);
            M(KeyCode.Menu, 56); M(KeyCode.Pause, 119); M(KeyCode.CapsLock, 58); M(KeyCode.Escape, 1); M(KeyCode.Space, 57);
            M(KeyCode.PageUp, 104); M(KeyCode.PageDown, 109); M(KeyCode.End, 107); M(KeyCode.Home, 102);
            M(KeyCode.Left, 105); M(KeyCode.Up, 103); M(KeyCode.Right, 106); M(KeyCode.Down, 108);
            M(KeyCode.PrintScreen, 99); M(KeyCode.Insert, 110); M(KeyCode.Delete, 111);
            M(KeyCode.D1, 2); M(KeyCode.D2, 3); M(KeyCode.D3, 4); M(KeyCode.D4, 5); M(KeyCode.D5, 6);
            M(KeyCode.D6, 7); M(KeyCode.D7, 8); M(KeyCode.D8, 9); M(KeyCode.D9, 10); M(KeyCode.D0, 11);
            int[] letters = { 30, 48, 46, 32, 18, 33, 34, 35, 23, 36, 37, 38, 50, 49, 24, 25, 16, 19, 31, 20, 22, 47, 17, 45, 21, 44 };
            for (int i = 0; i < 26; i++) M(KeyCode.A + i, letters[i]);
            M(KeyCode.LWin, 125); M(KeyCode.RWin, 126); M(KeyCode.Apps, 127);
            int[] numpad = { 82, 79, 80, 81, 75, 76, 77, 71, 72, 73 };
            for (int i = 0; i < 10; i++) M(KeyCode.NumPad0 + i, numpad[i]);
            M(KeyCode.Multiply, 55); M(KeyCode.Add, 78); M(KeyCode.Subtract, 74); M(KeyCode.Decimal, 83); M(KeyCode.Divide, 98);
            for (int i = 0; i < 10; i++) M(KeyCode.F1 + i, 59 + i);
            M(KeyCode.F11, 87); M(KeyCode.F12, 88);
            for (int i = 0; i < 12; i++) M(KeyCode.F13 + i, 183 + i);
            M(KeyCode.NumLock, 69); M(KeyCode.Scroll, 70);
            M(KeyCode.LShiftKey, 42); M(KeyCode.RShiftKey, 54); M(KeyCode.LControlKey, 29); M(KeyCode.RControlKey, 97);
            M(KeyCode.LMenu, 56); M(KeyCode.RMenu, 100);
            M(KeyCode.VolumeMute, 113); M(KeyCode.VolumeDown, 114); M(KeyCode.VolumeUp, 115);
            M(KeyCode.MediaNextTrack, 163); M(KeyCode.MediaPreviousTrack, 165); M(KeyCode.MediaStop, 166); M(KeyCode.MediaPlayPause, 164);
            M(KeyCode.OemSemicolon, 39); M(KeyCode.Oemplus, 13); M(KeyCode.Oemcomma, 51); M(KeyCode.OemMinus, 12);
            M(KeyCode.OemPeriod, 52); M(KeyCode.OemQuestion, 53); M(KeyCode.Oemtilde, 41); M(KeyCode.OemOpenBrackets, 26);
            M(KeyCode.OemPipe, 43); M(KeyCode.OemCloseBrackets, 27); M(KeyCode.OemQuotes, 40); M(KeyCode.OemBackslash, 86);
        }

        public static int ToEvdev(KeyCode k) { int c; return map.TryGetValue(k, out c) ? c : 0; }
        public static IEnumerable<int> AllEvdevCodes() { return new HashSet<int>(map.Values); }
        public static int Count { get { return map.Count; } }
    }
}
