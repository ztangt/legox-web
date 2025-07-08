import { connect } from 'dva';
import React, { useState } from 'react';
import { Modal,Button,Form,Input,Space,Select} from 'antd';
import { dataFormat } from '../../../util/util.js';
import {CloseOutlined} from '@ant-design/icons';
import _ from "lodash";
import styles from '../index.less';
import { history } from 'umi';
function WorkflowNode ({dispatch,loading,onCancel}){ 
   
    const [form] = Form.useForm();
    function nodeModalClick(obj,e){
        e.preventDefault();
        form.setFieldsValue({
            roleName: obj,
        });
    }
    function onFinish(values){
        console.log('values',values)
    }
    return (
        <Modal
            visible={true}
            width={'95%'}
            title='文件报批单-流程节点名称修改页面'
            bodyStyle={{minHeight:'420px',padding: '10px'}}
            onCancel={onCancel}
            // mask={false}
            // maskClosable={false}
            footer={false}
            centered
        >
            <div>
                <div className={styles.other}>
                    <p style={{fontSize:'16px',width:'calc(100% - 150px)',textAlign:'right',lineHeight:'32px',color:'red'}}>注：只修改节点名称并保存应用</p>
                    <Space>
                        <Button key="submit" type="primary" loading={loading.global} htmlType={"submit"} onClick={()=>{form.submit()}}>
                        保存
                        </Button>
                        <Button className={styles.fontSize7}>关闭</Button>
                    </Space>
                </div>
                <div className={styles.other}>
                    <div style={{height:"380px",width:"75%",margin:'10px 5%'}}>
                        {/* <img src={require('../../../../public/assets/161780104.jpg')} style={{width:"100%",height:"100%"}} useMap="#workflowNode"/> 
                        <map name="workflowNode" id="workflowNode">
                            <area shape="circle" coords="10,10,100" alt="Venus" onContextMenu={nodeModalClick.bind(this,'111')} style={{cursor:'pointer'}}/>
                            <area shape="circle" coords="200,200,100" alt="Mercury" onContextMenu={nodeModalClick.bind(this,'222')} style={{cursor:'pointer'}}/>
                        </map> */}
                    </div> 
                    <div style={{width:'25%',height:'380px',border:'1px solid #ccc',margin:'10px',padding:'10px'}}>
                        <Form
                            layout="vertical"
                            form={form}
                            // name="role"
                            onFinish={onFinish.bind(this)}
                        >
                            <Form.Item
                                label="节点ID"
                                name="roleId"
                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                label="节点名称"
                                name="roleName"
                                rules={[{message: '请输入节点名称!' },
                                    {max:50, message: '名称长度不能超过50!' },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item 
                                label="会签标识"
                                name="orgGroup" 
                            >
                                <Select disabled>
                                    <Select.Option value="1">无</Select.Option>
                                    <Select.Option value="2">并行会签</Select.Option>
                                    <Select.Option value="3">串行会签</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
               
            </div>   
        </Modal>
    )
}


  
export default (connect(({applyModelConfig,layoutG,loading})=>({
    ...applyModelConfig,
    ...layoutG,
    loading
  }))(WorkflowNode));
