import { message } from 'antd';
import apis from 'api';
import dayjs from 'dayjs';

export default {
    namespace: 'personCardCollect',
    state: {
        limit: 0,
        list: [],
        companyList: [], //银行账户性质
        reNumList: [], //还款单号列表
        isInit: false, //是否初始化
        loading: true, //加载中
        orgList: [], //管理单位
        accountList: [], //银行账户
        payStateList: [
            { value: 0, label: '待办' },
            { value: 1, label: '已办' },
            { value: 2, label: '办理中' },
        ], //办理状态
        fundSourceList: [], //资金来源

        businessDate: dayjs().format('YYYY-MM-DD'), //业务日期
        bankKeyInfo: null, //银行账户信息
    },
    effects: {
        // 获取管理单位
        *findLoginUserByIdAndRoleId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.findLoginUserByIdAndRoleId,
                payload,
                'findLoginUserByIdAndRoleId',
                'personCardCollect',
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
        // 银行账户
        *getAccountInfoList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getAccountInfo, payload, 'getAccountInfoList', 'personCardCollect');
            if (data.code == 200) {
                let list = data.data?.list || [];
                yield put({
                    type: 'updateStates',
                    payload: {
                        accountList: list.map((item) => ({
                            ...item,
                            label: item.BANK_ACCOUNT,
                            value: item.BANK_ACCOUNT,
                            BANK_ACCOUNT_PRIMARY_KEY: item.BANK_ACCOUNT_PRIMARY_KEY,
                        })),
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, '获取个人储蓄卡汇总列表参数');
            const { data } = yield call(apis.getPersonCardCollect, payload, 'getList', 'personCardCollect');
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
        },
        //获取还款单号列表
        *getSummaryNumberList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.getSummaryNumberList,
                    { businessCardType: 2, ...payload },
                    'getSummaryNumberList',
                    'personCardCollect',
                );
                if (data.code == 200) {
                    let list = data.data?.list || [];
                    yield put({
                        type: 'updateStates',
                        payload: {
                            reNumList: list.map((item) => ({
                                label: item,
                                value: item,
                            })),
                        },
                    });
                }
            } catch (e) {}
        },

        //取消汇总
        *undoSummary({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.personCardCollect, payload, 'undoSummary', 'personCardCollect');
            yield put({
                type: 'updateStates',
                payload: { loading: false },
            });
            if (data.code == 200) {
                callback && callback(data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //出纳办理
        *generate({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.generate, payload, '', 'personCardCollect');
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

        //余额非余额导出
        *exportByBankFormat({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.exportPersonBank, payload, 'exportByBankFormat', 'personCardCollect');
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

        //按照查询条件导出
        *exportAll({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.personExportCollect, payload, 'exportAll', 'personCardCollect');
            yield put({
                type: 'updateStates',
                payload: { loading: false },
            });
            if (data.code == 200) {
                message.success('导出成功');
                window.open(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //收回
        *processRecall({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.processRecall, payload, '', 'personCardCollect');
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
                            'personCardCollect',
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
        //获取资金来源
        *getFundSourceList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getFundSourceList, payload, 'getFundSourceList', 'personCardCollect');
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
            const data = yield select((state) => state.personCardCollect);
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
