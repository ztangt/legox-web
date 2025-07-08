import apis from 'api';

const { getMonitorWarningBar, publishExportWordRelease, getMonitorWarningPie, getMonitorWarningInfo } = apis;

export default {
    namespace: 'monitorWarning',
    state: {
        baseInfo: {},
    },
    effects: {
        *getBar({ payload, callback }, { call, put, select }) {
            console.log(payload, '????');
            try {
                const { data } = yield call(getMonitorWarningBar, payload, 'getBar', 'monitorWarning');
                if (data.code == 200) {
                    callback && callback(data.data.bar_json);
                }
            } catch (e) {}
        },
        *getPie({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getMonitorWarningPie, payload, 'getPie', 'monitorWarning');
                if (data.code == 200) {
                    callback && callback(data.data.pie_json);
                }
            } catch (e) {}
        },
        *getBaseInfo({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getMonitorWarningInfo, payload, 'getBaseInfo', 'monitorWarning');
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            baseInfo: data?.data?.info_json || {},
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
