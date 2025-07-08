import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'

export default {
    namespace: 'passwordMg',
    state: {},
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            history.listen(location => {
                // if (history.location.pathname === '/passwordMg') {
                //     dispatch({
                //         type: 'passwordMgStates',
                //         payload: {
                //             pathname: history.location.pathname,
                //         }
                //     })
                //     dispatch({
                //         type: 'getPasswordPolicy',
                //     })
                // }
            });
        }
    },
    effects: {
        //获取密码管理
        *getPasswordPolicy({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.passwordMg), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.getPasswordPolicy, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: "updateStates",
                    payload: {
                        echoFormData: data.data
                    }
                })
                callback && callback(data.data)
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },

        //保存/修改密码管理
        *savePasswordPolicy({ payload, callback }, { call, put, select }) {
            console.log(payload)
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.passwordMg), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.savePasswordPolicy, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('保存成功')
                callback && callback(true)
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                callback && callback(false)
                message.error(data.msg);
            }
        },

        // *updateStates({ payload }, { call, put, select }) {
        //     const {
        //         searchObj
        //     } = yield select(state => state.layoutG), {
        //         pathname
        //     } = yield select(state => state.passwordMg);

        //     for (var key in payload) {
        //         searchObj[pathname][key] = payload[key]
        //     }
        //     yield put({
        //         type: "layoutG/updateStates",
        //         payload: {
        //             searchObj: searchObj
        //         }
        //     })
        // }
    },
    reducers: {
        updateStates(state, action) {
            return {
                ...state,
                ...action.payload
            }
        }
    }
}