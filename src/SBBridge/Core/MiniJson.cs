using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Reflection;
using System.Text;

namespace SBBridge.Core
{
    /// <summary>
    /// Tiny JSON reader/writer so the shared UI API runs on .NET Framework 4.8 (Windows) and .NET 8 (Linux)
    /// without extra packages. Objects parse to Dictionary&lt;string, object&gt;, arrays to List&lt;object&gt;,
    /// numbers to double. POCOs serialize as camelCase public properties; enums as names.
    /// </summary>
    public static class MiniJson
    {
        // ------------------------------------------------------------ writing
        public static string Serialize(object o) { var sb = new StringBuilder(); Write(sb, o); return sb.ToString(); }

        static void Write(StringBuilder sb, object o)
        {
            if (o == null) { sb.Append("null"); return; }
            if (o is string) { WriteString(sb, (string)o); return; }
            if (o is bool) { sb.Append((bool)o ? "true" : "false"); return; }
            if (o is Enum) { WriteString(sb, o.ToString()); return; }
            if (o is double || o is float || o is decimal)
            {
                double d = Convert.ToDouble(o, CultureInfo.InvariantCulture);
                sb.Append(double.IsNaN(d) || double.IsInfinity(d) ? "0" : d.ToString("R", CultureInfo.InvariantCulture)); return;
            }
            if (o is int || o is long || o is short || o is byte || o is uint || o is ushort || o is sbyte || o is ulong)
            { sb.Append(Convert.ToString(o, CultureInfo.InvariantCulture)); return; }
            var dict = o as IDictionary;
            if (dict != null)
            {
                sb.Append('{'); bool first = true;
                foreach (DictionaryEntry e in dict) { if (!first) sb.Append(','); first = false; WriteString(sb, Convert.ToString(e.Key)); sb.Append(':'); Write(sb, e.Value); }
                sb.Append('}'); return;
            }
            var list = o as IEnumerable;
            if (list != null)
            {
                sb.Append('['); bool first = true;
                foreach (var x in list) { if (!first) sb.Append(','); first = false; Write(sb, x); }
                sb.Append(']'); return;
            }
            // POCO
            sb.Append('{'); bool f = true;
            foreach (var p in o.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {
                if (!p.CanRead || p.GetIndexParameters().Length > 0) continue;
                var br = p.GetCustomAttribute<BrowsableAttribute>();
                if (br != null && !br.Browsable) continue;
                if (!f) sb.Append(','); f = false;
                WriteString(sb, Camel(p.Name)); sb.Append(':'); Write(sb, p.GetValue(o, null));
            }
            sb.Append('}');
        }

        public static string Camel(string s) { return string.IsNullOrEmpty(s) ? s : char.ToLowerInvariant(s[0]) + s.Substring(1); }

        static void WriteString(StringBuilder sb, string s)
        {
            sb.Append('"');
            foreach (char c in s)
            {
                switch (c)
                {
                    case '"': sb.Append("\\\""); break;
                    case '\\': sb.Append("\\\\"); break;
                    case '\n': sb.Append("\\n"); break;
                    case '\r': sb.Append("\\r"); break;
                    case '\t': sb.Append("\\t"); break;
                    case '<': sb.Append("\\u003c"); break;   // safe to embed in HTML
                    default:
                        if (c < 0x20) sb.Append("\\u").Append(((int)c).ToString("x4")); else sb.Append(c);
                        break;
                }
            }
            sb.Append('"');
        }

        // ------------------------------------------------------------ reading
        public static object Parse(string json)
        {
            if (string.IsNullOrWhiteSpace(json)) return null;
            int i = 0; var v = ParseValue(json, ref i); Ws(json, ref i);
            if (i != json.Length) throw new FormatException("Unexpected data after JSON value at " + i);
            return v;
        }

        static void Ws(string s, ref int i) { while (i < s.Length && char.IsWhiteSpace(s[i])) i++; }

        static object ParseValue(string s, ref int i)
        {
            Ws(s, ref i);
            if (i >= s.Length) throw new FormatException("Unexpected end of JSON");
            char c = s[i];
            if (c == '{')
            {
                var d = new Dictionary<string, object>(StringComparer.Ordinal); i++; Ws(s, ref i);
                if (i < s.Length && s[i] == '}') { i++; return d; }
                while (true)
                {
                    Ws(s, ref i); string k = ParseString(s, ref i); Ws(s, ref i);
                    if (i >= s.Length || s[i] != ':') throw new FormatException("Expected ':' at " + i); i++;
                    d[k] = ParseValue(s, ref i); Ws(s, ref i);
                    if (i < s.Length && s[i] == ',') { i++; continue; }
                    if (i < s.Length && s[i] == '}') { i++; return d; }
                    throw new FormatException("Expected ',' or '}' at " + i);
                }
            }
            if (c == '[')
            {
                var l = new List<object>(); i++; Ws(s, ref i);
                if (i < s.Length && s[i] == ']') { i++; return l; }
                while (true)
                {
                    l.Add(ParseValue(s, ref i)); Ws(s, ref i);
                    if (i < s.Length && s[i] == ',') { i++; continue; }
                    if (i < s.Length && s[i] == ']') { i++; return l; }
                    throw new FormatException("Expected ',' or ']' at " + i);
                }
            }
            if (c == '"') return ParseString(s, ref i);
            if (s.Length - i >= 4 && string.CompareOrdinal(s, i, "true", 0, 4) == 0) { i += 4; return true; }
            if (s.Length - i >= 5 && string.CompareOrdinal(s, i, "false", 0, 5) == 0) { i += 5; return false; }
            if (s.Length - i >= 4 && string.CompareOrdinal(s, i, "null", 0, 4) == 0) { i += 4; return null; }
            int start = i;
            while (i < s.Length && "+-0123456789.eE".IndexOf(s[i]) >= 0) i++;
            if (start == i) throw new FormatException("Unexpected character '" + c + "' at " + i);
            return double.Parse(s.Substring(start, i - start), NumberStyles.Float, CultureInfo.InvariantCulture);
        }

        static string ParseString(string s, ref int i)
        {
            if (i >= s.Length || s[i] != '"') throw new FormatException("Expected string at " + i);
            i++; var sb = new StringBuilder();
            while (i < s.Length)
            {
                char c = s[i++];
                if (c == '"') return sb.ToString();
                if (c != '\\') { sb.Append(c); continue; }
                if (i >= s.Length) break;
                char e = s[i++];
                switch (e)
                {
                    case 'n': sb.Append('\n'); break; case 'r': sb.Append('\r'); break; case 't': sb.Append('\t'); break;
                    case 'b': sb.Append('\b'); break; case 'f': sb.Append('\f'); break;
                    case 'u': sb.Append((char)Convert.ToInt32(s.Substring(i, 4), 16)); i += 4; break;
                    default: sb.Append(e); break;
                }
            }
            throw new FormatException("Unterminated string");
        }

        // ------------------------------------------------------------ helpers for API handlers
        public static Dictionary<string, object> Obj(object o) { return o as Dictionary<string, object> ?? new Dictionary<string, object>(); }
        public static string Str(Dictionary<string, object> d, string k) { object v; return d.TryGetValue(k, out v) && v != null ? Convert.ToString(v, CultureInfo.InvariantCulture) : null; }
        public static bool? Bool(Dictionary<string, object> d, string k) { object v; return d.TryGetValue(k, out v) && v is bool ? (bool?)(bool)v : null; }
        public static double? Num(Dictionary<string, object> d, string k) { object v; return d.TryGetValue(k, out v) && v is double ? (double?)(double)v : null; }

        /// <summary>Copies matching camelCase keys onto a POCO's settable properties.</summary>
        public static void Populate(object target, Dictionary<string, object> d)
        {
            foreach (var p in target.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {
                if (!p.CanWrite) continue;
                var br = p.GetCustomAttribute<BrowsableAttribute>();
                if (br != null && !br.Browsable) continue;
                object v;
                if (!d.TryGetValue(Camel(p.Name), out v)) continue;
                var t = p.PropertyType;
                try
                {
                    if (t == typeof(KeyCode)) p.SetValue(target, KeyNames.Parse(v as string), null);
                    else if (t.IsEnum) { if (v is string && Enum.IsDefined(t, Enum.Parse(t, (string)v, true))) p.SetValue(target, Enum.Parse(t, (string)v, true), null); }
                    else if (t == typeof(string)) p.SetValue(target, v == null ? "" : Convert.ToString(v, CultureInfo.InvariantCulture), null);
                    else if (t == typeof(bool)) { if (v is bool) p.SetValue(target, v, null); }
                    else if (t == typeof(int)) { if (v is double) p.SetValue(target, (int)Math.Round((double)v), null); }
                    else if (t == typeof(double)) { if (v is double && !double.IsNaN((double)v)) p.SetValue(target, (double)v, null); }
                }
                catch (ArgumentException) { /* unknown enum name: keep default */ }
            }
        }
    }
}
