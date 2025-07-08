import {Modal,Button,Form,Select,Input} from 'antd';
import {connect,history} from 'umi';
const {Option} =Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
function UpdateInfo({location,dispatch,layoutG,loading,user,isCat}){
  console.log('isCat',isCat)
  const pathname=history.location.pathname;
  const {tenantInfo}=layoutG.searchObj[pathname];
  const [form] = Form.useForm();
  const handelCancel=()=>{
    dispatch({
      type:'tenement/updateStates',
      payload:{
        isShowUpdateModal:false,
        tenantInfo:[]
      }
    })
  }
  //更新
  const onFinish=(values)=>{
    for(let key in values){
      if(typeof values[key]=='string'){
        if(key!=='tenantDesc') {
          values[key] = values[key].trim();
        } 
      }
    }
    dispatch({
      type:'tenement/updateTenant',
      payload:{
        id:tenantInfo.id,
        ...values,
        isEnable:tenantInfo.isEnable,
        tenantManagerId:tenantInfo.tenantManagerId
      }
    })
  }
  //记录更新信息
 const onValuesChange=(changedValues, allValues)=>{
    dispatch({
      type:"tenement/updateStates",
      payload:{
        roleInfo:{...tenantInfo,...allValues}
      }
    })
  }
  console.log('tenantInfo=',tenantInfo);
  return (
    <Modal
      visible={true}
      title={isCat?"查看租户信息":"修改租户信息"}
      footer={isCat?'':[
        <Button key="cancel" onClick={handelCancel}>取消</Button>,
        <Button key="submit" type="primary" htmlType="submit" loading={loading.global} onClick={()=>{form.submit()}}>保存</Button>
      ]}
      onCancel={handelCancel}
      maskClosable={false}
      mask={false}
      getContainer={() =>{
        return document.getElementById('tenement_container')
      }}
    >
      <Form
        {...layout}
        form={form}
        name="tenant"
        initialValues={{
          tenantName:tenantInfo.tenantName,
          tenantShortName:tenantInfo.tenantShortName,
          tenantCode:tenantInfo.tenantCode,
          tenantDesc:tenantInfo.tenantDesc,
          tenantUrl:tenantInfo.tenantUrl,
          cloudCode:tenantInfo.cloudCode,
          tenantOrgShare:tenantInfo.tenantOrgShare,
        }}
        onFinish={onFinish.bind(this)}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="租户名称"
          name="tenantName"
          rules={[{ required: true, message: '请输入租户名称!',whitespace: true },
            {max:50, message: '名称长度不能超过50!' },
          ]}
        >
          <Input disabled={isCat} />
        </Form.Item>
        <Form.Item
          label="租户简称"
          name="tenantShortName"
          rules={[{ required: true, message: '请输入租户简称!',whitespace: true },
            {max:20, message: '简称长度不能超过20!' },
          ]}
        >
          <Input disabled={isCat} />
        </Form.Item>
        <Form.Item
          label="租户账号"
          name="tenantCode"
          rules={[{ required: true, message: '请输入租户账号!',whitespace: true },
            {max:50, message: '长度不能超过50!' },
          ]}
        >
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          label="描述"
          name="tenantDesc"
          rules={[
            {max:200, message: '长度不能超过200!' },
          ]}
        >
          <Input.TextArea disabled={isCat}/>
        </Form.Item>
        <Form.Item
          label="租户访问地址"
          name="tenantUrl"
          rules={[{ required: true, message: '' },
          {max:200, message: '长度不能超过200!' },
        ]}
        >
          <span>http://{window.location.host}/</span>
          <Form.Item
          name="tenantUrl"
          noStyle
          rules={[{ required: true, message: '请输入租户访问地址!',whitespace: true },
            {max:200, message: '长度不能超过200!' },
            {
              pattern: /^[a-zA-Z0-9]*$/,
              message: '只支持输入数字，英文',
          },
          ]}
          >
            <Input disabled={isCat} style={{width:'150px'}}/>
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="是否共享组织机构"
          name="tenantOrgShare"
          rules={[{ required: true, message: '请选择是否共享组织机构!' }
          ]}
        >
          <Select disabled>
            <Option value="YES">共享</Option>
            <Option value="NO">私有</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default connect(({tenement,layoutG,loading,user})=>{return {tenement,layoutG,loading,user}})(UpdateInfo)
