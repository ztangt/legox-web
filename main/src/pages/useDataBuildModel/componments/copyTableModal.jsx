import React, { useState, useEffect, memo } from 'react';
import { connect } from 'dva';
import { Button, message, Modal, Table, Space, Input, Divider, Form, Row, Col,Typography, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import styles from './copyTableModal.less';
import GlobalModal from '../../../componments/GlobalModal';
const { Option } = Select;
function CopyTableModal({ dispatch, useDataBuildModel, layoutG, dsDynamic, tableId, tableCode, }) {
  const {
    getDataSourceList,
    sourceData
  } = useDataBuildModel
  const layouts =  {labelCol: { span: 6 },wrapperCol: { span: 18}};
  console.log(sourceData);

  let originData = [];
  originData = getDataSourceList;

  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  // Modal关闭
  const onCancel = () => {
    dispatch({
      type: 'useDataBuildModel/updateStates',
      payload: {
        isShowTableCopyModal: false,
      }
    })
  }

  const onValuesChange = () => { }

  // 复制保存
  const onFinish = (value) => {
    console.log(value);
    console.log(form.getFieldsValue()['targetBase']);
    dispatch({
      type: 'useDataBuildModel/tableCopyExecute',
      payload: {
        sourceDsId: sourceData.dsId,
        targetDsId: value['targetBase'],
        sourceTableId: sourceData.tableId,
      },
      callback: () => {
        dispatch({
          type: 'useDataBuildModel/updateStates',
          payload: {
            isShowTableCopyModal: false,
          },
        })
      }
    })
  }

  return (
    <GlobalModal
      visible={true}
      widthType={1}
      incomingWidth={450}
      incomingHeight={250}
      title={'复制表至-数据库'}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      centered
      footer={[
        <Button key="cancel" onClick={onCancel}>关闭</Button>,
        <Button key="submit" type="primary"  onClick={()=>{form.submit()}}>保存</Button>
      ]}
      bodyStyle={{padding:'10px'}}
      getContainer={() =>{
        return document.getElementById('useDataBuildModel_container')||false
      }}
    >
      <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange} {...layouts}>
            <Form.Item
              label="原数据源名称"
              name="sourceDsName"
            >
              <Input disabled={true} defaultValue={sourceData['dsName']}/>
            </Form.Item>
            <Form.Item
              label="原表名"
              name="tableName"
            >
              <Input disabled={true}  defaultValue={sourceData['tableName']}/>
            </Form.Item>
            <Form.Item
              label="原表编码"
              name="tableCode"
            >
              <Input disabled={true}  defaultValue={sourceData['tableCode']}/>
            </Form.Item>
            <Form.Item
              label='目标数据源'
              name='targetBase'
              rules={[
                { required: true, message: '请选择目标数据源！' }
              ]}
            >
              <Select allowClear placeholder="请选择目标数据源">
                {
                  originData.map((item,index)=>{
                    return <Select.Option key={item.dsId}  value={item.dsId}>
                      {item.dsName}
                    </Select.Option>
                  })
                }
              </Select>
            </Form.Item>
      </Form>
    </GlobalModal>
  )
}
export default connect(({ useDataBuildModel, layoutG }) => ({
  useDataBuildModel,
  layoutG,
}))(CopyTableModal);
