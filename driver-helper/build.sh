#!/bin/sh
# Build sbdriver.exe (x64) with mingw-w64.
set -e
cd "$(dirname "$0")"
x86_64-w64-mingw32-gcc -O2 -s -std=gnu11 -Wall -DINCLUDE_DEBUG_LOGGING -Ilibwdi -o sbdriver.exe \
  sbdriver.c libwdi/pki.c libwdi/logging_shim.c \
  -lsetupapi -lnewdev -lcfgmgr32 -lcrypt32 -ladvapi32 -static
echo "Built sbdriver.exe"
