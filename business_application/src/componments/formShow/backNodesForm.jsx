/**
 * 驳回环节
 */
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import React, {useState} from "react";
import styles from './index.less';
import {Form,Button,Input,Row,Space,Radio,Select,message} from 'antd';
import {connect,history} from 'umi';

function BizTaskForm({location,dispatch,formShow,dropScopeTab}){
    const bizSolId = location.query.bizSolId;
    const bizInfoId = location.query.bizInfoId;
    const bizTaskId = location.query.bizTaskId;
    const currentTab = location.query.currentTab;
    const {stateObj} = formShow;
    const {bizInfo,bizTaskNodes,formJSON,selectNodeUser,userType,backNodes,allFormTitle,actData,commentJson} = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab];
    const [fields, setFields] = useState([]);
    const [form] = Form.useForm();
    function onFinish(values){
        if(!values.actId){
            message.warning('请选择驳回环节');
            return
        }
        let info = _.find(backNodes.list,{actId:values.actId})
        let targetActJson={};
        targetActJson.actId=info.actId;
        targetActJson.actName=info.actName;
        targetActJson.actType=info.actType;
        targetActJson.taskActMap={};
        targetActJson.taskActMap[info.actId]=info;
        dispatch({
            type:'formShow/processBack',
            payload:{
                bizTaskId:bizTaskId,
                targetActJson:JSON.stringify(targetActJson),
                commentJsonArray:JSON.stringify(commentJson),
                variableJson: JSON.stringify(actData),
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
        dispatch({
            type:'formShow/updateStates',
            payload:{
                backNodes:{}
            }
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
    function selectBackId(e){
        // let arr = backNodes.list.filter(x=>x.bizTaskId == value)
        // form.setFieldsValue({
        //     handlerName: arr[0].handlerName,
        // });
      let actId=e.target.value;
      let info = _.find(backNodes.list,{actId:actId});
      if(info){
        form.setFields([
          {
            name:'handlerName',
            value:info.handlerName,
          },
          {
            name:'handlerId',
            value:info.handlerId,
          }
        ])
      }
    }
  return (
      <div style={{width:'650px',margin:'10px auto 0',padding:'20px',border:'1px solid #ccc',borderRadius:'10px'}}>
          <Form
            name="form"
            onFinish={onFinish}
            initialValues={{...backNodes.list[0],title:allFormTitle}}
            //fields={fields}
            form={form}
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
                    name="actId"
                    >
                    <Radio.Group onChange={selectBackId}>
                      {backNodes.list.map((item)=>{
                        return (
                          <Radio value={item.actId}>{item.actName}</Radio>
                        )
                      })}
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    style={{margin:'5px'}}
                    label="办理人"
                    name="handlerName"
                    >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  style={{margin:'5px',display:'none'}}
                  label="主办人id"
                  name="handlerId"
                  >
                    <Input/>
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
