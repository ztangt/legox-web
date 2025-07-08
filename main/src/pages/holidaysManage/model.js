import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';

const { getHolidays, addHoliday, updateHoliday, deleteHoliday } = apis;
export default {
  namespace: 'holidaysManage',
  state: {
    currentYear: new Date(),
    holidaysList: [],
    selectedRowKeys: [],
    isShowAddHoliday: false,
    currentHoliday: {},
    currentPage: 0,
    returnCount: 0,
    limit: 10,
  },
  subscriptions: {
    // setup({ dispatch, history }, { call, select }) {
    //   history.listen(location => {
    //     if (history.location.pathname === '/holidaysManage') {
    //       //进入界面刷新数据
    //       dispatch({
    //         type: 'getHolidays',
    //         payload: {
    //           start: 0,
    //           limit: 10,
    //         },
    //       });
    //     }
    //   });
    // },
  },
  effects: {
    //获取节假日列表
    *getHolidays({ payload }, { call, put, select }) {
      try {
        if (!payload.year) {
          const { currentYear } = yield select(state => state.holidaysManage);
          payload.year = currentYear.getFullYear();
        }
        const { data } = yield call(getHolidays, payload);

        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              returnCount: data.data.returnCount,
              currentPage: data.data.currentPage,
              allPages: data.data.allPages,
              holidaysList: data.data.list,
              limit: payload.limit,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addHoliday({ payload }, { call, put, select }) {
      try {
        const changeYear = payload.year;
        payload.year = payload.year.getFullYear();
        const { data } = yield call(addHoliday, payload);
        const { currentPage, limit } = yield select(
          state => state.holidaysManage,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getHolidays',
            payload: {
              start: currentPage,
              limit: limit,
              year: changeYear.getFullYear(),
            },
          });
          yield put({
            type: 'updateStates',
            payload: {
              isShowAddHoliday: false,
              currentYear: changeYear,
              currentHoliday: {},
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *updateHoliday({ payload }, { call, put, select }) {
      try {
        const changeYear = payload.year;
        payload.year = payload.year.getFullYear();
        const { data } = yield call(updateHoliday, payload);
        const { currentPage, limit } = yield select(
          state => state.holidaysManage,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getHolidays',
            payload: {
              start: currentPage,
              limit: limit,
              year: changeYear.getFullYear(),
            },
          });
          yield put({
            type: 'updateStates',
            payload: {
              isShowAddHoliday: false,
              currentYear: changeYear,
              currentHoliday: {},
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *deleteHoliday({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(deleteHoliday, payload);
        const { currentPage, limit, currentYear } = yield select(
          state => state.holidaysManage,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getHolidays',
            payload: {
              start: currentPage,
              limit: limit,
              year: currentYear.getFullYear(),
            },
          });
          yield put({
            type: 'updateStates',
            payload: {
              isShowAddHoliday: false,
              currentHoliday: {},
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
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
