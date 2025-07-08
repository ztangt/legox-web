/**
 * @author zhengcl
 * @description 导入列表
 */
import { connect } from 'dva';
import styles from './importList.less';
import { useState, useEffect } from 'react';
import { Table, Button, Space, Descriptions, message} from 'antd';
import { dataFormat } from '../../../util/util';
import IPagination from '../../../componments/public/iPagination';
import GlobalModal from '../../../componments/GlobalModal';
import copy from "copy-to-clipboard";

function ImportList({ dispatch, importList }) {
  const [modalData, setModalData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { start, limit, currentPage, returnCount, list } = importList;
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
      type: 'importList/getImportList',
      payload: {
        start,
        limit,
      },
    });
  }
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
        ellipsis: true,
        width: 200,
      },
      {
        title: '导入服务类型',
        dataIndex: 'serviceType',
        align: 'center',
        ellipsis: true,
        width: 200,
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
        title: '错误消息',
        dataIndex: 'errorMsg',
        align: 'center',
        ellipsis: true,
        width: 200,
      },
      {
        title: '操作',
        dataIndex: 'code1',
        align: 'center',
        width: 100,
        render: (text, record) => (
          <Space>
            {record.fileStatus == 2 ? (
              <a
                onClick={()=>{copyMsg(record.errorMsg)}}
              >
                复制错误信息
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
  const copyMsg = value => {
    console.log(value,'value');
    if (value&&copy(value)) {
      message.success("复制成功");
    } else{
      message.error('暂无数据')
    }
  };
  const changePage = (nextPage, size) => {
    console.log(nextPage, size);
    dispatch({
      type: 'importList/updateStates',
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
    <div className={styles.container} id="importList_id">
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
export default connect(({ importList }) => ({
  importList,
}))(ImportList);
