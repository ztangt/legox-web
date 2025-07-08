import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'
import _ from "lodash";
import { parse } from 'query-string';
import { history } from 'umi'
const { testFn } = apis;
export default {
    namespace: 'iconConfig',
    state: {
    },
    subscriptions: {
        // setup({ dispatch, history }, { call, select }) {
        //     history.listen(location => {
        //         if (history.location.pathname === '/iconConfig') {
        //             const query = parse(history.location.search);
        //             const { currentNodeId, currentPage, searchWord, isInit, limit } = query
        //             dispatch({
        //                 type: 'updateStates',
        //                 payload: {

        //                 }
        //             })
        //         }
        //     });
        // }
    },
    effects: {
        *testFn({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(testFn, payload);
                if (data.code == REQUEST_SUCCESS) {
                } else {
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
                ...action.payload
            }
        }
    },
};
