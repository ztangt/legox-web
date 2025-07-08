export default {
  controlSetting: {
    '0-0-0': [
      {
        id: 1,
        status: 1,
        applyFundType: 1,
        classifyType: 1,
        warningLevel: 1,
        ruleName: '收款人数据',
        rules: '用途栏内填写内容小于两个字符（一个汉字）时，自动预警。（三级）',
      },
      {
        id: 2,
        status: 2,
        applyFundType: 2,
        classifyType: 2,
        warningLevel: 2,
        ruleName: '收款人数据',
        rules: '用途栏内填写内容小于两个字符（一个汉字）时，自动预警。（三级）',
      },
    ],
    '0-0-1-0': [
      {
        id: 1,
        status: 1,
        applyFundType: 1,
        classifyType: 1,
        warningLevel: 1,
        ruleName: '收款人数据',
        rules:
          '结算方式包含“备用金或现金”字样，且支付金额超过5万的，系统自动预警。（二级）',
      },
      {
        id: 2,
        status: 2,
        applyFundType: 2,
        classifyType: 2,
        warningLevel: 1,
        ruleName: '收款人数据',
        rules:
          '结算方式包含“备用金或现金”字样，且支付金额超过5万的，系统自动预警。（二级）',
      },
    ],
    '0-0-2-0': [
      {
        id: 1,
        status: 1,
        applyFundType: 1,
        classifyType: 1,
        warningLevel: 2,
        ruleName: '收款人数据',
        rules:
          '零余额账户资金，一次性支付金额大于或等于500万元，且资金支付方式为财政授权支付时，应预警。（一级）',
      },
    ],
    applyFundType: {
      1: '中央财政资金',
      2: '地方财政资金',
      3: '自由财政资金',
    },
    classifyType: {
      1: '会计规范性监控',
      2: '财务管理监控',
      3: '项目管理类',
    },
    warningLevel: {
      1: '一级',
      2: '二级',
      3: '三级',
    },
    selectClassify: [
      {
        id: 1,
        name: '会计规范性',
      },
      {
        id: 2,
        name: '财务管理',
      },
      {
        id: 3,
        name: '项目管理',
      },
      {
        id: 4,
        name: '政府采购管理',
      },
    ],
    selectFundType: [
      {
        id: 1,
        name: '中央财政资金',
      },
      {
        id: 2,
        name: '地方财政资金',
      },
      {
        id: 3,
        name: '自由资金',
      },
    ],
    selectWarningLevel: [
      {
        id: 1,
        name: '一级',
      },
      {
        id: 2,
        name: '二级',
      },
      {
        id: 3,
        name: '三级',
      },
    ],
    defineAndRangeName: [
      {
        id: 1,
        name: '姓名',
      },
      {
        id: 2,
        name: '资金用途',
      },
      {
        id: 3,
        name: '资金类型',
      },
      {
        id: 4,
        name: '金额',
      },
    ],
    rulesDefinedAndRange: [
      {
        id: 1,
        name: '等于',
      },
      {
        id: 2,
        name: '不等于',
      },
      {
        id: 3,
        name: '大于',
      },
      {
        id: 4,
        name: '大于等于',
      },
      {
        id: 5,
        name: '小于等于',
      },
      {
        id: 6,
        name: '集合',
      },
      {
        id: 7,
        name: '不在集合',
      },
      {
        id: 8,
        name: '字符长度',
      },
      {
        id: 9,
        name: '.前0的个数',
      },
      {
        id: 10,
        name: '零余额',
      },
      {
        id: 11,
        name: '验证预算编码',
      },
      {
        id: 12,
        name: '累计',
      },
    ],
    textType: [
      {
        id: 1,
        name: '文本',
      },
      {
        id: 2,
        name: '下拉',
      },
    ],
    andOrType: [
      {
        id: 1,
        name: '并且',
      },
      {
        id: 2,
        name: '或者',
      },
    ],
    selectTotalCount: [
      {
        id: 1,
        name: '归总',
      },
      {
        id: 2,
        name: '计数',
      },
    ],
    isImportRules: [
      {
        dictInfoCode: 0,
        dictInfoName: '否',
      },
      {
        dictInfoCode: 1,
        dictInfoName: '是',
      },
    ],
    // 字符长度，前0个数，零余额
    disableSelect: ['len', 'scale', 'balance'],
  },
};
