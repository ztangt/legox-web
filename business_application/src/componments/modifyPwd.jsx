import {
  Form,
  Input,
  Carousel,
  message,
  Modal,
  Progress,
  Row,
  Col,
} from 'antd';
import { connect } from 'dva';
// import styles from './index.less'
import React, { useState, useEffect } from 'react';
import { stubFalse } from 'lodash';
import { sm2 } from 'sm-crypto';
import { Base64 } from 'js-base64';
import GlobalModal from './GlobalModal';
import styles from './modifyPwd.less';
import {Button} from '@/componments/TLAntd';
function Login({
  dispatch,
  user,
  closable = false,
  mVisible = false,
  setMVisible,
  type,
}) {
  const strongRegex =
    /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[!@#\$%\^&\*])[0-9A-Za-z!@#\$%\^&\*)]{8,16}$/;
  // const mediumRegex = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])[0-9A-Za-z]{8,16}$/
  const mediumRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])\S{8,16}$/;
  const lowRegex = /^[0-9_a-zA-Z!@#\$%\^&\*]{3,10}$/;
  const servicePublicKey =
    '0416e39a2a5023e90a4f8d0c663b7f9e21bcd430c122e767150b201dd5935d8953a08227be68de4a04c46d46c6b2644d3042889404a7dcda92c7f211ee29f20c8e';
  const [visible, setVisible] = useState(false);
  const [strong, setStrong] = useState(0);
  const [low, setLow] = useState(0);
  const [middle, setMiddle] = useState(0);
  const [level, setLevel] = useState('无');
  const layouts = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
  const [form] = Form.useForm();
  const progressProps = {
    strokeWidth: 10,
    showInfo: false,
  };
  const id = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo')).id
  : '';
  const  desktopType = localStorage.getItem(`desktopType${id}`) || 0;
  useEffect(() => {
    setVisible(
      window.localStorage.getItem('visible') === 'true' ? true : false,
    );
  }, [window.localStorage.getItem('visible')]);
  useEffect(() => {
    if (closable) {
      setVisible(mVisible);
    }
  }, [closable, mVisible]);
  const onFinish = (values) => {
    if (
      values.oldPassword !=
      Base64.decode(window.localStorage.getItem('pkeys')?.slice(11))
    ) {
      message.error('原密码输入错误!');
      return;
    }
    if (values.aginPassword != values.newPassword) {
      message.error('两次输入密码不一致!');
      return;
    }
    dispatch({
      type: 'user/updatePassword',
      payload: {
        oldPassword:
          '04' + sm2.doEncrypt(values['oldPassword'], servicePublicKey),
        newPassword:
          '04' + sm2.doEncrypt(values['newPassword'], servicePublicKey),
      },
      callback: () => {
        setVisible(false);
        window.localStorage.setItem('visible', false);
      },
    });
  };
  const validatorPwd = (rule, value) => {
    const pwstrongType = window.localStorage.getItem('pwstrongType');
    const pwstrongRegular = window.localStorage.getItem('pwstrongRegular');
    const pwstrongRegularMemo = window.localStorage.getItem(
      'pwstrongRegularMemo',
    );
    if (value) {
      if (pwstrongType == 'LOW' && !lowRegex.test(value)) {
        return Promise.reject(new Error('请输入3~10位的任意字符密码'));
      } else if (pwstrongType == 'MIDDLE' && !mediumRegex.test(value)) {
        return Promise.reject(
          new Error('请输入8~16位密码，至少1个大写字母，1个小写字母和1个数字'),
        );
      } else if (pwstrongType == 'HIGH' && !strongRegex.test(value)) {
        return Promise.reject(
          new Error(
            '请输入8~16位密码，至少1个大写英文字母，至少1个小写英文字母，至少1位数字，至少1个特殊字符',
          ),
        );
      } else if (pwstrongType == 'CUSTOM' && !pwstrongRegular.test(value)) {
        return Promise.reject(new Error(`${pwstrongRegularMemo}`));
      } else {
        return Promise.resolve();
      }
    } else {
      return Promise.resolve();
    }
  };

  function onChange(e) {
    const value = e.target.value;
    if (strongRegex.test(value)) {
      setMiddle(100);
      setLow(100);
      setStrong(100);
      setLevel('高');
    } else if (mediumRegex.test(value)) {
      setStrong(0);
      setLow(100);
      setMiddle(100);
      setLevel('中');
    } else if (lowRegex.test(value)) {
      setLow(100);
      setMiddle(0);
      setStrong(0);
      setLevel('低');
    }
  }
  return (
    <GlobalModal
      title={'修改密码'}
      visible={visible}
      onCancel={ type=='drop'? setMVisible:() => {
        setVisible(false);
        setMVisible(false);
      }}
      closable={closable}
      widthType={1}
      modalType={desktopType==1?'fast':"layout"}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById('dom_container');
      }}
      footer={[
        <Button style={{ display: 'none' }}></Button>,
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: 100, height: 28 }}
          className={styles.confirm}
          onClick={() => {
            form.submit();
          }}
        >
          确认修改
        </Button>,
      ]}
    >
      <Form {...layouts} form={form} onFinish={onFinish}>
        <Form.Item
          label="原密码"
          name="oldPassword"
          rules={[
            {
              required: true,
              message: '请输入原密码',
            },
            { max: 50, message: '最多输入50个字符' },
          ]}
        >
          <Input.Password placeholder="请输入原密码" />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="newPassword"
          rules={[
            {
              required: true,
              message: '请输入新密码',
            },
            { max: 50, message: '最多输入50个字符' },
            {
              validator: validatorPwd,
            },
          ]}
        >
          <Input.Password
            placeholder="请输入新密码"
            onChange={onChange.bind(this)}
          />
        </Form.Item>
        <Row style={{ margin: '-9px 0 12px 0' }}>
          <Col span={4}></Col>
          <Col span={6}>
            <Progress
              strokeColor={'#ec3602'}
              {...progressProps}
              percent={low}
            />
          </Col>
          <Col span={6}>
            <Progress
              strokeColor={'#f78014'}
              percent={middle}
              {...progressProps}
            />
          </Col>
          <Col span={6}>
            <Progress
              strokeColor={'#6ba101'}
              percent={strong}
              {...progressProps}
            />
          </Col>
          <Col span={2} style={{ textAlign: 'center' }}>
            {level}
          </Col>
        </Row>
        <Form.Item
          label="确认密码"
          name="aginPassword"
          rules={[
            {
              required: true,
              message: '再次输入新密码',
            },
          ]}
        >
          <Input.Password placeholder="再次输入新密码" />
        </Form.Item>
        {/* <Row>
          <Col span={19}></Col>
          <Col span={5}>
            <Button type="primary" htmlType="submit" style={{ width: '100%'}}>
              确认修改
            </Button>
          </Col>

        </Row> */}
      </Form>
    </GlobalModal>
  );
}
export default connect(({ user }) => {
  return { user };
})(Login);
