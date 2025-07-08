import apis from 'api';
import { message } from 'antd';
import axios from 'axios';
import { REQUEST_SUCCESS } from '../../service/constant';
import { getFlatArr } from '../../util/util';
// import { emptyLayoutState, defaultLayoutState } from '../../util/constant';

export default {
  namespace: 'fastDesktop',
  state: {
    pageIcon: '',
    pageName: '',
    isSetModalVisible: false,
    isAddModalVisible: false,
    isIconModalVisible: false,
    allAppList: [],
    currentIndex: 0,
    generalJson: [
      {
        pageName: '第一页',
        pageIcon: 'a-uniE623',
        active: true,
        currentMenuKeys: [],
        currentMenu: [],
      },
    ],
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
      });
    },
  },
  effects: {
    *getUserMenus({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getUserMenus, payload, '', 'fastDesktop');
      if (data.code == REQUEST_SUCCESS) {
        const allAppList = data.data.menus;
        allAppList.forEach((element) => {
          element['children'] = getFlatArr(element.children).filter(
            (i) => i.path !== '',
          );
        });
        callback && callback(allAppList);
      } else if (data.code != 401 && data.code != 302 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *updateTableLayout({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.updateTableLayout, payload, '', 'fastDesktop');
      if (data.code == REQUEST_SUCCESS) {
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
