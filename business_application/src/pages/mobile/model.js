import { message } from 'antd';
import apis from 'api';
import { history,location } from 'umi';
import _ from 'lodash';
import { parse } from 'query-string';
export default {
  namespace: 'mobile',
  state: {
    todoReturnCount: 0
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => { });
    },
  },
  effects: {
    //获取待办列表
    *getTodoWork({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getTodoWork, payload, '', 'mobile')
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            todoReturnCount: data.data.returnCount,
          }
        })
        callback&&callback(tableData)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
