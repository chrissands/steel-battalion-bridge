; Steel Battalion Bridge - Windows installer (NSIS 3)
; Build:  makensis installer/SBBridge.nsi   (run from the repo root via build-installer.sh)

Unicode true
SetCompressor /SOLID lzma

!define APP_NAME      "Steel Battalion Bridge"
!define APP_EXE       "SBBridge.exe"
!ifndef APP_VERSION
  !define APP_VERSION "1.2.0"
!endif
!define PUBLISHER     "Steel Battalion Bridge contributors"
!define UNINST_KEY    "Software\Microsoft\Windows\CurrentVersion\Uninstall\SteelBattalionBridge"
!define RUN_KEY       "Software\Microsoft\Windows\CurrentVersion\Run"
!define ROOT          ".."

Name "${APP_NAME}"
OutFile "${ROOT}\SBBridge-Setup-${APP_VERSION}.exe"
InstallDir "$PROGRAMFILES64\${APP_NAME}"
InstallDirRegKey HKLM "${UNINST_KEY}" "InstallLocation"
RequestExecutionLevel admin
ShowInstDetails show
ShowUninstDetails show
BrandingText "${APP_NAME} ${APP_VERSION}"

VIProductVersion "${APP_VERSION}.0"
VIAddVersionKey "ProductName" "${APP_NAME}"
VIAddVersionKey "ProductVersion" "${APP_VERSION}"
VIAddVersionKey "FileVersion" "${APP_VERSION}"
VIAddVersionKey "FileDescription" "${APP_NAME} Setup"
VIAddVersionKey "CompanyName" "${PUBLISHER}"
VIAddVersionKey "LegalCopyright" "MIT License"

!include "MUI2.nsh"
!include "x64.nsh"
!include "WinVer.nsh"
!include "LogicLib.nsh"
!include "FileFunc.nsh"

!define MUI_ICON   "sbbridge.ico"
!define MUI_UNICON "sbbridge.ico"
!define MUI_ABORTWARNING
!define MUI_COMPONENTSPAGE_SMALLDESC

!define MUI_WELCOMEPAGE_TITLE "Steel Battalion Bridge ${APP_VERSION}"
!define MUI_WELCOMEPAGE_TEXT "This sets up your original Xbox Steel Battalion controller as an Xbox 360 (XInput) controller for Steam and PC games.$\r$\n$\r$\nIt installs:$\r$\n  • the Steel Battalion Bridge app$\r$\n  • a WinUSB driver binding for the controller (Microsoft's own driver)$\r$\n  • ViGEmBus, which creates the virtual Xbox controller$\r$\n$\r$\nYou can plug the controller in now or later."
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "Launch Steel Battalion Bridge"
!define MUI_FINISHPAGE_RUN_FUNCTION LaunchApp
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\README.md"
!define MUI_FINISHPAGE_SHOWREADME_TEXT "Show the README"
!define MUI_FINISHPAGE_SHOWREADME_NOTCHECKED

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "${ROOT}\LICENSE"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Var DriverFailed

Function .onInit
  ${IfNot} ${RunningX64}
    MessageBox MB_ICONSTOP "Steel Battalion Bridge needs 64-bit Windows 10 or 11."
    Abort
  ${EndIf}
  ${IfNot} ${AtLeastWin10}
    MessageBox MB_ICONSTOP "Steel Battalion Bridge needs Windows 10 or 11."
    Abort
  ${EndIf}
  SetRegView 64
FunctionEnd

Function un.onInit
  SetRegView 64
FunctionEnd

Function CheckWebView2
  ; WebView2 Runtime ships with Windows 11 and current Windows 10. Offer the download if it's missing.
  ReadRegStr $0 HKLM "SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" "pv"
  StrCmp $0 "" 0 done
  ReadRegStr $0 HKCU "Software\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" "pv"
  StrCmp $0 "" 0 done
  MessageBox MB_YESNO|MB_ICONINFORMATION "Steel Battalion Bridge's window uses the Microsoft Edge WebView2 Runtime, which isn't installed on this PC.$\r$\n$\r$\nOpen the Microsoft download page now?" IDNO done
  ExecShell "open" "https://developer.microsoft.com/microsoft-edge/webview2/"
  done:
FunctionEnd

Function LaunchApp
  ; Start the app as the normal (non-elevated) desktop user.
  Exec '"$WINDIR\explorer.exe" "$INSTDIR\${APP_EXE}"'
FunctionEnd

; ---------------------------------------------------------------- sections

Section "Steel Battalion Bridge app (required)" SecApp
  SectionIn RO
  nsExec::Exec 'taskkill /IM ${APP_EXE} /F'
  Sleep 500

  SetOutPath "$INSTDIR"
  ; App + WebView2 libraries (staged by CI from src/SBBridge/bin/Release/net48)
  File /r "${ROOT}\dist\win\*.*"
  File "${ROOT}\driver-helper\sbdriver.exe"
  File "${ROOT}\README.md"
  File "${ROOT}\LICENSE"
  File "${ROOT}\THIRD-PARTY-NOTICES.txt"
  SetOutPath "$INSTDIR\docs"
  File "${ROOT}\docs\LINUX.md"
  SetOutPath "$INSTDIR\redist"
  File "${ROOT}\redist\ViGEmBus_setup.exe"
  SetOutPath "$INSTDIR"

  CreateDirectory "$SMPROGRAMS\${APP_NAME}"
  CreateShortcut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}"
  CreateShortcut "$SMPROGRAMS\${APP_NAME}\README.lnk" "$INSTDIR\README.md"
  CreateShortcut "$SMPROGRAMS\${APP_NAME}\Uninstall ${APP_NAME}.lnk" "$INSTDIR\Uninstall.exe"

  WriteUninstaller "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "${UNINST_KEY}" "DisplayName" "${APP_NAME}"
  WriteRegStr HKLM "${UNINST_KEY}" "DisplayVersion" "${APP_VERSION}"
  WriteRegStr HKLM "${UNINST_KEY}" "Publisher" "${PUBLISHER}"
  WriteRegStr HKLM "${UNINST_KEY}" "DisplayIcon" "$INSTDIR\${APP_EXE}"
  WriteRegStr HKLM "${UNINST_KEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKLM "${UNINST_KEY}" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKLM "${UNINST_KEY}" "QuietUninstallString" '"$INSTDIR\Uninstall.exe" /S'
  WriteRegDWORD HKLM "${UNINST_KEY}" "NoModify" 1
  WriteRegDWORD HKLM "${UNINST_KEY}" "NoRepair" 1
  Call CheckWebView2
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD HKLM "${UNINST_KEY}" "EstimatedSize" "$0"
SectionEnd

Section "Controller driver (WinUSB)" SecDriver
  DetailPrint "Installing the WinUSB driver binding for the Steel Battalion controller..."
  nsExec::ExecToLog '"$INSTDIR\sbdriver.exe" install "$INSTDIR\driver"'
  Pop $0
  ${If} $0 == 0
    DetailPrint "Controller driver installed."
  ${ElseIf} $0 == 2
    DetailPrint "Controller driver installed (restart required)."
    SetRebootFlag true
  ${Else}
    StrCpy $DriverFailed 1
    DetailPrint "Controller driver setup failed (code $0)."
    MessageBox MB_ICONEXCLAMATION|MB_OK "The controller driver couldn't be installed automatically (code $0).$\r$\n$\r$\nYou can retry later with the 'Set up driver...' button in the app, or follow the manual steps in the README."
  ${EndIf}
SectionEnd

Section "ViGEmBus (virtual Xbox controller driver)" SecViGEm
  ClearErrors
  ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Services\ViGEmBus" "ImagePath"
  ${IfNot} ${Errors}
    DetailPrint "ViGEmBus is already installed - skipping."
    Return
  ${EndIf}
  DetailPrint "Installing ViGEmBus..."
  ExecWait '"$INSTDIR\redist\ViGEmBus_setup.exe" /qn /norestart' $0
  ${If} $0 == 0
    DetailPrint "ViGEmBus installed."
  ${ElseIf} $0 == 3010
    DetailPrint "ViGEmBus installed (restart required)."
    SetRebootFlag true
  ${Else}
    DetailPrint "ViGEmBus setup returned $0 - opening its installer so you can finish manually."
    ExecWait '"$INSTDIR\redist\ViGEmBus_setup.exe"' $0
  ${EndIf}
SectionEnd

Section "Desktop shortcut" SecDesktop
  CreateShortcut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}"
SectionEnd

Section /o "Start with Windows (in the tray)" SecStartup
  WriteRegStr HKCU "${RUN_KEY}" "SBBridge" '"$INSTDIR\${APP_EXE}" --minimized'
SectionEnd

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecApp}     "The binding utility and background mapper."
  !insertmacro MUI_DESCRIPTION_TEXT ${SecDriver}  "Binds Microsoft's WinUSB driver to the controller (USB VID 0A7B / PID D000). Works whether or not it's plugged in right now."
  !insertmacro MUI_DESCRIPTION_TEXT ${SecViGEm}   "Creates the virtual Xbox 360 controller that games and Steam Input see. Skipped if already installed."
  !insertmacro MUI_DESCRIPTION_TEXT ${SecDesktop} "Put a shortcut on the desktop."
  !insertmacro MUI_DESCRIPTION_TEXT ${SecStartup} "Start minimized to the system tray when you sign in, so the controller is always ready."
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; ---------------------------------------------------------------- uninstall

Section "Uninstall"
  nsExec::Exec 'taskkill /IM ${APP_EXE} /F'
  Sleep 500

  IfSilent dodriver
  MessageBox MB_YESNO|MB_ICONQUESTION "Also remove the controller's WinUSB driver binding?$\r$\n$\r$\n(Choose Yes unless you use the controller with other WinUSB software.)" IDNO skipdriver
  dodriver:
  nsExec::ExecToLog '"$INSTDIR\sbdriver.exe" uninstall'
  skipdriver:

  Delete "$INSTDIR\${APP_EXE}"
  Delete "$INSTDIR\${APP_EXE}.config"
  Delete "$INSTDIR\Microsoft.Web.WebView2.*.dll"
  Delete "$INSTDIR\WebView2Loader.dll"
  RMDir /r "$INSTDIR\runtimes"
  Delete "$INSTDIR\sbdriver.exe"
  Delete "$INSTDIR\README.md"
  Delete "$INSTDIR\LICENSE"
  Delete "$INSTDIR\THIRD-PARTY-NOTICES.txt"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir /r "$INSTDIR\docs"
  RMDir /r "$INSTDIR\redist"
  RMDir /r "$INSTDIR\driver"
  RMDir "$INSTDIR"

  Delete "$DESKTOP\${APP_NAME}.lnk"
  RMDir /r "$SMPROGRAMS\${APP_NAME}"
  DeleteRegValue HKCU "${RUN_KEY}" "SBBridge"
  DeleteRegKey HKLM "${UNINST_KEY}"

  DetailPrint "ViGEmBus was left installed (other apps use it). Remove it from Installed apps if you don't need it."
  DetailPrint "Your profiles were kept in %APPDATA%\SBBridge."
SectionEnd
