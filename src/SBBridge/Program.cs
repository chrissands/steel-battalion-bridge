using System;
using System.Threading;
using System.Windows.Forms;
using SBBridge.Core;
using SBBridge.Platform.Windows;

namespace SBBridge
{
    static class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            bool created;
            using (var mutex = new Mutex(true, "SBBridge.SingleInstance", out created))
            {
                if (!created)
                {
                    MessageBox.Show("Steel Battalion Bridge is already running (check the system tray).", "SB Bridge");
                    return;
                }
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);

                var settings = AppSettings.Load();
                var engine = new Engine(new WinUsbTransport(), new ViGEmGamepad(), new SendInputInjector(), settings);
                engine.TimerResolutionHook = on => { if (on) Native.timeBeginPeriod(1); else Native.timeEndPeriod(1); };

                bool minimized = settings.StartMinimized || Array.IndexOf(args, "--minimized") >= 0;
                using (var form = new UI.MainForm(engine, settings, minimized))
                {
                    engine.Start();
                    Application.Run(form);
                }
                engine.Dispose();
                settings.Save();
            }
        }
    }
}
