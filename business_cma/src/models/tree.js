const { getOrgChildren, getSearchTree, getDepts, getPosts, getControlTree } = apis;
import { message } from 'antd';
import apis from 'api';
import _ from 'lodash';
import { history } from 'umi';
export default {
    namespace: 'tree',
    state: {
        treeData: [], //组织树信息
        postList: [], //用户身份详情岗位信息
        treeSearchData: [], //搜索组织树信息
        expandId: '',
        expandedKeys: [], //展开keys
        currentNodeType: '',
        currentNodeName: '',
        currentNodeId: '',
        currentNodeOrgName: '',
        currentNodeOrgId: '',
        deptData: [],
        expandedDeptKeys: [],
        searchWord: '',
        currentPathname: '',
    },
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            history.listen((location) => {
                dispatch({
                    type: 'updateStates',
                    payload: {
                        currentPathname: location.pathname,
                    },
                });
            });
        },
    },
    effects: {
        *getOrgChildren({ payload, callback, pathname, moudleName }, { call, put, select }) {
            try {
                const { data } = yield call(getOrgChildren, { ...payload }, '', 'tree');
                const { deptData, currentPathname, postList } = yield select((state) => state.tree);
                // const {searchObj} = yield select(state=>state.layoutG)
                let pname = pathname ? pathname : currentPathname;
                pname = moudleName ? moudleName : pname.split('/')[1];
                let treeData = [];
                let stateObj = yield select((state) => state[pname]);
                treeData = stateObj.treeData;

                const loop = (array, children, org) => {
                    for (var i = 0; i < array.length; i++) {
                        // array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
                        array[i]['title'] = `${array[i]['nodeName']}`;
                        array[i]['key'] = array[i]['nodeId'];
                        array[i]['value'] = array[i]['nodeId'];
                        if (payload.nodeId == array[i]['nodeId']) {
                            //赋值一个父节点的name和一个父节点的类型
                            children.map((itemChild) => {
                                itemChild['parentName'] = `${array[i]['nodeName']}`;
                                itemChild['parentType'] = array[i]['nodeType'];
                            });
                            // array[i]['children'] = children
                            array[i]['children'] = _.concat(children, postList);
                        }

                        if (org && array[i]['nodeType'] == 'DEPT') {
                            //如果是部门取父级单位
                            array[i]['orgName'] = org.nodeName;
                            array[i]['orgId'] = org.nodeId;
                            // array[i]['icon'] = <ApartmentOutlined />
                        } else {
                            // array[i]['icon'] = <BankOutlined />
                        }

                        if (array[i].children && array[i].children.length != 0) {
                            loop(array[i].children, children, array[i].nodeType == 'ORG' ? array[i] : org);
                        } else {
                            if (array[i].isParent == 1) {
                                array[i]['children'] = [{ key: '-1' }];
                            } else {
                                array[i]['isLeaf'] = true;
                            }
                        }
                    }
                    return array;
                };
                if (data.code == 200) {
                    let sourceTree = payload.onlySubDept == 1 ? deptData : treeData;
                    if (data.data.list.length != 0) {
                        if ((sourceTree && sourceTree.length == 0) || !payload.nodeId) {
                            sourceTree = data.data.list;
                        }
                        sourceTree = loop(sourceTree, data.data.list);
                        // 通讯录 只取本公司的组织信息
                        if (payload.isAddress) {
                            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                            // sourceTree = sourceTree.filter(item => item.nodeId == addressOrgId);
                            // console.log("123:",userInfo);
                            sourceTree = [
                                {
                                    children: [{ key: '-1' }],
                                    isParent: '1',
                                    key: userInfo.orgId,
                                    nodeId: userInfo.orgId,
                                    nodeName: userInfo.orgName,
                                    title: userInfo.orgName,
                                },
                            ];
                        }
                        yield put({
                            type: 'updateStates',
                            payload: {
                                treeData: payload.onlySubDept == 1 ? treeData : sourceTree,
                                deptData: payload.onlySubDept == 1 ? sourceTree : deptData,
                            },
                        });

                        if (pname) {
                            //有当前页面路径时更新每个路由下的值
                            yield put({
                                type: `${pname}/updateStates`,
                                payload: {
                                    treeData: payload.onlySubDept == 1 ? treeData : sourceTree,
                                },
                            });
                            // if(searchObj[pname]){
                            //   searchObj[pname].treeData =  payload.onlySubDept==1?treeData:sourceTree
                            //   // searchObj[pathname].expandedKeys = [payload.nodeId]
                            //   yield put({
                            //     type: 'layoutG/updateStates',
                            //     payload:{
                            //       searchObj
                            //     }
                            //   })
                            // }
                        }

                        if (!payload.nodeId) {
                            //请求根节点时，清空已展开的节点
                            // searchObj[pname].expandedKeys =  []
                            yield put({
                                type: `${pname}/updateStates`,
                                payload: {
                                    expandedKeys: [],
                                },
                            });
                            // yield put({
                            //   type: 'layoutG/updateStates',
                            //   payload:{
                            //     searchObj
                            //   }
                            // })
                        }
                        // callback&&callback(payload.onlySubDept==1?treeData:sourceTree);
                    } else {
                        if ((sourceTree && sourceTree.length == 0) || !payload.nodeId) {
                            sourceTree = _.concat(data.data.list, postList);
                        }
                        sourceTree = loop(sourceTree, data.data.list);

                        yield put({
                            type: 'updateStates',
                            payload: {
                                treeData: payload.onlySubDept == 1 ? treeData : sourceTree,
                                deptData: payload.onlySubDept == 1 ? sourceTree : deptData,
                            },
                        });
                        if (pname) {
                            //有当前页面路径时更新每个路由下的值
                            yield put({
                                type: `${pname}/updateStates`,
                                payload: {
                                    treeData: payload.onlySubDept == 1 ? treeData : sourceTree,
                                },
                            });
                        }
                    }
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg, 5);
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        *getSearchTree({ payload, callback, pathname, moudleName }, { call, put, select }) {
            try {
                const { data } = yield call(getSearchTree, payload, '', 'tree');
                const { deptData, expandedDeptKeys, currentPathname } = yield select((state) => state.tree);
                // const {searchObj} = yield select(state=>state.layoutG)
                let pname = pathname ? pathname : currentPathname;
                pname = moudleName ? moudleName : pname.split('/')[1];
                // const {treeData,expandedKeys} = searchObj[pname]
                const { treeData, expandedKeys } = yield select((state) => state[pname]);

                if (data.code == 200) {
                    const loop = (array, keys, org) => {
                        for (var i = 0; i < array.length; i++) {
                            //array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
                            array[i]['title'] = `${array[i]['nodeName']}`;
                            array[i]['key'] = array[i]['nodeId'];
                            array[i]['value'] = array[i]['nodeId'];
                            keys.push(array[i]['nodeId']);
                            if (org && array[i]['nodeType'] == 'DEPT') {
                                //如果是部门取父级单位
                                array[i]['orgName'] = org.nodeName;
                                array[i]['orgId'] = org.nodeId;
                                // array[i]['icon'] = <ApartmentOutlined />
                            } else {
                                // array[i]['icon'] = <BankOutlined />
                            }
                            if (array[i].children && array[i].children.length != 0) {
                                loop(array[i].children, keys, array[i].nodeType == 'ORG' ? array[i] : org);
                            }
                        }
                        return {
                            array,
                            keys,
                        };
                    };

                    if (payload.onlySubDept == 1) {
                        const { keys, array } = loop(data.data.list, expandedDeptKeys, {});
                        for (var i = 0; i < array.length; i++) {
                            for (var j = 0; j < deptData.length; j++) {
                                if (deptData[j].nodeId == array[i].nodeId) {
                                    deptData[j].children = array[i].children;
                                }
                            }
                        }
                        yield put({
                            type: 'updateStates',
                            payload: {
                                deptData: array,
                                expandedDeptKeys: keys,
                            },
                        });
                    } else {
                        const { keys, array } = loop(data.data.list, expandedKeys, {});
                        // for(var i=0;i<array.length;i++){
                        //   for(var j=0;j<treeData.length;j++){
                        //     if(treeData[j].nodeId==array[i].nodeId){
                        //       treeData[j].children = array[i].children
                        //     }
                        //   }
                        // }
                        yield put({
                            type: 'updateStates',
                            payload: {
                                treeData: array,
                                expandedKeys: keys,
                            },
                        });
                        if (pname) {
                            // if(searchObj[pname]){
                            //   searchObj[pname].treeData =  array
                            //   searchObj[pname].expandedKeys =  Array.from(new Set(keys))
                            //   yield put({
                            //     type: 'layoutG/updateStates',
                            //     payload:{
                            //       searchObj
                            //     }
                            //   })
                            // }
                            yield put({
                                type: `${pname}/updateStates`,
                                payload: {
                                    expandedKeys: Array.from(new Set(keys)),
                                    treeData: array,
                                },
                            });
                        }
                        // callback&&callback(treeData,keys);
                    }
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg, 5);
                }
            } catch (e) {
            } finally {
            }
        },
        *getDepts({ payload }, { call, put, select }) {
            try {
                const { data } = yield call(getDepts, payload, '', 'tree');
                const { expandedDeptKeys } = yield select((state) => state.tree);
                const loop = (array, keys) => {
                    for (var i = 0; i < array.length; i++) {
                        array[i]['title'] = `${array[i]['deptName']}`;
                        array[i]['key'] = array[i]['id'];
                        array[i]['value'] = array[i]['id'];
                        keys.push(array[i]['id']);
                        if (array[i].children && array[i].children.length != 0) {
                            loop(array[i].children, keys);
                        }
                    }
                    return {
                        array,
                        keys,
                    };
                };
                if (data.code == 200) {
                    const { keys, array } = loop(data.data.list, expandedDeptKeys);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            deptData: array,
                            expandedDeptKeys: keys,
                        },
                    });
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }
        },
        *getPosts({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getPosts, payload, '', 'tree');
                if (data.code == 200) {
                    for (let i = 0; i < data.data.list.length; i++) {
                        data.data.list[i]['title'] = data.data.list[i]['postName'];
                        data.data.list[i]['key'] = data.data.list[i]['id'];
                        data.data.list[i]['value'] = data.data.list[i]['id'];
                        data.data.list[i]['nodeName'] = data.data.list[i]['postName'];
                        data.data.list[i]['nodeId'] = data.data.list[i]['id'];
                        data.data.list[i]['nodeType'] = 'POST';
                    }
                    yield put({
                        type: 'updateStates',
                        payload: {
                            postList: data.data.list,
                        },
                    });
                    callback && callback();
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }
        },
        *getControlTree({ payload, callback, pathname, moudleName }, { call, put, select }) {
            try {
                const { data } = yield call(getControlTree, { ...payload }, '', 'tree');
                const { deptData, currentPathname, postList } = yield select((state) => state.tree);
                // const {searchObj} = yield select(state=>state.layoutG)
                let pname = pathname ? pathname : currentPathname;
                pname = moudleName ? moudleName : pname.split('/')[1];
                let treeData = [];
                if (pname == 'role') {
                    const { searchObj } = yield select((state) => state[pname]);
                    treeData = searchObj[pathname].treeData;
                } else if (pname == 'applyModelConfig') {
                    // const bizSolId = history.location.query.bizSolId;
                    let { bizSolId = '' } = history.location?.query || {};
                    const { stateObj } = yield select((state) => state[pname]);
                    treeData = stateObj[bizSolId].treeData;
                } else if (pname == 'formShow') {
                    // const bizSolId = history.location.query.bizSolId;
                    // const bizInfoId = history.location.query.bizInfoId;
                    // const currentTab = history.location.query.currentTab;
                    let { bizSolId = '', bizInfoId = '', currentTab = '' } = history.location?.query || {};
                    const { stateObj } = yield select((state) => state[pname]);
                    treeData = stateObj[bizSolId + '_' + bizInfoId + '_' + currentTab].treeData;
                } else {
                    let stateObj = yield select((state) => state[pname]);
                    treeData = stateObj.treeData;
                }
                const loop = (array, children, org) => {
                    for (var i = 0; i < array.length; i++) {
                        // array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
                        array[i]['title'] = `${array[i]['nodeName']}`;
                        array[i]['key'] = array[i]['nodeId'];
                        array[i]['value'] = array[i]['nodeId'];
                        if (payload.nodeIds == array[i]['nodeId']) {
                            //赋值一个父节点的name和一个父节点的类型
                            children.map((itemChild) => {
                                itemChild['parentName'] = `${array[i]['nodeName']}`;
                                itemChild['parentType'] = array[i]['nodeType'];
                            });
                            // array[i]['children'] = children
                            array[i]['children'] = _.concat(children, postList);
                        }

                        if (org && array[i]['nodeType'] == 'DEPT') {
                            //如果是部门取父级单位
                            array[i]['orgName'] = org.nodeName;
                            array[i]['orgId'] = org.nodeId;
                            // array[i]['icon'] = <ApartmentOutlined />
                        } else {
                            // array[i]['icon'] = <BankOutlined />
                        }

                        if (array[i].children && array[i].children.length != 0) {
                            loop(array[i].children, children, array[i].nodeType == 'ORG' ? array[i] : org);
                        } else {
                            if (array[i].isParent == 1) {
                                // if(payload.type =='ORGS'){
                                //   array[i]['isLeaf'] = true
                                // }else{
                                array[i]['children'] = [{ key: '-1' }];
                                // }
                            } else {
                                array[i]['isLeaf'] = true;
                            }
                        }
                    }
                    return array;
                };
                if (data.code == 200) {
                    let sourceTree = payload.onlySubDept == 1 ? deptData : treeData;
                    if (data.data.list.length != 0) {
                        // if((sourceTree&&sourceTree.length==0)||!payload.nodeIds){
                        if (sourceTree && sourceTree.length == 0) {
                            sourceTree = loop(data.data.list, []);
                        } else {
                            sourceTree = loop(sourceTree, data.data.list);
                        }

                        // //限定单位不获取子集
                        // sourceTree = loop(sourceTree,payload.type =='ORGS'?[]:data.data.list);

                        console.log('sourceTree', sourceTree);

                        yield put({
                            type: 'updateStates',
                            payload: {
                                treeData: payload.onlySubDept == 1 ? treeData : sourceTree,
                                deptData: payload.onlySubDept == 1 ? sourceTree : deptData,
                            },
                        });

                        if (pname) {
                            //有当前页面路径时更新每个路由下的值
                            yield put({
                                type: `${pname}/updateStates`,
                                payload: {
                                    treeData: payload.onlySubDept == 1 ? treeData : sourceTree,
                                },
                            });
                            // if(searchObj[pname]){
                            //   searchObj[pname].treeData =  payload.onlySubDept==1?treeData:sourceTree
                            //   // searchObj[pathname].expandedKeys = [payload.nodeId]
                            //   yield put({
                            //     type: 'layoutG/updateStates',
                            //     payload:{
                            //       searchObj
                            //     }
                            //   })
                            // }
                        }

                        if (!payload.nodeIds) {
                            //请求根节点时，清空已展开的节点
                            // searchObj[pname].expandedKeys =  []
                            yield put({
                                type: `${pname}/updateStates`,
                                payload: {
                                    expandedKeys: [],
                                },
                            });
                            // yield put({
                            //   type: 'layoutG/updateStates',
                            //   payload:{
                            //     searchObj
                            //   }
                            // })
                        }
                        // callback&&callback(payload.onlySubDept==1?treeData:sourceTree);
                    } else {
                        if ((sourceTree && sourceTree.length == 0) || !payload.nodeIds) {
                            sourceTree = _.concat(data.data.list, postList);
                        }
                        sourceTree = loop(sourceTree, data.data.list);
                        yield put({
                            type: 'updateStates',
                            payload: {
                                treeData: payload.onlySubDept == 1 ? treeData : sourceTree,
                                deptData: payload.onlySubDept == 1 ? sourceTree : deptData,
                            },
                        });
                        if (pname) {
                            //有当前页面路径时更新每个路由下的值
                            yield put({
                                type: `${pname}/updateStates`,
                                payload: {
                                    treeData: payload.onlySubDept == 1 ? treeData : sourceTree,
                                },
                            });
                        }
                    }
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg, 5);
                }
            } catch (e) {
                console.log(e);
            } finally {
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
