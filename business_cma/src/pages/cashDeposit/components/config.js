import { BASE_WIDTH, ORDER_WIDTH } from '@/util/constant';
import { getLabel } from '@/util/util';
export const titleList = {
    index: '序号',
    COMPANY_NAME: '单位名称',
    BANK_ACCOUNT: '银行账户',
    ACCOUNT_TYPE_TLDT_: '账户性质',
};

export const detailTitleList = {
    index: '序号',
    orgAccount: '单位套账',
    budgetAccCode: '预算科目代码',
    budgetAccName: '预算科目名称',
    foundSorce: '资金来源',
    relationCode: '关联码',
    // lastdayVaultAmount: '上一工作日库存现金（元）',
    extractAmount: '本日提取（元）',
    dayOutAmount: '本日支出（元）',
    // dayIncomeAmount: '本日直接收入金额（元）',
    dayReturnAmount: '本日退回金额（元）',
    balance: '余额（元）',
    // dayIncomeDepositAmount: '本日收入送存银行（元）',
    // dayReturnDepositAmount: '本日退款送存银行（元）',
};

export const getColumnsList = (models, colList, type) => {
    let list = type == 'detail' ? detailTitleList : titleList;
    const { accountTypeList } = models;
    let columnsList = [];
    Object.keys(list).map((key, index) => {
        let minWidth = list[key].length * 20;
        let width = minWidth < BASE_WIDTH ? BASE_WIDTH : minWidth;
        columnsList.push({
            title: list[key],
            dataIndex: key,
            key: key,
            fixed: key === 'index' ? 'left' : null,
            width: key === 'index' ? ORDER_WIDTH : width + 60,
            render: (text, record, index) => {
                if (key === 'index') {
                    return index + 1;
                }
                if (key === 'ACCOUNT_TYPE_TLDT_') {
                    return getLabel(accountTypeList, text);
                }
                return text;
            },
        });
    });
    if (colList) {
        columnsList = columnsList.concat(colList);
    }
    return columnsList;
};
