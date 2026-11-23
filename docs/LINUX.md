# Linux (Bazzite) port plan

The code is split so the port only replaces the three platform backends. `Core/` (protocol,
mapper, engine, profiles) is plain C# with no Windows calls.

| Interface (`Core/Platform.cs`) | Windows | Linux / Bazzite |
|---|---|---|
| `IControllerTransport` | WinUSB | **libusb-1.0** via P/Invoke (or raw `usbfs` ioctls). Claim interface 0, interrupt IN 0x82 / OUT 0x01 |
| `IVirtualGamepad` | ViGEmBus | **uinput**: create a device with Xbox 360 identity (bus USB, VID 045E, PID 028E, name "Microsoft X-Box 360 pad") and the `xpad` button/axis codes. Steam Input and SDL recognise it as an Xbox pad |
| `IInputInjector` | SendInput | **uinput** keyboard/mouse device (`EV_KEY`, `EV_REL`) |

## Bazzite specifics

- **udev rule** so the app doesn't need root (`/etc/udev/rules.d/70-steel-battalion.rules`):
  ```
  SUBSYSTEM=="usb", ATTRS{idVendor}=="0a7b", ATTRS{idProduct}=="d000", MODE="0660", TAG+="uaccess"
  KERNEL=="uinput", MODE="0660", TAG+="uaccess"
  ```
  `/etc` is writable on Bazzite (only `/usr` is immutable), so no layering is needed.
- **Runtime**: Bazzite has no Mono or .NET out of the box. The plan is to ship the Linux build
  as a self-contained .NET 8 single-file binary, or as a Flatpak with `--device=all`. The
  headless engine can then run as a **systemd user service**, so the controller works in
  Gaming Mode without the UI.
- **UI**: the WinForms editor runs under Mono for desktop-mode editing. The service reads the
  same XML profiles from `~/.config/SBBridge/Profiles`.
- The kernel `xpad` driver doesn't claim 0A7B:D000, so there's no conflict.

Next step when we get there: add `Platform/Linux/{LibUsbTransport,UInputGamepad,UInputInjector}.cs`
and a `--headless` switch in `Program.cs`.
