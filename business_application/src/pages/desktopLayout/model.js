import apis from 'api';
import axios from 'axios';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';
import { defaultLayoutState, emptyLayoutState } from '../../util/constant';

// var count = 0;
export default {
  namespace: 'desktopLayout',
  state: {
    showDesktopTab: false,
    layoutState: emptyLayoutState,
    desktopLayoutState: emptyLayoutState,
    isFinsh: false,
    isOver: false,
    addData: [],
    addTextData: [],
    refreshTag: '',
    isResized: false,
    desktopHeight: 0,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
      });
    },
  },
  effects: {
    *updateTableLayout({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.updateTableLayout, payload, '', 'desktopLayout');
      if (data.code == REQUEST_SUCCESS) {
        message.success('保存成功');
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getColumnList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getColumnList, payload, '', 'desktopLayout');
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
            isFinsh: true,
            addData,
            addTextData,
          },
        });
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
