import { message } from 'antd';
import apis from 'api';
import dayjs from 'dayjs';
const {
    getExtractList,
    getExtractDetail,
    saveExtract,
    updateExtract,
    getCashExtractCheckList,
    findLoginUserByIdAndRoleId,
} = apis;
export default {
    namespace: 'cashExtract',
    state: {
        extractDetailList: [],
        checkStart: 1,
        checkLimit: 10,
        checkAllPage: 0,
        checkReturnCount: 0,
        extractCheckList: [],
        accountType: '',
        searchWord: '',

        accountTypeList: [], //账户性质
        isInit: false,
        limit: 0,
        allPages: 0,
        returnCount: 0,
        currentPage: 1,
        currentHeight: 0,
        list: [],
        loading: true,
        formInfo: {}, //表单信息
        businessDate: dayjs().format('YYYY-MM-DD'),

        orgList: [], //管理单位列表
        accountList: [], //银行账户列表
    },

    effects: {
        //获取管理单位
        *findLoginUserByIdAndRoleId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                findLoginUserByIdAndRoleId,
                payload,
                'findLoginUserByIdAndRoleId',
                'cashExtract',
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
            const { data } = yield call(apis.getAccountInfo, payload, 'getBankAccount', 'cashExtract');
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
            console.log(payload, '----->获取现金提取登记的列表参数');
            try {
                const { data } = yield call(getExtractList, payload, 'getList', 'cashExtract');
                yield put({
                    type: 'updateStates',
                    payload: { loading: false },
                });
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: data.data.list,
                            returnCount: data.data.returnCount * 1,
                            allPage: data.data.allPage * 1,
                            currentPage: data.data.currentPage * 1,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        //获取详情
        *getExtractDetail({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getExtractDetail, payload, '', 'cashExtract');
                if (data.code == 200) {
                    callback && callback(data.data?.list || []);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            extractDetailList: data.data.list,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        //保存
        *saveExtractList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(saveExtract, payload, 'saveExtractList', 'cashExtract');
                if (data.code == 200) {
                    callback && callback(data.data);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            }
        },
        //修改
        *updateExtractList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(updateExtract, payload, 'updateExtractList', 'cashExtract');
                if (data.code == 200) {
                    callback && callback(data.data);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            }
        },
        //支票信息列表查询
        *getCashExtractCheckList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getCashExtractCheckList, payload, '', 'cashExtract');
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            extractCheckList: data.data.list,
                            checkStart: data.data.currentPage * 1,
                            checkAllPage: data.data.allPage * 1,
                            checkReturnCount: data.data.returnCount * 1,
                        },
                    });
                }
            } catch (e) {}
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
                        const { data } = yield call(apis.getBaseDataCodeTable, params, 'getDictList', 'cashExtract');
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
