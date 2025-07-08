import { message } from 'antd';
import dayjs from 'dayjs';
import { history } from 'umi';
import { tableSort } from '../../../util/util';

export const onlineType = ['OFFLINE_CONTRACT', 'OFFLINE_EXPENDITURE_CONTRACT', 'OFFLINE_INCOME_CONTRACT'];
export const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
};
const openNewPage = (record) => {
    history.push({
        pathname: '/contractList',
        query: {
            id: record.mainTableId,
        },
    });
};
export const isBigList = [
    { value: '1', label: '是' },
    { value: '0', label: '否' },
]; //是否重大合同

export const zcList = [
    { value: '1', label: '是' },
    { value: '0', label: '否' },
]; //是否政采
export const colorList = [
    { value: '1', label: '#969696', dic: '正常未到履约期' },
    { value: '2', label: '#ffe58f', dic: '到达履约期到期前的预警月份' },
    { value: '3', label: '#ff4d4f', dic: '超过履约期' },
    { value: '4', label: '#52c41a', dic: '已验收' },
];
const openPage = (record) => {
    //判断是否为线下合同
    if (onlineType.includes(record.contractCategoryTldt)) {
        return message.error('此合同为线下合同，无线上单据');
    }
    historyPush({
        pathname: `/dynamicPage/formShow`,
        query: {
            bizInfoId: record.bizId,
            bizSolId: record.solId,
            id: record.mainTableId,
            currentTab: record.id,
            maxDataruleCode: '',
            title: record.contractName,
        },
    });
};
function openContractAmountDetail(record) {
    historyPush({
        pathname: `/business_application/meteorological`,
        query: {
            title: '合同已支付金额',
            microAppName: 'business_cma',
            url: 'contractAmount',
            contractId: record.mainTableId,
            alreadyMoney: record.alreadyMoney,
            // maxDataruleCode
            // menuId
        },
    });
}
export const getLabel = (list, value) => {
    let item = list.find((item) => item.value == value);
    return item ? item.label : '';
};

//办理状态
export const blList = [
    { value: 'endEvent', label: '办结' },
    { value: 'startEvent', label: '在办' },
];

export const getColumns = (contractLedger, type) => {
    const { typeList, statusList, buyWayList, payList } = contractLedger;
    let arr = [
        {
            title: '合同编号',
            dataIndex: 'contractNumber',
            width: 200,
            render: (text, record) => (
                <span className="primaryColor" onClick={() => openPage(record)}>
                    {text}
                </span>
            ),
        },
        {
            title: '单据编号',
            dataIndex: 'documentNumber',
            width: 300,
            render: (text, record) => (
                <span className="primaryColor" onClick={() => openPage(record)}>
                    {text}
                </span>
            ),
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            width: 300,
        },
        {
            title: '合同相对方',
            dataIndex: 'supplierOneName',
            width: 260,
        },
        {
            title: '单位',
            dataIndex: 'registerOrgName',
            width: 300,
        },
        {
            title: '部门',
            dataIndex: 'registerDeptName',
            width: 200,
        },
        {
            title: '经办人',
            dataIndex: 'registerIdentityName',
            width: 200,
        },
        {
            title: '合同签订日期',
            dataIndex: 'contractSignDate',
            width: 200,
            render: (text) => text && dayjs.unix(text).format('YYYY-MM-DD'),
        },
        {
            title: '合同类型',
            dataIndex: 'contractTypeTldt',
            width: 200,
            render: (text) => getLabel(typeList, text),
        },
        {
            title: '合同相对方纳税人识别号',
            dataIndex: 'identificationNumberOfTheTaxpayer',
            width: 200,
        },
        {
            title: '采购方式',
            dataIndex: 'purchaseMethodTldt',
            width: 200,
            render: (text) => getLabel(buyWayList, text),
        },
        {
            title: '合同金额',
            dataIndex: 'totalMoney',
            width: 200,
            render: (text) => <span>{Number(text).toFixed(2)}</span>,
            showStyle: 'MONEY',
        },
        {
            title: '合同已支付金额',
            dataIndex: 'alreadyMoney',
            width: 200,
            render: (text, record) => (
                <span className="primaryColor" onClick={() => openContractAmountDetail(record)}>
                    {Number(text).toFixed(2)}
                </span>
            ),
            showStyle: 'MONEY',
        },
        {
            title: '到账金额',
            dataIndex: 'receivedAmount',
            width: 200,
            render: (text) => <span>{Number(text).toFixed(2)}</span>,
            showStyle: 'MONEY',
        },
        {
            title: '执行率',
            dataIndex: 'payPlan',
            width: 200,
        },
        {
            title: '合同状态',
            dataIndex: 'contractStateTldt',
            width: 200,
            render: (text) => getLabel(statusList, text),
        },
        {
            title: '备注',
            dataIndex: 'notes',
            width: 200,
        },
        {
            title: '办理状态',
            dataIndex: 'bizStatus',
            width: 200,
            render: (text) => getLabel(blList, text),
        },
        {
            title: '缴税状态',
            dataIndex: 'taxPaymentStatusTldt',
            width: 200,
            render: (text) => getLabel(payList, text),
        },
        {
            title: '关联的保证金认领单',
            dataIndex: 'claimName',
            width: 200,
        },
        {
            title: '验收日期',
            dataIndex: 'acceptanceTime',
            width: 200,
            render: (text) => text && dayjs.unix(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '是否调整',
            dataIndex: 'isPaytrimTldt',
            width: 200,
            render: (text) => getLabel(isBigList, text),
        },
    ];
    if (type == 1) {
        arr.push({
            title: '是否政采',
            dataIndex: 'isCcgpTldt',
            render: (text) => getLabel(zcList, text),
            width: 150,
        });
    }
    if (type == 3) {
        arr = [
            {
                title: '合同编号',
                dataIndex: 'contractNumber',
                width: 200,
                render: (text, record) => (
                    <span className="primaryColor" onClick={() => openPage(record)}>
                        {text}
                    </span>
                ),
            },
            {
                title: '单据编号',
                dataIndex: 'documentNumber',
                width: 300,
                render: (text, record) => (
                    <span className="primaryColor" onClick={() => openPage(record)}>
                        {text}
                    </span>
                ),
            },
            {
                title: '合同名称',
                dataIndex: 'contractName',
                width: 300,
            },
            {
                title: '合同相对方',
                dataIndex: 'supplierOneName',
                width: 260,
            },
            {
                title: '单位',
                dataIndex: 'registerOrgName',
                width: 300,
            },
            {
                title: '部门',
                dataIndex: 'registerDeptName',
                width: 200,
            },
            {
                title: '经办人',
                dataIndex: 'registerIdentityName',
                width: 200,
            },
            {
                title: '合同签订日期',
                dataIndex: 'contractSignDate',
                width: 200,
                render: (text) => text && dayjs.unix(text).format('YYYY-MM-DD'),
            },
            {
                title: '合同金额',
                dataIndex: 'totalMoney',
                width: 200,
                render: (text) => <span>{Number(text).toFixed(2)}</span>,
                showStyle: 'MONEY',
            },
            {
                title: '合同状态',
                dataIndex: 'contractStateTldt',
                width: 200,
                render: (text) => getLabel(statusList, text),
            },
            {
                title: '办理状态',
                dataIndex: 'bizStatus',
                width: 200,
                render: (text) => getLabel(blList, text),
            },
            {
                title: '缴税状态',
                dataIndex: 'taxPaymentStatusTldt',
                width: 200,
                render: (text) => getLabel(payList, text),
            },
            {
                title: '关联的保证金认领单',
                dataIndex: 'claimName',
                width: 200,
            },
            {
                title: '验收日期',
                dataIndex: 'acceptanceTime',
                width: 200,
                render: (text) => text && dayjs.unix(text).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
                title: '是否调整',
                dataIndex: 'isPaytrimTldt',
                width: 200,
                render: (text) => getLabel(isBigList, text),
            },
        ];
    }
    return arr.map((item) => ({
        ...item,
        sorter: (a, b) => {
            return tableSort(a[item.dataIndex], b[item.dataIndex], item.showStyle);
        },
        key: item.dataIndex,
        columnCode: item.dataIndex,
        columnName: item.title,
    }));
};
