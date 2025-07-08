import {message} from 'antd';
import apis from 'api';
import { history } from 'umi';
import { dataFormat } from '../util/util';
import { v4 as uuidv4 } from 'uuid';
import SparkMD5 from 'spark-md5';
import { parse } from 'query-string';
export default {
    namespace: 'upBpmnFile',
    state:{
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
        uploadFlag: true, //上传暂停器
        isStop: true, //暂停按钮的禁用
        isContinue: false, //继续按钮的禁用
        isCancel: false, //取消按钮的禁用
        getBpmnInfo: {},// 获取流程图信息
        processDefinitionId: {} //获取部署后定义的id
    },
    subscriptions: {
        setup({dispatch, history},{call, select}) {
          history.listen(location => {
            // if (history.location.pathname === '/applyModelConfig') {
            //   dispatch({//如果没有保存上id信息则复一个初始值
            //     type:'updateStates',
            //     payload:{
            //     }
            //   })
            // }
            // const query = parse(history.location.search);
            // if(history.location.pathname === '/workflowEngine/designFlow'){
            //     dispatch({
            //       type: 'getEngineModel',
            //       payload: {
            //         id: query.id
            //       }
            //     })
            //   }
                //流程设计进入、区分流程复用   
            //   if(query.isFlow&&history.location.pathname === '/applyModelConfig/designFlowable'){
            //     dispatch({
            //         type: 'addBpmnFlow',
            //         payload: {
            //             modelKey: query.bizSolCode,
            //             modelName: query.bizSolName,
            //             ctlgId: query.ctlgId
            //         }
            //     })
            //   }
          });
        }
      },
      effects: {
        // 获取流程图id等
        *addBpmnFlow({payload,callback},{call,put,select}){
            const  {data}  = yield call(apis.AddBpmnByKey, payload);
            console.log("111data",data)
            if(data.code == 200){
                yield put({
                    type: 'updateStates',
                    payload: {
                        getBpmnInfo: data.data
                    }
                })
                callback&&callback(data.data)
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },  
        // 新的保存流程图接口保存和更新用一个
        *newAddBPmnFlow({payload,callback},{call,put,select}){
            const {data} = yield call(apis.addAndUpdateBpmnModelSave,payload)
            console.log("新增流程图",data)
            if(data.code == 200){
                yield put({
                    type: 'updateStates',
                    payload: {
                        processDefinitionId: data.data.processDefinitionId
                    }
                })
                callback&&callback(data.data)
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
         // 获取流程图最新的xml文件
        *getEngineModel({payload,callback},{call,put,select}){
            try{
            const {data} = yield call(apis.getBpmnEngineModel,payload)
            if(data.code==200){ 
                yield put({
                type: 'updateStates',
                payload: {
                    getBpmnData: data.data
                }
                })
                callback&&callback(data.data);
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
            }catch(e){
    
            }
      },
        // js文件上传到minio
        *getScriptFileToMinio({ payload, callback }, { call, put, select }) {
            try {
            const {json_xml,bizSolId} = payload
            const blob = new Blob([json_xml], { type: 'text/xml' });
            const file = new File([blob], uuidv4(), {
                type: 'text/xml',
            });
            const fileMD5 = SparkMD5.hashBinary(json_xml)+new Date().getTime();
            yield put({
                type: 'updateStates',
                payload: {
                fileChunkedList: [file],
                md5: fileMD5,
                fileName: `${file.name}.xml`,
                fileSize: file.size,
                },
            });
            // 上传mio;
            yield put({
                type: 'uploadfile/getFileMD5',
                payload: {
                namespace: 'upBpmnFile',
                isPresigned: 1,
                fileEncryption: fileMD5,
                filePath: `upBpmnFile/${bizSolId}/file.xml`,
                },
                uploadSuccess: callback,
            });
            } catch (e) {
            console.error(e);
            }
        }
    },
    reducers: {
        updateStates(state, action){
            return {
              ...state,
              ...action.payload
            }
          }
    }
}