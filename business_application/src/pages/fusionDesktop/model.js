import apis from 'api';
import { message } from 'antd';
import axios from 'axios';
import { setAllAppList, getFlatArr } from '../../util/util';
import addLogoSrc from './images/addItem.png';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
  namespace: 'fusionDesktop',
  state: {
    isSetModalVisible: false,
    allAppList: [],
    selectKey: [],
    selectAppList: [],
    defalutConfiguration: [
      {
        id: 'config1',
        name: '请添加应用',
        url: '',
        path: '',
      },
      {
        id: 'config2',
        name: '请添加应用',
        url: '',
        path: '',
      },
      {
        id: 'config3',
        name: '请添加应用',
        url: '',
        path: '',
      },
      {
        id: 'config4',
        name: '请添加应用',
        url: '',
        path: '',
      },
      {
        id: 'config5',
        name: '请添加应用',
        url: '',
        path: '',
      },
      {
        id: 'config6',
        name: '请添加应用',
        url: '',
        path: '',
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
      const { data } = yield call(apis.getUserMenus, payload, '', 'fusionDesktop');
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
      const { data } = yield call(apis.updateTableLayout, payload, '', 'fusionDesktop');
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
