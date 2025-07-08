import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
    namespace: 'contractAmount',
    state: {
        returnCount: 0,
        allPage: 1,
        currentPage: 1,
        limit: 0,
        formList: [],
        resList: [],
        currentHeight: 0,
        pageTotal: 0,
    },
    effects: {
        *findExpenseReportsByContract({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.more_deposit_findExpenseReportsByContract,
                    payload,
                    '',
                    'contractAmount',
                );
                if (data.code !== REQUEST_SUCCESS) {
                    const list = data.data.list || [];
                    let total = 0;
                    for (let i = 0; i < list.length; i++) {
                        total += list[i]['alreadyMoney'];
                    }
                    yield put({
                        type: 'updateStates',
                        payload: {
                            formList: list,
                            returnCount: data.data.returnCount * 1,
                            allPage: data.data.allPage * 1,
                            currentPage: data.data.currentPage * 1,
                            pageTotal: total,
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
