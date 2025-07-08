import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import styles from './userSettingModal.less';
import { Modal, Transfer } from 'antd';
import GlobalModal from '../../../../componments/GlobalModal';
function UserSettingModal({dispatch,setParentState,parentState,query}) {
    const {
        curRecord,
        allUserRole,
        userRoleList,
        userTargetKeys,
        userId
    } = parentState;

    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const dataSourceFn = (data) => data.map(({ ...item }) => ({ ...item, key: item.id }));
    const targetKeysHandle = (data) => data.map(item => item.id);
    // 重复数据过滤
    const removeRepeatFn = data => data.filter((filterItem, index, self) => {
        let arrids = [];
        data.forEach((forItem, i) => {
            arrids.push(forItem.id)
        })
        return arrids.indexOf(filterItem.id) === index
    })

    useEffect(() => {
        setParentState({
            userTargetKeys: [...targetKeysHandle(userRoleList[userId])],
            allUserRole: removeRepeatFn(allUserRole),
        })
        return () => { }
    }, [userRoleList[userId]])

    const onFinish = () => {
        // 新增用户角色
        dispatch({
            type: 'userView/addUserRole',
            payload: {
                orgRefUserId: curRecord.identityId,
                roleIds: userTargetKeys.join(','),
                userId: curRecord.userId,
                postId: curRecord.postId,
            },
            extraParams:{
                setState:setParentState,
                state:parentState
            },
            callback: () => {
                // 获取用户关联角色列表
                dispatch({
                    type: 'userView/getUserRole',
                    payload: {
                        orgRefUserId: curRecord.identityId,
                    },
                    extraParams:{
                        setState:setParentState,
                        state:parentState
                    },
                })
            }
        })
        onCancel()
    }
    const onCancel = () => {
        setParentState({isShowUserSettingModal: false,})
    }

    const onChange = (nextTargetKeys, direction, moveKeys) => {
        setParentState({ userTargetKeys: nextTargetKeys,})
    };

    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const onScroll = (direction, e) => {
    };

    return (
        <GlobalModal
            visible={true}
            // width={800}
            widthType={2}
            incomingHeight={400}
            title={'分配角色'}
            onOk={onFinish}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            centered
            okText="确认"
            cancelText="关闭"
            className={styles.set_modal}
            getContainer={()=>{return document.getElementById(`user_detail_${query?.userId}_${query?.identityId}`)||false}}
        >
            <Transfer
                titles={['可选角色', '已选角色']}
                dataSource={dataSourceFn(allUserRole)}
                targetKeys={userTargetKeys}
                selectedKeys={selectedKeys}
                onChange={onChange}
                onSelectChange={onSelectChange}
                onScroll={onScroll}
                render={item => item.roleName}
            />
        </GlobalModal>
    )
}
export default connect(({ userView, loading }) => ({
    ...userView,
    loading
}))(UserSettingModal);
