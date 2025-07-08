import { Modal, Form, Input, Button, Select, Row, Col, message } from 'antd';
import { useState, useEffect } from 'react';
import { connect } from 'umi';
import UploadPlugin from './uploadPlugin';
import GlobalModal from '../../../componments/GlobalModal';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};
const { TextArea } = Input;
const { Option } = Select;
function AddPlugin({
  dispatch,
  loading,
  treeData,
  uploadFileId,
  uploadFileEx,
  currentNodeId,
  changePlugInfo,
  fileExists,
  md5FileId,
  fileStorageId,
  typeNames,
  fileName,
  successFile,
}) {
  const [form] = Form.useForm();
  const [isUploading, setIsUploading] = useState(false);

  const handelCanel = () => {
    dispatch({
      type: 'pluginManageNoButton/updateStates',
      payload: {
        isShowAddPlugin: false,
        changePlugInfo: {},
        fileExists: '',
        successFile: '',
      },
    });
  };

  //提交
  const onFinish = values => {
    Object.keys(values).forEach(function(key) {
      if (values[key] && key != 'plugDes' && key != 'fileName') {
        console.log('values[key]=', values[key]);
        values[key] = values[key].trim();
      }
    });
    console.log(values, 'values2');
    //如果有文件
    if (values.fileName) {
      values.fileStorageId = fileStorageId;
      let plugFormat = values.fileName.split('/')[
        values.fileName.split('/').length - 1
      ];
      values.plugFormat = plugFormat.slice(plugFormat.indexOf('.') + 1);
    }
    if (changePlugInfo?.plugId) {
      console.log('修改');
      delete values.fileName;
      dispatch({
        type: 'pluginManageNoButton/changePlug',
        payload: {
          plugId: changePlugInfo.plugId,
          ...values,
        },
      });
    } else {
      if (!values.fileName) {
        message.error('请上传文件');
        return;
      }
      delete values.fileName;
      dispatch({
        type: 'pluginManageNoButton/addPlug',
        payload: {
          ...values,
        },
      });
    }
    dispatch({
      type: 'pluginManageNoButton/updateStates',
      payload: {
        fileExists: '',
        successFile: '',
      },
    });
  };

  return (
    <GlobalModal
      visible={true}
      title={changePlugInfo?.plugId ? '修改插件' : '新增插件'}
      onCancel={handelCanel}
      maskClosable={false}
      mask={false}
      widthType={1}
      getContainer={() => {
        return document.getElementById('pluginManageNoButton_container') || false;
      }}
      footer={[
        <Button onClick={handelCanel}>取消</Button>,
        <Button
          type="primary"
          disabled={isUploading}
          onClick={() => {
            form.submit();
          }}
        >
          保存
        </Button>
      ]}
    >
      <Form
        colon={false}
        form={form}
        name="role"
        initialValues={changePlugInfo}
        onFinish={onFinish.bind(this)}
        // onValuesChange={onValuesChange}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              {...layout}
              label="插件名称"
              name="plugName"
              rules={[
                { required: true, message: '请输入插件名称!' },
                { max: 50, message: '名称长度不能超过50!' },
                { whitespace: true, message: '请输入插件名称!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              {...layout}
              label="插件类型"
              name="plugTypeId"
              initialValue={currentNodeId}
              rules={[{ required: true, message: '请选择插件分类!' }]}
            >
              <Select>
                {treeData.map(item => {
                  return (
                    <Option value={item.plugTypeId} key={item.plugTypeId}>
                      {item.typeName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              {...layout}
              label="描述"
              name="plugDes"
              rules={[{ max: 200, message: '描述长度不能超过200!' }]}
            >
              <TextArea style={{ color: '#333' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              {...layout}
              label="上传插件"
              name="fileName"
              rules={[{ required: true, message: '请上传插件!' }]}
            >
              <UploadPlugin />
              {/* <IUpload
                nameSpace="pluginManageNoButton"
                requireFileSize={50}
                onChange={onUploadChange}
                buttonContent={<Button>选择文件</Button>}
              />
              <div style={{ marginTop: '8px' }}>{successFile}</div> */}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </GlobalModal>
  );
}
export default connect(({ pluginManageNoButton, loading, layoutG }) => {
  return { ...pluginManageNoButton, loading, layoutG };
})(AddPlugin);
