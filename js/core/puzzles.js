/* ==========================================================================
 * core/puzzles.js — 全部谜题判定与剧情推进动作
 * 谜题答案沿用原版：
 *   学生登录 s031 / karen031　教师登录 katsuragi / sakura2002
 *   第一幕封印 0413　第二幕上传 fujimiya0312　仪式暗号 03120412
 *   童谣「四度」
 * 修复点：原版 pageA2Terminal / canTruth 重复定义、上传后过场缺少后续等。
 * ========================================================================== */
(function () {
  'use strict';

  const state = SK.core.state;
  const audio = SK.core.audio;

  function st() {
    return state.get();
  }

  /* 直接更新字段错误提示，不整页重绘（保留用户输入） */
  function setFieldError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message || '';
  }

  function shakeInput(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('under-flash');
    /* 触发一次重排以重启动画 */
    void el.offsetWidth;
    el.classList.add('under-flash');
  }

  /* ------------------------------------------------------------------------
   * 结局条件
   * ---------------------------------------------------------------------- */
  function canPolice() {
    return state.has('e_final') && state.has('e_katsuragi');
  }

  function canCurse() {
    return state.has('e_ritual') && state.has('e_killer');
  }

  function canTruth() {
    return state.has('e_final') && state.has('e_ritual') && state.has('e_rhyme') &&
      state.baseUnderEvidence() >= 6;
  }

  function endingAvailable(key) {
    if (key === 'police') return canPolice();
    if (key === 'curse') return canCurse();
    if (key === 'truth') return canTruth();
    if (key === 'nothing') return true;
    return false;
  }

  /* ------------------------------------------------------------------------
   * 第一幕：登录 / 登出 / 文档 / 封印文件
   * ---------------------------------------------------------------------- */
  function loginStudent() {
    const idEl = document.getElementById('loginSId');
    const pwEl = document.getElementById('loginSPw');
    const id = idEl ? idEl.value.trim() : '';
    const pw = pwEl ? pwEl.value.trim() : '';
    const account = SK.data.clues.ACCOUNTS.student;
    if (id === account.id && pw === account.password) {
      state.patch({
        a1Level: 1,
        loginError: '',
        page: 'a1_archive',
        act: 1,
        mode: 'surface',
        selectedDoc: null,
        screen: 'game'
      });
      audio.success();
      SK.ui.toast.show(SK.data.ui.toast.loginStudent, { type: 'ok' });
      SK.core.router.render();
      return true;
    }
    state.patch({ loginError: 'IDまたはパスワードが違います。' });
    setFieldError('loginError', 'ID 或密码错误。请根据「図書委員会」与「情報システム管理規程」的规则重新输入。');
    shakeInput('loginSPw');
    audio.error();
    return false;
  }

  function loginTeacher() {
    const idEl = document.getElementById('loginTId');
    const pwEl = document.getElementById('loginTPw');
    const id = idEl ? idEl.value.trim() : '';
    const pw = pwEl ? pwEl.value.trim() : '';
    if (!state.has('c_erased')) {
      setFieldError('loginError', SK.data.ui.toast.teacherLocked);
      audio.error();
      return false;
    }
    const account = SK.data.clues.ACCOUNTS.teacher;
    if (id === account.id && pw === account.password) {
      state.patch({
        a1Level: 2,
        loginError: '',
        page: 'a1_archive',
        act: 1,
        mode: 'surface',
        selectedDoc: null,
        screen: 'game'
      });
      audio.success();
      SK.ui.toast.show(SK.data.ui.toast.loginTeacher, { type: 'ok' });
      SK.core.router.render();
      return true;
    }
    state.patch({ loginError: 'IDまたはパスワードが違います。' });
    setFieldError('loginError', 'ID 或密码错误。提示：教师 ID 是姓氏罗马字，密码是校花罗马字＋就任年份。');
    shakeInput('loginTPw');
    audio.error();
    return false;
  }

  function logoutA1() {
    state.patch({
      a1Level: 0,
      selectedDoc: null,
      loginError: '',
      page: 'a1_records',
      act: 1,
      mode: 'surface'
    });
    SK.ui.toast.show(SK.data.ui.toast.logout);
    SK.core.router.render();
  }

  function openA1Doc(id) {
    const doc = SK.data.documents.get(id);
    if (!doc) return;
    if (st().a1Level < doc.level) {
      SK.ui.toast.show(SK.data.ui.toast.noPrivilege, { type: 'error' });
      audio.error();
      return;
    }
    state.patch({ selectedDoc: id });
    if (doc.clue) {
      const added = state.addEvidence(doc.clue);
      if (added) audio.evidence();
    }
    if (st().readDocs.indexOf(id) < 0) {
      st().readDocs.push(id);
    }
    audio.flip();
    SK.core.router.render({ keepScroll: true });
  }

  function unlockA1() {
    const el = document.getElementById('a1Code');
    const value = el ? el.value.trim() : '';
    if (value === SK.data.clues.ANSWERS.a1Lock) {
      state.patch({ solved: Object.assign({}, st().solved, { a1code: true }), a1LockError: '' });
      audio.unlock();
      audio.success();
      SK.ui.toast.show(SK.data.ui.toast.a1Unlocked, { type: 'ok' });
      SK.core.router.render();
      return true;
    }
    state.patch({ a1LockError: '暗証番号が違います。' });
    setFieldError('a1LockError', '暗号不正确。提示：查看「鍵管理簿 旧図書室」中内锁更换的日期（4 位）。');
    shakeInput('a1Code');
    audio.error();
    return false;
  }

  /* ------------------------------------------------------------------------
   * 第二幕：终端谜题 / 上传
   * ---------------------------------------------------------------------- */
  function answerA2(idx) {
    if (Number(idx) === 0) {
      state.patch({ solved: Object.assign({}, st().solved, { a2witness: true }), a2Error: '' });
      audio.success();
      SK.ui.toast.show(SK.data.ui.toast.a2WitnessOk, { type: 'ok' });
      SK.core.router.render({ keepScroll: true });
      return true;
    }
    audio.error();
    SK.ui.toast.show(SK.data.ui.toast.a2Wrong, { type: 'error' });
    return false;
  }

  function answerA2Proof(idx) {
    if (Number(idx) === 1) {
      state.patch({ solved: Object.assign({}, st().solved, { a2proof: true }), a2Error: '' });
      audio.success();
      SK.ui.toast.show(SK.data.ui.toast.a2ProofOk, { type: 'ok' });
      SK.core.router.render({ keepScroll: true });
      return true;
    }
    audio.error();
    SK.ui.toast.show(SK.data.ui.toast.a2ProofWrong, { type: 'error' });
    return false;
  }

  function uploadA2() {
    const el = document.getElementById('a2Pass');
    const value = el ? el.value.trim().toLowerCase() : '';
    if (value === SK.data.clues.ANSWERS.a2Upload) {
      state.patch({
        solved: Object.assign({}, st().solved, { a2upload: true }),
        a2Error: '',
        screen: 'cutscene',
        cutscene: {
          ja: 'UPLOAD COMPLETE.\n\n第12号のデータは、校内サーバに保存された。\nしかし、詩織は旧図書室から戻らなかった。\n\n画面が赤く滲む。\n気がつくと、私は2024年の記録室にいた。',
          zh: '上传完成。\n\n第12号的数据保存到了校内服务器。\n但诗织没有从旧图书室回来。\n\n画面渗出红色。\n回过神来，我已经在2024年的档案室。',
          sub: 'CONNECTION LOST / 1989 → 2024',
          next: 'act3'
        }
      });
      audio.success();
      SK.core.router.render();
      return true;
    }
    state.patch({ a2Error: 'パスワードが違います。' });
    setFieldError('a2Error', '密码错误。提示：诗织的姓氏罗马字＋事故日期（月日 4 位）。');
    shakeInput('a2Pass');
    audio.error();
    return false;
  }

  function startAct2() {
    const ok = state.has('c_conspiracy') && st().solved.a1code;
    if (!ok) {
      SK.ui.toast.show(SK.data.ui.toast.jumpBlocked, { type: 'error' });
      return;
    }
    state.patch({
      screen: 'cutscene',
      cutscene: {
        ja: '画面が白く飛んだ。\n\n気がつくと、そこは1989年3月10日の校報編集室だった。\n\n私は、藤宮詩織。\nあと二日で、私は死ぬ。',
        zh: '画面一片空白。\n\n回过神来，这里已经是1989年3月10日的校报编辑室。\n\n我是藤宫诗织。\n还有两天，我就会死。',
        sub: 'MEMORY TRACE / 2024 → 1989',
        next: 'act2'
      }
    });
    audio.static();
    SK.core.router.render();
  }

  /* ------------------------------------------------------------------------
   * 过场推进
   * ---------------------------------------------------------------------- */
  function nextCutscene() {
    const current = st().cutscene;
    const next = current && current.next;
    state.patch({ cutscene: null, screen: 'game' });
    if (next === 'act2') {
      state.patch({ act: 2, page: 'a2_editor', mode: 'surface', overlay: null });
    } else if (next === 'act3') {
      state.patch({ act: 3, page: 'a3_home', mode: 'surface', overlay: null });
      audio.static();
    }
    audio.page();
    SK.core.router.render();
  }

  function startAct3() {
    state.patch({ act: 3, page: 'a3_home', mode: 'surface', screen: 'game' });
    audio.static();
    SK.core.router.render();
  }

  /* ------------------------------------------------------------------------
   * 第三幕：童谣 / 仪式 / 结局
   * ---------------------------------------------------------------------- */
  function unlockRitual() {
    const el = document.getElementById('ritualCode');
    const value = el ? el.value.trim() : '';
    if (value === SK.data.clues.ANSWERS.ritual) {
      state.patch({ ritualUnlocked: true, ritualError: '', mode: 'under', act: 3 });
      state.addEvidence('e_ritual');
      audio.static();
      audio.success();
      SK.ui.toast.show(SK.data.ui.toast.ritualUnlocked, { type: 'ok' });
      SK.core.router.render();
      return true;
    }
    state.patch({ ritualError: '暗証番号が違います。' });
    setFieldError('ritualError', '暗号不正确。提示：两人死亡月日按时间顺序排列，各取 4 位，共 8 位。');
    shakeInput('ritualCode');
    audio.error();
    return false;
  }

  function answerRhyme(idx) {
    if (Number(idx) === SK.data.clues.ANSWERS.rhymeIndex) {
      state.patch({ solved: Object.assign({}, st().solved, { a3rhyme: true }) });
      state.addEvidence('e_rhyme');
      audio.success();
      SK.ui.toast.show(SK.data.ui.toast.rhymeOk, { type: 'ok' });
      SK.core.router.render({ keepScroll: true });
      return true;
    }
    audio.error();
    SK.ui.toast.show(SK.data.ui.toast.rhymeWrong, { type: 'error' });
    return false;
  }

  function chooseEnding(key) {
    if (!endingAvailable(key)) {
      audio.error();
      SK.ui.toast.show(SK.data.ui.toast.needMore, { type: 'error' });
      return false;
    }
    const result = state.unlockEnding(key);
    state.patch({
      ending: key,
      screen: 'ending',
      overlay: null,
      overlayReturn: null,
      cutscene: null
    });
    audio.static();
    if (result.newly) {
      setTimeout(function () {
        audio.success();
      }, 250);
    }
    SK.core.router.render();
    return true;
  }

  /* ------------------------------------------------------------------------
   * 返回标题 / 重新开始
   * ---------------------------------------------------------------------- */
  function goTitle() {
    state.save();
    state.patch({ screen: 'title', overlay: null, overlayReturn: null, cutscene: null, ending: null });
    SK.core.router.render();
  }

  function restartGame() {
    SK.core.router.startNew();
  }

  SK.core.puzzles = {
    canPolice: canPolice,
    canCurse: canCurse,
    canTruth: canTruth,
    endingAvailable: endingAvailable,
    loginStudent: loginStudent,
    loginTeacher: loginTeacher,
    logoutA1: logoutA1,
    openA1Doc: openA1Doc,
    unlockA1: unlockA1,
    answerA2: answerA2,
    answerA2Proof: answerA2Proof,
    uploadA2: uploadA2,
    startAct2: startAct2,
    startAct3: startAct3,
    nextCutscene: nextCutscene,
    unlockRitual: unlockRitual,
    answerRhyme: answerRhyme,
    chooseEnding: chooseEnding,
    goTitle: goTitle,
    restartGame: restartGame
  };
})();
