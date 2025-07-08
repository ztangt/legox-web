import { Button, DatePicker, Form, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { useState } from 'react';
import GlobalModal from '../../../../components/GlobalModal';
import IUpload from '../../../../components/Upload/uploadModal';
import { timeStampFormat } from '../../../../util/util';

const PublishModal = ({ onCancel, onConfirm, getRefs, callback, executionDynamics }) => {
    const { fileName } = executionDynamics;
    const [form] = Form.useForm();
    const [filePath, setFilePath] = useState('');
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    // 成功
    const uploadSuccess = (value) => {
        setFilePath(value);
    };
    // finish完成
    const onFinish = (value) => {
        const obj = {
            ...value,
            filePath: filePath || '',
        };
        callback && callback(obj);
    };

    return (
        <GlobalModal
            title="导入"
            open={true}
            centered
            onCancel={onCancel}
            onOk={onConfirm}
            maskClosable={false}
            mask={false}
            modalSize="small"
            getContainer={() => {
                return (
                    document.getElementById(
                        'dom_container-panel-/business_cma/executionDynamics/executiveNotification',
                    ) || false
                );
            }}
        >
            <Form
                {...layout}
                form={form}
                ref={getRefs}
                initialValues={{
                    dataStatus: 1,
                    dataDate: moment(timeStampFormat(new Date().getTime()), 'YYYY-MM-DD'),
                    temporary: 2,
                }}
                onFinish={onFinish}
            >
                <Form.Item name="dataDate" style={{ marginTop: 8 }} label="数据日期">
                    <DatePicker />
                </Form.Item>
                <Form.Item name="temporary" label="是否临时指标">
                    <Select
                        style={{
                            width: 120,
                        }}
                        options={[
                            {
                                value: 1,
                                label: '是',
                            },
                            {
                                value: 2,
                                label: '否',
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item name="dataStatus" label="数据状态">
                    <Select
                        style={{
                            width: 120,
                        }}
                        options={[
                            {
                                value: 1,
                                label: '正式',
                            },
                            {
                                value: 0,
                                label: '非正式',
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item label="附件上传">
                    <IUpload
                        nameSpace="executionDynamics"
                        mustFileType="xlsx,xls"
                        requireFileSize={10}
                        uploadSuccess={uploadSuccess.bind(this)}
                        buttonContent={<Button>选择文件</Button>}
                        filePath={`executionDynamics/${new Date().getTime()}`}
                    />{' '}
                    <div>{fileName}</div>
                </Form.Item>
            </Form>
        </GlobalModal>
    );
};

export default connect(({ executionDynamics }) => ({ executionDynamics }))(PublishModal);
