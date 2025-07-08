import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { Modal, Input, Button, message, Form, Row, Table, Card } from 'antd'
import { useModel, useSelector } from 'umi'
import FieldsTable from './FieldsTable'
import { MAIN_TABLE_CODE_NAME } from '../../../utils/constant'

function Index({ onCancel, onSubmit, loading }) {
  const primaryTableName = localStorage.getItem('primaryTableName') //主表名称 看看咋获取
  const { operationTable, operationList, saveOperation, setState } = useModel(
    'operation'
  )
  const { deployFormId } = useModel('designable')

  const [form] = Form.useForm()
  // const [operationJson, setOperationJson] = useState([])

  // useEffect(() => {
  //   if (operationList.length) {
  //     setOperationJson(operationList)
  //   }
  // }, [operationList]);

  function onFinish() {
    const list = operationList
    list.forEach((ele) => {
      ele.expression = ele.expression.replaceAll(
        `${primaryTableName}:`,
        `${MAIN_TABLE_CODE_NAME}:`
      )
      if (ele.resultFormCode === primaryTableName) {
        ele.resultFormCode = MAIN_TABLE_CODE_NAME
      }
      // ele.resultFormCode = ele.resultFormCode.replaceAll(
      //   primaryTableName,
      //   MAIN_TABLE_CODE_NAME
      // )
    })
    saveOperation(
      {
        deployFormId,
        operationJson: JSON.stringify(list),
      },
      successCallback
    )
  }

  function successCallback(data) {
    console.log('data', data)
  }

  function onSetList(values, data) {
    const tmp = _.cloneDeep(operationList)
    if (data?.resultFormId) {
      // 修改
      tmp[data?.index] = values
    } else {
      //新增
      tmp.push(values)
    }
    setState({ operationList: tmp })
  }

  return (
    <Modal
      visible={true}
      footer={false}
      width={1200}
      title={'运算设置'}
      onCancel={onCancel}
      // maskClosable={false}
      // mask={false}
    >
      <Form form={form} onFinish={onFinish}>
        <Row>
          <Card title="字段运算" style={{ width: '100%' }}>
            <FieldsTable onSetList={onSetList}></FieldsTable>
          </Card>
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

export default Index
