import { message } from 'antd';
import apis from 'api';
export default {
    namespace: 'permissionSetView',
    state: {
        loading: false,
        identityId: '', //身份id
        userName: '', //用户名
        userId: '', //用户id

        isInit: false, //是否初始化
        unitList: [], //单位列表

        roleList: [], //角色列表
        activeRole: '', //当前选中的角色

        sysList: [], //获取所属系统
        isInitSys: false, //是否初始化所属系统
        activeSys: '', //当前选中的所属系统

        menuList: [], //菜单列表
        activeMenu: '', //当前选中的菜单

        ruleInfo: '', //规则信息
        isMoreRule: false, //是否多规则
    },
    effects: {
        //获取角色列表
        *getRoleListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.more_permissionSetView_getRole,
                payload,
                'getRoleListFun',
                'permissionSetView',
            );
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
            });
            if (data.code == 200) {
                let list = data.data?.list || [];
                let roleList = list.map((item, index) => ({
                    ...item,
                    key: item.id ? item.id.toString() : index.toString(),
                    label: item.roleName,
                }));
                if (roleList.length) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            roleList: roleList,
                            activeRole: roleList[0].key,
                            isInitRole: true,
                        },
                    });
                    callback && callback(roleList[0].key);
                }
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取单位列表
        *getUnitListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.more_permissionSetView_getUnit,
                payload,
                'getUnitListFun',
                'permissionSetView',
            );
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        unitList: data.data?.list || [],
                    },
                });
                callback && callback(data.data?.list || []);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取所属系统
        *getSysListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.more_permissionSetView_getSysList,
                payload,
                'getSysListFun',
                'permissionSetView',
            );
            if (data.code == 200) {
                let list = data.data?.list || [];
                if (list.length) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            sysList: list,
                            activeSys: list[0].registerId,
                            isInitSys: true,
                        },
                    });
                    callback && callback(list[0].registerId);
                }
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取菜单列表
        *getMenuListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.more_permissionSetView_getMenuList,
                payload,
                'getMenuListFun',
                'permissionSetView',
            );
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        menuList: data.data?.list || [],
                    },
                });
                callback && callback(data.data?.list || []);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取权重
        *getWeightFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.more_permissionSetView_getWeight,
                payload,
                'getWeightFun',
                'permissionSetView',
            );
            if (data.code == 200) {
                let list = data.data?.list || [];
                if (list.length > 0) {
                    callback && callback(list[0].dataRuleCode || '');
                } else {
                    message.error('暂无数据');
                }
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取自定义权重值信息
        *getCustomWeightFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.more_permissionSetView_getCustomWeight,
                payload,
                'getCustomWeightFun',
                'permissionSetView',
            );
            if (data.code == 200) {
                callback && callback(data.data || {});
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取规则列表
        *getRuleListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.more_permissionSetView_getRuleList,
                payload,
                'getRuleListFun',
                'permissionSetView',
            );
            if (data.code == 200) {
                callback && callback(data.data || []);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //删除管理单位
        *deleteManageOrg({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.more_permissionSetView_delManageOrg,
                payload,
                'deleteManageOrg',
                'permissionSetView',
            );
            if (data.code == 200) {
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //一键处理异常数据
        *handleErrorData({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.more_permissionSetView_handleErrorData,
                payload,
                'handleErrorData',
                'permissionSetView',
            );
            if (data.code == 200) {
                callback && callback();
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
