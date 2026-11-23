using System;
using System.Collections.Generic;

namespace SBBridge.Core
{
    /// <summary>
    /// Platform-neutral keyboard keys. Values are Windows virtual-key codes (so the Windows
    /// backend can send them directly); the Linux backend maps them to evdev KEY_* codes.
    /// Names match System.Windows.Forms.Keys so existing profiles load unchanged.
    /// </summary>
    public enum KeyCode
    {
        None = 0,
        Back = 8, Tab = 9, Enter = 13, ShiftKey = 16, ControlKey = 17, Menu = 18, Pause = 19, CapsLock = 20,
        Escape = 27, Space = 32, PageUp = 33, PageDown = 34, End = 35, Home = 36,
        Left = 37, Up = 38, Right = 39, Down = 40, PrintScreen = 44, Insert = 45, Delete = 46,
        D0 = 48, D1, D2, D3, D4, D5, D6, D7, D8, D9,
        A = 65, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z,
        LWin = 91, RWin = 92, Apps = 93,
        NumPad0 = 96, NumPad1, NumPad2, NumPad3, NumPad4, NumPad5, NumPad6, NumPad7, NumPad8, NumPad9,
        Multiply = 106, Add = 107, Subtract = 109, Decimal = 110, Divide = 111,
        F1 = 112, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23, F24,
        NumLock = 144, Scroll = 145,
        LShiftKey = 160, RShiftKey = 161, LControlKey = 162, RControlKey = 163, LMenu = 164, RMenu = 165,
        VolumeMute = 173, VolumeDown = 174, VolumeUp = 175,
        MediaNextTrack = 176, MediaPreviousTrack = 177, MediaStop = 178, MediaPlayPause = 179,
        OemSemicolon = 186, Oemplus = 187, Oemcomma = 188, OemMinus = 189, OemPeriod = 190, OemQuestion = 191,
        Oemtilde = 192, OemOpenBrackets = 219, OemPipe = 220, OemCloseBrackets = 221, OemQuotes = 222, OemBackslash = 226
    }

    public static class KeyNames
    {
        static readonly Dictionary<string, KeyCode> aliases = new Dictionary<string, KeyCode>(StringComparer.OrdinalIgnoreCase)
        {
            { "Prior", KeyCode.PageUp }, { "Next", KeyCode.PageDown }, { "Return", KeyCode.Enter },
            { "Capital", KeyCode.CapsLock }, { "Snapshot", KeyCode.PrintScreen },
            { "Oem1", KeyCode.OemSemicolon }, { "Oem2", KeyCode.OemQuestion }, { "Oem3", KeyCode.Oemtilde },
            { "Oem4", KeyCode.OemOpenBrackets }, { "Oem5", KeyCode.OemPipe }, { "Oem6", KeyCode.OemCloseBrackets },
            { "Oem7", KeyCode.OemQuotes }, { "Oem102", KeyCode.OemBackslash },
            { "Alt", KeyCode.Menu }, { "Ctrl", KeyCode.ControlKey }, { "Shift", KeyCode.ShiftKey },
        };

        /// <summary>Parse a key name, accepting old WinForms aliases. Unknown names give None.</summary>
        public static KeyCode Parse(string s)
        {
            if (string.IsNullOrWhiteSpace(s)) return KeyCode.None;
            s = s.Trim();
            // WinForms flag combos like "Shift, D1": take the last non-modifier part.
            if (s.Contains(",")) { var parts = s.Split(','); s = parts[parts.Length - 1].Trim(); }
            KeyCode k;
            if (Enum.TryParse(s, true, out k) && Enum.IsDefined(typeof(KeyCode), k)) return k;
            if (aliases.TryGetValue(s, out k)) return k;
            int n; if (int.TryParse(s, out n) && Enum.IsDefined(typeof(KeyCode), n)) return (KeyCode)n;
            return KeyCode.None;
        }
    }
}
