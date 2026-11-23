using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace SBBridge.Core
{
    /// <summary>Everything the outputs should look like after one mapping tick.</summary>
    public sealed class OutputFrame
    {
        public PadReport Pad;
        public readonly bool[] Keys = new bool[256];
        public readonly bool[] Mouse = new bool[5];   // Left, Right, Middle, X1, X2
        public int Wheel;                              // notches this tick
        public int MouseDX, MouseDY;                   // whole pixels this tick
        public readonly byte[] Leds = new byte[Sbc.LedReportSize];

        public void Reset()
        {
            Pad = new PadReport();
            Array.Clear(Keys, 0, Keys.Length); Array.Clear(Mouse, 0, Mouse.Length);
            Wheel = 0; MouseDX = 0; MouseDY = 0;
            Array.Clear(Leds, 0, Leds.Length);
        }
    }

    /// <summary>Turns controller state + profile into an OutputFrame. Platform-neutral.</summary>
    public sealed class Mapper
    {
        sealed class Runtime { public bool PrevActive; public bool PrevOut; public bool Latch; public long PulseUntil; }

        readonly Dictionary<Binding, Runtime> rt = new Dictionary<Binding, Runtime>();
        readonly bool[] events = new bool[Sbc.ControlCount];
        int lastGear = 0, lastTuner = -1;
        bool primed; // false until the first valid tick after (re)connect
        double accX, accY;
        double lx, ly, rx, ry, lt, rt2;

        public static double Normalize(ControlId axis, ControllerState s, AppSettings settings)
        {
            var info = Sbc.Info(axis);
            if (axis == ControlId.GearAxis)
            {
                if (s.Gear == -2) return -1; if (s.Gear == -1 || s.Gear == 0) return 0;
                return s.Gear / 5.0;
            }
            if (axis == ControlId.TunerAxis) return s.Tuner / 15.0;
            var cal = settings.Cal(axis);
            int raw = s.RawAxis[(int)axis];
            double v;
            if (info.Bipolar)
            {
                if (raw >= cal.Center) v = cal.Max == cal.Center ? 0 : (raw - cal.Center) / (double)(cal.Max - cal.Center);
                else v = cal.Min == cal.Center ? 0 : -(cal.Center - raw) / (double)(cal.Center - cal.Min);
                return Clamp(v, -1, 1);
            }
            v = cal.Max == cal.Min ? 0 : (raw - cal.Min) / (double)(cal.Max - cal.Min);
            return Clamp(v, 0, 1);
        }

        static double Clamp(double v, double a, double b) { return v < a ? a : (v > b ? b : v); }

        static double Shape(double v, Binding b)
        {
            double sign = v < 0 ? -1 : 1, m = Math.Abs(v);
            double dz = Clamp(b.Deadzone, 0, 0.9);
            m = m <= dz ? 0 : (m - dz) / (1 - dz);
            double curve = b.Curve <= 0 ? 1 : b.Curve;
            if (curve != 1) m = Math.Pow(m, curve);
            return sign * m * (b.Scale == 0 ? 1 : b.Scale);
        }

        public void Tick(ControllerState s, bool connected, long nowMs, double dt, Profile profile, AppSettings settings, OutputFrame f)
        {
            f.Reset();
            lx = ly = rx = ry = lt = rt2 = 0;
            Array.Clear(events, 0, events.Length);

            if (!connected || !s.Valid)
            {
                lastGear = 0; lastTuner = -1; accX = accY = 0; primed = false;
                foreach (var r in rt.Values) { r.PrevActive = false; r.PrevOut = false; r.PulseUntil = 0; }
                return;
            }

            // Gear / tuner change events
            int go = Sbc.GearOrdinal(s.Gear), lgo = Sbc.GearOrdinal(lastGear);
            if (go >= 0 && lgo >= 0 && go != lgo) events[(int)(go > lgo ? ControlId.GearUp : ControlId.GearDown)] = true;
            if (go >= 0) lastGear = s.Gear;
            if (lastTuner >= 0 && s.Tuner != lastTuner)
            {
                int d = (s.Tuner - lastTuner + 16) % 16;
                events[(int)(d <= 7 ? ControlId.TunerClockwise : ControlId.TunerCounterClockwise)] = true;
            }
            lastTuner = s.Tuner;

            bool shift = profile.ShiftControl != ControlId.None && IsDown(profile.ShiftControl, s);

            var bindings = profile.Snapshot();
            foreach (var b in bindings)
            {
                if (b.Control == ControlId.None || b.Output == OutputKind.None) continue;
                Runtime r;
                if (!rt.TryGetValue(b, out r)) { r = new Runtime(); rt[b] = r; }

                bool layerOk = b.Layer == Layer.Always || (b.Layer == Layer.ShiftedOnly) == shift;
                var kind = Sbc.Info(b.Control).Kind;

                if (kind == ControlKind.Axis && (b.Output == OutputKind.XboxAxis || b.Output == OutputKind.MouseMove))
                {
                    if (!layerOk) continue;
                    double v = Normalize(b.Control, s, settings);
                    if (b.Invert) v = Sbc.Info(b.Control).Bipolar ? -v : 1 - v;
                    v = Shape(v, b);
                    if (b.Output == OutputKind.MouseMove)
                    {
                        double px = v * b.MouseSpeed * dt;
                        if (b.MouseAxis == MouseAxis.X) accX += px; else accY += px;
                    }
                    else AddAxis(b.XboxAxis, v, Sbc.Info(b.Control).Bipolar, b.OneSidedToFullRange);
                    continue;
                }

                // Button-like evaluation
                bool active;
                if (kind == ControlKind.Axis)
                {
                    double v = Normalize(b.Control, s, settings);
                    if (b.Invert) v = Sbc.Info(b.Control).Bipolar ? -v : 1 - v;
                    active = b.Direction == AxisDirection.Positive ? v > b.Threshold : v < -b.Threshold;
                }
                else if (kind == ControlKind.Event) active = events[(int)b.Control];
                else active = s.Down[(int)b.Control];
                if (!layerOk) active = false;

                if (!primed) r.PrevActive = active; // don't treat switches already on at connect as presses
                bool rising = active && !r.PrevActive, falling = !active && r.PrevActive;
                r.PrevActive = active;

                var mode = b.Mode;
                if (kind == ControlKind.Event && mode == ButtonMode.Hold) mode = ButtonMode.Pulse;
                bool output;
                switch (mode)
                {
                    case ButtonMode.Pulse:
                        if (rising) r.PulseUntil = nowMs + Math.Max(10, b.PulseMs);
                        output = nowMs < r.PulseUntil; break;
                    case ButtonMode.PulseOnChange:
                        if (rising || falling) r.PulseUntil = nowMs + Math.Max(10, b.PulseMs);
                        output = nowMs < r.PulseUntil; break;
                    case ButtonMode.Toggle:
                        if (rising) r.Latch = !r.Latch;
                        output = r.Latch; break;
                    default: output = active; break;
                }
                bool outRising = output && !r.PrevOut;
                r.PrevOut = output;
                if (!output) continue;

                switch (b.Output)
                {
                    case OutputKind.XboxButton: PressPad(f, b.XboxButton); break;
                    case OutputKind.XboxAxis:
                        AddAxis(b.XboxAxis, b.Direction == AxisDirection.Negative ? -1 : 1, true, false); break;
                    case OutputKind.Key:
                        if (b.WithCtrl) f.Keys[(int)Keys.ControlKey] = true;
                        if (b.WithShift) f.Keys[(int)Keys.ShiftKey] = true;
                        if (b.WithAlt) f.Keys[(int)Keys.Menu] = true;
                        int vk = (int)(b.Key & Keys.KeyCode);
                        if (vk > 0 && vk < 256) f.Keys[vk] = true;
                        break;
                    case OutputKind.MouseButton:
                        if (b.MouseButton == MouseButtonId.WheelUp) { if (outRising) f.Wheel += 1; }
                        else if (b.MouseButton == MouseButtonId.WheelDown) { if (outRising) f.Wheel -= 1; }
                        else f.Mouse[(int)b.MouseButton] = true;
                        break;
                }
            }

            primed = true;

            // Prune runtime entries for deleted bindings occasionally
            if (rt.Count > bindings.Length * 2 + 16)
            {
                var keep = new HashSet<Binding>(bindings);
                var dead = new List<Binding>();
                foreach (var k in rt.Keys) if (!keep.Contains(k)) dead.Add(k);
                foreach (var k in dead) rt.Remove(k);
            }

            f.Pad.LX = ToShort(lx); f.Pad.LY = ToShort(ly); f.Pad.RX = ToShort(rx); f.Pad.RY = ToShort(ry);
            f.Pad.LeftTrigger = ToByte(lt);
            f.Pad.RightTrigger = ToByte(rt2);
            if (trigFullL) f.Pad.LeftTrigger = 255;
            if (trigFullR) f.Pad.RightTrigger = 255;
            trigFullL = trigFullR = false;

            f.MouseDX = (int)accX; accX -= f.MouseDX;
            f.MouseDY = (int)accY; accY -= f.MouseDY;

            if (settings.LedFeedback) BuildLeds(s, settings, f.Leds);
        }

        bool trigFullL, trigFullR;

        static bool IsDown(ControlId id, ControllerState s)
        {
            var k = Sbc.Info(id).Kind;
            return (k == ControlKind.Button || k == ControlKind.VirtualButton) && s.Down[(int)id];
        }

        void AddAxis(XboxAxis a, double v, bool bipolarSource, bool fullRange)
        {
            bool trigger = a == XboxAxis.LeftTrigger || a == XboxAxis.RightTrigger;
            if (!trigger && !bipolarSource && fullRange) v = v * 2 - 1;
            if (trigger && v < 0) v = 0;
            switch (a)
            {
                case XboxAxis.LeftStickX: lx += v; break;
                case XboxAxis.LeftStickY: ly += v; break;
                case XboxAxis.RightStickX: rx += v; break;
                case XboxAxis.RightStickY: ry += v; break;
                case XboxAxis.LeftTrigger: lt += v; break;
                case XboxAxis.RightTrigger: rt2 += v; break;
            }
        }

        void PressPad(OutputFrame f, XboxButton b)
        {
            switch (b)
            {
                case XboxButton.DPadUp: f.Pad.Buttons |= 0x0001; break;
                case XboxButton.DPadDown: f.Pad.Buttons |= 0x0002; break;
                case XboxButton.DPadLeft: f.Pad.Buttons |= 0x0004; break;
                case XboxButton.DPadRight: f.Pad.Buttons |= 0x0008; break;
                case XboxButton.Start: f.Pad.Buttons |= 0x0010; break;
                case XboxButton.Back: f.Pad.Buttons |= 0x0020; break;
                case XboxButton.LeftStickClick: f.Pad.Buttons |= 0x0040; break;
                case XboxButton.RightStickClick: f.Pad.Buttons |= 0x0080; break;
                case XboxButton.LeftBumper: f.Pad.Buttons |= 0x0100; break;
                case XboxButton.RightBumper: f.Pad.Buttons |= 0x0200; break;
                case XboxButton.Guide: f.Pad.Buttons |= 0x0400; break;
                case XboxButton.A: f.Pad.Buttons |= 0x1000; break;
                case XboxButton.B: f.Pad.Buttons |= 0x2000; break;
                case XboxButton.X: f.Pad.Buttons |= 0x4000; break;
                case XboxButton.Y: f.Pad.Buttons |= 0x8000; break;
                case XboxButton.LeftTriggerFull: trigFullL = true; break;
                case XboxButton.RightTriggerFull: trigFullR = true; break;
            }
        }

        static short ToShort(double v)
        {
            v = Clamp(v, -1, 1);
            return (short)Math.Round(v >= 0 ? v * 32767 : v * 32768);
        }
        static byte ToByte(double v) { return (byte)Math.Round(Clamp(v, 0, 1) * 255); }

        static void BuildLeds(ControllerState s, AppSettings st, byte[] leds)
        {
            foreach (var c in Sbc.All)
            {
                if (c.Led < 0) continue;
                bool on = s.Down[(int)c.Id];
                Sbc.SetLed(leds, c.Led, on ? st.LedBright : (c.Kind == ControlKind.VirtualButton ? 0 : st.LedDim));
            }
        }
    }
}
