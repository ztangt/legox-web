import { formattingMoneyEn } from '@/util/util';
import equationImg from '../../assets/equation.svg';
import greenArrow from '../../assets/greenArrow.svg';
import redArrow from '../../assets/redArrow.svg';

export const optionText = "AND DOCUMENT_TYPE NOT IN('010102','010110','010111')";
export const salaryMonthColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: 60,
        align: 'center',
        render: (text, record, index) => {
            return index + 1;
        },
    },
    {
        title: '工资项',
        dataIndex: 'name',
        align: 'center',
    },
    {
        title: '金额',
        dataIndex: 'money',
        align: 'center',
        render: (text) => {
            return formattingMoneyEn(text);
        },
    },
    {
        title: '较上月变化',
        dataIndex: 'compare',
        align: 'center',
        render: (text) => {
            return (
                // <div>
                //     {text == 0 && (
                //         <PauseOutlined style={{ color: '#333', transform: 'rotate(90deg)', fontSize: '16px' }} />
                //     )}
                //     {text == 1 && <ArrowUpOutlined style={{ color: '#FA0000', fontSize: '16px' }} />}
                //     {text == 2 && <ArrowDownOutlined style={{ color: '#45b528', fontSize: '16px' }} />}
                // </div>
                <div>
                    {text == 0 && <img alt="" src={equationImg} style={{ width: '16px', height: '16px' }} />}
                    {text == 1 && (
                        <img
                            src={redArrow}
                            alt=""
                            style={{ width: '16px', height: '16px', transform: 'rotate(-90deg)' }}
                        />
                    )}
                    {text == 2 && (
                        <img
                            src={greenArrow}
                            alt=""
                            style={{ width: '16px', height: '16px', transform: 'rotate(90deg)' }}
                        />
                    )}
                </div>
            );
        },
    },
];

export const salaryTotalColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: 70,
        align: 'center',
        render: (text, record, index) => {
            return index + 1;
        },
    },
    {
        title: '工资发放单位',
        dataIndex: 'wageOrgName',
        align: 'center',
    },
    {
        title: '工资类别',
        dataIndex: 'wageClassName',
        align: 'center',
    },
    {
        title: '月份',
        dataIndex: 'month',
        align: 'center',
    },
    {
        title: '应发合计',
        dataIndex: 'totalDueAmt',
        align: 'center',
        render: (text) => {
            return formattingMoneyEn(text);
        },
    },
    {
        title: '扣款合计',
        dataIndex: 'deductionSubtotalAmt',
        align: 'center',
        render: (text) => {
            return formattingMoneyEn(text);
        },
    },
    {
        title: '其中主要扣款',
        // dataIndex: 'actualTotalAmt',
        align: 'center',
        children: [
            {
                title: '失业保险',
                dataIndex: 'unemploymentInsuranceAmt',
                align: 'center',
                render: (text) => {
                    return formattingMoneyEn(text);
                },
            },
            {
                title: '养老保险',
                dataIndex: 'endowmentInsuranceAmt',
                align: 'center',
                render: (text) => {
                    return formattingMoneyEn(text);
                },
            },
            {
                title: '医疗保险',
                dataIndex: 'medicalinsuranceAmt',
                align: 'center',
                render: (text) => {
                    return formattingMoneyEn(text);
                },
            },
            {
                title: '住房公积金',
                dataIndex: 'housingFundAmt',
                align: 'center',
                render: (text) => {
                    return formattingMoneyEn(text);
                },
            },
            {
                title: '个人所得税',
                dataIndex: 'individualIncomeTax',
                align: 'center',
                render: (text) => {
                    return formattingMoneyEn(text);
                },
            },
            {
                title: '职业年金（机关）',
                dataIndex: 'occupationalAnnuityAmt',
                align: 'center',
                render: (text) => {
                    return formattingMoneyEn(text);
                },
            },
        ],
    },
    {
        title: '实发合计',
        dataIndex: 'actualTotalAmt',
        align: 'center',
        render: (text) => {
            return formattingMoneyEn(text);
        },
    },
];

export const afterTaxColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: 60,
        align: 'center',
        render: (text, record, index) => {
            return index + 1;
        },
    },
    {
        title: '劳务类型',
        dataIndex: 'DOCUMENT_NAME',
        align: 'center',
        width: 200,
    },
    {
        title: '报销单据号',
        dataIndex: 'NUMBER',
        align: 'center',
        width: 200,
    },
    {
        title: '报销事由',
        dataIndex: 'NCC_TITLE',
        align: 'center',
        width: 200,
    },
    {
        title: '发放单位',
        dataIndex: 'ORG_NAME',
        align: 'center',
        width: 200,
    },
    {
        title: '月份',
        dataIndex: 'month',
        align: 'center',
    },
    {
        title: '劳务报酬',
        dataIndex: 'AMOUNT_BEFORE_TAX',
        align: 'center',
        render: (text) => {
            return formattingMoneyEn(text);
        },
    },
    {
        title: '应纳税额',
        dataIndex: 'TAX_AMOUNT',
        align: 'center',
        render: (text) => {
            return formattingMoneyEn(text);
        },
    },
    {
        title: '税后收入',
        dataIndex: 'AMOUNT_AFTER_TAX',
        align: 'center',
        render: (text) => {
            return formattingMoneyEn(text);
        },
    },
];

export const businessColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: 60,
        align: 'center',
        render: (text, record, index) => {
            return index + 1;
        },
    },

    {
        title: '单据号',
        dataIndex: 'voucherNumber',
        align: 'center',
        width: 300,
    },
    {
        title: '报销事由',
        dataIndex: 'useOfExpense',
        align: 'center',
        width: 300,
    },
    {
        title: '报销单位',
        dataIndex: 'budgetOrgName',
        align: 'center',
        width: 200,
    },
    {
        title: '付款日期',
        dataIndex: 'businessDateStr',
        align: 'center',
        width: 140,
    },
    {
        title: '刷卡日期',
        dataIndex: 'dateOfConsumptionStr',
        align: 'center',
        width: 140,
    },
    {
        title: '刷卡金额',
        dataIndex: 'swipecardAmount',
        align: 'center',
        render: (text) => {
            return formattingMoneyEn(text);
        },
    },
    {
        title: '报销金额',
        dataIndex: 'amount',
        align: 'center',
        render: (text) => {
            return formattingMoneyEn(text);
        },
    },
];

export const personaColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: 60,
        align: 'center',
        render: (text, record, index) => {
            return index + 1;
        },
    },

    {
        title: '单据号',
        dataIndex: 'voucherNumber',
        align: 'center',
        width: 300,
    },
    {
        title: '报销事由',
        dataIndex: 'useOfExpense',
        align: 'center',
        width: 300,
    },
    {
        title: '报销单位',
        dataIndex: 'budgetOrgName',
        align: 'center',
        width: 300,
    },
    {
        title: '付款日期',
        dataIndex: 'businessDateStr',
        align: 'center',
        width: 140,
    },
    {
        title: '收款账号',
        dataIndex: 'businessCardNumber',
        align: 'center',
        width: 300,
    },
    {
        title: '报销金额',
        dataIndex: 'amount',
        align: 'center',
        render: (text) => {
            return formattingMoneyEn(text);
        },
    },
];

export const expenseList = [
    { label: '全部', value: '' },
    { label: '差旅报销单', value: '1' },
    { label: '其他报销单', value: '0' },
];

export const laborList = [
    { label: '全部', value: '' },
    { label: '本单位劳务费', value: '010110' },
    { label: '外单位劳务费', value: '010111' },
];
