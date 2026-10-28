# 没有 Android SDK 时，如何"只验证资源复制"（给 Lead 的说明）

本机环境：**没有 Android SDK / Android Studio / adb / gradle，JDK 只有 11**。
而本工程需要 **JDK 17 + Android SDK（platform 34 / build-tools 34.0.0）** 才能跑 Gradle，
所以**不要在本机尝试 `./gradlew assembleRelease`**（必然失败，且下载 SDK 很重）。
正式构建在 GitHub Actions 上完成，见 `README-APK.md` 第 3 节。

本文提供 3 种**不编译 APK** 的本地验证手段，按推荐顺序排列。

---

## 0. 先理解：Gradle 侧的复制规则（copyWebAssets）

`app/build.gradle` 里的 `copyWebAssets` 是 Gradle `Sync` 任务：

```groovy
from webRootDir          // 默认 ${rootProject.projectDir}/..，可用 -PwebRoot 覆盖
into app/src/main/assets/www
include 'index.html', 'privacy.html', 'manifest.webmanifest', 'favicon.*', 'css/**', 'js/**', 'assets/**'
exclude 'android/**', '.git/**', '.github/**', 'node_modules/**', 'README*', '*.map', ...
```

> **关键理解**：Gradle 工程的"上一级"在 GitHub 仓库里就是仓库根（= GitHub Pages 站点根，
> 含 index.html / css / js / assets / privacy.html）。所以 CI 里传 `-PwebRoot="$GITHUB_WORKSPACE"` 即可。
> 本地想要模拟，就把 `webRoot` 指向本机上的 H5 站点根目录
> （工作目录下是 `sakuraoka/pages/`（Lead 的 Pages 站点）或 `sakuraoka/app/`（h5-dev 的源码目录））。

**为什么不能在本机跑 `./gradlew copyWebAssets`：**
只要 Gradle 加载 AGP 插件（配置阶段）就会检查 Android SDK，
而且 wrapper 要下载 Gradle 8.7（约 130MB）+ JDK 必须是 17。
没有 SDK 时会在配置阶段报 `SDK location not found`，连 `copyWebAssets` 都跑不了。

---

## 1. 推荐：用 Node 脚本精确模拟（不需要任何 SDK）

`check-webroot.mjs` 与 Gradle 任务使用**完全相同的 include/exclude 规则**，只用 Node（本机 v24 已装）。

### 1.1 只校验，不复制（最快，只读）

```powershell
cd "D:\新建文件夹\新建文件夹"

# 校验 Lead 的 Pages 站点（GitHub Pages 仓库内容）
node sakuraoka\android\check-webroot.mjs --web-root=sakuraoka\pages

# 或者校验 h5-dev 的源码目录（两者最终应一致）
node sakuraoka\android\check-webroot.mjs --web-root=sakuraoka\app
```

期望输出（示例）：

```
========================================================================
check-webroot: 校验 H5 站点根目录（模拟 copyWebAssets）
========================================================================
web root  = D:\新建文件夹\新建文件夹\sakuraoka\pages
文件总数（全部） = 123
将被复制的文件   = 37（1.84 MB）

前 20 个文件：
  + index.html  (5678 B)
  + css/main.css  (12345 B)
  ...
✓ 校验通过：这个目录可以作为 -PwebRoot 的值交给 Gradle。
```

它会检查：`index.html` 是否存在（致命）、`css/`、`js/`、`assets/`、`privacy.html` 是否齐全（警告）。
退出码 0 = 可打包，1 = 有致命问题。

### 1.2 模拟真实复制（会写 `app/src/main/assets/www/`）

```powershell
node sakuraoka\android\check-webroot.mjs --web-root=sakuraoka\pages --copy
# 默认输出到 sakuraoka\android\app\src\main\assets\www（已被 .gitignore 忽略）
```

然后检查结果（等价于 APK 里的 `assets/www/`）：

```powershell
$www = "sakuraoka\android\app\src\main\assets\www"
Get-ChildItem $www -Recurse -File | Measure-Object -Property Length -Sum
Get-ChildItem $www -File | Select-Object Name            # 应看到 index.html / privacy.html
Get-ChildItem $www -Directory | Select-Object Name       # 应看到 css / js / assets
Test-Path "$www\index.html"                              # 必须 True

# 反向检查：不能出现工程/仓库文件
Get-ChildItem $www -Recurse -File | Where-Object {
  $_.FullName -match '\\(android|\.git|\.github|node_modules)\\' -or $_.Name -like 'README*' -or $_.Extension -eq '.map'
} | Select-Object FullName    # 期望：空

# 验证完清掉生成物，避免误提交
Remove-Item $www -Recurse -Force
```

### 1.3 等 H5 产物就绪后，再跑一次

`--web-root` 同时建议指向 `sakuraoka\pages` 与 `sakuraoka\app` 各跑一遍，两边文件列表应基本一致
（pages 可能不含 README/TEST-REPORT 等开发文件，这属于正常）。

---

## 2. 用 stub 站点验证"Gradle 任务接线"（需要能跑 Gradle 的机器 / CI）

工程内置了 `android/_stub-web/`（3 个文件：index.html + css + js），专门用来在没有 H5 产物时
验证 `copyWebAssets` 任务本身是否被正确挂到 `preBuild` 上。

**在有 Android SDK + JDK 17 的机器上：**

```bash
cd android
./gradlew copyWebAssets -PwebRoot="$PWD/_stub-web"
# 期望日志：
#   [copyWebAssets] source = .../android/_stub-web
#   [copyWebAssets] dest   = .../app/src/main/assets/www
#   [copyWebAssets] copied 3 files (0.00 MB) -> OK
ls app/src/main/assets/www    # index.html css js
```

**没有本地 SDK 时，可借用 CI（可选，非必须）：**

在 GitHub Actions 页面手动 `Run workflow`，把 `web_root` 填成 `android/_stub-web`，
构建能跑通即可证明任务接线正常。⚠️ 这样构建出的 APK 里是 stub 页面，**只能用于验证任务，不能当正式包**。

验证完记得正常再跑一次（`web_root` 留空 = 仓库根），确认 APK 自检输出
`assets/www/index.html` 存在。

---

## 3. 真正需要本机 Gradle 时（可选，不推荐在本机做）

如果以后这台机器要本地出包，需要一次性装：

1. **JDK 17**（Temurin / Microsoft OpenJDK 均可，注意 PATH 指向 17 而不是现在的 11）；
2. **Android SDK**：装 `cmdline-tools` 后执行
   ```powershell
   sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
   ```
3. 设环境变量 `ANDROID_HOME`（或 `ANDROID_SDK_ROOT`）；
4. 然后：
   ```powershell
   cd sakuraoka\android
   .\gradlew.bat copyWebAssets -PwebRoot="..\pages"    # 只验证资源复制（不编译、不要 SDK 平台也能跑吗？—— 仍需 SDK 存在）
   .\gradlew.bat assembleRelease -PwebRoot="..\pages"  # 完整构建（需签名 secrets/env）
   ```
5. 签名环境变量见 `README-APK.md` 4.4。

> 说明：`copyWebAssets` 单独跑也需要 Gradle 能加载 AGP（因此仍需 SDK 存在），
> 这就是为什么"只验证资源复制"首选第 1 节的 Node 方案。

---

## 4. 本地还能做的低成本检查

| 检查 | 命令 | 说明 |
|---|---|---|
| Gradle wrapper 完整性 | `Get-Item android\gradle\wrapper\gradle-wrapper.jar` | 应为 43453 字节，且是 zip（`PK` 头），见下表 sha256 |
| gradlew 行尾 | `Format-Hex android\gradlew -Count 16` 或直接看首行 | 必须是 `#!/bin/sh` + LF；CI 里已 `sed -i 's/\r$//'` 兜底 |
| XML 语法 | 用 Python `xml.etree` 解析 `app/src/main/res/**`、`AndroidManifest.xml` | 无 SDK 也能查 |
| YAML 语法 | Python `yaml.safe_load(workflow)`（注意 `on` 会被解析成 True，属 YAML 1.1 陷阱） | 无 SDK 也能查 |
| Java 语法 | 有 `android.jar`（platform-34）时 `javac -cp android.jar` 编译 MainActivity | 可选的本地校验；CI 会真编译 |
| workflow 路径 | 确认仓库里是 `.github/workflows/android.yml` | 放错位置不会触发 |
| 图标尺寸 | `python -c "from PIL import Image; ..."` | 各 dpi 应为 48/72/96/144/192 |

### gradle-wrapper.jar 校验值

```
文件: android/gradle/wrapper/gradle-wrapper.jar
大小: 43453 字节
sha256: CB0DA6751C2B753A16AC168BB354870EBB1E162E9083F116729CEC9C781156B8
```

> 该 jar 来自 Gradle 官方 v8.7.0 tag：
> `https://raw.githubusercontent.com/gradle/gradle/v8.7.0/gradle/wrapper/gradle-wrapper.jar`
> 如果怀疑被改坏，可直接重新下载覆盖。

---

## 5. 结论：Lead 在推仓库前的"无 SDK 自检流程"

```
1) node sakuraoka/android/check-webroot.mjs --web-root=sakuraoka/pages
2) 确认输出 ✓ 校验通过、index.html 在列表中
3) 确认 android/gradle/wrapper/gradle-wrapper.jar 存在且 ~43KB
4) 确认 android/gradlew 首行是 #!/bin/sh（LF）
5) 确认 workflow 将复制到仓库 .github/workflows/android.yml
6) 推仓库 → Actions 跑构建 → 下载 artifact → 按 CHECKLIST.md 真机自测
```

以上步骤全部不需要 Android SDK；APK 是否真的能构建成功，以 GitHub Actions 结果为准。
