import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';
import { defaultLayoutState } from '../../util/constant';

export default {
  namespace: 'desktopLayout',
  state: {
    columnName: '',
    columnUrl: '',
    addData: [],
    addTextData: [],
    isFinsh: false,
    showDesktopTab: false,
    isAddTextModalVisible: false,
    isUpdateTextModalVisible: false,
    isTableModalVisible: false,
    isAddModalVisible: false,
    isUpdateModalVisible: false,
    layoutState: defaultLayoutState,
    selectedRowKeys: [],
    paramsData: [],
    desktopHeight: 0,
  },
  subscriptions: {
    // setup({ dispatch, history }, { call, select }) {
    //   history.listen(location => {
    //     // TODO
    //     if (history.location.pathname === '/desktopLayout') {
         
    //     }
    //   });
    // },
  },
  effects: {
    *updateTableLayout({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.updateTableLayout, payload);
      if (data.code == REQUEST_SUCCESS) {
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getColumnList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getColumnList, payload);
      if (data.code == REQUEST_SUCCESS) {
        let addData = data.data.list.filter(
          (item) => item.sectionType == 1
        );
        addData
          .forEach((element, index) => {
            element.key = `ColumnFree${index}`;
            element.name = element.deskSectionName;
            element.url = element.deskSectionUrl;
          });
        let addTextData = data.data.list.filter(
          (item) => item.sectionType == 2
        );
        addTextData
          .forEach((element, index) => {
            element.key = `columnTextFree${index}`;
            element.name = element.deskSectionName;
            element.url = element.deskSectionUrl;
          });
        yield put({
          type: 'updateStates',
          payload: {
            addData,
            addTextData,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *addColumn({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.addColumn, payload);
      if (data.code == REQUEST_SUCCESS) {
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *delColumn({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.delColumn, payload);
      if (data.code == REQUEST_SUCCESS) {
        // yield put({
        //   type: 'getColumnList',
        //   payload: {
        //     sectionType: '',
        //     start: 1,
        //     limit: 10,
        //   },
        // });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *updateColumn({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.updateColumn, payload);
      if (data.code == REQUEST_SUCCESS) {
        // yield put({
        //   type: 'getColumnList',
        //   payload: {
        //     sectionType: '',
        //     start: 1,
        //     limit: 10,
        //   },
        // });
        callback && callback();
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
