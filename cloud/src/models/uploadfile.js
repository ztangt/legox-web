import { message } from 'antd';
import apis from 'api';
import _ from 'lodash';
import { REQUEST_SUCCESS, CHUNK_SIZE } from '../service/constant';

export default {
  namespace: 'uploadfile',
  state: {},
  subscriptions: {},
  effects: {
    // 根据文件md5查询是否存在该文件
    *getFileMD5({ payload, uploadSuccess }, { call, put, select }) {
      let namespace = payload.namespace;
      delete payload.namespace;
      const { data } = yield call(apis.getFileMD5, payload);
      const { index } = yield select(state => state[namespace]);
      const { filePath, isPresigned } = payload;
      // `${namespace}/updateStatesSelf`
      if (data.code == REQUEST_SUCCESS) {
        yield put.resolve({
          type:
            namespace == 'organization'
              ? `${namespace}/updateStatesSelf`
              : `${namespace}/updateStates`,
          payload: {
            getFileMD5Message: data.data,
          },
        });
        // new
        // 传参isPresigned	？ YES（小于40M）
        if (isPresigned) {
          // 存在，返回对应minio路径及主键
          if (data.have === 'Y') {
            uploadSuccess &&
              uploadSuccess(
                data.data.filePath,
                data.data.fileFullPath,
                data.data.fileId,
              );
            yield put.resolve({
              type:
                namespace == 'organization'
                  ? `${namespace}/updateStatesSelf`
                  : `${namespace}/updateStates`,
              payload: {
                fileExists: true,
                md5FileId: data.data.fileId,
                md5FilePath: data.data.filePath,
                // needfilepath: filePath,
                needfilepath: data.data.filePath,
              },
            });
            // 返回值have=N  ？不存在
            // 直接获取presignedUploadUrl，上传到指定url（前端自己传），再调用public/fileStorage/saveFileStorag（保存到数据库）
          } else {
            yield put.resolve({
              type:
                namespace == 'organization'
                  ? `${namespace}/updateStatesSelf`
                  : `${namespace}/updateStates`,
              payload: {
                needfilepath: filePath,
              },
            });
            yield put({
              type: 'uploadStore',
              payload: {
                namespace: namespace,
                url: `${data.data.presignedUploadUrl}`,
              },
              uploadSuccess: uploadSuccess && uploadSuccess,
            });
          }
          // 传参isPresigned	？ NO（大于40M，需调用预上传接口）
        } else {
          // 存在，返回对应minio路径及主键
          if (data.have === 'Y') {
            uploadSuccess &&
              uploadSuccess(data.data.filePath, data.data.fileFullPath);
            yield put.resolve({
              type:
                namespace == 'organization'
                  ? `${namespace}/updateStatesSelf`
                  : `${namespace}/updateStates`,
              payload: {
                md5FileId: data.data.fileId,
                md5FilePath: data.data.filePath,
                fileExists: true,
                needfilepath: filePath,
              },
            });
          } else {
            yield put.resolve({
              type:
                namespace == 'organization'
                  ? `${namespace}/updateStatesSelf`
                  : `${namespace}/updateStates`,
              payload: {
                needfilepath: filePath,
              },
            });
            yield put.resolve({
              type: 'presignedUploadUrl',
              payload: {
                namespace: namespace,
                filePath: `${data.data.filePath}.${index}`,
              },
              uploadSuccess: uploadSuccess && uploadSuccess,
            });
          }
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //文件预上传
    *presignedUploadUrl({ payload, uploadSuccess }, { call, put }) {
      let namespace = payload.namespace;
      delete payload.namespace;
      const { data } = yield call(apis.presignedUploadUrl, payload);
      if (data.code == REQUEST_SUCCESS) {
        yield put.resolve({
          type: 'uploadStore',
          payload: {
            namespace: namespace,
            url: `${data.data.presignedUploadUrl}`,
          },
          uploadSuccess: uploadSuccess,
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //上传到数据库
    *uploadStore({ payload, uploadSuccess }, { call, put, select }) {
      let namespace = payload.namespace;
      delete payload.namespace;
      const {
        fileName,
        fileChunkedList,
        index,
        md5,
        needfilepath,
        uploadFlag,
        fileSize,
      } = yield select(state => state[namespace]);
      try {
        yield call(async url => {
          let response = await fetch(url, {
            method: 'PUT',
            body: fileChunkedList[index],
          });
          return response;
        }, payload.url);

        yield put.resolve({
          type:
            namespace == 'organization'
              ? `${namespace}/updateStatesSelf`
              : `${namespace}/updateStates`,
          payload: {
            isStop: false,
            isContinue: false,
            nowMessage: '正在上传...',
          },
        });

        if (fileChunkedList.length - 1 != index) {
          // 此处为暂停判断器
          if (uploadFlag) {
            yield put.resolve({
              type: 'presignedUploadUrl',
              payload: {
                namespace: namespace,
                filePath: `${needfilepath}.${index + 1}`,
              },
            });
            yield put.resolve({
              type:
                namespace == 'organization'
                  ? `${namespace}/updateStatesSelf`
                  : `${namespace}/updateStates`,
              payload: {
                index: index + 1,
              },
            });
          } else {
            yield put.resolve({
              type:
                namespace == 'organization'
                  ? `${namespace}/updateStatesSelf`
                  : `${namespace}/updateStates`,
              payload: {
                nowMessage: '已暂停',
              },
            });
          }
        } else {
          yield put.resolve({
            type:
              namespace == 'organization'
                ? `${namespace}/updateStatesSelf`
                : `${namespace}/updateStates`,
            payload: {
              isStop: true,
              isContinue: true,
              isCancel: true,
            },
          });
          if (fileSize > CHUNK_SIZE) {
            yield put.resolve({
              type: 'getFileMerage',
              payload: {
                namespace: namespace,
                filePath: needfilepath,
                fileName: fileName,
              },
            });
          } else {
            yield put.resolve({
              type: 'storingFileInformation',
              payload: {
                namespace: namespace,
                fileName: fileName,
                fileSize: fileSize,
                filePath: needfilepath,
                fileEncryption: md5,
              },
              uploadSuccess: uploadSuccess,
            });
          }
        }
      } catch (e) {
        message.error(e);
      }
    },
    // 根据文件路径合并文件
    *getFileMerage({ payload }, { call, put, select }) {
      let namespace = payload.namespace;
      delete payload.namespace;
      const { data } = yield call(apis.getFileMerage, payload);
      const { fileSize, md5, fileName } = yield select(
        state => state[namespace],
      );

      if (data.code == REQUEST_SUCCESS) {
        yield put.resolve({
          type:
            namespace == 'organization'
              ? `${namespace}/updateStatesSelf`
              : `${namespace}/updateStates`,
          payload: {
            merageFilepath: data.data,
            isStop: true,
            isContinue: true,
          },
        });

        yield put.resolve({
          type: 'storingFileInformation',
          payload: {
            namespace: namespace,
            fileName: fileName,
            fileSize: fileSize,
            filePath: data.data,
            fileEncryption: md5,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //存储文件信息到数据库接口
    *storingFileInformation({ payload, uploadSuccess }, { call, put, select }) {
      let namespace = payload.namespace;
      delete payload.namespace;
      const { data } = yield call(apis.storingFileInformation, payload);
      if (data.code == REQUEST_SUCCESS) {
        uploadSuccess &&
          uploadSuccess(
            payload.filePath,
            data.data.fileFullPath,
            data.data.fileStorageId,
          );
        yield put.resolve({
          type:
            namespace == 'organization'
              ? `${namespace}/updateStatesSelf`
              : `${namespace}/updateStates`,
          payload: {
            fileExists: false,
            fileStorageId: data.data.fileStorageId,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
