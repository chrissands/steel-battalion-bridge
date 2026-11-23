// Steel Battalion controller (Original Xbox, VID 0x0A7B / PID 0xD000) protocol.
// Platform-neutral: no Windows APIs in this file.
//
// Input report: 26 bytes on interrupt IN endpoint 0x82.
//   [0]      0x00, [1] 0x1A (report length)
//   [2..6]   button bitfields (see table below)
//   [9..24]  analog axes, 10-bit: value = (hi << 2) | (lo >> 6)
//   [24]     low nibble = tuner dial position (0..15)
//   [25]     gear lever: 0xFE=R, 0xFF=N, 1..5
// Output report: LED intensities, one nibble per LED (0..15), on OUT endpoint 0x01.
//
// Layout cross-checked against SteelBattalion.NET, libSteelBattalion and the Teensy SBC library.
using System;
using System.Collections.Generic;

namespace SBBridge.Core
{
    public enum ControlKind { None, Button, VirtualButton, Event, Axis }

    public enum ControlId
    {
        None = 0,
        // Physical buttons
        MainWeapon, Fire, LockOn, Eject, CockpitHatch, Ignition, Start,
        MultiMonOpenClose, MultiMonMapZoom, MultiMonModeSelect, MultiMonSubMonitor,
        MainMonZoomIn, MainMonZoomOut,
        FunctionFSS, FunctionManipulator, FunctionLineColorChange,
        Washing, Extinguisher, Chaff,
        FunctionTankDetach, FunctionOverride, FunctionNightScope,
        FunctionF1, FunctionF2, FunctionF3,
        WeaponConMain, WeaponConSub, WeaponConMagazine,
        Comm1, Comm2, Comm3, Comm4, Comm5,
        LeftJoySightChange,
        ToggleFilterControl, ToggleOxygenSupply, ToggleFuelFlowRate, ToggleBufferMaterial, ToggleVTLocation,
        // Gear lever positions (held while lever is in that slot)
        GearR, GearN, Gear1, Gear2, Gear3, Gear4, Gear5,
        // Tuner dial positions
        Tuner0, Tuner1, Tuner2, Tuner3, Tuner4, Tuner5, Tuner6, Tuner7,
        Tuner8, Tuner9, Tuner10, Tuner11, Tuner12, Tuner13, Tuner14, Tuner15,
        // Momentary events
        GearUp, GearDown, TunerClockwise, TunerCounterClockwise,
        // Axes
        AimingX, AimingY, RotationLever, SightChangeX, SightChangeY,
        LeftPedal, MiddlePedal, RightPedal, GearAxis, TunerAxis
    }

    public sealed class ControlInfo
    {
        public ControlId Id;
        public ControlKind Kind;
        public string Name;
        public int Byte = -1;
        public int Mask;
        public int Led = -1;          // LED index (nibble), -1 = none
        public bool Bipolar;          // axes: centred (-1..1) vs one-sided (0..1)
        public int RawMin, RawCenter, RawMax; // default calibration
        public int HiByte = -1, LoByte = -1; public bool Signed;
    }

    public static class Sbc
    {
        public const int VendorId = 0x0A7B;
        public const int ProductId = 0xD000;
        public const int InputReportSize = 26;
        public const int LedReportSize = 34;  // proven size used by existing libraries
        public const byte InEndpoint = 0x82;
        public const byte OutEndpoint = 0x01;

        public static readonly ControlInfo[] All;
        static readonly ControlInfo[] byId;

        static void B(List<ControlInfo> l, ControlId id, string name, int b, int mask, int led)
        { l.Add(new ControlInfo { Id = id, Kind = ControlKind.Button, Name = name, Byte = b, Mask = mask, Led = led }); }

        static void A(List<ControlInfo> l, ControlId id, string name, int hi, int lo, bool signed, bool bipolar, int min, int ctr, int max)
        { l.Add(new ControlInfo { Id = id, Kind = ControlKind.Axis, Name = name, HiByte = hi, LoByte = lo, Signed = signed, Bipolar = bipolar, RawMin = min, RawCenter = ctr, RawMax = max }); }

        static Sbc()
        {
            var l = new List<ControlInfo>();
            B(l, ControlId.MainWeapon, "Main Weapon (aim lever trigger)", 2, 0x01, -1);
            B(l, ControlId.Fire, "Fire (aim lever)", 2, 0x02, -1);
            B(l, ControlId.LockOn, "Lock On (aim lever)", 2, 0x04, -1);
            B(l, ControlId.Eject, "Eject", 2, 0x08, 4);
            B(l, ControlId.CockpitHatch, "Cockpit Hatch", 2, 0x10, 5);
            B(l, ControlId.Ignition, "Ignition", 2, 0x20, 6);
            B(l, ControlId.Start, "Start", 2, 0x40, 7);
            B(l, ControlId.MultiMonOpenClose, "Multi-Monitor Open/Close", 2, 0x80, 8);
            B(l, ControlId.MultiMonMapZoom, "Multi-Monitor Map Zoom", 3, 0x01, 9);
            B(l, ControlId.MultiMonModeSelect, "Multi-Monitor Mode Select", 3, 0x02, 10);
            B(l, ControlId.MultiMonSubMonitor, "Multi-Monitor Sub Monitor", 3, 0x04, 11);
            B(l, ControlId.MainMonZoomIn, "Main Monitor Zoom In", 3, 0x08, 12);
            B(l, ControlId.MainMonZoomOut, "Main Monitor Zoom Out", 3, 0x10, 13);
            B(l, ControlId.FunctionFSS, "Function: FSS", 3, 0x20, 14);
            B(l, ControlId.FunctionManipulator, "Function: Manipulator", 3, 0x40, 15);
            B(l, ControlId.FunctionLineColorChange, "Function: Line Color Change", 3, 0x80, 16);
            B(l, ControlId.Washing, "Washing", 4, 0x01, 17);
            B(l, ControlId.Extinguisher, "Extinguisher", 4, 0x02, 18);
            B(l, ControlId.Chaff, "Chaff", 4, 0x04, 19);
            B(l, ControlId.FunctionTankDetach, "Function: Tank Detach", 4, 0x08, 20);
            B(l, ControlId.FunctionOverride, "Function: Override", 4, 0x10, 21);
            B(l, ControlId.FunctionNightScope, "Function: Night Scope", 4, 0x20, 22);
            B(l, ControlId.FunctionF1, "Function: F1", 4, 0x40, 23);
            B(l, ControlId.FunctionF2, "Function: F2", 4, 0x80, 24);
            B(l, ControlId.FunctionF3, "Function: F3", 5, 0x01, 25);
            B(l, ControlId.WeaponConMain, "Weapon Control: Main", 5, 0x02, 26);
            B(l, ControlId.WeaponConSub, "Weapon Control: Sub", 5, 0x04, 27);
            B(l, ControlId.WeaponConMagazine, "Weapon Control: Magazine", 5, 0x08, 28);
            B(l, ControlId.Comm1, "Comm 1", 5, 0x10, 29);
            B(l, ControlId.Comm2, "Comm 2", 5, 0x20, 30);
            B(l, ControlId.Comm3, "Comm 3", 5, 0x40, 31);
            B(l, ControlId.Comm4, "Comm 4", 5, 0x80, 32);
            B(l, ControlId.Comm5, "Comm 5", 6, 0x01, 33);
            B(l, ControlId.LeftJoySightChange, "Sight Change (left lever button)", 6, 0x02, -1);
            B(l, ControlId.ToggleFilterControl, "Toggle: Filter Control", 6, 0x04, -1);
            B(l, ControlId.ToggleOxygenSupply, "Toggle: Oxygen Supply", 6, 0x08, -1);
            B(l, ControlId.ToggleFuelFlowRate, "Toggle: Fuel Flow Rate", 6, 0x10, -1);
            B(l, ControlId.ToggleBufferMaterial, "Toggle: Buffer Material", 6, 0x20, -1);
            B(l, ControlId.ToggleVTLocation, "Toggle: VT Location", 6, 0x40, -1);

            string[] gearNames = { "R", "N", "1", "2", "3", "4", "5" };
            for (int i = 0; i < 7; i++)
                l.Add(new ControlInfo { Id = ControlId.GearR + i, Kind = ControlKind.VirtualButton, Name = "Gear " + gearNames[i], Led = 35 + i });
            for (int i = 0; i < 16; i++)
                l.Add(new ControlInfo { Id = ControlId.Tuner0 + i, Kind = ControlKind.VirtualButton, Name = "Tuner position " + i });

            l.Add(new ControlInfo { Id = ControlId.GearUp, Kind = ControlKind.Event, Name = "Gear shifted up (event)" });
            l.Add(new ControlInfo { Id = ControlId.GearDown, Kind = ControlKind.Event, Name = "Gear shifted down (event)" });
            l.Add(new ControlInfo { Id = ControlId.TunerClockwise, Kind = ControlKind.Event, Name = "Tuner turned clockwise (event)" });
            l.Add(new ControlInfo { Id = ControlId.TunerCounterClockwise, Kind = ControlKind.Event, Name = "Tuner turned counter-clockwise (event)" });

            A(l, ControlId.AimingX, "Aiming Lever X", 9, 10, false, true, 0, 512, 1023);
            A(l, ControlId.AimingY, "Aiming Lever Y", 11, 12, false, true, 0, 512, 1023);
            A(l, ControlId.RotationLever, "Rotation Lever", 13, 14, true, true, -512, 0, 511);
            A(l, ControlId.SightChangeX, "Sight Change Stick X", 15, 16, true, true, -512, 0, 511);
            A(l, ControlId.SightChangeY, "Sight Change Stick Y", 17, 18, true, true, -512, 0, 511);
            A(l, ControlId.LeftPedal, "Left Pedal (slide)", 19, 20, false, false, 0, 0, 1023);
            A(l, ControlId.MiddlePedal, "Middle Pedal (brake)", 21, 22, false, false, 0, 0, 1023);
            A(l, ControlId.RightPedal, "Right Pedal (accelerator)", 23, 24, false, false, 0, 0, 1023);
            l.Add(new ControlInfo { Id = ControlId.GearAxis, Kind = ControlKind.Axis, Name = "Gear Lever as axis (R=-1, N=0, 5=+1)", Bipolar = true });
            l.Add(new ControlInfo { Id = ControlId.TunerAxis, Kind = ControlKind.Axis, Name = "Tuner Dial as axis (0..1)", Bipolar = false });

            All = l.ToArray();
            int max = 0; foreach (var c in All) max = Math.Max(max, (int)c.Id);
            byId = new ControlInfo[max + 1];
            byId[0] = new ControlInfo { Id = ControlId.None, Kind = ControlKind.None, Name = "(none)" };
            foreach (var c in All) byId[(int)c.Id] = c;
        }

        public static ControlInfo Info(ControlId id) { return byId[(int)id]; }
        public static int ControlCount { get { return byId.Length; } }

        /// <summary>True for controls with a calibratable raw ADC value.</summary>
        public static bool IsCalibratable(ControlId id) { var i = Info(id); return i.Kind == ControlKind.Axis && i.HiByte >= 0; }

        public static int DecodeAxis(byte[] r, ControlInfo c)
        {
            int v = (r[c.HiByte] << 2) | (r[c.LoByte] >> 6);
            if (c.Signed && r[c.HiByte] >= 128) v -= 1024;
            return v;
        }

        /// <summary>Gear byte to -2(R), -1(N), 1..5; 0 if unknown.</summary>
        public static int DecodeGear(byte b)
        {
            sbyte s = unchecked((sbyte)b);
            if (s == -2 || s == -1 || (s >= 1 && s <= 5)) return s;
            return 0;
        }

        /// <summary>Gear value (-2..5) to an ordinal 0..6 (R..5), or -1.</summary>
        public static int GearOrdinal(int gear)
        {
            if (gear == -2) return 0;
            if (gear == -1) return 1;
            if (gear >= 1 && gear <= 5) return gear + 1;
            return -1;
        }

        public static void SetLed(byte[] buf, int led, int intensity)
        {
            if (led < 0) return;
            if (intensity < 0) intensity = 0; if (intensity > 15) intensity = 15;
            int idx = led / 2;
            if (idx >= buf.Length) return;
            if ((led & 1) == 1) buf[idx] = (byte)((buf[idx] & 0x0F) | (intensity << 4));
            else buf[idx] = (byte)((buf[idx] & 0xF0) | intensity);
        }
    }

    /// <summary>Decoded snapshot of one input report.</summary>
    public sealed class ControllerState
    {
        public readonly byte[] Raw = new byte[Sbc.InputReportSize];
        public readonly bool[] Down = new bool[Sbc.ControlCount];
        public readonly int[] RawAxis = new int[Sbc.ControlCount];
        public int Gear;   // -2=R, -1=N, 1..5, 0=unknown
        public int Tuner;  // 0..15
        public bool Valid;

        public bool Parse(byte[] r, int len)
        {
            if (len < Sbc.InputReportSize) return false;
            Buffer.BlockCopy(r, 0, Raw, 0, Sbc.InputReportSize);
            Array.Clear(Down, 0, Down.Length);
            foreach (var c in Sbc.All)
            {
                if (c.Kind == ControlKind.Button) Down[(int)c.Id] = (r[c.Byte] & c.Mask) != 0;
                else if (c.Kind == ControlKind.Axis && c.HiByte >= 0) RawAxis[(int)c.Id] = Sbc.DecodeAxis(r, c);
            }
            Gear = Sbc.DecodeGear(r[25]);
            Tuner = r[24] & 0x0F;
            int go = Sbc.GearOrdinal(Gear);
            if (go >= 0) Down[(int)ControlId.GearR + go] = true;
            Down[(int)ControlId.Tuner0 + Tuner] = true;
            Valid = true;
            return true;
        }

        public void CopyTo(ControllerState o)
        {
            Buffer.BlockCopy(Raw, 0, o.Raw, 0, Raw.Length);
            Array.Copy(Down, o.Down, Down.Length);
            Array.Copy(RawAxis, o.RawAxis, RawAxis.Length);
            o.Gear = Gear; o.Tuner = Tuner; o.Valid = Valid;
        }

        public void Clear()
        {
            Array.Clear(Raw, 0, Raw.Length); Array.Clear(Down, 0, Down.Length); Array.Clear(RawAxis, 0, RawAxis.Length);
            Gear = 0; Tuner = 0; Valid = false;
        }
    }
}
