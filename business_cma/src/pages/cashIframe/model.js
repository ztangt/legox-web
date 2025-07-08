import apis from 'api';
const { cashIframe, payState } = apis;
// import 'dayjs/locale/zh-cn';
import { message } from 'antd';

export default {
    namespace: 'cashIframe',
    state: {
        limit: 10,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,
        cashData: {},
    },
    effects: {
        //领用列表查询
        *cashIframe({ payload, callback }, { call, put, select }) {
            // debugger
            try {
                const { data } = yield call(cashIframe, payload, 'cashIframe', 'cashIframe');
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            cashData: data.data,
                        },
                    });
                }
            } catch (e) {}
        },
        //支票结算出纳办理
        *payState({ payload, callback }, { call, put, select }) {
            const { data } = yield call(payState, payload, 'payState', 'cashIframe');
            callback && callback(data);
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
