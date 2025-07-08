import { connect } from 'dva';
import { Modal, Input, Tree, Button, message } from 'antd';
import { useState, useEffect } from 'react';
import GlobalModal from '../../../componments/GlobalModal';
import styles from './moveOrCopy.less';
import {
  updateTreeData,
  plusUpdateTreeData,
  minusUpdateTreeData,
} from '../../../componments/public/treeChange';
function moveOrCopy({ dispatch, publicDisk }) {
  const {
    treeId,
    ItreeId,
    rowSelectionKey,
    dirName,
    moveOrCopyCode,
    id,
    start,
    limit,
    search,
    moveOrCopyFlag,
    publicMoveVisible,
    publicTreeData,
    rowSelection,
    moveOrCopyIdType,
  } = publicDisk;
  const [newDirVisible, setNewDirVisible] = useState(false);
  const addType = (e) => {
    setNewDirVisible(e);
  };
  const moveOk = () => {
    let info = _.find(rowSelection, function (o) {
      return o.id == ItreeId;
    });
    let addNodes = {};
    rowSelection.map((item) => {
      addNodes = {
        title: item.cloudDiskName,
        key: item.id,
        isLeaf: true,
        type: item.cloudDiskType,
      };
    });
    if (info != undefined || id == ItreeId) {
      message.warning('不能移动/复制到当前文件夹！');
    } else {
      let ids = rowSelectionKey.join(',');
      dispatch({
        type:
          moveOrCopyCode == 'move'
            ? 'publicDisk/postMove_CommonDisk'
            : 'publicDisk/postCopy_CommonDisk',
        payload: {
          ids: moveOrCopyIdType == 'one' ? id : ids,
          parent: ItreeId,
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
              const payload = {
                publicMoveVisible: false,
                publicTreeData: minusUpdateTreeData([...publicTreeData], id),
              };
              if (addNodes.type === '文件夹') {
                payload.publicTreeData = plusUpdateTreeData(
                  [...publicTreeData],
                  ItreeId,
                  addNodes,
                );
              }
              dispatch({
                type: 'publicDisk/updateStates',
                payload: payload,
              });
            },
          });
        },
      });
    }
  };

  const moveCancel = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        publicMoveVisible: false,
      },
    });
  };

  const newDirOk = () => {
    if (dirName != '' && dirName != null) {
      dispatch({
        type: 'publicDisk/postNewDir_CommonDisk',
        payload: {
          name: dirName,
          parent: ItreeId,
          sort: 0,
        },
        callback: (id) => {
          setNewDirVisible(false);
          let addNodes = {
            title: dirName,
            key: id,
            isLeaf: true,
          };
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
                  publicTreeData: plusUpdateTreeData(
                    publicTreeData,
                    ItreeId,
                    addNodes,
                  ),
                  dirName: '',
                  showNewDir: false,
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

  const newDirCancel = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        dirName: '',
      },
    });
    setNewDirVisible(false);
  };

  const onChange = (e) => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        dirName: e.target.value,
      },
    });
  };

  useEffect(() => {
    if (!publicMoveVisible) {
      dispatch({
        type: 'publicDisk/getPagingList_CommonDisk_Tree',
        payload: {
          start: 1,
          limit: 200,
          id: 0,
          name: '',
          type: 'T',
        },
        callback: (data) => {
          dispatch({
            type: 'publicDisk/updateStates',
            payload: {
              publicTreeData: updateTreeData(publicTreeData, 0, data),
              moveOrCopyFlag: true,
            },
          });
        },
      });
    }
  }, [publicMoveVisible]);

  useEffect(() => {
    if (moveOrCopyFlag && publicMoveVisible) {
      dispatch({
        type: 'publicDisk/getPagingList_CommonDisk_Tree',
        payload: {
          start: 1,
          limit: 200,
          id: 0,
          name: '',
          type: 'T',
        },
        // callback: (data) => {
        //   dispatch({
        //     type: 'publicDisk/updateStates',
        //     payload: {
        //       publicTreeData: updateTreeData(publicTreeData, 0, data),
        //       moveOrCopyFlag: true,
        //     },
        //   });
        // },
      });
    }
  }, [treeId]);

  const onLoadData = ({ key, children }) =>
    new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }

      dispatch({
        type: 'publicDisk/getPagingList_CommonDisk_Tree',
        payload: {
          start: 1,
          limit: 10,
          id: key,
          name: '',
          type: 'T',
        },
        callback: (data) => {
          dispatch({
            type: 'publicDisk/updateStates',
            payload: {
              publicTreeData: updateTreeData(publicTreeData, key, data),
            },
          });
        },
      });
      resolve();
    });

  const onSelect = (selectedKeysValue, info) => {
    if (selectedKeysValue.length > 0) {
      dispatch({
        type: 'publicDisk/updateStates',
        payload: {
          ItreeId: selectedKeysValue[0],
        },
      });
    }
  };

  return (
    <>
      <GlobalModal
        className={styles.makeNewDir}
        widthType={5}
        mask={false}
        title="新建文件夹"
        visible={newDirVisible}
        onOk={newDirOk}
        onCancel={newDirCancel}
        getContainer={() => {
          return document.getElementById('container_public')||false;
        }}
      >
        <Input
          value={dirName}
          placeholder="请输入文件夹名称"
          onChange={onChange}
        />
      </GlobalModal>
      <GlobalModal
        widthType={1}
        title={moveOrCopyCode=='move'?'移动':'复制'}
        className={styles.moveOrCopy}
        visible={publicMoveVisible}
        closable={false}
        footer={[
          <Button
            // type="primary"
            disabled={ItreeId != undefined ? false : true}
            onClick={addType.bind(this, true)}
            style={{ width: '98px', float: 'left' }}
          >
            新建文件夹
          </Button>,
          <Button onClick={moveCancel} className={styles.btn_width}>取消</Button>,
          <Button
            type="primary"
            disabled={ItreeId != undefined ? false : true}
            onClick={moveOk}
            className={styles.btn_width}
          >
            确定
          </Button>,
        ]}
        mask={false}
        getContainer={() => {
          return document.getElementById('container_public')||false;
        }}
      >
        <Tree
          showLine={true}
          showIcon={true}
          selectedKeys={[ItreeId]}
          defaultSelectedKeys={[0]}
          loadData={onLoadData}
          treeData={publicTreeData}
          onSelect={onSelect}
        />
      </GlobalModal>
    </>
  );
}

export default connect(({ publicDisk }) => ({
  publicDisk,
}))(moveOrCopy);
