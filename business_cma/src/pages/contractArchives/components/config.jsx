import dayjs from 'dayjs';
import { tableSort } from '../../../util/util';

export const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
};

const statusList = [
    { value: 0, label: '待发' },
    { value: 1, label: '在办' },
    { value: 2, label: '办结' },
];

export const getLabel = (list, value) => {
    let item = list.find((item) => item.value == value);
    return item ? item.label : '';
};

const openNewPage = (record) => {
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

export const getColumns = (contractArchives) => {
    const { typeList, fundList } = contractArchives;

    return [
        {
            title: '合同编号',
            dataIndex: 'contractNumber',
            width: 200,
            render: (text, record) => (
                <span className="primaryColor" onClick={() => openNewPage(record)}>
                    {text}
                </span>
            ),
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            width: 200,
        },
        {
            title: '合同金额(元)',
            dataIndex: 'totalMoney',
            width: 200,
            render: (text) => <span>{Number(text).toFixed(2)}</span>,
            showStyle: 'MONEY',
        },
        {
            title: '签订日期',
            dataIndex: 'contractSignDate',
            width: 200,
            render: (text) => text && dayjs.unix(text).format('YYYY-MM-DD'),
        },
        {
            title: '合同验收日期',
            dataIndex: 'acceptanceTime',
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
            title: '合同性质',
            dataIndex: 'contractNatureTldt',
            width: 200,
            render: (text) => getLabel(fundList, text),
        },
        {
            title: '申请部门',
            dataIndex: 'registerDeptName',
            width: 200,
        },
        {
            title: '申请人',
            dataIndex: 'registerIdentityName',
            width: 200,
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
