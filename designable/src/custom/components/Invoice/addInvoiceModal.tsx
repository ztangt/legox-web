/**
 * 废弃文件
 */
import React from 'react'
import { Modal, Button, Form, Input, message } from 'antd'
import { connect } from 'dva'
import _ from 'lodash'
import { useModel } from 'umi'
function addInvoiceModal({
  parentId,
  compareData,
  getInvoiceTreeFn,
  setState,
}) {
  const { targetKey } = useModel('@@qiankunStateFromMaster')
  const {
    addInvoiceTree, //新增票据分类
  } = useModel('invoice')
  const [form] = Form.useForm()
  const handelCanel = () => {
    setState({
      isShow: false,
    })
  }
  const onFinish = (values) => {
    const res = compareData.find(
      (item) => item.classifyName == values.classifyName
    )
    if (res) {
      message.error('同一级别下名称不可重复')
    } else {
      addInvoiceTree(
        {
          classifyName: values.classifyName,
          parentId: parentId,
        },
        () => {
          getInvoiceTreeFn('', parentId, true)
        }
      )
      setState({
        isShow: false,
      })
    }
  }
  return (
    <Modal
      title={'新增票据类型'}
      visible={true}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
      zIndex={1500}
      mask={false}
      maskClosable={false}
      centered
      width={400}
      onCancel={handelCanel}
      footer={[
        <Button key="cancel" onClick={handelCanel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form.submit()
          }}
        >
          保存
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item label="票据类型" name="classifyName">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default addInvoiceModal
