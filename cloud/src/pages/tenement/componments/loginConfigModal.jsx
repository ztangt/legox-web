import {Modal,Button,Form,Switch,Row,Col,Input} from 'antd';
import {connect,history} from 'umi';
import styles from './loginConfigModal.less';
const layout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 8 },
};
function LoginConfigModal({location,dispatch,layoutG,loading,user}){
  const pathname=history.location.pathname;
  const {loginConfigInfo,tenantId}=layoutG.searchObj[pathname];
  const [form] = Form.useForm();
  const handelCancel=()=>{
    dispatch({
      type:'tenement/updateStates',
      payload:{
        isShowLoginConfig:false,
        tenantId:''
      }
    })
  }
  //更新
  const onFinish=(values)=>{
    for(let key in values){
      if(key!='pageName'){
        if(values[key]==true){
          values[key] = 1
        }else{
          values[key] = 0
        }
      }
    }
    let paramInfos = {...values};
    delete(paramInfos.pageName);
    dispatch({
      type:'tenement/updateLoginConfig',
      payload:{
        tenantId:tenantId,
        paramInfos:JSON.stringify(paramInfos),
        pageName:values['pageName']
      }
    })
  }
  //记录更新信息
 const onValuesChange=(changedValues, allValues)=>{
  let paramInfos = {...allValues};
  delete(paramInfos.pageName);
  dispatch({
    type:"tenement/updateStates",
    payload:{
      loginConfigInfo:{paramInfos:paramInfos,pageName:allValues['pageName']}
    }
  })
  }
  const dictTypeInfoJson = loginConfigInfo.dictTypeInfoJson?JSON.parse(loginConfigInfo.dictTypeInfoJson):[];
  console.log('dictTypeInfoJson=',dictTypeInfoJson);
  return (
    <Modal
      visible={true}
      title="登录方案"
      footer={[
        <Button key="cancel" onClick={handelCancel}>取消</Button>,
        <Button key="submit" type="primary" htmlType="submit" loading={loading.global} onClick={()=>{form.submit()}}>保存</Button>
      ]}
      onCancel={handelCancel}
      maskClosable={false}
      mask={false}
      getContainer={() =>{
        return document.getElementById('tenement_container')
      }}
      width={'896px'}
    >
      <Form
        {...layout}
        form={form}
        name="loginConfig"
        initialValues={{
          PERSONENUM__ACCPAS:dictTypeInfoJson.PERSONENUM__ACCPAS==1?true:false,
          PERSONENUM__MEG:dictTypeInfoJson.PERSONENUM__MEG==1?true:false,
          PERSONENUM__APP:dictTypeInfoJson.PERSONENUM__APP==1?true:false,
          PERSONENUM__WEBCHAT:dictTypeInfoJson.PERSONENUM__WEBCHAT==1?true:false,
          PERSONENUM__QQ:dictTypeInfoJson.PERSONENUM__QQ==1?true:false,
          PERSONENUM__DD:dictTypeInfoJson.PERSONENUM__DD==1?true:false,
          PERSONENUM__REMPASS:dictTypeInfoJson.PERSONENUM__REMPASS==1?true:false,
          PERSONENUM__FORPASS:dictTypeInfoJson.PERSONENUM__FORPASS==1?true:false,
          PERSONENUM__RESETPASS:dictTypeInfoJson.PERSONENUM__RESETPASS==1?true:false,
          pageName:loginConfigInfo.pageName
        }}
        onFinish={onFinish.bind(this)}
        onValuesChange={onValuesChange}
      >
        <p className={styles.info_title}>用户信息</p>
        <Row>
          <Col span={5}>
            <Form.Item
              label="账号状态"
              name="PERSONENUM__ACCPAS"
              colon={false}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
          </Col>
          <Col span={5}>
          <Form.Item
            label="短信登录"
            name="PERSONENUM__MEG"
            colon={false}
            valuePropName="checked"
          >
            <Switch/>
          </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              label="app扫码"
              name="PERSONENUM__APP"
              colon={false}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              label="微信"
              name="PERSONENUM__WEBCHAT"
              colon={false}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="QQ"
              name="PERSONENUM__QQ"
              colon={false}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item
              label="钉钉"
              name="PERSONENUM__DD"
              colon={false}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
          </Col>
        </Row>
        <p className={styles.info_title}>其他操作</p>
        <Row>
          <Col span={5}>
            <Form.Item
              label="记住密码"
              name="PERSONENUM__REMPASS"
              colon={false}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
          </Col>
          <Col span={5}>
          <Form.Item
            label="忘记密码"
            name="PERSONENUM__FORPASS"
            colon={false}
            valuePropName="checked"
          >
            <Switch/>
          </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              label="重置登录密码"
              name="PERSONENUM__RESETPASS"
              colon={false}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
          </Col>
        </Row>
        <p className={styles.info_title}>浏览器页签名称</p>
        <Form.Item
          label=""
          name="pageName"
          colon={false}
        >
          <Input placeholder="请输入页签名称" disabled={loginConfigInfo.isModifyTabName=='0'?true:false}/>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default connect(({tenement,layoutG,loading,user})=>{return {tenement,layoutG,loading,user}})(LoginConfigModal)
