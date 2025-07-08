import { message } from 'antd';
import apis from 'api';
import dayjs from 'dayjs';
export default {
    namespace: 'businessCardSummary',
    state: {
        companyList: [], //账户类型
        reNumList: [], //还款单号列表
        orgList: [], //管理单位
        backAccountList: [], //银行账户
        loading: true,
        isInit: false, //是否初始化
        list: [],
        payStateList: [
            { value: 0, label: '待办' },
            { value: 1, label: '已办' },
            { value: 2, label: '办理中' },
        ], //办理状态
        fundSourceList: [], //资金来源列表

        businessDate: dayjs().format('YYYY-MM-DD'), //业务日期,
        bankKeyInfo: null, //银行账户信息
    },
    effects: {
        //查询
        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, '获取公务卡还款汇总列表参数');
            const { data } = yield call(apis.BusinessCardSummary, payload, 'getList', 'businessCardSummary');
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
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
        //获取还款单号列表
        *getSummaryNumberList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.getSummaryNumberList,
                { businessCardType: 1, ...payload },
                'getSummaryNumberList',
                'businessCardSummary',
            );
            if (data.code == 200) {
                let list = (data.data.list || []).map((item) => ({ id: item, name: item, value: item }));
                yield put({
                    type: 'updateStates',
                    payload: {
                        reNumList: list,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 管理单位列表
        *findLoginUserByIdAndRoleId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.findLoginUserByIdAndRoleId,
                payload,
                'findLoginUserByIdAndRoleId',
                'businessCardSummary',
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
            const { data } = yield call(apis.getAccountInfoList, payload, 'getBankAccount', 'businessCardSummary');
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

        // 导出
        *onExport({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.summaryExcel, payload, 'onExport', 'businessCardSummary');
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
            });
            if (data.code == 200) {
                callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        // 取消汇总
        *batchCheck({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.BusinessCardSummarize, payload, 'batchCheck', 'businessCardSummary');
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
            });
            if (data.code == 200) {
                callback && callback(data.code);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 出纳办理
        *generate({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.generate, payload, 'generate', 'businessCardSummary');
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
            });
            if (data.code == 200) {
                callback && callback(data.code);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //收回
        *processRecall({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.processRecall, payload, '', 'businessCardSummary');
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
            });
            if (data.code == 200) {
                callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //获取枚举
        *getDictList({ payload, callback }, { call, put, select }) {
            //从sessionStorage中获取字典值
            let dictList = JSON.parse(sessionStorage.getItem('dictsList')) || {};
            let keyList = [
                { key: 'YHZHLX', value: 'companyList' }, //账户性质
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
                            'businessCardSummary',
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
                    payload: { ...obj, isInit: true }, //isInit:true 代表已经初始化完成
                });
            }
        },

        //获取资金来源
        *getFundSourceList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getFundSourceList, payload, 'getFundSourceList', 'businessCardSummary');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        fundSourceList: data.data?.list || [],
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        *getState({ payload, callback }, { call, put, select }) {
            const data = yield select((state) => state.businessCardSummary);
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
