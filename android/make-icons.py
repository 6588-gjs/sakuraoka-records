#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
make-icons.py —— 用正式图标（store-assets/icon-512.png）重新生成 APK 内图标。

背景：本机没有 Android Studio，无法用 Image Asset 向导；该脚本用 Pillow 生成
Android 需要的全套 launcher 图标（等价于 Android Studio 的 Image Asset 输出）：

  res/mipmap-mdpi/ic_launcher.png      48x48     （Android 6.0~7.1 旧启动器）
  res/mipmap-hdpi/ic_launcher.png      72x72
  res/mipmap-xhdpi/ic_launcher.png     96x96
  res/mipmap-xxhdpi/ic_launcher.png    144x144
  res/mipmap-xxxhdpi/ic_launcher.png   192x192
  res/mipmap-*/ic_launcher_round.png   圆形版本（部分启动器用）
  res/drawable-*/ic_launcher_foreground.png   自适应图标前景（Android 8+，108dp canvas，
                                              图标放在中间 66dp 安全区）
  并删除 res/drawable/ic_launcher_foreground.xml（原占位矢量图，避免与 PNG 冲突）

自适应图标背景仍使用 res/values/colors.xml 里的 ic_launcher_background
（默认 #0B0B0B；如正式图标是浅色底，可把它改成 #FFFFFF）。

依赖：Python 3 + Pillow（本机运行时自带）。
用法：
    python sakuraoka/android/make-icons.py --source sakuraoka/store-assets/icon-512.png
    python sakuraoka/android/make-icons.py --source icon-512.png --res sakuraoka/android/app/src/main/res
    python sakuraoka/android/make-icons.py --source icon-512.png --dry-run   # 只打印不写文件

注意：TapTap 商店图标（icon-512/icon-1024）是商店物料，本脚本不改它们，只改 APK 内 launcher 图标。
"""

import argparse
import sys
from pathlib import Path

# Windows 控制台默认 GBK，直接 print ✓/· 等字符会 UnicodeEncodeError，统一转 UTF-8
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

try:
    from PIL import Image, ImageDraw
except ImportError:
    sys.exit("缺少 Pillow，请先安装：pip install pillow（本机 DSH 自带 Python 已带 Pillow）")

# 与 app/build.gradle、README-APK.md 保持一致的占位背景色
DEFAULT_BG = (11, 11, 11, 255)

LEGACY_SIZES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

# 自适应图标前景：108dp 画布，按各密度换算成像素
ADAPTIVE_SIZES = {
    "drawable-mdpi": 108,
    "drawable-hdpi": 162,
    "drawable-xhdpi": 216,
    "drawable-xxhdpi": 324,
    "drawable-xxxhdpi": 432,
}

# 自适应图标安全区：108dp 画布中间 66dp（= 61.1%）
SAFE_ZONE_RATIO = 66.0 / 108.0


def load_icon(source: Path, bg=DEFAULT_BG) -> Image.Image:
    """读取源 PNG，转成不透明正方形 RGBA（有透明像素时垫深色背景）。"""
    img = Image.open(source)
    img = img.convert("RGBA")
    if img.width != img.height:
        side = max(img.width, img.height)
        square = Image.new("RGBA", (side, side), bg)
        square.paste(img, ((side - img.width) // 2, (side - img.height) // 2), img)
        img = square
    else:
        # 有透明通道的图：合成到不透明背景上（TapTap/启动器都不喜欢透明底图标）
        flat = Image.new("RGBA", img.size, bg)
        flat.alpha_composite(img)
        img = flat
    return img


def make_round(img: Image.Image, size: int) -> Image.Image:
    """把方形图标裁成圆形（透明四角），作为 ic_launcher_round。"""
    resized = img.resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size * 4, size * 4), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(resized, (0, 0), mask)
    return out


def make_adaptive_foreground(img: Image.Image, canvas: int) -> Image.Image:
    """108dp 透明画布，图标缩放到中间 66dp 安全区。"""
    inner = max(1, round(canvas * SAFE_ZONE_RATIO))
    scaled = img.resize((inner, inner), Image.LANCZOS)
    out = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    offset = (canvas - inner) // 2
    out.paste(scaled, (offset, offset), scaled)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="生成 Android launcher 图标（占位 -> 正式）")
    parser.add_argument("--source", required=True, help="正式图标 PNG 路径，建议 512x512 或更大正方形")
    parser.add_argument(
        "--res",
        default=str(Path(__file__).resolve().parent / "app" / "src" / "main" / "res"),
        help="Android res 目录（默认 android/app/src/main/res）",
    )
    parser.add_argument("--dry-run", action="store_true", help="只打印将生成的文件，不写磁盘")
    parser.add_argument(
        "--keep-vector-foreground",
        action="store_true",
        help="保留 drawable/ic_launcher_foreground.xml（默认删除，避免与 PNG 前景冲突）",
    )
    args = parser.parse_args()

    source = Path(args.source).resolve()
    res_dir = Path(args.res).resolve()
    if not source.is_file():
        sys.exit(f"源图标不存在：{source}")
    if not res_dir.is_dir():
        sys.exit(f"res 目录不存在：{res_dir}")

    img = load_icon(source)
    print(f"源图标：{source}（{img.width}x{img.height}）")
    print(f"输出 res：{res_dir}")

    written = []
    for folder, size in LEGACY_SIZES.items():
        out_dir = res_dir / folder
        if not args.dry_run:
            out_dir.mkdir(parents=True, exist_ok=True)
            img.resize((size, size), Image.LANCZOS).save(out_dir / "ic_launcher.png", "PNG", optimize=True)
            make_round(img, size).save(out_dir / "ic_launcher_round.png", "PNG", optimize=True)
        written += [str(out_dir / "ic_launcher.png"), str(out_dir / "ic_launcher_round.png")]
        print(f"  {folder}: {size}x{size} ic_launcher.png + ic_launcher_round.png")

    for folder, canvas in ADAPTIVE_SIZES.items():
        out_dir = res_dir / folder
        if not args.dry_run:
            out_dir.mkdir(parents=True, exist_ok=True)
            make_adaptive_foreground(img, canvas).save(out_dir / "ic_launcher_foreground.png", "PNG", optimize=True)
        written.append(str(out_dir / "ic_launcher_foreground.png"))
        print(f"  {folder}: {canvas}x{canvas} ic_launcher_foreground.png（安全区 {round(SAFE_ZONE_RATIO * 100)}%）")

    vector_foreground = res_dir / "drawable" / "ic_launcher_foreground.xml"
    if vector_foreground.is_file() and not args.keep_vector_foreground:
        if not args.dry_run:
            vector_foreground.unlink()
        written.append(f"(删除) {vector_foreground}")
        print(f"  已删除占位矢量前景：{vector_foreground}")

    print()
    if args.dry_run:
        print(f"[dry-run] 将生成/删除 {len(written)} 个文件（未写磁盘）")
    else:
        print(f"✓ 完成：{len(written)} 个文件已更新。")
        print("提示：")
        print("  1) 自适应图标背景色在 app/src/main/res/values/colors.xml 的 ic_launcher_background；")
        print("     若正式图标是浅色/白色底，请同步改成对应的颜色，避免 Android 8+ 出现深色描边。")
        print("  2) 提交这些 PNG 后重新触发生成 APK；TapTap 商店图标仍是 store-assets/icon-512.png，两者分开。")
        print("  3) 建议保留一份原占位图备份（git 历史即可）。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
