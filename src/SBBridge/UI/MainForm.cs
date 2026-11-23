using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using Microsoft.Win32;
using SBBridge.Core;
using Binding = SBBridge.Core.Binding;

namespace SBBridge.UI
{
    public sealed class MainForm : Form
    {
        readonly Engine engine;
        readonly AppSettings settings;
        readonly ControllerState state = new ControllerState();
        readonly System.Windows.Forms.Timer uiTimer = new System.Windows.Forms.Timer { Interval = 33 };
        readonly System.Windows.Forms.Timer saveTimer = new System.Windows.Forms.Timer { Interval = 800 };
        bool exiting, startHidden, balloonShown;

        // header
        Label lblUsb, lblPad; Button btnFixDriver, btnFixPad;
        CheckBox chkOutput;
        ComboBox cboProfile;
        // live
        ListView lvLive; Label lblRaw, lblPadOut;
        readonly Dictionary<ControlId, ListViewItem> liveItems = new Dictionary<ControlId, ListViewItem>();
        // bindings
        SplitContainer split; bool splitSet; ListView lvBind; PropertyGrid grid; ComboBox cboShift; Button btnLearn; Label lblLearn;
        bool learnArmed; readonly ControllerState learnBase = new ControllerState();
        // calibration
        ListView lvCal; Button btnCalStart, btnCalFinish; bool calibrating;
        readonly Dictionary<ControlId, int[]> calSeen = new Dictionary<ControlId, int[]>();
        // settings
        CheckBox chkLed, chkStartMin, chkTray, chkStartup; NumericUpDown numBright, numDim;
        NotifyIcon tray; ToolStripMenuItem trayOutput;

        Profile profile; string profilePath;

        public MainForm(Engine engine, AppSettings settings, bool startMinimized)
        {
            this.engine = engine; this.settings = settings; startHidden = startMinimized;
            Text = "Steel Battalion Bridge";
            Width = 1100; Height = 720; MinimumSize = new Size(900, 560);
            StartPosition = FormStartPosition.CenterScreen;
            Font = new Font("Segoe UI", 9f);
            Icon = MakeIcon();

            BuildHeader();
            var tabs = new TabControl { Dock = DockStyle.Fill };
            tabs.TabPages.Add(BuildLiveTab());
            tabs.TabPages.Add(BuildBindingsTab());
            tabs.TabPages.Add(BuildCalibrationTab());
            tabs.TabPages.Add(BuildSettingsTab());
            Controls.Add(tabs);
            tabs.BringToFront();
            BuildTray();

            engine.OutputEnabled = settings.OutputEnabled;
            chkOutput.Checked = settings.OutputEnabled;

            EnsureDefaultProfiles();
            ReloadProfileList(settings.ActiveProfile);

            uiTimer.Tick += (s, e) => UiTick();
            uiTimer.Start();
            saveTimer.Tick += (s, e) => { saveTimer.Stop(); SaveProfile(); };
        }

        protected override void SetVisibleCore(bool value)
        {
            if (startHidden) { startHidden = false; value = false; if (!IsHandleCreated) CreateHandle(); }
            base.SetVisibleCore(value);
        }

        // ------------------------------------------------------------------ header
        void BuildHeader()
        {
            var p = new TableLayoutPanel { Dock = DockStyle.Top, Height = 70, ColumnCount = 4, Padding = new Padding(8, 6, 8, 2) };
            p.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
            p.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
            p.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
            p.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
            var status = new FlowLayoutPanel { Dock = DockStyle.Fill, FlowDirection = FlowDirection.TopDown, WrapContents = false, AutoSize = true };
            lblUsb = new Label { AutoSize = true, Text = "Controller: ..." };
            lblPad = new Label { AutoSize = true, Text = "Virtual pad: ..." };
            var r1 = new FlowLayoutPanel { AutoSize = true, WrapContents = false, Margin = Padding.Empty };
            var r2 = new FlowLayoutPanel { AutoSize = true, WrapContents = false, Margin = Padding.Empty };
            btnFixDriver = new Button { Text = "Set up driver...", AutoSize = true, Visible = false, Margin = new Padding(8, 0, 0, 0) };
            btnFixDriver.Click += (s, e) => FixDriver();
            btnFixPad = new Button { Text = "Install ViGEmBus...", AutoSize = true, Visible = false, Margin = new Padding(8, 0, 0, 0) };
            btnFixPad.Click += (s, e) => FixPad();
            lblUsb.Margin = lblPad.Margin = new Padding(0, 5, 0, 0);
            r1.Controls.Add(lblUsb); r1.Controls.Add(btnFixDriver);
            r2.Controls.Add(lblPad); r2.Controls.Add(btnFixPad);
            status.Controls.Add(r1); status.Controls.Add(r2);
            p.Controls.Add(status, 0, 0);

            chkOutput = new CheckBox { Text = "Output enabled", AutoSize = true, Anchor = AnchorStyles.Left, Margin = new Padding(8, 12, 16, 0) };
            chkOutput.CheckedChanged += (s, e) => { engine.OutputEnabled = chkOutput.Checked; settings.OutputEnabled = chkOutput.Checked; settings.Save(); if (trayOutput != null) trayOutput.Checked = chkOutput.Checked; };
            p.Controls.Add(chkOutput, 1, 0);

            var pf = new FlowLayoutPanel { AutoSize = true, WrapContents = false, Margin = new Padding(0, 6, 0, 0) };
            pf.Controls.Add(new Label { Text = "Profile:", AutoSize = true, Margin = new Padding(0, 7, 4, 0) });
            cboProfile = new ComboBox { DropDownStyle = ComboBoxStyle.DropDownList, Width = 260 };
            cboProfile.SelectedIndexChanged += (s, e) => { if (cboProfile.SelectedItem != null) LoadProfile((string)cboProfile.SelectedItem); };
            pf.Controls.Add(cboProfile);
            p.Controls.Add(pf, 2, 0);

            var bf = new FlowLayoutPanel { AutoSize = true, WrapContents = false, Margin = new Padding(4, 6, 0, 0) };
            bf.Controls.Add(Btn("New", (s, e) => NewProfile(false)));
            bf.Controls.Add(Btn("Copy", (s, e) => NewProfile(true)));
            bf.Controls.Add(Btn("Rename", (s, e) => RenameProfile()));
            bf.Controls.Add(Btn("Delete", (s, e) => DeleteProfile()));
            bf.Controls.Add(Btn("Folder", (s, e) => { Directory.CreateDirectory(AppSettings.ProfileFolder); System.Diagnostics.Process.Start("explorer.exe", "\"" + AppSettings.ProfileFolder + "\""); }));
            p.Controls.Add(bf, 3, 0);
            Controls.Add(p);
        }

        static Button Btn(string text, EventHandler h)
        {
            var b = new Button { Text = text, AutoSize = true, AutoSizeMode = AutoSizeMode.GrowAndShrink, Padding = new Padding(4, 1, 4, 1) };
            b.Click += h; return b;
        }

        // ------------------------------------------------------------------ live tab
        TabPage BuildLiveTab()
        {
            var tp = new TabPage("Live view");
            lvLive = MakeList(new[] { "Control", "State", "Value" }, new[] { 300, 90, 260 });
            lvLive.Dock = DockStyle.Fill;
            ControlKind lastKind = ControlKind.None;
            foreach (var c in Sbc.All)
            {
                if (c.Kind == ControlKind.Event) continue;
                var it = new ListViewItem(new[] { c.Name, "", "" }) { Tag = c.Id };
                if (c.Kind != lastKind) it.Group = null;
                lastKind = c.Kind;
                lvLive.Items.Add(it); liveItems[c.Id] = it;
            }
            var right = new Panel { Dock = DockStyle.Right, Width = 380, Padding = new Padding(8) };
            lblPadOut = new Label { Dock = DockStyle.Top, Height = 230, Font = new Font("Consolas", 9.5f), Text = "" };
            lblRaw = new Label { Dock = DockStyle.Top, Height = 110, Font = new Font("Consolas", 9.5f) };
            var test = Btn("Flash all LEDs", (s, e) => engine.TestLeds(15));
            test.Dock = DockStyle.Top;
            var hint = new Label { Dock = DockStyle.Top, Height = 60, Text = "Move any control to see it here. 'Virtual Xbox pad' shows exactly what games and Steam Input receive." };
            right.Controls.Add(test); right.Controls.Add(lblPadOut); right.Controls.Add(lblRaw); right.Controls.Add(hint);
            tp.Controls.Add(lvLive); tp.Controls.Add(right);
            return tp;
        }

        // ------------------------------------------------------------------ bindings tab
        TabPage BuildBindingsTab()
        {
            var tp = new TabPage("Bindings");
            split = new SplitContainer { Dock = DockStyle.Fill, FixedPanel = FixedPanel.Panel2 };
            tp.Layout += (s, e) => { if (!splitSet && split.Width > 700) { split.SplitterDistance = split.Width - 400; splitSet = true; } };
            tp.Controls.Add(split);

            var bar = new FlowLayoutPanel { Dock = DockStyle.Top, AutoSize = true, Padding = new Padding(2) };
            bar.Controls.Add(Btn("Add", (s, e) => AddBinding(new Binding { Control = ControlId.None, Output = OutputKind.XboxButton })));
            bar.Controls.Add(Btn("Duplicate", (s, e) => { var b = Selected(); if (b != null) AddBinding(b.Clone()); }));
            bar.Controls.Add(Btn("Remove", (s, e) => RemoveSelected()));
            btnLearn = Btn("Learn (press a control)", (s, e) => ToggleLearn());
            bar.Controls.Add(btnLearn);
            bar.Controls.Add(Btn("Sort", (s, e) => { lock (profile.Sync) profile.Bindings.Sort((a, b) => ((int)a.Control).CompareTo((int)b.Control)); RefreshBindings(); MarkDirty(); }));
            bar.Controls.Add(new Label { Text = "  Shift control:", AutoSize = true, Margin = new Padding(6, 8, 2, 0) });
            cboShift = new ComboBox { DropDownStyle = ComboBoxStyle.DropDownList, Width = 210 };
            cboShift.Items.Add(ControlId.None);
            foreach (var c in Sbc.All) if (c.Kind == ControlKind.Button || c.Kind == ControlKind.VirtualButton) cboShift.Items.Add(c.Id);
            cboShift.SelectedIndexChanged += (s, e) => { if (profile != null && cboShift.SelectedItem != null && profile.ShiftControl != (ControlId)cboShift.SelectedItem) { profile.ShiftControl = (ControlId)cboShift.SelectedItem; MarkDirty(); } };
            bar.Controls.Add(cboShift);
            lblLearn = new Label { Dock = DockStyle.Bottom, Height = 22, ForeColor = Color.DarkOrange, Text = "" };

            lvBind = MakeList(new[] { "Control", "Layer", "Output", "Mode", "Note" }, new[] { 210, 70, 170, 95, 200 });
            lvBind.Dock = DockStyle.Fill;
            lvBind.MultiSelect = false;
            lvBind.SelectedIndexChanged += (s, e) => grid.SelectedObject = Selected();
            lvBind.KeyDown += (s, e) => { if (e.KeyCode == Keys.Delete) RemoveSelected(); };
            split.Panel1.Controls.Add(lvBind); split.Panel1.Controls.Add(bar); split.Panel1.Controls.Add(lblLearn);

            grid = new PropertyGrid { Dock = DockStyle.Fill, ToolbarVisible = false, PropertySort = PropertySort.Categorized, HelpVisible = true };
            grid.PropertyValueChanged += (s, e) => { var it = SelectedItem(); if (it != null) FillBindingItem(it, (Binding)it.Tag); grid.Refresh(); MarkDirty(); };
            var help = new Label { Dock = DockStyle.Top, Height = 48, Text = "Select a binding to edit it. A control can have several bindings (e.g. one per layer). Changes apply instantly and save automatically." };
            split.Panel2.Controls.Add(grid); split.Panel2.Controls.Add(help);
            return tp;
        }

        Binding Selected() { var it = SelectedItem(); return it == null ? null : (Binding)it.Tag; }
        ListViewItem SelectedItem() { return lvBind.SelectedItems.Count == 0 ? null : lvBind.SelectedItems[0]; }

        void AddBinding(Binding b)
        {
            lock (profile.Sync) profile.Bindings.Add(b);
            var it = new ListViewItem(new string[5]) { Tag = b };
            FillBindingItem(it, b);
            lvBind.Items.Add(it);
            it.Selected = true; it.EnsureVisible();
            MarkDirty();
        }

        void RemoveSelected()
        {
            var it = SelectedItem(); if (it == null) return;
            int idx = it.Index;
            lock (profile.Sync) profile.Bindings.Remove((Binding)it.Tag);
            lvBind.Items.Remove(it);
            if (lvBind.Items.Count > 0) lvBind.Items[Math.Min(idx, lvBind.Items.Count - 1)].Selected = true;
            else grid.SelectedObject = null;
            MarkDirty();
        }

        static void FillBindingItem(ListViewItem it, Binding b)
        {
            it.SubItems[0].Text = Sbc.Info(b.Control).Name;
            it.SubItems[1].Text = b.Layer == Layer.Always ? "" : (b.Layer == Layer.ShiftedOnly ? "Shift" : "Normal");
            it.SubItems[2].Text = b.TargetText();
            bool buttonLike = b.Output == OutputKind.XboxButton || b.Output == OutputKind.Key || b.Output == OutputKind.MouseButton;
            it.SubItems[3].Text = buttonLike ? (b.SourceIsAxis ? b.Direction + " >" + b.Threshold.ToString("0.##") : b.Mode.ToString()) : (b.Invert ? "Inverted" : "");
            it.SubItems[4].Text = b.Note;
        }

        void RefreshBindings()
        {
            lvBind.BeginUpdate();
            lvBind.Items.Clear();
            foreach (var b in profile.Snapshot())
            {
                var it = new ListViewItem(new string[5]) { Tag = b };
                FillBindingItem(it, b);
                lvBind.Items.Add(it);
            }
            lvBind.EndUpdate();
            grid.SelectedObject = null;
            cboShift.SelectedItem = profile.ShiftControl;
        }

        void ToggleLearn()
        {
            learnArmed = !learnArmed;
            if (learnArmed) { engine.GetState(learnBase); lblLearn.Text = "Learning: press a button, flip a switch or push an axis on the controller... (click again to cancel)"; btnLearn.Text = "Cancel learn"; }
            else { lblLearn.Text = ""; btnLearn.Text = "Learn (press a control)"; }
        }

        void LearnTick()
        {
            if (!learnArmed || !state.Valid) return;
            if (!learnBase.Valid) { state.CopyTo(learnBase); return; }
            ControlId hit = ControlId.None;
            foreach (var c in Sbc.All)
            {
                if (c.Kind == ControlKind.Button && state.Down[(int)c.Id] != learnBase.Down[(int)c.Id]) { hit = c.Id; break; }
                if (c.Kind == ControlKind.VirtualButton && state.Down[(int)c.Id] && !learnBase.Down[(int)c.Id]) { hit = c.Id; break; }
                if (Sbc.IsCalibratable(c.Id))
                {
                    double a = Mapper.Normalize(c.Id, state, settings), b = Mapper.Normalize(c.Id, learnBase, settings);
                    if (Math.Abs(a - b) > 0.45) { hit = c.Id; break; }
                }
            }
            if (hit == ControlId.None) return;
            ToggleLearn();
            var sel = Selected();
            bool axis = Sbc.Info(hit).Kind == ControlKind.Axis;
            if (sel == null || sel.Control != ControlId.None)
            {
                var nb = new Binding { Control = hit, Output = axis ? OutputKind.XboxAxis : OutputKind.XboxButton };
                AddBinding(nb);
            }
            else
            {
                sel.Control = hit;
                if (axis && sel.Output == OutputKind.XboxButton) sel.Output = OutputKind.XboxAxis;
                FillBindingItem(SelectedItem(), sel); grid.Refresh(); MarkDirty();
            }
            lblLearn.Text = "Learned: " + Sbc.Info(hit).Name;
        }

        // ------------------------------------------------------------------ calibration tab
        TabPage BuildCalibrationTab()
        {
            var tp = new TabPage("Calibration");
            lvCal = MakeList(new[] { "Axis", "Raw", "Min", "Center", "Max", "Output" }, new[] { 260, 70, 70, 70, 70, 120 });
            lvCal.Dock = DockStyle.Fill;
            foreach (var c in Sbc.All) if (Sbc.IsCalibratable(c.Id)) lvCal.Items.Add(new ListViewItem(new[] { c.Name, "", "", "", "", "" }) { Tag = c.Id });
            var bar = new FlowLayoutPanel { Dock = DockStyle.Top, AutoSize = true, Padding = new Padding(4) };
            btnCalStart = Btn("Start calibration", (s, e) => StartCal());
            btnCalFinish = Btn("Finish && save", (s, e) => FinishCal()); btnCalFinish.Enabled = false;
            bar.Controls.Add(btnCalStart); bar.Controls.Add(btnCalFinish);
            bar.Controls.Add(Btn("Reset to defaults", (s, e) => { settings.Calibration.Clear(); settings.Save(); }));
            var info = new Label
            {
                Dock = DockStyle.Top, Height = 54,
                Text = "1) Click Start.  2) Move both levers, the sight-change stick and all three pedals through their full range several times.\r\n" +
                       "3) Let go of everything (levers centred, pedals released) and click Finish. Centre is taken from the resting position."
            };
            tp.Controls.Add(lvCal); tp.Controls.Add(info); tp.Controls.Add(bar);
            return tp;
        }

        void StartCal()
        {
            calSeen.Clear(); calibrating = true;
            btnCalStart.Enabled = false; btnCalFinish.Enabled = true;
        }

        void FinishCal()
        {
            calibrating = false; btnCalStart.Enabled = true; btnCalFinish.Enabled = false;
            foreach (var kv in calSeen)
            {
                var cal = settings.Cal(kv.Key);
                var info = Sbc.Info(kv.Key);
                int lo = kv.Value[0], hi = kv.Value[1];
                if (hi - lo < 100) continue; // axis not moved - keep old values
                cal.Min = lo; cal.Max = hi;
                cal.Center = info.Bipolar ? state.RawAxis[(int)kv.Key] : lo;
            }
            settings.Save();
        }

        // ------------------------------------------------------------------ settings tab
        TabPage BuildSettingsTab()
        {
            var tp = new TabPage("Settings && setup");
            var left = new FlowLayoutPanel { Dock = DockStyle.Left, Width = 330, FlowDirection = FlowDirection.TopDown, Padding = new Padding(10), WrapContents = false };
            chkLed = new CheckBox { Text = "Light cockpit LEDs when buttons are pressed", AutoSize = true, Checked = settings.LedFeedback };
            chkLed.CheckedChanged += (s, e) => { settings.LedFeedback = chkLed.Checked; settings.Save(); };
            numBright = new NumericUpDown { Minimum = 0, Maximum = 15, Value = Math.Max(0, Math.Min(15, settings.LedBright)), Width = 60 };
            numBright.ValueChanged += (s, e) => { settings.LedBright = (int)numBright.Value; settings.Save(); };
            numDim = new NumericUpDown { Minimum = 0, Maximum = 15, Value = Math.Max(0, Math.Min(15, settings.LedDim)), Width = 60 };
            numDim.ValueChanged += (s, e) => { settings.LedDim = (int)numDim.Value; settings.Save(); };
            chkStartMin = new CheckBox { Text = "Start minimized to tray", AutoSize = true, Checked = settings.StartMinimized };
            chkStartMin.CheckedChanged += (s, e) => { settings.StartMinimized = chkStartMin.Checked; settings.Save(); };
            chkTray = new CheckBox { Text = "Closing the window keeps it running in the tray", AutoSize = true, Checked = settings.CloseToTray };
            chkTray.CheckedChanged += (s, e) => { settings.CloseToTray = chkTray.Checked; settings.Save(); };
            chkStartup = new CheckBox { Text = "Start with Windows", AutoSize = true, Checked = IsStartupEnabled() };
            chkStartup.CheckedChanged += (s, e) => SetStartup(chkStartup.Checked);

            left.Controls.Add(chkLed);
            left.Controls.Add(Row("Pressed brightness (0-15):", numBright));
            left.Controls.Add(Row("Idle brightness (0-15):", numDim));
            left.Controls.Add(new Label { Height = 12 });
            left.Controls.Add(chkStartMin); left.Controls.Add(chkTray); left.Controls.Add(chkStartup);

            var help = new TextBox { Dock = DockStyle.Fill, Multiline = true, ReadOnly = true, ScrollBars = ScrollBars.Vertical, Font = new Font("Segoe UI", 9.5f), BackColor = SystemColors.Window };
            help.Text = string.Join("\r\n", new[] {
                "SETUP",
                "The installer (SBBridge-Setup.exe) does all of this for you. If a status line at the top is red,",
                "click the button next to it. Manual steps, for the portable version:",
                "",
                "1. Bind WinUSB to the controller (Microsoft's own signed USB driver - nothing custom is installed).",
                "   Device Manager > Other devices > 'Unknown device' (USB\\VID_0A7B&PID_D000) > Update driver >",
                "   Browse my computer > Let me pick > Universal Serial Bus devices > 'WinUsb Device' > Next > Yes.",
                "   If that entry isn't offered, use Zadig (zadig.akeo.ie): Options > List All Devices, pick the",
                "   0A7B:D000 device, choose WinUSB, click Install Driver.",
                "",
                "2. Install ViGEmBus (github.com/nefarius/ViGEmBus/releases) and reboot if asked. This is what",
                "   creates the virtual Xbox 360 controller that XInput games and Steam Input see.",
                "",
                "3. Pick a profile, check the Live view, run Calibration once, then adjust Bindings.",
                "",
                "STEAM",
                "The virtual pad appears as a standard 'Xbox 360 Controller'. Steam Input recognises it like any",
                "Xbox pad, so you can also remap it per-game in Steam. Cockpit buttons bound to keys work everywhere.",
                "Tip: the Steel Battalion itself is not visible to Steam (it uses WinUSB), so it is never doubled up.",
                "",
                "WHY KEYS?",
                "An Xbox pad has ~15 buttons and 6 axes; the cockpit has 40 buttons, 5 switches, 8 axes, a gear",
                "lever and a dial. The main flight controls ride on the pad; everything else goes to keys you bind",
                "in-game - or use a Shift control to give pad buttons a second layer.",
                "",
                "Settings and profiles live in: " + AppSettings.Folder,
            });
            tp.Controls.Add(help); tp.Controls.Add(left);
            return tp;
        }

        static Control Row(string label, Control c)
        {
            var f = new FlowLayoutPanel { AutoSize = true, WrapContents = false };
            f.Controls.Add(new Label { Text = label, AutoSize = true, Margin = new Padding(20, 6, 6, 0) });
            f.Controls.Add(c);
            return f;
        }

        const string RunKey = @"Software\Microsoft\Windows\CurrentVersion\Run";
        static bool IsStartupEnabled()
        {
            using (var k = Registry.CurrentUser.OpenSubKey(RunKey)) return k != null && k.GetValue("SBBridge") != null;
        }
        static void SetStartup(bool on)
        {
            using (var k = Registry.CurrentUser.CreateSubKey(RunKey))
            {
                if (on) k.SetValue("SBBridge", "\"" + Application.ExecutablePath + "\" --minimized");
                else k.DeleteValue("SBBridge", false);
            }
        }

        // ------------------------------------------------------------------ tray
        void BuildTray()
        {
            var menu = new ContextMenuStrip();
            menu.Items.Add("Open", null, (s, e) => ShowWindow());
            trayOutput = new ToolStripMenuItem("Output enabled") { CheckOnClick = true, Checked = settings.OutputEnabled };
            trayOutput.CheckedChanged += (s, e) => chkOutput.Checked = trayOutput.Checked;
            menu.Items.Add(trayOutput);
            menu.Items.Add(new ToolStripSeparator());
            menu.Items.Add("Exit", null, (s, e) => { exiting = true; Close(); });
            tray = new NotifyIcon { Icon = Icon, Text = "Steel Battalion Bridge", Visible = true, ContextMenuStrip = menu };
            tray.DoubleClick += (s, e) => ShowWindow();
        }

        void ShowWindow() { Show(); if (WindowState == FormWindowState.Minimized) WindowState = FormWindowState.Normal; Activate(); }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            if (!exiting && settings.CloseToTray && e.CloseReason == CloseReason.UserClosing)
            {
                e.Cancel = true; Hide();
                if (!balloonShown) { tray.ShowBalloonTip(3000, "Still running", "Steel Battalion Bridge keeps the controller active from the tray.", ToolTipIcon.Info); balloonShown = true; }
                return;
            }
            saveTimer.Stop(); SaveProfile();
            tray.Visible = false;
            base.OnFormClosing(e);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) { uiTimer.Dispose(); saveTimer.Dispose(); if (tray != null) tray.Dispose(); }
            base.Dispose(disposing);
        }

        // ------------------------------------------------------------------ profiles
        void EnsureDefaultProfiles()
        {
            Directory.CreateDirectory(AppSettings.ProfileFolder);
            if (Directory.GetFiles(AppSettings.ProfileFolder, "*.xml").Length > 0) return;
            foreach (var p in DefaultProfiles.All()) p.Save(PathFor(p.Name));
        }

        static string PathFor(string name)
        {
            foreach (var ch in Path.GetInvalidFileNameChars()) name = name.Replace(ch, '_');
            return Path.Combine(AppSettings.ProfileFolder, name + ".xml");
        }

        void ReloadProfileList(string select)
        {
            var names = Directory.GetFiles(AppSettings.ProfileFolder, "*.xml").Select(Path.GetFileNameWithoutExtension).OrderBy(n => n).ToList();
            if (names.Count == 0) { foreach (var p in DefaultProfiles.All()) p.Save(PathFor(p.Name)); ReloadProfileList(select); return; }
            cboProfile.Items.Clear();
            foreach (var n in names) cboProfile.Items.Add(n);
            int idx = select == null ? -1 : names.IndexOf(select);
            cboProfile.SelectedIndex = idx >= 0 ? idx : 0;
        }

        void LoadProfile(string name)
        {
            saveTimer.Stop(); SaveProfile();
            Profile p;
            try { p = Profile.Load(PathFor(name)); }
            catch (Exception ex) { MessageBox.Show("Could not load profile: " + ex.Message, "SB Bridge"); return; }
            p.Name = name;
            profile = p; profilePath = PathFor(name);
            engine.Profile = p;
            settings.ActiveProfile = name; settings.Save();
            RefreshBindings();
        }

        void MarkDirty() { saveTimer.Stop(); saveTimer.Start(); }

        void SaveProfile()
        {
            if (profile == null || profilePath == null) return;
            try { profile.Save(profilePath); } catch (Exception ex) { lblLearn.Text = "Save failed: " + ex.Message; }
        }

        void NewProfile(bool copy)
        {
            string name = Prompt.Show(this, copy ? "Copy profile as:" : "New profile name:", copy ? profile.Name + " copy" : "My profile");
            if (string.IsNullOrWhiteSpace(name)) return;
            if (File.Exists(PathFor(name))) { MessageBox.Show("A profile with that name already exists."); return; }
            saveTimer.Stop(); SaveProfile();
            Profile p;
            if (copy) { p = Profile.Load(profilePath); p.Name = name; }
            else p = new Profile { Name = name };
            p.Save(PathFor(name));
            ReloadProfileList(name);
        }

        void RenameProfile()
        {
            string name = Prompt.Show(this, "Rename profile to:", profile.Name);
            if (string.IsNullOrWhiteSpace(name) || name == profile.Name) return;
            if (File.Exists(PathFor(name))) { MessageBox.Show("A profile with that name already exists."); return; }
            saveTimer.Stop(); SaveProfile();
            File.Move(profilePath, PathFor(name));
            profilePath = null;
            ReloadProfileList(name);
        }

        void DeleteProfile()
        {
            if (MessageBox.Show("Delete profile '" + profile.Name + "'? (It goes to the Recycle Bin.)", "SB Bridge", MessageBoxButtons.YesNo) != DialogResult.Yes) return;
            saveTimer.Stop();
            Microsoft.VisualBasic.FileIO.FileSystem.DeleteFile(profilePath, Microsoft.VisualBasic.FileIO.UIOption.OnlyErrorDialogs, Microsoft.VisualBasic.FileIO.RecycleOption.SendToRecycleBin);
            profilePath = null; profile = null;
            ReloadProfileList(null);
        }

        // ------------------------------------------------------------------ driver helpers
        static string AppDir { get { return Path.GetDirectoryName(Application.ExecutablePath); } }

        int RunElevated(string exe, string args)
        {
            try
            {
                var psi = new System.Diagnostics.ProcessStartInfo(exe, args) { Verb = "runas", UseShellExecute = true, WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden };
                using (var proc = System.Diagnostics.Process.Start(psi)) { proc.WaitForExit(); return proc.ExitCode; }
            }
            catch (System.ComponentModel.Win32Exception) { return -1; } // UAC cancelled
        }

        void FixDriver()
        {
            string helper = Path.Combine(AppDir, "sbdriver.exe");
            if (!File.Exists(helper))
            {
                MessageBox.Show(this, "The driver helper (sbdriver.exe) isn't next to SBBridge.exe.\r\n\r\nRun the Steel Battalion Bridge installer, or bind WinUSB manually (see Settings & setup).", "SB Bridge");
                return;
            }
            Cursor = Cursors.WaitCursor;
            int rc = RunElevated(helper, "install \"" + Path.Combine(AppDir, "driver") + "\"");
            Cursor = Cursors.Default;
            if (rc == 0) MessageBox.Show(this, "Controller driver installed. It should connect within a few seconds.", "SB Bridge");
            else if (rc == 2) MessageBox.Show(this, "Controller driver installed. Windows asks for a restart to finish.", "SB Bridge");
            else if (rc != -1) MessageBox.Show(this, "Driver setup failed (code " + rc + "). Try unplugging and replugging the controller, then click again.", "SB Bridge");
        }

        void FixPad()
        {
            string setup = Path.Combine(AppDir, "redist", "ViGEmBus_setup.exe");
            if (!File.Exists(setup)) { System.Diagnostics.Process.Start("https://github.com/nefarius/ViGEmBus/releases"); return; }
            Cursor = Cursors.WaitCursor;
            int rc = RunElevated(setup, "/qn /norestart");
            Cursor = Cursors.Default;
            if (rc == 0) MessageBox.Show(this, "ViGEmBus installed. The virtual Xbox controller will appear within a few seconds.", "SB Bridge");
            else if (rc == 3010) MessageBox.Show(this, "ViGEmBus installed. Restart Windows to finish.", "SB Bridge");
            else if (rc != -1) MessageBox.Show(this, "ViGEmBus setup returned code " + rc + ".", "SB Bridge");
        }

        // ------------------------------------------------------------------ periodic UI refresh
        void UiTick()
        {
            if (!Visible) return;
            engine.GetState(state);
            bool conn = engine.Connected;
            lblUsb.Text = "Controller: " + (conn ? "Connected (" + engine.ReportsPerSecond + " reports/s)" : engine.UsbStatus);
            lblUsb.ForeColor = conn ? Color.DarkGreen : Color.Firebrick;
            lblPad.Text = "Virtual pad: " + engine.PadStatus;
            lblPad.ForeColor = engine.PadStatus != null && engine.PadStatus.StartsWith("Virtual") ? Color.DarkGreen : Color.Firebrick;

            bool needDriver = !conn && engine.UsbStatus != null && engine.UsbStatus.Contains("WinUSB");
            if (btnFixDriver.Visible != needDriver) btnFixDriver.Visible = needDriver;
            bool needPad = engine.PadStatus != null && engine.PadStatus.Contains("ViGEmBus driver not installed");
            if (btnFixPad.Visible != needPad) btnFixPad.Visible = needPad;

            LearnTick();

            // live list
            foreach (var kv in liveItems)
            {
                var info = Sbc.Info(kv.Key); string st, val;
                if (info.Kind == ControlKind.Axis)
                {
                    double v = Mapper.Normalize(kv.Key, state, settings);
                    st = Sbc.IsCalibratable(kv.Key) ? state.RawAxis[(int)kv.Key].ToString() : "";
                    val = Bar(v, info.Bipolar) + "  " + v.ToString("+0.00;-0.00");
                }
                else { st = state.Down[(int)kv.Key] ? "ON" : ""; val = ""; }
                if (kv.Value.SubItems[1].Text != st) kv.Value.SubItems[1].Text = st;
                if (kv.Value.SubItems[2].Text != val) kv.Value.SubItems[2].Text = val;
                var bg = st == "ON" ? Color.FromArgb(210, 245, 210) : SystemColors.Window;
                if (kv.Value.BackColor != bg) kv.Value.BackColor = bg;
            }

            var sb = new StringBuilder("Raw report:\r\n");
            for (int i = 0; i < state.Raw.Length; i++) { sb.Append(state.Raw[i].ToString("X2")).Append(' '); if (i % 9 == 8) sb.Append("\r\n"); }
            lblRaw.Text = sb.ToString();

            var pr = engine.LastPad;
            lblPadOut.Text = "Virtual Xbox pad output:\r\n" +
                "  Left stick   X " + pr.LX.ToString().PadLeft(6) + "  Y " + pr.LY.ToString().PadLeft(6) + "\r\n" +
                "  Right stick  X " + pr.RX.ToString().PadLeft(6) + "  Y " + pr.RY.ToString().PadLeft(6) + "\r\n" +
                "  Triggers     L " + pr.LeftTrigger.ToString().PadLeft(6) + "  R " + pr.RightTrigger.ToString().PadLeft(6) + "\r\n" +
                "  Buttons      " + PadButtons(pr.Buttons) + "\r\n\r\n" +
                (engine.OutputEnabled ? "" : "  (output disabled)");

            // highlight active bindings
            foreach (ListViewItem it in lvBind.Items)
            {
                var b = (Binding)it.Tag;
                var info = Sbc.Info(b.Control);
                bool on = (info.Kind == ControlKind.Button || info.Kind == ControlKind.VirtualButton) && state.Down[(int)b.Control];
                if (info.Kind == ControlKind.Axis && b.Control != ControlId.None) on = Math.Abs(Mapper.Normalize(b.Control, state, settings)) > 0.25;
                var bg = on ? Color.FromArgb(210, 245, 210) : SystemColors.Window;
                if (it.BackColor != bg) it.BackColor = bg;
            }

            // calibration
            foreach (ListViewItem it in lvCal.Items)
            {
                var id = (ControlId)it.Tag; int raw = state.RawAxis[(int)id];
                if (calibrating && state.Valid)
                {
                    int[] mm; if (!calSeen.TryGetValue(id, out mm)) { mm = new[] { raw, raw }; calSeen[id] = mm; }
                    mm[0] = Math.Min(mm[0], raw); mm[1] = Math.Max(mm[1], raw);
                }
                var cal = settings.Cal(id);
                int[] seen; calSeen.TryGetValue(id, out seen);
                SetSub(it, 1, raw.ToString());
                SetSub(it, 2, calibrating && seen != null ? seen[0].ToString() : cal.Min.ToString());
                SetSub(it, 3, calibrating ? "(at finish)" : (Sbc.Info(id).Bipolar ? cal.Center.ToString() : "-"));
                SetSub(it, 4, calibrating && seen != null ? seen[1].ToString() : cal.Max.ToString());
                SetSub(it, 5, Mapper.Normalize(id, state, settings).ToString("+0.00;-0.00"));
            }
        }

        static void SetSub(ListViewItem it, int i, string s) { if (it.SubItems[i].Text != s) it.SubItems[i].Text = s; }

        static string Bar(double v, bool bipolar)
        {
            const int W = 20; var c = new char[W];
            for (int i = 0; i < W; i++) c[i] = '·';
            if (bipolar)
            {
                int mid = W / 2, n = (int)Math.Round(Math.Abs(v) * mid);
                for (int i = 0; i < n; i++) c[v >= 0 ? Math.Min(W - 1, mid + i) : Math.Max(0, mid - 1 - i)] = '█';
                if (n == 0) c[mid] = '|';
            }
            else { int n = (int)Math.Round(v * W); for (int i = 0; i < n; i++) c[i] = '█'; }
            return new string(c);
        }

        static string PadButtons(ushort b)
        {
            var names = new List<string>();
            string[] n = { "Up", "Down", "Left", "Right", "Start", "Back", "LS", "RS", "LB", "RB", "Guide", "", "A", "B", "X", "Y" };
            for (int i = 0; i < 16; i++) if ((b & (1 << i)) != 0 && n[i] != "") names.Add(n[i]);
            return names.Count == 0 ? "-" : string.Join(" ", names);
        }

        static ListView MakeList(string[] cols, int[] widths)
        {
            var lv = new ListView { View = View.Details, FullRowSelect = true, HideSelection = false, GridLines = true };
            for (int i = 0; i < cols.Length; i++) lv.Columns.Add(cols[i], widths[i]);
            typeof(Control).GetProperty("DoubleBuffered", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance).SetValue(lv, true, null);
            return lv;
        }

        static Icon MakeIcon()
        {
            try { var ic = Icon.ExtractAssociatedIcon(Application.ExecutablePath); if (ic != null) return ic; } catch { }
            using (var bmp = new Bitmap(32, 32))
            {
                using (var g = Graphics.FromImage(bmp))
                {
                    g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                    g.Clear(Color.Transparent);
                    using (var br = new SolidBrush(Color.FromArgb(40, 60, 40))) g.FillRectangle(br, 1, 6, 30, 20);
                    using (var br = new SolidBrush(Color.FromArgb(120, 220, 90)))
                    {
                        g.FillEllipse(br, 5, 10, 6, 6); g.FillEllipse(br, 13, 10, 6, 6); g.FillEllipse(br, 21, 10, 6, 6);
                        g.FillRectangle(br, 5, 19, 22, 3);
                    }
                }
                return Icon.FromHandle(bmp.GetHicon());
            }
        }
    }

    static class Prompt
    {
        public static string Show(IWin32Window owner, string text, string initial)
        {
            using (var f = new Form { Width = 380, Height = 150, Text = "SB Bridge", FormBorderStyle = FormBorderStyle.FixedDialog, StartPosition = FormStartPosition.CenterParent, MinimizeBox = false, MaximizeBox = false })
            {
                var lbl = new Label { Left = 12, Top = 12, Width = 340, Text = text };
                var tb = new TextBox { Left = 12, Top = 36, Width = 340, Text = initial };
                var ok = new Button { Text = "OK", Left = 196, Top = 70, Width = 75, DialogResult = DialogResult.OK };
                var cancel = new Button { Text = "Cancel", Left = 277, Top = 70, Width = 75, DialogResult = DialogResult.Cancel };
                f.Controls.AddRange(new Control[] { lbl, tb, ok, cancel });
                f.AcceptButton = ok; f.CancelButton = cancel;
                return f.ShowDialog(owner) == DialogResult.OK ? tb.Text.Trim() : null;
            }
        }
    }
}
