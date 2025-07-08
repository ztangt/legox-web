import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Input, } from 'antd'
import { connect } from 'dva'
import GlobalModal from '../../../componments/GlobalModal'
function AddSysAccessModal({ dispatch, systemAccess }) {
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } }
    const { TextArea } = Input
    const [form] = Form.useForm()
    const { detailData } = systemAccess
    useEffect(() => {
        form.setFieldsValue({
            appName: detailData.appName,
            provider: detailData.provider,
            appId: detailData.appId,
            appKey: detailData.appKey,
            appUrl: detailData.appUrl,
            industry: detailData.industry,
            scale: detailData.scale,
            remark: detailData.remark,
        })
    }, [detailData])
    const onFinish = (values) => {
        console.log(values, 'values');
        if (detailData.id) {
            dispatch({
                type:'systemAccess/updateSystemAccess',
                payload:{
                    id:detailData.id,
                    ...values
                }
            })
        }
        else {
            dispatch({
                type: 'systemAccess/addSystemAccess',
                payload: {
                    ...values
                }
            })
        }

        dispatch({
            type: 'systemAccess/updateStates',
            payload: {
                isShow: false,
                detailData:{},
            }
        })
    }
    const handleCancel = () => {
        dispatch({
            type: 'systemAccess/updateStates',
            payload: {
                isShow: false,
                detailData:{},
            }
        })
    }
    return (
        <div>
            <GlobalModal
                widthType={1}
                incomingHeight={430}
                incomingWidth={500}
                modalType={'page'}
                visible={true}
                top={15}
                title={detailData&&detailData.id ? '修改系统信息' : '新增系统信息'}
                onCancel={handleCancel}
                footer={[
                    <Button onClick={handleCancel}>取消</Button>,
                    <Button type='primary' htmlType='submit' onClick={() => { form.submit() }}>保存</Button>,
                ]}
                // centered
                getContainer={()=>{return document.getElementById('systemAccess_id')||false}}
                mask={false}
                maskClosable={false}
            >
                <Form {...layout} form={form} onFinish={onFinish}>
                    <Form.Item
                        label='系统名称'
                        name='appName'
                        rules={[
                            { required: true, message: '请填写系统名称' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='服务商'
                        name='provider'
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='APPID'
                        name='appId'
                        rules={[
                            { required: true, message: '请填写APPID' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='APPKEY'
                        name='appKey'
                        rules={[
                            { required: true, message: '请填写APPKEY' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='APP_URL'
                        name='appUrl'
                        rules={[
                            { required: true, message: '请填写APP_URL' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='所在行业'
                        name='industry'
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='公司规模'
                        name='scale'
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='备注'
                        name='remark'
                    >
                        <TextArea rows={3} />
                    </Form.Item>
                </Form>
            </GlobalModal>
        </div>
    )
}
export default connect(({ systemAccess }) => ({ systemAccess }))(AddSysAccessModal)
