import { message } from 'antd';
import apis from 'api';
import dayjs from 'dayjs';
const { getVaultDetailList, generateVaultDetail, againCreate } = apis;

export default {
    namespace: 'cashVaultDetail',
    state: {
        limit: 0,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,
        list: [],

        formInfo: {
            businessDate: dayjs().format('YYYY-MM-DD'),
        },
        loading: true,
        confirmLoading: false,
    },
    effects: {
        //现金库存明细列表查询
        *getList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getVaultDetailList, payload, 'getList', 'cashVaultDetail');
                yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                    },
                });
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: data.data.list,
                            returnCount: data.data.returnCount * 1,
                            allPage: data.data.allPage * 1,
                            currentPage: data.data.currentPage * 1,
                        },
                    });
                }
            } catch (e) {}
        },
        //生成当日库存明细
        *generateVaultDetail({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(generateVaultDetail, payload, '', 'cashVaultDetail');
                if (data.code == 200) {
                    callback && callback(data.data);
                } else {
                    message.warning(data.msg || '请求失败');
                }
            } catch (e) {}
        },
        //重新生成当日库存明细
        *againCreate({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(againCreate, payload, '', 'cashDayInOut');
                yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                        confirmLoading: false,
                    },
                });
                if (data.code == 200) {
                    callback && callback(data.data);
                } else {
                    message.warning(data.msg || '请求失败');
                }
            } catch (e) {}
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
