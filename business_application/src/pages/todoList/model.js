import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
  namespace: 'todoList',
  state: {
    list: [],
    registers: [],
  },
  subscriptions: {},
  effects: {
    *getRegister({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getRegister, payload, '', 'todoList');
        if (data.code == REQUEST_SUCCESS) {
          const obj = {
            registerId: '',
            registerName: '全部',
            count: 0,
          };
          const arr = data.data.registers;
          arr.unshift(obj);
          // yield put({
          //   type: 'updateStates',
          //   payload: {
          //     registers: arr,
          //   },
          // });
          callback && callback(arr);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getTodoList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getTodoList, payload, '', 'todoList');
      if (data.code == REQUEST_SUCCESS) {
        // 传了isFrist 设置count
        if (payload.isFrist) {
          callback && callback(data.data.returnCount);
        }
        // isFrist=1（全部）和没传isFrist的时候设置todoList
        if (payload.isFrist === 1 || !payload.isFrist) {
          yield put({
            type: 'updateStates',
            payload: {
              list: data.data.list,
            },
          });
        }
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
