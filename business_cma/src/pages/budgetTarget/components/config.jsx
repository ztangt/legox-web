import calcFn from '@/util/calc';
import { formattingMoney } from '@/util/util';
import { history } from 'umi';
import styles from '../index.less';
//资金来源
export const sourceList = [
    { label: '财政批复', value: '财政批复' },
    { label: '上年结转', value: '上年结转' },
    { label: '收入资金', value: '收入资金' },
];

export const compareList = [
    { label: '等于', value: '1' },
    { label: '大于等于', value: '2' },
    { label: '小于等于', value: '3' },
];

export const onOpenNewPage = (type, normCode, id, dispatch) => {
    dispatch({
        type: 'budgetTarget/getState',
        callback: ({ formData }) => {
            let currentYear = formData.usedYear;
            switch (type) {
                case 'FREEZE_BUDGET':
                    history.push({
                        pathname: '/freezeOrExec',
                        query: {
                            id,
                            normCode,
                            moneyType: 'FREEZE',
                            currentYear,
                        },
                    });
                    break;
                case 'EXECUTE_BUDGET':
                    history.push({
                        pathname: '/freezeOrExec',
                        query: {
                            id,
                            normCode,
                            moneyType: 'EXECUTE',
                            currentYear,
                        },
                    });
                    break;
                case 'WAY_FREEZE_BUDGET':
                    history.push({
                        pathname: '/wayList',
                        query: {
                            id,
                            normCode,
                            moneyType: 'WAY_FREEZE',
                            currentYear,
                        },
                    });
                    break;
                case 'WAY_EXEC_BUDGET':
                    history.push({
                        pathname: '/wayList',
                        query: {
                            id,
                            normCode,
                            moneyType: 'WAY_EXECUTE',
                            currentYear,
                        },
                    });
                    break;
                default:
                    break;
            }
        },
    });
};
export const BUDGET_TYPE = {
    0: '禁用',
    1: '提醒',
    3: '不管控',
};
export const NORM_STATE = {
    '': '未结转',
    0: '已收回',
    1: '未结转',
    2: '已结转',
    3: '未结转',
};
export const LH_STATE = {
    '': '未结转',
    0: '未结转',
    1: '已结转',
};

export const BIZSTATUS = {
    //已办事项状态
    0: '待发',
    1: '在办',
    2: '办结',
};
export const EXECSTATE = {
    //已办事项状态
    0: '报销未完成',
    1: '报销已完成',
    2: '撤销',
};
export const YES_NO = {
    0: '否',
    1: '是',
};

export const getLabel = (list, value) => {
    let item = list.find((item) => item.value == value);
    return item ? item.label : '';
};

//获取当年调整金额
const getYearMoney = (record) => {
    let {
        SUM_BUDGET = 0,
        ALLOT_SUM_BUDGET = 0,
        ADJUST_SUM_BUDGET = 0,
        FIX_SUB_BUDGET = 0,
        CHANGE_SUM_BUDGET = 0,

        ALLOT_SUB_BUDGET = 0,
        ADJUST_SUB_BUDGET = 0,
        FIX_ADD_BUDGET = 0,
        CHANGE_SUB_BUDGET = 0,
    } = record;
    // console.log(SUM_BUDGET, 1);
    // console.log(ALLOT_SUM_BUDGET, 2);
    // console.log(ADJUST_SUM_BUDGET, 3);
    // console.log(FIX_SUB_BUDGET, 4);
    // console.log(CHANGE_SUM_BUDGET, 5);
    // console.log(ALLOT_SUB_BUDGET, 6);
    // console.log(ADJUST_SUB_BUDGET, 7);
    // console.log(FIX_ADD_BUDGET, 8);
    // console.log(CHANGE_SUB_BUDGET, 9);

    // SUM_BUDGET+ALLOT_SUM_BUDGET+ADJUST_SUM_BUDGET+FIX_SUB_BUDGET+CHANGE_SUM_BUDGET
    // -ALLOT_SUB_BUDGET-ADJUST_SUB_BUDGET-FIX_ADD_BUDGET-CHANGE_SUB_BUDGET
    let addNumOne = calcFn.add(SUM_BUDGET, ALLOT_SUM_BUDGET, ADJUST_SUM_BUDGET, FIX_SUB_BUDGET, CHANGE_SUM_BUDGET);
    let addNumTwo = calcFn.add(ALLOT_SUB_BUDGET, ADJUST_SUB_BUDGET, FIX_ADD_BUDGET, CHANGE_SUB_BUDGET);
    let num = calcFn.sub(addNumOne, addNumTwo);
    return formattingMoney(num);
};

export const getColumns = (currentYear, budgetTarget, openFormDetail, dispatch) => {
    const { normStateList } = budgetTarget;
    return [
        {
            dataIndex: 'REIMB_CARD_NUM',
            title: '报账卡号',
            width: 100,
            render: (text, record) => (
                <span className="primaryColor" onClick={openFormDetail.bind(this, {}, {}, record.BIZ_ID, record, 'Y')}>
                    {text}
                </span>
            ),
        },
        {
            title: '核算项目',
            dataIndex: 'ACCOUNTING_ITEMS_NAME',
            width: 200,
            render: (text, record) => <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{text}</span>,
        },
        {
            title: '子项目',
            dataIndex: 'SUB_PROJECT_NAME',
            width: 200,
            render: (text, record) => <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{text}</span>,
        },
        {
            title: '管控总额度',
            dataIndex: 'CR_BUDGET',
            width: 200,
            align: 'right',
            render: (text, record) => (
                <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{formattingMoney(text)}</span>
            ),
        },
        {
            title: '年初预算金额',
            dataIndex: 'SUM_BUDGET',
            width: 200,
            align: 'right',
            render: (text, record) => (
                <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{formattingMoney(text)}</span>
            ),
        },
        {
            title: '当年调整金额',
            dataIndex: 'SUM_BUDGET_YEAR',
            width: 200,
            align: 'right',
            render: (text, record) => (
                <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{getYearMoney(record)}</span>
            ),
        },
        {
            dataIndex: 'FREEZE_BUDGET',
            title: '冻结金额',
            width: 200,
            align: 'right',
            render: (text, record) => (
                <span
                    className="primaryColor"
                    onClick={() => onOpenNewPage('FREEZE_BUDGET', record.NORM_CODE, record.ID, dispatch)}
                >
                    {formattingMoney(text)}
                </span>
            ),
        },
        {
            dataIndex: 'AVL_BUDGET',
            title: '指标可用额度',
            width: 200,
            align: 'right',
            render: (text, record) => (
                <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{formattingMoney(text)}</span>
            ),
        },
        {
            dataIndex: 'EXECUTE_BUDGET',
            title: '执行金额',
            width: 200,
            align: 'right',
            render: (text, record) => (
                <span
                    className="primaryColor"
                    onClick={() => onOpenNewPage('EXECUTE_BUDGET', record.NORM_CODE, record.ID, dispatch)}
                >
                    {formattingMoney(text)}
                </span>
            ),
        },
        {
            dataIndex: 'ACTUAL_BUDGET',
            title: '指标余额',
            width: 200,
            align: 'right',
            render: (text, record) => (
                <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{formattingMoney(text)}</span>
            ),
        },

        {
            title: '指标编码',
            dataIndex: 'NORM_CODE',
            width: 150,
            render: (text, record) => <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{text}</span>,
        },
        {
            title: '单位账套',
            dataIndex: 'ACCOUNT_SET_NAME',
            width: 200,
        },
        {
            title: '功能分类',
            dataIndex: 'FUNC_SUBJECT_NAME',
            width: 200,
        },
        {
            title: '预算单位',
            dataIndex: 'BUDGET_ORG_NAME_',
            width: 200,
            render: (text, record) => <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{text}</span>,
        },
        {
            title: '项目',
            dataIndex: 'PROJECT_NAME',
            width: 200,
            render: (text, record) => <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{text}</span>,
        },
        {
            title: '政府经济分类',
            dataIndex: 'GOV_ECONOMIC_CLASS',
            width: 200,
            render: (text, record) => <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{text}</span>,
        },
        {
            title: '项目负责人',
            dataIndex: 'CHARGE_IDENTITY_NAME_',
            width: 200,
        },

        // {
        //     dataIndex: 'WAY_FREEZE_BUDGET',
        //     title: '在途冻结',
        //     width: 200,
        //     align: 'right',
        //     render: (text, record) => (
        //         <span
        //             className="primaryColor"
        //             onClick={() => onOpenNewPage('WAY_FREEZE_BUDGET', record.NORM_CODE, record.ID, currentYear)}
        //         >
        //             {formattingMoney(text)}
        //         </span>
        //     ),
        // },
        // {
        //     dataIndex: 'WAY_EXEC_BUDGET',
        //     title: '在途执行',
        //     width: 200,
        //     align: 'right',
        //     render: (text, record) => (
        //         <span
        //             className="primaryColor"
        //             onClick={() => onOpenNewPage('WAY_EXEC_BUDGET', record.NORM_CODE, record.ID, currentYear)}
        //         >
        //             {formattingMoney(text)}
        //         </span>
        //     ),
        // },
        {
            dataIndex: 'USED_DEPT_NAME_',
            title: '使用部门',
            width: 200,
            render: (text, record) => <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{text}</span>,
        },
        {
            dataIndex: 'CR_BUDGET_TYPE_TLDT_',
            title: '控制方式',
            width: 200,
            render: (text, record) => (
                <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{BUDGET_TYPE?.[text] || ''}</span>
            ),
        },
        {
            dataIndex: 'NORM_STATE_TLDT_',
            title: '指标状态',
            width: 200,
            render: (text, record) => (
                <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{getLabel(normStateList, text)}</span>
            ),
        },
        {
            dataIndex: 'IS_ENABLE_TLDT_',
            title: '是否启用',
            width: 100,
            render: (text, record) => (
                <span className={!record.isSatisfyWarning ? styles.redColor : ''}>{YES_NO[text]}</span>
            ),
        },
    ].map((item) => ({
        ...item,
        key: item.dataIndex,
        columnCode: item.dataIndex,
        columnName: item.title,
    }));
};
