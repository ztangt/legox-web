import React, { useState, useEffect } from 'react';
import actions from "../../util/actions";
import { MicroAppWithMemoHistory, connect } from 'umi'
import { Modal } from 'antd';

function IM({ dispatch, user }) {

  function onCancel() {
    dispatch({
      type: 'user/updateStates',
      payload: {
        isShowIM: false,
      },
    })
  }

  function onHandlerClick(v) {
    console.log('onHandlerClick',v)
  }

  useEffect(() => {
    // 注册⼀个观察者函数
    // ⼀旦修改actions的内容就会触发这个onGlobalStateChange监听函数
    actions.onGlobalStateChange((state, prevState) => {
      // state为变更后的状态，prevState为变更前的状态
      console.log('IM~~~主应⽤观察者，改变前的state为：', prevState)
      console.log('IM~~~主应⽤观察者，改变后的state为：', state)
    })
  }, [])

  return (
    <Modal
      visible={true}
      style={{top: '32px'}}
      title={'即时通讯'}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById('dom_container')
      }}
      width={'95%'}
      bodyStyle={{height:'calc(100vh - 200px)',padding: '0'}}
      footer={[]}
    >
      {/* 通过MicroAppWithMemoHistory引⼊vue⼦项⽬ */}
      <MicroAppWithMemoHistory name="legox-impc" url="/"/>
    </Modal>
  )
}
export default connect(({ user }) => ({
  user,
}))(IM)
