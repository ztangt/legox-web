import { formattingMoney } from '@/util/util';
import dayjs from 'dayjs';

export const servicePublicKey =
    '0416e39a2a5023e90a4f8d0c663b7f9e21bcd430c122e767150b201dd5935d8953a08227be68de4a04c46d46c6b2644d3042889404a7dcda92c7f211ee29f20c8e';

//是否零余额支付
export const isZeroList = [
    { value: '', label: '全部' },
    { value: 'true', label: '是' },
    { value: 'false', label: '否' },
];

//支付状态
export const statusList = [
    { value: 'unpaid', label: '未支付' },
    { value: 'paid', label: '支付成功' },
    { value: 'failed', label: '支付失败' },
    { value: 'doing', label: '支付处理中' },
    { value: 'all', label: '全部支付信息' },
];
//查询状态
export const searchStatusList = [
    { value: 0, label: '支付成功' },
    { value: 1, label: '支付失败' },
    { value: 2, label: '撤销支付' },
    { value: 3, label: '未确定支付' },
    { value: 4, label: '银行处理中' },
];
//查询描述
export const searchRemarkList = [
    { value: 0, label: '支付成功-授权审批通过，银行处理成功' },
    { value: 1, label: '支付失败-授权审批通过，银行处理失败' },
    { value: 2, label: '撤销支付-授权审批拒绝' },
    { value: 3, label: '未确定支付-等待授权审批' },
    { value: 4, label: '银行处理中-授权审批通过，等待银行处理' },
];

//是否同行
export const sameBankList = [
    { value: 0, label: '否' },
    { value: 1, label: '是' },
];

//支付类型
export const payTypeList = [
    { value: 20, label: '对公支付' },
    { value: 10, label: '对私支付' },
];
export const getLabel = (list, value) => {
    let item = list.find((item) => item.value == value);
    return item ? item.label : '';
};

export const allColumns = [
    {
        title: '序号',
        width: 100,
        render: (text, record, index) => index + 1,
    },
    {
        title: '业务单据号',
        dataIndex: 'relateBillNo',
        width: 240,
    },
    {
        title: '收款方用户名',
        dataIndex: 'recName',
        width: 240,
    },
    {
        title: '付款金额',
        dataIndex: 'amount',
        width: 240,
        render: (text) => (text ? formattingMoney(text) : ''),
    },
    {
        title: '付款方账号',
        dataIndex: 'payAccNo',
        width: 240,
    },
    {
        title: '付款方用户名',
        dataIndex: 'payAccName',
        width: 240,
    },
    {
        title: '付款方银行',
        dataIndex: 'payBankName',
        width: 240,
    },
    {
        title: '收款方账号',
        dataIndex: 'recAccNo',
        width: 240,
    },
    {
        title: '收款方银行',
        dataIndex: 'recBankName',
        width: 240,
    },
    {
        title: '支付类型',
        dataIndex: 'payType',
        render: (text) => getLabel(payTypeList, text),
        width: 240,
    },

    {
        title: '支付时间',
        dataIndex: 'payTime',
        render: (text) => (text && text != '0' ? dayjs.unix(Number(text)).format('YYYY-MM-DD') : ''),
        width: 240,
    },
    {
        title: '主交易流水号',
        dataIndex: 'batchSerialNumber',
        width: 240,
    },
    {
        title: '子交易流水号',
        dataIndex: 'serialNumber',
        width: 240,
    },

    {
        title: '查询状态',
        dataIndex: 'searchStatus',
        render: (text) => getLabel(searchStatusList, text),
        width: 240,
    },
    {
        title: '查询描述',
        dataIndex: 'searchRemark',
        width: 400,
    },
    {
        title: '查询时间',
        dataIndex: 'updateTime',
        render: (text) => (text && text != '0' ? dayjs.unix(Number(text)).format('YYYY-MM-DD') : ''),
        width: 240,
    },
    {
        title: '备注',
        dataIndex: 'remark',
        width: 240,
    },
    {
        title: '用途',
        dataIndex: 'purpose',
        width: 240,
    },
    {
        title: '是否同行',
        dataIndex: 'isSameBank',
        render: (text) => getLabel(sameBankList, text),
        width: 240,
    },

    {
        title: '收款方人行联行号',
        dataIndex: 'recPbcLineNum',
        width: 240,
    },
    {
        title: '支付次数',
        dataIndex: 'count',
        width: 240,
    },
];

export const noUnpaidColumns = [
    {
        title: '序号',
        width: 100,
        render: (text, record, index) => index + 1,
    },
    {
        title: '业务单据号',
        dataIndex: 'relateBillNo',
        width: 240,
    },
    {
        title: '收款方用户名',
        dataIndex: 'recName',
        width: 240,
    },
    {
        title: '付款金额',
        dataIndex: 'amount',
        width: 240,
        render: (text) => (text ? formattingMoney(text) : ''),
    },
    {
        title: '付款方账号',
        dataIndex: 'payAccNo',
        width: 240,
    },
    {
        title: '付款方用户名',
        dataIndex: 'payAccName',
        width: 240,
    },
    {
        title: '付款方银行',
        dataIndex: 'payBankName',
        width: 240,
    },
    {
        title: '收款方账号',
        dataIndex: 'recAccNo',
        width: 240,
    },
    {
        title: '收款方银行',
        dataIndex: 'recBankName',
        width: 240,
    },
    {
        title: '支付类型',
        dataIndex: 'payType',
        render: (text) => getLabel(payTypeList, text),
        width: 240,
    },

    {
        title: '支付时间',
        dataIndex: 'payTime',
        render: (text) => (text && text != '0' ? dayjs.unix(Number(text)).format('YYYY-MM-DD') : ''),
        width: 240,
    },
    {
        title: '备注',
        dataIndex: 'remark',
        width: 240,
    },
    {
        title: '用途',
        dataIndex: 'purpose',
        width: 240,
    },
    {
        title: '是否同行',
        dataIndex: 'isSameBank',
        render: (text) => getLabel(sameBankList, text),
        width: 240,
    },
    {
        title: '收款方人行联行号',
        dataIndex: 'recPbcLineNum',
        width: 240,
    },
    {
        title: '支付次数',
        dataIndex: 'count',
        width: 240,
    },
];
