import React from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Input, Row, Col, } from 'antd'
import pinyinUtil from '../../../service/pinyinUtil';
function addTableSource({ dispatch, manageModel, onCancel, sourceItem ,selectTableSource,currentIndex}) {
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
    const [form] = Form.useForm()
    const onFinish = (values) => {
        dispatch({
            type: 'manageModel/addSourceTable',
            payload: {
                dsId: sourceItem.dsId,
                dsDynamic: sourceItem.dsDynamic,
                tableCode: values.tableCode,
                tableName: values.tableName,
                tableDesc: values.tableDesc,
                tenantId: sourceItem.id,
            },
            callback: (result) => {
                dispatch({
                    type: 'manageModel/getTenantDatasource',
                    payload: {
                        tenantJson: JSON.stringify([{ tenantId: sourceItem.id, dsDynamic: sourceItem.dsDynamic }])
                    },
                })
                selectTableSource(sourceItem, currentIndex, '', {value:result.tableId,tenantId:sourceItem.id,tableCode:result.tableCode,tableName:result.tableName,key:result.tableId})
                onCancel()

            }
        })
    }
    const onChange = (e) =>{
        if(e.target.value){
            form.setFieldsValue({'tableCode': pinyinUtil.getFirstLetter(e.target.value,false).toUpperCase()})
        }else{
            form.setFieldsValue({'tableCode': ''})
        }
    }
    const checkForm=(_,value)=>{
        let reg = /^[a-zA-Z\u4e00-\u9fa5]{1}.*$/;
        let regAll = /^[a-zA-Z0-9_\u4e00-\u9fa5]*$/;
        //且汉字字母数字下划线
        if(value&&!reg.test(value)){
          return Promise.reject(new Error('汉字、字母开头,支持（汉字、字母、数字、下划线）'))
        }else if(value&&!regAll.test(value)){
          return Promise.reject(new Error('汉字、字母开头,支持（汉字、字母、数字、下划线）'))
        }else{
          return Promise.resolve();
        }
      }
      const checkFormCode=(_,value)=>{
        var regCode = /^[A-Z][A-Z0-9_]*$/;
        //且汉字字母数字下划线
        if(value&&!regCode.test(value)){
          return Promise.reject(new Error('字母开头，支持（大写字母、数字，下划线）'))
        }else{
          return Promise.resolve();
        }
      }
    return (
        <div>
            <Modal
                title='添加表'
                open={true}
                width={600}
                onCancel={onCancel}
                mask={false}
                maskClosable={false}
                bodyStyle={{ height: 400, overflow: 'auto' }}
                getContainer={() => {
                    return document.getElementById('container_manageModel')
                }}
                footer={
                    [
                        <Button onClick={onCancel}>取消</Button>, <Button type='primary' onClick={() => { form.submit() }}>保存</Button>
                    ]
                }
            >
                <Form form={form} {...layout} initialValues={{ ...sourceItem }} onFinish={onFinish}>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item label='数据源' name='dsName'>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                label='表名称' 
                                name='tableName'
                                rules={
                                    [{ required: true, message: '请输入表名称' },
                                    {max: 64,message: '最多输入64个字符!'},
                                    {validator:checkForm}
                                ]}
                            >
                                <Input onChange={onChange}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                            label='表编码'
                            name='tableCode'
                            rules={
                                [{ required: true, message: '请输入表编码' },
                                {max: 64,message: '最多输入64个字符!'},
                                {validator:checkFormCode},
                            ]}
                            >
                                <Input onChange={onChange}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='表描述' name='tableDesc'>
                                <Input.TextArea rows={1} />
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>

            </Modal>
        </div>
    )
}
export default connect(({ manageModel }) => ({ manageModel }))(addTableSource)
