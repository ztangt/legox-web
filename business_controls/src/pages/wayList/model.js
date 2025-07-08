import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
  namespace: 'wayList',
  state: {
    returnCount: 0,
    allPage: 1,
    currentPage: 1,
    start: 1,
    limit: 10,
    formList: [],
    resList: [],
  },
  subscriptions: {},
  effects: {
    *getNormOnwayList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getNormOnwayList,
          payload,
          '',
          'wayList',
        );
        // TODO  ==
        if (data.code !== REQUEST_SUCCESS) {
          const list = data.data.list;
          // for (let i = 0; i < list.length; i++) {
          //   list[i]['key'] = list[i].id;
          // }
          yield put({
            type: 'updateStates',
            payload: {
              formList: list,
              returnCount: data.data.returnCount,
              allPage: data.data.allPage,
              currentPage: data.data.currentPage,
            },
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
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
