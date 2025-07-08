import calcFn from '@/util/calc';
import { formatObj } from '@/util/util';
import { message } from 'antd';
import apis from 'api';
import { dateList } from './components/config';

export default {
    namespace: 'pmAttachment',
    state: {
        list: [],
        summaryList: [],
        treeData: [
            {
                nodeId: '1642567753783103490',
                nodeName: '国家气象中心(中央气象台、中国气象局气象导航中心)',
                nodeType: 'ORG',
                title: '国家气象中心(中央气象台、中国气象局气象导航中心)',
                isParent: '1',
                children: [{ key: '-1' }],
                key: '1642567753783103490',
                value: '1642567753783103490',
            },
        ],
        currentNode: {},
        expandedKeys: [],
        currentHeight: 0,
        loading: false,
        currentPage: 1,
        allPage: 0,
        limit: 10,
        returnCount: 0,

        /** 初始化
         * @pageId 用来区分是哪个页面
         * 1、数据录入与下发
         * 2、职能司（分解单位）
         * 3、省
         * 4、市
         * 5、县
         * @listType 传给后端的字段，当params.listType大于3时，listType=3
         */
        pageId: 1,
        listType: 1,

        // 是否显示下载弹窗
        showDownloadModal: false,
        importData: {},
        importType: '',
        /////////////////////////////////////////////////////////////////////
        uploadFlag: true, //上传暂停器
        nowMessage: '', //提示上传进度的信息
        md5: '', //文件的md5值，用来和minio文件进行比较
        fileChunkedList: [], //文件分片完成之后的数组
        fileName: '', //文件名字
        fileNames: '', //文件前半部分名字
        fileStorageId: '', //存储文件信息到数据库接口返回的id
        typeNames: '', //文件后缀名
        optionFile: {}, //文件信息
        fileSize: '', //文件大小，单位是字节
        getFileMD5Message: {}, //md5返回的文件信息
        success: '', //判断上传路径是否存在
        v: 1, //计数器
        needfilepath: '', //需要的minio路径
        isStop: true, //暂停按钮的禁用
        isContinue: false, //继续按钮的禁用
        isCancel: false, //取消按钮的禁用
        index: 0, //fileChunkedList的下标，可用于计算上传进度
        merageFilepath: '', //合并后的文件路径
        typeName: '', //层级
        fileExists: '', //判断文件是否存在于minio服务器中，相关modal中监听判断fileExists状态进行后续分别操作
        md5FileId: '', //md5查询到的文件返回的id
        md5FilePath: '', //md5查询到的文件返回的pathname
        importLoading: false,
        fileData: {},
    },
    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.getPmAttachmentPageList,
                    formatObj(payload),
                    'getList',
                    'pmAttachment',
                );
                yield put({
                    type: 'updateStates',
                    payload: { loading: false },
                });
                if (data.code == 200) {
                    let resList = data.data?.list || [];
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: resList,
                            returnCount: data.data.returnCount * 1,
                            allPage: data.data.allPage * 1,
                            currentPage: data.data.currentPage * 1,
                        },
                    });
                    callback && callback(resList);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        *getSummaryList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.getPmAttachmentSummaryList,
                    formatObj(payload),
                    'getSummaryList',
                    'pmAttachment',
                );
                if (data.code == 200) {
                    let resList = data.data.list || [];
                    callback && callback(resList);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        *getPmAttachmentDownloadUrl({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.getPmAttachmentDownloadUrl,
                    formatObj(payload),
                    'getPmAttachmentDownloadUrl',
                    'pmAttachment',
                );
                if (data.code == 200) {
                    let url = data.data.url;
                    callback && callback(url);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        // 批量下载
        *getPmAttachmentBatchDownloadUrl({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.getPmAttachmentBatchDownloadUrl,
                    formatObj(payload),
                    'getPmAttachmentBatchDownloadUrl',
                    'pmAttachment',
                );
                if (data.code == 200) {
                    let url = data.data.url;
                    callback && callback(url);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        *getChildList({ payload, callback }, { call, put, select }) {
            try {
                console.log(payload, '获取数据录入与下发下级列表参数');
                const { data } = yield call(
                    apis.more_pmAttachment_getChildList,
                    formatObj(payload),
                    'getChildList',
                    'pmAttachment',
                );
                yield put({
                    type: 'updateStates',
                    payload: { loading: false },
                });
                if (data.code == 200) {
                    let arrList = data.data?.list || [];
                    console.log(arrList, 11111);
                    //计算合计
                    let summation = arrList.reduce(
                        (total, item) => calcFn.add(total, item.sumCurrentBudgetControlAmount),
                        0,
                    );
                    console.log(summation, 222222);
                    let resList = arrList.map((item, index) => ({
                        ...item,
                        summation: index + 1 == arrList.length ? summation : null,
                    }));
                    console.log(resList, 33333);
                    callback && callback(resList);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        //导入的两个方法
        *importExcel({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.importExcel, payload, '', 'pmAttachment');
            if (data.code == 200) {
                callback && callback(data.data);
            } else {
                message.error(data.msg);
            }
        },

        *refreshImportExcel({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.refreshImportExcel, payload, 'refreshImportExcel', 'pmAttachment');
            if (data.code == 200) {
                callback && callback(true, data);
            } else {
                callback && callback(false, data);
            }
        },

        *getState({ payload, callback }, { call, put, select }) {
            const data = yield select((state) => state.pmAttachment);
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
