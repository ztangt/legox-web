import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../../../service/constant';

export default {
  namespace: 'columnInformation',
  state: {
    list: [],
    isLoop: 1,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
      });
    },
  },
  effects: {
    // 查询资讯公告
    *getInformation({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getInformation, payload, '', 'columnInformation');
      if (data.code == REQUEST_SUCCESS) {
        if (data.data.list.length) {
          const list = data.data.list
          let arr = []
          for (let i = 0; i < list.length; i++) {
            if (list[i].loopPlayback) {
              arr.push(list[i])
            }            
          }
          if (arr.length > 5) {
            arr = arr.slice(0,5)
          }
          yield put({
            type: 'updateStates',
            payload: {
              list: arr,
            },
          });
        }
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
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