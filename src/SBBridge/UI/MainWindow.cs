using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;
using SBBridge.Core;
using SBBridge.Platform.Windows;

namespace SBBridge.UI
{
    /// <summary>
    /// The app window: a WebView2 control showing the shared Fluent 2 UI. The UI and its API are served
    /// in-process from a private virtual host (https://sbbridge.local), so no network port is opened.
    /// </summary>
    public sealed class MainWindow : Form
    {
        const string Origin = "https://sbbridge.local";
        readonly UiApi api;
        readonly Engine engine;
        readonly AppSettings settings;
        readonly WebView2 web;
        readonly WindowsHooks hooks;
        readonly OverlayWindow overlay;
        readonly Timer overlaySync = new Timer { Interval = 50 };
        CoreWebView2Environment env;
        NotifyIcon tray;
        ToolStripMenuItem trayOutput, trayOverlay;
        const int HotkeyId = 0x5342, WM_HOTKEY = 0x0312, MOD_CONTROL = 0x2, MOD_SHIFT = 0x4, MOD_NOREPEAT = 0x4000;
        [System.Runtime.InteropServices.DllImport("user32.dll")] static extern bool RegisterHotKey(IntPtr hWnd, int id, int fsModifiers, int vk);
        [System.Runtime.InteropServices.DllImport("user32.dll")] static extern bool UnregisterHotKey(IntPtr hWnd, int id);
        bool exiting, startHidden, balloonShown;

        public MainWindow(UiApi api, Engine engine, AppSettings settings, WindowsHooks hooks, bool startMinimized)
        {
            this.api = api; this.engine = engine; this.settings = settings; this.hooks = hooks; startHidden = startMinimized;
            overlay = new OverlayWindow(engine, settings);
            hooks.OverlayChanged = v => { if (IsHandleCreated) BeginInvoke((Action)SyncOverlay); };
            engine.OverlayToggled += () => { if (IsHandleCreated) BeginInvoke((Action)(() => hooks.SetOverlayVisible(!settings.OverlayVisible))); };
            overlaySync.Tick += (s, e) => SyncOverlay();
            overlaySync.Start();
            Text = "Steel Battalion Bridge";
            ClientSize = new Size(1320, 860);
            MinimumSize = new Size(900, 600);
            StartPosition = FormStartPosition.CenterScreen;
            BackColor = Color.FromArgb(32, 32, 32);
            try { Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); } catch { }

            web = new WebView2 { Dock = DockStyle.Fill, DefaultBackgroundColor = Color.FromArgb(32, 32, 32) };
            Controls.Add(web);
            BuildTray();
            Load += async (s, e) => await InitWebView();
        }

        /// <summary>Overlay shows if toggled on (hotkey, tray, app, cockpit toggle) or while a Hold-mode Overlay control is held.</summary>
        void SyncOverlay()
        {
            bool want = settings.OverlayVisible || engine.OverlayHeld;
            if (want) overlay.ShowOverlay(); else overlay.HideOverlay();
            if (trayOverlay != null && trayOverlay.Checked != settings.OverlayVisible) trayOverlay.Checked = settings.OverlayVisible;
        }

        protected override void OnHandleCreated(EventArgs e)
        {
            base.OnHandleCreated(e);
            RegisterHotKey(Handle, HotkeyId, MOD_CONTROL | MOD_SHIFT | MOD_NOREPEAT, (int)Keys.O);
        }

        protected override void WndProc(ref Message m)
        {
            if (m.Msg == WM_HOTKEY && m.WParam.ToInt32() == HotkeyId) { hooks.SetOverlayVisible(!settings.OverlayVisible); return; }
            base.WndProc(ref m);
        }

        protected override void SetVisibleCore(bool value)
        {
            if (startHidden) { startHidden = false; value = false; if (!IsHandleCreated) CreateHandle(); }
            base.SetVisibleCore(value);
        }

        async Task InitWebView()
        {
            try
            {
                string dataDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "SBBridge", "WebView2");
                env = await CoreWebView2Environment.CreateAsync(null, dataDir, null);
                await web.EnsureCoreWebView2Async(env);
            }
            catch (WebView2RuntimeNotFoundException)
            {
                if (MessageBox.Show(this, "Steel Battalion Bridge needs the Microsoft Edge WebView2 Runtime, which isn't installed.\r\n\r\nOpen the download page now?",
                        "Steel Battalion Bridge", MessageBoxButtons.YesNo, MessageBoxIcon.Warning) == DialogResult.Yes)
                    OpenExternal("https://developer.microsoft.com/microsoft-edge/webview2/");
                return;
            }
            catch (Exception ex)
            {
                MessageBox.Show(this, "Couldn't start the user interface: " + ex.Message, "Steel Battalion Bridge", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            var core = web.CoreWebView2;
            core.Settings.AreDefaultContextMenusEnabled = false;
            core.Settings.IsStatusBarEnabled = false;
            core.Settings.AreDevToolsEnabled = Environment.GetEnvironmentVariable("SBBRIDGE_DEVTOOLS") == "1";
            core.Settings.IsGeneralAutofillEnabled = false;
            core.Settings.IsPasswordAutosaveEnabled = false;
            core.AddWebResourceRequestedFilter(Origin + "/*", CoreWebView2WebResourceContext.All);
            core.WebResourceRequested += OnWebResourceRequested;
            core.NavigationStarting += (s, e) =>
            {
                if (!e.Uri.StartsWith(Origin + "/", StringComparison.OrdinalIgnoreCase)) { e.Cancel = true; OpenExternal(e.Uri); }
            };
            core.NewWindowRequested += (s, e) => { e.Handled = true; OpenExternal(e.Uri); };
            core.DocumentTitleChanged += (s, e) => { };
            core.Navigate(Origin + "/");
        }

        static void OpenExternal(string url)
        {
            if (url.StartsWith("https://", StringComparison.OrdinalIgnoreCase) || url.StartsWith("http://", StringComparison.OrdinalIgnoreCase))
                try { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); } catch { }
        }

        void OnWebResourceRequested(object sender, CoreWebView2WebResourceRequestedEventArgs e)
        {
            var uri = new Uri(e.Request.Uri);
            string path = uri.AbsolutePath;

            if (path.StartsWith("/api/", StringComparison.Ordinal))
            {
                string method = e.Request.Method, body = null;
                if (e.Request.Content != null)
                    using (var r = new StreamReader(e.Request.Content, Encoding.UTF8)) body = r.ReadToEnd();
                var deferral = e.GetDeferral();
                // The API may block (e.g. waiting for a UAC-elevated driver install), so run it off the UI thread.
                Task.Run(() => api.Handle(method, path, body)).ContinueWith(t =>
                {
                    var ar = t.IsFaulted ? ApiResponse.Error(500, t.Exception.GetBaseException().Message) : t.Result;
                    BeginInvoke((Action)(() =>
                    {
                        try
                        {
                            e.Response = env.CreateWebResourceResponse(new MemoryStream(Encoding.UTF8.GetBytes(ar.Json)), ar.Status,
                                ar.Status == 200 ? "OK" : "Error", "Content-Type: application/json; charset=utf-8\r\nCache-Control: no-store");
                        }
                        finally { deferral.Complete(); }
                    }));
                });
                return;
            }

            if (path == "/") path = "/index.html";
            var data = WebAssets.Get(path.TrimStart('/'));
            if (data == null)
            {
                e.Response = env.CreateWebResourceResponse(new MemoryStream(Encoding.UTF8.GetBytes("Not found")), 404, "Not Found", "Content-Type: text/plain");
                return;
            }
            string type = ContentType(path);
            string headers = "Content-Type: " + type + "\r\nX-Content-Type-Options: nosniff";
            if (path == "/index.html") headers += "\r\nContent-Security-Policy: " + WebAssets.Csp;
            e.Response = env.CreateWebResourceResponse(new MemoryStream(data), 200, "OK", headers);
        }

        static string ContentType(string path)
        {
            switch (Path.GetExtension(path).ToLowerInvariant())
            {
                case ".html": return "text/html; charset=utf-8";
                case ".js": return "text/javascript; charset=utf-8";
                case ".css": return "text/css; charset=utf-8";
                case ".svg": return "image/svg+xml";
                case ".png": return "image/png";
                default: return "application/octet-stream";
            }
        }

        // ------------------------------------------------------------------ tray
        void BuildTray()
        {
            var menu = new ContextMenuStrip();
            menu.Items.Add("Open Steel Battalion Bridge", null, (s, e) => ShowWindow());
            trayOutput = new ToolStripMenuItem("Output enabled") { CheckOnClick = true, Checked = engine.OutputEnabled };
            trayOutput.CheckedChanged += (s, e) => { engine.OutputEnabled = settings.OutputEnabled = trayOutput.Checked; settings.Save(); };
            menu.Opening += (s, e) => trayOutput.Checked = engine.OutputEnabled;
            menu.Items.Add(trayOutput);
            trayOverlay = new ToolStripMenuItem("Show control overlay   Ctrl+Shift+O") { Checked = settings.OverlayVisible };
            trayOverlay.Click += (s, e) => hooks.SetOverlayVisible(!settings.OverlayVisible);
            menu.Items.Add(trayOverlay);
            menu.Items.Add(new ToolStripSeparator());
            menu.Items.Add("Quit", null, (s, e) => { exiting = true; Close(); });
            tray = new NotifyIcon { Icon = Icon, Text = "Steel Battalion Bridge", Visible = true, ContextMenuStrip = menu };
            tray.DoubleClick += (s, e) => ShowWindow();
        }

        public void ShowWindow()
        {
            if (InvokeRequired) { BeginInvoke((Action)ShowWindow); return; }
            Show();
            if (WindowState == FormWindowState.Minimized) WindowState = FormWindowState.Normal;
            Activate();
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            if (!exiting && settings.CloseToTray && e.CloseReason == CloseReason.UserClosing)
            {
                e.Cancel = true; Hide();
                if (!balloonShown)
                {
                    tray.ShowBalloonTip(3000, "Still running", "Steel Battalion Bridge keeps the controller working from the tray. Right-click the tray icon to quit.", ToolTipIcon.Info);
                    balloonShown = true;
                }
                return;
            }
            tray.Visible = false;
            overlaySync.Stop();
            overlay.HideOverlay();
            if (IsHandleCreated) UnregisterHotKey(Handle, HotkeyId);
            base.OnFormClosing(e);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) { if (tray != null) tray.Dispose(); web.Dispose(); overlay.Dispose(); overlaySync.Dispose(); }
            base.Dispose(disposing);
        }
    }
}
