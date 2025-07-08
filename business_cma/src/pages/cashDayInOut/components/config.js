export const recordConfigData = {
    bankType: {
        1: '个人公务卡',
        2: '个人储蓄卡',
        3: '单位卡',
    },
};

export const columns = [
    {
        title: '序号',
        width: 60,
        fixed: 'left',
        render: (text, record, index) => index + 1,
    },
    {
        title: '单位名称',
        dataIndex: 'cashOrgName',
        width: 200,
    },
    {
        title: '账户性质',
        dataIndex: 'accountType',
        width: 200,
    },
    {
        title: '开户行',
        dataIndex: 'openBankName',
        width: 200,
    },
    {
        title: '银行账户',
        dataIndex: 'accountNumber',
        width: 200,
    },
    {
        title: '上一工作日库存现金',
        dataIndex: 'lastdayVaultAmount',
        width: 180,
    },
    {
        title: '本日现金收支(元)',
        children: [
            {
                title: '本日提取',
                dataIndex: 'dayExtrAmount',
                width: 150,
            },
            {
                title: '本日支出',
                dataIndex: 'dayOutAmount',
                width: 150,
            },
            {
                title: '本日退回收入',
                dataIndex: 'dayReturnAmount',
                width: 150,
            },
            {
                title: '余额',
                dataIndex: 'balance',
                width: 150,
            },
        ],
    },
    {
        title: '本日直接收入',
        dataIndex: 'dayIncomeAmount',
        width: 150,
    },
    {
        title: '本日送存银行',
        dataIndex: 'dayReturnDepositAmount',
        width: 150,
    },
    {
        title: '本日库存现金',
        dataIndex: 'dayVaultAmount',
        width: 150,
    },
];
