using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Drawing.Text;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;
using SBBridge.Core;

namespace SBBridge.UI
{
    /// <summary>
    /// Minimal control cheat-sheet drawn over games: a per-pixel-alpha layered window that is always on top,
    /// click-through and never takes focus. Content comes from OverlayModel (same as /overlay.html).
    /// Works over windowed/borderless games (not exclusive fullscreen).
    /// </summary>
    public sealed class OverlayWindow : Form
    {
        const int WS_EX_LAYERED = 0x80000, WS_EX_TRANSPARENT = 0x20, WS_EX_TOOLWINDOW = 0x80, WS_EX_NOACTIVATE = 0x8000000, WS_EX_TOPMOST = 0x8;
        const int ULW_ALPHA = 2; const byte AC_SRC_OVER = 0, AC_SRC_ALPHA = 1;

        [StructLayout(LayoutKind.Sequential)] struct PT { public int X, Y; }
        [StructLayout(LayoutKind.Sequential)] struct SZ { public int Cx, Cy; }
        [StructLayout(LayoutKind.Sequential, Pack = 1)] struct BLEND { public byte Op, Flags, Alpha, Format; }
        [DllImport("user32.dll", SetLastError = true)] static extern bool UpdateLayeredWindow(IntPtr hwnd, IntPtr hdcDst, ref PT pptDst, ref SZ psize, IntPtr hdcSrc, ref PT pptSrc, int crKey, ref BLEND pblend, int dwFlags);
        [DllImport("user32.dll")] static extern IntPtr GetDC(IntPtr hWnd);
        [DllImport("user32.dll")] static extern int ReleaseDC(IntPtr hWnd, IntPtr hDC);
        [DllImport("gdi32.dll")] static extern IntPtr CreateCompatibleDC(IntPtr hDC);
        [DllImport("gdi32.dll")] static extern bool DeleteDC(IntPtr hdc);
        [DllImport("gdi32.dll")] static extern IntPtr SelectObject(IntPtr hDC, IntPtr hObject);
        [DllImport("gdi32.dll")] static extern bool DeleteObject(IntPtr hObject);

        readonly Engine engine;
        readonly AppSettings settings;
        readonly ControllerState state = new ControllerState();
        readonly Timer timer = new Timer { Interval = 66 };
        string lastKey;

        public OverlayWindow(Engine engine, AppSettings settings)
        {
            this.engine = engine; this.settings = settings;
            FormBorderStyle = FormBorderStyle.None;
            ShowInTaskbar = false;
            TopMost = true;
            StartPosition = FormStartPosition.Manual;
            Text = "Steel Battalion Bridge overlay";
            timer.Tick += (s, e) => Redraw(false);
        }

        protected override CreateParams CreateParams
        {
            get { var cp = base.CreateParams; cp.ExStyle |= WS_EX_LAYERED | WS_EX_TRANSPARENT | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE | WS_EX_TOPMOST; return cp; }
        }
        protected override bool ShowWithoutActivation { get { return true; } }

        public void ShowOverlay() { if (!Visible) { lastKey = null; Show(); } Redraw(true); timer.Start(); }
        public void HideOverlay() { timer.Stop(); if (Visible) Hide(); }

        // ------------------------------------------------------------------ drawing
        static readonly Color Panel = Color.FromArgb(222, 24, 26, 30);
        static readonly Color Border = Color.FromArgb(90, 255, 255, 255);
        static readonly Color Muted = Color.FromArgb(255, 170, 178, 186);
        static readonly Color Bright = Color.FromArgb(255, 240, 243, 245);
        static readonly Color Accent = Color.FromArgb(255, 71, 158, 245);   // Fluent brand blue (dark theme)
        static readonly Color GroupColor = Color.FromArgb(255, 115, 185, 255);

        void Redraw(bool force)
        {
            engine.GetState(state);
            var groups = OverlayModel.Build(engine.Profile, state, settings);
            bool shift = OverlayModel.ShiftHeld(engine.Profile, state);
            var key = new StringBuilder(engine.Profile.Name).Append(shift).Append(settings.OverlayCorner).Append(settings.OverlayScale).Append(settings.OverlayOpacity);
            foreach (var g in groups) foreach (var r in g.Rows) key.Append(r.ControlId).Append(r.Action).Append(r.Active ? '1' : '0');
            string k = key.ToString();
            if (!force && k == lastKey) return;
            lastKey = k;
            Render(groups, shift);
        }

        void Render(List<OverlayGroup> groups, bool shift)
        {
            var screen = Screen.PrimaryScreen.WorkingArea;
            float dpi = DeviceDpi > 0 ? DeviceDpi / 96f : 1f;
            using (var bmp = Draw(groups, shift, engine.Profile.Name, settings, dpi, screen.Height - (int)(32 * dpi)))
                Place(bmp, screen, dpi);
        }

        /// <summary>Draws the overlay to a transparent bitmap (separate from the window so it can be previewed/tested).</summary>
        public static Bitmap Draw(List<OverlayGroup> groups, bool shift, string profileName, AppSettings settings, float dpi, int maxH)
        {
            float s = dpi * (float)Math.Max(0.75, Math.Min(1.5, settings.OverlayScale));
            int pad = (int)(12 * s), rowH = (int)(19 * s), groupH = (int)(24 * s), headH = (int)(28 * s), colW = (int)(330 * s), colGap = (int)(14 * s);
            using (var title = new Font("Segoe UI Semibold", 10.5f * s, GraphicsUnit.Point))
            using (var groupFont = new Font("Segoe UI Semibold", 8f * s, GraphicsUnit.Point))
            using (var nameFont = new Font("Segoe UI", 8.5f * s, GraphicsUnit.Point))
            using (var actFont = new Font("Segoe UI", 8.5f * s, GraphicsUnit.Point))
            using (var actBold = new Font("Segoe UI Semibold", 8.5f * s, GraphicsUnit.Point))
            {
                // Flow groups into balanced columns: as few as fit the screen, then even out their heights.
                int total = headH; foreach (var g in groups) total += groupH + g.Rows.Count * rowH;
                int avail = Math.Max(rowH * 6, maxH - 2 * pad);
                int nCols = Math.Max(1, (int)Math.Ceiling(total / (double)avail));
                if (nCols == 1 && total > avail * 0.6) nCols = 2;           // keep it compact on screen
                int target = (int)Math.Ceiling(total / (double)nCols);
                var columns = new List<List<OverlayGroup>> { new List<OverlayGroup>() };
                int colHeight = headH, tallest = 0;
                foreach (var g in groups)
                {
                    int gh = groupH + g.Rows.Count * rowH;
                    bool over = colHeight + gh > avail || (colHeight + gh / 2 > target && columns.Count < nCols);
                    if (over && columns[columns.Count - 1].Count > 0)
                    { tallest = Math.Max(tallest, colHeight); columns.Add(new List<OverlayGroup>()); colHeight = 0; }
                    columns[columns.Count - 1].Add(g); colHeight += gh;
                }
                tallest = Math.Max(tallest, colHeight);
                if (groups.Count == 0) tallest = headH + rowH;
                int w = pad * 2 + columns.Count * colW + (columns.Count - 1) * colGap;
                int h = pad * 2 + tallest;

                var bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
                using (var gfx = Graphics.FromImage(bmp))
                {
                    gfx.SmoothingMode = SmoothingMode.AntiAlias;
                    gfx.TextRenderingHint = TextRenderingHint.AntiAliasGridFit;
                    gfx.Clear(Color.Transparent);
                    using (var path = Rounded(new RectangleF(0.5f, 0.5f, w - 1, h - 1), 8 * s))
                    using (var bg = new SolidBrush(Panel)) using (var pen = new Pen(Border, 1))
                    { gfx.FillPath(bg, path); gfx.DrawPath(pen, path); }

                    var sfRight = new StringFormat { Alignment = StringAlignment.Far, Trimming = StringTrimming.EllipsisCharacter, FormatFlags = StringFormatFlags.NoWrap };
                    var sfLeft = new StringFormat { Trimming = StringTrimming.EllipsisCharacter, FormatFlags = StringFormatFlags.NoWrap };
                    using (var bright = new SolidBrush(Bright)) using (var muted = new SolidBrush(Muted))
                    using (var accent = new SolidBrush(Color.FromArgb(70, Accent))) using (var groupBrush = new SolidBrush(GroupColor))
                    using (var shiftBrush = new SolidBrush(Color.FromArgb(255, 242, 179, 61)))
                    {
                        gfx.DrawString(profileName, title, bright, new RectangleF(pad, pad, colW - 60 * s, headH), sfLeft);
                        if (shift) gfx.DrawString("SHIFT", groupFont, shiftBrush, new RectangleF(pad, pad + 2 * s, colW, headH), sfRight);
                        if (groups.Count == 0) gfx.DrawString("No controls are bound in this profile.", nameFont, muted, new RectangleF(pad, pad + headH, colW, rowH), sfLeft);

                        for (int ci = 0; ci < columns.Count; ci++)
                        {
                            float x = pad + ci * (colW + colGap), y = pad + (ci == 0 ? headH : 0);
                            foreach (var g in columns[ci])
                            {
                                gfx.DrawString(g.Title.ToUpperInvariant(), groupFont, groupBrush, new RectangleF(x, y + 6 * s, colW, groupH), sfLeft);
                                y += groupH;
                                foreach (var r in g.Rows)
                                {
                                                    if (r.Active) using (var p = Rounded(new RectangleF(x - 4 * s, y + 1, colW + 8 * s, rowH - 2), 4 * s)) gfx.FillPath(accent, p);
                                    float nameW = colW * 0.40f, actW = colW - nameW - 6 * s;
                                    gfx.DrawString(r.Control, nameFont, r.Active ? bright : muted, new RectangleF(x, y + 2 * s, nameW, rowH), sfLeft);
                                    var f = r.Active ? actBold : actFont;
                                    // Right-align when it fits; otherwise left-align and cut the end with an ellipsis.
                                    bool fits = gfx.MeasureString(r.Action, f).Width <= actW;
                                    gfx.DrawString(r.Action, f, bright, new RectangleF(x + colW - actW, y + 2 * s, actW, rowH), fits ? sfRight : sfLeft);
                                    y += rowH;
                                }
                            }
                        }
                    }
                }
                return bmp;
            }
        }


        void Place(Bitmap bmp, Rectangle screen, float dpi)
        {
            int m = (int)(16 * dpi);
            string c = settings.OverlayCorner ?? "TopRight";
            int x = c.EndsWith("Left") ? screen.Left + m : screen.Right - bmp.Width - m;
            int y = c.StartsWith("Top") ? screen.Top + m : screen.Bottom - bmp.Height - m;

            IntPtr screenDc = GetDC(IntPtr.Zero), memDc = CreateCompatibleDC(screenDc), hBmp = IntPtr.Zero, old = IntPtr.Zero;
            try
            {
                hBmp = bmp.GetHbitmap(Color.FromArgb(0));
                old = SelectObject(memDc, hBmp);
                var size = new SZ { Cx = bmp.Width, Cy = bmp.Height };
                var src = new PT(); var dst = new PT { X = x, Y = y };
                var blend = new BLEND { Op = AC_SRC_OVER, Flags = 0, Alpha = (byte)(255 * Math.Max(0.3, Math.Min(1, settings.OverlayOpacity))), Format = AC_SRC_ALPHA };
                UpdateLayeredWindow(Handle, screenDc, ref dst, ref size, memDc, ref src, 0, ref blend, ULW_ALPHA);
            }
            finally
            {
                if (old != IntPtr.Zero) SelectObject(memDc, old);
                if (hBmp != IntPtr.Zero) DeleteObject(hBmp);
                DeleteDC(memDc); ReleaseDC(IntPtr.Zero, screenDc);
            }
        }

        static GraphicsPath Rounded(RectangleF r, float radius)
        {
            float d = radius * 2; var p = new GraphicsPath();
            p.AddArc(r.X, r.Y, d, d, 180, 90); p.AddArc(r.Right - d, r.Y, d, d, 270, 90);
            p.AddArc(r.Right - d, r.Bottom - d, d, d, 0, 90); p.AddArc(r.X, r.Bottom - d, d, d, 90, 90);
            p.CloseFigure(); return p;
        }

        protected override void Dispose(bool disposing) { if (disposing) timer.Dispose(); base.Dispose(disposing); }
    }
}
