import {message} from 'antd';
import apis from 'api';
import { history } from 'umi';
import {FLOWABLE_PREFIX} from '../../componments/BpmnEditor/constant/constants'
import _ from "lodash";
import { JSSCRIPT } from '../../service/constant';
import { dataFormat } from '../../util/util';
import { parse } from 'query-string';
import {defaultAttAuth} from './componments/configContant';
function getBizSolId(){
  var url = window.location.href;
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.split("?")[1];
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest?.bizSolId
}
export default {
  namespace: 'applyModelConfig',
  state: {
    stateObj:[],//所有的id的state
    bpmnView: null,
    initPrefix: FLOWABLE_PREFIX,
    scriptContent:JSSCRIPT,
    fileChunkedList: [], // 文件上传用，文件列表
    index: 0,
    md5: '', // 文件上传用，md5格式
    fileName: '', // 文件名
    fileSize: 0, // 文件大小
    fileExists: '',
    filePath: '',
    md5FileId: '',
    md5FilePath: '',
    needfilepath: '',
    fileStorageId: '', //存储信息到数据库返回id
    getFileMD5Message: {}, //md5返回的文件信息
    version: '',
    fileEncryption: '',
    uploadFlag:'',
    fixedValue:'',
    fixedIndex:'',
    formNewData:[],
    bizFormType:'',
    designItem:[],
    procDefId: '0'
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      // console.log('history===',history);
      // if(history.location.pathname.includes('applyModelConfig')){
      //   dispatch({//如果没有保存上id信息则复一个初始值
      //     type:'updateStates',
      //     payload:{
      //     }
      //   })
      // }
    }
  },
  effects: {
    *initConfig({payload,extraParams},{call,put}){
      const resultArray = yield Promise.all([
        yield put({
          type:"getBizSolInfo",
          payload:payload
        }),
        yield put({//获取业务应用表单配置信息
          type:'getBizSolFormConfigReturn',
          payload:payload,
          extraParams:extraParams
        })
      ]);
      extraParams?.setState({
        bizSolInfo:resultArray[0],
        ...resultArray[1]
      })
    },
  //获取头像下载地址url
  *getDownFileUrl({ payload, callback }, { call, put, select }) {
    const { data } = yield call(apis.getDownFileUrl, payload,'','applyModelConfig',{callback});
    if (data.code == 200) {
      callback && callback();
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
    // js文件上传到minio
 *getScriptFileToMinio({ payload, callback }, { call, put, select }) {//TODO
  const {md5,fileName} = yield select(state=>state.applyModelConfig)
  try {
    // 上传mio;
    yield put({
      type: 'uploadfile/getFileMD5',
      payload: {
        namespace: 'applyModelConfig',
        isPresigned: 1,
        fileEncryption: md5,
        filePath: `applyModelConfig/${dataFormat(
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
    //根据ID获取详情
    *getBizSolInfo({ payload}, { call, put, select }) {
      //因为写到model里面了不想让他在401的时候请求接口了所以写成applyModelConfig1
      const {data} = yield call(apis.getBizSolInfo, payload);
      if(data.code==200){
        return data.data;
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
        return {};
      }else {
        return {}
      }
    },
    //获取网关出口流
    *getGatewayOutFlows({payload,extraParams},{call,put,select}){
      const {data}=yield call(apis.getGatewayOutFlows,payload,'','applyModelConfig',{extraParams})
      if (data.code == 200) {
        extraParams?.setState({
          nodeList:data.data,
        })
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //更新网关出口流顺序
    *updateGatewayOutFlowsOrder({payload,extraParams},{call,put,select}){
      const {data}=yield call(apis.updateGatewayOutFlowsOrder,payload,'','applyModelConfig',{extraParams})
      if (data.code == 200) {
        extraParams?.setState({
          newFlowImg: data.data.xmlStr,
          version: data.data.version
        })
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取业务表单数据
    *getBusinessForm({ payload,callback,extraParams }, { call, put, select }) {
      const {data} = yield call(apis.getBusinessFormNew, payload);
      if(data.code==200){
        let formData = [];//表单数据
        data.data.list.map((item)=>{
          if(item.isChildVersion=='1'){
              item.children=[{
                key:'-1'
              }];
            }else{
              //item.children=null;
            }
            formData.push(item)
        })
        console.log('formData==',formData)
        callback&&callback(formData)
        extraParams?.setState({
          formData:formData,
          mainFormData:formData,
          formReturnCount:data.data?.returnCount,
          formCurrentPage:data.data?.currentPage
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //查询非主版本的业务表单
    *getFormOtherVersions({ payload,extraParams }, { call, put, select }) {
      const {data} = yield call(apis.getFormOtherVersions, payload);
      if(data.code==200){
        const {formData} = extraParams?.state||{};
        let newFormData = [];
        formData.map((item)=>{
          if(item.formId==payload.formId){
            if(data.data.list){
              item.children=[];
              data.data.list.map((itemChildren)=>{
                //if(itemChildren.version!=payload.version){
                  if(itemChildren.isChildVersion=='1'){
                    itemChildren.children=[{
                      key:'-1'
                    }];
                  }else{
                    //item.children=null;
                  }
                  // itemChildren.bizFormName = itemChildren.formName;
                  // itemChildren.bizFormCode = itemChildren.formCode;
                  //itemChildren.formVersion = itemChildren.version;
                  //itemChildren.deployId = itemChildren.deployFormId;
                  item.children.push(itemChildren);
                //}
              })
            }else{
              delete(item.children)
            }
          }
          newFormData.push(item)
        })
        extraParams?.setState({
          formData:newFormData
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取按钮方案
    *getButtonGroups({ payload,extraParams }, { call, put, select }) {
      const {data} = yield call(apis.getButtonGroups, payload);
      if(data.code==200){
        extraParams?.setState({
          buttonGroupList:data.data.list
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getButtonIds({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.getButtonIds, payload);
      if(data.code==200){
        //添加默认值
        data.data.list.map((item)=>{
          item.isShow='DISPLAY';
          item.rangeType='ALL';
          item.rangeContentValue='所有人';
          item.rangeContentId='';
        })
        callback&&callback(data.data.list)
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //保存表单配置信息
    *saveBussionFromInfo({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.saveBussionFromInfo, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        message.success('保存成功');
        callback&&callback({
          versionList:data.data?.versionList||[],
          selectVersionId:data.data?.bizSolFormId,
          saveBussionFromInfoOnOff:false
        });
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取表单配置
    *getBizSolFormConfigReturn({ payload,extraParams }, { call, put, select }) {
      const {data} = yield call(apis.getBizSolFormConfig, payload,'','');
      const {procDefId,tableData} = extraParams?.state||{};
      if(data.code==200){
        if(data.data.bizSolForm){
          tableData[0].name = data.data.bizSolForm.listBizFormName;
          tableData[1].name = data.data.bizSolForm.buttonGroupName;
          tableData[2].name = data.data.bizSolForm.formBizFormName;
          tableData[0].code = data.data.bizSolForm.listBizFormCode;
          tableData[1].code = data.data.bizSolForm.buttonGroupCode;
          tableData[2].code = data.data.bizSolForm.formBizFormCode;
          // let str = data.data.bizSolForm.importTemplateFilePath;
          // if(str){
          //   let index = str .lastIndexOf ("\/");
          //   str = str .substring (index + 1, str .length);
          // }
          tableData[5].name=data.data.bizSolForm.importTemplateFileName
        }
        //let procDefIds=data.data!=null?data.data.procDefId:'0' 更改这块是因为这块默认为0后 页面 后 业务应用配置未保存的流程图清空了
       let procDefIds=data.data.bizSolForm!=null?data.data.bizSolForm.procDefId:procDefId?procDefId:'0'//用于流程版本切换以后得倒数据
        let tmpVersionList = data.data.versionList?data.data.versionList:[{
          bizSolFormId:'edit',
          version:'编辑中'
        }]
        let selectVersionId = data.data.bizSolForm?data.data.bizSolForm.bizSolFormId:'edit';
        let formConfigInfo = {
          versionList:tmpVersionList,
          bizFromInfo:data.data.bizSolForm?data.data.bizSolForm:[],
          oldBizFromInfo:data.data.bizSolForm?{...data.data.bizSolForm}:[],
          procDefId:procDefIds,
          tableData,
          selectVersionId:selectVersionId
        }
        if(procDefIds&&procDefIds!='0'){
          const resultArray = yield Promise.all([
            yield put({
              type:"getProcessNewDiagramReturn",
              payload:{
                procDefId:procDefIds
              }
            })
          ])
          return {
            ...formConfigInfo,
            ...resultArray[0]
          }
        }else{
          return {
            ...formConfigInfo,
          }
        }
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
        return {};
      }else {
        return {}
      }
    },
    //获取表单配置
    *getBizSolFormConfig({ payload,extraParams }, { call, put, select }) {
      const {data} = yield call(apis.getBizSolFormConfig, payload);
      // const {stateObj} = yield select(state=>state.applyModelConfig)
      //   const query = parse(history.location.search);
      //   const bizSolId = query.bizSolId || getBizSolId();
      const {procDefId,tableData} = extraParams?.state||{};
      if(data.code==200){
        if(data.data.bizSolForm){
          tableData[0].name = data.data.bizSolForm.listBizFormName;
          tableData[1].name = data.data.bizSolForm.buttonGroupName;
          tableData[2].name = data.data.bizSolForm.formBizFormName;
          tableData[0].code = data.data.bizSolForm.listBizFormCode;
          tableData[1].code = data.data.bizSolForm.buttonGroupCode;
          tableData[2].code = data.data.bizSolForm.formBizFormCode;
          // let str = data.data.bizSolForm.importTemplateFilePath;
          // if(str){
          //   let index = str .lastIndexOf ("\/");
          //   str = str .substring (index + 1, str .length);
          // }
          tableData[5].name=data.data.bizSolForm.importTemplateFileName;
        }
        //let procDefIds=data.data!=null?data.data.procDefId:'0' 更改这块是因为这块默认为0后 页面 后 业务应用配置未保存的流程图清空了
       let procDefIds=data.data.bizSolForm!=null?data.data.bizSolForm.procDefId:procDefId?procDefId:'0'//用于流程版本切换以后得倒数据
      //  if(procDefIds!=0){
      //     yield put({
      //       type: 'getProcessNewDiagram',
      //       payload:{
      //         procDefId:procDefIds
      //       }
      //    })
      //  }
        let tmpVersionList = data.data.versionList?data.data.versionList:[{
          bizSolFormId:'edit',
          version:'编辑中'
        }]
        let selectVersionId = data.data.bizSolForm?data.data.bizSolForm.bizSolFormId:'edit';
        extraParams?.setState({
          versionList:tmpVersionList,
          bizFromInfo:data.data.bizSolForm?data.data.bizSolForm:[],
          oldBizFromInfo:data.data.bizSolForm?{...data.data.bizSolForm}:[],
          procDefId:procDefIds,
          tableData,
          selectVersionId:selectVersionId
        })
        if(procDefIds&&procDefIds!='0'){
          yield put({
            type:"getProcessNewDiagram",
            payload:{
              procDefId:procDefIds
            },
            extraParams
          })
        }
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 同步版本配置
    *syncVersionCfg({ payload, callback }, { call, put }) {
      const {data} = yield call(apis.syncVersionCfg, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        message.success('同步成功');
        callback && callback();
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取上次编码的绑定
    *getBindformCode({ payload,extraParams }, { call, put, select }) {
      const {data} = yield call(apis.getBindformCode, payload,'','applyModelConfig',{extraParams});
      if(data.code==200){
        let codeList=data.data.codeList;
        let draftNum=0;
        let fromCols = [];
        //获取选中的表单的关联的字段列表
        yield put({
          type:'getTableColumnsFormId',
          payload:{
            deployFormId:payload.deployFormId,
            type:'NO'
          },
          callback:(list)=>{
            if(codeList&&codeList.length){
              codeList.map((item)=>{
                //获取拟稿的数量
                if(item.execOrder=='DRAFT'){
                  draftNum=draftNum+1;
                }
                let relFromCols = [];
                if(item.countType=='ORG'){
                  relFromCols = list.filter(i=>i.colType=='ORGTREE');
                }else if(item.countType=='DEPT'){
                  relFromCols = list.filter(i=>i.colType=='DEPTTREE');
                }
                item.relFromCols = relFromCols;
              })
              if(!draftNum){//如果没有拟稿的数据，则添加一条空的
                const rowData={
                  execOrder:'DRAFT',
                  codeRuleId:'add_'+0,
                  codeRuleName:'请选择',
                  formColumnId:'',
                  codeView:'',
                  needCol:[]
                }
                //let newData=codeList.concat();
                codeList.splice(0,0,rowData);
                draftNum=1;
              }else if(codeList.length==draftNum){//没有发送数据，则添加一条空的
                const rowData={
                  execOrder:'SEND',
                  codeRuleId:'add_'+draftNum,
                  codeRuleName:'请选择',
                  formColumnId:'',
                  codeView:'',
                  needCol:[]
                }
                codeList.push(rowData);
              }
            }else{
              const rowDataDraft={
                execOrder:'DRAFT',
                codeRuleId:'add_'+0,
                codeRuleName:'请选择',
                formColumnId:'',
                codeView:'',
                needCol:[]
              }
              const rowDataSend={
                execOrder:'SEND',
                codeRuleId:'add_'+1,
                codeRuleName:'请选择',
                formColumnId:'',
                codeView:'',
                needCol:[]
              }
              codeList.push(rowDataDraft);
              codeList.push(rowDataSend);
              draftNum=1;
            }
            fromCols=list;
            extraParams?.setState({
              codeList:codeList,
              draftNum:draftNum,
              fromCols
            })
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取编码分类
    *getCodeRule({ payload,extraParams }, { call, put, select }) {
      const {data} = yield call(apis.getCodeRule, payload,'','applyModelConfig',{extraParams});
      if(data.code==200){
        if(data.data.codeRules.length){
          //获取编码规则
          yield put({
            type:"getCodeRuleInfo",
            payload:{
              codeRuleId:data.data.codeRules[0].codeRuleId,
              codeName:"",
              start:1,
              limit:10000
            },
            extraParams
          })
        }
        extraParams?.setState({
          codeRules:data.data.codeRules,
          oldCodeRules:data.data.codeRules,
          codeSelectedKeys:data.data.codeRules[0].codeRuleId
        })

      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取编码列表
    *getCodeRuleInfo({ payload,extraParams }, { call, put, select }) {
      const {data} = yield call(apis.getCodeRuleInfo, payload,'','applyModelConfig',{extraParams});
      if(data.code==200){
        extraParams?.setState({
          codeRuleInfo:data.data.list
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //编码绑定
    *saveFromCode({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.saveFromCode, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        message.success('绑定成功');
        if(typeof callback=='function'){
          callback();
        }
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取字段 new 老肖让换的
    *getFormTableColumns({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.getFormTableColumns, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        let columnList = []
        // for (let i = 0; i < data.data.tableList.length; i++) {
        //   for (let j = 0; j < data.data.tableList[i]['columnList'].length; j++) {
        //     data.data.tableList[i]['columnList'][j]['formTableCode'] = data.data.tableList[i]['formTableCode']
        //   }
        //   columnList = ([...columnList, ...data.data.tableList[i].columnList])
        // }
        // for (let i = 0; i < data.data.tableList.length; i++) {
        //   const element = data.data.tableList[index];
        //   if (element.tableScope === 'MAIN') {
        //     columnList = element['columnList']
        //   }
        // }
        callback&&callback(data.data.tableList);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取字段
    *getTableColumnsFormId({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.getTableColumnsFormId, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        callback&&callback(data.data.columnList);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getBizSolList({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.getBizSolList, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        //加一个唯一的属性作为上移下移等操作
        data.data.list.map((item,index)=>{
          item.id=index
        })
        callback&&callback({
          titleList:data.data.list,
          selectTitleIndex:0
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //保存标题
    *saveTitle({ payload,extraParams }, { call, put, select }) {
      const {data} = yield call(apis.saveTitle, payload,'','applyModelConfig',{extraParams});
      if(data.code==200){
        message.success('保存成功');
        extraParams?.setState({
          isShowTitleModal:false,
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // *addBizModel({ payload,callback }, { call, put, select }) {
    //   const {data} = yield call(apis.addBizModel, payload,'','applyModelConfig');
    //   if(data.code==200){
    //     callback&&callback(data.data);
    //   }else if (data.code != 401 && data.code != 419 && data.code !=403) {
    //     message.error(data.msg);
    //   }
    // },
    // *getProcessDiagram({ payload,callback }, { call, put, select }) {
    //   const {data} = yield call(apis.getProcessDiagram, payload,'','applyModelConfig');
    //   console.log("data----",data)
    //   if(data.code==200){
    //     yield put({
    //       type:'updateStates',
    //       payload:{
    //         flowImg:data.data
    //       }
    //     })
    //     callback&&callback();
    //   }else if (data.code != 401 && data.code != 419 && data.code !=403) {
    //     message.error(data.msg);
    //   }
    // },
    *getProcessNewDiagramReturn({payload},{call,put,select}){
      const {data} = yield call(apis.getBpmnNewDiagram,payload,'','applyModelConfig');
      if(data.code ==200){
        return {
          newFlowImg:data.data.xmlStr,
          version: data.data.version
        }
      }else if (data.code !=401){
        message.error(data.msg);
        return {};
      }
    },
    *getProcessNewDiagram({payload,callback,extraParams},{call,put,select}){
      const {data} = yield call(apis.getBpmnNewDiagram,payload,'getProcessNewDiagram','applyModelConfig',{callback,extraParams});
      if(data.code ==200){
        extraParams?.setState({
          newFlowImg:data.data.xmlStr,
          version: data.data.version
        })
        callback&&callback({
          newFlowImg:data.data.xmlStr,
          version: data.data.version
        });
      }else if (data.code !=401){
        message.error(data.msg);
      }
    },
    *nodeChangeName({payload,extraParams},{call,put,select}){
      const {data} = yield call(apis.modelChangeName,payload,'nodeChangeName','applyModelConfig',{extraParams})
      if(data.code ==200){
        extraParams?.setState({
          newFlowImg: data.data.xmlStr
        })
        yield put({
          type: 'getProcessNewDiagram',
          payload:{
            procDefId:payload.procDefId
          },
          extraParams
       })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getBizSolFormConfigProDef({ payload,callback,extraParams }, { call, put, select }) {
      const {data} = yield call(apis.getBizSolFormConfigProDef, payload,'','applyModelConfig',{extraParams,callback});
      const {bizFromInfo,oldBizFromInfo,tableData,versionList,selectVersionId,oldSelectVersionId} = extraParams?.state||{};
      if(data.code==200){
        let newBizFromInfo = data.data?data.data:bizFromInfo;
        console.log('selectVersionId==',selectVersionId);
        if(!data.data){
          newBizFromInfo.usedFlag = 0;//在当前启用的版本的页面下，更改流程进行新的版本的编辑时，启用状态应该变为“停用
        }
        !data.data&&selectVersionId!='edit'?versionList.push({
          bizSolFormId:'edit',
          version:'编辑中'
        }):versionList;
        let tmpSelectVersionId = !data.data?'edit':newBizFromInfo.bizSolFormId;
        !data.data&&callback&&callback();//表单切换没有数据的时候需要做callback的处理
        if(data.data){
          tableData[0].name = newBizFromInfo.listBizFormName;
          tableData[1].name = newBizFromInfo.buttonGroupName;
          tableData[2].name = newBizFromInfo.formBizFormName;
          tableData[0].code = newBizFromInfo.listBizFormCode;
          tableData[1].code = newBizFromInfo.buttonGroupCode;
          tableData[2].code = newBizFromInfo.formBizFormCode;
          // let str = newBizFromInfo.importTemplateFilePath;
          // if(str){
          //   let index = str .lastIndexOf ("\/");
          //   str = str .substring (index + 1, str .length);
          // }
          tableData[5].name=newBizFromInfo.importTemplateFileName
        }
        extraParams?.setState({
          bizFromInfo:newBizFromInfo, //如获取的是null 沿用上次的数据
          oldBizFromInfo:data.data?{...data.data}:oldBizFromInfo,
          tableData,
          versionList:versionList,//如获取的是null,则增加一个编辑中的状态
          oldSelectVersionId:selectVersionId=='edit'?oldSelectVersionId:selectVersionId,//用于重置操作
          selectVersionId:tmpSelectVersionId
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取权限绑定
    *getAuthority({ payload,extraParams }, { call, put, select }) {
      const {data} = yield call(apis.getAuthority, payload,'','applyModelConfig',{extraParams});
      if(data.code==200){
        let authList = [];
        data.data.authList.map((item,index)=>{
          item.index=index+1;//用于删除
          authList.push(item);
        })
        extraParams?.setState({
          authList:authList,
          oldAuthList:authList,
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //绑定权限
    *updateAuth({ payload,callback}, { call, put, select }) {
      const {data} = yield call(apis.updateAuth, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        message.success('保存成功');
        callback&&callback();
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //查询全部的审核人
    *getGlobalReviewerList({ payload,extraParams}, { call, put, select }) {
      const {data} = yield call(apis.getGlobalReviewerList, payload,'','applyModelConfig',{extraParams});
      const groupData=[
        {value:'CURRENT_DEPT',label:'本部门'},
        {value:'PARENT_DEPT',label:'上级部门'},
        {value:'CURRENT_ORG',label:'本单位'},
        {value:'PARENT_ORG',label:'上级单位'}
      ]
      if(data.code==200){
        data.data.list.forEach(item=>{
          if(item.checkerProperty=='PUBLIC'){
            item.label=item.checkerName+'(公共的)'
            item.value=item.id
          }else{
            item.label=item.checkerName+'(私有的)'
            item.value=item.id
          }

        })
        extraParams?.setState({
          reviewerList:[{value:'CURRENT_VALUE',label:'属性本身'}].concat(data.data.list),
          groupList:groupData.concat(data.data.list),
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *submitButtonAuth({ payload,callback}, { call, put, select }) {
      const {data} = yield call(apis.submitButtonAuth, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        if(payload.actId){
          message.success('设置成功');
        }
        callback&&callback();
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //通过主键获取业务应用表单版本信息
    *getBussinessFormByBizFormId({ payload ,extraParams,callback}, { call, put, select }){
      const {data} = yield call(apis.getBussinessFormByBizFormId, payload,'','applyModelConfig',{extraParams,callback});
      if(data.code==200){
        const {bizFromInfo,tableData} = extraParams?.state||{};//获取表单显示的数据（主要是为了获取name）
        console.log('extraParams==',extraParams);
        if(data.data){
          tableData[0].name = data.data.listBizFormName;
          tableData[1].name = data.data.buttonGroupName;
          tableData[2].name = data.data.formBizFormName;
          tableData[0].code = data.data.listBizFormCode;
          tableData[1].code = data.data.buttonGroupCode;
          tableData[2].code = data.data.formBizFormCode;
        }
        let procDefId = data.data?.procDefId||'0';
        extraParams?.setState({
          bizFromInfo:data.data?data.data:[],
          oldBizFromInfo:data.data?{...data.data}:[],
          procDefId:procDefId,
          tableData
        })
        if(procDefId&&procDefId!='0'){
          yield put({
            type:"getProcessNewDiagram",
            payload:{
              procDefId:procDefId
            },
            extraParams
          })
        }
        callback&&callback(bizFromInfo);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //根据url获取规则设置的数据
    *getRuleSetData({ payload,callback }, { call, put, select }){
      const {data}= yield call(apis.readFileContent,payload,'getRuleSetData','applyModelConfig',{callback});
      if(data.code==200){
        callback&&callback(JSON.parse(data.data));
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getPagingList_CommonDisk_Tree({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getPagingList_CommonDisk, payload,'getPagingList_CommonDisk_Tree','applyModelConfig',{callback});
      if (data.code == 200) {
        let newData = [];
        data.data.list ? data.data.list.map((item) => {
          newData.push({
            title: item.cloudDiskName,
            key: item.id,
            isLeaf: item.child == 'Y' ? false : true,
          })
        }) : [];
        callback&&callback(newData);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getPagingList_CommonDisk_List({ payload, extraParams }, { call, put, select }) {
      const { data } = yield call(apis.getPagingList_CommonDisk, payload,'getPagingList_CommonDisk_List','applyModelConfig',{extraParams});
      if (data.code == 200) {
        extraParams?.setState({
          diskCurrentPage:data.data.currentPage,
          diskReturnCount:data.data.returnCount,
          diskAllPage:data.data.allPage,
          diskData:data.data.list
        })
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //下载
    *getDownFileUrl({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDownFileUrl, payload,'','applyModelConfig',{callback});
      if (data.code == 200) {
        window.location.href = data.data.fileUrl;
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 获取bpmn flowable类型
    *getPrefixBpmn({payload},{call,put,select}){
      const {initPrefix} =  yield select(state=>state.applyModelConfig)
      return initPrefix
    },
    *getImgNode({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.getImgNode, payload,'','applyModelConfig',{callback});
      let arr = JSON.parse(JSON.stringify(data.data.nodeJson.elements));
      let newArr = [];
      for(let i = 0; i< arr.length;i++){
        if(arr[i].type != 'StartEvent'){//不能在这加过滤条件，如果加了结束的配置复用就不行了
          newArr.push(arr[i])
        }
      }
      if(data.code==200){
        // extraParams?.setState({
        //   imgNode:data.data,
        //   nodeElement:newArr,
        // })
        callback&&callback({imgNode:data.data,nodeElement:newArr});
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *copyNodeConfig({payload,callback},{call, put, select}){
      const {data}=yield call(apis.copyNodeConfig,payload,'','applyModelConfig',{callback})
      if(data.code==200){
       console.log(data,'data---');
       message.success('操作成功!')
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getNodeBase({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.getNodeBase, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     NodeBaseObj:data.data
        //   }
        // })
        callback&&callback(data.data);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取网关的基本信息
    *getGateWayNodeBase({ payload,extraParams}, { call, put, select }) {
      const {data} = yield call(apis.getGateWayNodeBase, payload,'','applyModelConfig',{extraParams});
      if(data.code==200){
        let gatewayExpressionData = [];
        //展开列
        data.data.gatewayExpressionList.map((item)=>{
          if(item.expressionDesign){
            let expressionDesign= item.expressionDesign.split(',');
            expressionDesign.map((i,index)=>{
              gatewayExpressionData.push({
                targetActId:item.targetActId,
                targetActName:item.targetActName,
                expressionDesign:i,
                rowSpan:index==0?expressionDesign.length:0
              })
            })
          }else{
            gatewayExpressionData.push({
              targetActId:item.targetActId,
              targetActName:item.targetActName,
              expressionDesign:'',
              rowSpan:1
            })
          }
        })
        extraParams?.setState({
          bizSolNodeBaseId:data.data.bizSolNodeBaseId,
          exclusiveGatewayStrategy:data.data.exclusiveGatewayStrategy,
          gatewayParamList:data.data.gatewayParamList,
          gatewayExpressionList:gatewayExpressionData,
          exclusiveGatewayCustom:data.data.exclusiveGatewayCustom
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //保存网关参数
    *saveGateWayParams({payload,callback,extraParams}, { call, put, select }) {
      const {data} = yield call(apis.saveGateWayParams, payload,'','applyModelConfig',{callback,extraParams});
      if(data.code==200){
        const {gatewayParamList} = extraParams?.state||{};
        gatewayParamList.push({
          ...payload,
          id:data.data.id
        })
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     gatewayParamList:gatewayParamList
        //   }
        // })
        //清空form表单
        callback&&callback(gatewayParamList);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //更新网关参数
    *updateGateWayParams({payload,callback,extraParams}, { call, put, select }) {
      const {data} = yield call(apis.updateGateWayParams, payload,'','applyModelConfig',{callback,extraParams});
      if(data.code==200){
        const {gatewayParamList} = extraParams?.state||{};
        let newGatewayParamList = [];
        gatewayParamList.map((item)=>{
          if(item.id==payload.id){
            newGatewayParamList.push({...payload});
          }else{
            newGatewayParamList.push(item);
          }
        })
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     gatewayParamList:newGatewayParamList
        //   }
        // })
        //清空form表单
        callback&&callback(newGatewayParamList);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //网关字段展示
    *getFormcolumns({ payload,extraParams }, { call, put, select }) {
      const {data} = yield call(apis.getFormcolumns, payload,'','applyModelConfig',{extraParams});
      if(data.code==200){
        let numCols = [];
        let stringCols =[];
        data.data.columnList.map((item)=>{
          if(item.colType=='NUMBER'||item.colType=='MONEY'){
            numCols.push(item);
          }else{
            stringCols.push(item);
          }
        })
        extraParams?.setState({
          columnList:{NUMBER:numCols,STRING:stringCols}
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //删除网关参数
    *delParam({ payload ,extraParams}, { call, put, select }) {
      const {data} = yield call(apis.delParam, payload,'','applyModelConfig',{extraParams});
      if(data.code==200){
        message.success('删除成功');
        const {gatewayParamList} = extraParams?extraParams.state:{};
        let newGatewayParamList = [];
        gatewayParamList.map((item)=>{
          if(!payload.ids.split(',').includes(item.id)){
            newGatewayParamList.push(item)
          }
        })
        extraParams?.setState({
          gatewayParamList:newGatewayParamList
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //保存网关配置
    *saveGateWay({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.saveGateWay, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        message.success('保存成功');
        // yield put({
        //   type:"updateStates",
        //   payload:{
        //     gatewayModal:false
        //   }
        // })
        callback&&callback()
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *updateNodeBase({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.updateNodeBase, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     NodeBaseObj:data.data
        //   }
        // })
        message.success('保存成功');
        callback&&callback();
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getOrgChildren({ payload,callback}, { call, put, select }) {
      try {
        const {data} = yield call(apis.getOrgChildren, payload,'','applyModelConfig',{callback});
        const {stateObj} = yield select(state=>state.applyModelConfig)
        const query = parse(history.location.search);
        const bizSolId = query.bizSolId || getBizSolId();
        const {treeData,expandedKeys,selectNodeId,userList,orgUserType,postList} = stateObj[bizSolId]
        const  loop = (array,children)=>{
          for(var i=0;i<array.length;i++){
            array[i]['title'] = array[i]['nodeName']
            array[i]['key'] = array[i]['nodeId']
            array[i]['value'] = array[i]['nodeId']
            if(array[i]['nodeType'] != orgUserType){
              array[i]['disableCheckbox'] = true
            }
            if(payload.nodeId == array[i]['nodeId']){
              // if(selectNodeId == array[i]['nodeId']){
              //   array[i]['children'] = _.concat(children,userList);
              // }else{
              //   array[i]['children'] = children
              // }
              // array[i]['children'] = children
              array[i]['children'] = _.concat(children,postList)
            }
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children,children)
            }else{
              // if(array[i]['nodeType'] == 'ORG' || array[i]['nodeType'] == 'DEPT'){
              //   if(array[i].isParent==1){
              //     array[i]['children'] = [{key: '-1'}]
              //     array[i]['isLeaf'] = false
              //   }else{
              //     array[i]['isLeaf'] = false
              //   }
              // }
              if(array[i].isParent==1){
                array[i]['children'] = [{key: '-1'}]
                array[i]['isLeaf'] = false
              }else{
                array[i]['isLeaf'] = true
              }
            }
          }
          return array
        }
        if(data.code==200){
          let sourceTree = treeData;
          if(data.data.list.length!=0 || postList.length != 0){
            if(sourceTree&&sourceTree.length==0){
              // sourceTree = data.data.list
              sourceTree = _.concat(data.data.list,postList)
            }
            sourceTree = loop(sourceTree,data.data.list);
            yield put({
              type: 'updateStates',
              payload:{
                treeData: sourceTree
              }
            })
            if(!payload.nodeId){//请求根节点时，清空已展开的节点
              yield put({
                type: 'updateStates',
                payload:{
                  expandedKeys:[]
                }
              })
            }
            callback&&callback();
          }
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg,5)
        }
      } catch (e) {
        console.log(e);
      } finally {

      }
    },
    *queryUser({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.queryUser, payload,'','applyModelConfig',{callback});
      const {stateObj} = yield select(state=>state.applyModelConfig)
      const query = parse(history.location.search);
      const bizSolId = query.bizSolId || getBizSolId();
      const {treeData,userList,selectNodeId,checkedKeys} = stateObj[bizSolId]
      let obj = {};
      const loop = (array,children)=>{
        for(var i=0;i<array.length;i++){
          if(selectNodeId == array[i]['nodeId']){
            if(array[i]['children']){
              array[i]['children'] = _.concat(array[i].children,children);
            }else{
              array[i]['children'] = children
            }
            array[i]['children'] = array[i]['children'].reduce(function(item, next) {
              obj[next.key] ? '' : obj[next.key] = true && item.push(next);
              return item;
            }, []);

          }
          if(array[i].children&&array[i].children.length!=0){
            loop(array[i].children,children)
          }
        }
        return array
      }
      if(data.code==200){
        let list = data.data.list;
        for(let i = 0;i<list.length;i++){
            // list[i]['title'] = list[i]['userName'];
            // list[i]['key'] = list[i]['orgRefUserId'];
            list[i]['nodeName'] = list[i]['userName'];
            list[i]['nodeId'] = list[i]['orgRefUserId'];
            // list[i]['nodeType'] = 'USER';
        }
        // let sourceTree = loop(treeData,list)
        yield put({
          type:'updateStates',
          payload:{
            // treeData:sourceTree,
            userList:list,
         //   userList:data.data.list
          }
        })
        callback&&callback();
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getNodeEvent({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.getNodeEvent, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     NodeBaseObj:data.data
        //   }
        // })
        callback&&callback(data.data);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getEventList({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.getEventList, payload,'','applyModelConfig',{callback});
      console.log(data.data.list,'111============');
      if(data.code==200){
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     eventList:data.data.list
        //   }
        // })
        callback&&callback(data.data.list);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *addNodeEvent({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.addNodeEvent, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     eventList:data.data.list
        //   }
        // })
        callback&&callback();
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *deleteNodeEvent({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.deleteNodeEvent, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     eventList:data.data.list
        //   }
        // })
        callback&&callback();
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // *getFormColumns({ payload,callback }, { call, put, select }) {
    //   const {data} = yield call(apis.getFormColumns, payload,'','applyModelConfig');
    //   if(data.code==200){
    //     yield put({
    //       type:'updateStates',
    //       payload:{
    //         formColumns:data.data.tableList.length?data.data.tableList[0].columnList:[],
    //         formInfo:data.data.tableList.length?data.data.tableList[0]:[]
    //       }
    //     })
    //     callback&&callback();
    //   }else if (data.code != 401 && data.code != 419 && data.code !=403) {
    //     message.error(data.msg);
    //   }
    // },
    *getFormTreeColumns({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.getFormTreeColumns, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        callback&&callback({
          formColumns:data.data.tableList.length?data.data.tableList[0].columnList:[],
          formInfo:data.data.tableList.length?data.data.tableList[0]:[]
        });
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getNodeUser({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.getNodeUser, payload,'','applyModelConfig',{callback});
      let obj = {
          hostMessage:'',
          circularizeMessage:'',
          hostConfig:'',
          circularizeConfig:''
      }
      obj.hostMessage = data.data.handler.message;
      obj.hostConfig = data.data.handler.config;
      obj.circularizeMessage = data.data.reader.message;
      obj.circularizeConfig = data.data.reader.config;
      if(data.code==200){
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     nodeUser:data.data,
        //     msgConfig:obj
        //   }
        // })
        callback&&callback({
          nodeUser:data.data,
          msgConfig:obj
        });
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *addNodeUser({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.addNodeUser, payload,'','applyModelConfig',{callback});
      if(data.code==200){
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     formColumns:data.data.list
        //   }
        // })
        message.success('保存成功');
        callback&&callback();
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getHistoryList({ payload,callback}, { call, put, select }) {
      const {data} = yield call(apis.getBpmnProcessDefinitions, payload,'getHistoryList','applyModelConfig',{callback});
      if(data.code==200){
        callback&&callback(data.data.list);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getBizSolTree({ payload,callback }, { call, put, select }) {
      try {
        const  loop = (array)=>{
          for(var i=0;i<array.length;i++){
            array[i]['title'] = array[i]['nodeName']
            array[i]['key'] = array[i]['nodeId']
            array[i]['value'] = array[i]['nodeId']
            if(array[i]['nodeType'] != 'bizSol'){
              array[i]['disabled'] = true
            }
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children)
            }
          }
          return array
        }
        const {data} = yield call(apis.getBizSolTree, payload,'','applyModelConfig',{callback});
        if(data.code==200){
          let sourceTree = loop(data.data);
          yield put({
            type: 'updateStates',
            payload:{
              sysMenuList:sourceTree
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
    *getMenu({ payload,callback }, { call, put, select }) {
      try {
        const  loop = (array)=>{
          for(var i=0;i<array.length;i++){
            array[i]['title'] = array[i]['menuName']
            array[i]['key'] = array[i]['id']
            array[i]['value'] = array[i]['id']
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children)
            }
          }
          return array
        }
        const {data} = yield call(apis.getMenu, payload,'','applyModelConfig',{callback});
        if(data.code==200){
          let sourceTree = data.data.jsonResult.list;
          sourceTree = loop(sourceTree);
          yield put({
            type: 'updateStates',
            payload:{
              menuList:sourceTree,
            }
          })
          callback&&callback(sourceTree);
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addMenu({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(apis.addMenu, payload,'','applyModelConfig',{callback});
        if(data.code==200){
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getUgs({ payload,callback }, { call, put, select }) {
      try {
          const { data } = yield call(apis.getUgs, payload,'','applyModelConfig',{callback});
          if (data.code == 200) {
              let list = data.data.list;
              for(let i = 0;i<list.length;i++){
                  list[i]['nodeName'] = list[i]['ugName'];
                  list[i]['nodeId'] = list[i]['id'];
              }
              yield put({
                  type: 'updateStates',
                  payload: {
                    userGList: list
                  }
              })
              callback&&callback();
          } else if (data.code != 401 && data.code != 419 && data.code !=403) {
              message.error(data.msg);
          }
      } catch (e) {
      } finally {
      }

  },
  // //获取按钮列表
  // *getButtonsByGroup({ payload }, { call, put, select }) {
  //   const { data } = yield call(apis.getButtonsByGroup, payload,'','applyModelConfig');
  //   if(data.code==200){
  //     yield put({
  //       type:"updateStates",
  //       payload:{
  //         buttonList:data.data
  //       }
  //     })
  //   }else if (data.code != 401 && data.code != 419 && data.code !=403) {
  //     message.error(data.msg);
  //   }
  // },
  //获取按钮权限
  *getButtonAuth({ payload,callback }, { call, put, select }) {
    const { data } = yield call(apis.getButtonAuth, payload,'','applyModelConfig',{callback});
    if(data.code==200){
      //查找全局
      let oldButtonList = [];
      let actButtonList = [];
      data.data.buttonList.map((item)=>{
        if(item.authScopeType=='ALL'){
          oldButtonList.push(item);
        }else{
          actButtonList.push(item);
        }
      })
      let buttonList = [];
      if(actButtonList.length){
        oldButtonList.map((item,index)=>{
          let tmpActButtons = actButtonList.filter(i=>i.buttonId==item.buttonId);
          if(!tmpActButtons.length){
            buttonList.push(item)
          }else{
            buttonList.push(tmpActButtons[0])
          }
        })
      }else{
        buttonList= oldButtonList;
      }
      callback&&callback({
        oldButtonList:oldButtonList,
        buttonList:_.cloneDeep(buttonList)
      });
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  //刷新获取按钮权限
  *getReButtonAuth({ payload,callback,extraParams }, { call, put, select }) {
    const { data } = yield call(apis.getButtonAuth, payload,'getReButtonAuth','applyModelConfig',{callback,extraParams});
    if(data.code==200){
      const {buttonList} = extraParams?.state||{};
      //获取新增的button
      let newButtonList = [];
      data.data.buttonList.map((item)=>{
        let info = buttonList.filter(i=>i.buttonId==item.buttonId);
        if(!info||!info.length){
          newButtonList.push(item);
        }
      })
      extraParams?.setState({
        buttonList:data.data.buttonList
      })
      callback&&callback(newButtonList);
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  //获取全局的按钮权限
  // *getGolbalButtonAuth({ payload }, { call, put, select }) {
  //   const { data } = yield call(apis.getButtonAuth, payload,'','applyModelConfig');
  //   if(data.code==200){
  //     yield put({
  //       type:"updateStates",
  //       payload:{
  //         oldButtonList:data.data.buttonList
  //       }
  //     })
  //   }else if (data.code != 401 && data.code != 419 && data.code !=403) {
  //     message.error(data.msg);
  //   }
  // },
  //保存按钮权限
  *updateButtonAuth({ payload,callback }, { call, put, select }) {
    const { data } = yield call(apis.updateButtonAuth, payload,'','applyModelConfig',{callback});
    if(data.code==200){
      message.success('保存成功');
      callback&&callback();
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  // *getPosts({ payload,callback }, { call, put, select }) {
  //   try {
  //     const {data} = yield call(apis.getPosts, payload,'','applyModelConfig');
  //     if(data.code==200){
  //       let obj = data.data.list;
  //       for(let i=0;i<obj.length;i++){
  //         obj[i]['title'] = obj[i]['postName'];
  //         obj[i]['key'] = obj[i]['id'];
  //         obj[i]['value'] = obj[i]['id'];
  //         obj[i]['nodeName'] = obj[i]['postName'];
  //         obj[i]['nodeId'] = obj[i]['id'];
  //         obj[i]['nodeType'] ='POST';
  //       }
  //       yield put({
  //         type: 'updateStates',
  //         payload:{
  //           postList:obj
  //         }
  //       })
  //       callback&&callback()
  //     }else if (data.code != 401 && data.code != 419 && data.code !=403) {
  //       message.error(data.msg);
  //     }
  //   } catch (e) {
  //   } finally {
  //   }
  // },
  *getColAuthorty({ payload,callback }, { call, put, select }){
    const { data } = yield call(apis.getColAuthorty, payload,'','applyModelConfig',{callback});
    if(data.code==200){
      data.data.authList.map((item)=>{//操作列没有formColumnId这个值，所以增加一个用于信息操作
        if(item.formColumnCode=='OPERATE'){
          item.formColumnId=Math.round(Math.random()*100000000000000).toString();
        }
      })
      callback&&callback(data.data.authList);
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  //获取表单的全部字段
  *getAllCol({ payload,extraParams,callback }, { call, put, select }){
    const { data } = yield call(apis.getAllCol, payload,'','applyModelConfig',{extraParams});
    if(data.code==200){
      //获取主表的信息
      let mainTabel = {};
      data.data.tableList.map((item)=>{
        if(item.tableScope=='MAIN'){
          mainTabel = item;
        }
      })
      extraParams?.setState({
        allCol:data.data.tableList,
        colMainTabel:mainTabel
      })
      callback&&callback();
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  *deleteNodeAuth({ payload }, { call, put, select }){
    let nodeActId=payload.nodeActId;
    delete(payload.nodeActId);
    const { data } = yield call(apis.deleteNodeAuth, payload,'','applyModelConfig');
    if(data.code==200){
      message.success('删除成功');
      //重新获取列表
      const {stateObj} = yield select(state=>state.applyModelConfig)
      const query = parse(history.location.search);
      const bizSolId = query.bizSolId || getBizSolId();
      const {actId,bizFromInfo,procDefId} = stateObj[bizSolId];
      const deployFormId= bizFromInfo.formDeployId;
      yield put({
        type:"getAuthority",
        payload:{
          bizSolId,
          procDefId,
          actId:nodeActId?nodeActId:actId,
          deployFormId
        }
      })
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  *savePushInfoBind({ payload,extraParams }, { call, put, select }){
    let nodeActId=payload.nodeActId;
    delete(payload.nodeActId);
    const { data } = yield call(apis.savePushInfoBind, payload,'','applyModelConfig',{extraParams});
    if(data.code==200){
      //重新获取列表
      const {bizFromInfo, procDefId} = extraParams?.state||{};
      const deployFormId= bizFromInfo.formDeployId;
      yield put({
        type:"getPushInfoBind",
        payload:{
          bizSolId:payload.bizSolId,
          deployFormId,
          procDefId
        },
        extraParams
      })
      extraParams?.setState({
        isShowChoseModal: false
      })
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  *getPushInfoBind({ payload,extraParams }, { call, put, select }){
    let nodeActId=payload.nodeActId;
    delete(payload.nodeActId);
    const { data } = yield call(apis.getPushInfoBind, payload,'','applyModelConfig',{extraParams});
    if(data.code==200){
      extraParams?.setState({
        colList: data.data.colList
      })
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  *getFormDataDrive({ payload,callback,extraParams }, { call, put, select }){
    let nodeActId=payload.nodeActId;
    delete(payload.nodeActId);
    const { data } = yield call(apis.getFormDataDrive, payload,'','applyModelConfig',{callback,extraParams});
    if(data.code==200){
      callback&&callback(data.data.list);
      extraParams?.setState({
        dataDrivers: data.data.list
      })
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  *getBizSolEventReturn({ payload }, { call, put, select }){
    const { data } = yield call(apis.getBizSolEvent, payload,'getBizSolEventReturn','applyModelConfig');
    if(data.code==200){
      if(data.data&&data.data.list){
        data.data.list.forEach(item=>{
          item.key=Math.random().toString(36).slice(2)
        })
        return {
          bizEventList: data.data.list
        }
      }
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  *getBizSolEvent({ payload,extraParams }, { call, put, select }){
    const { data } = yield call(apis.getBizSolEvent, payload,'','applyModelConfig',{extraParams});
    if(data.code==200){
      if(data.data&&data.data.list){
        data.data.list.forEach(item=>{
          item.key=Math.random().toString(36).slice(2)
        })
        if(payload.bindSubject==false){
          extraParams?.setState({
            copyEventList: data.data.list
          })
        }else{
          extraParams?.setState({
            bizEventList: data.data.list
          })
        }
      }
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  *saveBizSolEvent({ payload,callback,extraParams }, { call, put, select }){
    let bizSolEventBaseVoList = JSON.parse(payload.eventBind);
    const {procDefId,bizFromInfo} = extraParams?.state||{};
    if(bizSolEventBaseVoList.length!=0){
      let nodeIsNull =  false
      for (let index = 0; index < bizSolEventBaseVoList.length; index++) {
        const element = bizSolEventBaseVoList[index];
        if(!element.subjects||element.subjects.length==0){
          nodeIsNull = true
          break;
        }
        //驱动不用校验参数绑定 MDZZ
        if(element.eventType == 'E' && (!element.hasOwnProperty('params'))){
          nodeIsNull = true
          break;
        }
        //驱动不用校验参数绑定 MDZZ
        if (element.eventType == 'E') {
          for (let j = 0; j < element.params?.length; j++) {
            if (!element.params[j].boundField) {
              nodeIsNull = true
              break;
            }
          }
        }
      }
      if(nodeIsNull){
        message.error('您还有事件未绑定参数或节点！')
        callback&&callback({
          loadings:false
        })
        return
      }

    }

    const { data } = yield call(apis.saveBizSolEvent, payload,'','applyModelConfig',{callback,extraParams});

    const formDeployId	= bizFromInfo.formDeployId;
    if(data.code==200){
      const resultArray = yield Promise.all([
        yield put({
          type:"getBizSolEventReturn",
          payload:{
            procDefId,
            formDeployId,
            bizSolId:extraParams?.bizSolId
          }
        })
      ])
      callback&&callback({
        loadings:false,
        ...resultArray
      })
      message.success('保存成功')
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }

  },
  *deleteBizSolEvent({ payload }, { call, put, select }){
    const { data } = yield call(apis.deleteBizSolEvent, payload,'','applyModelConfig');
    const {stateObj} = yield select(state=>state.applyModelConfig)
    const query = parse(history.location.search);
    const bizSolId = query.bizSolId || getBizSolId();
    const {procDefId,bizFromInfo} = stateObj[bizSolId];
    const formDeployId	= bizFromInfo.formDeployId;

    if(data.code==200){
      yield put({
        type:"getBizSolEvent",
        payload:{
          procDefId,
          formDeployId,
          bizSolId
        }
      })
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  *detailsTree({ payload,callback,extraParams }, { call, put, select }) {
    try {
      const {data} = yield call(apis.detailsTree, {...payload},'','applyModelConfig',{callback,extraParams});
      const  loop = (array)=>{
        for(var i=0;i<array.length;i++){
          array[i]['title'] = array[i]['actName']
          array[i]['key'] = array[i]['actId']
          array[i]['value'] = array[i]['actId']
          if(array[i].children&&array[i].children.length!=0){
            loop(array[i].children)
          }else{
            delete array[i]['children']
          }
        }
        return array
      }
      if(data.code==200){
       let sourceTree = loop(data.data.list);
       extraParams?.setState({
        procDefTreeList: sourceTree
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
  *nodeDetailsTree({ payload,callback,extraParams }, { call, put, select }) {
    const showDataTypes = ['userTask','exclusiveGateway','inclusiveGateway'];
    try {
      const {data} = yield call(apis.detailsTree, {...payload},'nodeDetailsTree','applyModelConfig',{callback,extraParams});
      const  loop = (array)=>{
        for(var i=0;i<array.length;i++){
          array[i]['title'] = array[i]['actName']
          array[i]['key'] = array[i]['actId']
          array[i]['value'] = array[i]['actId']
          array[i]['selectable'] = true;
          if(array[i]['actType']=='subProcess'){
            array[i]['disableCheckbox'] = true;
          }else{
            array[i]['disableCheckbox'] = false;
          }
          if(array[i].children&&array[i].children.length!=0){
            let delIndexArr=[]
            array[i].children.map((item,index)=>{
              if(item.children&&item.children.length!=0){
              }else if(showDataTypes.includes(item.actType)){
              }else{
                // array[i].children.splice(index,1) //导致索引错乱
                delIndexArr.push(index)
              }
            })
            for (let j = delIndexArr.length - 1; j >= 0; j--) {
              array[i].children.splice(delIndexArr[j], 1);
          }
            array[i]['selectable'] = false;
            loop(array[i].children)
          }else{
            delete array[i]['children']
          }
        }
        return array
      }
      if(data.code==200){
       let sourceTree = loop(data.data.list);
       extraParams?.setState({
        nodeTreeList: sourceTree
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
  *changeBpmnImgSort({payload,callback,extraParams},{call,put,select}){
    try{
      const {data} = yield call(apis.getChangeActSort, payload,'changeBpmnImgSort','applyModelConfig',{callback,extraParams});
      const {procDefTreeList} = extraParams?.state||{}
      const sort = data.data.sort
      const  loop = (array)=>{
        for(var i=0;i<array.length;i++){
          if(payload.id == array[i]['id']){
            array[i]['sort'] = sort
          }
          array[i]['title'] = array[i]['actName']
          array[i]['key'] = array[i]['actId']
          array[i]['value'] = array[i]['actId']
          // if(arr[i].actType=="endEvent"){
          //   arr[i].disabled = true
          // }
          if(array[i].children&&array[i].children.length!=0){
            loop(array[i].children)
          }else{
            delete array[i]['children']
          }
        }
        return array
      }
      if(data.code==200){
        let sourceTree = loop(procDefTreeList);
        extraParams?.setState({
          procDefTreeList: sourceTree
        })
        callback&&callback(sourceTree);
      }else if(data.code != 401){
        message.error(data.msg);
      }
    }catch(e){

    }
  },
  //获取事件注册参数
  *getEventRegisterParams({ payload, callback }, { call, put, select }) {
    const { data } = yield call(apis.getEventRegisterParams, payload,'getEventRegisterParams','applyModelConfig',{callback});
    console.log(data)
    if (data.code == 200) {
        callback&&callback(data?.data?.list);
        // yield put({
        //     type: 'updateStates',
        //     payload: {
        //         paramsData: data.data,
        //     }
        // })
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
    }
  },
  //保存规则脚本
  *saveRuleConfig({ payload, callback }, { call, put, select }) {
    const { data } = yield call(apis.saveStringUpload, payload,'saveRuleConfig','applyModelConfig',{callback});
    if (data.code == 200) {
        callback&&callback(data.data);
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
    }
  },
  *saveRule({ payload,callback }, { call, put, select }) {
    const { data } = yield call(apis.saveRule, payload,'saveRule','applyModelConfig',{callback});
    if (data.code == 200) {
      message.success('保存成功');
      let ruleData=JSON.parse(payload.rulesJson);
      callback&&callback({
        ruleId:data.data,
        ruleData:ruleData
      })
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
    }
  },
  // *copyRule({ payload, callback }, { call, put, select }) {
  //   const { data } = yield call(apis.copyRule, payload,'','applyModelConfig');
  //   if (data.code == 200) {
  //     message.success('修改成功');
  //     yield put({
  //       type:"updateStates",
  //       payload:{
  //         ruleId:data.data.id
  //       }
  //     })
  //   } else if (data.code != 401 && data.code != 419 && data.code !=403) {
  //       message.error(data.msg);
  //   }
  // },
  *getRule({ payload, callback,extraParams }, { call, put, select }) {

    const { data } = yield call(apis.getRule, payload,'getRule','applyModelConfig',{callback,extraParams});
    if (data.code == 200) {
      if(!data.data.list.length){
        data.data.list.push({//全局
          // subjectId:bizSolInfo.bpmFlag?'all':'1',
          subjectId:'0',
          operationTips:'',
          check:[],
          custom:[],
          enclosure:[]
        })
      }else{
        data.data.list.map((item)=>{
          // if(!item.subjectId){
          //   item.subjectId=bizSolInfo.bpmFlag?'all':'1'//全局的id为all
          // }
          item.check = item.check?JSON.parse(item.check):[];
          item.custom = item.custom?JSON.parse(item.custom):[];
          item.enclosure = item.enclosure?JSON.parse(item.enclosure):[]
        })
        const flag=data.data.list.find(item=>item.subjectId=='0')
        if(!flag){
          data.data.list.push({
            // subjectId:bizSolInfo.bpmFlag?'all':'1',
            subjectId:'0',
            operationTips:'',
            check:[],
            custom:[],
            enclosure:[]
          })
        }
      }
      let currentRule = data.data.list.length?data.data.list.filter(item=>item.subjectId=='0')[0]:{}//默认为全局
      // yield put({
      //   type:"updateStates",
      //   payload:{
      //     ruleData:data.data.list,
      //     selectActId:'',
      //     currentRule:currentRule
      //   }
      // })
      extraParams?.setState({
        ruleData:data.data.list,
        selectActId:'0',
        currentRule:currentRule
      })
      callback&&callback(currentRule)
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
    }
  },
  // 获取文件大小
  *getFileLengthURL_CommonDisk({ payload, callback }, { call, put, select }) {
    const { data } = yield call(apis.getFileLengthURL_CommonDisk, payload,'getFileLengthURL_CommonDisk','applyModelConfig',{callback});
    if (data.code == 200) {
      callback(data.data);
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg)
    }
  },
  // 下载
  *putDownLoad_CommonDisk({ payload, callback }, { call, put, select }) {
    const { data } = yield call(apis.putDownLoad_CommonDisk, payload,'putDownLoad_CommonDisk','applyModelConfig',{callback});
    if (data.code == 200) {
      callback(data.data.filePath, data.data.fileName);
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  // 设置bpmnView回显数据
  *setBpmnViewObj({payload,callback},{call,put}){
    // console.log(payload,"payload==>")
    yield put({
      type:"updateStatesGlobal",
      payload:{
        bpmnView:{...payload}
      }
    })
  },
  //复制配置
  *getBizSolVersionList({payload,extraParams},{call,put,select}){
    const {data}=yield call(apis.getBizSolVersionList,payload,'getBizSolVersionList','applyModelConfig',{extraParams})
    if (data.code == 200) {
      extraParams?.setState({
        formList:data.data.list,
        mainFormCurrent:data.data.currentPage,
        mainFormReturnCount:data.data.returnCount,
      })
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  *saveBizSolNode({payload,extraParams},{call,put,select}){
    const { data } = yield call(apis.saveBizSolNode, payload,'saveBizSolNode','applyModelConfig',{extraParams});
    if (data.code == 200) {
      message.success('同步环节配置成功')
      extraParams?.setState({
        isShowConfigModal:false,
        taskActs:[]
      })
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg)
    }
  },
  *getAttAuthList({payload,callback},{call,put,select}){
    const { data } = yield call(apis.getAttAuthList, payload);
    if (data.code == 200) {
      let tmpList = defaultAttAuth();
      if(data.data.authList&&data.data.authList.length){
        if(data.data.authList.length==1){//如果只有一个则补充另外一个
          //判断第一个是否存在
          if(data.data.authList[0].formColumnCode=='REL_FILE'){
            tmpList = _.concat(data.data.authList,tmpList[1]);
          }else{
            tmpList = _.concat(tmpList[0],data.data.authList);
          }
        }else{
          tmpList = data.data.authList
        }
      }
      debugger;
      callback(tmpList);
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg)
    }
  },
  *updateOtherAuth({payload,callback},{call,put,select}){
    const {data}=yield call(apis.updateOtherAuth,payload)
    if (data.code == 200) {
      callback&&callback();
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  *getAttAuthority({payload,callback},{call,put,select}){
    const {data}=yield call(apis.getAttAuthority,payload)
    if (data.code == 200) {
      let tmpAuthority = [];
      data.data.authList.map((item,index)=>{
        item.index=index+1;//用于删除
        tmpAuthority.push(item);
      })
      callback&&callback(tmpAuthority);
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  }, 
  *getFileMoudleList({payload,callback},{call,put,select}){
    const {data}=yield call(apis.getFileMoudleList,payload)
    if (data.code == 200) {
      callback&&callback(data);
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  *getAttachmentTemplate({payload,callback},{call,put,select}){//获取业务应用附件模板
    const {data}=yield call(apis.getAttachmentTemplate,payload)
    if (data.code == 200) {
      callback&&callback(data);
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  *saveAttachmentTemplate({payload,callback},{call,put,select}){//保存业务应用附件模板
    const {data}=yield call(apis.saveAttachmentTemplate,payload)
    if (data.code == 200) {
      callback&&callback(data);
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  *deleteAttachmentTemplate({payload,callback},{call,put,select}){//删除业务应用附件模板
    const {data}=yield call(apis.deleteAttachmentTemplate,payload)
    if (data.code == 200) {
      callback&&callback(data);
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
},
*setBpmnViewId({payload},{call,put}){
  yield put({
    type:"updateStatesGlobal",
    payload:{
      bpmnView:{...payload}
    }
  })
},
  reducers: {
    updateStatesGlobal(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
