import { Button, Drawer, Space,Input,Form,Card } from 'antd';
import React, { useState,useEffect,useContext } from 'react';
import {FolderViewOutlined} from '@ant-design/icons'
import CustomContext from './context'
import Header from './header'
const { TextArea } = Input;
const BaseInfo = ({bpmnModeler,elementBusinessObject,bpmnElement,updateInfo,isCommon=false})=>{
    const [form] = Form.useForm();
    const context = useContext(CustomContext)
    useEffect(()=>{
        form.setFieldsValue({
            // id: elementBusinessObject.id,
            names: elementBusinessObject.name,
        });
    },[bpmnModeler,elementBusinessObject,bpmnElement,isCommon])

    const updateBaseInfo = (e,key)=>{
        const value = e.target.value
        updateInfo(e,key,value)
    }
    return (
        <div className='baseInfo'>
          <Header content="常规信息">
            <FolderViewOutlined />
          </Header>
            <Form  form={form}>
              <Form.Item
                  name="id"
                  label={isCommon?"节点ID":"ID"}
                >
                 {isCommon?<span>{elementBusinessObject.id}</span>:<span>{context.bizSolCode}</span>} 
                </Form.Item>
                <Form.Item
                  name="names"
                  label={isCommon?"节点名称":"名称"}
                  rules= {
                    [{
                      max: 50,message: '名称长度不能超过50!'
                    }]
                  }
                >
                 {isCommon?<Input maxLength={50} onChange={(e)=>updateBaseInfo(e,"name")}/>:<span>{decodeURI(context.bizSolName)}</span>} 
                </Form.Item>
                {/* <Form.Item
                  name="document"
                  label={isCommon?"节点描述":"流程描述"}
                >
                 <TextArea  onChange={(e)=>updateBaseInfo(e,"document")}/>
                </Form.Item> */}
          </Form>
        </div>
    )
}

export default BaseInfo