import React, { useState, useEffect } from 'react'
import {
  Modal,
  Input,
  Button,
  Form,
  Row,
  Switch,
  Card,
  Select,
  message,
} from 'antd'
import { useModel } from 'umi'

const { Option } = Select
const FormItem = Form.Item

// const symbolArr = ['(', ')', '+', '-', '*', '÷', 'sum', 'avg']
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

function Index({ onCancel, onSubmit, loading, numberData }) {
  useEffect(() => {
    if (numberData?.resultFormId) {
      setChecked(numberData?.toggleCase)
      setResultTable(numberData?.resultFormId)
      setExpressionKey(numberData?.expression)
      setToggleColumn(numberData?.toggleColumn)
      setExpressionVal(numberData?.expressionCn)
      setExpressionWithNum(numberData?.startColumn)
      setResIndex(findTableIndex(numberData?.resultFormId))
      form.setFieldsValue({ jgb: numberData?.resultFormId })
      form.setFieldsValue({ cfsj: numberData?.triggerType })
      form.setFieldsValue({
        jgzd: `${numberData?.resultColumnCode}-${numberData?.resultColumnName}`,
      })
    }
  }, [numberData])

  const { fieldData } = useModel('operation')
  const [checked, setChecked] = useState(false)
  const [selectTable, setSelectTable] = useState(null)
  const [resultTable, setResultTable] = useState(null)
  const [selIndex, setSelIndex] = useState(0)
  const [resIndex, setResIndex] = useState(0)
  const [toggleColumn, setToggleColumn] = useState('')
  const [expressionWithNum, setExpressionWithNum] = useState('')
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
      expression: `${expressionKey},${expressionWithNum}`,
      expressionCn: expressionVal,
      toggleCase: checked ? 1 : 0,
      toggleColumn,
      triggerType: values.cfsj,
      optType: 'NUMBER',
      // resultType: 结果类型：DAY 天;HOUR 时;MIN 分;SEC 秒,
      // "startColumn": "起始字段",
      // "endColumn": "截止字段",
      // "overcome": "排除：WEEKEND 周末;HOLIDAY 节假日;"
    }
    onSubmit(operationJson, numberData)
  }

  const handleTableChange = (v) => {
    setSelectTable(v)
    setSelIndex(findTableIndex(v))
  }

  const handleResultTableChange = (v) => {
    setResultTable(v)
    setResIndex(findTableIndex(v))
  }

  const toggleColumnChange = (v) => {
    console.log(v)
    setToggleColumn(v)
  }

  function onHandlerTableClick(v) {
    const arr = v?.split('-')
    // const index = form.getFieldValue('ysb')
    const arrForm = fieldData[selIndex]
    setExpressionVal(`${expressionVal}${arrForm.name}:${arr[1]}`)
    setExpressionKey(`${expressionKey}${arrForm.code}:${arr[0]}`)
    // 自用
    setExpressionWithNum(
      `${expressionWithNum}Number(${arrForm.code}:${arr[0]})`
    )
  }

  function onHandlerSymbolClick(v) {
    // console.log(form.getFieldValue('ysb'))
    // if (form.getFieldValue('ysb') !== undefined) {
    setExpressionVal(expressionVal + v)
    setExpressionKey(expressionKey + v)
    setExpressionWithNum(expressionWithNum + v)
    // } else {
    //   message.warning('请选择运算表')
    // }
  }

  const switchChange = (checked) => {
    setChecked(checked)
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
      open={true}
      footer={false}
      width={1000}
      title={'数字运算'}
      onCancel={onCancel}
      // maskClosable={false}
      // mask={false}
    >
      <Form form={form} onFinish={onFinish}>
        <Row>
          <Card
            title="运算字段"
            style={{ width: '30%', height: 400 }}
            size="small"
          >
            <div>
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
              <Card
                style={{ width: '100%', maxHeight: 250, overflow: 'auto' }}
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
            </div>
          </Card>
          <Card
            title="运算规则"
            style={{ width: '70%', height: 400 }}
            size="small"
          >
            <FormItem label="运算符号">
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
            <FormItem label="表达式">
              <>
                <Input
                  readOnly
                  style={{ width: 400 }}
                  value={expressionVal}
                ></Input>
                <Button
                  onClick={() => {
                    setExpressionKey('')
                    setExpressionVal('')
                    setExpressionWithNum('')
                  }}
                >
                  清空
                </Button>
              </>
            </FormItem>
            <Row>
              <FormItem
                label="结果表"
                name="jgb"
                rules={[{ required: true, message: '请选择结果表' }]}
              >
                <Select
                  style={{ width: 150 }}
                  onSelect={handleResultTableChange}
                >
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
                <Select style={{ width: 150 }}>
                  {resultTable !== null &&
                    fieldData[resIndex]?.children.map((item, index) => {
                      return (
                        <Option key={index} value={`${item.code}-${item.name}`}>
                          {item.name}
                        </Option>
                      )
                    })}
                </Select>
              </FormItem>
              <FormItem
                label="触发事件"
                name="cfsj"
                rules={[{ required: true, message: '请选择触发事件' }]}
              >
                <Select style={{ width: 150 }}>
                  {/* <Select.Option value="onBlur">失去焦点</Select.Option> */}
                  <Select.Option value="onChange">change</Select.Option>
                  {/* <Select.Option value="onCick">点击</Select.Option> */}
                </Select>
              </FormItem>
              <FormItem label="小写转大写">
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  checked={checked}
                  onChange={switchChange}
                />
                {checked ? (
                  <Select
                    style={{ width: 150 }}
                    defaultValue={toggleColumn}
                    onSelect={toggleColumnChange}
                  >
                    {resultTable !== null &&
                      fieldData[resIndex]?.children.map((item, index) => {
                        return (
                          <Option key={index} value={`${item.code}`}>
                            {item.name}
                          </Option>
                        )
                      })}
                  </Select>
                ) : null}
              </FormItem>
            </Row>
          </Card>
        </Row>
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
