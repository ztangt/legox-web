/**
 * @author zww
 * @description 导出列表
 */
import { connect } from 'dva';
import styles from './exportList.less';
import { useState, useEffect } from 'react';
import { Table, Button, Space, Descriptions } from 'antd';
import { dataFormat } from '../../../util/util';
import IPagination from '../../../componments/public/iPagination';
import GlobalModal from '../../../componments/GlobalModal';

function ExportList({ dispatch, exportList }) {
  const [modalData, setModalData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { start, limit, currentPage, returnCount, list } = exportList;
  // 0：处理中1：成功
  const STATUS = {
    0: '处理中',
    1: '成功',
    2: '失败',
  };

  useEffect(() => {
    getList(start, limit);
  }, []);

  const onRefresh = () => {
    getList(start, limit);
  };

  function getList(start, limit) {
    dispatch({
      type: 'exportList/getExportList',
      payload: {
        start,
        limit,
      },
    });
  }
  const onDownload = (record) => {
    window.open(record.filePath);
  };

  const tableProps = {
    rowKey: 'fileId',
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: 50,
        render: (text, obj, index) => <div>{index + 1}</div>,
      },
      {
        title: '文件名',
        dataIndex: 'fileName',
        align: 'center',
        width: 300,
      },
      {
        title: '类型',
        dataIndex: 'fileTypeName',
        align: 'center',
        render: (text, obj, index) => <div>execl</div>,
      },
      {
        title: '状态',
        dataIndex: 'fileStatus',
        align: 'center',
        render: (text) => (
          <div style={{ color: text == 2 && 'red' }}>{STATUS[text]}</div>
        ),
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        render: (text) => {
          return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '操作',
        dataIndex: 'code1',
        align: 'center',
        width: 100,
        render: (text, record) => (
          <Space>
            {record.fileStatus == 1 ? (
              <a
                onClick={(e) => {
                  onDownload(record);
                }}
              >
                下载
              </a>
            ) : record.fileStatus == 2 ? (
              <a
                onClick={(e) => {
                  setModalData(record);
                  setIsModalVisible(true);
                }}
              >
                详细信息
              </a>
            ) : (
              '---'
            )}
          </Space>
        ),
      },
    ],
    dataSource: list,
    pagination: false,
  };

  const changePage = (nextPage, size) => {
    console.log(nextPage, size);
    dispatch({
      type: 'exportList/updateStates',
      payload: {
        start: nextPage,
        limit: size,
      },
    });
    getList(nextPage, size);
  };

  const handleCancel = () => {
    setModalData([]);
    setIsModalVisible(false);
  };

  return (
    <div className={styles.container} id="exportList_id">
      <div className={styles.control_wrapper}>
        <Button
          type="primary"
          onClick={() => {
            onRefresh();
          }}
        >
          刷新
        </Button>
      </div>
      <div className={styles.table_wrapper}>
        <Table
          {...tableProps}
          pagination={false}
          bordered
          scroll={{ y: 'calc(100vh - 335px)' }}
        />
        <IPagination
          style={{ bottom: 40 }}
          current={Number(currentPage)}
          pageSize={limit}
          onChange={changePage.bind(this)}
          total={returnCount}
          isRefresh={false}
        />
      </div>
      <GlobalModal
        title="详细信息"
        visible={isModalVisible}
        onCancel={handleCancel}
        mask={false}
        widthType={4}
        maskClosable={false}
        getContainer={() => {
          return document.getElementById('dom_container') || false;
        }}
        footer={[
          <Button key="back" onClick={handleCancel}>
            关闭
          </Button>,
        ]}
      >
        <Descriptions
          title=""
          column={1}
          labelStyle={{
            justifyContent: 'flex-end',
            minWidth: 80,
            color: 'red',
          }}
        >
          <Descriptions.Item label="错误码">
            {modalData.errorCode || ''}
          </Descriptions.Item>
          <Descriptions.Item label="错误信息">
            {modalData.errorMsg}
          </Descriptions.Item>
        </Descriptions>
      </GlobalModal>
    </div>
  );
}
export default connect(({ exportList }) => ({
  exportList,
}))(ExportList);
