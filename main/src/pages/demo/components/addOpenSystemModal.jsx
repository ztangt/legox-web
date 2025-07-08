import React, { useEffect } from 'react'
import { connect } from 'dva'
import { Modal, Form, Button, Input,Select,Row,Col,message } from 'antd'
import {ACCREDITTYPE} from '../../../service/constant'
import copy from "copy-to-clipboard";
import {CopyOutlined} from '@ant-design/icons'
function addOpenSystemModal({ dispatch, openSystemDemo }) {
    const [form] = Form.useForm()
    const { TextArea } = Input
    const layout = { labelCol: { span:  5.5}, wrapperCol: { span: 16 } }
    const { detailData } = openSystemDemo
    console.log(detailData, 'detailData');
    useEffect(() => {
        form.setFieldsValue({
            clientKey: detailData.clientKey,
            clientName: detailData.clientName,
            webServerRedirectUri: detailData.webServerRedirectUri,
            provider: detailData.provider,
            industry: detailData.industry,
            scale: detailData.scale,
            remark: detailData.remark,
            clientSecret:detailData.clientSecret,
            authorizedGrantTypes:detailData.authorizedGrantTypes?detailData.authorizedGrantTypes.split(','):undefined,
            accessTokenValidity:detailData.accessTokenValidity
        })
    }, [detailData])
    const handleCancel = () => {
        dispatch({
            type: 'openSystemDemo/updateStates',
            payload: {
                isShow: false,
                detailData:{},
            }
        })
    }
    const onFinish = (values) => {
        if (detailData.id) {
            dispatch({
                type: 'openSystemDemo/updateOpenSystem',
                payload: {
                    id: detailData.id,
                    clientName: values.clientName,
                    webServerRedirectUri: values.webServerRedirectUri,
                    provider: values.provider,
                    industry: values.industry,
                    scale: values.scale,
                    remark: values.remark,
                    authorizedGrantTypes:values.authorizedGrantTypes?.join(','),
                    accessTokenValidity:values.accessTokenValidity
                }
            })
        } else {
            dispatch({
                type: 'openSystemDemo/addOpenSystem',
                payload: {
                    clientName: values.clientName,
                    webServerRedirectUri: values.webServerRedirectUri,
                    provider: values.provider,
                    industry: values.industry,
                    scale: values.scale,
                    remark: values.remark,
                    authorizedGrantTypes:values.authorizedGrantTypes?.join(','),
                    accessTokenValidity:values.accessTokenValidity
                }
            })
        }

        dispatch({
            type: 'openSystemDemo/updateStates',
            payload: {
                isShow: false,
                detailData:{},
            }
        })
    }
    const checkAccessTokenValidity = (_, value) => {
        const reg = /^[1-9]\d*$/;
        if (!reg.test(value)) {
          return Promise.reject(new Error('仅支持输入正整数'));
        } else {
          return Promise.resolve();
        }
      };
    const handleCopy = value => {
        console.log(value,'value');
        if (value&&copy(value)) {
          message.success("复制成功");
        } else{
            message.error('暂无数据')
        }
         
      };
    return (
        <div>
            <Modal
                visible={true}
                title={detailData.id?'修改系统信息':'新增系统信息'}
                onCancel={handleCancel}//取消
                footer={[
                    <Button onClick={handleCancel}>取消</Button>,
                <Button type='primary' htmlType='submit' onClick={() => { form.submit() }}>保存</Button>

                ]}
                getContainer={()=>{return  document.getElementById('openSystem_id')||false}}
                mask={false}
                maskClosable={false}
                bodyStyle={{height:'calc(100vh - 340px)',overflow:'auto'}}
                centered
            >
                {/* onFinish 保存事件 */}
                <Form {...layout} form={form} onFinish={onFinish}>
                    <Form.Item
                        label='系统名称'
                        name='clientName'
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
                    <Row gutter={0}>
                        <Col span={20}>
                        <Form.Item
                            label='系统KEY'
                            name='clientKey'
                            labelCol={6}
                            wrapperCol={15}
                        >
                            <Input disabled />
                        </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item>
                            <CopyOutlined onClick={()=>{handleCopy(detailData.clientKey)}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Row gutter={0}>
                        <Col span={20}>
                        <Form.Item
                        label='系统秘钥'
                        name='clientSecret'
                        labelCol={6}
                        wrapperCol={16}
                        >
                            <Input disabled />
                        </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item>
                            <CopyOutlined onClick={()=>{handleCopy(detailData.clientSecret)}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label='授权方式'
                        name='authorizedGrantTypes'
                        rules={[
                            { required: true, message: '请选择授权方式！' }
                        ]}
                    >
                        <Select   mode="multiple" allowClear>
                            {
                                ACCREDITTYPE.map((item,index)=>{
                                    return <Select.Option value={item.key}>
                                        {item.name}
                                    </Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label='回调地址'
                        name='webServerRedirectUri'
                        rules={[
                            { required: true, message: '请输入回调地址！' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    
                <Row gutter={0}>
                    <Col span={20}>
                    <Form.Item
                        label='授权时效'
                        name='accessTokenValidity'
                        labelCol={6}
                        wrapperCol={16}
                        rules={[
                            { required: true, message: '' },
                            {
                                validator:checkAccessTokenValidity.bind(this)
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item>
                        <span>秒</span>
                        </Form.Item>
                    </Col>
                </Row>
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
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
export default connect(({ openSystemDemo }) => ({ openSystemDemo }))(addOpenSystemModal)
