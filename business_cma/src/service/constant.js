export const REQUEST_SUCCESS = 200;
//人员级别
export const STAFFLEVEL = [
    { key: 'DEPARTMENTLEVEL', name: '正副厅级' },
    { key: 'PROVINCIALLEVEL', name: '省级' },
    { key: 'OTHERSTAFFS', name: '其他人员' },
];
export const CHUNK_SIZE = 40 * 1024 * 1024; //分片大小
export const BIZSTATUS = {
    //已办事项状态
    0: '待发',
    1: '在办',
    2: '办结',
    3: '挂起',
    4: '作废',
};
export const TODOBIZSTATUS = {
    //待办事项状态
    0: '未收未办',
    1: '已收未办',
    2: '已收已办',
};
export const TASKSTATUS = {
    //传阅事项状态
    0: '未阅',
    1: '未阅',
    2: '已阅',
};
export const ALLTASKSTATUS = {
    0: '待办事项',
    1: '已发事项',
    2: '已办事项',
};
export const SEARCHCOLUMN = [
    {
        key: 'BIZ_TITLE',
        title: '标题',
        type: 'TODO,DONE,SEND,CIRCULATE,ALL,TRACE,TRUSTED,TRUST,CATEGORY,MONITOR', //DONE,,,ALL,CATEGORY
    },
    {
        key: 'DRAFT_ORG_NAME',
        title: '拟稿单位',
        type: 'TODO', //DONE,,,ALL,CATEGORY
    },
    {
        key: 'DRAFT_USER_NAME',
        title: '拟稿人',
        type: 'TODO,DONE,SEND,ALL,CATEGORY,MONITOR',
    },
    {
        key: 'DRAFT_TIME',
        title: '拟稿时间',
        type: 'TODO,DONE,SEND,ALL,CATEGORY,MONITOR',
    },
    {
        key: 'DRAFT_DEPT_NAME',
        title: '拟稿部门',
        type: 'TODO,DONE,SEND,ALL',
    },
    {
        key: 'SUSER_NAME',
        title: '送办人',
        type: 'TODO,TRUST',
    },
    {
        key: 'START_TIME',
        title: '送办时间',
        type: 'TODO',
    },
    {
        key: 'SUSER_DEPT_NAME',
        title: '送办部门',
        type: 'TODO',
    },
    {
        key: 'BIZ_SOL_NAME',
        title: '业务类型',
        type: 'TODO,DONE,SEND,CIRCULATE,ALL,TRACE,TRUSTED,TRUST,CATEGORY,MONITOR',
    },
    {
        key: 'TRUST_USER_NAME',
        title: '委托人',
        type: 'TRUSTED',
    },
    {
        key: 'TRUST_START_TIME',
        title: '委托时间',
        type: 'TRUSTED,TRUST',
    },
    {
        key: 'BE_TRUST_USER_NAME',
        title: '受委托人',
        type: 'TRUST',
    },
    {
        key: 'END_TIME',
        title: '办理时间',
        type: 'DONE', //todo没有
    },
    {
        key: 'SUSER_NAME',
        title: '传阅人',
        type: 'CIRCULATE', //todo没有
    },
    {
        key: 'START_TIME',
        title: '传阅时间',
        type: 'CIRCULATE', //todo没有
    },
    {
        key: 'TASK_STATUS',
        title: '阅读状态',
        type: 'CIRCULATE,', //todo没有
    },
    {
        key: 'BIZ_STATUS',
        title: '办理状态',
        type: 'DONE,SEND,CIRCULATE,ALL,TRACE,TRUSTED,TRUST,CATEGORY,MONITOR',
    },
    {
        key: 'TASK_STATUS',
        title: '办理状态(环节)',
        type: 'TODO',
    },
    {
        key: 'ACT_NAME',
        title: '当前环节',
        type: 'DONE', //todo没有
    },
    {
        key: 'END_TIME',
        title: '阅读时间',
        type: 'CIRCULATE', //todo没有
    },
    {
        key: 'ACT_NAME',
        title: '当前环节',
        type: 'SEND,ALL,TRACE,TRUSTED,TRUST,TODO,CIRCULATE',
    },
    {
        key: 'TASK_STATUS',
        title: '事项状态',
        type: 'ALL',
    },
    {
        key: 'DONE_ACT_NAME',
        title: '办理环节',
        type: 'TRUSTED,TRUST,DONE',
    },
];
export const DEFAULTCOLUMN = {
    TODO: 'BIZ_TITLE,DRAFT_ORG_NAME,DRAFT_USER_NAME,DRAFT_TIME,DRAFT_DEPT_NAME,SUSER_NAME,START_TIME,BIZ_SOL_NAME',
    SEND: 'BIZ_TITLE,DRAFT_USER_NAME,DRAFT_TIME,DRAFT_DEPT_NAME,BIZ_STATUS,BIZ_SOL_NAME',
    DONE: 'BIZ_TITLE,DRAFT_USER_NAME,DRAFT_TIME,DRAFT_DEPT_NAME,BIZ_STATUS,END_TIME,BIZ_SOL_NAME,ACT_NAME,DONE_ACT_NAME',
    CIRCULATE: 'BIZ_TITLE,SUSER_NAME,START_TIME,TASK_STATUS,BIZ_STATUS,BIZ_SOL_NAME,ACT_NAME',
    ALL: 'BIZ_TITLE,DRAFT_USER_NAME,DRAFT_TIME,DRAFT_DEPT_NAME,BIZ_STATUS,BIZ_SOL_NAME,TASK_STATUS',
    TRACE: 'BIZ_TITLE,BIZ_SOL_NAME,BIZ_STATUS,ACT_NAME',
    TRUST: 'BIZ_TITLE,BIZ_SOL_NAME,BIZ_STATUS,BE_TRUST_USER_NAME,TRUST_START_TIME,ACT_NAME,SUSER_NAME,DONE_ACT_NAME',
    TRUSTED: 'BIZ_TITLE,BIZ_SOL_NAME,BIZ_STATUS,TRUST_USER_NAME,TRUST_START_TIME,ACT_NAME,DONE_ACT_NAME',
    CATEGORY: 'BIZ_TITLE,DRAFT_USER_NAME,DRAFT_TIME,BIZ_STATUS,BIZ_SOL_NAME',
    MONITOR: 'BIZ_TITLE,DRAFT_USER_NAME,DRAFT_TIME,BIZ_STATUS,BIZ_SOL_NAME',
};
