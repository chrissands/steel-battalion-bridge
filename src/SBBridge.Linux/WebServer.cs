using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using System.Threading;
using SBBridge.Core;

namespace SBBridge.Linux
{
    /// <summary>
    /// Local-only HTTP server for the browser UI. Binds to 127.0.0.1, rejects foreign Host headers
    /// (DNS-rebinding) and requires a custom header on writes (blocks cross-site requests).
    /// </summary>
    public sealed class WebServer : IDisposable
    {
        readonly Engine engine;
        readonly AppSettings settings;
        readonly ProfileStore store;
        readonly int port;
        readonly HttpListener listener = new HttpListener();
        readonly ControllerState state = new ControllerState();
        readonly object gate = new object();
        Thread thread, calThread;
        volatile bool running, calibrating;
        readonly Dictionary<ControlId, int[]> calSeen = new Dictionary<ControlId, int[]>();
        public Action<string> Log = s => Console.WriteLine(s);

        public static readonly JsonSerializerOptions Json = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            Converters = { new JsonStringEnumConverter() },
            NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals,
        };

        public WebServer(Engine engine, AppSettings settings, ProfileStore store, int port)
        {
            this.engine = engine; this.settings = settings; this.store = store; this.port = port;
        }

        public void Start()
        {
            listener.Prefixes.Add("http://127.0.0.1:" + port + "/");
            listener.Start();
            running = true;
            thread = new Thread(Loop) { IsBackground = true, Name = "SB web" };
            thread.Start();
            calThread = new Thread(CalLoop) { IsBackground = true, Name = "SB calibration" };
            calThread.Start();
        }

        void Loop()
        {
            while (running)
            {
                HttpListenerContext ctx;
                try { ctx = listener.GetContext(); }
                catch { if (!running) return; continue; }
                ThreadPool.QueueUserWorkItem(_ => Handle(ctx));
            }
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

        // ------------------------------------------------------------------ request handling
        void Handle(HttpListenerContext ctx)
        {
            var req = ctx.Request; var res = ctx.Response;
            try
            {
                string host = (req.Headers["Host"] ?? "").ToLowerInvariant();
                if (host != "127.0.0.1:" + port && host != "localhost:" + port) { Send(res, 403, "text/plain", "Forbidden host"); return; }
                res.Headers["X-Content-Type-Options"] = "nosniff";
                res.Headers["Cache-Control"] = "no-store";
                string path = req.Url.AbsolutePath;
                if (req.HttpMethod != "GET" && req.Headers["X-SBBridge"] != "1") { Send(res, 403, "text/plain", "Missing X-SBBridge header"); return; }

                if (req.HttpMethod == "GET" && (path == "/" || path == "/index.html"))
                {
                    res.Headers["Content-Security-Policy"] = "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:";
                    Send(res, 200, "text/html; charset=utf-8", IndexHtml()); return;
                }
                if (!path.StartsWith("/api/")) { Send(res, 404, "text/plain", "Not found"); return; }

                JsonNode body = null;
                if (req.HasEntityBody)
                {
                    using (var r = new StreamReader(req.InputStream, Encoding.UTF8)) { var txt = r.ReadToEnd(); if (txt.Length > 0) body = JsonNode.Parse(txt); }
                }
                object result = Route(req.HttpMethod, path, body);
                SendJson(res, 200, result ?? new { ok = true });
            }
            catch (ApiError e) { SendJson(res, e.Status, new { error = e.Message }); }
            catch (Exception e) { Log("Request error: " + e); SendJson(res, 500, new { error = e.Message }); }
        }

        sealed class ApiError : Exception { public int Status; public ApiError(int s, string m) : base(m) { Status = s; } }

        static string Str(JsonNode b, string key) { var v = b == null ? null : b[key]; return v == null ? null : v.GetValue<string>(); }

        object Route(string method, string path, JsonNode body)
        {
            switch (method + " " + path)
            {
                case "GET /api/meta": return Meta();
                case "GET /api/state": return State();
                case "GET /api/profiles": return new { active = engine.Profile.Name, names = store.Names() };
                case "GET /api/profile": return engine.Profile;
                case "PUT /api/profile": return PutProfile(body);
                case "POST /api/profiles/select": return Select(Str(body, "name"));
                case "POST /api/profiles/new": return NewProfile(Str(body, "name"), body != null && body["copy"] != null && body["copy"].GetValue<bool>());
                case "POST /api/profiles/rename": return Rename(Str(body, "name"));
                case "POST /api/profiles/delete": return Delete();
                case "POST /api/profiles/reset-defaults": return ResetDefaults();
                case "GET /api/settings": return SettingsDto();
                case "PUT /api/settings": return PutSettings(body);
                case "POST /api/output":
                    engine.OutputEnabled = settings.OutputEnabled = body != null && body["enabled"].GetValue<bool>();
                    settings.Save(); return new { enabled = engine.OutputEnabled };
                case "POST /api/leds/test": engine.TestLeds(15); return null;
                case "POST /api/calibration/start": lock (gate) { calSeen.Clear(); calibrating = true; } return null;
                case "POST /api/calibration/finish": return FinishCalibration();
                case "POST /api/calibration/cancel": calibrating = false; return null;
                case "POST /api/calibration/reset": lock (gate) { settings.Calibration.Clear(); settings.Save(); } return null;
            }
            throw new ApiError(404, "Unknown endpoint " + method + " " + path);
        }

        static string[] Names<T>() where T : struct, Enum { return Enum.GetNames(typeof(T)); }

        object Meta()
        {
            return new
            {
                version = typeof(WebServer).Assembly.GetName().Version.ToString(3),
                controls = Sbc.All.Select(c => new { id = c.Id.ToString(), name = c.Name, kind = c.Kind.ToString(), bipolar = c.Bipolar, calibratable = Sbc.IsCalibratable(c.Id), led = c.Led >= 0 }),
                outputKinds = Names<OutputKind>(), xboxButtons = Names<XboxButton>(), xboxAxes = Names<XboxAxis>(),
                keys = Names<KeyCode>(), mouseButtons = Names<MouseButtonId>(), mouseAxes = Names<MouseAxis>(),
                modes = Names<ButtonMode>(), directions = Names<AxisDirection>(), layers = Names<Layer>(),
            };
        }

        object State()
        {
            engine.GetState(state);
            var axes = new Dictionary<string, object>();
            foreach (var c in Sbc.All)
                if (c.Kind == ControlKind.Axis)
                    axes[c.Id.ToString()] = new { raw = Sbc.IsCalibratable(c.Id) ? state.RawAxis[(int)c.Id] : (int?)null, value = Math.Round(Mapper.Normalize(c.Id, state, settings), 3) };
            var down = Sbc.All.Where(c => (c.Kind == ControlKind.Button || c.Kind == ControlKind.VirtualButton) && state.Down[(int)c.Id]).Select(c => c.Id.ToString());
            var pad = engine.LastPad;
            string[] bn = { "DPadUp", "DPadDown", "DPadLeft", "DPadRight", "Start", "Back", "LeftStickClick", "RightStickClick", "LeftBumper", "RightBumper", "Guide", "", "A", "B", "X", "Y" };
            var padButtons = new List<string>();
            for (int i = 0; i < 16; i++) if ((pad.Buttons & (1 << i)) != 0 && bn[i] != "") padButtons.Add(bn[i]);
            object cal;
            lock (gate)
                cal = Sbc.All.Where(c => Sbc.IsCalibratable(c.Id)).Select(c =>
                {
                    var k = settings.Cal(c.Id); int[] seen; calSeen.TryGetValue(c.Id, out seen);
                    return new { id = c.Id.ToString(), min = k.Min, center = k.Center, max = k.Max, seenMin = seen != null ? seen[0] : (int?)null, seenMax = seen != null ? seen[1] : (int?)null };
                }).ToList();
            return new
            {
                connected = engine.Connected, usbStatus = engine.UsbStatus, padStatus = engine.PadStatus, inputStatus = InputStatus,
                reportsPerSecond = engine.ReportsPerSecond, outputEnabled = engine.OutputEnabled, profile = engine.Profile.Name,
                raw = BitConverter.ToString(state.Raw).Replace("-", " "),
                down, axes, gear = state.Gear, tuner = state.Tuner,
                pad = new { buttons = padButtons, lx = pad.LX, ly = pad.LY, rx = pad.RX, ry = pad.RY, lt = pad.LeftTrigger, rt = pad.RightTrigger },
                calibrating, calibration = cal,
            };
        }

        public string InputStatus = "";

        object PutProfile(JsonNode body)
        {
            if (body == null) throw new ApiError(400, "Missing body");
            var incoming = body.Deserialize<Profile>(Json);
            var p = engine.Profile;
            lock (p.Sync)
            {
                p.Bindings = incoming.Bindings ?? new List<Binding>();
                p.ShiftControl = incoming.ShiftControl;
            }
            store.Save(p);
            return new { saved = true, count = p.Bindings.Count };
        }

        object Select(string name)
        {
            if (name == null || !store.Exists(name)) throw new ApiError(404, "No such profile");
            engine.Profile = store.Load(name);
            settings.ActiveProfile = name; settings.Save();
            return new { active = name };
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
            string old = engine.Profile.Name;
            store.Rename(old, name);
            return Select(name);
        }

        object Delete()
        {
            var names = store.Names();
            if (names.Count <= 1) throw new ApiError(400, "Can't delete the last profile");
            store.Delete(engine.Profile.Name);
            return Select(store.Names()[0]);
        }

        object ResetDefaults()
        {
            foreach (var p in DefaultProfiles.All()) store.Save(p);
            return Select(DefaultProfiles.Cockpit().Name);
        }

        object SettingsDto() { return new { settings.LedFeedback, settings.LedBright, settings.LedDim, settings.OutputEnabled }; }

        object PutSettings(JsonNode b)
        {
            if (b == null) throw new ApiError(400, "Missing body");
            if (b["ledFeedback"] != null) settings.LedFeedback = b["ledFeedback"].GetValue<bool>();
            if (b["ledBright"] != null) settings.LedBright = Math.Max(0, Math.Min(15, b["ledBright"].GetValue<int>()));
            if (b["ledDim"] != null) settings.LedDim = Math.Max(0, Math.Min(15, b["ledDim"].GetValue<int>()));
            settings.Save();
            return SettingsDto();
        }

        object FinishCalibration()
        {
            calibrating = false;
            engine.GetState(state);
            int updated = 0;
            lock (gate)
            {
                foreach (var kv in calSeen)
                {
                    int lo = kv.Value[0], hi = kv.Value[1];
                    if (hi - lo < 100) continue;
                    var cal = settings.Cal(kv.Key);
                    cal.Min = lo; cal.Max = hi;
                    cal.Center = Sbc.Info(kv.Key).Bipolar ? state.RawAxis[(int)kv.Key] : lo;
                    updated++;
                }
                calSeen.Clear();
            }
            settings.Save();
            return new { updated };
        }

        // ------------------------------------------------------------------ helpers
        static string indexHtml;
        static string IndexHtml()
        {
            if (indexHtml != null) return indexHtml;
            using (var s = typeof(WebServer).Assembly.GetManifestResourceStream("index.html"))
            using (var r = new StreamReader(s)) return indexHtml = r.ReadToEnd();
        }

        static void SendJson(HttpListenerResponse res, int status, object o)
        {
            Send(res, status, "application/json; charset=utf-8", JsonSerializer.Serialize(o, o.GetType(), Json));
        }

        static void Send(HttpListenerResponse res, int status, string type, string text)
        {
            try
            {
                var data = Encoding.UTF8.GetBytes(text);
                res.StatusCode = status; res.ContentType = type; res.ContentLength64 = data.Length;
                res.OutputStream.Write(data, 0, data.Length);
                res.OutputStream.Close();
            }
            catch { }
        }

        public void Dispose()
        {
            running = false;
            try { listener.Stop(); listener.Close(); } catch { }
        }
    }
}
