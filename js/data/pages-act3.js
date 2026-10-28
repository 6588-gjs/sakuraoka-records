/* ==========================================================================
 * data/pages-act3.js — 第三幕（2024 / 表网页与里网页）页面
 * 里网页页面首次访问时由 core/router.js 统一登记证据（UNDER_EVIDENCE）。
 * 页面自身只负责渲染，不直接修改状态。
 * ========================================================================== */
(function () {
  'use strict';

  function state() {
    return SK.core.state.get();
  }

  function under() {
    return state().mode === 'under';
  }

  function bi(ja, zh) {
    return SK.ui.shell.bi(ja, zh);
  }

  function zhNote(text) {
    return ' <span class="zh-note">' + text + '</span>';
  }

  /* ------------------------------------------------------------------------
   * 首页（表 / 里两种版本）
   * ---------------------------------------------------------------------- */
  function pageA3Home() {
    const isUnder = under();
    const ja = isUnder
      ? '<div class="notice">ここには、学校が消したものだけが書かれている。</div>'
        + '<div class="section-title">記録から消された名前</div>'
        + '<ul class="news-list">'
        + '<li><span class="news-date">1989</span>藤宮 詩織　死亡</li>'
        + '<li><span class="news-date">2002</span>桜井 花憐　死亡</li>'
        + '<li><span class="news-date">2024</span>桜井 拓也　名前消去中</li>'
        + '</ul>'
        + '<p>表ページは、学校が望んだ記録。<br>裏ページは、記録から消された事実。</p>'
        + '<p class="tiny">※裏ページで証拠を見つけるたび、あなたの名前は削られます。</p>'
      : '<div class="notice">【重要】旧校舎解体まで、あと1日。記録室デジタルアーカイブは本日23:59をもって閉鎖されます。</div>'
        + '<div class="section-title">新着情報</div>'
        + '<ul class="news-list">'
        + '<li><span class="news-date">2024/08/31</span>記録室デジタルアーカイブ 公開終了</li>'
        + '<li><span class="news-date">2002/04/12</span><button class="lnk" data-page="a3_news2002">2年B組 桜井花憐さんについて</button></li>'
        + '<li><span class="news-date">1989/03/15</span><button class="lnk" data-page="a3_news1989">2年A組 藤宮詩織さん、転校</button></li>'
        + '</ul>'
        + '<div class="section-title">校長挨拶</div>'
        + '<p>本校は昭和23年の創立以来、地域に根ざした教育を実践してまいりました。</p>'
        + '<p class="tiny">※このサイトは同窓会によって保存されています。最終更新：2002年4月12日 23:47</p>';
    const zh = isUnder
      ? '<p>这里只写学校抹去的东西。</p>'
        + '<p>【从记录中消失的名字】1989 藤宫诗织 死亡／2002 樱井花怜 死亡／2024 樱井拓也 名字正在消失。</p>'
        + '<p>表网页是学校希望的记录。里网页是被记录抹去的事实。</p>'
        + '<p class="tiny">※每在里网页找到一件证据，你的名字就会被削去一点。</p>'
      : '<p>【重要】旧校舍拆除还有 1 天。档案室数字资料库将于今日 23:59 关闭。</p>'
        + '<p>【最新消息】2024/08/31 数字资料库公开结束；2002/04/12 关于 2 年 B 组 樱井花怜；1989/03/15 2 年 A 组 藤宫诗织转校。</p>'
        + '<p>本校自昭和 23 年创立以来，一直致力于扎根当地的教育。</p>'
        + '<p class="tiny">※本网站由同窗会保存。最后更新：2002 年 4 月 12 日 23:47。</p>';
    return SK.ui.shell.siteShell3(
      '<h1 class="page-title">' + (isUnder ? '100%正直なサイト' : '旧桜丘高校 公式サイト') + '</h1>' + bi(ja, zh),
      'a3_home'
    );
  }

  /* ------------------------------------------------------------------------
   * 学校案内（里版本揭示「真正的沿革」）
   * ---------------------------------------------------------------------- */
  function pageA3About() {
    const isUnder = under();
    const ja = isUnder
      ? '<div class="section-title">このサイトの規則</div>'
        + '<p>1. 表ページには学校が公表した記録が表示されます。<br>'
        + '2. 裏ページには記録から削除された事実が表示されます。<br>'
        + '3. 裏ページは100%正直です。ただし、すべてを話すとは限りません。<br>'
        + '4. 裏ページで証拠を見つけるたび、閲覧者の名前が削られます。<br>'
        + '5. 名前が完全に消えた者は、表ページに戻れません。</p>'
        + '<div class="section-title">本当の沿革</div>'
        + '<p>1989年 藤宮詩織 死亡。学校は転校として処理。<br>'
        + '2002年 桜井花憐 死亡。学校は家出として処理。<br>'
        + '2024年 桜井拓也 名前消去中。現在、この記録を閲覧している。</p>'
        + '<p class="tiny">※このサイトは、詩織が死ぬ直前にアップロードしたバックアップから生まれた。</p>'
      : '<div class="section-title">沿革</div>'
        + '<p>昭和23年 創立<br>昭和40年 校舎増築<br>平成元年 2年B組教室棟完成<br>平成21年 閉校<br>令和6年 旧校舎解体</p>'
        + '<div class="section-title">学校概要</div>'
        + '<p>生徒数：30名（平成14年度）<br>校花：桜<br>校訓：誠実・努力・思いやり</p>'
        + '<p class="tiny">※平成14年度の記録は、一部が欠落しています。</p>';
    const zh = isUnder
      ? '<p>【本站规则】1. 表网页显示学校公开的记录；2. 里网页显示被记录删除的事实；3. 里网页 100% 诚实，但不一定说出全部；'
        + '4. 每在里网页找到一件证据，浏览者的名字就会被削去一点；5. 名字完全消失的人，无法回到表网页。</p>'
        + '<p>【真正的沿革】1989 年藤宫诗织死亡，学校按转校处理。<br>2002 年樱井花怜死亡，学校按离家出走处理。<br>'
        + '2024 年樱井拓也名字正在消失。</p>'
        + '<p class="tiny">※本网站源自诗织死前上传的备份。</p>'
      : '<p>【沿革】昭和 23 年创立／昭和 40 年校舍扩建／平成元年 2 年 B 组教室楼完成／平成 21 年闭校／令和 6 年旧校舍拆除。</p>'
        + '<p>【学校概要】学生数 30 名（平成 14 年度）／校花：樱／校训：诚实・努力・关怀。</p>'
        + '<p class="tiny">※平成 14 年度的记录有一部分缺失。</p>';
    return SK.ui.shell.siteShell3(
      '<h1 class="page-title">' + (isUnder ? '100%正直なサイトについて' : '学校案内') + '</h1>' + bi(ja, zh),
      'a3_about'
    );
  }

  /* ------------------------------------------------------------------------
   * 1989 年旧校报（表 = 转校报道，里 = 死亡通知）
   * ---------------------------------------------------------------------- */
  function pageA3News1989() {
    const isUnder = under();
    const ja = isUnder
      ? '<div class="notice">この生徒は転校していない。死亡している。</div>'
        + '<p>1989年3月12日 16:40<br>場所：旧図書室<br>死因：転落による頭部外傷<br>'
        + '加害者：実習教員 葛城修<br>学校は事故を転校として隠蔽した。</p>'
        + '<p>詩織は校報部員として、学校の推薦枠不正を調査していた。死の直前に証拠を校内サーバへアップロードしている。</p>'
      : '<div class="page-date">発行：1989年3月15日</div>'
        + '<div class="section-title">2年A組 藤宮詩織さん、転校</div>'
        + '<p>藤宮詩織さんが家庭の事情により転校することになりました。クラス一同、彼女の新しい出発を応援しています。</p>'
        + '<p class="tiny">※転校先の学校名は記載されていない。</p>';
    const zh = isUnder
      ? '<p>这名学生没有转校，她已经死了。</p>'
        + '<p>1989 年 3 月 12 日 16:40／地点：旧图书室／死因：坠落导致头部外伤／加害者：实习教师 葛城修。'
        + '学校将事故伪装成转校并隐瞒。</p>'
        + '<p>诗织作为校报部员，正在调查学校推荐名额的不正行为。死前将证据上传到了校内服务器。</p>'
      : '<p>发行：1989 年 3 月 15 日。2 年 A 组藤宫诗织因家庭原因转校，全班同学祝愿她在新环境顺利。</p>'
        + '<p class="tiny">※没有写明转校去向。</p>';
    return SK.ui.shell.siteShell3(
      '<h1 class="page-title">' + (isUnder ? '死亡通知 藤宮詩織' : '旧校報 昭和64年3月号') + '</h1>' + bi(ja, zh),
      'a3_news1989'
    );
  }

  /* ------------------------------------------------------------------------
   * 2002 年学校通讯（表 = 活动报告，里 = 死亡通知）
   * ---------------------------------------------------------------------- */
  function pageA3News2002() {
    const isUnder = under();
    const ja = isUnder
      ? '<div class="notice">この生徒は転校していない。殺害されている。</div>'
        + '<p>2002年4月12日 16:40<br>場所：旧図書室<br>死因：頭部外傷<br>'
        + '加害者：教頭 葛城修<br>遺体は旧図書室奥の封鎖書庫に隠された。<br>学校は家出として処理した。</p>'
        + '<p>最後の目撃時刻は16:40。1989年の事故と同じ時刻が、童謡にも書かれている。</p>'
      : '<div class="section-title">図書委員会 活動報告</div>'
        + '<p>図書委員会では、放課後に旧図書室で資料整理を行っています。今年度も多くの生徒が利用しています。</p>'
        + '<p class="tiny">※2年B組 桜井花憐さんは、家庭の事情により転校したとされています。</p>';
    const zh = isUnder
      ? '<p>这名学生没有转校，她被杀害了。</p>'
        + '<p>2002 年 4 月 12 日 16:40／地点：旧图书室／死因：头部外伤／加害者：教头 葛城修。'
        + '遗体被藏在旧图书室深处的封闭书库。学校按离家出走处理。</p>'
        + '<p>最后目击时间是 16:40。童谣里也写着与 1989 年事故相同的时间。</p>'
      : '<p>图书委员会在放学后使用旧图书室进行资料整理，今年也有许多学生利用。</p>'
        + '<p class="tiny">※2 年 B 组樱井花怜据说是因家庭原因转校。</p>';
    return SK.ui.shell.siteShell3(
      '<h1 class="page-title">' + (isUnder ? '死亡通知 桜井花憐' : '学校だより 平成14年4月号') + '</h1>' + bi(ja, zh),
      'a3_news2002'
    );
  }

  /* ------------------------------------------------------------------------
   * 教职员介绍（里 = 葛城的里记录）
   * ---------------------------------------------------------------------- */
  function pageA3Staff() {
    const isUnder = under();
    const ja = isUnder
      ? '<div class="notice">この男は、二人の生徒を殺している。</div>'
        + '<p>1989年：実習教員として旧図書室で藤宮詩織を死亡させた。事故を転校として隠蔽。<br>'
        + '2002年：教頭として桜井花憐を殺害。遺体を封鎖書庫に隠した。<br>'
        + '2024年：記録室管理者として、桜井拓也の名前を消去中。</p>'
        + '<p>現住所：桜丘町北3-4-1<br>電話：000-000-0000</p>'
      : '<p>校長 山本正雄<br>教頭 葛城修<br>教諭 田中美由美<br>教諭 佐藤隆</p>'
        + '<p class="tiny">※現在、記録室の管理者は葛城修です。</p>';
    const zh = isUnder
      ? '<p>这个男人已经杀了两名学生。</p>'
        + '<p>1989 年：作为实习教师在旧图书室导致藤宫诗织死亡，将事故伪装成转校。<br>'
        + '2002 年：作为教头杀害樱井花怜，将遗体藏在封闭书库。<br>'
        + '2024 年：作为档案室管理员，正在消除樱井拓也的名字。</p>'
        + '<p>现住址：樱丘町北 3-4-1／电话：000-000-0000</p>'
      : '<p>校长 山本正雄／教头 葛城修／教师 田中美由美／教师 佐藤隆。</p>'
        + '<p class="tiny">※目前档案室管理员是葛城修。</p>';
    return SK.ui.shell.siteShell3(
      '<h1 class="page-title">' + (isUnder ? '教職員の裏記録 葛城修' : '教職員紹介') + '</h1>' + bi(ja, zh),
      'a3_staff'
    );
  }

  /* ------------------------------------------------------------------------
   * 图书委员会（里 = 花怜最后的借阅卡）
   * ---------------------------------------------------------------------- */
  function pageA3Library() {
    const isUnder = under();
    const ja = isUnder
      ? '<div class="notice">彼女は、弟を守るためにここへ来た。</div>'
        + '<p>最終貸出：2002年4月12日<br>書名：『桜丘村史』<br>書名：『旧校舎建築図面集』</p>'
        + '<p>貸出票の裏に、花憐の筆跡でこう書かれている。</p>'
        + '<p>「拓也、名前を消される前に、記録室の裏ページを見て。<br>お姉ちゃんは、まだここにいる。」</p>'
      : '<p>平成14年度 図書委員名簿</p>'
        + '<p>3年A組 小林真央 12<br>2年B組 桜井花憐 31<br>2年B組 鈴木美咲 2</p>'
        + '<p class="tiny">※桜井花憐は、平成14年4月12日以降、委員会活動に出席していません。</p>';
    const zh = isUnder
      ? '<p>她是为了保护弟弟才来到这里的。</p>'
        + '<p>最后借出：2002 年 4 月 12 日／书名：《樱丘村史》《旧校舍建筑图集》。</p>'
        + '<p>借阅卡背面，有花怜的笔迹：</p>'
        + '<p>「拓也，在名字被消除之前，去看档案室的里网页。<br>姐姐还在这里。」</p>'
      : '<p>平成 14 年度图书委员名册：3 年 A 组小林真央 12／2 年 B 组樱井花怜 31／2 年 B 组铃木美咲 2。</p>'
        + '<p class="tiny">※樱井花怜在平成 14 年 4 月 12 日以后没有参加委员会活动。</p>';
    return SK.ui.shell.siteShell3(
      '<h1 class="page-title">' + (isUnder ? '桜井花憐 最後の貸出票' : '図書委員会') + '</h1>' + bi(ja, zh),
      'a3_library'
    );
  }

  /* ------------------------------------------------------------------------
   * 同窗会 BBS（里 = 死者的 BBS）
   * ---------------------------------------------------------------------- */
  function pageA3Bbs() {
    const isUnder = under();
    const ja = isUnder
      ? '<div class="notice">ここに書き込めるのは、記録から消された者だけ。</div>'
        + '<p><b>藤宮詩織</b>：私は転校なんかしていない。旧図書室で死んだ。</p>'
        + '<p><b>桜井花憐</b>：お願い。弟の名前を消さないで。</p>'
        + '<p><b>名無しさん</b>：呪いの儀式を探せ。記録室の裏ページにある。</p>'
        + '<p><b>葛城修</b>：このページを閉じろ。</p>'
      : '<div class="section-title">文化祭スレッド</div>'
        + '<p><b>名無しさん</b>：文化祭お疲れさまでした。2年B組の喫茶店、盛況でしたね。</p>'
        + '<p><b>花</b>：写真、後で見せてください。消さないでくださいね。</p>'
        + '<div class="section-title">図書室の鍵</div>'
        + '<p><b>名無しさん</b>：旧図書室の鍵、また壊れてるらしい。</p>'
        + '<p class="tiny">※平成14年4月12日以降の書き込みはありません。</p>';
    const zh = isUnder
      ? '<p>只有被记录抹去的人才能在这里发帖。</p>'
        + '<p>藤宫诗织：我没有转校。我死在旧图书室。<br>樱井花怜：求求你，不要消除弟弟的名字。<br>'
        + '无名氏：去找诅咒仪式，它在档案室的里网页。<br>葛城修：关掉这个页面。</p>'
      : '<p>【文化祭帖子】无名氏：文化祭辛苦了，2 年 B 组的咖啡店很热闹。<br>花：照片之后给我看看吧，请不要删掉。</p>'
        + '<p>【图书室的钥匙】无名氏：旧图书室的锁又坏了。</p>'
        + '<p class="tiny">※平成 14 年 4 月 12 日以后没有新帖。</p>';
    return SK.ui.shell.siteShell3(
      '<h1 class="page-title">' + (isUnder ? '死者たちのBBS' : '同窓会BBS') + '</h1>' + bi(ja, zh),
      'a3_bbs'
    );
  }

  /* ------------------------------------------------------------------------
   * 校长室（里 = 校长的里记录）
   * ---------------------------------------------------------------------- */
  function pageA3Principal() {
    const isUnder = under();
    const ja = isUnder
      ? '<div class="notice">私は、知っていた。</div>'
        + '<p>1989年、藤宮詩織の死亡事故を、学校は転校として処理した。<br>'
        + '2002年、桜井花憐の失踪を、学校は家出として処理した。<br>'
        + '私はどちらも知っていた。学校を守るため、記録を改竄した。</p>'
        + '<p>2024年、最後の始末を葛城に任せた。<br>桜井拓也の名前を、記録から消すように。</p>'
      : '<p>本校は地域に根ざした教育を実践してまいりました。生徒一人ひとりの安全を第一に考え、今後も教育活動に努めてまいります。</p>'
        + '<p>校長 山本正雄</p>';
    const zh = isUnder
      ? '<p>我知情。</p>'
        + '<p>1989 年，藤宫诗织的死亡事故被学校按转校处理。<br>'
        + '2002 年，樱井花怜的失踪被学校按离家出走处理。<br>'
        + '这两件事我都知道。为了保住学校，我篡改了记录。</p>'
        + '<p>2024 年，我把最后的处理交给了葛城，让他把樱井拓也的名字从记录中抹去。</p>'
      : '<p>本校一直致力于扎根当地的教育。我们始终把学生安全放在第一位，今后也会继续推进教育活动。</p>'
        + '<p>校长 山本正雄</p>';
    return SK.ui.shell.siteShell3(
      '<h1 class="page-title">' + (isUnder ? '校長の裏記録' : '校長室') + '</h1>' + bi(ja, zh),
      'a3_principal'
    );
  }

  /* ------------------------------------------------------------------------
   * 记录室（里 = 拓也的抹除日志 + 隐藏页面入口）
   * ---------------------------------------------------------------------- */
  function pageA3Records() {
    const isUnder = under();
    const st = state();
    if (!isUnder) {
      const surface = '<h1 class="page-title">記録室デジタルアーカイブ</h1>'
        + '<div class="section-title">アクセスログ</div>'
        + '<p>最終ログイン：桜井 拓也<br>最終アクセス：2024年8月31日 23:47</p>'
        + '<p>記録室の閉鎖まで、あと数分。</p>'
        + '<p class="tiny">※このページの裏側には、管理者しか見られない記録があります。'
        + zhNote('这个页面的里侧，有只有管理员才能看到的记录。使用「表/裏」按钮切换。') + '</p>';
      return SK.ui.shell.siteShell3(surface, 'a3_records');
    }

    const ja = '<div class="notice">名前消去進行中。残り時間はわずか。</div>'
      + '<p>2024/08/31 23:47 桜井拓也 ログイン<br>'
      + '23:48 職員名簿から桜井拓也を削除<br>'
      + '23:49 写真から顔を削除<br>'
      + '23:50 アクセスログを―――に変更<br>'
      + '23:51 現在も削除処理中</p>'
      + '<p>管理者：葛城 修</p>'
      + '<div class="section-title">隠しページ</div>'
      + '<p>冤死之人的诅咒仪式<br>暗証番号：二人の死んだ月日を、古い順に。</p>'
      + '<p><button class="btn95" data-page="a3_ritual">隠しページを開く'
      + zhNote('打开隐藏页面') + '</button></p>';
    const zh = '<p>【抹除日志 樱井拓也】名字消除进行中，剩余时间不多。</p>'
      + '<p>2024/08/31 23:47 樱井拓也 登录<br>23:48 从职员名册删除樱井拓也<br>23:49 从照片删除脸部<br>'
      + '23:50 把访问日志改为―――<br>23:51 删除处理仍在进行</p>'
      + '<p>管理员：葛城修</p>'
      + '<p>【隐藏页面】冤死之人的诅咒仪式。暗号：两人的死亡月日，按时间顺序。</p>'
      + '<p class="tiny">※点下方按钮打开隐藏页面；按钮始终可见，不受翻译模式影响。</p>';
    return SK.ui.shell.siteShell3(bi('<h1 class="page-title">抹除ログ 桜井拓也</h1>' + ja, '<h1>抹除日志 樱井拓也</h1>' + zh), 'a3_records');
  }

  /* ------------------------------------------------------------------------
   * 诅咒仪式隐藏页（暗号 03120412）
   * ---------------------------------------------------------------------- */
  function pageA3Ritual() {
    const st = state();
    let body = '';
    if (!st.ritualUnlocked) {
      body = '<div class="notice">このページは裏側にしか存在しません。'
        + '<span class="zh-note">这个页面只存在于里侧。</span></div>'
        + '<div class="login-panel"><h2>RITUAL / 暗証番号</h2>'
        + '<p>暗証番号（8桁）：<span class="zh-note">请输入 8 位数字暗号</span></p>'
        + '<div class="login-field"><label for="ritualCode">CODE</label>'
        + '<input id="ritualCode" class="term-input" inputmode="numeric" pattern="[0-9]*" maxlength="12" autocomplete="off" placeholder="8桁"></div>'
        + '<div class="err95" id="ritualError">' + (st.ritualError || '') + '</div>'
        + '<button class="btn95" data-act="unlockRitual">送信' + zhNote('提交') + '</button>'
        + '<p class="tiny" style="margin-top:10px;">ヒント：二人の死んだ月日を、古い順に。1989年3月12日、2002年4月12日。'
        + '<span class="zh-note">提示：把两人的死亡月日按时间顺序排列：1989 年 3 月 12 日、2002 年 4 月 12 日，取月日各 4 位。</span></p>'
        + '</div>';
    } else {
      body = '<div class="notice">このページを読んでいるあなたは、もう表ページには戻れない。'
        + '<span class="zh-note">读到这个页面的你，已经无法回到表网页。</span></div>'
        + '<div class="section-title">儀式の手順</div>'
        + '<p>1. 加害者の名前を、このページの白い欄に三度書く。<br>'
        + '2. 表ページから、加害者の名前が消えるのを確認する。<br>'
        + '3. 裏ページに、加害者の死亡記録が現れる。<br>'
        + '4. 実行者の名前も、サイトに収められる。</p>'
        + '<p>これは復讐の儀式であり、救済ではない。<br>弟を救いたいなら、警察に証拠を届ける方法を探せ。</p>'
        + '<p class="tiny">※詩織が死ぬ直前に残した、最後のページ。</p>'
        + '<div class="zh-box"><b>【中文翻译】</b><br>仪式步骤：1. 在白色栏中写下加害者的名字三次。'
        + '2. 确认表网页中加害者的名字消失。3. 里网页出现加害者的死亡记录。4. 执行者的名字也会被网站收走。<br>'
        + '这是复仇仪式，不是救赎。如果想救弟弟，请寻找把证据交给警察的方法。</div>'
        + '<p style="margin-top:14px;"><button class="btn95" data-page="a3_final">最終選択へ' + zhNote('前往最终选择') + '</button></p>';
    }
    return SK.ui.shell.siteShell3(
      '<h1 class="page-title">' + (st.ritualUnlocked ? '校园怪谈 ―― 冤死之人的诅咒仪式' : '隠しページ ― 暗証入力') + '</h1>' + body,
      'a3_ritual'
    );
  }

  /* ------------------------------------------------------------------------
   * 童谣（表 = 被篡改的怪谈；里 = 原曲 + 谜题）
   * ---------------------------------------------------------------------- */
  function pageA3Rhyme() {
    const isUnder = under();
    const st = state();
    let body = '';
    if (isUnder) {
      body = '<div class="notice">これは、忘れられた者のための歌。'
        + '<span class="zh-note">这是为被遗忘者而作的歌。</span></div>'
        + '<p>夕焼け小焼けの旧校舎に<br>'
        + '四時四十分、影がひとつ<br>'
        + '貸出票に名は残り<br>'
        + '返却棚に花が咲く</p>'
        + '<p>三度呼べば思い出し<br>'
        + '四度呼べば名が返る<br>'
        + '五度目に残るは白い紙<br>'
        + 'そこに書くのは、みんなの名</p>';
      if (!st.solved.a3rhyme) {
        body += '<div class="section-title">問い</div>'
          + '<p>この歌で、名前が戻るのは何度呼んだとき？'
          + '<span class="zh-note">在这首歌里，叫到第几遍名字会回来？</span></p>'
          + '<button class="puzzle-option" data-act="answerRhyme" data-idx="0">二度'
          + '<span class="zh-note">第二遍</span></button>'
          + '<button class="puzzle-option" data-act="answerRhyme" data-idx="1">三度'
          + '<span class="zh-note">第三遍</span></button>'
          + '<button class="puzzle-option" data-act="answerRhyme" data-idx="2">四度'
          + '<span class="zh-note">第四遍</span></button>'
          + '<button class="puzzle-option" data-act="answerRhyme" data-idx="3">五度'
          + '<span class="zh-note">第五遍</span></button>';
      } else {
        body += '<div class="notice">原文を復元した。この歌は、名前を取り戻すための歌だった。'
          + '<span class="zh-note">已复原原文。这首歌是为了夺回名字而作的。</span></div>';
      }
      body += '<div class="zh-box"><b>【中文翻译】</b><br>黄昏的旧校舍里，四点四十分，一道影子。<br>'
        + '借阅卡上名字还在，归还架上花正盛开。<br>叫三遍会被想起，叫四遍名字就会回来。<br>'
        + '第五遍只剩白纸，上面写的是大家的名字。</div>';
    } else {
      body = '<p>夕焼け小焼けの旧校舎に<br>'
        + '四時四十分、影がひとつ<br>'
        + '貸出票に名前はなく<br>'
        + '返却棚に花が散る</p>'
        + '<p>三度呼べば忘れられ<br>'
        + '四度呼べば消される<br>'
        + '五度目に残るは白い紙<br>'
        + 'そこに書くのは、誰の名</p>'
        + '<p class="tiny">※この歌には、元の歌詞が存在するらしい。裏ページで確認できる。'
        + '<span class="zh-note">※这首歌似乎存在原版歌词。可在里网页确认。</span></p>'
        + '<div class="zh-box"><b>【中文翻译】</b><br>黄昏的旧校舍里，四点四十分，一道影子。<br>'
        + '借阅卡上没有名字，归还架上花已散落。<br>叫三遍就会被忘记，叫四遍就会被抹去。<br>'
        + '第五遍只剩白纸，上面写的是谁的名字。</div>';
    }
    return SK.ui.shell.siteShell3(
      '<h1 class="page-title">' + (isUnder ? '残された名前 ― 原曲' : '学校の七不思議「消えた女生徒」') + '</h1>' + body,
      'a3_rhyme'
    );
  }

  /* ------------------------------------------------------------------------
   * 最终选择（4 个结局入口）
   * ---------------------------------------------------------------------- */
  function pageA3Final() {
    const st = state();
    const puzzles = SK.core.puzzles;
    const canPolice = puzzles.canPolice();
    const canCurse = puzzles.canCurse();
    const canTruth = puzzles.canTruth();

    const evHtml = st.evidence.length
      ? st.evidence.map(function (id) {
        const c = SK.data.clues.get(id);
        return '■ ' + c.name + '（' + c.nameZh + '）';
      }).join('<br>')
      : '（なし）';

    function choiceCard(key, titleJa, titleZh, descJa, descZh, enabled, need) {
      return '<div class="choice-card">'
        + '<h3>' + titleJa + ' / ' + titleZh + '</h3>'
        + '<p>' + descJa + '<span class="zh-note">' + descZh + '</span></p>'
        + '<button class="btn95" data-act="chooseEnding" data-ending="' + key + '"'
        + (enabled ? '' : ' disabled') + '>'
        + (enabled ? '実行する' : '条件不足') + zhNote(enabled ? '执行' : '条件未满足')
        + '</button>'
        + '<span class="tiny">必要：' + need + '</span>'
        + '</div>';
    }

    const body = '<div class="notice">拓也の名前が消えるまで、あとわずか。'
      + '<span class="zh-note">距离拓也的名字消失，只剩一点时间。</span></div>'
      + '<div class="section-title">最終選択 / 最终选择</div>'
      + choiceCard('police', '警察に通報する', '向警方报案',
        '1989年と2002年の証拠を警察に送り、拓也を救う。',
        '把 1989 年与 2002 年的证据交给警方，救下拓也。',
        canPolice, '最終報告の証拠（e_final）＋ 葛城の犯罪記録（e_katsuragi）')
      + choiceCard('curse', '呪いを実行する', '发动诅咒',
        '冤死之人的诅咒仪式を発動し、葛城を表ページから消す。',
        '发动诅咒仪式，让葛城从表网页消失。',
        canCurse, '诅咒仪式（e_ritual）＋ 葛城が両事件の犯人（e_killer）')
      + choiceCard('truth', '真実を公開する', '公开真相',
        '100%正直なサイトを表ページに公開し、すべてを明らかにする。',
        '把 100% 诚实的网站公开到表网页，让一切曝光。',
        canTruth, '最終報告の証拠（e_final）＋ 诅咒仪式（e_ritual）＋ 童謡の原文（e_rhyme）＋ 里页证据 6 件')
      + choiceCard('nothing', '何もしない', '什么都不做',
        'ページを閉じ、記録が自然に終わるのを待つ。',
        '关闭页面，让记录自行结束。',
        true, '无（随时可选）')
      + '<div class="zh-box"><b>【中文翻译】</b><br>'
      + '向警方报案：需要最终报告证据与葛城修的犯罪记录。<br>'
      + '发动诅咒：需要诅咒仪式与「葛城修是两起事件凶手」的证据。<br>'
      + '公开真相：需要最终报告证据、诅咒仪式、童谣原文，以及全部 6 件里页证据。<br>'
      + '什么都不做：随时可以选择。</div>'
      + '<details class="hint-spoiler" style="margin-top:14px;">'
      + '<summary>現在の証拠一覧 / 当前证据（' + st.evidence.length + ' 件）</summary>'
      + '<p class="tiny">' + evHtml + '</p></details>';

    return SK.ui.shell.siteShell3(
      '<h1 class="page-title">最終選択</h1>' + body,
      'a3_final'
    );
  }

  /* ------------------------------------------------------------------------
   * 第三幕站内搜索
   * ---------------------------------------------------------------------- */
  function pageA3Search() {
    const st = state();
    const q = (st.searchQuery || '').trim();
    let hits = [];
    if (q) {
      const qq = q.toLowerCase();
      const all = [
        ['a3_news1989', '1989年 旧校報'],
        ['a3_news2002', '2002年 学校だより'],
        ['a3_staff', '教職員紹介'],
        ['a3_library', '図書委員会'],
        ['a3_bbs', '同窓会BBS'],
        ['a3_principal', '校長室'],
        ['a3_records', '記録室'],
        ['a3_about', '学校案内']
      ];
      all.forEach(function (x) {
        if (x[1].toLowerCase().indexOf(qq) >= 0) hits.push(x);
      });
      if (st.mode === 'under' && (q.indexOf('呪') >= 0 || q.indexOf('儀式') >= 0 || q.indexOf('仪式') >= 0)) {
        hits.push(['a3_ritual', '冤死之人的诅咒仪式']);
      }
      if (q.indexOf('拓也') >= 0 || q.indexOf('抹除') >= 0) hits.push(['a3_records', '抹除ログ 桜井拓也']);
      if (q.indexOf('詩織') >= 0 || q.indexOf('诗织') >= 0) hits.push(['a3_news1989', '死亡通知 藤宮詩織']);
      if (q.indexOf('花憐') >= 0 || q.indexOf('花怜') >= 0) hits.push(['a3_library', '桜井花憐 最後の貸出票']);
      if (q.indexOf('葛城') >= 0) hits.push(['a3_staff', '教職員の裏記録 葛城修']);
    }
    const result = hits.length
      ? '<div class="section-title">検索結果</div><ul class="news-list">'
        + hits.map(function (x) {
          return '<li><button class="lnk" data-page="' + x[0] + '">' + x[1] + '</button></li>';
        }).join('') + '</ul>'
      : '<div class="notice">該当するページはありません。<span class="zh-note">没有找到相关页面。</span></div>';
    return SK.ui.shell.siteShell3(
      '<h1 class="page-title">サイト内検索</h1>'
      + '<div class="page-date">キーワード：' + (q || '（未入力）') + '</div>'
      + result
      + '<p class="tiny">※検索対象：' + (st.mode === 'under' ? '裏ページ' : '表ページ')
      + '<span class="zh-note">※搜索范围：' + (st.mode === 'under' ? '里网页' : '表网页') + '</span></p>',
      'a3_search'
    );
  }

  /* ------------------------------------------------------------------------
   * 路由
   * ---------------------------------------------------------------------- */
  const PAGES = {
    a3_home: pageA3Home,
    a3_about: pageA3About,
    a3_news1989: pageA3News1989,
    a3_news2002: pageA3News2002,
    a3_staff: pageA3Staff,
    a3_library: pageA3Library,
    a3_bbs: pageA3Bbs,
    a3_principal: pageA3Principal,
    a3_records: pageA3Records,
    a3_ritual: pageA3Ritual,
    a3_rhyme: pageA3Rhyme,
    a3_final: pageA3Final,
    a3_search: pageA3Search
  };

  SK.data.act3 = {
    pages: PAGES,
    render: function (page) {
      const fn = PAGES[page] || PAGES.a3_home;
      return fn();
    }
  };
})();
