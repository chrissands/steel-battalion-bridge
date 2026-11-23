# Steel Battalion Bridge

Use the original Xbox **Steel Battalion** controller on **Windows 10/11** and **Linux (Bazzite,
SteamOS and other distros)** as a modern **XInput / Steam Input** controller. The controller plugs straight into USB, so no
adapter board or other hardware is needed.

```
Steel Battalion ──USB──► WinUSB (Microsoft's signed inbox driver)
                              │
                         SBBridge.exe  ── reads 26-byte reports, applies your bindings
                              │
          ┌───────────────────┼───────────────────────┐
   Virtual Xbox 360 pad   Keyboard keys          Cockpit LEDs
   (ViGEmBus → XInput,    (SendInput scan        (button lights, gear
    Steam Input sees it)   codes, any game)       indicator)
```

## Why there is no custom kernel driver

Windows 11 x64 only loads kernel drivers that Microsoft has signed. That takes an EV
certificate plus attestation signing. The alternative is turning on test-signing
mode, which anti-cheat software blocks. Two signed drivers cover the job instead:

| Layer | Driver | Role |
|---|---|---|
| Talk to the controller | **WinUSB** (inbox, Microsoft) | Raw USB access to the 0A7B:D000 device |
| Show up as a gamepad | **ViGEmBus** (signed, free) | Creates a real "Xbox 360 Controller" device |

`SBBridge.exe` is the user-mode driver logic that sits between them. It talks to
ViGEmBus directly, so it needs no extra DLLs.

> **Download:** get `SBBridge-Setup-x.y.z.exe` from the [Releases](https://github.com/chrissands/steel-battalion-bridge/releases) page.

## Linux / Bazzite

```bash
curl -fsSL https://raw.githubusercontent.com/chrissands/steel-battalion-bridge/main/linux/install.sh | bash
```

This installs a background service plus a settings page at <http://127.0.0.1:8732/>. See
[docs/LINUX.md](docs/LINUX.md) for details. The rest of this README covers Windows.

## Install (Windows)

1. Download and run **`SBBridge-Setup-1.0.0.exe`**, then accept the admin (UAC) prompt.
2. Leave the default options ticked and click Install. The installer:
   - installs the app to `C:\Program Files\Steel Battalion Bridge`, with Start-menu and desktop shortcuts
   - **binds WinUSB to the controller** automatically, whether it's plugged in now or later
   - installs **ViGEmBus** silently (skipped if it's already installed)
3. Plug in the controller and launch the app. Both status lines should turn green.
4. On the **Calibration** tab, sweep every axis through its full range, release everything,
   then click *Finish*. Then adjust the **Bindings** tab if you like.

Windows 10/11 64-bit is required. No reboot is usually needed; the installer asks if one is.
Uninstall it from *Settings → Apps → Installed apps*. The uninstaller can also remove the
driver binding. Your profiles in `%AppData%\SBBridge` are kept.

### How the driver install works

Windows only accepts a driver package if its catalog is signed by a trusted certificate. The
helper (`sbdriver.exe`) handles this locally, the same way Zadig does (it uses Zadig's own
libwdi code):
1. It writes a tiny INF that maps `USB\VID_0A7B&PID_D000` to Microsoft's inbox `winusb.sys`.
2. It creates a **certificate unique to this PC**, signs the INF's catalog with it, adds the
   certificate to the machine's trusted stores, and **destroys the private key immediately**.
   Nothing else can ever be signed with that certificate.
3. It adds the package to the Windows driver store, so the controller binds automatically
   whenever it's connected.

`sbdriver status` shows which driver the controller is using. `sbdriver uninstall` removes the
package, the binding and the certificate.

### Manual setup (portable / no installer)

If a status line in the app is red, click the button next to it (*Set up driver...* or
*Install ViGEmBus...*). Without the installer:
1. Bind WinUSB in Device Manager: *Unknown device* → *Update driver* → *Browse my computer* →
   *Let me pick* → *Universal Serial Bus devices* → **WinUsb Device**. Zadig also works.
2. Install ViGEmBus from <https://github.com/nefarius/ViGEmBus/releases>.

## Using it with Steam / MechWarrior

- Games and Steam see a standard **Xbox 360 Controller**. Steam Input supports it natively,
  so you can add per-game remaps and action sets in Steam on top of SBBridge's own bindings.
- The Steel Battalion itself is invisible to Steam (it's on WinUSB), so you never get
  duplicate inputs.
- An Xbox pad has 15 buttons and 6 axes, while the cockpit has about 40 buttons, 5 switches,
  8 axes, a gear lever and a dial. The default **"Cockpit – Xbox + keys"** profile puts the
  flight controls on the pad and sends the remaining buttons as keys (numpad, F-keys, 1–5)
  that you bind in-game. A **Shift control** gives everything a second layer.
- The latching toggle switches default to *PulseOnChange*: each flip taps a key once, which
  suits games that use a single toggle key.

### Default cockpit profile (summary)

| Cockpit | Output |
|---|---|
| Aiming lever X / Y | Right stick (aim / torso). Flip *Invert* on Y if it's backwards |
| Rotation lever | Left stick X (turn) |
| Gear lever | Left stick Y as a throttle: R = back, N = stop, 1–5 = 20–100% |
| Right / middle pedal | Right trigger (accelerate) / Left trigger (brake) |
| Left (slide) pedal | Left-stick click (boost / jump jets) |
| Sight-change thumbstick | D-pad |
| Main Weapon / Fire / Lock On | RB / LB / Y |
| Weapon Con Main / Sub / Magazine | X / B / A |
| Start / Mode Select / Eject | Start / Back / Guide |
| Comm 1–5, F1–F3, functions, toggles, tuner | Keys (edit as you like) |

## Bindings editor

- **Learn**: click it, then press a cockpit control. It creates or fills in a binding for that control.
- **Output kinds**: Xbox button, Xbox axis/trigger, keyboard key (with Ctrl/Shift/Alt), mouse
  button/wheel, or mouse movement (axis → cursor velocity).
- **Button modes**: Hold, Pulse, PulseOnChange, Toggle.
- **Axis tuning**: invert, dead zone, curve, scale, and threshold (an axis can drive a button
  or key, e.g. pedal past 50% → key).
- **Events**: *Gear shifted up/down* and *Tuner clockwise/counter-clockwise* fire a single tap per click.
- Changes apply live and save automatically. Profiles are XML files in
  `%AppData%\SBBridge\Profiles`, so they're easy to share or back up.

## Building from source

- Windows: `dotnet build -c Release src/SBBridge`, or open the `.csproj` in Visual Studio 2022.
- Linux (how the release was built): `./build-installer.sh 1.0.0` builds `SBBridge.exe`
  (Mono `mcs`), `sbdriver.exe` (mingw-w64) and the installer (NSIS). Requirements:
  `apt install mono-devel mingw-w64 nsis`.
- Tests: `tests/LogicAndUiTests.cs` covers the report parsing, mapping, profile round-trip,
  the engine with fake devices, and a UI smoke test. Run it under Mono with the same compiler flags as `build.sh`.

## Project layout

```
installer/           NSIS installer script + icon
driver-helper/       sbdriver.exe source (WinUSB INF + local catalog signing; libwdi pki.c, LGPL)
redist/              official ViGEmBus installer (BSD-3)
src/SBBridge/
  Core/              platform-neutral: protocol, mapper, engine, profiles (shared with Linux)
  Platform/Windows/  WinUSB transport, ViGEmBus virtual pad, SendInput
  UI/                WinForms binding utility (tray app)
docs/LINUX.md        Linux / Bazzite guide
linux/               Linux install / uninstall scripts
src/SBBridge.Linux/  Linux service: libusb transport, uinput Xbox 360 pad + keyboard, web UI
tests/linux/         Linux tests (uinput layouts, key map, web API)
```

## Troubleshooting

| Status | Fix |
|---|---|
| "Controller not detected on USB" | Check the cable / Xbox-to-USB breakaway adapter |
| "WinUSB isn't bound to it" | Click **Set up driver...** next to the status line |
| "ViGEmBus driver not installed" | Click **Install ViGEmBus...**, then reboot if asked |
| Axis backwards | Tick *Invert* on that binding |
| Axis doesn't reach full / drifts | Run Calibration; raise *Deadzone* |
| Keys ignored in a game | Some games only read the pad: bind that control to an Xbox output instead |

Protocol facts were cross-checked against SteelBattalion.NET (J. Coutcher), libSteelBattalion
(faha223) and the Teensy SBC library (S. Saldana). The ViGEmBus IOCTL layout comes from
nefarius/ViGEmClient (MIT). The code here was written fresh.
