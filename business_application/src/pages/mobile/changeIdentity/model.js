import { message } from 'antd';
import apis from 'api';
import { history } from 'umi';
import _ from 'lodash';
export default {
  namespace: 'changeIdentity',
  state: {
    identitys: [],
    identityId: '',
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        
      });
    },
  },
  effects: {
    //获取登录用户身份列表
    *getUserDentityList({ payload }, { call, put }) {
      const { data } = yield call(apis.getUserDentityList, payload, 'getUserDentityList', 'changeIdentity');
      if (data.code == 200) {
        let obj = data.data.identitys;
        yield put({
          type: 'updateStates',
          payload: {
            identitys: data.data.identitys,
            identityId: localStorage.getItem('identityId'),
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
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
