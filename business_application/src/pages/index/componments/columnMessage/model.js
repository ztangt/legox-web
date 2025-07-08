import apis from 'api';
import { message } from 'antd';
export default {
  namespace: 'msgNotice',
  state: {
    messageList: [],
    idsArr: [],
    isShowModal:false,
    messageLength:0
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {},
  },
  effects: {
    *getMessageList({ payload,callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getMessageList,
        payload,
        '',
        'msgNotice',
      );
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            messageList: data.data.list,
          },
        });
        callback&&callback()
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *putMessage({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(apis.putMessage, payload, '', 'msgNotice');
      const { messageList } = yield select((state) => state.msgNotice);
      if (data.code == 200) {
        messageList.forEach((item) => {
          payload.msgIds.split(',').forEach((val) => {
            if (item.msgId == val) {
              item.msgStatus = '1';
            }
          });
        });
        yield put({
          type: 'updateStates',
          payload: {
            ...messageList,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    //左侧分类、未读数量
    *getCategoryList({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(apis.getCategoryList, payload,'','msgNotice')
      if (data.code == 200) {
        if(data.data.list){
          yield put({
            type: 'updateStates',
            payload: {
              messageLength: data.data.list?.filter(item => item.msgStatus == 0).reduce((pre, cur) => {
                return pre + Number(cur.num)
            }, 0),
            }
          })
        }
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
