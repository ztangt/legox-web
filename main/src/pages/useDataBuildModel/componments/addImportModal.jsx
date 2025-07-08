import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Input, Button, message, Modal, Form, Row, Col, Select, Space, InputNumber } from 'antd';
import { FIELD_TYPE } from '../../../service/constant';
import styles from './addFieldModal.less';

function AddFieldModal({ dispatch, useDataBuildModel, layoutG }) {
    const {
        pathname,
        fileStorageId
    } = useDataBuildModel

    const [form] = Form.useForm();
    const onFinish = () => {
        dispatch({
            type: 'useDataBuildModel/addDatasourceTableImport',
            payload: {
                id: fileStorageId,
                ...form.getFieldsValue(),
            },
            callback: () => {
                dispatch({
                    type: 'useDataBuildModel/updateStates',
                    payload: {
                        isShowImportModal: false,
                    },
                })
                dispatch({
                    type: 'useDataBuildModel/getDatasourceTree',
                })
            }
        })
    }
    const onCancel = () => {
        dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowImportModal: false,
            },
        })
    }
    const onValuesChange = () => { }

    return (
        <Modal
            visible={true}
            width={800}
            title={'导入物理表'}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            centered
            getContainer={() =>{
                return document.getElementById('useDataBuildModel_container')||false
            }}
            footer={[
                <Button onClick={onCancel}>
                        关闭
                    </Button>,
                    <Button type="primary" htmlType="submit" onClick={()=>{form.submit()}}>
                        导入
                    </Button>
            ]}
        >
            <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange} className={styles.form_wrap}>
                <Row>
                    <Col push={6} pull={6} span={12}>
                        <Form.Item
                            label="数据源标识"
                            name="dsDynamic"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Row>
                    <Col push={6} pull={6} span={12}>
                        <Form.Item
                            label="URL"
                            name="url"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row> */}
            </Form>
        </Modal>
    )
}
export default connect(({ useDataBuildModel, layoutG }) => ({
    useDataBuildModel,
    layoutG,
}))(AddFieldModal);
