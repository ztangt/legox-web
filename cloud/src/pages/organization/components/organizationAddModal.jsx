import { connect } from 'dva';
import React, { useState } from 'react';
import { Button, Space, Upload,Avatar ,message,Row, Col,Input ,Switch,Select,DatePicker,Form,Radio,Modal,Spin} from 'antd';
import _ from "lodash";
import styles from '../index.less';
import { history } from 'umi';
const FormItem = Form.Item;
const { TextArea } = Input;
import pinyinUtil from '../../../service/pinyinUtil';
   
function addForm ({dispatch,loading,searchObj,onAddCancel}){ 
    const pathname = '/organization';
    const { organizationUg} = searchObj[pathname];

    const [form] = Form.useForm();
    const layout =  {labelCol: { span: 8 },wrapperCol: { span: 16 }};
    //输入完姓名后失焦事件
    function nameCallback(e){
        let name = `${pinyinUtil.getPinyin(e.target.value, '', false, true)},${pinyinUtil.getFirstLetter(e.target.value).toLowerCase()}`
       // currentUg['orgShortName'] = name;

        form.setFieldsValue({
            orgShortName: name,
        });
    }
    function onFinish(values){
        //onAssSubmit(values)
        values.tenantName = values.tenantName ? values.tenantName.trim() : '';
        if(organizationUg.id){
            dispatch({
                type:"organization/updateOrgCenters",
                payload:{
                    tenantName:values.tenantName,
                    id:organizationUg.id
                }
            })
        }else{
            dispatch({
                type:"organization/addOrgCenters",
                payload:{
                    tenantName:values.tenantName,
                    
                }
            })
        }
        
    }
    return (
        <Modal
            visible={true}
            footer={false}
            width={600}
            title={organizationUg.id ? '组织中心修改' : '组织中心新增'}
            onCancel={onAddCancel}
            className={styles.add_form}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById('organization_container')
            }}
            footrt={
                [
                   
                <Button onClick={onAddCancel}>
                    取消
                </Button>,
                <Button  type="primary" htmlType="submit" loading={loading.global} onClick={()=>{form.submit()}}>
                    保存
                </Button>
                ]
            }
        >
            <div >
                <Form  onFinish={onFinish}  form={form} initialValues={organizationUg}>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="组织中心名称"
                                name="tenantName" 
                                rules={[
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* <Row className={styles.bt_group} style={{width: '200px',margin:'24px auto 0'}} >
                        <Button  type="primary" htmlType="submit" loading={loading.global}>
                            保存
                        </Button>
                        <Button onClick={onAddCancel} style={{marginLeft: 8}}>
                            取消
                        </Button>
                    </Row> */}
                </Form>  
            </div>
    </Modal>
    )
  }


  
export default (connect(({organization,layoutG,loading})=>({
    ...organization,
    ...layoutG,
    loading
  }))(addForm));
