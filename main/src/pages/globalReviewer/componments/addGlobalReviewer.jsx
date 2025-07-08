import { Modal, Form, Input, Button, Select, Row, Col, DatePicker } from 'antd';
import moment from 'moment';
import { useState,useEffect } from 'react';
import { connect } from 'umi';
import GlobalModal from '../../../componments/GlobalModal';
const { RangePicker } = DatePicker;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};
const { TextArea } = Input;
const { Option } = Select;
function AddGlobalReviewer({ dispatch, loading, currentGlobalReviewer,currentNode }) {
  const [form] = Form.useForm();
  const [propertyValue,setPropertyValue] = useState('');
  const handelCanel = () => {
    dispatch({
      type: 'globalReviewer/updateStates',
      payload: {
        isShowAddGlobalReviewer: false,
        currentGlobalReviewer: {},
      },
    });
  };
  useEffect(() => {
    form.setFieldsValue({
      checkerType: currentNode.orgKind
    })
  }, []);
  // 修改类型判断
  const onChangePropertySelect = (value)=>{
    if(value == 'PRIVATE'){
      form.setFieldsValue({
        checkerType: currentNode.orgKind
      })
    }
    setPropertyValue(value);
  }
  console.log("currentNode",currentNode)

  //提交
  const onFinish = values => {
    if (values['checkerName']) {
      values['checkerName'] = values.checkerName.trim();
    }
    if (currentGlobalReviewer?.id) {
      dispatch({
        type: 'globalReviewer/changeGlobalReviewer',
        payload: {
          checkerId: currentGlobalReviewer.id,
          checkerCreateOrgId: currentNode.id||'',
          ...values,
        },
      });
    } else {
      dispatch({
        type: 'globalReviewer/addGlobalReviewer',
        payload: {
          checkerCreateOrgId: currentNode.id||'',
          ...values,
        },
      });
    }
  };
  return (
    <GlobalModal
      visible={true}
      title={currentGlobalReviewer.id ? '修改全局审核人' : '新增全局审核人'}
      onCancel={handelCanel}
      maskClosable={false}
      mask={false}
      widthType={1}
      getContainer={() => {
        return document.getElementById('globalReviewer_container')||false;
      }}
      footer={[
        <Button key="cancel" onClick={handelCanel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading.global}
          htmlType={'submit'}
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
        name="addGlobalReviewer"
        initialValues={currentGlobalReviewer}
        onFinish={onFinish.bind(this)}
      >
        <Row gutter={0}>
          <Col span={24}>
            <Form.Item
              {...layout}
              label="审核人名称:"
              name="checkerName"
              rules={[
                { required: true, message: '请输入审核人名称' },
                { max: 50, message: '最多输入50个字符' },
                { whitespace: true, message: '请输入审核人名称!' },
              ]}
            >
              <Input></Input>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              {...layout}
              label="属性"
              initialValue="PUBLIC"
              name="checkerProperty"
              rules={[{ required: true, message: '请选择属性' }]}
            >
              <Select disabled={currentGlobalReviewer.id ? true : false} onChange={onChangePropertySelect}>
                <Option value="PUBLIC" key={1}>
                  公共
                </Option>
                {
                  currentNode?.id ?<Option value="PRIVATE" key={2}>
                  私有
                </Option>:''
                }
                
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              {...layout}
              label="描述"
              name="checkerDesc"
              rules={[{ max: 200, message: '最多输入200个字符' }]}
            >
              <TextArea style={{ color: '#333' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item 
              {...layout}
              label="类型"
              name="checkerType"
              rules = {[{required:true,message:'请选择类型'}]}  
            >
              <Select disabled={(currentGlobalReviewer.id||propertyValue == 'PRIVATE')?true:false}>
                <Option value='ORG' key={1}>
                    单位审核人
                </Option>
                <Option value="DEPT" key={2}>
                    部门审核人
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </GlobalModal>
  );
}

export default connect(({ globalReviewer, loading, layoutG }) => {
  return { ...globalReviewer, loading, layoutG };
})(AddGlobalReviewer);
