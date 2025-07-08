import React, { useState } from 'react';
import { Input,Modal,Table,Button} from 'antd';
import Editor from "./editor";
import styles from './index.less'
import {useDispatch} from 'umi'

function Index({namespace,stateInfo,containerId,dataName,tableColumnName}){
  const dispatch = useDispatch();
  const publicProps = {
    stateInfo,
    namespace,
    dataName,
    tableColumnName,
    dispatch: useDispatch(),
  };
  function onCancel() {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        titleModal: false
      }
    })
  }
  return(
    <Modal
      visible={true}
      width={820}
      title={'标题修改'}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      centered
      bodyStyle={{height:'550px',padding:'0px'}}
      getContainer={() =>{
        return document.getElementById(containerId)||false
      }}
      footer={[
        <Button type="primary" onClick={onCancel.bind(this)}>保存</Button>,
        // <Button type="primary" onClick={onCancel}>取消</Button>,
        ]}
    >
      <Editor {...publicProps} />
    </Modal>
  )
}

export default Index
