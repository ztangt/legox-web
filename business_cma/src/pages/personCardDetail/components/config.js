import { getLabel } from '@/util/util';

export const zcList = ['否', '是'];
export const getColumnsList = (models, text) => {
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
            showSort: true,
            width: 360,
        },
        {
            title: '金额',
            field: 'amount',
            showSort: true,
            width: 200,
        },
        {
            title: text,
            field: 'reimbCardNum',
            showSort: true,
            width: 300,
        },
        {
            title: '业务日期',
            field: 'businessDate',
            showSort: true,
            width: 200,
        },
        {
            title: '单位名称',
            field: 'cashierOrgName',
            showSort: true,
            width: 300,
        },
        {
            title: '汇款账号',
            field: 'payerAccountNumber',
            showSort: true,
            width: 360,
        },
        {
            title: '姓名',
            field: 'businessCardUserName',
            showSort: true,
            width: 200,
        },
        {
            title: '个人储蓄卡（工资）卡号',
            field: 'businessCardNumber',
            showSort: true,
            width: 300,
        },
        {
            title: '开户行名称',
            field: 'businessCardOpenBankName',
            showSort: true,
            width: 360,
        },
        {
            title: '经济分类',
            field: 'economicTypeName',
            showSort: true,
            width: 300,
        },
        {
            title: '用途',
            field: 'useOfExpense',
            showSort: true,
            width: 360,
        },
        {
            title: '账户性质',
            field: 'reimbursementAccountType',
            fieldFormat: (record) => getLabel(companyList, record.reimbursementAccountType),
            showSort: true,
            width: 200,
        },
        {
            title: '账套',
            field: 'orgAccountName',
            showSort: true,
            width: 300,
        },
        {
            title: '预算科目编码',
            field: 'budgetAccountCode',
            showSort: true,
            width: 200,
        },
        {
            title: '预算科目名称',
            field: 'budgetAccountName',
            showSort: true,
            width: 300,
        },
        {
            title: '资金来源',
            field: 'fundTypeName',
            showSort: true,
            width: 200,
        },
        {
            title: '支出类型',
            field: 'expenseTypeCode',
            showSort: true,
            width: 300,
        },
        {
            title: '关联码',
            field: 'relationCode',
            showSort: true,
            width: 200,
        },
        {
            title: '经办人',
            field: 'claimantUserName',
            showSort: true,
            width: 200,
        },
        {
            title: '是否政采',
            field: 'isCcgpTldt',
            fieldFormat: (record) => zcList[record.isCcgpTldt],
            showSort: true,
            width: 150,
        },
        {
            title: '复核人',
            field: 'secondCheckerUserName',
            showSort: true,
            width: 200,
        },
        {
            title: '办理日期',
            field: 'payTime',
            showSort: true,
            width: 200,
        },
    ];
};
