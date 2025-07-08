import {message} from 'antd';
import apis from 'api';
const {example,getCtlgTree,addCtlg,updateCtlg,deleteCtlg,updatePermission,ctlgBatchsort,getCtlgMove} = apis;
import { REQUEST_SUCCESS } from '../../service/constant'
import { parse } from 'query-string';
import { history } from 'umi'
export default {
  namespace: 'businessUseSort',
  state: {
    businessDatas:[],
    parentStrCtlgId:[],//父应用类别id
    parentStrCtlgName:'',//父应用类别name
    addObj:{},
    fields:[{
      name: ['parentStrCtlgId'],
      value: '',
    }],
    addModal:false,
    treeData:[]
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      // history.listen(location => {
        // if (history.location.pathname.includes('/businessUseSort') ) {
        //   const query = parse(history.location.search);
        //   if(query.isInit=='1'){
        //     dispatch({
        //       type: 'updateStates',
        //       payload:{
        //         businessDatas:[],
        //         parentStrCtlgId:[],//父应用类别id
        //         parentStrCtlgName:'',//父应用类别name
        //         addObj:{},
        //         fields:[{
        //           name: ['parentStrCtlgId'],
        //           value: '',
        //         }],
        //         addModal:false
        //       }
        //     })
        //   }
        //   dispatch({
        //     type: 'getCtlgTree',
        //     payload:{
        //       type:'ALL',
        //       hasPermission:'0'
        //     }
        //   })
        // }
      // });
    }
  },
  effects: {
    *getCtlgTree({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getCtlgTree, payload);
        const { businessDatas } = yield select(state=>state.businessUseSort)
        const getTextByJs = (arr)=>{
          var str = "";
          for (var i = 0; i < arr.length; i++) {
              str += arr[i]+ ",";
          }
          if (str.length > 0) {
              str = str.substr(0, str.length - 1);
          }
          return str;
        }
        const  loop = (array,children,org)=>{
          for(var i=0;i<array.length;i++){
            array[i]['title'] = array[i]['nodeName']
            array[i]['key'] = array[i]['nodeId']
            array[i]['value'] = array[i]['nodeId']
            array[i]['id'] = array[i]['nodeId']
            if(payload.nodeId == array[i]['nodeId']){
              array[i]['children'] = children
            }

            if(payload.hasPermission == '1'){
              let arr = []
              array[i].orgs.forEach(function(item,i){
                arr.push(item.orgName)
              })
              array[i]['orgNames'] = getTextByJs(arr)
            }
           

            if(org&&array[i]['nodeType']=='DEPT'){//如果是部门取父级单位
              array[i]['orgName'] = org.nodeName
              array[i]['orgId'] = org.nodeId
            }
            
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children,children,array[i].nodeType=='ORG'?array[i]:org)
            }else{
              delete array[i]['children']
              // if(array[i].isParent==1){
              //   array[i]['children'] = [{key: '-1'}]
              // }
            }
          }
          return array
        }
        if(data.code==REQUEST_SUCCESS){

          // let sourceTree = businessDatas
          // if(sourceTree&&sourceTree.length==0){
          //   sourceTree = data.data
          // }
          let sourceTree = data.data.list
          sourceTree = loop(sourceTree,data.data.list);
          yield put({
            type: 'updateStates',
            payload:{
              businessDatas: sourceTree,
              treeData:sourceTree
            }
          }) 
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addCtlg({ payload ,callback}, { call, put, select }) {
      try {
        const {data} = yield call(addCtlg, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getCtlgTree',
            payload:{
              type:'ALL',
              hasPermission:'1'
            }
          })
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *updateCtlg({ payload ,callback}, { call, put, select }) {
      try {
        const {data} = yield call(updateCtlg, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getCtlgTree',
            payload:{
              type:'ALL',
              hasPermission:'1'
            }
          })
          callback&&callback();
        }else{
          message.error(data.msg,5)

        }
      } catch (e) {
      } finally {
      }
    },
    *deleteCtlg({ payload ,callback}, { call, put, select }) {
      try {
        const {data} = yield call(deleteCtlg, payload);
        if(data.code==REQUEST_SUCCESS){
          message.success('删除成功')
          yield put({
            type: 'getCtlgTree',
            payload:{
              type:'ALL',
              hasPermission:'1'
            }
          })
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e,'e=====');
      } finally {
      }
    },
    *updatePermission({ payload ,callback}, { call, put, select }) {
      try {
        const {data} = yield call(updatePermission, payload);
        
        if(data.code==REQUEST_SUCCESS){
          // yield put({
          //   type: 'getCtlgTree',
          //   payload:{
          //     type:'ALL',
          //     hasPermission:'1'
          //   }
          // })
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *ctlgBatchsort({ payload ,callback}, { call, put, select }) {
      try {
        const {data} = yield call(ctlgBatchsort, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getCtlgMove({ payload ,callback}, { call, put, select }) {
      try {
        const {data} = yield call(getCtlgMove, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
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
