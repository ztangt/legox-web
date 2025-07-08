/**
 * @author zhangww
 * @description 新增页modal
 */
 import { connect } from 'dva';
 import _ from "lodash";
 import { useState, useEffect } from 'react';
 import { Button, Form, Input, message } from 'antd';
import GlobalModal from '../../../../componments/GlobalModal';

 function Index({ dispatch, fastDesktop }) {

  const { isAddModalVisible, pageName, pageIcon, generalJson } = fastDesktop;

  function updateStates(tableStyleJson) {
    // TODO tableType
    dispatch({
      type: 'fastDesktop/updateTableLayout',
      payload: {
        tableType: '2',
        styleType: '2',
        tableStyleJson: JSON.stringify(tableStyleJson),
      }
    })
  }

  function onHideModal() {
    dispatch({
      type: 'fastDesktop/updateStates',
      payload:{
        isAddModalVisible: false
      }
    })
  }

  function onShowIconModal() {
    dispatch({
      type: 'fastDesktop/updateStates',
      payload:{
        isIconModalVisible: true
      }
    })
  }

  const onFinish = () => {
    if (!pageName) {
      message.warning('页名称不能为空');
      return;
    }
    if (pageName.length > 20) {
      message.warning('页名称不能超过20个字');
      return;
    }
    // if (!pageIcon) {
    //   message.warning('页图标不能为空');
    //   return;
    // }
    const tmp = generalJson;
    tmp.push(
      {
        pageName,
        pageIcon,
        active: true,
        currentMenu: [],
        currentMenuKeys: [],
      }
    )
    tmp.forEach((element, index) => {
      if (index === tmp.length - 1) {
        element.active = true;
      } else {
        element.active = false;
      }
    });
    dispatch({
      type: 'fastDesktop/updateStates',
      payload:{
        currentIndex: tmp.length - 1,
        generalJson: tmp,
        isAddModalVisible: false,
        pageName: '',
        pageIcon: '',
      }
    })
    updateStates(tmp);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onChangeValue = (e) => {
    dispatch({
      type: 'fastDesktop/updateStates',
      payload:{
        pageName: e.target.value,
      }
    })
  };

   return (
    <GlobalModal 
      title="新增页" 
      widthType={4}
      modalType='fast'
      visible={isAddModalVisible} 
      onCancel={onHideModal}
      onOk={onFinish}
      // bodyStyle={{height:'150px'}}
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById('dom_container') || false;
      }}
    >
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="页名称"
        >
          <Input value={pageName} onChange={onChangeValue}/>
        </Form.Item>

        {/* <Form.Item
          label="页图标"
        >
          <Input onFocus={onShowIconModal} value={pageIcon} />
        </Form.Item> */}
        {/* <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" style={{marginRight: 10}}>
            保存
          </Button>
          <Button type="primary" onClick={onHideModal}>
            关闭
          </Button>
        </Form.Item> */}
      </Form>
    </GlobalModal>
   );
 }

 export default connect(({
   fastDesktop,
 }) => ({
   fastDesktop,
 }))(Index);