
import { message } from 'antd';
import apis from 'api';
import { history } from 'umi';
import _ from 'lodash';

export default {
  namespace: 'designableBiz',
  state: {
    stateInfo:{},
    bizModal: false,
    bizModalProps: {

    },
    treeTableProps:{
      
    }
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        
      });
    },
  },
  effects: {
    *updateStates({ payload, mainTableId,isClear }, { call, put, select }) {
      const { stateInfo } = yield select((state) => state.designableBiz);
      console.log('mainTableId',stateInfo,mainTableId);
      if (typeof stateInfo[mainTableId] =='undefined'||isClear) {
        stateInfo[mainTableId] ={
          bizModal: false,
          bizModalProps: {
            bizSolId: '',
            bizInfoId: '',
            id: '',
            currentTab: '',
          },
          treeTableProps:{
            
          }
        }
      }
      for (var key in payload) {
        console.log('mainTableIdkey',key);
        stateInfo[mainTableId][key] =
          payload[key];
      }
      // if (!payload.isModal) {
      //   stateInfo[mainTableId] = {};
      // }
      
      yield put({
        type: 'customUpdateStates',
        payload: {
          stateInfo: stateInfo,
        },
      });
    },
  },
  reducers: {
    customUpdateStates(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
