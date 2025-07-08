import { message } from 'antd';
import apis from 'api';

export default {
    namespace: 'personalPermissionView',
    state: {
        loading: true,
        searchWord: '', //搜索关键字
        orgId: '', //搜索的单位id

        unitList: [], //单位列表

        userList: [], //人员列表
        returnCount: 0,
        limit: 0,
        allPages: 0,
        currentPage: 0,
        currentHeight: 0,

        isInit: false,
    },
    effects: {
        //获取单位列表
        *getUnitListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getOrgTree, payload, 'getUnitListFun', 'personalPermissionView');
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
            });
            if (data.code == 200) {
                callback && callback(data.data?.list || []);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取人员列表
        *getUserListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getUsersByIds, payload, 'getUserListFun', 'personalPermissionView');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        userList: data.data.list,
                        returnCount: data.data.returnCount * 1,
                        allPage: data.data.allPage * 1,
                        currentPage: data.data.currentPage * 1,
                        isInit: true,
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
