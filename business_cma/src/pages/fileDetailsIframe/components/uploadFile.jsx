import { Button, Modal, Form, Input, Select, message } from 'antd';
import { connect } from 'umi';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import IUpload from '../../../components/Upload/uploadModal';
import React, { useEffect, useState } from 'react';
import styles from './upload.less';

function Upload({ dispatch, fileDetailsIframe, projectId, logicCode, flag }) {
    const [form] = Form.useForm();
    const { modulesList, fileName, fileSize, needfilepath, getFileMD5Message, typeNames, fileStorageId } =
        fileDetailsIframe;
    const [uploadUrl, setUploadUrl] = useState('');
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    console.log(projectId, 'projectId');
    useEffect(() => {
        dispatch({
            type: 'fileDetailsIframe/getBaseDataCodeTable',
            payload: {
                dictTypeId: 'IPMT_PROJECT_STAGE',
                showType: 'ALL',
                isTree: 1,
                searchWord: '',
            },
        });
    }, []);
    const onCancel = () => {
        dispatch({
            type: 'fileDetailsIframe/updateStates',
            payload: {
                isShowModal: false,
            },
        });
    };
    const fileList = (fileName) => {
        return (
            <div className={styles.fileList}>
                <div>{fileName}</div>
                <div className={styles.deleIcon} onClick={onDeleteFile}>
                    <DeleteOutlined />
                </div>
            </div>
        );
    };
    const onDeleteFile = () => {
        dispatch({
            type: 'fileDetailsIframe/updateStates',
            payload: {
                fileName: '',
            },
        });
    };

    const uploadSuccess = (val, res, file, url, newUrl) => {
        setUploadUrl(newUrl);
    };
    const onFinish = (values) => {
        if (!fileName) {
            message.error('请上传文件');
            return;
        }
        const filesReqDTO = {};
        if (getFileMD5Message.have == 'Y') {
            filesReqDTO.fileId = getFileMD5Message.fileId;
            filesReqDTO.fileName = fileName;
            filesReqDTO.fileType = typeNames;
            filesReqDTO.filePath = getFileMD5Message.filePath;
            filesReqDTO.fileSize = fileSize;
            filesReqDTO.fileUrl = getFileMD5Message.fileFullPath;
            filesReqDTO.moduleType = values.moduleType;
            filesReqDTO.mainTableId = projectId;
            filesReqDTO.profileType = values.profileType;
            filesReqDTO.logicCode = 'ALL_PROJECT';
        } else {
            filesReqDTO.fileId = fileStorageId;
            filesReqDTO.fileName = fileName;
            filesReqDTO.fileType = typeNames;
            filesReqDTO.filePath = needfilepath;
            filesReqDTO.fileSize = fileSize;
            filesReqDTO.fileUrl = uploadUrl;
            filesReqDTO.moduleType = values.moduleType;
            filesReqDTO.mainTableId = projectId;
            filesReqDTO.profileType = values.profileType;
            filesReqDTO.logicCode = 'ALL_PROJECT';
        }
        console.log(filesReqDTO, 'filesReqDTO');
        dispatch({
            type: 'fileDetailsIframe/saveArchivesFile',
            payload: {
                filesReqDTO: JSON.stringify(filesReqDTO),
            },
            callback: () => {
                onCancel();
                dispatch({
                    type: 'fileDetailsIframe/getAllProfileInfoList',
                    payload: {
                        logicCode: logicCode,
                        projectId: projectId,
                        flag: flag,
                    },
                });
            },
        });
    };
    return (
        <Modal
            width={400}
            visible={true}
            title="信息"
            onCancel={onCancel}
            onOk={() => {
                form.submit();
            }}
            bodyStyle={{ height: '200px' }}
            mask={false}
            maskClosable={false}
            getContainer={() => {
                return document.getElementById('fileDetailsIframe');
            }}
            className={styles.upload_modal}
        >
            <Form form={form} onFinish={onFinish}>
                <Form.Item label="文件类型" name="profileType" rules={[{ required: true }]} {...layout}>
                    <Input />
                </Form.Item>
                <Form.Item label="模块选择" name="moduleType" rules={[{ required: true }]} {...layout}>
                    <Select>
                        {modulesList &&
                            modulesList.map((item, index) => {
                                return (
                                    <Select.Option value={item.dictInfoCode} key={item.dictInfoCode}>
                                        {item.dictInfoName}
                                    </Select.Option>
                                );
                            })}
                    </Select>
                </Form.Item>
                <Form.Item label="附件上传" name="fileId" {...layout}>
                    {fileName ? (
                        fileList(fileName)
                    ) : (
                        <IUpload
                            nameSpace="fileDetailsIframe"
                            requireFileSize={1024}
                            uploadSuccess={uploadSuccess}
                            buttonContent={<Button icon={<UploadOutlined />}>选择文件</Button>}
                        />
                    )}
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default connect(({ fileDetailsIframe }) => ({ fileDetailsIframe }))(Upload);
