import React, { useState } from 'react';
import { Input,Modal,Table,Button} from 'antd';
import styles from './index.less'
import {useDispatch} from 'umi'

function ShowModal({onSearch,namespace,stateInfo,containerId,dataName}){
  const {buttonGroups,buttonGroupId,buttonGroupName} = stateInfo
  const dispatch = useDispatch();
  function onCancel(){
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        configModal: false
      }
    })
  }
  function onSave() {
  }
  return(
    <Modal
      visible={true}
      width={800}
      title={'业务字段信息绑定'}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      centered
      bodyStyle={{height:'445px',padding:'0px'}}
      getContainer={() =>{
        return document.getElementById(containerId)||false
      }}
      footer={[
        <Button  type="primary" onClick={onSave.bind(this)}>保存</Button>,
        <Button onClick={onCancel}>取消</Button>,
        ]}
    >


    </Modal>
  )
}

export default ShowModal
