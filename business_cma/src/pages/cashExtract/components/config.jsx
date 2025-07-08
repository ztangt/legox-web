import { BASE_WIDTH, ORDER_WIDTH } from '@/util/constant';
import { getLabel } from '@/util/util';
import dayjs from 'dayjs';

const cashType = {
    0: '未入库',
    1: '已入库未领用',
    2: '已领用未使用',
    3: '已使用',
    4: '已作废',
};

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
};

export const payList = {
    index: '序号',
    orgName: '单位名称',
    checkBankAccountName: '银行',
    checkBankAccount: '银行账户',
    checkType: '类别',
    checkNo: '支票号',
    checkStatus: '支票状态',
    recipintName: '领用人',
    recipintTime: '领用时间',
};

export const getColumnsList = (models, colList, type) => {
    let list = type == 'detail' ? detailTitleList : type == 'pay' ? payList : titleList;
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
                if (key == 'checkType') {
                    return text == 1 ? '现金' : '转账';
                }
                if (key == 'checkStatus') {
                    return cashType[text];
                }
                if (key == 'recipintTime') {
                    return dayjs.unix(Number(text)).format('YYYY-MM-DD');
                    // return dayjs(text).format('YYYY-MM-DD');
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
