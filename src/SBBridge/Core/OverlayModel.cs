using System;
using System.Collections.Generic;
using System.Linq;

namespace SBBridge.Core
{
    public sealed class OverlayRow
    {
        public string Group { get; set; }
        public string ControlId { get; set; }
        public string Control { get; set; }
        public string Action { get; set; }
        public bool Active { get; set; }
    }

    public sealed class OverlayGroup
    {
        public string Title { get; set; }
        public List<OverlayRow> Rows { get; set; }
    }

    /// <summary>
    /// The control cheat-sheet: what every bound cockpit control does in the current layer. Shared by the
    /// native Windows overlay and the /overlay.html page so both always say the same thing.
    /// </summary>
    public static class OverlayModel
    {
        static readonly string[] GroupOrder = { "Sticks", "Levers & pedals", "Weapons", "Center panel", "Function panel", "Comm", "Toggles", "Gear & tuner" };

        public static string GroupOf(ControlId id)
        {
            switch (id)
            {
                case ControlId.MainWeapon: case ControlId.Fire: case ControlId.LockOn: case ControlId.LeftJoySightChange:
                    return "Sticks";
                case ControlId.AimingX: case ControlId.AimingY: case ControlId.RotationLever: case ControlId.SightChangeX: case ControlId.SightChangeY:
                case ControlId.LeftPedal: case ControlId.MiddlePedal: case ControlId.RightPedal:
                    return "Levers & pedals";
                case ControlId.WeaponConMain: case ControlId.WeaponConSub: case ControlId.WeaponConMagazine:
                    return "Weapons";
                case ControlId.Eject: case ControlId.CockpitHatch: case ControlId.Ignition: case ControlId.Start:
                case ControlId.MultiMonOpenClose: case ControlId.MultiMonMapZoom: case ControlId.MultiMonModeSelect: case ControlId.MultiMonSubMonitor:
                case ControlId.MainMonZoomIn: case ControlId.MainMonZoomOut:
                    return "Center panel";
                case ControlId.FunctionFSS: case ControlId.FunctionManipulator: case ControlId.FunctionLineColorChange: case ControlId.Washing:
                case ControlId.Extinguisher: case ControlId.Chaff: case ControlId.FunctionTankDetach: case ControlId.FunctionOverride:
                case ControlId.FunctionNightScope: case ControlId.FunctionF1: case ControlId.FunctionF2: case ControlId.FunctionF3:
                    return "Function panel";
                case ControlId.Comm1: case ControlId.Comm2: case ControlId.Comm3: case ControlId.Comm4: case ControlId.Comm5:
                    return "Comm";
                case ControlId.ToggleFilterControl: case ControlId.ToggleOxygenSupply: case ControlId.ToggleFuelFlowRate:
                case ControlId.ToggleBufferMaterial: case ControlId.ToggleVTLocation:
                    return "Toggles";
                default:
                    return "Gear & tuner";
            }
        }

        /// <summary>Short label for small spaces: "Function: Night Scope" -> "Night Scope", drops "(…)" details.</summary>
        public static string ShortName(ControlId id)
        {
            switch (id)
            {
                case ControlId.GearAxis: return "Gear lever";
                case ControlId.TunerAxis: return "Tuner dial";
                case ControlId.GearUp: return "Gear up";
                case ControlId.GearDown: return "Gear down";
                case ControlId.TunerClockwise: return "Tuner ⟳";
                case ControlId.TunerCounterClockwise: return "Tuner ⟲";
                case ControlId.SightChangeX: return "Sight stick X";
                case ControlId.SightChangeY: return "Sight stick Y";
                case ControlId.LeftJoySightChange: return "Sight change";
            }
            string n = Sbc.Info(id).Name;
            int p = n.IndexOf(" (", StringComparison.Ordinal);
            if (p > 0) n = n.Substring(0, p);
            foreach (var prefix in new[] { "Function: ", "Weapon Control: ", "Toggle: ", "Multi-Monitor ", "Main Monitor " })
                if (n.StartsWith(prefix, StringComparison.Ordinal))
                    n = (prefix == "Multi-Monitor " ? "MM " : prefix == "Main Monitor " ? "Main " : "") + n.Substring(prefix.Length);
            return n;
        }

        public static bool ShiftHeld(Profile p, ControllerState s)
        {
            var sc = p.ShiftControl;
            if (sc == ControlId.None) return false;
            var k = Sbc.Info(sc).Kind;
            return (k == ControlKind.Button || k == ControlKind.VirtualButton) && s.Down[(int)sc];
        }

        static string PadName(XboxButton b)
        {
            switch (b)
            {
                case XboxButton.LeftBumper: return "LB"; case XboxButton.RightBumper: return "RB";
                case XboxButton.LeftStickClick: return "LS click"; case XboxButton.RightStickClick: return "RS click";
                case XboxButton.DPadUp: return "D-pad up"; case XboxButton.DPadDown: return "D-pad down";
                case XboxButton.DPadLeft: return "D-pad left"; case XboxButton.DPadRight: return "D-pad right";
                case XboxButton.LeftTriggerFull: return "LT"; case XboxButton.RightTriggerFull: return "RT";
                default: return "Pad " + b;
            }
        }

        static string Target(Binding b)
        {
            switch (b.Output)
            {
                case OutputKind.XboxButton: return PadName(b.XboxButton);
                case OutputKind.XboxAxis:
                    switch (b.XboxAxis)
                    {
                        case XboxAxis.LeftStickX: return "Left stick ↔"; case XboxAxis.LeftStickY: return "Left stick ↕";
                        case XboxAxis.RightStickX: return "Right stick ↔"; case XboxAxis.RightStickY: return "Right stick ↕";
                        case XboxAxis.LeftTrigger: return "LT"; default: return "RT";
                    }
                case OutputKind.Key:
                    return (b.WithCtrl ? "Ctrl+" : "") + (b.WithShift ? "Shift+" : "") + (b.WithAlt ? "Alt+" : "") + KeyLabel(b.Key);
                default: return b.TargetText();
            }
        }

        static string KeyLabel(KeyCode k)
        {
            string n = k.ToString();
            if (n.Length == 2 && n[0] == 'D' && char.IsDigit(n[1])) return n.Substring(1);
            if (n.StartsWith("NumPad")) return "Num " + n.Substring(6);
            switch (k) { case KeyCode.Add: return "Num +"; case KeyCode.Subtract: return "Num −"; case KeyCode.Multiply: return "Num *"; case KeyCode.Divide: return "Num /"; }
            return n;
        }

        static string ActionText(Binding b)
        {
            string a = !string.IsNullOrWhiteSpace(b.Note) ? b.Note.Trim() : Target(b);
            bool buttonLike = b.Output == OutputKind.XboxButton || b.Output == OutputKind.Key || b.Output == OutputKind.MouseButton || b.Output == OutputKind.Overlay;
            if (b.SourceIsAxis && buttonLike) a = (b.Direction == AxisDirection.Positive ? "+ " : "− ") + a;
            return a;
        }

        public static List<OverlayGroup> Build(Profile profile, ControllerState s, AppSettings settings)
        {
            bool shift = ShiftHeld(profile, s);
            var byControl = new Dictionary<ControlId, List<string>>();
            foreach (var b in profile.Snapshot())
            {
                if (b.Control == ControlId.None || b.Output == OutputKind.None) continue;
                if (b.Layer == Layer.NormalOnly && shift) continue;
                if (b.Layer == Layer.ShiftedOnly && !shift) continue;
                List<string> l;
                if (!byControl.TryGetValue(b.Control, out l)) byControl[b.Control] = l = new List<string>();
                string t = ActionText(b);
                if (!l.Contains(t)) l.Add(t);
            }
            if (profile.ShiftControl != ControlId.None)
            {
                List<string> l;
                if (!byControl.TryGetValue(profile.ShiftControl, out l)) byControl[profile.ShiftControl] = l = new List<string>();
                l.Insert(0, "Shift layer");
            }

            var groups = new Dictionary<string, OverlayGroup>();
            foreach (var c in Sbc.All)
            {
                List<string> actions;
                if (!byControl.TryGetValue(c.Id, out actions)) continue;
                bool active;
                if (c.Id == ControlId.GearAxis || c.Id == ControlId.TunerAxis) active = false;   // positions, not presses
                else if (c.Kind == ControlKind.Axis) active = s.Valid && Math.Abs(Mapper.Normalize(c.Id, s, settings)) > 0.3 && Sbc.Info(c.Id).Bipolar
                                                    || s.Valid && !Sbc.Info(c.Id).Bipolar && Mapper.Normalize(c.Id, s, settings) > 0.3;
                else active = s.Valid && (c.Kind == ControlKind.Button || c.Kind == ControlKind.VirtualButton) && s.Down[(int)c.Id];
                string g = GroupOf(c.Id);
                OverlayGroup og;
                if (!groups.TryGetValue(g, out og)) groups[g] = og = new OverlayGroup { Title = g, Rows = new List<OverlayRow>() };
                og.Rows.Add(new OverlayRow { Group = g, ControlId = c.Id.ToString(), Control = ShortName(c.Id), Action = string.Join(" · ", actions), Active = active });
            }
            return GroupOrder.Where(groups.ContainsKey).Select(g => groups[g]).ToList();
        }
    }
}
