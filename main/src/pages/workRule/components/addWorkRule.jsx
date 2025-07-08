import { Modal, Form, Button, Input } from 'antd';
import { connect } from 'umi';
import GlobalModal from '../../../componments/GlobalModal';
function AddWorkRule({ dispatch, workRule, handelCancle, loading }) {
  const { workRuleInfo } = workRule;
  const [form] = Form.useForm();
  const formSubmit = values => {
    if (workRuleInfo.key) {
      dispatch({
        type: 'workRule/updateGroupName',
        payload: {
          workRuleId: workRuleInfo.key,
          ...values,
        },
        callback: () => {
          handelCancle();
        },
      });
    } else {
      dispatch({
        type: 'workRule/addGroupName',
        payload: {
          ...values,
        },
        callback: () => {
          handelCancle();
        },
      });
    }
  };
  const onValuesChange = (changedValues, allValues) => {
    dispatch({
      type: 'workRule/updateStates',
      payload: {
        workRuleInfo: { ...workRuleInfo, ...allValues },
      },
    });
  };
  return (
    <GlobalModal
      visible={true}
      title={workRuleInfo.key ? '修改分组' : '新增分组'}
      onCancel={handelCancle}
      widthType={5}
      getContainer={() => {
        return document.getElementById('work_rule') || false;
      }}
      maskClosable={false}
      mask={false}
      footer={[
        <Button key="cancle" onClick={handelCancle}>
          取消
        </Button>,
        <Button
          key="submit"
          onClick={() => {
            form.submit();
          }}
          loading={loading.global}
          type="primary"
        >
          保存
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="workRule"
        initialValues={{
          groupName: workRuleInfo.key ? workRuleInfo.title : '',
        }}
        onFinish={formSubmit}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          name="groupName"
          label="分组名称"
          rules={[{
            type:'string',
            max:50,
            message:"最多支持50字符"
          }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </GlobalModal>
  );
}
export default connect(({ workRule, loading }) => {
  return { workRule, loading };
})(AddWorkRule);
