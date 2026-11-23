using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using SBBridge.Core;

namespace SBBridge.Linux
{
    static class Program
    {
        static int Main(string[] args)
        {
            int port = 8732;
            bool open = false;
            for (int i = 0; i < args.Length; i++)
            {
                if (args[i] == "--port" && i + 1 < args.Length) int.TryParse(args[++i], out port);
                else if (args[i] == "--open") open = true;
                else if (args[i] == "--version") { Console.WriteLine(typeof(Program).Assembly.GetName().Version.ToString(3)); return 0; }
                else if (args[i] == "--help" || args[i] == "-h")
                {
                    Console.WriteLine("sbbridge - Steel Battalion controller -> virtual Xbox 360 pad\n" +
                                      "  --port N   web UI port (default 8732)\n  --open     open the web UI in a browser\n  --version");
                    return 0;
                }
            }
            var env = Environment.GetEnvironmentVariable("SBBRIDGE_PORT");
            int ep; if (env != null && int.TryParse(env, out ep)) port = ep;

            var settings = AppSettings.Load();
            var store = new ProfileStore(AppSettings.ProfileFolder);
            store.EnsureDefaults();
            Profile profile;
            try { profile = store.Load(settings.ActiveProfile != null && store.Exists(settings.ActiveProfile) ? settings.ActiveProfile : store.Names()[0]); }
            catch (Exception e) { Console.Error.WriteLine("Profile load failed (" + e.Message + "), using built-in default."); profile = DefaultProfiles.Cockpit(); }

            var injector = new UInputInjector();
            string inputStatus = injector.Open() ? "Virtual keyboard/mouse active" : injector.LastError;
            Console.WriteLine("Keyboard/mouse: " + inputStatus);

            var engine = new Engine(new LibUsbTransport(), new UInputGamepad(), injector, settings) { Profile = profile };
            engine.OutputEnabled = settings.OutputEnabled;
            engine.Start();

            var web = new WebServer(engine, settings, store, port) { InputStatus = inputStatus };
            try { web.Start(); }
            catch (Exception e) { Console.Error.WriteLine("Could not start web UI on port " + port + ": " + e.Message + " (is another copy running?)"); engine.Dispose(); return 1; }

            string url = "http://127.0.0.1:" + port + "/";
            Console.WriteLine("Steel Battalion Bridge running. Settings: " + url);
            if (open) try { Process.Start(new ProcessStartInfo("xdg-open", url) { UseShellExecute = false }); } catch { }

            var quit = new ManualResetEventSlim();
            using (PosixSignalRegistration.Create(PosixSignal.SIGTERM, c => { c.Cancel = true; quit.Set(); }))
            using (PosixSignalRegistration.Create(PosixSignal.SIGINT, c => { c.Cancel = true; quit.Set(); }))
            {
                string last = null;
                while (!quit.Wait(2000))
                {
                    // /dev/uinput access can appear after login (udev ACL) - keep retrying the virtual keyboard.
                    if (!injector.IsReady && injector.Open()) { web.InputStatus = "Virtual keyboard/mouse active"; Console.WriteLine("Keyboard/mouse: active"); }
                    else if (!injector.IsReady) web.InputStatus = injector.LastError;
                    string s = "controller: " + (engine.Connected ? "connected" : engine.UsbStatus) + " | pad: " + engine.PadStatus;
                    if (s != last) { Console.WriteLine(s); last = s; }
                }
            }
            Console.WriteLine("Shutting down...");
            web.Dispose();
            engine.Dispose();
            injector.Dispose();
            settings.Save();
            return 0;
        }
    }
}
