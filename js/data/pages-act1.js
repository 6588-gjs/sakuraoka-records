/* ==========================================================================
 * data/pages-act1.js — 第一幕（2024 / 旧桜丘高等学校 公式サイト）页面
 * 说明：
 *   - 站点外壳与导航由 ui/shell.js 提供，剧情页只负责正文。
 *   - 标题、导航、按钮等「网站结构」始终渲染日文原貌（保留 1998 年氛围）；
 *     正文使用 bi() 输出「日文 / 中文 / 双语」三种模式。
 *   - 登录表单、按钮、输入框等交互控件永远渲染，不受翻译模式影响
 *     （修复原版 zh 模式下表单消失的 bug）。
 * ========================================================================== */
(function () {
  'use strict';

  /* 当前状态与双语助手（延迟取用，避免脚本加载顺序问题） */
  function state() {
    return SK.core.state.get();
  }

  function bi(ja, zh) {
    return SK.ui.shell.bi(ja, zh);
  }

  /* 关键动作按钮的中文副标签 */
  function zhNote(text) {
    return ' <span class="zh-note">' + text + '</span>';
  }

  /* ------------------------------------------------------------------------
   * 首页
   * ---------------------------------------------------------------------- */
  function pageA1Home() {
    const notice = '<div class="notice">【重要】旧校舎解体工事に伴い、記録室デジタルアーカイブは本日23:59をもって閉鎖されます。'
      + '<span class="zh-note">重要：因旧校舍拆除，档案室数字资料库将于今日 23:59 关闭。</span></div>';

    const news = '<div class="section-title">新着情報</div>'
      + '<ul class="news-list">'
      + '<li><span class="news-date">2024/08/31</span>記録室デジタルアーカイブ 公開終了のお知らせ</li>'
      + '<li><span class="news-date">2002/04/12</span>'
      + '<button class="lnk" data-page="a1_news2002">2年B組 桜井花憐さんについて</button></li>'
      + '<li><span class="news-date">1989/03/15</span>'
      + '<button class="lnk" data-page="a1_news1989">旧校報 昭和64年3月号</button></li>'
      + '</ul>'
      + '<p class="tiny">※2024/08/31 記録室デジタルアーカイブ 公開終了。'
      + '<span class="zh-note">※最新消息：2024/08/31 数字资料库公开结束；2002/04/12 关于 2 年 B 组 樱井花怜；1989/03/15 旧校报 昭和 64 年 3 月号。</span></p>';

    const greeting = bi(
      '<div class="section-title">校長挨拶</div>'
      + '<p>本校は昭和23年の創立以来、地域に根ざした教育を実践してまいりました。生徒一人ひとりの可能性を伸ばし、明るく健やかな学校づくりに努めております。</p>'
      + '<div class="section-title">図書委員会からのお知らせ</div>'
      + '<p>平成14年度の図書委員名簿は下のリンクからご覧ください。</p>'
      + '<p class="tiny">※旧校報バックナンバーの一部は、サーバ移行に伴い閲覧できません。</p>',
      '<p>本校自昭和 23 年创立以来，一直致力于扎根当地的教育，重视每一名学生的可能性，努力建设开朗健康的学校。</p>'
      + '<p>平成 14 年度图书委员名册请从下方链接查看。</p>'
      + '<p class="tiny">※部分旧校报由于服务器迁移无法浏览。</p>'
    );

    const quickLinks = '<p class="tiny">'
      + '<button class="lnk" data-page="a1_library">図書委員会 / 图书委员会</button>　'
      + '<button class="lnk" data-page="a1_staff">教職員紹介 / 教职员介绍</button>　'
      + '<button class="lnk" data-page="a1_sys">情報システム管理規程 / 信息系统管理规定</button>'
      + '</p>';

    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">ようこそ 旧桜丘高等学校へ</h1>' + notice + news + greeting + quickLinks,
      'a1_home'
    );
  }

  /* ------------------------------------------------------------------------
   * 学校案内
   * ---------------------------------------------------------------------- */
  function pageA1About() {
    const ja = '<p>昭和23年 創立<br>昭和40年 校舎増築<br>平成元年 2年B組教室棟完成<br>平成21年 閉校<br>令和6年 旧校舎解体</p>'
      + '<p>生徒数：30名（平成14年度）<br>校花：桜<br>校訓：誠実・努力・思いやり</p>'
      + '<p class="tiny">※平成14年度の記録は、一部が欠落しています。</p>';
    const zh = '<p>昭和 23 年创立<br>昭和 40 年校舍扩建<br>平成元年 2 年 B 组教室楼完成<br>平成 21 年闭校<br>令和 6 年旧校舍拆除</p>'
      + '<p>学生数：30 名（平成 14 年度）<br>校花：樱<br>校训：诚实・努力・关怀</p>'
      + '<p class="tiny">※平成 14 年度的记录有一部分缺失。</p>';
    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">学校案内</h1>'
      + '<div class="section-title">沿革</div>' + bi(ja, zh),
      'a1_about'
    );
  }

  /* ------------------------------------------------------------------------
   * 通知一览
   * ---------------------------------------------------------------------- */
  function pageA1News() {
    const ja = '<div class="section-title">平成14年</div>'
      + '<ul class="news-list">'
      + '<li><span class="news-date">2002/04/12</span><button class="lnk" data-page="a1_news2002">2年B組 桜井花憐さんについて</button></li>'
      + '<li><span class="news-date">2002/04/08</span>新任式・始業式が行われました</li>'
      + '<li><span class="news-date">2002/03/15</span><button class="lnk" data-page="a1_news1989">旧校報 昭和64年3月号</button></li>'
      + '</ul>'
      + '<div class="section-title">令和6年</div>'
      + '<ul class="news-list"><li><span class="news-date">2024/08/31</span>記録室デジタルアーカイブ 公開終了</li></ul>'
      + '<p class="tiny">※バックナンバーの一部はサーバ移行に伴い閲覧できません。</p>';
    const zh = '<p class="translated">通知一览：2002/04/12 关于 2 年 B 组 樱井花怜；2002/04/08 新任式与开学式；2002/03/15 旧校报 昭和 64 年 3 月号；2024/08/31 档案室数字资料库公开结束。</p>'
      + '<p class="tiny">※部分旧刊由于服务器迁移无法浏览。</p>';
    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">お知らせ</h1>' + bi(ja, zh),
      'a1_news'
    );
  }

  /* ------------------------------------------------------------------------
   * 图书委员会
   * ---------------------------------------------------------------------- */
  function pageA1Library() {
    const ja = '<p>平成14年度 図書委員名簿</p>'
      + '<p>3年A組 小林真央 12<br>2年B組 桜井花憐 31<br>2年B組 鈴木美咲 2</p>'
      + '<p class="tiny">※図書委員のIDは学籍番号の前にsを付けます。</p>'
      + '<p class="tiny">※桜井花憐は4月12日以降、委員会活動に出席していません。</p>';
    const zh = '<p>平成 14 年度 图书委员名册</p>'
      + '<p>3 年 A 组 小林真央 12<br>2 年 B 组 樱井花怜 31<br>2 年 B 组 铃木美咲 2</p>'
      + '<p class="tiny">※图书委员的 ID 为学号前加 s。</p>'
      + '<p class="tiny">※樱井花怜在 4 月 12 日以后没有参加委员会活动。</p>';
    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">図書委員会</h1>' + bi(ja, zh),
      'a1_library'
    );
  }

  /* ------------------------------------------------------------------------
   * 毕业相册
   * ---------------------------------------------------------------------- */
  function pageA1Album() {
    const ja = '<p>平成14年度版 英語名一覧</p>'
      + '<p>1 佐藤健太 Kenta Sato<br>2 鈴木美咲 Misaki Suzuki<br>31 桜井花憐 Karen Sakurai<br>30 岡本奈々 Nana Okamoto</p>'
      + '<p class="tiny">※31番の生徒は卒業名簿に記載されていません。</p>';
    const zh = '<p>平成 14 年度 英文名一览</p>'
      + '<p>1 佐藤健太 Kenta Sato<br>2 铃木美咲 Misaki Suzuki<br>31 樱井花怜 Karen Sakurai<br>30 冈本奈奈 Nana Okamoto</p>'
      + '<p class="tiny">※31 号学生未记载于毕业名册。</p>';
    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">卒業アルバム</h1>' + bi(ja, zh),
      'a1_album'
    );
  }

  /* ------------------------------------------------------------------------
   * 教职员介绍
   * ---------------------------------------------------------------------- */
  function pageA1Staff() {
    const ja = '<p>校長 山本正雄 Masao Yamamoto（平成10年）<br>'
      + '教頭 葛城修 Osamu Katsuragi（平成14年着任）<br>'
      + '教諭 田中美由美 Yumi Tanaka（平成9年）<br>'
      + '教諭 佐藤隆 Takashi Sato（平成12年）</p>'
      + '<p class="tiny">※教職員の初期パスワードは情報システム管理規程を参照。</p>';
    const zh = '<p>校长 山本正雄 Masao Yamamoto（平成 10 年）<br>'
      + '教头 葛城修 Osamu Katsuragi（平成 14 年就任）<br>'
      + '教师 田中美由美 Yumi Tanaka（平成 9 年）<br>'
      + '教师 佐藤隆 Takashi Sato（平成 12 年）</p>'
      + '<p class="tiny">※教职员初始密码请参照信息系统管理规定。</p>';
    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">教職員紹介</h1>' + bi(ja, zh),
      'a1_staff'
    );
  }

  /* ------------------------------------------------------------------------
   * 校歌・校章
   * ---------------------------------------------------------------------- */
  function pageA1Song() {
    const ja = '<div class="section-title">校章</div>'
      + '<p>桜の花をモチーフにした校章。校花は桜。校訓は誠実・努力・思いやり。</p>'
      + '<div class="section-title">校歌</div>'
      + '<p>桜丘の風に 胸を張り<br>学びの道を 歩みゆく<br>ああ 我らが旧桜丘高校</p>'
      + '<p class="tiny">※校歌の楽譜はサーバ移行時に消失しました。</p>';
    const zh = '<p>以樱花为图案的校章。校花是樱，校训是诚实・努力・关怀。</p>'
      + '<p>校歌：在樱丘的风中挺起胸膛／走在求学之路上／啊，我们的旧樱丘高中。</p>'
      + '<p class="tiny">※校歌乐谱在服务器迁移时丢失。</p>';
    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">校歌・校章</h1>' + bi(ja, zh),
      'a1_song'
    );
  }

  /* ------------------------------------------------------------------------
   * 信息系统管理规定（关键谜题提示页）
   * ---------------------------------------------------------------------- */
  function pageA1Sys() {
    const ja = '<p>生徒：IDはs＋学籍番号。初期パスワードは名のローマ字＋学籍番号。<br>'
      + '教職員：IDは姓のローマ字。初期パスワードは校花のローマ字＋着任年。<br>'
      + '管理者：IDはrecords_admin。初期パスワードは最初の事故被害者の姓＋事故年。</p>'
      + '<p class="tiny">※パスワードは半角英数字小文字のみ。年度ごとの変更はありません。</p>';
    const zh = '<p>学生：ID 为 s＋学号；初始密码为名字罗马字＋学号。<br>'
      + '教职员：ID 为姓氏罗马字；初始密码为校花罗马字＋就任年份。<br>'
      + '管理员：ID 为 records_admin；初始密码为最初事故受害者的姓氏＋事故年份。</p>'
      + '<p class="tiny">※密码仅限半角小写英文与数字，未按年度更改。</p>';
    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">情報システム管理規程</h1>' + bi(ja, zh),
      'a1_sys'
    );
  }

  /* ------------------------------------------------------------------------
   * 同窗会 BBS
   * ---------------------------------------------------------------------- */
  function pageA1Bbs() {
    const ja = '<div class="section-title">文化祭スレッド</div>'
      + '<p><b>名無しさん</b>：文化祭お疲れさまでした。2年B組の喫茶店、盛況でしたね。</p>'
      + '<p><b>花</b>：写真、後で見せてください。消さないでくださいね。</p>'
      + '<div class="section-title">図書室の鍵</div>'
      + '<p><b>名無しさん</b>：旧図書室の鍵、また壊れてるらしい。</p>'
      + '<p class="tiny">※平成14年4月12日以降の書き込みはありません。</p>';
    const zh = '<p>【文化祭帖子】无名氏：文化祭辛苦了，2 年 B 组的咖啡店很热闹。<br>花：照片之后给我看看吧，请不要删掉。</p>'
      + '<p>【图书室的钥匙】无名氏：旧图书室的锁又坏了。</p>'
      + '<p class="tiny">※平成 14 年 4 月 12 日以后没有新帖。</p>';
    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">同窓会BBS</h1>' + bi(ja, zh),
      'a1_bbs'
    );
  }

  /* ------------------------------------------------------------------------
   * 网站地图（隐藏入口：记录室数字资料库）
   * ---------------------------------------------------------------------- */
  function pageA1Sitemap() {
    const ja = '<p>トップページ<br>学校案内<br>お知らせ<br>図書委員会<br>卒業アルバム<br>教職員紹介<br>校歌・校章<br>情報システム管理規程<br>同窓会BBS</p>';
    const zh = '<p>首页 / 学校介绍 / 通知 / 图书委员会 / 毕业相册 / 教职员介绍 / 校歌・校章 / 信息系统管理规定 / 同窗会 BBS</p>';
    const hidden = '<div class="hidden-link">関係者専用：'
      + '<button class="lnk" data-page="a1_records">記録室デジタルアーカイブ</button>'
      + '<span class="zh-note">相关人员专用：档案室数字资料库</span></div>';
    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">サイトマップ</h1>' + bi(ja, zh) + hidden,
      'a1_sitemap'
    );
  }

  /* ------------------------------------------------------------------------
   * 旧校报（1989）— 满足条件后可追溯记忆进入第二幕
   * ---------------------------------------------------------------------- */
  function pageA1News1989() {
    const st = state();
    const ready = st.evidence.indexOf('c_conspiracy') >= 0 && st.solved.a1code;
    const ja = '<div class="section-title">2年A組 藤宮詩織さん、転校</div>'
      + '<p>藤宮詩織さんが家庭の事情により転校することになりました。クラス一同、彼女の新しい出発を応援しています。</p>'
      + '<p class="tiny">※転校先の学校名は記載されていない。</p>';
    const zh = '<p>2 年 A 组 藤宫诗织，转校。藤宫诗织因家庭原因即将转校。全班同学祝愿她在新环境一切顺利。</p>'
      + '<p class="tiny">※没有写明转校去向。</p>';
    const gate = ready
      ? '<div class="notice red">この記事を読んだ瞬間、画面が一瞬だけ白く染まった。<span class="zh-note">读完这篇报道的瞬间，画面被白色吞没。</span></div>'
        + '<p><button class="btn95" data-act="startAct2">記憶を辿る</button>'
        + '<span class="zh-note">追溯记忆 → 进入第二幕（1989）</span></p>'
      : '<div class="archive-hint">この記事には、まだ意味を見出せない。<br>'
        + '<span class="zh-note">现在的线索还不足以理解这篇报道。继续调查档案室（隐藏文件、1989 年的记录）。</span></div>';
    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">旧校報 昭和64年3月号</h1>' + bi(ja, zh) + gate,
      'a1_news1989'
    );
  }

  /* ------------------------------------------------------------------------
   * 2002 年关于樱井花怜的报道
   * ---------------------------------------------------------------------- */
  function pageA1News2002() {
    const ja = '<p>本校2年B組の桜井花憐さんが、平成14年4月12日より行方不明となっています。警察には失踪届が提出され、現在も捜索が続いています。</p>'
      + '<p>学校としては、本人が家出した可能性が高いと判断しています。</p>'
      + '<p class="tiny">※本件に関する詳細は、個人情報保護のため控えさせていただきます。</p>';
    const zh = '<p>本校 2 年 B 组樱井花怜自平成 14 年 4 月 12 日起失踪。警方已受理失踪报案，搜索仍在继续。</p>'
      + '<p>学校判断其离家出走的可能性较高。</p>'
      + '<p class="tiny">※因个人信息保护，本件详情不予公开。</p>';
    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">2年B組 桜井花憐さんについて</h1>' + bi(ja, zh),
      'a1_news2002'
    );
  }

  /* ------------------------------------------------------------------------
   * 记录室数字资料库 — 登录页
   * 交互控件始终渲染；错误只更新 #loginError，不整页重绘（保留输入值）。
   * ---------------------------------------------------------------------- */
  function pageA1Records() {
    const st = state();
    if (st.a1Level > 0) {
      const lv = st.a1Level === 2 ? 'TEACHER / 教職員' : 'STUDENT / 生徒';
      return SK.ui.shell.siteShell1(
        '<h1 class="page-title">記録室デジタルアーカイブ</h1>'
        + '<div class="login-panel">'
        + '<h2>記録室デジタルアーカイブ</h2>'
        + '<p>ログイン中：<b>' + lv + '</b></p>'
        + '<p class="tiny">アカウントを切り替える場合はログアウトしてください。<span class="zh-note">当前已登录，如需切换账号请先登出。</span></p>'
        + '<div class="login-session">'
        + '<button class="btn95" data-page="a1_archive">アーカイブへ入る / 进入档案库</button>'
        + '<button class="btn95" data-page="board">推理ボード / 推理板</button>'
        + '<button class="btn95" data-act="logoutA1">ログアウト / 登出</button>'
        + '</div></div>',
        'a1_records'
      );
    }

    const teacherDisabled = st.evidence.indexOf('c_erased') < 0;
    let teacherCard = '';
    if (teacherDisabled) {
      teacherCard = '<p class="tiny">※生徒記録の復元が完了するまでログインできません。'
        + '<span class="zh-note">学生记录复原（推理合成「记录是被有意抹消的」）完成前，无法登录教师账号。</span></p>';
    } else {
      teacherCard = '<div class="field95"><label for="loginTId">ID</label>'
        + '<input id="loginTId" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="katsuragi"></div>'
        + '<div class="field95"><label for="loginTPw">PASSWORD</label>'
        + '<input id="loginTPw" type="password" autocomplete="off" placeholder="********"></div>'
        + '<button class="btn95" data-act="loginTeacher">ログイン' + zhNote('登录') + '</button>';
    }

    const err = st.loginError ? st.loginError : '';
    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">記録室デジタルアーカイブ ログイン</h1>'
      + '<p>このシステムは旧桜丘高校の記録を保存するため、同窓会によって維持されています。'
      + '<span class="zh-note">本系统由同窗会维持，用于保存旧樱丘高中的记录。</span></p>'
      + '<div class="login-grid">'
      + '<div class="login-card"><h3>生徒アカウント <span class="zh-note">学生账号</span></h3>'
      + '<div class="field95"><label for="loginSId">ID</label>'
      + '<input id="loginSId" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="s031"></div>'
      + '<div class="field95"><label for="loginSPw">PASSWORD</label>'
      + '<input id="loginSPw" type="password" autocomplete="off" placeholder="********"></div>'
      + '<button class="btn95" data-act="loginStudent">ログイン' + zhNote('登录') + '</button>'
      + '<p class="tiny" style="margin-top:8px;">ヒント：図書委員会のID規則（s＋学籍番号）。<span class="zh-note">提示：学生 ID = s＋学号，密码 = 名字罗马字＋学号。</span></p>'
      + '</div>'
      + '<div class="login-card"><h3>教職員アカウント <span class="zh-note">教职员账号</span></h3>' + teacherCard + '</div>'
      + '</div>'
      + '<div class="err95" id="loginError">' + err + '</div>'
      + '<p class="tiny">ヒント：図書委員会、卒業アルバム、情報システム管理規程を確認してください。'
      + '<span class="zh-note">提示：查看图书委员会、毕业相册、信息系统管理规定。</span></p>'
      + '<details class="demo-box"><summary>DEMO用アカウント情報（演示账号信息）</summary>'
      + '学生：s031 / karen031<br>老师：katsuragi / sakura2002</details>',
      'a1_records'
    );
  }

  /* ------------------------------------------------------------------------
   * 档案库主界面：文档列表 + 阅读器 + 条件提示
   * ---------------------------------------------------------------------- */
  function pageA1Archive() {
    const st = state();
    const lv = st.a1Level === 2 ? 'TEACHER / 教職員' : 'STUDENT / 生徒';
    const docs = SK.data.documents.A1_DOCS.filter(function (d) {
      if (d.id === 'd_itmemo' && !st.solved.a1code) return false;
      return d.level <= st.a1Level;
    });

    let viewer = '';
    const doc = st.selectedDoc ? SK.data.documents.get(st.selectedDoc) : null;
    if (doc && doc.level <= st.a1Level) {
      const jaBody = doc.ja.replace(/\n/g, '<br>');
      const zhBody = doc.zh.replace(/\n/g, '<br>');
      viewer = '<div class="doc-view">'
        + '<h2>' + doc.title + '</h2>'
        + '<div class="meta">ID: ' + doc.id.toUpperCase() + ' / ' + doc.date + '</div>'
        + '<div class="doc-body">' + bi(jaBody, zhBody) + '</div>'
        + (doc.clue ? '<p class="tiny" style="margin-top:10px;">この文書から証拠を入手しました。'
          + '<span class="zh-note">已从该文档获得证据。</span></p>' : '')
        + '</div>';
    } else {
      viewer = '<div class="archive-hint">左の一覧から文書を選択してください。'
        + '<span class="zh-note">请从上方（手机端）或左侧列表选择文档。</span></div>';
    }

    let gates = '';
    if (st.a1Level === 1 && st.evidence.indexOf('c_erased') >= 0) {
      gates += '<div class="notice blue">教職員アカウントのログイン条件が整いました。'
        + '<button class="lnk" data-page="a1_records">ログイン画面へ</button>'
        + '<span class="zh-note">教职员账号的登录条件已满足，前往登录画面。</span></div>';
    }
    if (st.a1Level === 2 && !st.solved.a1code) {
      gates += '<div class="notice gold">封印されたファイルがあります。'
        + '<button class="lnk" data-page="a1_lock">解除する</button>'
        + '<span class="zh-note">存在被封印的文件，前往解除。</span></div>';
    }
    if (st.a1Level === 2 && st.evidence.indexOf('c_conspiracy') >= 0) {
      gates += '<div class="notice red">1989年の旧校報を確認できます。'
        + '<button class="lnk" data-page="a1_news1989">旧校報を開く</button>'
        + '<span class="zh-note">可以查看 1989 年的旧校报，那里有通往第二幕的入口。</span></div>';
    }

    const docList = docs.map(function (d) {
      return '<button class="arc-doc" data-act="openA1Doc" data-doc="' + d.id + '">'
        + '<span class="doc-id">' + d.id.toUpperCase() + ' / LEVEL ' + d.level + '</span>'
        + '<span class="doc-title">' + d.title + '</span>'
        + '<span class="doc-meta">' + d.date + '</span>'
        + '</button>';
    }).join('');

    const html = '<div class="archive-shell">'
      + '<div class="archive-header">'
      + '<div class="archive-brand"><div class="archive-title">記録室デジタルアーカイブ</div>'
      + '<div class="archive-sub">OLD SAKURAOKA HIGH SCHOOL / RECORDS ROOM</div></div>'
      + '<div class="access-tag">' + lv + '</div>'
      + '<div class="archive-header-tools">'
      + '<button class="mini95" data-page="a1_home">公式サイト</button>'
      + '<button class="mini95" data-page="board">推理ボード</button>'
      + '<button class="mini95" data-act="logoutA1">ログアウト</button>'
      + '</div></div>'
      + '<div class="archive-layout">'
      + '<div class="archive-side">'
      + '<div class="archive-box"><div class="label">STATUS</div>証拠：' + st.evidence.length + ' 件<br>'
      + '第31号調査：' + (st.evidence.indexOf('c_erased') >= 0 ? '完了' : '調査中') + '</div>'
      + '<div class="archive-box"><div class="label">LOG</div>'
      + (st.a1Level >= 1 ? '前回ログイン：桜井花憐<br>2002/04/12 16:42' : '前回ログイン：記録なし') + '</div>'
      + '<div class="archive-box"><div class="label">NOTICE</div>' + (gates || '現在、新しい通知はありません。') + '</div>'
      + '</div>'
      + '<div class="archive-main">'
      + '<div class="tiny" style="margin-bottom:6px;">ARCHIVE INDEX / 文書一覧（閲覧権限レベル順）</div>'
      + '<div class="doc-list">' + docList + '</div>'
      + viewer
      + '</div></div></div>';

    return html;
  }

  /* ------------------------------------------------------------------------
   * 封印文件（暗号 0413）
   * ---------------------------------------------------------------------- */
  function pageA1Lock() {
    const st = state();
    const err = st.a1LockError || '';
    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">封印ファイル</h1>'
      + '<div class="notice">このファイルは暗証番号で保護されています。'
      + '<span class="zh-note">此文件受暗号保护。</span></div>'
      + '<div class="login-panel"><h2>SEALED FILE / 暗証番号</h2>'
      + '<p>暗証番号（4桁）：<span class="zh-note">请输入 4 位数字暗号</span></p>'
      + '<div class="login-field"><label for="a1Code">CODE</label>'
      + '<input id="a1Code" class="term-input" inputmode="numeric" pattern="[0-9]*" maxlength="8" autocomplete="off" placeholder="4桁"></div>'
      + '<div class="err95" id="a1LockError">' + err + '</div>'
      + '<div class="row"><button class="btn95" data-act="unlockA1">解除する' + zhNote('解除') + '</button>'
      + '<button class="btn95" data-page="a1_archive">戻る / 返回档案库</button></div>'
      + '<p class="tiny" style="margin-top:10px;">ヒント：旧図書室の内鍵が交換された日付。月日を4桁で。'
      + '<span class="zh-note">提示：旧图书室内锁被更换的日期，取月日 4 位数字。可在「鍵管理簿」中确认。</span></p>'
      + '</div>',
      'a1_lock'
    );
  }

  /* ------------------------------------------------------------------------
   * 站内搜索
   * ---------------------------------------------------------------------- */
  function pageA1Search() {
    const st = state();
    const q = (st.searchQuery || '').trim();
    let hits = [];
    if (q) {
      const qq = q.toLowerCase();
      const list = [
        ['a1_library', '図書委員会'],
        ['a1_album', '卒業アルバム'],
        ['a1_staff', '教職員紹介'],
        ['a1_sys', '情報システム管理規程'],
        ['a1_news1989', '旧校報 昭和64年3月号'],
        ['a1_news2002', '2年B組 桜井花憐さんについて'],
        ['a1_sitemap', 'サイトマップ'],
        ['a1_records', '記録室デジタルアーカイブ']
      ];
      list.forEach(function (x) {
        if (x[1].toLowerCase().indexOf(qq) >= 0) hits.push(x);
      });
      if (q.indexOf('記録室') >= 0 || q.indexOf('アーカイブ') >= 0 || q.indexOf('档案') >= 0) {
        hits.push(['a1_records', '記録室デジタルアーカイブ']);
      }
      if (q.indexOf('桜井') >= 0 || q.indexOf('花憐') >= 0 || q.indexOf('花怜') >= 0) {
        hits.push(['a1_library', '図書委員会'], ['a1_album', '卒業アルバム']);
      }
      if (q.indexOf('葛城') >= 0) hits.push(['a1_staff', '教職員紹介']);
      if (q.indexOf('パスワード') >= 0 || q.indexOf('初期') >= 0 || q.indexOf('密码') >= 0) {
        hits.push(['a1_sys', '情報システム管理規程']);
      }
    }

    const result = hits.length
      ? '<div class="section-title">検索結果</div><ul class="news-list">'
        + hits.map(function (x) {
          return '<li><button class="lnk" data-page="' + x[0] + '">' + x[1] + '</button></li>';
        }).join('') + '</ul>'
      : '<div class="notice">該当するページはありません。<span class="zh-note">没有找到相关页面。</span></div>';

    return SK.ui.shell.siteShell1(
      '<h1 class="page-title">サイト内検索</h1>'
      + '<div class="page-date">キーワード：' + (q || '（未入力）') + '</div>'
      + result
      + '<p class="tiny">※検索結果は平成14年4月12日時点のインデックスに基づきます。'
      + '<span class="zh-note">※搜索结果基于平成 14 年 4 月 12 日时点的索引。</span></p>',
      'a1_search'
    );
  }

  /* ------------------------------------------------------------------------
   * 路由：把当前 page 映射到页面函数
   * ---------------------------------------------------------------------- */
  const PAGES = {
    a1_home: pageA1Home,
    a1_about: pageA1About,
    a1_news: pageA1News,
    a1_library: pageA1Library,
    a1_album: pageA1Album,
    a1_staff: pageA1Staff,
    a1_song: pageA1Song,
    a1_sys: pageA1Sys,
    a1_bbs: pageA1Bbs,
    a1_sitemap: pageA1Sitemap,
    a1_news1989: pageA1News1989,
    a1_news2002: pageA1News2002,
    a1_records: pageA1Records,
    a1_archive: pageA1Archive,
    a1_lock: pageA1Lock,
    a1_search: pageA1Search
  };

  SK.data.act1 = {
    pages: PAGES,
    render: function (page) {
      const fn = PAGES[page] || PAGES.a1_home;
      return fn();
    }
  };
})();
