import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Select, Switch, Input, Row, Col, Form, Button,message } from 'antd';
import LogoList from './LogoList';
import styles from '../index.less';

function TenantSettings({ dispatch, loginConfigInfo,tabTypeKey,loginImgList, imgList, portalImgList, portaLoginImgList }) {
  const [form] = Form.useForm();
  const [formValue, seFormValue] = useState(loginConfigInfo);
  const layout = { labelCol: { span: 2 }, wrapperCol: { span: 16 } };

  const contactLayout = { labelCol: { span: 9 }, wrapperCol: { span: 16 } };

  const [connadmin, setConnadmin] = useState(
    loginConfigInfo.PERSONENUM__CONNADMIN,
  );
  const [connadminType, setConnadminType] = useState(
    loginConfigInfo.connadminType == 'CARD_ALERT' ? true : false,
  );

  const onConnadmin = checked => {
    loginConfigInfo.PERSONENUM__CONNADMIN = checked;
    setConnadmin(checked);
    dispatch({
      type: 'tenantSettings/updateStates',
      payload: {
        loginConfigInfo,
      },
    });
  };

  const onConnadminType = value => {
    if (value === 'WORK_AGENT') {
      setConnadminType(false);
    } else {
      setConnadminType(true);
    }
  };
  const getTabList = ()=>{
    switch(tabTypeKey){
      case 'PAGETAB_LOGINPIC':
       return imgList;
      case 'PAGETAB_LOGINLOGO':
       return loginImgList;
      case 'PAGETAB_SCENELOGINPIC':
        return portaLoginImgList;
      case 'PAGETAB_SCENELOGO':
        return portalImgList;
      default:
        return imgList    
    }
  }
  // 校验列表
  const validatorTabList = ()=>{
     const list = getTabList()
     const allListIsEnable = list.every(item=>item.isEnable==0)
      return allListIsEnable
  }

  const onFinish = values => {
    if(validatorTabList()){
      message.error('当前列表logo未使用')
      return false
    }
    
    const onoffConfig = {
      PERSONENUM__DOWNLOAD: values.PERSONENUM__DOWNLOAD ? 1 : 0,
      PERSONENUM__CONNADMIN: values.PERSONENUM__CONNADMIN ? 1 : 0,
    };

    dispatch({
      type: 'tenantSettings/updateLoginConfig',
      payload: {
        tenantId: localStorage.getItem('tenantId'), // 租户ID
        loginCopyright: values.loginCopyright, // 登录页面版权
        onoffConfig: JSON.stringify(onoffConfig), // 下载 & 联系管理员
        connadminType: values.connadminType, // 开启联系管理员后类型
        contactName: values.contactName, // 联系人姓名
        contactPhone: values.contactPhone, // 联系人手机
        contactTelephone: values.contactTelephone, // 固机
        contactAddress: values.contactAddress, // 联系方式
        contactOthers: values.contactOthers, // 联系其它
        pageName: values.pageName, // 浏览器名称
      },
      callback: function() {
        document.title=values.pageName
      },
    });
  };

  useEffect(() => {
    let tenantId = window.localStorage.getItem('tenantId');
    dispatch({
      type: 'tenantSettings/getLoginConfig',
      payload: {
        tenantId,
      },
      callback(value){
        document.title = value.pageName
      }
    });

    dispatch({
      type: 'tenantSettings/getLogo',
      payload: {
        tabTypeCode: 'PAGETAB_LOGINPIC',
        start: 1,
        limit: 1000,
      },
    });
    dispatch({
      type: 'tenantSettings/updateStates',
      payload: {
        tabTypeKey: 'PAGETAB_LOGINPIC'
      }
    })
  }, []);

  useEffect(() => {
    if (Object.keys(loginConfigInfo).length > 0) {
      form.setFieldsValue(loginConfigInfo);
      if (
        loginConfigInfo.PERSONENUM__CONNADMIN &&
        loginConfigInfo.connadminType
      ) {
        setConnadmin(true);
        setConnadminType(true);
      }
    }
  }, [loginConfigInfo]);

  return (
    <div className={styles.warp}>
      <Form initialValues={loginConfigInfo} onFinish={onFinish} form={form}>
        <p className={styles.title}>
          logo配置
        </p>
        <LogoList />
        <p className={styles.title} style={{ marginTop: '8px' }}>
          版权配置
        </p>
        <Form.Item
          {...layout}
          label="登录页面版权"
          name="loginCopyright"
          rules={[{ max: 255, message: '最多输入255个字符' }]}
        >
          <Input />
        </Form.Item>
        <p className={styles.title}>
          其他配置
        </p>
        <Form.Item
          label="联系管理员"
          {...layout}
          name="PERSONENUM__CONNADMIN"
          valuePropName="checked"
        >
          <Switch onChange={onConnadmin} />
        </Form.Item>

        {connadmin ? (
          <Row gutter={0} style={{ padding: '8px' }}>
            <Col span={5}>
              <Form.Item {...contactLayout} label="提醒方式" colon={false} name="connadminType">
                <Select onChange={onConnadminType} value="CARD_ALERT">
                  <Select.Option value="CARD_ALERT">卡片提醒</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {connadminType ? (
              <Col span={5}>
                <Form.Item
                  {...contactLayout}
                  label="联系人"
                  name="contactName"
                  rules={[
                    { required: true, message: '请输入联系人' },
                    { whitespace: true, message: '请输入联系人' },
                    { max: 50, message: '最多输入50个字符' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            ) : (
              ''
            )}
            {connadminType ? (
              <Col span={5}>
                <Form.Item
                  {...contactLayout}
                  label="手机"
                  name="contactPhone"
                  rules={[{ max: 11, message: '最多输入11个字符' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            ) : (
              ''
            )}
            {connadminType ? (
              <Col span={5}>
                <Form.Item
                  {...contactLayout}
                  label="固话"
                  name="contactTelephone"
                  rules={[{ max: 50, message: '最多输入50个字符' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            ) : (
              ''
            )}

            {connadminType ? (
              <Col span={5}>
                <Form.Item
                  {...contactLayout}
                  label="联系其他"
                  name="contactOthers"
                  rules={[{ max: 50, message: '最多输入50个字符' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            ) : (
              ''
            )}
            {/* {connadminType ? (
              <Col span={5}>
                <Form.Item
                  {...contactLayout}
                  label="联系方式"
                  name="contactAddress"
                >
                  <Input />
                </Form.Item>
              </Col>
            ) : (
              ''
            )} */}
          </Row>
        ) : (
          ''
        )}

        <Form.Item label="浏览器名称" {...layout} name="pageName">
          <Input />
        </Form.Item>

        <Form.Item
          label="下载"
          {...layout}
          name="PERSONENUM__DOWNLOAD"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Row align={'center'}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Row>
      </Form>
    </div>
  );
}

export default connect(({ tenantSettings }) => ({
  ...tenantSettings,
}))(TenantSettings);
