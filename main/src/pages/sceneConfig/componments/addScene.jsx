import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Row, Col, Input, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import IUpload from '../../../componments/Upload/uploadModal';
import pinyinUtil from '../../../service/pinyinUtil';

function Index({ dispatch, sceneConfig, documentId }) {
  const {
    detailData,
    modalTitle,
  } = sceneConfig;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...detailData,
      isEnable: detailData?.id ? detailData.isEnable == 1 ? true : false : true,
    });
  }, [detailData]);

  const onCancel = () => {
    dispatch({
      type: 'sceneConfig/updateStates',
      payload: {
        isShowAddModal: false,
        detailData: {},
      },
    });
  };

  const onValuesChange = () => {};

  const onFinish = values => {
    const { sceneName, sceneCode, sceneMemo, isEnable, firstLogoUrl } = values;
    // 修改
    if (detailData.id) {
      dispatch({
        type: 'sceneConfig/updateScene',
        payload: {
          sceneId: detailData.id,
          sceneName,
          sceneCode,
          sceneMemo,
          isEnable: isEnable ? 1 : 0,
          // firstLogoUrl,
        },
        callback: () => {
          onCancel();
        },
      });
    } else {
      // 新增
      dispatch({
        type: 'sceneConfig/addScene',
        payload: {
          sceneName,
          sceneCode,
          sceneMemo,
          isEnable: isEnable ? 1 : 0,
          // firstLogoUrl,
        },
        callback: () => {
          onCancel();
        },
      });
    }
  };

  //输入完名称后获取简拼
  function nameCallback(e) {
    let name = `${pinyinUtil.getFirstLetter(e.target.value)}`;
    if (!detailData.id) {
      form.setFieldsValue({
        sceneCode: name,
      });
    }
  }

  function checkUserName(_, value) {
    let regCode = /^[a-zA-Z0-9_]*$/;
    if (value.trim() == '') {
      return Promise.reject(new Error('请输入场景编号'));
    } else if (value && !regCode.test(value)) {
      return Promise.reject(new Error('支持字母、数字，下划线'));
    }
    return Promise.resolve();
  }

  const uploadButton = (
    <div
      style={{ width: '455px', height: '100px', border: '1px solid #f0f0f0' }}
    >
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <PlusOutlined />
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={true}
        title={ modalTitle ? modalTitle : detailData.id ? '修改场景' : '新增场景'}
        width={600}
        onCancel={onCancel}
        getContainer={() => {
          return document.getElementById(documentId) || false;
        }}
        mask={false}
        maskClosable={false}
        bodyStyle={{ height: '330px' }}
        centered
        footer={
          modalTitle ? [<Button onClick={onCancel}>关闭</Button>] :
          [<Button onClick={onCancel}>取消</Button>,
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              form.submit();
            }}
          >
            保存
          </Button>,]
      }
      >
        <Form
          form={form}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          initialValues={{
            ...detailData,
            isEnable: detailData?.id ? detailData.isEnable == 1 ? true : false : true,
          }}
        >
          <Row gutter={0}>
            <Col span={24}>
              <Form.Item
                label="场景名称"
                name="sceneName"
                colon={false}
                rules={[
                  { required: true, message: '请输入场景名称' },
                  { max: 50, message: '最多输入50个字符' },
                  { whitespace: true, message: '请输入场景名称' },
                ]}
              >
                <Input onChange={nameCallback.bind(this)} disabled={modalTitle}/>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="场景编号"
                name="sceneCode"
                colon={false}
                rules={[
                  { required: true, message: '' },
                  { max: 50, message: '最多输入50个字符' },
                  { validator: checkUserName.bind(this) },
                ]}
              >
                <Input placeholder="请输入场景编号" disabled={detailData.id}/>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="备注" name="sceneMemo" colon={false}>
                <Input placeholder="请输入备注" disabled={modalTitle}/>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="启用状态" name="isEnable" valuePropName="checked" colon={false}>
                <Switch defaultChecked disabled={modalTitle}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
export default connect(({ sceneConfig }) => ({ sceneConfig }))(Index);
