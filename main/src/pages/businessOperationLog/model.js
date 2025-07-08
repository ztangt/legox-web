import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
  namespace: 'businessOperationLog', //命名空间
  state: {
    allPage: 0,
    currentPage: 0,
    returnCount: 0,
    limit: 10,
    tableData: [],
    search: '',
    paramsData: [],
    selectedRowKeys: [],
    detailData: {},
    selectedRowIds: [],
    paramsDataOther: [],
    selectedRowKeysOther: [],
  },
  effects: {
    //接口列表
    *getPubSysBusinessOpera({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getPubSysBusinessOpera, payload);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            tableData: data.data.list,
            returnCount: data.data.returnCount,
            currentPage: data.data.currentPage,
          },
        });
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
