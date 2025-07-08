import dayjs from 'dayjs';
import { tableSort } from '../../../util/util';

export const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
};

export const statusList = [
    { value: 'endEvent', label: '办结' },
    { value: 'startEvent', label: '在办' },
];

export const getLabel = (list, value) => {
    let item = list.find((item) => item.value == value);
    return item ? item.label : '';
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

export const getColumns = (contractUnstamped) => {
    const { typeList, checkList } = contractUnstamped;

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
            title: '项目名称',
            dataIndex: 'projectName',
            width: 200,
        },
        {
            title: '项目负责人',
            dataIndex: 'chargeIdentityName',
            width: 200,
        },
        {
            title: '合同拟定日期',
            dataIndex: 'createTime',
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
            render: (text) => <span>{Number(text).toFixed(2)}</span>,
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
            title: '办理状态',
            dataIndex: 'bizStatus',
            width: 200,
            render: (text) => getLabel(statusList, text),
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
