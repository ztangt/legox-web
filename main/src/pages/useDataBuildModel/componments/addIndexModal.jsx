import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Input, Button, message, Modal, Table, Form, Space, Row, Col } from 'antd';
import styles from './addIndexModal.less';

function AddIndexModal({ dispatch, useDataBuildModel, layoutG, isAddIndexModal, indexesId }) {
    const {
        pathname,
    } = useDataBuildModel

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({});
    })

    const onValuesChange = () => {

    }
    const onFinish = () => {
        if (isAddIndexModal) {
            // 新增索引
            dispatch({
                type: 'useDataBuildModel/addDatasourceIndexes',
                payload: {
                    ...form.getFieldsValue(),
                }
            })
        } else {
            // 修改索引
            dispatch({
                type: 'useDataBuildModel/updateDatasourceIndexes',
                payload: {
                    id: indexesId,
                    ...form.getFieldsValue(),
                }
            })
        }
        dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowAddIndexModal: false,
            }
        })
    }
    const onCancel = () => {
        dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowAddIndexModal: false,
            }
        })
    }

    return (
        <Modal
            visible={true}
            width={800}
            title={isAddIndexModal ? '增加索引' : '修改索引'}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            centered
            footer={[
                <Button onClick={onCancel}>
                    取消
                </Button>,
                <Button type="primary" htmlType="submit" onClick={()=>{form.submit()}}>
                    保存
                </Button>
            ]}
        >
            <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange} className={styles.form_wrap}>
                <Row gutter={50}>
                    <Col span={24}>
                        <Form.Item
                            label="名称"
                            name="indexesName"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}
export default connect(({ useDataBuildModel, layoutG }) => ({
    useDataBuildModel,
    layoutG,
}))(AddIndexModal);