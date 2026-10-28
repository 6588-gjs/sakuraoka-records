# 旧樱丘高中记录室残存档案 —— Android APK（WebView 离线包）构建说明

> 本目录是 H5 游戏《旧樱丘高中记录室残存档案》的 **Android WebView 离线包装工程**，
> 配套 GitHub Actions 自动构建「已签名 release APK」。
>
> 定位：**TapTap 手游（APK）上架的备用路线**。主路线是 TapTap H5 小游戏（直接上传 H5 包 / 用 GitHub Pages 通道），
> 本条 APK 路线的价值是：断网也能玩、可作为 H5 审核受限时的兜底、可上 GitHub Release 方便玩家直接安装。
>
> 工程不依赖本机 Android SDK / Android Studio：**打包在 GitHub Actions 上完成**。

---

## 1. 产物信息（必须与商店/软著材料一致）

| 项 | 值 | 说明 |
|---|---|---|
| 应用名 | 旧樱丘高中记录室残存档案 | 与 TapTap 标题、软著核心名称一致 |
| 包名 applicationId | `com.sakuraoka.records` | 首次上架后**永远不能改**（否则算新游戏、无法覆盖更新） |
| versionName | `1.1.0` | 与 H5 版本 V1.1.0 / 软著 V1.1 对齐 |
| versionCode | `11` | **每次发版必须 +1**（TapTap 用它判断升级） |
| minSdk | 23（Android 6.0） | 覆盖绝大多数在用安卓机 |
| targetSdk | 34（Android 14） | AGP 8.4 / compileSdk 34 |
| 权限 | **无（0 个）** | 连 INTERNET 都不申请，纯离线 |
| 第三方 SDK | **无** | 纯 Android framework API + 系统 WebView，无 AndroidX/无广告/无统计 |
| 屏幕方向 | 竖屏锁定 | `android:screenOrientation="portrait"` |
| 包体 | 约 1~2 MB（H5 资源 + 极简壳） | 游戏资源全部在 APK 的 `assets/www/` 内 |

游戏加载方式：`file:///android_asset/www/index.html`，**不经过任何网络**。
存档写在 WebView 的 localStorage（键名以 H5 端 `sakuraoka.save.v1` 为准），只存在本机，清除 App 数据即清档。

---

## 2. 目录结构

```
android/                              ← 本目录（复制到仓库根的 android/）
├── settings.gradle                   ← Gradle 工程入口
├── build.gradle                      ← 根脚本（AGP 8.4.2）
├── gradle.properties
├── gradlew / gradlew.bat             ← Gradle Wrapper（8.7）
├── gradle/wrapper/
│   ├── gradle-wrapper.jar
│   └── gradle-wrapper.properties     ← distributionUrl = gradle-8.7-bin.zip
├── app/
│   ├── build.gradle                  ← app 模块：版本号/签名/copyWebAssets/打包
│   ├── proguard-rules.pro
│   └── src/main/
│       ├── AndroidManifest.xml       ← 包名、版本、竖屏、0 权限
│       ├── java/com/sakuraoka/records/MainActivity.java
│       └── res/                      ← 图标（占位）、主题、字符串、备份规则
├── workflows/android.yml             ← ⚠ 需要复制到仓库 .github/workflows/android.yml
├── _stub-web/                        ← 仅用于验证资源复制任务的极小 stub 站点
├── check-webroot.mjs                 ← 本地校验 H5 站点目录（不需要 SDK）
├── make-icons.py                     ← 用 store-assets/icon-512.png 重新生成图标（需要 Python+Pillow）
├── README-APK.md                     ← 本文件
├── CHECKLIST.md                      ← 上架前检查清单
└── build-local-stub.md               ← 没有 Android SDK 时如何只验证资源复制
```

### 放进 GitHub 仓库的方式（由 Lead 执行）

```
仓库 6588-gjs/sakuraoka-records（main = GitHub Pages 站点根）
├── index.html / css/ / js/ / assets/ / privacy.html   ← H5 站点（copyWebAssets 从这里复制）
├── android/                                            ← 复制本目录全部内容
└── .github/workflows/android.yml                       ← 复制 workflows/android.yml 到这里
```

> `copyWebAssets` 默认把**仓库根**（也就是 `android/` 的上一级）当作 H5 站点根，
> 因此仓库根必须直接是 `index.html` 所在目录。CI 里由 `-PwebRoot="$GITHUB_WORKSPACE"` 显式指定。

---

## 3. 方式一（推荐）：GitHub Actions 自动构建

### 3.1 一次性准备

1. 把 `android/` 整个目录复制到仓库根（`sakuraoka-records/android/`）。
2. 把 `android/workflows/android.yml` 复制为仓库的 `.github/workflows/android.yml`。
3. 配置签名 Secrets（见第 4 节；**不配也能出包，但只能 debug 签名测试，不能上架**）。
4. 提交并 push 到 `main`（只要改动里包含 `android/**` 或 `.github/workflows/android.yml`，就会触发构建）。

### 3.2 触发方式

| 触发 | 条件 | 结果 |
|---|---|---|
| 自动 | push 到 `main`/`master`，且改动包含 `android/**` 或 workflow 文件 | 构建 APK，上传 artifact |
| 自动 | push **tag**（形如 `v1.1.0`，匹配 `v*`） | 构建 + 上传 artifact + **把 APK 附加到该 tag 的 GitHub Release** |
| 手动 | 仓库 Actions 页面 → `Android APK` → `Run workflow` | 可指定 `web_root` / 覆盖 versionCode / versionName |

> 注意：GitHub 的 `paths` 过滤对 **tag push 不生效**（tag 推送不评估 paths），所以打 tag 一定会触发构建。

打 tag 发版示例（Lead 用）：

```bash
git tag v1.1.0
git push origin v1.1.0
```

### 3.3 下载 APK

- Actions → 对应 run → 页面底部 **Artifacts** → `sakuraoka-records-apk`（zip 内为 `app-release.apk`）。
- tag 构建还会自动创建/更新 Release，里面直接带 APK。
- 每次构建的 **APK 大小 / sha256 / 是否使用正式签名** 会写在 run 的 Job Summary 里。

### 3.4 CI 构建步骤简介（workflow 里做了什么）

1. `actions/checkout@v4` 拉代码；
2. `actions/setup-java@v4`（temurin JDK **17**）→ `android-actions/setup-android@v3` 装 SDK platform 34 + build-tools 34.0.0；
3. 校验 H5 站点根（必须有 `index.html`）；
4. 若配置了 `KEYSTORE_BASE64`：base64 解码为 `android/app/release.keystore`（tag 构建**强制**要求）；
5. `cd android && ./gradlew assembleRelease --no-daemon -PwebRoot="$GITHUB_WORKSPACE"`；
6. 检查 APK：`aapt dump permissions`（若出现 INTERNET 权限直接 fail）、`apksigner verify`、确认 `assets/www/index.html` 在包内；
7. 上传 artifact；tag 时附加到 Release。

---

## 4. 签名密钥（最重要的一步）

### 4.1 为什么必须固定签名

- TapTap / 安卓系统用 **包名 + 签名** 识别"同一个应用"。换签名 = 无法覆盖安装/更新，商店也会拒绝。
- 首次正式上传后**签名就绑定了**，必须永久使用同一个 keystore。
- **keystore 文件 + 密码丢失 = 这个包名永久作废，只能换包名重新上架**（等于重来）。
  请把 `release.keystore` 和密码**离线备份两份以上**（U 盘/密码管理器/私有仓库，千万别提交到公开仓库）。

### 4.2 生成 keystore（只需做一次）

要求：JDK（`keytool` 在 PATH，本机已有 JDK 11，CI 用 17，生成的 keystore 通用）。

**Windows PowerShell：**

```powershell
# 建议在一个不进 git 的目录里生成（例如 D:\keystore\）
cd D:\keystore
keytool -genkeypair -v `
  -keystore release.keystore `
  -alias sakuraoka `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -storetype PKCS12 `
  -storepass "请换成一个强密码并保存好" `
  -dname "CN=旧樱丘记录室工作室, OU=Mobile, O=旧樱丘记录室工作室, L=Shanghai, ST=Shanghai, C=CN"
```

**macOS / Linux：**

```bash
keytool -genkeypair -v \
  -keystore release.keystore \
  -alias sakuraoka \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storetype PKCS12 \
  -storepass "请换成一个强密码并保存好" \
  -dname "CN=旧樱丘记录室工作室, OU=Mobile, O=旧樱丘记录室工作室, L=Shanghai, ST=Shanghai, C=CN"
```

参数说明：

- `-alias sakuraoka`：**keyAlias 必须是这个值**（或同步改 secret `KEY_ALIAS`）；
- `-validity 10000`：约 27 年，足够长期更新（TapTap 对签名有效期无特殊要求，但过期无法签名）；
- `-storetype PKCS12`：JDK 9+ 默认格式；PKCS12 下 **key 密码 = store 密码**，所以 secret `KEY_PASSWORD` 可不单独设置（本工程会自动回退用 `KEYSTORE_PASSWORD`）；
- 想用不同的 key 密码，改用 `-storetype JKS` 并加 `-keypass`，同时设置 secret `KEY_PASSWORD`；
- 校验生成结果：`keytool -list -v -keystore release.keystore -alias sakuraoka`。

> 注意：`-storepass` 直接写在命令行会进 shell 历史；更安全的做法是省略 `-storepass` 让 keytool 交互式询问。
> 本机自测命令与证书指纹请勿随仓库公开。

### 4.3 转成 base64 并配置 GitHub Secrets

**Windows PowerShell（推荐，生成无换行、无 BOM 的 base64）：**

```powershell
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("D:\keystore\release.keystore"))
Set-Content -Path "D:\keystore\release.keystore.b64" -Value $b64 -NoNewline -Encoding ascii
# 校验：解码回来长度应一致
([Convert]::FromBase64String((Get-Content "D:\keystore\release.keystore.b64" -Raw))).Length
(Get-Item "D:\keystore\release.keystore").Length
```

**macOS：** `base64 -i release.keystore -o release.keystore.b64`
**Linux：** `base64 -w0 release.keystore > release.keystore.b64`

**用 gh CLI 设置（仓库 `6588-gjs/sakuraoka-records`）：**

```powershell
# 1) keystore（base64 文本）
.\gh.cmd secret set KEYSTORE_BASE64 --repo 6588-gjs/sakuraoka-records --body-file D:\keystore\release.keystore.b64

# 2) store 密码 —— 不写 --body 会交互式输入（推荐，避免进命令历史）
.\gh.cmd secret set KEYSTORE_PASSWORD --repo 6588-gjs/sakuraoka-records

# 3) key 别名 —— 固定 sakuraoka
.\gh.cmd secret set KEY_ALIAS --repo 6588-gjs/sakuraoka-records --body "sakuraoka"

# 4) key 密码 —— PKCS12 与 store 密码相同；不设也能构建（Gradle 自动回退）
.\gh.cmd secret set KEY_PASSWORD --repo 6588-gjs/sakuraoka-records

# 检查
.\gh.cmd secret list --repo 6588-gjs/sakuraoka-records
```

或者在网页操作：`Settings → Secrets and variables → Actions → New repository secret`，依次添加：

| Secret | 内容 |
|---|---|
| `KEYSTORE_BASE64` | `release.keystore` 的 base64 文本（一整行） |
| `KEYSTORE_PASSWORD` | keystore 密码 |
| `KEY_ALIAS` | `sakuraoka` |
| `KEY_PASSWORD` | key 密码（PKCS12 = store 密码，可省） |

> 常见坑：Windows 上用 `certutil -encode` 生成的 base64 带 `-----BEGIN CERTIFICATE-----` 头尾和换行，**不能用**。
> workflow 会先 `tr -d '\r\n '` 再解码，但仍建议按上面的方式生成干净 base64。

### 4.4 本地签名构建（有 Android SDK 时）

```powershell
$env:ANDROID_HOME = "C:\Android\Sdk"          # 或 ANDROID_SDK_ROOT
$env:KEYSTORE_PASSWORD = "你的密码"
$env:KEY_ALIAS = "sakuraoka"
$env:KEY_PASSWORD = "你的密码"

cd sakuraoka\android
.\gradlew.bat assembleRelease -PwebRoot="..\pages"
# 产物：app\build\outputs\apk\release\app-release.apk
```

- 本项目在 **没有 `app/release.keystore`** 时会自动退回 debug 签名（仅本地/CI 冒烟测试用）。
- 一旦检测到 `release.keystore` 但没设 `KEYSTORE_PASSWORD` 环境变量，Gradle 会**直接报错**（防止误产出"看起来能上架其实签名错"的包）。

---

## 5. 版本号规则（发新版必读）

1. **versionCode 必须单调递增**（当前 11）。建议规则：
   - `1.1.0` → 11，`1.1.1` → 12，`1.2.0` → 20，`2.0.0` → 200（简单可读即可，TapTap 只比较大小）。
2. **versionName** 与 H5 页面/软著材料的版本号保持一致（V1.1 → `1.1.0`）。
3. 改版本号两种方式（任选）：
   - 直接改 `app/build.gradle` 里默认值：`versionCode 12` / `versionName '1.1.1'`；
   - 不改代码，CI 手动触发时在 `version_code` / `version_name` 输入框填写（等价于 `-PappVersionCode=12 -PappVersionName=1.1.1`）。
4. 发新版流程：改版本号 → 提交 `android/**` 改动 → push main（自动构建）→ 自测 → 打 tag `v1.1.1` → Release 自动带 APK → TapTap 后台上传新 APK。
5. **绝不允许**把 versionCode 改小或重复使用同一个版本号上传（TapTap 会拒绝，且部分渠道会缓存旧包）。

---

## 6. H5 资源如何进 APK（copyWebAssets）

`app/build.gradle` 里的 `copyWebAssets`（Gradle `Sync` 任务）：

- **来源** `webRoot`：默认 `${rootProject.projectDir}/..`（仓库根 = GitHub Pages 站点根）；可用 `-PwebRoot=<绝对/相对路径>` 覆盖；
- **复制内容**：`index.html`、`privacy.html`、`manifest.webmanifest`、`favicon.*`、`css/**`、`js/**`、`assets/**`；
- **排除**：`android/**`、`.git/**`、`.github/**`、`node_modules/**`、`README*`、`*.map` 等仓库/工程文件；
- **目标**：`app/src/main/assets/www/`（该目录已被 `.gitignore` 忽略，是构建时生成的）；
- 每次构建都是**全量同步**（旧文件自动清掉，不会把过时资源打进 APK）；
- `preBuild` 依赖该任务，所以 `assembleRelease` 会自动先复制；`./gradlew clean` 会一并删除生成的 www。

验证 APK 里确实带了资源：

```bash
unzip -l app-release.apk | grep "assets/www/index.html"
unzip -l app-release.apk | grep "assets/www/" | wc -l
```

本地验证 H5 站点目录是否"可被打包"（**不需要 Android SDK**）：

```powershell
node sakuraoka\android\check-webroot.mjs --web-root=sakuraoka\pages
# 想顺便模拟复制：
node sakuraoka\android\check-webroot.mjs --web-root=sakuraoka\pages --copy
```

另外见 `build-local-stub.md`，里面有"只用 Node 验证资源复制"的完整说明。

---

## 7. 图标（当前为占位，需替换为正式图标）

- 现状：`res/mipmap-*/ic_launcher.png` 为**代码生成的占位图**（深色 #0B0B0B + 金色樱徽记 + 暗红印章点，纯几何、无版权素材）；
- 正式图标在 `sakuraoka/store-assets/icon-512.png`（Lead 同步）与 `icon-1024.png`；
- 替换方法：
  1. **有 Android Studio**：`File → New → Image Asset`，Source 选 `store-assets/icon-512.png`，Name `ic_launcher`，生成 Legacy / Round / Adaptive 全套；
  2. **无 Android Studio（本机情况）**：用本目录的脚本（需要 Python + Pillow）：

     ```powershell
     python sakuraoka\android\make-icons.py --source sakuraoka\store-assets\icon-512.png
     ```

     脚本会生成 `mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/ic_launcher.png`（直角不透明，给 Android 6~7.1 启动器）
     与 `.../ic_launcher_round.png`（圆形），并把 `ic_launcher_foreground.xml` 换成基于 icon-512 的自适应前景 PNG
     （Android 8+）。替换后重新构建即可。
- TapTap 商店图标本身（512×512/1024×1024）是**商店物料**，与 APK 内 launcher 图标分开管理，不要混淆。
- 图标要求提醒：不透明、无透明底、无白边黑边、无圆角（圆角由启动器/商店切）、不用版权素材。

---

## 8. TapTap 上传注意事项（APK 路线）

> 本节为工程侧要点；完整的上架/备案/软著流程见 `sakuraoka/docs/` 与 `softcopyright/` 材料，最终以 TapTap 开发者后台要求为准。

1. **包名与后台一致**：TapTap 后台创建游戏时填的包名必须是 `com.sakuraoka.records`；上传 APK 后该包名绑定，不能改。
2. **签名一致**：同一游戏后续更新必须用同一 keystore 签名；**首次正式上传前确认 Secrets 已配置**（CI 日志 Job Summary 会显示 `release keystore ✅`）。
3. **名称一致**：应用名「旧樱丘高中记录室残存档案」与商店标题、软著名称（「旧樱丘高中记录室残存档案游戏软件」）保持核心名称一致；不一致可能被要求补充说明。
4. **隐私政策 URL**：`https://6588-gjs.github.io/sakuraoka-records/privacy.html`（仓库 Pages 部署后有效）。
   - 本作**不收集任何个人信息、无联网、无第三方 SDK、无广告/内购**；存档仅存本机（WebView localStorage）。
   - APK 的 `privacy.html` 也已打进 `assets/www/privacy.html`，断网时可在游戏内"设置 → 隐私说明"查看。
5. **权限说明**：APK 申请权限数为 **0**（连 INTERNET 都没有）。在 TapTap 后台的隐私/权限说明里如实填写"不申请任何权限"。
   - 若审核要求解释为何无网络权限：本作完全离线，全部资源内置于 APK。
6. **防沉迷**：按 TapTap 后台要求处理（TapTap 提供 TapPlay / 防沉迷相关能力，具体以后台当前要求为准）。
   注意：本工程刻意**未接入任何第三方 SDK**；如 TapTap 强制要求接入其防沉迷 SDK，需要按 SDK 文档另外集成并更新"无第三方 SDK"的表述。
7. **资质**：APK 路线上架同样需要软著 + 游戏备案（与 H5 路线一致，见 `docs/`）；本工程只负责"能装、能玩、签名对"。
8. **审核规范提醒**（TapTap 审核规范 1.4.3「游戏不得为简单网站页面打包」、1.4.4「主要功能不得依赖第三方应用或跳转网页」）：
   - 本作是完整的三幕互动解谜游戏（证据系统、密码谜题、推理板、4 结局、存档/结局收集），**不是静态网站**；
   - WebView 只是运行容器，所有逻辑与资源都在包内，断网可完整通关；
   - 建议在 TapTap 详情页/审核备注里强调"完整单机解谜游戏 + 离线可玩 + 4 结局"，避免被误判为包装网站。
9. **targetSdk**：34。TapTap 目前未强制 Google Play 式的 targetSdk 下限要求，但未来可能提高；升级时只需改 `compileSdk/targetSdk` 并验证（可能伴随 AGP 升级）。
10. **上架材料**：APK 文件、应用名、图标、截图（≥3 张 720×1280 实机截图，见 `store-assets/`）、隐私政策 URL、软著/备案信息。

---

## 9. 常见构建失败排查

| 现象（日志关键词） | 原因 | 处理 |
|---|---|---|
| `SDK location not found` | 本地没设 `ANDROID_HOME`；或 CI 没跑 setup-android | 本地设 `ANDROID_HOME`；CI 检查 "Set up Android SDK" 步骤是否成功 |
| `Unsupported class file major version` / `Android Gradle plugin requires Java 17` | JDK 版本不对（用了 11/21） | 本地用 JDK 17；CI 已是 temurin 17，不要改 |
| `Could not find com.android.tools.build:gradle:8.4.2` | 网络/google 仓库抖动 | 重跑 workflow；确认 `settings.gradle` 里 `google()` 未被删 |
| `Gradle distribution ... timed out` | services.gradle.org 下载超时 | 重跑；或临时换镜像 distributionUrl（见 wrapper.properties 注释） |
| `webRoot 目录不存在` / `webRoot 下找不到 index.html` | `-PwebRoot` 指错；仓库根不是 H5 站点根 | CI 用 `-PwebRoot="$GITHUB_WORKSPACE"`；确认仓库根有 index.html |
| `copyWebAssets 没有复制到任何文件` | webRoot 指到了 android/ 或空目录 | 用 `node android/check-webroot.mjs --web-root=<目录>` 定位 |
| `Keystore was tampered with, or password was incorrect` | base64 解码损坏（含换行/BOM/头尾）或密码错 | 用 4.3 的 PowerShell 方式重新生成 base64；核对密码 |
| `Failed to read key sakuraoka from store` | `KEY_ALIAS` 与生成时 `-alias` 不一致 | 统一为 `sakuraoka` |
| `检测到 release.keystore，但环境变量 KEYSTORE_PASSWORD 为空` | Secrets 配了 keystore 但漏了密码；或本地没 export | 补 `KEYSTORE_PASSWORD` secret / 本地 export |
| `tag 构建必须使用正式签名` | 打了 tag 但没配签名 Secrets | 先配 Secrets 再重打 tag（或重新 Run workflow） |
| `APK 中出现了 INTERNET 权限`（CI 自检 fail） | 有人往 Manifest 或依赖里加了网络能力 | 删掉权限/依赖；本作必须纯离线 |
| `APK 内缺少 assets/www/index.html`（CI 自检 fail） | copyWebAssets 没生效 / `-PwebRoot` 错 | 查上一条，确认仓库根 index.html |
| Release 上传 403 / `Resource not accessible by integration` | Actions 权限只读 | 仓库 `Settings → Actions → General → Workflow permissions` 选 **Read and write permissions** |
| 安装报 `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | 手机上已装过**不同签名**的同包名 APK | 卸载旧包再装；正式上架包必须固定签名，不要让测试包装到正式用户机上 |
| 安装报 `INSTALL_FAILED_OLDER_SDK` | 手机 Android < 6.0 | 本包 minSdk 23，属预期 |
| 打开后白屏 | 资源没打进 APK / 路径大小写 / H5 自身报错 | `unzip -l` 查 assets；`adb logcat -s SakuraokaRecords` 看 console 日志 |
| 存档丢失 | 用户清除数据/卸载/系统清理 WebView 存储 | 属预期；游戏内"设置 → 清除存档"是主动清档 |

调试小抄：

```powershell
# 看签名（本地有 SDK 时）
& "$env:ANDROID_HOME\build-tools\34.0.0\apksigner.bat" verify --print-certs app\build\outputs\apk\release\app-release.apk
# 看权限
& "$env:ANDROID_HOME\build-tools\34.0.0\aapt.exe" dump permissions app\build\outputs\apk\release\app-release.apk
# 看包内资源
tar -tf app-release.apk | Select-String "assets/www"
# 看 WebView console（debug 包 + chrome://inspect）
adb logcat -s SakuraokaRecords
```

---

## 10. 给 Lead 的最小操作清单

1. 复制 `sakuraoka/android/` → 仓库 `android/`；复制 `android/workflows/android.yml` → `.github/workflows/android.yml`；
2. 按 4.2 生成 keystore（若用户还没有），按 4.3 配置 4 个 Secrets；
3. push main 触发首次构建，确认 Actions 绿 + artifact 有 APK + Job Summary 显示 `release keystore ✅`；
4. 下载 APK，按 `CHECKLIST.md` 在真机/模拟器安装自测（断网启动、玩到至少一个结局、返回键、存档）；
5. 若 CI 失败：把失败步骤日志发回给 apk-dev（本工程作者）修复，不要手工改 workflow 之外的签名/包名。
