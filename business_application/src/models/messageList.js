import { message } from 'antd';
import apis from 'api';
import { history } from 'umi';
import _ from 'lodash';
export default {
  namespace: 'messageList',
  state: {
    list: [],
    currentPage: 1,
    returnCount: 0,
    msgType: '',
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {});
    },
  },
  effects: {
    *getMessageList({ payload }, { call, put, select }) {
      const { data } = yield call(
        apis.getMessageList,
        payload,
        '',
        'messageList',
      );
      const { list } = yield select((state) => state.messageList);
      if (data.code == 200) {
        var newList = [];
        if (payload.start != 1) {
          newList = [...list, ...data?.data?.list];
        } else {
          newList = data?.data?.list||[];
        }
        yield put({
          type: 'updateStates',
          payload: {
            list: newList,
            currentPage: data.data.currentPage,
            returnCount: data.data.returnCount
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *putMessage({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(apis.putMessage, payload, '', 'messageList');
      const { messageList } = yield select((state) => state.messageList);
      if (data.code == 200) {
        // messageList.forEach((item) => {
        //   payload.msgIds.split(',').forEach((val) => {
        //     if (item.msgId == val) {
        //       item.msgStatus = '1';
        //     }
        //   });
        // });
        // yield put({
        //   type: 'updateStates',
        //   payload: {
        //     ...messageList,
        //   },
        // });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
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
