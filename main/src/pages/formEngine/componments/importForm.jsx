import React, { useState, useEffect } from 'react'
import {
  Modal,
  Input,
  Button,
  Form,
  Row
} from 'antd'
import _ from 'lodash'
import pinyinUtil from '../../../service/pinyinUtil'
import { history } from 'umi';
const FormItem = Form.Item
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } }

function Index({  onSubmit, loading, importForm, dispatch }) {
  const [formInfo] = Form.useForm()
  function onFinish(values) {
    if(!values?.formCode||!values?.formName){
      return
    }
    // onSubmit(values)
    dispatch({
      type: 'formEngine/updateStates',
      payload: {
        importForm: values,
        isSubmiting: true,
      },
    });
  }

  function onChange(e) {
    formInfo.setFieldsValue({
      formCode: pinyinUtil.getFirstLetter(e.target.value, false).toUpperCase(),
    })
  }
  const checkForm=(_,value)=>{
    let reg = /^[a-zA-Z\u4e00-\u9fa5]{1}.*$/;
    let regAll = /^[a-zA-Z0-9_\u4e00-\u9fa5]*$/;
    //且汉字字母数字下划线
    if(value&&!reg.test(value)){
      return Promise.reject(new Error('汉字、字母开头,支持（汉字、字母、数字、下划线）'))
    }else if(value&&!regAll.test(value)){
      return Promise.reject(new Error('汉字、字母开头,支持（汉字、字母、数字、下划线）'))
    }else{
      return Promise.resolve();
    }
  }
  const checkFormCode=(_,value)=>{
    var regCode = /^[A-Z][A-Z0-9_]*$/;
    //且汉字字母数字下划线
    if(value&&!regCode.test(value)){
      return Promise.reject(new Error('字母开头，支持（大写字母、数字，下划线）'))
    }else{
      return Promise.resolve();
    }
  }
  const onCancel = () =>{
    dispatch({
      type: 'formEngine/updateStates',
      payload: {
        importModal: false,
        importForm: {},
        isSubmiting: false,
        fileName: ''
      },
    });
  }
  return (
    <Modal
      visible={true}
      footer={false}
      width={800}
      title={'自由表单发布'}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      getContainer={() =>{
        return document.getElementById(`${history.location.pathname.split("/")[2]}_container`)||false
      }}
    >
      <Form form={formInfo} onFinish={onFinish} initialValues={importForm}>
        <Form.Item
          {...layout}
          label="表单名称"
          name="formName"
          rules={[{ required: true, message: '请输入表单名称' },
          {max: 64,message: '最多输入64个字符!'},
          {validator:checkForm}
          ]}
        >
          <Input
            onChange={onChange.bind(this)}
          />
        </Form.Item>

        <Form.Item
          {...layout}
          label="表单编码"
          name="formCode"
          rules={[{ required: true, message: '请输入表单编码' },
          {max: 64,message: '最多输入64个字符!'},
          {validator:checkFormCode},
          ]}
        >
          <Input />
        </Form.Item>

        <Row style={{ width: 200, margin: '20px auto' }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: 8 }}>
            取消
          </Button>
        </Row>
      </Form>
    </Modal>
  )
}

export default Index
