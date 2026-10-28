/* ==========================================================================
 * core/taptap.js — 可选 TapTap 登录（游客模式优先，绝不阻塞游戏启动）
 *
 * 设计原则（按 Lead 的 TapTap 审核风险要求）：
 *   1. 只在 window.tap 且 window.tap.login 为函数时启用登录入口；
 *   2. 启动时只做「能力检测」，绝不主动调用 tap.*，不请求任何权限；
 *   3. 所有 tap.* 调用均 try/catch + typeof 检查；file://、普通浏览器、
 *      TapTap 环境缺少 API 时都只显示游客模式，不产生 console error；
 *   4. 登录失败 / 取消 → toast「当前为游客模式，不影响游玩」，游戏照常进行；
 *   5. 登录信息仅存本机 localStorage（sakuraoka.account.v1），不上传。
 * ========================================================================== */
(function () {
  'use strict';

  const storage = SK.core.storage;
  const ACCOUNT_KEY = 'sakuraoka.account.v1';

  let loginInFlight = false;

  /* 只在能力存在时返回 SDK 引用；任何异常都视为不可用 */
  function sdk() {
    try {
      if (typeof window === 'undefined') return null;
      const tap = window.tap;
      if (!tap) return null;
      if (typeof tap.login !== 'function') return null;
      return tap;
    } catch (err) {
      return null;
    }
  }

  function isAvailable() {
    return !!sdk();
  }

  /* 本机保存的账号（不联网、不上传） */
  function getAccount() {
    const raw = storage.readJSON(ACCOUNT_KEY, null);
    if (!raw || typeof raw !== 'object') return { nickname: '', loggedInAt: '' };
    return {
      nickname: typeof raw.nickname === 'string' ? raw.nickname.slice(0, 40) : '',
      loggedInAt: typeof raw.loggedInAt === 'string' ? raw.loggedInAt : ''
    };
  }

  function isLoggedIn() {
    return !!getAccount().nickname;
  }

  function saveAccount(nickname) {
    try {
      storage.writeJSON(ACCOUNT_KEY, {
        nickname: String(nickname || '').slice(0, 40),
        loggedInAt: new Date().toISOString()
      });
    } catch (err) {
      /* 忽略：存档失败不影响游戏 */
    }
  }

  function clearAccount() {
    try {
      storage.remove(ACCOUNT_KEY);
    } catch (err) {
      /* 忽略 */
    }
  }

  /* 从各种可能的返回值里提取昵称 */
  function extractNickname(res) {
    try {
      if (!res || typeof res !== 'object') return '';
      const user = res.userInfo || res.user || res.data || {};
      const nickname = user.nickname || user.name || res.nickname || res.name || '';
      if (typeof nickname === 'string') return nickname.trim().slice(0, 40);
      return '';
    } catch (err) {
      return '';
    }
  }

  function toast(message, type) {
    try {
      if (SK.ui && SK.ui.toast) SK.ui.toast.show(message, type ? { type: type } : undefined);
    } catch (err) {
      /* 忽略 */
    }
  }

  function rerender() {
    try {
      if (SK.core.router) SK.core.router.render({ keepScroll: true });
    } catch (err) {
      /* 忽略 */
    }
  }

  /* ------------------------------------------------------------------------
   * 登录：只有玩家主动点击按钮才会调用
   * 兼容两种 SDK 形态：Promise 返回 / {success, fail} 回调
   * ---------------------------------------------------------------------- */
  function login() {
    const tap = sdk();
    if (!tap) {
      toast(SK.data.ui.toast.tapUnavailable);
      return Promise.resolve({ ok: false, reason: 'unavailable' });
    }
    if (loginInFlight) {
      return Promise.resolve({ ok: false, reason: 'pending' });
    }
    loginInFlight = true;

    return new Promise(function (resolve) {
      let settled = false;
      let timer = null;

      function finish(result) {
        if (settled) return;
        settled = true;
        loginInFlight = false;
        if (timer) window.clearTimeout(timer);
        resolve(result);
      }

      function onSuccess(res) {
        const nickname = extractNickname(res);
        if (nickname) {
          saveAccount(nickname);
          toast(SK.data.ui.toast.tapLoginOk.replace('{name}', nickname), 'ok');
          rerender();
          finish({ ok: true, nickname: nickname });
        } else {
          toast(SK.data.ui.toast.tapLoginFail, 'error');
          finish({ ok: false, reason: 'no-user-info' });
        }
      }

      function onFail(err) {
        toast(SK.data.ui.toast.tapLoginFail, 'error');
        finish({ ok: false, reason: 'cancelled', error: String(err && (err.errMsg || err.message || err)) });
      }

      try {
        const ret = tap.login({
          scope: 'basic',
          success: onSuccess,
          fail: onFail
        });
        if (ret && typeof ret.then === 'function') {
          ret.then(onSuccess).catch(onFail);
        }
        /* 兜底：某些宿主既不 resolve 也不回调，避免 Promise 永远悬挂 */
        timer = window.setTimeout(function () {
          if (settled) return;
          toast(SK.data.ui.toast.tapLoginFail, 'error');
          finish({ ok: false, reason: 'timeout' });
        }, 20000);
      } catch (err) {
        onFail(err);
      }
    });
  }

  function logout() {
    clearAccount();
    toast(SK.data.ui.toast.tapLogout);
    rerender();
  }

  SK.core.taptap = {
    ACCOUNT_KEY: ACCOUNT_KEY,
    isAvailable: isAvailable,
    isLoggedIn: isLoggedIn,
    getAccount: getAccount,
    extractNickname: extractNickname,
    login: login,
    logout: logout
  };
})();
