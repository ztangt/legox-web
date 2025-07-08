import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Transfer, Tree, Modal, message } from 'antd';
import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';
import GlobalModal from '../../../componments/GlobalModal';

function relationUserModal({
  dispatch,
  relationUserModel,
  currentGlobalReviewer,
  currentNode,
}) {
  const { selectedDataIds } = relationUserModel;
  const handleCancel = () => {
    dispatch({
      type: 'globalReviewer/updateStates',
      payload: {
        isShowRelationModal: false,
        currentGlobalReviewer: {},
      },
    });
    clearData();
  };

  useEffect(() => {
    //获取当前关联用户 进行回显
    dispatch({
      type: 'globalReviewer/getGlobalReviewerIdentity',
      payload: {
        checkerId: currentGlobalReviewer.id,
        orgId: currentNode.id,
        start: 1,
        limit: 1000,
      },
      callback: data => {
        let curSelectedDataIds = [];
        let curSelectedDatas = [];

        data.list.forEach(element => {
          let user = {};
          user.orgId = element.orgId;
          user.orgName = element.orgName || '';
          user.deptName = element.deptName || '';
          user.userName = element.userName || '';

          user.orgRefUserId = element.identityId;
          curSelectedDatas.push(user);
          curSelectedDataIds.push(element.identityId);
        });
        dispatch({
          type: 'relationUserModel/updateStates',
          payload: {
            selectedDataIds: curSelectedDataIds,
            selectedDatas: curSelectedDatas,
          },
        });
      },
    });
  }, []);
  const onOk = () => {
    dispatch({
      type: 'globalReviewer/saveGlobalReviewerIdentity',
      payload: {
        identityIds: selectedDataIds.join(','),
        checkerId: currentGlobalReviewer.id,
        orgId: currentNode.id,
      },
      callback: () => {
        dispatch({
          type: 'globalReviewer/updateStates',
          payload: {
            isShowRelationModal: false,
            currentGlobalReviewer: {},
          },
        });
        clearData();
      },
    });
  };

  function clearData() {
    dispatch({
      type: 'relationUserModel/updateStates',
      payload: {
        currentNode: {},
        treeData: [],
        expandedKeys: [],
        treeSearchWord: '',
        selectedRowKeys: [],
        selectedDataIds: [],
        selectedNodeId: '',
        selectedDatas: [],
        originalData: [],
        selectNodeType: [],
      },
    });
  }

  return (
    <GlobalModal
      title="关联用户"
      visible={true}
      onOk={onOk}
      onCancel={handleCancel}
      widthType={3}
      maskClosable={false}
      mask={false}
      bodyStyle={{paddingBottom:0}}
      okText="保存"
      cancelText="取消"
      getContainer={() => {
        return document.getElementById('globalReviewer_container') || false;
      }}
    >
      <RelevanceModal
        nameSpace="relationUserModel"
        spaceInfo={relationUserModel}
        orgUserType="USER"
      />
    </GlobalModal>
  );
}
export default connect(({ globalReviewer, loading, relationUserModel }) => ({
  ...globalReviewer,
  relationUserModel,
  loading,
}))(relationUserModal);
