/**
 * 驳回环节
 */
import _ from "lodash";
import React, {useEffect, useState} from "react";
import styles from './index.less';
import {Form,Input,Row,Space,Radio,Select,message, Checkbox} from 'antd';
import {connect,history} from 'umi';
import {Button} from '@/componments/TLAntd';

function BizTaskForm({dispatch,formShow,dropScopeTab,mainform,state,setState}){
    const {backNodes,allFormTitle,actData,bizTaskId,cutomHeaders} = state;
    const [form] = Form.useForm();
    const [returnStrategy,setReturnStrategy] = useState();
    const [backIds,setBackIds] = useState([]);
    //节点选中默认值
    useEffect(()=>{
      if(backNodes&&backNodes.length){
        let info = backNodes[0];//默认为第一个
        setReturnStrategy(info.returnStrategy);
        if(info.returnStrategy!=3){
          let tmpBackIds = [];
          backNodes.map((item)=>{
            if(item.returnStrategy==info.returnStrategy){
              tmpBackIds.push(item.backId);
            }
          })
          form.setFields([
            {
              name:'backIds',
              value:tmpBackIds,
            }
          ])
          setBackIds(tmpBackIds);
        }else{
          form.setFields([
            {
              name:'backIds',
              value:[info.backId],
            }
          ])
          setBackIds([info.backId]);
        }
      }
    },[])
    function onFinish(values){
      debugger;
        if(!values.backIds||!values.backIds.length){
            message.warning('请选择驳回环节');
            return
        }
        let targetActJson={};
        let returnStrategy = '';
        let flowTaskActList = [];
        values.backIds.map((item)=>{
          let info = _.find(backNodes,{backId:item});
          returnStrategy = info.returnStrategy;
          flowTaskActList.push(info);
        })
        targetActJson={
          returnStrategy,
          flowTaskActList
        }
        dispatch({
            type:'formShow/processBack',
            payload:{
                bizTaskId:bizTaskId,
                flowAct:targetActJson,
                commentList:mainform?.values?.['commentJson'],
                variableJson:actData,
                headers:cutomHeaders

            },
            callback:function(){
              dropScopeTab();
            //     historyPush({
            //       pathname: '/dynamicPage',
            // //       query: {
            // //         userId
            // //       },
            //     });
            }
        })

    }

    function onCancel(){
      setState({
        backNodes:[]
      })
    }
    function selectBackId(checkedValues){
      //取差级就能获取改变的是哪个节点
      let info = {};
      if(checkedValues.length>backIds.length){//选中
        info = _.find(backNodes,{backId:checkedValues[checkedValues.length-1]});
        setReturnStrategy(info.returnStrategy);
        if(info.returnStrategy!=3){
          let tmpBackIds = [];
          backNodes.map((item)=>{
            if(item.returnStrategy==info.returnStrategy){
              tmpBackIds.push(item.backId);
            }
          })
          form.setFields([
            {
              name:'backIds',
              value:tmpBackIds,
            }
          ])
          setBackIds(tmpBackIds);
        }else{
          form.setFields([
            {
              name:'backIds',
              value:[info.backId],
            }
          ])
          setBackIds([info.backId]);
        }
      }else{//取消
        form.setFields([
          {
            name:'backIds',
            value:[],
          }
        ])
        setReturnStrategy();
        setBackIds([]);
      }
    }
  return (
      <div style={{width:window.location.href.includes('/mobile')?'unset':'650px',margin:window.location.href.includes('/mobile')?'10px auto 0px 10px':'10px auto 0px',padding:'20px',border:'1px solid #ccc',borderRadius:'10px'}}>
          <Form
            name="form"
            onFinish={onFinish}
            initialValues={{title:allFormTitle}}
            //fields={fields}
            form={form}
            className={styles.back_nodes_form}
          >
                <Form.Item
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    style={{margin:'5px'}}
                    label="文件标题"
                    name="title"
                    >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  style={{margin:'5px'}}
                  label="驳回环节"
                  name = 'backIds'
                >
                  <Checkbox.Group onChange={selectBackId.bind(this)}>
                    {backNodes.map((item)=>{
                      return (
                        <Checkbox
                          value={item.backId}
                          // disabled={returnStrategy?item.returnStrategy!=returnStrategy:false}
                        >
                          {item.actName}({item.handlerName})
                        </Checkbox>
                      )
                    })}
                  </Checkbox.Group>
                </Form.Item>
                <Row style={{width:'200px',margin:'10px auto 0'}}>
                    <Space style={{margin:'0 auto'}}>
                        <Button  type="primary" htmlType="submit">
                            驳回
                        </Button>
                        <Button onClick={onCancel}>
                            取消
                        </Button>
                    </Space>
                </Row>
            </Form>
      </div>
  );
}
export default connect(({formShow,loading})=>{return {formShow,loading}})(BizTaskForm);
