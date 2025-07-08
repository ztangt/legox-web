import apis from 'api';
export default {
    namespace: 'cmaExport',
    state: {},
    effects: {
        *exportFile({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.exportFile, payload, '', 'cmaExport');
            if (data.code == 200) {
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
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
