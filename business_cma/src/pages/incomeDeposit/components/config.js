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
    orgAccountName: '单位套账',
    // budgetAccCode: '预算科目代码',
    budgetAccName: '预算科目名称（功能分类）',
    fundTypeName: '资金来源',
    relationCode: '关联码',
    voucherNumber: '单据号',
    // amount: '金额',
};
// 单位账套、预算科目名称（功能分类）、资金来源、关联码、单据号、金额
export const getColumnsList = (models, colList, type) => {
    let list = type == 'detail' ? detailTitleList : titleList;
    const { accountTypeList } = models;
    let columnsList = [];
    Object.keys(list).map((key, index) => {
        let minWidth = list[key].length * 20;
        let width = minWidth < BASE_WIDTH ? BASE_WIDTH : minWidth;
        if (key == 'voucherNumber') {
            width = 240;
        }
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
