import {connect,history,getDvaApp,MicroAppWithMemoHistory} from 'umi';
import { useEffect, useMemo, useState } from 'react';
import { submitFormFn } from './formUtil';
import {Modal} from 'antd';
import styles from './index.less';
import { useSetState } from 'ahooks'
function Index({location,dispatch,loading,getSerialNum,init,setBizModal,
  isUpdataAuth,bizModalProps,treeTableProps}){
  const [form,setForm] = useState();
  const [state, setState] = useSetState({
    bizSolId:'',
    bizInfoId:'',
    currentTab:'',//用于区别新打开的新增页
    bizTaskId:'',
    id:'',//从单据的maintableId
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
    tmpUrlFrom:"",//文件来源
    signConfig:{},//签批配置
    updateFlag:0,//用于判断是否是新增还是修改，保存接口需要
    isShowRule:false,//是否显示右侧的规则定义
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
    backNodes:{},
    attachmentList:[],
    fileName: '', //上传文件
    fileChunkedList: [],
    index: 0,
    md5: '',
    needfilepath: '',
    uploadFlag: '',
    fileSize: '',
    nowMessage: '', //提示上传进度的信息
    fileStorageId: '', //存储文件信息到数据库接口返回的id
    needfilepath: '', //需要的minio路径
    isStop: true, //暂停按钮的禁用
  })
  const {bizInfoId,bizSolId,bizTaskId,bizInfo,bussinessForm,formJson,authList,redCol,serialNumList,cutomHeaders,dictsList,
    signConfig,tableColumCodes,commentJson,updateFlag,id} = state;
  const {subMap} = bussinessForm;
  useEffect(()=>{
    if(bizModalProps){
      setState({
        ...bizModalProps
      })
    }
  },[])
  console.log('bizModalProps==',bizModalProps);
  useEffect(()=>{
    if(bizSolId){
      init(bizInfoId,bizSolId,bizTaskId,setState);
    }
  },[bizSolId])

  // useEffect(() => {
  //   if (Object.keys(bizInfo).length&&cutomHeaders?.mainTableId) {
  //     getSerialNum(
  //       bizInfo.bizInfoId,
  //       bizInfo.actId,
  //       bizInfo.procDefId,
  //       bizInfo.bpmFlag,
  //       bizInfo.formDeployId,
  //       bizInfo.bizSolId,
  //       cutomHeaders.mainTableId,
  //       setState
  //     );
  //   }
  // }, [cutomHeaders?.mainTableId,Object.keys(bizInfo).length]);
  return (
    <Modal
      visible={true}
      title="单据信息"
      onOk={()=>submitFormFn(
          0,
          {codeFlag:'YES'},
          ()=>{
            setBizModal(false);
            treeTableProps?.getDataSource(1, treeTableProps?.pageSize||1000, '');
            treeTableProps?.setExpandedRowKeys([]);
            treeTableProps?.setIsReGetSelectData(true);
          },
          form,
          dispatch,
          bizSolId,
          subMap,
          ()=>{},
          bizInfo,
          cutomHeaders,
          '',
          '',
          location,
          {},
          '',
          [],
          [],
          {},
          {},
          {},
          [],
//           id,securityId,location,sctiptMap,dynamicPage,relBizInfoList,attachmentList,
// globalRule,nodeRule,ruleData,dictsList,updateFlag
          updateFlag,
          setState
        )}
      onCancel={()=>{setBizModal(false)}}
      width={'95%'}
      bodyStyle={{padding:'0px'}}
      getContainer={() => {
      return document.getElementById(`formShow_container_${targetKey}`)
      }}
      maskClosable={false}
      mask={false}
      className={styles.modal_form}
      >
      <MicroAppWithMemoHistory
        style={{ height: '100%' }}
        name="designable"
        url="/preview"
        location={location}
        deployFormId={
          bizInfo && Object.keys(bizInfo).length ? bizInfo.formDeployId : ''
        }
        bizInfoId={
          bizInfo && Object.keys(bizInfo).length ? bizInfo.bizInfoId : ''
        }
        mainLoading={loading}
        setForm={setForm}
        authList={authList}
        bizInfo={bizInfo}
        serialNumList={serialNumList}
        redCol={redCol}
        signConfig={signConfig}
        tableColumCodes={tableColumCodes}
        commentJson={commentJson}
        bussinessForm={bussinessForm}
        formJson={formJson}
        setParentState={setState}
        cutomHeaders={cutomHeaders}
        isUpdataAuth={isUpdataAuth}
        id={id}
        bizSolId={bizSolId}
        updateFlag={updateFlag}
      />
    </Modal>

  )
}
export default connect(({formShow,loading,designableBiz})=>{return {formShow,loading,designableBiz}})(Index);
