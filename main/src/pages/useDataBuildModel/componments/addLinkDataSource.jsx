import { useState, useEffect, } from 'react';
import { connect } from 'dva';
import { Input, Button, message, Modal, Form, Row, Col, Select, Space, Switch } from 'antd';
import { FIELD_TYPE } from '../../../service/constant';
import styles from './addLinkDataSource.less';
import GlobalModal from '../../../componments/GlobalModal';

function AddLinkDataSource({ dispatch, useDataBuildModel, layoutG, isAddLinkDataSource, dsId }) {
    const {
        pathname,
        getDataSourceForm,
    } = useDataBuildModel
    const [form] = Form.useForm();
    const [isEnable, setIsEnable] = useState(true);
    const [isCatLinkDataSource, setIsCatLinkDataSource] = useState(Boolean(isAddLinkDataSource == 'cat'));
    const layouts =  {labelCol: { span: 8 },wrapperCol: { span: 16}};

    useEffect(() => {
        if(isAddLinkDataSource == 'add'){
            return
        }
        if (Object.keys(getDataSourceForm) != 0) {
            form.setFieldsValue({
                ...getDataSourceForm,
            });
            setIsEnable(Boolean(getDataSourceForm['isEnable'] == '1'));
        }
    }, [getDataSourceForm])

    const onValuesChange = () => { }
    const onFinish = (value) => {
      if (value.dsName.indexOf('-')>-1) {
        message.warning('数据源名称不能包含"-"字符');
        return
      }
        // if (isAddLinkDataSource == 'add') {
            dispatch({
                type: 'useDataBuildModel/addDatasourceTest',
                payload: {
                    dsType: form.getFieldsValue()['dsType'],
                    url: form.getFieldsValue()['url'],
                    drive: form.getFieldsValue()['dsType'] == 'MYSQL' ? 'com.mysql.cj.jdbc.Driver' : 'com.kingbase8.Driver',
                    username: form.getFieldsValue()['username'],
                    password: form.getFieldsValue()['password'],
                },
                callback:(data)=>{
                    // if(!data){
                    //     message.error('链接失败,保存失败');
                    // }else{
                        if (isAddLinkDataSource == 'add'){
                            // 新增数据源
                            dispatch({
                                type: 'useDataBuildModel/addDatasource',
                                payload: {
                                    ...form.getFieldsValue(),
                                    drive: value['dsType'] == 'MYSQL' ? 'com.mysql.cj.jdbc.Driver' : 'com.kingbase8.Driver',
                                    isEnable: isEnable ? '1' : '0'
                                }
                            })
                        }else{
                             // 修改数据源
                            dispatch({
                                type: 'useDataBuildModel/updateDatasource',
                                payload: {
                                    id: dsId,
                                    ...form.getFieldsValue(),
                                    drive: value['dsType'] == 'MYSQL' ? 'com.mysql.cj.jdbc.Driver' : 'com.kingbase8.Driver',
                                    isEnable: isEnable ? '1' : '0'
                                }
                            })
                        }
                         
                        
                    // }
                }
            })
        // } else if (isAddLinkDataSource == 'modify') {
        //     // 修改数据源
        //     dispatch({
        //         type: 'useDataBuildModel/updateDatasource',
        //         payload: {
        //             id: dsId,
        //             ...form.getFieldsValue(),
        //             drive: value['dsType'] == 'MYSQL' ? 'com.mysql.cj.jdbc.Driver' : 'com.kingbase8.Driver',
        //             isEnable: isEnable ? '1' : '0'
        //         }
        //     })
        // }

    }
    const onCancel = () => {
        dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowAddLinkDataSourceModal: false,
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
            type: 'useDataBuildModel/addDatasourceTest',
            payload: {
                dsType: form.getFieldsValue()['dsType'],
                url: form.getFieldsValue()['url'],
                drive: form.getFieldsValue()['dsType'] == 'MYSQL' ? 'com.mysql.cj.jdbc.Driver' : 'com.kingbase8.Driver',
                username: form.getFieldsValue()['username'],
                password: form.getFieldsValue()['password'],
            },
            callback:(data)=>{
                if (data) {
                    message.success('链接成功');
                } else {
                    message.error('链接失败');
                }
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
        <GlobalModal
            visible={true}
            widthType={1}
            incomingWidth={800}
            incomingHeight={300}
            title={isCatLinkDataSource ? '查看数据源' : isAddLinkDataSource == 'add' ? '新增数据源' : '修改数据源'}
            onCancel={onCancel.bind(this)}
            maskClosable={false}
            mask={false}
            centered
            getContainer={() => {
                return document.getElementById('useDataBuildModel_container')||false
            }}
            bodyStyle={{overflow:'visible'}}
            footer={ !isCatLinkDataSource &&[   
                        <Button onClick={onCancel.bind(this)}>
                            取消
                        </Button>,
                        // <Button onClick={onTestLink}>
                        //     测试链接
                        // </Button>,
                        <Button type="primary" htmlType="submit" onClick={()=>{form.submit()}}>
                            保存
                        </Button>
            ]}
        >
            <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange} className={styles.form_wrap}>
                <Row gutter={0}>
                    <Col span={12}>
                        <Form.Item
                            {...layouts}
                            label="数据源名称"
                            name="dsName"
                            rules={[
                                { required: true,message:'请输入数据源名称' },
                                { max: 50,message:'最多输入50个字符'}
                            ]}
                        >
                            <Input disabled={isCatLinkDataSource} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...layouts}
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
                            <Input disabled={isCatLinkDataSource||isAddLinkDataSource != 'add'} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={0}>
                    <Col span={12}>
                        <Form.Item
                            {...layouts}
                            label="数据库类型"
                            name="dsType"
                            rules={[
                                { required: true,message:'请选择数据库类型' },
                            ]}
                        >
                            <Select onChange={onChangeType} disabled={isCatLinkDataSource||isAddLinkDataSource != 'add'}>
                                <Select.Option value='MYSQL'>MYSQL</Select.Option>
                                <Select.Option value='KINGBASE'>人大金仓</Select.Option>

                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...layouts}
                            label="数据库连接"
                            name="url"
                            rules={[
                                { required: true,message:'请输入数据库连接' },
                            ]}
                        >
                            <Input disabled={isCatLinkDataSource} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={0}>
                    <Col span={12}>
                        <Form.Item
                            {...layouts}
                            label="用户"
                            name="username"
                            rules={[
                                { required: true,message:'请输入用户名' },
                                { max: 50,message:'最多输入50个字符'}
                            ]}
                        >
                            <Input disabled={isCatLinkDataSource} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...layouts}
                            label="密码"
                            name="password"
                            rules={[
                                { required: true,message:'请输入密码' },
                                { max: 50,message:'最多输入50个字符'}
                            ]}
                        >
                            <Input type="password" disabled={isCatLinkDataSource} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={0}>
                    <Col span={24}>
                        <Form.Item
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20}}
                            label="查询语句"
                            name="validatuibQuery"
                            rules={[
                                { required: true,message:'请输入查询语句' },
                                { max: 50,message:'最多输入50个字符'}
                            ]}
                        >
                            <Input.TextArea disabled={isCatLinkDataSource} />
                        </Form.Item>
                    </Col>
                </Row>
                {
                    !isCatLinkDataSource &&
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item
                                {...layouts}
                                label="是否启用"
                                name="isEnable"
                            >
                                <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={isEnableFn} checked={isEnable} />
                            </Form.Item>
                        </Col>
                    </Row>
                }
            </Form>
        </GlobalModal>
    )
}
export default connect(({ useDataBuildModel, layoutG }) => ({
    useDataBuildModel,
    layoutG,
}))(AddLinkDataSource);
