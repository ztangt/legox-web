import styles from '../index.less';
import { formattingMoney } from '../../../util/util';
import { history } from 'umi';

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

export const onOpenNewPage = (type, normCode, id, currentYear) => {
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

export const getColumns = () => {
    return [
        {
            title: '项目编码',
            dataIndex: 'OBJ_CODE',
            width: 200,
        },
        {
            title: '功能科目',
            dataIndex: 'FUNC_SUBJECT_NAME',
            width: 200,
        },
        {
            title: '负责人',
            dataIndex: 'CHARGE_IDENTITY_NAME_',
            width: 200,
        },
        {
            title: '负责部门',
            dataIndex: 'CHARGE_ORG_NAME_',
            width: 200,
        },
        {
            title: '指标批复总数',
            dataIndex: 'ALL_SUM_BUDGET',
            width: 200,
        },
        {
            title: '指标总金额(下达数)',
            dataIndex: 'SUM_BUDGET',
            width: 200,
        },
        {
            title: '管控总额度',
            dataIndex: 'CR_BUDGET',
            width: 200,
            render: (text, record) => {
                formattingMoney(text);
            },
        },
        {
            dataIndex: 'FREEZE_BUDGET',
            title: '冻结金额',
            width: 200,
            align: 'right',
            render: (text, record) => {
                formattingMoney(text);
            },
        },
        {
            dataIndex: 'EXECUTE_BUDGET',
            title: '执行金额',
            width: 200,
            align: 'right',
            render: (text, record) => {
                formattingMoney(text);
            },
        },
        {
            dataIndex: 'ACTUAL_BUDGET',
            title: '指标余额',
            width: 200,
            align: 'right',
            render: (text, record) => {
                formattingMoney(text);
            },
        },
        {
            dataIndex: 'AVL_BUDGET',
            title: '指标可用额度',
            width: 200,
            align: 'right',
            render: (text, record) => {
                formattingMoney(text);
            },
        },
    ];
};
