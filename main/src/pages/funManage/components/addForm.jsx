import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Input, Button, Form, Row, Col, Select } from 'antd';
import _ from 'lodash';
import ScriptEditor from '../../../componments/ScriptEditor';
import { scriptStr } from '../../../util/defaultScriptStr';
import GlobalModal from '../../../componments/GlobalModal/index.jsx';
import pinyinUtil from '../../../service/pinyinUtil';
import styles from '../index.less';

function addForm(props) {
  const {
    onAddSubmit,
    addObj,
    onCancel,
    loading,
    funManage,
    dispatch,
    setValues,
  } = props;
  const { addModal, isShow } = funManage;
  let fields = [];

  const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
  const [form] = Form.useForm();

  const [codeValue, setCodeValue] = useState('');

  const onFinish = async val => {
    // 深拷贝
    let values = { ..._.cloneDeep(val) };
    // if (codeValue && codeValue.length) {
      values['funcLibCode'] = `((rowInfoArr)=> {'use strict';${codeValue}})`
      delete values['thenEvent']
    // } else if (!addObj.id && !codeValue) {
    //   values['funcLibCode'] = `((rowInfoArr)=> {'use strict';${scriptStr}})`;
    //   delete values['thenEvent']
    // }
    onAddSubmit(values);
  };

  const onValuesChange = allValues => {
    setValues({ ...allValues, thenEvent: addObj.thenEvent });
  };

  const changeCodeValue = (value) => {
    setCodeValue(value)
  }

  //输入完名称后获取简拼
  function nameCallback(e) {
    let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
    if (!addObj.id) {
      form.setFieldsValue({
        funcCode: name,
      });
    }
  }

  function checkUserName(_, value) {
    let regCode = /^[a-zA-Z0-9_]*$/;
    if (!value || value.trim() == '') {
      return Promise.reject(new Error('请输入函数编码'))
    } else if
      (value && !regCode.test(value)) {
      return Promise.reject(new Error('支持字母、数字，下划线'))
    }
    return Promise.resolve();
  }

  return (
    <GlobalModal
      visible={addModal}
      widthType={1}
      incomingWidth={900}
      incomingHeight={550}
      title={isShow? '查看函数' : addObj.id ? '修改函数' : '新增函数'}
      onCancel={onCancel}
      className={styles.add_form}
      mask={false}
      maskClosable={false}
      centered
      getContainer={() => {
        return document.getElementById('funManage_container') || false;
      }}
      footer={isShow ? [] :[
        <Button onClick={onCancel}>取消</Button>, <Button type="primary" htmlType="submit" disabled={loading} onClick={() => { form.submit() }}>保存</Button>
      ]}
    >
      <Form
        form={form}
        fields={fields}
        initialValues={
          addObj.id
            ? addObj
            : { funcRefType: 5, funcLangType: 'JavaScript' }
        }
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item
              {...layout}
              label="函数名称"
              name="funcName"
              rules={[
                { required: true, message: '请输入函数名称' },
                { max: 20, message: '最多输入20个字符' },
                { whitespace: true, message: '请输入函数名称' },
              ]}
            >
              <Input onChange={nameCallback.bind(this)} style={{ fontSize: '12px' }} disabled={isShow}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...layout} label="函数编码" name="funcCode"
              rules={[
                { required: true, message: '' },
                { max: 20, message: '最多输入20个字符' },
                // { whitespace: true, message: '请输入函数编码'},
                { validator: checkUserName.bind(this) }
                
              ]}>
              <Input style={{ fontSize: '12px' }} disabled={addObj.id ? true : false}/>

            </Form.Item>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item
              {...layout}
              label="函数引用类型"
              name="funcRefType"
              rules={[{ required: true, message: '请选择函数引用类型' }]}
            >
              <Select disabled={isShow || addObj.id}>
                <Select.Option value={1}>按钮类</Select.Option>
                <Select.Option value={2}>列表类</Select.Option>
                <Select.Option value={3}>控件类</Select.Option>
                <Select.Option value={4}>规则类</Select.Option>
                <Select.Option value={5}>其他类</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              {...layout}
              label="语言类型"
              name="funcLangType"
              rules={[{ required: true, message: '请选择语言类型' }]}
            >
              <Select disabled={(addObj.funcRefType && addObj.funcRefType != 5) || isShow}>
                <Select.Option value='JavaScript'>JavaScript</Select.Option>
              </Select>
            </Form.Item>

          </Col>
        </Row>
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          label="函数描述"
          name="funcDec"
          rules={[{ max: 200, message: '最多输入200个字符' }]}
        >
          <Input style={{ fontSize: '12px' }} disabled={isShow}/>
        </Form.Item>
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          label="固定"
          name="funcLibCode"
        >
          <ScriptEditor changeCodeValue={changeCodeValue} path={addObj.funcLibUrl} isFun={true} isShow={isShow}/>
        </Form.Item>
      </Form>
    </GlobalModal>
  );
}

export default connect(({ funManage }) => ({
  funManage,
}))(addForm);