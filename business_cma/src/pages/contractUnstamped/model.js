import { message } from 'antd';
import apis from 'api';

const { more_contract_getContractList, getBaseDataCodeTable, more_contract_getContractDetails } = apis;

export default {
    namespace: 'contractUnstamped',
    state: {
        start: 1,
        limit: 0,
        list: [],
        returnCount: 0,
        allPage: 0,
        currentPage: 1,
        formData: {}, //表单数据

        checkList: [], //审核状态
        typeList: [], //合同类型
        buyWayList: [], //购买方式
        payTypeList: [], //支出类型
        statusList: [], //合同状态
        nodeList: [], //合同审批节点

        selectVisible: false, //选择弹窗
        orgUserType: '', //选择弹窗类型
        formType: '',
        selectedDataIds: [], //选择弹窗选中的数据ID数组
        selectedDatas: [], //选择弹窗选中的数据数组

        ids: [], //选中的表格数据
        selectListInfo: [], //选中的表格数据
        detailVisible: false, //详情弹窗
        detailId: '', //详情ID
        detailList: [], //详情数据

        allColumns: [], //全部的表格行
        columns: [], //选中的展示的表格行
        isInit: false,
        showAdvSearch: false,
    },
    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    more_contract_getContractList,
                    {
                        ...payload,
                        contractType: 'CAMS',
                        contractStampStatusTldt: 0,
                    },
                    'getList',
                    'contractUnstamped',
                );

                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: data.data.list || [],
                            allPage: data.data.allPage * 1,
                            currentPage: data.data.currentPage * 1,
                            returnCount: data.data.returnCount * 1,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        //获取详情列表
        *getDetailList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    more_contract_getContractDetails,
                    payload,
                    'getDetailList',
                    'contractUnstamped',
                );
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            detailList: data.data.list || [],
                        },
                    });
                    callback && callback();
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        //获取枚举
        *getDictList({ payload, callback }, { call, put, select }) {
            //从sessionStorage中获取字典值
            let dictList = JSON.parse(sessionStorage.getItem('dictsList')) || {};
            let keyList = [
                { key: 'SHZT', value: 'checkList' }, //审核状态
                { key: 'QKYHTLX', value: 'typeList' }, //合同类型
                { key: 'QKYCGFS', value: 'buyWayList' }, //采购方式
                { key: 'QKYZCLX', value: 'payTypeList' }, //支出类型
                { key: 'QKYHTSPZT', value: 'nodeList' }, //合同审批节点

                // { key: 'HTZT', value: 'contractStatusList' }, //合同状态
                // { key: 'QKYYSZT', value: 'checkList' }, //验收状态
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
                            'contractUnstamped',
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
                }));
                yield put({
                    type: 'updateStates',
                    payload: { ...obj },
                });
            }
            yield put({
                type: 'updateStates',
                payload: { isInit: true },
            });
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
