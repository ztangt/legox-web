import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'

export default {
    namespace: 'writeSignStyle',
    state: {},
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            // history.listen(location => {
            //     if (history.location.pathname === '/writeSignStyle') {
            //         dispatch({
            //             type: 'writeSignStyleStates',
            //             payload: {
            //                 pathname: history.location.pathname,
            //             }
            //         })
            //         dispatch({
            //             type: 'getTenantSign',
            //         })
            //     }
            // });
        }
    },
    effects: {
        // 获取手写签批样式管理
        *getTenantSign({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.writeSignStyle), {
            //     obtainFormData,
            // } = searchObj[pathname];
            const { data } = yield call(apis.getTenantSign, payload);
            console.log(data);
            if (data.code == REQUEST_SUCCESS) {

                yield put({
                    type: "updateStates",
                    payload: {
                        obtainFormData: data.data,
                    }
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 添加手写签批样式管理
        *addTenantSign({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.writeSignStyle), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.addTenantSign, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: "updateStates",
                    payload: {
                        obtainFormData: payload
                    }
                });
                message.success('保存成功');
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 修改手写签批样式管理
        *updateTenantSign({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.writeSignStyle), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.updateTenantSign, payload);

            if (data.code == REQUEST_SUCCESS) {

            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },

        // updateStates ==> layoutG/updateStates
        // *updateStates({ payload }, { call, put, select }) {
        //     const {
        //         searchObj
        //     } = yield select(state => state.layoutG), {
        //         pathname
        //     } = yield select(state => state.writeSignStyle);

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