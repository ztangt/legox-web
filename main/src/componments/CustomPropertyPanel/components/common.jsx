import { Button, Drawer, Space,Input,Form,Card } from 'antd';
import React, { useState,useEffect } from 'react';

const Common = ({updateInfo,elementBusinessObject,bpmnModeler,bpmnElement,children})=>{
    const [form] = Form.useForm();
    useEffect(()=>{
        form.setFieldsValue({
            types: bpmnElement.type,
        });
    },[bpmnModeler,elementBusinessObject,bpmnElement])
    const updateBaseInfo = (e,key)=>{
        const value = e.target.value
        updateInfo(e,key,value)
    }
    return (
        <div className='baseInfo'>
            {children}
            <Form  form={form} >
                <Form.Item
                  name="types"
                  label="节点类型"
                >
                  <Input disabled={true} style={{width: 184}} />
                </Form.Item>
                {/* <Form.Item
                  name="color"
                  label="颜色"
                >
                  <Input style={{width: 100}} type="color" onChange={(e)=>updateBaseInfo(e,"color")}/>
                </Form.Item> */}
          </Form>
        </div>
    )
}

export default Common