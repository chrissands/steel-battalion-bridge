using System;
using System.Diagnostics;
using System.Threading;


namespace SBBridge.Core
{
    /// <summary>
    /// Runs two threads: a USB reader (latest report wins) and a 250 Hz mapper that drives
    /// the virtual pad, keyboard/mouse and LEDs. Platform-neutral; backends are injected.
    /// </summary>
    public sealed class Engine : IDisposable
    {
        readonly IControllerTransport usb;
        readonly IVirtualGamepad pad;
        readonly IInputInjector input;
        readonly AppSettings settings;
        readonly Mapper mapper = new Mapper();

        readonly object stateLock = new object();
        readonly ControllerState latest = new ControllerState();
        volatile bool connected, running;
        Thread reader, worker;

        Profile profile = new Profile();
        public Profile Profile { get { return profile; } set { profile = value ?? new Profile(); } }
        public volatile bool OutputEnabled = true;

        // Status for the UI
        public bool Connected { get { return connected; } }
        public string UsbStatus { get; private set; }
        public string PadStatus { get; private set; }
        public int ReportsPerSecond { get; private set; }
        PadReport lastPad; readonly object padLock = new object();
        public PadReport LastPad { get { lock (padLock) return lastPad; } }

        /// <summary>Optional hook to raise OS timer resolution (Windows: timeBeginPeriod).</summary>
        public Action<bool> TimerResolutionHook;

        public Engine(IControllerTransport usb, IVirtualGamepad pad, IInputInjector input, AppSettings settings)
        {
            this.usb = usb; this.pad = pad; this.input = input; this.settings = settings;
            UsbStatus = "Starting..."; PadStatus = "Starting...";
        }

        public void Start()
        {
            running = true;
            reader = new Thread(ReaderLoop) { IsBackground = true, Name = "SB USB reader" };
            worker = new Thread(WorkerLoop) { IsBackground = true, Name = "SB mapper", Priority = ThreadPriority.AboveNormal };
            reader.Start(); worker.Start();
        }

        public void GetState(ControllerState into) { lock (stateLock) latest.CopyTo(into); }

        /// <summary>Send a raw LED buffer (used by the LED test).</summary>
        public void TestLeds(int intensity)
        {
            var b = new byte[Sbc.LedReportSize];
            foreach (var c in Sbc.All) Sbc.SetLed(b, c.Led, intensity);
            ledOverrideUntil = Environment.TickCount + 1500;
            usb.Write(b);
        }
        volatile int ledOverrideUntil;

        void ReaderLoop()
        {
            var buf = new byte[64];
            var tmp = new ControllerState();
            int count = 0; var sw = Stopwatch.StartNew();
            while (running)
            {
                if (!usb.IsOpen)
                {
                    connected = false;
                    lock (stateLock) latest.Clear();
                    if (!usb.TryOpen()) { UsbStatus = usb.LastError; Sleep(2000); continue; }
                    UsbStatus = "Connected";
                }
                int n = usb.Read(buf, 250);
                if (n < 0) { usb.Close(); connected = false; UsbStatus = usb.LastError ?? "Disconnected"; Sleep(500); continue; }
                if (n >= Sbc.InputReportSize && tmp.Parse(buf, n))
                {
                    lock (stateLock) tmp.CopyTo(latest);
                    connected = true; count++;
                }
                if (sw.ElapsedMilliseconds >= 1000) { ReportsPerSecond = count; count = 0; sw.Restart(); }
            }
        }

        void Sleep(int ms) { for (int i = 0; i < ms / 50 && running; i++) Thread.Sleep(50); }

        void WorkerLoop()
        {
            if (TimerResolutionHook != null) TimerResolutionHook(true);
            var state = new ControllerState();
            var frame = new OutputFrame();
            var heldKeys = new bool[256];
            var heldMouse = new bool[5];
            var lastLeds = new byte[Sbc.LedReportSize]; bool ledsValid = false;
            PadReport sentPad = new PadReport(); bool padSent = false;
            long nextPadTry = 0, lastPadSubmit = 0;
            var clock = Stopwatch.StartNew();
            long last = 0;

            try
            {
                while (running)
                {
                    long now = clock.ElapsedMilliseconds;
                    double dt = Math.Min(0.05, (now - last) / 1000.0); last = now;

                    // Keep the virtual pad plugged in (retry if ViGEmBus appears later)
                    if (!pad.IsConnected && now >= nextPadTry)
                    {
                        PadStatus = pad.Connect() ? "Virtual Xbox 360 controller active" : pad.LastError;
                        nextPadTry = now + 5000; padSent = false;
                    }

                    GetState(state);
                    bool live = connected && OutputEnabled;
                    mapper.Tick(state, live, now, dt, profile, settings, frame);

                    // Virtual pad
                    if (pad.IsConnected && (!padSent || !frame.Pad.SameAs(sentPad) || now - lastPadSubmit > 500))
                    {
                        if (pad.Submit(frame.Pad)) { sentPad = frame.Pad; padSent = true; lastPadSubmit = now; }
                        else { pad.Disconnect(); PadStatus = pad.LastError; }
                    }
                    lock (padLock) lastPad = frame.Pad;

                    // Keyboard: modifiers go down first, come up last
                    ApplyKeys(frame.Keys, heldKeys);

                    // Mouse
                    for (int i = 0; i < 5; i++)
                        if (frame.Mouse[i] != heldMouse[i]) { input.MouseButton((MouseButtonId)i, frame.Mouse[i]); heldMouse[i] = frame.Mouse[i]; }
                    if (frame.Wheel != 0) input.Wheel(frame.Wheel);
                    if (frame.MouseDX != 0 || frame.MouseDY != 0) input.MouseMove(frame.MouseDX, frame.MouseDY);

                    // LEDs
                    if (connected && settings.LedFeedback && Environment.TickCount - ledOverrideUntil > 0)
                    {
                        bool diff = !ledsValid;
                        for (int i = 0; i < lastLeds.Length && !diff; i++) diff = lastLeds[i] != frame.Leds[i];
                        if (diff && usb.Write(frame.Leds)) { Buffer.BlockCopy(frame.Leds, 0, lastLeds, 0, lastLeds.Length); ledsValid = true; }
                    }
                    else if (!connected) ledsValid = false;

                    long spent = clock.ElapsedMilliseconds - now;
                    int wait = (int)(4 - spent);
                    Thread.Sleep(wait > 0 ? wait : 0);
                }
            }
            finally
            {
                // Release everything we might be holding
                ApplyKeys(new bool[256], heldKeys);
                for (int i = 0; i < 5; i++) if (heldMouse[i]) input.MouseButton((MouseButtonId)i, false);
                if (pad.IsConnected) pad.Submit(new PadReport());
                if (TimerResolutionHook != null) TimerResolutionHook(false);
            }
        }

        static readonly int[] Modifiers = { (int)KeyCode.ControlKey, (int)KeyCode.ShiftKey, (int)KeyCode.Menu };

        void ApplyKeys(bool[] want, bool[] held)
        {
            foreach (int m in Modifiers) if (want[m] && !held[m]) { input.Key((KeyCode)m, true); held[m] = true; }
            for (int vk = 1; vk < 256; vk++)
            {
                if (Array.IndexOf(Modifiers, vk) >= 0) continue;
                if (want[vk] != held[vk]) { input.Key((KeyCode)vk, want[vk]); held[vk] = want[vk]; }
            }
            foreach (int m in Modifiers) if (!want[m] && held[m]) { input.Key((KeyCode)m, false); held[m] = false; }
        }

        public void Dispose()
        {
            running = false;
            if (worker != null) worker.Join(1000);
            if (reader != null) reader.Join(1500);
            if (settings.LedFeedback && usb.IsOpen) usb.Write(new byte[Sbc.LedReportSize]);
            usb.Close();
            pad.Disconnect();
        }
    }
}
