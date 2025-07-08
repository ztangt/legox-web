import { connect } from 'dva';
import { message, Table, Space, Button, Modal, Input } from 'antd';
import { useEffect } from 'react';
import { ShareAltOutlined } from '@ant-design/icons';
import styles from './mySharelist.less';
import { dataFormat } from '../../../../util/util';
import IPagination from '../../../../componments/public/iPagination';
import GlobalModal from '../../../../componments/GlobalModal';
import ColumnDragTable from '../../../../componments/columnDragTable';
import {getDiskFileType} from '../../../../util/util'

function MyShareList({ dispatch, signDisk }) {
  const {
    id,
    ids,
    myShareList,
    myShareReturnCount,
    myShareLimit,
    myShareDetailName,
    myShareDetailStart,
    myShareDetailLimit,
    myShareDetailVisible,
    myShareDetailList,
    myShareDetailReturnCount,
    myShareDetailCurrentPage,
    mySharecurrentPage,
    myShareDetailRowSelection,
    myShareStart,
    myShareName,
  } = signDisk;

  useEffect(() => {
    if (myShareDetailVisible) {
      dispatch({
        type: 'signDisk/getMyShareDetail',
        payload: {
          id: id,
          name: myShareDetailName,
          start: myShareDetailStart,
          limit: myShareDetailLimit,
        },
        callback: () => {},
      });
    }
  }, [myShareDetailStart, myShareDetailLimit, myShareDetailName]);

  const share = (text, record) => {
    dispatch({
      type: 'signDisk/getMyShareDetail',
      payload: {
        id: text.cloudDiskId,
        name: myShareDetailName,
        start: myShareDetailStart,
        limit: myShareDetailLimit,
      },
      callback: () => {
        dispatch({
          type: 'signDisk/updateStates',
          payload: {
            myShareDetailVisible: true,
            id: text.cloudDiskId,
          },
        });
      },
    });
  };

  const onCancel = () => {
    dispatch({
      type: 'signDisk/getMyShareList_SignDisk',
      payload: {
        start: myShareStart,
        limit: myShareLimit,
        name: myShareName,
      },
      callback: () => {
        dispatch({
          type: 'signDisk/updateStates',
          payload: {
            myShareDetailVisible: false,
            myShareDetailName: '',
          },
        });
      },
    });
  };

  const onSearch = (value) => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        myShareDetailName: value,
      },
    });
  };

  const cancelShare = () => {
    if (myShareDetailRowSelection != 0) {
      dispatch({
        type: 'signDisk/delShare_SignDisk',
        payload: {
          ids: ids.join(','),
        },
        callback: () => {
          dispatch({
            type: 'signDisk/getMyShareDetail',
            payload: {
              id: id,
              name: myShareDetailName,
              start: myShareDetailStart,
              limit: myShareDetailLimit,
            },
          });
        },
      });
    } else {
      message.warning('还没有选择条目');
    }
  };

  const cancelShare_only = (text) => {
    dispatch({
      type: 'signDisk/delShare_SignDisk',
      payload: {
        ids: text.id,
      },
      callback: () => {
        dispatch({
          type: 'signDisk/getMyShareDetail',
          payload: {
            id: id,
            name: myShareDetailName,
            start: myShareDetailStart,
            limit: myShareDetailLimit,
          },
        });
      },
    });
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'cloudDiskName',
      key: 'cloudDiskName',
      ellipsis: true,
      render(text,record){
        return <div title={text} className={styles.disk_name}>{getDiskFileType(record)} {record.cloudDiskName}</div>
      }
    },
    {
      title: '类型',
      dataIndex: 'cloudDiskType',
      key: 'cloudDiskType',
    },
    {
      title: '大小',
      dataIndex: 'cloudDiskSize',
      key: 'cloudDiskSize',
      render: (text, record) => {
        if (record.cloudDiskType != '文件夹') {
          return <div>{`${(text / 1024).toFixed(2)}KB`}</div>;
        } else {
          return <div></div>;
        }
      },
    },
    {
      title: '下载次数',
      dataIndex: 'downs',
      key: 'downs',
    },
    {
      title: '分享详情',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <ShareAltOutlined
            className={styles.share}
            onClick={share.bind(this, text, record)}
          />
        </Space>
      ),
    },
  ];

  const columnss = [
    {
      title: '分享者',
      dataIndex: 'createUserName',
      key: 'createUserName',
    },
    {
      title: '分享对象',
      dataIndex: 'downUserName',
      key: 'downUserName',
    },
    {
      title: '分享时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => <div>{dataFormat(text, 'YYYY-MM-DD HH:mm:ss')}</div>,
    },
    {
      title: '操作',
      key: 'action',
      render: (text) => (
        <Space size="middle">
          <a onClick={cancelShare_only.bind(this, text)}>取消分享</a>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    onChange: (rowKeys, rows) => {
      let ids = [];
      rows.map((item) => {
        ids.push(item.cloudDiskId);
      });
      dispatch({
        type: 'signDisk/updateStates',
        payload: {
          myShareRowSelectionKey: rowKeys,
          myShareRowSelection: rows,
          ids: ids,
        },
      });
    },
  };

  const rowSelections = {
    onChange: (rowKeys, rows) => {
      let ids = [];
      rows.map((item) => {
        ids.push(item.id);
      });
      dispatch({
        type: 'signDisk/updateStates',
        payload: {
          myShareDetailRowSelectionKey: rowKeys,
          myShareDetailRowSelection: rows,
          ids: ids,
        },
      });
    },
  };

  const myShareChange = (page, pageSize) => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        myShareStart: page,
        myShareLimit: pageSize,
      },
    });
  };

  const myShareDetailChange = (page, pageSize) => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        myShareDetailStart: page,
        myShareDetailLimit: pageSize,
      },
    });
  };
  console.log(myShareDetailList, 'myShareDetailList====');
  return (
    <>
      <ColumnDragTable
        rowKey="cloudDiskId"
        columns={columns}
        dataSource={myShareList}
        rowSelection={{ ...rowSelection }}
        pagination={false}
        style={{ marginTop: '8px' }}
        scroll={{ y: 'calc(100vh - 320px)' }}
      />
      <IPagination
        current={myShareStart}
        total={Number(myShareReturnCount)}
        onChange={myShareChange}
        pageSize={myShareLimit}
        showSizeChanger
        showQuickJumper
        isRefresh={true}
        refreshDataFn=  {()=>{
          dispatch({
            type: 'signDisk/updateStates',
            payload: {
              myShareDetailStart:1
            }
          })
          dispatch({
            type: 'signDisk/getMyShareList_SignDisk',
            payload: {
              start: 1,
              limit: myShareLimit,
              name: myShareName
            }
          })
        }}
      />
      <GlobalModal
        widthType={2}
        visible={myShareDetailVisible}
        closable={false}
        footer={[
          <Button onClick={onCancel} className={styles.button_width} type="primary">
            关闭
          </Button>,
        ]}
        title="分享详情"
        mask={false}
        getContainer={() => {
          return document.getElementById('container_signDisk')||false;
        }}
      >
        <div className={styles.warp}>
          <div className={styles.top}>
            <div className={styles.Tleft}>
              <Input.Search
                placeholder="请输入分享对象"
                allowClear
                size="middle"
                onSearch={onSearch}
                style={{ width: '226px',height:'32px', color: 'white' }}
              />
            </div>
            <div className={styles.Tright}>
              <Button type="primary" onClick={cancelShare}>
                取消分享
              </Button>
            </div>
          </div>
          <div className={styles.down}>
            <ColumnDragTable
              rowKey="id"
              columns={columnss}
              dataSource={myShareDetailList}
              rowSelection={{ ...rowSelections }}
              pagination={false}
              style={{ marginTop: '8px' }}
              scroll={{ y: 'calc(100vh - 520px)' }}
            />
          </div>
          <div className={styles.page}>
            <IPagination
              current={myShareDetailCurrentPage}
              total={myShareDetailReturnCount}
              onChange={myShareDetailChange}
              pageSize={myShareDetailLimit}
            />
          </div>
        </div>
      </GlobalModal>
    </>
  );
}

export default connect(({ signDisk }) => ({
  signDisk,
}))(MyShareList);
