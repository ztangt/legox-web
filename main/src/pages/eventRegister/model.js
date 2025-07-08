import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
  namespace: 'eventRegister',
  state: {
    tableData: [],
    editingKey: '',
    tableSelectId: '',
    tableSelectData: [],
    dataDriver: {},
    returnCount: 0, //总条目数
    limit: 10,
    currentPage: 1,
    searchWord: '',
    eventData: [], //列表数据
    isShowAddModal: false,
    eventId: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        // if (history.location.pathname === '/eventRegister') {
        // }
      });
    },
  },
  effects: {
    //获取事件注册分页数据
    *getEventTableData({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getEventTableData, payload);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            eventData: data.data.list,
            returnCount: data.data.returnCount,
            currentPage: data.data.currentPage,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //新增事件注册
    *addEventRegister({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.addEventRegister, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success('添加成功');
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //更新事件注册
    *updataEventRegister({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.updataEventRegister, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success('修改成功');
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //删除事件注册
    *deletaEventRegister({ payload, callback }, { call, put, select }) {
      let url =
        payload.type === 'one'
          ? apis.deleteOneEventRegister
          : apis.deletaEventRegister;

      if (payload.type === 'one') {
        delete payload.type;
      }
      const { data } = yield call(url, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success('删除成功');

        yield put({
          type: 'updateStates',
          payload: {
            eventId: '',
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取事件注册参数
    *getEventRegisterParams({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getEventRegisterParams, payload);
      if (data.code == REQUEST_SUCCESS) {
        let resData = (data?.data?.list || []).map(({ ...props }, ind) => ({
          ...props,
          key: ind,
        }));
        yield put({
          type: 'updateStates',
          payload: {
            tableData: resData || [],
            editingKey: '',
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //查询数据驱动所有列表
    *getDataDriverList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDataDriverList, payload);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            dataDriver: data.data.dataDrivers,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // *updateStates({ payload }, { call, put, select }) {
    //     const {
    //         searchObj
    //     } = yield select(state => state.layoutG), {
    //         pathname
    //     } = yield select(state => state.eventRegister);

    //     for (var key in payload) {
    //         searchObj[pathname][key] = payload[key]
    //     }
    //     yield put({
    //         type: "layoutG/updateStates",
    //         payload: {
    //             searchObj: searchObj
    //         }
    //     })
    // }
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
