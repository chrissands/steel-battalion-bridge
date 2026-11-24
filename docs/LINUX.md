# Steel Battalion Bridge on Linux (Bazzite, SteamOS, Fedora, Ubuntu, Arch...)

On Linux, Steel Battalion Bridge runs as a **background service** that turns the controller into a
virtual **Xbox 360 controller**. Steam Input, SDL and games pick it up natively, in both Desktop Mode
and Gaming Mode. You change bindings in a **settings page in your browser**. It's the same Fluent 2 UI
as the Windows app.

## Install

Open a terminal (Konsole on Bazzite) and run:

```bash
curl -fsSL https://raw.githubusercontent.com/chrissands/steel-battalion-bridge/main/linux/install.sh | bash
```

Or download `sbbridge-linux-x64.tar.gz` from the
[Releases](https://github.com/chrissands/steel-battalion-bridge/releases) page, extract it, and run
`./install.sh`.

The installer:
- copies the program to `~/.local/share/sbbridge/` (nothing is layered onto the read-only Bazzite/SteamOS image)
- asks for your password **once** to add a udev rule (`/etc/udev/rules.d/70-steel-battalion-bridge.rules`).
  The rule lets your user access the controller and `/dev/uinput`, the kernel interface for virtual input devices.
- enables a **systemd user service** that starts at login, including when Bazzite boots straight into Gaming Mode
- adds **Steel Battalion Bridge** to your app menu, which opens the settings page

Then plug in the controller (replug it if it was already connected) and open
<http://127.0.0.1:8732/>.

> On a Steam Deck / SteamOS, `sudo` needs a password. Set one first with `passwd` if you haven't already.

## Using it

- **Live view:** every cockpit control, plus exactly what the virtual Xbox pad is sending.
- **Bindings:** click **Learn**, press a cockpit control, then pick the output: Xbox button, stick or
  trigger; keyboard key; mouse button; or mouse movement. Changes apply instantly and save automatically.
- **Calibration:** sweep every axis, release everything, then click Finish.
- **Profiles** are XML files in `~/.config/SBBridge/Profiles`, in the same format as the Windows
  version, so you can copy them between PCs.

**Control overlay:** <http://127.0.0.1:8732/overlay.html> is a compact cheat sheet of what each
cockpit control does. The control you're pressing lights up. In Gaming Mode, press the Steam button,
open the web browser and load that address. It then sits in Steam's overlay, so you can open it
mid-game. In Desktop Mode, keep it on a second screen.

In Steam the virtual pad appears as an **Xbox 360 Controller**, so per-game Steam Input layouts work
on top of SBBridge's bindings. Keys go through a virtual keyboard, which works under X11, Wayland and
Gaming Mode (gamescope).

## Managing the service

```bash
systemctl --user status sbbridge      # is it running?
journalctl --user -u sbbridge -e      # logs
systemctl --user restart sbbridge
~/.local/share/sbbridge/uninstall.sh  # remove (add --purge to also delete profiles)
```

To update, run the install command again.

## Troubleshooting

| Settings page says | Fix |
|---|---|
| Controller not detected on USB | Check the cable / breakaway adapter; `lsusb` should list `0a7b:d000` |
| Permission denied | The udev rule isn't active yet: replug the controller, or log out and back in |
| `/dev/uinput` not found / no permission | `sudo modprobe uinput`, then log out and back in |
| Page doesn't load | `systemctl --user status sbbridge` |

## How it's built

`src/SBBridge.Linux` shares the platform-neutral core (`src/SBBridge/Core`) with the Windows app, and
adds three Linux backends:

| Piece | Linux implementation |
|---|---|
| USB transport | libusb-1.0 (interface 0, interrupt IN 0x82 / OUT 0x01) |
| Virtual Xbox 360 pad | uinput device `045e:028e` "Microsoft X-Box 360 pad", same event layout as the kernel's `xpad` driver |
| Keyboard / mouse | a second uinput device (keys, buttons, relative motion, wheel) |
| UI | the shared Fluent 2 UI (`web/dist`), served by the service on `127.0.0.1:8732` only. It rejects other Host headers, and every change needs a custom header that other websites can't send, which blocks cross-site requests. |

The release binary is a self-contained .NET 8 single file, so no runtime needs to be installed. Build
it with `./build-linux.sh` (needs the .NET 8 SDK).
