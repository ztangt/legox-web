import { message } from 'antd';
import apis from 'api';

const { getBusinessCardList, businessDetailedExcel, getAccountInfo, findLoginUserByIdAndRoleId } = apis;

export default {
    namespace: 'businessCard',
    state: {
        orgList: [], //管理单位
        backAccountList: [], //银行账户
        list: [],
        loading: false,
        // 分页
        limit: 0,
        returnCount: 0,
        currentPage: 0,
        allPages: 0,
    },
    effects: {
        //获取管理单位
        *findLoginUserByIdAndRoleId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                findLoginUserByIdAndRoleId,
                payload,
                'findLoginUserByIdAndRoleId',
                'businessCard',
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
            const { data } = yield call(getAccountInfo, payload, 'getBankAccount', 'businessCard');
            if (data.code == 200) {
                let list = data.data?.list || [];
                yield put({
                    type: 'updateStates',
                    payload: {
                        backAccountList: list.map((item) => ({
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

        //查询
        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, '---->公务卡支付明细获取列表接口');
            const { data } = yield call(getBusinessCardList, payload, 'getList', 'businessCard');
            yield put({ type: 'updateStates', payload: { loading: false } });
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
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 导出
        *onExport({ payload, callback }, { call, put, select }) {
            const { data } = yield call(businessDetailedExcel, payload, 'onExport', 'businessCard');
            yield put({ type: 'updateStates', payload: { loading: false } });
            if (data.code == 200) {
                callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        *getState({ payload, callback }, { call, put, select }) {
            const data = yield select((state) => state.businessCard);
            callback && callback(payload && payload.type ? data[payload.type] : data);
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
