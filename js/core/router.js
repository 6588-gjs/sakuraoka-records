/* ==========================================================================
 * core/router.js — 渲染调度与流程路由
 * - render()：把当前状态渲染成完整 DOM（界面由 ui/screens.js 生成）
 * - navigate()：站内导航、历史栈、表/里模式切换、里页证据登记
 * - 启动 / 继续 / 新游戏 / 首次语言选择
 * ========================================================================== */
(function () {
  'use strict';

  const state = SK.core.state;
  const audio = SK.core.audio;

  let lastScrollTop = 0;

  /* ------------------------------------------------------------------------
   * 页面元信息
   * ---------------------------------------------------------------------- */
  function actOf(page) {
    if (!page) return 0;
    if (page.indexOf('a1_') === 0) return 1;
    if (page.indexOf('a2_') === 0) return 2;
    if (page.indexOf('a3_') === 0) return 3;
    return 0;
  }

  function homeForAct(act) {
    if (act === 2) return 'a2_editor';
    if (act === 3) return 'a3_home';
    return 'a1_home';
  }

  function isUnderPage(page) {
    if (!page) return false;
    return page.indexOf('a3_') === 0;
  }

  function addressFor() {
    const s = state.get();
    if (s.page === 'board') return 'http://www.sakuraoka-hs.jp/records/memo.html';
    if (s.page.indexOf('a1_') === 0) return 'http://www.sakuraoka-hs.jp/';
    if (s.page.indexOf('a2_') === 0) return 'http://intranet.sakuraoka-hs.jp/1989/';
    if (s.page.indexOf('a3_') === 0) {
      return s.mode === 'under' ? 'http://www.sakuraoka-hs.jp/_____/' : 'http://www.sakuraoka-hs.jp/';
    }
    return 'http://www.sakuraoka-hs.jp/';
  }

  function pageTitleFor() {
    const s = state.get();
    if (s.screen === 'title') return '旧桜丘高中记录室残存档案 V1.1.0';
    if (s.screen === 'lang') return '选择语言 - 旧樱丘高中记录室残存档案';
    if (s.screen === 'intro') return '记录室终端启动 - 旧桜丘高校';
    if (s.screen === 'cutscene') return '记忆回溯 - 旧桜丘高校';
    if (s.screen === 'ending') return '结局 - 旧樱丘高中记录室残存档案';
    if (s.page === 'board') return '推理ボード - Microsoft Internet Explorer';
    if (s.page.indexOf('a1_') === 0) return '旧桜丘高等学校 - Microsoft Internet Explorer';
    if (s.page.indexOf('a2_') === 0) return '校報編集室 - Microsoft Internet Explorer';
    if (s.page.indexOf('a3_') === 0) {
      return (s.mode === 'under' ? '100%正直なサイト' : '旧桜丘高等学校') + ' - Microsoft Internet Explorer';
    }
    return '旧桜丘高等学校 - Microsoft Internet Explorer';
  }

  /* ------------------------------------------------------------------------
   * 里网页证据登记
   * ---------------------------------------------------------------------- */
  function registerUnder(page) {
    const s = state.get();
    if (s.mode !== 'under') return null;
    if (s.seenUnder.indexOf(page) >= 0) return null;
    const clueId = SK.data.clues.UNDER_EVIDENCE[page];
    if (!clueId) {
      s.seenUnder.push(page);
      return null;
    }
    s.seenUnder.push(page);
    const added = state.addEvidence(clueId);
    if (added) {
      audio.evidence();
      audio.static();
    }
    return added ? clueId : null;
  }

  /* ------------------------------------------------------------------------
   * 渲染
   * ---------------------------------------------------------------------- */
  function render(opts) {
    const options = opts || {};
    const app = document.getElementById('app');
    if (!app) return;
    const contentEl = document.querySelector('.ie-content');
    if (contentEl) lastScrollTop = contentEl.scrollTop;

    const html = SK.ui.screens.renderAll();
    app.innerHTML = html;

    /* 字号 */
    state.applySettingsToDom();

    /* 恢复/重置滚动 */
    const nextContent = document.querySelector('.ie-content');
    if (nextContent) {
      if (options.keepScroll) {
        nextContent.scrollTop = lastScrollTop;
      } else {
        nextContent.scrollTop = 0;
      }
    }

    /* 推理板：绑定桌面拖拽 */
    if (state.get().screen === 'game' && state.get().page === 'board') {
      SK.core.board.bindDrag();
    }

    /* 键盘/读屏可用性 */
    try {
      document.title = pageTitleFor();
    } catch (err) {
      /* 忽略 */
    }

    /* 自动存档（state.save 内部会跳过结局/过场画面） */
    state.save();

    /* 页面切换音效由触发动作负责；此处不播放，避免初始化时出声 */
  }

  /* ------------------------------------------------------------------------
   * 导航
   * ---------------------------------------------------------------------- */
  function navigate(page, opts) {
    const options = opts || {};
    const s = state.get();
    if (!page) return;
    if (!options.replace) {
      s.history.push({ page: s.page, act: s.act, mode: s.mode });
      if (s.history.length > 40) s.history.shift();
    }
    s.page = page;
    const act = actOf(page);
    if (act) s.act = act;
    if (page.indexOf('a1_') === 0 || page.indexOf('a2_') === 0) s.mode = 'surface';
    if (page === 'a3_ritual') s.mode = 'under';
    if (s.overlay && s.overlay !== 'hint') {
      s.overlay = null;
      s.overlayReturn = null;
    }
    registerUnder(page);
    audio.page();
    render();
  }

  function goBack() {
    const s = state.get();
    if (!s.history.length) return;
    const prev = s.history.pop();
    s.page = prev.page;
    s.act = prev.act || actOf(prev.page) || 1;
    s.mode = prev.mode || 'surface';
    if (s.page === 'a3_ritual') s.mode = 'under';
    audio.page();
    render();
  }

  function goHome() {
    const s = state.get();
    const home = homeForAct(s.act || 1);
    navigate(home);
  }

  function toggleMode() {
    const s = state.get();
    if (s.act !== 3 && s.page !== 'board') {
      SK.ui.toast.show('第三周目で解放される機能です。');
      return;
    }
    if (s.page === 'a3_ritual') {
      s.mode = 'surface';
      s.page = 'a3_records';
      audio.page();
      render();
      return;
    }
    s.mode = s.mode === 'surface' ? 'under' : 'surface';
    if (s.mode === 'under') {
      registerUnder(s.page);
      audio.static();
      SK.ui.toast.show(SK.data.ui.toast.modeUnder);
    } else {
      SK.ui.toast.show(SK.data.ui.toast.modeSurface);
    }
    audio.flip();
    render();
  }

  /* ------------------------------------------------------------------------
   * 启动流程
   * ---------------------------------------------------------------------- */
  function boot() {
    state.initLanguage();
    state.applySettingsToDom();
    const settings = state.getSettings();
    if (!settings.firstRun) {
      state.patch({ screen: 'lang', tempLang: settings.translation || 'both', started: false });
    } else {
      state.patch({ screen: 'title', started: false });
    }
    render();
  }

  function chooseLang(lang) {
    if (['zh', 'ja', 'both'].indexOf(lang) < 0) return;
    state.patch({ tempLang: lang });
    audio.click();
    render({ keepScroll: true });
  }

  function confirmLang() {
    const lang = state.get().tempLang || 'both';
    state.updateSettings({ translation: lang, firstRun: true });
    state.patch({ screen: 'title', tempLang: lang, started: false });
    audio.page();
    render();
  }

  function startGame() {
    state.reset();
    state.patch({
      started: true,
      screen: 'intro',
      page: 'a1_home',
      act: 1,
      mode: 'surface',
      overlay: null
    });
    audio.click();
    render();
  }

  function enterArchive() {
    state.patch({ screen: 'game', page: 'a1_home', act: 1, mode: 'surface' });
    registerUnder('a1_home');
    audio.page();
    render();
  }

  function continueGame() {
    const raw = state.loadSave();
    if (!raw) {
      SK.ui.toast.show(SK.data.ui.toast.noSave, { type: 'error' });
      return false;
    }
    const ok = state.applySave(raw);
    if (!ok) {
      SK.ui.toast.show(SK.data.ui.toast.noSave, { type: 'error' });
      return false;
    }
    state.patch({ screen: 'game', overlay: null, overlayReturn: null, cutscene: null, ending: null });
    audio.page();
    render();
    SK.ui.toast.show(SK.data.ui.toast.loaded, { type: 'ok' });
    return true;
  }

  function startNew() {
    state.reset();
    state.patch({
      started: true,
      screen: 'intro',
      page: 'a1_home',
      act: 1,
      mode: 'surface',
      overlay: null,
      overlayReturn: null,
      cutscene: null,
      ending: null
    });
    audio.page();
    render();
  }

  /* ------------------------------------------------------------------------
   * 弹窗
   * ---------------------------------------------------------------------- */
  function openOverlay(kind, opts) {
    const s = state.get();
    const options = opts || {};
    if (!kind) return;
    if (options.from) {
      s.overlayReturn = options.from;
    } else if (!s.overlay || s.overlay === kind) {
      s.overlayReturn = null;
    }
    s.overlay = kind;
    audio.click();
    render({ keepScroll: true });
  }

  function closeOverlay() {
    const s = state.get();
    const back = s.overlayReturn;
    s.overlay = back || null;
    s.overlayReturn = null;
    audio.click();
    render({ keepScroll: true });
  }

  /* ------------------------------------------------------------------------
   * 对外接口
   * ---------------------------------------------------------------------- */
  SK.core.router = {
    render: render,
    navigate: navigate,
    goBack: goBack,
    goHome: goHome,
    toggleMode: toggleMode,
    registerUnder: registerUnder,
    boot: boot,
    chooseLang: chooseLang,
    confirmLang: confirmLang,
    startGame: startGame,
    enterArchive: enterArchive,
    continueGame: continueGame,
    startNew: startNew,
    openOverlay: openOverlay,
    closeOverlay: closeOverlay,
    /* 查询辅助 */
    actOf: actOf,
    homeForAct: homeForAct,
    addressFor: addressFor,
    pageTitleFor: pageTitleFor,
    pageContent: function () {
      const s = state.get();
      if (s.page === 'board') return SK.ui.screens.boardPage();
      if (s.page.indexOf('a1_') === 0) return SK.data.act1.render(s.page);
      if (s.page.indexOf('a2_') === 0) return SK.data.act2.render(s.page);
      if (s.page.indexOf('a3_') === 0) {
        registerUnder(s.page);
        return SK.data.act3.render(s.page);
      }
      return SK.data.act1.render('a1_home');
    }
  };
})();
