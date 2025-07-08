import { message } from 'antd';
import apis from 'api';
import dayjs from 'dayjs';

const {
    getAuthorizationList,
    getUserGroupList,
    multipleAuthorization,
    deleteAuthorization,
    baseIdGetAuthorization,
    getOrgTree,
    getSelectedTransferData,
} = apis;

export default {
    namespace: 'indicatorNamespace',
    state: {
        tableList: [],
        formData: {
            usedYear: dayjs().year(),
        },
        showAdvSearch: false,
        // limit: 0,
        budgetUnitList: [], //预算单位列表
        governmentCode: '', //政府经济分类编码
        partCode: '', //部门经济分类编码
        fundsCode: '', //资金来源编码
        rangVisible: false, //选择控件显示
        // rangType: '', //控件类型
        formType: '',
        // selectedDataIds: [],
        // selectedDatas: [],
        initProjectCode: '', //初始化项目编码
        bizSolId: '', //修改bizSolId的获取方式

        limit: 10,
        start: 1,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,
        indicatorList: [],
        userGroupList: [],
        // rightUserGroupList: [], // 右侧选中
        departTreeData: [],
        expandId: '',
        rightSelectedData: [],
        tabActive: 3, // 切换tab
        treeData: [], // 用户树数据
        //这是树形结构的数据
        selectedNodeId: '',
        currentNode: {},
        expandedKeys: [],
        treeSearchWord: '',
        originalData: [],
        selectedDataIds: [],
        selectedDatas: [],
        rangType: 'USER',
        userGroupTargetKeys: [], // 用户组选中keys
        partTargetKeys: [], // 部门选中keys
        allList: [], // 全部树列表
        newSelectedDatas: [],
        menuId: '',
        departRightChecked: [],

        allColumns: [], //报账卡
        columns: [], //报账卡
        allColumnsYs: [], //预算指标
        columnsYs: [], //预算指标
    },
    effects: {
        // 查看 获取已经选中的数据
        *getSelectedTransfer({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getSelectedTransferData, payload, 'getSelectedTransfer', 'indicatorNamespace');
            if (data.code == 200) {
                // 根据类型获取选中后的数据
                if (payload.type == 3) {
                    const partList = data.data.list.map((item) => item.id);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            rightSelectedData: partList || [],
                            departRightChecked: data.data.list || [],
                        },
                    });
                }
                if (payload.type == 1) {
                    const arrList =
                        data.data.list.length > 0 &&
                        data.data.list.map((item) => {
                            return item.usergroupId;
                        });
                    yield put({
                        type: 'updateStates',
                        payload: {
                            rightSelectedData: arrList || [],
                        },
                    });
                }
                if (payload.type == 4) {
                    const selectedDatas = data.data.list.map((item) => {
                        item.deptName = item.userDeptName;
                        item.deptId = item.userDeptId;
                        item.orgName = item.userOrgName;
                        item.orgId = item.userOrgId;
                        return item;
                    });

                    yield put({
                        type: 'updateStates',
                        payload: {
                            rightSelectedData: data.data.list || [],
                            newSelectedDatas: uniOneFn(selectedDatas, 'identityId'),
                        },
                    });
                }
            }
        },
        // 获取搜索树
        *getSearchTree({ payload, callback, pathname, moudleName }, { call, put, select }) {
            const expandedKeys = payload.expandedKeys;
            delete payload.expandedKeys;
            try {
                const { data } = yield call(getOrgTree, payload, 'getSearchTree', 'indicatorNamespace');
                if (data.code == 200) {
                    const loop = (array, keys, org) => {
                        for (var i = 0; i < array.length; i++) {
                            //array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
                            array[i]['title'] = `${array[i]['orgName']}`;
                            array[i]['key'] = array[i]['id'];
                            array[i]['value'] = array[i]['id'];
                            keys.push(array[i]['id']);
                            if (org && array[i]['orgKind'] == 'DEPT') {
                                //如果是部门取父级单位
                                array[i]['orgName'] = org.belongOrgName;
                                array[i]['orgId'] = org.orgParentId;
                                // array[i]['icon'] = <ApartmentOutlined />
                            } else {
                                // array[i]['icon'] = <BankOutlined />
                            }
                            if (array[i].children && array[i].children.length != 0) {
                                console.log(array[i], 111);
                                loop(array[i].children, keys, array[i].orgKind == 'ORG_' ? array[i] : org);
                            }
                        }
                        return {
                            array,
                            keys,
                        };
                    };
                    const { keys, array } = loop(data.data.list, expandedKeys, {});
                    callback && callback(array, keys);
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg, 5);
                }
            } catch (e) {
            } finally {
            }
        },

        // 获取部门树信息
        *getOrgTree({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getOrgTree, payload, 'getOrgTree', 'indicatorNamespace');
            const loop = (array, children, org) => {
                for (var i = 0; i < array.length; i++) {
                    // array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
                    // console.log(array[i],'array[i]');
                    if (array[i].id) {
                        array[i]['title'] = `${array[i]['orgName']}`;
                        array[i]['key'] = array[i]['id'];
                        array[i]['value'] = array[i]['id'];
                        if (payload.parentId == array[i]['id']) {
                            array[i]['children'] = children;
                        }

                        if (org && array[i]['nodeType'] == 'DEPT') {
                            //如果是部门取父级单位
                            array[i]['orgName'] = org.nodeName;
                            array[i]['orgId'] = org.nodeId;
                            // array[i]['icon'] = <ApartmentOutlined />
                        } else {
                            // array[i]['icon'] = <BankOutlined />
                        }
                    }

                    if (array[i].children && array[i].children.length != 0) {
                        loop(array[i].children, children, array[i].orgKind == 'ORG' ? array[i] : org);
                    } else {
                        if (array[i].isParent == 1 && !payload.searchWord) {
                            array[i]['children'] = [{ key: '-1' }];
                        }
                        // else{
                        //   array[i]['isLeaf'] = true
                        // }
                    }
                }
                return array;
            };
            let treeData = [];
            let stateObj = yield select((state) => state.indicatorNamespace);
            treeData = stateObj.departTreeData;
            if (data.code == 200) {
                let sourceTree = treeData;
                // 获取列表
                const nowList = JSON.parse(JSON.stringify(data.data.list));
                const listArr = stateObj.allList;
                // 保存列表对比使用
                listArr.push(...nowList);
                if (data.data.list.length != 0) {
                    if ((sourceTree && sourceTree.length == 0) || !payload.parentId) {
                        sourceTree = data.data.list;
                    }
                    sourceTree = loop(sourceTree, data.data.list);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            departTreeData: sourceTree,
                            treeData: sourceTree,
                            allList: uniOneFn(listArr, 'id'),
                        },
                    });
                    callback && callback(sourceTree);
                    if (!payload.parentId) {
                        //请求根节点时，清空已展开的节点
                        yield put({
                            type: 'updateStates',
                            payload: {
                                expandedKeys: [],
                            },
                        });
                    }
                } else {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            departTreeData: [],
                            treeData: [],
                            allList: [],
                        },
                    });
                }
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 获取报账卡授权列表
        *getIndicatorList({ payload, callback }, { call, put, select }) {
            const { menuId } = yield select((state) => state.indicatorNamespace);

            const { data } = yield call(
                getAuthorizationList,
                { ...payload, headers: { menuId } },
                'getIndicatorList',
                'indicatorNamespace',
            );
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        indicatorList: data.data.list,
                        allPages: data.data.allPages * 1,
                        currentPage: data.data.currentPage * 1,
                        returnCount: data.data.returnCount * 1,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //按单位授权
        *empowerByUnit({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.empowerByUnit, payload, 'empowerByUnit', 'indicatorNamespace');
            if (data.code == 200) {
                callback && callback(data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        // 获取左侧穿梭框用户组列表
        *getUserGroupList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getUserGroupList, payload, '', 'indicatorNamespace');
            if (data.code == 200) {
                const groupList =
                    data.data.list &&
                    data.data.list.length > 0 &&
                    data.data.list.map((item) => {
                        (item.key = item.id), (item.title = item.ugName);
                        return item;
                    });
                yield put({
                    type: 'updateStates',
                    payload: {
                        userGroupList: groupList || [],
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 删除
        *deleteAuthorization({ payload, callback }, { call, put, select }) {
            const { data } = yield call(deleteAuthorization, payload, 'deleteAuthorization', 'indicatorNamespace');
            if (data.code == 200) {
                callback && callback(data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 保存
        *confirmIndicatorList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(multipleAuthorization, payload, 'confirmIndicatorList', 'indicatorNamespace');
            if (data.code == 200) {
                callback && callback(data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取预算单位列表
        *getBudgetUnitList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.findLoginUserByIdAndRoleId,
                    {
                        headers: { ...payload },
                    },
                    'getBudgetUnitList',
                    'indicatorNamespace',
                );
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            budgetUnitList: data.data.list || [],
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        //获取政府经济分类编码
        *getGoverLogicCode({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.more_getLogicCode,
                    {
                        logicCode: 'FT_CMA_900011',
                    },
                    'getGoverLogicCode',
                    'indicatorNamespace',
                );
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            governmentCode: data.data,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        //获取部门经济分类编码
        *getPartLogicCode({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.more_getLogicCode,
                    {
                        logicCode: 'FT_CMA_900010',
                    },
                    'getPartLogicCode',
                    'indicatorNamespace',
                );
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            partCode: data.data,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },

        //获取资金来源
        *getFundsLogicCode({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.more_getLogicCode,
                    {
                        logicCode: 'FT_CMA_900007 ',
                    },
                    'getFundsLogicCode',
                    'indicatorNamespace',
                );
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            fundsCode: data.data,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        //获取基础数据表格列表
        *getTableList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getBudgetProjectTree, payload, 'getTableList', 'indicatorNamespace');
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            tableList: data.list,
                        },
                    });

                    let res = data.data;
                    //判断是否是树形结构的数据
                    let resData = {
                        ...res,
                        list: (res.list || []).map((item) => {
                            if (item.isParent == 1) {
                                item['children'] = [];
                            }
                            return item;
                        }),
                    };
                    callback && callback(resData);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
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
