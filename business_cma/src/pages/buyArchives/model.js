import apis from 'api';
import { message } from 'antd';
import { formatObj } from '../../util/util';
const { bizRelAtt, getFileZip, more_buy_archives, more_buy_archives_file } = apis;

export default {
    namespace: 'buyArchives',
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
        showAdvSearch: false, //是否显示高级搜索
    },
    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(more_buy_archives, formatObj(payload), 'getList', 'buyArchives');
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
                let { data } = yield call(more_buy_archives_file, payload, 'getAnnexList', 'buyArchives');

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
                        }));
                        if (!arr.length) {
                            arr = [{ ...item, itemId: 1, noFile: true }];
                        }
                        newList = newList.concat(arr);
                    });
                    yield put({
                        type: 'updateStates',
                        payload: { annexList: newList },
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
                let { data } = yield call(bizRelAtt, payload, 'getBizRelAtt', 'buyArchives');
                if (data.code == 200) {
                    callback && callback();
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },

        //getZip,调用接口下载zip
        *getZip({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getFileZip, payload, 'getZip', 'buyArchives');
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
