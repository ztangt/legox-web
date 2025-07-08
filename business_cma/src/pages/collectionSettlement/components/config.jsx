import { getLabel } from '@/util/util';
import * as ReactVTable from '@visactor/react-vtable';
const VGroup = ReactVTable.VTable.VGroup;
const VText = ReactVTable.VTable.VText;

export const payTypeList = {
    0: '现金',
    1: '支票',
    2: '银行收款',
    3: '转账汇款',
};
export const payTypeOptions = [
    { value: '0', label: '现金' },
    { value: '1', label: '支票' },
    { value: '2', label: '银行收款' },
    { value: '3', label: '转账汇款' },
];

export const getColumnsList = (models, text) => {
    let { payStateList } = models;
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
            width: 300,
        },
        {
            title: text,
            field: 'reimbCardNum',
            width: 300,
        },
        {
            title: '收款单位名称',
            field: 'receiveOrgName',
            width: 300,
        },
        {
            title: '付款单位名称',
            field: 'payerOrgName',
            width: 300,
        },
        {
            title: '收款金额',
            field: 'amount',
            width: 200,
        },
        {
            title: '收款账户',
            field: 'receiveAccountNumber',
            width: 300,
        },
        {
            title: '收款方式',
            field: 'payType',
            fieldFormat: (record) => payTypeList[record.payType],
            width: 200,
        },
        {
            title: '票据张数',
            field: 'numberOfbills',
            width: 200,
        },
        {
            title: '单据日期',
            field: 'businessDate',
            width: 200,
        },
        {
            title: '资金用途',
            field: 'useOfExpense',
            width: 300,
        },
        {
            title: '复核人',
            field: 'secondCheckerUserName',
            width: 200,
        },
        {
            title: '办理状态',
            field: 'payState',
            fieldFormat: (record) => getLabel(payStateList, record.payState),
            width: 200,
        },
        {
            title: '业务日期',
            field: 'payTime',
            width: 200,
        },
        {
            title: '操作',
            width: 100,
            customLayout: (args) => {
                const { table, row, col, rect } = args;
                const { height, width } = rect || table.getCellRect(col, row);
                const record = table.getRecordByRowCol(col, row);
                const container = (
                    <VGroup
                        attribute={{
                            id: 'container',
                            width,
                            height,
                            display: 'flex',
                            flexWrap: 'nowrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            alignContent: 'center',
                        }}
                    >
                        <VText
                            attribute={{
                                id: 'handle',
                                text: record.payState == 0 ? '办理' : record.payState == 1 ? '收回' : '',
                                fontSize: 13,
                                fill: '#1890FF',
                                boundsPadding: [10, 20, 10, 20],
                                cursor: 'pointer',
                            }}
                        />
                    </VGroup>
                );
                return {
                    rootContainer: container,
                    renderDefault: false,
                };
            },
        },
    ];
};
