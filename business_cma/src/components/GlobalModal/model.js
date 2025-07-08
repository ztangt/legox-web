import apis from 'api';
import { message } from 'antd';

export default {
    namespace: 'modalTable',
    state: {
        scrollY: 0,
    },
    effects: {},
    reducers: {
        updateStates(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
};
