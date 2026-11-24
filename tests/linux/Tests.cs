using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading;
using SBBridge.Core;
using SBBridge.Linux;

class FakeUsb : IControllerTransport
{
    public byte[] Rep = new byte[26]; public bool IsOpen { get; set; } public string LastError { get { return null; } }
    public bool TryOpen() { IsOpen = true; return true; }
    public int Read(byte[] b, int t) { Thread.Sleep(4); lock (Rep) Buffer.BlockCopy(Rep, 0, b, 0, 26); return 26; }
    public int LedWrites; public bool Write(byte[] d) { LedWrites++; return true; }
    public void Close() { IsOpen = false; } public void Dispose() { }
}
class FakePad : IVirtualGamepad
{
    public PadReport R; public bool IsConnected { get; set; } public string LastError { get { return "x"; } }
    public bool Connect() { IsConnected = true; return true; } public bool Submit(PadReport r) { R = r; return true; }
    public void Disconnect() { IsConnected = false; } public void Dispose() { }
}
class FakeIn : IInputInjector
{
    public string Log = ""; public void Key(KeyCode k, bool d) { lock (this) Log += (d ? "+" : "-") + k + " "; }
    public void MouseButton(MouseButtonId b, bool d) { } public void Wheel(int n) { } public void MouseMove(int x, int y) { }
}

static class T
{
    static int fails;
    static void Check(bool c, string m) { Console.WriteLine((c ? "PASS " : "FAIL ") + m); if (!c) fails++; }

    static int Main(string[] args)
    {
        // ---- uinput byte layouts
        var setup = UInputDevice.Setup(3, 0x045E, 0x028E, 0x110, "Microsoft X-Box 360 pad");
        Check(setup.Length == 92 && setup[2] == 0x5E && setup[3] == 0x04 && setup[4] == 0x8E && setup[8] == (byte)'M' && setup[8 + 23] == 0, "uinput_setup layout");
        var abs = UInputDevice.AbsSetup(1, -32768, 32767, 16, 128);
        Check(abs.Length == 28 && BitConverter.ToInt32(abs, 8) == -32768 && BitConverter.ToInt32(abs, 12) == 32767 && BitConverter.ToInt32(abs, 20) == 128, "uinput_abs_setup layout");
        var ev = UInputGamepad.ToEvents(new PadReport { Buttons = 0x1000 | 0x0001 | 0x0008, LY = 32767, RY = -32768, LeftTrigger = 200 });
        var bytes = ev.ToArray();
        Check(ev.Count == 20 && bytes.Length == 20 * 24, "pad report -> 20 events (11 keys, 8 abs, syn)");
        int Find(ushort type, ushort code) { for (int i = 0; i < ev.Count; i++) if (BitConverter.ToUInt16(bytes, i * 24 + 16) == type && BitConverter.ToUInt16(bytes, i * 24 + 18) == code) return BitConverter.ToInt32(bytes, i * 24 + 20); return int.MinValue; }
        Check(Find(1, 0x130) == 1 && Find(1, 0x131) == 0, "BTN_A pressed, BTN_B released");
        Check(Find(3, 1) == -32768 && Find(3, 4) == 32767, "Y axes inverted like xpad (up = negative)");
        Check(Find(3, 0x10) == 1 && Find(3, 0x11) == -1, "D-pad right+up -> HAT0X=1, HAT0Y=-1");
        Check(Find(3, 2) == 200, "left trigger -> ABS_Z");

        // ---- key map
        var allKeys = Enum.GetValues(typeof(KeyCode)).Cast<KeyCode>().Where(k => k != KeyCode.None).ToList();
        var missing = allKeys.Where(k => LinuxKeyMap.ToEvdev(k) == 0).ToList();
        Check(missing.Count == 0, "every KeyCode maps to an evdev code" + (missing.Count > 0 ? " missing: " + string.Join(",", missing) : ""));
        Check(LinuxKeyMap.ToEvdev(KeyCode.A) == 30 && LinuxKeyMap.ToEvdev(KeyCode.F12) == 88 && LinuxKeyMap.ToEvdev(KeyCode.NumPad1) == 79 && LinuxKeyMap.ToEvdev(KeyCode.D1) == 2, "spot-check evdev codes");

        // ---- legacy XML from the Windows 1.0.0 build
        string tmp = Path.Combine(Path.GetTempPath(), "sbtest-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(tmp);
        File.WriteAllText(Path.Combine(tmp, "legacy.xml"), "<?xml version=\"1.0\"?><Profile><Name>legacy</Name><ShiftControl>None</ShiftControl><Bindings>" +
            "<Binding><Control>Comm1</Control><Layer>Always</Layer><Output>Key</Output><XboxButton>A</XboxButton><XboxAxis>LeftStickX</XboxAxis><Key>Prior</Key></Binding>" +
            "<Binding><Control>Comm2</Control><Layer>Always</Layer><Output>Key</Output><XboxButton>A</XboxButton><XboxAxis>LeftStickX</XboxAxis><Key>Return</Key></Binding>" +
            "</Bindings></Profile>");
        var legacy = Profile.Load(Path.Combine(tmp, "legacy.xml"));
        Check(legacy.Bindings[0].Key == KeyCode.PageUp && legacy.Bindings[1].Key == KeyCode.Enter, "old WinForms key names (Prior, Return) still load");

        // ---- web API end to end with fake devices
        var settings = new AppSettings();
        var store = new ProfileStore(Path.Combine(tmp, "Profiles"));
        store.EnsureDefaults();
        var usb = new FakeUsb(); usb.Rep[1] = 0x1A; usb.Rep[9] = 0xFF; usb.Rep[10] = 0xC0; usb.Rep[11] = 0x80; usb.Rep[13] = 0; usb.Rep[25] = 1;
        var pad = new FakePad(); var inp = new FakeIn();
        var engine = new Engine(usb, pad, inp, settings) { Profile = store.Load(store.Names().First(n => n.StartsWith("Cockpit"))) };
        engine.Start();
        int port = 18000 + new Random().Next(2000);
        var hooks = new LinuxHooks { InputStatusValue = "Virtual keyboard/mouse active" };
        var api = new UiApi(engine, settings, store, hooks);
        var web = new WebServer(api, port) { Log = s => { } };
        web.Start();
        Thread.Sleep(300);
        var http = new HttpClient { BaseAddress = new Uri("http://127.0.0.1:" + port) };

        HttpResponseMessage Send(string method, string path, object body = null, bool header = true, string host = null)
        {
            var m = new HttpRequestMessage(new HttpMethod(method), path);
            if (header) m.Headers.Add("X-SBBridge", "1");
            if (host != null) m.Headers.Host = host;
            if (body != null) m.Content = new StringContent(body is string s ? s : JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            else if (method != "GET") m.Content = new StringContent("", Encoding.UTF8, "application/json"); // like a browser: Content-Length: 0
            return http.Send(m);
        }
        JsonNode J(HttpResponseMessage r) { return JsonNode.Parse(r.Content.ReadAsStringAsync().Result); }

        var html = http.GetStringAsync("/").Result;
        Check(html.Contains("Steel Battalion") && html.Contains("app.js"), "GET / serves the UI");
        var js = http.GetAsync("/app.js").Result;
        Check(js.IsSuccessStatusCode && js.Content.Headers.ContentType.MediaType == "text/javascript" && js.Content.ReadAsStringAsync().Result.Contains("fluent-"), "GET /app.js serves the Fluent bundle");
        Check(http.GetAsync("/").Result.Headers.Contains("Content-Security-Policy"), "UI page sends a Content-Security-Policy");
        Check(http.GetStringAsync("/overlay.html").Result.Contains("overlay.js"), "GET /overlay.html serves the overlay page");
        Check(http.GetAsync("/../etc/passwd").Result.StatusCode == HttpStatusCode.NotFound || !http.GetAsync("/../etc/passwd").Result.IsSuccessStatusCode, "no path traversal on static files");

        // MiniJson round trip (shared by Windows + Linux)
        var mj = MiniJson.Parse("{\"a\":[1,2.5,true,null,\"x\\u0041\"],\"b\":{\"c\":\"<tag>\"}}") as System.Collections.Generic.Dictionary<string, object>;
        Check(mj != null && ((System.Collections.Generic.List<object>)mj["a"]).Count == 5 && (string)((System.Collections.Generic.List<object>)mj["a"])[4] == "xA", "MiniJson parses");
        Check(MiniJson.Serialize(mj).Contains("\\u003ctag>"), "MiniJson escapes < for safe embedding");
        var pb = new Binding(); MiniJson.Populate(pb, (System.Collections.Generic.Dictionary<string, object>)MiniJson.Parse("{\"control\":\"Comm2\",\"output\":\"Key\",\"key\":\"Prior\",\"threshold\":0.7,\"pulseMs\":80,\"invert\":true,\"bogus\":1}"));
        Check(pb.Control == ControlId.Comm2 && pb.Output == OutputKind.Key && pb.Key == KeyCode.PageUp && pb.Threshold == 0.7 && pb.PulseMs == 80 && pb.Invert, "MiniJson.Populate fills a Binding (incl. legacy key name)");
        var bj = MiniJson.Serialize(pb);
        Check(bj.Contains("\"key\":\"PageUp\"") && !bj.Contains("keyXml") && !bj.Contains("sourceIsAxis"), "Binding serializes without internal properties");
        var meta = J(Send("GET", "/api/meta"));
        Check(meta["controls"].AsArray().Count == Sbc.All.Length && meta["keys"].AsArray().Count > 100 && meta["platform"].GetValue<string>() == "linux", "GET /api/meta");
        var st = J(Send("GET", "/api/state"));
        Check(st["connected"].GetValue<bool>() && st["axes"]["AimingX"]["raw"].GetValue<int>() == 1023, "GET /api/state shows live controller data");
        Check(st["pad"]["rx"].GetValue<int>() == 32767, "state shows virtual pad output");
        var ov = J(Send("GET", "/api/overlay"));
        var ovText = ov.ToJsonString();
        Check(ov["groups"].AsArray().Count >= 6 && ovText.Contains("Fire weapon group 1") && ovText.Contains("\"title\":\"Sticks\""), "GET /api/overlay lists bound controls by panel");
        Check(Send("POST", "/api/overlay", new { visible = true }).IsSuccessStatusCode && meta["overlaySupported"].GetValue<bool>() == false, "overlay toggle is a no-op on Linux (page instead)");
        Check(st["down"].AsArray().Any(x => x.GetValue<string>() == "Gear1"), "state shows gear position");

        using (var evil = new HttpClient { BaseAddress = new Uri("http://127.0.0.1:" + port) })
        {
            var m = new HttpRequestMessage(HttpMethod.Get, "/api/state"); m.Headers.Host = "evil.example:" + port; m.Headers.ConnectionClose = true;
            var code = (int)evil.Send(m).StatusCode;
            Check(code >= 400 && code < 500, "foreign Host header rejected (DNS rebinding) -> " + code);
        }
        { HttpResponseMessage rr = null; try { rr = Send("POST", "/api/leds/test", header: false); } catch (Exception ex) { Console.WriteLine("csrf ex " + ex.Message); } Check(rr != null && rr.StatusCode == HttpStatusCode.Forbidden, "write without X-SBBridge header rejected (CSRF) " + (rr == null ? "" : ((int)rr.StatusCode).ToString())); }
        Check(Send("POST", "/api/leds/test").IsSuccessStatusCode, "LED test");

        var prof = J(Send("GET", "/api/profile"));
        int n0 = prof["bindings"].AsArray().Count;
        prof["bindings"].AsArray().Add(JsonNode.Parse("{\"control\":\"Comm3\",\"output\":\"Key\",\"key\":\"F10\",\"mode\":\"Pulse\",\"layer\":\"Always\"}"));
        prof["shiftControl"] = "Comm5";
        Check(Send("PUT", "/api/profile", prof.ToJsonString()).IsSuccessStatusCode, "PUT /api/profile");
        var saved = store.Load(engine.Profile.Name);
        Check(saved.Bindings.Count == n0 + 1 && saved.Bindings.Last().Key == KeyCode.F10 && saved.ShiftControl == ControlId.Comm5, "profile saved to XML with new binding + shift control");

        Check(Send("POST", "/api/profiles/new", new { name = "Test copy", copy = true }).IsSuccessStatusCode && engine.Profile.Name == "Test copy" && engine.Profile.Bindings.Count == n0 + 1, "copy profile + select");
        Check(Send("POST", "/api/profiles/new", new { name = "Test copy", copy = false }).StatusCode == HttpStatusCode.Conflict, "duplicate name rejected");
        Check(Send("POST", "/api/profiles/new", new { name = "../evil", copy = false }).StatusCode == HttpStatusCode.BadRequest, "path traversal name rejected");
        Check(Send("POST", "/api/profiles/rename", new { name = "Renamed" }).IsSuccessStatusCode && store.Exists("Renamed") && !store.Exists("Test copy"), "rename profile");
        Check(Send("POST", "/api/profiles/delete").IsSuccessStatusCode && !store.Exists("Renamed"), "delete profile");
        var pl = J(Send("GET", "/api/profiles"));
        Check(pl["names"].AsArray().Count == 2, "two built-in profiles remain");

        Check(J(Send("PUT", "/api/settings", new { ledBright = 9, ledDim = 99 }))["ledDim"].GetValue<int>() == 15 && settings.LedBright == 9, "settings update + clamping");
        Send("POST", "/api/output", new { enabled = false });
        Thread.Sleep(80);
        Check(!engine.OutputEnabled && pad.R.RX == 0, "output disabled -> neutral pad");
        Send("POST", "/api/output", new { enabled = true });

        // calibration: sweep aiming X from 100 to 900 (10-bit) then centre at 500
        void SetAimX(int v) { lock (usb.Rep) { usb.Rep[9] = (byte)(v >> 2); usb.Rep[10] = (byte)((v & 3) << 6); } }
        SetAimX(500); Thread.Sleep(150);   // settle before sampling starts
        Send("POST", "/api/calibration/start");
        foreach (var v in new[] { 100, 900, 500 }) { lock (usb.Rep) { usb.Rep[9] = (byte)(v >> 2); usb.Rep[10] = (byte)((v & 3) << 6); } Thread.Sleep(120); }
        var cal = J(Send("POST", "/api/calibration/finish"));
        var c = settings.Cal(ControlId.AimingX);
        Check(cal["updated"].GetValue<int>() >= 1 && c.Min == 100 && c.Max == 900 && c.Center == 500, "calibration captures min/max/centre (" + c.Min + "/" + c.Center + "/" + c.Max + ")");

        // keys flow through the engine (Comm1 -> D1 in the cockpit profile)
        Send("POST", "/api/profiles/select", new { name = store.Names().First(x => x.StartsWith("Cockpit")) });
        lock (usb.Rep) usb.Rep[5] = 0x10; Thread.Sleep(120);
        Check(inp.Log.Contains("+D1"), "Comm 1 press -> key D1 down");
        lock (usb.Rep) usb.Rep[5] = 0; Thread.Sleep(120);
        Check(inp.Log.Contains("-D1"), "Comm 1 release -> key D1 up");

        if (args.Length > 0 && args[0] == "--serve")
        {
            Console.WriteLine("SERVING http://127.0.0.1:" + port + "/");
            Console.Out.Flush();
            Thread.Sleep(int.Parse(args[1]) * 1000);
        }
        web.Dispose(); api.Dispose(); engine.Dispose();
        Directory.Delete(tmp, true);
        Console.WriteLine(fails == 0 ? "ALL PASSED" : fails + " FAILED");
        return fails == 0 ? 0 : 1;
    }
}
