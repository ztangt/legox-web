const PULL_PLANTYPE = [
  {name:'主拉取主',key:1},
  {name:'主拉取主+主拉取浮',key:2},
  {name:'主拉取主+浮拉取浮',key:3},
  {name:'主拉取浮',key:4},
  {name:'浮拉取主',key:5},
  {name:'浮拉取浮',key:6}
  // {name:'主拉取主+,key:1}浮拉取主',
  // {name:'浮拉取浮+,key:1}浮拉取主',
  // '编码相同拉取-主拉取主',
  // '编码相同拉取-浮拉取主',
  // '编码相同拉取-浮拉取浮'
]
const PUSH_PLANTYPE = [
  {name:'主推送主',key:1},
  {name:'主/浮推送主+浮',key:3},
  {name:'浮推送主',key:5}
]
const UPDATE_PLANTYPE = [
  {name:'主更新主',key:1},
  {name:'主更新浮',key:4},
  {name:'浮更新主',key:5},
  {name:'浮更新浮',key:6},
]

const EVENTTYPES = [
  // {key:"BEFORE",name:'进入'},
  // {key:"AFTER",name:'离开'},
  // {key:"RETURN",name:'驳回'},
  // {key:"WITHDRAW",name:'撤回'}
  {key:"ENTER",name:'进入'},
  {key:"LEAVE",name:'离开'},
  {key:"RECALLENTER",name:'撤回进入'},
  {key:"REJECTLEAVE",name:'驳回离开'},
  {key:"REJECTENTER",name:'驳回进入'},
  {key:"RECALLLEAVE",name:'撤回离开'}
]
module.exports =  {
    REQUEST_SUCCESS: 200,
    EDUCATION:{//学历
        '0': "",
        '1': "本科",
        '2': "硕士研究生",
        '3': "博士研究生",
        '4': "高中",
        '5': "专科",
    },
    DEGREE:{//学位
        '0': "",
        '1': "学士",
        '2': "硕士",
        '3': "博士",
        '4': "副学士",
        '5': "其他"
    },
    PERSON_TYPE:{//人员类型
      '0': "",
      '1': "正式编制",
      '2': "派遣制",
      '3': "合同制",
      '4': "临时工"
  },
    IDEN_TYPE:{//身份证类型
        '1': "身份证",
        '2': "护照",
        '3': "3军人证"
    },
    POLITICAL:{//政治面貌
        '0': "",
        '1': "党员",
        '2': "团员",
        '3': "群众",
    },
    SEX:{//性别
        '1': "男",
        '2': "女",
        '3': "",
    },
    CUSTOM_TYPE:{
        '1': "用户",
        '2': "用户和管理员",
        '3': "租户管理员",
        '4': "多级管理员",
        '5': "其他",
    },
    NODE_TYPE:{
        'DEPT': '部门',
        'ORG': '单位'
    },
    RULE_TYPE:{
        'PUBLIC': '公共规则',
        'MODULE': '模块资源规则',
        'SYSTEM': '预置规则',
    },
    BIZSOLTEMPLATE:[//业务模版
      {key:'1',name:'直接报销'},
      {key:'2',name:'事后报销'},
      {key:'3',name:'事前报销'}
    ],
    AUTHTYPE:[
      {key:'',name:"请选择"},
      {key:'EDIT',name:'可编辑'},
      {key:'NONE',name:'不显示'}
    ],
    BUTTONRANG:[
      {key:"ALL",name:'所有人'},
      {key:"DRAFT",name:'拟稿人'},
      // {key:'HANDLE',name:'办理人'},
      {key:'USER',name:'用户'},
      {key:'USERGROUP',name:'用户组'},
      {key:'ORG',name:'单位'},
      {key:'DEPT',name:'部门'},
      {key:'POST',name:'岗位'},
      {key:'RULE',name:'角色'},
      {key:'DEFAULT',name:'默认值'}
    ],
    AUTHSCOPE:[
      {key:'NONE',name:'请选择'},
      {key:'LOGINUSER',name:'登录人'},
      {key:'USER',name:'用户'},
      {key:'USERGROUP',name:'用户组'},
      {key:'ORG',name:'单位'},
      {key:'DEPT',name:'部门'},
      {key:'POST',name:'岗位'},
      {key:'RULE',name:'角色'},
      {key:'DEFAULT',name:'默认值'}
    ],
    DEFAULTTYPE:[
      {key:'NONE',name:'请选择'},
      {key:'CURUSER',name:'当前用户'},
      {key:'CURDEPT',name:'当前部门'},
      {key:'CURORG',name:'当前单位'},
      {key:'TIME',name:'当前日期'},
      {key:'VALUE',name:'固定值'},
      {key:'USER',name:'用户'},
      {key:'DEPT',name:'部门'},
      {key:'ORG',name:'单位'}
    ],
    FIELD_TYPE:[
        {value:'VARCHAR',label:'字符类型'},
        {value:'INTEGER',label:'整数类型'},
        {value:'DOUBLE',label:'小数类型 '},
        {value:'DECIMAL',label:'金额类型'}
    ],
    DICT_TYPE:{
        PERSONENUM__SIGNMODIFY: '签名修改',
        PERSONENUM__HEADIMGMODIFY: '头像修改',
        PERSONENUM__COMMONAPP: '常用应用',
        PERSONENUM__ABOUTUS: '关于我们',
        PERSONENUM__MESSAGEALERT: '消息提醒',
        PERSONENUM__WORKCIRCLE: '工作圈',
        PERSONENUM__INTELLIREIMBUR: '智能报账',
        PERSONENUM__ACCPASS: '账号密码',
        PERSONENUM__MEG: '短信登录',
        PERSONENUM__APP: 'APP扫码',
        PERSONENUM__WEBCHAT: '微信登录',
        PERSONENUM__QQ: 'QQ登录',
        PERSONENUM__DD: '钉钉登录',
        PERSONENUM__REMPASS: '记住密码',
        PERSONENUM__FORPASS: '忘记密码',
        PERSONENUM__RESETPASS: '重置登录密码',
        PERSONENUM__DOWNLOAD: '下载',
        PERSONENUM__CONNADMIN: '联系管理员',
    },
    DICT_TYPES:[
        {key:'PERSONENUM__SIGNMODIFY',name: '签名修改'},
        {key:'PERSONENUM__HEADIMGMODIFY',name: '头像修改'},
        {key:'PERSONENUM__COMMONAPP',name: '常用应用'},
        {key:'PERSONENUM__ABOUTUS',name: '关于我们'},
        {key:'PERSONENUM__MESSAGEALERT',name: '消息提醒'},
        {key:'PERSONENUM__WORKCIRCLE',name: '工作圈'},
        {key:'PERSONENUM__INTELLIREIMBUR',name: '智能报账'},
        {key:'PERSONENUM__ACCPASS',name: '账号密码'},
        {key:'PERSONENUM__MEG',name: '短信登录'},
        {key:'PERSONENUM__APP',name: 'APP扫码'},
        {key:'PERSONENUM__WEBCHAT',name: '微信登录'},
        {key:'PERSONENUM__QQ',name: 'QQ登录'},
        {key:'PERSONENUM__DD',name: '钉钉登录'},
        {key:'PERSONENUM__REMPASS',name: '记住密码'},
        {key:'PERSONENUM__FORPASS',name: '忘记密码'},
        {key:'PERSONENUM__RESETPASS',name: '重置登录密码'},
        {key:'PERSONENUM__DOWNLOAD',name: '下载'},
        {key:'PERSONENUM__CONNADMIN',name: '联系管理员'},
    ],
    NEEDCOLTYPE:[//所需值类型
      {key:'VALUE',name:'值'},
      // {key:'DEPT',name:'部门简称'},
      // {key:'ORG',name:'单位简称'},
    ],
    //标题添加的固定值
    FIXEDMUNE:[
      {key:'ORG',name:'单位'},
      {key:'DEPT',name:'部门'},
      {key:'USER',name:'用户'},
      {key:'YEAR',name:'年'},
      {key:'MONTH',name:'月'},
      {key:'DAY',name:'日'},
    ],
    //按钮编码
    BUTTONCODES:[
      {key:'add',name:'新增'},
      {key:'update',name:'编辑'},
      {key:'search',name:'查询'},
      {key:'delete',name:'删除'},
      {key:'import',name:'导入'},
      {key:'export',name:'导出'},
      {key:"relevanceButton",name:'关联按钮'},
      {key:'upMove',name:'上移'},
      {key:'downMove',name:'下移'},
      {key:'config',name:'配置'},
      {key:'design',name:'设计'},
      {key:'enable',name:'启用'},
      {key:'disable',name:'禁用'},
      {key:'bindRule',name:'绑定规则'},
      {key:'userInfo',name:'用户信息'},
      {key:'userIdentity',name:'用户身份详情'},
      {key:'userRole',name:'用户角色管理'},
      {key:'userGroup',name:'用户组管理'},
      {key:'userAuth',name:'用户权限查看'},
      {key:'view',name:'查看'},
      {key:'preview',name:'预览'},
      {key:'dataRule',name: '数据规则定义'},
      {key:'versionControl',name: '版本控制'},
      {key:'detail',name: '明细'},
      {key:'copy',name: '复制'},
      {key:'auth',name: '授权'},
      {key:'deploy',name: '部署'},
      {key:'bind',name: '绑定'},
      {key:'send',name: '送交'},
      {key:'save',name: '保存'},
      {key:'reset',name: '重置'},
      {key:'sort',name: '排序'},
      {key:'viewChart',name: '查看结构图'},
      {key:'temporary',name: '暂存'},
      {key:'conclude',name: '办结'},
      {key:'circulate',name: '传阅'},
      {key:'changeDo',name: '转办'},
      {key:'revoke',name: '撤销'},
      {key:'back',name: '驳回'},
      {key:'flowGuide',name: '办理详情'},
      {key:'preview',name:'预览'},
      {key:'hide',name:"隐藏"},
      {key:'visible',name:"显示"},
      {key:'back_list',name:"返回"},
    ],
    //数据规则
    SYSRULEMENU:[
      {code:'',value:'无附加规则'},
      {code:"A0001",value:"本人"},
      {code:"A0002",value:"本部门"},
      {code:"A0003",value:"本部门含下级"},
      {code:"A0004",value:"本单位"},
      {code:"A0005",value:"本单位含下级"},
      {code:"A0006",value:"全部"}
    ],
    DEFAUT_LIST: [
      {key:'CREATE_TIME',columnCode:'CREATE_TIME',colCode:'CREATE_TIME',colName:'拟稿时间',columnName:'拟稿时间',title: '拟稿时间',fieldName: '拟稿时间',checked: true},
      {key:'CREATE_USER_NAME',columnCode:'CREATE_USER_NAME',columnName:'拟稿人',colCode:'CREATE_USER_NAME',colName:'拟稿人',title: '拟稿人',fieldName: '拟稿人',checked: true},
      {key:'BIZ_STATUS',columnCode:'BIZ_STATUS',columnName:'办理状态',colCode:'BIZ_STATUS',colName:'办理状态',title: '办理状态',fieldName: '办理状态',checked: true}
    ],
    DEFAULT_ALL_GROUP_CODE:'R0000',//事项规则中全部分组的编码
    PLANTYPE: [
      '主拉取主',
      '主拉取主+主拉取浮',
      '主拉取主+浮拉取浮',
      '主拉取浮',
      '浮拉取主',
      '浮拉取浮',
      // '主拉取主+浮拉取主',
      // '浮拉取浮+浮拉取主',
      // '编码相同拉取-主拉取主',
      // '编码相同拉取-浮拉取主',
      // '编码相同拉取-浮拉取浮'
    ],
    PULL_PLANTYPE,
    PUSH_PLANTYPE,
    UPDATE_PLANTYPE,
    PLANTYPE:{
      'PULL': PULL_PLANTYPE,
      'PUSH': PUSH_PLANTYPE,
      'UPDATE': UPDATE_PLANTYPE,
    },
    GROUPTYPE:[
      {key:"TABLE",name:'列表'},
      {key:"FORM",name:'表单'},
      {key:"PAGE",name:'页面'}
    ],
    OPERATIONTYPE:[
      {key:'VIEW',name:'操作'},
      {key:'HANDLE',name:'办理'}
    ],
    BINDFIELD: [
      {key:"FROMFORM",name:'来自表单'},
      {key:"FROMBPM",name:'流程固定'},
      {key:"FROMFIXED",name:'固定字段'}
    ],
    FROMBPM: [
      {key:"bizInfoId",name:'业务信息id'},
      {key:"procInstId",name:'流程实例id'},
      {key:"bizTaskId",name:'业务任务id'},
      {key:"bizSolId",name:'业务方案id'},
      {key:"actId",name:'流程环节id'},
      {key:"actName",name:'流程环节名称'},
      {key:"action",name:'操作'},
      {key:"backActId",name:'逆向流转环节id'}
    ],

    EVENTTYPE:EVENTTYPES,
    ACTTYPE:{
      ENTER:'进入',
      LEAVE:'离开',
      RECALLENTER:'撤回进入',
      REJECTLEAVE:'驳回离开',
      REJECTENTER:'驳回进入',
      RECALLLEAVE:'撤回离开' 
    },
    D3OPRETOR:{
      ">":"大于",
      ">=":'大于等于',
      "<":'小于',
      "<=":'小于等于',
      "==":"等于",
      "!=":"不等于",
      "includes":'集合',
      "noIncludes":'不在集合',
      "empty":'为空',
      "noEmpty":"不为空"
    },
    DRIVETYPE:{
      'PUSH':'推送',
      'PULL':'更新'
    }
}
