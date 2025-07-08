import { connect } from 'dva';
import { Table, Space } from 'antd';
import { dataFormat,getDiskFileType } from '../../../../util/util';
import IPagination from '../../../../componments/public/iPagination';
import ColumnDragTable from '../../../../componments/columnDragTable';

function TrashList({ dispatch, signDisk }) {
  const {
    trashList,
    trashReturnCount,
    trashLimit,
    trashCurrent,
    trashName,
    selectedKeysValue,
    trashStart,
  } = signDisk;
  const del = (text) => {
    dispatch({
      type: 'signDisk/delDelete_SignDisk',
      payload: {
        ids: text.id,
        delete: 'W',
      },
      callback: () => {
        dispatch({
          type: 'signDisk/getPagingOrBinList_SignDisk_Listist_Trash',
          payload: {
            start: trashStart,
            limit: trashLimit,
            id: selectedKeysValue,
            name: trashName,
            delete: 'N',
            type: 'L',
          },
        });
      },
    });
  };

  const back = (text) => {
    dispatch({
      type: 'signDisk/putRecover',
      payload: {
        ids: text.id,
      },
      callback: () => {
        dispatch({
          type: 'signDisk/getPagingOrBinList_SignDisk_Listist_Trash',
          payload: {
            start: trashStart,
            limit: trashLimit,
            id: selectedKeysValue,
            name: trashName,
            delete: 'N',
            type: 'L',
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
        return <div title={text}>{getDiskFileType(record)} {record.cloudDiskName}</div>
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
      title: '删除时间',
      dataIndex: 'delTime',
      key: 'delTime',
      render: (text) => <div>{dataFormat(text, 'YYYY-MM-DD HH:mm:ss')}</div>,
    },
    {
      title: '操作',
      key: 'action',
      render: (text) => (
        <Space size="middle">
          <a onClick={back.bind(this, text)}>恢复</a>
          <a onClick={del.bind(this, text)}>删除</a>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    onChange: (rowKeys, rows) => {
      let fileId = [];
      let ids = [];
      rows.map((item) => {
        fileId.push(item.fileId);
        ids.push(item.id);
      });
      dispatch({
        type: 'signDisk/updateStates',
        payload: {
          trashRowSelectionKey: rowKeys,
          trashRowSelection: rows,
          trashFileId: fileId,
          ids: ids,
        },
      });
    },
  };

  const trashChange = (page, pageSize) => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        trashStart: page,
        trashLimit: pageSize,
      },
    });
  };

  return (
    <>
      <ColumnDragTable
        rowKey="id"
        columns={columns}
        dataSource={trashList}
        rowSelection={{ ...rowSelection }}
        pagination={false}
        style={{ marginTop: '8px' }}
        scroll={{ y: 'calc(100vh - 320px)' }}
      />
      <IPagination
        current={trashStart}
        total={Number(trashReturnCount)}
        onChange={trashChange}
        pageSize={trashLimit}
        showSizeChanger
        showQuickJumper
        isRefresh={true}
        refreshDataFn={()=>{
          dispatch({
            type: 'signDisk/updateStates',
            payload: {
              trashStart: 1,
            },
          });
          dispatch({
            type: 'signDisk/getPagingOrBinList_SignDisk_Listist_Trash',
            payload: {
              start: 1,
              limit: trashLimit,
              id: selectedKeysValue,
              name: trashName,
              delete: 'N',
              type: 'L'
            }
          })
        }}
      />
    </>
  );
}

export default connect(({ signDisk }) => ({
  signDisk,
}))(TrashList);
