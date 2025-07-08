import { connect } from 'dva';
import { useState } from 'react';
import {
  Modal,
  Input,
  Button,
  message,
  Form,
  Row,
  Col,
  Switch,
  Select,
  TreeSelect,
} from 'antd';
import _ from 'lodash';
import styles from '../index.less';
import listMoudles from './listMoudles';
import pinyinUtil from '../../../service/pinyinUtil';
import GlobalModal from '../../../componments/GlobalModal';
const FormItem = Form.Item;

function addListMoudles({
  dispatch,
  show,
  listMoudle,
  onCancel,
  onSubmit,
  loading,
  treeDataByAdd,
}) {
  const [form] = Form.useForm();
  const [currentNode, setCurrentNode] = useState({});
  const layouts = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
  const singlelayouts = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

  function onFinish(values) {
    Object.keys(values).forEach(function (key) {
      if (key != 'modelCode' && values[key]) {
        values[key] = values[key].trim();
      }
    });
    onSubmit(values, listMoudle.modelId ? '修改' : '新增', currentNode);
  }
  function onValuesChange(changedValues, allValues) {
    // setValues(allValues)
  }

  function onSelectTree(value, node, extra) {
    // form.setFieldsValue({'currentNode': node})
    setCurrentNode(node);
  }

  function onChangeName(e) {
    if (e.target.value && !listMoudle.modelId) {
      form.setFieldsValue({
        modelCode: pinyinUtil.getFirstLetter(e.target.value, false),
      });
    }
  }
  return (
    <GlobalModal
      visible={true}
      widthType={1}
      incomingWidth={600}
      incomingHeight={220}
      title={show === 'show' ? '查看' : listMoudle.modelId ? '修改' : '新增'}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      centered
      getContainer={() => {
        return document.getElementById('listMoudles_container') || false;
      }}
      // bodyStyle={{ overflow: 'visible' }}
      footer={
        show === 'show' ? [] :
          [
            <Button onClick={onCancel}>取消</Button>,
            <Button type="primary" htmlType="submit" loading={loading} onClick={() => { form.submit() }} >
              保存
            </Button>,]
      }
    >
      <Form
        initialValues={listMoudle}
        form={form}
        onFinish={onFinish.bind(this)}
        onValuesChange={onValuesChange.bind(this)}
        {...layouts}
      >
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item
              label="列表名称"
              name="modelName"
              rules={[
                { required: true, message: '请填写列表名称' },
                { max: 50, message: '最多输入50个字符' },
                { whitespace: true, message: '请填写列表名称' },
              ]}
            >
              <Input
                placeholder={'请填写列表名称'}
                onChange={onChangeName.bind(this)}
                disabled={show === 'show' ? true : false}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="列表编码"
              name="modelCode"
              rules={[
                { required: true, message: '请填写列表编码' },
                { max: 50, message: '最多输入50个字符' },
                { pattern: /^\w+$/, message: '只能输入字母、数字、_' },
              ]}
            >
              <Input
                placeholder={'请填写列表编码'}
                disabled={listMoudle.modelId ? true : false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          {...singlelayouts}
          label="应用类别"
          name="ctlgId"
          rules={[{ required: true, message: '请选择应用类别' }]}
        >
          <TreeSelect
            placeholder={'请选择应用类别'}
            treeData={treeDataByAdd}
            disabled={listMoudle.modelId ? true : false}
            onSelect={onSelectTree.bind(this)}
          />
        </Form.Item>
        <Form.Item
          {...singlelayouts}
          label="列表描述"
          name="modelDesc"
          rules={[{ max: 200, message: '最多输入200个字符' }]}
        >
          <Input.TextArea placeholder={'请填写列表描述'}
            disabled={show === 'show' ? true : false}
          />
        </Form.Item>

        {/* <Row className={styles.bt_group}  >
                <Button  type="primary" htmlType="submit" loading={loading}>
                    保存
                </Button>
                <Button onClick={onCancel} style={{marginLeft: 8}}>
                    取消
                </Button>
            </Row> */}
      </Form>
    </GlobalModal>
  );
}

export default connect(({ listMoudles }) => ({
  ...listMoudles,
}))(addListMoudles);
