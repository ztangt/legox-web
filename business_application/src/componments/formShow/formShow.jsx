import AddForm from './addForm';
import {Form,Button,Tabs,message} from 'antd';
import {connect,history,getDvaApp,MicroAppWithMemoHistory} from 'umi';
import styles from './index.less';
import ButtonList from "./buttonList";
import { useState } from 'react';
import BIZTASKFORM from './bizTaskForm';
import BACKNODES from './backNodesForm';
import ChangeUser from './changeUser';

import {useEffect} from 'react';
import CirculateModal from './circulateModal';
import { TEMPLETE } from '../../service/constant'
import AttachmentFile from './attachmentFile'
import ReSizeLeftRight from '../public/reSizeLeftRight';
import RuleConfig from './ruleConfig';
import { parser } from 'xijs';
import {onFinshFormatData} from '../../util/util';
function Index({location,dispatch,formShow,loading,waitMatter,dynamicPage}){
  console.log('formShow=',formShow);
  const [form] = Form.useForm();
  const {stateObj} = formShow;
  const bizSolId = location.query.bizSolId;
  const bizInfoId = location.query.bizInfoId;
  const currentTab = location.query.currentTab;//用于区别新打开的新增页
  const bizTaskId = location.query.bizTaskId;
  console.log('bizSolId+',bizSolId+'_'+bizInfoId+'_'+currentTab,stateObj,formShow);
  const {isShowSend,isShowCirculate,bussinessForm,bizInfo,backNodes,relType,isShowRule,globalRule,nodeRule,redCol} = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab];
  const { template,bizSolName,formBizFormName } = bussinessForm
  const [isShowRelevance,setIsShowRelevance] = useState(false);
  const [ruleCheckIds,setRuleCheckIds] = useState([]);//临时记录校验的id，用于存储错误提示信息
  const [ruleErrorText,setRuleErrorText] = useState([]);//用于存储错误提示信息,循环结束后才提示，这样保证表单子表校验只提示一次
  const [buttonCode,setButtonCode] = useState('')
  const { TabPane } = Tabs;
  const getFormAuthoritys = (bizSolId,optType,bizInfoId,procDefId,actId,deployFormId)=>{
    //获取按钮和字段权限
    dispatch({
      type:'formShow/getFormAuthoritys',
      payload:{
        // bizSolId:data.bizSolId,
        // optType:data.operation=='deal'||data.operation=='edit'?'HANDLE':"VIEW",
        // bizInfoId:data.bizInfoId,
        // procDefId:data.procDefId,
        // actId:data.actId,
        // deployFormId:data.formDeployId
        bizSolId,
        optType,
        bizInfoId,
        procDefId,
        actId,
        deployFormId
      }
    })
  }
  useEffect(()=>{
    if(bizInfoId){
      //获取待办任务业务配置
      dispatch({
        type:"formShow/getBacklogBizInfo",
        payload:{
          bizSolId,
          bizInfoId,
          bizTaskId:bizTaskId?bizTaskId:''
        },
        callback:function(data){
          dispatch({
            type:"formShow/getBussinessForm",
            payload:{
              bizSolId:data.bizSolId,
              procDefId:data.procDefId,
              formDeployId:data.formDeployId,
            }
          })

        }
      })

    }else{
      //获取任务业务配置
      dispatch({
        type:"formShow/getBizInfo",
        payload:{
          bizSolId
        },
        callback:function(data){
          dispatch({
            type:"formShow/getBussinessForm",
            payload:{
              bizSolId:data.bizSolId,
              procDefId:data.procDefId,
              formDeployId:data.formDeployId,
            }
          })

        }
      })
    }
  },[])
  // useEffect(()=>{
  //   // console.log('location=',location);
  //   // const bizSolId=location.query.bizSolId;
  //   // const bizTaskId=location.query.bizTaskId;
  //   // const bizInfoId = typeof location.query.bizInfoId=='undefined'?0:location.query.bizInfoId;
  //   // const currentTab = location.query.currentTab
  //   if(bizInfoId){
  //     //获取表单数据
  //     dispatch({
  //       type:'formShow/getFormData',
  //       payload:{
  //         bizSolId:bizSolId,
  //         bizInfoId:bizInfoId
  //       }
  //     })

  //     //获取待办任务业务配置
  //     dispatch({
  //       type:"formShow/getBacklogBizInfo",
  //       payload:{
  //         bizSolId,
  //         bizInfoId,
  //         bizTaskId:bizTaskId?bizTaskId:''
  //       },
  //       callback:function(data){
  //         dispatch({
  //           type:"formShow/getBussinessForm",
  //           payload:{
  //             bizSolId:data.bizSolId,
  //             procDefId:data.procDefId,
  //             formDeployId:data.formDeployId,
  //           }
  //         })
  //         //获取生成编号
  //         dispatch({
  //           type:"formShow/getSerialNum",
  //           payload:{
  //             bizInfoId:data.bizInfoId,
  //             actId:data.actId,
  //             procDefId:data.procDefId,
  //             bpmFlag:data.bpmFlag,
  //             deployFormId:data.formDeployId,
  //             bizSolId:data.bizSolId
  //           }
  //         })
  //         dispatch({
  //           type:'formShow/getProcessVariables',//获取流程变量
  //           payload:{
  //             actId:data.actId,
  //             procDefId:data.procDefId,
  //             formDeployId:data.formDeployId,
  //             bizSolId:data.bizSolId
  //           }
  //         })
  //         //通过按钮组获取按钮
  //         // dispatch({
  //         //   type:'formShow/getGroupButton',
  //         //   payload:{
  //         //     buttonGroupId:data.buttonGroupId
  //         //   }
  //         // })
  //         //获取按钮和字段权限
  //         dispatch({
  //           type:'formShow/getFormAuthoritys',
  //           payload:{
  //             bizSolId:data.bizSolId,
  //             optType:data.operation=='deal'||data.operation=='edit'?'HANDLE':"VIEW",
  //             bizInfoId:data.bizInfoId,
  //             procDefId:data.procDefId,
  //             actId:data.actId,
  //             deployFormId:data.formDeployId
  //           }
  //         })
  //         //获取表单样式
  //         dispatch({
  //           type:'formShow/getFormStyle',
  //           payload:{
  //             deployFormId:data.formDeployId
  //           }
  //         })

  //       }
  //     })
  //   }else{
  //     //获取任务业务配置
  //     dispatch({
  //       type:"formShow/getBizInfo",
  //       payload:{
  //         bizSolId
  //       },
  //       callback:function(data){
  //         dispatch({
  //           type:"formShow/getBussinessForm",
  //           payload:{
  //             bizSolId:data.bizSolId,
  //             procDefId:data.procDefId,
  //             formDeployId:data.formDeployId,
  //           }
  //         })
  //         dispatch({
  //           type:"formShow/getSerialNum",
  //           payload:{
  //             bizInfoId:data.bizInfoId,
  //             actId:data.actId,
  //             procDefId:data.procDefId,
  //             bpmFlag:data.bpmFlag,
  //             deployFormId:data.formDeployId,
  //             bizSolId:data.bizSolId
  //           }
  //         })
  //         //通过按钮组获取按钮
  //         // dispatch({
  //         //   type:'formShow/getGroupButton',
  //         //   payload:{
  //         //     buttonGroupId:data.buttonGroupId
  //         //   }
  //         // })
  //         //获取按钮和字段权限
  //         dispatch({
  //           type:'formShow/getFormAuthoritys',
  //           payload:{
  //             bizSolId:data.bizSolId,
  //             optType:'HANDLE',
  //             bizInfoId:data.bizInfoId,
  //             procDefId:data.procDefId,
  //             actId:data.actId,
  //             deployFormId:data.formDeployId
  //           }
  //         })
  //         //获取表单样式
  //         dispatch({
  //           type:'formShow/getFormStyle',
  //           payload:{
  //             deployFormId:data.formDeployId
  //           }
  //         })
  //       }
  //     })
  //   }
  // },[])
  useEffect(()=>{
    //获取当前节点和全局的规则配置
    if(bussinessForm.formBizFormId){
      //获取全局的配置
      dispatch({
        type:"formShow/getRule",
        payload:{
          bizId:bizSolId,
          procDefId:bussinessForm.procDefId,
          formId:bussinessForm.formBizFormId,
        },
        callback:(data)=>{
          if(data.length){
            let globalCheck = getFileContent(data[0].check);//全局
            let nodeRule={};
            data.map((item)=>{
              //bussinessForm有bizInfo这个肯定会有，应为先请求的bizInfo在请求的bussinessForm接口
              if(item.actId==bizInfo.actId){
                let nodeCheck = getFileContent(item.check);//当前节点
                nodeRule={...item,check:nodeCheck};
              }
            })
            console.log('nodeRule=',nodeRule);
            dispatch({
              type:"formShow/updateStates",
              payload:{
                globalRule:{...data[0],check:globalCheck},
                nodeRule:nodeRule
              }
            })
          }
        }
      })
    }
  },[bussinessForm])

  const getListModelData = () =>{
    //如果不分页则请求全部
    //加载列表建模数据
    if(dynamicPage.stateObj[bizSolId]&&Object.keys(dynamicPage.stateObj[bizSolId]).length){
      const {limit,listModel}=dynamicPage.stateObj[bizSolId];
      dispatch({
        type:"dynamicPage/getListModelData",
        payload:{
          bizSolId,
          start:1,
          limit:listModel.pageFlag?limit:100000
        }
      })
    }
  }
  //获取内容
  const getFileContent = (check)=>{
    let newCheck=[];
    check&&JSON.parse(check).map((item)=>{
      //获取内容
      dispatch({
        type:"formShow/getRuleSetData",
        payload:{
          fileStorageId:item.ruleJsUrl
        },
        callback:(newData)=>{
          item.ruleJsonContent = newData;
        }
      })
      newCheck.push(item);
    })
    return newCheck;
  }
  //送交
  function saveSubmit(bizInfoId,bizInfo){
    if(bizTaskId){
      dispatch({
        type:"formShow/getTaskDealNode",
        payload:{
          bizTaskId
        },
        callback:()=>{
          dispatch({
            type:"formShow/updateStates",
            payload:{
              isShowSend:true,
              backNodes:{}//不显示驳回
            }
          })
        }
      })
    }else{
      dispatch({
        type:"formShow/getProcessStartNode",
        payload:{
          bizInfoId,
          actId:bizInfo.actId
        },
        callback:()=>{
          dispatch({
            type:"formShow/updateStates",
            payload:{
              isShowSend:true
            }
          })
        }
      })
    }
  }
  //流程指引
  function viewFlow(){
    let pathname = location.pathname;
    console.log('pathname=',pathname.split('/')[1]);
    historyPush({
      pathname: `/${pathname.split('/')[1]}/flowDetails`,
      query: {
        bizInfoId: bizInfo.bizInfoId,
        bizSolId:bizSolId
      },
    });
  }
  //驳回
  function reject(){
    if(bizTaskId){
      dispatch({
        type:"formShow/backNodes",
        payload:{
          bizTaskId:bizTaskId
        }
      })
    }else{
      message.error('当前环节不能驳回');
    }
  }
  //办结
  const completeBiz=()=>{
    dispatch({
      type:"formShow/completeBiz",
      payload:{
        bizInfoId:bizInfoId,
        bizTaskId:bizTaskId
      }
    })
  }
  //传阅弹框
  const circulate=()=>{
    dispatch({
      type:"formShow/updateStates",
      payload:{
        isShowCirculate:true
      }
    })
  }
  //表单提交
  const formSubmit=(buttonCode)=>{
    console.log('buttonCode',buttonCode);
    setButtonCode(buttonCode)
    setTimeout(() => {
      form.submit();
    }, 500)

  }
  const messageFn=(text)=>{//提示文案，应为放在字符串中不能解析message为定义
    console.log('errorText=',ruleErrorText);
    ruleErrorText.push(text)
    setRuleErrorText(ruleErrorText);
    //message.error(text);
  }
  console.log('ruleCheckIds=',ruleCheckIds);
  const checkRule = (values,checkSubIndex,subId)=>{
    //规则定义的条件判断
    let isErrors = [];
    let conditions=[];//条件数组
    let time = new Date();
    var p = /values\[([^\[\]]*)\][=>!<]*(\'(.*?)\'|values\[([^\[\]]*)\])/g;
    if(Object.keys(globalRule).length){//全局规则定义的条件判断
      globalRule.check&&globalRule.check.map((item,index)=>{
        console.log('Date.parse(time)=',Date.parse(time));
        let isError = false;
        let ruleJsonContent = parser.parse(item.ruleJsonContent);
        if((ruleJsonContent.ruleProperty=='activeDate'&&ruleJsonContent.propertyValue<=Date.parse(time))||
        (ruleJsonContent.ruleProperty=='loseDate'&&ruleJsonContent.propertyValue>Date.parse(time))||ruleJsonContent.ruleProperty=='empty'){
          try{//避免写的不规范影响后续操作
            eval(ruleJsonContent.text);
          }catch(e){

          }
          isErrors.push({isControl:item.isControl,isError:isError,id:item.id});
          //有错误表单字段标红
          if(isError){
            ruleCheckIds.push(item.id);
            setRuleCheckIds(ruleCheckIds);
            var m;
            while(m = p.exec(ruleJsonContent.text)){
              conditions.push(m[0])
            }
          }
        }
      })
    }
    if(Object.keys(nodeRule).length){//节点规则定义的条件判断
      console.log('Date.parse(time)=',Date.parse(time));
      nodeRule.check&&nodeRule.check.map((item)=>{
        console.log('item=',item);
        let isError = false;
        let ruleJsonContent = parser.parse(item.ruleJsonContent);
        console.log('111111=',ruleJsonContent.ruleProperty=='activeDate'&&ruleJsonContent.propertyValue<=Date.parse(time)/1000);
        if((ruleJsonContent.ruleProperty=='activeDate'&&ruleJsonContent.propertyValue<=Date.parse(time)/1000)||
          (ruleJsonContent.ruleProperty=='loseDate'&&ruleJsonContent.propertyValue>Date.parse(time)/1000)||ruleJsonContent.ruleProperty=='empty'){
            console.log('1654531199==');
          try{//避免写的不规范影响后续操作
            eval(ruleJsonContent.text);
          }catch(e){

          }
          isErrors.push({isControl:item.isControl,isError:isError,id:item.id});
          //有错误表单字段标红
          if(isError){
            ruleCheckIds.push(item.id);
            setRuleCheckIds(ruleCheckIds);
            var m;
            console.log('ruleJsonContent.text=',ruleJsonContent.text);
            while(m = p.exec(ruleJsonContent.text)){
              conditions.push(m[0])
            }
          }
        }
      })
    }
    //循环一个一个的判断，哪个没通过则标红
    let redCol = [];
    let con_p = /\[([^\[\]]*)\]*/g;
    console.log('conditions=',conditions);
    conditions.map((item)=>{
      let isError = false;
      let str="if("+item+"){}else{isError=true}"
      console.log('str=',str);
      try{//避免写的不规范影响后续操作
        eval(str);
      }catch(e){

      }
      if(isError){
        var m;
        while(m = con_p.exec(str)){
          let col = m[0].split('["')[1].split('"]')[0];//将【“A”]截取获取A
          console.log('col=',col);
          redCol.push({col:col,checkSubIndex:checkSubIndex,subId:subId})//记录checkSubIndex和subId为子表的错误信息显示
        }
      }
    })
    console.log('isErrors=',isErrors);
    return {globalRule,nodeRule,redCol,isErrors}
  }
  console.log('RuleErrorText=',ruleErrorText);
  const onRule = (saveValues,mvalues,dateValues,selectValues,subDeployFormIds) =>{
    if(buttonCode=='send'){
      //应为包括子表数据，则需要将主表的字段和子表的合并并循环执行
      let newValues={};
      let subValues=[];
      console.log('saveValues=',saveValues);
      Object.keys(saveValues).map((item)=>{
        console.log('saveValues[item]=',saveValues[item]);
        if(subDeployFormIds&&subDeployFormIds.toString().includes(item)){
          console.log('saveValues[item]=',saveValues[item]);
          saveValues[item].map((subDataItem,index)=>{
            subValues[index]={id:item};
            Object.keys(subDataItem).map((subItem)=>{
              let data = onFinshFormatData(subDataItem[subItem],subItem,mvalues,dateValues,selectValues);
              subValues[index][subItem] = data?data:'';
            })
          })
        }else{
          let data = onFinshFormatData(saveValues[item],item,mvalues,dateValues,selectValues);
          newValues[item] = data?data:'';
        }
      })
      let redCol = [];
      let isErrors = [];
      //存在子表
      if(subValues.length){
        subValues.map((item,index)=>{
          ///将主表字段放到子表数据
          let values = {...newValues,...item};
          console.log('values=',values);
          //开始执行校验
          let returnData = checkRule(values,index,item.id);
          console.log('returnData.redCol=',returnData.redCol);
          redCol = redCol.concat(returnData.redCol);
          let newIsErrors = [];
          returnData.isErrors.map((i)=>{//判断错误信息里面是否有重复的，一个正确的，一个错误的复制为错误的
            let index = _.findIndex(isErrors,{id:i.id});
            if(index>=0){
              if(i.isError){
                isErrors[index].isError=i.isError
              }
            }else{
              isErrors.push(i)
            }
          })
        })
      }else{//只有主表
        let values = {...newValues};
        //开始执行校验
        let returnData = checkRule(values,0,0);
        redCol = redCol.concat(returnData.redCol);
        isErrors = returnData.isErrors;
      }
      let newErrorText = [];
      ruleErrorText.map((item,index)=>{
        if(!_.find(newErrorText,{id:ruleCheckIds[index]})){
          newErrorText.push({
            id:ruleCheckIds[index],
            text:item
          })
        }
      })
      setRuleErrorText([]);//清空需要放到这，放到送交开头不能立马获取状态
      setRuleCheckIds([]);
      console.log('errorInfos=',newErrorText);
      newErrorText.map((item)=>{
        message.error(item.text);
      })
      console.log('isErrors=',isErrors);
      //将newGlobalRule合并，取错误的部分
      dispatch({
        type:'formShow/updateStates',
        payload:{
          // globalRule:globalRule,
          isErrors:isErrors,
          redCol:redCol,
          isShowRule:_.find(isErrors,{isError:true})?true:false//判断错误的时候自动展示右侧
        }
      })
      let errorIndex = _.findIndex(isErrors, { 'isControl': 1, 'isError': true });
      if(errorIndex>=0){
        return true;
      }
    }
    return false;
  }
  const callBack=(bizInfoId,title)=>{
    //更新标题
    dispatch({
      type:"formShow/changeTitle",
      payload:{
        bizInfoId,
        title
      }
    })
  }
  function formCallBack(bizInfoId,bizInfo,commentJson){ //switch()TODO不同的buttonCode触发不同的事件
    dispatch({
      type:"formShow/updateStates",
      payload:{
        bizInfo,
        commentJson
      }
    })

    getBizInfoTitle(callBack);

  }
  const handelCancel=()=>{
    //清空treeData,避免跟传阅树有影响
    dispatch({
      type:"formShow/updateStates",
      payload:{
        treeData:[],
        selectedDataIds:[]
      }
    })
    setIsShowRelevance(false)
  }
  const dropScopeTab=()=>{
    const search = location.search.includes('?') || !location.search ?location.search : `?${location.search}`
    let pathname = `/${location.pathname.split('/')[1]}`;
    //清空数据
    const bizSolId = location.query.bizSolId;
    const bizInfoId = location.query.bizInfoId;
    const currentTab = location.query.currentTab;//用于区别新打开的新增页
    const returnModel = (namespace) =>{

      var obj =  _.find(getDvaApp()._models, { namespace: namespace })||{};//获取当前路径下的model
      // if(JSON.stringify(obj)=='{}'){
      //   returnModel(location.pathname.split('/')[1])
      // }else{
        return obj
      // }
    }
    let model = returnModel('formShow')
    getDvaApp()._store.dispatch({//初始化model state中的值
      type: `formShow/updateStates`,
      payload:{
        ...model.state,
        bizSolId,
        bizInfoId,
        currentTab
      },
      isClear:true,
    })
    if(pathname=='/dynamicPage'){
      console.log('dynamicPage=',dynamicPage);
      //如果不分页则请求全部
      //加载列表建模数据
      if(dynamicPage.stateObj[bizSolId]&&Object.keys(dynamicPage.stateObj[bizSolId]).length){
        const {limit,listModel}=dynamicPage.stateObj[bizSolId];
        console.log('limit=',limit);
        dispatch({
          type:"dynamicPage/getListModelData",
          payload:{
            bizSolId,
            start:1,
            limit:listModel.pageFlag?limit:100000
          }
        })
      }
      historyPush({
        pathname:pathname,
        query:{
          bizSolId:bizSolId
        }
      })
    }else{
      if(pathname=='/waitMatter'){//待办的时候刷新列表
        console.log('waitMatter=',waitMatter);
        const {searchWord,paramsJson,currentPage,limit,workRuleId,groupCode} = waitMatter;
        dispatch({
          type:'waitMatter/getTodoWork',
          payload:{
            searchWord,
            paramsJson:JSON.stringify(paramsJson),
            start:currentPage,
            limit,
            workRuleId:groupCode=='R0000'?'':workRuleId
          }
        })
      }
      historyPush({
        pathname:pathname,
      })
    }
    // setTimeout(()=>{
    //   dropScope(`${location.pathname}${search}`);
    // },500)//应为不能关闭当前页签，所以跳转后删除缓存
  }
  function onChangeTab(key) {
    console.log(key);
    dispatch({//初始化model state中的值
      type: `formShow/updateStates`,
      payload:{
        relType: key
      },
    })
  }
  function returnTab(item){
    switch (item) {
      case 'ANNEX': //关联文档
        return <AttachmentFile/>
      break;
      case 'WORD': //word

      break;
      case 'PDF': //pdf

      break;

      default:
        break;
    }
  }
  const leftChildren=()=>{
    return (
      <Tabs defaultActiveKey="1" onChange={onChangeTab} style={{height: '100%'}}>
      <TabPane tab={formBizFormName?formBizFormName:'表单'} key="FORM"  >
      <MicroAppWithMemoHistory
        style={{height:'100%'}}
        name="form_preview"
        url="/" form={form}
        location={location}
        formCallBack={formCallBack}
        buttonCode={buttonCode}
        getListModelData={getListModelData}
        redCol={redCol}
        getFormAuthoritys={getFormAuthoritys}
        onRule={onRule}
        mainLoading={loading}/>
        {/*<AddForm form={form} location={location} formCallBack={formCallBack} buttonCode={buttonCode}/>*/}
      </TabPane>
      {
        template&&template.split(',').map((item)=>{
          return  <TabPane tab={TEMPLETE[item]} key={item} >

            {relType==item&&returnTab(item)}
        </TabPane>
        })
      }
    </Tabs>
    )
  }
  return (
    <div className={styles.form_detail_warp} id='formShow_container'>

      <ButtonList location={location} form={form} formSubmit={formSubmit} dropScopeTab={dropScopeTab} viewFlow={viewFlow} />
      {isShowSend&&<BIZTASKFORM location={location} dropScopeTab={dropScopeTab}/>}
      {Object.keys(backNodes).length > 0?<BACKNODES location={location} dropScopeTab={dropScopeTab}/>:null}
      {/* <VIEWFLOW location={location} /> */}
        <ReSizeLeftRight
          height={`calc(100% - 24px)`}
          leftChildren={leftChildren()}
          rightChildren={isShowRule?<RuleConfig location={location}/>:""}
          vRigthNumLimit={240}
          vNum={700}
          isShowRight={isShowRule}
        />
      {isShowRelevance&&
        <ChangeUser
          location={location}
          handelCancel={handelCancel}
          bizTaskIds={location.query.bizTaskId}
          spaceInfo={stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab]}
          nameSpace={'formShow'}
          dropScopeTab={dropScopeTab}
          getContainerId={'formShow_container'}
        />
      }
      {isShowCirculate&&<CirculateModal location={location}/>}
    </div>
  )
}
export default connect(({formShow,waitMatter,loading,dynamicPage})=>{return {formShow,waitMat
