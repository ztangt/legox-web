import {message} from 'antd';
import apis from 'api';
import { history } from 'umi';
import _ from "lodash";
import { dataFormat } from '../util/util'
export default {
  namespace: 'flowDetails',
  state: {
    // stateObj:{}
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
        // if (location.pathname.includes('flowDetails')) {
        //   const bizInfoId=location.query.bizInfoId;
        //   const procDefId = location.query.procDefId;
        //  dispatch({
        //     type:"updateStates",
        //     payload:{}
        //   })

        // }
      });
    }
  },
  effects: {
    *getNewBpmnDetail({payload,callback},{call,put,select}){
      const {data} = yield call(apis.getBpmnDetail,payload,'getNewBpmnDetail','flowDetails')
      if(data.code==200){
        let obj = JSON.parse(JSON.stringify(data.data));
        console.log('obj=',obj);
        if(!obj?.bizInfo){
          obj.bizInfo={};
        }
        if(obj&&obj?.bizInfo?.startTime){
          obj.bizInfo.startTime = dataFormat(obj.bizInfo.startTime,'YYYY-MM-DD HH:mm:ss')
        }
        if(obj&&obj?.bizInfo?.endTime){
          obj.bizInfo.endTime = dataFormat(obj.bizInfo.endTime,'YYYY-MM-DD HH:mm:ss')
        }
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     detailObj:obj
        //   }
        // })
        callback&&callback(obj);
      }else{
        message.error(data.msg);
      }
    },
    *getFormTrace({payload,callback},{call,put,select}){
      const {data} = yield call(apis.getFormTrace,payload);
      if(data.code==200){
        callback(data.data);
      }else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg)
      }
    },
    *getFormTraceList({payload,callback},{call,put,select}){
      const {data} = yield call(apis.getFormTraceList,payload);
      if(data.code==200){
        callback(data.data);
      }else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg)
      }
    }
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
