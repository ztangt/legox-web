import { REQUEST_SUCCESS } from '@/util/constant';
import { message } from 'antd';
import apis from 'api';

export default {
    namespace: 'meetingLevel',
    state: {},
    effects: {
        //获取会见等级
        *getMeetingLevel({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getHuiJianLevel, payload, 'getMeetingLevel', 'meetingLevel');
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback(data.data || '');
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
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
