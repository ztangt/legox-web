import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'
import { parse } from 'query-string';
import {history} from 'umi'
const {getModel,addModel,updateModelForm,deleteModel,deployModel,getBpmnEngineDetail,
  detailsTree,getBpmnProcessDefinitions,changeMainVersion,deleteMultiple,copyModel,importModel,
  exportModel,getBpmnNewDiagram,getChangeActSort,deleteModelDeployInfo} = apis;
export default {
  namespace: 'workflowEngine',
  state: {
    loading: false,
    formModels: [],//用户列表
    currentPage: 0,
    returnCount: 0,
    controlModal:false,//版本控制模态框
    detailModal:false,//流程定义明细模态框
    addFormModal:false,//新增修改模态框
    designModal:false,//设计模态框
    addObj:{},
    detailsObj:{},//流程明细
    designUrl:'',
    procDefId:'',//流程明细ID
    procDefTreeList:{},//流程定义tree
    treeList: {},
    nodeObj:{},
    currentNode: {},
    treeData: [],
    historyList: [], // 版本控制历史
    limit: 10,
    modelKey: '',
    treeSearchWord:'',
    expandedKeys: [],
    autoExpandParent: true,
    searchWord:'',//搜索内容
    getBpmnData: {},
    modelId: '',
    nodeNameModelShow: false, //节点名称修改
    nodeNameModelData: {},// 节点名称修改数据
    flowXmlStr: '',
    nodeNameChange: false,
    nodeValue: {},
    ////////
    fileUrl:'',
    selectTreeUrl: [],//面包屑路径
    uploadFlag: true, //上传暂停器
    nowMessage: '', //提示上传进度的信息
    md5: '', //文件的md5值，用来和minio文件进行比较
    fileChunkedList: [], //文件分片完成之后的数组
    fileName: '', //文件名字
    fileNames: '',  //文件前半部分名字
    fileStorageId: '', //存储文件信息到数据库接口返回的id
    typeNames: '', //文件后缀名
    optionFile: {}, //文件信息
    fileSize: '', //文件大小，单位是字节
    getFileMD5Message: {}, //md5返回的文件信息
    success: '', //判断上传路径是否存在
    v: 1, //计数器
    needfilepath: '', //需要的minio路径
    isStop: true,  //暂停按钮的禁用
    isContinue: false, //继续按钮的禁用
    isCancel: false, //取消按钮的禁用
    index: 0, //fileChunkedList的下标，可用于计算上传进度
    merageFilepath: '',  //合并后的文件路径
    typeName: '', //层级
    fileExists: '', //判断文件是否存在于minio服务器中，相关modal中监听判断fileExists状态进行后续分别操作
    md5FileId: '', //md5查询到的文件返回的id
    md5FilePath: '', //md5查询到的文件返回的pathname
    mainVersion: '',//当前表单主版本号
    historyTotalCount:0,
    isShownodeName:false,
    selectedNodeId:'',
    selectedDataIds:[],
    selectedDatas:[],
    originalData:[],
    selectNodeType:[],
    leftNum:220
  },
  subscriptions: {
    setup({dispatch, history},{call,put, select}) {
      history.listen(location => {
        if (history.location.pathname === '/workflowEngine') {
          // dispatch({
          //   type: 'getModel',
          //   payload:{
          //     start: 1,
          //     limit: 10,
          //     ctlgId:1
          //   }
          // })
          // const query = parse(history.location.search);
          // if(query.isInit=='1'){
          //   dispatch({
          //     type: 'updateStates',
          //     payload:{
          //       loading: false,
          //       formModels: [],//用户列表
          //       returnCount: 0,
          //       controlModal:false,//版本控制模态框
          //       detailModal:false,//流程定义明细模态框
          //       addFormModal:false,//新增修改模态框
          //       designModal:false,//设计模态框
          //       addObj:{},
          //       detailsObj:{},//流程明细
          //       designUrl:'',
          //       procDefId:'',//流程明细ID
          //       procDefTreeList:{},//流程定义tree
          //       nodeObj:{},
          //       modelId:''
          //     }
          //   })
          // }
        }
      });
    }
  },
  effects: {
    // 流程排序
    *changeBpmnImgSort({payload,callback},{call,put,select}){
      try{
        const {data} = yield call(getChangeActSort, payload);
        const  loop = (array)=>{
          for(var i=0;i<array.length;i++){
            array[i]['title'] = array[i]['actName']
            array[i]['key'] = array[i]['actId']
            array[i]['value'] = array[i]['actId']
            if(arr[i].actType=="endEvent"){
              arr[i].disabled = true
            }
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children)
            }else{
              delete array[i]['children']
            }
          }
          return array
        }
        if(data.code==REQUEST_SUCCESS){
          let sourceTree = loop(data.data.list);
          yield put({
            type: 'updateStates',
            payload:{
              procDefTreeList: sourceTree
            }
          })
          callback&&callback(sourceTree);
        }else if(data.code != 401){
          message.error(data.msg);
        }
      }catch(e){

      }
    },
    *changeMainVersionModel({payload,version,callback},{call,put,select}){
      try{
        const {data} = yield call(changeMainVersion, payload);
        if(data.code==REQUEST_SUCCESS){
            yield put({
              type: 'detailsModel',
              payload: {
                id: payload.id
              }
            })
            yield put({
              type: 'updateStates',
              payload: {
                mainVersion: version
              }
            })
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      }catch(e){

      }
    },
    //获取流程修改
    *getProcessNewDiagram({payload,callback},{call,put,select}){
      const {data} = yield call(getBpmnNewDiagram,payload);
      if(data.code ==200){
        yield put({
          type:'updateStates',
          payload:{
            flowXmlStr:data.data.xmlStr
          }
        })
        callback&&callback();
      }else if (data.code !=401){
        message.error(data.msg);
      }
    },
    *nodeChangeName({payload,callback},{call,put,select}){
      const {data} = yield call(apis.modelChangeName,payload)
      if(data.code ==200){
        yield put({
          type: 'updateStates',
          payload: {
            flowXmlStr: data.data.xmlStr
          }
        })
        yield put({
          type: 'getProcessNewDiagram',
          payload:{
            procDefId:payload.procDefId
          }
       })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 复制
    *copyModel({payload,callback},{call,put,select}){
      try{
        const {data} = yield call(copyModel,payload)
        const {currentPage,currentNode,limit} = yield select(state=>state.workflowEngine)
        if(data.code == REQUEST_SUCCESS){
          yield put({
            type: 'getModel',
            payload:{
              start: currentPage,
              limit: limit,
              ctlgId:currentNode.key
            }
          })
          callback&&callback();
         }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      }catch(e){
      }
    },
    // 导入
    *importModel({payload,callback},{call,put,select}){
      try{
        const {data} = yield call(importModel,payload);
        const {currentPage,currentNode,limit} = yield select(state=>state.workflowEngine)
        if(data.code == REQUEST_SUCCESS){
         yield put({
           type: 'getModel',
           payload:{
             start: currentPage,
             limit: limit,
             ctlgId:currentNode.key
           }
         })
         callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          callback&&callback(data.msg);
         message.error(data.msg);
       }
      }catch(e){

      }
    },
    // 导出
    *exportModel({payload,callback},{call,put,select}){
      try{
        const {data} = yield call(exportModel,payload);
        if(data.code == REQUEST_SUCCESS){
          callback && callback(data.data.xmlPath)
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
         message.error(data.msg);
       }
     }catch(e){

     }
    },
    // 多选删除
    *multipleDeleteModel({payload,callback},{call,put,select}){
      try{
         const {data} = yield call(deleteMultiple,payload);
         const {currentPage,currentNode,limit} = yield select(state=>state.workflowEngine)
         if(data.code == REQUEST_SUCCESS){
          yield put({
            type: 'getModel',
            payload:{
              start: currentPage,
              limit: limit,
              ctlgId:currentNode.key
            }
          })
          callback&&callback();
         }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      }catch(e){

      }
    },
    *getModel({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getModel, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              formModels: data.data.list,
              returnCount: data.data.returnCount,
              currentPage: data.data.currentPage
            }
          })
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addModel({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(addModel, payload);
      //  const {currentPage } = yield select(state=>state.workflowEngine)
         const {currentPage,currentNode,limit} = yield select(state=>state.workflowEngine)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getModel',
            payload:{
              start: currentPage,
              limit,
              ctlgId:currentNode.key
            }
          })
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    *updateModel({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(updateModelForm, payload);
      //  const {currentPage } = yield select(state=>state.workflowEngine)
        const {currentPage,currentNode,limit} = yield select(state=>state.workflowEngine)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getModel',
            payload:{
              start: currentPage,
              limit: limit,
              ctlgId:currentNode.key
            }
          })
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getHistoryList({ payload,callback }, { call, put, select }) {
      const {data} = yield call(getBpmnProcessDefinitions, payload);
      if(data.code==REQUEST_SUCCESS){
        yield put({
          type:'updateStates',
          payload:{
            historyList:data.data.list,
            historyTotalCount:data.data.returnCount
          }
        })
        callback&&callback();
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *deleteModel({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(deleteModel, payload);
      //  const {currentPage } = yield select(state=>state.workflowEngine)
        const {currentPage,currentNode,limit} = yield select(state=>state.workflowEngine)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getModel',
            payload:{
              start: currentPage,
              limit: limit,
              ctlgId:currentNode.key
            }
          })
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *deployModel({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(deployModel, payload);
        if(data.code==REQUEST_SUCCESS){
          message.success('发布成功',5)
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *detailsModel({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getBpmnEngineDetail, payload);
        console.log("data==detail",data)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              detailsObj: data.data,
              procDefId: data.data.procDefId,
              modelId: payload.id
            }
          })
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // *designModel({ payload,callback }, { call, put, select }) {
    //   try {
    //     const {data} = yield call(designModel, payload);
    //     if(data.code==REQUEST_SUCCESS){
    //       yield put({
    //         type: 'updateStates',
    //         payload:{
    //           designUrl: data.data
    //         }
    //       })
    //       callback&&callback();
    //     }else if (data.code != 401 && data.code != 419 && data.code !=403) {
    //       message.error(data.msg);
    //     }
    //   } catch (e) {
    //   } finally {
    //   }
    // },
    *detailsTree({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(detailsTree, {...payload});
        const  loop = (array)=>{
          for(var i=0;i<array.length;i++){
            array[i]['title'] = array[i]['actName']
            array[i]['key'] = array[i]['actId']
            array[i]['value'] = array[i]['actId']
            if(array[i]['actType']=="endEvent"||array[i]['actType']=='startEvent'){
              array[i].disabled = true
            }
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children)
            }else{
              delete array[i]['children']
            }
          }
          return array
        }
        if(data.code==REQUEST_SUCCESS){
         let sourceTree = loop(data.data.list);
         console.log('sourceTree----',sourceTree)
          yield put({
            type: 'updateStates',
            payload:{
              procDefTreeList: sourceTree,
              treeList: sourceTree
            }
          })
          callback&&callback(sourceTree);
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {

      }
    },
   *deleteModelDeployInfo({payload,callback},{call,put,select}){
      try {
        const {data} = yield call(deleteModelDeployInfo, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
   },

    // 保存归属单位
    *saveBelongOrg({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.saveBelongOrg, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success('保存成功');
        callback&&callback()
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },

    // 查询归属单位
    *queryBelongOrg({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.queryBelongOrg, payload);
      debugger
      // 过滤重复数据
      const dataList = data.data.list.filter((item, index, dataList) => {
        return dataList.findIndex(t => t.orgId === item.orgId) === index;
      })
      let selectedOrgIds = [];
      dataList.map((item)=>{
        selectedOrgIds.push(item.orgId);
      })
      dataList.forEach((item) => {
        item.nodeId = item.orgId;
        item.nodeName = item.orgName;
        item.parentId = item.parentOrgId;
        item.parentName = item.parentOrgName;
      });
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            selectedDataIds: selectedOrgIds,
            selectedDatas: dataList
          }
        })
        callback&&callback()
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // *designModeler({ payload,callback }, { call, put, select }) {
    //   try {
    //     const {data} = yield call(designModeler, payload);
    //     console.log('data',data)
    //     // if(data.code==REQUEST_SUCCESS){
    //     //   yield put({
    //     //     type: 'updateStates',
    //     //     payload:{
    //     //       designUrl: data.data
    //     //     }
    //     //   })
    //     //   callback&&callback();
    //     // }else{
    //     //   message.error(data.msg,5)

    //     // }
    //   } catch (e) {
    //   } finally {
    //   }
    // },


  },
  reducers: {
    updateStates(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
