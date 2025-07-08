import React, { useState, useEffect } from 'react'
import {
  Modal,
  Input,
  Button,
  Form,
  Row,
  message,
  Tag,
  Card,
  Select,
} from 'antd'
import { useModel, useSelector } from 'umi'

const { Option } = Select
const FormItem = Form.Item

const symbolArr = [
  '(',
  ')',
  '+',
  '-',
  '*',
  '/',
  'sum',
  'avg',
  '.',
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
]

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } }

function Index({ onCancel, onSubmit, loading, numberData }) {
  useEffect(() => {
    if (numberData?.resultFormId) {
      console.log(numberData)
      setResultTable(numberData?.resultFormId)
      setExpressionKey(numberData?.expression)
      setExpressionVal(numberData?.expressionCn)
      setResIndex(findTableIndex(numberData?.resultFormId))
      form.setFieldsValue({ jgb: numberData?.resultFormId })
      form.setFieldsValue({ cfsj: numberData?.triggerType })
      form.setFieldsValue({ resultType: numberData?.resultType })
      form.setFieldsValue({
        jgzd: `${numberData?.resultColumnCode}-${numberData?.resultColumnName}`,
      })
    }
  }, [numberData])

  const { fieldData } = useModel('operation')
  const [selectTable, setSelectTable] = useState(null)
  const [resultTable, setResultTable] = useState(null)
  const [selIndex, setSelIndex] = useState(0)
  const [resIndex, setResIndex] = useState(0)
  const [expressionKey, setExpressionKey] = useState('')
  const [expressionVal, setExpressionVal] = useState('')

  const [form] = Form.useForm()

  function onFinish(values) {
    let operationJson = {
      resultFormId: fieldData[resIndex].id,
      resultFormCode: fieldData[resIndex].code,
      resultFormName: fieldData[resIndex].name,
      resultColumnCode: values.jgzd.split('-')[0],
      resultColumnName: values.jgzd.split('-')[1],
      expression: expressionKey,
      expressionCn: expressionVal,
      // toggleCase: checked ? 1 : 0,
      // toggleColumn,
      triggerType: values.cfsj,
      optType: 'DATE',
      resultType: values.resultType,
      startColumn: values.startColumn,
      endColumn: values.endColumn,
      // "overcome": "排除：WEEKEND 周末;HOLIDAY 节假日;"
    }
    onSubmit(operationJson, numberData)
  }

  function onHandlerTableClick(v) {
    const arr = v?.split('-')
    // const index = form.getFieldValue('ysb')
    const arrForm = fieldData[selIndex]
    setExpressionVal(`${expressionVal}${arrForm.name}:${arr[1]}`)
    setExpressionKey(`${expressionKey}${arrForm.code}:${arr[0]}`)
  }

  function onHandlerSymbolClick(v) {
    setExpressionVal(expressionVal + v)
    setExpressionKey(expressionKey + v)
  }

  const handleTableChange = (v) => {
    setSelectTable(v)
    setSelIndex(findTableIndex(v))
  }

  const handleResultTableChange = (v) => {
    setResultTable(v)
    setResIndex(findTableIndex(v))
  }

  function findTableIndex(id) {
    for (let i = 0; i < fieldData.length; i++) {
      if (fieldData[i].id == id) {
        return i
      }
    }
  }

  return (
    <Modal
      visible={true}
      footer={false}
      width={700}
      title={'日期运算'}
      onCancel={onCancel}
      // maskClosable={false}
      // mask={false}
    >
      <Form form={form} onFinish={onFinish}>
        <FormItem
          label="运算表"
          name="ysb"
          // rules={[{ required: true, message: '请选择运算表' }]}
        >
          <Select style={{ width: 120 }} onSelect={handleTableChange}>
            {fieldData.map((item, index) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              )
            })}
          </Select>
        </FormItem>
        <Row>
          <Card
            style={{
              width: '100%',
              maxHeight: 250,
              overflow: 'auto',
              marginBottom: 10,
            }}
            size="small"
          >
            {selectTable !== null &&
              fieldData[selIndex]?.children.map((item) => {
                return (
                  <Button
                    key={item.id}
                    style={{ cursor: 'pointer', margin: 5 }}
                    onClick={() =>
                      onHandlerTableClick(`${item.code}-${item.name}`)
                    }
                  >
                    {item.name}
                  </Button>
                )
              })}
          </Card>
        </Row>
        <Row>
          <FormItem
            label="结果类型"
            name="resultType"
            rules={[{ required: true, message: '请选择截止日期' }]}
          >
            <Select style={{ width: 200 }}>
              <Select.Option value="DAY">天</Select.Option>
              <Select.Option value="HOUR">时</Select.Option>
              <Select.Option value="MIN">分</Select.Option>
              <Select.Option value="SEC">秒</Select.Option>
            </Select>
          </FormItem>
          <FormItem
            label="触发事件"
            name="cfsj"
            rules={[{ required: true, message: '请选择触发事件' }]}
          >
            <Select style={{ width: 200 }}>
              {/* <Select.Option value="onBlur">失去焦点</Select.Option> */}
              <Select.Option value="onChange">change</Select.Option>
              {/* <Select.Option value="onCick">点击</Select.Option> */}
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem
            label="结果表"
            name="jgb"
            rules={[{ required: true, message: '请选择结果表' }]}
          >
            <Select style={{ width: 200 }} onSelect={handleResultTableChange}>
              {fieldData.map((item, index) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </FormItem>
          <FormItem
            label="结果字段"
            name="jgzd"
            rules={[{ required: true, message: '请选择结果字段' }]}
          >
            <Select style={{ width: 200 }}>
              {resultTable !== null &&
                fieldData[resIndex]?.children.map((item) => {
                  return (
                    <Option key={item.id} value={`${item.code}-${item.name}`}>
                      {item.name}
                    </Option>
                  )
                })}
            </Select>
          </FormItem>
        </Row>
        <FormItem label="运算符号" name="v7">
          <Card>
            {symbolArr.map((item, index) => {
              return (
                <Button
                  key={index}
                  style={{ cursor: 'pointer', margin: 5 }}
                  onClick={() => onHandlerSymbolClick(item)}
                >
                  {item}
                </Button>
              )
            })}
          </Card>
        </FormItem>
        <FormItem label="运算公式">
          <>
            <Input
              readOnly
              style={{ width: 400, marginRight: 10 }}
              value={expressionVal}
            ></Input>
            <Button
              onClick={() => {
                setExpressionKey('')
                setExpressionVal('')
              }}
            >
              清空
            </Button>
          </>
        </FormItem>
        <Row style={{ width: 300, margin: '20px auto' }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            确认
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ margin: '0 10px' }}
          >
            确认并继续设置
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </Row>
      </Form>
    </Modal>
  )
}

export default Index
