import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import { dataFormat } from '../../util/util';
import { v4 as uuidv4 } from 'uuid';
import SparkMD5 from 'spark-md5';
import { parse } from 'query-string';
import { history } from 'umi'
const { getFuncLibList, saveFuncLib, updateFuncLib, delFuncLib, exportFunclib } = apis;
export default {
  namespace: 'funManage', //按钮库
  state: {
    loading: false,
    addModal: false,
    isShow: false,
    addObj: {},
    buttonsList: [],
    parentIds: [],
    searchValue: '',
    fileChunkedList: [], // 文件上传用，文件列表
    currentPage: 1,
    limit: 0,
    returnCount: 0,
    index: 0,
    md5: '', // 文件上传用，md5格式
    fileName: '', // 文件名
    fileSize: 0, // 文件大小
    fileExists: true,
    filePath: '',
    md5FileId: '',
    md5FilePath: '',
    needfilepath: '',
    fileStorageId: '', //存储信息到数据库返回id
    getFileMD5Message: {}, //md5返回的文件信息
    uploadFlag: true, //上传暂停器
    isStop: true, //暂停按钮的禁用
    isContinue: false, //继续按钮的禁用
    isCancel: false, //取消按钮的禁用
    quoteButtons: [],//引用按钮数据（全部）
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
    },
  },
  effects: {
    *getFuncLibList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getFuncLibList, payload);
        const { searchValue, limit, currentPage } = yield select(state => state.funManage);

        if (data.code == REQUEST_SUCCESS) {
          
          if ((data.data.allPage > 0) && (data.data.allPage < data.data.currentPage)) {
            yield put({
              type: 'updateStates',
              payload: {
                currentPage : currentPage - 1,
              },
            });

          } else {
            yield put({
              type: 'updateStates',
              payload: {
                funList: data.data.list,
                returnCount: data.data.returnCount,
              },
            });
            callback && callback();
          }
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *saveFuncLib({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(saveFuncLib, payload);
        const { searchValue, limit, currentPage } = yield select(state => state.funManage);
        console.log('data----新增', data);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getFuncLibList',
            payload: {
              searchValue,
              start: currentPage,
              limit,
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
          yield put({
            type: 'updateStates',
            payload: {
              loading: false,
            },
          });
        }
      } catch (e) {
      } finally {
      }
    },
    *updateFuncLib({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(updateFuncLib, payload);
        const { searchValue, limit, currentPage } = yield select(state => state.funManage);
        console.log('data----修改', data, searchValue);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getFuncLibList',
            payload: {
              searchValue,
              start: currentPage,
              limit,
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
          yield put({
            type: 'updateStates',
            payload: {
              loading: false,
            },
          });
        }
      } catch (e) {
      } finally {
      }
    },
    //导出
    *exportApplyCorrelation({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(exportFunclib, payload)
        if (data.code == 200) {
          window.location.href = data.data
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      }catch (e) {
        console.log(e);
      } finally { }
    },
    *delFuncLib({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(delFuncLib, payload);
        const { searchValue, limit, currentPage } = yield select(state => state.funManage);
        console.log('data----删除', data);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getFuncLibList',
            payload: {
              searchValue,
              start: currentPage,
              limit,
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // js文件上传到minio
    *getScriptFileToMinio({ payload, callback }, { call, put, select }) {
      const { fileString, buttonId, thenEventRelative } = payload
      console.log(fileString, 'fileString');
      try {
        const blob = new Blob([fileString], { type: 'text/javascript' });
        const file = new File([blob], uuidv4(), {
          type: 'text/javascript',
        });
        console.log(file, 'file==');
        const fileMD5 = SparkMD5.hashBinary(fileString);

        yield put.resolve({
          type: 'updateStates',
          payload: {
            fileChunkedList: [file],
            md5: fileMD5,
            fileName: `${file.name}.js`,
            fileSize: file.size,
          },
        });
        // 上传mio;
        yield put.resolve({
          type: 'uploadfile/getFileMD5',
          payload: {
            namespace: 'funManage',
            isUpdate: 1,
            isPresigned: 1,
            fileEncryption: fileMD5,
            filePath: buttonId && thenEventRelative ? thenEventRelative :
              `funManage/${dataFormat(
                String(new Date().getTime()).slice(0, 10),
                'YYYY-MM-DD',
              )}/${file.name}.js`,
          },
          uploadSuccess: callback,
        });
      } catch (e) {
        console.error(e);
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
