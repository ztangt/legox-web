import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
    namespace: 'wayList',
    state: {
        returnCount: 0,
        allPage: 1,
        currentPage: 1,
        limit: 0,
        formList: [],
        resList: [],
        currentHeight: 0,
    },
    effects: {
        *getNormOnwayList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getNormOnwayList, payload, '', 'wayList');
                if (data.code !== REQUEST_SUCCESS) {
                    const list = data.data.list;
                    // for (let i = 0; i < list.length; i++) {
                    //   list[i]['key'] = list[i].id;
                    // }
                    yield put({
                        type: 'updateStates',
                        payload: {
                            formList: list,
                            returnCount: data.data.returnCount * 1,
                            allPage: data.data.allPage * 1,
                            currentPage: data.data.currentPage * 1,
                        },
                    });
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
