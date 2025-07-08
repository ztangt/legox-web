export const zcList = ['否', '是'];
export const titleList = {
    index: '序号',
    voucherNumber: '单据编号',
    amount: '还款金额',
    cashierOrgName: '单位名称',
    reimbursementAccountType: '账户性质',
    orgAccountName: '账套',
    budgetAccountCode: '预算科目编码',
    budgetAccountName: '预算科目名称',
    expenseTypeCode: '支出类型',
    relationCode: '关联码',
    claimantUserName: '经办人',
    economicTypeCode: '经济分类编码',
    economicTypeName: '经济分类名称',
    isCcgpTldt: '是否政采',
};

const BG_COLOR = (args) => {
    const row = args.row;
    //判断是否是偶数
    if (row % 2 === 0) {
        return '#f8f9fa';
    } else {
        return '#fff';
    }
};
export const getColumnsList = () => {
    // const { companyList } = models;
    return [
        {
            cellType: 'checkbox',
            headerType: 'checkbox',
            lock: true,
            width: 60,
        },
        {
            caption: '序号',
            fieldFormat: (record, colIndex, rowIndex) => rowIndex,
            lock: true,
            width: 60,
        },
        {
            caption: '单据编号',
            field: 'voucherNumber',
            width: 300,
            showSort: true,
        },
        {
            caption: '还款金额',
            field: 'amount',
            width: 200,
            showSort: true,
        },
        {
            caption: '单位名称',
            field: 'businessCardUserName',
            width: 300,
            showSort: true,
        },
        {
            caption: '账户性质',
            field: 'reimbursementAccountType',
            // fieldFormat: (record, colIndex, rowIndex) => getLabel(companyList, record.reimbursementAccountType),
            width: 200,
            showSort: true,
        },
        {
            caption: '账套',
            field: 'orgAccountName',
            width: 300,
            showSort: true,
        },
        {
            caption: '预算科目编码',
            field: 'budgetAccountCode',
            width: 300,
            showSort: true,
        },
        {
            caption: '预算科目名称',
            field: 'budgetAccountName',
            width: 200,
            showSort: true,
        },
        {
            caption: '支出类型',
            field: 'expenseTypeCode',
            width: 200,
            showSort: true,
        },
        {
            caption: '关联码',
            field: 'relationCode',
            width: 200,
            showSort: true,
        },
        {
            caption: '经办人',
            field: 'claimantUserName',
            width: 200,
            showSort: true,
        },
        {
            caption: '经济分类编码',
            field: 'economicTypeCode',
            width: 200,
            showSort: true,
        },
        {
            caption: '经济分类名称',
            field: 'economicTypeName',
            width: 200,
            showSort: true,
        },
        {
            caption: '是否政采',
            fieldFormat: (record, colIndex, rowIndex) => zcList[record.isCcgpTldt],
            width: 100,
            showSort: true,
        },
    ];
};
