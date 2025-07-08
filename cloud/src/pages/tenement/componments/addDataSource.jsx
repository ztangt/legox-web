import React, { useState,useEffect} from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Row, Col, Switch, Input, Select } from 'antd'
import styles from './addDataSource.less'
function AddDataSource({ dispatch, tenement, layoutG, setFormValues, formValues }) {
    useEffect(()=>{
        form.setFieldsValue({
                "dsName": formValues.dsName,
                "dsDynamic": formValues.dsDynamic,
                "dsType": formValues.dsType,
                "url": formValues.url,
                "username":formValues. username,
                "password": formValues.password,
                "validatuibQuery": formValues.validatuibQuery,
        })
    },[])
    const [form] = Form.useForm();
    const onValuesChange = (val) => {console.log(val,'val'); }
    const onReset =() => {
        form.resetFields(); // 重置表单字段
        setFormValues({})
    }
    //关闭弹框不清除内容
    const handelCancelModal=()=>{
        dispatch({
            type: "tenement/updateStates",
            payload: {
                isShowAddDataSource: false
            }
        })
    }
    const onFinish = (values) => {
        values.isEnable = '1';
        setFormValues(values)
        dispatch({
            type: "tenement/updateStates",
            payload: {
                isShowAddDataSource: false
            }
        })
    }
    const onTestLink = () => {
        dispatch({
            type: 'tenement/addDatasourceTest',
            payload: {
                dsType: form.getFieldsValue()['dsType'],
                url: form.getFieldsValue()['url'],
                drive: form.getFieldsValue()['dsType'] == 'MYSQL' ? 'com.mysql.cj.jdbc.Driver' : 'com.kingbase8.Driver',
                username: form.getFieldsValue()['username'],
                password: form.getFieldsValue()['password'],
            }
        })
    }
    const validatorName = (rule, value) => {
        if (value) {
            if (value.indexOf('-') > -1) {
                return Promise.reject(new Error('禁止使用短线 - 命名 '));
            } else {
                return Promise.resolve();
            }
        } else {
            return Promise.resolve();
        }
    };
    const onChangeType = (value) => {
        if (value == 'MYSQL') {
            form.setFieldsValue({
                url: 'jdbc:mysql://localhost:3306/name?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8'
            });
        } else {
            form.setFieldsValue({
                url: 'jdbc:kingbase8://localhost:54321/name?zeroDateTimeBehavior=convertToNull&useUnicode=true&characterEncoding&currentSchema=PUBLIC,SYS_CATALOG'
            });

        }
    }
    const checkData=(e)=>{
        console.log(e.target.value,'value');
        dispatch({
            type:'tenement/checkDataSource',
            payload:{
                dsDynamic:e.target.value
            },
            callback:()=>{
                form.setFieldsValue({ "dsDynamic": '' })
            }
        })
    }
    return (
        <div>
            <Modal
                open={true}
                title='新增数据源'
                onCancel={handelCancelModal}
                maskClosable={false}
                mask={false}
                getContainer={() => {
                    return document.getElementById('tenement_container')
                }}
                footer={false}
                bodyStyle={{ height: '460px' }}
                width={800}
            >
                <Form form={form}  onFinish={onFinish}  className={styles.form_wrap}>
                    <Row gutter={50}>
                        <Col span={12}>
                            <Form.Item
                                label="数据源名称"
                                name="dsName"
                                rules={[
                                    { required: true, message: '请输入数据源名称' },
                                    { max: 50, message: '最多输入50个字符' }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="数据源标识"
                                name="dsDynamic"
                                rules={[
                                    { required: true, message: '请输入数据源标识' },
                                    { max: 50, message: '最多输入50个字符' },
                                    {
                                        validator: validatorName,
                                    },
                                ]}
                            >
                                <Input onBlur={checkData.bind(this)}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={50}>
                        <Col span={12}>
                            <Form.Item
                                label="数据库类型"
                                name="dsType"
                                rules={[
                                    { required: true, message: '请选择数据库类型' },
                                ]}
                            >
                                <Select onChange={onChangeType}>
                                    <Select.Option value='MYSQL'>MYSQL</Select.Option>
                                    <Select.Option value='KINGBASE'>人大金仓</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="数据库连接"
                                name="url"
                                rules={[
                                    { required: true, message: '请输入数据库连接' },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={50}>
                        <Col span={12}>
                            <Form.Item
                                label="用户"
                                name="username"
                                rules={[
                                    { required: true, message: '请输入用户名' },
                                    { max: 50, message: '最多输入50个字符' }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="密码"
                                name="password"
                                rules={[
                                    { required: true, message: '请输入密码' },
                                    { max: 50, message: '最多输入50个字符' }
                                ]}
                            >
                                <Input type="password" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={50}>
                        <Col span={24}>
                            <Form.Item
                                label="查询语句"
                                name="validatuibQuery"
                                rules={[
                                    { required: true, message: '请输入查询语句' },
                                    { max: 50, message: '最多输入50个字符' }
                                ]}
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* <Row gutter={50}>
                        <Col span={12}>
                            <Form.Item
                                label="是否启用"
                                name="isEnable"
                                valuePropName="checked"
                            >
                                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                            </Form.Item>
                        </Col>
                    </Row> */}
                    <Row align={'center'}>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                        <Button onClick={onTestLink} style={{ marginLeft: 8 }}>
                            测试链接
                        </Button>
                        <Button onClick={onReset} style={{ marginLeft: 8 }}>
                            重置
                        </Button>
                    </Row>
                </Form>
            </Modal>
        </div>
    )
}
export default connect(({ tenement, layoutG }) => ({ tenement, layoutG }))(AddDataSource)
