using System;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using SBBridge.Core;

namespace SBBridge.Platform.Windows
{
    /// <summary>Keyboard/mouse via SendInput, using hardware scan codes so DirectInput/raw-input games see them.</summary>
    public sealed class SendInputInjector : IInputInjector
    {
        static readonly int Size = Marshal.SizeOf(typeof(Native.INPUT));

        static bool IsExtended(Keys k)
        {
            switch (k)
            {
                case Keys.Insert: case Keys.Delete: case Keys.Home: case Keys.End: case Keys.PageUp: case Keys.PageDown:
                case Keys.Left: case Keys.Right: case Keys.Up: case Keys.Down: case Keys.NumLock: case Keys.Divide:
                case Keys.RControlKey: case Keys.RMenu: case Keys.LWin: case Keys.RWin: case Keys.Apps:
                case Keys.PrintScreen: case Keys.BrowserBack: case Keys.BrowserForward: case Keys.VolumeUp:
                case Keys.VolumeDown: case Keys.VolumeMute: case Keys.MediaPlayPause: case Keys.MediaNextTrack: case Keys.MediaPreviousTrack:
                    return true;
            }
            return false;
        }

        public void Key(Keys key, bool down)
        {
            var k = key & Keys.KeyCode;
            uint scan = Native.MapVirtualKey((uint)k, 0);
            var inp = new Native.INPUT { type = Native.INPUT_KEYBOARD };
            inp.u.ki.wVk = scan == 0 ? (ushort)k : (ushort)0;
            inp.u.ki.wScan = (ushort)scan;
            inp.u.ki.dwFlags = (scan != 0 ? Native.KEYEVENTF_SCANCODE : 0) | (IsExtended(k) ? Native.KEYEVENTF_EXTENDEDKEY : 0) | (down ? 0 : Native.KEYEVENTF_KEYUP);
            Native.SendInput(1, new[] { inp }, Size);
        }

        public void MouseButton(MouseButtonId b, bool down)
        {
            var inp = new Native.INPUT { type = Native.INPUT_MOUSE };
            switch (b)
            {
                case MouseButtonId.Left: inp.u.mi.dwFlags = down ? Native.MOUSEEVENTF_LEFTDOWN : Native.MOUSEEVENTF_LEFTUP; break;
                case MouseButtonId.Right: inp.u.mi.dwFlags = down ? Native.MOUSEEVENTF_RIGHTDOWN : Native.MOUSEEVENTF_RIGHTUP; break;
                case MouseButtonId.Middle: inp.u.mi.dwFlags = down ? Native.MOUSEEVENTF_MIDDLEDOWN : Native.MOUSEEVENTF_MIDDLEUP; break;
                case MouseButtonId.X1: inp.u.mi.dwFlags = down ? Native.MOUSEEVENTF_XDOWN : Native.MOUSEEVENTF_XUP; inp.u.mi.mouseData = 1; break;
                case MouseButtonId.X2: inp.u.mi.dwFlags = down ? Native.MOUSEEVENTF_XDOWN : Native.MOUSEEVENTF_XUP; inp.u.mi.mouseData = 2; break;
                default: return;
            }
            Native.SendInput(1, new[] { inp }, Size);
        }

        public void Wheel(int notches)
        {
            if (notches == 0) return;
            var inp = new Native.INPUT { type = Native.INPUT_MOUSE };
            inp.u.mi.dwFlags = Native.MOUSEEVENTF_WHEEL;
            inp.u.mi.mouseData = unchecked((uint)(notches * 120));
            Native.SendInput(1, new[] { inp }, Size);
        }

        public void MouseMove(int dx, int dy)
        {
            if (dx == 0 && dy == 0) return;
            var inp = new Native.INPUT { type = Native.INPUT_MOUSE };
            inp.u.mi.dx = dx; inp.u.mi.dy = dy; inp.u.mi.dwFlags = Native.MOUSEEVENTF_MOVE;
            Native.SendInput(1, new[] { inp }, Size);
        }
    }
}
