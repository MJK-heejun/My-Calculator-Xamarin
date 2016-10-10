using System;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Webkit;

namespace MyCalculator
{
	[Activity (Label = "My Calculator", MainLauncher = true)]
	[IntentFilter(new[] { Intent.ActionView },
		Categories = new[] {
			Intent.CategoryDefault,
			Intent.CategoryBrowsable
		},
		DataScheme = "http",
		DataHost = "example.com"
	)]
	public class MainActivity : Activity
	{
		protected override void OnCreate (Bundle savedInstanceState)
		{
			base.OnCreate (savedInstanceState);

			SetContentView (Resource.Layout.main);

            var webView = FindViewById<WebView>(Resource.Id.webview);
            webView.SetWebViewClient(new WebViewClient()); // stops request going to Web Browser

            WebSettings settings = webView.Settings;
            settings.JavaScriptEnabled = true;
            settings.AllowFileAccessFromFileURLs = true;            
            settings.AllowUniversalAccessFromFileURLs = true;
            settings.DomStorageEnabled = true;

            webView.LoadUrl("file:///android_asset/MyCalc/index.html");
        }
	}
}
