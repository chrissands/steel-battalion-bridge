// Local compile-check stubs for the WebView2 API surface used by MainWindow (NOT shipped; CI uses the real NuGet package).
using System; using System.IO; using System.Threading.Tasks; using System.Drawing; using System.Windows.Forms;
namespace Microsoft.Web.WebView2.Core
{
    public enum CoreWebView2WebResourceContext { All }
    public class CoreWebView2EnvironmentOptions { }
    public class WebView2RuntimeNotFoundException : Exception { }
    public class CoreWebView2WebResourceResponse { }
    public class CoreWebView2Deferral { public void Complete() { } }
    public class CoreWebView2WebResourceRequest { public string Uri { get; set; } public string Method { get; set; } public Stream Content { get; set; } }
    public class CoreWebView2WebResourceRequestedEventArgs : EventArgs { public CoreWebView2WebResourceRequest Request { get; set; } public CoreWebView2WebResourceResponse Response { get; set; } public CoreWebView2Deferral GetDeferral() { return new CoreWebView2Deferral(); } }
    public class CoreWebView2NavigationStartingEventArgs : EventArgs { public string Uri { get; set; } public bool Cancel { get; set; } }
    public class CoreWebView2NewWindowRequestedEventArgs : EventArgs { public string Uri { get; set; } public bool Handled { get; set; } }
    public class CoreWebView2Settings { public bool AreDefaultContextMenusEnabled { get; set; } public bool IsStatusBarEnabled { get; set; } public bool AreDevToolsEnabled { get; set; } public bool IsGeneralAutofillEnabled { get; set; } public bool IsPasswordAutosaveEnabled { get; set; } }
    public class CoreWebView2
    {
        public CoreWebView2Settings Settings { get; set; }
        public void AddWebResourceRequestedFilter(string uri, CoreWebView2WebResourceContext ctx) { }
        public event EventHandler<CoreWebView2WebResourceRequestedEventArgs> WebResourceRequested;
        public event EventHandler<CoreWebView2NavigationStartingEventArgs> NavigationStarting;
        public event EventHandler<CoreWebView2NewWindowRequestedEventArgs> NewWindowRequested;
        public event EventHandler<object> DocumentTitleChanged;
        public void Navigate(string uri) { }
    }
    public class CoreWebView2Environment
    {
        public static Task<CoreWebView2Environment> CreateAsync(string browserExecutableFolder = null, string userDataFolder = null, CoreWebView2EnvironmentOptions options = null) { return Task.FromResult(new CoreWebView2Environment()); }
        public CoreWebView2WebResourceResponse CreateWebResourceResponse(Stream content, int statusCode, string reasonPhrase, string headers) { return new CoreWebView2WebResourceResponse(); }
    }
}
namespace Microsoft.Web.WebView2.WinForms
{
    public class WebView2 : Control
    {
        public Color DefaultBackgroundColor { get; set; }
        public Microsoft.Web.WebView2.Core.CoreWebView2 CoreWebView2 { get; set; }
        public Task EnsureCoreWebView2Async(Microsoft.Web.WebView2.Core.CoreWebView2Environment env = null) { return Task.FromResult(0); }
    }
}
