import { message } from 'antd';
import apis from 'api';
import dayjs from 'dayjs';
const { getExtractList, getCashDepositDetail, saveCashDeposit, findLoginUserByIdAndRoleId } = apis;

export default {
    namespace: 'cashDeposit',
    state: {
        limit: 0,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,
        list: [],
        isInit: false,
        loading: true,
        formInfo: {}, //表单信息
        accountTypeList: [], //账户性质
        detailList: [], //详情列表
        businessDate: dayjs().format('YYYY-MM-DD'),
        orgList: [], //管理单位
        accountList: [], //银行账户列表
    },
    effects: {
        //获取管理单位
        *findLoginUserByIdAndRoleId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                findLoginUserByIdAndRoleId,
                payload,
                'findLoginUserByIdAndRoleId',
                'cashDeposit',
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
            const { data } = yield call(apis.getAccountInfo, payload, 'getBankAccount', 'cashDeposit');
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

        //获取列表
        *getList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getExtractList, payload, 'getList', 'cashDeposit');
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
                            list: data.data.list,
                            returnCount: data.data.returnCount * 1,
                            allPages: data.data.allPage * 1,
                            currentPage: data.data.currentPage * 1,
                        },
                    });
                }
            } catch (e) {}
        },
        //获取详情
        *getDetailList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getCashDepositDetail, payload, 'getDetailList', 'cashDeposit');
                if (data.code == 200) {
                    callback && callback(data.data?.list || []);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            detailList: data.data.list,
                        },
                    });
                }
            } catch (e) {}
        },
        //保存
        *saveDepositList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(saveCashDeposit, payload, 'saveDepositList', 'cashDeposit');
                if (data.code == 200) {
                    callback && callback(data.data);
                } else {
                    message.error(data.msg || '请求失败');
                }
            } catch (e) {
                console.log(e);
            }
        },

        //获取枚举
        *getDictList({ payload, callback }, { call, put, select }) {
            //从sessionStorage中获取字典值
            let dictList = JSON.parse(sessionStorage.getItem('dictsList')) || {};
            let keyList = [
                { key: 'YHZHLX', value: 'accountTypeList' }, //账户性质
            ];
            for (let i = 0; i < keyList.length; i++) {
                let keyInfo = keyList[i];
                let dictInfo = dictList[keyInfo.key];
                //如果没有字典值，则请求
                if (!dictInfo) {
                    let params = { showType: 'ALL', isTree: '1', searchWord: '', dictTypeId: keyInfo.key };
                    try {
                        const { data } = yield call(apis.getBaseDataCodeTable, params, 'getDictList', 'cashDeposit');
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
