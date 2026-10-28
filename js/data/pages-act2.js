/* ==========================================================================
 * data/pages-act2.js — 第二幕（1989 / 校報編集室）页面
 * 绿色终端主题。终端谜题沿用原版：
 *   1) 照合クエリ 1/2：昭和64年3月12日旧図書室にいた人物 → 藤宮詩織と葛城修
 *   2) 照合クエリ 2/2：学校が事故を隠蔽したことを示す記録 → 修繕記録 旧図書室
 *   3) サーバーアップロード：fujimiya0312（詩織の姓＋事故日 03/12）
 * ========================================================================== */
(function () {
  'use strict';

  function state() {
    return SK.core.state.get();
  }

  function bi(ja, zh) {
    return SK.ui.shell.bi(ja, zh);
  }

  function zhNote(text) {
    return ' <span class="zh-note">' + text + '</span>';
  }

  /* ------------------------------------------------------------------------
   * 编辑室（第二幕首页）
   * ---------------------------------------------------------------------- */
  function pageA2Editor() {
    const ja = '<div class="notice">1989年3月10日。校報第12号の入稿まで、あと2日。</div>'
      + '<p>私は藤宮詩織。校報部の部員。今、学校の推薦枠をめぐる不正を追っている。</p>'
      + '<p>教頭の葛城修が、業者と結託して推薦枠を売っていた。証拠は旧図書室の書庫にある。</p>'
      + '<p>3月12日、私は葛城を旧図書室で問い詰める。その日、すべてをサーバにアップロードするつもりだ。</p>'
      + '<p class="tiny">※取材ファイルを順に確認し、サーバ端末で照合してください。</p>';
    const zh = '<p>1989 年 3 月 10 日。校报第 12 号截稿还有 2 天。</p>'
      + '<p>我是藤宫诗织，校报部成员。现在正在追查学校推荐名额的不正行为。</p>'
      + '<p>教头葛城修与业者勾结，出卖推荐名额。证据在旧图书室的书库里。</p>'
      + '<p>3 月 12 日，我会在旧图书室质问他。那一天，我准备把所有资料上传到服务器。</p>'
      + '<p class="tiny">※请依次查看取材文件，并在服务器终端完成对照。</p>';
    return SK.ui.shell.siteShell2(
      '<h1 class="page-title">校報編集室</h1>' + bi(ja, zh),
      'a2_editor'
    );
  }

  /* ------------------------------------------------------------------------
   * 取材笔记
   * ---------------------------------------------------------------------- */
  function pageA2Notes() {
    const ja = '<p>葛城修は業者と接触している。<br>推薦枠の名簿に存在しない生徒が3人いる。<br>'
      + '旧図書室の書庫に台帳が隠されている。<br>3月12日16:30、旧図書室で葛城と会う。</p>'
      + '<p class="tiny">※このメモは誰にも見せていない。</p>';
    const zh = '<p>葛城修与业者接触。<br>推荐名额名册里有 3 个不存在的学生。<br>'
      + '旧图书室书库藏着台账。<br>3 月 12 日 16:30 在旧图书室与葛城见面。</p>'
      + '<p class="tiny">※这份笔记没有给任何人看过。</p>';
    return SK.ui.shell.siteShell2(
      '<h1 class="page-title">取材メモ</h1>' + bi(ja, zh),
      'a2_notes'
    );
  }

  /* ------------------------------------------------------------------------
   * 职员名册
   * ---------------------------------------------------------------------- */
  function pageA2Roster() {
    const ja = '<p>校長 山本正雄<br>教頭 葛城修<br>教諭 田中美由美<br>教諭 佐藤隆<br>実習教員 葛城修（昭和63年度）</p>'
      + '<p class="tiny">※葛城修は推薦委員会の担当でもある。</p>';
    const zh = '<p>校长 山本正雄<br>教头 葛城修<br>教师 田中美由美<br>教师 佐藤隆<br>实习教师 葛城修（昭和 63 年度）</p>'
      + '<p class="tiny">※葛城修也是推荐委员会负责人。</p>';
    return SK.ui.shell.siteShell2(
      '<h1 class="page-title">職員名簿</h1>' + bi(ja, zh),
      'a2_roster'
    );
  }

  /* ------------------------------------------------------------------------
   * 值班表
   * ---------------------------------------------------------------------- */
  function pageA2Duty() {
    const ja = '<p>16:00 校報部 藤宮詩織 旧図書室へ<br>16:30 教頭 葛城修 旧図書室へ<br>'
      + '17:00 校舎施錠 山田錠前<br>17:10 旧図書室で事故発生</p>'
      + '<p class="tiny">※当日、旧図書室には詩織と葛城の二人がいた。</p>';
    const zh = '<p>16:00 校报部 藤宫诗织 前往旧图书室<br>16:30 教头 葛城修 前往旧图书室<br>'
      + '17:00 校舍上锁 山田锁店<br>17:10 旧图书室发生事故</p>'
      + '<p class="tiny">※当天，旧图书室里只有诗织和葛城两人。</p>';
    return SK.ui.shell.siteShell2(
      '<h1 class="page-title">当番表 昭和64年3月12日</h1>' + bi(ja, zh),
      'a2_duty'
    );
  }

  /* ------------------------------------------------------------------------
   * 修缮记录（终端谜题 2 的正确答案）
   * ---------------------------------------------------------------------- */
  function pageA2Repair() {
    const ja = '<p>昭和64年3月12日 16:40<br>旧図書室の内鍵が壊れているとの通報。<br>現場には争った痕跡あり。<br>'
      + '3月13日 08:20 新しい内鍵を交換。<br>依頼者：教頭 葛城修</p>'
      + '<p class="tiny">※警察には内側から施錠されていたと報告された。</p>';
    const zh = '<p>昭和 64 年 3 月 12 日 16:40<br>接到旧图书室内锁损坏的报告。<br>现场有争斗痕迹。<br>'
      + '3 月 13 日 08:20 更换新内锁。<br>委托人：教头 葛城修</p>'
      + '<p class="tiny">※警方收到的报告是从内侧上锁。</p>';
    return SK.ui.shell.siteShell2(
      '<h1 class="page-title">修繕記録 旧図書室</h1>' + bi(ja, zh),
      'a2_repair'
    );
  }

  /* ------------------------------------------------------------------------
   * 证言笔记（终端谜题 1 的线索）
   * ---------------------------------------------------------------------- */
  function pageA2Witness() {
    const ja = '<p>生徒A：16:45ごろ、旧図書室から悲鳴を聞いた。<br>'
      + '生徒B：17:00ごろ、葛城教頭が旧校舎から出てくるのを見た。<br>'
      + '用務員：3月15日、学校は藤宮詩織が転校したと発表した。<br>'
      + '教頭：当日は会議に出ていた。旧図書室には行っていない。</p>'
      + '<p class="tiny">※当番表と修繕記録は、教頭の証言と矛盾している。</p>';
    const zh = '<p>学生 A：16:45 左右，听到旧图书室传来惨叫。<br>'
      + '学生 B：17:00 左右，看到葛城教头从旧校舍出来。<br>'
      + '勤杂工：3 月 15 日，学校宣布藤宫诗织转校。<br>'
      + '教头：当天在开会，没有去旧图书室。</p>'
      + '<p class="tiny">※值班表和修缮记录与教头的证言矛盾。</p>';
    return SK.ui.shell.siteShell2(
      '<h1 class="page-title">証言メモ</h1>' + bi(ja, zh),
      'a2_witness'
    );
  }

  /* ------------------------------------------------------------------------
   * 诗织的日记（上传密码的算法提示）
   * ---------------------------------------------------------------------- */
  function pageA2Diary() {
    const ja = '<p>3月10日。<br>明日、決定的な証拠を手に入れる。<br>'
      + 'サーバのアップロード用パスワードは、私の姓と、あの日の日付。<br>'
      + '姓はローマ字小文字。日付は月日を4桁で。</p>'
      + '<p>例：山田太郎が1月2日なら yamada0102。</p>'
      + '<p class="tiny">※事故の日付は、当番表と修繕記録に書かれている。</p>';
    const zh = '<p>3 月 10 日。<br>明天，我会拿到决定性证据。<br>'
      + '服务器上传密码是我的姓氏，加上那一天的日子。<br>'
      + '姓氏用小写罗马字，日期用月日 4 位数。</p>'
      + '<p>例：山田太郎在 1 月 2 日就是 yamada0102。</p>'
      + '<p class="tiny">※事故日期写在值班表和修缮记录里。</p>';
    return SK.ui.shell.siteShell2(
      '<h1 class="page-title">詩織の日記</h1>' + bi(ja, zh),
      'a2_diary'
    );
  }

  /* ------------------------------------------------------------------------
   * 取材文件内搜索
   * ---------------------------------------------------------------------- */
  function pageA2Search() {
    const st = state();
    const q = (st.searchQuery || '').trim();
    const files = [
      ['a2_notes', '取材メモ', '推荐名额 / 葛城 / 旧図書室'],
      ['a2_roster', '職員名簿', '葛城修 / 実習教員'],
      ['a2_duty', '当番表', '3月12日 / 旧図書室'],
      ['a2_repair', '修繕記録', '内鍵 / 3月12日 / 葛城'],
      ['a2_witness', '証言メモ', '悲鳴 / 葛城 / 転校'],
      ['a2_diary', '詩織の日記', 'パスワード / 姓 / 日付'],
      ['a2_terminal', 'サーバ端末', '照合 / アップロード']
    ];
    const hits = [];
    if (q) {
      const qq = q.toLowerCase();
      files.forEach(function (f) {
        if (f[1].toLowerCase().indexOf(qq) >= 0 || f[2].toLowerCase().indexOf(qq) >= 0) hits.push(f);
      });
    }
    const result = hits.length
      ? '<div class="section-title">検索結果</div><ul class="news-list">'
        + hits.map(function (f) {
          return '<li><button class="lnk" data-page="' + f[0] + '">' + f[1] + '</button></li>';
        }).join('') + '</ul>'
      : '<div class="notice">該当するページはありません。<span class="zh-note">没有找到相关页面。</span></div>';
    return SK.ui.shell.siteShell2(
      '<h1 class="page-title">サイト内検索</h1>'
      + '<div class="page-date">キーワード：' + (q || '（未入力）') + '</div>'
      + result
      + '<p class="tiny">※検索対象：1989年3月10日時点の取材ファイル。'
      + '<span class="zh-note">※搜索范围：1989 年 3 月 10 日时点的取材文件。</span></p>',
      'a2_search'
    );
  }

  /* ------------------------------------------------------------------------
   * 旧校舍服务器终端（第二幕核心谜题）
   * ---------------------------------------------------------------------- */
  function pageA2Terminal() {
    const st = state();
    let body = '';

    if (!st.solved.a2witness) {
      body = '<div class="term-box">'
        + '<div class="section-title">照合クエリ 1/2</div>'
        + '<p>昭和64年3月12日、旧図書室にいた人物として正しい組合せを選べ。'
        + '<span class="zh-note">选择当天在旧图书室里的人物组合。</span></p>'
        + '<button class="puzzle-option" data-act="a2Answer" data-idx="0">藤宮詩織と葛城修'
        + '<span class="zh-note">藤宫诗织与葛城修</span></button>'
        + '<button class="puzzle-option" data-act="a2Answer" data-idx="1">藤宮詩織と校長'
        + '<span class="zh-note">藤宫诗织与校长</span></button>'
        + '<button class="puzzle-option" data-act="a2Answer" data-idx="2">葛城修と山田錠前'
        + '<span class="zh-note">葛城修与山田锁店</span></button>'
        + '<button class="puzzle-option" data-act="a2Answer" data-idx="3">誰もいない'
        + '<span class="zh-note">没有人在</span></button>'
        + '<p class="tiny">※值班表と証言メモを照合してください。'
        + '<span class="zh-note">※请对照值班表与证言笔记。</span></p>'
        + '</div>';
    } else if (!st.solved.a2proof) {
      body = '<div class="term-box">'
        + '<div class="section-title">照合クエリ 2/2</div>'
        + '<p>学校が事故を隠蔽したことを示す記録はどれか？'
        + '<span class="zh-note">哪一份记录能证明学校隐瞒了事故？</span></p>'
        + '<button class="puzzle-option" data-act="a2Proof" data-idx="0">校歌・校章'
        + '<span class="zh-note">校歌・校章</span></button>'
        + '<button class="puzzle-option" data-act="a2Proof" data-idx="1">修繕記録 旧図書室'
        + '<span class="zh-note">修缮记录 旧图书室</span></button>'
        + '<button class="puzzle-option" data-act="a2Proof" data-idx="2">卒業アルバム'
        + '<span class="zh-note">毕业相册</span></button>'
        + '<button class="puzzle-option" data-act="a2Proof" data-idx="3">職員名簿'
        + '<span class="zh-note">职员名册</span></button>'
        + '</div>';
    } else if (!st.solved.a2upload) {
      body = '<div class="term-box">'
        + '<div class="section-title">SERVER UPLOAD</div>'
        + '<p>接続成功。最終稿をアップロードするにはパスワードが必要です。'
        + '<span class="zh-note">连接成功。上传最终稿需要密码。</span></p>'
        + '<p>パスワード：<span class="zh-note">密码</span><br>'
        + '<input id="a2Pass" class="term-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="fujimiya0312"></p>'
        + '<div class="err95" id="a2Error">' + (st.a2Error || '') + '</div>'
        + '<button class="term-button" data-act="a2Upload">UPLOAD' + zhNote('上传') + '</button>'
        + '<p class="tiny">※詩織の日記にパスワードの規則が書かれています。'
        + '<span class="zh-note">※诗织的日记里写着密码规则：姓氏罗马字＋事故日期（月日4位）。</span></p>'
        + '</div>';
    } else {
      body = '<div class="term-box">'
        + '<div class="section-title">UPLOAD COMPLETE</div>'
        + '<p>第12号のデータは校内サーバに保存された。<br>しかし、詩織は旧図書室から戻らなかった。</p>'
        + '<p class="zh-note">第 12 号的数据已保存到校内服务器。但诗织没有从旧图书室回来。</p>'
        + '<p><button class="btn95" data-act="startAct3">三周目へ' + zhNote('进入第三幕') + '</button></p>'
        + '</div>';
    }

    return SK.ui.shell.siteShell2(
      '<h1 class="page-title">旧校舎サーバ端末</h1>' + body,
      'a2_terminal'
    );
  }

  /* ------------------------------------------------------------------------
   * 路由
   * ---------------------------------------------------------------------- */
  const PAGES = {
    a2_editor: pageA2Editor,
    a2_notes: pageA2Notes,
    a2_roster: pageA2Roster,
    a2_duty: pageA2Duty,
    a2_repair: pageA2Repair,
    a2_witness: pageA2Witness,
    a2_diary: pageA2Diary,
    a2_terminal: pageA2Terminal,
    a2_search: pageA2Search
  };

  SK.data.act2 = {
    pages: PAGES,
    render: function (page) {
      const fn = PAGES[page] || PAGES.a2_editor;
      return fn();
    }
  };
})();
