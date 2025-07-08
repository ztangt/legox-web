import { Modal, Table, Input, Button, Form } from 'antd';
import {connect} from 'umi';
import styles from './contactPerson.less'
const layouts = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function contactPerson({ dispatch, user }) {
  
  const { contact } = user
  //关闭
  const onClose = values => {
    dispatch({
      type: 'user/updateStates',
      payload: {
        contactVisiable: false,
      },
    });
  };


  return (
    <Modal
      visible={true}
      title="联系管理员"
      maskClosable={false}
      mask={false}
      width={400}
      bodyStyle={{height: 240,overflow:'hidden'}}
      onCancel={onClose.bind(this)}
      onOk={onClose.bind(this)}
      centered
      getContainer={() => {
        return document.getElementById('login');
      }}
    >
      <Form initialValues={contact} {...layouts}>
        <Form.Item
          name="CONTACT_NAME"
          label="联系人"

        >
          <Input disabled className={styles.item}/>
        </Form.Item>
        <Form.Item
          name="CONTACT_PHONE"
          label="手机号"

        >
          <Input disabled className={styles.item}/>
        </Form.Item>
        <Form.Item
          name="CONTACT_TELEPHONE"
          label="固话"
          rules={[
            { max: 50,message:'最多输入50个字符'}
          ]}

        >
          <Input disabled className={styles.item}/>
        </Form.Item>
        <Form.Item
          name="CONTACT_OTHERS"
          label="其他"
        >
          <Input disabled className={styles.item}/>
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default connect(({ user }) => {
  return { user };
})(contactPerson);
