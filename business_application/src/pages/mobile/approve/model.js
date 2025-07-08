import { message } from 'antd';
import apis from 'api';
import { history } from 'umi';
import _ from 'lodash';
import { SIGN_CONFIG } from '../../../service/constant'

export default {
  namespace: 'approve',
  state: {
    authList: [],
    signConfig: {},
    popularList: [],
    commentList: [],
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        
      });
    },
  },
  effects: {
    //获取app表单意见字段权限
    *getAuthList({ payload,callback }, { call, put }) {
      const { data } = yield call(apis.getAuthList, payload, 'getAuthList', 'approve');
      if (data.code == 200) {
        callback&&callback(data)
        yield put({
          type: 'updateStates',
          payload: {
            authList: data.data.authList,
            currentColumnCode: data.data.authList?.[0]?.formColumnCode
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    //获取签批配置
    *getSignConfig({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getSignConfig, payload,'getSignConfig', 'approve');
      if (data.code == 200) {
        let signConfig = '';
        if(!data?.data?.id||data?.data?.id=='null'||data?.data?.createTime=='null'){
          signConfig = SIGN_CONFIG;
        }else{
          signConfig = data?.data;
        }
        yield put({
          type: 'updateStates',
          payload: {
            signConfig
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取常用语
    *getPopularList({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getPopularList, payload,'getPopularList', 'approve');
      if (data.code == 200) {
        var list = []
        if (data.data.list.length && data.data.list.length != 0) {
          list = data.data.list
        } else {
          list = [{signText: '同意'}, {signText: '圈阅'}, {signText: '驳回'}]
        }
        yield put({
          type: 'updateStates',
          payload: {
            popularList: list
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取登录用户信息
    *getCurrentUserInfo({ payload,callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getCurrentUserInfo,
        payload,
        'getCurrentUserInfo',
        'approve'
      );
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            userInfo: data.data,
          },
        });
        callback&&callback(data)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *saveTemporarySign({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.saveTemporarySign, payload, 'saveTemporarySign', 'approve');
      if (data.code == 200) {
        callback&&callback()
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取暂存手写签批
    *getTemporarySignList({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getTemporarySignList, payload, 'getTemporarySignList', 'approve');
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            commentList: data?.data?.tableColumCodes||[],
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
