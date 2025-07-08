import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../../../service/constant';

export default {
  namespace: 'columnNotice',
  state: {
    list: [],
    count: 0,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        // if (history.location.pathname === '/desktopLayhistory.location.pathnameocation.pathname === '/') {
        // }
      });
    },
  },
  effects: {
    *getNoticeViewList({payload},{call,put,select}){
      const {data} = yield call(apis.getNoticeViewList,payload);
      if(data.code == REQUEST_SUCCESS){
        yield put({
          type:'updateStates',
          payload:{
            list: data.data.list,
            count: data.data.returnCount,
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
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