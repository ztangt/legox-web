import { message } from 'antd';
import apis from 'api';
import dayjs from 'dayjs';
import { optionText } from './components/config';

const {
    more_get_personWage_year, //个人工资分解-->年度列表获取
    more_get_personWage_org, //个人工资分解-->单位列表获取
    more_get_personWage_userInfo, //个人工资-->分解人员信息获取
    more_get_personWage_infoAll, //个人工资-->分解获取薪资三项
    more_get_personWage_listGroup, //个人工资-->点击查询分月/汇总列表
    more_get_personWage_listDetail, //个人工资-->查询分月之后的详情
    more_export_personWage, //个人工资-->导出
    more_get_personWage_reimbursementGroup, //个人工资-->报销列表
    more_get_personWage_reimbursementList, //个人工资-->报销明细
    more_export_personWage_business, //个人工资-->公务卡导出
    more_export_personWage_personal, //个人工资-->个人储蓄卡导出
    getCurrentUserInfo, //获取当前用户信息

    more_export_personWage_laborChargeGroup, //个人工资-->劳务费查询汇总
    more_export_personWage_laborChargeDetail, //个人工资-->劳务费查询
    more_export_personWage_laborChargeExport, //个人工资-->劳务费导出
} = apis;

export default {
    namespace: 'personSalaryBreakdown',
    state: {
        formInfo: {}, //表单信息
        initialValues: {}, //初始化的表单信息

        disabled: true, //按钮是否禁用

        curUserInfo: {}, //当前登录用户信息
        userInfo: {}, //分解人员信息
        userInfoList: [],
        //     [
        //     { title: '职员名称', content: '' },
        //     { title: '所属单位', content: '' },
        //     { title: '默认工资卡号', content: '' },
        //     { title: '身份证号', content: '' },
        // ], //分解人员信息列表

        salaryInfo: {}, //薪资三项
        salaryInfoList: [
            { title: '应发合计', content: '' },
            { title: '扣款合计', content: '' },
            { title: '实发合计', content: '' },
        ], //薪资三项列表

        taxInfo: {}, //税务信息
        taxInfoList: [
            { title: '劳务报酬', content: '' },
            { title: '应按税额', content: '' },
            { title: '税后收入', content: '' },
        ], //税务信息列表

        orgList: [], //单位列表
        orgInfo: {},
        yearList: [], //年度列表

        isInit: false,
        loading: true,

        salaryMonthList: [], //薪资月份列表
        salaryMonthLoading: false,
        salaryMonthDetailList: [], //薪资月份详情列表
        salaryMonthDetailLoading: false,

        salaryTotalList: [], //薪资汇总列表
        salaryTotalLoading: false,
        salaryTotalDetailList: [], //薪资汇总详情列表
        salaryTotalDetailLoading: false,

        businessCardInfo: {}, //公务卡信息
        businessList: [
            { title: '合计', content: '' },
            { title: '差旅费报销', content: '' },
            { title: '其他报销', content: '' },
        ], //公务卡列表
        personalCardInfo: {}, //个人储蓄卡信息
        personalList: [
            { title: '合计', content: '' },
            { title: '差旅费报销', content: '' },
            { title: '其他报销', content: '' },
        ], //个人储蓄卡列表

        businessModalLoading: false, //公务卡弹窗loading
        businessModalList: [], //公务卡弹窗列表
        personalModalLoading: false, //个人储蓄卡弹窗loading
        personalModalList: [], //个人储蓄卡弹窗列表

        afterTaxModalLoading: false, //税后劳务弹窗loading
        afterTaxModalList: [], //税后劳务弹窗列表

        searchYear: dayjs().year(), //查询年份
    },
    effects: {
        //根据token获取用户信息为了解决公司的localstorge里面没有userInfo的问题
        *getUserInfoByToken({ payload, callback }, { call, put, select }) {
            console.log({ ...payload }, '获取用户信息');
            let { data } = yield call(getCurrentUserInfo, payload, 'getUserInfoByToken', 'personSalaryBreakdown');
            if (!data) {
                return yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                    },
                });
            }
            if (data.code == 200) {
                let resInfo = data.data || {};
                callback && callback(resInfo.idenNumber || '');
            } else {
                yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                    },
                });
                if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg || '获取用户信息失败');
                }
            }
        },

        //查询年度
        *getYearList({ payload, callback }, { call, put, select }) {
            // const { formInfo } = yield select((state) => state.personSalaryBreakdown);
            console.log({ ...payload }, '获取年度单位参数----->');
            const { data } = yield call(more_get_personWage_year, payload, 'getYearList', 'personSalaryBreakdown');
            if (data.code == 200) {
                let list = data.data?.list || [];
                if (list.length == 0) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            loading: false,
                        },
                    });
                    message.error('该人员无工资信息');
                    return;
                }

                let length = list.length;
                let year = length ? list[length - 1] : '';
                yield put({
                    type: 'updateStates',
                    payload: {
                        yearList: list.map((item) => ({ value: item, label: item })),
                    },
                });
                yield put({ type: 'getOrgList', payload: { year, isFirst: true } }); //触发b
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                    },
                });
                message.error(data.msg);
            }
        },

        //获取管理单位
        *getOrgList({ payload, callback }, { call, put, select }) {
            const { formInfo } = yield select((state) => state.personSalaryBreakdown);
            console.log({ ...payload, idCard: formInfo.idCard }, '获取管理单位参数----->');
            const { data } = yield call(
                more_get_personWage_org,
                { ...payload, idCard: formInfo.idCard },
                'getOrgList',
                'personSalaryBreakdown',
            );
            if (data.code == 200) {
                let list = data.data?.list || [];
                let nccOrgCode = list[0] ? list[0].code : '';
                let orgInfo = list[0] ? list[0] : {};
                yield put({
                    type: 'updateStates',
                    payload: {
                        orgList: list.map((item) => ({ ...item, value: item.code, label: item.name })),
                    },
                });
                //区分是否是第一次进入页面
                if (payload.isFirst) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            initialValues: {
                                ...formInfo,
                                year: payload.year,
                                nccOrgCode: nccOrgCode,
                            },
                            isInit: true,
                            disabled: false,
                            orgInfo: orgInfo,
                        },
                    });
                }
                callback && callback(orgInfo);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                    },
                });
                message.error(data.msg);
            }
        },

        //获取人员信息
        *getUserInfo({ payload, callback }, { call, put, select }) {
            console.log(payload, '获取人员信息参数----->');
            const { orgInfo } = yield select((state) => state.personSalaryBreakdown);
            const { data } = yield call(
                more_get_personWage_userInfo,
                {
                    ...payload,
                },
                'getUserInfo',
                'personSalaryBreakdown',
            );
            if (data.code == 200) {
                let list = data.data?.list || [];
                let userInfo = list.find((item) => item.orgName == orgInfo.name) || {};
                yield put({
                    type: 'updateStates',
                    payload: {
                        userInfoList: list,
                        userInfo: userInfo || {},
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取实发工资三项
        *getSalaryInfo({ payload, callback }, { call, put, select }) {
            console.log(payload, '获取薪资三项参数----->');
            const { data } = yield call(more_get_personWage_infoAll, payload, 'getSalaryInfo', 'personSalaryBreakdown');
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
            });
            if (data.code == 200) {
                let salaryInfo = data.data || {};
                yield put({
                    type: 'updateStates',
                    payload: {
                        salaryInfo: salaryInfo,
                        salaryInfoList: [
                            { title: '应发合计', content: salaryInfo.totalDueAmt },
                            { title: '扣款合计', content: salaryInfo.deductionSubtotalAmt },
                            { title: '实发合计', content: salaryInfo.actualTotalAmt },
                        ],
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取分月/汇总列表
        *getSalaryListGroup({ payload, callback }, { call, put, select }) {
            console.log(payload, '获取薪资的分月/汇总列表参数----->');
            const { data } = yield call(
                more_get_personWage_listGroup,
                payload,
                'getSalaryListGroup',
                'personSalaryBreakdown',
            );
            yield put({
                type: 'updateStates',
                payload: {
                    salaryMonthLoading: false,
                    salaryTotalLoading: false,
                },
            });
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        salaryMonthList: data.data?.list || [],
                        salaryTotalList: data.data?.list || [],
                    },
                });
                callback && callback(data.data?.list);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取分月的详情
        *getSalaryListDetail({ payload, callback }, { call, put, select }) {
            console.log(payload, '获取分月的详情----->');
            const { data } = yield call(
                more_get_personWage_listDetail,
                payload,
                'getSalaryListDetail',
                'personSalaryBreakdown',
            );
            yield put({
                type: 'updateStates',
                payload: {
                    salaryMonthDetailLoading: false,
                    salaryTotalDetailLoading: false,
                },
            });
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        salaryMonthDetailList: data.data || {},
                        salaryTotalDetailList: data.data || {},
                    },
                });
                callback && callback(data.data || {});
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //获取报销列表
        *getReimbursementList({ payload, callback }, { call, put, select }) {
            payload.option = optionText;
            console.log(payload, '获取报销列表');
            const { data } = yield call(
                more_get_personWage_reimbursementGroup,
                payload,
                'getReimbursementList',
                'personSalaryBreakdown',
            );

            if (data.code == 200) {
                let resInfo = data.data || {};
                //1是公务卡 2是报销
                if (payload.payState == 1) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            businessCardInfo: resInfo,
                            businessList: [
                                { title: '合计', content: resInfo.allAmt },
                                { title: '差旅费报销', content: resInfo.totalTravelExpenseAmt },
                                { title: '其他报销', content: resInfo.totalOtherAmt },
                            ],
                        },
                    });
                } else if (payload.payState == 2) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            personalCardInfo: resInfo,
                            personalList: [
                                { title: '合计', content: resInfo.allAmt },
                                { title: '差旅费报销', content: resInfo.totalTravelExpenseAmt },
                                { title: '其他报销', content: resInfo.totalOtherAmt },
                            ],
                        },
                    });
                }
                callback && callback(data.data || {});
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //获取报销明细
        *getReimbursementDetail({ payload, callback }, { call, put, select }) {
            payload.option = optionText;
            console.log(payload, '获取报销明细');
            const { data } = yield call(
                more_get_personWage_reimbursementList,
                payload,
                'getReimbursementDetail',
                'personSalaryBreakdown',
            );
            let list = data.data?.list || [];
            yield put({
                type: 'updateStates',
                payload: {
                    businessModalLoading: false,
                    personalModalLoading: false,
                },
            });
            if (data.code == 200) {
                callback && callback(list);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取税后劳务汇总
        *getTaxInfo({ payload, callback }, { call, put, select }) {
            console.log(payload, '获取税后劳务----->');
            const { data } = yield call(
                more_export_personWage_laborChargeGroup,
                payload,
                'getTaxInfo',
                'personSalaryBreakdown',
            );
            if (data.code == 200) {
                let list = data.data?.list || [];
                let taxInfo = list.length ? list[0] : {};
                yield put({
                    type: 'updateStates',
                    payload: {
                        taxInfo: taxInfo,
                        taxInfoList: [
                            { title: '劳务报酬', content: taxInfo.beforeAmt },
                            { title: '应按税额', content: taxInfo.taxAmt },
                            { title: '税后收入', content: taxInfo.afterAmt },
                        ],
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取税后劳务费收入明细
        *getTaxInfoDetail({ payload, callback }, { call, put, select }) {
            console.log(payload, '获取税后劳务----->');
            const { data } = yield call(
                more_export_personWage_laborChargeDetail,
                payload,
                'getTaxInfoDetail',
                'personSalaryBreakdown',
            );
            yield put({
                type: 'updateStates',
                payload: {
                    afterTaxModalLoading: false,
                },
            });
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        afterTaxModalList: data.data?.list || [],
                    },
                });
                callback && callback(data.data?.list || []);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //劳务费明细导出
        *onExportTaxInfo({ payload, callback }, { call, put, select }) {
            console.log(payload, '导出----->');
            const { data } = yield call(
                more_export_personWage_laborChargeExport,
                payload,
                'onExportTaxInfo',
                'personSalaryBreakdown',
            );
            if (data.code == 200) {
                message.success('导出成功');
                window.open(data.data, '_blank');
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //导出
        *onExportTotal({ payload, callback }, { call, put, select }) {
            console.log(payload, '导出----->');
            const { data } = yield call(more_export_personWage, payload, 'onExportTotal', 'personSalaryBreakdown');
            if (data.code == 200) {
                message.success('导出成功');
                window.open(data.data, '_blank');
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //导出公务卡
        *onBusinessExport({ payload, callback }, { call, put, select }) {
            payload.option = optionText;
            console.log(payload, '导出----->');
            const { data } = yield call(
                more_export_personWage_business,
                payload,
                'onBusinessExport',
                'personSalaryBreakdown',
            );
            if (data.code == 200) {
                message.success('导出成功');
                window.open(data.data, '_blank');
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //导出个人储蓄卡
        *onPersonalExport({ payload, callback }, { call, put, select }) {
            payload.option = optionText;
            console.log(payload, '导出----->');
            const { data } = yield call(
                more_export_personWage_personal,
                payload,
                'onPersonalExport',
                'personSalaryBreakdown',
            );
            if (data.code == 200) {
                message.success('导出成功');
                window.open(data.data, '_blank');
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
    },
    reducers: {
        updateStates(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
};
