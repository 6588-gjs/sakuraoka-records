/* ==========================================================================
 * namespace.js — 全局命名空间与版本常量
 * 本项目使用 classic script（非 ES module），保证 file:// 双击直接可玩。
 * 所有模块通过 window.SK 暴露，命名空间分层：data / core / ui。
 * ========================================================================== */
window.SK = window.SK || {};

SK.VERSION = '1.1.0';
SK.BUILD = '2026.10.28';
SK.GAME_NAME_ZH = '旧樱丘高中记录室残存档案';
SK.GAME_NAME_JA = '旧桜丘高校 記録室残存ファイル';
SK.AGE_RATING = '16+';

/* 分层容器（各模块只向自己的层挂载，避免互相覆盖） */
SK.data = SK.data || {};
SK.core = SK.core || {};
SK.ui = SK.ui || {};
