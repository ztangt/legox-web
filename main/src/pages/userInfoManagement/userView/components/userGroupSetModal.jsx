import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import styles from './userGroupSetModal.less';
import { Modal, Transfer } from 'antd';
import GlobalModal from '../../../../componments/GlobalModal';
function userGroupSetModal({dispatch,setParentState, parentState,query}) {
    const {
        curRecord,
        ugs,
        userGroupList,
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
            userTargetKeys: [...targetKeysHandle(userGroupList[userId])],
            ugs: removeRepeatFn(ugs)
        })
        return () => { }
    }, [userGroupList[userId]])

    const onFinish = () => {
        console.log(userTargetKeys,'userTargetKeys');
        // 设置用户关联用户组
        dispatch({
            type: 'userView/addUserUserGroup',
            payload: {
                identityId: curRecord.identityId,
                ugIds: userTargetKeys.join(','),
            },
            extraParams:{
                setState:setParentState,
                state:parentState
            },
            callback: () => {
                // 获取用户关联用户组信息(右列)
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
            }
        })
        onCancel()
    }
    const onCancel = () => {
        setParentState({
            isShowGroupSettingModal: false,
        })
    }

    const onChange = (nextTargetKeys, direction, moveKeys) => {
        setParentState({
            ...parentState,
            userTargetKeys: nextTargetKeys,
        })
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
            title={'关联用户组'}
            onOk={onFinish}
            onCancel={onCancel}
            maskClosable={false}
            centered
            mask={false}
            okText="确认"
            cancelText="关闭"
            getContainer={() => {
              return document.getElementById(`user_detail_${query?.userId}_${query?.identityId}`)||false;
            }}
            className={styles.set_modal}
        >
            <Transfer
                titles={['可选用户组', '已选用户组']}
                dataSource={dataSourceFn(ugs)}
                targetKeys={userTargetKeys}
                selectedKeys={selectedKeys}
                onChange={onChange}
                onSelectChange={onSelectChange}
                onScroll={onScroll}
                render={item => item.ugName}
            />
        </GlobalModal>
    )
}
export default connect(({ userView, loading }) => ({
    ...userView,
    loading
}))(userGroupSetModal);
