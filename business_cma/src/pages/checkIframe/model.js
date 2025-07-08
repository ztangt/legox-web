import apis from 'api';
const { checkIframe, checkGenerate, checkNumberList } = apis;
import 'dayjs/locale/zh-cn';
import { message } from 'antd';

export default {
    namespace: 'checkIframe',
    state: {
        limit: 10,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,
        checkData: {},
        list: [],
    },
    effects: {
        //领用列表查询
        *checkIframe({ payload, callback }, { call, put, select }) {
            // debugger
            const { data } = yield call(checkIframe, payload, '', 'checkIframe');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        checkData: data.data,
                    },
                });
            }
        },
        //支票出纳办理
        *checkGenerate({ payload, callback }, { call, put, select }) {
            // debugger
            const { data } = yield call(checkGenerate, payload, '', 'checkIframe');
            callback && callback(data);
        },
        //获取支票号
        *getCheckNumber({ payload, callback }, { call, put, select }) {
            const { data } = yield call(checkNumberList, payload, 'getCheckNumber', 'checkIframe');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        list: data.data.list,
                        returnCount: data.data.returnCount,
                        allPage: data.data.allPage,
                        currentPage: data.data.currentPage,
                    },
                });
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
