import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
    namespace: 'targetWarning',
    state: {
        currentHeight: 0,
        editCount: 0,
        returnCount: 0,
        allPage: 1,
        currentPage: 1,
        limit: 10,
        normList: [],
        selectedRow: {},
        isShowEditModal: false,
    },
    effects: {
        *getWarningList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getWarningList, payload, '', 'targetWarning');
                // TODO  ==
                if (data.code == REQUEST_SUCCESS) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            normList: data.data.list,
                        },
                    });
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        *saveWarning({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.saveWarning, payload, '', 'targetWarning');
                // TODO  ==
                if (data.code == REQUEST_SUCCESS) {
                    if (payload.WHETHER_WARNING_TLDT_ === undefined) {
                        message.success('修改成功');
                    } else if (payload.WHETHER_WARNING_TLDT_ == 1) {
                        message.success('保存成功');
                    } else if (payload.WHETHER_WARNING_TLDT_ == 0) {
                        message.success('删除成功');
                    } else {
                        //
                    }
                    callback && callback();
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
