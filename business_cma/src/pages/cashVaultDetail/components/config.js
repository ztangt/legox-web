export const columns = [
    {
        title: '序号',
        dataIndex: 'number',
        width: 60,
        render: (text, record, index) => index + 1,
    },
    {
        title: '姓名',
        dataIndex: 'receiverUserName',
        width: 200,
    },
    {
        title: '上一工作日库存现金(元)',
        dataIndex: 'lastdayVaultAmount',
        width: 200,
    },
    {
        title: '本日现金收支(元)',
        dataIndex: '',
        children: [
            {
                title: '本日领取',
                dataIndex: 'dayExtrAmount',
                key: '',
                width: 200,
            },
            {
                title: '本日支出',
                dataIndex: 'dayOutAmount',
                key: '',
                width: 200,
            },
            {
                title: '本日直接收入',
                dataIndex: 'dayIncomeAmount',
                key: '',
                width: 200,
            },
            {
                title: '本日交回/送存',
                dataIndex: 'dayDepositAmount',
                key: '',
                width: 200,
            },
        ],
    },
    {
        title: '本日库存现金',
        dataIndex: 'dayVaultAmount',
        width: 200,
    },
];
