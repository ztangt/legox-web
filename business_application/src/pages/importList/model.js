import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import { message } from 'antd'

export default {
  namespace: 'importList',
  state: {
    start: 1,
    limit: 10,
    currentPage: 0,
    returnCount: 0,
    allPages: 0,
    list: [],
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
      });
    },
  },
  effects: {
    *getImportList({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getImportList, payload, '', 'importList')
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            list: data.data.list,
            returnCount: data.data.returnCount,
            currentPage: data.data.currentPage,
            allPages: data.data.allPages,
          }
        })
      }
      else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5)
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
