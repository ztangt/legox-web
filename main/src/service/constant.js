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
  // 2022.09.06  看禅道 - 7098
  // {key:"REJECTENTER",name:'驳回进入'},
  // {key:"RECALLLEAVE",name:'撤回离开'}
]
// const BUTTONTYPES=[
//   {key:'BEFORE',name:'前置'},
//   {key:'AFTER',name:'后置'},
// ]
const EVENTRADIO=[
  // {key:"REVOKE_BEFORE",name:'撤销前'},
  // {key:"REVOKE_AFTER",name:'撤销后'},
  // {key:"ACTIVATE_BEFORE",name:'激活前'},
  // {key:"ACTIVATE_AFTER",name:'激活后'},
  {key:"REVOKE",name:'撤销'},
  {key:"ACTIVATE",name:'激活'},
  {key:"INVALID",name:'作废'},
]
const BASICTYPE=[
  {value:'0',name:'同级'},
  {value:'1',name:'多级'}
]
const ACCREDITTYPE=[
  {key:'authorization_code',name:'授权码'},
  {key:'password',name:'密码'},
  {key:'refresh_token',name:'刷新令牌'},
  {key:'client_credentials',name:'客户端'},
]
module.exports =  {
    REQUEST_SUCCESS: 200,
    CHUNK_SIZE: 40*1024*1024, //分片大小
    BASICTYPE,
    ACCREDITTYPE,
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
        '8':"管理员"
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
    ATTAUTHTYPE:[
      {key:'',name:"请选择"},
      {key:'EDIT',name:'可编辑'}
    ],
    BUTTONRANG:[
      {key:"ALL",name:'所有人'},
      {key:"DRAFT",name:'拟稿人'},
      {key:'HANDLE',name:'办理人'},
      {key:'USER',name:'用户'},
      {key:'USERGROUP',name:'用户组'},
      {key:'ORG',name:'单位'},
      {key:'DEPT',name:'部门'},
      {key:'POST',name:'岗位'},
      {key:'RULE',name:'角色'},
      // {key:'DEFAULT',name:'默认值'}
    ],
    AUTHSCOPE:[
      {key:'NONE',name:'请选择'},
      {key:'LOGINUSER',name:'登录人'},
      {key:'USER',name:'用户'},
      {key:'USERGROUP',name:'用户组'},
      {key:'ORG',name:'单位'},
      {key:'DEPT',name:'部门'},
      {key:'POST',name:'岗位'},
      {key:'RULE',name:'角色'}
    ],
    DEFAULTTYPE:[
      {key:'NONE',name:'请选择'},
      {key:'CURUSER',name:'当前用户'},
      {key:'CURDEPT',name:'当前部门'},
      {key:'CURORG',name:'当前单位'},
      {key:'CURYEAR',name:'当前年度'},
      {key:'TIME',name:'当前日期'},
      {key:'VALUE',name:'固定值'},
      {key:'USER',name:'用户'},
      {key:'DEPT',name:'部门'},
      {key:'ORG',name:'单位'}
    ],
    DEFAULTTYPEOBJECT:{
      SINGLETEXT:[
        {key:'NONE',name:'请选择'},
        {key:'VALUE',name:'固定值'},
      ],
      MULTITEXT:[
        {key:'NONE',name:'请选择'},
        {key:'VALUE',name:'固定值'},
      ],
      DATE:[
        {key:'NONE',name:'请选择'},
        {key:'TIME',name:'当前日期'},
      ],
      MONEY:[
        {key:'NONE',name:'请选择'},
        {key:'VALUE',name:'固定值'},
      ],
      ANNEX:null,
      ASSOCIADTEDDOC:null,
      DATAPULL:null,
      BILL:null,
      PERSONTREE:[
        {key:'NONE',name:'请选择'},
        {key:'CURUSER',name:'当前用户'},
        {key:'USER',name:'用户'}
      ],
      DEPTTREE:[
        {key:'NONE',name:'请选择'},
        {key:'CURDEPT',name:'当前部门'},
        {key:'DEPT',name:'部门'}
      ],
      ORGTREE:[
        {key:'NONE',name:'请选择'},
        {key:'CURORG',name:'当前单位'},
        {key:'ORG',name:'单位'}
      ],
      OPINION:[
        {key:'NONE',name:'请选择'},
        {key:'VALUE',name:'固定值'},
      ],
      BASEDATACODE:[
        {key:'NONE',name:'请选择'},
        {key:'VALUE',name:'固定值'},
      ],
      YEAR:[
        {key:'NONE',name:'请选择'},
        {key:'CURYEAR',name:'当前年度'},
      ],
      NUMBER:[
        {key:'NONE',name:'请选择'},
        {key:'VALUE',name:'固定值'},
      ],
      BUSINESSCONTROL:[
        {key:'NONE',name:'请选择'},
        {key:'VALUE',name:'固定值'},
      ],
      DICTCODE:[
        {key:'NONE',name:'请选择'},
        {key:'VALUE',name:'固定值'},
      ],
      DEPARTURETRAVEL:null,
    },
    FIELD_TYPE:[
      {value:'SINGLETEXT',label:'单行文本'},
      {value:'MULTITEXT',label:'多行文本'},
      {value:'DICTCODE',label:'基础码表'},
      {value:'MONEY',label:'金额类型'},
      {value:'DATE',label:'日期类型'},
      {value:'ANNEX',label:'附件类型'},
      {value:'ASSOCIADTEDDOC',label:'关联文档'},
      // {value:'HIDDEN',label:'隐藏字段'},
      {value:'OPINION',label:'意见类型'},
      {value:'DATAPULL',label:'数据拉取'},
      {value:'QRCODE',label:'二维码'},
      {value:'BARCODE',label:'条形码'},
      {value:'BASEDATACODE',label:'基础数据编码'},
      {value:'PERSONTREE',label:'人员树'},
      {value:'DEPTTREE',label:'部门树'},
      {value:'ORGTREE',label:'单位树'},
      {value:'BUSINESSCONTROL',label:'业务控件'},
      {value:'YEAR',label:'年度控件'},
      {value:'CONTROLHINDENTEXT',label:'控件默认生成的隐藏文本'},
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
    //数据规则
    SOMERULEMENUS:[
      {code:'',value:'无附加规则'},
      {code:"A0004",value:"本单位"},
      {code:"A0005",value:"本单位含下级"},
      {code:"A0006",value:"全部"}
    ],
    DEFAUT_LIST: [
      {key:'ACT_ID',columnCode:'ACT_ID',colType: 'VARCHAR',columnName:'流程节点ID',colCode:'ACT_ID',colName:'流程节点ID',title: '流程节点ID',fieldName: '流程节点ID',checked: true,sortFlag: true},
      {key:'ACT_NAME',columnCode:'ACT_NAME',colType: 'VARCHAR',columnName:'流程节点名称',colCode:'ACT_NAME',colName:'流程节点名称',title: '流程节点名称',fieldName: '流程节点名称',checked: true,sortFlag: true},
      {key:'CREATE_TIME',columnCode:'CREATE_TIME',colType: 'VARCHAR',colCode:'CREATE_TIME',colName:'拟稿时间',columnName:'拟稿时间',title: '拟稿时间',fieldName: '拟稿时间',checked: true,sortFlag: true},
      {key:'CREATE_USER_NAME',columnCode:'CREATE_USER_NAME',colType: 'VARCHAR',columnName:'拟稿人',colCode:'CREATE_USER_NAME',colName:'拟稿人',title: '拟稿人',fieldName: '拟稿人',checked: true,sortFlag: true},
      {key:'BIZ_STATUS',columnCode:'BIZ_STATUS',colType: 'VARCHAR',columnName:'办理状态',colCode:'BIZ_STATUS',colName:'办理状态',title: '办理状态',fieldName: '办理状态',checked: true,sortFlag: true},
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
    BFIELD:{
      FROMFORM: '来自表单',
      FROMBPM: '流程固定',
      FROMFIXED: '固定字段'
    },
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
    EVENTRADIO:EVENTRADIO,
    ACTTYPE:{
      ENTER:'进入',
      LEAVE:'离开',
      RECALLENTER:'撤回进入',
      REJECTLEAVE:'驳回离开',
      REJECTENTER:'驳回进入',
      RECALLLEAVE:'撤回离开'
    },
    // BUTTONTYPES:BUTTONTYPES,
    // BUTTONTYPE:{
    //   BEFORE:'前置',
    //   AFTER:'后置'
    // },
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
      "noEmpty":"不为空",
      "contain":'包含',
      "noContain":'不包含'
    },
    DRIVETYPE:{
      'PUSH':'推送',
      'PULL':'更新'
    },

    CONTROLCODE:`
    const state = $observable({
      year: "", //年
      currentIndex: "", //组件在子表的第几行
      isDefalut:false
    })
    //通过code获取name,用于授权默认值的code
    $effect(()=>{
      if($self.value&&!state.isDefalut){
        //通过接口请求获取name，重新赋值给控件
        $self.value='name';
        state.isDefalut=true;
      }
    },[$self.value])
    $props({
      //弹框的提醒区域
      remind:ENCODEHTML(\`<div style="color:red">1111</div>\`),
      /*高级搜索
      *searchParam为搜索的参数，
      *searchType为组件类型，
      *url为下拉框的数据源，
      *ismultiple是否多选
      *fieldNames下拉框对应的值
      */
      // advancedSearch:[
      //   {
      //     "searchParam":'year',
      //     "searchType": "select",
      //     "url": "sys/dictType/ZJLY?showType=ALL&searchWord=&isTree=1",
      //     "name": "年度",
      //     "ismultiple": true,
      //     "fieldNames":{value:'dictInfoCode',label:'dictInfoName'}
      //   },{
      //     "searchParam":'searchWord',
      //     "searchType": "input",
      //     "name": "名称/code",
      //   }
      // ],
      //自定义按钮，name为按钮名称，click为按钮事件，title是提示信息
      // headerButtons:[{
      //   name:'修改',
      //   click:\`props.updateState()\`,
      //   title:'提示信息'
      // }],
      //updateState这个是例子，名称可以自定义
      // updateState:()=>{
      //   //可以写任何事件
      // },
      //表头json
      columns() {
        let fieldNames = {label:'OBJ_NAME'}
        let limit=10//表单的分页条数
        let columns = [
          {
            title: "编码",
            dataIndex: "OBJ_CODE",
          },
          {
            title: "名称",
            dataIndex: "OBJ_NAME",
          },
        ]
        return {columns:columns,fieldNames:fieldNames,limit}
      },
      //获取值赋值到state,便于控件其他地方使用（例子为获取年）
      getState() {
        const pathSegments = $self.path.segments
        let year = ""
        if (pathSegments.length > 1) {
          //在子表中
          const index = pathSegments[pathSegments.length - 2]
          state.currentIndex = index
          year = $self.parent.value[index]["USED_YEAR"]
          if (!year) {
            year = $values["USED_YEAR"]
          }
        } else {
          //在主表
          year = $values["USED_YEAR"]
        }
        if(year){
          state.year = year
        }else{
          state.year = ""
        }
      },
      //获取数据源
      getDataSource(start, limit, params) {
        let tmpParams={
          start:start,
          limit:limit,
          //...params
        }
        fetchAsync(
          \`form/listModelData/\${$self.componentProps.bizSolId}?\${QS.stringify(tmpParams)}\`,
          {
            method: "get"
          }
        ).then((response) => {
          let returnData = response.data;
          if(returnData.code==200){
            $self.data = {
              currentPage: returnData.data.currentPage,
              returnCount: returnData.data.returnCount,
              data: returnData.data.list,
            }
          }else{
            MESSAGE.error(returnData.msg);
          }
        })
      },
      //弹框的确认操作(注意：隐藏字段也需要赋值)
      //(AA_CODES为编码,OBJ_NAME为接口返回字段)
      onOk(selectedRows,e) {
        const button = e.currentTarget
        button.disabled = true;
        const pathSegments = $self.path.segments;
        //在主表的时候只能是单选
        if (pathSegments.length == 1 && selectedRows.length > 1) {
          $self.setSelfErrors("在主表的情况下只能选择一条")
          return
        } else {
          $self.setSelfErrors("")
        }
        //赋值主表字段（单选赋值）
        //不需要判断
        $values['AA_CODES']=selectedRows[0].OBJ_NAME;
        //如果选择的是空值，则值变成空
        $values['AA_CODES']=selectedRows?selectedRows[0].OBJ_NAME:'';
        //赋值主表字段（多选赋值）
        let name = '';
        for(let i=0;i<selectedRows.length;i++){
          if(name){
            name = name+','+selectedRows[i].OBJ_CODE + "-" + selectedRows[i].OBJ_NAME
          }else{
            name = selectedRows[i].OBJ_CODE + "-" + selectedRows[i].OBJ_NAME
          }
        }
        $self.value = name;
        //赋值到当前子表,多选推送
        let tabelLength = $self.parent.value?$self.parent.value.length:0;
        if(selectedRows.length){
          let idInfos = selectedRows.map((item,i)=>{
            let index = 0;
            if(i==0){
              index = state.currentIndex
            }else{
              index = state.currentIndex+i
            }
            if($self.parent.value[index]){
              $self.parent.value[index]['PROJECT_NAME'] = item.OBJ_NAME
              $self.parent.value[index]['PROJECT_CODE'] = item.OBJ_CODE
              $self.parent.value[index]['PROJECT_ID'] =  item.ID
              $self.parent.value[index]['PROJECT_BIZ_SOL_ID'] = item.SOL_ID
            }else{
              return new Promise( (resolve,reject) => {
                GETFORMDATAID().then((data)=>{
                  let id = data.data.id;
                  resolve({
                    id:id,
                    item:item
                  })
                })
              })
            }
          })
          Promise.all(idInfos).then((allData) => {
            allData.map((info,index)=>{
              let id=info.id;
              let item = info.item;
              $self.query(pathSegments[0]).take((field)=>{
                field.insert(tabelLength+index,{
                  ID:id,//这行不能删除
                  PROJECT_NAME:selectedRows[i].OBJ_NAME,//这行是赋值
                  PROJECT_CODE:selectedRows[i].OBJ_CODE,//这行是赋值
                  PROJECT_ID:selectedRows[i].ID,
                  PROJECT_BIZ_SOL_ID:selectedRows[i].SOL_ID
                }).then(()=>{
                  if(index==allData.length-1){
                    button.disabled = false;
                  }
                })
              })
            })
          })
        }else{
          $self.parent.value[state.currentIndex]['PROJECT_NAME'] = ''
          $self.parent.value[state.currentIndex]['PROJECT_CODE'] = ''
          $self.parent.value[state.currentIndex]['PROJECT_ID'] = ''
          $self.parent.value[state.currentIndex]['PROJECT_BIZ_SOL_ID'] = ''
          button.disabled = false;
        }
        //主表直接推送到子表
        // let tabelLength = $values['LWFBXLWRYXX']?$values['LWFBXLWRYXX'].length:0;
        // let idinfos = selectedRows.map((item)=>{
        //   return new Promise( (resolve,reject) => {
        //     GETFORMDATAID().then((data)=>{
        //       let id = data.data.id;
        //       resolve({
        //         id:id,
        //         item:item
        //       })
        //     })
        //   })
        // })
        // Promise.all(idinfos).then((allData) => {
        //   allData.map((info,index)=>{
        //     let id=info.id;
        //     let item = info.item;
        //     $self.query('LWFBXLWRYXX').take((field)=>{
        //       field.insert(tabelLength+index,{
        //         ID:id,//这行不能删除
        //         LABOR_NAME:item.LABOR_NAME,//这行是赋值
        //         DOCUMENT_TYPE_TLDT_:item.DOCUMENT_TYPE_TLDT_,
        //         DOCUMENT_NUM:item.DOCUMENT_NUM,
        //         IS_FOREIGN_REMITTANCE_TLDT_:item.IS_FOREIGN_REMITTANCE_TLDT_,
        //         BANK_CARD_NUM:item.BANK_CARD_NUM,
        //         BANK_ACCOUNT_NAME:item.BANK_ACCOUNT_NAME,
        //         MOBILE_PHONE_NUM:item.MOBILE_PHONE_NUM,
        //         WORK_ORG:item.WORK_ORG,
        //         PROFESSIONAL_TITLE:item.PROFESSIONAL_TITLE,
        //       }).then(()=>{
                //   if(index==allData.length-1){
                //     button.disabled = false;
                //   }
                // })
        //     })
        //   })
        // })
      },
      //展开
      onExpand(expanded, record, callback,start) {
        let childData = []
        let limit=10;
        fetchAsync(
          \`ic/budgetProject/tree?start=\${start}&limit=\${limit}&searchWord=&bizSolId=\${
            $self.componentProps.bizSolId
          }&parentCode=\${record.OBJ_CODE}&usedYear=\${state.year}\`,
          {
            method: "get"
          }
        ).then((response) => {
          let data = response.data;
          if(data.code==200){
            callback(data.data.list,data.data,limit)
          }else{
            MESSAGE.error(data.msg);
          }
        })
      },
      //删除
      // deleteData(ids,callback,qs){
      //   fetchAsync(
      //     \`ic/budgetProject/tree\`,
      //     {
      //       method: "DELETE",
      //       headers: {
      //         Authorization: "Bearer " + window.localStorage.getItem("userToken"),
      //         'Content-Type': 'application/x-www-form-urlencoded',
      //       },
      //       body: qs.stringify({ids:ids})
      //     }
      //   ).then((response) => {
            // let data = response.data;
            // if(data.code==200){
            //   callback();
            // }else{
            //   MESSAGE.error(data.msg);
            // }
      //   })
      // },
      //校验人员
      //checkUser(){
      //  let data = $self.data//列表的全部数据
      //}
      //回显
      // getSelectRows(callback) {
      //   fetchAsync(
      //     \`sys/org/children?nodeType=ORG&start=1&limit=200\`,
      //     {
      //       method: "get",
      //     }
      //   ).then((response) => {
        // let data = response.data;
        // if(data.code==200){
        //  callback(data.data.list)
        // }else{
        //   MESSAGE.error(data.msg);
        // }
      //   })
      // },
      //渲染已经选择的数据
      // renderSelectedInfos(selectedRows){
      //   let tmpInfos = [];
      //   selectedRows.map((item)=>{
      //     tmpInfos.push({
      //       name:item.OBJ_NAME,
      //       id:item.ID
      //     })
      //   })
      //   return tmpInfos;
      // },
      //查看
      getDetailInfo(callback){
        fetchAsync(
          \`sys/org/children?nodeType=ORG&start=1&limit=200\`,
          {
            method: "get",
          }
        ).then((response) => {
          let info = response.data;
          if(info.code==200){
            let data = info.data.list;
            const columns = [
              [
                '名称1',data[0].data[0].ORG_NAME,
                '名称2',data[0].data[0].ORG_NAME,
              ],
              [
                '名称3',data[0].data[0].ORG_NAME,
                '名称4',data[0].data[0].ORG_NAME,
                '名称6',data[0].data[0].ORG_NAME,
              ],
              [
                '名称5',data[0].data[0].ORG_NAME,
              ]
            ]
            callback(data,columns);
          }else{
            MESSAGE.error(info.msg);
          }
        })
      }
    })
    `,
    JSSCRIPT:
    `
    //表单加载时调用
    function _onFormLoad(){

    }
    //表单提交之前处理方法，可以返回false防止数据提交。
    //data为表单的值(取值:data['JINE'])
    function _onBeforeSubmit(data){

    }
    //_onAfterSubmit 表单提交后调用的代码
    //data为表单的值()
    //method可以是get,DELETE,POST
    //MESSAGE为提示文本
    //主表取值data['JINE']，子表取值data['子表code'][子表第几行]['JINE']
    function _onAfterSubmit(data){
      // let tmpParams={
      //   searchWord:data['JINE']
      // };
    //   fetchAsync(\`sys/dictType/JB?\${QS.stringify(tmpParams)}\`,
    //   {
    //     method: "get",
    //     headers: {
    //       Authorization: "Bearer " + window.localStorage.getItem("userToken"),
    //     },
    //   }
    //  ).then((response)=>{
    //       let returnData = response.data;
    //       if(returnData.code!=200){
    //         MESSAGE.error(returnData.msg)
    //       }
    //  })
    }
    //表单送交后调用的代码
    function _onAfterSubmit(){

    }
    `
}
