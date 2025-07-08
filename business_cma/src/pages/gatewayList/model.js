import { REQUEST_SUCCESS } from '@/service/constant';
import { message } from 'antd';
import apis from 'api';

export default {
    namespace: 'gatewayList',
    state: {
        list: [],
        isInit: false, //是否初始化
        curTitle: '', //页面标题
        apiType: '', //接口类型
        postParams: {}, //需要传递给接口的参数
        linkTo: '', //跳转页面
        loading: false,
    },
    effects: {
        *getSendList({ payload, callback }, { call, put, select }) {
            try {
                let postData = {
                    ...payload,
                    searchWord: '',
                    paramsJson: '[]',
                    workRuleId: '',
                    start: 1,
                    limit: 10,
                };
                console.log('send传递的参数', postData);
                const { data } = yield call(apis.more_gatewayList_getSendList, postData, '', 'gatewayList');
                yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                    },
                });

                if (data.code == REQUEST_SUCCESS) {
                    const list = data.data.list;
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: list,
                        },
                    });
                } else {
                    message.error(data.msg || '获取数据失败');
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },

        *getTodoList({ payload, callback }, { call, put, select }) {
            try {
                let postData = {
                    ...payload,
                    searchWord: '',
                    paramsJson: '[]',
                    workRuleId: '',
                    start: 1,
                    limit: 10,
                };
                console.log('todo传递的参数', postData);
                const { data } = yield call(apis.more_gatewayList_getTodoList, postData, '', 'gatewayList');
                yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                    },
                });

                if (data.code == REQUEST_SUCCESS) {
                    const list = data.data.list;
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: list,
                        },
                    });
                } else {
                    message.error(data.msg || '获取数据失败');
                }
            } catch (e) {
                console.log(e);
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
