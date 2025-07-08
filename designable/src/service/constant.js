const customStyle = {
  height: '32px',
  backgroundColor: 'rgba(255,255,255,1)',
  boxShadow: 'rgba(255,255,255,1)    rgba(255,255,255,1)',
  fontFamily: 'Microsoft Yahei',
  color: '#333333',
  fontSize: '14px',
  lineHeight: '32px',
  textDecoration: 'none',
  margin: '0px 0px 0px 0px',
  padding: '0px 8px 0px 8px',
  borderRadius: '0px 0px 0px 0px',
  fontWeight: 400,
  fontStyle: 'normal',
}
const columnStyle = {
  border: 'inherit',
  borderStyle: 'inherit',
  borderWidth: 'inherit',
  borderColor: 'inherit',
  opacity: 1,
  margin: '0px 0px 0px 0px',
  padding: '1px 1px 1px 1px',
  borderRadius: '0px 0px 0px 0px',
  justifyContent: 'center',
  alignItems: 'center',
}
const containerStyle = {
  margin: '0px 0px 0px 0px',
  padding: '0px 0px 0px 0px',
  borderRadius: '0px 0px 0px 0px',
  borderStyle: 'none',
  borderWidth: '0px',
  borderColor: 'rgba(255,255,255,1)',
}
module.exports = {
  REQUEST_SUCCESS: 200,
  CHUNK_SIZE: 40 * 1024 * 1024, //分片大小
  BASE_WIDTH: (150 / 1660) * window.screen.width, // 基础宽度
  ORDER_WIDTH: 60, // 序号宽度
  PADDING_HEIGHT: 16, // padding 高度
  TABLE_HEAD_HEIGHT: 40, // 表格头高度
  PAGE_NATION_HEIGHT: 52, // 分页表格高度
  INIT_DATA: {
    //控件配置 默认值
    CollapseLayout: {},
    GridLayout: {},
    TabsLayout: {},
    StepsLayout: {},
    Text: {
      //文本
      columnType: 'SINGLETEXT',
      columnLength: '',
      isHide: '0',
    },
    Input: {
      //输入框
      columnType: 'SINGLETEXT',
      columnLength: '200',
      isHide: '0',
    },
    //文号
    DocNo: {
      //输入框
      columnType: 'SINGLETEXT',
      columnLength: '200',
      isHide: '0',
    },
    TextArea: {
      //文本框
      columnType: 'MULTITEXT',
      columnLength: '1000',
      isHide: '0',
    },
    DatePicker: {
      //日期
      columnType: 'DATE',
      columnLength: '20',
      dateFormat: 'YYYY-MM-DD',
      isHide: '0',
      disabled: true,
    },
    YearPicker: {
      //日期
      columnType: 'DATE',
      columnLength: '100',
      dateFormat: 'YYYY-MM-DD',
      isHide: '0',
      disabled: true,
    },
    UploadFile: {
      //附件控件
      columnType: 'ANNEX',
      columnLength: '10',
      attachType: 'NULL',
      click: 'DOWNLOAD',
      takePicture: 'NO',
      isHide: '0',
      disabled: true,
    },
    ButtonUploadFile: {
      //附件控件
      columnType: 'ANNEX',
      columnLength: '10',
      attachType: 'NULL',
      click: 'DOWNLOAD',
      takePicture: 'NO',
      isHide: '0',
      disabled: true,
    },
    // Button: {
    //   columnType: 'VARCHAR',
    //   columnLength: '',
    // },
    // Fragment: {
    //   columnType: 'HIDDEN',
    //   columnLength: '200',
    //   isHide: '0',
    // },
    PersonTree: {
      //人员树
      columnType: 'PERSONTREE',
      columnLength: '500',
      treeDataSource: 'PAGE',
      limitOrgs: 'CURRENTORG',
      limitOrg: 'CURRENTORG',
      isMultiple: 'NO',
      isHide: '0',
    },
    DeptTree: {
      //部门树
      columnType: 'DEPTTREE',
      columnLength: '500',
      treeDataSource: 'PAGE',
      limitOrgs: 'CURRENTORG',
      limitOrg: 'CURRENTORG',
      isMultiple: 'NO',
      isHide: '0',
    },
    OrgTree: {
      //单位树
      columnType: 'ORGTREE',
      columnLength: '500',
      treeDataSource: 'PAGE',
      limitOrgs: 'CURRENTORG',
      limitOrg: 'CURRENTORG',
      isMultiple: 'NO',
      isHide: '0',
    },
    WriteSign: {
      //签批
      columnType: 'OPINION',
      columnLength: '255',
      optionValue: 'NONE',
      affectFlowable: 'NO',
      optionType: 'TEXTEARE',
    },
    NumberPicker: {
      //金额字段
      columnType: 'MONEY',
      columnLength: '19',
      columnDecLength: '6',
      moneyFormat: 'SECDECIMAL',
      isHide: '0',
      disabled: true,
    },
    TreeTable: {
      //自定义列表控件
      columnType: 'BUSINESSCONTROL',
      columnLength: '200',
      treeDataSource: 'PAGE',
      limitOrgs: 'CURRENTORG',
      limitOrg: 'CURRENTORG',
      isMultiple: 'NO',
      isHide: '0',
    },
    PullData: {
      //拉取控件
      columnType: 'DATAPULL',
      columnLength: '500',
      isMultiple: 'NO',
    },
    AssociatedBiz: {
      //关联文档
      columnType: 'ASSOCIADTEDDOC',
      columnLength: '10',
      bizDataSource: 'ALL',
      isMultiple: 'NO',
      disabled: true,
    },
    BasicData: {
      //基础数据码表
      columnType: 'DICTCODE',
      columnLength: '64',
      isMultiple: 'NO',
      isHide: '0',
    },
    QRCODE: {
      //二维码
      columnType: 'QRCODE',
      columnLength: '10',
      isHide: '0',
      disabled: true,
    },
    BARCODE: {
      //二维码
      columnType: 'BARCODE',
      columnLength: '10',
      isHide: '0',
      disabled: true,
    },
    BASEDATACODE: {
      //基础数据编码
      columnType: 'BASEDATACODE',
      columnLength: '64',
      isHide: '0',
    },
    // HIDDEN: {
    //   //隐藏字段
    //   columnType: 'HIDDEN',
    //   columnLength: '64',
    //   isHide: '0',
    // },
    AreaTravel: {
      //基础数据编码
      columnType: 'DEPARTURETRAVEL',
      columnLength: '64',
      isHide: '0',
    },
    Cascader: {
      //出发地区差旅树
      columnType: 'DEPARTURETRAVEL',
      columnLength: '100',
      isHide: '0',
    },
    Invoice: {
      //基础数据编码
      columnType: 'BILL',
      columnLength: '10',
      isHide: '0',
      disabled: true,
    },
    AttachmentBiz: {
      //关联文件
      columnType: 'ASSOCIADTEDDOC',
      columnLength: '200',
      isHide: '0',
    },
    Year: {
      //文件
      columnType: 'YEAR',
      columnLength: '6',
      isHide: '0',
    },
    NumberInput: {
      //数字输入框
      columnType: 'NUMBER',
      columnLength: '11',
      isHide: '0',
      disabled: true,
    },
    BaseChart: {
      //基础图标
      columnType: 'SINGLETEXT',
      columnLength: '64',
      isHide: '0',
    },
    InsertControl: {
      //绩效指标表
      columnType: 'BUDGET',
      columnLength: '10',
      isHide: '0',
    },
  },
  initFormJson: {
    form: {
      labelCol: 6,
      wrapperCol: 18,
      bordered: true,
      wrapperAlign: 'left',
      tooltipLayout: 'icon',
      layout: 'horizontal',
      colon: false,
      feedbackLayout: 'popover',
    },
    schema: {
      type: 'object',
      properties: {},
      'x-designable-id': '8yrohpp7vio',
    },
  },
  initStyle: {
    style: {
      ...customStyle,
      width: 'inherit',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#d9d9d9',
      textAlign: 'left',
    },
    labelStyle: {
      ...customStyle,
      // width: '25%',
      borderStyle: 'none',
      borderWidth: '0px',
      borderColor: 'rgba(255,255,255,1)',
      textAlign: 'right',
    },
    gridColumnStyle: {
      ...columnStyle,
      display: 'flex',
    },
    tableColumnStyle: {
      ...columnStyle,
      width: 'auto',
      height: '32px',
    },
    containerStyle: {
      // borderStyle: 'solid',
      // borderWidth: '0.5px',
      // borderColor: 'rgba(208,2,27,1)',红色
      ...containerStyle,
    },
    tableContainerStyle: {
      ...containerStyle,
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#d9d9d9',
    },
    spaceStyle: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignContent: 'flex-start',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: 'rgba(255,255,255,1)',
      width: 'inherit',
      height: 'inherit',
      fontFamily: 'Microsoft Yahei',
      boxShadow: 'rgba(255,255,255,1)    rgba(255,255,255,1)',
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 0px',
      borderRadius: '0px 0px 0px 0px',
      borderStyle: 'none',
      borderWidth: '0px',
      borderColor: 'rgba(255,255,255,1)',
    },
  },
  STATISTICAL: {
    sum: '合计',
    avg: '平均值',
    max: '最大值',
    min: '最小值',
    count: '计数',
  },
  WRITE_BORDER_LIST: [
    {
      name: 'windows系统-蒙恬（L370、L398p、L500）',
      value: 'WINDOWS_MT',
    },
    {
      name: 'windows系统-汉王（ESP370、ESP500、ESP560）',
      value: 'WINDOWS_HW',
    },
    {
      name: '国产化系统-汉王-统信4016系统专用（ESP560）',
      value: 'HW_ESP560',
    },
    {
      name: '国产化系统-汉王-银河麒麟系统V10（SP1）专用',
      value: 'HW_SP1',
    },
    {
      name: '国产化系统-蒙恬-统信银河麒麟系统（L370、L398P）',
      value: 'MT_L370_L398p',
    },
    {
      name: '国产化系统-蒙恬-统信银河麒麟系统（L500）',
      value: 'MT_L500',
    },
  ],
  DELETE_CODE_LIST: [
    'BIZ_ID',
    'SOL_ID',
    'DEPLOY_FORM_ID',
    'MAIN_TABLE_ID',
    'POST_ID',
    'POST_NAME',
    'DEPT_ID',
    'DEPT_NAME',
    'ORG_ID',
    'ORG_NAME',
    'DR',
    'SORT',
    'CREATE_TIME',
    'CREATE_USER_ID',
    'CREATE_IDENTITY_ID',
    'CREATE_USER_NAME',
    'POST_CODE',
    'DEPT_CODE',
    'ORG_CODE',
    'TENANT_ID',
    'UPDATE_TIME',
    'UPDATE_IDENTITY_ID',
    'DATADRIVE_RELATION_ID',
    'TITLE',
    'BIZ_STATUS',
    'DRAFT_USER_ID',
    'DRAFT_USER_NAME',
    'BIZ_SOL_NAME',
  ],
  DEFAULT_COLOR_LIST: [
    '#4776FF',
    '#00D3D7',
    '#FFC42F',
    '#8772FB',
    '#FF80B0',
    '#FF6531',
    '#1DBC9C',
    '#708590',
    '#C5CDD4',
    '#DB9420',
  ],
}
