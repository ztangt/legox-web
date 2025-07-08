import apis from 'api';
import { message } from 'antd';
import IconFont from '../../util/Icon_manage';

const {
    getMenusRoleList,
    sysRegisterApi,
    getOrgChildren,
    getSearchTree,
    getSysRoleUsers,
    addManageOrgApi,
    getSysUserListApi,
} = apis;

function treeDataList(list, payload) {
    for (let i = 0; i < list.length; i++) {
        list[i]['title'] = `${list[i]['nodeName']}`;
        list[i]['key'] = list[i]['nodeId'];
        list[i]['value'] = list[i]['nodeId'];
        if (list[i]['isParent'] == 1) {
            if (payload.listModel?.treeImg) {
                list[i]['icon'] = <IconFont type={`icon-${payload.listModel?.treeImg}`} />;
            }
            list[i]['children'] = [{ key: '-1' }];
        } else {
            if (payload.listModel?.treeLastImg) {
                list[i]['icon'] = <IconFont type={`icon-${payload.listModel?.treeLastImg}`} />;
            }
        }
    }
    return list;
}

const loopIt = (array, keys, org, nodeName, nodeId) => {
    for (var i = 0; i < array.length; i++) {
        //array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
        array[i]['title'] = `${array[i][nodeName]}`;
        array[i]['key'] = array[i][nodeId];
        array[i]['value'] = array[i][nodeId];
        keys.push(array[i][nodeId]);
        if (org && array[i]['nodeType'] == 'DEPT') {
            //如果是部门取父级单位
            array[i]['orgName'] = org.nodeName;
            array[i]['orgId'] = org.nodeId;
            // array[i]['icon'] = <ApartmentOutlined />
        } else {
            // array[i]['icon'] = <BankOutlined />
        }
        if (array[i].children && array[i].children.length != 0) {
            loopIt(array[i].children, keys, array[i].nodeType == 'ORG' ? array[i] : org, nodeName, nodeId);
        }
    }
    return {
        array,
        keys,
    };
};
export default {
    namespace: 'managementUnitSpace',
    state: {
        treeData: [],
        sysList: [],
        currentNode: {},
        expandedKeys: [],
        orgCurrentNode: {},
        orgExpandedKeys: [''],
        orgList: [],
        treeSearchWord: '',
        userList: [],
        nameSearchWord: '',
        rightExpandedKeys: [''], // 右侧扩展
        rightOrgList: [],
        roleList: [], // 角色列表
        userAllList: [], //用户全部列表
        roleAllList: [], // 角色全部列表
        getSearchUserList: [], // 获取选中角色
    },
    effects: {
        // 管理单位角色和用户保存新增
        *addManageUser({ payload, callback }, { call, put, select }) {
            const { data } = yield call(addManageOrgApi, payload, 'addManageUser', 'managementUnitSpace');
            if (data.code == 200) {
                callback && callback(data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        *getUserList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getSysUserListApi, payload, 'getUserList', 'managementUnitSpace');
            if (data.code == 200) {
                if (!payload.searchWord) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            roleAllList: data.data.list,
                        },
                    });
                }
                yield put({
                    type: 'updateStates',
                    payload: {
                        roleList: data.data.list,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 获取用户列表
        *getUserRoleList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getSysRoleUsers, payload, 'getUserRoleList', 'managementUnitSpace');
            const { getSearchUserList } = yield select((state) => state.managementUnitSpace);

            if (data.code == 200) {
                // if(payload.searchWord){
                //     yield put({
                //         type: 'updateStates',
                //         payload: {
                //             getSearchUserList: [...data.data.list,...getSearchUserList]
                //         }
                //     })
                // }
                if (!payload.searchWord) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            userAllList: data.data.list,
                        },
                    });
                }
                const arr = [...data.data.list, ...getSearchUserList];
                yield put({
                    type: 'updateStates',
                    payload: {
                        userList: data.data.list,
                        getSearchUserList: uniOneFn(arr, 'id'),
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 获取搜索
        *getSearchTree({ payload, callback }, { call, put, select }) {
            const load = payload.isRight;
            if (load) {
                payload = {
                    start: 1,
                    limit: 100,
                    searchWord: payload.searchWord,
                    type: payload.type,
                };
            }
            let dataRuleCode = localStorage.getItem('dataRuleCode');
            let nullStr = ['', 'null', 'undefined'];
            if (nullStr.includes(localStorage.getItem('dataRuleCode'))) {
                dataRuleCode = '';
            } else {
                payload.headers = { dataRuleCode };
            }

            const { data } = yield call(getSearchTree, payload, 'getSearchTree', 'managementUnitSpace');
            const { orgExpandedKeys, rightExpandedKeys } = yield select((state) => state.managementUnitSpace);
            if (data.code == 200) {
                if (load) {
                    const { keys, array } = loopIt(data.data.list, rightExpandedKeys, {}, 'nodeName', 'nodeId');
                    yield put({
                        type: 'updateStates',
                        payload: {
                            rightExpandedKeys: keys,
                            rightOrgList: array,
                        },
                    });
                } else {
                    const { keys, array } = loopIt(data.data.list, orgExpandedKeys, {}, 'nodeName', 'nodeId');
                    yield put({
                        type: 'updateStates',
                        payload: {
                            orgExpandedKeys: keys,
                            orgList: array,
                        },
                    });
                }
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 获取组织机构树
        *getOrgTree({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getOrgChildren, payload, 'getOrgTree', 'managementUnitSpace');
            const list = data.data.list;
            const newList = treeDataList(list, payload);
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        orgList: newList,
                        rightOrgList: newList,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 获取子树
        *getExpandTreeList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getOrgChildren, payload, 'getExpandTreeList', 'managementUnitSpace');
            const { orgList, rightOrgList } = yield select((state) => state.managementUnitSpace);
            const treeListData = orgList;
            if (data.code == 200) {
                const list = data.data.list;
                const newList = treeDataList(list, payload);
                const loop = (array, children) => {
                    for (var i = 0; i < array.length; i++) {
                        if (payload.nodeId == array[i]['nodeId']) {
                            array[i]['children'] = children;
                            // array[i]['children'] = _.concat(children, list);
                        }
                        if (array[i].children && array[i].children.length != 0) {
                            loop(array[i].children, children);
                        } else {
                            array[i]['children'] = [];
                        }
                    }
                    return array;
                };
                yield put({
                    type: 'updateStates',
                    payload: {
                        orgList: loop(treeListData, newList),
                        rightOrgList: loop(rightOrgList, newList),
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 获取注册系统列表
        *getRegisterList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(sysRegisterApi, payload, 'getRegisterList', 'managementUnitSpace');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        sysList: data.data.list,
                    },
                });
                callback && callback(data.data.list);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 获取菜单
        *getMenusList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getMenusRoleList, payload, 'getMenusList', 'managementUnitSpace');
            const list = data.data.jsonResult.list;
            const { expandedKeys } = yield select((state) => state.managementUnitSpace);
            const newList = loopIt(list, expandedKeys, {}, 'menuName', 'id');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        treeData: newList.array,
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
// 去重
const uniOneFn = (selectedDatas, id) => {
    const arrSelect = [];
    selectedDatas.forEach((item) => {
        const check = arrSelect.every((b) => {
            return item[id] != b[id];
        });
        check ? arrSelect.push(item) : '';
    });
    return arrSelect;
};
