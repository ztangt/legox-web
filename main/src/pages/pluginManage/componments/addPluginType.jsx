import { Modal, Form, Input, Button, Row, Col, Typography } from 'antd';
import { connect } from 'umi';
import GlobalModal from '../../../componments/GlobalModal';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};
const { Text } = Typography;
function AddPluginType({ dispatch, loading, changePlugTypeInfo }) {
  const [form] = Form.useForm();

  const handelCanel = () => {
    dispatch({
      type: 'pluginManage/updateStates',
      payload: {
        isShowAddPlugType: false,
        changePlugTypeInfo: {},
      },
    });
  };

  //提交
  const onFinish = values => {
    Object.keys(values).forEach(function(key) {
      if (values[key]) {
        values[key] = values[key].trim();
      }
    });
    if (changePlugTypeInfo?.plugTypeId) {
      dispatch({
        type: 'pluginManage/changePlugType',
        payload: {
          plugTypeId: changePlugTypeInfo.plugTypeId,
          ...values,
        },
      });
    } else {
      dispatch({
        type: 'pluginManage/addPlugType',
        payload: {
          ...values,
        },
      });
    }
  };

  return (
    <GlobalModal
      visible={true}
      title={changePlugTypeInfo.plugTypeId ? '修改分类' : '新增分类'}
      onCancel={handelCanel}
      maskClosable={false}
      mask={false}
      widthType={5}
      getContainer={() => {
        return document.getElementById('pluginManage_container') || false;
      }}
      footer={[
        <Button onClick={handelCanel}>取消</Button>,
        <Button
          type="primary"
          onClick={() => {
            form.submit();
          }}
        >
          保存
        </Button>,
      ]}
    >
      <Form
        colon={false}
        form={form}
        name="role"
        initialValues={changePlugTypeInfo}
        onFinish={onFinish.bind(this)}
        // onValuesChange={onValuesChange}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              {...layout}
              label="分类名称:"
              name="typeName"
              rules={[
                { required: true, message: '请输入分类名称!' },
                { max: 50, message: '名称长度不能超过50!' },
                { whitespace: true, message: '请输入分类名称!' },
              ]}
            >
              <Input></Input>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </GlobalModal>
  );
}
export default connect(({ pluginManage, loading, layoutG }) => {
  return { ...pluginManage, loading, layoutG };
})(AddPluginType);
