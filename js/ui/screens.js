/* ==========================================================================
 * ui/screens.js — 全屏界面渲染（标题 / 语言 / 启动 / 过场 / 结局）与游戏主界面
 * 所有界面均返回 HTML 字符串，由 core/router.js 统一写入 #app。
 * ========================================================================== */
(function () {
  'use strict';

  function state() {
    return SK.core.state.get();
  }

  function ui() {
    return SK.data.ui;
  }

  /* ------------------------------------------------------------------------
   * 总渲染：基础界面 + 当前弹窗
   * ---------------------------------------------------------------------- */
  function renderAll() {
    const s = state();
    let base;
    if (s.screen === 'lang') {
      base = langScreen();
    } else if (s.screen === 'title') {
      base = titleScreen();
    } else if (s.screen === 'intro') {
      base = introScreen();
    } else if (s.screen === 'cutscene') {
      base = cutsceneScreen();
    } else if (s.screen === 'ending') {
      base = endingScreen();
    } else {
      base = gameScreen();
    }
    const overlay = s.overlay ? SK.ui.overlays.render(s.overlay) : '';
    return base + overlay;
  }

  /* ------------------------------------------------------------------------
   * 标题界面
   * ---------------------------------------------------------------------- */
  function titleScreen() {
    const s = state();
    const u = ui();
    const hasSave = SK.core.state.hasSave();
    const count = SK.core.state.endingsCount();
    const total = SK.data.endings.total;

    return '<div class="screen title-screen">'
      + '<div class="win-window title-window">'
      + '<div class="win-titlebar">'
      + '<span class="wt-title">' + u.title.winTitle + '</span>'
      + '<span class="wt-btns"><span>_</span><span>□</span><span>×</span></span>'
      + '</div>'
      + '<div class="win-body title-body">'
      + '<div class="title-logo"><img src="assets/logo-sakura.svg" alt="旧樱丘高中记录室徽章" width="74" height="74"></div>'
      + '<h1 class="title-main">' + u.product.nameJa + '</h1>'
      + '<p class="title-zh">' + u.product.nameZh + '</p>'
      + '<p class="title-sub">― 桜井花憐失踪事件・三周目 ―</p>'
      + '<div class="title-desc">' + u.product.tagline
      + '<br><span class="tiny">' + u.product.archNote + '　/　' + u.product.genre + '</span></div>'
      + '<div class="title-menu">'
      + '<button class="win-btn primary" data-act="startGame">'
      + u.title.start + '<span class="sub-label">' + u.title.startSub + '</span></button>'
      + '<button class="win-btn" data-act="continueGame"' + (hasSave ? '' : ' disabled') + '>'
      + (hasSave ? u.title.continue : u.title.continue + '（无存档）')
      + '<span class="sub-label">' + u.title.continueSub + '</span></button>'
      + '<button class="win-btn" data-act="openGallery">' + u.title.gallery + '　(' + count + ' / ' + total + ')'
      + '<span class="sub-label">' + u.title.gallerySub + '</span></button>'
      + '<button class="win-btn" data-act="openSettings">' + u.title.settings + '</button>'
      + '<button class="win-btn" data-act="openAbout">' + u.title.about + '</button>'
      + '</div>'
      + '<div class="title-meta">'
      + '<span class="badge-16">' + u.product.age + '</span>'
      + '<span class="badge-offline">离线可玩 · 无内购 · 无广告</span>'
      + '<span class="badge-offline">完全离线 · 无联网</span>'
      + '</div>'
      + '<div class="title-foot">' + u.product.version + ' ・ Build ' + u.product.build + ' ・ ' + u.product.developer + '</div>'
      + '<div class="title-foot">' + u.title.hint + '</div>'
      + '</div>'
      + '</div>'
      + '</div>';
  }

  /* ------------------------------------------------------------------------
   * 首次启动语言选择
   * ---------------------------------------------------------------------- */
  function langScreen() {
    const s = state();
    const u = ui();
    const current = s.tempLang || 'both';
    const options = [
      { key: 'zh', title: u.lang.zhTitle, sub: u.lang.zhSub },
      { key: 'ja', title: u.lang.jaTitle, sub: u.lang.jaSub },
      { key: 'both', title: u.lang.bothTitle, sub: u.lang.bothSub }
    ];
    const optionHtml = options.map(function (opt) {
      const active = current === opt.key;
      return '<button class="lang-option' + (active ? ' active' : '') + '" data-act="chooseLang" data-lang="' + opt.key + '">'
        + '<span class="lo-radio">' + (active ? '●' : '') + '</span>'
        + '<span class="lo-text"><span class="lo-title">' + opt.title + '</span>'
        + '<span class="lo-sub">' + opt.sub + '</span></span>'
        + '</button>';
    }).join('');

    return '<div class="screen screen-scroll lang-screen">'
      + '<div class="win-window lang-window">'
      + '<div class="win-titlebar">'
      + '<span class="wt-title">' + u.lang.winTitle + '</span>'
      + '<span class="wt-btns"><span>_</span><span>□</span><span>×</span></span>'
      + '</div>'
      + '<div class="lang-body">'
      + '<p class="lang-lead">' + u.lang.lead + '</p>'
      + '<div class="lang-options">' + optionHtml + '</div>'
      + '<div class="lang-actions">'
      + '<button class="win-btn primary" data-act="confirmLang">' + u.lang.confirm + '</button>'
      + '</div>'
      + '<p class="lang-note">' + u.lang.note + '</p>'
      + '</div>'
      + '</div>'
      + '</div>';
  }

  /* ------------------------------------------------------------------------
   * 启动画面（拨号终端启动）
   * ---------------------------------------------------------------------- */
  function introScreen() {
    const u = ui();
    const mode = state().translation;
    const jaText = [
      '2024年8月31日。旧桜丘高校は、明日解体される。',
      '',
      '姉・桜井花憐が消えてから、二十二年。',
      '家族は姉を忘れ、写真からも彼女が消えた。',
      '俺だけが、まだ覚えている。',
      '',
      '記録室に残されたファイルが、彼女の最後の足跡だ。',
      '俺は、その記録を開く。',
      '',
      '「今度こそ、姉ちゃんの名前を、記録に残す。」'
    ].join('\n');
    const zhText = [
      '2024 年 8 月 31 日。旧樱丘高中明天就要拆除。',
      '',
      '姐姐·樱井花怜消失之后，已经过去二十二年。',
      '家人忘记了姐姐，连照片里的她也消失了。',
      '只有我还记得。',
      '',
      '档案室里留下的文件，就是她最后的足迹。',
      '我要打开那份记录。',
      '',
      '「这一次，一定要把姐姐的名字，留在记录里。」'
    ].join('\n');

    let bodyText;
    if (mode === 'ja') {
      bodyText = '<div class="intro-ja">' + jaText.replace(/\n/g, '<br>') + '</div>';
    } else if (mode === 'zh') {
      bodyText = '<div>' + zhText.replace(/\n/g, '<br>') + '</div>';
    } else {
      bodyText = '<div>' + jaText.replace(/\n/g, '<br>') + '</div>'
        + '<div class="zh-box"><b>【中文翻译】</b><br>' + zhText.replace(/\n/g, '<br>') + '</div>';
    }

    return '<div class="screen screen-scroll intro-screen">'
      + '<div class="win-window intro-window">'
      + '<div class="win-titlebar">'
      + '<span class="wt-title">' + u.intro.winTitle + '</span>'
      + '<span class="wt-btns"><span>_</span><span>□</span><span>×</span></span>'
      + '</div>'
      + '<div class="intro-body">'
      + '<div class="intro-titles">'
      + '<h1>' + u.intro.titleJa + '</h1>'
      + '<p>' + u.intro.titleZh + '　' + u.intro.subtitle + '</p>'
      + '</div>'
      + '<div class="intro-text">' + bodyText + '</div>'
      + '<div class="intro-actions">'
      + '<span class="intro-progress">' + u.intro.progress + '</span>'
      + '<button class="win-btn primary" data-act="enterArchive">' + u.intro.boot
      + '　<span class="sub-label">' + u.intro.bootZh + '</span></button>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>';
  }

  /* ------------------------------------------------------------------------
   * 过场独白
   * ---------------------------------------------------------------------- */
  function cutsceneScreen() {
    const s = state();
    const c = s.cutscene || { ja: '', zh: '', sub: '' };
    const mode = s.translation;
    let text;
    if (mode === 'ja') {
      text = '<div class="cutscene-text">' + c.ja + '</div>';
    } else if (mode === 'zh') {
      text = '<div class="cutscene-text">' + c.zh + '</div>';
    } else {
      text = '<div class="cutscene-text">' + c.ja + '</div>'
        + '<div class="cutscene-zh">' + c.zh + '</div>';
    }
    return '<div class="screen screen-scroll cutscene-screen">'
      + '<div class="cutscene-inner">'
      + text
      + '<div class="cutscene-sub">' + (c.sub || '') + '</div>'
      + '<div class="cutscene-actions">'
      + '<button class="win-btn primary" data-act="nextCutscene">' + ui().cutscene.next
      + '　<span class="sub-label">' + ui().cutscene.nextZh + '</span></button>'
      + '</div>'
      + '<p class="cutscene-sub">' + ui().cutscene.skipHint + '</p>'
      + '</div>'
      + '</div>';
  }

  /* ------------------------------------------------------------------------
   * 结局画面
   * ---------------------------------------------------------------------- */
  function endingScreen() {
    const s = state();
    const ending = SK.data.endings.get(s.ending);
    const u = ui();
    const mode = s.translation;
    const jaHtml = ending.ja.split('\n').map(function (line) {
      return line ? '<p>' + line + '</p>' : '';
    }).join('');
    const zhHtml = ending.zh.split('\n').map(function (line) {
      return line ? '<p>' + line + '</p>' : '';
    }).join('');

    let text;
    if (mode === 'ja') {
      text = jaHtml;
    } else if (mode === 'zh') {
      text = zhHtml;
    } else {
      text = jaHtml + '<div class="zh-box"><b>【中文翻译】</b><br>' + zhHtml + '</div>';
    }

    const count = SK.core.state.endingsCount();
    return '<div class="screen screen-scroll ending-screen">'
      + '<div class="ending-inner">'
      + '<div class="ending-kicker">' + u.ending.kicker + '　/　' + ending.no + '</div>'
      + '<h1>' + ending.title + '</h1>'
      + '<div class="ending-zh-title">' + ending.titleZh + '</div>'
      + '<div class="ending-text">' + text + '</div>'
      + '<div class="ending-finally">' + u.ending.finalLine
      + '<div class="ending-unlock">✦ 结局已收录：' + ending.titleZh + '（' + count + ' / ' + SK.data.endings.total + '）</div>'
      + '<div class="tiny">' + u.ending.recordHint + '</div></div>'
      + '<div class="ending-actions">'
      + '<button class="win-btn" data-act="openGallery">' + u.ending.actions.gallery + '</button>'
      + '<button class="win-btn" data-act="restartGame">' + u.ending.actions.restart + '</button>'
      + '<button class="win-btn primary" data-act="backToTitle">' + u.ending.actions.title + '</button>'
      + '</div>'
      + '</div>'
      + '</div>';
  }

  /* ------------------------------------------------------------------------
   * 游戏主界面（浏览器窗口 + 当前页面）
   * ---------------------------------------------------------------------- */
  function gameScreen() {
    const s = state();
    const content = SK.core.router.pageContent();
    let title = '旧桜丘高等学校 - Microsoft Internet Explorer';
    if (s.page === 'board') {
      title = '推理ボード - Microsoft Internet Explorer';
    } else if (s.page.indexOf('a2_') === 0) {
      title = '校報編集室 - Microsoft Internet Explorer';
    } else if (s.page.indexOf('a3_') === 0) {
      title = (s.mode === 'under' ? '100%正直なサイト' : '旧桜丘高等学校') + ' - Microsoft Internet Explorer';
    }
    return SK.ui.shell.browserFrame(content, {
      act: s.act || 1,
      title: title,
      page: s.page
    });
  }

  /* 推理板（供 router.pageContent 调用） */
  function boardPage() {
    return SK.ui.shell.boardPage();
  }

  SK.ui.screens = {
    renderAll: renderAll,
    titleScreen: titleScreen,
    langScreen: langScreen,
    introScreen: introScreen,
    cutsceneScreen: cutsceneScreen,
    endingScreen: endingScreen,
    gameScreen: gameScreen,
    boardPage: boardPage
  };
})();
