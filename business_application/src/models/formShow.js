/**
 * 说明：bizTaskId只在待办事项中才会传值，其他事项中不传bizTaskId
 * bizInfoId和bizTaskId为办理状态，bizInfoId是编辑或者查看状态以是否送交为判断，只有bizSolId是新增
 */
import { message } from 'antd';
import apis from 'api';
import { history } from 'umi';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { getParam } from '../util/util';
import {SIGN_CONFIG} from '../service/constant'
const loopKey = (array, children, nodeKey) => {
  for (var i = 0; i < array.length; i++) {
    if (nodeKey == array[i]['key']) {
      array[i]['children'] = children;
    } else if (array[i].children && array[i].children.length != 0) {
      loopKey(array[i].children, children, nodeKey);
    }
  }
  return array;
};
const loopNoReKey = (array, children, nodeKey) => {
  for (var i = 0; i < array.length; i++) {
    if (nodeKey == array[i]['nodeId']) {
      array[i]['children'] = children;
    } else if (array[i].children && array[i].children.length != 0) {
      loopNoReKey(array[i].children, children, nodeKey);
    }
  }
  return array;
};
const loop = (array, children, nodeId) => {
  for (var i = 0; i < array.length; i++) {
    if (nodeId == array[i]['key']) {
      array[i]['children'] = children;
    } else if (array[i].children && array[i].children.length != 0) {
      loop(array[i].children, children, nodeId);
    }
  }
  return array;
};
const query = getParam();
console.log('query', query);
// if(window.location.href.includes('mobile')){
//   query = getParam()||{}
// }
export default {
  namespace: 'formShow',
  state: {
    stateObj: [], //所有的id的state
    sctiptMap: {}, // 按钮脚本字典
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
      });
    },
  },
  effects: {
    //初始化
    *initBacklogBizInfo({ payload, callback,location,extraParams}, { call, put, select }){
      const resultArray = yield Promise.all([
        yield put({
          type:"getBacklogBizInfo",
          payload:payload,
          extraParams
        }),
        yield put({
          type:'getSignConfig',
          payload:{

          }
        }),
        yield put({
          type:"getSignList",
          payload:{
            bizInfoId: payload.bizInfoId
          }
        }),
        yield put({
          type:'getTemporarySignList',
          payload:{
            bizInfoId: payload.bizInfoId,
            bizTaskId: payload.bizTaskId ? payload.bizTaskId : '',
          }
        })
      ])
      let bizInfo = resultArray[0]||{};
      let initInfos =  yield Promise.all([
        yield put({
          type:"initInfos",
          bizInfo:bizInfo,
          updateFlag:1,
          location:location,
          extraParams
        })
      ])
      let allInfos = initInfos[0];
      allInfos.bizInfo =bizInfo;
      allInfos.signConfig = resultArray[1]||{};
      allInfos.tableColumCodes = resultArray[2]||{};
      allInfos.commentJson = resultArray[3]||[];
      allInfos.updateFlag = 1;
      console.log('allInfos==',allInfos);
      callback&&callback(allInfos);
    },
    *initBizInfo({ payload, callback,location,extraParams}, { call, put, select, take }) {
      console.log('payload==',payload);
      let bizInfoArray = yield Promise.all([
        yield put({
          type:"getBizInfo",
          payload:payload
        }),
      ])
      let bizInfo = bizInfoArray[0]||{};
      console.log('bizInfo===',bizInfo);
      if(bizInfo?.bizInfoId){
        const resultArray = yield Promise.all([
          yield put({
            type:"initInfos",
            bizInfo:bizInfo,
            updateFlag:0,
            location:location,
            extraParams
          }),
          yield put({
            type:'getSignConfig',
            payload:{

            }
          })
        ])
        let allInfos = resultArray[0]
        allInfos.updateFlag = 0;
        allInfos.signConfig = resultArray[1]||{};
        allInfos.bizInfo = bizInfo;
        console.log('allInfos==',allInfos);
        callback&&callback(allInfos);
      }
    },
    *initInfos({bizInfo,updateFlag,location,extraParams}, { call, put, select, take }){
      console.log('location==',location);
      let returnData= {};
      let bussinessFormArr= yield Promise.all([
        yield put({//获取配置信息
          type:"getBussinessForm",
          payload:{
            bizSolId: bizInfo.bizSolId,
            procDefId: bizInfo.procDefId,
            formDeployId: bizInfo.formDeployId,
          }
        }),
        yield put({//获取按钮和字段权限
          type:"getFormAuthoritys",
          payload:{
            bizSolId:bizInfo.bizSolId,
            optType: bizInfo.operation != 'view'&&extraParams?.isUpdataAuth? 'HANDLE' : 'VIEW',
            bizInfoId:bizInfo.bizInfoId,
            procDefId:bizInfo.procDefId,
            actId:bizInfo.actId,
            deployFormId:bizInfo.formDeployId,
            buttonGroupId:bizInfo.buttonGroupId,
            operation:bizInfo?.operation||''
          }
        }),
        yield put({//获取数据（根据updateFlag判断是否请求接口）
          type:"getFormData",
          payload:{
            bizSolId: bizInfo.bizSolId,
            id:location?.query?.id||'0',
            bizInfoId: bizInfo.bizInfoId,
          },
          updateFlag
        })
      ])
      returnData.bussinessForm = bussinessFormArr[0]?.infos||{};
      returnData.formJson = bussinessFormArr[0]?.formJson||'';
      returnData.authoritys = bussinessFormArr[1]||{};
      returnData.buttonList = returnData.authoritys?.buttonList||[];
      returnData.authList = returnData.authoritys?.authList||[];
      let formValues = bussinessFormArr[2]||[];
      let template = returnData.bussinessForm?.template;
      if(returnData.formJson && Object.keys(returnData.formJson).length){
        if(updateFlag==1){
          if(formValues&&formValues.length){
            let tmpInfoArr = yield Promise.all([
              yield put({
                type:"resetBizRel",//附件上传清空临时的
                payload:{
                  bizInfoId: bizInfo.bizInfoId,
                  mainTableId: formValues[0].data[0].ID,
                }
              }),
              yield put({
                type:"getFormRelBizInfoList",
                payload:{
                  bizInfoId: bizInfo.bizInfoId,
                  mainTableId:formValues[0].data[0].ID,
                }
              }),
              yield put({
                type:"getFormAttachmentList",
                payload:{
                  bizInfoId: bizInfo.bizInfoId,
                  mainTableId: formValues[0].data[0].ID,
                }
              })
            ])
            console.log('tmpInfoArr=',tmpInfoArr);
            returnData.formRelBizInfoList = tmpInfoArr[1]||[];
            returnData.formAttachmentList = tmpInfoArr[2]||[];
            returnData.intFormValues = formValues;
            returnData.cutomHeaders = {
              deployFormId: bizInfo.formDeployId,
              mainTableId:formValues[0].data[0].ID,
              dsDynamic: returnData.bussinessForm.dsDynamic,
            }
          }
        }else{
          returnData.cutomHeaders = {
            deployFormId: bizInfo.formDeployId,
            mainTableId: bizInfo.formDataId,
            dsDynamic: returnData.bussinessForm.dsDynamic
          }
        }
        if(returnData.cutomHeaders.mainTableId&&extraParams?.isUpdataAuth&&bizInfo.operation!='view'){//编码
          // const serialNumArr = yield Promise.all([
          //   yield put({
          //     type:"getSerialNum",
          //     payload:{
          //       bizInfoId: bizInfo.bizInfoId,
          //       actId: bizInfo.actId,
          //       procDefId: bizInfo.procDefId,
          //       bpmFlag: bizInfo.bpmFlag,
          //       deployFormId: bizInfo.formDeployId,
          //       bizSolId: bizInfo.bizSolId,
          //       mainTableId:returnData.cutomHeaders.mainTableId,
          //       data:returnData.intFormValues?returnData.intFormValues[0].data[0].ID:''
          //     }
          //   }),
          // ])
          const serialCodeArr = yield Promise.all([
            yield put({
              type:"getConnectionCode",
              payload:{
                bizSolId: bizInfo.bizSolId,
                deployFormId:bizInfo.formDeployId,
                procDefId:bizInfo.procDefId,
                actId:bizInfo.actId,
                bpmFlag:bizInfo.bpmFlag
              }
            })
          ])
          returnData.serialCodeList = serialCodeArr?.[0]||[];
        }
      }
      if(template&&template!='0'){//关联文档页签
        const resultArray = yield Promise.all([
          yield put({
            type:"getRelBizInfoList",
            payload:{
              bizInfoId: bizInfo.bizInfoId,
            }
          }),
          yield put({
            type:"getAttachmentList",
            payload:{
              bizInfoId: bizInfo.bizInfoId,
              relType:'ATT'
            }
          }),
          yield put({//获取关联文档页签权限
            type:"getOtherAuthoritys",
            payload:{
              bizSolId:bizInfo.bizSolId,
              optType: bizInfo.operation != 'view'&&extraParams?.isUpdataAuth? 'HANDLE' : 'VIEW',
              bizInfoId:bizInfo.bizInfoId,
              procDefId:bizInfo.procDefId,
              actId:bizInfo.actId,
              deployFormId:bizInfo.formDeployId,
              type:'ASSOCIATED'
            }
          })
        ])
        returnData.relBizInfoList = resultArray[0]||[];
        returnData.attachmentList = resultArray[1]||[];
        returnData.attAuthList = resultArray[2]||[];
      }
      return returnData;
    },
    // 针对此文拟稿新文
    *postDaftNewDoc({payload,callback},{call,put}){
      const {data} = yield call(apis.postDaftNewDoc,payload)
      if(data.code == 200){
        callback&&callback(data.data)
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);  
      }    
    },
    //获取任务业务配置
    *getBizInfo({ payload, callback }, { call, put, select, take }) {
      const { data } = yield call(apis.getBizInfo, payload);
      if (data.code == 200) {
        return data.data;
      }else if(data.code == 401){
        let tmpArr = yield Promise.all([
          yield put({
            type:"getBizInfo",
            payload:payload,
            callback:callback
          })
        ])
        return tmpArr[0];
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
        return {}
      }else{
        return {}
      }
    },
    //获取绑定编号的关联关系
    *getConnectionCode({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getConnectionCode,
        payload,
      );
      if (data.code == 200) {
        return data.data.codeList;
      }else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
        return []
      }else{
        return []
      }
    },
    //获取待办任务业务配置
    *getBacklogBizInfo({ payload, extraParams }, { call, put, select }) {
      const { data } = yield call(
        apis.getBacklogBizInfo,
        payload,
      );
      if (data.code == 200) {
        console.log('extraParams.operation==',extraParams);
        if(typeof extraParams.operation!='undefined'&&extraParams.operation){
          data.data.operation=extraParams.operation
        }
        return data.data;
      }else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
        return {}
      }else{
        return {}
      }
    },
    //获取按钮和字段权限
    *getFormAuthoritys({ payload}, { call, put, select }) {
      let operation = payload.operation;
      delete(payload.operation);
      const { data } = yield call(
        apis.getFormAuthoritys,
        payload
      );
      if (data.code == 200) {
        //查看页面，要把“办理”类型的按钮过滤掉
        let tmpList = [];
        data.data.buttonList.map((item) => {
            if(payload.optType == 'VIEW'){
              if(item.operationType == 'VIEW'){
                tmpList.push(item);
              }
            }else{
              tmpList.push(item);
            }
        });
        const groupButtonList = _.groupBy(
          _.orderBy(tmpList, ['groupName'], ['desc']),
          'groupName',
        );
        return {buttonList:groupButtonList,authList:data.data.authList}
      }else if(data.code == 401){
        let tmpArr = yield Promise.all([
          yield put({
            type:"getFormAuthoritys",
            payload:payload
          })
        ])
        return tmpArr[0];
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
        return {buttonList:[],authList:[]}
      }else{
        return {buttonList:[],authList:[]}
      }
    },
    //获取表单数据
    *getFormData({ payload,updateFlag }, { call, put, select }) {
      if(updateFlag==1){
        const { data } = yield call(apis.getFormData, payload);
        if (data.code == 200) {
          return data.data.list;
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        } else if(data.code == 401){
          let tmpArr = yield Promise.all([
            yield put({
              type:"getFormData",
              payload:payload,
              updateFlag:updateFlag
            })
          ])
          return tmpArr[0];
        }
        return '';
      }else{
        return '';
      }
    },
    //保存表单数据
    *saveFormData({ payload, callback,isNoMessage }, { call, put, select }) {
      const { data } = yield call(apis.saveFormData, payload, '', 'formShow',{callback:callback,isNoMessage:isNoMessage});
      if (data.code == 200) {
        if(!isNoMessage){
          message.success('保存成功');
        }
        //将返回的id赋值回去
        // let formdata = JSON.parse(payload.formdata);
        // formdata[0].data[0].ID = data.data.id;
        // yield put({
        //   type: 'updateStates',
        //   payload: {
        //     //formdata: formdata,
        //     submitSecurityId: data.data.id,
        //   },
        // });
        localStorage.setItem('submitSecurityId', data.data.id);
        callback && callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取任务办理送交环节
    *getTaskDealNode({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getTaskDealNode,
        payload,
        '',
        'formShow',
        {callback:callback}
      );
      if (data.code == 200) {
        callback && callback(data.data,data.data.taskActList.length
          ? data.data.taskActList[0].actId
          : []);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取流程启动送交环节
    *getProcessStartNode({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getProcessStartNode,
        payload,
        '',
        'formShow',
        {callback:callback}
      );
      if (data.code == 200) {
        callback && callback(data.data,data.data.taskActList.length
          ? data.data.taskActList[0].actId
          : []);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //流程启动的时候的送交
    *processStart({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.processStart, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        message.success(data.msg);
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //流程送交
    *processSend({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.processSend, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        message.success(data.msg);
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //流程驳回
    *processBack({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.processBack, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        message.success(data.msg);
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //全局
    *getRule({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getRule, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        callback && callback(data.data.list);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //根据url获取规则设置的数据
    *getRuleSetData({ payload, callback }, { call, put, select }) {
      return yield fetch(payload.url).then((res) => {
        return res
          .json()
          .then((data) => {
            return data;
          })
          .catch((err) => {
            // 将 err 转换为字符串类型
            const errorMessage = err instanceof Error ? err.message : String(err);
            message.error(errorMessage);
          });
      });
      // console.log('res=====',response)
      // debugger;
      // if (data.code == 200) {

      //   return data.data;
      // } else if (data.code != 401 && data.code != 419 && data.code !=403) {
      //   message.error(data.msg);
      // }
    },
    // 获取文件大小
    *getFileLengthURL_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getFileLengthURL_CommonDisk, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 下载
    *putDownLoad_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.putDownLoad_CommonDisk, payload, '', 'formShow',{callback:callback})
      if (data.code == 200) {
        callback(data.data.filePath, data.data.fileName);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //编码校验
    *getCheckEncoding({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getCheckEncoding, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        if (data.data.msg) {
          message.error(data.data.msg);
        } else {
          callback(data.data);
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getLaborAmountList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getLaborAmountList, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        callback(data.data.list);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *queryUsersNoRule({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.queryUsersNoRule, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        callback && callback(data.data.list);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getPostUserList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getPostUserList,
        payload,
        '',
        'formShow',
        {callback:callback}
      );
      if (data.code == 200) {
        callback && callback(data.data.list);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getGroupUserList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getGroupUserList,
        payload,
        '',
        'formShow',
        {callback:callback}
      );
      if (data.code == 200) {
        //返回的格式不符合要求，做截取
        data.data.list.map((item) => {
          let deptNames = item.deptName ? item.deptName.split('>') : '';
          item.deptName = deptNames ? deptNames[deptNames.length - 1] : '';
          item.identity = item.postName;
        });
        callback && callback(data.data.list);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getRoleUserList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getRoleUserList,
        payload,
        '',
        'formShow',
        {callback:callback}
      );
      if (data.code == 200) {
        data?.data?.list.map((item) => {
          item.identity = item.postName;
        });
        callback && callback(data?.data?.list || []);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //根据身份获取可送交的全局审核人
    *getGlobalCheckerList({payload,callback},{call,put,select}){
      const {data}=yield call(apis.getGlobalChecker,payload,'','formShow',{callback:callback})
      if (data.code == 200) {
        data?.data?.list.map((item) => {
          item.identity = item.postName;
          item.userId=item.checkerId
          item.userName=item.checkerName
        });
        callback && callback(data?.data?.list || []);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //查询自定送交人员
    *getCustomUserList({ payload,callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getCustomUserList,
        payload,
        '',
        'formShow',
        {callback:callback}
      );
      if (data.code == 200) {
        callback&&callback(data?.data?.list || [])
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *queryPostUser({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.queryPostUser, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            userList: data.data.orgRefUsers,
            searchUserList: data.data,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getBizTaskNodes({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getBizTaskNodes,
        payload,
        '',
        'formShow',
        {callback:callback}
      );
      if (data.code == 200) {
        let obj = JSON.parse(JSON.stringify(data.data));
        yield put({
          type: 'updateStates',
          payload: {
            bizTaskNodes: obj,
          },
        });
        callback && callback(obj);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getUsersByIds({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.queryUsersNoRule, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        callback&&callback(data.data.list)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取全部组结构
    *getGroupList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getSendUserTree,
        payload,
        '',
        'formShow',
        {callback:callback}
      );
      if (data.code == 200) {
        // data.data.list &&
        //   data.data.list.map((item) => {
        //     let nodeName = '';
        //     let nodeId = '';
        //     let nodeType = '';
        //     let subordinate = '';
        //     if (item.length) {
        //       item.map((children) => {
        //         // console.log('children=', children);
        //         if (nodeName) {
        //           nodeName = nodeName + ',' + children.nodeName;
        //           nodeId = nodeId + ',' + children.nodeId;
        //           nodeType = nodeType + ',' + children.nodeType;
        //           subordinate = children.subordinate;
        //         } else {

        //           nodeName = children.nodeName;
        //           nodeId = children.nodeId;
        //           nodeType = children.nodeType;
        //           subordinate = children.subordinate;
        //         }
        //       });
        //       firstGroupData.push({
        //         nodeName: nodeName,
        //         nodeId: nodeId,
        //         nodeType: nodeType,
        //         subordinate: subordinate,
        //       });
        //     }
        //   });
        // console.log('firstGroupData=', firstGroupData);
        //增加key,相同的数展开收起不影响
        // data.data?.['ORG']?.map((item) => {
        //   item.key = uuidv4();
        // });
        // data.data?.['ROLE']?.map((item) => {
        //   item.key = uuidv4();
        // });
        // data.data?.['CUSTOM']?.map((item) => {
        //   item.key = uuidv4();
        // });
        let groupData = data.data;//组数据
        let treeData = [];
        let groupActiveKey = ''; //默认有数据的那个为第一个
        if(data.data?.['ORG']?.length){
          treeData = data.data?.['ORG']
          groupActiveKey = 'ORG';
        }else if(data.data?.['ROLE']?.length){
          treeData = data.data?.['ROLE']
          groupActiveKey = 'ROLE';
        }else{
          groupActiveKey = 'CUSTOM';
          treeData = data.data?.['CUSTOM']
        }
        callback && callback(groupData,treeData,groupActiveKey);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取该节点的子数据
    *getSubordinateSendTree({ payload, callback,state }, { call, put, select }) {
      const { data } = yield call(
        apis.getSubordinateSendTree,
        payload,
        '',
        'formShow',
        {callback,state}
      );
      const { treeData} =state;
      if (data.code == 200) {
        if (data.data?.list && data.data.list.length != 0) {
          // data.data?.list &&
          //   data.data.list[0].map((item) => {
          //     item.key = uuidv4();
          //   });
          let newTreeData = loopKey(
            treeData,
            data.data.list[0],
            payload.nodeKey,
          );
          callback && callback(newTreeData);
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getSearchSendTree({ payload,callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getSearchSendTree,
        payload,
        '',
        'formShow',
        {callback:callback}
      );
      if (data.code == 200) {
        callback&&callback(data.data.list)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *saveBizTaskSend({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.saveBizTaskSend,
        payload,
        '',
        'formShow',
        {callback:callback}
      );
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            bizTaskNodes: {},
            backNodes: {},
            checkNodeIds: [],
          },
        });
        if (payload.backFlag) {
          message.success('驳回成功');
        } else {
          message.success('送交成功');
        }
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //转办
    *transferTask({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.transferTask, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        message.success('转办成功');
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //撤销
    *revokeBiz({ payload,callback }, { call, put, select }) {
      const { data } = yield call(apis.revokeBiz, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        message.success('撤销成功');
        //TODO撤销为待办状态以后按钮需要变化及权限变化
        callback&&callback()
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //办结
    *completeBiz({ payload,callback }, { call, put, select }) {
      const { data } = yield call(apis.completeBiz, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        message.success('办结成功');
        //TODO撤销为待办状态以后按钮需要变化及权限变化
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //驳回环节 d
    *backNodes({ payload, callback}, { call, put, select }) {
      const { data } = yield call(apis.backNodes, payload, '', 'formShow',{callback:callback});
      let obj = {};
      if (data.code == 200) {
        //合并list
        let tmpList = [];
        data.data.list.map((item)=>{
          item.taskBackNodeList.map((childrenItem)=>{
            childrenItem.returnStrategy=item.returnStrategy;
            tmpList.push(childrenItem);
          })
        })
        callback && callback(tmpList);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getDepts({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getDepts, payload, '', 'formShow',{callback:callback});
        if (data.code == 200) {
          yield put({
            type: 'updateStates',
            payload: {
              middleData: data.data.list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getOrgs({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getOrgs, payload, '', 'formShow',{callback:callback});
        if (data.code == 200) {
          yield put({
            type: 'updateStates',
            payload: {
              middleData: data.data.list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *queryUser({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(apis.queryUser, payload, '', 'formShow',{callback:callback});
        if (data.code == 200) {
          yield put({
            type: 'updateStates',
            payload: {
              middleData: data.data.list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //生成编码
    // *getSerialNum({ payload, callback }, { call, put, select }) {
    //   const { data } = yield call(apis.getSerialNum, payload);
    //   if (data.code == 200) {
    //     return data.data?.serialNumList||[]
    //   } else if (data.code != 401 && data.code != 419 && data.code != 403){
    //     message.error(data.msg);
    //   }else if(data.code == 401){
    //     let tmpArr = yield Promise.all([
    //       yield put({
    //         type:"getSerialNum",
    //         payload:payload
    //       })
    //     ])
    //     return tmpArr[0];
    //   }
    //   return {
    //     confirmSerialNumList:[],
    //     serialNumList:[]
    //   }
    // },
    //获取流程变量
    *getProcessVariables({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getProcessVariables,
        payload,
        '',
        'formShow',
        {callback:callback}
      );
      if (data.code == 200) {
        callback && callback();
        let array = [];
        if (data.data.dataList && data.data.dataList.length != 0) {
          for (let index = 0; index < data.data.dataList.length; index++) {
            const element = data.data.dataList[index];
            element['data'] = [_.zipObject(element.data, [])];
            array[index] = element;
          }
        }
        yield put({
          type: 'updateStates',
          payload: {
            paramsData: data.data,
            actData: array,
          },
        });
      } else {
        message.error(data.msg);
      }
    },
    //获取登录用户信息
    // *getCurrentUserInfo({ payload }, { call, put, select }) {
    //   const { data } = yield call(
    //     apis.getCurrentUserInfo,
    //     payload,
    //     '',
    //     'formShow'
    //   );
    //   if (data.code == 200) {
    //     yield put({
    //       type: 'updateStates',
    //       payload: {
    //         userInfo: data.data,
    //       },
    //     });
    //   } else if (data.code != 401 && data.code != 419 && data.code != 403) {
    //     message.error(data.msg);
    //   }
    // },
    *getCurrentOrg({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getCurrentOrg, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        callback&&callback([data.data])
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //弹框中没有重复的单位id的时候用这个
    *getNoReOrgChildren({ payload,treeData,callback}, { call, put, select }) {
      let nodeKey = payload.nodeKey;
      delete payload.nodeKey;
      try {
        const { data } = yield call(
          apis.getOrgChildren,
          { ...payload },
          '',
          'formShow',
          {treeData,callback}
        );
        if (data.code == 200) {
          callback&&callback(loopNoReKey(treeData, data.data.list, nodeKey))
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg, 5);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //送交的时候办理人有可能有重复的单位id，所有加一个key
    *getOrgChildren({ payload,treeData,callback}, { call, put, select }) {
      let nodeKey = payload.nodeKey;
      delete payload.nodeKey;
      try {
        const { data } = yield call(
          apis.getOrgChildren,
          { ...payload },
          '',
          'formShow',
          {treeData,callback}
        );
        data.data?.list &&
          data.data.list.map((item) => {
            item.key = uuidv4();
          });
        if (data.code == 200) {
          callback&&callback(loopKey(treeData, data.data.list, nodeKey))
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg, 5);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //传阅
    *circulateTask({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.circulateTask,
        { ...payload },
        '',
        'formShow',
        {callback}
      );
      if (data.code == 200) {
        message.success('传阅成功');
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *uploadFile({ payload, callback }, { call, put, select }) {
      // console.log('uploadFile');
      const { data } = yield call(apis.uploadFile, payload, '', 'formShow',{callback});
      if (data.code == 200) {
        callback && callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *saveAttachment({ payload }, { call, put, select }) {
      //保存表单关联附件
      const { data } = yield call(apis.saveAttachment, payload, '', 'formShow');
      if (data.code == 200) {
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *presignedUploadUrl({ payload, callback }, { call, put, select }) {
      //预上传
      const { data } = yield call(apis.presignedUploadUrl, payload, '', 'formShow',{callback});
      if (data.code == 200) {
        callback && callback(data.data.presignedUploadUrl);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getFormAttachmentList({ payload }, { call, put, select }) {
      //获取表单已上传文件列表
      const { data } = yield call(apis.getFormAttachmentList, payload);
      if (data.code == 200) {
        return data.data;
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }else if(data.code == 401){
        let tmpArr = yield Promise.all([
          yield put({
            type:"getFormAttachmentList",
            payload:payload
          })
        ])
        return tmpArr[0];
      }
      return []
    },
    // *deleteAttachment({ payload, callback }, { call, put, select }) {
    //   //删除表单已上传文件
    //   const { data } = yield call(apis.deleteAttachment, payload, '', 'formShow');
    //   const { stateObj } = yield select((state) => state.formShow);
    //   const { stateInfo } = yield select(
    //     (state) => state.designableBiz,
    //   );
    //   const cutomHeaders = stateObj[getParam()?.bizSolId + '_' + getParam()?.bizInfoId + '_' + getParam()?.currentTab]?.cutomHeaders
    //   const bizModal = stateInfo?.[cutomHeaders?.mainTableId]?.bizModal
    //   const bizModalProps = stateInfo?.[cutomHeaders?.mainTableId]?.bizModalProps
    //   const { bizSolId, bizInfoId, currentTab, bizTaskId } =
    //     bizModal && bizModalProps?.bizSolId ? bizModalProps : getParam();
    //   // const bizSolId = query.bizSolId;
    //   // const bizInfoId = query.bizInfoId;
    //   // const currentTab = query.currentTab;
    //   const { bizInfo } =
    //     stateObj[bizSolId + '_' + bizInfoId + '_' + currentTab];
    //   if (data.code == 200) {
    //     if (payload.relType == 'FORM') {
    //       //获取表单已上传文件列表
    //       yield put({
    //         type: 'getFormAttachmentList',
    //         payload: {
    //           bizInfoId: bizInfoId || bizInfo.bizInfoId,
    //         },
    //       });
    //     } else {
    //       yield put({
    //         //获取业务应用已上传文件列表
    //         type: 'getAttachmentList',
    //         payload: {
    //           bizInfoId: bizInfoId || bizInfo.bizInfoId,
    //           relType: 'ATT',
    //         },
    //       });
    //     }
    //   } else if (data.code != 401 && data.code != 419 && data.code != 403) {
    //     message.error(data.msg);
    //   }
    // },
    *getAttachmentList({ payload }, { call, put, select }) {
      //获取业务应用已上传文件列表
      const { data } = yield call(apis.getAttachmentList, payload);
      if (data.code == 200) {
        //将filePath转换成onlyFilePath太长保存有问题
        data.data.list.map((item) => {
          item.src = item.filePath;
          item.fileUrl = item.filePath;
          item.filePath = item.onlyFilePath;
        });
        return data.data.list;
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }else if(data.code == 401){
        let tmpArr = yield Promise.all([
          yield put({
            type:"getAttachmentList",
            payload:payload
          })
        ])
        return tmpArr[0];
      }
      return []
    },
    *getBussinessForm({ payload, callback }, { call, put, select }) {
      //获取biz
      // console.log('payload111', payload);
      const { data } = yield call(apis.getBussinessForm, payload);
      if (data.code == 200) {
        // yield put({//放到state
        //   type: 'updateStates',
        //   payload: {
        //     bussinessForm: data.data,
        //   },
        // });
        var jsonUrl = window.location.href.includes('/mobile')?data.data?.appJsonUrl:data.data?.formJsonUrl
        if(!jsonUrl){
          return {infos:data.data,formJson:{}}
        }
        let response = yield fetch(jsonUrl).then((res) => {
          return res
            .json()
            .then((data) => {
              return data;
            })
            .catch((err) => {
              // 将 err 转换为字符串类型
              const errorMessage = err instanceof Error ? err.message : String(err);
              message.error(errorMessage);
            });
        });
        return {infos:data.data,formJson:response}
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }else if(data.code == 401){
        let tmpArr = yield Promise.all([
          yield put({
            type:"getBussinessForm",
            payload:payload
          })
        ])
        return tmpArr[0];
      }
      return {infos:[],formJson:''};
    },
    *saveRelBizInfo({ payload, callback }, { call, put, select }) {
      //保存业务建模关联事项
      const { data } = yield call(apis.saveRelBizInfo, payload, '', 'formShow');
      if (data.code == 200) {
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // *deleteRelBizInfo({ payload, callback }, { call, put, select }) {
    //   //删除业务建模关联事项
    //   const { data } = yield call(apis.deleteRelBizInfo, payload, '', 'formShow');
    //   const { stateObj } = yield select((state) => state.formShow);
    //   const { stateInfo } = yield select(
    //     (state) => state.designableBiz,
    //   );
    //   const cutomHeaders = stateObj[getParam()?.bizSolId + '_' + getParam()?.bizInfoId + '_' + getParam()?.currentTab]?.cutomHeaders
    //   const bizModal = stateInfo?.[cutomHeaders?.mainTableId]?.bizModal
    //   const bizModalProps = stateInfo?.[cutomHeaders?.mainTableId]?.bizModalProps
    //   const { bizSolId, bizInfoId, currentTab, bizTaskId } =
    //     bizModal && bizModalProps?.bizSolId ? bizModalProps : getParam();
    //   // const bizSolId = query.bizSolId;
    //   // const bizInfoId = query.bizInfoId;
    //   // const currentTab = query.currentTab;
    //   const { bizInfo } =
    //     stateObj[bizSolId + '_' + bizInfoId + '_' + currentTab];
    //   if (data.code == 200) {
    //     if (payload.relType == 'FORM') {
    //       //获取表单中关联事项列表
    //       yield put({
    //         type: 'getFormRelBizInfoList',
    //         payload: {
    //           bizInfoId: bizInfoId || bizInfo.bizInfoId,
    //         },
    //       });
    //     } else {
    //       yield put({
    //         //获取业务建模关联事项列表
    //         type: 'getRelBizInfoList',
    //         payload: {
    //           bizInfoId: bizInfoId || bizInfo.bizInfoId,
    //         },
    //       });
    //     }
    //   } else if (data.code != 401 && data.code != 419 && data.code != 403) {
    //     message.error(data.msg);
    //   }
    // },
    *getRelBizInfoList({ payload, callback }, { call, put, select }) {
      //获取业务建模关联事项列表
      const { data } = yield call(apis.getRelBizInfoList, payload);
      if (data.code == 200) {
        return data.data.list;
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }else if(data.code == 401){
        let tmpArr = yield Promise.all([
          yield put({
            type:"getRelBizInfoList",
            payload:payload
          })
        ])
        return tmpArr[0];
      }
      return [];
    },
    *getFormRelBizInfoList({ payload, callback }, { call, put, select }) {
      //获取表单中关联事项列表
      const { data } = yield call(apis.getFormRelBizInfoList, payload);
      if (data.code == 200) {
        return data.data;
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }else if(data.code == 401){
        let tmpArr = yield Promise.all([
          yield put({
            type:"getFormRelBizInfoList",
            payload:payload
          })
        ])
        return tmpArr[0];
      }
      return [];
    },
    *getAllWork({ payload,callback }, { call, put, select }) {
      const { data } = yield call(apis.getAllWork, payload, '', 'formShow',{callback});
      if (data.code == 200) {
        callback&&callback(data.data)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // *updateAttachment({ payload, relType, updateType }, { call, put, select }) {
    //   //修改关联文档排序或重命名
    //   const { data } = yield call(apis.updateAttachment, payload, '', 'formShow');
    //   const { stateObj } = yield select((state) => state.formShow);
    //   const { stateInfo } = yield select(
    //     (state) => state.designableBiz,
    //   );
    //   const cutomHeaders = stateObj[getParam()?.bizSolId + '_' + getParam()?.bizInfoId + '_' + getParam()?.currentTab]?.cutomHeaders
    //   const bizModal = stateInfo?.[cutomHeaders?.mainTableId]?.bizModal
    //   const bizModalProps = stateInfo?.[cutomHeaders?.mainTableId]?.bizModalProps
    //   const { bizSolId, bizInfoId, currentTab, bizTaskId } =
    //     bizModal && bizModalProps?.bizSolId ? bizModalProps : getParam();
    //   // const bizSolId = query.bizSolId;
    //   // const bizInfoId = query.bizInfoId;
    //   // const currentTab = query.currentTab;
    //   const { bizInfo } =
    //     stateObj[bizSolId + '_' + bizInfoId + '_' + currentTab];
    //   if (data.code == 200) {
    //     yield put({
    //       type: 'updateStates',
    //       payload: {
    //         reNameVisible: false,
    //       },
    //     });
    //     if (updateType == 'UPLOAD') {
    //       if (relType == 'FORM') {
    //         //获取表单已上传文件列表
    //         yield put({
    //           type: 'getFormAttachmentList',
    //           payload: {
    //             bizInfoId: bizInfoId || bizInfo.bizInfoId,
    //           },
    //         });
    //       } else {
    //         yield put({
    //           //获取业务应用已上传文件列表
    //           type: 'getAttachmentList',
    //           payload: {
    //             bizInfoId: bizInfoId || bizInfo.bizInfoId,
    //             relType: 'ATT',
    //           },
    //         });
    //       }
    //     } else {
    //       if (relType == 'FORM') {
    //         //获取表单中关联事项列表
    //         yield put({
    //           type: 'getFormRelBizInfoList',
    //           payload: {
    //             bizInfoId: bizInfoId || bizInfo.bizInfoId,
    //           },
    //         });
    //       } else {
    //         yield put({
    //           //获取业务建模关联事项列表
    //           type: 'getRelBizInfoList',
    //           payload: {
    //             bizInfoId: bizInfoId || bizInfo.bizInfoId,
    //           },
    //         });
    //       }
    //     }
    //   } else if (data.code != 401 && data.code != 419 && data.code != 403) {
    //     message.error(data.msg);
    //   }
    // },
    //保存手写签批
    *saveTemporarySign({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.saveTemporarySign, payload, '', 'formShow');
      if (data.code == 200) {
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *changeBizStatus({ payload }, { call, put, select }) {
      const { data } = yield call(apis.changeBizStatus, payload, '', 'formShow');
      if (data.code == 200) {
        //message.success('保存成功');
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取暂存手写签批
    *getTemporarySignList({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getTemporarySignList, payload);
      if (data.code == 200) {
        return data?.data?.tableColumCodes||[];
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }else if(data.code == 401){
        let tmpArr = yield Promise.all([
          yield put({
            type:"getTemporarySignList",
            payload:payload
          })
        ])
        return tmpArr[0];
      }
      return [];
    },
    //获取已签批列表
    *getSignList({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getSignList, payload);
      if (data.code == 200) {
        return data?.data?.tableColumCodes
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }else if(data.code == 401){
        let tmpArr = yield Promise.all([
          yield put({
            type:"getSignList",
            payload:payload
          })
        ])
        return tmpArr[0];
      }
      return {};
    },
    //获取签批配置
    *getSignConfig({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getSignConfig, payload);
      if (data.code == 200) {
        let signConfig = '';
        if(!data?.data?.id||data?.data?.id=='null'||data?.data?.createTime=='null'){
          signConfig = SIGN_CONFIG;
        }else{
          signConfig = data?.data;
        }
        return signConfig;
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }else if(data.code == 401){
        let tmpArr = yield Promise.all([
          yield put({
            type:"getSignConfig",
            payload:payload
          })
        ])
        return tmpArr[0];
      }
      return {};
    },
    // 打印按钮获取链接
    *getTemplateURL({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getPrintUrl, payload, '', 'formShow',{callback});
      if (data.code == 200) {
        callback && callback(data.data.url || '');
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //跟踪取消跟踪
    *traceWork({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.traceWork, {
        bizInfoIds: payload.bizInfoIds,
        traceType: payload.traceType,
      }, '', 'formShow',{callback});
      if (data.code == 200) {
        message.success('设置成功');
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *deleteV2BizRelAtt({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.deleteV2BizRelAtt,payload, '', 'formShow',{callback});
      if (data.code == 200) {
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *saveAppendBizRelAtt({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.saveAppendBizRelAtt,payload, '', 'formShow',{callback});
      if (data.code == 200) {
        callback && callback(data.data?.ids || []);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *updateBizRelAttName({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.updateBizRelAttName,payload, '', 'formShow',{callback});
      if (data.code == 200) {
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getFormTabs({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getFormTabs,payload);
      if (data.code == 200) {
        callback && callback(data.data.tabs);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *editableBizTask({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.editableBizTask,payload);
      if (data.code == 200) {
        if(data.data.editable){
          callback && callback();
        }else{
          message.error('表单事项的办理状态不对');
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取其他页签的授权权限
    *getOtherAuthoritys({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getOtherAuthoritys,payload);
      if (data.code == 200) {
        return data?.data?.authList
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //编码校验
    *geCheckEncodingByFilterObject({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.geCheckEncodingByFilterObject, payload, '', 'formShow',{callback:callback});
      if (data.code == 200) {
        if (data.data.msg) {
          message.error(data.data.msg);
        } else {
          callback(data.data);
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
  },
  reducers: {
    updateStatesGlobal(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
