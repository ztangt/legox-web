import { useState, useEffect, } from 'react';
import { connect } from 'dva';
import { Input, Button, message, Modal, Form, Row, Col, Select, Space, Switch } from 'antd';
import { FIELD_TYPE } from '../../../service/constant';
import styles from './addLinkDataSource.less';

function AddLinkDataSource({ dispatch, manageModel, isAddLinkDataSource }) {
    const {id} = manageModel
    const [form] = Form.useForm();
    const [isEnable, setIsEnable] = useState(true);
    const onValuesChange = () => { }
    const onFinish = (value) => {
            // 新增数据源
            dispatch({
                type: 'manageModel/addDatasource',
                payload: {
                    ...form.getFieldsValue(),
                    drive: value['dsType'] == 'MYSQL' ? 'com.mysql.cj.jdbc.Driver' : 'com.kingbase8.Driver',
                    isEnable: isEnable ? '1' : '0',
                    cloudTenantId:id
                },
                callback:()=>{
                    dispatch({
                        type: 'manageModel/getDatasourceTree',
                        payload: {
                            tenantId:id
                        }
                    })
                }
            })
        
    }
    const onCancel = () => {
        dispatch({
            type: 'manageModel/updateStates',
            payload: {
                isAddLinkDataSource: false,
            }
        })
    }
    const onChangeType = (value) => {
        if (value == 'MYSQL') {
            form.setFieldsValue({
                url: 'jdbc:mysql://localhost:3306/name?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8'
            });
        }else{
            form.setFieldsValue({
                url: 'jdbc:kingbase8://localhost:54321/name?zeroDateTimeBehavior=convertToNull&useUnicode=true&characterEncoding&currentSchema=PUBLIC,SYS_CATALOG'
            });
            
        }
    }
    const onTestLink = () => {
        dispatch({
            type: 'manageModel/addDatasourceTest',
            payload: {
                dsType: form.getFieldsValue()['dsType'],
                url: form.getFieldsValue()['url'],
                drive: form.getFieldsValue()['dsType'] == 'MYSQL' ? 'com.mysql.cj.jdbc.Driver' : 'com.kingbase8.Driver',
                username: form.getFieldsValue()['username'],
                password: form.getFieldsValue()['password'],
            }
        })
    }
    // 启用禁用
    const isEnableFn = (checked, event) => { setIsEnable(checked) }

    const validatorName = (rule, value) => {
      if (value) {
        if (value.indexOf('-')>-1) {
          return Promise.reject(new Error('禁止使用短线 - 命名 '));
        } else {
          return Promise.resolve();
        }
      } else {
        return Promise.resolve();
      }
    };

    return (
        <Modal
            visible={true}
            footer={false}
            width={'95%'}
            title={'新增数据源'}
            onCancel={onCancel.bind(this)}
            maskClosable={false}
            mask={false}
            centered
            getContainer={()=>{
                return document.getElementById('container_manageModel')
            }}
        >
            <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange} className={styles.form_wrap}>
                <Row gutter={50}>
                    <Col span={12}>
                        <Form.Item
                            label="数据源名称"
                            name="dsName"
                            rules={[
                                { required: true,message:'请输入数据源名称' },
                                { max: 50,message:'最多输入50个字符'}
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="数据源标识"
                            name="dsDynamic"
                            rules={[
                                { required: true,message:'请输入数据源标识' },
                                { max: 50,message:'最多输入50个字符'},
                                {
                                  validator: validatorName,
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={50}>
                    <Col span={12}>
                        <Form.Item
                            label="数据库类型"
                            name="dsType"
                            rules={[
                                { required: true,message:'请选择数据库类型' },
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
                                { required: true,message:'请输入数据库连接' },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={50}>
                    <Col span={12}>
                        <Form.Item
                            label="用户"
                            name="username"
                            rules={[
                                { required: true,message:'请输入用户名' },
                                { max: 50,message:'最多输入50个字符'}
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[
                                { required: true,message:'请输入密码' },
                                { max: 50,message:'最多输入50个字符'}
                            ]}
                        >
                            <Input type="password"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={50}>
                    <Col span={24}>
                        <Form.Item
                            label="查询语句"
                            name="validatuibQuery"
                            rules={[
                                { required: true,message:'请输入查询语句' },
                                { max: 50,message:'最多输入50个字符'}
                            ]}
                        >
                            <Input.TextArea/>
                        </Form.Item>
                    </Col>
                </Row>
                    <Row gutter={50}>
                        <Col span={12}>
                            <Form.Item
                                label="是否启用"
                                name="isEnable"
                            >
                                <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={isEnableFn} checked={isEnable} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row align={'center'}>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                        <Button onClick={onTestLink} style={{ marginLeft: 8 }}>
                            测试链接
                        </Button>
                        <Button onClick={onCancel.bind(this)} style={{ marginLeft: 8 }}>
                            取消
                        </Button>
                    </Row>
            </Form>
        </Modal>
    )
}
export default connect(({ manageModel }) => ({
    manageModel
}))(AddLinkDataSource);