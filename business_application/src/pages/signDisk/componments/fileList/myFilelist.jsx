import { connect } from 'dva';
import {
  message,
  Table,
  Tag,
  Space,
  Dropdown,
  Menu,
  Button,
  Modal,
  Input,
} from 'antd';
import React, { useState, useEffect } from 'react';
import {
  EyeOutlined,
  DownloadOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from '@ant-design/icons';
import styles from './meFilelist.less';
import _ from 'lodash';
import RelevanceModal from '../../../../componments/relevanceModal/relevanceModal';
import { dataFormat } from '../../../../util/util';
import { CHUNK_SIZE } from '../../../../service/constant';
import MoveOrCopy from '../moveOrCopy';
import IPagination from '../../../../componments/public/iPagination';
import ColumnDragTable from '../../../../componments/columnDragTable';
import GlobalModal from '../../../../componments/GlobalModal';
import {getDiskFileType} from '../../../../util/util'
import {
  minusUpdateTreeData,
  updateTreeData,
  updateTreeDataAfterRename,
} from '../../../../componments/public/treeChange';
function List({ dispatch, signDisk }) {
  const [isRelvanceModal, setIsRelvanceModal] = useState(false);
  const {
    treeId,
    selectedKeysValue,
    myList,
    search,
    myFileStart,
    myFileLimit,
    detailVisible,
    detailPublic,
    id,
    myFileId,
    detailList,
    detailreturnCount,
    detailCurrentPage,
    detailStart,
    detailLimit,
    controlflag,
    returnCounts,
    selectTreeUrl,
    currentPage,
    resetName,
    dirName,
    selectedDatas,
    authlist,
    rowSelectionKey,
    ItreeData,
  } = signDisk;
  let ChildRef = React.createRef();
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

  useEffect(() => {
    if (controlflag) {
      dispatch({
        type: 'signDisk/getDetailPagingMessage_SignDisk',
        payload: {
          id: id,
          start: detailStart,
          limit: detailLimit,
        },
        callback: () => {},
      });
    }
  }, [detailStart, detailLimit]);

  useEffect(() => {
    dispatch({
      type: 'signDisk/getPagingOrBinList_SignDisk_List',
      payload: {
        start: myFileStart,
        limit: myFileLimit,
        id: selectedKeysValue,
        name: search,
        delete: 'Y',
        type: 'L',
      },
    });
  }, [myFileStart, myFileLimit, search]);

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
          type: 'signDisk/getDetailPublicMessage_SignDisk',
          payload: {
            id: text.id,
          },
          callback: () => {
            dispatch({
              type: 'signDisk/getDetailPagingMessage_SignDisk',
              payload: {
                id: text.id,
                start: detailStart,
                limit: detailLimit,
              },
              callback: () => {
                dispatch({
                  type: 'signDisk/updateStates',
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
          type: 'signDisk/updateStates',
          payload: {
            resetName: true,
            id: text.id,
            dirName: text.cloudDiskName,
          },
        });
        break;
      case 'delete':
        dispatch({
          type: 'signDisk/delDelete_SignDisk',
          payload: {
            ids: text.id,
            delete: 'L',
          },
          callback: () => {
            dispatch({
              type: 'signDisk/getPagingOrBinList_SignDisk_List',
              payload: {
                start: myFileStart,
                limit: myFileLimit,
                id: treeId,
                name: '',
                delete: 'Y',
                type: 'L',
              },
              callback: () => {
                dispatch({
                  type: 'signDisk/updateStates',
                  payload: {
                    ItreeData: minusUpdateTreeData(ItreeData, text.id),
                  },
                });
              },
            });
          },
        });
        break;
      case 'move':
        dispatch({
          type: 'signDisk/updateStates',
          payload: {
            signMoveVisible: true,
            moveOrCopyCode: 'move',
            id: text.id,
            moveOrCopyIdType: 'one',
            rowSelection: [e],
          },
        });
        break;
      case 'copy':
        dispatch({
          type: 'signDisk/updateStates',
          payload: {
            signMoveVisible: true,
            moveOrCopyCode: 'copy',
            id: text.id,
            moveOrCopyIdType: 'one',
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
      type: 'signDisk/updateStates',
      payload: {
        myFileId: text.id,
      },
    });
    setIsRelvanceModal(true);
  };

  const downLoadFile = (text) => {
    if (text.cloudDiskType != '文件夹') {
      dispatch({
        type: 'signDisk/getFileLengthURL',
        payload: {
          id: text.id,
        },
        callback: (url) => {
          dispatch({
            type: 'signDisk/putDownLoad_SignDisk',
            payload: {
              id: text.id,
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

  const closed = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        detailVisible: false,
      },
    });
  };

  const onCancel = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        resetName: false,
        dirName: '',
      },
    });
  };

  const onOk = () => {
    if (dirName != '' && dirName != null) {
      dispatch({
        type: 'signDisk/putRechristen_SignDisk',
        payload: {
          id: id,
          name: dirName,
        },
        callback: () => {
          dispatch({
            type: 'signDisk/getPagingOrBinList_SignDisk_Tree',
            payload: {
              start: 1,
              limit: 200,
              id: selectedKeysValue,
              name: '',
              delete: 'Y',
              type: 'T',
            },
            callback: (data) => {
              dispatch({
                type: 'signDisk/getPagingOrBinList_SignDisk_List',
                payload: {
                  start: myFileStart,
                  limit: myFileLimit,
                  id: selectedKeysValue,
                  name: search,
                  delete: 'Y',
                  type: 'L',
                },
                callback: () => {
                  updateTreeDataAfterRename(ItreeData, id, dirName);
                  dispatch({
                    type: 'signDisk/updateStates',
                    payload: {
                      resetName: false,
                      dirName: '',
                      ItreeData,
                    },
                  });
                },
              });
            },
          });
        },
      });
    } else {
      message.warning('输入不能为空！');
    }
  };

  const onChange = (e) => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        dirName: e.target.value,
      },
    });
  };

  const okRelevance = () => {
    let newAcc = JSON.parse(JSON.stringify(authlist));
    selectedDatas.map((item) => {
      let info = _.find(authlist, { authUserId: item.nodeId });
      if (typeof info == 'undefined') {
        newAcc.push({
          operation: 'USER',
          authUserName: item.userName,
          authUserId: item.userId,
          orgId: '',
          authIdentityId: item.identityId,
          orgName: '',
          visual: 0,
          download: 0,
          see: 0,
        });
      }
    });
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        authList: newAcc,
      },
    });
    setIsRelvanceModal(false);
    let newData = [];
    for (let key in newAcc) {
      if (newAcc[key].operation != 'EVERYONE') {
        newData.push({
          nodeName: newAcc[key].authUserName,
          nodeId: newAcc[key].authUserId,
          identityId: newAcc[key].authIdentityId,
        });
      }
    }
    let newArray = [];
    newData.map((item) => {
      if(item.nodeName&&item.nodeId){
        newArray.push(`${item.nodeId}-${item.identityId}-${item.nodeName}`);
      }
    });
    if (Array.prototype.isPrototypeOf(newArray) && newArray.length === 0) {
      message.error('请选择被分享人');
    } else {
      dispatch({
        type: 'signDisk/postShare_SignDisk',
        payload: {
          ids: myFileId,
          userids: newArray.join(','),
        },
        callback: () => {
          dispatch({
            type: 'signDisk/updateStates',
            payload: {
              selectedDatas: [],
            },
          });
        },
      });
    }
    handleOnClick();
  };
  function handleOnClick() {
    ChildRef.current.func();
  }
  const cancelRelevance = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        selectedDatas: [],
      },
    });
    setIsRelvanceModal(false);
    handleOnClick();
  };

  const myFilePageChange = (page, pageSize) => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        myFileStart: page,
        myFileLimit: pageSize,
      },
    });
  };

  const detailChange = (page, pageSize) => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        detailStart: page,
        detailLimit: pageSize,
      },
    });
  };
  // 文件
  const fileDisk = record =>{
    if(record.cloudDiskType == '文件夹'){
      const arr = [{
        key: record.id,
        title: record.cloudDiskName
      }]
      dispatch({
        type: 'signDisk/getPagingOrBinList_SignDisk_List',
        payload: {
          start: myFileStart,
          limit: myFileLimit,
          id: record.id,
          name: search,
          delete: 'Y',
          type: 'L'
        },
        callback(){
          dispatch({
            type: 'signDisk/updateStates',
            payload: {
              selectedKeysValue: record.id,
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
        return <div title={text} className={styles.disk_name}  style={{cursor: record.cloudDiskType=='文件夹'?'pointer':''}} onClick={()=>fileDisk(record)}>{getDiskFileType(record)} {record.cloudDiskName}</div>
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
          <a onClick={setAuthority.bind(this, text)}>分享</a>
          <a onClick={downLoadFile.bind(this, text)}>下载</a>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu onClick={handleMenuClick.bind(this, text, record)}>
                {/* <Menu.Item key="detail" disabled={record.sort == 0 ? true : false}>详情</Menu.Item> */}
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
      render: (text) => {
        return <div>{dataFormat(text, 'YYYY-MM-DD HH:mm:ss')}</div>;
      },
    },
    {
      title: '操作用户',
      dataIndex: 'createUserName',
      key: 'createUserName',
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
    <>
      <ColumnDragTable
        rowKey="id"
        className={styles.table}
        columns={columns}
        dataSource={sortList(myList)}
        rowSelection={{ ...rowSelection }}
        pagination={false}
        scroll={{ y: 'calc(100vh - 320px)' }}
      />
      <div className={styles.page}>
        <IPagination
          current={myFileStart}
          total={Number(returnCounts)}
          onChange={myFilePageChange}
          pageSize={myFileLimit}
          isRefresh={true}
          refreshDataFn={() => {
            dispatch({
              type: 'signDisk/getPagingOrBinList_SignDisk_List',
              payload: {
                start: 1,
                limit: myFileLimit,
                id: selectedKeysValue,
                name: search,
                delete: 'Y',
                type: 'L',
              },
            });
            dispatch({
              type: 'signDisk/updateStates',
              payload: {
                myFileStart: 1
              }
            })
          }}
        />
      </div>
      <GlobalModal
        title="详情"
        widthType={2}
        visible={detailVisible}
        className={styles.modelDetail}
        onCancel={closed.bind(this)}
        mask={false}
        getContainer={() => {
          return document.getElementById('container_signDisk')||false;
        }}
        footer={[
          <Button className={styles.button_width} onClick={closed.bind(this)} type="primary">
            关闭
          </Button>,
        ]}
      >
        <table className={styles.file}>
          <tr>
            <td title={detailPublic.cloudDiskName}>
              文件名称：{detailPublic.cloudDiskName}
            </td>
            <td title={`${
                detailPublic.cloudDiskSize == null
                  ? 0: (detailPublic.cloudDiskSize / 1024).toFixed(2)
              }KB`}>
              文件大小：
              {`${
                detailPublic.cloudDiskSize == null
                  ? '0'
                  : (detailPublic.cloudDiskSize / 1024).toFixed(2)
              }KB`}
            </td>
          </tr>
          <tr>
            <td title={detailPublic.creatUserName}>
              创建用户：{detailPublic.createUserName}
            </td>
            <td>
              创建时间：
              {dataFormat(detailPublic.createTime, 'YYYY-MM-DD HH:mm:ss')}
            </td>
          </tr>
          <tr>
            <td title={detailPublic.downNum}>
              下载次数：{detailPublic.downNum}
            </td>
            <td>
              拥有权限：&emsp;{detailPublic.visual == 1 ? <EyeOutlined /> : ''}
              &emsp;{detailPublic.download == 1 ? <DownloadOutlined /> : ''}
              &emsp;{detailPublic.see == 1 ? <MenuUnfoldOutlined /> : ''}
            </td>
          </tr>
        </table>
        <ColumnDragTable
          rowKey="id"
          columns={columnss}
          dataSource={detailList}
          pagination={false}
          style={{ marginTop: '8px',height: 'calc(100% - 85px)' }}
          scroll={{ y: 'calc(100% - 115px)' }}
        />
        <div className={styles.pageDet}>
          <IPagination
            current={detailCurrentPage}
            total={detailreturnCount}
            onChange={detailChange}
            pageSize={detailLimit}
            showSizeChanger
            showQuickJumper
            isRefresh={true}
            refreshDataFn=  {()=>{
              dispatch({
                type: 'signDisk/getDetailPagingMessage_SignDisk',
                payload: {
                  id: id,
                  start: 1,
                  limit: detailLimit,
                }
              });

              dispatch({
                type: 'signDisk/updateStates',
                payload: {
                  detailStart: 1,
                },
              });
            }}
          />
        </div>
      </GlobalModal>
      <Modal
        className={styles.resetName}
        mask={false}
        visible={resetName}
        title="重命名"
        onCancel={onCancel}
        onOk={onOk}
        bodyStyle={{ height: 110 }}
        getContainer={() => {
          return document.getElementById('container_signDisk')||false;
        }}
      >
        <Input value={dirName} placeholder="请输入名称" onChange={onChange} />
      </Modal>
      {isRelvanceModal && (
        <GlobalModal
          className={styles.org}
          widthType={3}
          title="选择组织机构"
          mask={false}
          visible={true}
          onOk={okRelevance}
          onCancel={cancelRelevance}
          bodyStyle={{ padding: '16px 0px 0px 0px' }}
          getContainer={() => {
            return document.getElementById('container_signDisk')||false;
          }}
        >
          <RelevanceModal
            nameSpace="signDisk"
            spaceInfo={signDisk}
            orgUserType="USER"
            selectButtonType="checkBox"
            treeType={'DEPT'}
            type={'INCLUDESUB'}
            nodeIds={''}
            onRef={ChildRef}
          />
        </GlobalModal>
      )}
      {/* <MoveOrCopy></MoveOrCopy> */}
    </>
  );
}

export default connect(({ signDisk }) => ({
  signDisk,
}))(List);
