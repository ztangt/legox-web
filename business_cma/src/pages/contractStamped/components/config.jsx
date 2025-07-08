import dayjs from 'dayjs';
import { history } from 'umi';
import { tableSort } from '../../../util/util';

export const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
};

// const statusList = [
//     { value: 1, label: '正常' },
//     { value: 2, label: '解除' },
//     { value: 3, label: '终止' },
//     { value: 4, label: '变更中' },
//     { value: 5, label: '解除中' },
//     { value: 6, label: '终止中' },
//     { value: 7, label: '已完成验收' },
//     { value: 'nk-8', label: '正在纠纷处理中' },
//     { value: 'cams-9', label: '执行中' },
//     { value: 'cams-10', label: '支付完成未验收' },
// ];
// const acceptanceStatusList = [
//     { value: 1, label: '已验收' },
//     { value: 2, label: '未验收' },
//     { value: 3, label: '逾期未验收' },
// ];

//1是已验收,2是未验收,3是逾期未验收
export const colorList = [
    { color: '#50AC50', label: '已验收', value: '1', keyName: 'accepted' },
    { color: '#AAAFBD', label: '待验收', value: '2', keyName: 'unaccepted' },
    { color: '#FA2C19', label: '逾期未验收', value: '3', keyName: 'overdue' },
    { color: '#EA9743', label: '即将逾期', value: '4', keyName: 'deadline' },
];

//办理状态
export const blList = [
    { value: 'endEvent', label: '办结' },
    { value: 'startEvent', label: '在办' },
];

export const getLabel = (list, value) => {
    let item = list.find((item) => item.value == value);
    return item ? item.label : '';
};

const openNewPage = (record) => {
    history.push({
        pathname: '/contractList',
        query: {
            id: record.mainTableId,
        },
    });
};

export const openPage = (record) => {
    historyPush({
        pathname: `/dynamicPage/formShow`,
        query: {
            bizInfoId: record.bizId,
            bizSolId: record.solId,
            id: record.mainTableId,
            currentTab: '1',
            maxDataruleCode: '',
            title: record.contractName,
        },
    });
};

export const getColumns = (contractStamped) => {
    let { typeList, checkList, contractStatusList } = contractStamped;

    contractStatusList = [
        ...contractStatusList,
        { value: 'cams-9', label: '执行中' },
        { value: 'cams-10', label: '支付完成未验收' },
    ];
    return [
        {
            title: '合同编号',
            dataIndex: 'contractNumber',
            width: 200,
        },
        {
            title: '合同相对方',
            dataIndex: 'supplierOneName',
            width: 200,
        },
        {
            title: '承办部门',
            dataIndex: 'registerDeptName',
            width: 200,
        },
        {
            title: '承办人',
            dataIndex: 'registerIdentityName',
            width: 200,
        },
        {
            title: '承办人联系方式',
            dataIndex: 'mobilePhoneNum',
            width: 200,
        },
        {
            title: '项目负责人',
            dataIndex: 'chargeIdentityName',
            width: 200,
        },
        {
            title: '合同盖章日期',
            dataIndex: 'contractStampTime',
            width: 200,
            render: (text) => text && dayjs.unix(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '资金来源',
            dataIndex: 'sourceOfFundsName',
            width: 200,
        },
        {
            title: '合同类型',
            dataIndex: 'contractTypeTldt',
            width: 200,
            render: (text) => getLabel(typeList, text),
        },
        {
            title: '合同金额',
            dataIndex: 'totalMoney',
            width: 200,
            render: (text, record) => Number(text).toFixed(2),
            showStyle: 'MONEY',
        },
        {
            title: '合同起始日期',
            dataIndex: 'performanceStartDate',
            width: 200,
            render: (text) => text && dayjs.unix(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '合同结束日期',
            dataIndex: 'performanceEndDate',
            width: 200,
            render: (text) => text && dayjs.unix(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '距离合同到期时间(天）',
            dataIndex: 'untilContractExpirationDay',
            width: 200,
        },
        {
            title: '执行金额',
            dataIndex: 'alreadyMoney',
            width: 200,
            render: (text, record) => (
                <span onClick={() => openNewPage(record)} className="primaryColor">
                    {Number(text).toFixed(2)}
                </span>
            ),
            showStyle: 'MONEY',
        },
        {
            title: '执行比例',
            dataIndex: 'payPlan',
            width: 200,
            showStyle: 'MONEY',
        },
        {
            title: '合同状态',
            dataIndex: 'contractStateTldt',
            width: 200,
            render: (text) => getLabel(contractStatusList, text),
        },
        {
            title: '验收状态',
            dataIndex: 'acceptanceStatusTldt',
            width: 200,
            render: (text) => getLabel(checkList, text),
        },
        {
            title: '验收日期',
            dataIndex: 'acceptanceTime',
            width: 200,
            render: (text) => text && dayjs.unix(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '延期日期',
            dataIndex: 'delayTime',
            width: 200,
            render: (text) => text && dayjs.unix(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '作废说明',
            dataIndex: 'notes',
            width: 200,
        },
        {
            title: '是否纸质档案归档',
            dataIndex: 'isPaperArchiveTldt',
            width: 200,
            render: (text) => (text == 1 ? '是' : '否'),
        },
        {
            title: '归档时间',
            dataIndex: 'filingTime',
            width: 200,
            render: (text) => (text && text != '0' ? dayjs.unix(text).format('YYYY-MM-DD HH:mm:ss') : ''),
        },
    ].map((item) => ({
        ...item,
        sorter: (a, b) => {
            return tableSort(a[item.dataIndex], b[item.dataIndex], item.showStyle);
        },
        key: item.dataIndex,
        columnCode: item.dataIndex,
        columnName: item.title,
    }));
};
