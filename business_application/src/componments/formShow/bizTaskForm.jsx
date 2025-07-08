/**
 * 送审环节
 */
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import React, {useState} from "react";
import styles from './index.less';
import {Form,Button,Input,Row,Space,Radio,Select,message,Checkbox,Col} from 'antd';
import {connect,history} from 'umi';
import SUBMIT from './submit';
import {replaceGTPU} from '../../util/util';
function BizTaskForm({location,dispatch,formShow,dropScopeTab}){
    const bizSolId = location.query.bizSolId;
    const bizInfoId = location.query.bizInfoId;
    const bizTaskId = location.query.bizTaskId;
    const currentTab = location.query.currentTab;
    const {stateObj} = formShow;
    const {bizInfo,bizTaskNodes,selectNodeUser,userType,allFormTitle,actData,submitModal,
      commentJson,selectUserActId,checkNodeIds} = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab];
    const [fields, setFields] = useState([]);
    const [form] = Form.useForm();
    function onFinish(values){
      let isError = false;
        let targetActJson={};
        targetActJson.actId=bizTaskNodes.actId;
        targetActJson.actName=bizTaskNodes.actName;
        targetActJson.actType=bizTaskNodes.actType;
        targetActJson.taskActMap={};
        bizTaskNodes.taskActList.map((item)=>{
          if(values['actId'].includes(item.actId)){
            let newItem = {};
            newItem.dealStrategy=item.dealStrategy;
            newItem.actId=item.actId;
            newItem.actName=item.actName;
            newItem.actType=item.actType;
            newItem.handlerName=values[`handlerName_${item.actId}`];
            newItem.handlerId=values[`handlerId_${item.actId}`];
            if(!newItem.handlerId){
              isError=true;
            }
            newItem.readerName=values[`readerName_${item.actId}`];
            newItem.readerId=values[`readerId_${item.actId}`];
            targetActJson.taskActMap[item.actId]=newItem;
          }
        })
        if(bizTaskNodes.actType != 'endEvent' && isError){
            message.success('请选择主办人');
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
                  targetActJson:JSON.stringify(targetActJson),
                  commentJsonArray: JSON.stringify(commentJson) ,
                  variableJson: JSON.stringify(actData),
              },
              callback:function(){
                  setFields([])
                  dropScopeTab();
              }
          })
        }else{
          dispatch({
            type:'formShow/processStart',
            payload:{
                procDefId:bizInfo.procDefId,
                bizSolId:bizInfo.bizSolId,
                bizInfoId:bizInfo.bizInfoId,
                targetActJson:JSON.stringify(targetActJson),
                commentJsonArray: JSON.stringify(commentJson) ,
                draftActId:bizInfo.actId,
                variableJson: JSON.stringify(actData),
            },
            callback:function(){
                setFields([])
                dropScopeTab();
            }
        })
        }


    }
    //阅办人一直可以多选，则dealStrategy一直为0
    function banlirenyuan(userTypes,actId,dealStrategy,e){
      console.log('dealStrategy=',dealStrategy);
      let checkLists = [];
      const handlerId = form.getFieldValue(`handlerId_${actId}`);
      const readerId = form.getFieldValue(`readerId_${actId}`);
      if(userTypes == 'HANDLER'){
        checkLists = handlerId ? handlerId.split(',') : [];
      }else{
        checkLists = readerId ? readerId.split(',') : [];
      }
      dispatch({
          type:'formShow/updateStates',
          payload:{
              selectNodeUser:[],
              userList:[],
              checkList:checkLists,
              userType:userTypes,
              treeData:[],//清空
              searchTreeWord:"",
              expandedKeys:[],
              selectedTreeKey:'',
              searchUserList:[],
          }
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

          },
          callback:function(){
              dispatch({
                  type:'formShow/updateStates',
                  payload:{
                      submitModal:true,
                      selectUserActId:actId,
                      selectDealStrategy:dealStrategy
                  }
              })
          }
      })
    }
    function onCancel(){
        dispatch({
            type:'formShow/updateStates',
            payload:{
                bizTaskNodes:{},
                isShowSend:false
            }
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
            names.push(`${item.userName}【${item.postName}]】`)
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
        dispatch({
            type: 'formShow/updateStates',
            payload:{
                submitModal:false,
                selectUserActId:'',
                selectDealStrategy:''
            }
        })
    }
    //改变环节则默认人更改
    const changeAct=(e)=>{
      let actId=e.target.value;
      //单人办理，多人竟办
      dispatch({
        type:'formShow/updateStates',
        payload:{
          checkNodeIds:[actId]
        }
      })
    }
    //选择多节点
    const checkActRender=()=>{
      let initialValue = [];
      if(bizTaskNodes.actType=='parallelGateway'){
        initialValue = bizTaskNodes.taskActList.map((item)=>{
          return item.actId
        })
      }
      return (
        <Form.Item
          label="可送环节"
          name="actId"
          className={styles.check_node_form}
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          style={{margin:'5px'}}
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
                  <Col span={4}>
                    <Checkbox className={styles.form_check} value={item.actId} disabled={bizTaskNodes.actType=='parallelGateway'?true:false}>
                      <p className={styles.act_name} title={item.actName}>{item.actName}</p>
                    </Checkbox>
                  </Col>
                  <Col span={10}>
                  <Form.Item
                    label="主办人"
                    className={styles.handler_form}
                    initialValue={handlerName}
                    name={`handlerName_${item.actId}`}
                  >
                  <Select
                      onClick={item.handlerConfig!='1'?banlirenyuan.bind(this,'HANDLER',item.actId,item.dealStrategy):()=>{}}
                      autoComplete="off"
                      open={false}
                      showArrow={false}
                      disabled={item.handlerConfig=='1'?true:false}
                      style={{width:'160px'}}
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
                  <Col span={10}>
                  <Form.Item
                    label="阅办人"
                    className={styles.reader_form}
                    initialValue={readerName}
                    name={`readerName_${item.actId}`}
                  >
                    <Select
                      onClick={item.readerConfig!='1'?banlirenyuan.bind(this,'READER',item.actId,'0'):()=>{}}
                      autoComplete="off"
                      open={false}
                      showArrow={false}
                      disabled={item.readerConfig=='1'?true:false}
                      style={{width:'160px'}}
                    >
                      <Select.Option value="0"></Select.Option>
                    </Select>
                  </Form.Item>
                  </Col>
                </Row>
              )
            })}
          </Checkbox.Group>
        </Form.Item>
      )
    }
  //网关单选
  const radioActRender=()=>{//这样写是为了与多选的处理方法一样
    if(bizTaskNodes.actType == 'endEvent'||bizTaskNodes.actType == 'inclusiveGateway'||bizTaskNodes.actType=='parallelGateway'){
      return null;
    }else{
      return (
        <>
          {bizTaskNodes.taskActList.map((item)=>{
            let curTaskActInfo = item;
            //人员截取（只截取第一个GTPU）
            let handlerNames = curTaskActInfo.handlerName?curTaskActInfo.handlerName.split(','):[];
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
            const handlerName = newHandlerNames.length?newHandlerNames.join(','):'';
            //阅办人
            let readerNames = curTaskActInfo.readerName?curTaskActInfo.readerName.split(','):[];
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
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  style={curTaskActInfo.handlerConfig=='2'||!checkNodeIds.includes(curTaskActInfo.actId)?{margin:'5px',display:'none'}:{margin:'5px'}}
                  label="主办人"
                  name={`handlerName_${curTaskActInfo.actId}`}
                  initialValue={handlerName}
                  >
                  <Select
                      onClick={curTaskActInfo.handlerConfig!='1'?banlirenyuan.bind(this,'HANDLER',curTaskActInfo.actId,curTaskActInfo.dealStrategy):()=>{}}
                      autoComplete="off"
                      open={false}
                      showArrow={false}
                      disabled={curTaskActInfo.handlerConfig=='1'?true:false}
                      >
                          <Select.Option value="0"></Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  style={{margin:'5px',display:'none'}}
                  label="主办人id"
                  name={`handlerId_${curTaskActInfo.actId}`}
                  initialValue={curTaskActInfo.handlerId}
                  >
                    <Input/>
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  style={{margin:'5px',display:'none'}}
                  label="阅办人id"
                  name={`readerId_${curTaskActInfo.actId}`}
                  initialValue={curTaskActInfo.readerId}
                >
                  <Input/>
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  style={curTaskActInfo.readerConfig=='2'||!checkNodeIds.includes(curTaskActInfo.actId)?{margin:'5px',display:"none"}:{margin:'5px'}}
                  label="阅办人"
                  name={`readerName_${curTaskActInfo.actId}`}
                  initialValue={readerName}
                  >
                  <Select
                      onClick={curTaskActInfo.readerConfig!='1'?banlirenyuan.bind(this,'READER',curTaskActInfo.actId,'0'):()=>{}}
                      autoComplete="off"
                      open={false}
                      showArrow={false}
                      disabled={curTaskActInfo.readerConfig=='1'?true:false}
                      >
                          <Select.Option value="0"></Select.Option>
                  </Select>
                </Form.Item>
              </>
            )
          })}
        </>
      )
    }
  }
  return (
      <div style={Object.keys(bizTaskNodes).length > 0 ? {width:'800px',margin:'10px auto 0',padding:'20px',border:'1px solid #ccc',borderRadius:'10px'} : {display:'none'}}>
          {Object.keys(bizTaskNodes).length > 0 ? (<Form
            name="form"
            onFinish={onFinish}
            fields={fields}
            initialValues={ bizTaskNodes.actType == 'endEvent'?{...bizTaskNodes,title:allFormTitle}:{title:allFormTitle}}
            form={form}
            >
                <Form.Item
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 20 }}
                    style={{margin:'5px'}}
                    label="文件标题"
                    name="title"
                    >
                    <Input disabled/>
                </Form.Item>
                {bizTaskNodes.actType == 'userTask'||bizTaskNodes.actType=='exclusiveGateway' ? <Form.Item
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 20 }}
                    style={{margin:'5px'}}
                    label="可送环节"
                    name="actId"
                    initialValue={bizTaskNodes.taskActList[0].actId}
                    >
                    <Radio.Group onChange={changeAct}>
                      {bizTaskNodes.taskActList.map((item)=>{
                        return (
                          <Radio value={item.actId}>{item.actName}</Radio>
                        )
                      })}
                    </Radio.Group>
                </Form.Item> : bizTaskNodes.actType == 'endEvent' ? <Form.Item
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 20 }}
                    style={{margin:'5px'}}
                    label="可送环节"
                    name="actId"
                    >
                    <Radio.Group>
                      <Radio value={bizTaskNodes.actId}>{bizTaskNodes.actName?bizTaskNodes.actName:'结束节点'}</Radio>
                    </Radio.Group>
                </Form.Item> :
                checkActRender()}
                {radioActRender()}
                <Row style={{width:'200px',margin:'10px auto 0'}}>
                    <Space style={{margin:'0 auto'}}>
                        <Button  type="primary" htmlType="submit">
                            送交
                        </Button>
                        <Button onClick={onCancel}>
                            取消
                        </Button>
                    </Space>
                </Row>
            </Form>) : null}
            {submitModal&&<SUBMIT location={location} save={save}/>}
      </div>
  );
}
export default connect(({formShow,loading})=>{return {formShow,loading}})(BizTaskForm);
