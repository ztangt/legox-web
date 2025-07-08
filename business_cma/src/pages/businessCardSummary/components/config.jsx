import { getLabel } from '@/util/util';
import * as ReactVTable from '@visactor/react-vtable';

const VGroup = ReactVTable.VTable.VGroup;
const VText = ReactVTable.VTable.VText;

export const getColumnsList = (models, operationCol) => {
    const { companyList, payStateList } = models;
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
            sort: true,
        },
        {
            title: '还款单号',
            field: 'businessCardSummaryId',
            width: 300,
            sort: true,
        },
        {
            title: '还款金额',
            field: 'amount',
            width: 200,
            sort: true,
        },
        {
            title: '银行账户',
            field: 'businessCardNumber',
            width: 300,
            sort: true,
        },
        {
            title: '账户性质',
            field: 'reimbursementAccountType',
            width: 200,
            fieldFormat: (record) => getLabel(companyList, record.reimbursementAccountType),
            sort: true,
        },
        {
            title: '账套',
            field: 'orgAccountName',
            width: 300,
            sort: true,
        },
        {
            title: '预算科目编码',
            field: 'budgetAccountCode',
            width: 200,
            sort: true,
        },
        {
            title: '预算科目名称',
            field: 'budgetAccountName',
            width: 300,
            sort: true,
        },
        {
            title: '资金来源',
            field: 'fundTypeName',
            width: 200,
            sort: true,
        },
        {
            title: '支出性质',
            field: 'expenditureTypeName',
            width: 200,
            sort: true,
        },
        {
            title: '支出类型',
            field: 'expenseTypeCode',
            width: 200,
            sort: true,
        },
        {
            title: '经济分类编码',
            field: 'economicTypeCode',
            width: 200,
            sort: true,
        },
        {
            title: '经济分类名称',
            field: 'economicTypeName',
            width: 300,
            sort: true,
        },
        {
            title: '办理状态',
            field: 'payState',
            width: 200,
            fieldFormat: (record) => getLabel(payStateList, record.payState),
            sort: true,
        },
        {
            title: '业务日期',
            field: 'payTime',
            width: 200,
            sort: true,
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
