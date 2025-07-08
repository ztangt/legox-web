export const zcList = ['否', '是'];

export const bankTypeList = {
    1: '个人公务卡',
    2: '个人储蓄卡',
    3: '单位卡',
};

export const getColumnsList = () => {
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
            width: 300,
        },
        {
            title: '刷卡金额',
            field: 'amount',
            showSort: true,
            width: 200,
        },
        {
            title: '银行类别',
            field: 'businessCardType',
            fieldFormat: (record) => bankTypeList[record.businessCardType],
            showSort: true,
            width: 200,
        },
        {
            title: '证件号',
            field: 'businessCardUserIdNumber',
            showSort: true,
            width: 300,
        },
        {
            title: '人员',
            field: 'businessCardUserName',
            showSort: true,
            width: 200,
        },
        {
            title: '卡号',
            field: 'businessCardNumber',
            showSort: true,
            width: 300,
        },
        {
            title: '开户银行',
            field: 'businessCardOpenBankName',
            showSort: true,
            width: 300,
        },
        {
            title: '单据日期',
            field: 'businessDate',
            showSort: true,
            width: 200,
        },
        {
            title: 'POS凭证号',
            field: 'businessCardPosNumber',
            showSort: true,
            width: 200,
        },
        {
            title: '备注',
            field: 'mark',
            showSort: true,
            width: 300,
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
    ];
};
