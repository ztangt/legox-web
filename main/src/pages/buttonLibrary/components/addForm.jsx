import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Input, Button, Form, Row, Col, Select } from 'antd';
import _ from 'lodash';
import ScriptEditor from '../../../componments/ScriptEditor';
import { scriptStr } from '../../../util/defaultScriptStr';
import iconData from '../../../../public/icon_button/iconfont.json';
import IconFont from '../../../../Icon_button';
import GlobalModal from '../../../componments/GlobalModal/index.jsx';
import AddButtonModal from './addButtonModal.jsx';
import styles from '../index.less';

function addForm(props) {
  const {
    onAddSubmit,
    addObj,
    onCancel,
    loading,
    buttonLibrary,
    dispatch,
    setValues,
  } = props;
  const { addModal, isShowButtonModal, quoteButtons,isView } = buttonLibrary;

  const publicProps = {
    addObj,
    buttonLibrary,
    dispatch,
  };

  let fields = [];

  const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
  const [form] = Form.useForm();

  const [codeValue, setCodeValue] = useState('');

  useEffect(() => {
    if (addObj?.funcLibId) {
      dispatch({
        type: `buttonLibrary/getFuncLibById`,
        payload: {
          funcLibId: addObj.funcLibId,
        },
        callback: funcName => {
          form.setFieldsValue({ funcName });
        },
      });
    } else {
      form.setFieldsValue({ funcName: '' });
    }
  }, [addObj?.funcLibId]);

  const onFinish = async val => {
    // 深拷贝
    let values = { ..._.cloneDeep(val), buttonSourceName: 'CUSTOM',buttonIcon:!val.buttonIcon?'':val.buttonIcon };
    // let scriptKeyArr = ['thenEvent'];
    if (codeValue && codeValue.length) {
      values['buttonEventCode'] = `((rowInfoArr)=> {'use strict';${codeValue}})`
      delete values['thenEvent']
    } else if (!addObj.buttonId && !codeValue) {
      values['buttonEventCode'] = `((rowInfoArr)=> {'use strict';${scriptStr}})`;
      delete values['thenEvent']
    }
    values['funcLibId'] = addObj.funcLibId || 0;
    onAddSubmit(values);
  };

  const onValuesChange = allValues => {
    setValues({ ...allValues, thenEvent: addObj.thenEvent });
  };

  const menuItemClick = async value => {
    
    const {
      buttonBackUrl,
      methodTypeName,
      // beforeEvent,
      thenEvent,
      // afterEvent,
    } = quoteButtons.filter(i => i.buttonId === value)[0];

    // await fetchEventScriptText({ beforeEvent, thenEvent, afterEvent });

    // 引用按钮引用请求接口、请求类型
    form.setFieldsValue({
      // beforeEvent,
      thenEvent,
      // afterEvent,
      buttonBackUrl,
      methodTypeName,
    });
    addObj['thenEvent'] = thenEvent
      dispatch({
        type: 'buttonLibrary/updateStates',
        payload: {
          addObj: { ...addObj },
        },
      });

  };

  const getQuoteButtons = () => {
    dispatch({
      type: 'buttonLibrary/getButtons',
      payload: {
        searchValue: '',
        buttonType: '',
        buttonSourceName: 'CUSTOM'
      },
    });
  }
  const changeCodeValue = (value) => {
    setCodeValue(value)
  }

  function handleClear(e) {
    if (!e.target.value) {
      form.setFieldsValue({ [`funcLibId`]: '' });
      form.setFieldsValue({ [`funcName`]: '' });
      addObj['funcLibId'] = ''
      addObj['thenEvent'] = ''
      dispatch({
        type: 'buttonLibrary/updateStates',
        payload: {
          addObj: { ...addObj },
        },
      });
    }
  }

  return (
    <GlobalModal
      visible={addModal}
      // width={900}
      widthType={1}
      incomingWidth={900}
      incomingHeight={550}
      title={isView?'查看按钮':addObj.buttonId ? '修改按钮' : '新增按钮'}
      onCancel={onCancel}
      className={styles.add_form}
      mask={false}
      maskClosable={false}
      centered
      getContainer={() => {
        return document.getElementById('buttonLibrary_container') || false;
      }}
      footer={!isView&&[
        <Button onClick={onCancel}>取消</Button>, <Button type="primary" htmlType="submit" loading={loading} onClick={() => { form.submit() }}>保存</Button>
      ]}
    >
      <Form
        form={form}
        fields={fields}
        initialValues={
          addObj.buttonId
            ? addObj
            : { buttonTypeName: 'TABLE', }
        }
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item
              {...layout}
              label="按钮展示名称"
              name="buttonName"
              rules={[
                { required: true, message: '请输入按钮名称' },
                { max: 20, message: '最多输入20个字符' },
                { whitespace: true, message: '请输入按钮名称' },
              ]}
            >
              <Input style={{ fontSize: '12px' }} disabled={isView}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...layout} label="按钮图标" name="buttonIcon">
              <Select allowClear  disabled={isView}>
                {iconData.glyphs.map((item, index) => {
                  return (
                    <Option key={item + index} value={item.font_class}>
                      {<IconFont type={`icon-${item.font_class}`} />}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item
              {...layout}
              label="按钮类型"
              name="buttonTypeName"
              rules={[{ required: true, message: '请选择按钮类型' }]}
            >
              <Select  disabled={isView}>
                <Select.Option value="TABLE">列表</Select.Option>
                <Select.Option value="FORM">表单</Select.Option>
                <Select.Option value="PAGE">页面</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              {...layout}
              label="按钮描述"
              name="buttonDesc"
              rules={[{ max: 200, message: '最多输入200个字符' }]}
            >
              <Input style={{ fontSize: '12px' }}  disabled={isView}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item label="函数引用" name="funcName"
              {...layout}
            >
              <Input
                disabled={isView}
                style={{ fontSize: '12px' }}
                allowClear
                onChange={handleClear}
                onClick={() => {
                  dispatch({
                    type: `buttonLibrary/getFuncLibList`,
                    payload: {
                      limit: 10,
                      start: 1,
                      searchValue: '',
                      funcRefType: '1,5'
                    },
                    callback: () => {
                      dispatch({
                        type: `buttonLibrary/updateStates`,
                        payload: {
                          isShowButtonModal: true,
                        },
                      });
                    },
                  });
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              {...layout}
              label="引用按钮"
              name="buttonRefer"
              rules={[{ message: '请选择引用按钮' }]}
            >
              <Select disabled={isView} onChange={menuItemClick.bind(this)} onClick={() => { getQuoteButtons() }}>
                {quoteButtons && quoteButtons.map(item => {
                  return (
                    <Option
                      value={String(item.buttonId)}
                      key={String(item.buttonId)}
                    >
                      {item.buttonDesc
                        ? `${item.buttonName}(${item.buttonDesc})`
                        : item.buttonName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

        </Row>
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item
              {...layout}
              label="请求接口"
              name="buttonBackUrl"
              rules={[
                { message: '请选择请求接口' },
                { max: 200, message: '最多输入200个字符' },
              ]}
            >
              <Input style={{ fontSize: '12px' }}  disabled={isView}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              {...layout}
              label="请求类型"
              name="methodTypeName"
              rules={[{ required: true, message: '请选择方法请求类型' }]}
            >
              <Select defaultValue={''} disabled={isView}>
                <Select.Option value="">请选择</Select.Option>
                <Select.Option value="PUT">PUT</Select.Option>
                <Select.Option value="GET">GET</Select.Option>
                <Select.Option value="DELETE">DELETE</Select.Option>
                <Select.Option value="POST">POST</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          label="固定"
          name="thenEventPath"
        >
          <ScriptEditor changeCodeValue={changeCodeValue} path={addObj.thenEvent} isView={isView}/>
        </Form.Item>
        {isShowButtonModal && (
          <AddButtonModal form={form} {...publicProps}></AddButtonModal>
        )}
      </Form>
    </GlobalModal>
  );
}

export default connect(({ buttonLibrary }) => ({
  buttonLibrary,
}))(addForm);