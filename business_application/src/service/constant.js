module.exports = {
  REQUEST_SUCCESS: 200,
  CHUNK_SIZE: 40*1024*1024, //分片大小
  BIZSTATUS: {//已办事项状态
    '0': '待发',
    '1': '在办',
    '2': '办结',
    '3':'挂起',
    '4':'作废'
  },
  TODOBIZSTATUS: {//待办事项状态
    '0': '未收未办',
    '1': '已收未办',
    '2': '已收已办'
  },
  TASKSTATUS: {//传阅事项状态
    '0': '未阅',
    '1': '未阅',
    '2': '已阅'
  },
  ALLTASKSTATUS: {
    '0': '待办事项',
    '1': '已发事项',
    '2': '已办事项'
  },

  SEARCHCOLUMN: [
    {
      key: "BIZ_TITLE",
      title: '标题',
      type: 'TODO,DONE,SEND,CIRCULATE,ALL,TRACE,TRUSTED,TRUST,CATEGORY,MONITOR,CMA_TODO',//DONE,,,ALL,CATEGORY
    },
    {
      key: "DRAFT_USER_NAME",
      title: '拟稿人',
      type: 'TODO,DONE,SEND,ALL,CATEGORY,MONITOR,CMA_TODO',
    },
    {
      key: "DRAFT_TIME",
      title: '拟稿时间',
      type: 'TODO,DONE,SEND,ALL,CATEGORY,MONITOR,CMA_TODO',
    },
    {
      key: "DRAFT_DEPT_NAME",
      title: '拟稿部门',
      type: 'TODO,DONE,SEND,ALL,CMA_TODO',
    },
    {
      key: "SUSER_NAME",
      title: '送办人',
      type: 'TODO,TRUST,CMA_TODO',
    },
    {
      key: "START_TIME",
      title: '送办时间',
      type: 'TODO,CMA_TODO'
    },
    {
      key: "SUSER_DEPT_NAME",
      title: '送办部门',
      type: 'TODO,CMA_TODO',
    },
    {
      key: "BIZ_SOL_NAME",
      title: '业务类型',
      type: 'TODO,DONE,SEND,CIRCULATE,ALL,TRACE,TRUSTED,TRUST,CATEGORY,MONITOR,CMA_TODO',
    },
    {
      key: 'TRUST_USER_NAME',
      title: '委托人',
      type: 'TRUSTED'
    },
    {
      key: 'TRUST_START_TIME',
      title: '委托时间',
      type: 'TRUSTED,TRUST'
    },
    {
      key: 'BE_TRUST_USER_NAME',
      title: '受委托人',
      type: 'TRUST'
    },
    {
      key: "END_TIME",
      title: '办理时间',
      type: 'DONE'//todo没有
    },
    {
      key: "SUSER_NAME",
      title: '传阅人',
      type: 'CIRCULATE'//todo没有
    },
    {
      key: "START_TIME",
      title: '传阅时间',
      type: 'CIRCULATE'//todo没有
    },
    {
      key: "TASK_STATUS",
      title: '阅读状态',
      type: 'CIRCULATE,'//todo没有
    },
    {
      key: "BIZ_STATUS",
      title: '办理状态',
      type: "DONE,SEND,CIRCULATE,ALL,TRACE,TRUSTED,TRUST,CATEGORY,MONITOR"
    },
    {
      key: "TASK_STATUS",
      title: '办理状态(环节)',
      type: "TODO"
    },
    {
      key: "ACT_NAME",
      title: '当前环节',
      type: "DONE"//todo没有
    },
    {
      key: "END_TIME",
      title: '阅读时间',
      type: "CIRCULATE"//todo没有
    },
    {
      key: "ACT_NAME",
      title: '当前环节',
      type: "SEND,ALL,TRACE,TRUSTED,TRUST,TODO,CIRCULATE"
    },
    {
      key: 'TASK_STATUS',
      title: '事项状态',
      type: 'ALL'
    },
    {
      key:"DONE_ACT_NAME",
      title:"办理环节",
      type:"TRUSTED,TRUST,DONE"
    },
    {
      key:"ORG_NAME",
      title:"单位",
      type:"CMA_TODO"
    },
    {
      key:"MONEY",
      title:"金额",
      type:"CMA_TODO"
    },
    {
      key:"CARD",
      title:"报账卡",
      type:"CMA_TODO"
    }
  ],
  DEFAULTCOLUMN: {
    TODO: 'BIZ_TITLE,DRAFT_USER_NAME,DRAFT_TIME,DRAFT_DEPT_NAME,SUSER_NAME,START_TIME,BIZ_SOL_NAME',
    SEND: 'BIZ_TITLE,DRAFT_USER_NAME,DRAFT_TIME,DRAFT_DEPT_NAME,BIZ_STATUS,BIZ_SOL_NAME',
    DONE: 'BIZ_TITLE,DRAFT_USER_NAME,DRAFT_TIME,DRAFT_DEPT_NAME,BIZ_STATUS,END_TIME,BIZ_SOL_NAME,ACT_NAME,DONE_ACT_NAME',
    CIRCULATE: 'BIZ_TITLE,SUSER_NAME,START_TIME,TASK_STATUS,BIZ_STATUS,BIZ_SOL_NAME,ACT_NAME',
    ALL: 'BIZ_TITLE,DRAFT_USER_NAME,DRAFT_TIME,DRAFT_DEPT_NAME,BIZ_STATUS,BIZ_SOL_NAME,TASK_STATUS',
    TRACE: 'BIZ_TITLE,BIZ_SOL_NAME,BIZ_STATUS,ACT_NAME',
    TRUST: 'BIZ_TITLE,BIZ_SOL_NAME,BIZ_STATUS,BE_TRUST_USER_NAME,TRUST_START_TIME,ACT_NAME,SUSER_NAME,DONE_ACT_NAME',
    TRUSTED: 'BIZ_TITLE,BIZ_SOL_NAME,BIZ_STATUS,TRUST_USER_NAME,TRUST_START_TIME,ACT_NAME,DONE_ACT_NAME',
    CATEGORY: 'BIZ_TITLE,DRAFT_USER_NAME,DRAFT_TIME,BIZ_STATUS,BIZ_SOL_NAME',
    MONITOR: "BIZ_TITLE,DRAFT_USER_NAME,DRAFT_TIME,BIZ_STATUS,BIZ_SOL_NAME"
  },
  TEMPLETE: {
    WORD: '正文',
    PDF: 'PDF',
    ANNEX: '关联文档'
  },
  DETAILTASKSTATUS: {
    'DRAFT': '拟稿',
    'SEND': '送交',
    'BACK': '驳回',
    'RECOVER': '撤回',
    'RETURN': '转办',
    'CIRCULATE': '传阅',
    'TRUSTED': "委托",
    'ACTIVATE': '流程激活',
    'INVALID':'作废'
  },
  MOBILEDETAILTASKSTATUS: {
    'BACK': '驳回',
    'RECOVER': '撤回',
    'RETURN': '转办',
    'TRUSTED': "委托",
    'ACTIVATE': '流程激活'
  },
  PAGESIZE: ['5', '10', '15'],
  MAKEACTION: {
    RECOVER: '撤',
    BACK: '驳',
    RETURN: '转',
    TRUSTED: '委',
    DRAFT: '',
    SEND: '',
  },
  TIMES_FILTER: [
    { name: '时间最近', value: '1' },
    { name: '时间最远', value: '2' },
  ],
  COLOR: {
    green: '#50ac50',
    grey: '#aaafbd',
    red: '#fa2c19',
    yellow: '#ea9743',
  },
  USER_SCREEN_TYPE: {
    ORG: '组织机构',
    ROLE: '用户组/岗位/角色',
    CUSTOM: '自定义组',
  },
  SIGN_CONFIG: {
    "textEnable": 1,
    "textPosition": "LEFT",
    "suggestFontSize": 14,
    "suggestIsBold": 0,
    "suggestIsSlope": 0,
    "suggestIsUnderline": 0,
    "suggestColor": "#000",
    "signLine": 1,
    "signPosition": "LEFT",
    "handSignEnable": 1,
    "pullSignEnable": 1,
    "tabletEnable": 1,
    "tabletType": "WINDOWS_MT",
    "signedEnable": 1,
    "peoplesSignOrder": "time",
    "signedPosition": "LEFT",
    "orgType": "ORG_POST",
    "orgOrder": 1,
    "personNameType": "SYS_TEXT",
    "personNameOrder": 2,
    "timeFormat": "YEAR_MONTH_DAY",
    "timeEnable": 1,
    "timeFormatOrder": 3,
    "signedFontSize": 14,
    "signedIsBold": 0,
    "signedIsSlope": 0,
    "signedIsUnderline": 0,
    "signedColor": "#000",
  },
  WORK_TYPE:{
    TODO: [{key: 'suserName',title: '送交人'},{key: 'startTime',title:'送交时间'},{key: 'time',title:'本环节耗时'}],
    DONE: [{key: 'endTime',title: '办理时间'},{key: 'draftUserName',title:'拟搞人'},{key: 'draftTime',title:'拟搞时间'}],
    SEND: [{key: 'draftTime',title: '拟搞时间'},{key: 'time',title:'总耗时'}],
    TRACK: [{key: 'draftUserName',title: '拟搞人'},{key: 'draftTime',title:'拟搞时间'},{key: 'time',title:'总耗时'}],
    CIRCULATE: [{key: 'suserName',title: '传阅人'},{key: 'startTime',title:'传阅时间'}],
    TRUST: [{key: 'beTrustUserName',title: '受委托人'},{key: 'trustStartTime',title:'委托时间'}],
    BE_TRUST: [{key: 'trustUserName',title: '委托人'},{key: 'trustStartTime',title:'委托时间'}],
    ALL: [{key: 'draftUserName',title: '拟搞人'},{key: 'draftTime',title:'拟搞时间'}],
  },
  MSG_TYPE:{
    MATTER:[
      {key: 'MATTER_TODO',title: '待办'},
      {key: 'MATTER_CIRCULATE',title: '传阅'}
    ],
    DAILY: [
      {key: 'DAILY_SCHEDULE',title: '日程'},
      {key: 'DAILY_NOTICE',title: '通知公告'},
      // {key: 'DAILY_MEETING',title: '会议'},
      // {key: 'DAILY_SUPER',title: '督查督办'},
      // {key: 'CIRDAILY_EXCHANGECULATE',title: '公文交换'}
    ],
    SYS: [
      {key: 'SYS_OVERDUE_WARNING',title: '超期提醒'},
      {key: 'SYS_URGING_WARNING',title: '催办提醒'},
      {key: 'SYS_AUTH_WARNING',title: '授权到期提醒'}
    ]
  },
  MESSAGE_INFO_TYPE:{
    MATTER_TODO: [
      {key: 'bizTitle',title: '标题'},
      {key: 'suserName',title: '送交人'},
      {key: 'startTime',title:'送交时间'},
      {key: 'time',title:'已耗时'}
    ],
    MATTER_CIRCULATE: [
      {key: 'bizTitle',title: '标题'},
      {key: 'suserName',title: '传阅人'},
      {key: 'startTime',title:'传阅时间'}
    ],
    DAILY_SCHEDULE: [
      {key: 'scheduleTitle',title: '标题'},
      {key: 'importance',title: ''},
      {key: 'startTime',title: '开始时间'},
      {key: 'endTime',title:'结束时间'},
      {key: 'schedulePlace',title:'地点'},
      {key: 'createUserName',title:'创建人'},
      {key: 'relUserName',title:'相关人'}
    ],
    DAILY_NOTICE: [
      {key: 'noticeTitle',title: '标题'},
      {key: 'msgTitle',title: ''},
      {key: 'createTime',title:'通知时间'},
      // {key: 'releaseUserName',title:'发布人'}
    ],
    SYS_OVERDUE_WARNING: [
      {key: 'msgTitle',title: '标题'},
      {key: 'createTime',title:'提醒时间'}
    ],
    SYS_URGING_WARNING: [
      {key: 'msgTitle',title: '标题'},
      {key: 'createTime',title:'提醒时间'}
    ],
    SYS_AUTH_WARNING: [
      {key: 'msgTitle',title: '标题'},
      {key: 'createTime',title:'提醒时间'}
    ]
  },
  IMPORTANCE:{
    'SCHEDULE__HIGH': '高',
    'SCHEDULE__MIDDLE': '中',
    'SCHEDULE__LOW': '低'
  },
  SCHEDULETYPE:{
    SELF: '本人创建',
    SELF_TO_OTHER: '他人代建',
    OTHER_TO_SELF: '他人代建'
  },
  SCHEDULETYPE_COLOR:{
    SELF: '#FEEAD1',
    // SELF_TO_OTHER: '#b7eb8f',
    SELF_TO_OTHER: '#ff7875',
    OTHER_TO_SELF: '#ff7875'
  },
  IMPORTANCE_COLOR:{
    'SCHEDULE__HIGH': '#FA2C19',
    'SCHEDULE__MIDDLE': '#F58277',
    'SCHEDULE__LOW': 'rgba(250,44,25,0.1)'
  },
  NOTICETYPE:[
    {key:1,title:'通知'},
    {key:2,title:'公告'},
    {key:3,title:'公示'},
    {key:4,title:'请示'},
  ],
  NOTICERANGE:[
    {key:0,title:'本单位'},
    {key:1,title:'本单位及下属单位'},
    {key:2,title:'指定人员'},
    {key:3,title:'全部'},
  ],
  DYNAMIC_TYPE:{
    NORMAL: [{key: 'TITLE',title: '标题'},{key: 'DRAFT_USER_NAME',title: '拟稿人'},{key: 'CREATE_TIME',title:'拟稿时间'}],
    ALL: [{key: 'bizTitle',title: '标题'},{key: 'draftUserName',title: '拟稿人'},{key: 'draftTime',title:'拟稿时间'}]

  },
  DYNAMIC_STATUS:[
    {name: '全部',key: ''},
    {name: '待发',key: '0'},
    {name: '已发',key: '1,2,4'},
  ]
 
}
