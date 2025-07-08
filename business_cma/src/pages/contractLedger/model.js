import { message } from 'antd';
import apis from 'api';

const {
    more_contract_getContractList,
    more_contract_getContractDetails,
    more_contractLedger_file,
    getFileZip,
    findLoginUserByIdAndRoleId,
} = apis;

export default {
    namespace: 'contractLedger',
    state: {
        start: 1,
        limit: 0,
        list: [],
        returnCount: 0,
        allPage: 0,
        currentPage: 1,
        formData: {}, //表单数据

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

        reList: [], //收支合同列表 NKSZHT_HTTZ
        typeList: [], //合同类型 HTLX
        fundList: [], //经费性质 HTXZ
        fundChaList: [], //经费渠道 HTZJQD
        buyWayList: [], //采购方式 QKYCGFS
        statusList: [], //合同状态 NKHTZT
        payList: [], //缴税状态 JSZT
        isBusList: [
            { value: '1', label: '是' },
            { value: '0', label: '否' },
        ], //是否业务合同
        isBigList: [
            { value: '1', label: '是' },
            { value: '0', label: '否' },
        ], //是否重大合同
        orgList: [], //管理单位

        annexVisible: false, //附件弹窗,
        annexList: [], //附件列表

        allColumns: [], //全部的表格行
        columns: [], //选中的展示的表格行

        isInit: false, //是否初始化
        showAdvSearch: false,

        tabNum: 1, //切换tab

        funCode: '', //功能编码
    },

    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, '---->获取合同台账列表参数');
            try {
                const { data } = yield call(
                    more_contract_getContractList,
                    {
                        ...payload,
                        contractType: 'NK',
                    },
                    'getList',
                    'contractLedger',
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
                    'contractLedger',
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
                const { data } = yield call(more_contractLedger_file, payload, 'getAnnexList', 'contractLedger');
                if (data.code == 200) {
                    let list = data.data.contractFileList || [];

                    let newList = [];
                    list.forEach((item) => {
                        let arr = item.list || [];
                        arr = arr.map((A) => ({ ...A, labelTitle: item.label }));
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
                { key: 'HTLX', value: 'typeList' }, //合同类型
                { key: 'HTXZ', value: 'fundList' }, //经费性质
                { key: 'HTZJQD', value: 'fundChaList' }, //经费渠道
                { key: 'CGJH_CGFS', value: 'buyWayList' }, //采购方式
                { key: 'NKHTZT', value: 'statusList' }, //合同状态
                { key: 'JSZT', value: 'payList' }, //缴税状态
            ];
            for (let i = 0; i < keyList.length; i++) {
                let keyInfo = keyList[i];
                let dictInfo = dictList[keyInfo.key];
                //如果没有字典值，则请求
                if (!dictInfo) {
                    let params = { showType: 'ALL', isTree: '1', searchWord: '', dictTypeId: keyInfo.key };
                    try {
                        const { data } = yield call(apis.getBaseDataCodeTable, params, 'getDictList', 'contractLedger');
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
            //特殊处理默认收支合同列表
            let reInfoList = (dictList['NKSZHT_HTTZ']?.dictInfos || []).map((item) => ({
                ...item,
                value: item.dictInfoCode,
                label: item.dictInfoName,
                key: item.dictInfoCode,
            }));

            // let allInfo = {
            //     value: reInfoList.map((item) => item.value).join(','), //全部
            //     label: '全部',
            // };

            yield put({
                type: 'updateStates',
                payload: {
                    // reList: [allInfo, ...reInfoList],
                    reList: reInfoList,
                    formData: {
                        revenueExpenditureContractType: reInfoList.length ? reInfoList[0].key : '',
                    },
                    // revenueExpenditureContractType:reInfoList.length?reInfoList[0].key:'',
                    isInit: true,
                },
            });
        },
        //getZip,调用接口下载zip
        *getZip({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getFileZip, payload, 'getZip', 'contractLedger');
                if (data.code == 200) {
                    window.open(data.data);
                    message.success('下载成功');
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },

        //获取管理单位
        *getOrgList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(findLoginUserByIdAndRoleId, payload, 'getOrgList', 'contractLedger');
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

        //获取功能分类编码
        *getFunCode({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.more_getLogicCode,
                    { logicCode: 'CMA_CONTRACT_00001' },
                    'getFunCode',
                    'contractLedger',
                );
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            funCode: data.data,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        //获取基础数据表格列表
        *getTableList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getBudgetProjectTree, payload, 'getTableList', 'contractLedger');
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            tableList: data.list,
                        },
                    });
                    let res = data.data;
                    //判断是否是树形结构的数据
                    let resData = {
                        ...res,
                        list: (res.list || []).map((item) => {
                            if (item.isParent == 1) {
                                item['children'] = [];
                            }
                            return item;
                        }),
                    };
                    callback && callback(resData);
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
