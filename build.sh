#!/bin/sh
# Build SBBridge.exe with Mono's compiler (Linux/macOS). On Windows use: dotnet build -c Release src/SBBridge
set -e
cd "$(dirname "$0")/src/SBBridge"
mcs -target:winexe -sdk:4.8 -langversion:7.2 -optimize+ -platform:x64 \
  -r:System.Windows.Forms.dll -r:System.Drawing.dll -r:System.Xml.dll -r:System.Core.dll -r:Microsoft.VisualBasic.dll \
  -win32icon:../../installer/sbbridge.ico -out:../../SBBridge.exe $(find . -name '*.cs')
echo "Built SBBridge.exe"
