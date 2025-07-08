import { message } from 'antd';
import { ApartmentOutlined, BankOutlined, AppstoreOutlined } from '@ant-design/icons';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../../service/constant'
import _ from "lodash";
import moment from 'moment';
import 'moment/locale/zh-cn';
import { parse } from 'query-string';
import {history} from 'umi'
moment.locale('zh-cn');
const { obtainUser, getUgs, getDownFileUrl, getOrgChildren, getIdentity, addIdentity, getUserRole, addUserRole, getUserPartRole, getUserMenu, getUserUserGroup, addUserUserGroup, getIsNocheck, addLeavepost, getOrgRefUser,deleteLeavepost,recoverPost } = apis;
export default {
    namespace: 'userView',
    state: {
        isShowChoicePerson:false,
        loading: false,
        returnCount: 0,
        currentPage: 1,
        ugs: [],
        imageUrl: '',
        signImageUrl: '',
        postTreeData: [],
        identityList: {},
        fixedIdentityList: {},
        userRoleList: {},
        allUserRole: [],
        userGroupList: {},
        userTargetKeys: [],
        userGroupTargetKeys: [],
        echoCheckedKeys: [],
        curRecord: null,
        identityFullName: '',
        editMainPostMark: '1',
        isShowLeavePostModal: false,
        isShowUserSettingModal: false,
        isShowGroupSettingModal: false,
        checkedKeys:[],
        userId:'',
        authorityTree:[],
        tabKey:"用户信息",

        selectedNodeId:'',
        selectedDataIds:[],
        treeData:[],//单位树
        currentNode:[],
        expandedKeys:[],
        treeSearchWord:'',
        selectedDatas:[],
        originalData:[],
        selectNodeType:[],
        isShowMigrateModal:false,
        selectedRowsData:[],

        selectedRowKeys:'',
        leavepostType:'',
        isShowRole:false,
        user:null
    },
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            // history.listen(location => {
                // const query = parse(history.location.search);
            //     if (history.location.pathname === '/userInfoManagement/userView') {
                    // dispatch({
                    //     type: 'getOrgRefUser',
                    //     payload: {
                    //         userId: JSON.parse(query.record).userId,
                    //         identityId: JSON.parse(query.record).identityId,
                    //     }
                    // });
                    // dispatch({
                    //     type: 'updateStates',
                    //     payload: {
                    //         curRecord: JSON.parse(query.record)&&JSON.parse(query.record),
                    //         userId:query.userId,
                    //     }
                    // })
            //     }
            // });
        }
    },
    effects: {
        *getOrgRefUser({ payload ,extraParams,callback}, { call, put, select }) {
            try {
                const { data } = yield call(getOrgRefUser, payload);
                const { currentNode, deptNames, parentNames } = yield select(state => state.userInfoManagement);
                const { key, title, nodeType, orgName } = currentNode
                let newObj = JSON.parse(JSON.stringify(data.data))
                let depts = JSON.parse(JSON.stringify(deptNames));
                let orgs = JSON.parse(JSON.stringify(parentNames))
                const getText = (arr) => {
                    if (arr && arr.length > 0) {
                        arr.reverse()
                        var str = '';
                        for (var i = 0; i < arr.length; i++) {
                            str += arr[i] + '-';
                        }
                        // arr.reverse()
                        if (str.length > 0) {
                            str = str.substr(0, str.length - 1);
                        }
                        return str;
                    } else {
                        return '';
                    }
                }
                // if (nodeType == 'DEPT') {
                //     newObj.deptName = deptNames.length > 0 ? getText(depts) + '-' + title : title
                //     newObj.orgName = getText(orgs)
                // } else {
                //     newObj.orgName = parentNames.length > 0 ? getText(orgs) + '-' + title : title;
                // }
                newObj.birthday = newObj.birthday ? moment.unix(Number(newObj.birthday), 'YYYY-MM-DD') : null//出生日期
                newObj.pwdExprTime = newObj.pwdExprTime ? moment.unix(Number(newObj.pwdExprTime), 'YYYY-MM-DD') : null//密码失效日期
                newObj.workTime = newObj.workTime ? moment.unix(Number(newObj.workTime), 'YYYY-MM-DD') : null//参加工作时间
                newObj.entryTime = newObj.entryTime ? moment.unix(Number(newObj.entryTime), 'YYYY-MM-DD') : null//调入时间
                newObj.joinTime = newObj.joinTime ? moment.unix(Number(newObj.joinTime), 'YYYY-MM-DD') : null//入党时间
                if (data.code == REQUEST_SUCCESS) {
                //   yield put({
                //     type: 'updateStates',
                //     payload: {
                //       imageUrl: newObj.pictureUrl || '',
                //       signImageUrl: newObj.signatureUrl || '',
                //       user: newObj,
                //       curRecord:newObj
                //     }
                //   })
                  extraParams?.setState({
                    imageUrl: newObj.pictureUrl || '',
                      signImageUrl: newObj.signatureUrl || '',
                      user: newObj,
                      curRecord:newObj
                  })
                  callback&&callback(newObj)
                } else {
                    message.error(data.msg, 5)

                }
            } catch (e) {
            } finally {
            }
        },
        // 获取用户组列表(左列)
        *getUgs({ payload,extraParams }, { call, put, select }) {
            try {
                const { data } = yield call(getUgs, payload);
                if (data.code == REQUEST_SUCCESS) {
                    // yield put({
                    //     type: 'updateStates',
                    //     payload: {
                    //         ugs: data.data.list,
                    //         returnCount: data.data.returnCount,
                    //         currentPage: data.data.currentPage
                    //     }
                    // })
                    extraParams?.setState({
                        ugs: data.data.list,
                        returnCount: data.data.returnCount,
                        currentPage: data.data.currentPage
                    })
                } else {
                    message.error(data.msg, 5)

                }
            } catch (e) {
            } finally {
            }
        },
        // // 获取组织机构树
        // *getOrgChildren({ payload, callback }, { call, put, select }) {
        //     try {
        //         let postTreeDataParent = JSON.parse(JSON.stringify(payload.postTreeDataParent))
        //         delete payload.postTreeDataParent
        //         const { data } = yield call(getOrgChildren, payload);
        //         const { postTreeData } = yield select(state => state.userView)
        //         //获取选中节点的单位节点
        //         let orgId = '';
        //         const getParentKey = (nodeKey, tree) => {
        //             for (let i = 0; i < tree.length; i++) {
        //                 const node = tree[i];
        //                 if (node['children']) {
        //                     if (node['children'].some(item => item['nodeId'] === nodeKey)) {
        //                         if (node['nodeType'] == 'ORG') {
        //                             orgId = node.key;
        //                         } else {
        //                             getParentKey(node['nodeId'], postTreeData);
        //                         }
        //                     } else if (node.children && node.children.length > 0) {
        //                         getParentKey(nodeKey, node.children)
        //                     }
        //                 }
        //             }
        //         };
        //         const loop = (array, children) => {
        //             if (array && array.length > 0) {
        //                 for (var i = 0; i < array.length; i++) {
        //                     array[i]['key'] = array[i].nodeId;
        //                     array[i]['keys'] = array[i].nodeId;
        //                     array[i]['title'] = array[i].nodeName;
        //                     array[i]['parentId'] = array[i].parentId;
        //                     if (array[i].isParent == '0' && array[i].nodeType != 'DEPT') {
        //                         array[i].isLeaf = true
        //                     } else {
        //                         array[i].isLeaf = false
        //                     }
        //                     if (payload.nodeId == array[i]['nodeId']) {
        //                         if (children.length > 0) {
        //                             if (array[i].nodeType == 'DEPT') {
        //                                 for (let j = 0; j < children.length; j++) {
        //                                     if (children[j].nodeType == 'POST') {
        //                                         getParentKey(array[i].key, postTreeData)
        //                                         children[j].key = orgId + '-' + array[i].key + '-' + children[j].key;
        //                                         children[j].nodeId = orgId + '-' + array[i].key + '-' + children[j].nodeId;
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                         array[i]['children'] = _.concat(children, postTreeDataParent);
        //                     }
        //                     if (array[i].children && array[i].children.length != 0) {
        //                         loop(array[i].children, children)
        //                     }
        //                 }
        //             } else {
        //                 array = children;
        //                 for (var i = 0; i < array.length; i++) {
        //                     array[i]['key'] = array[i].nodeId;
        //                     array[i]['title'] = array[i].nodeName;
        //                     array[i]['keys'] = array[i].nodeId;
        //                     array[i]['parentId'] = array[i].parentId;
        //                     if (array[i].isParent == '0') {
        //                         array[i].isLeaf = true
        //                     } else {
        //                         array[i].isLeaf = false
        //                     }
        //                 }
        //             }
        //             return array
        //         }


        //         if (data.code == REQUEST_SUCCESS) {
        //             let jsonResult = JSON.parse(JSON.stringify(data.data.jsonResult));
        //             jsonResult = loop(postTreeData, jsonResult);
        //             yield put({
        //                 type: 'updateStates',
        //                 payload: {
        //                     postTreeData: jsonResult,
        //                 }
        //             })
        //             callback && callback();
        //         } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        //             message.error(data.msg);
        //         }
        //     } catch (e) {
        //         throw new Error(e);
        //     } finally {
        //     }
        // },
        // 获取用户身份列表
        *getIdentity({ payload, callback,extraParams }, { call, put, select }) {
            try {
                const { data } = yield call(getIdentity, payload);
                const { userId,identityList } = extraParams?.state||{};
                let newObj = JSON.parse(JSON.stringify(identityList))
                newObj[userId] = data.data?data.data.identitys:'';
                if (data.code == REQUEST_SUCCESS) {
                    // yield put({
                    //     type: 'updateStates',
                    //     payload: {
                    //         identityList: newObj,
                    //         fixedIdentityList: newObj,
                    //         identityFullName: data.data.identityFullName,
                    //         editMainPostMark: data.data.editMainPostMark,
                    //     }
                    // })
                    extraParams?.setState({
                        identityList: newObj,
                        fixedIdentityList: newObj,
                        identityFullName: data.data.identityFullName,
                        editMainPostMark: data.data.editMainPostMark,
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
                throw new Error(e);
            } finally {
            }
        },
        // 保存用户身份信息
        *addIdentity({ payload, callback ,extraParams}, { call, put, select }) {
            try {
                const { data } = yield call(addIdentity, payload);
                const { userId,fixedIdentityList } = extraParams?.state||{};
                let newObj = JSON.parse(JSON.stringify(fixedIdentityList))
                newObj[userId] = JSON.parse(payload.identities)
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback();
                    message.success('保存成功');
                      // 获取用户身份列表
                      yield put({
                        type: 'getIdentity',
                        payload: {
                          userId: payload.userId,
                        },
                        extraParams:extraParams
                      });
                    // yield put({//更新身份列表，用于树的禁止
                    //   type:'userView/updateStates',
                    //   payload:{
                    //     fixedIdentityList:newObj
                    //   }
                    // })
                    extraParams?.setState({
                        fixedIdentityList:newObj
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
                throw new Error(e);
            } finally {
            }
        },
        // 获取用户关联角色列表
        *getUserRole({ payload, callback,extraParams }, { call, put, select }) {
            try {
                const { data } = yield call(getUserRole, payload);
                const { userId,userRoleList } = extraParams?.state||{};
                let newObj = JSON.parse(JSON.stringify(userRoleList))
                newObj[userId] = data.data.list;
                if (data.code == REQUEST_SUCCESS) {
                    // yield put({
                    //     type: 'updateStates',
                    //     payload: {
                    //         userRoleList:newObj ,
                    //     }
                    // })
                    extraParams?.setState({
                        userRoleList:newObj ,
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
                throw new Error(e);
            } finally {
            }
        },
        // 新增用户角色
        *addUserRole({ payload, callback,extraParams }, { call, put, select }) {
            try {
                const { data } = yield call(addUserRole, payload);
                if (data.code == REQUEST_SUCCESS) {
                    message.success('保存成功');
                    callback && callback();
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
                throw new Error(e);
            } finally {
            }
        },
        // 获取所有角色
        *getUserPartRole({ payload, callback,extraParams }, { call, put, select }) {
            try {
                const { data } = yield call(getUserPartRole, payload);
                if (data.code == REQUEST_SUCCESS) {
                    // yield put({
                    //     type: 'updateStates',
                    //     payload: {
                    //         allUserRole: data.data.list,
                    //     }
                    // })
                    extraParams?.setState({
                        allUserRole: data.data.list,
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
                throw new Error(e);
            } finally {
            }
        },
        // 获取用户所属角色的模块资源
        *getUserMenu({ payload, callback,extraParams }, { call, put, select }) {
            try {
                const { data } = yield call(getUserMenu, payload);
                let newAuthorityTree = [
                  {
                    nodeId:'PLATFORM_SYS',
                    nodeName:"支撑平台",
                    children:[]
                  },
                  {
                    nodeId:'PLATFORM_BUSS',
                    nodeName:"业务平台",
                    children:[]
                  },
                  {
                    nodeId:'PLATFORM_MIC',
                    nodeName:"微协同",
                    children:[]
                  },
                ]
                data.data.list?.map((item)=>{
                  if(item.nodeType=='PLATFORM_SYS'){
                    newAuthorityTree[0].children.push(item)
                  }else if(item.nodeType=='PLATFORM_BUSS'){
                    newAuthorityTree[1].children.push(item)
                  }else{
                    newAuthorityTree[2].children.push(item)
                  }
                })
                if (data.code == REQUEST_SUCCESS) {
                    // yield put({
                    //     type: 'updateStates',
                    //     payload: {
                    //       authorityTree: newAuthorityTree,
                    //     }
                    // })
                    extraParams?.setState({
                        authorityTree: newAuthorityTree,
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
                throw new Error(e);
            } finally {
            }
        },
        // 获取用户关联用户组信息(右列)
        *getUserUserGroup({ payload, callback,extraParams }, { call, put, select }) {
            try {
                const { data } = yield call(getUserUserGroup, payload);
                const { userId,userGroupList } = extraParams?.state||{};
                let newObj = JSON.parse(JSON.stringify(userGroupList))
                newObj[userId] = data.data.list;
                if (data.code == REQUEST_SUCCESS) {
                    // yield put({
                    //     type: 'updateStates',
                    //     payload: {
                    //         userGroupList: newObj,
                    //     }
                    // })
                    extraParams?.setState({
                        userGroupList: newObj,
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
                throw new Error(e);
            } finally {
            }
        },
        // 设置用户关联用户组
        *addUserUserGroup({ payload, callback ,extraParams}, { call, put, select }) {
            try {
                const { data } = yield call(addUserUserGroup, payload);
                if (data.code == REQUEST_SUCCESS) {
                    message.success('保存成功');
                    callback && callback();
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
                throw new Error(e);
            } finally {
            }
        },
        // 取消岗位身份树勾选
        *getIsNocheck({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getIsNocheck, payload);
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback(data.data.checkFlag)
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
                throw new Error(e);
            } finally {
            }
        },
        // 用户离岗操作
        *addLeavepost({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(addLeavepost, payload);
                if (data.code == REQUEST_SUCCESS) {
                    message.success('离岗成功');
                    callback&&callback()
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
                throw new Error(e);
            } finally {
            }
        },
        //用户复岗操作
        *recoverPost({ payload, callback }, { call, put, select }){
            try{
                const {data}=yield call(recoverPost,payload)
                if(data.code==REQUEST_SUCCESS){
                    message.success('复岗成功');
                    callback&&callback()
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            }catch(e){
                throw new Error(e)
            }finally{

            }
        },
    },
    reducers: {
        updateStates(state, action) {
            return {
                ...state,
                ...action.payload
            }
        }
    },
};
