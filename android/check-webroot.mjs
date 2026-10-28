#!/usr/bin/env node
/**
 * check-webroot.mjs —— 本地校验 "H5 站点根目录" 是否能被 Android 工程的
 * copyWebAssets 任务正确复制（不需要 Android SDK / Gradle，仅需 Node）。
 *
 * 它精确模拟 android/app/build.gradle 里 copyWebAssets 的 include/exclude 规则：
 *   include: index.html, privacy.html, manifest.webmanifest, favicon.*, css/**, js/**, assets/**
 *   exclude: android/**, .git/**, .github/**, node_modules/**, README*, *.map, .DS_Store, Thumbs.db
 *
 * 用法（在仓库根/项目根执行都可以）：
 *   node sakuraoka/android/check-webroot.mjs --web-root=sakuraoka/pages
 *   node sakuraoka/android/check-webroot.mjs --web-root=sakuraoka/pages --copy
 *   node sakuraoka/android/check-webroot.mjs --web-root=.            # CI/仓库根场景（默认 web-root=android 的上一级）
 *   node sakuraoka/android/check-webroot.mjs --web-root=sakuraoka/pages --copy --out=sakuraoka/android/app/src/main/assets/www
 *
 * --copy  会先清空输出目录，再把筛选后的文件复制过去（= 本地模拟 copyWebAssets）
 * 退出码：0 = 校验通过；1 = 校验失败（缺 index.html / 没有可复制文件 / 目录不存在）
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ------------------------- 参数解析 -------------------------
function parseArgs(argv) {
  const opts = {
    webRoot: path.resolve(__dirname, '..'), // 默认：android/ 的上一级（仓库根场景）
    out: path.resolve(__dirname, 'app/src/main/assets/www'),
    copy: false,
    list: 20,
  };
  for (const arg of argv.slice(2)) {
    if (arg === '--copy') opts.copy = true;
    else if (arg.startsWith('--web-root=')) opts.webRoot = path.resolve(process.cwd(), arg.slice('--web-root='.length));
    else if (arg.startsWith('--webroot=')) opts.webRoot = path.resolve(process.cwd(), arg.slice('--webroot='.length));
    else if (arg.startsWith('--out=')) opts.out = path.resolve(process.cwd(), arg.slice('--out='.length));
    else if (arg.startsWith('--list=')) opts.list = Number(arg.slice('--list='.length)) || 20;
    else if (arg === '--help' || arg === '-h') {
      console.log('用法: node check-webroot.mjs [--web-root=<H5站点根>] [--copy] [--out=<输出目录>] [--list=N]');
      process.exit(0);
    } else {
      console.error(`未知参数: ${arg}（--help 查看用法）`);
      process.exit(2);
    }
  }
  return opts;
}

// ------------------------- 与 Gradle 一致的筛选规则 -------------------------
const INCLUDES = [
  /^index\.html$/,
  /^privacy\.html$/,
  /^manifest\.webmanifest$/,
  /^favicon\.(ico|png|svg)$/,
  /^css\//,
  /^js\//,
  /^assets\//,
];

const EXCLUDES = [
  /^android\//,
  /^\.git\//,
  /^\.github\//,
  /^node_modules\//,
  /(^|\/)node_modules\//,
  /(^|\/)README/i,
  /(^|\/)\.DS_Store$/,
  /(^|\/)Thumbs\.db$/,
  /\.map$/,
];

function normalizeRel(p) {
  return p.split(path.sep).join('/');
}

function shouldCopy(rel) {
  if (EXCLUDES.some((re) => re.test(rel))) return false;
  return INCLUDES.some((re) => re.test(rel));
}

function walk(root, relDir = '', out = []) {
  const absDir = relDir ? path.join(root, relDir) : root;
  let entries;
  try {
    entries = fs.readdirSync(absDir, { withFileTypes: true });
  } catch (err) {
    console.error(`无法读取目录: ${absDir} (${err.message})`);
    return out;
  }
  for (const entry of entries) {
    const rel = relDir ? `${relDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      // 与 copyWebAssets 的 exclude 对齐：跳过 .git / .github / android / node_modules 等大目录
      if (EXCLUDES.some((re) => re.test(`${rel}/`))) continue;
      walk(root, rel, out);
    } else if (entry.isFile()) {
      out.push(rel);
    }
  }
  return out;
}

// ------------------------- 主流程 -------------------------
const opts = parseArgs(process.argv);

console.log('='.repeat(72));
console.log('check-webroot: 校验 H5 站点根目录（模拟 copyWebAssets）');
console.log('='.repeat(72));
console.log(`web root  = ${opts.webRoot}`);

let stat;
try {
  stat = fs.statSync(opts.webRoot);
} catch {
  console.error(`✗ web root 不存在: ${opts.webRoot}`);
  process.exit(1);
}
if (!stat.isDirectory()) {
  console.error(`✗ web root 不是目录: ${opts.webRoot}`);
  process.exit(1);
}

const allFiles = walk(opts.webRoot);
const selected = allFiles.filter(shouldCopy).sort();
const totalBytes = selected.reduce((n, rel) => n + fs.statSync(path.join(opts.webRoot, rel)).size, 0);

console.log(`文件总数（全部） = ${allFiles.length}`);
console.log(`将被复制的文件   = ${selected.length}（${(totalBytes / 1024 / 1024).toFixed(2)} MB）`);
console.log('');
console.log(`前 ${Math.min(opts.list, selected.length)} 个文件：`);
for (const rel of selected.slice(0, opts.list)) {
  const size = fs.statSync(path.join(opts.webRoot, rel)).size;
  console.log(`  + ${rel}  (${size} B)`);
}
if (selected.length > opts.list) console.log(`  …… 其余 ${selected.length - opts.list} 个文件省略`);

// 关键内容检查
const problems = [];
const warnings = [];
const has = (rel) => selected.includes(rel);

if (!has('index.html')) problems.push('缺少 index.html —— APK 打开会白屏/404');
if (!has('privacy.html')) warnings.push('缺少 privacy.html —— TapTap 隐私政策页建议保留（主 URL 用 GitHub Pages 亦可）');
if (!selected.some((p) => p.startsWith('css/'))) warnings.push('css/ 下没有文件');
if (!selected.some((p) => p.startsWith('js/'))) warnings.push('js/ 下没有文件（H5 游戏逻辑全部依赖它）');
if (!selected.some((p) => p.startsWith('assets/'))) warnings.push('assets/ 下没有文件（如游戏不用静态资源可忽略）');

console.log('');
for (const w of warnings) console.log(`⚠ ${w}`);
for (const p of problems) console.log(`✗ ${p}`);

// 可选：模拟 Sync 复制
if (opts.copy) {
  if (problems.length) {
    console.error('\n✗ 存在致命问题，已跳过复制。');
    process.exit(1);
  }
  fs.rmSync(opts.out, { recursive: true, force: true });
  for (const rel of selected) {
    const src = path.join(opts.webRoot, rel);
    const dst = path.join(opts.out, normalizeRel(rel));
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
  console.log(`\n✓ 已模拟 copyWebAssets：${selected.length} 个文件 -> ${opts.out}`);
} else {
  console.log('\n（加 --copy 可把筛选结果实际复制到 app/src/main/assets/www 做本地检查）');
}

if (problems.length) {
  console.log('\n✗ 校验失败：请修正上面的致命问题，或在实测时用 -PwebRoot 指向正确的 H5 站点根。');
  process.exit(1);
}
console.log('\n✓ 校验通过：这个目录可以作为 -PwebRoot 的值交给 Gradle。');
process.exit(0);
