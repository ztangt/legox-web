import { message } from 'antd';
import apis from 'api';

const { putCheckWithdraw, putexChange, getfindCheckExchangeList, checkNumberList } = apis;

export default {
    namespace: 'paymentMethod',
    state: {
        limit: 0,
        returnCount: 0,
        currentPage: 0,
        allPages: 0,
        currentHeight: 0,
        loading: true,
        formInfo: {}, //表单信息

        //选择支票的列表信息
        payLimit: 8,
        payReturnCount: 0,
        payCurrentPage: 0,
        payAllPage: 0,
        payList: [],
        payLoading: false,

        orgList: [], //管理单位列表
        accountList: [], //银行账户列表
    },
    effects: {
        // 获取新支票号
        *getNewCheckNumberList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(checkNumberList, payload, 'getNewCheckNumberList', 'paymentMethod');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        payList: data.data.list,
                        payCurrentPage: data.data.currentPage * 1,
                        payAllPage: data.data.allPage * 1,
                        payReturnCount: data.data.returnCount * 1,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        *getList({ payload, callback }, { call, put, select }) {
            try {
                console.log(payload, '---->支票退换业务获取列表接口');
                const { data } = yield call(getfindCheckExchangeList, payload, 'getList', 'paymentMethod');
                yield put({
                    type: 'updateStates',
                    payload: { loading: false },
                });

                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: data.data?.list || [],
                            returnCount: data.data.returnCount * 1,
                            allPage: data.data.allPage * 1,
                            currentPage: data.data.currentPage * 1,
                        },
                    });
                    callback && callback(data.data?.list || []);
                }
            } catch (e) {}
        },
        *putCheckWithdraw({ payload, callback }, { call, put, select }) {
            const { data } = yield call(putCheckWithdraw, payload, 'putCheckWithdraw', 'paymentMethod');
            yield put({
                type: 'updateStates',
                payload: { loading: false },
            });
            if (data.code == 200) {
                callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        *putexChange({ payload, callback }, { call, put, select }) {
            const { data } = yield call(putexChange, payload, 'putexChange', 'paymentMethod');
            yield put({
                type: 'updateStates',
                payload: { payLoading: false },
            });
            if (data.code == 200) {
                callback && callback(data.code);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        *getState({ payload, callback }, { call, put, select }) {
            const data = yield select((state) => state.paymentMethod);
            callback && callback(payload && payload.key ? data[payload.key] : data);
        },

        //获取管理单位
        *findLoginUserByIdAndRoleId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.findLoginUserByIdAndRoleId,
                payload,
                'findLoginUserByIdAndRoleId',
                'paymentMethod',
            );
            if (data.code == 200) {
                let list = data.data?.list || [];
                yield put({
                    type: 'updateStates',
                    payload: {
                        orgList: list.map((item) => ({ ...item, value: item.orgId, label: item.orgName })),
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取银行账户
        *getBankAccount({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getAccountInfo, payload, 'getBankAccount', 'paymentMethod');
            if (data.code == 200) {
                let list = data.data?.list || [];
                yield put({
                    type: 'updateStates',
                    payload: {
                        accountList: list.map((item) => ({
                            ...item,
                            label: item.BANK_ACCOUNT,
                            value: item.BANK_ACCOUNT,
                        })),
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
