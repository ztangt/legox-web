import apis from 'api';
import { message } from 'antd';

export default {
    namespace: 'namespaceImplement',
    state: {
        treeData: [],
        currentNode: {},
        expandedKeys: [],
    },
    effects: {
        *getTest({ payload, callback }, { call, put, select }) {
            const { data } = yield call();
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
