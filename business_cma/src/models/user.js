import { message } from 'antd';
import apis from 'api';
const { loginOut, getCurrentUserInfo } = apis;
export default {
    name: 'user',
    state: {},
    effects: {
        *loginOut({ payload }, { call, put }) {
            const location = payload.location;
            const { data } = yield call(loginOut, {}, '', 'user');
            if (data.code == 200) {
                //将userToken存入localStorage中
                window.localStorage.setItem('userToken', '');
                window.localStorage.setItem('selfLogin', '0');
                window.localStorage.setItem('userAccount', '');
                window.localStorage.setItem('tenantId', '');
                window.localStorage.setItem('clientType', '');
                window.localStorage.setItem('refreshToken', '');

                //跳转到首页
                // location.href = '#/login';
                window.location.reload();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg, 5);
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
