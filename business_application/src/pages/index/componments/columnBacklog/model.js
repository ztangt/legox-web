import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../../../service/constant';

export default {
  namespace: 'columnBacklog',
  state: {
    list: [],
    circulateList: [],
    boList: [],
    count: 0,
    circulateCount: 0,
    boCount: 0,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
      });
    },
  },
  effects: {
    *getBackWork({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getTodoWork, payload, 'getBackWork', 'columnBacklog');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            boList: data.data.list,
            boCount: data.data.returnCount,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getTodoWork({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getTodoWork, payload, '', 'columnBacklog');
      if (data.code == REQUEST_SUCCESS) {
        localStorage.setItem('waitData',data.data.returnCount);
        yield put({
          type: 'updateStates',
          payload: {
            list: data.data.list,
            count: data.data.returnCount,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getCirculateWork({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getCirculateWork, payload, '', 'columnBacklog');
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            circulateList: data.data.list,
            circulateCount: data.data.returnCount,
          },
        });
        callback && callback();
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
