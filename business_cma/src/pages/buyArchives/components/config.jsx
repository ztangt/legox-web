import { tableSort } from '../../../util/util';

export const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
};

export const tailLayout = {
    wrapperCol: {
        offset: 10,
        span: 16,
    },
};
const openNewPage = (query) => {
    historyPush({
        pathname: `/dynamicPage/formShow`,
        query: query,
    });
};

export const getColumns = () => {
    return [
        {
            title: '事项申请编号',
            dataIndex: 'purchaseRegisterNumber',
            width: 200,
            render: (text, record) => (
                <span
                // className="primaryColor"
                // onClick={() =>
                //     openNewPage({
                //         bizInfoId: record.purchaseRequestBizId,
                //         bizSolId: record.purchaseRequestSolId,
                //         id: record.purchaseRequestMianId,
                //         currentTab: record.id,
                //         maxDataruleCode: '',
                //         title: record.purchaseRequestTitle,
                //     })
                // }
                >
                    {text}
                </span>
            ),
        },
        {
            title: '事项申请名称',
            dataIndex: 'purchaseName',
            width: 200,
        },
        {
            title: '政采项目编号',
            dataIndex: 'entrustProjectNo',
            width: 200,
            render: (text, record) => (
                <span
                // className="primaryColor"
                // onClick={() =>
                //     openNewPage({
                //         bizInfoId: record.purchaseProjectBizId,
                //         bizSolId: record.purchaseProjectSolId,
                //         id: record.purchaseProjectMainId,
                //         currentTab: record.id,
                //         maxDataruleCode: '',
                //         title: record.purchaseProjectTitle,
                //     })
                // }
                >
                    {text}
                </span>
            ),
        },
        {
            title: '政采项目名称',
            dataIndex: 'entrustProjectName',
            width: 200,
        },
        {
            title: '采购预算项目',
            dataIndex: 'projectName',
            width: 200,
        },
        {
            title: '采购预算金额(万元)',
            dataIndex: 'purchasePlanMoney',
            width: 200,
            render: (text) => <span>{Number(text).toFixed(2)}</span>,
            showStyle: 'MONEY',
        },
        {
            title: '采购单位名称',
            dataIndex: 'registerOrgName',
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
