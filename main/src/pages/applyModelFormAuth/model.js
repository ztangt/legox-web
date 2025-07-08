import {message} from 'antd';
import apis from 'api';
import {history} from 'umi';
import { parse } from 'query-string';
export default {
  namespace: 'applyModelFormAuth',
  state: {
    stateObj:[]//所有的id的state
  },
  subscriptions: {
    // setup({dispatch, history},{call, select}) {
    //   history.listen(location => {
        // if (history.location.pathname === '/applyModelFormAuth') {
        //   dispatch({//如果没有保存上id信息则复一个初始值
        //     type:'updateStates',
        //     payload:{
        //     }
        //   })
        // }
      // });
    // }
  },
  effects: {
    //获取权限绑定
    *getAuthority({ payload }, { call, put, select }) {
      console.log('23455');
      const {data} = yield call(apis.getAuthority, payload);
      if(data.code==200){
        yield put({
          type:'updateStates',
          payload:{
            authList:data.data.authList
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //绑定权限
    *updateAuth({ payload }, { call, put, select }) {
      const {data} = yield call(apis.updateAuth, payload);
      if(data.code==200){
        message.success('保存成功');
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *updateStates({ payload }, { call, put, select }){
      console.log('payload=',payload);
      const {stateObj} = yield select(state=>state.applyModelFormAuth)
      const query = parse(history.location.search);
      const bizSolId = query.bizSolId;
      //判断是否存在当前的ID
      if(typeof stateObj[bizSolId]!='undefined'){
        for (var key in payload) {
          stateObj[bizSolId][key]=payload[key]
        }
      }else{
        stateObj[bizSolId]={
          authList:[],//授权列表
          originalData:[],
          selectedNodeId:[],
          selectedDataIds:[],
          treeData:[],
          currentNode:[],
          expandedKeys:[],
          treeSearchWord:[],
          selectedDatas:[]
        }
      }
      yield put({
        type:"updateStatesGlobal",
        payload:{
          stateObj:stateObj
        }
      })
    },
  },
  reducers: {
    updateStatesGlobal(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
