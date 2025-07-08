import { REQUEST_SUCCESS } from '@/service/constant';
import { message } from 'antd';
import apis from 'api';

export default {
    namespace: 'downloadIframe',
    state: {
        start: 1,
        limit: 10,
        currentPage: 0,
        returnCount: 0,
        allPages: 0,
        list: [],
    },
    effects: {
        *getList({ payload }, { call, put, select }) {
            const { data } = yield call(apis.more_get_download_file, payload, 'getList', 'downloadIframe');
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        list: data.data.list,
                        returnCount: data.data.returnCount * 1,
                        currentPage: data.data.currentPage * 1,
                        allPages: data.data.allPages * 1,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg, 5);
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
