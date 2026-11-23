using System;
using System.Collections.Generic;
using System.IO;

namespace SBBridge.Core
{
    /// <summary>The shared UI (web/dist) embedded as resources named "web/&lt;file&gt;".</summary>
    public static class WebAssets
    {
        static readonly Dictionary<string, byte[]> cache = new Dictionary<string, byte[]>(StringComparer.OrdinalIgnoreCase);

        public const string Csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'";

        public static byte[] Get(string name)
        {
            if (name.Contains("..") || name.Contains("\\")) return null;
            lock (cache)
            {
                byte[] b;
                if (cache.TryGetValue(name, out b)) return b;
                var asm = typeof(WebAssets).Assembly;
                using (var s = asm.GetManifestResourceStream("web/" + name))
                {
                    if (s == null) return null;
                    using (var ms = new MemoryStream()) { s.CopyTo(ms); b = ms.ToArray(); }
                }
                cache[name] = b;
                return b;
            }
        }
    }
}
