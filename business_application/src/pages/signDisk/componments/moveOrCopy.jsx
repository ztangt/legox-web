import { connect } from 'dva';
import { Modal, Input, Tree, Button, message } from 'antd';
import { useState, useEffect } from 'react';
import _ from 'lodash';
import FilePng from '../../../../public/assets/filePng.png'
import {
  plusUpdateTreeData,
  minusUpdateTreeData,
  updateTreeData,
} from '../../../componments/public/treeChange';
import GlobalModal from '../../../componments/GlobalModal';
import styles from './moveOrCopy.less';

function moveOrCopy({ dispatch, signDisk }) {
  const {
    ItreeId,
    rowSelectionKey,
    dirName,
    moveOrCopyCode,
    id,
    signMoveVisible,
    myFileStart,
    myFileLimit,
    search,
    moveOrCopyIdType,
    ItreeData,
    rowSelection,
    selectedKeysValue,
    moveOrCopyTreeData,
    info,
    myList,
    selectTreeUrl
  } = signDisk;

  useEffect(() => {
    let newArr = Array(_.cloneDeep(ItreeData)[1].children[0]);
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        moveOrCopyTreeData: newArr,
      },
    });
  }, [ItreeData,signMoveVisible]);

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
            ? 'signDisk/postMove_SignDisk'
            : 'signDisk/postCopy_SignDisk',
        payload: {
          ids: moveOrCopyIdType == 'mutch' ? ids : id,
          parent: ItreeId,
        },
        callback: () => {
          dispatch({
            type: 'signDisk/getPagingOrBinList_SignDisk_List',
            payload: {
              start: myFileStart,
              limit: myFileLimit,
              id: selectedKeysValue == 3 ? 0 : selectedKeysValue,
              name: search,
              delete: 'Y',
              type: 'L',
            },
            callback: () => {
              // console.log(
              //   'dfregferg',
              //   ItreeData,
              //   id,
              //   minusUpdateTreeData([...ItreeData], id),
              // );
              const payload = {
                signMoveVisible: false,
                ItreeData:
                  moveOrCopyCode == 'move'
                    ? minusUpdateTreeData([...ItreeData], id)
                    : ItreeData,
              };
              if (addNodes.type === '文件夹') {
                payload.publicTreeData = plusUpdateTreeData(
                  [...ItreeData],
                  ItreeId,
                  addNodes,
                );
                // console.log(
                //   'dfregferg',
                //   ItreeData,
                //   ItreeId,
                //   plusUpdateTreeData([...ItreeData], ItreeId, addNodes),
                // );
              }
              dispatch({
                type: 'signDisk/updateStates',
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
      type: 'signDisk/updateStates',
      payload: {
        signMoveVisible: false,
      },
    });
  };

  const newDirOk = () => {
    if (dirName != '' && dirName != null) {
      const index = myList.findIndex(item=>item.cloudDiskName== dirName)
      if(index>=0){
        message.error('文件夹同一级别不允许重名')
        return 
      }
      dispatch({
        type: 'signDisk/postNewDir_SignDisk',
        payload: {
          name: dirName,
          parent: ItreeId,
          sort: 0
        },
        callback: () => {
          setNewDirVisible(false);
          dispatch({
            type: 'signDisk/getPagingOrBinList_SignDisk_List',
            payload: {
              start: 1,
              limit: 300,
              id: ItreeId,
              name: search,
              delete: 'Y',
              type: 'L',
            },
            callback: (data) => {
              // 根据新增的文件夹名称，从列表中查找最新的
              // const listId = data&&data.length>0&&data.filter(item=>dirName == item.cloudDiskName)[0].id||id
              // let addNodes = {
              //   title: dirName,
              //   key: listId,
              //   isLeaf: true
              // };
              dispatch({
                type: 'signDisk/getPagingOrBinList_SignDisk_Tree',
                payload: {
                  start: 1,
                  limit: 200,
                  id: ItreeId,
                  name: '',
                  delete: 'Y',
                  type: 'T',
                },
                callback(nowData){
                  nowData.map((item) => {
                    let curUrl = [{ title: item.title, key: item.key}];
                    let AddUrl = selectTreeUrl.concat(curUrl);
                    item.url = AddUrl;
                    item.type = 'person'
                    item.icon=<img src={FilePng}/>
                  });
                  dispatch({
                    type: 'signDisk/updateStates',
                    payload: {
                      ItreeData: updateTreeData(ItreeData, ItreeId, nowData),
                      dirName: '',
                      showNewDir: false,
                      myFileStart:1
                    },
                  });
                }
              })
              // const newData = data.filter(item=> item.cloudDiskType == '文件夹')
              // newData.forEach(element => {
              //   element.key = element.id
              //   element.title = element.cloudDiskName
              //   element.type = 'person';
              //   element.isLeaf = true
              // });
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
      type: 'signDisk/updateStates',
      payload: {
        dirName: '',
      },
    });
    setNewDirVisible(false);
  };

  const onChange = (e) => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        dirName: e.target.value,
      },
    });
  };
  ///////////////////////////////////////////////////////////////

  const onLoadData = ({ key, children }) =>
    new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }

      dispatch({
        type: 'signDisk/getPagingOrBinList_SignDisk_Tree',
        payload: {
          start: 1,
          limit: 200,
          id: key,
          name: '',
          delete: 'Y',
          type: 'T',
        },
        callback: (data) => {
          const newData = data.map(item=>{
            item.icon=<img src={FilePng}/>
            return item
          })
          dispatch({
            type: 'signDisk/updateStates',
            payload: {
              ItreeData: updateTreeData(ItreeData, key, newData),
            },
          });
        },
      });
      resolve();
    });

  const onSelect = (selectedKeysValue, info) => {
    if (selectedKeysValue.length > 0) {
      dispatch({
        type: 'signDisk/updateStates',
        payload: {
          ItreeId: selectedKeysValue[0],
        },
      });
    }
  };

  // useEffect(() => {
  //   dispatch({
  //     type: 'signDisk/getPagingOrBinList_SignDisk_Tree',
  //     payload: {
  //       start: 1,
  //       limit: 200,
  //       id: 0,
  //       name: '',
  //       delete: 'Y',
  //       type: 'T',
  //     },
  //     callback: (data) => {
  //       dispatch({
  //         type: 'publicDisk/updateStates',
  //         payload: {
  //           ItreeData: updateTreeData(ItreeData, 0, data),
  //         },
  //       });
  //     },
  //   });
  // }, []);
  return (
    <>
      
      <GlobalModal
        className={styles.moveOrCopy}
        mask={false}
        widthType={1}
        title={moveOrCopyCode=='move'?'移动':'复制'}
        visible={signMoveVisible}
        closable={false}
        footer={[
          <Button
            // type="primary"
            disabled={ItreeId != undefined ? false : true}
            onClick={addType.bind(this, true)}
            style={{ width: '98px' }}
          >
            新建文件夹
          </Button>,
          <Button className={styles.button_width} onClick={moveCancel}>取消</Button>,
          <Button
            type="primary"
            disabled={ItreeId != undefined ? false : true}
            onClick={moveOk}
            className={styles.button_width}
          >
            确定
          </Button>
        ]}
        getContainer={() => {
          return document.getElementById('container_signDisk')||false;
        }}
      >
        <Tree
          selectedKeys={[ItreeId]}
          defaultSelectedKeys={[0]}
          showLine={true}
          showIcon={true}
          loadData={onLoadData}
          treeData={moveOrCopyTreeData}
          onSelect={onSelect}
        />
      </GlobalModal>
      <GlobalModal
        className={styles.addModal}
        title="新建文件夹"
        widthType={5}
        visible={newDirVisible}
        onOk={newDirOk}
        onCancel={newDirCancel}
        mask={false}
        getContainer={() => {
          return document.getElementById('container_signDisk')||false;
        }}
        // bodyStyle={{ height: 110 }}
      >
        <Input
          value={dirName}
          placeholder="请输入文件夹名称"
          onChange={onChange}
        />
      </GlobalModal>
    </>
  );
}

export default connect(({ signDisk }) => ({
  signDisk,
}))(moveOrCopy);
