/* ==========================================================================
 * data/ui-text.js — 系统界面文案（简体中文为主，附日文副标题）
 * 剧情页面内的文案属于「游戏世界」，保持日文原文 + 中文翻译双语显示；
 * 系统菜单、设置、按钮等一律使用简体中文。
 * ========================================================================== */
(function () {
  'use strict';

  const UI = {
    /* 产品信息 */
    product: {
      nameZh: '旧樱丘高中记录室残存档案',
      nameJa: '旧桜丘高校 記録室残存ファイル',
      nameEn: 'Sakuraoka High School: Records Room Remaining Files',
      version: 'V1.1.0',
      developer: '旧樱丘记录室工作室',
      packageName: 'com.sakuraoka.records',
      age: '16+',
      genre: '冒险 / 解谜 / 悬疑 / 文字剧情',
      tagline: '旧校拆除前夜，你打开姐姐留下的档案室，用证据拼出被学校抹去的名字。',
      archNote: '1998 年日式 IE6 复古校园网站风格',
      build: '2026.10.28',
      copyright: '© 2026 旧樱丘记录室工作室（占位名，可替换）'
    },

    /* 浏览器 chrome */
    chrome: {
      titlePrefix: '旧桜丘高等学校 - Microsoft Internet Explorer',
      back: '戻る',
      backZh: '后退',
      forward: '進む',
      refresh: '更新',
      home: 'ホーム',
      board: '推理',
      hint: '提示',
      modeSurface: '表頁',
      modeUnder: '裏頁',
      modeTip: '切换表 / 里网页',
      menu: '菜单',
      menuTitle: '系統メニュー',
      translate: '翻訳',
      address: 'アドレス(D)',
      go: '移動',
      act1: 'FIRST FILE / 2024',
      act2: 'SECOND FILE / 1989',
      act3: 'THIRD FILE / 2024',
      protect: '保護モード: オフ',
      evidenceUnit: '件',
      nameLeft: '花憐の名前残量',
      takuya: '拓也の名前',
      mood: 'MODE'
    },

    /* 标题界面 */
    title: {
      winTitle: '記録室端末 ― 起動',
      start: '开始游戏',
      startSub: '最初から / New Game',
      continue: '继续游戏',
      continueSub: '前回の続きから',
      continueEmpty: '没有可继续的存档',
      gallery: '结局鉴赏',
      gallerySub: '見た結末を振り返る',
      settings: '设置',
      about: '关于',
      close: '关闭',
      newGameConfirm: '开始新游戏会覆盖当前自动存档，确定吗？',
      badgeOffline: '离线可玩 · 无内购 · 无广告',
      hint: '建议在安静环境下佩戴耳机体验。首次游玩约 30–60 分钟。'
    },

    /* 首次启动语言选择 */
    lang: {
      winTitle: '言語の選択 ― 初回起動',
      lead: '请选择游戏内文本的显示语言。系统菜单始终使用简体中文，之后可在「设置」中随时更改。',
      zhTitle: '简体中文',
      zhSub: '仅显示中文翻译',
      jaTitle: '日本語',
      jaSub: '仅显示日文原文',
      bothTitle: '双语（推荐）',
      bothSub: '日文原文 + 中文翻译框',
      confirm: '确定并继续',
      note: '提示：默认选中「双语」。日文原文保留 1998 年日式校园网站的氛围，中文翻译框保证剧情可读。'
    },

    /* 启动剧情 */
    intro: {
      winTitle: '記録室端末 ― 起動',
      titleJa: '旧桜丘高校 記録室残存ファイル',
      titleZh: '旧樱丘高中记录室残存档案',
      subtitle: '― 桜井花憐失踪事件 ―',
      boot: '端末を起動',
      bootZh: '打开记录室',
      progress: 'DIAL-UP 接続完了 / 33.6kbps'
    },

    /* 过场 */
    cutscene: {
      next: '继续',
      nextZh: '次へ',
      sub: 'RECORDS ROOM / MEMORY TRACE',
      skipHint: '点击「继续」进入下一幕'
    },

    /* 结局 */
    ending: {
      kicker: 'THE END / 三周目',
      finalLine: '桜井花憐 ／ 桜井拓也 ／ 藤宮詩織',
      unlockToday: '本次达成新结局',
      alreadyUnlocked: '该结局此前已收录',
      countLabel: '结局收集',
      actions: {
        gallery: '结局鉴赏',
        restart: '重新开始',
        title: '返回标题'
      },
      recordHint: '达成记录已保存到本机（sakuraoka.endings.v1）'
    },

    /* 系统菜单 */
    menu: {
      title: '系統メニュー / 系统菜单',
      board: '推理板',
      boardSub: '合成证据',
      hint: '提示',
      hintSub: '查看当前目标',
      gallery: '结局鉴赏',
      gallerySub: '已解锁结局',
      settings: '设置',
      settingsSub: '语言 / 字号 / 音效',
      about: '关于本作',
      aboutSub: '版本与声明',
      privacy: '隐私说明',
      privacySub: '不收集任何信息',
      titleScreen: '返回标题',
      close: '关闭菜单',
      saveInfo: '自动存档',
      saveExists: '已有自动存档（本机）',
      saveNone: '暂无存档',
      saveNote: '游戏进度会自动保存在本机浏览器中，不上传、不联网。'
    },

    /* 设置 */
    settings: {
      title: '设置',
      language: '文本语言',
      languageSub: '剧情内容的显示方式',
      fontSize: '字号',
      fontSizeSub: '调整全部文字大小',
      sound: '音效',
      soundSub: '由 WebAudio 合成的点击 / 翻页 / 静电声',
      soundOn: '开启',
      soundOff: '关闭',
      privacy: '隐私说明',
      privacySub: '本游戏不收集任何个人信息',
      tapTitle: 'TapTap 账号（可选）',
      tapSub: '登录仅用于显示昵称，不影响任何游戏内容与进度',
      tapLogin: 'TapTap 登录（可选）',
      tapLogout: '退出登录',
      tapGuest: '游客模式',
      tapLoggedIn: '已登录',
      clear: '清除存档',
      clearSub: '删除自动存档与结局收集记录',
      version: '版本信息',
      close: '关闭',
      fsSmall: '小',
      fsMedium: '中',
      fsLarge: '大',
      langZh: '中文',
      langJa: '日本語',
      langBoth: '双语',
      versionText: '旧樱丘高中记录室残存档案  V1.1.0\n构建：2026.10.28　包名：com.sakuraoka.records\n运行平台：TapTap H5 / 移动浏览器 / 桌面浏览器\n离线可玩 · 无第三方 SDK · 无网络请求'
    },

    /* 清除存档确认 */
    clearConfirm: {
      title: '清除存档 ― 确认',
      body: '确定要清除本机的自动存档与 4 个结局的收集记录吗？此操作无法撤销。',
      body2: '清除后，标题界面的「继续游戏」将不可用，结局鉴赏会恢复为全部未解锁。',
      confirm: '确认清除',
      cancel: '取消'
    },

    /* 结局鉴赏 */
    gallery: {
      title: '结局鉴赏',
      count: '已解锁',
      locked: '未解锁',
      lockedTitle: '？？？？',
      lockedDesc: '条件未达成。继续调查记录室，做出你的最终选择。',
      condition: '达成条件',
      unlockedBadge: '已收录',
      lockedBadge: '未解锁',
      close: '关闭',
      tip: '提示：4 个结局都可以在最终选择页达成，其中「什么都不做」随时可选。'
    },

    /* 关于 */
    about: {
      title: '关于本作',
      overviewTitle: '作品简介',
      overview: '《旧樱丘高中记录室残存档案》是一款以 1998 年日式校园网站为舞台的互动叙事解谜游戏。旧校拆除前夜，主人公樱井拓也打开姐姐留下的数字档案室，在三幕时空中收集证据、在推理板上合成线索，最终决定被抹去的名字能否回到记录里。',
      typeTitle: '基本信息',
      typeLine: '类型：冒险 / 解谜 / 悬疑 / 文字剧情',
      ageLine: '适龄提示：16+（含死亡、悬疑、灵异文字描写，无血腥画面）',
      platformLine: '平台：TapTap H5 小游戏 / 移动浏览器 / 桌面浏览器',
      offlineLine: '网络：完全离线，无内购，无广告，无第三方 SDK',
      versionLine: '版本：V1.1.0（构建 2026.10.28）',
      controlTitle: '操作说明',
      control: '触屏：点击链接与按钮推进剧情；推理板点选两张证据后点击「推理」合成；桌面端可使用拖拽。顶部工具栏可后退、回首页、切换表 / 里网页、查看提示；右上角菜单可进入推理板、设置与结局鉴赏。',
      saveTitle: '存档说明',
      save: '游戏会在每次操作后自动保存到本机浏览器（localStorage）。刷新或关闭页面后，可在标题界面选择「继续游戏」。本作不收集任何个人信息，存档不会上传。',
      tapTitle: 'TapTap 账号（可选）',
      tapBody: '在 TapTap 小游戏环境中可选择登录 TapTap 账号，仅用于显示昵称，不写入游戏存档、不改变任何玩法。登录入口完全可选：取消登录或以游客模式游玩，同样可以完整体验三幕故事与全部 4 个结局。',
      tapGuestNote: '当前未检测到 TapTap 小游戏环境，将以游客模式游玩。游戏全部功能不受影响，也不会有任何权限请求。',
      tapLoggedAs: '当前已登录 TapTap：',
      tapLogin: 'TapTap 登录（可选）',
      tapLogout: '退出登录',
      legalTitle: '声明',
      legal: '本作故事、人物、学校与事件均为虚构，与现实中的人物、团体、学校无关。',
      close: '关闭'
    },

    /* 隐私说明 */
    privacy: {
      title: '隐私说明',
      intro: '本游戏为单机离线 H5 游戏。我们尽可能减少对设备与个人信息的接触，具体说明如下：',
      items: [
        '不收集任何个人信息（不请求姓名、手机号、位置、通讯录、相册、麦克风、摄像头等权限）。',
        '不进行任何网络请求：游戏所需的全部代码、样式、图片与文本都包含在本地包体内，断网可完整通关。',
        '不集成第三方 SDK、统计工具、广告或支付功能，无内购。',
        '游戏进度、设置与结局收集仅保存在本机浏览器 localStorage 中，键名为 sakuraoka.save.v1、sakuraoka.endings.v1、sakuraoka.settings.v1；不会上传到任何服务器。',
        '如需删除本机数据：设置 →「清除存档」，或清除浏览器站点数据即可。',
        '音效由浏览器 WebAudio 实时合成，不加载任何音频文件，也不访问麦克风。'
      ],
      close: '关闭'
    },

    /* 推理板 */
    board: {
      head: '調査メモ / 推理ボード',
      back: '戻る',
      evidenceTitle: '証拠リスト',
      tip: '点选两张证据 → 点击「推理」合成。桌面端也可把证据拖到板面、把一张卡拖到另一张卡上合成。',
      empty: '还没有任何证据。请先在剧情中收集证据。',
      selectedOne: '已选择：{name}（再选一张）',
      selectedNone: '未选择证据',
      selectedCount: '已选择 {n} / 2',
      combine: '推理',
      clear: '取消选择',
      boardNote: '把两张相关的证据放在一起\n新的推理就会浮现',
      noRecipe: '这两件证据无法建立联系。',
      exists: '这个推理已经在板上了。',
      combined: '新的推理：{name}',
      selectTip: '点选证据卡进行合成',
      removeTip: '再点一次取消选择',
      resetBoard: '整理板面'
    },

    /* 轻提示 */
    toast: {
      evidence: '获得证据：{name}',
      saved: '进度已自动保存',
      loaded: '已读取存档，继续调查。',
      saveCleared: '存档与结局记录已清除。',
      saveUnavailable: '本机无法写入存档（浏览器限制），当前进度仅保存在内存中。',
      loginStudent: '已登录学生账号。',
      loginTeacher: '已登录教职员账号。',
      logout: '已登出档案室。',
      wrongPassword: 'ID 或密码错误。',
      noPrivilege: '没有查看该文档的权限。',
      teacherLocked: '请先完成学生记录推理，才能登录教职员账号。',
      a1Unlocked: '封印文件已解除。',
      a1Wrong: '暗号不正确。',
      a2WitnessOk: '对照成功。',
      a2Wrong: '与证言不一致。',
      a2ProofOk: '已锁定证据文档。',
      a2ProofWrong: '还不足以锁定隐瞒行为的证据。',
      a2UploadOk: '上传完成。数据已保存到校内服务器。',
      a2UploadWrong: '密码错误。',
      ritualUnlocked: '隐藏页面已解锁。',
      ritualWrong: '暗号不正确。',
      rhymeOk: '已复原童谣原文。',
      rhymeWrong: '与歌词不一致。',
      noSave: '没有找到可继续的存档。',
      endingRecorded: '结局已收录：{name}',
      modeUnder: '已切换到里网页。',
      modeSurface: '已回到表网页。',
      jumpBlocked: '该页面暂时无法访问。',
      needMore: '证据还不够，继续调查吧。',
      boardEmpty: '推理板还没有证据。',
      langChanged: '语言已切换。',
      soundOn: '音效已开启。',
      soundOff: '音效已关闭。',
      newGame: '新游戏开始。',
      tapLoginOk: '已登录 TapTap：{name}',
      tapLoginFail: '当前为游客模式，不影响游玩。',
      tapUnavailable: '当前环境未接入 TapTap，已按游客模式继续。',
      tapLogout: '已退出 TapTap 登录，仍可正常游玩。'
    },

    /* 提示系统 */
    hint: {
      title: '提示 / 現在の目標',
      act1: '第一幕 / 2024 — 記録室',
      act2: '第二幕 / 1989 — 校報編集室',
      act3: '第三幕 / 2024 — 100%正直なサイト',
      goalLabel: '当前目标',
      stepsLabel: '行动建议',
      spoiler: '实在卡住时（含答案）',
      close: '知道了',
      foot: '提示会随进度自动变化；也可以随时打开本面板确认当前目标。'
    },

    /* 通用按钮 */
    common: {
      close: '关闭',
      ok: '确定',
      cancel: '取消',
      back: '返回',
      menu: '菜单'
    }
  };

  SK.data.ui = UI;
})();
