/* ==========================================================================
 * core/state.js — 游戏状态、自动存档、设置、结局收集
 * 存档键：sakuraoka.save.v1（每次操作后自动写入）
 * 结局键：sakuraoka.endings.v1（4 个结局的解锁记录）
 * 设置键：sakuraoka.settings.v1（语言 / 字号 / 音效）
 * ========================================================================== */
(function () {
  'use strict';

  const storage = SK.core.storage;
  const KEYS = storage.KEYS;

  /* ------------------------------------------------------------------------
   * 默认设置
   * ---------------------------------------------------------------------- */
  const DEFAULT_SETTINGS = {
    language: 'both',
    translation: 'both',
    fontSize: 'm',
    sound: true,
    firstRun: false
  };

  const VALID_TRANSLATION = ['ja', 'zh', 'both'];
  const VALID_FONT = ['s', 'm', 'l'];

  /* ------------------------------------------------------------------------
   * 默认游戏状态
   * ---------------------------------------------------------------------- */
  function createDefault() {
    return {
      /* 流程 */
      started: false,
      screen: 'title',
      page: 'a1_home',
      act: 1,
      mode: 'surface',
      /* 收集 */
      evidence: [],
      nodes: [],
      history: [],
      seenUnder: [],
      readDocs: [],
      selectedDoc: null,
      /* 谜题 */
      solved: {
        a1code: false,
        a2witness: false,
        a2proof: false,
        a2upload: false,
        a3rhyme: false
      },
      a1Level: 0,
      ritualUnlocked: false,
      /* 语言 */
      translation: 'both',
      language: 'both',
      /* 临时界面状态（不写入存档） */
      ending: null,
      cutscene: null,
      overlay: null,
      overlayReturn: null,
      tempLang: 'both',
      searchQuery: '',
      loginError: '',
      a1LockError: '',
      a2Error: '',
      ritualError: '',
      boardSel: [],
      gatingMessage: ''
    };
  }

  let s = createDefault();
  let settings = loadSettings();

  /* ------------------------------------------------------------------------
   * 设置读写
   * ---------------------------------------------------------------------- */
  function loadSettings() {
    const raw = storage.readJSON(KEYS.settings, null);
    const out = Object.assign({}, DEFAULT_SETTINGS);
    if (!raw) return out;
    if (typeof raw.language === 'string' && VALID_TRANSLATION.indexOf(raw.language) >= 0) out.language = raw.language;
    if (typeof raw.translation === 'string' && VALID_TRANSLATION.indexOf(raw.translation) >= 0) out.translation = raw.translation;
    if (typeof raw.fontSize === 'string' && VALID_FONT.indexOf(raw.fontSize) >= 0) out.fontSize = raw.fontSize;
    if (typeof raw.sound === 'boolean') out.sound = raw.sound;
    if (typeof raw.firstRun === 'boolean') out.firstRun = raw.firstRun;
    return out;
  }

  function saveSettings() {
    settings.language = settings.translation;
    storage.writeJSON(KEYS.settings, {
      language: settings.language,
      translation: settings.translation,
      fontSize: settings.fontSize,
      sound: settings.sound,
      firstRun: settings.firstRun
    });
  }

  function getSettings() {
    return settings;
  }

  function updateSettings(patch) {
    if (!patch || typeof patch !== 'object') return settings;
    if (patch.translation && VALID_TRANSLATION.indexOf(patch.translation) >= 0) {
      settings.translation = patch.translation;
      settings.language = patch.translation;
      s.translation = patch.translation;
      s.language = patch.translation;
    }
    if (patch.fontSize && VALID_FONT.indexOf(patch.fontSize) >= 0) settings.fontSize = patch.fontSize;
    if (typeof patch.sound === 'boolean') settings.sound = patch.sound;
    if (typeof patch.firstRun === 'boolean') settings.firstRun = patch.firstRun;
    saveSettings();
    applySettingsToDom();
    return settings;
  }

  function applySettingsToDom() {
    try {
      document.documentElement.setAttribute('data-fs', settings.fontSize || 'm');
    } catch (err) {
      /* 忽略：极早期调用时 document 可能不可用 */
    }
  }

  /* ------------------------------------------------------------------------
   * 基础访问
   * ---------------------------------------------------------------------- */
  function get() {
    return s;
  }

  function replace(next) {
    s = next || createDefault();
    return s;
  }

  function patch(obj) {
    if (!obj || typeof obj !== 'object') return s;
    Object.keys(obj).forEach(function (k) {
      s[k] = obj[k];
    });
    return s;
  }

  function reset() {
    s = createDefault();
    s.translation = settings.translation;
    s.language = settings.translation;
    return s;
  }

  /* ------------------------------------------------------------------------
   * 证据与里页进度
   * ---------------------------------------------------------------------- */
  function has(id) {
    return s.evidence.indexOf(id) >= 0;
  }

  function addEvidence(id, opts) {
    const options = opts || {};
    const clue = SK.data.clues.get(id);
    if (!id || !SK.data.clues.CLUES[id]) return false;
    if (has(id)) return false;
    s.evidence.push(id);
    if (!options.silent && SK.ui && SK.ui.toast) {
      const name = s.translation === 'ja' ? clue.name : clue.nameZh;
      SK.ui.toast.show(SK.data.ui.toast.evidence.replace('{name}', name), { type: 'ok' });
    }
    return true;
  }

  function baseUnderEvidence() {
    return SK.data.clues.BASE_UNDER_EVIDENCE.filter(function (id) {
      return has(id);
    }).length;
  }

  function residue() {
    return Math.max(0, 10 - baseUnderEvidence());
  }

  function takuyaName() {
    const n = baseUnderEvidence();
    if (n <= 0) return '桜井拓也';
    if (n <= 2) return '桜井拓―';
    if (n <= 4) return '桜井――';
    if (n === 5) return '――――';
    return '名前消去';
  }

  /* ------------------------------------------------------------------------
   * 结局收集
   * ---------------------------------------------------------------------- */
  function readEndings() {
    const raw = storage.readJSON(KEYS.endings, null);
    if (!raw || typeof raw !== 'object' || !raw.unlocked || typeof raw.unlocked !== 'object') {
      return { v: 1, unlocked: {} };
    }
    const out = { v: 1, unlocked: {} };
    SK.data.endings.ENDING_ORDER.forEach(function (key) {
      if (raw.unlocked[key]) out.unlocked[key] = String(raw.unlocked[key]);
    });
    return out;
  }

  function unlockEnding(key) {
    if (SK.data.endings.ENDING_ORDER.indexOf(key) < 0) {
      return { newly: false, count: endingsCount() };
    }
    const data = readEndings();
    const newly = !data.unlocked[key];
    if (newly) {
      data.unlocked[key] = new Date().toISOString();
      storage.writeJSON(KEYS.endings, data);
    }
    return { newly: newly, count: Object.keys(data.unlocked).length };
  }

  function endingsCount() {
    return Object.keys(readEndings().unlocked).length;
  }

  /* ------------------------------------------------------------------------
   * 自动存档
   * ---------------------------------------------------------------------- */
  function snapshot() {
    return {
      v: 1,
      version: SK.VERSION,
      savedAt: new Date().toISOString(),
      started: true,
      page: s.page,
      act: s.act,
      mode: s.mode,
      evidence: s.evidence.slice(),
      nodes: s.nodes.map(function (n) {
        return { uid: n.uid, clueId: n.clueId, x: n.x, y: n.y };
      }),
      history: s.history.slice(-30),
      a1Level: s.a1Level,
      solved: {
        a1code: !!s.solved.a1code,
        a2witness: !!s.solved.a2witness,
        a2proof: !!s.solved.a2proof,
        a2upload: !!s.solved.a2upload,
        a3rhyme: !!s.solved.a3rhyme
      },
      ritualUnlocked: !!s.ritualUnlocked,
      seenUnder: s.seenUnder.slice(),
      readDocs: s.readDocs.slice(),
      selectedDoc: s.selectedDoc,
      language: s.language,
      translation: s.translation
    };
  }

  function save() {
    if (!s.started) return false;
    if (s.screen === 'ending' || s.screen === 'cutscene') return false;
    const data = snapshot();
    return storage.writeJSON(KEYS.save, data);
  }

  function hasSave() {
    const raw = storage.readJSON(KEYS.save, null);
    return !!(raw && raw.started && raw.v === 1 && raw.page);
  }

  function loadSave() {
    return storage.readJSON(KEYS.save, null);
  }

  function applySave(raw) {
    if (!raw || raw.v !== 1) return false;
    const next = createDefault();
    next.started = true;
    next.screen = 'game';
    next.page = typeof raw.page === 'string' ? raw.page : 'a1_home';
    next.act = raw.act === 2 || raw.act === 3 ? raw.act : 1;
    next.mode = raw.mode === 'under' ? 'under' : 'surface';
    next.evidence = Array.isArray(raw.evidence) ? raw.evidence.filter(function (id) {
      return !!SK.data.clues.CLUES[id];
    }) : [];
    next.nodes = Array.isArray(raw.nodes) ? raw.nodes.filter(function (n) {
      return n && typeof n.clueId === 'string' && SK.data.clues.CLUES[n.clueId] &&
        typeof n.x === 'number' && typeof n.y === 'number';
    }).slice(0, 40) : [];
    next.history = Array.isArray(raw.history) ? raw.history.slice(-30) : [];
    next.a1Level = raw.a1Level === 2 ? 2 : raw.a1Level === 1 ? 1 : 0;
    if (raw.solved && typeof raw.solved === 'object') {
      next.solved = {
        a1code: !!raw.solved.a1code,
        a2witness: !!raw.solved.a2witness,
        a2proof: !!raw.solved.a2proof,
        a2upload: !!raw.solved.a2upload,
        a3rhyme: !!raw.solved.a3rhyme
      };
    }
    next.ritualUnlocked = !!raw.ritualUnlocked;
    next.seenUnder = Array.isArray(raw.seenUnder) ? raw.seenUnder.slice(0, 50) : [];
    next.readDocs = Array.isArray(raw.readDocs) ? raw.readDocs.slice(0, 50) : [];
    next.selectedDoc = typeof raw.selectedDoc === 'string' ? raw.selectedDoc : null;
    next.language = VALID_TRANSLATION.indexOf(raw.language) >= 0 ? raw.language : settings.translation;
    next.translation = VALID_TRANSLATION.indexOf(raw.translation) >= 0 ? raw.translation : settings.translation;
    settings.translation = next.translation;
    settings.language = next.translation;
    s = next;
    return true;
  }

  function clearSave() {
    storage.remove(KEYS.save);
    storage.remove(KEYS.endings);
  }

  /* ------------------------------------------------------------------------
   * 语言切换（全局）
   * ---------------------------------------------------------------------- */
  function setTranslation(mode) {
    if (VALID_TRANSLATION.indexOf(mode) < 0) return false;
    s.translation = mode;
    s.language = mode;
    settings.translation = mode;
    settings.language = mode;
    saveSettings();
    save();
    return true;
  }

  function cycleTranslation() {
    const order = ['both', 'zh', 'ja'];
    const idx = order.indexOf(s.translation);
    return setTranslation(order[(idx + 1) % order.length]);
  }

  /* 启动时把当前语言写进状态 */
  function initLanguage() {
    s.translation = settings.translation;
    s.language = settings.translation;
  }

  SK.core.state = {
    /* 读 */
    get: get,
    has: has,
    baseUnderEvidence: baseUnderEvidence,
    residue: residue,
    takuyaName: takuyaName,
    /* 写 */
    replace: replace,
    patch: patch,
    reset: reset,
    setTranslation: setTranslation,
    cycleTranslation: cycleTranslation,
    initLanguage: initLanguage,
    /* 证据 */
    addEvidence: addEvidence,
    /* 存档 */
    save: save,
    hasSave: hasSave,
    loadSave: loadSave,
    applySave: applySave,
    clearSave: clearSave,
    snapshot: snapshot,
    /* 设置 */
    getSettings: getSettings,
    updateSettings: updateSettings,
    applySettingsToDom: applySettingsToDom,
    /* 结局 */
    readEndings: readEndings,
    unlockEnding: unlockEnding,
    endingsCount: endingsCount
  };
})();
