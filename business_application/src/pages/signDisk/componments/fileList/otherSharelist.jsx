import { connect } from 'dva';
import { Table, Space, message } from 'antd';
import { CHUNK_SIZE } from '../../../../service/constant';
import IPagination from '../../../../componments/public/iPagination';
import ColumnDragTable from '../../../../componments/columnDragTable';
import { dataFormat,getDiskFileType } from '../../../../util/util';
function List({ dispatch, signDisk }) {
  const {
    otherShareStart,
    otherShareLimit,
    otherShareList,
    otherShareReturnCount,
    otherShareName,
    otherSharecurrentPage,
  } = signDisk;
  function getContentLength(url) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', url);
      xhr.onload = function () {
        resolve(xhr.getResponseHeader('content-length') || 0);
      };
      xhr.send();
    });
  }

  let fileData = [];
  function partDownload(
    downName,
    url,
    start,
    end,
    contentLength,
    partLength = CHUNK_SIZE,
  ) {
    let xhr = new XMLHttpRequest();
    let getDate = new Date().toUTCString();
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    xhr.setRequestHeader('Range', `bytes=${start}-${end}`);
    xhr.setRequestHeader('If-Range', `${getDate}`);
    xhr.onload = function () {
      if (xhr.status === 206 && start + CHUNK_SIZE < contentLength) {
        let endLength = end + partLength;
        if (endLength > contentLength) {
          endLength = contentLength;
        }
        fileData.push(new Blob([xhr.response]));
        partDownload(downName, url, end + 1, endLength, contentLength);
      } else {
        fileData.push(new Blob([xhr.response]));
        const blob = new Blob(fileData, {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = downName;
        link.click();
        window.URL.revokeObjectURL(link.href);
        message.success('下载成功!');
      }
    };
    xhr.onerror = function () {
      message.error('下载失败！');
    };
    xhr.send();
  }

  const downloadFile = (text) => {
    if (text.cloudDiskType != '文件夹') {
      dispatch({
        type: 'signDisk/getFileLengthURL',
        payload: {
          id: text.cloudDiskId,
        },
        callback: (url) => {
          dispatch({
            type: 'signDisk/putDownLoad_SignDisk',
            payload: {
              id: text.cloudDiskId,
              menuPosition: 'MINE',
            },
            callback: (downUrl, downName) => {
              getContentLength(url).then((length) => {
                partDownload(downName, downUrl, 0, CHUNK_SIZE, length);
              });
            },
          });
        },
      });
    } else {
      message.warning('暂不支持下载文件夹！');
    }
  };

  const copyFile = (text) => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        signMoveVisible: true,
        moveOrCopyCode: 'copy',
        id: text.cloudDiskId,
        rowSelection: [text],
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
      width: 80
    },
    {
      title: '大小',
      dataIndex: 'cloudDiskSize',
      key: 'cloudDiskSize',
      width: 90,
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
      width: 80,
    },
    {
      title: '分享者',
      dataIndex: 'createUserName',
      key: 'createUserName',
    },
    {
      title: '分享时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => dataFormat(text, 'YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (text) => (
        <Space size="middle">
          <a onClick={downloadFile.bind(this, text)}>下载</a>
          <a onClick={copyFile.bind(this, text)}>复制</a>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    onChange: (rowKeys, rows) => {
      console.log(rowKeys, 'rowkeys====');
      console.log(rows, 'rows===');
      let fileId = [];
      let ids = [];
      rows.map((item) => {
        fileId.push(item.fileId);
        ids.push(item.cloudDiskId);
      });
      dispatch({
        type: 'signDisk/updateStates',
        payload: {
          otherShareRowSelectionKey: rowKeys,
          otherShareRowSelection: rows,
          otherShareFileId: fileId,
          ids: ids,
        },
      });
    },
  };

  const otherShareChange = (page, pageSize) => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        otherShareStart: page,
        otherShareLimit: pageSize,
      },
    });
  };

  return (
    <>
      <ColumnDragTable
        rowKey={(record, index) => `${record.cloudDiskId}${index}`}
        columns={columns}
        dataSource={otherShareList}
        rowSelection={{ ...rowSelection }}
        pagination={false}
        style={{ marginTop: '8px' }}
        scroll={{ y: 'calc(100vh - 320px)' }}
      />
      <IPagination
        current={Number(otherShareStart)}
        total={Number(otherShareReturnCount)}
        onChange={otherShareChange}
        pageSize={otherShareLimit}
        showSizeChanger
        showQuickJumper
        isRefresh={true}
        refreshDataFn=  {()=>{
          dispatch({
            type: 'signDisk/updateStates',
            payload: {
              otherShareStart:1
            }
          })
          dispatch({
            type: 'signDisk/getOtherShareList_SignDisk',
            payload: {
              start: 1,
              limit: otherShareLimit,
              name: otherShareName
            },
          })
        }}
      />
    </>
  );
}

export default connect(({ signDisk }) => ({
  signDisk,
}))(List);
