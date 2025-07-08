import { message } from 'antd';
import apis from 'api';

const { more_contract_getContractList, getBaseDataCodeTable, more_contractArchives_file, bizRelAtt, getFileZip } = apis;

export default {
    namespace: 'contractArchives',
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

        reList: [], //收支合同类型NKSZHT_HTDA
        typeList: [], //合同类型,QKYHTLX
        fundList: [], //合同性质HTXZ
        fundChaList: [], //经费渠道 HTZJQD
        buyWayList: [], //采购方式 QKYCGFS
        statusList: [], //合同状态 NKHTZT
        payList: [], //缴税状态 JSZT

        annexVisible: false, //附件弹窗,
        annexList: [], //附件列表,
        contractId: '', //合同ID,用作附件更新查询
        //上传用的,少一个都不行
        uploadFlag: true,
        nowMessage: '',
        md5: '',
        fileChunkedList: [],
        fileName: '',
        fileNames: '',
        fileStorageId: '',
        typeNames: '',
        optionFile: {},
        fileSize: '',
        getFileMD5Message: {},
        success: '',
        v: 1,
        needfilepath: '',
        fileFullPath: '',
        isStop: true,
        isContinue: false,
        isCancel: false,
        index: 0,
        merageFilepath: '',
        typeName: '',
        fileExists: '',
        fileExistsFu: '', // 是否有富文本内容
        md5FilePath: '',
        md5FileId: '',
        fileData: [],

        allColumns: [], //全部的表格行
        columns: [], //选中的展示的表格行

        isInit: false, //是否初始化
        showAdvSearch: false,
        isBusList: [
            { value: '1', label: '是' },
            { value: '0', label: '否' },
        ], //是否业务合同
    },

    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, 'payload');
            const { reList } = yield select((state) => state['contractArchives']);
            try {
                const { data } = yield call(
                    more_contract_getContractList,
                    {
                        ...payload,
                        contractType: 'NK',
                        bizStatus: 'endEvent',
                        revenueExpenditureContractType: payload.revenueExpenditureContractType
                            ? payload.revenueExpenditureContractType
                            : reList[0].value, //收支合同类型
                    },
                    'getList',
                    'contractArchives',
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
        //获取附件列表
        *getAnnexList({ payload, callback }, { call, put, select }) {
            try {
                let { data } = yield call(more_contractArchives_file, payload, 'getAnnexList', 'contractArchives');

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
        //上传的附件关联合同
        *getBizRelAtt({ payload, callback }, { call, put, select }) {
            try {
                let { data } = yield call(bizRelAtt, payload, 'getBizRelAtt', 'contractArchives');
                if (data.code == 200) {
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
                // { key: 'HTLX', value: 'typeList' }, //合同类型
                // { key: 'HTXZ', value: 'fundList' }, //合同性质

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
                        const { data } = yield call(getBaseDataCodeTable, params, 'getDictList', 'contractArchives');
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
            }));

            let allInfo = {
                value: reInfoList.map((item) => item.value).join(','), //全部
                label: '全部',
            };

            yield put({
                type: 'updateStates',
                payload: {
                    reList: [allInfo, ...reInfoList],
                    isInit: true,
                },
            });
        },

        //getZip,调用接口下载zip
        *getZip({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getFileZip, payload, 'getZip', 'contractArchives');
                if (data.code == 200) {
                    window.open(data.data);
                    message.success('下载成功');
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
