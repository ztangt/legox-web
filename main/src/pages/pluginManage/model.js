import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import { v4 as uuidv4 } from 'uuid';
import SparkMD5 from 'spark-md5';
import { dataFormat } from '../../util/util';
import uploader from '../../service/uploaderRequest';

const {
  getPlugList,
  addPlug,
  changePlug,
  deletePlug,
  enablePlug,
  movePlug,
  getPlugTypeList,
  addPlugType,
  changePlugType,
  removePlugType,
  getPlugListLogin,
  getDownFileUrl
} = apis;
export default {
  namespace: 'pluginManage',
  state: {
    uploadFlag: true, //上传暂停器
    nowMessage: '', //提示上传进度的信息
    md5: '', //文件的md5值，用来和minio文件进行比较
    fileChunkedList: [], //文件分片完成之后的数组
    fileName: '', //文件名字
    fileNames: '', //文件前半部分名字
    fileStorageId: '', //存储文件信息到数据库接口返回的id
    typeNames: '', //文件后缀名
    optionFile: {}, //文件信息
    fileSize: '', //文件大小，单位是字节
    getFileMD5Message: {}, //md5返回的文件信息
    success: '', //判断上传路径是否存在
    v: 1, //计数器
    needfilepath: '', //需要的minio路径
    isStop: true, //暂停按钮的禁用
    isContinue: false, //继续按钮的禁用
    isCancel: false, //取消按钮的禁用
    index: 0, //fileChunkedList的下标，可用于计算上传进度
    merageFilepath: '', //合并后的文件路径
    typeName: '', //层级
    fileExists: '', //判断文件是否存在于minio服务器中，相关modal中监听判断fileExists状态进行后续分别操作
    md5FileId: '', //md5查询到的文件返回的id
    md5FilePath: '', //md5查询到的文件返回的pathname
    ///////////
    //左列表
    treeData: [],
    currentNodeId: '',
    //右列表
    selectedRowKeys: [], //当前选中
    limit: 10,
    returnCount: 0,
    allPage: 0,
    currentPage: 1,
    //新建分类
    isShowAddPlugType: 0,
    changePlugTypeInfo: {},
    //新建插件
    isShowAddPlugin: 0,
    changePlugInfo: {}, //修改插件
    uploadFileId: '',
    uploadFileEx: '', //文件名后缀
    leftList: [
      {
        key: '2',
        nodeName: '插件操作手册',
        nodeNumber: '2',
        title: '插件操作手册',
        sort: 1,
        nodeType: 'PLUG__OPERATION',
        isParent: '0',
        parentId: '',
        children: null,
      },
      {
        key: '3',
        nodeName: '插件',
        title: '插件',
        nodeNumber: '2',
        sort: 1,
        nodeType: 'PLUG__PLUG',
        isParent: '0',
        parentId: '',
        children: null,
      },
    ],
    rightList: [],
    //显示上传成功的文件
    successFile: '',
    leftNum:220,
    isUploading: false,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen(location => {
        
      });
    },
  },
  effects: {
    //获取分类列表
    *getPlugTypeList({ payload, callback }, { call, put, select }) {
      try {
        // payload.tenantId = window.localStorage.getItem('tenantId');
        const { data } = yield call(getPlugTypeList, payload);
        if (data.code == REQUEST_SUCCESS) {
          var treeData = data.data.list;
          const { currentNodeId } = yield select(state => state.pluginManage);
          var curNodeId = currentNodeId;
          if (treeData?.length != 0) {
            if (curNodeId == '') {
              curNodeId = treeData[0].plugTypeId;
            }
            treeData.forEach(element => {
              element.key = element.plugTypeId;
            });
          }
          yield put({
            type: 'updateStates',
            payload: { treeData, currentNodeId: curNodeId },
          });
          callback && callback(data.data, curNodeId);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addPlugType({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(addPlugType, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getPlugTypeList',
            payload: {},
          });
          yield put({
            type: 'updateStates',
            payload: { isShowAddPlugType: false },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *changePlugType({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(changePlugType, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getPlugTypeList',
            payload: {},
          });
          yield put({
            type: 'updateStates',
            payload: { isShowAddPlugType: false },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *removePlugType({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(removePlugType, payload);
        if (data.code == REQUEST_SUCCESS) {
          const { currentNodeId } = yield select(state => state.pluginManage);
          var needUpdate = currentNodeId == payload.plugTypeId;
          if (needUpdate) {
            yield put({
              type: 'updateStates',
              payload: { currentNodeId: '' },
            });
          }
          yield put({
            type: 'getPlugTypeList',
            payload: {},
          });
          yield put({
            type: 'getPlugList',
            payload: { start: 0, limit: 10 },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //获取插件列表
    *getPlugList({ payload }, { call, put, select }) {
      try {
        if (!payload.plugTypeId || payload.plugTypeId == '') {
          const { currentNodeId, treeData } = yield select(
            state => state.pluginManage,
          );
          if (currentNodeId == '') {
            if (treeData.length != 0) {
              payload.plugTypeId = treeData[0].plugTypeId;
            } else {
              return;
            }
          } else {
            payload.plugTypeId = currentNodeId;
          }
        }
        const { data } = yield call(getPlugListLogin, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              returnCount: data.data.returnCount,
              currentPage: data.data.currentPage,
              allPage: data.data.allPage,
              rightList: data.data.list,
              limit: payload.limit,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //添加插件
    *addPlug({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(addPlug, payload);
        const { currentNodeId, currentPage, limit } = yield select(
          state => state.pluginManage,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              isShowAddPlugin: false,
              currentNodeId: payload.plugTypeId,
            },
          });
          yield put({
            type: 'getPlugList',
            payload: {
              plugTypeId: payload.plugTypeId,
              start: currentPage,
              limit: limit,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //修改插件
    *changePlug({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(changePlug, payload);
        const { currentNodeId, currentPage, limit } = yield select(
          state => state.pluginManage,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              isShowAddPlugin: false,
              changePlugInfo: {},
              currentNodeId: payload.plugTypeId,
            },
          });
          yield put({
            type: 'getPlugList',
            payload: {
              plugTypeId: payload.plugTypeId,
              start: currentPage,
              limit: limit,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    //删除插件
    *deletePlug({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(deletePlug, payload);
        const { currentNodeId, currentPage, limit } = yield select(
          state => state.pluginManage,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              selectedRowKeys: [],
            },
          });
          yield put({
            type: 'getPlugList',
            payload: {
              plugTypeId: currentNodeId,
              start: currentPage,
              limit: limit,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    //启用禁用插件
    *enablePlug({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(enablePlug, payload);
        const { currentNodeId, currentPage, limit } = yield select(
          state => state.pluginManage,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              selectedRowKeys: [],
            },
          });
          yield put({
            type: 'getPlugList',
            payload: {
              plugTypeId: currentNodeId,
              start: currentPage,
              limit: limit,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    //移动插件
    *movePlug({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(movePlug, payload);
        const { currentNodeId, currentPage, limit } = yield select(
          state => state.pluginManage,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getPlugList',
            payload: {
              plugTypeId: currentNodeId,
              start: currentPage,
              limit: limit,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    //上传文件
    *doUploader({ payload, callback }, { call, put, select }) {
      try {
        let action = 'POST public/fileStorage/uploaderFile';
        uploader(action, payload).then(data => {
          if (data.data.code == REQUEST_SUCCESS) {
            callback && callback(1, data.data.data);
          } else {
            callback && callback(0, data.data.data);
            message.error(data.data.msg, 5);
          }
        });
      } catch (e) {
        console.log('e', e);
      } finally {
      }
    },

    // 上传插件
    *getpluginToMinio({ payload, callback }, { call, put, select }) {
      try {
        const file = new File([payload.file], payload.fileName[0]);
        const fileMD5 = SparkMD5.hashBinary(payload.file);

        yield put({
          type: 'updateStates',
          payload: {
            fileChunkedList: [file],
            md5: fileMD5,
            fileName: payload.fileName.join('.'),
            fileSize: file.size,
            uploadFileEx: payload.fileName[1],
          },
        });

        // 上传mio;
        yield put({
          type: 'uploadfile/getFileMD5',
          payload: {
            namespace: 'pluginManage',
            isPresigned: 1,
            fileEncryption: fileMD5,
            filePath: `pluginManage/${dataFormat(
              String(new Date().getTime()).slice(0, 10),
              'YYYY-MM-DD',
            )}/${file.name}.${payload.fileName[1]}`,
          },
          uploadSuccess: (...args) => {
            callback(...args);
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
     //获取下载地址url
     *getDownFileUrl({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getDownFileUrl, payload);
      if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data.fileUrl);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
    },
  },
  reducers: {
    updateStates(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
