import { connect } from 'dva';
import React, { useState } from 'react';
import { Input, Modal } from 'antd';
import GlobalModal from '../../componments/GlobalModal';
import Table from '../columnDragTable/index';
import styles from './index.less';
import { superModelComputed } from '../../util/util';
import { BASE_WIDTH, ORDER_WIDTH } from '../../util/constant';
import {Button} from '@/componments/TLAntd';
function ChangeIden({ dispatch, identitys, identityId, postId, leavePostMsg }) {
  console.log('identitys', identitys);
  const id = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo')).id
  : '';
  function onCancel() {
    dispatch({
      type: 'user/updateStates',
      payload: {
        idenVisible: false,
      },
    });
  }
  function onSave() {
    localStorage.setItem(
      'leavePost',
      leavePostMsg && leavePostMsg[0]
        ? JSON.stringify(leavePostMsg[0].isLeavePost)
        : [],
    );
    localStorage.setItem('identityId', identityId);
    localStorage.setItem('postId', postId || '');
    localStorage.setItem('waitData',leavePostMsg[0].workTodoCount);
    dispatch({
      type: 'user/login',
      payload: {
        clientType: 'PC',
        fromState: 'FRONT',
        toState: 'FRONT',
        grantType: 'refresh_token',
        refreshToken: window.localStorage.getItem('refreshToken'),
        identityId: identityId,
      },
      isChangeIdentity: true,
    });
  }
  function returnStu(record, text, type) {
    if (type == 'isLeavePost') {
      text = text == 1 ? '离岗' : '在岗';
    }
    if (record.isLeavePost == 1) {
      return (
        <div>
          {type == 'orgName' && <a className={styles.post_stu}>离</a>}
          {text}
        </div>
      );
    } else {
      if (record.isMainPost == 1) {
        return (
          <div style={{ color: '#EA4A44' }}>
            {type == 'orgName' && (
              <a className={styles.post_stu} style={{ background: '#EA4A44' }}>
                主
              </a>
            )}
            {text}
          </div>
        );
      } else if (record.isMainPost == 0) {
        return (
          <div style={{ color: 'var(--ant-primary-color)' }}>
            {type == 'orgName' && (
              <a className={styles.post_stu} style={{ background: 'var(--ant-primary-color)' }}>
                兼
              </a>
            )}
            {text}
          </div>
        );
      }
    }
  }
  const tableProps = {
    rowKey: 'identityId',
    columns: [
      // style={{color: identityId==record.identityId?'#EA4A44':record.isLeavePost==1?'#999999':''}}
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60,
        render: (text, record, index) => returnStu(record, index + 1),
      },
      {
        title: '单位',
        dataIndex: 'orgName',
        width: 260,
        render: (text, record, index) => returnStu(record, text, 'orgName'),
      },
      {
        title: '部门',
        dataIndex: 'deptName',
        width: BASE_WIDTH,
        render: (text, record, index) => returnStu(record, text),
      },
      {
        title: '岗位',
        dataIndex: 'postName',
        width: BASE_WIDTH,
        render: (text, record, index) => returnStu(record, text),
      },
      {
        title: '状态',
        dataIndex: 'isLeavePost',
        width: BASE_WIDTH,
        render: (text, record, index) => returnStu(record, text, 'isLeavePost'),
      },
      {
        title: '待办数量',
        dataIndex: 'workTodoCount',
        width: BASE_WIDTH,
        render: (text, record, index) => returnStu(record, text),
      },
    ],
    dataSource: identitys,
    pagination: false,
    rowSelection: {
      type: 'radio',
      selectedRowKeys: [identityId],
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'user/updateStates',
          payload: {
            identityId: selectedRowKeys.toString(),
            userName: selectedRows[0].groupName,
            postId: selectedRows[0].postId || '',
            leavePostMsg: selectedRows,
          },
        });
        localStorage.setItem('changeIdentityId',JSON.stringify(selectedRows[0].identityId))
      },
    },
  };
  const index_top = localStorage.getItem(`desktopType${id}`) || 0;
  return (
    <GlobalModal
      visible={true}
      widthType={2}
      modalType={index_top==1?"fast":"layout"}
      title={'身份选择'}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById('dom_container');
      }}
      footer={[
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          取消
        </Button>,
        <Button type="primary" onClick={onSave.bind(this)}>
          切换
        </Button>,
      ]}
    >
      <Table {...tableProps} />
    </GlobalModal>
  );
}
export default connect(({ user }) => ({
  ...user,
}))(ChangeIden);
