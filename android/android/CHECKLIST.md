# APK 上架前检查清单（旧樱丘高中记录室残存档案 · TapTap 手游备用路线）

> 用法：逐项打勾。带 ⛔ 的是**一票否决**项（不满足不能上架/不能覆盖更新）。
> 对应构建说明见 `README-APK.md`；H5 主路线材料见项目 `sakuraoka/docs/`、`sakuraoka/store-assets/`。
> 软著材料不在本交付物内（用户当前决定不办软著，APK 定位为开发测试/备用包）。

---

## A. 构建与签名（CI）

- [ ] ⛔ 仓库已放置 `android/` 工程 + `.github/workflows/android.yml`（workflow 在仓库根 `.github` 下，不是 `android/` 里）
- [ ] ⛔ Actions 构建成功（绿勾），artifact `sakuraoka-records-apk` 可下载
- [ ] ⛔ Job Summary 显示 **`release keystore ✅`**（不是 `debug fallback ⚠️`）
- [ ] ⛔ `release.keystore` 已离线备份 ≥2 份，密码/alias 记录在密码管理器（丢失 = 包名作废）
- [ ] ⛔ `KEYSTORE_BASE64` / `KEYSTORE_PASSWORD` / `KEY_ALIAS` 三个 Secrets 已配置且与 keystore 匹配
- [ ] CI 自检通过：`aapt dump permissions` 无 INTERNET、`apksigner verify` 签名有效、`assets/www/index.html` 在包内
- [ ] 构建日志无 `::warning` 级签名/资源告警

## B. 包体信息（与商店信息一致；若后续补办资质也应一致）

- [ ] ⛔ 包名 `com.sakuraoka.records`，与 TapTap 后台创建游戏时填的包名完全一致（大小写也算）
- [ ] ⛔ versionCode = **11**（或更高的、从未使用过的值），本次发版大于上一版
- [ ] ⛔ versionName = **1.1.0**（与 H5 对齐；若后续补办软著/备案，版本号也应与之一致）
- [ ] ⛔ 签名与首次上架/上次上传的 APK 相同（同一 keystore）
- [ ] 应用名「旧樱丘高中记录室残存档案」与商店标题一致（若后续补办软著，全称建议「旧樱丘高中记录室残存档案游戏软件」）
- [ ] minSdk 23 / targetSdk 34，与 README 一致
- [ ] 图标已替换为正式图标（当前仓库内为占位图；用 `make-icons.py` 或 Android Studio Image Asset）
- [ ] 应用图标为直角/不透明/无白边黑边（商店 icon-512 另有要求，见 store-assets）

## C. 离线与功能自测（**必须真机或模拟器实测**）

- [ ] ⛔ **飞行模式/断网**下可启动并完整游玩（无任何网络请求）
- [ ] 标题界面正常：LOGO、开始游戏、继续游戏、结局鉴赏、设置、关于、版本号 V1.1.0、适龄提示
- [ ] 首次语言选择（简中/日本語/双语，默认双语）可用
- [ ] 至少玩到 **1 个结局**；有条件时验证 4 个结局（police / curse / truth / nothing）
- [ ] 自动存档 + 继续游戏：杀进程重开，进度可恢复
- [ ] 设置项：语言、字号、音效开关、清除存档（二次确认）、隐私说明、版本信息
- [ ] 推理板可纯触屏操作（点选两张卡 → 合成）；无需拖拽
- [ ] 所有按钮触控区域够大（≥44×44 CSS px），无误触
- [ ] 竖屏锁定：旋转手机界面不转、不重建、不丢进度
- [ ] 返回键行为：网页内有历史时回退，无历史时退出应用
- [ ] 沉浸式全屏：状态栏/导航栏隐藏，从边缘滑动可临时呼出
- [ ] 刘海/挖孔屏、底部手势条不遮挡关键按钮（H5 用 safe-area 适配）
- [ ] 键盘弹出不遮挡输入/提交按钮（档案登录等输入场景）
- [ ] 屏幕常亮生效（挂机时不熄屏）
- [ ] 无白屏闪烁（启动到游戏标题界面背景为深色 #0B0B0B）
- [ ] 音效正常（首次交互后可发声）、可关闭、切后台静音/暂停
- [ ] WebView console 无 error（`adb logcat -s SakuraokaRecords` 检查）
- [ ] 内存/发热可接受：连续游玩 ≥10 分钟无卡死、无 ANR
- [ ] 点击游戏内隐私说明可查看（不联网也能看）

## D. 权限与合规（TapTap 审核重点）

- [ ] ⛔ APK **0 权限**（无存储/电话/位置/网络等任何 `uses-permission`）
- [ ] ⛔ 无第三方 SDK（无广告、无统计、无登录、无支付、无推送）
- [ ] ⛔ 不收集任何个人信息；隐私政策写明"无联网、无收集、存档仅本机"
- [ ] ⛔ 隐私政策 URL 可访问：https://6588-gjs.github.io/sakuraoka-records/privacy.html
- [ ] 隐私政策中应用名/包名/版本与 APK 一致
- [ ] 游戏内「设置 → 隐私说明」文案与网页版一致
- [ ] 适龄提示 16+（含死亡、悬疑、灵异文字描写，无血腥画面）在标题界面可见
- [ ] ⚠️ **软著资质**：TapTap APK 正式上架同样需要软著资质；用户当前决定不办，因此 APK 定位为**开发测试/备用包**，正式上架前需补办软著或走其他通道。软著材料不在本交付物内。
- [ ] ⛔ 游戏备案/前置备案已按要求办理（H5 与 APK 路线均需，见 docs/）
- [ ] 审核备注准备：强调"完整三幕互动解谜游戏、离线可玩、4 结局、非网站打包"，对应审核规范 1.4.3 / 1.4.4
- [ ] 防沉迷要求已按 TapTap 后台当前政策处理（TapPlay 等）

## E. 商店物料（store-assets，与 APK 一起提交）

- [ ] 图标：`icon-512.png`（512×512，直角不透明）、`icon-1024.png`
- [ ] LOGO：`logo-1280.png`
- [ ] 封面：`cover-460x215.png`、`cover-600x900.png`
- [ ] 截图：≥3 张 `screenshot-01..05-720x1280.png`，真实游戏画面、彼此不同
- [ ] 宣传图：`promo-1920x1080.png`、`promo-1440x1440.png`
- [ ] 实机视频：`video-15s.mp4`（H.264，>15s，最短边 ≥540）
- [ ] 商店文案：简介、开发者的话、更新日志 V1.1.0、分类/标签/适龄、关键词
- [ ] 物料中不出现版权素材（字体/图片/音乐均自制或用系统字体）

## F. 安装测试矩阵（建议）

| 设备/系统 | 重点验证 |
|---|---|
| Android 6.0（API 23） | 能装、能启动（minSdk 边界） |
| Android 8~10 | 图标/全屏/返回键/存档 |
| Android 12（API 31/32） | SplashScreen 深色、无白屏、权限提示（应无） |
| Android 13/14（API 33/34） | 通知/存储无权限申请、全屏手势、存档 |
| 刘海屏/挖孔屏手机 | safe-area 不遮挡按钮 |
| 低端机（2~3GB 内存） | 加载速度、长时间游玩内存 |
| 平板/横屏设备 | 竖屏锁定后的显示（黑边或自适应） |
| 断网 + 飞行模式 | 全流程可玩（最重要的验收） |

## G. 上传 TapTap 前后

- [ ] APK 已上传到 TapTap 开发者后台对应游戏（包名/签名校验通过）
- [ ] 隐私政策 URL、权限说明、适龄、分类、标签、简介、截图/视频已填
- [ ] 版本更新日志已填（V1.1.0 或对应版本）
- [ ] 提交审核前在后台"安装包信息"里核对：包名、versionCode、versionName、签名指纹
- [ ] 审核通过后记录：APK sha256、versionCode、上线日期（写进版本发布记录）
- [ ] 发版后打 tag（如 `v1.1.0`）并确认 GitHub Release 已附加 APK，作为备份下载渠道
- [ ] 更新 `sakuraoka/android/README-APK.md` 或发版记录里的版本号（下次发版 versionCode 继续 +1）

---

## 快速命令备忘

```powershell
# 下载 artifact 后校验 APK（本地有 SDK 时）
& "$env:ANDROID_HOME\build-tools\34.0.0\apksigner.bat" verify --print-certs app-release.apk
& "$env:ANDROID_HOME\build-tools\34.0.0\aapt.exe" dump permissions app-release.apk
& "$env:ANDROID_HOME\build-tools\34.0.0\aapt.exe" dump badging app-release.apk | Select-String "package:|sdkVersion|targetSdkVersion"

# 安装到已连接手机（需 adb）
adb install -r app-release.apk

# 看 logcat（WebView console / 主框架错误）
adb logcat -s SakuraokaRecords

# 本地校验 H5 站点目录能否被打包
node sakuraoka\android\check-webroot.mjs --web-root=sakuraoka\pages
```
