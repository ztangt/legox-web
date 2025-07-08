import { connect } from 'dva';
import React, {useEffect} from 'react';
import {Form, Modal, Row, Col, Input, Button, Select, Space} from 'antd'

const { Option } = Select;

function FromModal({dispatch, controlList}) {
  const {formModalVisible, formInitial, formType, formData} = controlList;

  const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
  };

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(formInitial);
  }, [formModalVisible]);

  const onFinish = (values) => {
    // console.log(values);
    form.setFieldsValue({controlName: '', controlCode: ''})
    dispatch({
      type: 'controlList/updateStates',
      payload:{
        formModalVisible: false,
        formData: values,
      },
    });
    if(formType === 0) { //new
      dispatch({
        type: 'controlList/addControl',
        payload:{
          controlName: values.controlName,
          controlCode: values.controlCode,
          controlType: values.controlType,
        },
      });
    } else if(formType === 1) { //edit
      dispatch({
        type: 'controlList/changeControl',
        payload:{
          controlName: values.controlName,
          controlCode: values.controlCode,
          controlType: values.controlType,
        },
      });
    }

  };
  const onReset = () => {
    form.setFieldsValue({controlName: '', controlCode: ''})
    dispatch({
      type: 'controlList/updateStates',
      payload:{
        formModalVisible: false,
      }
    })
  };

  return (
    <Modal forceRender={true} title="控件属性" centered visible={formModalVisible} footer={null} destroyOnClose preserve={false} onCancel={onReset}>
      <Form form={form}
      onFinish={(values) => onFinish(values)}>
        <Form.Item
        label="控件名称"
        name="controlName"
        rules={[{ required: true, message: '不能为空！'}]}>
          <Input/>
        </Form.Item>
        <Form.Item
        label="控件代号"
        name="controlCode"
        rules={[{ required: true, message: '不能为空！'}]}>
          <Input/>
        </Form.Item>
        <Form.Item
        label="控件类型"
        name="controlType"
        rules={[{ required: true, message: '不能为空！'}]}>
          <Select allowClear={false}>
            <Option value="BasicControl">基本控件</Option>
            <Option value="LayoutControl">页面布局</Option>
            <Option value="OrganicControl">组织机构控件</Option>
            <Option value="OptionControl">意见控件</Option>
            <Option value="SubForm">子表</Option>
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Row>
            <Col span={6}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Col>
            <Col span={6} offset={3}>
              <Button htmlType="button" onClick={onReset}>
                取消
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>

  );
}


export default connect(({controlList}) => ({controlList})) (FromModal);
