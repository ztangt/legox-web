const { getTenantOrg, getSearchTree, getOrgChildren,getOrgCenters,getOrgTreeList} = apis;
import { ApartmentOutlined,AppstoreOutlined,BankOutlined} from '@ant-design/icons';

import {message,} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS,NODE_TYPE } from '../service/constant'
export default {
  namespace: 'tree',
  state: {
    treeData: [],//组织树信息
    treeSearchData: [],//搜索组织树信息
    expandId:'',
    expandedKeys: [],//展开keys
    currentNodeType:'',
    currentNodeName: '',
    currentNodeId:'',
    currentNodeOrgName: '',
    currentNodeOrgId: '',
    deptData: [],
    expandedDeptKeys: [],
    searchWord: '',
    currentPathname: '',
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
          dispatch({
            type:'updateStates',
            payload:{
              currentPathname: history.location.pathname
            }
          })
      });
    }
  },
  effects: {
    *getOrgCenters({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getOrgCenters, payload);
        if(data.code==REQUEST_SUCCESS){
          let organizationLists = JSON.parse(JSON.stringify(data.data.list));
          yield put({
            type: 'updateStates',
            payload:{
              organizationLists,
              organizationAddModal:false
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getTenantOrg({ payload,callback,pathname }, { call, put, select }) {
      try {
        const {data} = yield call(getTenantOrg, {...payload},'','tree');
        const { deptData,currentPathname } = yield select(state=>state.tree)
        const {searchObj} = yield select(state=>state.layoutG)
        let pname = pathname?pathname:currentPathname;
        const {treeData,orgClildrens,checkOrgCenterId} = searchObj[pname]
        const  loop = (array,children,org,levelIndex)=>{
          for(var i=0;i<array.length;i++){
            // array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`

            array[i]['title'] = `${array[i]['orgName']}`
            array[i]['nodeName'] = `${array[i]['orgName']}`
            array[i]['key'] = array[i]['id']
            array[i]['value'] = array[i]['id']
            
            if(payload.tenantId == array[i]['id']){
              array[i]['children'] = children
            }


            if(org&&array[i]['orgKind']=='DEPT'){//如果是部门取父级单位
              array[i]['orgName'] = org.nodeName
              array[i]['orgId'] = org.nodeId
              array[i]['icon'] = <ApartmentOutlined />
            }else{
              array[i]['icon'] = <BankOutlined />
            }
            // console.log('levelIndex=',levelIndex);
            if(typeof levelIndex=='undefined'||!levelIndex){
              array[i]['levelIndex'] = 1;//层级，用户共享组织中心的禁用
            }else{
              array[i]['levelIndex'] = levelIndex+1;
            }
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children,children,array[i].nodeType=='ORG'?array[i]:org,array[i]['levelIndex'])
            }else{
              if(array[i].isParent==1){
                array[i]['children'] = [{key: '-1'}]
              }else{
                array[i]['isLeaf'] = true
              }
            }
          }
          return array
        }
        if(data.code==REQUEST_SUCCESS){
          let sourceTree = payload.onlySubDept==1?deptData:treeData
          if(data.data.list.length!=0){
            if((sourceTree&&sourceTree.length==0)||!payload.nodeId){
              sourceTree = data.data.list
            }

            sourceTree = loop(sourceTree,data.data.list,0);
            if( orgClildrens[0] && orgClildrens[0].orgCenterId==checkOrgCenterId) {
               sourceTree.map((item, index) => {
                  item.disabled = false;
                  orgClildrens.map((element, elementIndex) => {
                    // 比较层级关系，不同的话禁用
                    if(item.grade!==element.grade) {
                      item.disabled = true;
                    }
                  })
                })
            }

            yield put({
              type: 'updateStates',
              payload:{
                treeData: payload.onlySubDept==1?treeData:sourceTree,
                deptData: payload.onlySubDept==1?sourceTree:deptData,
              }
            })
            if(pname){//有当前页面路径时更新每个路由下的值
              if(searchObj[pname]){
                searchObj[pname].treeData =  payload.onlySubDept==1?treeData:sourceTree
                // searchObj[pathname].expandedKeys = [payload.nodeId]
                yield put({
                  type: 'layoutG/updateStates',
                  payload:{
                    searchObj
                  }
                })
              }
            }

            if(!payload.nodeId){//请求根节点时，清空已展开的节点
              searchObj[pname].expandedKeys =  []
              yield put({
                type: 'layoutG/updateStates',
                payload:{
                  searchObj
                }
              })
            }
            callback&&callback();
          }else{
            searchObj[pname].treeData=[];
            yield put({
              type: 'layoutG/updateStates',
              payload:{
                searchObj
              }
            })
          }

        }else if(data.code!=401){
          message.error(data.msg,5)
        }
      } catch (e) {
        console.log(e);
      } finally {

      }
    },
    *getSearchTree({ payload,callback,pathname }, { call, put, select }) {
      try {
        const {data} = yield call(getSearchTree, payload,'','tree');
        const { deptData,expandedDeptKeys,currentPathname } = yield select(state=>state.tree)
        const {searchObj} = yield select(state=>state.layoutG)
        let pname = pathname?pathname:currentPathname
        const {treeData,expandedKeys} = searchObj[pname]
        if(data.code==REQUEST_SUCCESS){
          const  loop = (array,keys,org)=>{

            for(var i=0;i<array.length;i++){
              //array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
              array[i]['title'] = `${array[i]['nodeName']}`
              array[i]['key'] = array[i]['nodeId']
              array[i]['value'] = array[i]['nodeId']
              keys.push(array[i]['nodeId'])
              if(org&&array[i]['nodeType']=='DEPT'){//如果是部门取父级单位
                array[i]['orgName'] = org.nodeName
                array[i]['orgId'] = org.nodeId
                array[i]['icon'] = <ApartmentOutlined />
              }else{
                array[i]['icon'] = <BankOutlined />
              }
              if(array[i].children&&array[i].children.length!=0){
                loop(array[i].children,keys,array[i].nodeType=='ORG'?array[i]:org)
              }
            }
            return {
              array,
              keys
            }
          }

          if(payload.onlySubDept==1){
            const {keys,array} = loop(data.data.jsonResult,expandedDeptKeys,{})
            for(var i=0;i<array.length;i++){
              for(var j=0;j<deptData.length;j++){
                if(deptData[j].nodeId==array[i].nodeId){
                  deptData[j].children = array[i].children
                }
              }
            }
            yield put({
              type: 'updateStates',
              payload:{
                deptData,
                expandedDeptKeys:keys
              }
            })
          }else{
            const {keys,array} = loop(data.data.jsonResult,expandedKeys,{})
            // for(var i=0;i<array.length;i++){
            //   for(var j=0;j<treeData.length;j++){
            //     if(treeData[j].nodeId==array[i].nodeId){
            //       treeData[j].children = array[i].children
            //     }
            //   }
            // }
            yield put({
              type: 'updateStates',
              payload:{
                treeData: array,
                expandedKeys:keys
              }
            })
            if(pname){
              if(searchObj[pname]){
                searchObj[pname].treeData =  array
                searchObj[pname].expandedKeys =  Array.from(new Set(keys))
                yield put({
                  type: 'layoutG/updateStates',
                  payload:{
                    searchObj
                  }
                })
              }
            }
            // callback&&callback(treeData,keys);
          }

        }else if(data.code!=401){
          message.error(data.msg,5)
        }
      } catch (e) {
      } finally {
      }
    },
    *getOrgTreeList({ payload,callback,pathname }, { call, put, select }) {
      try {
        const {data} = yield call(getOrgTreeList, {...payload},'','tree');
        const { deptData,currentPathname } = yield select(state=>state.tree)
        const {searchObj} = yield select(state=>state.layoutG)
        let pname = pathname?pathname:currentPathname
        const {treeData} = searchObj[pname]
        const  loop = (array,children,org,levelIndex)=>{
          for(var i=0;i<array.length;i++){
            console.log(array[i], '257')
            array[i]['title'] = `${array[i]['orgName']}`
            array[i]['nodeName'] = `${array[i]['orgName']}`
            array[i]['key'] = array[i]['id']
            array[i]['value'] = array[i]['id']
            
            if(payload.parentId == array[i]['id']){
              // 显示子级单位
              array[i]['children'] = children;
            }


            if(org&&array[i]['orgKind']=='DEPT'){
              // 如果是部门取父级单位不显示部门信息
              array[i]['orgName'] = org.nodeName;
              array[i]['orgId'] = org.nodeId;
              array[i]['icon'] = <ApartmentOutlined />
            }else{
              array[i]['icon'] = <BankOutlined />
            }
            if(typeof levelIndex=='undefined'||!levelIndex){
              // 层级，用户共享组织中心的禁用
              array[i]['levelIndex'] = 1;
            }else{
              array[i]['levelIndex'] = levelIndex+1;
            }
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children,children,array[i].nodeType=='ORG'?array[i]:org,array[i]['levelIndex'])
            }else{
              if(array[i].isParent==1){
                array[i]['children'] = [{key: '-1'}]
              }else{
                array[i]['isLeaf'] = true
              }
            }
          }
          return array
        }
        if(data.code==REQUEST_SUCCESS){
          let sourceTree = payload.onlySubDept==1?deptData:treeData;
          // if(data.data.list.length==0){
          //   searchObj[pname].treeData=treeData;
          //   yield put({
          //     type: 'layoutG/updateStates',
          //     payload:{
          //       searchObj
          //     }
          //   })
          //   return 
          // }
          if(data.data.list.length!=0){
            if((sourceTree&&sourceTree.length==0)||!payload.parentId){
              sourceTree = data.data.list;
            }

            sourceTree = loop(sourceTree,data.data.list,0);

            yield put({
              type: 'updateStates',
              payload:{
                treeData: payload.onlySubDept==1?treeData:sourceTree,
                deptData: payload.onlySubDept==1?sourceTree:deptData,
              }
            })

            if(pname){//有当前页面路径时更新每个路由下的值
              if(searchObj[pname]){
                searchObj[pname].treeData =  payload.onlySubDept==1?treeData:sourceTree;
                // searchObj[pathname].expandedKeys = [payload.nodeId]
                yield put({
                  type: 'layoutG/updateStates',
                  payload:{
                    searchObj
                  }
                })
              }
            }

            if(!payload.parentId){//请求根节点时，清空已展开的节点
              searchObj[pname].expandedKeys =  []
              yield put({
                type: 'layoutG/updateStates',
                payload:{
                  searchObj
                }
              })
            }
            callback&&callback(treeData);
          }else{
            searchObj[pname].treeData=[];
            yield put({
              type: 'layoutG/updateStates',
              payload:{
                searchObj
              }
            })
          }

        }else if(data.code!=401){
          message.error(data.msg,5)
        }
      } catch (e) {
        console.log(e);
      } finally {

      }
    }, 
  },
  reducers: {
    updateStates(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
