import { Button, Col, Form, Input, Row } from 'antd'
import { connect } from 'dva'
import { useEffect } from 'react'
import { dataFormat } from '../../util/util'
import GlobalModal from '../GlobalModal'
import styles from './index.less'
const { TextArea } = Input
function SystemModal({ dispatch, backlogo, containerId }) {
  const { sysItem } = backlogo
  const [form] = Form.useForm()
  const params = JSON.parse(sysItem.targetParam)
  useEffect(() => {
    form.setFieldsValue({
      sendname: sysItem.msgSendUsername,
      receivetime: dataFormat(sysItem.createTime, 'YYYY-MM-DD HH:mm:ss'),
      content: sysItem.msgDetail,
    })
  }, [])
  const handleCancel = () => {
    dispatch({
      type: 'backlogo/updateStates',
      payload: {
        isModalVisible: false,
      },
    })
  }
  const goTransact = () => {
    // var maxDataruleCodes = JSON.parse(localStorage.getItem('maxDataruleCodes') || '{}',);
    // var maxDataruleCode = maxDataruleCodes[location.pathname]|| '';
    historyPush({
      pathname: '/waitMatter/formShow',
      query: {
        bizInfoId: params.bizInfoId,
        bizSolId: params.bizSolId,
        bizTaskId: params.bizTaskId || '',
        id: params.mainTableId,
        title: params.bizTitle,
        // maxDataruleCode,
      },
    })
    dispatch({
      type: 'backlogo/updateStates',
      payload: {
        isModalVisible: false,
      },
    })
  }
  return (
    <>
      <GlobalModal
        title="消息内容"
        widthType={1}
        visible={true}
        onCancel={handleCancel}
        mask={false}
        getContainer={() => {
          return document.getElementById(containerId) || false
        }}
        footer={<Button onClick={handleCancel}>关闭</Button>}
        className={styles.backlogo_form}
      >
        <Form form={form}>
          <Row gutter={0}>
            <Col span={8}>
              <Form.Item label="发送人" name="sendname">
                <Input style={{ width: 200 }} bordered={false} disabled={true} />
              </Form.Item>
            </Col>
            <Col span={13}>
              <Form.Item label="收到时间" name="receivetime">
                <Input style={{ width: 200 }} bordered={false} disabled={true} />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item>
                <Button className={styles.goTransact} onClick={goTransact}>
                  前往办理
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col span={24}>
              <Form.Item label="内容" name="content">
                <TextArea style={{ height: 200 }} autoSize={{ minRows: 5, maxRows: 10 }} disabled={true} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </GlobalModal>
    </>
  )
}
export default connect(({ backlogo }) => ({
  backlogo,
}))(SystemModal)
