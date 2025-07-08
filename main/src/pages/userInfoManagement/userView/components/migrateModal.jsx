import React from 'react'
import { connect } from 'dva'
import { Modal, Table } from 'antd';
import GlobalModal from '../../../../componments/GlobalModal';
import ColumnDragTable from '../../../.../../../componments/columnDragTable'
import {BASE_WIDTH,ORDER_WIDTH} from '../../../../util/constant'
function MigrateModal({ dispatch, userView, handleCancel, handleOk ,setParentState,parentState,query}) {
    const { identityList, userId, selectedRowKeys } = parentState
    console.log(identityList[userId], 'identityList');
    const columns = [
        {
            title: '序号',
            dataIndex: 'num',
            width:ORDER_WIDTH,
        },
        {
            title: '所属单位',
            dataIndex: 'orgName',
            width:BASE_WIDTH,
        },
        {
            title: '所属部门',
            dataIndex: 'deptName',
            width:BASE_WIDTH,
        },
        {
            title: '岗位信息',
            dataIndex: 'postName',
            width:BASE_WIDTH,
        },
    ]
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setParentState({
                selectedRowsData: selectedRows,
                selectedRowKeys,
            })
        },
    };
    return (
        <div style={{height:'100%'}}>
            <GlobalModal
                title="迁移岗位"
                visible={true}
                onOk={handleOk}
                onCancel={handleCancel}
                // width={800}
                widthType={2}
                incomingHeight={400}
                incomingWidth={800}
                maskClosable={false}
                centered
                forceRender
                mask={false}
                okText="确认"
                cancelText="关闭"
                getContainer={()=>{
                    return document.getElementById(`user_detail_${query?.userId}_${query?.identityId}`)||false
                }}
            >
                <ColumnDragTable
                    rowKey='id'
                    pagination={false}
                    rowSelection={{
                        type: 'radio',
                        ...rowSelection,
                        selectedRowKeys: selectedRowKeys
                    }}
                    columns={columns}
                    dataSource={identityList[userId].map((item,index)=>{
                        item.num=index+1
                        return item
                    })}
                    scroll={{y:'calc(100% - 45px)'}}

                />
            </GlobalModal></div>
    )
}
export default connect(({ userView, loading }) => ({
    userView,
    loading
}))(MigrateModal);
