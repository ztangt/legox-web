import { connect } from 'dva';
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
import { history } from 'umi';
const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
import pinyinUtil from '../../../service/pinyinUtil';
import { GROUPTYPE } from '../../../service/constant';
import GlobalModal from '../../../componments/GlobalModal';
function addForm({
  setValues,
  onAddSubmit,
  addObj,
  onCancel,
  loading,
  layoutG,
  isView
}) {
  const [form] = Form.useForm();
  const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
  let fields = [
    // {
    //     name: ['ctlgId'],
    //     value: addObj.ctlgId,
    // }
  ];
  function onFinish(values) {
    for (let key in values) {
      if (typeof values[key] == 'string' && key != 'groupDesc') {
        values[key] = values[key].trim();
      }
    }
    if (addObj.groupId) {
      onAddSubmit(values, '修改');
    } else {
      onAddSubmit(values, '新增');
    }
  }
  function onValuesChange(changedValues, allValues) {
    setValues(allValues);
  }
  //输入完名称后获取简拼
  function nameCallback(e) {
    let name = `${pinyinUtil.getFirstLetter(e.target.value)}`;
    if (!addObj.nodeId) {
      form.setFieldsValue({
        groupCode: name,
      });
    }
  }
  function checkUserName(_, value) {
    let regCode = /^[a-zA-Z0-9_]*$/;
    if (value && !regCode.test(value)) {
      return Promise.reject(new Error('支持字母、数字，下划线'));
    } else {
      return Promise.resolve();
    }
  }

  return (
    <GlobalModal
      visible={true}
      widthType={1}
      incomingWidth={500}
      incomingHeight={220}
      title={isView?'查看按钮方案':addObj.groupId ? '修改按钮方案' : '新增按钮方案'}
      onCancel={onCancel}
      className={styles.add_form}
      mask={false}
      maskClosable={false}
      // centered
      // bodyStyle={{height:'300px'}}
      getContainer={() => {
        return document.getElementById('buttonSolution_container')||false;
      }}
      containerId='buttonSolution_container'
      footer={
        !isView&&[
          <Button onClick={onCancel}>
            取消
          </Button>
          ,<Button type="primary" htmlType="submit" loading={loading} onClick={()=>{form.submit()}}>
            保存
          </Button>
          
        ]
      }
    >
      <Form
        fields={fields}
        initialValues={addObj}
        onFinish={onFinish.bind(this)}
        onValuesChange={onValuesChange.bind(this)}
        form={form}
      >
        <Form.Item
          {...layout}
          label="按钮方案名称"
          name="groupName"
          rules={[
            { required: true, message: '请输入按钮方案名称' },
            { max: 50, message: '最多输入50个字符' },
            { whitespace: true, message: '请输入按钮方案名称' },
          ]}
        >
          <Input
            disabled={isView}
            style={{ fontSize: '12px' }}
            onChange={addObj.groupId ? () => {} : nameCallback.bind(this)}
          />
        </Form.Item>
        <Form.Item
          {...layout}
          label="方案编码"
          name="groupCode"
          rules={[
            { required: true, message: '请输入方案编码' },
            { max: 50, message: '最多输入50个字符' },
            { whitespace: true, message: '请输入方案编码' },
            { validator: checkUserName.bind(this) },
          ]}
        >
          <Input
            style={{ fontSize: '12px' }}
            disabled={addObj.groupId ? true : false}
          />
        </Form.Item>
        <Form.Item
          {...layout}
          label="方案类型"
          name="groupType"
          rules={[{ required: true, message: '请选择方案类型' }]}
        >
          <Select disabled={addObj.groupId ? true : false}>
            {GROUPTYPE.map(item => {
              return (
                <Select.Option value={item.key} key={item.key}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="方案描述"
          name="groupDesc"
          {...layout}
          rules={[{ max: 200, message: '最多输入200个字符' }]}
        >
          <TextArea style={{ fontSize: '12px' }}  disabled={isView}/>
        </Form.Item>
        {/* <Row
          className={styles.bt_group}
          style={{ width: '150px', margin: '0 auto' }}
        >
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: 8 }}>
            取消
          </Button>
        </Row> */}
      </Form>
    </GlobalModal>
  );
}

export default connect(({ buttonSolution, layoutG }) => ({
  ...buttonSolution,
  layoutG,
}))(addForm);
