import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'
import { parse } from 'query-string';
import {history} from 'umi'
const { getUgs, addUg, deleteUg, updateUg, getOrgChildren, getUserByGroupId, addSysUserGroupSaveUsers, queryUser } = apis;
export default {
    namespace: 'userGroupMg',
    state: {
        ugs: [],//用户组列表
        currentPage: 0,
        returnCount: 0,
        modalVisible: false,//弹窗状态
        isShowRelationModal: false,//关联用户信息弹窗状态
        ug: {},//当前用户组信息
        searchWord: '',
        ugIds: '',
        limit: 0,
        echoSelectItem: [],
        userTreeData: [],
        selectedNodeId:'',
        selectedDataIds:[],
        treeData:[],
        currentNode:[],
        expandedKeys:[],
        treeSearchWord:'',
        selectedDatas:[],
        originalData:[],
        selectNodeType:[],
        isShowOrgModal:false,
        dataIdList:[]
    },
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            history.listen(location => {
                // if (history.location.pathname == '/userGroupMg') {
                //     const query = parse(history.location.search);
                //     const { searchWord, currentpage, isInit, limit } = query;
                //     if (isInit == '1') {
                //         dispatch({
                //             type: 'updateStates',
                //             payload: {
                //                 ugs: [],//用户组列表
                //                 returnCount: 0,
                //                 modalVisible: false,//弹窗状态
                //                 ug: {},//当前用户组信息
                //                 ugIds: '',
                //             }
                //         })
                //     }
                //     dispatch({
                //         type: 'getUgs',
                //         payload: {
                //             start: currentpage ? currentpage : 1,
                //             limit: limit ? limit : 10,
                //             searchWord: searchWord ? currentpage : '',

                //         }
                //     })
                // }
            });
        }
    },
    effects: {

        *getUgs({ payload }, { call, put, select }) {
            try {
                const { data } = yield call(getUgs, payload);

                if (data.code == REQUEST_SUCCESS) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            ugIds: [],
                            ugs: data.data.list,
                            returnCount: data.data.returnCount,
                            currentPage: data.data.currentPage
                        }
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }

        },
        *updateUg({ payload }, { call, put, select }) {

            try {
                const { data } = yield call(updateUg, payload);
                const { currentPage, searchWord, limit } = yield select(state => state.userGroupMg)
                if (data.code == REQUEST_SUCCESS) {
                    yield put({
                        type: 'getUgs',
                        payload: {
                            start: currentPage,
                            limit: limit,
                            searchWord
                        }
                    })
                    yield put({
                        type: 'updateStates',
                        payload: {
                            modalVisible: false
                        }
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }

        },
        *addUg({ payload }, { call, put, select }) {
            try {
                const { data } = yield call(addUg, payload);
                //  const {currentNodeId,currentPage,limit} = yield select(state=>state.userGroupMg)
                const { limit } = yield select(state => state.userGroupMg)
                if (data.code == REQUEST_SUCCESS) {
                    yield put({
                        type: 'getUgs',
                        payload: {
                            start: 1,
                            limit: limit,
                        }
                    })
                    yield put({
                        type: 'updateStates',
                        payload: {
                            modalVisible: false
                        }
                    })

                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }
        },
        *deleteUg({ payload }, { call, put, select }) {
            try {
                const { data } = yield call(deleteUg, payload);
                //  const {currentPage,limit} = yield select(state=>state.userGroupMg)
                const { currentPage, limit } = yield select(state => state.userGroupMg)
                if (data.code == REQUEST_SUCCESS) {
                    yield put({
                        type: 'getUgs',
                        payload: {
                            start: currentPage,
                            limit: limit,
                        }
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }
        },
        // 获取组织机构树
        *getOrgChildren({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getOrgChildren, payload);
                const { userTreeData } = yield select(state => state.userGroupMg)

                const loop = (array, children) => {
                    if (array && array.length > 0) {
                        for (var i = 0; i < array.length; i++) {
                            array[i]['key'] = array[i].id;
                            array[i]['value'] = array[i]['id']
                            array[i]['keys'] = array[i].id;
                            array[i]['title'] = array[i].orgName ? array[i].orgName : array[i].userName;
                            if (payload.nodeId == array[i]['id']) {
                                array[i]['children'] = children
                            }
                            if (array[i].children && array[i].children.length != 0) {
                                loop(array[i].children, children)
                            }
                            array[i]['isLeaf'] = array[i]['isUser'] ? true : false;
                        }
                    } else {
                        array = children;
                        for (var i = 0; i < array.length; i++) {
                            array[i]['key'] = array[i].id;
                            array[i]['value'] = array[i]['id']
                            array[i]['keys'] = array[i].id;
                            array[i]['title'] = array[i].orgName ? array[i].orgName : array[i].userName;
                            array[i]['isLeaf'] = array[i]['isUser'] ? true : false;
                        }
                    }
                    return array
                }

                if (data.code == REQUEST_SUCCESS) {
                    let jsonResult = JSON.parse(JSON.stringify(data.data.jsonResult));
                    jsonResult = loop(userTreeData, jsonResult);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            userTreeData: jsonResult,
                        }
                    })
                    callback && callback();
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
                throw new Error(e);
            } finally {
            }
        },
        // 用户信息列表查询
        *queryUser({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(queryUser, payload);

                if (data.code == REQUEST_SUCCESS) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            userListData: data.data.list,
                        }
                    })
                    callback && callback(data.data.list);
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }
        },
        // 获得用户组关联的用户信息
        *getUserByGroupId({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getUserByGroupId, payload);
                if (data.code == REQUEST_SUCCESS) {
                  let selectedDataIds=data.data.list.map((item)=>{
                    return item.identityId
                  })
                  console.log(selectedDataIds,'selectedDataIds---');
                    yield put({
                        type: 'updateStates',
                        payload: {
                          selectedDataIds:selectedDataIds,
                          selectedDatas:data.data.list
                        }
                    })
                    callback && callback();
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }
        },
        // 保存用户组关联用户
        *addSysUserGroupSaveUsers({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(addSysUserGroupSaveUsers, payload);
                if (data.code == REQUEST_SUCCESS) {
                    message.success('保存成功');
                    callback && callback();
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }
        },
        // 保存归属单位
        *saveBelongOrg({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.saveBelongOrg, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('保存成功');
                callback&&callback()
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
    
        // 查询归属单位
        *queryBelongOrg({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.queryBelongOrg, payload);
            // 过滤重复数据
            const dataList = data.data.list.filter((item, index, dataList) => {
                return dataList.findIndex(t => t.orgId === item.orgId) === index;
            })
            let selectedOrgIds = [];
            dataList.map((item)=>{
                selectedOrgIds.push(item.orgId);
            })
            dataList.forEach((item) => {
                item.nodeId = item.orgId;
                item.nodeName = item.orgName;
                item.parentId = item.parentOrgId;
                item.parentName = item.parentOrgName;
            });
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        selectedDataIds: selectedOrgIds,
                        selectedDatas: dataList
                    }
                })
                callback&&callback()
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        *init({ payload, callback }, { call, put, select }) {
            try {
                yield put({
                    type: 'getUgs',
                    payload: {
                        start: 1,
                        limit: 10,
                        searchWord: '',

                    }
                })
                yield put({
                    type: 'updateStates',
                    payload: {
                        ugs: [],//用户组列表
                        currentPage: 0,
                        returnCount: 0,
                        modalVisible: false,//弹窗状态
                        isShowRelationModal: false,//关联用户信息弹窗状态
                        ug: {},//当前用户组信息
                        searchWord: '',
                        ugIds: '',
                        limit: 10,
                        echoSelectItem: [],
                        userTreeData: [],
                    }
                })
            } catch (e) {

            } finally {
            }
        },
    },
    reducers: {
        updateStates(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },

    },
};
