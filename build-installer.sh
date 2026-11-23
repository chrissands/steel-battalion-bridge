#!/bin/sh
# Builds everything and produces SBBridge-Setup-<version>.exe
# Needs: mono-devel (mcs), mingw-w64, nsis   (Debian/Ubuntu: apt install mono-devel mingw-w64 nsis)
set -e
cd "$(dirname "$0")"
VERSION="${1:-1.0.0}"

./build.sh
./driver-helper/build.sh

if [ ! -f redist/ViGEmBus_setup.exe ]; then
  mkdir -p redist
  curl -fL -o redist/ViGEmBus_setup.exe \
    https://github.com/nefarius/ViGEmBus/releases/download/v1.22.0/ViGEmBus_1.22.0_x64_x86_arm64.exe
fi

makensis -V3 -DAPP_VERSION="$VERSION" installer/SBBridge.nsi
echo "Built SBBridge-Setup-$VERSION.exe"
