import apis from 'api';

const { getPortalBudgeProgressList } = apis;

export default {
    namespace: 'budgetProgressIframe',
    state: {
        list: [],
    },

    effects: {
        //获取列表
        *getList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    getPortalBudgeProgressList,
                    { ...payload },
                    'getList',
                    'budgetProgressIframe',
                );
                if (data.code == 200) {
                    let list = data.data.data || [];
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: list,
                        },
                    });
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
