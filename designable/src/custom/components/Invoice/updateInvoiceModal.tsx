/**
 * 废弃文件
 */
import React from 'react'
import { connect } from 'dva'
import { Modal, Form, Button, Input, message } from 'antd'
import { useModel } from 'umi'
function updateInvoiceModal({
  getInvoiceTreeFn,
  detailData,
  compareData,
  parentId,
  setState,
}) {
  const masterProps = useModel('@@qiankunStateFromMaster')
  let { targetKey } = masterProps
  const [form] = Form.useForm()
  const {
    updateInvoiceTree, //修改票据分类
  } = useModel('invoice')
  const handelCanel = () => {
    setState({
      isShowUpdate: false,
    })
  }
  const onFinish = (values) => {
    const res = compareData.find(
      (item) => item.classifyName == values.classifyName
    )
    if (res) {
      message.error('同一级别下名称不可重复')
    } else {
      updateInvoiceTree(
        {
          classifyName: values.classifyName,
          classifyId: detailData.classifyId,
        },
        () => {
          getInvoiceTreeFn('', parentId, true)
        }
      )
      setState({
        isShowUpdate: false,
      })
    }
  }
  return (
    <Modal
      title={'修改票据类型'}
      visible={true}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
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
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{ classifyName: detailData && detailData.classifyName }}
      >
        <Form.Item label="分类名称" name="classifyName">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default updateInvoiceModal
