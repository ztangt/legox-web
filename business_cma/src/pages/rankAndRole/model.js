import apis from 'api';
import { message } from 'antd';
const { roleByGet, roleByAddGet, roleBySave, roleByDelete, roleByEditGet, roleByEdit } = apis;
export default {
    namespace: 'rangAndRole',
    state: {
        limit: 10,
        allPages: 0,
        returnCount: 0,
        currentPage: 1,
        currentHeight: 0,
        rankList: [],
        rankModalList: [],
        searchContent: '',
        rankEditModalSelect: [],
    },
    effects: {
        *getRankTableList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(roleByGet, payload, 'getRankTableList', 'rangAndRole');
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            rankList: data.data.list,
                            returnCount: data.data.returnCount,
                            allPage: data.data.allPage,
                            currentPage: data.data.currentPage,
                            searchContent: payload.searchContent || '',
                        },
                    });
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 获取modal新建列表
        *getEditModalList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(roleByAddGet, payload, 'getEditModalList', 'rangAndRole');
                if (data.code == 200) {
                    callback && callback(data);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            rankModalList: data.data.list,
                            returnCount: data.data.returnCount,
                            allPage: data.data.allPage,
                            currentPage: data.data.currentPage,
                        },
                    });
                }
            } catch (e) {
                console.log(e);
            }
        },
        *saveModalByEdit({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(roleByEdit, payload, 'saveModalByEdit', 'rangAndRole');
                if (data.code == 200) {
                    callback && callback(data);
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 获取修改职级角色列表
        *getEditRoleList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(roleByEditGet, payload, 'getEditRoleList', 'rangAndRole');
                console.log('data-select', data);
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            rankEditModalSelect: data.data,
                        },
                    });
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 保存
        *saveRankAndRole({ payload, callback }, { call, put, select }) {
            try {
                console.log(payload, 'payload');
                const { data } = yield call(roleBySave, payload, 'saveRankAndRole', 'rangAndRole');
                if (data.code == 200) {
                    callback && callback(data.data);
                }
            } catch (e) {
                console.log(e);
            }
        },
        *deleteRankAndRole({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(roleByDelete, payload, 'deleteRankAndRole', 'rangAndRole');
                if (data.code == 200) {
                    callback && callback(data.data);
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
