// 事件处理器
import { connect } from 'dva';
import React, { useState,useEffect } from 'react';
import { Modal,Button,Form,Input,Space,Select,Row,message,Radio,Col} from 'antd';
import _ from "lodash";
import styles from '../index.less';
import GWExpressionTable from './gwExpressionTable';
import ParamsModal from './paramsModal';
import indexStyles from '../index.less';
import Table from '../../../componments/columnDragTable';
const {confirm}=Modal;
const plainOptions = [
  { value: '0', label: '主观选择' },
  { value: '1', label: '条件判断' },
  { value: '3', label: '自定义' },
]
const exalPlainOptions=[
  { value: '0', label: '主观选择' },
  { value: '1', label: '条件判断' },
  { value: '2', label: '全部选择' },
  { value: '3', label: '自定义' },
]//包容网关不包含条件判断
function Gateway ({dispatch,loading,query,cancelNodeModal,operations,
  successChangeTab,nodeObj,parentState,setParentState}){
    const bizSolId = query.bizSolId;
    const {actId,procDefId,bizFromInfo,gatewayParamList,gatewayExpressionList,exclusiveGatewayStrategy,
      exclusiveGatewayCustom,isShowColSelect,bizSolNodeBaseId,dataType,nodeElement,preActId}=parentState;
    const [changeStatus,setChangeStatus] = useState(false)
    const [paramsForm] = Form.useForm();
    const [editIndex,setEditIndex] = useState(-1);//编辑行的显示问题
    console.log('gatewayParamList=',gatewayParamList);
    //初始
    useEffect(() => {
      if(Object.keys(nodeObj).length&&nodeObj.type.includes('Gateway')){
        //获取基本信息
        dispatch({
          type:"applyModelConfig/getGateWayNodeBase",
          payload:{
            bizSolId,
            procDefId,
            formDeployId:bizFromInfo.formDeployId,
            gatewayActId:actId
          },
          extraParams:{
            setState:setParentState
          }
        })
      }
    },[nodeObj]);
    useEffect(()=>{
      if(preActId==actId){
        saveGateWay();
      }
    },[preActId])
    function onFinish(values){
      setChangeStatus(true);
      if(values['id']){//更新
        dispatch({
          type:"applyModelConfig/updateGateWayParams",
          payload:{
            bizSolId,
            formDeployId:bizFromInfo.formDeployId,
            procDefId,
            gatewayActId:actId,
            ...values
          },
          extraParams:{
            state:parentState
          },
          callback:(gatewayParamList)=>{
            setParentState({
              gatewayParamList
            })
            paramsForm.resetFields();
            setEditIndex(-1);
          }
        })
      }else{//保存
        dispatch({
          type:"applyModelConfig/saveGateWayParams",
          payload:{
            bizSolId,
            formDeployId:bizFromInfo.formDeployId,
            procDefId,
            gatewayActId:actId,
            ...values
          },
          extraParams:{
            state:parentState
          },
          callback:(gatewayParamList)=>{
            setParentState({
              gatewayParamList
            })
            paramsForm.resetFields();
            setEditIndex(-1);
          }
        })
      }
    }
    const tableProps = {
        rowKey: 'id',
        size:"small",
        columns: [
          {
            title: '参数来源',
            dataIndex: 'paramSource',
            render:(text)=><div>{text=='FROMFORM'?'表单':''}</div>
          },
          {
            title: '参数类型',
            dataIndex: 'paramType',
            render:(text)=><div>{text=='STRING'?'字符串':'数值'}</div>
          },
          {
            title: '参数名称',
            dataIndex: 'paramName',
          },
          {
            title: '参数值',
            dataIndex: 'paramValue',
          },
          {
            title: '操作',
            dataIndex: 'operation',
            render: (text,record,index)=>{return <div>
                <Space>
                  <a onClick={editorParam.bind(this,record,index)}>编辑</a>
                  <a onClick={delParam.bind(this,record)}>删除</a>
                </Space>
            </div>}
          },
        ],
        dataSource: JSON.parse(JSON.stringify(gatewayParamList)),
        pagination: false
      }
      //编辑
      const editorParam=(record,index)=>{
        let fields = [];
        Object.keys(record).map((item)=>{
          fields.push({
            name:[item],
            value:record[item]
          })
        })
        setEditIndex(index);
        paramsForm.setFields(fields)
      }
      //删除
      const delParam=(record)=>{
        confirm({
          content:'确认要删除吗？删除后不能恢复',
          getContainer:() =>{
            return document.getElementById(`code_modal_${bizSolId}`);
          },
          mask:false,
          onOk:()=>{
            dispatch({
              type:'applyModelConfig/delParam',
              payload:{
                ids:record.id
              },
              extraParams:{
                state:parentState,
                setState:setParentState
              }
            })
          }
        })
      }
      //改变办理策略
      const onChangeStrategy=(e)=>{
        setChangeStatus(true);
        setParentState({
          exclusiveGatewayStrategy:e.target.value
        })
      }
      //字段弹框
      const showColSelectModal=()=>{
        setParentState({
          isShowColSelect:true,
          dataType:paramsForm.getFieldValue('paramType')
        })
      }
      //选择参数
      const saveParam=(selectedRows)=>{
        paramsForm.setFields([
          {
            name:'paramName',
            value:selectedRows[0]['formColumnCode']
          },
          {
            name:'paramDesc',
            value:selectedRows[0]['formColumnName']
          },
          {
            name:'paramValue',
            value:`${selectedRows[0]['formTableCode']}*${selectedRows[0]['formColumnCode']}`
          }
        ])
        setParentState({
          isShowColSelect:false
        })
      }
      //保存网关配置
      const saveGateWay=()=>{
        if(changeStatus){
          let newGatewayExpressionList = [];
          let pblicParam = {
            bizSolId,
            bizSolNodeBaseId,
            exclusiveGatewayCustom,
            exclusiveGatewayStrategy,
            formDeployId:bizFromInfo.formDeployId,
            gatewayActId:actId,
            procDefId
          }
          gatewayExpressionList.map((item)=>{
            let expressionIndex = _.findIndex(newGatewayExpressionList,{targetActId:item.targetActId});
            if(expressionIndex>=0){
              let expressionDesign = newGatewayExpressionList[expressionIndex]['expressionDesign']+','+item.expressionDesign;
              newGatewayExpressionList[expressionIndex]={...item,expressionDesign:expressionDesign,...pblicParam}
            }else{
              newGatewayExpressionList.push(
                {...item,
                ...pblicParam
                }
              );
            }
          })
          console.log('newGatewayExpressionList=',newGatewayExpressionList);
          dispatch({
            type:'applyModelConfig/saveGateWay',
            payload:{
              bizSolNodeBaseId:bizSolNodeBaseId,
              exclusiveGatewayStrategy:exclusiveGatewayStrategy,
              exclusiveGatewayCustom:exclusiveGatewayCustom,
              gatewayExpressionJson:JSON.stringify(newGatewayExpressionList)
            },
            callback:()=>{
              setParentState({
                gatewayModal:false
              })
              successChangeTab();
              setChangeStatus(false);
            }
          })
        }else{
          successChangeTab();
          setChangeStatus(false);
        }
      }
      //自定义处理
      const changeCustom=(e)=>{
        setChangeStatus(true);
        setParentState({
          exclusiveGatewayCustom:e.target.value
        })
      }
      //行样式
    const rowClassName=(record, index)=>{
      if(index==editIndex){
        return indexStyles.select_edit_row;
      }else{
        return ''
      }
    }
    //改变类型清空后面的值
    const changeParamType=(value)=>{
      let fields = [];
      fields=[
        {
          name:'paramName',
          value:''
        },
        {
          name:'paramDesc',
          value:''
        },
        {
          name:'paramValue',
          value:''
        },
      ]
      paramsForm.setFields(fields)
    }
    return (
          <>
            <div className={styles.gateway} id={`node_attribute_${bizSolId}`}>
              <div style={{height:'40px',display:"flex",justifyContent: 'space-between',alignItems: 'center'}}>
                <Radio.Group options={nodeObj.type=="ExclusiveGateway"?plainOptions:exalPlainOptions} onChange={onChangeStrategy} value={exclusiveGatewayStrategy}/>
                {operations()}
              </div>
              <div style={{display:"flex", flexDirection: 'column', justifyContent: 'center', alignItems:'center',overflow:'auto',width:'100%',height:'calc(100% - 40px)'}}>
                {exclusiveGatewayStrategy=='0'? <p style={{textAlign:'center'}}>注：根据不同网关属性，用户可进行主观网关分支选择，"互斥网关" 只能选择一条分支路线，"包容网关" 至少选择一条分支路线。</p>:null}
                {exclusiveGatewayStrategy=='1'?
                <div style={{width:'100%',height:'100%'}}>
                  <p>网关条件</p>
                  <Form
                      form={paramsForm}
                      onFinish={onFinish.bind(this)}
                      initialValues={{
                        paramSource:'FROMFORM',
                        paramType:"NUMBER"
                      }}
                  >
                      <Form.Item name="id" label="id" hidden={true}>
                        <Input/>
                      </Form.Item>
                      <Row gutter={0} style={{marginTop:'8px'}}>
                          <Col span={6} >
                              <Form.Item name="paramSource" label="参数来源" style={{margin:'0'}}>
                                  <Select>
                                      <Select.Option value="FROMFORM">来自表单</Select.Option>
                                  </Select>
                              </Form.Item>
                          </Col>
                          <Col span={4} >
                              <Form.Item name="paramType" label="参数类型" style={{margin:'0'}}>
                                  <Select onChange={changeParamType.bind(this)}>
                                      <Select.Option value="NUMBER">数值</Select.Option>
                                      <Select.Option value="STRING">字符串</Select.Option>
                                  </Select>
                              </Form.Item>
                          </Col>
                          <Col span={6} >
                              <Form.Item name="paramName" label="参数名称" style={{margin:'0'}}>
                                  <Input  readOnly onClick={showColSelectModal} autocomplete="off"/>
                              </Form.Item>
                          </Col>
                          <Form.Item name="paramDesc" label="参数描述" style={{display:"none"}}>
                            <Input/>
                          </Form.Item>
                          <Col span={4} >
                              <Form.Item
                                label="参数值"
                                name="paramValue"
                                style={{margin:'0'}}
                              >
                                <Input readOnly/>
                              </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Space>
                              <Button  type="primary" htmlType="submit" style={{marginLeft:'10px'}}>
                                保存
                              </Button>
                              <Button onClick={()=>{paramsForm.resetFields();}}>
                                重置
                              </Button>
                            </Space>
                          </Col>
                      </Row>
                  </Form>
                  <div>
                    <Table
                      {...tableProps}
                      key={loading}
                      style={{marginTop:'8px',height:'auto'}}
                      rowKey="index"
                      rowClassName={(record, index)=>rowClassName(record, index)}
                    />
                  </div>
                  <GWExpressionTable
                    query={query}
                    setChangeStatus={setChangeStatus}
                    setParentState={setParentState}
                    parentState={parentState}
                  />
              </div>:null}
                {exclusiveGatewayStrategy=='2'? <p style={{textAlign:'center'}}>注："包容网关" 设置此属性，用户必须同时选择所有分支路线。</p>:null}
                {exclusiveGatewayStrategy=='3'?
                <div style={{width:'100%',height:'100%'}}>
                <div style={{width:'100%',height:'20px',color:'blue'}}>必须实现接口 com... 实例规范</div>
                <Input.TextArea value={exclusiveGatewayCustom} style={{height: 'calc(100% - 20px)'}} onChange={changeCustom}/>
                </div> : null}
              </div>
            </div>
            <div className={indexStyles.node_button}>
              <Button className={styles.save} onClick={cancelNodeModal}>取消</Button>
              <Button onClick={saveGateWay}  type="primary" className={styles.save}>保存</Button>
            </div>
            {isShowColSelect&&<ParamsModal query={query} saveParam={saveParam} dataType={dataType} parentState={parentState} setParentState={setParentState}/>}
        </>
    )
}



export default (connect(({applyModelConfig,layoutG,loading})=>({
    applyModelConfig,
    ...layoutG,
    loading
  }))(Gateway));
