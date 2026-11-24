using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using SBBridge.Core;

namespace SBBridge.Linux
{
    /// <summary>
    /// Local-only HTTP transport for the shared UI (web/dist) and UiApi. Binds to 127.0.0.1, rejects
    /// foreign Host headers (DNS rebinding) and requires X-SBBridge on writes (blocks cross-site requests).
    /// </summary>
    public sealed class WebServer : IDisposable
    {
        readonly UiApi api;
        readonly int port;
        readonly HttpListener listener = new HttpListener();
        Thread thread;
        volatile bool running;
        public Action<string> Log = s => Console.WriteLine(s);

        public WebServer(UiApi api, int port) { this.api = api; this.port = port; }

        public void Start()
        {
            listener.Prefixes.Add("http://127.0.0.1:" + port + "/");
            listener.Start();
            running = true;
            thread = new Thread(Loop) { IsBackground = true, Name = "SB web" };
            thread.Start();
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

        static readonly Dictionary<string, string> Types = new Dictionary<string, string>
        {
            { ".html", "text/html; charset=utf-8" }, { ".js", "text/javascript; charset=utf-8" }, { ".css", "text/css; charset=utf-8" },
            { ".svg", "image/svg+xml" }, { ".png", "image/png" }, { ".ico", "image/x-icon" },
        };

        void Handle(HttpListenerContext ctx)
        {
            var req = ctx.Request; var res = ctx.Response;
            try
            {
                string host = (req.Headers["Host"] ?? "").ToLowerInvariant();
                if (host != "127.0.0.1:" + port && host != "localhost:" + port) { Send(res, 403, "text/plain", Encoding.UTF8.GetBytes("Forbidden host")); return; }
                res.Headers["X-Content-Type-Options"] = "nosniff";
                res.Headers["Cache-Control"] = "no-store";
                string path = req.Url.AbsolutePath;

                if (path.StartsWith("/api/"))
                {
                    if (req.HttpMethod != "GET" && req.Headers["X-SBBridge"] != "1") { Send(res, 403, "text/plain", Encoding.UTF8.GetBytes("Missing X-SBBridge header")); return; }
                    string body = null;
                    if (req.HasEntityBody) using (var r = new StreamReader(req.InputStream, Encoding.UTF8)) body = r.ReadToEnd();
                    var ar = api.Handle(req.HttpMethod, path, body);
                    Send(res, ar.Status, "application/json; charset=utf-8", Encoding.UTF8.GetBytes(ar.Json));
                    return;
                }
                if (req.HttpMethod != "GET") { Send(res, 405, "text/plain", Encoding.UTF8.GetBytes("Method not allowed")); return; }
                if (path == "/") path = "/index.html";
                var data = WebAssets.Get(path.TrimStart('/'));
                if (data == null) { Send(res, 404, "text/plain", Encoding.UTF8.GetBytes("Not found")); return; }
                string type; Types.TryGetValue(Path.GetExtension(path), out type);
                if (path == "/index.html") res.Headers["Content-Security-Policy"] = WebAssets.Csp;
                Send(res, 200, type ?? "application/octet-stream", data);
            }
            catch (Exception e) { Log("Request error: " + e.Message); Send(res, 500, "text/plain", Encoding.UTF8.GetBytes(e.Message)); }
        }

        static void Send(HttpListenerResponse res, int status, string type, byte[] data)
        {
            try
            {
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

    public sealed class LinuxHooks : IPlatformHooks
    {
        public string InputStatusValue = "";
        public string Platform { get { return "linux"; } }
        public string InputStatus { get { return InputStatusValue; } }
        public string ServiceHint { get { return "Runs as a background service: systemctl --user status sbbridge"; } }
        public IList<PlatformAction> Actions(Engine engine) { return new List<PlatformAction>(); }
        public string RunAction(string id) { return "Not available on Linux."; }
        public IList<PlatformToggle> Toggles() { return new List<PlatformToggle>(); }
        public void SetToggle(string id, bool value) { }
        public bool OverlaySupported { get { return false; } }
        public bool OverlayVisible { get { return false; } }
        public void SetOverlayVisible(bool visible) { }
    }
}
