import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../../../service/constant';

export default {
  namespace: 'columnBacklogOther',
  state: {
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
      });
    },
  },
  effects: {
    // *getBackWork({ payload }, { call, put, select }) {
    //   const { data } = yield call(apis.getTodoWork, payload);
    //   if (data.code == REQUEST_SUCCESS) {
    //     yield put({
    //       type: 'updateStates',
    //       payload: {
    //         boList: data.data.list,
    //         boCount: data.data.returnCount,
    //       },
    //     });
    //   } else if (data.code != 401 && data.code != 419 && data.code != 403) {
    //     message.error(data.msg);
    //   }
    // },
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
