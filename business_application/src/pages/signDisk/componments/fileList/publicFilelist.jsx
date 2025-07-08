import { connect } from 'dva';
import { Table, Space, message, Button, Modal } from 'antd';
import { useEffect } from 'react';
import { dataFormat } from '../../../../util/util';
import { CHUNK_SIZE } from '../../../../service/constant';
import {
  EyeOutlined,
  DownloadOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import styles from './meFilelist.less';
import IPagination from '../../../../componments/public/iPagination';
import GlobalModal from '../../../../componments/GlobalModal';
import ColumnDragTable from '../../../../componments/columnDragTable';
import { getDiskFileType } from '../../../../util/util';
function List({ dispatch, signDisk }) {
  const {
    id,
    publicList,
    publicStart,
    publicLimit,
    pbulicDetail,
    publicDetailStart,
    publicDetailLimit,
    publicControlflag,
    publicDetailMSG,
    publicDetailList,
    publicDetailreturnCount,
    publicDetailCurrentPage,
    publicReturnCounts,
    publicCurrentPage,
    selectedKeysValue,
    publicSearch,
    selectTreeUrl,
    controlFlag,
  } = signDisk;

  useEffect(() => {
    if (publicControlflag) {
      dispatch({
        type: 'signDisk/getDetailPagingMessage_CommonDisk',
        payload: {
          id: id,
          start: publicStart,
          limit: publicLimit,
        },
        callback: () => {},
      });
    }
  }, [publicStart, publicLimit]);

  useEffect(() => {
    dispatch({
      type: 'signDisk/getDetailPagingMessage_CommonDisk',
      payload: {
        id: id,
        start: publicDetailStart,
        limit: publicDetailLimit,
      },
    });
  }, [publicDetailStart, publicDetailLimit]);

  const detail = (e, text, record) => {
    dispatch({
      type: 'signDisk/getDetailPublicMessage_CommonDisk',
      payload: {
        id: text.id,
      },
      callback: (see, download) => {
        dispatch({
          type: 'signDisk/getDetailPagingMessage_CommonDisk',
          payload: {
            id: text.id,
            start: publicDetailStart,
            limit: publicDetailLimit,
          },
          callback: () => {
            if (see == 1) {
              dispatch({
                type: 'signDisk/updateStates',
                payload: {
                  id: text.id,
                  pbulicDetail: true,
                  publicControlflag: true,
                },
              });
            } else {
              message.error('没有权限');
            }
          },
        });
      },
    });
  };

  const closed = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        pbulicDetail: false,
      },
    });
  };

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

  const downloadFile = (e, text, record) => {
    if (text.cloudDiskType != '文件夹') {
      dispatch({
        type: 'signDisk/getDetailPublicMessage_CommonDisk',
        payload: {
          id: text.id,
        },
        callback: (see, download) => {
          if (download == 1) {
            dispatch({
              type: 'signDisk/getFileLengthURL_CommonDisk',
              payload: {
                id: text.id,
              },
              callback: (url) => {
                dispatch({
                  type: 'signDisk/putDownLoad_CommonDisk',
                  payload: {
                    id: text.id,
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
            message.error('没有权限');
          }
        },
      });
    } else {
      message.warning('暂不支持下载文件夹！');
    }
  };
  const fileDisk = record =>{
    if(record.cloudDiskType == '文件夹'){
      const arr = [{
        key: record.id,
        title: record.cloudDiskName
      }]
      dispatch({
        type: 'signDisk/getAuthorityList_CommonDisk_List',
        payload: {
          start: publicStart,
          limit: publicLimit,
          id: record.id,
          name: publicSearch,
          type: 'L',
        },
        callback: () => {
          dispatch({
            type: 'signDisk/updateStates',
            payload: {
              selectedKeysValue: record.id,
              selectTreeUrl: [...selectTreeUrl,...arr]
            }
          })
        },
      });
    }
  }

  const columns = [
    {
      title: '文件名',
      dataIndex: 'cloudDiskName',
      key: 'cloudDiskName',
      ellipsis: true,
      render(text,record){
        return <div title={text} className={styles.disk_name} style={{cursor: record.cloudDiskType=='文件夹'?'pointer':''}} onClick={()=>fileDisk(record)}>{getDiskFileType(record)} {record.cloudDiskName}</div>
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
      title: '上传时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sortDirections: ['descend'],
      render: (text) => dataFormat(text, 'YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={downloadFile.bind(this, text, record)}>下载</a>
          <a onClick={detail.bind(this, text, record)}>详情</a>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    onChange: (rowKeys, rows) => {
      let ids = [];
      rows.map((item) => {
        ids.push(item.id);
      });
      dispatch({
        type: 'signDisk/updateStates',
        payload: {
          pubRowSelectionKey: rowKeys,
          pubRowSelection: rows,
          ids: ids,
        },
      });
    },
  };

  const columnss = [
    {
      title: '操作详情',
      dataIndex: 'operationDescribe',
      key: 'operationDescribe',
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => <div>{dataFormat(text, 'YYYY-MM-DD HH:mm:ss')}</div>,
    },
    {
      title: '操作用户',
      dataIndex: 'createUserName',
      key: 'createUserName',
    },
  ];

  const publicChange = (page, pageSize) => {
    console.log(page, pageSize, controlFlag);
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        publicStart: page,
        publicLimit: pageSize,
      },
    });
  };

  const publicDetailChange = (page, pageSize) => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        publicDetailStart: page,
        publicDetailLimit: pageSize,
      },
    });
  };
  return (
    <>
      <ColumnDragTable
        rowKey="id"
        columns={columns}
        dataSource={publicList}
        rowSelection={{ ...rowSelection }}
        pagination={false}
        style={{ marginTop: '8px' }}
        scroll={{ y: 'calc(100vh - 350px)' }}
      />
      <IPagination
        current={Number(publicCurrentPage)}
        total={Number(publicReturnCounts)}
        onChange={publicChange}
        pageSize={publicLimit}
        isRefresh={true}
        showSizeChanger={true}
        showQuickJumper={true}
        refreshDataFn={() => {
          dispatch({
            type: 'signDisk/getAuthorityList_CommonDisk_List',
            payload: {
              start: 1,
              limit: publicLimit,
              id: selectedKeysValue,
              name: publicSearch,
              type: 'L',
            },
            callback: () => {},
          });
          dispatch({
            type: 'signDisk/updateStates',
            payload: {
              publicStart:1
            }
          })
        }}
      />
      <GlobalModal
        title="详情"
        widthType={2}
        visible={pbulicDetail}
        className={styles.modelDetail}
        onCancel={closed.bind(this)}
        mask={false}
        getContainer={() => {
          return document.getElementById('container_signDisk')||false
        }}
        footer={[
          <Button onClick={closed.bind(this)} className={styles.button_width} type="primary">
            关闭
          </Button>,
        ]}
      >
        <table className={styles.file}>
          <tr>
            <td title={publicDetailMSG.cloudDiskName}>
              文件名称：{publicDetailMSG.cloudDiskName}
            </td>
            <td title={`${
                publicDetailMSG.cloudDiskSize == null
                  ? 0
                  : (publicDetailMSG.cloudDiskSize / 1024).toFixed(2)
              }KB`}>
              文件大小：
              {`${
                publicDetailMSG.cloudDiskSize == null
                  ? '0'
                  : (publicDetailMSG.cloudDiskSize / 1024).toFixed(2)
              }KB`}
            </td>
          </tr>
          <tr>
            <td title={publicDetailMSG.createUserName}>
              创建用户：{publicDetailMSG.createUserName}
            </td>
            <td>
              创建时间：
              {dataFormat(publicDetailMSG.createTime, 'YYYY-MM-DD HH:mm:ss')}
            </td>
          </tr>
          <tr>
            <td title={publicDetailMSG.downNum}>
              下载次数：{publicDetailMSG.downNum}
            </td>
            <td>
              拥有权限：&emsp;
              {publicDetailMSG.visual == 1 ? <EyeOutlined /> : ''}&emsp;
              {publicDetailMSG.download == 1 ? <DownloadOutlined /> : ''}&emsp;
              {publicDetailMSG.see == 1 ? <MenuUnfoldOutlined /> : ''}
            </td>
          </tr>
        </table>
        <ColumnDragTable
          rowKey="id"
          columns={columnss}
          dataSource={publicDetailList}
          pagination={false}
          style={{ marginTop: '8px',height: 'calc(100% - 70px)' }}
          scroll={{ y: 'calc(100% - 130px)' }}
        />
        <div className={styles.publicPage}>
          <IPagination
            current={Number(publicDetailStart)}
            total={Number(publicDetailreturnCount)}
            onChange={publicDetailChange}
            pageSize={publicDetailLimit}
            isRefresh={true}
            showSizeChanger
            showQuickJumper
            refreshDataFn=  {()=>{
              dispatch({
                type: 'signDisk/getDetailPagingMessage_CommonDisk',
                payload: {
                  id: id,
                  start: 1,
                  limit: publicDetailLimit,
                },
              });

              dispatch({
                type: 'signDisk/updateStates',
                payload: {
                  publicDetailStart:1
                }
              })
            }}
          />
        </div>
      </GlobalModal>
    </>
  );
}

export default connect(({ signDisk }) => ({
  signDisk,
}))(List);
