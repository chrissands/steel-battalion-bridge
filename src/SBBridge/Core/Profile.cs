using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using System.Xml.Serialization;

namespace SBBridge.Core
{
    public enum OutputKind { None, XboxButton, XboxAxis, Key, MouseButton, MouseMove }

    public enum XboxButton
    {
        A, B, X, Y, LeftBumper, RightBumper, Back, Start, Guide,
        LeftStickClick, RightStickClick, DPadUp, DPadDown, DPadLeft, DPadRight,
        LeftTriggerFull, RightTriggerFull
    }

    public enum XboxAxis { LeftStickX, LeftStickY, RightStickX, RightStickY, LeftTrigger, RightTrigger }
    public enum MouseAxis { X, Y }
    public enum ButtonMode { Hold, Pulse, PulseOnChange, Toggle }
    public enum AxisDirection { Positive, Negative }
    public enum Layer { Always, NormalOnly, ShiftedOnly }

    /// <summary>Marks which output kinds a property is relevant to (for the editor).</summary>
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class ShowForAttribute : Attribute
    {
        public readonly OutputKind[] Kinds; public bool AxisSourceOnly; public bool ButtonLikeOnly;
        public ShowForAttribute(params OutputKind[] kinds) { Kinds = kinds; }
    }

    /// <summary>One mapping from a cockpit control to an output.</summary>
    public sealed class Binding : ICustomTypeDescriptor
    {
        [Category("1. Source"), Description("Steel Battalion control that drives this binding. Use 'Learn' to pick it by pressing it."), RefreshProperties(RefreshProperties.All)]
        public ControlId Control { get; set; }

        [Category("1. Source"), Description("Always = active in both layers. NormalOnly / ShiftedOnly depend on the profile's Shift control.")]
        public Layer Layer { get; set; }

        [Category("2. Output"), Description("What this control produces."), RefreshProperties(RefreshProperties.All)]
        public OutputKind Output { get; set; }

        [Category("2. Output"), ShowFor(OutputKind.XboxButton), Description("Virtual Xbox 360 button.")]
        public XboxButton XboxButton { get; set; }

        [Category("2. Output"), ShowFor(OutputKind.XboxAxis), Description("Virtual Xbox 360 stick axis or trigger.")]
        public XboxAxis XboxAxis { get; set; }

        [Category("2. Output"), ShowFor(OutputKind.Key), Description("Keyboard key (sent as a hardware scan code).")]
        public Keys Key { get; set; }
        [Category("2. Output"), ShowFor(OutputKind.Key), Description("Hold Ctrl with the key.")]
        public bool WithCtrl { get; set; }
        [Category("2. Output"), ShowFor(OutputKind.Key), Description("Hold Shift with the key.")]
        public bool WithShift { get; set; }
        [Category("2. Output"), ShowFor(OutputKind.Key), Description("Hold Alt with the key.")]
        public bool WithAlt { get; set; }

        [Category("2. Output"), ShowFor(OutputKind.MouseButton), Description("Mouse button or wheel notch.")]
        public MouseButtonId MouseButton { get; set; }

        [Category("2. Output"), ShowFor(OutputKind.MouseMove), Description("Mouse axis moved by this control.")]
        public MouseAxis MouseAxis { get; set; }
        [Category("2. Output"), ShowFor(OutputKind.MouseMove), Description("Pixels per second at full deflection.")]
        public double MouseSpeed { get; set; }

        [Category("3. Button behaviour"), ShowFor(OutputKind.XboxButton, OutputKind.Key, OutputKind.MouseButton, ButtonLikeOnly = true),
         Description("Hold = mirror the control. Pulse = short tap on press. PulseOnChange = tap whenever a latching switch flips either way. Toggle = press once on, press again off.")]
        public ButtonMode Mode { get; set; }
        [Category("3. Button behaviour"), ShowFor(OutputKind.XboxButton, OutputKind.Key, OutputKind.MouseButton, ButtonLikeOnly = true), Description("Length of a pulse in milliseconds.")]
        public int PulseMs { get; set; }

        [Category("4. Axis tuning"), ShowFor(OutputKind.XboxButton, OutputKind.Key, OutputKind.MouseButton, OutputKind.XboxAxis, AxisSourceOnly = true),
         Description("For an axis driving a button: which direction presses it. For a button driving a stick: which way the stick is pushed.")]
        public AxisDirection Direction { get; set; }
        [Category("4. Axis tuning"), ShowFor(OutputKind.XboxButton, OutputKind.Key, OutputKind.MouseButton, AxisSourceOnly = true), Description("Axis position (0..1) at which the button counts as pressed.")]
        public double Threshold { get; set; }
        [Category("4. Axis tuning"), ShowFor(OutputKind.XboxAxis, OutputKind.MouseMove, OutputKind.XboxButton, OutputKind.Key, OutputKind.MouseButton, AxisSourceOnly = true), Description("Flip the axis direction.")]
        public bool Invert { get; set; }
        [Category("4. Axis tuning"), ShowFor(OutputKind.XboxAxis, OutputKind.MouseMove, AxisSourceOnly = true), Description("Dead zone (0..0.9) around centre (or rest, for pedals).")]
        public double Deadzone { get; set; }
        [Category("4. Axis tuning"), ShowFor(OutputKind.XboxAxis, OutputKind.MouseMove, AxisSourceOnly = true), Description("Response curve exponent. 1 = linear, 2 = finer control near centre.")]
        public double Curve { get; set; }
        [Category("4. Axis tuning"), ShowFor(OutputKind.XboxAxis, AxisSourceOnly = true), Description("For a pedal/tuner driving a stick: map rest..full onto the stick's full -1..+1 travel instead of 0..+1.")]
        public bool OneSidedToFullRange { get; set; }
        [Category("4. Axis tuning"), ShowFor(OutputKind.XboxAxis, AxisSourceOnly = true), Description("Scale applied after the curve (1 = 100%).")]
        public double Scale { get; set; }

        [Category("5. Notes"), Description("Free text, e.g. what this does in-game.")]
        public string Note { get; set; }

        public Binding()
        {
            MouseSpeed = 1200; PulseMs = 60; Threshold = 0.5; Curve = 1.0; Scale = 1.0; Deadzone = 0.05; Note = "";
        }

        public Binding Clone() { return (Binding)MemberwiseClone(); }

        [Browsable(false)]
        public bool SourceIsAxis { get { return Sbc.Info(Control).Kind == ControlKind.Axis; } }

        public string TargetText()
        {
            switch (Output)
            {
                case OutputKind.XboxButton: return "Xbox " + XboxButton;
                case OutputKind.XboxAxis: return "Xbox " + XboxAxis;
                case OutputKind.Key:
                    string s = (WithCtrl ? "Ctrl+" : "") + (WithShift ? "Shift+" : "") + (WithAlt ? "Alt+" : "");
                    return "Key " + s + KeyName(Key);
                case OutputKind.MouseButton: return "Mouse " + MouseButton;
                case OutputKind.MouseMove: return "Mouse move " + MouseAxis;
                default: return "(none)";
            }
        }

        static string KeyName(Keys k)
        {
            switch (k)
            {
                case Keys.PageUp: return "PageUp";
                case Keys.PageDown: return "PageDown";
                case Keys.Return: return "Enter";
                case Keys.Capital: return "CapsLock";
                default: return k.ToString();
            }
        }

        // ---- ICustomTypeDescriptor: hide properties that don't apply to the current output ----
        AttributeCollection ICustomTypeDescriptor.GetAttributes() { return TypeDescriptor.GetAttributes(this, true); }
        string ICustomTypeDescriptor.GetClassName() { return TypeDescriptor.GetClassName(this, true); }
        string ICustomTypeDescriptor.GetComponentName() { return TypeDescriptor.GetComponentName(this, true); }
        TypeConverter ICustomTypeDescriptor.GetConverter() { return TypeDescriptor.GetConverter(this, true); }
        EventDescriptor ICustomTypeDescriptor.GetDefaultEvent() { return TypeDescriptor.GetDefaultEvent(this, true); }
        PropertyDescriptor ICustomTypeDescriptor.GetDefaultProperty() { return TypeDescriptor.GetDefaultProperty(this, true); }
        object ICustomTypeDescriptor.GetEditor(Type t) { return TypeDescriptor.GetEditor(this, t, true); }
        EventDescriptorCollection ICustomTypeDescriptor.GetEvents() { return TypeDescriptor.GetEvents(this, true); }
        EventDescriptorCollection ICustomTypeDescriptor.GetEvents(Attribute[] a) { return TypeDescriptor.GetEvents(this, a, true); }
        PropertyDescriptorCollection ICustomTypeDescriptor.GetProperties() { return Filter(TypeDescriptor.GetProperties(this, true)); }
        PropertyDescriptorCollection ICustomTypeDescriptor.GetProperties(Attribute[] a) { return Filter(TypeDescriptor.GetProperties(this, a, true)); }
        object ICustomTypeDescriptor.GetPropertyOwner(PropertyDescriptor pd) { return this; }

        PropertyDescriptorCollection Filter(PropertyDescriptorCollection props)
        {
            var list = new List<PropertyDescriptor>();
            bool axis = SourceIsAxis;
            foreach (PropertyDescriptor p in props)
            {
                var sf = p.Attributes[typeof(ShowForAttribute)] as ShowForAttribute;
                if (sf != null)
                {
                    if (!sf.Kinds.Contains(Output)) continue;
                    if (sf.ButtonLikeOnly && axis && Output == OutputKind.XboxAxis) continue;
                    if (sf.AxisSourceOnly && !axis)
                    {
                        // Direction still matters for a button pushing a stick.
                        if (!(p.Name == "Direction" && Output == OutputKind.XboxAxis)) continue;
                    }
                }
                list.Add(p);
            }
            return new PropertyDescriptorCollection(list.ToArray());
        }
    }

    public sealed class Profile
    {
        public string Name { get; set; }
        public ControlId ShiftControl { get; set; }
        public List<Binding> Bindings { get; set; }

        public Profile() { Name = "New profile"; Bindings = new List<Binding>(); }

        [XmlIgnore] public readonly object Sync = new object();

        public Binding[] Snapshot() { lock (Sync) return Bindings.ToArray(); }

        static readonly XmlSerializer ser = new XmlSerializer(typeof(Profile));

        public void Save(string path)
        {
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            string tmp = path + ".tmp";
            lock (Sync) using (var fs = File.Create(tmp)) ser.Serialize(fs, this);
            if (File.Exists(path)) File.Delete(path);
            File.Move(tmp, path);
        }

        public static Profile Load(string path)
        {
            using (var fs = File.OpenRead(path)) return (Profile)ser.Deserialize(fs);
        }
    }

    public sealed class AxisCalibration
    {
        public ControlId Axis { get; set; }
        public int Min { get; set; }
        public int Center { get; set; }
        public int Max { get; set; }
    }

    public sealed class AppSettings
    {
        public string ActiveProfile { get; set; }
        public bool LedFeedback { get; set; }
        public int LedBright { get; set; }
        public int LedDim { get; set; }
        public bool StartMinimized { get; set; }
        public bool CloseToTray { get; set; }
        public bool OutputEnabled { get; set; }
        public List<AxisCalibration> Calibration { get; set; }

        public AppSettings()
        {
            LedFeedback = true; LedBright = 15; LedDim = 2; CloseToTray = true; OutputEnabled = true;
            Calibration = new List<AxisCalibration>();
        }

        public AxisCalibration Cal(ControlId axis)
        {
            foreach (var c in Calibration) if (c.Axis == axis) return c;
            var i = Sbc.Info(axis);
            var n = new AxisCalibration { Axis = axis, Min = i.RawMin, Center = i.RawCenter, Max = i.RawMax };
            Calibration.Add(n);
            return n;
        }

        public static string Folder
        {
            get { return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "SBBridge"); }
        }
        public static string ProfileFolder { get { return Path.Combine(Folder, "Profiles"); } }
        static string FilePath { get { return Path.Combine(Folder, "settings.xml"); } }
        static readonly XmlSerializer ser = new XmlSerializer(typeof(AppSettings));

        public static AppSettings Load()
        {
            try { if (File.Exists(FilePath)) using (var fs = File.OpenRead(FilePath)) return (AppSettings)ser.Deserialize(fs); }
            catch { }
            return new AppSettings();
        }

        public void Save()
        {
            try
            {
                Directory.CreateDirectory(Folder);
                using (var fs = File.Create(FilePath)) ser.Serialize(fs, this);
            }
            catch { }
        }
    }
}
