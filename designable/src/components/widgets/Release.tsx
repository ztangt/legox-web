import React, { useState, useEffect } from 'react'
import {
  Modal,
  Input,
  Button,
  message,
  Form,
  Row,
  Col,
  Switch,
  TreeSelect,
} from 'antd'
import _ from 'lodash'
import { useModel, useSelector } from 'umi'
import pinyinUtil from '../../utils/pinyinUtil'
const FormItem = Form.Item
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } }

function Release({ onCancel, onSubmit, loading }) {
  const { settingForm, ctlgs, dsTree, setState } = useModel('designable')
  console.log('dsTree', dsTree)

  const [formInfo] = Form.useForm()
  useEffect(() => {
    if (settingForm?.dsId) {
      settingForm['dsId'] = settingForm?.dsId?.includes(settingForm?.dsDynamic)
        ? settingForm?.dsId
        : `${settingForm?.dsId},${settingForm?.dsDynamic}`
    }
    formInfo.setFieldsValue(settingForm)
  }, [settingForm])

  function onFinish(values) {
    values['dsDynamic'] = values?.dsId?.split(',')[1]
    var settingFormData = {
      ...settingForm,
      ...values,
    }
    setState({ settingForm: settingFormData }) //将要发布的值更新到json中
    setTimeout(() => {
      //延迟提交，否则校验不到值
      onSubmit(values)
    }, 800)
  }

  function onChange(e) {
    formInfo.setFieldsValue({
      formCode: pinyinUtil.getFirstLetter(e.target.value, false).toUpperCase(),
    })
  }
  let reg = /^[a-zA-Z\u4e00-\u9fa5]{1}.*$/
  let regAll = /^[a-zA-Z0-9_\u4e00-\u9fa5]*$/
  var regCode = /^[A-Z][A-Z0-9_]*$/
  function checkForm(rule, value) {
    if (value && !reg.test(value)) {
      return Promise.reject(
        new Error('汉字、字母开头,支持（汉字、字母、数字、下划线）')
      )
    } else if (value && !regAll.test(value)) {
      return Promise.reject(
        new Error('汉字、字母开头,支持（汉字、字母、数字、下划线）')
      )
    } else {
      return Promise.resolve()
    }
  }
  function checkFormCode(rule, value) {
    if (value && !regCode.test(value)) {
      return Promise.reject(
        new Error('字母开头，支持（大写字母、数字，下划线）')
      )
    } else {
      return Promise.resolve()
    }
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
    >
      <Form form={formInfo} onFinish={onFinish}>
        <Row gutter={0}>
          <Col span={11}>
            <Form.Item
              {...layout}
              label="表单分类"
              name="ctlgId"
              rules={[{ required: true, message: '请输入表单分类' }]}
            >
              <TreeSelect treeData={ctlgs} disabled />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item
              {...layout}
              label="数据源"
              name="dsId"
              rules={[{ required: true, message: '请选择数据源' }]}
            >
              <TreeSelect
                treeData={dsTree}
                disabled={
                  settingForm.isDeploy == 1 || settingForm?.dsId ? true : false
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col span={11}>
            <Form.Item
              {...layout}
              label="表单名称"
              name="formName"
              rules={[
                { required: true, message: '请输入表单名称' },
                { validator: checkForm.bind(this) },
              ]}
            >
              <Input
                disabled={settingForm.isDeploy == 1 ? true : false}
                onChange={onChange.bind(this)}
              />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item
              {...layout}
              label="表单编码"
              name="formCode"
              rules={[
                { required: true, message: '请输入表单编码' },
                { validator: checkFormCode.bind(this) },
              ]}
            >
              <Input disabled={settingForm.isDeploy == 1 ? true : false} />
            </Form.Item>
          </Col>
        </Row>
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

export default Release
