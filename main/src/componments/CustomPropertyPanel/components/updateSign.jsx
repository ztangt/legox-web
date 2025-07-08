import { Button, Drawer, Space,Input,Form,Card,Select  } from 'antd';
import React, { useState,useEffect } from 'react';
import {IdcardOutlined} from '@ant-design/icons'
import Header from './header'
const {Option} = Select

const ChoseSign = ({element,updateActiveIndex})=>{
    const [form] = Form.useForm();
    useEffect(()=>{
        // 回显设置右侧选择框
        if(element.type === 'bpmn:UserTask'){
            if(element.di.bpmnElement.loopCharacteristics){
                const isSequential = element.di.bpmnElement.loopCharacteristics.isSequential
                if(isSequential){
                    form.setFieldsValue({
                        typeSign: "2"
                    })
                }
                if(isSequential===false){
                    form.setFieldsValue({
                        typeSign: "1"
                    })
                }
            }else{
                form.setFieldsValue({
                    typeSign: "0"
                })
            }
        }
    },[element])
    const handleChange = (value)=>{
        const index = value; 
        updateActiveIndex(index)
    }
    return (
        <div className='updateSign'>
            <Header content="会签方式">
                <IdcardOutlined />
            </Header>
            <Form  form={form} >
              <Form.Item
                  name="typeSign"
                  label="会签"
                >
                  <Select
                        defaultValue="0"
                        className='selectSign'
                        onChange={handleChange}
                        >
                        <Option value="0">无</Option>
                        <Option value="1">并行</Option>
                        <Option value="2">串行</Option>
                    </Select>
                </Form.Item>
          </Form>
        </div>
    )
}

export default ChoseSign