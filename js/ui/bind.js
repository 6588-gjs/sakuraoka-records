/* ==========================================================================
 * ui/bind.js — 全局事件绑定（事件委托）
 * - 所有交互都由 data-act / data-page / data-doc / data-clue / data-uid 驱动
 * - 同时处理键盘 Enter（登录 / 密码 / 搜索）与 Esc（关闭弹窗）
 * ========================================================================== */
(function () {
  'use strict';

  function state() {
    return SK.core.state.get();
  }

  function audio() {
    return SK.core.audio;
  }

  /* 读取当前可见的搜索框内容（桌面侧栏 / 手机搜索条二选一） */
  function readSearch(scope) {
    const inputs = document.querySelectorAll('.search-input[data-search="' + scope + '"]');
    let value = '';
    Array.prototype.forEach.call(inputs, function (input) {
      if (input.offsetParent !== null || inputs.length === 1) value = input.value;
    });
    return value.trim();
  }

  function doSearch(scope) {
    const q = readSearch(scope);
    state().searchQuery = q;
    if (scope === 'act1') {
      SK.core.router.navigate('a1_search');
    } else if (scope === 'act2') {
      SK.core.router.navigate('a2_search');
    } else {
      SK.core.router.navigate('a3_search');
    }
  }

  /* ------------------------------------------------------------------------
   * 动作表
   * ---------------------------------------------------------------------- */
  const ACTIONS = {
    /* 系统 */
    openMenu: function () {
      SK.core.router.openOverlay('menu');
    },
    closeOverlay: function () {
      SK.core.router.closeOverlay();
    },
    openHint: function () {
      SK.core.router.openOverlay('hint');
    },
    openSettings: function () {
      SK.core.router.openOverlay('settings');
    },
    openGallery: function () {
      SK.core.router.openOverlay('gallery');
    },
    openAbout: function () {
      SK.core.router.openOverlay('about');
    },
    openPrivacy: function (el) {
      const from = el.getAttribute('data-from');
      SK.core.router.openOverlay('privacy', from ? { from: from } : null);
    },
    openClearConfirm: function () {
      SK.core.router.openOverlay('clearConfirm');
    },
    refresh: function () {
      SK.core.router.render({ keepScroll: true });
    },
    translationCycle: function () {
      SK.core.state.cycleTranslation();
      audio().click();
      SK.ui.toast.show(SK.data.ui.toast.langChanged);
      SK.core.router.render({ keepScroll: true });
    },
    setLang: function (el) {
      const lang = el.getAttribute('data-lang');
      SK.core.state.updateSettings({ translation: lang });
      state().translation = lang;
      audio().click();
      SK.ui.toast.show(SK.data.ui.toast.langChanged);
      SK.core.router.render({ keepScroll: true });
    },
    setFont: function (el) {
      const size = el.getAttribute('data-size');
      SK.core.state.updateSettings({ fontSize: size });
      audio().click();
      SK.core.router.render({ keepScroll: true });
    },
    setSound: function (el) {
      const on = el.getAttribute('data-on') === '1';
      SK.core.state.updateSettings({ sound: on });
      audio().setEnabled(on);
      SK.ui.toast.show(on ? SK.data.ui.toast.soundOn : SK.data.ui.toast.soundOff);
      if (on) audio().click();
      SK.core.router.render({ keepScroll: true });
    },
    clearSave: function () {
      SK.core.state.clearSave();
      SK.core.state.reset();
      state().screen = 'title';
      state().overlay = null;
      state().overlayReturn = null;
      audio().error();
      SK.ui.toast.show(SK.data.ui.toast.saveCleared);
      SK.core.router.render();
    },
    backToTitle: function () {
      SK.core.puzzles.goTitle();
    },
    restartGame: function () {
      SK.core.router.startNew();
    },
    startGame: function () {
      if (SK.core.state.hasSave()) {
        SK.core.router.openOverlay('newGameConfirm');
        return;
      }
      SK.core.router.startGame();
    },
    confirmNewGame: function () {
      state().overlay = null;
      SK.core.router.startGame();
    },
    continueGame: function () {
      SK.core.router.continueGame();
    },
    enterArchive: function () {
      SK.core.router.enterArchive();
    },
    chooseLang: function (el) {
      SK.core.router.chooseLang(el.getAttribute('data-lang'));
    },
    confirmLang: function () {
      SK.core.router.confirmLang();
    },
    nextCutscene: function () {
      SK.core.puzzles.nextCutscene();
    },

    /* 第一幕 */
    loginStudent: function () {
      SK.core.puzzles.loginStudent();
    },
    loginTeacher: function () {
      SK.core.puzzles.loginTeacher();
    },
    logoutA1: function () {
      SK.core.puzzles.logoutA1();
    },
    openA1Doc: function (el) {
      SK.core.puzzles.openA1Doc(el.getAttribute('data-doc'));
    },
    unlockA1: function () {
      SK.core.puzzles.unlockA1();
    },
    search1: function () {
      doSearch('act1');
    },
    startAct2: function () {
      SK.core.puzzles.startAct2();
    },

    /* 第二幕 */
    a2Answer: function (el) {
      SK.core.puzzles.answerA2(el.getAttribute('data-idx'));
    },
    a2Proof: function (el) {
      SK.core.puzzles.answerA2Proof(el.getAttribute('data-idx'));
    },
    a2Upload: function () {
      SK.core.puzzles.uploadA2();
    },
    search2: function () {
      doSearch('act2');
    },
    startAct3: function () {
      SK.core.puzzles.startAct3();
    },

    /* 第三幕 */
    toggleMode: function () {
      SK.core.router.toggleMode();
    },
    unlockRitual: function () {
      SK.core.puzzles.unlockRitual();
    },
    answerRhyme: function (el) {
      SK.core.puzzles.answerRhyme(el.getAttribute('data-idx'));
    },
    chooseEnding: function (el) {
      SK.core.puzzles.chooseEnding(el.getAttribute('data-ending'));
    },
    search3: function () {
      doSearch('act3');
    },

    /* 推理板 */
    goBoard: function () {
      state().overlay = null;
      state().overlayReturn = null;
      SK.core.router.navigate('board');
    },
    selectClue: function (el) {
      SK.core.board.selectItem('clue', el.getAttribute('data-clue'));
    },
    selectNode: function (el) {
      SK.core.board.selectItem('node', el.getAttribute('data-uid'));
    },
    boardCombine: function () {
      SK.core.board.combineSelected();
    },
    boardClear: function () {
      SK.core.board.clearSelection();
    },
    boardReset: function () {
      SK.core.board.resetBoard();
    },

    /* 浏览器后退（工具栏） */
    back: function () {
      SK.core.router.goBack();
    }
  };

  /* ------------------------------------------------------------------------
   * 点击委托
   * ---------------------------------------------------------------------- */
  function onDocumentClick(event) {
    const target = event.target;

    /* 点击弹窗背板关闭 */
    if (target.classList && target.classList.contains('overlay')) {
      SK.core.router.closeOverlay();
      return;
    }

    /* 关闭语音：任何点击都算用户交互，可解锁 AudioContext */
    if (audio()) audio().unlock();

    /* 优先处理 data-page（站内导航） */
    const pageEl = target.closest ? target.closest('[data-page]') : null;
    if (pageEl) {
      const page = pageEl.getAttribute('data-page');
      if (pageEl.disabled) return;
      if (page === 'board') audio().flip();
      SK.core.router.navigate(page);
      return;
    }

    /* data-act 动作 */
    const actEl = target.closest ? target.closest('[data-act]') : null;
    if (!actEl) return;
    if (actEl.disabled) return;
    const act = actEl.getAttribute('data-act');
    const fn = ACTIONS[act];
    if (!fn) return;
    /* 防止按钮内文字点击时重复触发 */
    event.preventDefault();
    fn(actEl);
  }

  /* ------------------------------------------------------------------------
   * 键盘
   * ---------------------------------------------------------------------- */
  function onKeyDown(event) {
    if (event.key === 'Escape') {
      if (state().overlay) {
        SK.core.router.closeOverlay();
        return;
      }
    }

    if (event.key !== 'Enter') return;
    const id = event.target && event.target.id;
    if (!id) return;
    if (id === 'loginSId' || id === 'loginSPw') {
      event.preventDefault();
      SK.core.puzzles.loginStudent();
    } else if (id === 'loginTId' || id === 'loginTPw') {
      event.preventDefault();
      SK.core.puzzles.loginTeacher();
    } else if (id === 'a1Code') {
      event.preventDefault();
      SK.core.puzzles.unlockA1();
    } else if (id === 'a2Pass') {
      event.preventDefault();
      SK.core.puzzles.uploadA2();
    } else if (id === 'ritualCode') {
      event.preventDefault();
      SK.core.puzzles.unlockRitual();
    } else if (event.target.classList && event.target.classList.contains('search-input')) {
      event.preventDefault();
      doSearch(event.target.getAttribute('data-search') || 'act1');
    }
  }

  /* ------------------------------------------------------------------------
   * 首次交互解锁音效
   * ---------------------------------------------------------------------- */
  function onFirstGesture() {
    audio().unlock();
    audio().setEnabled(SK.core.state.getSettings().sound);
  }

  /* ------------------------------------------------------------------------
   * 初始化
   * ---------------------------------------------------------------------- */
  function init() {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeyDown);

    /* 首次手势后才允许发声（浏览器自动播放策略） */
    document.addEventListener('pointerdown', onFirstGesture, { once: true });
    document.addEventListener('keydown', onFirstGesture, { once: true });

    /* 离开页面 / 切后台时再存一次，避免丢失最后一步 */
    window.addEventListener('beforeunload', function () {
      SK.core.state.save();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') SK.core.state.save();
    });
  }

  SK.ui.bind = {
    init: init,
    actions: ACTIONS
  };
})();
