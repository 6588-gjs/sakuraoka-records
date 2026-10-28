/* ==========================================================================
 * ui/overlays.js — 系统弹窗（菜单 / 设置 / 提示 / 结局鉴赏 / 关于 / 隐私 / 清档确认）
 * 弹窗状态保存在 state.overlay，关闭时可能返回上一级（settings → privacy）。
 * ========================================================================== */
(function () {
  'use strict';

  function state() {
    return SK.core.state.get();
  }

  function ui() {
    return SK.data.ui;
  }

  function dialogHead(title) {
    return '<div class="dialog-head">'
      + '<span class="dh-title">' + title + '</span>'
      + '<button class="dialog-close" data-act="closeOverlay" aria-label="关闭弹窗">×</button>'
      + '</div>';
  }

  function dialogFoot(buttons) {
    return '<div class="dialog-foot">' + buttons + '</div>';
  }

  function wrap(kind, dialogHtml, extraClass) {
    return '<div class="overlay" data-overlay="' + kind + '">'
      + '<div class="dialog' + (extraClass ? ' ' + extraClass : '') + '" role="dialog" aria-modal="true">'
      + dialogHtml
      + '</div>'
      + '</div>';
  }

  /* 极简 HTML 转义：外部 SDK 返回的昵称不可信 */
  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ------------------------------------------------------------------------
   * TapTap 账号（可选）：只有检测到 window.tap.login 时才渲染登录入口
   * ---------------------------------------------------------------------- */
  function tapAvailable() {
    try {
      return !!(SK.core.taptap && SK.core.taptap.isAvailable());
    } catch (err) {
      return false;
    }
  }

  function tapAccountSafe() {
    try {
      return SK.core.taptap.getAccount();
    } catch (err) {
      return { nickname: '', loggedInAt: '' };
    }
  }

  function tapSettingsRow() {
    if (!tapAvailable()) return '';
    const u = ui();
    const account = tapAccountSafe();
    const logged = !!account.nickname;
    return '<div class="set-row"><div class="set-label">' + u.settings.tapTitle
      + '<small>' + u.settings.tapSub + '</small></div>'
      + '<div class="seg">'
      + (logged
        ? '<span class="tap-status">' + u.settings.tapLoggedIn + '：' + escapeHtml(account.nickname) + '</span>'
          + '<button class="win-btn" data-act="tapLogout">' + u.settings.tapLogout + '</button>'
        : '<button class="win-btn" data-act="tapLogin">' + u.settings.tapLogin + '</button>')
      + '</div></div>';
  }

  function tapAboutBlock() {
    const u = ui();
    if (!tapAvailable()) {
      return '<h3>' + u.about.tapTitle + '</h3><p>' + u.about.tapGuestNote + '</p>';
    }
    const account = tapAccountSafe();
    const logged = !!account.nickname;
    return '<h3>' + u.about.tapTitle + '</h3>'
      + '<p>' + u.about.tapBody + '</p>'
      + '<p class="row">'
      + (logged
        ? '<span class="tap-status">' + u.about.tapLoggedAs + escapeHtml(account.nickname) + '</span>'
          + '<button class="win-btn" data-act="tapLogout">' + u.about.tapLogout + '</button>'
        : '<button class="win-btn" data-act="tapLogin">' + u.about.tapLogin + '</button>')
      + '</p>';
  }

  /* ------------------------------------------------------------------------
   * 系统菜单
   * ---------------------------------------------------------------------- */
  function menuOverlay() {
    const u = ui();
    const hasSave = SK.core.state.hasSave();
    const inGame = state().screen === 'game' || state().screen === 'ending';
    const items = [];
    if (inGame) {
      items.push('<button class="win-btn" data-act="goBoard"><span class="mi-glyph">▤</span>'
        + '<span class="mi-text">' + u.menu.board + '<span class="sub-label">' + u.menu.boardSub + '</span></span></button>');
      items.push('<button class="win-btn" data-act="openHint"><span class="mi-glyph">?</span>'
        + '<span class="mi-text">' + u.menu.hint + '<span class="sub-label">' + u.menu.hintSub + '</span></span></button>');
    }
    items.push('<button class="win-btn" data-act="openGallery"><span class="mi-glyph">✦</span>'
      + '<span class="mi-text">' + u.menu.gallery + '<span class="sub-label">' + u.menu.gallerySub
      + '（' + SK.core.state.endingsCount() + ' / ' + SK.data.endings.total + '）</span></span></button>');
    items.push('<button class="win-btn" data-act="openSettings"><span class="mi-glyph">⚙</span>'
      + '<span class="mi-text">' + u.menu.settings + '<span class="sub-label">' + u.menu.settingsSub + '</span></span></button>');
    items.push('<button class="win-btn" data-act="openAbout"><span class="mi-glyph">i</span>'
      + '<span class="mi-text">' + u.menu.about + '<span class="sub-label">' + u.menu.aboutSub + '</span></span></button>');
    items.push('<button class="win-btn" data-act="openPrivacy"><span class="mi-glyph">🔒</span>'
      + '<span class="mi-text">' + u.menu.privacy + '<span class="sub-label">' + u.menu.privacySub + '</span></span></button>');
    if (inGame) {
      items.push('<button class="win-btn" data-act="backToTitle"><span class="mi-glyph">⌂</span>'
        + '<span class="mi-text">' + u.menu.titleScreen + '</span></button>');
    }

    const saveInfo = '<div class="menu-save"><b>' + u.menu.saveInfo + '：</b>'
      + (hasSave ? u.menu.saveExists : u.menu.saveNone)
      + '<br>' + u.menu.saveNote + '</div>';

    const html = dialogHead(u.menu.title)
      + '<div class="dialog-body">'
      + '<div class="menu-list">' + items.join('') + '</div>'
      + saveInfo
      + '</div>'
      + dialogFoot('<button class="win-btn" data-act="closeOverlay">' + u.menu.close + '</button>');

    return wrap('menu', html);
  }

  /* ------------------------------------------------------------------------
   * 设置
   * ---------------------------------------------------------------------- */
  function settingsOverlay() {
    const u = ui();
    const settings = state();
    const cfg = SK.core.state.getSettings();
    const langOpts = [
      { key: 'zh', label: u.settings.langZh },
      { key: 'ja', label: u.settings.langJa },
      { key: 'both', label: u.settings.langBoth }
    ];
    const fontOpts = [
      { key: 's', label: u.settings.fsSmall },
      { key: 'm', label: u.settings.fsMedium },
      { key: 'l', label: u.settings.fsLarge }
    ];

    function segHtml(options, activeKey, act, dataKey) {
      return options.map(function (opt) {
        return '<button class="win-btn' + (opt.key === activeKey ? ' active' : '') + '"'
          + ' data-act="' + act + '" data-' + dataKey + '="' + opt.key + '">' + opt.label + '</button>';
      }).join('');
    }

    const html = dialogHead(u.settings.title)
      + '<div class="dialog-body">'
      + '<div class="set-row"><div class="set-label">' + u.settings.language
      + '<small>' + u.settings.languageSub + '</small></div>'
      + '<div class="seg">' + segHtml(langOpts, cfg.translation, 'setLang', 'lang') + '</div></div>'
      + '<div class="set-row"><div class="set-label">' + u.settings.fontSize
      + '<small>' + u.settings.fontSizeSub + '</small></div>'
      + '<div class="seg">' + segHtml(fontOpts, cfg.fontSize, 'setFont', 'size') + '</div></div>'
      + '<div class="set-row"><div class="set-label">' + u.settings.sound
      + '<small>' + u.settings.soundSub + '</small></div>'
      + '<div class="seg">'
      + '<button class="win-btn' + (cfg.sound ? ' active' : '') + '" data-act="setSound" data-on="1">' + u.settings.soundOn + '</button>'
      + '<button class="win-btn' + (!cfg.sound ? ' active' : '') + '" data-act="setSound" data-on="0">' + u.settings.soundOff + '</button>'
      + '</div></div>'
      + tapSettingsRow()
      + '<div class="set-row"><div class="set-label">' + u.settings.privacy + '<small>' + u.settings.privacySub + '</small></div>'
      + '<div class="seg"><button class="win-btn" data-act="openPrivacy" data-from="settings">' + u.settings.privacy + '</button></div></div>'
      + '<div class="set-actions">'
      + '<button class="win-btn set-danger" data-act="openClearConfirm">' + u.settings.clear + '</button>'
      + '</div>'
      + '<small class="tiny">' + u.settings.clearSub + '</small>'
      + '<div class="set-version">' + u.settings.versionText.replace(/\n/g, '<br>') + '</div>'
      + '</div>'
      + dialogFoot('<button class="win-btn primary" data-act="closeOverlay">' + u.settings.close + '</button>');

    return wrap('settings', html);
  }

  /* ------------------------------------------------------------------------
   * 提示
   * ---------------------------------------------------------------------- */
  function hintOverlay() {
    const u = ui();
    const hint = SK.data.hints.build();
    const steps = hint.steps.map(function (step) {
      return '<li>' + step + '</li>';
    }).join('');
    const html = dialogHead(u.hint.title)
      + '<div class="dialog-body">'
      + '<span class="hint-act">' + hint.act + '</span>'
      + '<div class="hint-goal"><b>' + u.hint.goalLabel + '：</b>' + hint.goal + '</div>'
      + '<div class="dlg-section-title">' + u.hint.stepsLabel + '</div>'
      + '<ol class="hint-steps">' + steps + '</ol>'
      + '<details class="hint-spoiler"><summary>' + u.hint.spoiler + '</summary>' + hint.spoiler + '</details>'
      + '<p class="hint-foot">' + u.hint.foot + '</p>'
      + '</div>'
      + dialogFoot('<button class="win-btn primary" data-act="closeOverlay">' + u.hint.close + '</button>');

    return wrap('hint', html);
  }

  /* ------------------------------------------------------------------------
   * 结局鉴赏
   * ---------------------------------------------------------------------- */
  function galleryOverlay() {
    const u = ui();
    const data = SK.core.state.readEndings();
    const count = Object.keys(data.unlocked).length;
    const cards = SK.data.endings.ENDING_ORDER.map(function (key) {
      const ending = SK.data.endings.get(key);
      const unlocked = !!data.unlocked[key];
      if (!unlocked) {
        return '<div class="gallery-card locked">'
          + '<div class="gc-no">ENDING ' + ending.no + '</div>'
          + '<div class="gc-title">' + u.gallery.lockedTitle + '</div>'
          + '<div class="gc-desc">' + u.gallery.lockedDesc + '</div>'
          + '<span class="gc-badge">' + u.gallery.lockedBadge + '</span>'
          + '</div>';
      }
      return '<div class="gallery-card unlocked">'
        + '<div class="gc-no">ENDING ' + ending.no + '</div>'
        + '<div class="gc-title">' + ending.titleZh + '</div>'
        + '<div class="gc-sub">' + ending.title + '</div>'
        + '<div class="gc-desc">' + ending.galleryDesc + '</div>'
        + '<div class="gc-desc">' + u.gallery.condition + '：' + ending.condition + '</div>'
        + '<span class="gc-badge">' + u.gallery.unlockedBadge + '</span>'
        + '</div>';
    }).join('');

    const html = dialogHead(u.gallery.title)
      + '<div class="dialog-body">'
      + '<div class="gallery-summary">' + u.gallery.count + '：' + count + ' / ' + SK.data.endings.total + '</div>'
      + '<div class="gallery-grid">' + cards + '</div>'
      + '<p class="dlg-hint">' + u.gallery.tip + '</p>'
      + '</div>'
      + dialogFoot('<button class="win-btn primary" data-act="closeOverlay">' + u.gallery.close + '</button>');

    return wrap('gallery', html, 'wide');
  }

  /* ------------------------------------------------------------------------
   * 关于
   * ---------------------------------------------------------------------- */
  function aboutOverlay() {
    const u = ui();
    const p = u.product;
    const a = u.about;
    const html = dialogHead(a.title)
      + '<div class="dialog-body doc-prose">'
      + '<div class="about-logo"><img src="assets/logo-sakura.svg" alt="徽章">'
      + '<div class="about-name"><b>' + p.nameZh + '</b>'
      + '<span>' + p.nameJa + '</span>'
      + '<span>' + p.nameEn + '</span>'
      + '<span>' + p.version + ' / ' + p.packageName + '</span></div></div>'
      + '<h3>' + a.overviewTitle + '</h3>'
      + '<p>' + a.overview + '</p>'
      + '<h3>' + a.typeTitle + '</h3>'
      + '<p>' + a.typeLine + '<br>' + a.ageLine + '<br>' + a.platformLine + '<br>' + a.offlineLine + '<br>' + a.versionLine + '</p>'
      + '<h3>' + a.controlTitle + '</h3>'
      + '<p>' + a.control + '</p>'
      + '<h3>' + a.saveTitle + '</h3>'
      + '<p>' + a.save + '</p>'
      + tapAboutBlock()
      + '<h3>' + a.legalTitle + '</h3>'
      + '<p>' + a.legal + '</p>'
      + '<p class="tiny">' + p.copyright + '</p>'
      + '</div>'
      + dialogFoot('<button class="win-btn primary" data-act="closeOverlay">' + a.close + '</button>');

    return wrap('about', html);
  }

  /* ------------------------------------------------------------------------
   * 隐私说明
   * ---------------------------------------------------------------------- */
  function privacyOverlay() {
    const u = ui();
    const items = u.privacy.items.map(function (text) {
      return '<li>' + text + '</li>';
    }).join('');
    const html = dialogHead(u.privacy.title)
      + '<div class="dialog-body doc-prose">'
      + '<p>' + u.privacy.intro + '</p>'
      + '<ul>' + items + '</ul>'
      + '</div>'
      + dialogFoot('<button class="win-btn primary" data-act="closeOverlay">' + u.privacy.close + '</button>');

    return wrap('privacy', html);
  }

  /* ------------------------------------------------------------------------
   * 清除存档二次确认
   * ---------------------------------------------------------------------- */
  function clearConfirmOverlay() {
    const u = ui();
    const html = dialogHead(u.clearConfirm.title)
      + '<div class="dialog-body">'
      + '<div class="confirm-text">' + u.clearConfirm.body + '<br><br>' + u.clearConfirm.body2 + '</div>'
      + '</div>'
      + dialogFoot(
        '<button class="win-btn" data-act="closeOverlay">' + u.clearConfirm.cancel + '</button>'
        + '<button class="win-btn set-danger" data-act="clearSave">' + u.clearConfirm.confirm + '</button>'
      );

    return wrap('clearConfirm', html);
  }

  /* ------------------------------------------------------------------------
   * 新游戏覆盖确认
   * ---------------------------------------------------------------------- */
  function newGameConfirmOverlay() {
    const u = ui();
    const html = dialogHead('开始新游戏 ― 确认')
      + '<div class="dialog-body">'
      + '<div class="confirm-text">' + u.title.newGameConfirm + '</div>'
      + '</div>'
      + dialogFoot(
        '<button class="win-btn" data-act="closeOverlay">' + u.clearConfirm.cancel + '</button>'
        + '<button class="win-btn primary" data-act="confirmNewGame">开始新游戏</button>'
      );
    return wrap('newGameConfirm', html);
  }

  /* ------------------------------------------------------------------------
   * 路由
   * ---------------------------------------------------------------------- */
  function render(kind) {
    switch (kind) {
      case 'menu':
        return menuOverlay();
      case 'settings':
        return settingsOverlay();
      case 'hint':
        return hintOverlay();
      case 'gallery':
        return galleryOverlay();
      case 'about':
        return aboutOverlay();
      case 'privacy':
        return privacyOverlay();
      case 'clearConfirm':
        return clearConfirmOverlay();
      case 'newGameConfirm':
        return newGameConfirmOverlay();
      default:
        return '';
    }
  }

  SK.ui.overlays = {
    render: render
  };
})();
