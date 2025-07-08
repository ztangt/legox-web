import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
    namespace: 'freezeOrExec',
    state: {
        returnCount: 0,
        allPage: 1,
        currentPage: 1,
        start: 1,
        limit: 0,
        formList: [],
        resList: [],
        currentHeight: 0,
    },
    effects: {
        *getFreezeFormList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getFreezeFormList, payload, '', 'freezeOrExec');
                if (data.code == REQUEST_SUCCESS) {
                    const list = data.data.list;
                    for (let i = 0; i < list.length; i++) {
                        list[i]['key'] = list[i].id;
                    }
                    yield put({
                        type: 'updateStates',
                        payload: {
                            formList: list,
                            returnCount: data.data.returnCount * 1,
                            allPage: data.data.allPage * 1,
                            currentPage: data.data.currentPage * 1,
                        },
                    });
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        *findNormExecuteInfoByBeforeId({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.findNormExecuteInfoByBeforeId, payload, '', 'freezeOrExec');
                // TODO  ==
                if (data.code == REQUEST_SUCCESS) {
                    const list = data.data.list;
                    for (let i = 0; i < list.length; i++) {
                        list[i]['key'] = list[i].id;
                    }
                    // yield put({
                    //   type: 'updateStates',
                    //   payload: {
                    //     resList: list,
                    //   },
                    // });
                    callback && callback(list);
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        *rollbackNormFreezeMoney({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.rollbackNormFreezeMoney, payload, '', 'freezeOrExec');
                if (data.code == REQUEST_SUCCESS) {
                    message.success(data.msg);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        *getExecuteFormList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getExecuteFormList, payload, '', 'freezeOrExec');
                if (data.code == REQUEST_SUCCESS) {
                    const list = data.data.list;
                    for (let i = 0; i < list.length; i++) {
                        list[i]['key'] = list[i].id;
                    }
                    yield put({
                        type: 'updateStates',
                        payload: {
                            formList: list,
                            returnCount: data.data.returnCount,
                            allPage: data.data.allPage,
                            currentPage: data.data.currentPage,
                        },
                    });
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        *findNormFreeBySourceIdList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.findNormFreeBySourceIdList, payload, '', 'freezeOrExec');
                if (data.code == REQUEST_SUCCESS) {
                    const list = data.data.list;
                    for (let i = 0; i < list.length; i++) {
                        list[i]['key'] = list[i].id;
                    }
                    // yield put({
                    //   type: 'updateStates',
                    //   payload: {
                    //     resList: list,
                    //   },
                    // });
                    callback && callback(list);
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        *rollbackNormExecuteMoney({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.rollbackNormExecuteMoney, payload, '', 'freezeOrExec');
                if (data.code == REQUEST_SUCCESS) {
                    message.success(data.msg);
                } else {
                    message.error(data.msg);
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
