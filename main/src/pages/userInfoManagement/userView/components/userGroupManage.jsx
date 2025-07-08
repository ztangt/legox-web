import React, { useState } from 'react';
import { connect } from 'dva';
import styles from './userGroupManage.less';
import UserGroupSetModal from './userGroupSetModal';
import { Tree, Table, Button, Input, Space } from 'antd';
import ColumnDragTable from '../../../../componments/columnDragTable'
import {ORDER_WIDTH,BASE_WIDTH} from '../../../../util/constant'
function UserAuthorityCat({dispatch,setParentState, parentState,query}) {
    const {
        curRecord,
        returnCount,
        userGroupList,
        currentPage,
        isShowGroupSettingModal,
        userId
    } = parentState;
    const tableProps = {
        rowKey: 'id',
        scroll:{y:'calc(100% - 45px)'},
        columns: [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width:ORDER_WIDTH,
                render: (text, record, index) => <div>{(10 * (currentPage - 1)) + index + 1}</div>
            },
            {
                title: '用户组名称',
                dataIndex: 'ugName',
                key: 'ugName',
                width:BASE_WIDTH,
            },
            {
                title: '用户组编码',
                dataIndex: 'ugCode',
                key: 'ugCode',
                width:BASE_WIDTH,
            },
            {
                title: '用户组描述',
                dataIndex: 'ugDesc',
                key: 'ugDesc',
                width:BASE_WIDTH*2.5,
            }
        ],
        dataSource: userGroupList[userId],
        pagination: false
    }

    const settingFn = () => {
        // 获取用户关联用户组信息
        dispatch({
            type: 'userView/getUserUserGroup',
            payload: {
                orgRefUserId: curRecord.identityId,
            },
            extraParams:{
                setState:setParentState,
                state:parentState
            },
        })
        setParentState({
            isShowGroupSettingModal: true,
        })
    }

    return (
        <div className={styles.relation_container} id="user_group_set">
            <Space>
                <Button onClick={settingFn} className={styles.button}>设置</Button>
            </Space>
            <div style={{height:'calc(100% - 48px)'}}>
                <ColumnDragTable {...tableProps} />
            </div>
            {isShowGroupSettingModal && <UserGroupSetModal query={query} setParentState={setParentState} parentState={parentState}/>}
        </div>
    )
}

export default connect(({ userView, loading }) => ({
    ...userView,
    loading
}))(UserAuthorityCat);
