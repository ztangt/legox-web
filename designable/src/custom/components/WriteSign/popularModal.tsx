import GlobalModal from '@/public/GlobalModal'
import { Button, Col, Form, Input, Row, Select } from 'antd'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import styles from './index.less'
import PopularManageModal from './popularManageModal'
function Index({
  setState,
  setCommentList,
  signUrl,
  popularList,
  popularManageModal,
}) {
  const [form] = Form.useForm()
  const masterProps = useModel('@@qiankunStateFromMaster')
  let { location, targetKey } = masterProps
  const [list, setList] = useState([])
  const { getPopularList } = useModel('sign')
  useEffect(() => {
    getList()
  }, [])
  const getList = () => {
    getPopularList(
      {
        bizSolId: location.query.bizSolId,
      },
      (data) => {
        if (data.data.list.length && data.data.list.length != 0) {
          setState({ popularList: data.data.list })
          setList(data.data.list)
        } else {
          setState({ popularList: [] })
          setList(['同意', '圈阅', '驳回'])
        }
      }
    )
  }
  console.log('list', list)

  useEffect(() => {
    let value = typeof list[0] == 'object' ? list[0]?.signText : list[0]
    console.log('value', value)

    form.setFieldsValue({
      popular: value,
      selectedPopular: value,
    })
  }, [list])

  const handelCanel = () => {
    setState({ popularModal: false })
  }
  const onFinish = (values) => {
    setState({ textValue: values['selectedPopular'] })
    setCommentList(values['selectedPopular'], signUrl)
    setState({ popularModal: false })
  }

  const onSelectPopular = (value, option) => {
    let sort = option.key
    form.setFieldsValue({
      selectedPopular: value,
    })
  }
  return (
    <GlobalModal
      open={true}
      title="常用语"
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
      onCancel={handelCanel.bind(this)}
      widthType={'4'}
      className={styles.borard_modal}
      footer={null}
    >
      {popularManageModal && (
        <PopularManageModal
          setState={setState}
          popularList={popularList}
          getList={getList}
          bizSolId={location.query.bizSolId}
        />
      )}
      <Form form={form} onFinish={onFinish}>
        <Row>
          <Col span={18}>
            <Form.Item label="常用语" name="popular">
              <Select onChange={onSelectPopular}>
                {list?.map((item, index) => {
                  return (
                    <Select.Option
                      key={item?.sort}
                      value={item.signText || item}
                    >
                      {item.signText || item}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col
            span={6}
            style={{
              textAlign: 'right',
              marginTop: window.location.href.includes('mobile') ? '40px' : '',
            }}
          >
            <Button
              onClick={() => {
                setState({ popularManageModal: true })
              }}
            >
              常用语管理
            </Button>
          </Col>
        </Row>
        <Form.Item label="已选意见" name="selectedPopular">
          <Input.TextArea />
        </Form.Item>
        <Row style={{ marginTop: '20px' }}>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: '4px' }}
            >
              确认
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: 'left' }}>
            <Button onClick={handelCanel} style={{ marginLeft: '4px' }}>
              取消
            </Button>
          </Col>
        </Row>
      </Form>
    </GlobalModal>
  )
}

export default Index
