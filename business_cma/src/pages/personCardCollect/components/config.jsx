import { getLabel } from '@/util/util';
import * as ReactVTable from '@visactor/react-vtable';
const VGroup = ReactVTable.VTable.VGroup;
const VText = ReactVTable.VTable.VText;

export const getColumnsList = (models) => {
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
            title: '还款单号',
            field: 'businessCardSummaryId',
            sort: true,
            width: 360,
        },
        {
            title: '单位名称',
            field: 'cashierOrgName',
            sort: true,
            width: 300,
        },
        {
            title: '金额',
            field: 'amount',
            sort: true,
            width: 200,
        },
        {
            title: '汇款账户',
            field: 'payerAccountNumber',
            sort: true,
            width: 360,
        },
        {
            title: '开户行名称',
            field: 'businessCardOpenBankName',
            sort: true,
            width: 360,
        },
        {
            title: '经济分类',
            field: 'economicTypeName',
            sort: true,
            width: 300,
        },
        {
            title: '账户性质',
            field: 'reimbursementAccountType',
            fieldFormat: (record) => getLabel(models.companyList, record.reimbursementAccountType),
            sort: true,
            width: 200,
        },
        {
            title: '账套',
            field: 'orgAccountName',
            sort: true,
            width: 300,
        },
        {
            title: '预算科目编码',
            field: 'budgetAccountCode',
            sort: true,
            width: 200,
        },
        {
            title: '预算科目名称',
            field: 'budgetAccountName',
            sort: true,
            width: 300,
        },
        {
            title: '资金来源',
            field: 'fundTypeName',
            sort: true,
            width: 300,
        },
        {
            title: '支出类型',
            field: 'expenseTypeCode',
            sort: true,
            width: 200,
        },
        {
            title: '关联码',
            field: 'relationCode',
            sort: true,
            width: 200,
        },
        {
            title: '办理状态',
            field: 'payState',
            fieldFormat: (record) => models.payStateList.find((item) => item.value == record.payState)?.label,
            sort: true,
            width: 200,
        },
        {
            title: '业务日期',
            field: 'payTime',
            sort: true,
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
