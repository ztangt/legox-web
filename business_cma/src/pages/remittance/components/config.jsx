import { getLabel } from '@/util/util';
import * as ReactVTable from '@visactor/react-vtable';

const VGroup = ReactVTable.VTable.VGroup;
const VText = ReactVTable.VTable.VText;

export const zcList = ['否', '是'];
export const getColumnsList = (models, text) => {
    const { payStateList } = models;

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
            title: '单位名称',
            field: 'cashierOrgName',
            width: 300,
            showSort: true,
        },
        {
            title: '单据编号',
            field: 'voucherNumber',
            width: 300,
            showSort: true,
        },
        {
            title: text,
            field: 'reimbCardNum',
            width: 200,
            showSort: true,
        },
        {
            title: '资金来源',
            field: 'fundTypeName',
            width: 200,
            showSort: true,
        },
        {
            title: '预算科目',
            field: 'budgetAccountName',
            width: 300,
            showSort: true,
        },
        {
            title: '汇款金额',
            field: 'amount',
            width: 200,
            showSort: true,
        },
        {
            title: '收款单位账户',
            field: 'receiveAccountNumber',
            width: 300,
            showSort: true,
        },
        {
            title: '收款单位名称',
            field: 'receiveOrgName',
            width: 300,
            showSort: true,
        },
        {
            title: '收款单位所在地',
            field: 'receiveOrgLocation',
            width: 200,
            showSort: true,
        },
        {
            title: '收款单位开户行',
            field: 'receiveOrgOpenBankName',
            width: 300,
            showSort: true,
        },
        {
            title: '支出类型',
            field: 'expendType',
            width: 200,
            showSort: true,
        },
        {
            title: '经济分类',
            field: 'economicTypeName',
            width: 300,
            showSort: true,
        },
        {
            title: '审核人',
            field: 'firstCheckerUserName',
            width: 200,
            showSort: true,
        },
        {
            title: '复核人',
            field: 'secondCheckerUserName',
            width: 200,
            showSort: true,
        },
        {
            title: '受理日期',
            field: 'businessDate',
            width: 200,
            showSort: true,
        },
        {
            title: '业务日期',
            field: 'payTime',
            width: 200,
            showSort: true,
        },
        {
            title: '办理状态',
            field: 'payState',
            width: 200,
            fieldFormat: (record) => getLabel(payStateList, record.payState),
            showSort: true,
        },
        {
            title: '是否政采',
            field: 'isCcgpTldt',
            width: 150,
            fieldFormat: (record) => zcList[record.isCcgpTldt],
            showSort: true,
        },
        {
            title: '经办人',
            field: 'claimantUserName',
            width: 200,
            showSort: true,
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
