import { connect } from 'dva';
import lodash from 'lodash';
import {
  message,
  Input,
  Button,
  Menu,
  Dropdown,
  Modal,
  Table,
  InputNumber,
  Upload,
  Tag,
  Progress,
} from 'antd';
import Disk from '../moveOrCopy';
import RelevanceModal from '../../../../componments/relevanceModal/relevanceModal';
import React, { useState, useEffect, useRef } from 'react';
import { DownOutlined } from '@ant-design/icons';
import styles from '../signDisk.less';
import { CHUNK_SIZE } from '../../../../service/constant';
import {
  plusUpdateTreeData,
  minusUpdateTreeData,
  updateTreeData,
} from '../../../../componments/public/treeChange';
import _ from 'lodash';
import IUpload from '../../../../componments/Upload/uploadModal';
import GlobalModal from '../../../../componments/GlobalModal';
import {getDiskFileType} from '../../../../util/util'
import Breadcrumb from '../header/breadcrumb';
function Buttons({ dispatch, signDisk,location, changeSelectTreeId}) {
  const [isRelvanceModal, setIsRelvanceModal] = useState(false);
  const {
    showNewDir,
    treeId,
    dirName,
    ids,
    rowSelection,
    rowSelectionKey,
    sortVisible,
    sortJson,
    uploadVisible,
    myFileStart,
    myFileLimit,
    selectedDatas,
    authlist,
    fileChunkedList,
    index,
    isStop,
    isContinue,
    nowMessage,
    needfilepath,
    isCancel,
    selectedKeysValue,
    ItreeData,
    disabledAllButton,
    typeName,
    fileExists,
    fileNames,
    typeNames,
    fileSize,
    merageFilepath,
    getFileMD5Message,
    myList,
    myAllList,
    treeRoute,
    selectTreeUrl,
    searchValue,
    isUploading,
  } = signDisk;
  let ChildRef = React.createRef();
  console.log("searchValue990",searchValue)
  // const [searchValue,setSearchValue]=useState('')
  useEffect(() => {
    // 如果文件存在于minio
    if ((fileExists || fileExists === false)&&fileNames) {
      dispatch({
        type: 'signDisk/postUpload_CommonDisk',
        payload: {
          name: fileNames,
          type: typeNames,
          size: fileSize,
          parent: selectedKeysValue,
          filePath: fileExists
            ? getFileMD5Message.filePath
            : fileSize > CHUNK_SIZE
            ? merageFilepath
            : needfilepath,
          sort: 0,
        },
        callback: () => {
          dispatch({
            type: 'signDisk/updateStates',
            payload: {
              fileExists: '',
              isUploading: false,
            },
          });
        },
      });
    }
    // else if (fileExists === false) {
    //   // 如果文件不存在于minio
    //   dispatch({
    //     type: 'signDisk/postUpload_CommonDisk',
    //     payload: {
    //       name: fileNames,
    //       type: typeNames,
    //       size: fileSize,
    //       parent: selectedKeysValue,
    //       filePath: fileSize > CHUNK_SIZE ? merageFilepath : needfilepath,
    //       sort: 0
    //     },
    //     callback: () => {
    //       dispatch({
    //         type: 'signDisk/updateStates',
    //         payload: {
    //           fileExists: ''
    //         }
    //       });
    //     }
    //   })
    // }
  }, [fileExists]);

  const onSearch = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        search: searchValue,
        myFileStart: 1,
      },
    });
  };
  const changeValue=(e)=>{
    setSearchValue(e.target.value)
  }

  const newDisk = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        showNewDir: true,
      },
    });
  };

  const onCancel = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        showNewDir: false,
        dirName: '',
      },
    });
  };

  const onOk = () => {
    if (dirName != '' && dirName != null) {
      // 添加重名校验
      const index = myList.findIndex(item=>item.cloudDiskName== dirName)
      const oIndex = myAllList.findIndex(item=>item.cloudDiskName == dirName)
      if(index>=0||oIndex>=0){
        message.error('文件夹同一级别不允许重名')
        return 
      }
      dispatch({
        type: 'signDisk/postNewDir_SignDisk',
        payload: {
          name: dirName,
          parent: treeId,
          sort: 0,
        },
        callback: (id) => {
          let addUrl = {
            title: dirName,
            key: id,
          };
          // let addNodes = {
          //   title: dirName,
          //   key: id,
          //   isLeaf: true,
          //   type: 'person',
          //   url: selectTreeUrl.concat(addUrl),
          // };
          dispatch({
            type: 'signDisk/getPagingOrBinList_SignDisk_List',
            payload: {
              start: 1,
              limit: 300,
              id: treeId,
              name: searchValue,
              delete: 'Y',
              type: 'L',
            },
            callback: (data) => {
              dispatch({
                type: 'signDisk/getPagingOrBinList_SignDisk_Tree',
                payload: {
                  start: 1,
                  limit: 200,
                  id: treeId,
                  name: '',
                  delete: 'Y',
                  type: 'T',
                },
                callback: (data) => {
                  data.map((item) => {
                    let curUrl = [{ title: item.title, key: item.key}];
                    let AddUrl = selectTreeUrl.concat(curUrl);
                    item.url = AddUrl;
                    item.type = 'person'
                  });
                  console.log(data)
                  // const newData = data.filter(item=>item.cloudDiskType == '文件夹')
                  // newData.forEach(element => {
                  //   element.key = element.id
                  //   element.title = element.cloudDiskName
                  //   element.type = 'person';
                  //   element.isLeaf = true
                  // });
                  dispatch({
                    type: 'signDisk/updateStates',
                    payload: {
                      showNewDir: false,
                      dirName: '',
                      myFileStart: 1,
                      ItreeData:  updateTreeData(ItreeData,treeId,data)
                      // plusUpdateTreeData(
                      //   ItreeData,
                      //   selectedKeysValue,
                      //   addNodes,
                      // ),
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

  const downLoadFile = () => {
    if (rowSelection.length == 1) {
      dispatch({
        type: 'signDisk/getFileLengthURL',
        payload: {
          id: ids,
        },
        callback: (url) => {
          dispatch({
            type: 'signDisk/putDownLoad_SignDisk',
            payload: {
              id: ids,
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
    } else if (rowSelection.length === 0) {
      return message.warning('还没有选择条目');
    } else if (rowSelection.length > 1) {
      return message.warning('每次只能下载单条数据');
    } else if (rowSelection[0].cloudDiskType == '文件夹') {
      return message.warning('暂不支持下载文件夹！');
    }
  };

  const share = () => {
    if (rowSelection.length != 0) {
      setIsRelvanceModal(true);
    } else {
      message.warning('还没有选择条目');
    }
  };

  const handleMenuClick = (e) => {
    let ids = rowSelectionKey.join(',');

    switch (e.key) {
      case 'delete':
        if (rowSelection.length != 0) {
          dispatch({
            type: 'signDisk/delDelete_SignDisk',
            payload: {
              ids: ids,
              delete: 'L',
            },
            callback: () => {
              dispatch({
                type: 'signDisk/getPagingOrBinList_SignDisk_List',
                payload: {
                  start: myFileStart,
                  limit: myFileLimit,
                  id: treeId,
                  name: searchValue,
                  delete: 'Y',
                  type: 'L',
                },
                callback: () => {
                  dispatch({
                    type: 'signDisk/updateStates',
                    payload: {
                      ItreeData: minusUpdateTreeData(ItreeData, ids),
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
            type: 'signDisk/updateStates',
            payload: {
              signMoveVisible: true,
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
            type: 'signDisk/updateStates',
            payload: {
              signMoveVisible: true,
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
          type: 'signDisk/getPagingOrBinList_SignDisk_List',
          payload: {
            start: 1,
            limit: 9999,
            id: selectedKeysValue,
            name: '',
            delete: 'Y',
            type: 'L',
            status: 'ALL',
          },
        });
        dispatch({
          type: 'signDisk/updateStates',
          payload: {
            sortVisible: true,
          },
        });
        break;
      default:
        return;
    }
  };

  const numberOk = () => {
    dispatch({
      type: 'signDisk/putSort_SignDisk',
      payload: {
        dataJson: JSON.stringify(sortJson),
      },
      callback: () => {
        dispatch({
          type: 'signDisk/updateStates',
          payload: {
            sortVisible: false,
          },
        });
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
          callback: (data) => {
            dispatch({
              type: 'signDisk/updateStates',
              payload: {
                myList: myList ? lodash.sortBy(myList, 'sort') : [],
              },
            });
          },
        });
      },
    });
  };

  const numberCancel = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        sortVisible: false,
      },
    });
  };

  const onNumberChange = (e, text, round) => {
    const newRowSelection = myAllList.map((item) => {
      if (item.id === text.id) {
        item.sort = round;
      }
      return item;
    });
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        sortJson: newRowSelection,
        // rowSelection: newRowSelection,
      },
    });
  };
  const upload = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        uploadVisible: true,
      },
    });
  };

  const uploadContinue = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        uploadFlag: true,
      },
    });
    dispatch({
      type: 'uploadfile/presignedUploadUrl',
      payload: {
        namespace: 'signDisk',
        filePath: `${needfilepath}/${index + 1}`,
      },
    });
  };

  const uploadCancel = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        uploadVisible: false,
        uploadFlag: false,
        nowMessage: '',
        isStop: true,
        isContinue: true,
        isCancel: false,
        downName: '',
        filelenthurl: '',
        downURL: '',
        fileSize: '',
        needfilepathHALF: '',
        needfilepath: '',
        v: 1,
        md5: '',
        merageFilepath: '',
        success: '',
        filePathIsReal: '',
        index: 0,
        optionFile: [],
        typeNames: '',
        fileNames: '',
        fileName: '', //每片文件名
        fileChunkedList: [], //文件分片完成之后的数组
        isUploading: false,
      },
    });
  };

  const uploadStop = () => {
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        uploadFlag: false,
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
          authIdentityId: item.identityId,
          orgId: '',
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
        selectedDatas: [],
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
          ids: rowSelectionKey.join(','),
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

  const loopColumns = [
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
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      render: (text, round) => (
        <InputNumber
          min={1}
          max={999999999}
          defaultValue={text}
          onChange={onNumberChange.bind(this, text, round)}
        />
      ),
    },
  ];

  const menu = (
    <Menu onClick={handleMenuClick.bind(this)}>
      <Menu.Item key="delete">删除</Menu.Item>
      <Menu.Item key="move">移动</Menu.Item>
      <Menu.Item key="copy">复制</Menu.Item>
      <Menu.Item key="sort">排序</Menu.Item>
    </Menu>
  );

  return (
    <>
      <div style={{ paddingTop: '8px', marginLeft: '8px' }}>
        <Breadcrumb selectTreeUrl={selectTreeUrl} changeSelectTreeId={changeSelectTreeId} />
        {/* <Input
          placeholder="请输入文件名"
          // allowClear
          size="middle"
          // onSearch={onSearch}
          className={styles.searchInput}
          // enterButton={
          //   <img
          //     src={require('../../../../../public/assets/high_search.svg')}
          //     style={{ margin: '0 8px 2px 0' }}
          //   />
          // }
          onChange={changeValue}
          style={{ width: '226px', height: '32px' }}
        />
        <Button
          type="primary"
          style={{ margin: '0 8px' }}
          onClick={onSearch}
          className={styles.button_width}
        >
          查询
        </Button> */}
      </div>
      <div className={styles.btnList} style={{ paddingTop: '8px' }}>
        <Button
          disabled={disabledAllButton}
          type="primary"
          className={styles.myfileNewDir}
          onClick={newDisk.bind(this)}
        >
          新建文件夹
        </Button>
        <Button
          disabled={disabledAllButton}
          type="primary"
          className={styles.myfileUpload}
          onClick={upload}
        >
          上传
        </Button>
        <Button
          disabled={disabledAllButton}
          type="primary"
          className={styles.myfileShare}
          onClick={share.bind(this)}
        >
          分享
        </Button>
        <Button
          disabled={disabledAllButton}
          type="primary"
          className={styles.myfileDownload}
          onClick={downLoadFile.bind(this)}
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
      <GlobalModal
        title="排序"
        visible={sortVisible}
        widthType={2}
        onOk={numberOk}
        onCancel={numberCancel}
        mask={false}
        getContainer={() => {
          return document.getElementById('container_signDisk')||false;
        }}
        // bodyStyle={{ height: '430', overflowY: 'hidden' }}
      >
        <Table
          rowKey="id"
          columns={loopColumns}
          dataSource={myAllList}
          pagination={false}
          className={styles.sort}
          scroll={{ y: 'calc(100% - 47px)' }}
        />
      </GlobalModal>
      <GlobalModal
        // className={styles.addModal}
        visible={showNewDir}
        title="新建文件夹"
        onCancel={onCancel}
        widthType={5}
        onOk={onOk}
        mask={false}
        // bodyStyle={{ height: 110 }}
        getContainer={() => {
          return document.getElementById('container_signDisk')||false;
        }}
      >
        <Input
          value={dirName}
          placeholder="请输入文件夹名称"
          onChange={onChange}
        />
      </GlobalModal>
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
      <GlobalModal
        // className={styles.uploadModal}
        title="上传文件"
        widthType={5}
        visible={uploadVisible}
        onCancel={uploadCancel}
        footer={[
          <Button onClick={uploadStop} className={styles.button_width} disabled={isStop}>
            暂停
          </Button>,
          <Button onClick={uploadContinue} className={styles.button_width} disabled={isContinue}>
            继续
          </Button>,
          <Button disabled={isUploading} className={styles.button_width} onClick={uploadCancel}>
            取消
          </Button>,
        ]}
        mask={false}
        getContainer={() => {
          return document.getElementById('container_signDisk')||false;
        }}
        // bodyStyle={{ height: 170 }}
      >
        <div style={{ color: 'red', marginTop: '10px' }}>
          【注意：以下文件格式禁止上传：exe、bat、js、java、sh、dll、cmd】
        </div>
        <Progress
          style={{ marginTop: '10px' }}
          percent={Number(
            Number(
              (index /
                Number(
                  fileChunkedList.length == 0 ? 1 : fileChunkedList.length,
                )) *
                100,
            ).toFixed(0),
          )}
        />
        <div
          style={{
            marginTop: '10px',
            height: '10px',
            color: 'gray',
            fontSize: '12px',
          }}
        >
          {nowMessage}
        </div>
        {/* <Upload
          name="file"
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={doImgUpload}
          progress={{ strokeWidth: 2, showInfo: false }}
        >
          <Button type='primary' style={{ marginTop: '10px' }}>选择文件</Button>
        </Upload> */}
        <IUpload
          typeName={typeName}
          nameSpace="signDisk"
          requireFileSize={1024}
          location={location}
          buttonContent={
            <Button type="primary" disabled={isUploading} loading={isUploading} style={{ marginTop: '10px' }}>
              选择文件
            </Button>
          }
        />
      </GlobalModal>
      <Disk></Disk>
    </>
  );
}

export default connect(({ signDisk,uploadfile }) => ({
  signDisk,
  uploadfile,
}))(Buttons);
