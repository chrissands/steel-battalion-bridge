using System;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;
using SBBridge.Core;
using SBBridge.Platform.Windows;
using SBBridge.UI;

namespace SBBridge
{
    static class Program
    {
        [DllImport("user32.dll")] static extern bool SetProcessDpiAwarenessContext(IntPtr value);
        static readonly IntPtr PerMonitorAwareV2 = new IntPtr(-4);

        [STAThread]
        static void Main(string[] args)
        {
            bool created;
            using (var mutex = new Mutex(true, "SBBridge.SingleInstance", out created))
            using (var showSignal = new EventWaitHandle(false, EventResetMode.AutoReset, "SBBridge.ShowWindow"))
            {
                if (!created) { showSignal.Set(); return; }   // bring the running copy to the front instead

                try { SetProcessDpiAwarenessContext(PerMonitorAwareV2); } catch { }
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);

                var settings = AppSettings.Load();
                var store = new ProfileStore(AppSettings.ProfileFolder);
                store.EnsureDefaults();
                Profile profile;
                try { profile = store.Load(settings.ActiveProfile != null && store.Exists(settings.ActiveProfile) ? settings.ActiveProfile : store.Names()[0]); }
                catch { profile = DefaultProfiles.Cockpit(); }

                var engine = new Engine(new WinUsbTransport(), new ViGEmGamepad(), new SendInputInjector(), settings) { Profile = profile };
                engine.OutputEnabled = settings.OutputEnabled;
                engine.TimerResolutionHook = on => { if (on) Native.timeBeginPeriod(1); else Native.timeEndPeriod(1); };
                engine.Start();

                var api = new UiApi(engine, settings, store, new WindowsHooks(settings))
                {
                    Version = typeof(Program).Assembly.GetName().Version.ToString(3)
                };

                bool minimized = settings.StartMinimized || Array.IndexOf(args, "--minimized") >= 0;
                using (var window = new MainWindow(api, engine, settings, minimized))
                {
                    var listener = new Thread(() => { while (showSignal.WaitOne()) window.ShowWindow(); }) { IsBackground = true };
                    listener.Start();
                    Application.Run(window);
                }
                api.Dispose();
                engine.Dispose();
                settings.Save();
            }
        }
    }
}
