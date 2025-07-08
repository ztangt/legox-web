import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { connect, history } from 'umi';
import Table from '../../../componments/columnDragTable';
import GlobalModal from '../../../componments/GlobalModal';
import IUpload from '../../../componments/Upload/uploadModal';
import styles from './modalFileMoudle.less';
import { CloseOutlined } from '@ant-design/icons';

const Index = ({
  query,
  dispatch,
  fileMoudleList,
  setParentState,
  downloadFiles,
  bizFromInfo,
  procDefId,
}) => {
  const { bizSolId } = query;

  // ======================== Upload Success Handler ========================
  const uploadSuccess = (fileStorageId, obj) => {
    dispatch({
      type: 'applyModelConfig/saveAttachmentTemplate',
      payload: {
        bizSolId,
        formDeployId: bizFromInfo.formDeployId,
        procDefId,
        formCode: obj.formCode,
        columnName: obj.columnName,
        columnCode: obj.columnCode,
        fileStorageId,
      },
      callback: (data) => {
        geFileList();
      },
    });
  };

  // ======================== Delete Handler ========================
  const onDelete = (id) => {
    Modal.confirm({
      title: '确认删除此附件?',
      content: '',
      okText: '删除',
      cancelText: '取消',
      mask: false,
      getContainer: () =>
        document.getElementById(`code_modal_${bizSolId}`) || false,
      onOk: async () => {
        dispatch({
          type: 'applyModelConfig/deleteAttachmentTemplate',
          payload: { id },
          callback: (res) => {
            geFileList();
          },
        });
      },
    });
  };

  // ======================== Data Fetching ========================
  const geFileList = () => {
    dispatch({
      type: 'applyModelConfig/getAttachmentTemplate',
      payload: {
        bizSolId,
        formDeployId: bizFromInfo.formDeployId,
        procDefId,
      },
      callback: (data) => {
        setParentState({
          fileMoudleList: data?.data,
        });
      },
    });
  };

  useEffect(() => {
    geFileList();
  }, []);

  // ======================== UI Handlers ========================
  const handelCancle = () => {
    setParentState({
      isShowFileMoudle: false,
    });
  };

  // ======================== Table Columns ========================
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: '字段名称',
      dataIndex: 'columnName',
      key: 'columnName',
    },
    {
      title: '字段编码',
      dataIndex: 'columnCode',
      key: 'columnCode',
    },
    {
      title: '模版附件',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (_, obj) => {
        const arr = obj?.fileList || [];
        if (arr.length > 0) {
          return arr.map((item, index) => (
            <li key={index} className={styles.file_name}>
              <a
                onClick={item.downloadPath && downloadFiles.bind(null, item.downloadPath, item.fileName)}
                className={styles.title}
              >
                {item.fileName}
              </a>
              <CloseOutlined
                className={styles.delete}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              />
            </li>
          ));
        }
        return null;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, obj) => (
        <IUpload
          nameSpace="applyModelConfig"
          requireFileSize={50}
          uploadSuccess={(filePath, fileUrl, fileId) => uploadSuccess(fileId, obj)}
          buttonContent={<a className={styles.operation_a}>上传</a>}
        />
      ),
    },
  ];

  // ======================== Render ========================
  return (
    <GlobalModal
      visible={true}
      title="附件模版上传"
      onCancel={handelCancle}
      widthType={3}
      centered
      maskClosable={false}
      mask={false}
      getContainer={() =>
        document.getElementById(`code_modal_${bizSolId}`) || false
      }
      bodyStyle={{ padding: '0px' }}
      footer={[
        <Button key="cancel" onClick={handelCancle}>
          取消
        </Button>,
        <Button type="primary" key="submit" onClick={handelCancle}>
          确定
        </Button>,
      ]}
    >
      <Table
        dataSource={fileMoudleList}
        columns={columns}
        rowKey={"columnId"}
        scroll={{ y: 'calc(100% - 40px)' }}
        pagination={false}
        taskType="MONITOR"
      />
    </GlobalModal>
  );
};

export default connect(({ layoutG, applyModelConfig }) => ({ layoutG, applyModelConfig }))(Index);