const { getOrgChildren, getSearchTree,getDepts,getPosts } = apis;
import { ApartmentOutlined,AppstoreOutlined,BankOutlined} from '@ant-design/icons';
import {history} from 'umi';
import {message,} from 'antd';
import apis from 'api';
import _ from "lodash";
import { REQUEST_SUCCESS,NODE_TYPE } from '../service/constant'
export default {
  namespace: 'treeState',
  state: {
    treeData: [],//组织树信息
    postList:[],//用户身份详情岗位信息
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
    *getOrgChildren({ payload,callback,nodePath,currentNodeType,currentNodeId}, { call, put, select }) {
      const treeData = payload.treeData;
      delete(payload.treeData);
      const {postList} = yield select(state=>state.treeState)
      try {
        const {data} = yield call(getOrgChildren, {...payload},'','tree');
        const  loop = (array,children,org)=>{
          for(var i=0;i<array.length;i++){
            // array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
            array[i]['title'] = `${array[i]['nodeName']}`
            array[i]['key'] = array[i]['nodeId']
            array[i]['value'] = array[i]['nodeId']
            if(payload.nodeId == array[i]['nodeId']){
              //赋值一个父节点的name和一个父节点的类型
              children.map((itemChild)=>{
                itemChild['parentName'] = `${array[i]['nodeName']}`
                itemChild['parentType'] = array[i]['nodeType']
              })
              // array[i]['children'] = children
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
              loop(array[i].children,children,array[i].nodeType=='ORG'?array[i]:org)
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
          let sourceTree = treeData;
          let newList = data.data.list;
          if((sourceTree&&sourceTree.length==0)||!payload.nodeId){//根节点(搜索的时候不传nodeId)
            sourceTree = data.data.list
          }
          if(payload.nodeType=='POST'&&payload.nodeId){//岗位和子集合并
            newList = _.concat(data.data.list,postList)
          }
          console.log('newList=',newList);
          if(nodePath){//获取路径，以便获取父节点的单位id，避免向上推
            let newNodePath = JSON.parse(nodePath);
            newNodePath.push({
              id:currentNodeId,
              type:currentNodeType
            })
            newList.map((item)=>{
              item.nodePath=newNodePath
            })
          }
          sourceTree = loop(sourceTree,newList);
          callback(sourceTree);

        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg,5)
        }
      } catch (e) {
        console.log(e);
      } finally {

      }
    },
    *getOrgTree({ payload,callback,nodePath,currentNodeType,currentNodeId}, { call, put, select }) {
      const treeData = payload.treeData;
      delete(payload.treeData);
      const {postList} = yield select(state=>state.treeState)
      payload.headers = {
        Datarulecode:''
      }
      try {
        const {data} = yield call(apis.getOrgTree, {...payload},'','tree');
        console.log(payload,'payload120');
        const  loop = (array,children,org)=>{
          for(var i=0;i<array.length;i++){
            // array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
            array[i]['title'] = `${array[i]['orgName']}`
            array[i]['key'] = array[i]['id']
            array[i]['value'] = array[i]['id']
            if(payload.parentId == array[i]['id']){
              //赋值一个父节点的name和一个父节点的类型
              children.map((itemChild)=>{
                itemChild['parentName'] = `${array[i]['orgName']}`
                itemChild['parentType'] = array[i]['orgKind']
              })
              // array[i]['children'] = children
              array[i]['children'] = children
            }


            // if(org&&array[i]['nodeType']=='DEPT'){//如果是部门取父级单位
            //   console.log(org,'org==');
            //   array[i]['orgName'] = org.nodeName
            //   array[i]['orgId'] = org.nodeId
            //   // array[i]['icon'] = <ApartmentOutlined />
            // }else{
            //   // array[i]['icon'] = <BankOutlined />
            // }

            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children,children,array[i].orgKind=='ORG'?array[i]:org)
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
          let sourceTree = treeData;
          let newList = data.data.list;
          if((sourceTree&&sourceTree.length==0)||!payload.parentId){//根节点(搜索的时候不传nodeId)
            sourceTree = data.data.list
          }
          if(payload.orgKind=='POST'&&payload.parentId){//岗位和子集合并
            newList = _.concat(data.data.list,postList)
          }
          console.log('newList=',newList);
          if(nodePath){//获取路径，以便获取父节点的单位id，避免向上推
            let newNodePath = JSON.parse(nodePath);
            newNodePath.push({
              id:currentNodeId,
              type:currentNodeType
            })
            newList.map((item)=>{
              item.nodePath=newNodePath
            })
          }
          sourceTree = loop(sourceTree,newList);
          callback(sourceTree);

        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg,5)
        }
      } catch (e) {
        console.log(e);
      } finally {

      }
    },
    *getSearchTree({ payload,callback}, { call, put, select }) {
      const expandedKeys=payload.expandedKeys;
      delete(payload.expandedKeys);
      try {
        const {data} = yield call(apis.getOrgTree, payload,'','tree');
        console.log(data,'data');
        if(data.code==REQUEST_SUCCESS){
          const  loop = (array,keys,org)=>{
            for(var i=0;i<array.length;i++){
              //array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
              array[i]['title'] = `${array[i]['orgName']}`
              array[i]['key'] = array[i]['id']
              array[i]['value'] = array[i]['id']
              keys.push(array[i]['id'])
              // if(org&&array[i]['orgKind']=='DEPT'){//如果是部门取父级单位
              //   // array[i]['orgName'] = org.belongOrgName
              //   // array[i]['orgId'] = org.orgParentId
              //   // array[i]['icon'] = <ApartmentOutlined />
              // }else{
              //   // array[i]['icon'] = <BankOutlined />
              // }
              if(array[i].children&&array[i].children.length!=0){
                loop(array[i].children,keys,array[i].orgKind=='ORG'?array[i]:org)
              }
            }
            return {
              array,
              keys
            }
          }
          const {keys,array} = loop(data.data.list,expandedKeys,{});
          callback(array,keys);

        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg,5)
        }
      } catch (e) {
      } finally {
      }
    },
    *getDepts({ payload }, { call, put, select }) {
      try {
        const {data} = yield call(getDepts, payload);
        const {expandedDeptKeys } = yield select(state=>state.tree)
        const  loop = (array,keys)=>{
          for(var i=0;i<array.length;i++){
            array[i]['title'] = `${array[i]['deptName']}`
            array[i]['key'] = array[i]['id']
            array[i]['value'] = array[i]['id']
            keys.push(array[i]['id'])
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children,keys)
            }
          }
          return {
            array,
            keys
          }
        }
        if(data.code==REQUEST_SUCCESS){
          const {keys,array} = loop(data.data.list,expandedDeptKeys)
          yield put({
            type: 'updateStates',
            payload:{
              deptData: array,
              expandedDeptKeys:keys
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getPosts({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getPosts, payload);
        if(data.code==REQUEST_SUCCESS){
          for(let i=0;i<data.data.list.length;i++){
            data.data.list[i]['title'] = data.data.list[i]['postName'];
            data.data.list[i]['key'] = data.data.list[i]['id'];
            data.data.list[i]['value'] = data.data.list[i]['id'];
            data.data.list[i]['nodeName'] = data.data.list[i]['postName'];
            data.data.list[i]['nodeId'] = data.data.list[i]['id'];
            data.data.list[i]['nodeType'] ='POST';
          }
          yield put({
            type: 'updateStates',
            payload:{
              postList:data.data.list
            }
          })
          callback&&callback()
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
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
