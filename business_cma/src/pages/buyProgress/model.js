import { message } from 'antd';
import apis from 'api';
export default {
    namespace: 'buyProgress',
    state: {
        listObj: [],
    },
    effects: {
        //获取进度图
        *getList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.more_buy_process, payload, 'getList', 'buyProgress');
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            listObj: data.data,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
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
