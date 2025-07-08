import { getLabel } from '@/util/util';
export const zcList = ['否', '是'];

export const getColumnsList = (models) => {
    const { companyList } = models;
    return [
        {
            cellType: 'checkbox',
            headerType: 'checkbox',
            width: 60,
            field: 'isChecked',
        },
        {
            title: '序号',
            fieldFormat: (record, colIndex, rowIndex) => rowIndex,
            width: 80,
        },
        {
            title: '单据编号',
            field: 'voucherNumber',
            sort: true,
            width: 300,
        },
        {
            title: '还款金额',
            field: 'amount',
            sort: true,
            width: 200,
        },
        {
            title: '单位名称',
            field: 'cashierOrgName',
            sort: true,
            width: 300,
        },
        {
            title: '账户性质',
            field: 'reimbursementAccountType',
            fieldFormat: (record) => getLabel(companyList, record.reimbursementAccountType),
            sort: true,
            width: 200,
        },
        {
            title: '账套',
            field: 'orgAccountName',
            sort: true,
            width: 300,
        },
        {
            title: '预算科目编码',
            field: 'budgetAccountCode',
            sort: true,
            width: 200,
        },
        {
            title: '预算科目名称',
            field: 'budgetAccountName',
            sort: true,
            width: 300,
        },
        {
            title: '支出类型',
            field: 'expenseTypeCode',
            sort: true,
            width: 200,
        },
        {
            title: '关联码',
            field: 'relationCode',
            sort: true,
            width: 200,
        },
        {
            title: '经办人',
            field: 'claimantUserName',
            sort: true,
            width: 200,
        },
        {
            title: '经济分类编码',
            field: 'economicTypeCode',
            sort: true,
            width: 200,
        },
        {
            title: '经济分类名称',
            field: 'economicTypeName',
            sort: true,
            width: 300,
        },
        {
            title: '是否政采',
            field: 'isCcgpTldt',
            fieldFormat: (record) => zcList[record.isCcgpTldt],
            sort: true,
            width: 150,
        },
    ];
};
