import { message } from 'antd';
import apis from 'api';
const {
    useHistoryReference,mainHistoryText,
    postWpsBaseLocal,getWpsRedTemplateView,
    saveWpsRdTemplate,getWpsDownload,
    postTransferRelAtt,
} = apis

export default { 
    namespace: 'wpsOffice',
    state: {
        allList: [],
        historyList: [], // 历史正文

        htmlFileStorageId:"",
        noticeHtmlValue: '',
        uploadFlag: true,
        nowMessage: '',
        md5: '',
        fileChunkedList: [],//文件分片完成之后的数组
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
        isStop: true,
        isContinue: false,
        isCancel: false,
        index: 0,
        merageFilepath: '',
        typeName: '',
        fileExists: '',
        md5FilePath: '',
        md5FileId: '',
        fileData:[],
        file: {},
        downloadFileType: '',
        downloadFilename: '',
        downloadFile: '',
        downloadUrl: '', 
        redTemplates: []
    },
    effects: {
        // 正文转附件
        *postTransferRelAtt({payload,callback},{call,put}){
            const {data} = yield call(postTransferRelAtt,payload,'','wpsOffice')
            // console.log("dataddsssd",data)
            if(data.code == 200){
                message.success('转化成功!')
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);  
            }
        },
        // 获取下载信息
        *getWpsDownload({payload,callback},{call,put}){
            const {data} = yield call(getWpsDownload,payload,'','wpsOffice')
            if(data.code == 200){
                callback&&callback(data.data)
                const filenameAll = data.data.fileName
                const fileType = filenameAll&&filenameAll.split('.')[1]||''
                const filename =filenameAll&&filenameAll.split('.')[0]||''
                yield put({
                    type: 'updateStates',
                    payload: {
                        downloadFileType: fileType,
                        downloadFilename: filename,
                        downloadFile: filenameAll,
                        downloadUrl: data.data.url
                    }
                })
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);  
            }
        },
        // 套红预览后保存
        *saveWpsRdTemplate({payload,callback},{call,put}){
            const {data} = yield call(saveWpsRdTemplate,payload,'','wpsOffice')
            if(data.code == 200){
                callback&&callback(data.data)
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);  
            }
        },
        // 预览套红模板
        *getWpsRedTemplateView({payload,callback},{call,put}){
            const {data} = yield call(getWpsRedTemplateView,payload,'','wpsOffice')
            if(data.code == 200){
                callback&&callback(data.data)
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);  
            }

        },
        // 打开本地文档
        *postWpsBaseLocal({payload,callback},{call,put}){
            const {data} = yield call(postWpsBaseLocal,payload,'','wpsOffice')
            if(data.code == 200){
                callback&&callback()
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);  
            }
        },
        //历史正文 
        *mainHistoryText({payload,callback},{call,put}){
            const {data} = yield call(mainHistoryText,payload,'','wpsOffice')
            if(data.code == 200){
                yield put({
                    type: 'updateStates',
                    payload: {
                        historyList: data.data.list
                    }
                })
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);  
            }
        },
        // 引用历史正文
        *useHistoryReference({payload,callback}, { call, put }){
            const {data} = yield call(useHistoryReference,payload,'','wpsOffice')
            if(data.code == 200){
                callback&&callback()
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);  
            }
        },
        //获取单位可用套红模版id
        *getRedTemplateListByOrgId({payload,callback}, { call, put }){
            const {data} = yield call(apis.getRedTemplateListByOrgId,payload,'','wpsOffice')
            if(data.code == 200){
                let list = data?.data?.list?.map((item)=>{
                    return {
                        value: item.id,
                        label: item.templateTypeName
                    }
                })
                yield put({
                    type: 'updateStates',
                    payload: {
                        redTemplates: list || []
                    }
                })
                callback&&callback(data?.data?.list)
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);  
            }
        },
        // 正文转pdf
        *transferPdf({payload,callback}, { call, put }){
            const {data} = yield call(apis.transferPdf,payload,'','wpsOffice')
            if(data.code == 200){
                message.success('转化成功！')
                callback&&callback()
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);  
            }
        },
        // 模板更新书签域
        *updateBookMark({payload,callback}, { call, put }){
            const {data} = yield call(apis.updateBookMark,payload,'','wpsOffice')
            if(data.code == 200){
                callback&&callback()
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);  
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
}