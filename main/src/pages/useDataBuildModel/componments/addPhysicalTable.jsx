import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Input, Button, message, Modal, Form, Row, Col, Select, Space, InputNumber } from 'antd';
import { FIELD_TYPE } from '../../../service/constant';
import { dataFormat } from '../../../util/util';
import pinyinUtil from '../../../service/pinyinUtil';
import moment from 'moment'
import GlobalModal from '../../../componments/GlobalModal';
// import styles from './addPhysicalTable.less';

function AddPhysicalTable({ dispatch, useDataBuildModel, layoutG, isAddPhysicalTable, dsId, dsDynamic, tableId, tableDesc,dsName,createTime,createUserName }) {
    const {
        pathname,
        getPhysicalForm,
    } = useDataBuildModel

    const [form] = Form.useForm();
    const [isCatPhysicalTable, setIsCatPhysicalTable] = useState(Boolean(isAddPhysicalTable == 'cat'));

    useEffect(() => {

        isAddPhysicalTable != 'add' && form.setFieldsValue({...getPhysicalForm,'createTime':dataFormat(getPhysicalForm.createTime,'YYYY-MM-DD')})
        isAddPhysicalTable == 'add' && form.setFieldsValue({'dsDynamic':dsName,'createTime':dataFormat(new Date()/1000,'YYYY-MM-DD')})

    })

    const onValuesChange = () => { }
    const onFinish = () => {
        console.log(form.getFieldsValue()['createTime']);
        if (isAddPhysicalTable == 'add') {
            // 新增物理表
            dispatch({
                type: 'useDataBuildModel/addDatasourceTable',
                payload: {
                    dsId,
                    dsDynamic,
                    ...form.getFieldsValue(),
                    createTime: moment(form.getFieldsValue()['createTime'],'YYYY-MM-DD').format('X')

                }
            })
        } else if (isAddPhysicalTable == 'modify') {
            // 修改物理表
            dispatch({
                type: 'useDataBuildModel/updateDatasourceTable',
                payload: {
                    tableId,
                    tableDesc,
                    ...form.getFieldsValue(),
                    createTime: moment(form.getFieldsValue()['createTime'],'YYYY-MM-DD').format('X')
                },
            })
        } else {
            // 查看物理表
            dispatch({
                type: 'useDataBuildModel/updateDatasourceTable',
                payload: {
                    tableId,
                    tableDesc,
                    ...form.getFieldsValue(),
                },
            })
        }
        dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowAddPhysicalTableModal: false,
            }
        })
    }
    const onCancel = () => {
        dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowAddPhysicalTableModal: false,
            }
        })
    }



    const onChangeName = (e) =>{
        if(e.target.value){
            form.setFieldsValue({'tableCode': pinyinUtil.getFirstLetter(e.target.value,false).toUpperCase()})
        }
    }
    const layouts = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const layoutM = { labelCol: { span: 3.5 }, wrapperCol: { span: 20 } };

    return (
        <GlobalModal
            visible={true}
            widthType={1}
            incomingWidth={600}
            incomingHeight={200}
            title={isCatPhysicalTable ? '查看表' : isAddPhysicalTable == 'add' ? '添加表' : '修改表'}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            centered
            getContainer={() => {
                return document.getElementById('useDataBuildModel_container')||false
            }}
            bodyStyle={{overflow:'visible'}}
            footer={[
                <>
                <Button onClick={onCancel}>
                        取消
                    </Button>
                    {!isCatPhysicalTable&&<Button type="primary" htmlType="submit" onClick={()=>{form.submit()}}>
                        保存
                    </Button>}
                </>
                
            ]}
        >
            <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange} >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="数据源"
                            name="dsDynamic"
                            {...layouts}
                        >
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="创建时间"
                            name="createTime"
                            {...layouts}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="表名称"
                            name="tableName"
                            {...layouts}
                        >
                            {/* 名称在非新增时禁用 */}
                            <Input disabled={isAddPhysicalTable != 'add'} onChange={onChangeName.bind(this)}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="表编码"
                            name="tableCode"
                            {...layouts}
                        >
                            {/* 编码在非新增时禁用 */}
                            <Input disabled={isAddPhysicalTable != 'add'} onChange={onChangeName.bind(this)}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={50}>
                    <Col span={24}>
                        <Form.Item
                            label="表描述"
                            name="tableDesc"
                            {...layoutM}
                        >
                            <Input.TextArea disabled={isAddPhysicalTable == 'cat'} style={{marginLeft: -2}}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </GlobalModal>
    )
}
export default connect(({ useDataBuildModel, layoutG }) => ({
    useDataBuildModel,
    layoutG,
}))(AddPhysicalTable);
