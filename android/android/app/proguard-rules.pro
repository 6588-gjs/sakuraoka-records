# ============================================================================
# ProGuard / R8 规则
# 当前 release 构建 minifyEnabled=false（不混淆、不裁剪），本文件仅为将来
# 需要开启混淆时的预留配置。如果以后打开 minifyEnabled true，请保留下面规则，
# 否则 WebView / JS 接口可能被误裁。
# ============================================================================

# 保留 WebView 相关 framework 类（一般无需显式保留，这里作为保险）
-keepclassmembers class android.webkit.** { *; }

# 保留 Activity 入口
-keep class com.sakuraoka.records.MainActivity { *; }

# 保留通过 JS 反射调用/可能被注入的成员（当前无 @JavascriptInterface，预留）
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# 不打印处理信息，避免 CI 日志噪音
-dontwarn android.**
