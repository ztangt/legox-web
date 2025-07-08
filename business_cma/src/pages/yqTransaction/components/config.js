import dayjs from 'dayjs';
export const baTableColumns = [
    {
        title: '序号',
        width: 60,
        fixed: 'left',
        render: (text, record, index) => index + 1,
    },
    {
        title: '交易日期',
        dataIndex: 'txDate',
        width: 200,
        render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : ''),
    },
    {
        title: '我方账号',
        dataIndex: 'payAcno',
        width: 200,
    },
    {
        title: '我方账户名',
        dataIndex: 'payAcname',
        width: 200,
    },
    {
        title: '对方账号',
        dataIndex: 'rcvAcno',
        width: 200,
    },
    {
        title: '对方账户名',
        dataIndex: 'rcvAcname',
        width: 200,
    },
    {
        title: '借方发生额(收)',
        dataIndex: 'jffse',
        width: 200,
    },
    {
        title: '贷方发生额(收)',
        dataIndex: 'dffse',
        width: 200,
    },
    {
        title: '余额',
        dataIndex: 'balAmt',
        width: 200,
    },
    {
        title: '币种',
        dataIndex: 'currency',
        width: 200,
    },

    {
        title: '凭证号',
        dataIndex: 'certNo',
        width: 200,
    },
    {
        title: '用途',
        dataIndex: 'usage',
        width: 200,
    },
    {
        title: '摘要',
        dataIndex: 'summary',
        width: 200,
    },
];

export const zbaTableColumns = [
    {
        title: '序号',
        width: 60,
        render: (text, record, index) => index + 1,
    },
    {
        title: '交易时间',
        dataIndex: 'txDate',
        width: 200,
        render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : ''),
    },

    {
        title: '对方账号',
        dataIndex: 'rcvAcno',
        width: 200,
    },
    {
        title: '交易金额',
        dataIndex: 'txAmt',
        width: 200,
    },
    {
        title: '可退金额',
        dataIndex: 'refAmt',
        width: 200,
    },
    {
        title: '预算来源',
        dataIndex: 'budgetSource',
        width: 200,
    },

    {
        title: '预算管理类型',
        dataIndex: 'budgetManageType',
        width: 200,
    },
    {
        title: '科目编码',
        dataIndex: 'subjectCode',
        width: 200,
    },
    {
        title: '科目名称',
        dataIndex: 'subjectName',
        width: 200,
    },
    {
        title: '项目编码',
        dataIndex: 'projectCode',
        width: 200,
    },
    {
        title: '项目名称',
        dataIndex: 'projectName',
        width: 200,
    },

    {
        title: '支付信息代码',
        dataIndex: 'payInfCode',
        width: 200,
    },
    {
        title: '摘要',
        dataIndex: 'summary',
        width: 200,
    },
    {
        title: '备注',
        dataIndex: 'remark',
        width: 200,
    },
    {
        title: '用途',
        dataIndex: 'usage',
        width: 200,
    },
    {
        title: '渠道标识',
        dataIndex: 'chanId',
        width: 200,
    },
    {
        title: '下达额度',
        dataIndex: 'relQuota',
        width: 200,
    },
    {
        title: '未用额度',
        dataIndex: 'unUseQuota',
        width: 200,
    },
    {
        title: '凭证种类',
        dataIndex: 'certNoType',
        width: 200,
    },
    {
        title: '凭证名称',
        dataIndex: 'certName',
        width: 200,
    },
    {
        title: '凭证号',
        dataIndex: 'certBatchNo',
        width: 200,
    },
];
