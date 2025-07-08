import { message } from 'antd';
import apis from 'api';
const {
    getPersonCardDetail,
    findLoginUserByIdAndRoleId,
    getAccountInfo,
    personCardCollect,
    exportByBankFormat,
    personExportDetail,
} = apis;

export default {
    namespace: 'personCardDetail',
    state: {
        companyList: [],
        orgList: [], //管理单位
        backAccountList: [], //银行账户
        limit: 0,
        list: [],
        isInit: false, //是否初始化
        loading: true, //是否加载中
    },
    effects: {
        //获取管理单位
        *findLoginUserByIdAndRoleId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                findLoginUserByIdAndRoleId,
                payload,
                'findLoginUserByIdAndRoleId',
                'personCardDetail',
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
            const { data } = yield call(getAccountInfo, payload, 'getBankAccount', 'personCardDetail');
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

        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, '获取个人储蓄卡还款明细列表');
            const { data } = yield call(getPersonCardDetail, payload, 'getList', 'personCardDetail');
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
                callback && callback(data.data.list || []);
            }
        },
        // 汇总
        *personCardCollect({ payload, callback }, { call, put, select }) {
            const { data } = yield call(personCardCollect, payload, 'personCardCollect', 'personCardDetail');
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

        // 按照零余额、非零余额导出
        *exportByBankFormat({ payload, callback }, { call, put, select }) {
            const { data } = yield call(exportByBankFormat, payload, '', 'personCardDetail');
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
            const { data } = yield call(personExportDetail, payload, 'exportAll', 'personCardDetail');
            yield put({
                type: 'updateStates',
                payload: { loading: false },
            });
            if (data.code == 200) {
                message.success('导出成功!');
                window.open(data.data);
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
                            'personCardDetail',
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
