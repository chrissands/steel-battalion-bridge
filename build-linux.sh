#!/bin/sh
# Builds the Linux release tarball: out/sbbridge-linux-x64.tar.gz
# Needs the .NET 8 SDK (and network access to NuGet for the runtime pack).
set -e
cd "$(dirname "$0")"
VERSION="${1:-1.1.0}"
rm -rf out/linux && mkdir -p out/linux/sbbridge
dotnet publish src/SBBridge.Linux/SBBridge.Linux.csproj -c Release -r linux-x64 --self-contained true \
  -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -p:Version="$VERSION" \
  -o out/linux/publish
cp out/linux/publish/sbbridge linux/install.sh linux/uninstall.sh linux/sbbridge.png out/linux/sbbridge/
cp docs/LINUX.md out/linux/sbbridge/README-LINUX.md
chmod 755 out/linux/sbbridge/sbbridge out/linux/sbbridge/install.sh out/linux/sbbridge/uninstall.sh
tar -C out/linux -czf out/sbbridge-linux-x64.tar.gz sbbridge
echo "Built out/sbbridge-linux-x64.tar.gz ($VERSION)"
