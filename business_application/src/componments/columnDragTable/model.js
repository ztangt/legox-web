import { message } from 'antd';
import apis from 'api';
import { history } from 'umi';
import _ from 'lodash';


export default {
    namespace: 'columnDragTable',
    state: {
      limit: ''
    },
    subscriptions: {
      setup({ dispatch, history }, { call, select }) {
        history.listen((location) => {
          
        });
      },
    },
    effects: {
        // *updateLimit({payload,callback},{call,put}){
        //     yield put({
        //         type: `${namespace}/updateStates`,
        //         payload: {
        //             limit: payload.limit
        //         }
        //     })
        // }
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