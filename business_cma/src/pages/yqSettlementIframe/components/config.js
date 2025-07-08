export const payTypeList = [
    { label: '对私', value: 20 },
    { label: '对公', value: 10 },
];
export const sameBankList = [
    { label: '否', value: 0 },
    { label: '是', value: 1 },
];

export const accStatusList = [
    { label: '正常', value: 'normal' },
    { label: '新增', value: 'add' },
    { label: '修改', value: 'update' },
];

export const getLabel = (list, value) => {
    let item = list.find((item) => item.value == value);
    return item ? item.label : '';
};

export const payColumn = [
    {
        title: '序号',
        width: 60,
        render: (text, record, index) => index + 1,
    },
    {
        title: '付款方账户',
        dataIndex: 'FK_BANK_ACCOUNT',
        width: 240,
    },

    {
        title: '付款方账户名称',
        dataIndex: 'FK_NAME_OF_ACCOUNT',
        width: 240,
    },
    {
        title: '付款方银行名称',
        dataIndex: 'FK_BANK_BRANCH_NAME',
        width: 240,
    },
    {
        title: '支付码',
        dataIndex: 'PAYMENT_CODE',
        width: 240,
    },
    {
        title: '支付金额',
        dataIndex: 'MONEY',
        width: 240,
    },
    {
        title: '收款方账户',
        dataIndex: 'SHROFF_ACCOUNT_NUM',
        width: 240,
    },
    {
        title: '收款方账户名称',
        dataIndex: 'NAME_OF_RECEIV_ACCOUNT',
        width: 240,
    },
    {
        title: '收款方银行网点联行号',
        dataIndex: 'OBJ_CODE',
        width: 240,
    },
    {
        title: '收款方银行网点名称',
        dataIndex: 'OBJ_NAME',
        width: 240,
    },
    {
        title: '付款方开户行所在省市',
        dataIndex: 'PROVINCES',
        width: 240,
    },

    {
        title: '支付类型',
        dataIndex: 'TRANSFER_TYPE_TLDT_',
        width: 240,
        render: (text) => getLabel(payTypeList, text),
    },

    {
        title: '用途',
        dataIndex: 'BC_USE',
        width: 240,
    },
    {
        title: '是否同行',
        dataIndex: 'IS_SAME_BANK',
        width: 240,
        render: (text) => getLabel(sameBankList, text),
    },
    {
        title: '账户信息状态',
        dataIndex: 'status',
        width: 240,
        render: (text) => getLabel(accStatusList, text),
    },
];

export const cardColumn = [
    {
        title: '序号',
        dataIndex: 'number',
        width: 60,
    },
    {
        title: '付款方账户',
        dataIndex: 'FK_BANK_ACCOUNT',
        width: 240,
    },

    {
        title: '付款方账户名称',
        dataIndex: 'FK_NAME_OF_ACCOUNT',
        width: 240,
    },
    {
        title: '付款方银行名称',
        dataIndex: 'FK_BANK_BRANCH_NAME',
        width: 240,
    },
    {
        title: '支付码',
        dataIndex: 'PAYMENT_CODE',
        width: 240,
    },
    {
        title: '收款方账户',
        dataIndex: 'CARD_NUM',
        width: 240,
    },
    {
        title: '收款方账户名称',
        dataIndex: 'PERSONNEL',
        width: 240,
    },
    {
        title: '消费日期',
        dataIndex: 'DATE_OF_CONSUMPTION',
        width: 240,
    },
    {
        title: '刷卡金额',
        dataIndex: 'SUM_OF_CONSUMPTION',
        width: 240,
    },
    {
        title: '支付金额',
        dataIndex: 'MONEY',
        width: 240,
    },
    {
        title: '用途',
        dataIndex: 'BC_USE',
        width: 240,
    },
    {
        title: '消费记录校验',
        dataIndex: 'xfjlxy', //是循环自己算出来的
        render: (text) => (text == '1' ? '匹配' : '未匹配'),
        width: 240,
    },
    {
        title: '账户信息状态',
        dataIndex: 'relateBillNo',
        render: (text) => getLabel(accStatusList, text),
    },
    {
        title: '协议编号',
        dataIndex: 'AGREEMENT_NUMBER',
        width: 240,
    },
];
