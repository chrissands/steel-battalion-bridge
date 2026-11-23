#!/usr/bin/env bash
# Steel Battalion Bridge - Linux installer (Bazzite, SteamOS, Fedora, Ubuntu, Arch...)
#
#   curl -fsSL https://raw.githubusercontent.com/chrissands/steel-battalion-bridge/main/linux/install.sh | bash
# or, from an extracted release tarball:
#   ./install.sh
#
# Installs per-user (no system packages, works on immutable Bazzite/SteamOS):
#   ~/.local/share/sbbridge/        the program
#   ~/.config/systemd/user/         background service (starts at login, also in Gaming Mode)
#   ~/.local/share/applications/    "Steel Battalion Bridge" menu entry (opens the settings page)
# and, with one sudo prompt, a udev rule so your user can access the controller and /dev/uinput.
#
# Options: --no-sudo (skip the udev step)  --no-open (don't open the browser)  --version vX.Y.Z
set -euo pipefail

REPO="chrissands/steel-battalion-bridge"
ASSET="sbbridge-linux-x64.tar.gz"
APP_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/sbbridge"
BIN_LINK="$HOME/.local/bin/sbbridge"
UNIT_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
DESKTOP_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/applications"
RULE_FILE="/etc/udev/rules.d/70-steel-battalion-bridge.rules"
MODULES_FILE="/etc/modules-load.d/steel-battalion-bridge.conf"
PORT="${SBBRIDGE_PORT:-8732}"
URL="http://127.0.0.1:${PORT}/"

USE_SUDO=1; OPEN=1; VERSION="latest"
while [ $# -gt 0 ]; do
  case "$1" in
    --no-sudo) USE_SUDO=0 ;;
    --no-open) OPEN=0 ;;
    --version) VERSION="$2"; shift ;;
    -h|--help) sed -n '2,17p' "$0"; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 2 ;;
  esac
  shift
done

say()  { printf '\033[1;32m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!!\033[0m  %s\n' "$*" >&2; }
die()  { printf '\033[1;31mxx\033[0m  %s\n' "$*" >&2; exit 1; }

[ "$(uname -s)" = "Linux" ] || die "This installer is for Linux."
[ "$(uname -m)" = "x86_64" ] || die "Only x86_64 is supported right now (found $(uname -m))."
[ "$(id -u)" -ne 0 ] || die "Run this as your normal user, not root (it asks for sudo only for the udev rule)."
command -v systemctl >/dev/null || die "systemd is required."

# ---------------------------------------------------------------- 1. get the program
SRC_DIR=""
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd || true)"
if [ -n "$SCRIPT_DIR" ] && [ -x "$SCRIPT_DIR/sbbridge" ]; then
  SRC_DIR="$SCRIPT_DIR"
  say "Installing from $SRC_DIR"
else
  command -v curl >/dev/null || die "curl is required."
  TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
  if [ "$VERSION" = "latest" ]; then DL="https://github.com/$REPO/releases/latest/download/$ASSET"
  else DL="https://github.com/$REPO/releases/download/$VERSION/$ASSET"; fi
  say "Downloading $DL"
  curl -fL --progress-bar -o "$TMP/$ASSET" "$DL" || die "Download failed. Check your connection or the release page: https://github.com/$REPO/releases"
  tar -xzf "$TMP/$ASSET" -C "$TMP"
  SRC_DIR="$TMP/sbbridge"
  [ -x "$SRC_DIR/sbbridge" ] || die "The download didn't contain the sbbridge program."
fi

# ---------------------------------------------------------------- 2. install files
systemctl --user stop sbbridge.service 2>/dev/null || true
mkdir -p "$APP_DIR" "$(dirname "$BIN_LINK")" "$UNIT_DIR" "$DESKTOP_DIR"
install -m 755 "$SRC_DIR/sbbridge" "$APP_DIR/sbbridge"
for f in uninstall.sh sbbridge.png README-LINUX.md; do [ -f "$SRC_DIR/$f" ] && install -m 644 "$SRC_DIR/$f" "$APP_DIR/$f"; done
chmod 755 "$APP_DIR/uninstall.sh" 2>/dev/null || true
ln -sf "$APP_DIR/sbbridge" "$BIN_LINK"
say "Installed program to $APP_DIR"

# ---------------------------------------------------------------- 3. udev rule (needs sudo once)
RULE='# Steel Battalion Bridge: give the logged-in user access to the controller and to uinput
SUBSYSTEM=="usb", ATTRS{idVendor}=="0a7b", ATTRS{idProduct}=="d000", MODE="0660", TAG+="uaccess"
KERNEL=="uinput", SUBSYSTEM=="misc", TAG+="uaccess", OPTIONS+="static_node=uinput"'
if [ "$USE_SUDO" = 1 ]; then
  if [ -f "$RULE_FILE" ] && [ "$(cat "$RULE_FILE")" = "$RULE" ]; then
    say "udev rule already installed"
  else
    say "Installing udev rule (sudo will ask for your password)"
    printf '%s\n' "$RULE" | sudo tee "$RULE_FILE" >/dev/null
    echo uinput | sudo tee "$MODULES_FILE" >/dev/null
  fi
  sudo modprobe uinput 2>/dev/null || true
  sudo udevadm control --reload-rules
  sudo udevadm trigger --subsystem-match=usb --attr-match=idVendor=0a7b || true
  sudo udevadm trigger --subsystem-match=misc --sysname-match=uinput || true
else
  warn "Skipped the udev rule (--no-sudo). Without it the controller and /dev/uinput may not be accessible."
fi

# ---------------------------------------------------------------- 4. background service
cat > "$UNIT_DIR/sbbridge.service" <<UNIT
[Unit]
Description=Steel Battalion Bridge (Steel Battalion controller -> virtual Xbox 360 pad)
Documentation=https://github.com/$REPO

[Service]
ExecStart=$APP_DIR/sbbridge --port $PORT
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
UNIT
systemctl --user daemon-reload
systemctl --user enable --now sbbridge.service
say "Background service enabled (systemctl --user status sbbridge)"

# ---------------------------------------------------------------- 5. menu entry
cat > "$DESKTOP_DIR/sbbridge.desktop" <<DESK
[Desktop Entry]
Type=Application
Name=Steel Battalion Bridge
Comment=Bindings and status for the Steel Battalion controller
Exec=xdg-open $URL
Icon=$APP_DIR/sbbridge.png
Categories=Game;Settings;
Terminal=false
DESK
command -v update-desktop-database >/dev/null && update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true

# ---------------------------------------------------------------- done
sleep 1
if systemctl --user is-active --quiet sbbridge.service; then
  say "Steel Battalion Bridge is running."
else
  warn "The service didn't start. See: journalctl --user -u sbbridge -e"
fi
echo
echo "  Settings page:  $URL   (also in your app menu as 'Steel Battalion Bridge')"
echo "  Plug in the controller (replug it if it was already connected)."
echo "  Uninstall:      $APP_DIR/uninstall.sh"
echo
if [ "$OPEN" = 1 ] && [ -n "${DISPLAY:-}${WAYLAND_DISPLAY:-}" ] && command -v xdg-open >/dev/null; then
  xdg-open "$URL" >/dev/null 2>&1 &
fi
