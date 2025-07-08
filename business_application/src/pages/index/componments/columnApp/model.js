import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../../../service/constant';

const id = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).id : '';

export default {
  namespace: 'columnApp',
  state: {
    isSetModalVisible: false,
    selectKeys: localStorage.getItem(`useKeys${id}`) ? JSON.parse(localStorage.getItem(`useKeys${id}`)) : [],
    selectList: localStorage.getItem(`useList${id}`) ? JSON.parse(localStorage.getItem(`useList${id}`)) : [],
    allAppList: [],
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
      });
    },
  },
  effects: {
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