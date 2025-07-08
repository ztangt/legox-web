import { message } from 'antd';
import apis from 'api';
import dayjs from 'dayjs';

export default {
    namespace: 'collectionSettlement',
    state: {
        loading: true,
        list: [],
        orgList: [], //管理单位
        accountCodeList: [], //账套
        backAccountList: [], //银行账户
        payStateList: [
            { label: '未办理', value: 0 },
            { label: '已办理', value: 1 },
            { label: '办理中', value: 2 },
        ],

        businessDate: dayjs().format('YYYY-MM-DD'), //业务日期,查询的时候不传,办理的时候传
        bankKeyInfo: null, //银行账户信息,查询的时候不传,办理的时候传
    },
    effects: {
        //获取管理单位
        *findLoginUserByIdAndRoleId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.findLoginUserByIdAndRoleId,
                payload,
                'findLoginUserByIdAndRoleId',
                'collectionSettlement',
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
        //获取账套
        *getAccountCodeList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.accountInfoSetByOrg,
                payload,
                'getAccountCodeList',
                'collectionSettlement',
            );
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

        // 银行账户
        *getBankAccount({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getAccountInfoList, payload, 'getBankAccount', 'collectionSettlement');
            if (data.code == 200) {
                let list = data.data?.list || [];
                yield put({
                    type: 'updateStates',
                    payload: {
                        backAccountList: list.map((item) => ({
                            ...item,
                            BANK_ACCOUNT_PRIMARY_KEY: item.BANK_ACCOUNT_PRIMARY_KEY,
                            label: item.BANK_ACCOUNT,
                            value: item.BANK_ACCOUNT,
                            //TODO  测试用一会去掉
                            // label: item.NAME,
                            // value: item.NAME,
                        })),
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, '---->收款结算获取列表接口');
            try {
                const { data } = yield call(apis.getreceivelist, payload, 'getList', 'collectionSettlement');
                yield put({
                    type: 'updateStates',
                    payload: { loading: false },
                });
                let list = data.data?.list || [];
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: list,
                        },
                    });
                    callback && callback(list);
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg);
                }
            } catch (e) {}
        },

        // 办理
        *generateAction({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.generate, payload, 'generateAction', 'collectionSettlement');
                if (data.code == 200) {
                    callback && callback();
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg);
                }
            } catch (e) {}
        },

        //收回
        *processRecall({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.processRecall, payload, '', 'collectionSettlement');
            if (data.code == 200) {
                callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        *getState({ payload, callback }, { call, put, select }) {
            const data = yield select((state) => state.collectionSettlement);
            return callback(payload && payload.key ? data[payload.key] : data);
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
