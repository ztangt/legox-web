export const baTableColumns = [
    {
        title: '序号',
        width: 60,
        render: (text, record, index) => index + 1,
    },
    {
        title: '账号',
        dataIndex: 'payAcno',
        width: 200,
    },
    {
        title: '币种',
        dataIndex: 'currency',
        width: 200,
    },
    {
        title: '昨日余额',
        dataIndex: 'yesterdayBalAmt',
        width: 200,
    },
    {
        title: '可用余额',
        dataIndex: 'availableBalAmt',
        width: 200,
    },
];

export const zbaTableColumns = [
    {
        title: '序号',
        dataIndex: 'number',
        width: 60,
    },
    {
        title: '可用额度',
        dataIndex: 'availableBalAmt',
        width: 200,
    },

    {
        title: '已用额度',
        dataIndex: 'usedQuotaAmt',
        width: 200,
    },
    {
        title: '预算资金来源',
        dataIndex: 'yszjly',
        width: 200,
    },
    {
        title: '科目编码',
        dataIndex: 'kmbm',
        width: 200,
    },

    {
        title: '科目名称',
        dataIndex: 'kmmc',
        width: 200,
    },
];
