using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace SBBridge.Core
{
    /// <summary>A platform-specific action the UI can offer (e.g. "Set up driver").</summary>
    public sealed class PlatformAction
    {
        public string Id { get; set; }
        public string Label { get; set; }
        public string Description { get; set; }
        public bool Primary { get; set; }
    }

    /// <summary>A platform-specific on/off setting (e.g. "Start with Windows").</summary>
    public sealed class PlatformToggle
    {
        public string Id { get; set; }
        public string Label { get; set; }
        public bool Value { get; set; }
    }

    /// <summary>What differs between Windows and Linux hosts, as seen by the UI.</summary>
    public interface IPlatformHooks
    {
        string Platform { get; }            // "windows" | "linux"
        string InputStatus { get; }         // keyboard/mouse injection status
        string ServiceHint { get; }         // shown in Settings ("Runs in the tray", "systemctl --user ...")
        IList<PlatformAction> Actions(Engine engine);
        string RunAction(string id);        // returns a message for the user
        IList<PlatformToggle> Toggles();
        void SetToggle(string id, bool value);
        bool OverlaySupported { get; }      // native always-on-top overlay (Windows)
        bool OverlayVisible { get; }
        void SetOverlayVisible(bool visible);
    }

    public sealed class ApiResponse
    {
        public int Status = 200;
        public string Json = "{\"ok\":true}";
        public static ApiResponse Of(object o) { return new ApiResponse { Json = MiniJson.Serialize(o) }; }
        public static ApiResponse Error(int status, string msg) { return new ApiResponse { Status = status, Json = MiniJson.Serialize(new Dictionary<string, object> { { "error", msg } }) }; }
    }

    /// <summary>
    /// The JSON API behind the shared Fluent UI. Transport-agnostic: Linux serves it over HTTP on 127.0.0.1,
    /// Windows answers it inside WebView2 (no network socket at all).
    /// </summary>
    public sealed class UiApi : IDisposable
    {
        readonly Engine engine;
        readonly AppSettings settings;
        readonly ProfileStore store;
        readonly IPlatformHooks hooks;
        readonly ControllerState state = new ControllerState();
        readonly object gate = new object();
        readonly Dictionary<ControlId, int[]> calSeen = new Dictionary<ControlId, int[]>();
        volatile bool calibrating, running = true;
        readonly Thread calThread;
        public string Version = "1.2.0";

        public UiApi(Engine engine, AppSettings settings, ProfileStore store, IPlatformHooks hooks)
        {
            this.engine = engine; this.settings = settings; this.store = store; this.hooks = hooks;
            calThread = new Thread(CalLoop) { IsBackground = true, Name = "SB calibration" };
            calThread.Start();
        }

        sealed class ApiError : Exception { public int Status; public ApiError(int s, string m) : base(m) { Status = s; } }

        public ApiResponse Handle(string method, string path, string body)
        {
            try
            {
                var b = MiniJson.Obj(string.IsNullOrWhiteSpace(body) ? null : MiniJson.Parse(body));
                object r = Route(method.ToUpperInvariant(), path, b);
                return r as ApiResponse ?? ApiResponse.Of(r ?? new Dictionary<string, object> { { "ok", true } });
            }
            catch (ApiError e) { return ApiResponse.Error(e.Status, e.Message); }
            catch (FormatException e) { return ApiResponse.Error(400, "Bad JSON: " + e.Message); }
            catch (Exception e) { return ApiResponse.Error(500, e.Message); }
        }

        object Route(string method, string path, Dictionary<string, object> b)
        {
            switch (method + " " + path)
            {
                case "GET /api/meta": return Meta();
                case "GET /api/state": return State();
                case "GET /api/profiles": return new Dictionary<string, object> { { "active", engine.Profile.Name }, { "names", store.Names() } };
                case "GET /api/profile": return engine.Profile;
                case "PUT /api/profile": return PutProfile(b);
                case "POST /api/profiles/select": return Select(MiniJson.Str(b, "name"));
                case "POST /api/profiles/new": return NewProfile(MiniJson.Str(b, "name"), MiniJson.Bool(b, "copy") == true);
                case "POST /api/profiles/rename": return Rename(MiniJson.Str(b, "name"));
                case "POST /api/profiles/delete": return Delete();
                case "POST /api/profiles/reset-defaults":
                    foreach (var p in DefaultProfiles.All()) store.Save(p);
                    return Select(DefaultProfiles.Cockpit().Name);
                case "GET /api/settings": return SettingsDto();
                case "PUT /api/settings": return PutSettings(b);
                case "POST /api/output":
                    engine.OutputEnabled = settings.OutputEnabled = MiniJson.Bool(b, "enabled") == true;
                    settings.Save(); return new Dictionary<string, object> { { "enabled", engine.OutputEnabled } };
                case "POST /api/leds/test": engine.TestLeds(15); return null;
                case "POST /api/calibration/start": lock (gate) { calSeen.Clear(); calibrating = true; } return null;
                case "POST /api/calibration/finish": return FinishCalibration();
                case "POST /api/calibration/cancel": calibrating = false; lock (gate) calSeen.Clear(); return null;
                case "POST /api/calibration/reset": lock (gate) { settings.Calibration.Clear(); settings.Save(); } return null;
                case "GET /api/overlay": return Overlay();
                case "POST /api/overlay":
                    {
                        var v = MiniJson.Bool(b, "visible");
                        hooks.SetOverlayVisible(v ?? !hooks.OverlayVisible);
                        return new Dictionary<string, object> { { "visible", hooks.OverlayVisible } };
                    }
                case "POST /api/action":
                    {
                        string id = MiniJson.Str(b, "id");
                        if (id == null) throw new ApiError(400, "Missing action id");
                        return new Dictionary<string, object> { { "message", hooks.RunAction(id) } };
                    }
            }
            throw new ApiError(404, "Unknown endpoint " + method + " " + path);
        }

        static List<string> Names<T>() { return Enum.GetNames(typeof(T)).ToList(); }

        object Meta()
        {
            return new Dictionary<string, object>
            {
                { "version", Version }, { "platform", hooks.Platform }, { "serviceHint", hooks.ServiceHint },
                { "overlaySupported", hooks.OverlaySupported },
                { "controls", Sbc.All.Select(c => new Dictionary<string, object> {
                    { "id", c.Id.ToString() }, { "name", c.Name }, { "kind", c.Kind.ToString() },
                    { "bipolar", c.Bipolar }, { "calibratable", Sbc.IsCalibratable(c.Id) } }).ToList() },
                { "outputKinds", Names<OutputKind>() }, { "xboxButtons", Names<XboxButton>() }, { "xboxAxes", Names<XboxAxis>() },
                { "keys", Names<KeyCode>() }, { "mouseButtons", Names<MouseButtonId>() }, { "mouseAxes", Names<MouseAxis>() },
                { "modes", Names<ButtonMode>() }, { "directions", Names<AxisDirection>() }, { "layers", Names<Layer>() },
            };
        }

        static readonly string[] PadButtonNames = { "DPadUp", "DPadDown", "DPadLeft", "DPadRight", "Start", "Back", "LeftStickClick", "RightStickClick", "LeftBumper", "RightBumper", "Guide", "", "A", "B", "X", "Y" };

        object State()
        {
            lock (state)
            {
                engine.GetState(state);
                var axes = new Dictionary<string, object>();
                foreach (var c in Sbc.All)
                    if (c.Kind == ControlKind.Axis)
                        axes[c.Id.ToString()] = new Dictionary<string, object> {
                            { "raw", Sbc.IsCalibratable(c.Id) ? (object)state.RawAxis[(int)c.Id] : null },
                            { "value", Math.Round(Mapper.Normalize(c.Id, state, settings), 3) } };
                var down = Sbc.All.Where(c => (c.Kind == ControlKind.Button || c.Kind == ControlKind.VirtualButton) && state.Down[(int)c.Id]).Select(c => c.Id.ToString()).ToList();
                var pad = engine.LastPad;
                var padButtons = new List<string>();
                for (int i = 0; i < 16; i++) if ((pad.Buttons & (1 << i)) != 0 && PadButtonNames[i] != "") padButtons.Add(PadButtonNames[i]);
                List<object> cal;
                lock (gate)
                    cal = Sbc.All.Where(c => Sbc.IsCalibratable(c.Id)).Select(c =>
                    {
                        var k = settings.Cal(c.Id); int[] seen; calSeen.TryGetValue(c.Id, out seen);
                        return (object)new Dictionary<string, object> { { "id", c.Id.ToString() }, { "min", k.Min }, { "center", k.Center }, { "max", k.Max },
                            { "seenMin", seen != null ? (object)seen[0] : null }, { "seenMax", seen != null ? (object)seen[1] : null } };
                    }).ToList();
                return new Dictionary<string, object>
                {
                    { "connected", engine.Connected }, { "usbStatus", engine.UsbStatus }, { "padStatus", engine.PadStatus },
                    { "padOk", engine.PadOk }, { "inputStatus", hooks.InputStatus },
                    { "reportsPerSecond", engine.ReportsPerSecond }, { "outputEnabled", engine.OutputEnabled }, { "profile", engine.Profile.Name },
                    { "raw", BitConverter.ToString(state.Raw).Replace("-", " ") },
                    { "down", down }, { "axes", axes }, { "gear", state.Gear }, { "tuner", state.Tuner },
                    { "pad", new Dictionary<string, object> { { "buttons", padButtons }, { "lx", pad.LX }, { "ly", pad.LY }, { "rx", pad.RX }, { "ry", pad.RY }, { "lt", pad.LeftTrigger }, { "rt", pad.RightTrigger } } },
                    { "calibrating", calibrating }, { "calibration", cal },
                    { "actions", hooks.Actions(engine) }, { "overlayVisible", hooks.OverlayVisible },
                };
            }
        }

        object Overlay()
        {
            var s = new ControllerState();
            engine.GetState(s);
            var p = engine.Profile;
            return new Dictionary<string, object>
            {
                { "profile", p.Name }, { "connected", engine.Connected }, { "shift", OverlayModel.ShiftHeld(p, s) },
                { "groups", OverlayModel.Build(p, s, settings) },
            };
        }

        object PutProfile(Dictionary<string, object> b)
        {
            object raw;
            var list = new List<Binding>();
            if (b.TryGetValue("bindings", out raw) && raw is List<object>)
                foreach (var item in (List<object>)raw)
                {
                    var d = item as Dictionary<string, object>; if (d == null) continue;
                    var bind = new Binding(); MiniJson.Populate(bind, d); list.Add(bind);
                }
            var p = engine.Profile;
            lock (p.Sync)
            {
                p.Bindings = list;
                ControlId shift;
                string s = MiniJson.Str(b, "shiftControl");
                p.ShiftControl = s != null && Enum.TryParse(s, out shift) ? shift : ControlId.None;
            }
            store.Save(p);
            return new Dictionary<string, object> { { "saved", true }, { "count", list.Count } };
        }

        object Select(string name)
        {
            if (name == null || !store.Exists(name)) throw new ApiError(404, "No such profile");
            engine.Profile = store.Load(name);
            settings.ActiveProfile = name; settings.Save();
            return new Dictionary<string, object> { { "active", name } };
        }

        object NewProfile(string name, bool copy)
        {
            name = ProfileStore.ValidName(name);
            if (name == null) throw new ApiError(400, "Invalid profile name");
            if (store.Exists(name)) throw new ApiError(409, "A profile with that name already exists");
            Profile p;
            if (copy) { p = store.Load(engine.Profile.Name); p.Name = name; }
            else p = new Profile { Name = name };
            store.Save(p);
            return Select(name);
        }

        object Rename(string name)
        {
            name = ProfileStore.ValidName(name);
            if (name == null) throw new ApiError(400, "Invalid profile name");
            if (store.Exists(name)) throw new ApiError(409, "A profile with that name already exists");
            store.Rename(engine.Profile.Name, name);
            return Select(name);
        }

        object Delete()
        {
            if (store.Names().Count <= 1) throw new ApiError(400, "Can't delete the last profile");
            store.Delete(engine.Profile.Name);
            return Select(store.Names()[0]);
        }

        object SettingsDto()
        {
            return new Dictionary<string, object>
            {
                { "ledFeedback", settings.LedFeedback }, { "ledBright", settings.LedBright }, { "ledDim", settings.LedDim },
                { "outputEnabled", settings.OutputEnabled }, { "toggles", hooks.Toggles() },
                { "overlayCorner", settings.OverlayCorner }, { "overlayOpacity", settings.OverlayOpacity }, { "overlayScale", settings.OverlayScale },
            };
        }

        object PutSettings(Dictionary<string, object> b)
        {
            var led = MiniJson.Bool(b, "ledFeedback"); if (led.HasValue) settings.LedFeedback = led.Value;
            var br = MiniJson.Num(b, "ledBright"); if (br.HasValue) settings.LedBright = Clamp15(br.Value);
            var dm = MiniJson.Num(b, "ledDim"); if (dm.HasValue) settings.LedDim = Clamp15(dm.Value);
            string corner = MiniJson.Str(b, "overlayCorner");
            if (corner == "TopLeft" || corner == "TopRight" || corner == "BottomLeft" || corner == "BottomRight") settings.OverlayCorner = corner;
            var op = MiniJson.Num(b, "overlayOpacity"); if (op.HasValue) settings.OverlayOpacity = Math.Max(0.3, Math.Min(1, op.Value));
            var sc = MiniJson.Num(b, "overlayScale"); if (sc.HasValue) settings.OverlayScale = Math.Max(0.75, Math.Min(1.5, sc.Value));
            object t;
            if (b.TryGetValue("toggles", out t) && t is Dictionary<string, object>)
                foreach (var kv in (Dictionary<string, object>)t) if (kv.Value is bool) hooks.SetToggle(kv.Key, (bool)kv.Value);
            settings.Save();
            return SettingsDto();
        }

        static int Clamp15(double v) { return (int)Math.Max(0, Math.Min(15, Math.Round(v))); }

        object FinishCalibration()
        {
            calibrating = false;
            var s = new ControllerState();
            engine.GetState(s);
            int updated = 0;
            lock (gate)
            {
                foreach (var kv in calSeen)
                {
                    int lo = kv.Value[0], hi = kv.Value[1];
                    if (hi - lo < 100) continue;
                    var cal = settings.Cal(kv.Key);
                    cal.Min = lo; cal.Max = hi;
                    cal.Center = Sbc.Info(kv.Key).Bipolar ? s.RawAxis[(int)kv.Key] : lo;
                    updated++;
                }
                calSeen.Clear();
            }
            settings.Save();
            return new Dictionary<string, object> { { "updated", updated } };
        }

        void CalLoop()
        {
            var s = new ControllerState();
            while (running)
            {
                Thread.Sleep(20);
                if (!calibrating) continue;
                engine.GetState(s);
                if (!s.Valid) continue;
                lock (gate)
                    foreach (var c in Sbc.All)
                    {
                        if (!Sbc.IsCalibratable(c.Id)) continue;
                        int raw = s.RawAxis[(int)c.Id]; int[] mm;
                        if (!calSeen.TryGetValue(c.Id, out mm)) calSeen[c.Id] = mm = new[] { raw, raw };
                        mm[0] = Math.Min(mm[0], raw); mm[1] = Math.Max(mm[1], raw);
                    }
            }
        }

        public void Dispose() { running = false; }
    }
}
