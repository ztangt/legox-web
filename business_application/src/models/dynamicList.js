import { message } from 'antd';
import apis from 'api';
import { history } from 'umi';
import _ from 'lodash';
export default {
  namespace: 'dynamicList',
  state: {
    list: [],
    currentPage: 1,
    returnCount: 0,
    listType: '',
    listModel: {}
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {});
    },
  },
  effects: {
    //查询列表建模样式信息
    *getListModelStyleInfo({ payload, callback }, { call, put, select }) {
      let { bizSolId, listModelId, formId, menuId } = payload;
      payload.headers = {
        BizSolid: bizSolId,
        ListModelid: listModelId,
        Deployformid: formId,
        Menuid: menuId,
      }; //需要在headers中添加参数
      const { data } = yield call(
        apis.getListModelStyleInfo,
        payload,
        '',
        'dynamicList',
        { callback },
      );
      if (data.code == 200) {
        const listModel = data.data;
        callback&&callback(listModel)
        yield put({
          type: 'updateStates',
          payload: {
            listModel
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getListModelData({ payload }, { call, put, select }) {
      const { data } = yield call(
        apis.getListModelData,
        payload,
        '',
        'getListModelData',
      );
      const { list } = yield select((state) => state.dynamicList);
      if (data.code == 200) {
        var newList = [];
        if (payload.start != 1) {
          newList = [...list, ...data?.data?.list];
        } else {
          newList = data?.data?.list||[];
        }
        yield put({
          type: 'updateStates',
          payload: {
            list: newList,
            currentPage: data.data.currentPage,
            returnCount: data.data.returnCount
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    //删除‘
    *deleteBizInfo({ payload, callback }, { call, put, select }) {
      debugger
      let cutomHeaders = payload.cutomHeaders;
      delete payload.cutomHeaders;
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(
        apis.deleteBizInfo,
        payload,
        '',
        'dynamicList',
        { callback },
      );
      if (data.code == 200) {
        message.success('删除成功');
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
