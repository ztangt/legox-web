import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../util/constant';

export default {
    namespace: 'checkFindByCashier',
    state: {
        limit: 10,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,
        grantModal: false,
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
