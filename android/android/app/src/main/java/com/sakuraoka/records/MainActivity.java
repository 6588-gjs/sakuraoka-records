package com.sakuraoka.records;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.graphics.drawable.ColorDrawable;
import android.media.AudioManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

import java.util.Locale;

/**
 * 旧樱丘高中记录室残存档案 —— 离线 WebView 容器。
 *
 * <p>设计目标：
 * <ul>
 *   <li>100% 离线：游戏资源全部打包在 APK 的 {@code assets/www/} 内，
 *       通过 {@code file:///android_asset/www/index.html} 加载，不申请 INTERNET 权限；</li>
 *   <li>模拟器/真机全屏沉浸式、竖屏锁定、屏幕常亮、深色背景（避免启动白屏闪烁）；</li>
 *   <li>开启 localStorage/WebSQL，保证 H5 端存档（sakuraoka.save.v1）可用；</li>
 *   <li>不加载任何外部网页：只允许 file://、about:blank 与 data:/blob:，其余全部拦截；</li>
 *   <li>返回键：网页有历史时先 goBack()，否则退出应用。</li>
 * </ul>
 *
 * <p>本类刻意不依赖 AndroidX，也不引入任何第三方 SDK；
 * 所有 API 调用均做版本判断，minSdk 23（Android 6.0）以上可用。
 */
public class MainActivity extends Activity {

    private static final String TAG = "SakuraokaRecords";

    /** 打包进 APK assets 的 H5 入口（见 app/build.gradle 的 copyWebAssets 任务）。 */
    private static final String GAME_URL = "file:///android_asset/www/index.html";

    /** 与主题/网页一致的深色背景，避免 WebView 首帧白屏。 */
    private static final int COLOR_BACKGROUND = 0xFF0B0B0B;

    private WebView webView;

    // ========================================================================
    // 生命周期
    // ========================================================================

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        window.setBackgroundDrawable(new ColorDrawable(COLOR_BACKGROUND));
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.setStatusBarColor(COLOR_BACKGROUND);
            window.setNavigationBarColor(COLOR_BACKGROUND);
        }

        // 让音量键控制媒体音量（H5 使用 WebAudio 合成音效）
        setVolumeControlStream(AudioManager.STREAM_MUSIC);

        // 用代码创建根布局，避免额外 layout 资源依赖
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(COLOR_BACKGROUND);
        root.setFitsSystemWindows(false);

        webView = new WebView(this);
        webView.setBackgroundColor(COLOR_BACKGROUND);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);

        configureWebView();
        hideSystemBars();

        // H5 端在每次操作后自动写入 localStorage，重载后可通过"继续游戏"恢复进度，
        // 因此这里始终从入口加载即可（也兼容系统回收 Activity 后重建）。
        webView.loadUrl(GAME_URL);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.resumeTimers();
            webView.onResume();
        }
        hideSystemBars();
    }

    @Override
    protected void onPause() {
        // 只有一个 WebView，后台时暂停计时器省电（不影响存档，存档在操作时已写入）
        if (webView != null) {
            webView.onPause();
            webView.pauseTimers();
        }
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            ViewGroup parent = (webView.getParent() instanceof ViewGroup)
                    ? (ViewGroup) webView.getParent() : null;
            if (parent != null) {
                parent.removeView(webView);
            }
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            // 用户从通知栏/多任务返回后重新隐藏系统栏
            hideSystemBars();
        }
    }

    /**
     * 返回键：优先让网页回退（file:// 加载的页面可能压入 history），
     * 没有可回退的历史时正常退出应用。
     */
    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    // ========================================================================
    // WebView 配置
    // ========================================================================

    @SuppressLint({"SetJavaScriptEnabled"})
    @SuppressWarnings("deprecation")
    private void configureWebView() {
        WebSettings settings = webView.getSettings();

        // --- 离线 H5 必需：JS + 本地存储 + file:// 资源访问 ---
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);      // localStorage：存档 / 结局收集
        settings.setDatabaseEnabled(true);        // WebSQL：旧内核兜底（已废弃但保留无害）
        settings.setAllowFileAccess(true);        // API 30+ 默认 false，必须显式打开
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);

        // --- 禁用一切网络/内容提供器访问（应用本身也没有 INTERNET 权限）---
        settings.setAllowContentAccess(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setLoadsImagesAutomatically(true);

        // --- 音频：允许脚本播放（H5 内部另有"首次交互后才发声"的约束）---
        settings.setMediaPlaybackRequiresUserGesture(false);

        // --- 缩放交给页面 viewport 控制，禁用 WebView 自带双击缩放/缩放按钮 ---
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);                // 忽略系统字体缩放，避免布局错乱
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setDefaultTextEncodingName("utf-8");

        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // 纯离线应用，关闭 Safe Browsing，避免任何联网探测行为
            settings.setSafeBrowsingEnabled(false);
        }

        webView.setLongClickable(false);
        webView.setHapticFeedbackEnabled(false);
        webView.setWebViewClient(new LocalOnlyWebViewClient());
        webView.setWebChromeClient(new LoggingWebChromeClient());

        // 仅 debug 包开启 WebView 远程调试（chrome://inspect），release 包关闭
        boolean debuggable = (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
        WebView.setWebContentsDebuggingEnabled(debuggable);
    }

    /** 只允许本地资源在 WebView 内导航；外部链接一律拦截（本作无任何外链）。 */
    private final class LocalOnlyWebViewClient extends WebViewClient {

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return handleNavigation(request.getUrl());
        }

        @Override
        @SuppressWarnings("deprecation")
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            // API 23 走这个旧回调
            return handleNavigation(Uri.parse(url));
        }

        /**
         * 返回 true 表示"由应用接管/拦截"，false 表示交给 WebView 自己加载。
         * file:// 与内联资源允许；http(s) 用系统浏览器打开（理论上不会触发）；
         * 其它协议直接拦截，防止跳出游戏。
         */
        private boolean handleNavigation(Uri uri) {
            if (uri == null) {
                return true;
            }
            String scheme = uri.getScheme();
            if (scheme == null) {
                return true;
            }
            switch (scheme.toLowerCase(Locale.ROOT)) {
                case "file":
                case "about":
                case "data":
                case "blob":
                    return false;
                case "http":
                case "https":
                    openInSystemBrowser(uri);
                    return true;
                default:
                    Log.w(TAG, "Blocked navigation, unsupported scheme: " + scheme + " uri=" + uri);
                    return true;
            }
        }

        private void openInSystemBrowser(Uri uri) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            } catch (ActivityNotFoundException | SecurityException e) {
                Log.w(TAG, "No app can open external uri: " + uri, e);
                Toast.makeText(MainActivity.this,
                        getString(R.string.toast_no_browser), Toast.LENGTH_SHORT).show();
            }
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            Log.i(TAG, "WebView page finished: " + url);
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request,
                                    WebResourceError error) {
            super.onReceivedError(view, request, error);
            if (request != null && request.isForMainFrame()) {
                Log.e(TAG, "Main frame load error: " + error.getErrorCode()
                        + " " + error.getDescription() + " url=" + request.getUrl());
            }
        }
    }

    /** 把 H5 console 输出转到 Logcat，便于真机排查（release 包也不影响功能）。 */
    private static final class LoggingWebChromeClient extends WebChromeClient {
        @Override
        public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
            Log.d(TAG, "console[" + consoleMessage.messageLevel() + "] "
                    + consoleMessage.message()
                    + " (" + consoleMessage.sourceId() + ":" + consoleMessage.lineNumber() + ")");
            return true; // 已消费，避免在 Logcat 里重复打印
        }
    }

    // ========================================================================
    // 沉浸式全屏
    // ========================================================================

    /** Android 11+ 用 WindowInsetsController；Android 6~10 用 SYSTEM_UI_FLAG 方案。 */
    private void hideSystemBars() {
        Window window = getWindow();
        View decorView = window.getDecorView();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(false);
            WindowInsetsController controller = window.getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars()
                        | WindowInsets.Type.navigationBars());
                controller.setSystemBarsBehavior(
                        WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            // minSdk 23，IMMERSIVE_STICKY 一定可用
            decorView.setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            // 刘海屏/挖孔屏：允许内容延伸到短边区域（H5 用 env(safe-area-inset-*) 自行避让）
            WindowManager.LayoutParams params = window.getAttributes();
            params.layoutInDisplayCutoutMode =
                    WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            window.setAttributes(params);
        }
    }
}
