// 基本属性
import { connect } from 'dva';
import React, { useState,useEffect, useLayoutEffect,useRef } from 'react';
import { Modal,Button,Form,Input,Space,Select,Row,Col,Checkbox,Radio,Spin,message,InputNumber} from 'antd';
import _ from "lodash";
import styles from '../index.less';
import ORGTREE from './basicUserModal';
import { parse } from 'query-string';
function basicAttribute ({dispatch,loading,onNodeCancel,query,successChangeTab,parentState,setParentState}){
    const bizSolId = query.bizSolId;
    const {actId,procDefId,bizFromInfo,NodeBaseObj,orgTreeModal,nodeElement,preNodeTabValue,
      nextNodeTabValue,preActId,nodeTabValue,selectedDatas,selectedDataIds}=parentState;
    const [str, setStr] = useState(''); //点击选择 modal 框
    const [changeStatus,setChangeStatus] = useState(false) //判断页面有无点击事件 有点击保存 无不调保存接口
    // const [nodeTag,setNodeTag]=useState([])
    const [form] = Form.useForm();
    const layout =  {labelCol: { span: 6 },wrapperCol: { span: 18 }};
    useEffect(() => {
      if(preNodeTabValue=='info'||(nodeTabValue=='info'&&preActId==actId)){
        form.submit()
      }
    },[preNodeTabValue,preActId]);
    useLayoutEffect(() => {
      getNodeBase()
    },[actId]);
    useEffect(()=>{
        // dispatch({//不知道啥情况，我看model中去掉了
        //     type:'applyModelConfig/getDictType',
        //     payload:{
        //         dictTypeCode: 'JDBQ',
        //         showType: 'ALL',
        //         isTree: 1,
        //         searchWord: ''
        //     }
        // })
    },[])
    // let marginStyle = {
    //     //width: '200px',
    //     //margin:'24px auto 0',
    //     marginTop:NodeBaseObj.multiInstance == 'none'? '18px':'-18px'
    // }
    function getNodeBase(){ //基本属性
      let arr = nodeElement.filter( x => actId == x.id)
      dispatch({
          type:"applyModelConfig/getNodeBase",
          payload:{
              bizSolId:bizSolId,
              procDefId:procDefId,
              formDeployId:bizFromInfo.formDeployId,
              actId
          },
          callback:function(NodeBaseObj){
            setParentState({
              NodeBaseObj:NodeBaseObj
            })
            form.setFieldsValue(
              {
                ...NodeBaseObj,
                actName:arr[0].name,
                returnStrategy:NodeBaseObj.returnStrategy!='0'?NodeBaseObj.returnStrategy:["1"],
                jointSignatureStrategy:!NodeBaseObj.jointSignatureStrategy?'0':NodeBaseObj.jointSignatureStrategy,
                jointSignatureCount:!NodeBaseObj.jointSignatureCount||NodeBaseObj.jointSignatureCount=='0'?1:NodeBaseObj.jointSignatureCount,
                // nodeTag:NodeBaseObj.nodeTag?NodeBaseObj.nodeTag.split(','):undefined
              }
            )
          }
      })
    }
    function orgTreeClick(str){
        setStr(str)
        let arr = [];
        //指定参与者已处理
        if(str == 'jointSignatureUserNames'){
          if(form.getFieldValue('jointSignatureUsers')){
              arr = form.getFieldValue('jointSignatureUsers').split(',')
          }
        }else{//指定参与者中有一个已处理
          if(form.getFieldValue('jointSignatureAllUsers')){
              arr = form.getFieldValue('jointSignatureAllUsers').split(',')
          }
        }
        setParentState({
          orgTreeModal:true,
          selectedDataIds:arr
        })
    }
    function getTextByJs(arr) {
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            str += arr[i]+ ",";
        }
        if (str.length > 0) {
            str = str.substr(0, str.length - 1);
        }
        return str;
    }
    function selectNodeTag(value){
        console.log(value,'value');
        setNodeTag(value)
    }
    function onFinish(values){
      if(values['jointSignatureStrategy']=='3'&&!values['jointSignatureUserNames']){
        message.error('请填写选中相的内容');
        return;
      }
      if(values['jointSignatureStrategy']=='2'&&!values['jointSignatureAllUserNames']){
        message.error('请填写选中相的内容');
        return;
      }
      if(values['jointSignatureStrategy']=='4'&&!values['jointSignatureCustom']){
        message.error('请填写选中相的内容');
        return;
      }
        if(NodeBaseObj.multiInstance == 'none'){
            if(values.mergerStrategy && values.mergerStrategy != '0' && values.mergerStrategy.length > 0){
                values.mergerStrategy = getTextByJs(values.mergerStrategy)
            }else{
                values.mergerStrategy = '0';
            }
            if(values.returnStrategy && values.returnStrategy != '0' && values.returnStrategy.length > 0){
                if(typeof values.returnStrategy=='object'){
                    values.returnStrategy = getTextByJs(values.returnStrategy)
                }
            }else{
                values.returnStrategy = '';
            }
        }else{
            if(typeof values.returnStrategy=='object'){
                values.returnStrategy = values.returnStrategy?.join(',');
            }
        }
        if(changeStatus){
            dispatch({
                type:"applyModelConfig/updateNodeBase",
                payload:{
                    ...values,
                    bizSolId,
                    procDefId,
                    formDeployId:bizFromInfo.formDeployId,
                    actId,
                    bizSolNodeBaseId:NodeBaseObj.bizSolNodeBaseId,
                    // nodeTag:nodeTag?nodeTag.join(','):''
                },
                callback:function(){
                    //更新基本信息数据
                    setParentState({
                        NodeBaseObj:{
                            ...parentState.NodeBaseObj,
                            ...values
                        }
                    })
                    setChangeStatus(false)
                    successChangeTab();
                }
            })
        }
        else{
          successChangeTab();
        }
    }
    const checkStrategy=(values)=>{
      if(values.includes('3')){
        form.setFieldsValue({returnStrategy:['3']})
      }
    }
    function onValuesChange(value){
        setChangeStatus(true)
    }
    return (
        <div style={{padding:'8px 0px 0px 0px',height:'100%',overflow:'hidden'}}>
          <Form
              form={form}
              onFinish={onFinish.bind(this)}
              onValuesChange={onValuesChange.bind(this)}
              className={styles.basicAttribute_form}
              style={{height: 'calc(100% - 48px)',overflow: 'auto',paddingRight: '8px'}}
          >
              <Row gutter={0} >
                  <Col span={12}>
                      <Form.Item
                          {...layout}
                          label="节点ID"
                          name="actId"
                          style={{marginBottom:'5px'}}
                      >
                          <Input disabled />
                      </Form.Item>
                  </Col>
                  <Col span={12}>
                      <Form.Item
                          {...layout}
                          label="节点名称"
                          name="actName"
                          style={{marginBottom:'5px'}}
                      >
                          <Input disabled />
                      </Form.Item>
                  </Col>
              </Row>
              <Row gutter={0} >
                  <Col span={12}>
                      <Form.Item
                          {...layout}
                          label="节点类型"
                          name="actType"
                          style={{marginBottom:'5px'}}
                      >
                          <Select disabled>
                              <Select.Option value="userTask">用户任务</Select.Option>
                              <Select.Option value="startEvent">启动事件</Select.Option>
                              <Select.Option value="endEvent">结束事件</Select.Option>
                          </Select>
                      </Form.Item>
                  </Col>
                  <Col span={12}>
                      <Form.Item
                          {...layout}
                          label="办理策略"
                          name="dealStrategy"
                          style={{marginBottom:'5px'}}
                      >

                          {NodeBaseObj.multiInstance == 'none' ? <Select>
                              <Select.Option value="1">单人办理</Select.Option>
                              <Select.Option value="2">多人竞办</Select.Option>
                              {/* <Select.Option value="3">多人认领后办理</Select.Option> */}
                              <Select.Option value="6">内部循环</Select.Option>
                          </Select> : <Select disabled>
                              <Select.Option value="4">多人并行</Select.Option>
                              <Select.Option value="5">多人串行</Select.Option>
                          </Select>}
                      </Form.Item>
                  </Col>
              </Row>
              {NodeBaseObj.multiInstance == 'none' ||NodeBaseObj.dealStrategy=='5' ? <div style={{height:'150px',border:'1px solid #ccc',padding:'10px'}}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => prevValues.dealStrategy !== currentValues.dealStrategy}
                >
                  {({ getFieldValue }) => {
                      return getFieldValue('dealStrategy') == '1'&&<p>节点合并设置：</p>
                  }}
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => prevValues.dealStrategy !== currentValues.dealStrategy}
                >
                  {({ getFieldValue }) =>
                    getFieldValue('dealStrategy') == '1'&&
                      <Form.Item name="mergerStrategy" label="" noStyle>
                        <Checkbox.Group>
                            <Row>
                                <Col span={16}>
                                    <Checkbox value="1">
                                        办理人为发起人时，跳过此节点
                                    </Checkbox>
                                </Col>
                                <Col span={16}>
                                    <Checkbox value="2">
                                        已办理人中包含当前人时，跳过此节点
                                    </Checkbox>
                                </Col>
                                <Col span={16}>
                                    <Checkbox value="3">
                                        处理人和上一步相同时，跳过此节点
                                    </Checkbox>
                                </Col>
                            </Row>
                        </Checkbox.Group>
                      </Form.Item>
                  }
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => prevValues.dealStrategy !== currentValues.dealStrategy}
                >
                  {({ getFieldValue }) =>
                    getFieldValue('dealStrategy') == '1' ? <Row gutter={0} style={{marginTop:'10px'}}>
                        <Col span={16}>
                            <Form.Item name="mergerSignStrategy" label="跳过默认意见">
                                <Radio.Group>
                                    <Radio value="0">无意见</Radio>
                                    <Radio value="1">处理人上次处理意见</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row> : ''
                  }
                </Form.Item>
              </div> :
                <div style={{height:'200px',border:'1px solid #ccc',padding:'10px'}}>
                  <p>离开方式：</p>
                  <Row gutter={0} style={{marginTop:'10px'}}>
                      <Col span={24}>
                          <Form.Item name="jointSignatureStrategy" label="" noStyle>
                              <Radio.Group>
                                  <Space direction="vertical">
                                      <Radio value={"1"}>参与者达到&nbsp;
                                          <Form.Item name="jointSignatureCount" label="" noStyle>
                                              <InputNumber min={1} precision={0}/>
                                          </Form.Item>
                                      &nbsp;个办理</Radio>
                                      <Radio value={"2"}>指定参与者已处理&nbsp;
                                          <Form.Item name="jointSignatureAllUserNames" label="" noStyle>
                                              <Input style={{height:'20px',width:'320px'}} onClick={orgTreeClick.bind(this,'jointSignatureAllUserNames')} readOnly/>
                                          </Form.Item>
                                          <Form.Item name="jointSignatureAllUsers" label="" noStyle>
                                              <Input style={{display:'none'}}/>
                                          </Form.Item>
                                      </Radio>
                                      <Radio value={"3"}>指定参与者中有一个已处理&nbsp;
                                          <Form.Item name="jointSignatureUserNames"  label="" noStyle>
                                              <Input style={{height:'20px',width:'320px'}} onClick={orgTreeClick.bind(this,'jointSignatureUserNames')} readOnly/>
                                          </Form.Item>
                                          <Form.Item name="jointSignatureUsers" label="" noStyle>
                                              <Input style={{display:'none'}}/>
                                          </Form.Item>
                                      </Radio>
                                      <Radio value={"0"}>超过&nbsp;
                                          <Form.Item name="jointSignaturePercent" label="" noStyle>
                                              <InputNumber precision={2} min={1} max={100}/>
                                          </Form.Item>
                                      &nbsp;%，流程流转到下一节点</Radio>
                                      <Radio value={"4"}>拓展规则（必须实现接口：com.horizon.core）&nbsp;
                                          <Form.Item name="jointSignatureCustom" label="" noStyle>
                                              <Input style={{height:'20px',width:'420px'}}/>
                                          </Form.Item>
                                      </Radio>
                                  </Space>
                              </Radio.Group>
                          </Form.Item>
                      </Col>
                  </Row>
              </div>}
              <Row gutter={0} style={{marginTop:'10px'}} className={styles.input_number_row}>
                  <Col span={5}>
                      <Form.Item label="办理期限">
                          <Input.Group compact>
                              <Form.Item
                                  name='dealTern'
                                  style={{marginBottom:'5px'}}
                                  noStyle
                              >
                                  <InputNumber style={{width:'44px'}} defaultValue="0" precision={0} min={0}/>
                              </Form.Item>
                              <Form.Item
                                  name='dealTernUnit'
                                  style={{marginBottom:'5px'}}
                                  noStyle
                              >
                                  <Select style={{width:'84px'}}>
                                      <Select.Option value="DAY">自然日</Select.Option>
                                      <Select.Option value="WORK_DAY">工作日</Select.Option>
                                      <Select.Option value="HOUR">小时</Select.Option>
                                  </Select>
                              </Form.Item>
                          </Input.Group>
                      </Form.Item>
                  </Col>
                  <Col span={6}>
                      <Form.Item label="警告时限">
                          <Input.Group compact>
                              <Form.Item
                                  name='urgeTern'
                                  style={{marginBottom:'5px'}}
                                  noStyle
                              >
                                  <InputNumber style={{width:'44px'}} defaultValue="0" precision={0} min={0}/>
                              </Form.Item>
                              <Form.Item
                                  name='urgeTernUnit'
                                  style={{marginBottom:'5px'}}
                                  noStyle
                              >
                                  <Select style={{width:'84px'}}>
                                      <Select.Option value="DAY">自然日</Select.Option>
                                      <Select.Option value="WORK_DAY">工作日</Select.Option>
                                      <Select.Option value="HOUR">小时</Select.Option>
                                  </Select>
                              </Form.Item>
                          </Input.Group>
                      </Form.Item>
                  </Col>
                  <Col span={8}>
                      <Form.Item label="催办次数不超过">
                          <Input.Group compact>
                              <Form.Item
                                  name='urgeTimes'
                                  noStyle
                                  style={{marginBottom:'5px'}}
                              >
                                  <InputNumber style={{width:'44px'}} precision={0} min={0}/>
                                  {/* <Input style={{width:'25%'}}/><span style={{lineHeight:'32px'}}>&nbsp;次（0次表示不限次）</span> */}
                              </Form.Item>
                              <span style={{lineHeight:'28px'}}>&nbsp;次（0次表示不限次）</span>
                          </Input.Group>
                      </Form.Item>
                  </Col>
                  <Col span={5}>
                      <Form.Item label="催办间隔">
                          <Input.Group compact>
                              <Form.Item
                                  name='urgeInterval'
                                  noStyle
                                  style={{marginBottom:'5px'}}
                              >
                                  <InputNumber style={{width:'44px'}} precision={0} min={0}/>
                              </Form.Item>
                              <Form.Item
                                  name='urgeIntervalUnit'
                                  noStyle
                                  style={{marginBottom:'5px'}}
                              >
                                  <Select style={{width:'84px'}}>
                                      <Select.Option value="HOUR">小时</Select.Option>
                                      <Select.Option value="MINUTE">分钟</Select.Option>
                                  </Select>
                              </Form.Item>
                          </Input.Group>
                      </Form.Item>
                  </Col>
              </Row>
              <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) =>{
                console.log("getFieldValue('returnStrategy')",getFieldValue('returnStrategy'));
                return (
                  <Form.Item name="returnStrategy">
                  <Checkbox.Group style={{width:'100%'}} onChange={checkStrategy}>
                  <Row gutter={0}>
                      <Col span={2}>
                          <span>驳回设置：</span>
                      </Col>
                      <Col span={3} style={{borderRight:'1px solid #ccc'}}>
                          <Checkbox value="3">
                              自由驳回
                          </Checkbox>
                      </Col>
                      {getFieldValue('returnStrategy')!='3' ? (<Col span={3} style={{marginLeft:'10px'}}>
                          <Checkbox value="1">
                              驳回上一节点
                          </Checkbox>
                      </Col>) : ''}
                      {getFieldValue('returnStrategy')!='3' ? (<Col span={3} >
                          <Checkbox value="2">
                              驳回拟稿节点
                          </Checkbox>
                      </Col>) : ''}
                  </Row>
                </Checkbox.Group>
                </Form.Item>
                )
              }
              }
              </Form.Item>
              <Row gutter={0} style={{marginTop:'10px'}}>
                  <Col span={16}>
                      <Form.Item name="setRedFlag" label="允许套红" initialValue={NodeBaseObj.setRedFlag}>
                          <Radio.Group>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                          </Radio.Group>
                      </Form.Item>
                  </Col>
              </Row>
              {/* <Row gutter={0}>
                  <Col span={16}>
                      <Form.Item name="nodeTag" label="节点标签" initialValue={NodeBaseObj.nodeTag}>
                          <Select mode="multiple" allowClear onChange={selectNodeTag} style={{width:'220px'}}>
                              {
                                  basicSelectData.map(item=>{
                                      return <Select.Option value={item.dictInfoCode}>{item.dictInfoName}</Select.Option>
                                  })
                              }
                          </Select>
                      </Form.Item>
                  </Col>
              </Row> */}
          </Form>
            <div className={styles.node_button}>
              <Button onClick={onNodeCancel}>
                  取消
              </Button>
              <Button  type="primary" htmlType="submit"  onClick={()=>{form.submit()}}>
                  保存
              </Button>
            </div>
            {orgTreeModal && (<ORGTREE //单位组织选人
                query={query}
                form={form}
                str={str}
                setChangeStatus={setChangeStatus}
                parentState={parentState}
                setParentState={setParentState}
            />)}
        </div>
    )
}



export default (connect(({applyModelConfig,layoutG,loading})=>({
    applyModelConfig,
    ...layoutG,
    loading
  }))(basicAttribute));
