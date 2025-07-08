import api from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
    namespace: 'contractList',
    state: {
        returnCount: 0,
        allPage: 1,
        currentPage: 1,
        start: 1,
        limit: 10,
        list: [],
        currentHeight: 0,
    },
    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(api.more_contract_list, payload, 'getList', 'contractList');
                if (data.code == REQUEST_SUCCESS) {
                    const list = data.data.list || [];
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: list,
                            returnCount: data.data.returnCount * 1,
                            allPage: data.data.allPage * 1,
                            currentPage: data.data.currentPage * 1,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            } finally {
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
