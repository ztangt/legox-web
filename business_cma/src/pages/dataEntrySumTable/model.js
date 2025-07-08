import { dateList } from './components/config';

export default {
    namespace: 'dataEntrySumTable',
    state: {
        formInfo: {
            year: dateList[0].value, //默认查询年度
        },
    },
    effects: {
        *getState({ payload, callback }, { call, put, select }) {
            const data = yield select((state) => state.dataEntrySumTable);
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
