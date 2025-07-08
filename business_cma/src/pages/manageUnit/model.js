import { message } from 'antd';
import api from 'api';

export default {
    namespace: 'manageUnit',
    state: {
        roleList: [], //角色列表
        roleCheckId: [], //选中的角色

        memberList: [], //成员列表
        memberCheckId: [], //选中的成员

        menuList: [], //菜单列表
        menuCheckId: [], //选中的菜单
        menuCheckInfo: null, //选中的菜单信息

        unitList: [], //单位列表
        unitCheckId: [], //选中的单位
        unitCheckInfo: null, //选中的单位信息

        rigList: [], //下拉注册系统列表
        rigCheckInfo: null, //选中的注册系统信息

        identityId: '', //身份id
        loading: true,
    },
    effects: {
        // 获取角色列表
        *getRoleListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(api.getSysUserListApi, payload, 'getRoleListFun', 'manageUnit');
            if (data.code == 200) {
                callback && callback(data.data?.list || []);
                yield put({
                    type: 'updateStates',
                    payload: {
                        roleList: data.data?.list || [],
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        // 获取成员列表
        *getMemberListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(api.getMemberListBySys, payload, 'getMemberListFun', 'manageUnit');
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
            });
            if (data.code == 200) {
                let list = data.data?.list || [];

                //处理数据
                let memberList = list.map((item) => ({
                    ...item,
                    newNickName: `${item.userName}(${item.identityFullName || ''})`,
                }));

                callback && callback(memberList);
                yield put({
                    type: 'updateStates',
                    payload: {
                        memberList: memberList,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        // 获取下拉注册系统列表
        *getRigListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(api.sysRegisterApi, payload, 'getRigListFun', 'manageUnit');
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
            });
            if (data.code == 200) {
                callback && callback(data.data?.list || []);
                yield put({
                    type: 'updateStates',
                    payload: {
                        rigList: data.data?.list || [],
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取组织菜单列表
        *getMenuListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(api.getMenusByRole, payload, 'getMenuListFun', 'manageUnit');
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
            });
            if (data.code == 200) {
                let list = data.data?.list || [];
                list = list.filter((item) => item.rewriteMbType == 'MB__MENU');
                callback && callback(list);
                yield put({
                    type: 'updateStates',
                    payload: {
                        menuList: list,
                        menuCheckId: list.map((item) => item.menuId),
                        menuCheckInfo: list.length
                            ? list.map((item) => ({ menuName: item.menuName, id: item.menuId }))
                            : null,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取单位列表
        *getUnitListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(api.getOrgTree, { ...payload, orgKind: 'ORG' }, 'getUnitListFun', 'manageUnit');
            console.log(data, '----->获取分管单位列表');
            if (data.code == 200) {
                callback && callback(data.data?.list || []);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取已经选择的菜单和单位
        *getCheckdMenuUnitFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(api.getMenuAndOrgByIdentityId, payload, 'getCheckdMenuUnitFun', 'manageUnit');
            if (data.code == 200) {
                callback && callback(data.data || {});
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //保存
        *saveFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(api.addManageOrgApi, payload, 'saveFun', 'manageUnit');
            if (data.code == 200) {
                callback && callback();
                message.success('保存成功!');
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取已选中的单位列表
        *getCheckedUnitListFun({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                api.more_permissionSetView_getUnit,
                payload,
                'getCheckedUnitListFun',
                'manageUnit',
            );
            if (data.code == 200) {
                let list = data.data?.list || [];

                console.log(list, '----->获取已经选中的分管单位');
                yield put({
                    type: 'updateStates',
                    payload: {
                        unitCheckId: list.map((item) => item.orgId),
                        unitCheckInfo: list.length
                            ? list.map((item) => ({
                                  id: item.orgId,
                                  orgName: item.orgName,
                                  orgCode: item.orgCode,
                                  orgKind: item.orgKind,
                              }))
                            : null,
                    },
                });
                callback && callback(data.data?.list || []);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        *getState({ payload, callback }, { call, put, select }) {
            const data = yield select((state) => state.manageUnit);
            callback && callback(payload && payload.key ? data[payload.key] : data);
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
