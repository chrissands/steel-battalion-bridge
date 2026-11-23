#!/usr/bin/env bash
# Steel Battalion Bridge - Linux uninstaller.  Options: --purge (also delete profiles/settings)  --no-sudo
set -uo pipefail
APP_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/sbbridge"
UNIT="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user/sbbridge.service"
DESKTOP="${XDG_DATA_HOME:-$HOME/.local/share}/applications/sbbridge.desktop"
CONFIG="${XDG_CONFIG_HOME:-$HOME/.config}/SBBridge"
PURGE=0; USE_SUDO=1
for a in "$@"; do case "$a" in --purge) PURGE=1 ;; --no-sudo) USE_SUDO=0 ;; esac; done

systemctl --user disable --now sbbridge.service 2>/dev/null
rm -f "$UNIT" "$DESKTOP" "$HOME/.local/bin/sbbridge"
systemctl --user daemon-reload 2>/dev/null
rm -rf "$APP_DIR"
if [ "$USE_SUDO" = 1 ] && { [ -f /etc/udev/rules.d/70-steel-battalion-bridge.rules ] || [ -f /etc/modules-load.d/steel-battalion-bridge.conf ]; }; then
  echo "Removing the udev rule (sudo may ask for your password)"
  sudo rm -f /etc/udev/rules.d/70-steel-battalion-bridge.rules /etc/modules-load.d/steel-battalion-bridge.conf
  sudo udevadm control --reload-rules
fi
if [ "$PURGE" = 1 ]; then rm -rf "$CONFIG"; echo "Deleted profiles and settings ($CONFIG)."
else echo "Kept your profiles and settings in $CONFIG (use --purge to delete them)."; fi
echo "Steel Battalion Bridge has been uninstalled."
