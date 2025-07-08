/**
 * 送审环节
 */
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import React, {useState} from "react";
import styles from './index.less';
import {Form,Input,Row,Space,Radio,Select,message,Checkbox,Col} from 'antd';
import {connect,history} from 'umi';
import SUBMIT from './submit';
import {replaceGTPU} from '../../util/util';
import {getRuleFn} from './formUtil';
import classnames from 'classnames';
import {Button} from '@/componments/TLAntd';
function BizTaskForm({location,dispatch,formShow,dropScopeTab,mainform,submitLoading,state,setState,targetKey}){
    const {bizInfo,bizTaskId,bizTaskNodes,selectNodeUser,userType,allFormTitle,actData,submitModal,
      selectUserActId,checkNodeIds,globalRule,nodeRule,ruleData,cutomHeaders} = state;
    const [fields, setFields] = useState([]);
    const [actFreeFlag,setActFreeFlag] = useState(1);//初期是都能选择的
    const [form] = Form.useForm();
    function onFinish(values){
      if(typeof values['actId']=='object'&&!values['actId'].length){
        message.error('请选择送交环节');
        return;
      }
      let isError = false;
        let targetActJson={};
        targetActJson.actId=bizTaskNodes.actId;
        targetActJson.actName=bizTaskNodes.actName;
        targetActJson.actType=bizTaskNodes.actType;
        targetActJson.flowTaskActList=[];
        // if(bizTaskNodes.actType == 'endEvent'){
        //   bizTaskNodes.taskActList.map((item)=>{
        //     if(values['actId'].includes(item.actId)&&item.freeFlag==true){
        //       //为自由节点的时候需要自由节点的actId,actName,actType
        //       targetActJson.actId=item.actId;
        //       targetActJson.actName=item.actName;
        //       targetActJson.actType=item.actType;

        //     }
        //   })
        //   targetActJson.flowTaskActList.push({
        //     actId:bizTaskNodes.actId,
        //     actName:bizTaskNodes.actName,
        //     actType:bizTaskNodes.actType
        //   })
        // }else{
          bizTaskNodes.taskActList.map((item)=>{
            if(values['actId'].includes(item.actId)){
              //为自由节点的时候需要自由节点的actId,actName,actType
              if(actFreeFlag==true&&item.freeFlag==true){
                targetActJson.actId=item.actId;
                targetActJson.actName=item.actName;
                targetActJson.actType=item.actType;
              }
              let newItem = {};
              newItem.dealStrategy=item.dealStrategy;
              newItem.actId=item.actId;
              newItem.actName=item.actName;
              newItem.actType=item.actType;
              newItem.handlerName=values[`handlerName_${item.actId}`];
              newItem.handlerId=values[`handlerId_${item.actId}`];
              if(!newItem.handlerId&&item.actType!='endEvent'){
                isError=true;
              }
              newItem.readerName=values[`readerName_${item.actId}`];
              newItem.readerId=values[`readerId_${item.actId}`];
              targetActJson.flowTaskActList.push(newItem);
              //targetActJson.taskActMap[item.actId]=newItem;
            }
          })
        //}
        if(isError){
            message.error('请选择主办人');
            return
        }
        if(bizTaskId){
          dispatch({
              type:'formShow/processSend',
              payload:{
                  bizTaskId:bizTaskId,
                  procDefId:bizInfo.procDefId,
                  bizSolId:bizInfo.bizSolId,
                  bizInfoId:bizInfo.bizInfoId,
                  flowAct:targetActJson,
                  commentList:mainform?.values?.['commentJson'],
                  variableJson:actData,
                  formDataId:cutomHeaders.mainTableId,
                  headers:cutomHeaders
              },
              callback:function(){
                getRuleFn(dispatch,bizInfo,'',globalRule,nodeRule,ruleData,values,'afterSend').then(()=>{
                  setFields([])
                  setState({
                    isShowSend:false
                  })
                  // //刷新待办列表标识
                  // dispatch({
                  //   type:'columnWorkList/updateStates',
                  //   payload:{
                  //     isRefreshWorkList:true,
                  //   }
                  // })
                  dropScopeTab();

                })
              }
          })
        }else{
          dispatch({
            type:'formShow/processStart',
            payload:{
                procDefId:bizInfo.procDefId,
                bizSolId:bizInfo.bizSolId,
                bizInfoId:bizInfo.bizInfoId,
                flowAct:targetActJson,
                commentList:mainform?.values?.['commentJson'],
                draftActId:bizInfo.actId,
                variableJson:actData,
                formDataId:cutomHeaders.mainTableId,
                headers:cutomHeaders
            },
            callback:function(){
              getRuleFn(dispatch,bizInfo,'',globalRule,nodeRule,ruleData,values,'afterSend').then(()=>{
                setFields([])
                setState({
                  isShowSend:false
                })
                // //刷新待办列表标识
                // dispatch({
                //   type:'columnWorkList/updateStates',
                //   payload:{
                //     isRefreshWorkList:true,
                //   }
                // })
                dropScopeTab();
              })
            }
        })
        }


    }
    //阅办人一直可以多选，则dealStrategy一直为0
    function banlirenyuan(userTypes,actId,dealStrategy,info,e){
      console.log('dealStrategy=',dealStrategy,info);
      let checkLists = [];
      const handlerId = form.getFieldValue(`handlerId_${actId}`);
      const readerId = form.getFieldValue(`readerId_${actId}`);
      if(userTypes == 'HANDLER'){
        checkLists = handlerId ? handlerId.split(',') : [];
      }else{
        checkLists = readerId ? readerId.split(',') : [];
      }
      setState({
        selectNodeUser:[],
        userList:[],
        checkList:checkLists,
        userType:userTypes,
        treeData:[],//清空
        searchTreeWord:"",
        expandedKeys:[],
        selectedTreeKey:'',
        searchUserList:[],
      })
      dispatch({
          type:'formShow/getGroupList',
          payload:{
              bizInfoId:bizInfo.bizInfoId,
              bizSolId:bizInfo.bizSolId,
              procDefId:bizInfo.procDefId,
              formDeployId:bizInfo.formDeployId,
              actId:actId,
              userType:userTypes,
              nodeType:'',
              nodeId:'',
              choreographyFlag:info.choreographyFlag,
              choreographyOrgId:info.choreographyOrgId

          },
          callback:function(groupData,treeData,groupActiveKey){
            setState({
              groupData,
              treeData,
              groupActiveKey,
              submitModal:true,
              selectUserActId:actId,
              selectDealStrategy:dealStrategy
            })
          }
      })
    }


    function onCancel(){
      setState({
        bizTaskNodes:{},
        isShowSend:false
      })
    }
    function save(){
        let list = JSON.parse(JSON.stringify(selectNodeUser))
        console.log('selectNodeUser=',selectNodeUser);
        //let nodes = JSON.parse(JSON.stringify(bizTaskNodes))
        let names = [];
        let ids = [];
        let postNames = [];
        list.forEach(function(item,i){
          if(item.postName){
            names.push(`${item.userName}【${item.postName}】`)
          }else{
            names.push(`${item.userName}`)
          }
          ids.push(item.identityId)
        })
        let name = names.join(',');
        if(userType == 'HANDLER'){
            setFields([
                {
                    name: [`handlerName_${selectUserActId}`],
                    value: name,
                },
                {
                  name:[`handlerId_${selectUserActId}`],
                  value:ids.join(',')
                }
            ])
        }else{
            setFields([
                {
                    name: [`readerName_${selectUserActId}`],
                    value: name,
                },
                {
                  name:[`readerId_${selectUserActId}`],
                  value:ids.join(',')
                }
            ])
        }
        setState({
          submitModal:false,
          selectUserActId:'',
          selectDealStrategy:''
        })
    }
    //改变环节则默认人更改
    const changeAct=(e)=>{
      let actId=e.target.value;
      //清空主办人阅半人
    //   setFields([
    //     {
    //         name: [`handlerName_${checkNodeIds}`],
    //         value: '',
    //     },
    //     {
    //       name:[`handlerId_${checkNodeIds}`],
    //       value:''
    //     },
    //     {
    //       name: [`readerName_${checkNodeIds}`],
    //       value: '',
    //     },
    //     {
    //       name:[`readerId_${checkNodeIds}`],
    //       value:''
    //     }
    // ])
    //单人办理，多人竟办
    setState({
      checkNodeIds:actId
    })
    }
    //选择单选
    const radioActRender=()=>{
      return (
        <Form.Item
          label="可送环节"
          name="actId"
          className={classnames(styles.item_warp,styles.check_node_form)}
          initialValue={bizTaskNodes.taskActList[0].actId}
          >
          <Radio.Group onChange={changeAct}>
            {bizTaskNodes.taskActList.map((item)=>{
              if(item.actType=='endEvent'){
                return (
                  <Row key={item.actId}>
                    <Col span={5} className={styles.form_check}>
                      <Radio value={item.actId} className={styles.act_name}>{item.actName}</Radio>
                    </Col>
                  </Row>
                )
              }
              //人员截取
              //人员截取（只截取第一个GTPU）
              let handlerNames = item.handlerName?item.handlerName.split(','):[];
              let newHandlerNames = [];
              handlerNames.map((item)=>{
                let element = replaceGTPU(item)
                console.log('element=',element);
                let userOrgs = element.split('【');
                if(userOrgs.length==2){
                  let userElement =replaceGTPU(userOrgs[1]);
                  console.log('userElement=',userElement);
                  element=userOrgs[0]+'【'+userElement;
                }
                newHandlerNames.push(element);
              })
              const handlerName = newHandlerNames.length?newHandlerNames.join(','):"";
              //阅办人
              let readerNames = item.readerName?item.readerName.split(','):[];
              let newReaderNames = [];
              readerNames.map((item)=>{
                let element = replaceGTPU(item)
                let userOrgs = element.split('【');
                if(userOrgs.length==2){
                  let userElement =replaceGTPU(userOrgs[1]);
                  element=userOrgs[0]+'【'+userElement;
                }
                newReaderNames.push(element);
              })
              const readerName = newReaderNames.length?newReaderNames.join(','):'';
              return (
                <>
                  <Row key={item.actId}>
                    <Col span={5} className={styles.form_check}>
                      <Radio value={item.actId} className={styles.act_name}>{item.actName}</Radio>
                    </Col>
                    <Col span={10}>
                    <Form.Item
                      label="主办人"
                      className={styles.handler_form}
                      initialValue={handlerName}
                      name={`handlerName_${item.actId}`}
                    >
                    <Select
                        onClick={item.handlerConfig!='1'?banlirenyuan.bind(this,'HANDLER',item.actId,item.dealStrategy,item):()=>{}}
                        autoComplete="off"
                        open={false}
                        showArrow={false}
                        disabled={item.handlerConfig=='1'?true:false}
                        style={{width:'100%',paddingRight: '8px'}}
                    >
                      <Select.Option value="0"></Select.Option>
                    </Select>
                    </Form.Item>
                    </Col>
                    <Form.Item
                      label="主办人id"
                      style={{display:'none'}}
                      initialValue={item.handlerId}
                      name={`handlerId_${item.actId}`}
                    >
                      <Input style={{ width: 160 }}/>
                    </Form.Item>
                    <Form.Item
                      label="阅办人id"
                      style={{display:'none'}}
                      initialValue={item.readerId}
                      name={`readerId_${item.actId}`}
                    >
                      <Input style={{ width: 160 }}/>
                    </Form.Item>
                    <Col span={9}>
                    <Form.Item
                      label="阅办人"
                      className={styles.reader_form}
                      initialValue={readerName}
                      name={`readerName_${item.actId}`}
                    >
                      <Select
                        onClick={item.readerConfig!='1'?banlirenyuan.bind(this,'READER',item.actId,'0',item):()=>{}}
                        autoComplete="off"
                        open={false}
                        showArrow={false}
                        disabled={item.readerConfig=='1'?true:false}
                        style={{width:'100%'}}
                      >
                        <Select.Option value="0"></Select.Option>
                      </Select>
                    </Form.Item>
                    </Col>
                  </Row>
                </>
              )
            })}
          </Radio.Group>
      </Form.Item>
      )
    }
    //如果是自由节点则和其他节点互斥
    const checkActFreeFlag=(e)=>{
      let tmpActId = e.target.value;
      let tmpCheck = e.target.checked;
      let tmpFreeFlag = null;
      if(tmpCheck){
        bizTaskNodes.taskActList.map((item)=>{
          if(tmpActId==item.actId){
            tmpFreeFlag = item.freeFlag
            return;
          }
        })
      }else if(form.getFieldValue('actId').length==1){//剩余一个的时候取消就恢复到初期值
        tmpFreeFlag=1//恢复到初始
      }
      setActFreeFlag(tmpFreeFlag)
    }
    //选择多节点
    const checkActRender=()=>{
      let initialValue = [];
      if(bizTaskNodes.checkAll){
        initialValue = bizTaskNodes.taskActList.map((item)=>{
          return item.actId
        })
      }
      return (
        <Form.Item
          label="可送环节"
          name="actId"
          className={classnames(styles.item_warp,styles.check_node_form)}
          initialValue={initialValue}
        >
          <Checkbox.Group>
            {bizTaskNodes.taskActList.map((item)=>{
              //人员截取
              //人员截取（只截取第一个GTPU）
              let handlerNames = item.handlerName?item.handlerName.split(','):[];
              let newHandlerNames = [];
              handlerNames.map((item)=>{
                let element = replaceGTPU(item)
                console.log('element=',element);
                let userOrgs = element.split('【');
                if(userOrgs.length==2){
                  let userElement =replaceGTPU(userOrgs[1]);
                  console.log('userElement=',userElement);
                  element=userOrgs[0]+'【'+userElement;
                }
                newHandlerNames.push(element);
              })
              const handlerName = newHandlerNames.length?newHandlerNames.join(','):"";
              //阅办人
              let readerNames = item.readerName?item.readerName.split(','):[];
              let newReaderNames = [];
              readerNames.map((item)=>{
                let element = replaceGTPU(item)
                let userOrgs = element.split('【');
                if(userOrgs.length==2){
                  let userElement =replaceGTPU(userOrgs[1]);
                  element=userOrgs[0]+'【'+userElement;
                }
                newReaderNames.push(element);
              })
              const readerName = newReaderNames.length?newReaderNames.join(','):'';
              return (
                <Row key={item.actId}>
                  <Col span={5}>
                    <Checkbox 
                      className={styles.form_check} 
                      value={item.actId} 
                      disabled={(item.freeFlag===null&&bizTaskNodes.checkAll)||(actFreeFlag!==1&&item.freeFlag!==actFreeFlag)} 
                      onClick={checkActFreeFlag.bind(this)}
                    >
                      <p className={styles.act_name} title={item.actName}>{item.actName}</p>
                    </Checkbox>
                  </Col>
                  <Col span={10}>
                  {item.actType!='endEvent'&&
                    <Form.Item
                      label="主办人"
                      className={styles.handler_form}
                      initialValue={handlerName}
                      name={`handlerName_${item.actId}`}
                    >
                      <Select
                          onClick={item.handlerConfig!='1'?banlirenyuan.bind(this,'HANDLER',item.actId,item.dealStrategy,item):()=>{}}
                          autoComplete="off"
                          open={false}
                          showArrow={false}
                          disabled={item.handlerConfig=='1'?true:false}
                          style={{width:'100%',paddingRight: '8px'}}
                      >
                        <Select.Option value="0"></Select.Option>
                      </Select>
                    </Form.Item>}
                  </Col>
                  <Form.Item
                    label="主办人id"
                    style={{display:'none'}}
                    initialValue={item.handlerId}
                    name={`handlerId_${item.actId}`}
                  >
                    <Input style={{ width: 160 }}/>
                  </Form.Item>
                  <Form.Item
                    label="阅办人id"
                    style={{display:'none'}}
                    initialValue={item.readerId}
                    name={`readerId_${item.actId}`}
                  >
                    <Input style={{ width: 160 }}/>
                  </Form.Item>
                  <Col span={9}>
                  {item.actType!='endEvent'&&<Form.Item
                    label="阅办人"
                    className={styles.reader_form}
                    initialValue={readerName}
                    name={`readerName_${item.actId}`}
                  >
                    <Select
                      onClick={item.readerConfig!='1'?banlirenyuan.bind(this,'READER',item.actId,'0',item):()=>{}}
                      autoComplete="off"
                      open={false}
                      showArrow={false}
                      disabled={item.readerConfig=='1'?true:false}
                      style={{width:'100%'}}
                    >
                      <Select.Option value="0"></Select.Option>
                    </Select>
                  </Form.Item>}
                  </Col>
                </Row>
              )
            })}
          </Checkbox.Group>
        </Form.Item>
      )
    }
  return (
      <div
        className={styles.biz_task_form}
        style={Object.keys(bizTaskNodes).length > 0 ?  {}: {display:'none'}}
      >
          {Object.keys(bizTaskNodes).length > 0 ? (<Form
            name="form"
            onFinish={onFinish}
            fields={fields}
            initialValues={ bizTaskNodes.actType == 'endEvent'?{...bizTaskNodes,title:allFormTitle}:{title:allFormTitle}}
            form={form}
            className={styles.form}
            colon={false}
            >
                <Form.Item
                  className={styles.item_warp}
                    label="文件标题"
                    name="title"
                    >
                    <Input disabled/>
                </Form.Item>
                {bizTaskNodes.actType == 'userTask'||bizTaskNodes.actType=='exclusiveGateway'||bizTaskNodes.actType == 'endEvent' ? 
                radioActRender(): 
                checkActRender()
                }
                <Row style={{width:'200px',margin:'0 auto',marginTop:'8px'}}>
                    <Space style={{margin:'0 auto'}}>
                        <Button  type="primary" htmlType="submit" loading={submitLoading}>
                            送交
                        </Button>
                        <Button onClick={onCancel}>
                            取消
                        </Button>
                    </Space>
                </Row>
            </Form>) : null}
            {submitModal&&<SUBMIT location={location} save={save} setState={setState} state={state} targetKey={targetKey}/>}
      </div>
  );
}
export default connect(({formShow,loading})=>{return {
  formShow,
  loading,
  submitLoading: loading.effects['formShow/processSend']||loading.effects['formShow/processStart'],
}})(BizTaskForm);
