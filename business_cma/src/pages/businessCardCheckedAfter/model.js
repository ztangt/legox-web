import { message } from 'antd';
import apis from 'api';

const {
    businessCardChecked,
    BusinessCardCheckedExport,
    getAccountInfoList,
    findLoginUserByIdAndRoleId,
    BusinessCardSummarize,
    cancelVerification,
} = apis;

export default {
    namespace: 'businessCardCheckedAfter',
    state: {
        list: [],
        companyList: [],
        limit: 0,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,

        isInit: false,
        loading: true,
        formInfo: {}, //表单信息
        orgList: [], //管理单位
        backAccountList: [], //银行账户
    },
    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            console.log({ ...payload, quryType: 1 }, '获取已核对列表参数');
            const { data } = yield call(
                businessCardChecked,
                {
                    ...payload,
                    quryType: 1,
                },
                'getList',
                'businessCardCheckedAfter',
            );
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
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 导出
        *onExport({ payload, callback }, { call, put, select }) {
            const { data } = yield call(BusinessCardCheckedExport, payload, 'onExport', 'businessCardCheckedAfter');
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
        // 获取管理单位
        *findLoginUserByIdAndRoleId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                findLoginUserByIdAndRoleId,
                payload,
                'findLoginUserByIdAndRoleId',
                'businessCardCheckedAfter',
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
            const { data } = yield call(getAccountInfoList, payload, 'getBankAccount', 'businessCardCheckedAfter');
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
        // 汇总
        *batchCheck({ payload, callback }, { call, put, select }) {
            const { data } = yield call(BusinessCardSummarize, payload, 'batchCheck', 'businessCardCheckedAfter');
            yield put({
                type: 'updateStates',
                payload: { loading: false },
            });

            if (data.code == 200) {
                callback && callback(data.code);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 取消核对
        *onCancelVeri({ payload, callback }, { call, put, select }) {
            const { data } = yield call(cancelVerification, payload, 'onCancelVeri', 'businessCardCheckedAfter');
            yield put({
                type: 'updateStates',
                payload: { loading: false },
            });
            if (data.code == 200) {
                callback && callback(data.code);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //获取枚举
        *getDictList({ payload, callback }, { call, put, select }) {
            //从sessionStorage中获取字典值
            let dictList = JSON.parse(sessionStorage.getItem('dictsList')) || {};
            let keyList = [
                { key: 'YHZHLX', value: 'companyList' }, //银行账户性质
            ];
            for (let i = 0; i < keyList.length; i++) {
                let keyInfo = keyList[i];
                let dictInfo = dictList[keyInfo.key];
                //如果没有字典值，则请求
                if (!dictInfo) {
                    let params = { showType: 'ALL', isTree: '1', searchWord: '', dictTypeId: keyInfo.key };
                    try {
                        const { data } = yield call(
                            apis.getBaseDataCodeTable,
                            params,
                            'getDictList',
                            'businessCardCheckedAfter',
                        );
                        if (data.code == 200) {
                            dictInfo = { dictInfos: data.data.list || [] };
                        }
                    } catch (e) {}
                }
                let obj = {};
                obj[keyInfo.value] = (dictInfo.dictInfos || []).map((item) => ({
                    ...item,
                    value: item.dictInfoCode,
                    label: item.dictInfoName,
                    id: item.dictInfoCode,
                    name: item.dictInfoName,
                }));
                yield put({
                    type: 'updateStates',
                    payload: { ...obj, isInit: true },
                });
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
