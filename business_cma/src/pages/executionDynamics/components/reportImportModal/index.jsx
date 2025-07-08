import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Form } from 'antd';
import GlobalModal from '../../../../components/GlobalModal';
import IUpload from '../../../../components/Upload/uploadModal';

const ImportReportModal = ({ dispatch, handelCancel, handelConfirm, uploadSuccessFn }) => {
    //上传成功后的回调
    const uploadSuccess = (filePath, fileId, file, fileFullPath) => {
        console.log('aaaaaaa', filePath, file, fileFullPath);
        uploadSuccessFn(filePath, fileFullPath);
    };

    return (
        <GlobalModal
            title="导入"
            open={true}
            onCancel={handelCancel}
            maskClosable={false}
            mask={false}
            centered
            modalSize="small"
            getContainer={() => {
                return document.getElementById('dom_container_cma');
            }}
            onOk={handelConfirm}
        >
            <div className="_padding_top_8">
                <Form>
                    <Form.Item label="文件名称">
                        <IUpload
                            nameSpace="executionDynamics"
                            mustFileType="doc,docx"
                            requireFileSize={5}
                            uploadSuccess={uploadSuccess.bind(this)}
                            buttonContent={<Button>选择文件</Button>}
                            filePath={`executionDynamics/${new Date().getTime()}`}
                        />
                    </Form.Item>
                </Form>
            </div>
        </GlobalModal>
    );
};

export default ImportReportModal;
