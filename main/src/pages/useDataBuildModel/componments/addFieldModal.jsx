import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Input, Button, message, Modal, Form, Row, Col, Select, Space, InputNumber } from 'antd';
import { FIELD_TYPE } from '../../../service/constant';
import styles from './addFieldModal.less';
import pinyinUtil from '../../../service/pinyinUtil';
import GlobalModal from '../../../componments/GlobalModal';

function AddFieldModal({ dispatch, useDataBuildModel, layoutG, isAddFieldModal, dsDynamic, tableId, tableCode, colId }) {
    const {
        pathname,
        limit,
        searchWord,
        getFieldForm,
        currentPage
    } = useDataBuildModel

    const [form] = Form.useForm();
    const [isShowColDecimalLength, setIsShowColDecimalLength] = useState(false);

    useEffect(() => {
        !isAddFieldModal && form.setFieldsValue(getFieldForm)
        if(form.getFieldsValue().colType=='MONEY'){
            setIsShowColDecimalLength(true);
        }else{
            setIsShowColDecimalLength(false);
        }
    })
    const onValuesChange = (changedValues, allValues) => {
     }
    const onFinish = async () => {
        if (isAddFieldModal) {
            // 添加字段
            await dispatch({
                type: 'useDataBuildModel/addDatasourceTableField',
                payload: {
                    ...form.getFieldsValue(),
                    dsDynamic,
                    tableId,
                    tableCode,
                }
            })
        } else {
            // 修改字段
            await dispatch({
                type: 'useDataBuildModel/updateDatasourceTableField',
                payload: {
                    colId,
                    ...form.getFieldsValue(),
                    dsDynamic,
                    tableId,
                    tableCode,
                }
            })
        }
        await dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowAddFieldModal: false,
                getFieldForm:{}
            }
        })
        // 获取列表;
        dispatch({
            type: 'useDataBuildModel/getDatasourceField',
            payload: {
                tableId,
                limit,
                searchWord,
                start: currentPage,
            },
        })
    }
    const onCancel = () => {
        dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowAddFieldModal: false,
                getFieldForm:{}
            }
        })
    }
    const onChange = (e) =>{
        if(e.target.value&&isAddFieldModal){
            form.setFieldsValue({'colCode': pinyinUtil.getFirstLetter(e.target.value,false).toUpperCase()})
        }
    }
    // 字段类型选择
    const selectColTypeFn = (value) => {
        // setIsShowColDecimalLength(false);
        // if (value == 'float'
        //     || value == 'double'
        //     || value == 'decimal') {
        //     setIsShowColDecimalLength(true);
        // }
        if (value == 'MONEY') {
            setIsShowColDecimalLength(true);
            form.setFieldsValue({'colLength':19,'colDecimalLength':6})
        }else{
            form.setFieldsValue({'colLength':null})
            setIsShowColDecimalLength(false);
        }
    }
    return (
        <GlobalModal
            widthType={1}
            visible={true}
            incomingWidth={600}
            incomingHeight={200}
            title={isAddFieldModal ? '添加字段' : '修改字段'}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            centered
            getContainer={() =>{
                return document.getElementById('useDataBuildModel_container')||false
            }}
            bodyStyle={{overflow:'visible'}}
            footer={
                [
                    <Button onClick={onCancel}>
                        取消
                    </Button>,
                    <Button type="primary" htmlType="submit" onClick={()=>{form.submit()}}>
                        保存
                    </Button>
                ]
            }
        >
            <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange} className={styles.form_wrap}>
                <Row gutter={50}>
                    <Col span={12}>
                        <Form.Item
                            label="字段名称"
                            name="colName"
                        >
                            <Input  onChange={onChange}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="字段编码"
                            name="colCode"
                        >
                            <Input disabled={!isAddFieldModal} onChange={onChange}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={50}>
                    <Col span={12}>
                        <Form.Item
                            label="字段类型"
                            name="colType"
                        >
                            <Select
                                onChange={selectColTypeFn}
                                options={FIELD_TYPE}
                                disabled={!isAddFieldModal}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="字段长度"
                            name="colLength"
                            rules={
                                [
                                    {
                                        required:true,
                                        message:'请输入字段长度!'
                                    }
                                ]
                            }
                        >
                            <InputNumber style={{ width: '100%' }} disabled={(form.getFieldsValue().colType=='MONEY')?true:false}/>
                        </Form.Item>
                    </Col>
                </Row>
                {
                    isShowColDecimalLength && <Row gutter={50}>
                        <Col span={12}>
                            <Form.Item
                                label="小数点位数"
                                name="colDecimalLength"
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                        </Col>
                    </Row>
                }
                {/**<Row gutter={50}>
                    <Col span={24}>
                        <Space style={{ fontWeight: 'bolder' }}>说明:不同字段类型设置属性不同</Space>
                    </Col>
                </Row>*/}
            </Form>
        </GlobalModal>
    )
}
export default connect(({ useDataBuildModel, layoutG }) => ({
    useDataBuildModel,
    layoutG,
}))(AddFieldModal);
