import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Transfer, Tree, Modal, message } from 'antd';
import _ from "lodash";
import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';
import GlobalModal from '../../../componments/GlobalModal';
function relationUserInfo({ dispatch, userGroupMg}) {
  const {ugIds,selectedDataIds} = userGroupMg;
  const handleCancel = () => {
    dispatch({
        type: 'userGroupMg/updateStates',
        payload: {
            isShowRelationModal: false
        }
    })
  }
  const onOk = () => {
    dispatch({
        type: 'userGroupMg/addSysUserGroupSaveUsers',
        payload: {
            userGroupId: ugIds[0].toString(),
            identityIds: selectedDataIds.join(','),
        },
        callback: () => {
            dispatch({
                type: 'userGroupMg/updateStates',
                payload: {
                    isShowRelationModal: false
                }
            })
        }
    })
  }
    return (
        <GlobalModal
            title="关联用户"
            visible={true}
            onOk={onOk}
            onCancel={handleCancel}
            // width={'95%'}
            widthType={3}
            // incomingWidth={800}
            // incomingHeight={200}
            maskClosable={false}
            mask={false}
            bodyStyle={{padding:'0 24px'}}
            okText="确认"
            cancelText="关闭"
            centered
            getContainer={() => {
                return document.getElementById('userGroupMg_container')||false
            }}
        >
          <RelevanceModal
            nameSpace="userGroupMg"
            spaceInfo={userGroupMg}
            orgUserType="USER"
            containerId='userGroupMg_container'
          />
        </GlobalModal>
    );
}
export default connect(({ userGroupMg, loading }) => ({
    userGroupMg,
    loading,
}))(relationUserInfo);
