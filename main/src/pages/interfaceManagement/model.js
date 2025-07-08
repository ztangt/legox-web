import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
  namespace: 'interfaceManagement', //命名空间
  state: {
    allPage: 0,
    currentPage: 1,
    returnCount: 0,
    limit: 0,
    tableData: [],
    search: '',
    isShowAddInterface: false,
    paramsData: [],
    selectedRowKeys: [],
    detailData: {},
    selectedRowIds: [],
    paramsDataOther: [],
    selectedRowKeysOther: [],
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen(location => {
        // if (history.location.pathname === '/interfaceManagement') {
        //   dispatch({
        //     type: 'updateStates',
        //     payload: {
        //       pathname: history.location.pathname,
        //     },
        //   });
        // }
      });
    },
  },
  effects: {
    //接口列表
    *getApiManageList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getApiManageList, payload);
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
    //删除接口
    *deleteApiManage({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.deleteApiManage, payload);
      if (data.code == REQUEST_SUCCESS) {
        const { search, tableData, currentPage, limit } = yield select(
          state => state.interfaceManagement,
        );
        if (tableData.length == 1 && currentPage != 1) {
          //获取列表
          yield put({
            type: 'getApiManageList',
            payload: {
              start: currentPage - 1,
              limit: limit,
              search: search,
            },
          });
        } else {
          yield put({
            type: 'getApiManageList',
            payload: {
              start: currentPage,
              limit: limit,
              search: search,
            },
          });
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //新增
    *addApiManage({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.addApiManage, payload);
      if (data.code == REQUEST_SUCCESS) {
        const { search, currentPage, limit } = yield select(
          state => state.interfaceManagement,
        );
        yield put({
          type: 'getApiManageList',
          payload: {
            start: currentPage,
            limit: limit,
            search: search,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getDetailApiManage({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDetailApiManage, payload);
      if (data.code == REQUEST_SUCCESS) {
        if (data.data.apiResultList && data.data.apiResultList.length > 0) {
          data.data.apiResultList.forEach(item => {
            item.key =
              Math.random()
                .toString(36)
                .substring(2, 15) +
              Math.random()
                .toString(36)
                .substring(2, 15);
          });
        }
        if (data.data.apiParamList && data.data.apiParamList.length > 0) {
          data.data.apiParamList.forEach(item => {
            item.key =
              Math.random()
                .toString(36)
                .substring(2, 15) +
              Math.random()
                .toString(36)
                .substring(2, 15);
          });
        }

        const obj = {};
        obj.name = data.data.name;
        obj.code = data.data.code;
        (obj.apiUrl = data.data.apiUrl), (obj.apiMethod = data.data.apiMethod);
        obj.isArray = data.data.isArray;
        obj.id = data.data.id;
        yield put({
          type: 'updateStates',
          payload: {
            detailData: obj,
            paramsDataOther: data.data.apiParamList || [],
          },
        });

        yield put({
          type: 'updateStates',
          payload: {
            detailData: obj,
            paramsData: data.data.apiResultList || [],
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
