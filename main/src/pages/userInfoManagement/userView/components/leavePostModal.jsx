import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import styles from './leavePostModal.less';
import { Modal, Form, Row, Col, Input, Radio, Divider, Space, Button, message } from 'antd';
import SelectPersonModal from './selectPersonModal';
import MigrateModal from './migrateModal';
import GlobalModal from '../../../../componments/GlobalModal';
function LeavePostModal({ dispatch, userView, postRecord,setParentState,parentState,query}) {
    const { curRecord, isShowChoicePerson, selectedDatas, isShowMigrateModal, selectedRowsData, leavepostType, selectedDataIds} = parentState;
    const [form] = Form.useForm();
    useEffect(() => {
        if (selectedDatas.length > 0) {
            form.setFieldsValue({ choicePerson: selectedDatas.map((item) => { return item.userName }).join(',') })
        }

    }, [selectedDatas,])
    const onFinish = (value) => {
        console.log('postRecord', postRecord);
        // 用户离岗操作
        if (selectedDataIds.length<=0) {
           message.warning('第一项是必选项')
        } else {
            dispatch({
                type: 'userView/addLeavepost',
                payload: {
                    orgRefUserId: postRecord.identityId,
                    leavepostType,
                    delRemoveOrgRefUserId: leavepostType == 'DEL_POST_REMOVE' ? selectedRowsData&&selectedRowsData[0].id : '',
                    removeOrgRefUserId: selectedDataIds.join(',')
                },
                callback:()=>{
                    // 获取用户身份列表
                    dispatch({
                        type: 'userView/getIdentity',
                        payload: {
                            userId: curRecord.userId,
                        },
                        extraParams:{
                            setState:setParentState,
                            state:parentState
                        },
                    });
                    onCancel()
                }
            })
        }
    }
    const onCancel = () => {
        setParentState({
            isShowLeavePostModal: false,
            selectedDatas: [],
            selectedDataIds: [],
            selectedRowsData: []
        })
    }
    const onChoicePerson = () => {
        setParentState({
            isShowChoicePerson: true,
        })
    }
    const handleCancels = () => {
        setParentState({
            isShowChoicePerson: false,
        })
    }
    const onMigrate = () => {
        setParentState({
            isShowMigrateModal: true,
        })
    }
    const onHandleCancel = () => {
        setParentState({
            isShowMigrateModal: false,
        })
    }
    const changeRadio = (e) => {
        setParentState({
            leavepostType: e.target.value,
        })
    }
    return (
        <div>
            <GlobalModal
                visible={true}
                // width={800}
                title={'设置离岗'}
                onCancel={onCancel}
                widthType={2}
                incomingHeight={400}
                incomingWidth={800}
                maskClosable={false}
                mask={false}
                getContainer={()=>{
                    return document.getElementById(`user_detail_${query?.userId}_${query?.identityId}`)||false
                }}
                centered
                footer={[
                    <Button key="cancel" onClick={onCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" htmlType="submit" onClick={() => { form.submit() }}>
                        保存
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    className={styles.form}
                // initialValues={{
                //     'leavepostType': postRecord.isMainPost
                // }}
                >
                    <h3>请选择取消兼岗后数据操作</h3>
                    <p>第一步:</p>
                    <Form.Item
                        label="待办/在办数据迁移至"
                        name="choicePerson"
                        labelCol={{span:5}}
                        wrapperCol={{span:19}}
                    >
                        <Input placeholder='选人树(岗人)'
                            className={styles.txt} onClick={() => { onChoicePerson() }} />
                    </Form.Item>
                    <Divider />
                    <Form.Item
                    >
                        <p style={{ marginBottom: 10 }}>第二步:</p>
                        <Radio.Group onChange={changeRadio}>
                            <Space direction="vertical">
                                <Radio value={'LEAVE_POST'}>离岗</Radio>
                                <Radio value={'DEL_POST_REMOVE'} >
                                    <span>删除岗位并迁移数据：
                                    </span> <div className={styles.migrate}
                                        onClick={() => { onMigrate() }}
                                    >{selectedRowsData.length == 0 ? <span>选择迁移至岗位</span> : <>姓名:{selectedRowsData[0].userName}{selectedRowsData[0].postName ? '岗位' : selectedRowsData[0].postName}</>}</div>
                                    {/* <>姓名:{selectedRowsData[0].userName} 岗位:{selectedRowsData[0].postName}</> */}
                                </Radio>
                                <Radio value={'DEL_POST_DELETE'}>删除岗位及数据</Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </GlobalModal>
            {isShowChoicePerson && <SelectPersonModal
                handleOk={handleCancels}
                handleCancel={handleCancels}
                setParentState={setParentState}
                parentState={parentState}
                query={query}
            />}
            {isShowMigrateModal && <MigrateModal
                handleOk={onHandleCancel}
                handleCancel={onHandleCancel}
                setParentState={setParentState}
                parentState={parentState}
                query={query}
            />}
        </div>
    )
}
export default connect(({ userView, loading,tree }) => ({
    userView,
    loading,
    tree
}))(LeavePostModal);
