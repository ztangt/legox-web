import { message } from 'antd';
import apis from 'api';
const { getOriginData, originDataReloadSync } = apis;

export default {
    namespace: 'originDataRecord',
    state: {
        limit: 0,
        returnCount: 0,
        currentPage: 0,
        allPages: 0,
        currentHeight: 0,
        loading: true,
        formInfo: {},
    },
    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, '---->获取原始数据记录的列表参数');
            try {
                const { data } = yield call(getOriginData, payload, 'getList', 'originDataRecord');
                yield put({
                    type: 'updateStates',
                    payload: { loading: false },
                });
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: data.data?.list || [],
                            returnCount: data.data.returnCount * 1,
                            allPage: data.data.allPage * 1,
                            currentPage: data.data.currentPage * 1,
                        },
                    });
                    callback && callback(data.data?.list || []);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        // 重新同步
        *onResynchronize({ payload, callback }, { call, put, select }) {
            const { data } = yield call(originDataReloadSync, payload, 'onResynchronize', 'originDataRecord');
            if (data.code == 200) {
                message.success('数据已推送');
                callback && callback(data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        *getState({ payload, callback }, { call, put, select }) {
            const data = yield select((state) => state.originDataRecord);
            callback && callback(payload && payload.type ? data[payload.type] : data);
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
