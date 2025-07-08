import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../../../service/constant';
import _ from 'lodash';
import { parse } from 'query-string';
import { history } from 'umi'
const { previewPrintTemplate } = apis;

export default {
  namespace: 'templateEditorPrint',
  state: {
    deployFormId: '',
    previewURL: '',
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      // history.listen(location => {
      //   if (history.location.pathname === '/formEngine/templateEditor/previewPrint') {
      //     const query = parse(history.location.search);
      //     const { deployFormId } = query;
      //     dispatch({
      //       type: 'updateStates',
      //       payload: {
      //         deployFormId,
      //       },
      //     });

      //     dispatch({
      //       type: 'previewPrintTemplate',
      //       payload: { id: deployFormId },
      //     });
      //   }
      // });
    },
  },
  effects: {
    // 打印模板预览
    *previewPrintTemplate({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(previewPrintTemplate, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              previewURL: data.data.url,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
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
