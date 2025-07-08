import React from 'react'
import { connect } from 'dva';
import { Modal, } from 'antd';
import RelevanceModal from '../../../../componments/relevanceModal/relevanceModal';
import GlobalModal from '../../../../componments/GlobalModal';
function SelectPersonModal({ dispatch, userView, handleCancel, handleOk ,setParentState,parentState,query}) {

    return (
        <div><GlobalModal
            title="关联用户"
            visible={true}
            onOk={handleOk}
            onCancel={handleCancel}
            // width={'95%'}
            widthType={2}
            incomingHeight={400}
            incomingWidth={900}
            maskClosable={false}
            forceRender
            centered
            mask={false}
            getContainer={()=>{
                return document.getElementById(`user_detail_${query?.userId}_${query?.identityId}`)||false
            }}
            okText="确认"
            cancelText="关闭"
            bodyStyle={{paddingBottom:0}}
        >
            <RelevanceModal
                nameSpace={'userView'}
                orgUserType="USER"
                spaceInfo={{...parentState}}
                setParentState={setParentState}
            />
        </GlobalModal></div>
    )
}
export default connect(({ userView, loading }) => ({
    userView,
    loading
}))(SelectPersonModal);
