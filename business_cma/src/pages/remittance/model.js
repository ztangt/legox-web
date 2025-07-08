import { message } from 'antd';
import apis from 'api';
import dayjs from 'dayjs';

export default {
    namespace: 'remittance',
    state: {
        loading: true,
        list: [],
        payStateList: [
            { value: 0, label: '待办' },
            { value: 1, label: '已办' },
        ], //办理状态
        orgList: [], //管理单位
        accountCodeList: [], //账套
        backAccountList: [], //银行账户

        businessDate: dayjs().format('YYYY-MM-DD'), //业务日期,查询时不传,办理时传
        bankKeyInfo: null, //银行账户信息,查询时不传,办理时传
    },

    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, '获取转账汇款待办列表');
            const { data } = yield call(apis.remittanceList, payload, 'getList', 'remittance');
            yield put({
                type: 'updateStates',
                payload: { loading: false },
            });
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        list: data.data?.list || [],
                    },
                });
                callback && callback(data.data?.list || []);
            } else {
                message.error(data.msg);
            }
        },
        //获取管理单位
        *findLoginUserByIdAndRoleId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.findLoginUserByIdAndRoleId, payload, '', 'remittance');
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
        //获取账套
        *getAccountCodeList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.accountInfoSetByOrg, payload, 'getAccountCodeList', 'remittance');
            if (data.code == 200) {
                let list = data.data?.list || [];
                yield put({
                    type: 'updateStates',
                    payload: {
                        accountCodeList: list.map((item) => ({ ...item, label: item.NAME, value: item.ID })),
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取银行账户
        *getBankAccount({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getAccountInfoList, payload, 'getBankAccount', 'remittance');
            if (data.code == 200) {
                let list = data.data?.list || [];
                yield put({
                    type: 'updateStates',
                    payload: {
                        backAccountList: list.map((item) => ({
                            ...item,
                            label: item.BANK_ACCOUNT,
                            value: item.BANK_ACCOUNT,
                            BANK_ACCOUNT_PRIMARY_KEY: item.BANK_ACCOUNT_PRIMARY_KEY,
                            // //TODO:测试需要
                            // label: item.NAME,
                            // value: item.NAME,
                        })),
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //批量办理
        *generate({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.payState, payload, 'generate', 'remittance');
            yield put({
                type: 'updateStates',
                payload: { loading: false },
            });
            if (data.code == 200) {
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //按照零余额、非零余额导出
        *exportByBankFormat({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.exportAccount, payload, 'exportByBankFormat', 'remittance');
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
        //收回
        *processRecall({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.processRecall, payload, '', 'remittance');
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
        *getModalInfo({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.remittancedetail, payload, 'getModalInfo', 'remittance');
            if (data.code == 200) {
                callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        *getState({ payload, callback }, { call, put, select }) {
            const data = yield select((state) => state.remittance);
            callback && callback(payload && payload.key ? data[payload.key] : data);
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
