import { message } from 'antd';
import apis from 'api';
import { dateList } from './components/config';

export default {
    namespace: 'dataEntryPayBudget',
    state: {
        formInfo: {
            year: dateList[0].value, //默认查询年度
        },
    },
    effects: {
        //获取单位列表
        *getUnitListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.getOrgTree,
                { ...payload, orgKind: 'ORG' },
                'getUnitListFun',
                'dataEntryPayBudget',
            );
            console.log(data, '----->获单位列表');
            if (data.code == 200) {
                callback && callback(data.data?.list || []);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        *getState({ payload, callback }, { call, put, select }) {
            const data = yield select((state) => state.dataEntryPayBudget);
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
