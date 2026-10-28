/* ==========================================================================
 * ui/toast.js — 全局轻提示（证据入手 / 操作失败 / 提示）
 * ========================================================================== */
(function () {
  'use strict';

  let timer = null;

  function show(message, opts) {
    const options = opts || {};
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.className = 'toast show' + (options.type ? ' ' + options.type : '');
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      el.className = 'toast' + (options.type ? ' ' + options.type : '');
    }, options.duration || 2400);
  }

  function hide() {
    const el = document.getElementById('toast');
    if (!el) return;
    el.className = 'toast';
    if (timer) window.clearTimeout(timer);
  }

  /* 供读屏软件播报重要状态 */
  function announce(message) {
    const live = document.getElementById('sr-live');
    if (!live) return;
    live.textContent = '';
    window.setTimeout(function () {
      live.textContent = message;
    }, 30);
  }

  SK.ui.toast = {
    show: show,
    hide: hide,
    announce: announce
  };
})();
