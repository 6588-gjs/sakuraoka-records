/* ==========================================================================
 * ui/shell.js — 站点外壳与浏览器窗口外壳（纯字符串渲染）
 * - bi()：三档翻译模式（ja / zh / both）
 * - siteShell1 / siteShell2 / siteShell3：三幕站点外壳
 * - browserFrame()：IE6 浏览器窗口（手机压缩为 2 行）
 * - clueCardHtml() / boardPage()：推理板界面
 * 只负责生成 HTML 字符串，不直接操作 DOM。
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
   * 三档翻译
   * ---------------------------------------------------------------------- */
  function bi(ja, zh) {
    const mode = state().translation;
    if (mode === 'ja') return ja;
    if (mode === 'zh') return '<div class="translated">' + zh + '</div>';
    return ja + '<div class="zh-box"><b>【中文翻译】</b><br>' + zh + '</div>';
  }

  /* 证据名称（按翻译模式） */
  function clueName(id) {
    const clue = SK.data.clues.get(id);
    const mode = state().translation;
    if (mode === 'ja') return clue.name;
    if (mode === 'zh') return clue.nameZh;
    return clue.name + ' / ' + clue.nameZh;
  }

  function clueDesc(id) {
    const clue = SK.data.clues.get(id);
    const mode = state().translation;
    if (mode === 'ja') return clue.desc;
    if (mode === 'zh') return clue.descZh;
    return clue.desc + '<span class="zh-note">' + clue.descZh + '</span>';
  }

  /* ------------------------------------------------------------------------
   * 第一幕站点外壳（藏青标题栏 / 米白站点 / 1998 复古）
   * ---------------------------------------------------------------------- */
  function siteShell1(content, active) {
    const s = state();
    const searchValue = (s.searchQuery || '').replace(/"/g, '&quot;');
    const nav = [
      '<button class="lnk" data-page="a1_home">トップ</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a1_about">学校案内</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a1_news">お知らせ</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a1_library">図書委員会</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a1_staff">教職員紹介</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a1_sitemap">サイトマップ</button>'
    ].join('');

    const sideMenu = [
      '<div class="side-box"><div class="side-title">メニュー</div>',
      '<button class="lnk" data-page="a1_about">学校案内</button>',
      '<button class="lnk" data-page="a1_news">お知らせ</button>',
      '<button class="lnk" data-page="a1_library">図書委員会</button>',
      '<button class="lnk" data-page="a1_album">卒業アルバム</button>',
      '<button class="lnk" data-page="a1_staff">教職員紹介</button>',
      '<button class="lnk" data-page="a1_song">校歌・校章</button>',
      '<button class="lnk" data-page="a1_sys">情報システム管理規程</button>',
      '<button class="lnk" data-page="a1_bbs">同窓会BBS</button>',
      '<button class="lnk" data-page="a1_sitemap">サイトマップ</button>',
      '<button class="lnk" data-page="board">推理ボード</button>',
      '</div>'
    ].join('');

    const sideSearch = '<div class="side-box"><div class="side-title">サイト内検索</div>'
      + '<div class="site-search"><input id="search1" class="search-input" data-search="act1" placeholder="キーワード" value="' + searchValue + '">'
      + '<button data-act="search1">検索</button></div></div>';

    const sideCounter = '<div class="side-box"><div class="side-title">アクセスカウンター</div>'
      + '<div class="counter">000417</div>'
      + '<div class="tiny">あなたは417人目の訪問者です。</div></div>';

    const sideEnv = '<div class="side-box"><div class="side-title">推奨環境</div>'
      + '<div class="tiny">Internet Explorer 5.0以上<br>解像度 800×600以上</div></div>';

    const mobileSearch = '<div class="mobile-search">'
      + '<input id="search1m" class="search-input" data-search="act1" placeholder="サイト内検索 / 站内搜索" value="' + searchValue + '">'
      + '<button data-act="search1">検索</button></div>';

    return '<div class="site-shell" data-active="' + (active || '') + '">'
      + '<div class="site-header">'
      + '<div class="site-logo">桜</div>'
      + '<div class="site-brand"><div class="site-name">旧桜丘高等学校</div>'
      + '<div class="site-sub">SAKURAOKA HIGH SCHOOL OFFICIAL WEB SITE</div></div>'
      + '<div class="site-since">Since 1998</div>'
      + '</div>'
      + '<div class="marquee"><span>【お知らせ】旧校舎解体まで、あと1日。記録室デジタルアーカイブは本日23:59をもって閉鎖されます。</span></div>'
      + '<div class="site-nav">' + nav + '</div>'
      + mobileSearch
      + '<div class="site-layout">'
      + '<div class="site-side">' + sideMenu + sideSearch + sideCounter + sideEnv + '</div>'
      + '<div class="site-main">' + content + '</div>'
      + '</div>'
      + '<div class="site-footer">旧桜丘高等学校　〒000-0000 桜丘県桜丘町1-2-3　TEL 000-000-0000<br>'
      + 'Copyright (C) 1998-2002 Sakuraoka High School. All Rights Reserved.<br>'
      + '<span class="muted">最終更新：2002年4月12日 23:47</span></div>'
      + '</div>';
  }

  /* ------------------------------------------------------------------------
   * 第二幕站点外壳（1989 校报编辑室 / 绿色终端）
   * ---------------------------------------------------------------------- */
  function siteShell2(content, active) {
    const s = state();
    const searchValue = (s.searchQuery || '').replace(/"/g, '&quot;');
    const nav = [
      '<button class="lnk" data-page="a2_editor">編集室</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a2_notes">取材メモ</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a2_roster">職員名簿</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a2_duty">当番表</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a2_repair">修繕記録</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a2_witness">証言</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a2_diary">日記</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a2_terminal">サーバ端末</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="board">推理ボード</button>'
    ].join('');

    const side = '<div class="side-box"><div class="side-title">取材ファイル</div>'
      + '<button class="lnk" data-page="a2_notes">取材メモ</button>'
      + '<button class="lnk" data-page="a2_roster">職員名簿</button>'
      + '<button class="lnk" data-page="a2_duty">当番表</button>'
      + '<button class="lnk" data-page="a2_repair">修繕記録</button>'
      + '<button class="lnk" data-page="a2_witness">証言</button>'
      + '<button class="lnk" data-page="a2_diary">日記</button>'
      + '<button class="lnk" data-page="a2_terminal">サーバ端末</button>'
      + '<button class="lnk" data-page="board">推理ボード</button>'
      + '</div>'
      + '<div class="side-box"><div class="side-title">締切</div>'
      + '<div class="tiny">第12号 入稿まであと2日。<br>3月12日 17:00 最終稿。</div></div>'
      + '<div class="side-box"><div class="side-title">警告</div>'
      + '<div class="tiny">学校側からの圧力あり。証拠は分散して保存すること。</div></div>'
      + '<div class="side-box"><div class="side-title">サイト内検索</div>'
      + '<div class="site-search"><input id="search2" class="search-input" data-search="act2" placeholder="キーワード" value="' + searchValue + '">'
      + '<button data-act="search2">検索</button></div></div>';

    const mobileSearch = '<div class="mobile-search">'
      + '<input id="search2m" class="search-input" data-search="act2" placeholder="サイト内検索 / 站内搜索" value="' + searchValue + '">'
      + '<button data-act="search2">検索</button></div>';

    return '<div class="site-shell act2" data-active="' + (active || '') + '">'
      + '<div class="site-header">'
      + '<div class="site-logo">報</div>'
      + '<div class="site-brand"><div class="site-name">旧桜丘高校 校報編集室</div>'
      + '<div class="site-sub">SAKURAOKA HIGH SCHOOL NEWSPAPER CLUB / 1989</div></div>'
      + '<div class="site-since">1989.03.10</div>'
      + '</div>'
      + '<div class="marquee"><span>【校報部】第12号 特集：学校推薦枠と職員の不正。掲載まであと2日。</span></div>'
      + '<div class="site-nav">' + nav + '</div>'
      + mobileSearch
      + '<div class="site-layout">'
      + '<div class="site-side">' + side + '</div>'
      + '<div class="site-main">' + content + '</div>'
      + '</div>'
      + '<div class="site-footer">校報部 編集室　／　1989年3月10日　／　この記事が公開されることはなかった。</div>'
      + '</div>';
  }

  /* ------------------------------------------------------------------------
   * 第三幕站点外壳（表 / 里两套主题）
   * ---------------------------------------------------------------------- */
  function siteShell3(content, active) {
    const s = state();
    const isUnder = s.mode === 'under';
    const searchValue = (s.searchQuery || '').replace(/"/g, '&quot;');
    const brand = isUnder ? '100%正直なサイト' : '旧桜丘高等学校';
    const sub = isUnder ? 'THE 100% HONEST WEB SITE' : 'SAKURAOKA HIGH SCHOOL OFFICIAL WEB SITE';
    const since = isUnder ? 'HONEST' : 'Since 1998';
    const marquee = isUnder
      ? '【警告】このサイトは100%正直です。ただし、証拠を見つけるたび、あなたの名前は削られます。'
      : '【お知らせ】旧校舎解体まで、あと1日。記録室デジタルアーカイブは本日23:59をもって閉鎖されます。';

    const nav = [
      '<button class="lnk" data-page="a3_home">トップ</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a3_about">学校案内</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a3_news1989">1989年 旧校報</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a3_news2002">2002年 学校だより</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a3_staff">教職員紹介</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a3_library">図書委員会</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a3_bbs">同窓会BBS</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a3_rhyme">童謡</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a3_principal">校長室</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a3_records">記録室</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="a3_final">最終選択</button>',
      '<span class="sep">｜</span>',
      '<button class="lnk" data-page="board">推理ボード</button>'
    ].join('');

    const evidenceRows = s.evidence.length
      ? s.evidence.map(function (id) {
        return '<div class="tiny" style="margin:3px 0;color:inherit;">■ ' + clueName(id) + '</div>';
      }).join('')
      : '<div class="tiny">証拠なし / 暂无证据</div>';

    const side = '<div class="side-box"><div class="side-title">メニュー</div>'
      + '<button class="lnk" data-page="a3_about">学校案内</button>'
      + '<button class="lnk" data-page="a3_news1989">1989年 旧校報</button>'
      + '<button class="lnk" data-page="a3_news2002">2002年 学校だより</button>'
      + '<button class="lnk" data-page="a3_staff">教職員紹介</button>'
      + '<button class="lnk" data-page="a3_library">図書委員会</button>'
      + '<button class="lnk" data-page="a3_bbs">同窓会BBS</button>'
      + '<button class="lnk" data-page="a3_rhyme">童謡</button>'
      + '<button class="lnk" data-page="a3_principal">校長室</button>'
      + '<button class="lnk" data-page="a3_records">記録室</button>'
      + '<button class="lnk" data-page="a3_final">最終選択</button>'
      + '<button class="lnk" data-page="board">推理ボード</button>'
      + '</div>'
      + '<div class="side-box"><div class="side-title">サイト内検索</div>'
      + '<div class="site-search"><input id="search3" class="search-input" data-search="act3" placeholder="キーワード" value="' + searchValue + '">'
      + '<button data-act="search3">検索</button></div></div>'
      + '<div class="side-box"><div class="side-title">調査メモ</div>' + evidenceRows + '</div>'
      + '<div class="side-box"><div class="side-title">モード</div><div class="tiny">'
      + (isUnder ? '裏ページ：事実が表示されます。' : '表ページ：学校が公表した記録です。')
      + '</div></div>';

    const mobileSearch = '<div class="mobile-search">'
      + '<input id="search3m" class="search-input" data-search="act3" placeholder="サイト内検索 / 站内搜索" value="' + searchValue + '">'
      + '<button data-act="search3">検索</button></div>';

    const footer = isUnder
      ? '100%正直なサイト　／　ここに書かれていることは、すべて本当です。<br><span class="red">最終更新：2024年8月31日 23:47</span>'
      : '旧桜丘高等学校　〒000-0000 桜丘県桜丘町1-2-3　TEL 000-000-0000<br>Copyright (C) 1998-2002 Sakuraoka High School. All Rights Reserved.<br><span class="muted">最終更新：2002年4月12日 23:47</span>';

    const statusStrip = '<div class="status-strip">'
      + '<span>花憐の名前残量：<b>' + SK.core.state.residue() + '</b>/10</span>'
      + '<span>拓也の名前：<b>' + SK.core.state.takuyaName() + '</b></span>'
      + '<span>証拠：<b>' + s.evidence.length + '</b></span>'
      + '<span class="danger">MODE：' + (isUnder ? '裏' : '表') + '</span>'
      + '<span class="mode-note">' + (isUnder ? '裏ページ / 里网页' : '表ページ / 表网页') + '</span>'
      + '</div>';

    return '<div class="site-shell' + (isUnder ? ' underworld' : '') + '" data-active="' + (active || '') + '">'
      + '<div class="site-header">'
      + '<div class="site-logo">' + (isUnder ? '裏' : '桜') + '</div>'
      + '<div class="site-brand"><div class="site-name">' + brand + '</div>'
      + '<div class="site-sub">' + sub + '</div></div>'
      + '<div class="site-since">' + since + '</div>'
      + '</div>'
      + '<div class="marquee"><span>' + marquee + '</span></div>'
      + '<div class="site-nav">' + nav + '</div>'
      + mobileSearch
      + statusStrip
      + '<div class="site-layout">'
      + '<div class="site-side">' + side + '</div>'
      + '<div class="site-main">' + content + '</div>'
      + '</div>'
      + '<div class="site-footer">' + footer + '</div>'
      + '</div>';
  }

  /* ------------------------------------------------------------------------
   * 推理板
   * ---------------------------------------------------------------------- */
  function clueCardHtml(id) {
    const clue = SK.data.clues.get(id);
    const sel = state().boardSel || [];
    const selected = sel.some(function (item) {
      return item.kind === 'clue' && item.id === id;
    });
    const mode = state().translation;
    const nameHtml = mode === 'ja' ? clue.name
      : mode === 'zh' ? clue.nameZh
        : clue.name + '<span class="zh-note">' + clue.nameZh + '</span>';
    const descHtml = mode === 'ja' ? clue.desc
      : mode === 'zh' ? clue.descZh
        : clue.desc + '<span class="zh-note">' + clue.descZh + '</span>';
    return '<button class="clue-card' + (selected ? ' selected' : '') + '"'
      + ' data-act="selectClue" data-clue="' + id + '"'
      + ' draggable="true" title="' + clue.name + '">'
      + '<span class="tag">' + clue.tag + '</span>'
      + '<span class="name">' + nameHtml + '</span>'
      + '<span class="desc">' + descHtml + '</span>'
      + '</button>';
  }

  function nodesHtml() {
    const nodes = state().nodes || [];
    if (!nodes.length) {
      return '<div class="board-note">' + SK.data.ui.board.boardNote.replace(/\n/g, '<br>') + '</div>';
    }
    const sel = state().boardSel || [];
    return nodes.map(function (node) {
      const clue = SK.data.clues.get(node.clueId);
      const selected = sel.some(function (item) {
        return item.kind === 'node' && item.id === node.uid;
      });
      const mode = state().translation;
      const nameHtml = mode === 'ja' ? clue.name : mode === 'zh' ? clue.nameZh
        : clue.name + '<span class="zh-note">' + clue.nameZh + '</span>';
      return '<button class="memo-node' + (selected ? ' selected' : '') + '"'
        + ' data-act="selectNode" data-uid="' + node.uid + '"'
        + ' draggable="true" style="left:' + node.x.toFixed(1) + '%;top:' + node.y.toFixed(1) + '%;"'
        + ' title="' + clue.name + '">'
        + '<span class="tag">' + clue.tag + '</span>'
        + '<span class="name">' + nameHtml + '</span>'
        + '<span class="desc">' + (mode === 'zh' ? clue.descZh : clue.desc) + '</span>'
        + '</button>';
    }).join('');
  }

  function boardPage() {
    const s = state();
    const cards = s.evidence.length
      ? s.evidence.map(function (id) {
        return clueCardHtml(id);
      }).join('')
      : '<div class="clue-empty">' + SK.data.ui.board.empty + '</div>';
    const sel = s.boardSel || [];
    const clueIds = sel.map(function (item) {
      if (item.kind === 'clue') return item.id;
      const node = SK.core.board.nodeById(item.id);
      return node ? node.clueId : null;
    }).filter(Boolean);
    let selText = SK.data.ui.board.selectedNone;
    if (clueIds.length === 1) {
      selText = SK.data.ui.board.selectedOne.replace('{name}', clueName(clueIds[0]));
    } else if (clueIds.length === 2) {
      selText = '已选择：' + clueName(clueIds[0]) + ' ＋ ' + clueName(clueIds[1]);
    }
    const canCombine = clueIds.length === 2;
    return '<div class="memo-shell">'
      + '<div class="memo-head"><span>' + SK.data.ui.board.head + '</span>'
      + '<span class="memo-head-tools">'
      + '<button class="lnk" data-act="back">戻る / 返回</button>'
      + '</span></div>'
      + '<div class="memo-layout">'
      + '<div class="clue-panel">'
      + '<div class="section-title">' + SK.data.ui.board.evidenceTitle + '</div>'
      + '<div class="clue-panel-tip">' + SK.data.ui.board.tip + '</div>'
      + cards
      + '</div>'
      + '<div class="memo-board-wrap">'
      + '<div class="memo-board" id="memoBoard">' + nodesHtml() + '</div>'
      + '<div class="memo-controls">'
      + '<div class="memo-selection">' + selText + '</div>'
      + '<button class="btn95" data-act="boardCombine"' + (canCombine ? '' : ' disabled') + '>'
      + SK.data.ui.board.combine + '</button>'
      + '<button class="btn95" data-act="boardClear">' + SK.data.ui.board.clear + '</button>'
      + '<button class="btn95" data-act="boardReset">' + SK.data.ui.board.resetBoard + '</button>'
      + '</div>'
      + '<p class="memo-recipe-hint">' + SK.data.ui.board.selectTip + '　／　' + SK.data.ui.board.removeTip + '</p>'
      + '</div>'
      + '</div>'
      + '</div>';
  }

  /* ------------------------------------------------------------------------
   * 浏览器窗口外壳
   * ---------------------------------------------------------------------- */
  function translationLabel() {
    const mode = state().translation;
    if (mode === 'zh') return '中文';
    if (mode === 'ja') return '日本語';
    return '双语';
  }

  function browserFrame(content, opts) {
    const options = opts || {};
    const s = state();
    const act = options.act || s.act || 1;
    const title = options.title || 'Microsoft Internet Explorer';
    const actLabel = act === 2 ? ui().chrome.act2 : act === 3 ? ui().chrome.act3 : ui().chrome.act1;
    const home = SK.core.router.homeForAct(act);
    const address = SK.core.router.addressFor();
    const isAct3 = act === 3;
    const modeLabel = s.mode === 'under' ? '表' : '裏';
    const modeTitle = s.mode === 'under' ? '返回表网页' : '查看里网页';

    let statusRight = '証拠: ' + s.evidence.length + ' 件 / RECORDS ROOM v0.14';
    if (isAct3) {
      statusRight = '名前残量: ' + SK.core.state.residue() + ' / 10　拓也: ' + SK.core.state.takuyaName() + '　証拠: ' + s.evidence.length;
    }

    const modeButton = isAct3
      ? '<button class="ie-tool" data-act="toggleMode" title="' + modeTitle + '">'
        + '<span class="glyph">' + modeLabel + '</span><span class="lbl">表/裏</span></button>'
      : '';

    const themeClass = act === 2 ? ' theme-act2' : (isAct3 ? ' theme-act3' : '');

    return '<div class="game-screen">'
      + '<div class="ie-window">'
      /* 第 1 行：标题栏 */
      + '<div class="ie-titlebar">'
      + '<span class="ie-mark"><img src="assets/ie-web.svg" alt="Internet Explorer" width="18" height="18"></span>'
      + '<span class="ie-title">' + title + '</span>'
      + '<span class="ie-title-tools">'
      + '<button class="ie-tool" data-act="translationCycle" title="切换语言：' + translationLabel() + '" aria-label="切换语言">'
      + '<span class="glyph">A</span><span class="lbl">' + translationLabel() + '</span></button>'
      + '<button class="ie-tool" data-act="openMenu" title="系统菜单" aria-label="系统菜单">'
      + '<span class="glyph">≡</span><span class="lbl">菜单</span></button>'
      + '</span>'
      + '</div>'
      /* 桌面端菜单栏 */
      + '<div class="ie-menubar" aria-hidden="true">'
      + '<span>ファイル(F)</span><span>編集(E)</span><span>表示(V)</span>'
      + '<span>お気に入り(A)</span><span>ツール(T)</span><span>ヘルプ(H)</span>'
      + '</div>'
      /* 第 2 行：工具栏 + 地址 */
      + '<div class="ie-toolbar">'
      + '<button class="ie-tool" data-act="back"' + (s.history.length ? '' : ' disabled') + ' title="后退" aria-label="后退">'
      + '<span class="glyph">←</span><span class="lbl">戻る</span></button>'
      + '<button class="ie-tool" data-page="' + home + '" title="首页" aria-label="首页">'
      + '<span class="glyph">⌂</span><span class="lbl">ホーム</span></button>'
      + '<button class="ie-tool" data-page="board" title="推理板" aria-label="推理板">'
      + '<span class="glyph">▤</span><span class="lbl">推理</span></button>'
      + modeButton
      + '<button class="ie-tool" data-act="openHint" title="提示" aria-label="提示">'
      + '<span class="glyph">?</span><span class="lbl">提示</span></button>'
      + '<div class="ie-address">'
      + '<span class="ie-addr-label">アドレス(D)</span>'
      + '<span class="ie-url" title="' + address + '">' + address + '</span>'
      + '</div>'
      + '<button class="ie-tool ie-go" data-act="refresh" title="刷新" aria-label="刷新">'
      + '<span class="glyph">→</span><span class="lbl">移動</span></button>'
      + '<button class="ie-tool ie-desktop-only tool-wide" data-act="refresh">'
      + '<span class="glyph">⟳</span><span class="lbl">更新</span></button>'
      + '</div>'
      /* 内容区 */
      + '<div class="ie-content' + themeClass + '">' + content + '</div>'
      /* 桌面端状态栏 */
      + '<div class="ie-statusbar">'
      + '<span class="sb-cell">' + actLabel + ' | 保護モード: オフ</span>'
      + '<span class="sb-cell">' + statusRight + '</span>'
      + '</div>'
      + '</div>'
      + '</div>';
  }

  SK.ui.shell = {
    bi: bi,
    clueName: clueName,
    clueDesc: clueDesc,
    siteShell1: siteShell1,
    siteShell2: siteShell2,
    siteShell3: siteShell3,
    browserFrame: browserFrame,
    boardPage: boardPage,
    clueCardHtml: clueCardHtml,
    nodesHtml: nodesHtml,
    translationLabel: translationLabel
  };
})();
