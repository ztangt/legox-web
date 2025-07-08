import { connect } from 'dva';
import React, { useState } from 'react';
import { Button, Space, Upload,Avatar ,message,Row, Col,Input ,Switch,Select,DatePicker,Form,Radio,Modal,Spin} from 'antd';
import _ from "lodash";
import styles from '../index.less';
import { history } from 'umi';
const FormItem = Form.Item;
const { TextArea } = Input;
import pinyinUtil from '../../../service/pinyinUtil';
   
function addForm ({dispatch,loading,onAddCancel,onAssSubmit,postUg,onAddSubmit,isCat,selectedOrgRows}){ 
    const [form] = Form.useForm();
    const layout =  {labelCol: { span: 8 },wrapperCol: { span: 16 }};
    function onFinish(values){
        values['isEnable'] = values.isEnable?1:0;
        values.postName = values.postName ? values.postName.trim() : '';
        values.postShortName = values.postShortName ? values.postShortName.trim() : '';
        values.orgCode = selectedOrgRows[0]?.orgCode;
        onAddSubmit(values)
    }
    //输入完姓名后失焦事件
    function nameCallback(e){
        let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
        if(!postUg.id){
            form.setFieldsValue({
                postNumber: name,
            });
        }
    }
    function checkUserName(_,value){
        let regCode = /^[a-zA-Z0-9_]*$/;
        if(value&&!regCode.test(value)){
            return Promise.reject(new Error('支持字母、数字，下划线'))
        }else{
            return Promise.resolve();
        }
           
    }
    return (
        <Modal
            visible={true}
            width={900}
            title={isCat?'查看岗位':postUg.id?'岗位修改':'新增岗位'}
            onCancel={onAddCancel}
            className={styles.add_form}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById('organization_container')
            }}
            footer={
                !isCat&&[
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
                <Form  onFinish={onFinish} form={form} initialValues={postUg}>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                label="&nbsp;&nbsp;&nbsp;所属单位"
                                {...layout}
                                name="parentOrgName" 
                            >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                label="是否启用"
                                {...layout}
                                name="isEnable" 
                                valuePropName="checked"
                            >
                                <Switch disabled={isCat}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="岗位名称"
                                name="postName" 
                                rules={[
                                    { required: true,message:'请输入岗位名称',whitespace: true },
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                {/* <Input onBlur={(e)=>{nameCallback(e)}}/> */}
                                <Input disabled={isCat} onChange={nameCallback.bind(this)}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                label="所属部门"
                                {...layout}
                                name="parentDeptName" 
                            
                            >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                label="岗位编码"
                                {...layout}
                                name="postNumber" 
                                rules={[
                                    { required: true,message:'请输入岗位编码' },
                                    { max: 50,message:'最多输入50个字符'},
                                    { validator: checkUserName.bind(this)}
                                ]}
                            >
                                <Input disabled={postUg.id}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="岗位简称"
                                name="postShortName" 
                                rules={[
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                <Input disabled={isCat}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item 
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        label="岗位描述"
                        name="postDesc" 
                        rules={[
                            { max: 200,message:'最多输入200个字符'}
                        ]}
                    >
                        <TextArea disabled={isCat}/>
                    </Form.Item>
                    {/* {!isCat&&
                    <Row className={styles.bt_group} style={{width: '200px',margin:'24px auto 0'}} >
                        <Button  type="primary" htmlType="submit" loading={loading.global}>
                            保存
                        </Button>
                        <Button onClick={onAddCancel} style={{marginLeft: 8}}>
                            取消
                        </Button>
                    </Row>
                    } */}
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
