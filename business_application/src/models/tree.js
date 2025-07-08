const { getOrgChildren, getSearchTree, getDepts, getPosts, getControlTree,getOrgTree } =
  apis;
import {
  ApartmentOutlined,
  AppstoreOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { message } from 'antd';
import apis from 'api';
import _ from 'lodash';
import { REQUEST_SUCCESS, NODE_TYPE } from '../service/constant';

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
    // 获取组织树
    // payload,callback,nodePath,currentNodeType,currentNodeId
    *getOrgTree({payload,callback,pathname,moudleName,nodeType,nodeId,nodePath},{call,put,select}){
      const onlySubDept=payload.onlySubDept||''
      const name_module = moudleName
      delete payload.onlySubDept
      const { deptData,currentPathname,postList,treeData} = yield select(state=>state.tree)
      const {data} = yield call(getOrgTree, {...payload},'','tree');
      const  loop = (array,children,org)=>{
        for(var i=0;i<array.length;i++){
          // array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
          console.log(array[i],'array[i]');
          array[i]['title'] = `${array[i]['orgName']}`
          array[i]['key'] = array[i]['id']
          array[i]['value'] = array[i]['id']
          array[i]['nodeType'] = array[i]['orgKind']
          array[i]['nodeName'] = array[i]['orgName']
          array[i]['nodeId'] = array[i]['id']

          if(payload.parentId == array[i]['id']){
            console.log(children,'children');
            //赋值一个父节点的name和一个父节点的类型
            // children.map((itemChild)=>{
            //   itemChild['parentName'] = `${array[i]['nodeName']}`
            //   itemChild['parentType'] = array[i]['nodeType']
            // })
              children.map((itemChild) => {
                itemChild['parentName'] = `${array[i]['orgName']}`;
                itemChild['parentType'] = array[i]['orgKind'];
              });
              // array[i]['children'] = children
              array[i]['children'] = _.concat(children, postList);

            array[i]['children'] = children
          }
          
          if(org&&array[i]['nodeType']=='DEPT'){//如果是部门取父级单位
            array[i]['orgName'] = org.nodeName
            array[i]['orgId'] = org.nodeId
            // array[i]['icon'] = <ApartmentOutlined />
          }else{
            // array[i]['icon'] = <BankOutlined />
          }

          if(array[i].children&&array[i].children.length!=0){
            loop(array[i].children,children,array[i].orgKind=='ORG'?array[i]:org)
          }else{
            if(array[i].isParent==1&&!payload.searchWord){
              array[i]['children'] = [{key: '-1'}]
            }else{
              array[i]['isLeaf'] = true
            }
          }
        }
        return array
      }

      if(data.code == 200){
        let sourceTree = treeData;
        if(data.data.list.length!=0){
          if((sourceTree&&sourceTree.length==0)||!payload.parentId){
            sourceTree = data.data.list
          }
          sourceTree = loop(sourceTree,data.data.list);
          yield put({
            type: 'updateStates',
            payload:{
              treeData: sourceTree,
              deptData:  deptData,
            }
          })
          console.log("name_modules",name_module)
          if(name_module){
            yield put({
              type: `${name_module}/updateStates`,
              payload:{
                treeData: sourceTree,
                deptData:  deptData,
              }
            })
          }
          if(!payload.parentId){//请求根节点时，清空已展开的节点
            // searchObj[pname].expandedKeys =  []
            yield put({
              type: `${name_module}/updateStates`,
              payload:{
                expandedKeys:[]
              }
            })
          }
        }else{
          if((sourceTree&&sourceTree.length==0)||!payload.nodeId){
            sourceTree = _.concat(data.data.list,postList)
          }
          sourceTree = loop(sourceTree,data.data.list);
          yield put({
            type: 'updateStates',
            payload:{
              treeData: payload.onlySubDept==1?treeData:sourceTree,
              deptData: payload.onlySubDept==1?sourceTree:deptData,
            }
          })
          if(name_module){//有当前页面路径时更新每个路由下的值
            yield put({
              type: `${name_module}/updateStates`,
              payload:{
                treeData:onlySubDept==1?treeData:sourceTree
              }
            })
          }

        }
        //   let newList = data.data.list;
        //   if((sourceTree&&sourceTree.length==0)||!payload.parentId){//根节点(搜索的时候不传nodeId)
        //     sourceTree = data.data.list
        //   }
        //   if(payload.orgKind=='POST'&&payload.parentId){//岗位和子集合并
        //     newList = _.concat(data.data.list,postList)
        //   }
        //   console.log('newList=',newList);
        //   if(nodePath){//获取路径，以便获取父节点的单位id，避免向上推
        //     let newNodePath = JSON.parse(nodePath);
        //     newNodePath.push({
        //       id:currentNodeId,
        //       type:currentNodeType
        //     })
        //     newList.map((item)=>{
        //       item.nodePath=newNodePath
        //     })
        //   }
        //   sourceTree = loop(sourceTree,newList);
        //   callback(sourceTree);
          

      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5);
      }
    },
    *getOrgChildren(
      { payload, callback, pathname, moudleName, treeExcuteAuth },
      { call, put, select },
    ) {
      if(moudleName=='notification'||moudleName=='information'){
        payload.headers = {
          'Datarulecode': ''
        };
      }
      try {
        if (treeExcuteAuth) {
          payload.headers = {
            'treeExcuteAuth': treeExcuteAuth
          }; //需要在headers中添加参数
        }
        const { data } = yield call(getOrgChildren, { ...payload }, '', 'tree');
        const { deptData, currentPathname, postList } = yield select(
          (state) => state.tree,
        );
        // const {searchObj} = yield select(state=>state.layoutG)
        let pname = pathname ? pathname : currentPathname;
        pname = moudleName ? moudleName : pname.split('/')[1];
        let treeData = [];
        if (pname == 'role') {
          const { searchObj } = yield select((state) => state[pname]);
          treeData = searchObj[pathname].treeData;
        } else if (pname == 'applyModelConfig') {
          const bizSolId = history.location.query.bizSolId;
          const { stateObj } = yield select((state) => state[pname]);
          treeData = stateObj[bizSolId].treeData;
        } else if (pname == 'formShow') {
          const bizSolId = history.location.query.bizSolId;
          const bizInfoId = history.location.query.bizInfoId;
          const currentTab = history.location.query.currentTab;
          const { stateObj } = yield select((state) => state[pname]);
          treeData =
            stateObj[bizSolId + '_' + bizInfoId + '_' + currentTab].treeData;
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
              loop(
                array[i].children,
                children,
                array[i].nodeType == 'ORG' ? array[i] : org,
              );
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
        if (data.code == REQUEST_SUCCESS) {
          let sourceTree = (payload.onlySubDept == 1 && treeExcuteAuth != 'A0002' && treeExcuteAuth != 'A0004') ? deptData : treeData;
          if (data.data.list.length != 0) {
            if ((sourceTree && sourceTree.length == 0) || !payload.nodeId) {
              sourceTree = data.data.list;
            }
            sourceTree = loop(sourceTree, data.data.list);
            // 通讯录 通知公告发布 只取本公司的组织信息
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
                treeData: (payload.onlySubDept == 1 && treeExcuteAuth != 'A0002' && treeExcuteAuth != 'A0004') ? treeData : sourceTree,
                deptData: (payload.onlySubDept == 1 && treeExcuteAuth != 'A0002' && treeExcuteAuth != 'A0004') ? sourceTree : deptData,
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
              callback&&callback(payload.onlySubDept == 1 ? treeData : sourceTree)
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
              // callback&&callback([])
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
              callback&&callback(payload.onlySubDept == 1 ? treeData : sourceTree)
            }
          }
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg, 5);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *getSearchTree(
      { payload, callback, pathname, moudleName },
      { call, put, select },
    ) {
      if(moudleName=='notification'||moudleName=='information'){
        payload.headers = {
          'Datarulecode': ''
        };
      }
      try {
        const { data } = yield call(getSearchTree, payload, '', 'tree');
        const { deptData, expandedDeptKeys, currentPathname } = yield select(
          (state) => state.tree,
        );
        // const {searchObj} = yield select(state=>state.layoutG)
        let pname = pathname ? pathname : currentPathname;
        pname = moudleName ? moudleName : pname.split('/')[1];
        // const {treeData,expandedKeys} = searchObj[pname]
        const { treeData, expandedKeys } = yield select(
          (state) => state[pname],
        );

        if (data.code == REQUEST_SUCCESS) {
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
                loop(
                  array[i].children,
                  keys,
                  array[i].nodeType == 'ORG' ? array[i] : org,
                );
              }
            }
            return {
              array,
              keys,
            };
          };

          if (payload.onlySubDept == 1) {
            const arrayOrg = loop(data.data.list, expandedDeptKeys, {});
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
                treeData: arrayOrg?.keys,
                expandedKeys: arrayOrg?.array,
              },
            });
          } else {
            const arrayOrg = loop(data.data.list, expandedKeys, {});
            // for(var i=0;i<array.length;i++){
            //   for(var j=0;j<treeData.length;j++){
            //     if(treeData[j].nodeId==array[i].nodeId){
            //       treeData[j].children = array[i].children
            //     }
            //   }
            // }
            callback&&callback(arrayOrg)
            yield put({
              type: 'updateStates',
              payload: {
                treeData: arrayOrg?.keys,
                expandedKeys: arrayOrg?.array,
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
                  expandedKeys: Array.from(new Set(arrayOrg?.keys)),
                  treeData: arrayOrg?.array,
                },
              });
            }
            // callback&&callback(treeData,keys);
          }
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg, 5);
        }
      } catch (e) {
      } finally {
      }
    },
    *getDepts({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(getDepts, payload);
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
        if (data.code == REQUEST_SUCCESS) {
          const { keys, array } = loop(data.data.list, expandedDeptKeys);
          yield put({
            type: 'updateStates',
            payload: {
              deptData: array,
              expandedDeptKeys: keys,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getPosts({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getPosts, payload);
        if (data.code == REQUEST_SUCCESS) {
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
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getControlTree(
      { payload, callback, pathname, moudleName },
      { call, put, select },
    ) {
      try {
        const { data } = yield call(getControlTree, { ...payload }, '', 'tree');
        const { deptData, currentPathname, postList } = yield select(
          (state) => state.tree,
        );
        // const {searchObj} = yield select(state=>state.layoutG)
        let pname = pathname ? pathname : currentPathname;
        pname = moudleName ? moudleName : pname.split('/')[1];
        let treeData = [];
        if (pname == 'role') {
          const { searchObj } = yield select((state) => state[pname]);
          treeData = searchObj[pathname].treeData;
        } else if (pname == 'applyModelConfig') {
          const bizSolId = history.location.query.bizSolId;
          const { stateObj } = yield select((state) => state[pname]);
          treeData = stateObj[bizSolId].treeData;
        } else if (pname == 'formShow') {
          const bizSolId = history.location.query.bizSolId;
          const bizInfoId = history.location.query.bizInfoId;
          const currentTab = history.location.query.currentTab;
          const { stateObj } = yield select((state) => state[pname]);
          treeData =
            stateObj[bizSolId + '_' + bizInfoId + '_' + currentTab].treeData;
        } else {
          if (payload.stateObj) {
            treeData = stateObj.treeData;
          } else {
            let stateObj = yield select((state) => state[pname]);
            treeData = stateObj.treeData;
          }
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
              loop(
                array[i].children,
                children,
                array[i].nodeType == 'ORG' ? array[i] : org,
              );
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
        if (data.code == REQUEST_SUCCESS) {
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
              callback&&callback(payload.onlySubDept == 1 ? treeData : sourceTree)
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
              callback&&callback([])
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
              callback&&callback(payload.onlySubDept == 1 ? treeData : sourceTree)
            }
          }
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
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
