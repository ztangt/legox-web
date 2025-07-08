import { connect } from 'dva';
import { useEffect ,useState} from 'react';
import lodash from 'lodash';
import {
  message,
  Input,
  Button,
  Modal,
  Table,
  InputNumber,
  Progress,
} from 'antd';
import { CHUNK_SIZE } from '../../../service/constant';
import styles from './buttons.less';
import Disk from './moveOrCopy';
import Authority from './authority';
import Menus from './menu';
import IUpload from '../../../componments/Upload/uploadModal';
import { plusUpdateTreeData, updateTreeData } from '../../../componments/public/treeChange';
import GlobalModal from '../../../componments/GlobalModal';
import {getDiskFileType} from '../../../util/util'
import Breadcrumb from './header/breadcrumb';

function Buttons({ dispatch, publicDisk, location,changeSelectTreeId}) {
  const {
    start,
    limit,
    showNewDir,
    dirName,
    treeId,
    list,
    AllList,
    sortVisible,
    sortJson,
    search,
    uploadVisible,
    index,
    isStop,
    isContinue,
    typeNames,
    isCancel,
    fileNames,
    publicTreeData,
    selectedKeysValue,
    fileExists,
    fileSize,
    getFileMD5Message,
    merageFilepath,
    fileStorageId,
    nowMessage,
    fileChunkedList,
    needfilepath,
    typeName,
    selectTreeUrl,
    isUploading
  } = publicDisk;
const [searchValue,setSearchValue]=useState('')
  useEffect(() => {
    // 如果文件存在于minio
    if ((fileExists || fileExists === false)&&fileNames) {
      dispatch({
        type: 'publicDisk/postUpload_CommonDisk',
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
          fileId: fileExists ? getFileMD5Message.fileId : fileStorageId,
        },
        callback: () => {
          dispatch({
            type: 'publicDisk/updateStates',
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
    //     type: 'publicDisk/postUpload_CommonDisk',
    //     payload: {
    //       name: fileNames,
    //       type: typeNames,
    //       size: fileSize,
    //       parent: selectedKeysValue,
    //       filePath: fileSize > CHUNK_SIZE ? merageFilepath : needfilepath,
    //       sort: 0,
    //       fileId: fileStorageId
    //     },
    //     callback: () => {
    //       dispatch({
    //         type: 'publicDisk/updateStates',
    //         payload: {
    //           fileExists: ''
    //         }
    //       });
    //     }
    //   });
    // }
  }, [fileExists]);

  const onSearch = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        search: searchValue,
        start: 1,
      },
    });
  };
  const changeValue=(e)=>{
    setSearchValue(e.target.value)
  }

  const onChange = (e) => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        dirName: e.target.value,
      },
    });
  };

  const onCancel = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        showNewDir: false,
        dirName: '',
      },
    });
  };

  const onOk = () => {
    if (dirName != '' && dirName != null) {
      dispatch({
        type: 'publicDisk/postNewDir_CommonDisk',
        payload: {
          name: dirName,
          parent: treeId,
          type: '',
          sort: 0,
        },
        callback: (id) => {
          let addUrl = {
            title: dirName,
            key: id,
          };
          let addNodes = {
            title: dirName,
            key: id,
            isLeaf: true,
            url:
              selectTreeUrl || [{ key: '0', title: '公共文件' }].concat(addUrl),
          };
          dispatch({
            type: 'publicDisk/getPagingList_CommonDisk_List',
            payload: {
              start: start,
              limit: 300,
              id: treeId,
              name: searchValue,
              type: 'L',
            },
            callback: (nowData) => {
              // const newDisk = nowData.filter(item=>item.cloudDiskType == '文件夹')  
              // newDisk.forEach(element => {
              //     element.key = element.id
              //     element.title = element.cloudDiskName
              //     element.isLeaf = true
              // });
              // console.log("newDisk",newDisk)
              dispatch({
                type: 'publicDisk/getPagingList_CommonDisk_Tree',
                payload: {
                  start: 1,
                  limit: 200,
                  id: treeId,
                  name: '',
                  type: 'T',
                },
                callback: (data) => {
                  
                  data.map((item) => {
                    let curUrl = [{ title: item.title, key: item.key }];
                    let AddUrl = selectTreeUrl.concat(curUrl);
                    item.url = AddUrl;
                  });
                  console.log(data)
                  dispatch({
                    type: 'publicDisk/updateStates',
                    payload: {
                      publicTreeData: updateTreeData(
                        publicTreeData,
                        treeId,
                        data,
                      ),
                      dirName: '',
                      showNewDir: false,
                    },
                  });
                },
              });
            },
            // callback: (data) => {
            //   console.log(data,"新建文件夹获取Disk目录树")
            //   console.log(treeId,"treeId=========")
            //   console.log(selectedKeysValue,"selectedKeysValue=========")
            //   dispatch({
            //     type: 'publicDisk/updateStates',
            //     payload: {
            //       publicTreeData: plusUpdateTreeData(publicTreeData, selectedKeysValue, addNodes),
            //       dirName: '',
            //       showNewDir: false,
            //     }
            //   });
            // }
          });
        },
      });

      dispatch({
        type: 'publicDisk/updateStates',
        payload: {
          dirName: '',
          showNewDir: false,
        },
      });
    } else {
      message.warning('输入不能为空！');
    }
  };

  const onNumberChange = (e, text, round) => {
    const newList = AllList.map((item) => {
      if (item.id === text.id) {
        item.sort = round;
      }
      return item;
    });
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        sortJson: newList,
      },
    });
  };

  const numberOk = () => {
    console.log('排序确定按钮');
    dispatch({
      type: 'publicDisk/putSort_CommonDisk',
      payload: {
        dataJson: JSON.stringify(sortJson),
      },
      callback: () => {
        dispatch({
          type: 'publicDisk/updateStates',
          payload: {
            sortVisible: false,
          },
        });
        dispatch({
          type: 'publicDisk/getPagingList_CommonDisk_List',
          payload: {
            start: start,
            limit: limit,
            id: treeId,
            name: search,
            type: 'L',
          },
          callback: (data) => {
            dispatch({
              type: 'publicDisk/updateStates',
              payload: {
                list: list ? lodash.sortBy(list, 'sort') : [],
              },
            });
          },
        });
      },
    });
  };

  const numberCancel = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        sortVisible: false,
      },
    });
  };

  const uploadStop = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        uploadFlag: false,
      },
    });
  };

  const uploadContinue = () => {
    dispatch({
      type: 'publicDisk/updateStates',
      payload: {
        uploadFlag: true,
      },
    });
    dispatch({
      type: 'uploadfile/presignedUploadUrl',
      payload: {
        namespace: 'publicDisk',
        filePath: `${needfilepath}/${index + 1}`
      },
    });
  };
  const uploadCancel = () => {
    dispatch({
      type: 'publicDisk/updateStates',
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
  console.log("isUploading123",isUploading,"isCancel",isCancel)
  
  return (
    <>
      <div className={styles.search}>
        {/* <Input
          className={styles.searchInput}
          placeholder="请输入文件名"
          // allowClear
          size="middle"
          // onSearch={onSearch}
          // enterButton={
          //   <img
          //     src={require('../../../../public/assets/high_search.svg')}
          //     style={{ margin: '0 8px 2px 0' }}
          //   />
          // }
          onChange={changeValue}
        />
        <Button
          type="primary"
          style={{ margin: '0 8px' }}
          onClick={onSearch}
          className={styles.button_width}
        >
          查询
        </Button> */}
        <Breadcrumb selectTreeUrl={selectTreeUrl} changeSelectTreeId={changeSelectTreeId}/>
      </div>
      <div className={styles.menus}>
        <Menus></Menus>
      </div>
      <GlobalModal
        title="排序"
        visible={sortVisible}
        widthType={1}
        onOk={numberOk}
        onCancel={numberCancel}
        mask={false}
        getContainer={() => {
          return document.getElementById('container_public')||false;
        }}
        // bodyStyle={{ height: '430px', overflowY: 'hidden' }}
      >
        <Table
          rowKey="id"
          columns={loopColumns}
          dataSource={AllList}
          className={styles.sort}
          pagination={false}
          scroll={{ y: 'calc(100% - 47px)' }}
        />
      </GlobalModal>
      <GlobalModal
        title="上传文件"
        // bodyStyle={{ height: 170 }}
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
          return document.getElementById('container_public')||false;
        }}
      >
        <div className={styles.hintMessage}>
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
          className={styles.nowMessage}
        >
          {nowMessage}
        </div>
        {/* <Upload
          name="file"
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={doUpload}
        >
          <Button type='primary' disabled={isCancel} style={{ marginTop: '10px' }}>选择文件</Button>
        </Upload> */}

        <IUpload
          typeName={typeName}
          nameSpace="publicDisk"
          requireFileSize={1024}
          location={location}
          buttonContent={
            <Button
              type="primary"
              disabled={isCancel?true:isUploading}
              loading={isUploading}
              style={{ marginTop: '10px' }}
            >
              选择文件
            </Button>
          }
        />
      </GlobalModal>
      <Modal
        className={styles.addModal}
        visible={showNewDir}
        title="新建文件夹"
        onCancel={onCancel}
        onOk={onOk}
        bodyStyle={{ height: 110,padding: 16 }}
        width={400}
        mask={false}
        getContainer={() => {
          return document.getElementById('container_public')||false;
        }}
      >
        <Input
          value={dirName}
          placeholder="请输入文件夹名称"
          onChange={onChange}
        />
      </Modal>
      {/* <Authority></Authority> */}
      {/* <Disk></Disk> */}
    </>
  );
}

export default connect(({ publicDisk, uploadfile }) => ({
  publicDisk,
  uploadfile,
}))(Buttons);
