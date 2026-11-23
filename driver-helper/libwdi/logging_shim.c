/* Logging + helpers that libwdi's pki.c expects (replaces libwdi logging.c). LGPL-compatible. */
#include <windows.h>
#include <stdio.h>
#include <stdarg.h>
#include <stdint.h>
#include "libwdi.h"
#include "logging.h"
void wdi_log(enum wdi_log_level level, const char *function, const char *format, ...)
{
    va_list ap; (void)function;
    if (level < WDI_LOG_LEVEL_INFO) return;
    fprintf(stderr, "[pki] ");
    va_start(ap, format); vfprintf(stderr, format, ap); va_end(ap);
    fputc('\n', stderr);
}
const char *windows_error_str(uint32_t retval)
{
    static char buf[256]; DWORD err = retval ? retval : GetLastError();
    FormatMessageA(FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_IGNORE_INSERTS, NULL, err, 0, buf, sizeof(buf), NULL);
    return buf;
}

/* Windows version hooks used by pki.c (SB Bridge requires Windows 10/11, so SHA-256 always). */
int nWindowsVersion = 0xA0; /* WINDOWS_10 */
void GetWindowsVersion(void) { nWindowsVersion = 0xA0; }
char *wdi_windows_error_str(uint32_t retval) { return (char*)windows_error_str(retval); }
