import { message } from 'antd';
import apis from 'api';
import { history,location } from 'umi';
import _ from 'lodash';
export default {
  namespace: 'sysMsgInfo',
  state: {
    msgData: {}
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => { });
    },
  },
  effects: {
    //获取消息详情
    *getMessage({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getMessage, payload, 'getMessage', '')
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            msgData: data.data
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    }
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
