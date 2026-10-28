/* ==========================================================================
 * debug.js — window.SAKURAOKA 调试 / 自动化 API
 * 供 E2E 测试、截图、TapTap 物料录制使用；保留在正式包中也无害。
 *
 *   SAKURAOKA.version
 *   SAKURAOKA.getState()
 *   SAKURAOKA.snapshot()
 *   SAKURAOKA.jump(page, opts)
 *   SAKURAOKA.setLanguage(lang) / setTranslation(mode)
 *   SAKURAOKA.addEvidence(ids)
 *   SAKURAOKA.solveAll()
 *   SAKURAOKA.startNew() / continueGame()
 *   SAKURAOKA.goEnding(key)
 * ========================================================================== */
(function () {
  'use strict';

  const VERSION = '1.1.0';

  const ACT1_EVIDENCE = [
    'c31', 'c_photo', 'c_registry', 'c_name', 'c_exist',
    'c_erased', 'c_coverup', 'c_lock', 'c_conspiracy'
  ];
  const ACT3_UNDER_EVIDENCE = ['e_shiori', 'e_karen', 'e_katsuragi', 'e_message', 'e_log'];
  const ACT3_DERIVED_EVIDENCE = ['e_ritual', 'e_pattern', 'e_killer', 'e_rescue', 'e_final', 'e_rhyme'];
  const ALL_UNDER_PAGES = Object.keys(SK.data.clues.UNDER_EVIDENCE);
  const ALL_CLUE_IDS = Object.keys(SK.data.clues.CLUES);

  const OVERLAY_KINDS = ['menu', 'settings', 'hint', 'gallery', 'about', 'privacy', 'clearConfirm'];

  /* 页面 → 默认需要的状态 */
  const ACT1_PAGES = [
    'a1_home', 'a1_about', 'a1_news', 'a1_library', 'a1_album', 'a1_staff',
    'a1_song', 'a1_sys', 'a1_bbs', 'a1_sitemap', 'a1_news1989', 'a1_news2002',
    'a1_records', 'a1_archive', 'a1_lock', 'a1_search'
  ];
  const ACT2_PAGES = [
    'a2_editor', 'a2_notes', 'a2_roster', 'a2_duty', 'a2_repair',
    'a2_witness', 'a2_diary', 'a2_terminal', 'a2_search'
  ];
  const ACT3_PAGES = [
    'a3_home', 'a3_about', 'a3_news1989', 'a3_news2002', 'a3_staff',
    'a3_library', 'a3_bbs', 'a3_principal', 'a3_records', 'a3_ritual',
    'a3_rhyme', 'a3_final', 'a3_search'
  ];

  /* 这些页面在 jump 时默认以里网页模式呈现（内容更完整） */
  const DEFAULT_UNDER = {
    a3_ritual: true,
    a3_rhyme: true,
    a3_records: true
  };

  function state() {
    return SK.core.state;
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (err) {
      return null;
    }
  }

  function pageAct(page) {
    if (!page) return 0;
    if (page.indexOf('a1_') === 0) return 1;
    if (page.indexOf('a2_') === 0) return 2;
    if (page.indexOf('a3_') === 0) return 3;
    return 0;
  }

  function addIds(ids, silent) {
    const list = Array.isArray(ids) ? ids : (ids ? [ids] : []);
    let added = 0;
    list.forEach(function (id) {
      if (state().addEvidence(id, { silent: silent !== false })) added += 1;
    });
    return added;
  }

  function demoAct1() {
    addIds(ACT1_EVIDENCE, true);
    state().patch({
      a1Level: 2,
      solved: Object.assign({}, state().get().solved, { a1code: true }),
      readDocs: SK.data.documents.A1_DOCS.map(function (d) {
        return d.id;
      })
    });
  }

  function demoUnderEvidence() {
    addIds(ACT3_UNDER_EVIDENCE, true);
  }

  function demoAct3All() {
    addIds(ALL_CLUE_IDS, true);
    state().patch({
      a1Level: 2,
      solved: {
        a1code: true,
        a2witness: true,
        a2proof: true,
        a2upload: true,
        a3rhyme: true
      },
      ritualUnlocked: true,
      seenUnder: ALL_UNDER_PAGES.slice()
    });
  }

  function demoBoard() {
    addIds(ALL_CLUE_IDS, true);
    const layout = {
      e_pattern: { x: 20, y: 24 },
      e_killer: { x: 50, y: 22 },
      c_erased: { x: 80, y: 24 },
      e_rescue: { x: 20, y: 64 },
      e_final: { x: 50, y: 62 },
      c_conspiracy: { x: 80, y: 64 }
    };
    const nodes = [];
    Object.keys(layout).forEach(function (clueId) {
      nodes.push({
        uid: 'demo_' + clueId,
        clueId: clueId,
        x: layout[clueId].x,
        y: layout[clueId].y
      });
    });
    state().patch({
      nodes: nodes,
      boardSel: [],
      act: 3,
      solved: Object.assign({}, state().get().solved, { a3rhyme: true })
    });
  }

  /* 读取 opts.overlay（仅接受白名单内的弹窗类型） */
  function overlayOpt(o) {
    if (o && o.overlay && OVERLAY_KINDS.indexOf(o.overlay) >= 0) return o.overlay;
    return null;
  }

  /* ------------------------------------------------------------------------
   * 状态摘要
   * ---------------------------------------------------------------------- */
  function snapshot() {
    const s = state().get();
    const puzzles = SK.core.puzzles;
    const endings = state().readEndings();
    return {
      version: VERSION,
      build: '2026.10.28',
      screen: s.screen,
      page: s.page,
      act: s.act,
      mode: s.mode,
      started: s.started,
      language: s.language,
      translation: s.translation,
      evidence: s.evidence.slice(),
      evidenceCount: s.evidence.length,
      nodesCount: s.nodes.length,
      nodes: s.nodes.map(function (n) {
        return { uid: n.uid, clueId: n.clueId, x: n.x, y: n.y };
      }),
      solved: clone(s.solved),
      ritualUnlocked: s.ritualUnlocked,
      seenUnder: s.seenUnder.slice(),
      ending: s.ending,
      canPolice: puzzles.canPolice(),
      canCurse: puzzles.canCurse(),
      canTruth: puzzles.canTruth(),
      endings: Object.keys(endings.unlocked),
      endingsTotal: SK.data.endings.total,
      endingsCount: Object.keys(endings.unlocked).length,
      hasSave: state().hasSave(),
      overlay: s.overlay,
      residue: state().residue(),
      takuyaName: state().takuyaName(),
      a1Level: s.a1Level,
      readDocs: s.readDocs.slice(),
      storageAvailable: SK.core.storage.isAvailable()
    };
  }

  /* ------------------------------------------------------------------------
   * jump：直接进入任意页面并设置必要前置状态（截图 / E2E 用）
   * opts = {
   *   mode: 'surface'|'under',
   *   translation: 'zh'|'ja'|'both',
   *   act: 1|2|3,
   *   evidence: [...],
   *   doc: 'd_attendance',
   *   stage: 1..4            // 只对 a2_terminal 有效
   *   unlocked: true|false   // 只对 a3_ritual 有效
   *   q: '关键词'            // 搜索页
   *   overlay: 'settings'|'menu'|'hint'|'gallery'|'about'|'privacy'|'clearConfirm'
   * }
   * ---------------------------------------------------------------------- */
  function jump(page, opts) {
    const o = opts || {};
    if (!page) return snapshot();

    /* 语言 */
    const lang = o.translation || o.language;
    if (lang && ['zh', 'ja', 'both'].indexOf(lang) >= 0) {
      state().updateSettings({ translation: lang });
      state().patch({ translation: lang, language: lang });
    }

    /* 特殊画面 */
    if (page === 'title') {
      state().patch({
        screen: 'title',
        overlay: overlayOpt(o),
        overlayReturn: null,
        ending: null,
        cutscene: null
      });
      SK.core.router.render();
      return snapshot();
    }
    if (page === 'lang') {
      state().patch({
        screen: 'lang',
        tempLang: lang || state().getSettings().translation || 'both',
        overlay: overlayOpt(o),
        ending: null
      });
      SK.core.router.render();
      return snapshot();
    }
    if (page === 'intro') {
      state().patch({
        started: true,
        screen: 'intro',
        overlay: overlayOpt(o),
        ending: null,
        cutscene: null,
        page: 'a1_home',
        act: 1,
        mode: 'surface'
      });
      SK.core.router.render();
      return snapshot();
    }
    if (page.indexOf('ending:') === 0) {
      return goEnding(page.split(':')[1]);
    }

    /* 进入游戏画面 */
    const s = state().get();
    const actFromPage = pageAct(page);
    const act = o.act || actFromPage || s.act || 1;
    let mode = o.mode || (page === 'board' ? 'surface' : (DEFAULT_UNDER[page] ? 'under' : 'surface'));
    if (page === 'a3_ritual') mode = o.mode || 'under';

    state().patch({
      started: true,
      screen: 'game',
      page: page,
      act: act,
      mode: mode,
      overlay: null,
      overlayReturn: null,
      ending: null,
      cutscene: null,
      boardSel: [],
      searchQuery: o.q || ''
    });

    /* 各页面的前置状态 */
    if (page.indexOf('a1_') === 0) {
      if (page === 'a1_archive' || page === 'a1_lock') {
        demoAct1();
        state().patch({ selectedDoc: o.doc || (page === 'a1_archive' ? 'd_staffmeeting' : null) });
      } else if (page === 'a1_records') {
        if (o.loggedIn) {
          demoAct1();
          state().patch({ a1Level: 1 });
        } else {
          /* 默认展示登录界面 */
          state().patch({ a1Level: 0 });
        }
      } else if (page === 'a1_news1989') {
        demoAct1();
        addIds(['c_conspiracy'], true);
      } else if (page === 'a1_search') {
        state().patch({ searchQuery: o.q || '花憐' });
      }
    } else if (page.indexOf('a2_') === 0) {
      const stage = Number(o.stage || 1);
      const solved = Object.assign({}, state().get().solved);
      if (stage >= 2) solved.a2witness = true;
      if (stage >= 3) solved.a2proof = true;
      if (page === 'a2_terminal' && stage >= 4) solved.a2upload = true;
      state().patch({ solved: solved });
      if (page === 'a2_search') state().patch({ searchQuery: o.q || '葛城' });
    } else if (page === 'board') {
      demoBoard();
    } else if (page.indexOf('a3_') === 0) {
      if (page === 'a3_final') {
        demoAct3All();
      } else {
        if (mode === 'under') demoUnderEvidence();
        if (page === 'a3_records') {
          /* 记录室：默认能看到隐藏页面入口 */
          addIds(['e_log'], true);
        }
        if (page === 'a3_ritual') {
          const unlocked = o.unlocked !== false;
          state().patch({ ritualUnlocked: unlocked, mode: 'under' });
          if (unlocked) addIds(['e_ritual', 'e_killer', 'e_final'], true);
        }
        if (page === 'a3_rhyme') {
          state().patch({ solved: Object.assign({}, state().get().solved, { a3rhyme: !!o.solved }) });
          if (o.solved) addIds(['e_rhyme'], true);
        }
        if (page === 'a3_search') state().patch({ searchQuery: o.q || '詩織' });
        if (page === 'a3_final') demoAct3All();
      }
    }

    /* 追加指定证据 */
    if (o.evidence) addIds(o.evidence, true);

    /* 弹窗 */
    if (o.overlay && OVERLAY_KINDS.indexOf(o.overlay) >= 0) {
      state().patch({ overlay: o.overlay, overlayReturn: null });
    }

    SK.core.router.render();
    return snapshot();
  }

  /* ------------------------------------------------------------------------
   * 其余公开 API
   * ---------------------------------------------------------------------- */
  function setLanguage(lang) {
    if (['zh', 'ja', 'both'].indexOf(lang) < 0) return snapshot();
    state().setTranslation(lang);
    SK.core.router.render({ keepScroll: true });
    return snapshot();
  }

  function addEvidenceApi(ids) {
    const added = addIds(ids, true);
    SK.core.router.render({ keepScroll: true });
    return added;
  }

  function solveAll() {
    demoAct3All();
    addIds(ACT1_EVIDENCE, true);
    SK.core.router.render({ keepScroll: true });
    return snapshot();
  }

  function startNew() {
    state().reset();
    state().patch({
      started: true,
      screen: 'intro',
      page: 'a1_home',
      act: 1,
      mode: 'surface',
      overlay: null,
      overlayReturn: null,
      ending: null,
      cutscene: null
    });
    SK.core.router.render();
    return snapshot();
  }

  function continueGame() {
    const ok = SK.core.router.continueGame();
    return ok;
  }

  function goEnding(key) {
    if (['police', 'curse', 'truth', 'nothing'].indexOf(key) < 0) return snapshot();
    /* 调试用途：直接解锁对应结局并进入结局画面 */
    state().unlockEnding(key);
    state().patch({
      started: true,
      screen: 'ending',
      ending: key,
      overlay: null,
      overlayReturn: null,
      cutscene: null
    });
    SK.core.router.render();
    return snapshot();
  }

  function openOverlayApi(kind) {
    if (OVERLAY_KINDS.indexOf(kind) < 0) return snapshot();
    SK.core.router.openOverlay(kind);
    return snapshot();
  }

  function closeOverlayApi() {
    SK.core.router.closeOverlay();
    return snapshot();
  }

  function getState() {
    return clone(state().get());
  }

  window.SAKURAOKA = {
    version: VERSION,
    build: '2026.10.28',
    getState: getState,
    snapshot: snapshot,
    jump: jump,
    setLanguage: setLanguage,
    setTranslation: setLanguage,
    addEvidence: addEvidenceApi,
    solveAll: solveAll,
    startNew: startNew,
    continueGame: continueGame,
    goEnding: goEnding,
    openOverlay: openOverlayApi,
    closeOverlay: closeOverlayApi,
    /* 供测试脚本读取的常量 */
    pages: {
      act1: ACT1_PAGES.slice(),
      act2: ACT2_PAGES.slice(),
      act3: ACT3_PAGES.slice(),
      board: ['board'],
      screens: ['title', 'lang', 'intro']
    }
  };

  SK.debug = {
    snapshot: snapshot,
    jump: jump
  };
})();
