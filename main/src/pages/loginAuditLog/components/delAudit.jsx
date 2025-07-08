import React, { useState, useEffect, useRef, useCallback } from 'react'
import {Modal, Form, Button, Input, DatePicker, Select, Alert, message} from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import GlobalModal from '../../../componments/GlobalModal';
import styles from "../index.less";
import {ExclamationCircleOutlined} from "@ant-design/icons";
function delAudit({dispatch,loginAuditLog}){
  const {

  } = loginAuditLog;
  const [basicForm] = Form.useForm();
  const [submitAlert, setSubmitAlert] = useState({ type: '', message: '' });
  const [loadingFlag, setLoadingFlag] = useState(false);
  useEffect(() => {
  }, [1])

  const handleCancel = () => {
    dispatch({
      type: 'loginAuditLog/updateStates',
      payload: {
        isShowDeleteModal: false,
      }
    })
  }

  const handleOk = () => {
    let deleteType = basicForm.getFieldValue('deleteType');
    let startTime;
    let endTime;
    let title = "确认是否删除?";
    if(deleteType === 'ALL'){
      title = "此操作将会删除当前租户下的所有登录审计日志数据，是否确认?"
    }else{
      startTime = basicForm.getFieldValue('startTime').unix();
      endTime = basicForm.getFieldValue('endTime').unix();
      if(endTime < startTime){
        message.error("结束时间不能小于开始时间！");
        return;
      }
    }

    Modal.confirm({
      title: title,
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setLoadingFlag(false);
        await dispatch({
          type: 'loginAuditLog/deleteGroup',
          payload: {
            sys: 'LOGIN',
            deleteType: deleteType,
            operaStartTime: startTime,
            operaEndTime: endTime,
          },
        });
        await dispatch({
          type: 'loginAuditLog/updateStates',
          payload: {
            isShowDeleteModal: false,
          }
        })
        await dispatch({
          type: 'loginAuditLog/getLoginAuditLog',
          payload: {
            start: 1,
            limit: 10,
            searchWord: '',
          },
        });
      },
    });
  }

  const onDeleteChange = (value) => {
    let startDom = document.getElementById("startTime");
    let endDom = document.getElementById("endTime");
    if (value === 'ALL') {
      basicForm.setFieldsValue({startTime: '', endTime: ''})
      startDom.disabled = true;
      endDom.disabled = true;
      setSubmitAlert({
        type: 'error',
        message: '请注意，全部删除将会删除当前租户下的所有登录审计日志数据！',
      })
    }else{
      startDom.disabled = false;
      endDom.disabled = false;
      setSubmitAlert({
        type: '',
        message: '',
      })
    }
  }

  return (
    <GlobalModal
      title="批量删除"
      visible={true}
      widthType={1}
      incomingWidth={500}
      incomingHeight={300}
      // onOk={handleOk}
      onCancel={handleCancel}
      // okText="确认"
      // cancelText="关闭"
      maskClosable={false}
      mask={false}
      okType={'submit'}
      centered
      getContainer={() => {
        return document.getElementById('contractLedger_head')||false
      }}
      footer={[
        <Button key="cancel"  onClick={handleCancel}>取消</Button>,
        <Button key="submit" onClick={handleOk}>删除</Button>
      ]}
    >
      <Form
        form={basicForm}
      >
        <Form.Item
          label="选项"
          name="deleteType"
        >
          <Select placeholder="请选择删除类型" onChange={onDeleteChange} allowClear>
            <Option value="ALL">全部删除</Option>
            <Option value="TIME">根据登录时间</Option>
          </Select>
        </Form.Item>

        <Form.Item label="开始时间" name="startTime">
          <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} id="startTime"/>
        </Form.Item>

        <Form.Item label="结束时间" name="endTime" >
          <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} id="endTime"/>
        </Form.Item>
        {submitAlert.type &&
          <Alert message={submitAlert.message} type={submitAlert.type} />
        }
      </Form>
    </GlobalModal>
  )
}
export default connect(({loginAuditLog})=>({loginAuditLog}))(delAudit)
