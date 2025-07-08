import { connect } from 'dva';
import { Table, Space, Dropdown, Menu, Modal, Input, message } from 'antd';
import { useEffect } from 'react';
import Authority from './authority';
import { DownOutlined } from '@ant-design/icons';
import Disk from './moveOrCopy';
import { dataFormat,getDiskFileType } from '../../../util/util';
import { CHUNK_SIZE } from '../../../service/constant';
import Detail from './detail';
import ColumnDragTable from '../../../componments/columnDragTable';
import IPagination from '../../../componments/public/iPagination';
import {
  minusUpdateTreeData,
  updateTreeData,
  updateTreeDataAfterRename,
} from '../../../componments/public/treeChange';
import styles from './list.less';

function List({ dispatch, publicDisk,signDisk }) {
  const {
    list,
    limit,
    id,
    treeId,
    detailStart,
    detailLimit,
    controlflag,
    dirName,
    resetName,
    listReturnCount,
    start,
    search,
    listCurrentPage,
    publicTreeData,
    selectedKeysValue,
    rowSelectionKey,
    resetNameList,
    selectTreeUrl,
    treeKeys,
    expandedKeys,
  } = publicDisk;
  const {ItreeData,publicSearch,publicLimit,publicStart}= signDisk
  useEffect(() => {
    if (controlflag) {
      dispatch({
        type: 'publicDisk/getDetailPagingMessage_CommonDisk',
        payload: {
          id: id,
          start: detailStart,
          limit: detailLimit,
        },
        callback: () => {},
      });
    }
  }, [detailStart, detailLimit]);

  const rowSelection = {
    selectedRowKeys: rowSelectionKey,
    onChange: (rowKeys, rows) => {
      let fileId = [];
      let ids = [];
      rows.map((item) => {
        fileId.push(item.fileId);
        ids.push(item.id);
      });
      dispatch({
        type: 'publicDisk/updateStates',
        payload: {
          rowSelectionKey: rowKeys,
          rowSelection: rows,
          fileId: fileId,
          ids: ids,
        },
      });
    },
  };

  const handleMenuClick = (e, text, record) => {
    let ids = rowSelectionKey.join(',');
    switch (record.key) {
      case 'detail':
        dispatch({
          type: 'publicDisk/getDetailPublicMessage_CommonDisk',
          payload: {
            id: text.id,
          },
          callback: () => {
            dispatch({
              type: 'publicDisk/getDetailPagingMessage_CommonDisk',
              payload: {
                id: text.id,
                start: detailStart,
                limit: detailLimit,
              },
              callback: () => {
                dispatch({
                  type: 'publicDisk/updateStates',
                  payload: {
                    id: text.id,
                    detailVisible: true,
                    controlflag: true,
                  },
                });
              },
            });
          },
        });
        break;
      case 'resetName':
        dispatch({
          type: 'publicDisk/updateStates',
          payload: {
            resetName: true,
            id: text.id,
            dirName: text.cloudDiskName,
          },
        });
        break;
      case 'delete':
        dispatch({
          type: 'publicDisk/delDelete_CommonDisk',
          payload: {
            ids: text.id,
          },
          callback: () => {
            dispatch({
              type: 'publicDisk/getPagingList_CommonDisk_List',
              payload: {
                start: start,
                limit: limit,
                id: treeId,
                name: search,
                type: 'L',
              },
              callback: () => {
                dispatch({
                  type: 'publicDisk/updateStates',
                  payload: {
                    publicTreeData: minusUpdateTreeData(
                      publicTreeData,
                      text.id,
                    ),
                  },
                });
              },
            });
          },
        });
        break;
      case 'move':
        dispatch({
          type: 'publicDisk/updateStates',
          payload: {
            publicMoveVisible: true,
            moveOrCopyCode: 'move',
            moveOrCopyIdType: 'one',
            id: text.id,
            moveOrCopyTitle: text.cloudDiskName,
            moveOrCopyIsLeaf: text.child == 'Y' ? false : true,
            rowSelection: [e],
          },
        });
        break;
      case 'copy':
        dispatch({
          type: 'publicDisk/updateStates',
          payload: {
            publicMoveVisible: true,
            moveOrCopyCode: 'copy',
            moveOrCopyIdType: 'one',
            id: text.id,
            moveOrCopyTitle: text.cloudDiskName,
            moveOrCopyIsLeaf: text.child == 'Y' ? false : true,
            rowSelection: [e],
          },
        });
        break;
      default:
        return;
    }
  };

  const setAuthority = (text) => {
    dispatch({
      type: 'publicDisk/getAuthorityView_CommonDisk',
      payload: {
        id: text.id,
      },
      callback: () => {
        dispatch({
          type: 'publicDisk/updateStates',
          payload: {
            showAuthority: true,
            controlDisabled: true,
            selectedPublicKey: text.id,
          },
        });
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

  const downLoadFile = (text) => {
    if (text.cloudDiskType != '文件夹') {
      dispatch({
        type: 'publicDisk/getFileLengthURL_CommonDisk',
        payload: {
          id: text.id,
        },
        callback: (url) => {
          dispatch({
            type: 'publicDisk/putDownLoad_CommonDisk',
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
      message.warning('暂不支持下载文件夹！');
    }
  };

  const onCancel = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        resetName: false,
        dirName: '',
      },
    });
  };

  const onOk = () => {
    if (dirName != '' && dirName != null) {
      dispatch({
        type: 'publicDisk/putRechristen_CommonDisk',
        payload: {
          id: id,
          name: dirName,
        },
      });
      dispatch({
        type: 'publicDisk/getPagingList_CommonDisk_Tree',
        payload: {
          start: 1,
          limit: 200,
          id: selectedKeysValue,
          name: '',
          type: 'T',
        },
        callback: (data) => {
          dispatch({
            type: 'publicDisk/getPagingList_CommonDisk_List',
            payload: {
              start: start,
              limit: limit,
              id: treeId,
              name: search,
              type: 'L',
            },
            callback: () => {
              //为children加上路径，为了右侧的面包屑显示
              data.map((item) => {
                let curUrl = [{ title: item.title, key: item.key }];
                item.url = resetNameList.concat(curUrl);
              });
              updateTreeDataAfterRename(publicTreeData, id, dirName);
              dispatch({
                type: 'publicDisk/updateStates',
                payload: {
                  // publicTreeData: updateTreeData(publicTreeData, selectedKeysValue, data),
                  publicTreeData,
                  // resetName: false,
                  // dirName: '',
                  // treeKeys:new Date().getTime(),
                  // expandedKeys:0,
                },
                // callback: () => {
                //   dispatch({
                //     type: 'publicDisk/getPagingList_CommonDisk_Tree',
                //     payload: {
                //       start: 1,
                //       limit: 10,
                //       id: resetNameListID,
                //       name: '',
                //       type: 'T'
                //     },
                //   })
                // }
              });
              // 更新个人公共云盘名称和列表
              updateTreeData(ItreeData,id,dirName)
              dispatch({
                type: 'signDisk/getAuthorityList_CommonDisk_List',
                payload:{
                  start: publicStart,
                  limit: publicLimit,
                  id: treeId,
                  name: publicSearch,
                  type: 'L',
                }
              })

            },
          });
        },
      });
      dispatch({
        type: 'publicDisk/updateStates',
        payload: {
          resetName: false,
          dirName: '',
        },
      });
    } else {
      message.warning('输入不能为空！');
    }
  };

  const onChange = (e) => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        dirName: e.target.value,
      },
    });
  };

  const pageChange = (page, pageSize) => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        start: page,
        limit: pageSize,
      },
    });
  };
  // 点击文件夹
  const fileDisk = (record)=>{    
    if(record.cloudDiskType == '文件夹'){
      const arr = [{
        key: record.id,
        title: record.cloudDiskName
      }]
      dispatch({
        type: 'publicDisk/getPagingList_CommonDisk_List',
        payload: {
          start: start,
          limit: limit,
          id: record.id,
          name: search,
          type: 'L',
        },
        callback: ()=>{
          dispatch({
            type: 'publicDisk/updateStates',
            payload: {
              selectedKeysValue: record.id,
              treeId: record.id,
              selectTreeUrl: [...selectTreeUrl,...arr]
            }
          })
        }
      })
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
      width: 80,
    },
    {
      title: '大小',
      dataIndex: 'cloudDiskSize',
      key: 'cloudDiskSize',
      width: 90,
      render: (text, record) => {
        if (record.cloudDiskType != '文件夹') {
          // return <div>{`${text / 1024 / 1024 >= 1024 ? `${(text / 1024 / 1024 / 1024).toFixed(2)}GB` : `${(text / 1024 / 1024).toFixed(2)}MB`}`}</div>
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
      width: 200,
      render: (text, record) => (
        <Space size="middle">
          <a onClick={setAuthority.bind(this, text)}>权限设置</a>
          <a onClick={downLoadFile.bind(this, text)}>下载</a>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu onClick={handleMenuClick.bind(this, text, record)}>
                <Menu.Item key="detail">详情</Menu.Item>
                <Menu.Item key="resetName">重命名</Menu.Item>
                <Menu.Item key="delete">删除</Menu.Item>
                <Menu.Item key="move">移动</Menu.Item>
                <Menu.Item key="copy">复制</Menu.Item>
              </Menu>
            }
          >
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              更多 <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const sortList = (list) => {
    if (list && list.length === 0) {
      return [];
    }
    let len = list.length;

    while (len--) {
      for (let i = 0; i < list.length; i++) {
        if (list[i]?.sort > list[i + 1]?.sort) {
          const temp = list[i];
          list[i] = list[i + 1];
          list[i + 1] = temp;
        }
      }
    }

    return list;
  };

  return (
    <div className={styles.warp}>
      <ColumnDragTable
        rowKey="id"
        columns={columns}
        dataSource={sortList(list)}
        rowSelection={{ ...rowSelection }}
        pagination={false}
        style={{ marginTop: '8px' }}
        sortDirections={'descend'}
        scroll={{ y: 'calc(100vh - 300px)' }}
      />
      {/* <div className={styles.page}>
        <IPagination
          current={listCurrentPage}
          total={listReturnCount}
          onChange={pageChange}
          pageSize={limit}
          isRefresh={true}
          refreshDataFn={() => {
            dispatch({
              type: 'publicDisk/getDetailPagingMessage_CommonDisk',
              payload: {
                id: id,
                start: detailStart,
                limit: detailLimit,
              },
              callback: () => {},
            });
          }}
        />
      </div> */}

      <Detail></Detail>
      <Modal
        className={styles.resetNameModal}
        mask={false}
        getContainer={() => {
          return document.getElementById('container_public')||false;
        }}
        visible={resetName}
        title="重命名"
        onCancel={onCancel}
        onOk={onOk}
        bodyStyle={{ height: 110 }}
      >
        <Input value={dirName} placeholder="请输入名称" onChange={onChange} />
      </Modal>
      <Authority></Authority>
      <Disk></Disk>
    </div>
  );
}

export default connect(({ publicDisk,signDisk }) => ({
  publicDisk,
  signDisk
}))(List);
