import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Transfer, Tree, Modal, message } from 'antd';
import _ from 'lodash';
import GlobalModal from '../../../componments/GlobalModal';
import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';
function relationUserInfo({ dispatch, calendarMg, form }) {
  const { ugIds, selectedDataIds, selectedDatas } = calendarMg;
  const handleCancel = () => {
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        isShowRelationModal: false,
        selectedDataIds: [],
        selectedDatas: [],
      },
    });
  };
  const onOk = () => {
    if (selectedDatas.length) {
      form.setFields([
        {
          name: ['relUser'],
          value: selectedDatas[0].identityId,
        },
        {
          name: ['relUserName'],
          value: selectedDatas[0].userName,
        },
      ]);
    }
    handleCancel();
  };
  return (
    <GlobalModal
      title="关联用户"
      visible={true}
      onOk={onOk}
      onCancel={handleCancel}
      widthType={3}
      maskClosable={false}
      // bodyStyle={{ height: '445px', padding: '0px' }}
      mask={false}
      okText="确认"
      cancelText="关闭"
      getContainer={() => {
        return document.getElementById('calendarMgDiv')||false;
      }}
    >
      <RelevanceModal
        nameSpace="calendarMg"
        spaceInfo={calendarMg}
        orgUserType="USER"
        selectButtonType="radio"
      />
    </GlobalModal>
  );
}
export default connect(({ calendarMg, loading }) => ({
  calendarMg,
  loading,
}))(relationUserInfo);
