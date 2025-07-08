/**
 * @author zhangww
 * @description 新增页modal
 */
 import { connect } from 'dva';
 import _ from "lodash";
 import { Button, Form, Input, InputNumber, Modal } from 'antd';

 function Index({ dispatch, desktopLayout }) {

  const [form] = Form.useForm();

  const defaultHeight = 400

  function onHideModal() {
    dispatch({
      type: 'desktopLayout/updateStates',
      payload:{
        // columnName: '', 
        // columnUrl: '',
        isAddModalVisible: false
      }
    })
  }

  const onFinish = (values) => {
    const { columnName, columnUrl, deskSectionHigh } = values;
    dispatch({
      type: 'desktopLayout/addColumn',
      payload:{
        sectionType: 1,
        deskSectionName: columnName,
        deskSectionUrl: columnUrl,
        deskSectionHigh: deskSectionHigh || defaultHeight,
      },
      callback: ()=>{
        onHideModal()
        window.location.reload();
      }
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

   return (
    <Modal 
      title="新增栏目" 
      open={true} 
      onCancel={onHideModal}
      bodyStyle={{height:'150px'}}
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById('desktop_wrapper') || false;
      }}
      footer={[
        <Button onClick={() => {
          onHideModal()
        }}>取消</Button>,
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: 100, height: 28 }}
          onClick={() => {
            form.submit();
          }}
        >
          确认
        </Button>,
      ]}
    >
      <Form
        name="basic"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="栏目名称"
          name="columnName"
          rules={[
            {
              required: true,
              message: `请输入栏目名称!`,
            },
            {
              pattern: /^[^\s]*$/,
              message: '禁止输入空格',
            },
          ]}
        >
          <Input placeholder="请输入栏目名称" maxLength={20}/>
        </Form.Item>
        {/* <Form.Item
          label="栏目高度"
          name="deskSectionHigh"
        >
          <InputNumber min={0} max={1000} defaultValue={defaultHeight} />
        </Form.Item> */}
        <Form.Item
          label="栏目链接"
          name="columnUrl"
          rules={[
            {
              required: true,
              message: `请输入栏目链接!`,
            },
            {
              pattern: /^[^\s]*$/,
              message: '禁止输入空格',
            },
          ]}
        >
          <Input placeholder="请输入栏目链接" maxLength={50}/>
        </Form.Item>
      </Form>
      <p style={{color:'red'}}>链接格式为: 微服务全名/路由地址 例: cmaxxx/pageName</p>
    </Modal>
   );
 }

 export default connect(({
   desktopLayout,
 }) => ({
   desktopLayout,
 }))(Index);