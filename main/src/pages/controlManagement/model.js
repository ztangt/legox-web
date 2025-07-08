import {message} from 'antd'
import apis from 'api'
import _ from 'lodash'
import {REQUEST_SUCCESS,CONTROLCODE} from '../../service/constant'
import { dataFormat } from '../../util/util';
import { v4 as uuidv4 } from 'uuid';
import SparkMD5 from 'spark-md5';

export default {
    namespace:'controlManagement',
    state:{
        searchWord:'',
        businessControlList:[],//列表
        selectedRowKeys:'',//选中id
        isShow:false,//弹框是否展示
        ruleData:CONTROLCODE,//带入规则
        editId:'',
        detailData:{},//详细信息
        isShowScriptEditor:false,

    fileChunkedList: [], // 文件上传用，文件列表
    index: 0,
    md5: '', // 文件上传用，md5格式
    fileName: '', // 文件名
    fileSize: 0, // 文件大小
    fileExists: true,
    filePath: '',
    md5FileId: '',
    md5FilePath: '',
    needfilepath: '',
    fileStorageId: '', //存储信息到数据库返回id
    getFileMD5Message: {}, //md5返回的文件信息
    codeUrl:'',
    codeData:'',
    returnCount:0,
    currentPage:1,
    limit:0
    },
    subscriptions:{
        setup({dispatch,history},{call,select}){
            history.listen(location=>{
                // if(history.location.pathname==='/controlManagement'){
                //     dispatch({
                //         type:'updateStates',
                //         payload:{
                //             pathname:history.location.pathname
                //         }
                //     })
                // }
            })
        }
    },
    effects:{
        *getControlManagementList({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.getControlManagementList,payload)
                if(data.code==REQUEST_SUCCESS){  
                    yield put({
                        type:'updateStates',
                        payload:{
                            businessControlList:data.data.list,
                            returnCount:data.data.returnCount,
                            currentPage:data.data.currentPage
                        }
                    })
                }
                else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg)
                }
            }catch(e){

            }finally{}
           
        },
        //删除控件
        *deleteControl({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.deleteControl,payload)
                if(data.code==REQUEST_SUCCESS){
                    yield put({
                    type: 'getControlManagementList',
                    });
                    yield put({
                        type:'updateStates',
                        payload:{
                            selectedRowKeys:'',
                            // businessControlList:businessControlList
                        }
                    })
                    message.success(data.msg)
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg)
                }

            }catch(e){

            }finally{}
        },
        *addBusinessControl({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.addBusinessControl,payload)
                if(data.code==REQUEST_SUCCESS){
                    message.success(data.msg)
                    yield put({
                        type:'getControlManagementList'
                    })
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg)
                }
            }catch(e){

            }finally{}
        },
        *getDetailControl({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.getDetailControl,payload)
                if(data.code==REQUEST_SUCCESS){
                    yield put({
                        type:'updateStates',
                        payload:{
                            detailData:data.data
                        }
                    })
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg)
                }
            }catch(e){

            }finally{}
        },
        *updateBusinessControl({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.updateBusinessControl,payload)
                if(data.code==REQUEST_SUCCESS){
                    message.success(data.msg)
                    yield put({
                        type:'getControlManagementList'
                    })
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg)
                }
            }catch(e){

            }finally{}
        },
         // js文件上传到minio
    *getScriptFileToMinio({ payload, callback }, { call, put, select }) {
        const {md5,fileName}=yield select(state=>state.controlManagement)
        try {      
          // 上传mio;
          yield put({
            type: 'uploadfile/getFileMD5',
            payload: {
              namespace: 'controlManagement',
              isPresigned: 1,
              fileEncryption: md5,
              filePath: `controlManagement/${dataFormat(
                String(new Date().getTime()).slice(0, 10),
                'YYYY-MM-DD',
              )}/${fileName}`,
            },
            uploadSuccess: callback,
          });
        
        } catch (e) {
          console.error(e);
        }finally{}
      },  
    },
    reducers:{
        updateStates(state,action){
            return {
                ...state,
                ...action.payload
            }
        }
    }
}