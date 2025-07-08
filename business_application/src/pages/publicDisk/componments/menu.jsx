import { connect } from 'dva';
import { Menu, Dropdown, Button, message, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { CHUNK_SIZE } from '../../../service/constant';
import { minusUpdateTreeData } from '../../../componments/public/treeChange';
import styles from './publicDisk.less';

function Menus({ dispatch, publicDisk }) {
  const {
    start,
    limit,
    treeId,
    search,
    rowSelection,
    ids,
    rowSelectionKey,
    selectedKeysValue,
    publicTreeData,
    disabledAllButton,
  } = publicDisk;

  const newDisk = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        showNewDir: true,
      },
    });
  };

  const upload = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        uploadVisible: true,
      },
    });
  };

  const downLoadFile = () => {
    if (rowSelection.length == 1) {
      if (rowSelection[0].cloudDiskType != '文件夹') {
        dispatch({
          type: 'publicDisk/getFileLengthURL_CommonDisk',
          payload: {
            id: ids,
          },
          callback: (url) => {
            dispatch({
              type: 'publicDisk/putDownLoad_CommonDisk',
              payload: {
                id: ids,
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
    } else if (rowSelection.length > 1) {
      message.warning('每次只能下载单条数据');
    } else {
      message.warning('还没有选择条目');
    }
  };

  const setAuthority = () => {
    if (rowSelection.length == 1) {
      dispatch({
        type: 'publicDisk/getAuthorityView_CommonDisk',
        payload: {
          id: rowSelectionKey[0],
        },
        callback: () => {
          dispatch({
            type: 'publicDisk/updateStates',
            payload: {
              showAuthority: true,
              commentsRows: [],
              commentsRowsKeys: '',
              controlDisabled: true,
            },
          });
        },
      });
    } else if (rowSelection.length == 0) {
      message.warning('还没有选择条目');
    } else {
      message.warning('只能选择单条数据');
    }
  };

  const handleMenuClick = (e) => {
    let ids = rowSelectionKey.join(',');

    switch (e.key) {
      case 'delete':
        if (rowSelection.length != 0) {
          dispatch({
            type: 'publicDisk/delDelete_CommonDisk',
            payload: {
              ids: ids,
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
                      publicTreeData: minusUpdateTreeData(publicTreeData, ids),
                    },
                  });
                },
              });
            },
          });
        } else {
          message.warning('还没有选择条目');
        }
        break;
      case 'move':
        if (rowSelection.length != 0) {
          dispatch({
            type: 'publicDisk/updateStates',
            payload: {
              publicMoveVisible: true,
              moveOrCopyCode: 'move',
              moveOrCopyIdType: 'mutch',
            },
          });
        } else {
          message.warning('还没有选择条目');
        }
        break;
      case 'copy':
        if (rowSelection.length != 0) {
          dispatch({
            type: 'publicDisk/updateStates',
            payload: {
              publicMoveVisible: true,
              moveOrCopyCode: 'copy',
              moveOrCopyIdType: 'mutch',
            },
          });
        } else {
          message.warning('还没有选择条目');
        }
        break;
      case 'sort':
        dispatch({
          type: 'publicDisk/getPagingList_CommonDisk_List',
          payload: {
            start: 1,
            limit: 9999,
            id: treeId,
            name: search,
            type: 'L',
            status: 'ALL',
          },
        });
        dispatch({
          type: 'publicDisk/updateStates',
          payload: {
            sortVisible: true,
          },
        });
        break;
      default:
        return;
    }
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
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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

  const menu = (
    <Menu onClick={handleMenuClick} className={styles.moreMenu}>
      <Menu.Item key="delete">删除</Menu.Item>
      <Menu.Item key="move">移动</Menu.Item>
      <Menu.Item key="copy">复制</Menu.Item>
      <Menu.Item key="sort">排序</Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.btnList}>
      <Button
        disabled={disabledAllButton}
        type="primary"
        className={styles.newDir}
        onClick={newDisk}
      >
        新建文件夹
      </Button>
      <Button
        disabled={disabledAllButton}
        type="primary"
        className={styles.upload}
        onClick={upload}
      >
        上传
      </Button>
      <Button
        disabled={disabledAllButton}
        type="primary"
        className={styles.authority}
        onClick={setAuthority}
      >
        权限设置
      </Button>
      <Button
        disabled={disabledAllButton}
        type="primary"
        className={styles.download}
        onClick={downLoadFile}
      >
        下载
      </Button>
      {/* <Dropdown.Button
        className={styles.btn}
        disabled={disabledAllButton}
        overlay={menu}
        type="primary"
        icon={<DownOutlined />}
      >
        更多
      </Dropdown.Button> */}

      <Dropdown overlay={menu}>
        <Button type="primary" disabled={disabledAllButton}>
          更多
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
}
export default connect(({ publicDisk }) => ({
  publicDisk,
}))(Menus);
