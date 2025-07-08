import apis from 'api';
import { message } from 'antd';
const { originDataPayDataFilter, doubtDataPayDataDoubtNormal, waitReturnConfirm, doubtDataPayDoubtConfirm } = apis;

export default {
    namespace: 'skyIframeCommonModel',
    state: {
        startDate: '',
        endDate: '',
    },
    effects: {
        // 原始数据-支付数据管理 机选筛查
        *selectiveDataByScreen({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                originDataPayDataFilter,
                payload,
                'selectiveDataByScreen',
                'skyIframeCommonModel',
            );
            if (data.code == 200) {
                callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 疑点数据管理-支付数据管理 确认正常
        *doubtDataPayDataConfirm({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                doubtDataPayDataDoubtNormal,
                payload,
                'doubtDataPayDataConfirm',
                'skyIframeCommonModel',
            );
            if (data.code == 200) {
                callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 疑点数据管理-支付数据管理-退回待确认
        *waitReturnConfirmData({ payload, callback }, { call, put, select }) {
            const { data } = yield call(waitReturnConfirm, payload, 'waitReturnConfirmData', 'skyIframeCommonModel');
            if (data.code == 200) {
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 疑点数据管理-支付数据管理-疑点确认
        *doubtDataPayDataDoubtConfirm({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                doubtDataPayDoubtConfirm,
                payload,
                'doubtDataPayDataDoubtConfirm',
                'skyIframeCommonModel',
            );
            console.log('doubt-confirm', data);
            if (data.code == 200) {
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
