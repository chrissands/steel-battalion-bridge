using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;
using Microsoft.Win32;
using SBBridge.Core;

namespace SBBridge.Platform.Windows
{
    /// <summary>Windows-only UI actions (driver setup, ViGEmBus) and app toggles (startup, tray).</summary>
    public sealed class WindowsHooks : IPlatformHooks
    {
        readonly AppSettings settings;
        const string RunKey = @"Software\Microsoft\Windows\CurrentVersion\Run";

        public WindowsHooks(AppSettings settings) { this.settings = settings; }

        public string Platform { get { return "windows"; } }
        public string InputStatus { get { return "Virtual keyboard/mouse active"; } }
        public string ServiceHint { get { return "Runs in the system tray. Closing the window keeps the controller working; quit from the tray icon."; } }

        static string AppDir { get { return Path.GetDirectoryName(Application.ExecutablePath); } }

        public IList<PlatformAction> Actions(Engine engine)
        {
            var list = new List<PlatformAction>();
            if (!engine.Connected && engine.UsbStatus != null && engine.UsbStatus.Contains("WinUSB"))
                list.Add(new PlatformAction { Id = "fix-driver", Label = "Set up driver", Description = "Binds Microsoft's WinUSB driver to the controller (asks for admin)", Primary = true });
            if (engine.PadStatus != null && engine.PadStatus.Contains("ViGEmBus driver not installed"))
                list.Add(new PlatformAction { Id = "install-vigem", Label = "Install ViGEmBus", Description = "Installs the virtual Xbox controller driver (asks for admin)", Primary = true });
            return list;
        }

        public string RunAction(string id)
        {
            if (id == "fix-driver")
            {
                string helper = Path.Combine(AppDir, "sbdriver.exe");
                if (!File.Exists(helper)) return "The driver helper (sbdriver.exe) is missing. Reinstall Steel Battalion Bridge.";
                int rc = RunElevated(helper, "install \"" + Path.Combine(AppDir, "driver") + "\"");
                if (rc == 0) return "Controller driver installed. It should connect in a few seconds.";
                if (rc == 2) return "Controller driver installed. Restart Windows to finish.";
                if (rc == -1) return "Cancelled.";
                return "Driver setup failed (code " + rc + "). Unplug and replug the controller, then try again.";
            }
            if (id == "install-vigem")
            {
                string setup = Path.Combine(AppDir, "redist", "ViGEmBus_setup.exe");
                if (!File.Exists(setup)) { Process.Start("https://github.com/nefarius/ViGEmBus/releases"); return "Opened the ViGEmBus download page."; }
                int rc = RunElevated(setup, "/qn /norestart");
                if (rc == 0) return "ViGEmBus installed. The virtual Xbox controller appears in a few seconds.";
                if (rc == 3010) return "ViGEmBus installed. Restart Windows to finish.";
                if (rc == -1) return "Cancelled.";
                return "ViGEmBus setup returned code " + rc + ".";
            }
            return "Unknown action.";
        }

        static int RunElevated(string exe, string args)
        {
            try
            {
                var psi = new ProcessStartInfo(exe, args) { Verb = "runas", UseShellExecute = true, WindowStyle = ProcessWindowStyle.Hidden };
                using (var p = Process.Start(psi)) { p.WaitForExit(); return p.ExitCode; }
            }
            catch (Win32Exception) { return -1; } // UAC prompt declined
        }

        public IList<PlatformToggle> Toggles()
        {
            return new List<PlatformToggle>
            {
                new PlatformToggle { Id = "startWithWindows", Label = "Start with Windows", Value = IsStartupEnabled() },
                new PlatformToggle { Id = "startMinimized", Label = "Start minimized to the tray", Value = settings.StartMinimized },
                new PlatformToggle { Id = "closeToTray", Label = "Closing the window keeps it running in the tray", Value = settings.CloseToTray },
            };
        }

        public void SetToggle(string id, bool value)
        {
            switch (id)
            {
                case "startWithWindows": SetStartup(value); break;
                case "startMinimized": settings.StartMinimized = value; settings.Save(); break;
                case "closeToTray": settings.CloseToTray = value; settings.Save(); break;
            }
        }

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
    }
}
