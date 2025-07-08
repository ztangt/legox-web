import {Tabs,Button,message,Spin, Col} from 'antd';
import {useEffect,lazy,Suspense} from 'react';
import styles from '../index.less';
import {connect,history} from 'umi';
const BaseInfo = lazy(() => import('./baseInfo'));
const FlowInfo = lazy(() => import('./flowInfo'));
const NodeSet = lazy(() => import('./nodeSet'));
const EventRegister = lazy(() => import('./eventRegister'));
const RuleConfig = lazy(() => import('./ruleConfig'));
// import BaseInfo from './baseInfo';
// import FlowInfo from './flowInfo';
// import NodeSet from './nodeSet';
// import EventRegister from './eventRegister';
// import RuleConfig from './ruleConfig';
// import { parse } from 'query-string';
import { useSetState } from 'ahooks'
const TabPane=Tabs.TabPane;
const TABLEDATA=[
  {
    index: '1',
    type: '列表',
    code: '',
    name: '',
    key:'list'
  },
  {
    index: '2',
    type: '表单按钮',
    code: '',
    name: '',
    key:'button'
  },
  {
    index: '3',
    type: '表单',
    code: '',
    name: '',
    key:'form'
  },
  {
    index: '4',
    type: '表单分页设置'
  },
  {
    index: '5',
    type: '表单数据拉取方案'
  },
  {
    index: '6',
    type: '导入模版配置',
    name: '',
  },
  {
    index: '7',
    type: '模块下载配置',
    name: '',
    key:'file'
  }
];
function BizSolConfig({dispatch,applyModelConfig,location}){
  // console.log('location==',location);
  const query = location.query;
  const {bizSolId,bizSolName} = query;
  const [state, setState] = useSetState({
    checkedKey:[],//选中按钮 无流程
    buttonTree:[],
    nodeBind:false,
    workflowNodeModal:false,
    nodeAttributeModal:false,
    nodeModalShow: false,// node节点修改弹出
    nodeValue: {},
    flowReuseModel: false,// 流程复用弹窗显示
    flowReuseData: {},// 流程复用数据
    workflowDesignModal:false,
    versionsCutModal:false,
    gatewayModal:false,
    saveIssueModule:false,
    tabValue:'info',
    nodeTabValue:'info',
    bizSolInfo:[],//配置页面的详情
    formData:[],
    listData:[],
    buttonGroupList:[],
    bizFromInfo:[],
    oldBizFromInfo:[],
    selectButtonGroupInfo:{},
    isShowBindCodeModel:false,
    isShowListModal:false,
    isShowButtonModal:false,
    isShowFormModal:false,
    isShowPageModal:false,
    codeList:[],
    draftNum:0,
    codeRuleInfo:[],
    codeRules:[],
    oldCodeRules:[],//用于搜索
    isShowCodeModal:false,
    selectedKeys:[],
    fromCols:[],//字段
    isShowTitleModal:false,
    titleList:[],//标题数据
    selectTitleIndex:0,//标题数据聚焦的第几个，用户添加和删除
    mainFormData:[],//表单的主版本
    actId:'0',
    nodeObj:{},//点击当前节点对象
    NodeBaseObj:{},//基本属性
    authList:[],
    oldAuthList:[],//用于搜索
    flowImg:'',//流程图
    newFlowImg: '',// 新的流程图
    procDefId:'0',
    nodeUserType:'host',//办理人设置主办传阅类型
    nodeUser:{
    },//获取业务应用节点人员配置
    imgNode:{},//流程节点信息
    nodeElement:[],//所有节点
    treeData:[],//单位组织树
    currentNode:[],
    expandedKeys:[],
    treeSearchWord:[],
    orgTreeModal:false,
    flowTreeModal:false,
    expandedKeys:[],//单位组织树展开节点
    checkedKeys:[],//当前选中节点
    userList:[],//用户列表
    userGList:[],//用户组列表
    selectNodeId:'',//当前选中Id
    selectNodeUser:[],//当前选中用户
    eventList:[],//事件注册数据
    orgUserType:'',//选人页面根据type类型是否可以点击选择
    formColumns:[],//获取发布表单关联数据建模数据
    msgConfig:{
      hostMessage:'',
      circularizeMessage:'',
      hostConfig:'',
      circularizeConfig:''
    },//消息发送相关属性
    historyList:[],//版本切换list
    saveBussionFromInfoOnOff:false,//版本切换成功后点击节点设置后自动保存
    sysMenuList:[],//能力名称模块list
    menuList:[],
    imageUrl:'',
    menuImgId:'',
    originalData:[],//中间的待选区的数据
    buttonAuthIds:[],//按钮权限显示的ids
    buttonList:[],//按钮的列表
    oldButtonList:[],
    tableData:_.cloneDeep(TABLEDATA),//表单列表数据
    postList:[],
    buttonGroupListView:[],
    colAuthorityList:[],
    isShowChoseModal: false,
    colList: [],//
    dataDrivers: [],
    bizEventList: [],//事件注册列表
    procDefTreeList: [],//流程树列表
    eventChose: false,
    paramsData: [],
    paramsBind: false,
    nodeBind: false,
    selectedNodeId:'',//办理人配置选人需要字段
    selectedDataIds:[],
    treeData:[],
    currentNode:[],
    expandedKeys:[],
    treeSearchWord:'',
    selectedDatas:[],
    originalData:[],
    selectNodeType:'',
    reviewerList:[],
    groupList:[],
    formInfo:{},
    customCheckData:[],
    ruleId:'',
    operationTips:'',
    custom:[],
    enclosure:[],
    isActionButton:false,
    allCol:[],//表单的全部字段
    diskCurrentPage:0,
    diskReturnCount:0,
    diskAllPage:0,
    diskData:[],//规则定义附件关联
    limit:10,//附件关联中的分页
    diskTreeData:[],//公共云盘的tree
    selectTreeUrl:[],//规则定义中附件弹框中的面包屑
    ruleData:[],//规则数据
    currentRule:{
      actId:'all',
      operationTips:'',
      check:[],
      custom:[],
      enclosure:[]
  },//当前节点的规则数据
    isShowNodeCheck:false,
    checkEnclosureIds:[],
    gatewayParamList:[],
    gatewayExpressionList:[],
    columnList:{},
    nodeChangeStatus:false,
    nodeModalActId:'',
    codeSelectedKeys:[],
    changeStatus:false,
    nodeList:[],
    versionList:[],//版本号
    selectEvent:false,
    eventIndex:'',
    customEventId:'',
    isShowScript:false,
    isShowCopyConfig:false,
    copyConfigData:[],
    basicSelectData:[],
    loadings:false,
    isShowConfigModal:false,//复制配置
    taskActs:[],
    formList:[],
    mainFormCurrent:1,
    mainFormReturnCount:0,
    isShowCopyEvent:false,
    copyEventList:[],
    flowStatus:false,//用来识别是否调用保存
    eventStatus:false,//用来识别是否调用保存
    ruleStatus:false,//用来识别是否调用保存
    attAuthList:[],//关联文档授权列表
    isShowAttUserModel:false,//是否显示附件授权的弹框
    authTabValue:'form',//授权弹框页签定位
    attAuthorityList:[],//节点的关联文档授权列表
    isShowFileMoudle:false,
    fileMoudleList:[],//文件模块列表
  })
  const {bizSolInfo,tabValue,bizFromInfo,procDefId,saveBussionFromInfoOnOff,oldBizFromInfo,
    bizEventList,paramsData,ruleData,selectActId,currentRule,titleList,buttonList,
    flowStatus,eventStatus,ruleStatus}=state;
    // useEffect(()=>{
    //   dispatch({//如果没有保存上id信息则复一个初始值
    //     type:'applyModelConfig/updateStates',
    //     payload:{
    //     }
    //   })
    // },[])

  useEffect(()=>{
    dispatch({
      type:"applyModelConfig/initConfig",
      payload:{
        bizSolId:query.bizSolId
      },
      extraParams:{
        setState:setState,
        state:state
      }
    })
  },[])
  //从流程引擎切换到别的页签
  const changeFlow=(value)=>{
    if(!flowStatus){
      setState({
        tabValue:value
      })
      return;
    }
    if(bizSolInfo.bpmFlag&&procDefId=='0'){
      message.error('请先进行流程设计');
      return;
    }
    if(typeof bizFromInfo.listBizFormId=='undefined'||!bizFromInfo.listBizFormId){//必选项
      message.error('请选择列表信息');
      return;
    }
    if(typeof bizFromInfo.formBizFormId=='undefined'||!bizFromInfo.formBizFormId){//必选项
      message.error('请选择表单信息');
      return;
    }
    if(typeof bizFromInfo.buttonGroupId=='undefined'||!bizFromInfo.buttonGroupId){//必选项
      message.error('请选择按钮信息');
      return;
    }
    if(typeof bizFromInfo.template=='undefined'||!bizFromInfo.template){
      bizFromInfo.template="0"
    }
    if(titleList.length<=0){
      message.error('请选择标题信息');
      return
    }
    //保存按钮方案设置
    let buttonJson=[];
    buttonList.map((item)=>{
      buttonJson.push({
        ...item,
        //authSource:'ALL',
      })
    })
    //if(isActionButton){//点开过按钮弹框才保存
    //if(buttonJson.length){
      dispatch({
        type:"applyModelConfig/submitButtonAuth",
        payload:{
          bizSolId:bizSolId,
          procDefId,
          actId:0,
          buttonGroupId:bizFromInfo.buttonGroupId,
          buttonJson:JSON.stringify(buttonJson),
          deployFormId:bizFromInfo.formDeployId
        },
        callback:()=>{
          //保存业务应用表单配置信息
          dispatch({
            type:'applyModelConfig/saveBussionFromInfo',
            payload:{
              bizSolId:bizSolId,
              procDefId,
              listBizFormId:bizFromInfo.listBizFormId,
              listId:bizFromInfo.listId,
              formBizFormId:bizFromInfo.formBizFormId,
              formDeployId:bizFromInfo.formDeployId,
              buttonGroupId:bizFromInfo.buttonGroupId,
              template:bizFromInfo.template,
              title:bizFromInfo.title,
              usedFlag:bizFromInfo.usedFlag
            },
            callback:(data)=>{
              setState({
                ...data,
                tabValue:value,
                flowStatus:false
              })
            }
          })
        }
      })
    //}
    //}
  }
  //从注册事件切换到别的页签
  const changeEvent=(value)=>{
    if(!eventStatus){
      setState({
        tabValue:value
      })
      return;
    }
    if(bizEventList.length!=0){
      let nodeIsNull =  false
      for (let index = 0; index < bizEventList.length; index++) {
        const element = bizEventList[index];
        if(!element.subjects||element.subjects.length==0){
          nodeIsNull = true
          break;
        }
        if(!element.sort){
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
        return
      }

    }
    dispatch({
      type:'applyModelConfig/saveBizSolEvent',
      payload:{
        procDefId,
        formDeployId: bizFromInfo.formDeployId,
        bizSolId,
        eventBind:  JSON.stringify(bizEventList)
      },
      callback:(data)=>{
        setState({
          ...data,
          tabValue:value,
          eventStatus:false
        })
      },
      extraParams:{
        state,
        bizSolId
      }
    })
  }
  //从规则定义切换页签
  const changeRule=(value)=>{
    if(!ruleStatus){
      setState({
        tabValue:value
      })
      return;
    }
    //当前节点的配置
    let newRuleData = [];
    ruleData.map((item)=>{
      if(selectActId=='0'&&item.subjectId=='0'&&bizSolInfo.bpmFlag){
        newRuleData.push({...currentRule,subjectId:'0'});
      }else if(selectActId==item.subjectId){
        newRuleData.push({...currentRule});
      }else{
        // if(item.subjectId=='all'){
          // newRuleData.push({...item,subjectId:''});
        // }else{
          newRuleData.push(item);
        // }
      }
    })
    //去掉自行添加的id
    newRuleData.map((item)=>{
      let check = [];
      item.check.map((i)=>{
        if(i.id.indexOf('add_')>=0){
          check.push({...i,id:''})
        }else{
          check.push(i);
        }
      })
      item.check = check;
    })
    if(!bizSolInfo.bpmFlag){
      newRuleData= newRuleData.filter((item)=>item.subjectId!=='1')
    }else{
      newRuleData= newRuleData.filter((item)=>item.subjectId!==''||item.subjectId!=='all')
    }
    dispatch({
      type:"applyModelConfig/saveRule",
      payload:{
        bizSolId:bizSolInfo.bizSolId,
        procDefId:bizFromInfo.procDefId,
        formDeployId:bizFromInfo.formDeployId,
        rulesJson:JSON.stringify(newRuleData)
      },
      callback:(data)=>{
        setState({
          ...data,
          tabValue:value,
          ruleStatus:false
        })
      }
    })
  }
  //切换标签
  const changeTab=async(value)=>{
    if(tabValue == 'flow'){
      changeFlow(value);
    }
    else if(tabValue=='event'){//注册事件
      changeEvent(value)
    }
    else if(tabValue=='rule'){//规则定义的保存
      changeRule(value)
    }
    else{
      setState({
        tabValue:value
      })
    }
  }
  const operations = <Button onClick={saveIssueModuleClick.bind(this)}>保存发布至模块资源</Button>;
  function saveIssueModuleClick(){
    if(!((oldBizFromInfo&&Object.keys(oldBizFromInfo).length))){
      if(bizSolInfo.bpmFlag){
        message.error('请先保存流程/表单定义的内容')
        return;
      }else{
        message.error('请先保存业务表单')
        return;
      }
    }
    // dropScope('/moduleResourceMg')
    dispatch({
      type: 'moduleResourceMg/updateStates',
      payload: {
        formUrl:window.location.href
      }
    })
    historyPush({
        pathname: '/moduleResourceMg',
        query: {}
    });
  }
  return (
      <div className={styles.config_warp} id={`code_modal_${bizSolId}`}>
        <Tabs activeKey={tabValue} onChange={changeTab} tabBarExtraContent={operations} className={styles.config_tab}>
          <TabPane tab="建模概述" key="info">
          <Suspense fallback={<Spin loading={true}/>}>
            <BaseInfo dispatch={dispatch} bizSolInfo={bizSolInfo} setParentState={setState}/>
          </Suspense>
          </TabPane>
          <TabPane tab={bizSolInfo.bpmFlag?"流程/表单定义":"业务表单"} key="flow">
          <Suspense fallback={<Spin loading={true}/>}>
            <FlowInfo  query={query} setParentState={setState} parentState={state}/>
          </Suspense>
          </TabPane>
          {bizSolInfo.bpmFlag&&<TabPane tab="节点设置" key="node" disabled={(oldBizFromInfo&&Object.keys(oldBizFromInfo).length)&&bizSolInfo.bpmFlag?false:true}>
          <Suspense fallback={<Spin loading={true}/>}>
            <NodeSet key={tabValue} query={query} setParentState={setState} parentState={state}/>
          </Suspense>
          </TabPane>}
          <TabPane tab="注册事件" key="event" disabled={oldBizFromInfo&&Object.keys(oldBizFromInfo).length?false:true}>
          <Suspense fallback={<Spin loading={true}/>}>
            {tabValue=='event'&&<EventRegister query={query} setParentState={setState} parentState={state}/>}
          </Suspense>
          </TabPane>
          <TabPane tab="规则定义" key="rule" disabled={oldBizFromInfo&&Object.keys(oldBizFromInfo).length?false:true}>
          <Suspense fallback={<Spin loading={true}/>}>
            {tabValue=='rule'?<RuleConfig query={query} setParentState={setState} parentState={state}/>:''}
          </Suspense>
          </TabPane>
        </Tabs>
      </div>
  )
}
export default connect(({loading,applyModelConfig,layoutG})=>{return {loading,applyModelConfig,layoutG}})(BizSolConfig)
