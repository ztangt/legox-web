import { message } from 'antd';
import apis from 'api';

const {
    more_contract_getContractList,
    getBaseDataCodeTable,
    more_contract_getContractDetails,
    more_contractArchives_file,
    getFileZip,
    more_contract_camsContractNum,
} = apis;

export default {
    namespace: 'contractStamped',
    state: {
        start: 1,
        limit: 0,
        list: [],
        returnCount: 0,
        allPage: 0,
        currentPage: 1,
        formData: {}, //表单数据

        contractStatusList: [], //合同状态
        checkList: [], //验收状态
        typeList: [], //合同类型
        buyWayList: [], //购买方式
        payTypeList: [], //支出类型
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

        annexVisible: false, //附件弹窗,
        annexList: [], //附件列表

        allColumns: [], //全部的表格行
        columns: [], //选中的展示的表格行

        numberInfo: {}, //不同状态的合同数目
        showAdvSearch: false,
        isInit: false,
    },
    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    more_contract_getContractList,
                    {
                        ...payload,
                        contractType: 'CAMS',
                        contractStampStatusTldt: 1,
                        sortName: 'CONTRACT_STAMP_TIME',
                        sortOrder: 'desc',
                    },
                    'getList',
                    'contractStamped',
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
                    'contractStamped',
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
        //获取附件列表
        *getAnnexList({ payload, callback }, { call, put, select }) {
            try {
                let { data } = yield call(more_contractArchives_file, payload, 'getAnnexList', 'contractStamped');

                if (data.code == 200) {
                    let list = data.data.list || [];
                    let newList = [];
                    list.forEach((item, index) => {
                        let fjName = item.fjName || [];
                        let aArr = [];
                        fjName.forEach((fjItem) => {
                            //保存二级的label
                            let fjList = (fjItem.list || []).map((A) => ({
                                ...A,
                                labelTitle: fjItem.label,
                            }));
                            aArr = [...aArr, ...fjList];
                        });

                        let arr = (aArr || []).map((arrItem, arrIndex) => ({
                            ...arrItem,
                            id: arrItem.id + '-' + arrIndex + '-' + index,
                            itemId: arrIndex + 1,
                            annexId: index + 1,

                            bizTitle: item.bizTitle,
                            sourceMenuName: item.sourceMenuName,
                            bizSolId: item.bizSolId,
                            contractName: item.contractName,
                        }));
                        if (!arr.length) {
                            arr = [
                                {
                                    ...item,
                                    itemId: 1,
                                    noFile: true,
                                },
                            ];
                        }
                        newList = newList.concat(arr);
                    });

                    yield put({
                        type: 'updateStates',
                        payload: {
                            annexList: newList,
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
                { key: 'QKYYSZT', value: 'checkList' }, //验收状态
                { key: 'QKYHTLX', value: 'typeList' }, //合同类型
                { key: 'QKYCGFS', value: 'buyWayList' }, //采购方式
                { key: 'QKYZCLX', value: 'payTypeList' }, //支出类型
                { key: 'QKYHTSPZT', value: 'nodeList' }, //合同审批节点
                { key: 'HTZT', value: 'contractStatusList' }, //合同状态
                { key: 'QKYYSZT', value: 'checkList' }, //验收状态
            ];
            for (let i = 0; i < keyList.length; i++) {
                let keyInfo = keyList[i];
                let dictInfo = dictList[keyInfo.key];
                //如果没有字典值，则请求
                if (!dictInfo) {
                    // console.log(keyInfo.value, 111111);
                    let params = { showType: 'ALL', isTree: '1', searchWord: '', dictTypeId: keyInfo.key };
                    try {
                        const { data } = yield call(getBaseDataCodeTable, params, 'getDictList', 'contractStamped');
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

        //getZip,调用接口下载zip
        *getZip({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getFileZip, payload, 'getZip', 'contractStamped');
                if (data.code == 200) {
                    window.open(data.data);
                    message.success('下载成功');
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },

        //查询不同状态的合同数目
        *getCamsContractNum({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    more_contract_camsContractNum,
                    payload,
                    'getCamsContractNum',
                    'contractStamped',
                );
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            numberInfo: data.data || {},
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
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
