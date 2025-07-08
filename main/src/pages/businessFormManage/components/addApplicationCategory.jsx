import { useState } from 'react';
import { connect } from 'dva';
import { Input, Button, message, Modal, Form, Row, Col, Select } from 'antd';
// import styles from './addApplicationCategory.less'

function AddApplicationCategory({ dispatch, businessFormManage, layoutG, isAddApplicationCategory }) {
    // const {
    //     pathname,
    // } = businessFormManage, {
    //     searchObj
    // } = layoutG, {

    // } = searchObj[pathname]

    const onValuesChange = () => { }
    const onFinish = () => {
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                isShowAddApplicationCategory: false,
            }
        })
    }
    const onCancel = () => {
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                isShowAddApplicationCategory: false,
            }
        })
    }
    return (
        <Modal
            visible={true}
            footer={false}
            width={'95%'}
            title={isAddApplicationCategory ? "新增应用类别" : '修改应用类别'}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            centered
        >
            <Form onFinish={onFinish} onValuesChange={onValuesChange}>
                <Row gutter={50}>
                    <Col span={12}>
                        <Form.Item
                            label="业务应用类别"
                            name=""
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="类型"
                            name=""
                        >
                            <Select />
                        </Form.Item>
                    </Col>
                </Row>
                <Row align={'center'}>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                    <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                        取消
                    </Button>
                </Row>
            </Form>
        </Modal>
    )
}
export default connect(({ businessFormManage, layoutG }) => ({
    businessFormManage,
    layoutG,
}))(AddApplicationCategory);