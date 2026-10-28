/* ==========================================================================
 * data/clues.js — 证据数据、合成配方、里页证据映射
 * 原版 19 件证据 + 童谣 1 件，共 20 件；合成配方沿用原版 RECIPES。
 * 每条证据同时提供日文原文（ja）与完整中文（zh），供双语模式展示。
 * ========================================================================== */
(function () {
  'use strict';

  /* 证据表：tag = 卡片标签，name/desc = 日文，nameZh/descZh = 中文 */
  const CLUES = {
    c31: {
      tag: '31',
      name: '第31号の存在',
      nameZh: '第31号的存在',
      desc: '出席簿には31番まである。',
      descZh: '出席簿上明明有第31号。'
    },
    c_photo: {
      tag: 'PHOTO',
      name: '写真の31人目',
      nameZh: '照片里的第31人',
      desc: '集合写真には31人写っている。',
      descZh: '集体照里拍到了31个人。'
    },
    c_registry: {
      tag: '30',
      name: '学籍簿の欠落',
      nameZh: '学籍簿的缺失',
      desc: '学籍簿は30名しかいない。',
      descZh: '学籍簿上只有30名学生。'
    },
    c_name: {
      tag: 'NAME',
      name: '桜井花憐の記録',
      nameZh: '樱井花怜的记录',
      desc: '図書貸出票に名前と学籍番号31が残る。',
      descZh: '图书借阅卡上留下了名字与学号31。'
    },
    c_exist: {
      tag: 'EXIST',
      name: '第31号は実在した',
      nameZh: '第31号确实存在',
      desc: '出席簿と写真が一致する。',
      descZh: '出席簿与照片互相印证。'
    },
    c_erased: {
      tag: 'ERASE',
      name: '記録は意図的に消された',
      nameZh: '记录是有意被抹消的',
      desc: '学籍簿だけが31番を欠いている。',
      descZh: '只有学籍簿缺了第31号。'
    },
    c_coverup: {
      tag: 'COVER',
      name: '職員会議の指示',
      nameZh: '职员会议的指示',
      desc: '「転校扱いで処理する」と記されたメモ。',
      descZh: '写着「按转校处理」的会议记录。'
    },
    c_lock: {
      tag: 'KEY',
      name: '内鍵交換の記録',
      nameZh: '内锁更换记录',
      desc: '4月13日、葛城修の依頼で旧図書室の鍵を交換。',
      descZh: '4月13日，应葛城修要求更换旧图书室门锁。'
    },
    c_conspiracy: {
      tag: 'COVER2',
      name: '学校ぐるみの隠蔽',
      nameZh: '学校上下合谋隐瞒',
      desc: '鍵の交換と職員会議の指示が一致する。',
      descZh: '换锁记录与职员会议指示完全吻合。'
    },
    e_shiori: {
      tag: '1989',
      name: '藤宮詩織の死亡記録',
      nameZh: '藤宫诗织的死亡记录',
      desc: '1989年、旧図書室で死亡。学校は転校として処理した。',
      descZh: '1989年死于旧图书室。学校按转校处理。'
    },
    e_karen: {
      tag: '2002',
      name: '桜井花憐の死亡記録',
      nameZh: '樱井花怜的死亡记录',
      desc: '2002年4月12日、旧図書室で殺害。遺体は封鎖書庫に隠された。',
      descZh: '2002年4月12日在旧图书室被杀害，遗体藏在封闭书库。'
    },
    e_katsuragi: {
      tag: 'SUSPECT',
      name: '葛城修の犯罪記録',
      nameZh: '葛城修的犯罪记录',
      desc: '1989年と2002年の事件に関与。現在も記録室の管理者。',
      descZh: '与1989年、2002年两起事件有关，如今仍是档案室管理员。'
    },
    e_message: {
      tag: 'VOICE',
      name: '花憐の残響',
      nameZh: '花怜的残响',
      desc: '「拓也、名前を消される前に記録室の裏ページを見て」',
      descZh: '「拓也，在名字被消除之前，去看档案室的里网页。」'
    },
    e_log: {
      tag: 'LOG',
      name: '拓也の抹除ログ',
      nameZh: '拓也的抹除日志',
      desc: '2024年8月31日、桜井拓也の名前がリアルタイムで消去中。',
      descZh: '2024年8月31日，樱井拓也的名字正在被实时抹除。'
    },
    e_ritual: {
      tag: 'RITUAL',
      name: '冤死之人的诅咒仪式',
      nameZh: '冤死之人的诅咒仪式',
      desc: '加害者の名前を三度書き、表ページから消す。実行者の名前も代償になる。',
      descZh: '写下加害者名字三次，将其从表网页抹去；执行者的名字也会成为代价。'
    },
    e_pattern: {
      tag: 'PATTERN',
      name: '二つの事件は同型',
      nameZh: '两起事件同构',
      desc: '1989年と2002年、同じ場所で同じ隠蔽が行われた。',
      descZh: '1989年与2002年，在同一地点发生了同样的隐瞒。'
    },
    e_killer: {
      tag: 'KILLER',
      name: '葛城修が両事件の犯人',
      nameZh: '葛城修是两起事件的凶手',
      desc: '記録を繋ぐと、同じ人物が浮かび上がる。',
      descZh: '把记录连起来，同一个人的身影浮现出来。'
    },
    e_rescue: {
      tag: 'RESCUE',
      name: '拓也の名前を戻す方法',
      nameZh: '恢复拓也名字的方法',
      desc: '抹除ログと花憐の残響が、名前を復元する手順を示す。',
      descZh: '抹除日志与花怜的残响，指出了恢复名字的步骤。'
    },
    e_final: {
      tag: 'FINAL',
      name: '最終報告の証拠',
      nameZh: '最终报告证据',
      desc: '全ての証拠が一本の線で繋がった。',
      descZh: '所有证据连成了一条完整的线。'
    },
    e_rhyme: {
      tag: 'RHYME',
      name: '童謡の改変',
      nameZh: '童谣的篡改',
      desc: '元の歌では「四度呼べば名が返る」。名前を取り戻す歌だった。',
      descZh: '原版歌谣里是「叫第四遍，名字就会回来」——那是夺回名字的歌。'
    }
  };

  /* 合成配方（无序：a 与 b 可互换） */
  const RECIPES = [
    { a: 'c31', b: 'c_photo', result: 'c_exist' },
    { a: 'c31', b: 'c_name', result: 'c_exist' },
    { a: 'c_exist', b: 'c_registry', result: 'c_erased' },
    { a: 'c_lock', b: 'c_coverup', result: 'c_conspiracy' },
    { a: 'e_shiori', b: 'e_karen', result: 'e_pattern' },
    { a: 'e_pattern', b: 'e_katsuragi', result: 'e_killer' },
    { a: 'e_log', b: 'e_message', result: 'e_rescue' },
    { a: 'e_killer', b: 'e_rescue', result: 'e_final' }
  ];

  /* 里网页页面 → 首次访问获得的证据 */
  const UNDER_EVIDENCE = {
    a3_news1989: 'e_shiori',
    a3_news2002: 'e_karen',
    a3_staff: 'e_katsuragi',
    a3_library: 'e_message',
    a3_records: 'e_log'
  };

  /* 「名字残量」与「真结局」计数所依据的 6 件里页证据 */
  const BASE_UNDER_EVIDENCE = [
    'e_shiori',
    'e_karen',
    'e_katsuragi',
    'e_message',
    'e_log',
    'e_ritual'
  ];

  /* 第一幕学生 / 教师账户（原版谜题答案，不变） */
  const ACCOUNTS = {
    student: { id: 's031', password: 'karen031' },
    teacher: { id: 'katsuragi', password: 'sakura2002' }
  };

  /* 第一幕封印文件 / 第二幕上传密码 / 第三幕仪式暗号 / 童谣答案 */
  const ANSWERS = {
    a1Lock: '0413',
    a2Upload: 'fujimiya0312',
    ritual: '03120412',
    rhymeIndex: 2
  };

  SK.data.clues = {
    CLUES: CLUES,
    RECIPES: RECIPES,
    UNDER_EVIDENCE: UNDER_EVIDENCE,
    BASE_UNDER_EVIDENCE: BASE_UNDER_EVIDENCE,
    ACCOUNTS: ACCOUNTS,
    ANSWERS: ANSWERS,
    /* 取单条证据；未知 id 返回占位对象，避免渲染报错 */
    get: function (id) {
      return CLUES[id] || { tag: '?', name: id, nameZh: id, desc: '', descZh: '' };
    }
  };
})();
