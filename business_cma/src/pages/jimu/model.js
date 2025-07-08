import { message } from 'antd';
import apis from 'api';

export default {
    namespace: 'jimu',
    state: {},
    effects: {
        //获取管理单位
        *getManageOrgList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.findLoginUserByIdAndRoleId, payload, 'getManageOrgList', 'jimu');
            if (data.code == 200) {
                let list = data.data?.list || [];
                callback && callback(list);
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
