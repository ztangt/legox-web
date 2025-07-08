import React, { useEffect, useState,useImperativeHandle } from 'react';
import FormShow from './formShow';
import { connect, history, getDvaApp } from 'umi';

import MicroApp from './microApp';
import { v4 as uuidv4 } from 'uuid';
import { message,Modal } from 'antd';
import { getUrlParams } from '../../util/util';
import { useSetState } from 'ahooks'
import {getCustomFile} from './formUtil'
import {SIGN_CONFIG} from '../../service/constant'
function Index({
  location,
  dispatch,
  isUpdataAuth,
  formShow,
  allExtraQuery,
  tabItems,
  onTabChange,
  extraQuery,
  targetKey,
  onDetail
}) {
  const {leftTreeData,buttonFormAuthInfo,urlFrom,customOperation } = formShow;
  console.log('operation==',operation);
  const [state, setState] = useSetState({
    bizSolId:extraQuery?.bizSolId||location.query?.bizSolId||'',
    bizInfoId:extraQuery?.bizInfoId||location.query?.bizInfoId||'',
    bizTaskId:extraQuery?.bizTaskId||location.query?.bizTaskId||'',
    id:extraQuery?.id||location.query?.id||'',//从单据的maintableId
    buttonList: [],//按钮
    buttonListAuth:[],//按钮权限
    authList:[],//字段权限
    bizInfo:{},//建模信息
    bussinessForm:{},//配置信息
    formJson:'',//表单scma
    cutomHeaders: {
      mainTableId: '',
      deployFormId: '',
      dsDynamic: '',
    },
    tmpUrlFrom:urlFrom,//文件来源
    operation:customOperation,//多人拟稿是否可编辑，用于列表按钮的配置
    signConfig:{},//签批配置
    updateFlag:0,//用于判断是否是新增还是修改，保存接口需要
    isShowRule:false,//是否显示右侧的规则定义
    ruleData: [], //规则定义
    isErrors:[],
    relBizInfoList:[],
    selectedNodeId: '',
    selectedDataIds: [],
    treeData: [],
    currentNode: {},
    expandedKeys: [],
    treeSearchWord: '',
    selectedDatas: [],
    originalData: [],
    selectNodeType: '',
    backNodes:[],
    attachmentList:[],
    fileName: '', //上传文件
    fileChunkedList: [],
    index: 0,
    md5: '',
    needfilepath: '',
    uploadFlag: true,
    fileSize: '',
    nowMessage: '', //提示上传进度的信息
    fileStorageId: '', //存储文件信息到数据库接口返回的id
    needfilepath: '', //需要的minio路径
    isStop: true, //暂停按钮的禁用
    bizModal:false,////自定义控件里面新增修改
    treeTableProps:{},
    bizModalProps:{},
    globalRule: {}, //全局规则定义
    nodeRule: {}, //节点规则定义
    relType:'FORM',
    intFormValues:{},
    leftTreeData:leftTreeData,
    tmpButtonFormAuthInfo:buttonFormAuthInfo,
    serialCodeList:[],//编码的相对字段
    attAuthList:[],//关联文档权限
    attShowRequire:[]//关联文档页签哪项显示必填项错误
  })
  const {bizInfo,bussinessForm,formJson,bizSolId,bizInfoId,bizTaskId,id,
    tmpUrlFrom,bizModal,bizModalProps,treeTableProps,cutomHeaders,operation,
    tmpButtonFormAuthInfo
  } = state;
  const { template} = bussinessForm;
  //自定义控件里面新增修改
  const setBizModal = (bizModal) => {
    setState({
      bizModal,
    })
    if(!bizModal){
      setBizModalProps()
    }
  };
  const setBizModalProps = (bizModalProps) => {
    setState({
      bizModalProps
    })
  };
  const setTreeTableProps = (treeTableProps) => {
    setState({
      treeTableProps,
    })
  };
  //End(自定义控件新增修改)
  useEffect(() => {
    if(bizSolId){
      init(bizInfoId, bizSolId, bizTaskId,setState);
      setState({//赋值以后清空全局modal
        tmpButtonFormAuthInfo:buttonFormAuthInfo
      })
      dispatch({
        type:"formShow/updateStatesGlobal",
        payload:{
          buttonFormAuthInfo:{}
        }
      })
    }
  }, [bizSolId]);
  const init = (bizInfoId, bizSolId, bizTaskId,setState) => {
    if (bizInfoId) {
      let tmpParams = {}
      //获取待办任务业务配置
      if (bizInfoId == '0') {
        tmpParams = {
          bizSolId,
          bizInfoId,
          bizTaskId: bizTaskId ? bizTaskId : '',
        }
      } else {
        tmpParams = {
          // bizSolId,
          bizInfoId,
          bizTaskId: bizTaskId ? bizTaskId : '',
        }
      }
      dispatch({
        type: 'formShow/initBacklogBizInfo', //获取bizInfo
        payload: tmpParams,
        location:location,
        extraParams:{
          isUpdataAuth,
          operation
        },
        callback: function (data) {
          setState({...data});
        },
      });
    } else {
      if (!bizSolId) {
        return;
      }
      dispatch({
        type: 'formShow/initBizInfo',
        payload: {
          bizSolId,
        },
        location:location,
        extraParams:{
          isUpdataAuth
        },
        callback: function (data) {
          setState({...data});
        },
      });
    }
  };
  const getFileContent = (check,dispatch)=>{
    let newCheck = [];
    check &&
      JSON.parse(check).map((item) => {
        //获取内容
        if (item.ruleJsFullUrl) {
          dispatch({
            type: 'formShow/getRuleSetData',
            payload: {
              url: item.ruleJsFullUrl,
            },
          }).then((data) => {
            item.ruleJsonContent = data;
          });
        }
        newCheck.push(item);
      });
    return newCheck;
  }
  useEffect(() => {
    //获取当前节点和全局的规则配置
    if (bussinessForm.formBizFormId) {
      //获取全局的配置
      dispatch({
        type: 'formShow/getRule',
        payload: {
          bizSolId: bizSolId,
          procDefId: bussinessForm.procDefId,
          formDeployId: bussinessForm.formDeployId,
        },
        callback: async (data) => {
          if (data.length) {
            let globalRule = {};
            let nodeRule = {};
            let newData = [];
            for (let i = 0; i < data.length; i++) {
              let item = data[i];
              //bussinessForm有bizInfo这个肯定会有，应为先请求的bizInfo在请求的bussinessForm接口
              if (item.subjectId == bizInfo?.actId&&item.subjectId != '0') {
                let nodeCheck = getFileContent(item.check,dispatch); //当前节点
                console.log('nodeCheck==',nodeCheck);
                nodeRule = { ...item, check: nodeCheck };
              }
              if (
                !item.subjectId ||//旧数据的
                item.subjectId == 'all' ||//旧数据的
                item.subjectId == '1'||//旧数据的
                item.subjectId == '0'//新数据的
              ) {
                let globalCheck = getFileContent(item.check,dispatch); //全局节点
                console.log('globalCheck==',globalCheck);
                globalRule = { ...item, check: globalCheck };
              }
              //自定义业务校验
              //如果是有流程的则是全局和当前节点，如果无流程的则把全局和按钮的内容都请求到
              if (bizInfo.bizInfoId != '0') {
                if (item.subjectId == bizInfo?.actId) {
                  await getCustomFile(item.custom).then((data) => {
                    nodeRule = { ...nodeRule, custom: data };
                  }); //当前节点
                } else if (
                  !item.subjectId ||
                  item.subjectId == 'all' ||
                  item.subjectId == '1'
                ) {
                  await getCustomFile(item.custom).then((data) => {
                    globalRule = { ...globalRule, custom: data };
                  }); //当前节点
                }
              } else {
                // //需要请求所有的按钮
                await getCustomFile(item.custom).then((data) => {
                  item.custom = data;
                  newData.push(item);
                });
              }
            }
            setState({
              globalRule: globalRule,
              nodeRule: nodeRule,
              ruleData: bizInfo.bizInfoId != '0' ? data : newData,
            })
          }
        },
      });
    }
  }, [bussinessForm]);
  const dropScopeTab = (type) => {
    //需要返回到打开这个表单的页面（注：如果打开表单的页面已经被关闭了，就返回首页）
    const tabMenus = GETTABS();
    //关闭页签
    let currentKey = `/formShow/${location.query?.bizInfoId}/${location.query?.bizSolId}/${location.query?.currentTab}/${location.query?.id}`
    // let newTabMenus = tabMenus.filter((item)=>{return item.key!=currentKey})//删除
    // UPDATETABS({
    //   tabMenus:newTabMenus,
    // })
    console.log('tmpUrlFrom===',tmpUrlFrom);
    const jumpUrl=()=>{
      if(!tmpUrlFrom){
        dispatch({
          type: 'desktopLayout/updateStates',
          payload: {
            refreshTag: uuidv4(),
          },
        });
        historyPush({
          pathname: '/'
        },currentKey);
        return
      }
      //跳转
      let params = getUrlParams(tmpUrlFrom) || {}
      let tmpPaths = tmpUrlFrom.split('?') || [];
      let tmpkey = tmpPaths?.[0];
      if(tmpPaths[0].includes('dynamicPage')&&!tmpPaths[0].includes('dynamicPage/formShow')){
        tmpkey = `/dynamicPage/${params?.bizSolId}/${params?.listId||0}/${params?.formId||0}`
      }else if(tmpPaths[0].includes('formShow')){
        tmpkey = `/formShow/${params?.bizInfoId}/${params?.bizSolId}/${params?.currentTab}/${location.query?.id}`
      }
      let tmpCurrentIndex = _.findIndex(tabMenus,{key:tmpkey});
      let curNode = tabMenus?.[tmpCurrentIndex]
      
      if(tmpPaths[0].includes('meteorological')){
        
        tmpCurrentIndex = _.findIndex(tabMenus,(i)=>{
          console.log(i);
          
          return i.href.includes(tmpUrlFrom)
        });
        curNode = tabMenus?.[tmpCurrentIndex] 
      }
      if(curNode){
        let uuId = uuidv4();//为了刷新页面数据
        historyPush({
          pathname: tmpUrlFrom?.split('?')[0],
          query: {
            ...params,
            uuId,
          },
          key: curNode.key,
          title: curNode.title,
        },currentKey);
      }else{
        historyPush({
          pathname: '/'
        },currentKey);
      }
    }
    jumpUrl()
  };
  return (
    <>
      {bizModal && (
        <MicroApp
          setBizModal={setBizModal}
          treeTableProps={treeTableProps}
          bizModalProps={bizModalProps}
          init={init}
          isUpdataAuth={true}
          onDetail={onDetail}
        />
      )}
      <FormShow
        dropScopeTab={dropScopeTab}
        state={state}
        setState={setState}
        location={location}
        isUpdataAuth={isUpdataAuth}
        setBizModal={setBizModal}
        setBizModalProps={setBizModalProps}
        setTreeTableProps={setTreeTableProps}
        extraQuery={extraQuery}
        allExtraQuery={allExtraQuery}
        onTabChange={onTabChange}
        tabItems={tabItems}
        targetKey={targetKey}
        buttonFormAuthInfo={tmpButtonFormAuthInfo}
        leftTreeData={leftTreeData}
        onDetail={onDetail}
        tmpUrlFrom={tmpUrlFrom}
      />
      <div id={`header_${targetKey}`} mainTableId={cutomHeaders?.mainTableId} style={{display:'none'}}>
      </div>
    </>
  );
}
export default connect(
  ({ formShow, waitMatter, loading, dynamicPage, designableBiz }) => {
    return { formShow, waitMatter, loading, dynamicPage, designableBiz };
  },
)(Index);
