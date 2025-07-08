import { message } from 'antd';
import apis from 'api';
const { getHomePageApi, getHomePageOrgApi } = apis;

export default {
    namespace: 'cmaHomeSpace',
    state: {
        orgList: [],
        warningList: [],
        rateData: null,
        warningTypeData: [],
        dataStatistic: null,
        nccOrgCode: '',
        startTimes: '',
        endTimes: '',
        dataTypes: '',
        dataCates: '',
        dataLevels: '',
        datePublics: '1',
    },
    effects: {
        *getHomePageOrgData({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getHomePageOrgApi, payload, 'getHomePageOrgData', 'cmaHomeSpace');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        orgList: data.data.list,
                    },
                });
                callback && callback(data.data.list);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        *getHomePageData({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getHomePageApi, payload, 'getHomePageData', 'cmaHomeSpace');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        warningList: data.data.warningShow,
                        warningTypeData: data.data.warningType,
                        dataStatistic: data.data.dataStatistic.count == 0 ? 0 : data.data.dataStatistic,
                        rateData: data.data.warningPercentage.count == 0 ? 0 : data.data.warningPercentage,
                    },
                });
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
