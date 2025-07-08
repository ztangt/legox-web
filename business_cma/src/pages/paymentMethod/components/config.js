import { BASE_WIDTH, ORDER_WIDTH } from '@/util/constant';
import { formattingMoney } from '@/util/util';

const payStateList = ['待办理', '已办理'];

export const titleList = {
    index: '序号',
    checkNumber: '支票号',
    voucherNumber: '单据编号',
    firstCheckerUserName: '审核人',
    secondCheckerUserName: '复核人',
    cashierUserName: '出纳办理人',
    businessDate: '业务日期',
    payState: '支票状态',
    amount: '金额',
};

let payTitleList = {
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

export const getColumnsList = (models, operationCol, type) => {
    let list = type == 1 ? titleList : payTitleList;
    let columnsList = [];
    Object.keys(list).map((key, index) => {
        let minWidth = list[key].length * 20;
        let width = minWidth < BASE_WIDTH ? BASE_WIDTH : minWidth;
        columnsList.push({
            title: list[key],
            dataIndex: key,
            key: key,
            fixed: key === 'index' ? 'left' : null,
            width: key === 'voucherNumber' ? 360 : key === 'index' ? ORDER_WIDTH : width + 60,
            render: (text, record, index) => {
                if (key === 'index') {
                    return index + 1;
                }
                if (key === 'payState') {
                    return payStateList[text];
                }
                if (key === 'amount') {
                    return formattingMoney(text);
                }
                return text;
            },
        });
    });
    if (operationCol) {
        columnsList.push(operationCol);
    }
    return columnsList;
};

export const getVTableColumns = () => {
    return [
        {
            cellType: 'radio',
            width: 60,
            field: 'isChecked',
        },
        {
            title: '序号',
            fieldFormat: (record, colIndex, rowIndex) => rowIndex,
            width: 80,
        },
        {
            title: '支票号',
            field: 'checkNumber',
            width: 200,
        },
        {
            title: '单据编号',
            field: 'voucherNumber',
            width: 360,
        },
        {
            title: '审核人',
            field: 'firstCheckerUserName',
            width: 200,
        },
        {
            title: '复核人',
            field: 'secondCheckerUserName',
            width: 200,
        },
        {
            title: '出纳办理人',
            field: 'cashierUserName',
            width: 200,
        },
        {
            title: '业务日期',
            field: 'businessDate',
            width: 200,
        },
        {
            title: '支票状态',
            field: 'payState',
            width: 200,
            fieldFormat: (record) => payStateList[record.payState],
        },
        {
            title: '金额',
            field: 'amount',
            width: 200,
            fieldFormat: (record) => formattingMoney(record.amount),
        },
    ];
};
