import apis from 'api';
export default {
  namespace: 'formDesigner',
  state: {
    signConfig:{}
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
        if(history.location.pathname=='/formDesigner'){
          dispatch({
            type: 'getTenantSign'
          })
        }
      });
    }
  },
  effects: {
    // 获取手写签批样式管理
    *getTenantSign({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getTenantSign, payload);
      console.log(data);
      if (data.code == 200) {
          yield put({
              type: "updateStates",
              payload: {
                signConfig: data.data,
              }
          })
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
  },
  },
  reducers: {
    updateStates(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
