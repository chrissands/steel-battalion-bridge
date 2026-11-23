using System.Collections.Generic;
using System.Windows.Forms;

namespace SBBridge.Core
{
    /// <summary>Built-in starting profiles. Everything is editable in the Bindings tab.</summary>
    public static class DefaultProfiles
    {
        static Binding Pad(ControlId c, XboxButton b, string note = "") { return new Binding { Control = c, Output = OutputKind.XboxButton, XboxButton = b, Note = note }; }
        static Binding Stick(ControlId c, XboxAxis a, bool invert = false, string note = "") { return new Binding { Control = c, Output = OutputKind.XboxAxis, XboxAxis = a, Invert = invert, Note = note }; }
        static Binding Dir(ControlId c, AxisDirection d, XboxButton b, string note = "") { return new Binding { Control = c, Output = OutputKind.XboxButton, XboxButton = b, Direction = d, Threshold = 0.5, Note = note }; }
        static Binding Key(ControlId c, Keys k, ButtonMode m = ButtonMode.Hold, string note = "") { return new Binding { Control = c, Output = OutputKind.Key, Key = k, Mode = m, Note = note }; }

        /// <summary>
        /// Cockpit-style Xbox layout. The core flight controls ride on the virtual Xbox pad
        /// (so Steam Input / XInput see them); the extra cockpit buttons go to keys you bind in-game.
        /// </summary>
        public static Profile Cockpit()
        {
            var p = new Profile { Name = "Cockpit - Xbox + keys" };
            var b = p.Bindings;
            // Analog
            b.Add(Stick(ControlId.AimingX, XboxAxis.RightStickX, false, "Aim / torso twist"));
            b.Add(Stick(ControlId.AimingY, XboxAxis.RightStickY, true, "Aim pitch - flip Invert if backwards"));
            b.Add(Stick(ControlId.RotationLever, XboxAxis.LeftStickX, false, "Turn / leg rotation"));
            b.Add(Stick(ControlId.GearAxis, XboxAxis.LeftStickY, false, "Gear lever as throttle: R=back, N=stop, 5=full"));
            b.Add(Stick(ControlId.RightPedal, XboxAxis.RightTrigger, false, "Accelerator"));
            b.Add(Stick(ControlId.MiddlePedal, XboxAxis.LeftTrigger, false, "Brake"));
            b.Add(new Binding { Control = ControlId.LeftPedal, Output = OutputKind.XboxButton, XboxButton = XboxButton.LeftStickClick, Threshold = 0.5, Note = "Slide pedal = boost / jump jets" });
            // Sight change thumbstick -> D-pad
            b.Add(Dir(ControlId.SightChangeY, AxisDirection.Negative, XboxButton.DPadUp));
            b.Add(Dir(ControlId.SightChangeY, AxisDirection.Positive, XboxButton.DPadDown));
            b.Add(Dir(ControlId.SightChangeX, AxisDirection.Negative, XboxButton.DPadLeft));
            b.Add(Dir(ControlId.SightChangeX, AxisDirection.Positive, XboxButton.DPadRight));
            // Weapons
            b.Add(Pad(ControlId.MainWeapon, XboxButton.RightBumper, "Fire weapon group 1"));
            b.Add(Pad(ControlId.Fire, XboxButton.LeftBumper, "Fire weapon group 2"));
            b.Add(Pad(ControlId.LockOn, XboxButton.Y, "Target"));
            b.Add(Pad(ControlId.LeftJoySightChange, XboxButton.RightStickClick, "Zoom / view"));
            b.Add(Pad(ControlId.WeaponConMain, XboxButton.X, "Cycle weapon / group"));
            b.Add(Pad(ControlId.WeaponConSub, XboxButton.B));
            b.Add(Pad(ControlId.WeaponConMagazine, XboxButton.A));
            b.Add(Pad(ControlId.Start, XboxButton.Start, "Pause / menu"));
            b.Add(Pad(ControlId.MultiMonModeSelect, XboxButton.Back, "Map / view"));
            b.Add(Pad(ControlId.Eject, XboxButton.Guide, "Steam / Guide button"));
            // Everything else -> keys (bind these in-game)
            b.Add(Key(ControlId.Ignition, Keys.P, ButtonMode.Hold, "Power / shutdown"));
            b.Add(Key(ControlId.CockpitHatch, Keys.Home));
            b.Add(Key(ControlId.MultiMonOpenClose, Keys.M, ButtonMode.Hold, "Map"));
            b.Add(Key(ControlId.MultiMonMapZoom, Keys.PageUp));
            b.Add(Key(ControlId.MultiMonSubMonitor, Keys.NumPad0));
            b.Add(Key(ControlId.MainMonZoomIn, Keys.Add));
            b.Add(Key(ControlId.MainMonZoomOut, Keys.Subtract));
            b.Add(Key(ControlId.FunctionFSS, Keys.NumPad1));
            b.Add(Key(ControlId.FunctionManipulator, Keys.NumPad2));
            b.Add(Key(ControlId.FunctionLineColorChange, Keys.NumPad3));
            b.Add(Key(ControlId.FunctionTankDetach, Keys.NumPad4));
            b.Add(Key(ControlId.FunctionOverride, Keys.NumPad5, ButtonMode.Hold, "Heat override"));
            b.Add(Key(ControlId.FunctionNightScope, Keys.N, ButtonMode.Hold, "Night vision"));
            b.Add(Key(ControlId.Washing, Keys.NumPad7));
            b.Add(Key(ControlId.Extinguisher, Keys.NumPad8, ButtonMode.Hold, "Coolant flush"));
            b.Add(Key(ControlId.Chaff, Keys.NumPad9));
            b.Add(Key(ControlId.FunctionF1, Keys.F1));
            b.Add(Key(ControlId.FunctionF2, Keys.F2));
            b.Add(Key(ControlId.FunctionF3, Keys.F3));
            b.Add(Key(ControlId.Comm1, Keys.D1, ButtonMode.Hold, "Weapon group / lance orders"));
            b.Add(Key(ControlId.Comm2, Keys.D2));
            b.Add(Key(ControlId.Comm3, Keys.D3));
            b.Add(Key(ControlId.Comm4, Keys.D4));
            b.Add(Key(ControlId.Comm5, Keys.D5));
            // Latching toggle switches: tap a key each time the switch is flipped
            b.Add(Key(ControlId.ToggleFilterControl, Keys.F5, ButtonMode.PulseOnChange));
            b.Add(Key(ControlId.ToggleOxygenSupply, Keys.F6, ButtonMode.PulseOnChange));
            b.Add(Key(ControlId.ToggleFuelFlowRate, Keys.F7, ButtonMode.PulseOnChange));
            b.Add(Key(ControlId.ToggleBufferMaterial, Keys.F8, ButtonMode.PulseOnChange));
            b.Add(Key(ControlId.ToggleVTLocation, Keys.F9, ButtonMode.PulseOnChange));
            // Tuner dial clicks
            b.Add(Key(ControlId.TunerClockwise, Keys.PageDown, ButtonMode.Pulse, "Next (e.g. camera / target)"));
            b.Add(Key(ControlId.TunerCounterClockwise, Keys.End, ButtonMode.Pulse, "Previous"));
            return p;
        }

        /// <summary>Pure gamepad: only things a standard Xbox pad has. Good for Steam Input remapping.</summary>
        public static Profile PadOnly()
        {
            var p = new Profile { Name = "Xbox pad only (remap in Steam Input)" };
            var b = p.Bindings;
            b.Add(Stick(ControlId.RotationLever, XboxAxis.LeftStickX));
            b.Add(Stick(ControlId.GearAxis, XboxAxis.LeftStickY));
            b.Add(Stick(ControlId.AimingX, XboxAxis.RightStickX));
            b.Add(Stick(ControlId.AimingY, XboxAxis.RightStickY, true));
            b.Add(Stick(ControlId.RightPedal, XboxAxis.RightTrigger));
            b.Add(Stick(ControlId.MiddlePedal, XboxAxis.LeftTrigger));
            b.Add(Dir(ControlId.SightChangeY, AxisDirection.Negative, XboxButton.DPadUp));
            b.Add(Dir(ControlId.SightChangeY, AxisDirection.Positive, XboxButton.DPadDown));
            b.Add(Dir(ControlId.SightChangeX, AxisDirection.Negative, XboxButton.DPadLeft));
            b.Add(Dir(ControlId.SightChangeX, AxisDirection.Positive, XboxButton.DPadRight));
            b.Add(Pad(ControlId.MainWeapon, XboxButton.RightBumper));
            b.Add(Pad(ControlId.Fire, XboxButton.LeftBumper));
            b.Add(Pad(ControlId.LockOn, XboxButton.Y));
            b.Add(Pad(ControlId.LeftJoySightChange, XboxButton.RightStickClick));
            b.Add(new Binding { Control = ControlId.LeftPedal, Output = OutputKind.XboxButton, XboxButton = XboxButton.LeftStickClick, Threshold = 0.5 });
            b.Add(Pad(ControlId.WeaponConMain, XboxButton.X));
            b.Add(Pad(ControlId.WeaponConSub, XboxButton.B));
            b.Add(Pad(ControlId.WeaponConMagazine, XboxButton.A));
            b.Add(Pad(ControlId.Start, XboxButton.Start));
            b.Add(Pad(ControlId.MultiMonModeSelect, XboxButton.Back));
            b.Add(Pad(ControlId.Eject, XboxButton.Guide));
            return p;
        }

        public static IEnumerable<Profile> All() { yield return Cockpit(); yield return PadOnly(); }
    }
}
