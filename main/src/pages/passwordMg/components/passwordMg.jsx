import { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Input,
  InputNumber,
  Button,
  Form,
  Row,
  Col,
  Radio,
  Select,
} from 'antd';
import styles from '../index.less';
import { getButton } from '../../../util/util';
const { Option } = Select;

function PasswordMg({ dispatch, passwordMg, layoutG, user }) {
  const { echoFormData } = passwordMg;
    // { searchObj } = layoutG,
    // { echoFormData } = searchObj[pathname];

  const [form] = Form.useForm();
  //const [termOrForever, setTermOrForever] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  //const [expiredRemind, setExpiredRemind] = useState('');
  const { menus } = user;
  useEffect(()=>{
      dispatch({
          type: 'passwordMg/getPasswordPolicy',
      })
    
  },[])
  useEffect(() => {
    if(echoFormData){
      setPasswordStrength(
        echoFormData.pwstrongType ? echoFormData.pwstrongType : 'LOW',
      );
      //setExpiredRemind(echoFormData.pwexpireType ? echoFormData.pwexpireType : 'ALERT');
      //setTermOrForever(echoFormData.pwvalidType ? echoFormData.pwvalidType : 'VALID_PERIOD')
      form.setFieldsValue({
        pwalertType: echoFormData.pwalertType
          ? echoFormData.pwalertType
          : 'ALERT',
        pwstrongType: echoFormData.pwstrongType
          ? echoFormData.pwstrongType
          : 'LOW',
        pwstrongRegular: echoFormData.pwstrongRegular
          ? echoFormData.pwstrongRegular
          : '',
        pwstrongRegularMemo: echoFormData.pwstrongRegularMemo
          ? echoFormData.pwstrongRegularMemo
          : '',
        pwvalidType: echoFormData.pwvalidType
          ? echoFormData.pwvalidType
          : 'VALID_FOREVER',
        pwvalidDays:
          echoFormData.pwvalidDays != 'null' ? echoFormData.pwvalidDays : '1',
        isModifyPwexpire: echoFormData.isModifyPwexpire
          ? echoFormData.isModifyPwexpire
          : '0',
        pwexpireDays:
          echoFormData.pwexpireDays != 'null' ? echoFormData.pwexpireDays : '1',
  
        // Base64解密
        password: echoFormData.password ? atob(echoFormData.password) : '123456',
      });
    }
   
  }, [echoFormData]);

  //密码策略提交
  const onFinish = () => {
    dispatch({
      type: 'passwordMg/savePasswordPolicy',
      payload: {
        ...form.getFieldValue(),
      },
    });
  };

  // //设置密码有效期
  // const setValidityTerm = (e) => {
  //     setTermOrForever(e.target.value)
  // }

  //设置密码强度
  const selectModelFn = value => {
    setPasswordStrength(value);
  };

  //设置密码过期提醒
  // const expiredRemindFn = (e) => {
  //     setExpiredRemind(e.target.value);
  // };
  const validatorPwd = (rule, value) => {
    let regCode = /^[a-zA-Z0-9!&@#$%*.]*$/;
    //且汉字字母数字下划线
    if (value) {
      if (value.length > 50) {
        return Promise.reject(new Error('最多输入50个字符'));
      } else if (!regCode.test(value)) {
        return Promise.reject(new Error('支持字母、数字、特殊符号：!&@#$%*.'));
      } else {
        return Promise.resolve();
      }
    } else {
      return Promise.resolve();
    }
  };
  return (
    <div className={styles.wrap_box}>
      <Form form={form} onFinish={onFinish}>
        <fieldset className={styles.opinionDomain}>
          <legend className={styles.opinionDomain_legend}>密码策略</legend>
          {/* 初始密码 */}
          <Form.Item className={styles.form_item_root} name="" label="">
            <Row>
              <Col push={1}>
                <Form.Item
                  name="password"
                  label="初始密码"
                  rules={[
                    { required: true, message: '请填写初始密码' },
                    { validator: validatorPwd },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col push={2}>
                <Form.Item name="pwalertType" label="修改提醒">
                  <Radio.Group>
                    <Radio value="CLOSE">关闭</Radio>
                    <Radio value="ALERT">提醒</Radio>
                    <Radio value="UPDATE">强制修改</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          {/* 密码强度 */}
          <Form.Item className={styles.form_item_root} name="" label="">
            <Row>
              <Col push={1}>
                <Form.Item name="pwstrongType" label="密码强度">
                  <Select
                    style={{ width: '100px' }}
                    onSelect={selectModelFn}
                    allowClear={false}
                  >
                    <Option value="LOW">低</Option>
                    <Option value="MIDDLE">中</Option>
                    <Option value="HIGH">高</Option>
                    <Option value="CUSTOM">自定义</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col push={2}>
                <Form.Item name="" label="" style={{ display: 'flex' }}>
                  {passwordStrength == 'LOW' && (
                    <span>3到10位的任意字符密码</span>
                  )}
                  {passwordStrength == 'MIDDLE' && (
                    <span>
                      8~16位密码，至少1个大写字母，1个小写字母和1个数字。
                    </span>
                  )}
                  {passwordStrength == 'HIGH' && (
                    <span>
                      8~16位密码，至少1个大写英文字母，至少1个小写英文字母，至少1位数字，至少1个特殊字符
                    </span>
                  )}
                  {passwordStrength == 'CUSTOM' && (
                    <Row>
                      <Col>
                        <Form.Item
                          name="pwstrongRegular"
                          label="正则表达式"
                          rules={[{ max: 200, message: '最多输入200个字符' }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col push={2}>
                        <Form.Item
                          name="pwstrongRegularMemo"
                          label="说明"
                          rules={[{ max: 200, message: '最多输入200个字符' }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          {/* 密码有效期 */}
          <Form.Item className={styles.form_item_root} name="" label="">
            <Row>
              <Col push={1}>
                <Form.Item name="pwvalidType" label="密码有效期">
                  <Radio.Group>
                    <Radio value="VALID_PERIOD">有效期限</Radio>
                    <Radio value="VALID_FOREVER">永久有效</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          {/* 有效期  天 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.pwvalidType !== currentValues.pwvalidType
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('pwvalidType') == 'VALID_PERIOD' && (
                <Row>
                  <Col push={3} style={{ display: 'flex' }}>
                    <span style={{ padding: '5px' }}>有效期</span>
                    <Form.Item
                      name="pwvalidDays"
                      label=""
                      rules={[
                        {
                          required:
                            getFieldValue('pwvalidType') == 'VALID_PERIOD'
                              ? true
                              : false,
                          message: '请输入天数',
                        },
                      ]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    <span style={{ padding: '5px' }}>天</span>
                  </Col>
                </Row>
              )
            }
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.pwvalidType !== currentValues.pwvalidType
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('pwvalidType') == 'VALID_PERIOD' && (
                <Row>
                  <Col push={3} style={{ display: 'flex' }}>
                    <span style={{ padding: '5px' }}>
                      过期提醒 &nbsp;&nbsp;&nbsp;过期前
                    </span>
                    <Form.Item
                      name="pwexpireDays"
                      label=""
                      rules={[
                        {
                          required:
                            getFieldValue('pwvalidType') == 'VALID_PERIOD'
                              ? true
                              : false,
                          message: '请输入天数',
                        },
                      ]}
                    >
                      <InputNumber min={0} />
                    </Form.Item>
                    <span style={{ padding: '5px' }}>
                      天提醒(0天则不提前提醒)
                    </span>
                  </Col>
                </Row>
              )
            }
          </Form.Item>

          {/* 已过期提醒 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.pwvalidType !== currentValues.pwvalidType
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('pwvalidType') == 'VALID_PERIOD' && (
                // <Form.Item className={styles.form_item_root} name="" label="">
                <Row>
                  <Col push={3} style={{ display: 'flex' }}>
                    <span style={{ padding: '5px' }}>强制修改</span>
                    <Form.Item name="isModifyPwexpire" label="">
                      <Radio.Group>
                        <Radio value="0">否</Radio>
                        <Radio value="1">是</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                // </Form.Item>
              )
            }
          </Form.Item>
        </fieldset>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          {getButton(menus, 'save') && (
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}
export default connect(({ passwordMg, layoutG, user }) => ({
  passwordMg,
  layoutG,
  user,
}))(PasswordMg);
