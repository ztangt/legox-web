import { message } from 'antd';
import apis from 'api';
import { statusList } from './components/config';

const {
    more_qy_getUnitList,
    more_qy_stlmtPageList,
    more_qy_checkPsd,
    more_qy_confirmPay,
    more_qy_batchNullify,
    more_qy_exportStlmt,
    more_qy_batchRepay,
    more_qy_batchCancel,
    more_qy_syncPayStatus,
} = apis;

export default {
    namespace: 'yqPayment',
    state: {
        currentHeight: 0,

        unitList: [], //单位列表,
        accList: [], //账户列表,
        list: [], //表格列表
        limit: 10,
        currentPage: 0,
        allPages: 0,
        returnCount: 0,

        isZero: null, //是否零余额，1是0否
        formData: {
            payStatus: statusList[0].value,
        }, //查询条件,

        ids: [], //选中的id
        cutomHeaders: {}, //传给后端的自定义headers
        loading: false,
    },
    effects: {
        //获取单位列表
        *getUnitList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(more_qy_getUnitList, {}, 'getUnitList', 'yqPayment');
                if (data.code == 200 && data.data) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            unitList: data.data.list || [],
                        },
                    });
                }
            } catch (e) {}
        },
        //查询
        *getList({ payload, callback }, { call, put, select }) {
            try {
                const { cutomHeaders } = yield select((state) => state.yqPayment);
                payload.headers = cutomHeaders; //需要在headers中添加参数
                const { data } = yield call(more_qy_stlmtPageList, payload, 'getList', 'yqPayment');
                yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                    },
                });
                if (data.code == 200 && data.data) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: data.data?.list || [],
                            returnCount: data.data.returnCount * 1,
                            allPage: data.data.allPage * 1,
                            currentPage: data.data.currentPage * 1,
                        },
                    });
                } else {
                    message.error(data.detailMsg || data.msg || '查询失败');
                }
            } catch (e) {}
        },
        // 导出
        *exportExcel({ payload, callback }, { call, put, select }) {
            const { cutomHeaders } = yield select((state) => state.yqPayment);
            payload.headers = cutomHeaders; //需要在headers中添加参数

            const { data } = yield call(more_qy_exportStlmt, payload, 'exportExcel', 'yqPayment');
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
            });
            if (data.code == 200) {
                message.success('导出成功');
                window.open(data.data, '_blank');
            } else {
                message.error(data.msg || '导出失败');
            }
        },

        //校验支付密码
        *checkPsd({ payload, callback }, { call, put, select }) {
            //校验支付密码
            const { cutomHeaders } = yield select((state) => state.yqPayment);
            payload.headers = cutomHeaders; //需要在headers中添加参数
            const { data } = yield call(more_qy_checkPsd, payload, 'checkPsd', 'yqPayment');
            if (data.code == 200) {
                if (!data.data) {
                    return message.error('支付密码错误，请重试');
                }
                return callback && callback();
            } else {
                return message.error(data.msg || '密码错误，请重试');
            }
        },

        //确认支付
        *confirmPay({ payload, callback }, { call, put, select }) {
            const { cutomHeaders } = yield select((state) => state.yqPayment);
            payload.headers = cutomHeaders; //需要在headers中添加参数
            const { data } = yield call(more_qy_confirmPay, payload, 'confirmPay', 'yqPayment');
            if (data.code == 200) {
                message.success('支付数据已成功提交银行处理');
                callback && callback();
            } else {
                message.error(data.msg || '操作失败，请重试');
            }
        },

        //作废
        *goNullify({ payload, callback }, { call, put, select }) {
            const { cutomHeaders } = yield select((state) => state.yqPayment);
            payload.headers = cutomHeaders; //需要在headers中添加参数
            const { data } = yield call(more_qy_batchNullify, payload, 'goNullify', 'yqPayment');
            if (data.code == 200) {
                message.success('作废成功');
                callback && callback();
            } else {
                message.error(data.msg || '操作失败，请重试');
            }
        },

        //重新支付
        *goRepay({ payload, callback }, { call, put, select }) {
            const { cutomHeaders } = yield select((state) => state.yqPayment);
            payload.headers = cutomHeaders; //需要在headers中添加参数
            const { data } = yield call(more_qy_batchRepay, payload, 'goRepay', 'yqPayment');
            if (data.code == 200) {
                message.success('重新支付成功!');
                callback && callback();
            } else {
                message.error(data.msg || '操作失败，请重试');
            }
        },

        //终止支付
        *stopPay({ payload, callback }, { call, put, select }) {
            const { cutomHeaders } = yield select((state) => state.yqPayment);
            payload.headers = cutomHeaders; //需要在headers中添加参数
            const { data } = yield call(more_qy_batchCancel, payload, 'stopPay', 'yqPayment');
            if (data.code == 200) {
                message.success('终止支付成功!');
                callback && callback();
            } else {
                message.error(data.msg || '操作失败，请重试');
            }
        },

        //状态下载
        *statusDown({ payload, callback }, { call, put, select }) {
            const { cutomHeaders } = yield select((state) => state.yqPayment);
            payload.headers = cutomHeaders; //需要在headers中添加参数
            const { data } = yield call(more_qy_syncPayStatus, payload, 'statusDown', 'yqPayment');
            if (data.code == 200) {
                message.success('状态下载成功!');
                callback && callback();
            } else {
                message.error(data.msg || '操作失败，请重试');
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
