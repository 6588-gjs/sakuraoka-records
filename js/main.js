/* ==========================================================================
 * main.js — 启动入口
 * 1. 读取设置与存档状态
 * 2. 绑定全局事件
 * 3. 进入标题界面或首次语言选择
 * ========================================================================== */
(function () {
  'use strict';

  let booted = false;

  function boot() {
    if (booted) return;
    booted = true;

    /* 音效开关跟随设置（真正发声仍要等用户首次交互） */
    SK.core.audio.setEnabled(SK.core.state.getSettings().sound);

    /* 事件绑定（委托） */
    SK.ui.bind.init();

    /* 启动：首次运行先选择语言，否则进入标题 */
    SK.core.router.boot();

    /* localStorage 不可用时提示（仍可游玩，只是刷新不能继续） */
    if (!SK.core.storage.isAvailable()) {
      window.setTimeout(function () {
        SK.ui.toast.show(SK.data.ui.toast.saveUnavailable, { type: 'error', duration: 5000 });
      }, 600);
    }

    /* 记录一条无害的启动信息，便于自动化与排障 */
    try {
      console.info('[SAKURAOKA] v' + SK.VERSION + ' ready');
    } catch (err) {
      /* 忽略 */
    }
  }

  /* 供调试/测试显式触发 */
  SK.app = {
    boot: boot,
    version: SK.VERSION
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
