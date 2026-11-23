using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;


namespace SBBridge.Core
{
    /// <summary>Profiles as XML files in the settings folder (%APPDATA% or ~/.config)/SBBridge/Profiles.</summary>
    public sealed class ProfileStore
    {
        readonly string folder;
        public ProfileStore(string folder) { this.folder = folder; Directory.CreateDirectory(folder); }

        public string PathFor(string name)
        {
            foreach (var ch in Path.GetInvalidFileNameChars()) name = name.Replace(ch, '_');
            return Path.Combine(folder, name.Trim() + ".xml");
        }

        public void EnsureDefaults()
        {
            if (Directory.GetFiles(folder, "*.xml").Length > 0) return;
            foreach (var p in DefaultProfiles.All()) p.Save(PathFor(p.Name));
        }

        public List<string> Names()
        {
            return Directory.GetFiles(folder, "*.xml").Select(Path.GetFileNameWithoutExtension).OrderBy(n => n, StringComparer.OrdinalIgnoreCase).ToList();
        }

        public bool Exists(string name) { return File.Exists(PathFor(name)); }

        public Profile Load(string name)
        {
            var p = Profile.Load(PathFor(name));
            p.Name = name;
            return p;
        }

        public void Save(Profile p) { p.Save(PathFor(p.Name)); }
        public void Delete(string name) { File.Delete(PathFor(name)); }
        public void Rename(string from, string to) { File.Move(PathFor(from), PathFor(to)); }

        public static string ValidName(string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return null;
            name = name.Trim();
            if (name.Length > 80 || name.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0 || name.StartsWith(".")) return null;
            return name;
        }
    }
}
