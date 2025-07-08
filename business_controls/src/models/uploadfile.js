import { message } from 'antd';
import apis from 'api';
import { CHUNK_SIZE, REQUEST_SUCCESS } from '../service/constant';

export default {
  namespace: 'uploadfile',
  state: {
    getFileMD5Message: {}, //md5返回的文件信息
  },
  subscriptions: {},
  effects: {
    // 根据文件md5查询是否存在该文件
    *getFileMD5({ payload, uploadSuccess }, { call, put, select }) {
      let namespace = payload.namespace;
      delete payload.namespace;
      const { data } = yield call(apis.getFileMD5, payload, '', 'uploadfile');
      const { index, isFu } = yield select((state) => state[namespace]);
      const { filePath, isPresigned } = payload;
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: `${namespace}/updateStates`,
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
              uploadSuccess(data.data.filePath, data.data.fileId);
            yield put({
              type: `${namespace}/updateStates`,
              payload: {
                fileExists: true,
                fileExistsFu: isFu && true,
                md5FileId: data.data.fileId,
                md5FilePath: data.data.filePath,
                // needfilepath: filePath
                needfilepath: data.data.filePath,
              },
            });
            // 返回值have=N  ？不存在
            // 直接获取presignedUploadUrl，上传到指定url（前端自己传），再调用public/fileStorage/saveFileStorag（保存到数据库）
          } else {
            yield put({
              type: `${namespace}/updateStates`,
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
            uploadSuccess && uploadSuccess(data.data.filePath);
            yield put({
              type: `${namespace}/updateStates`,
              payload: {
                md5FileId: data.data.fileId,
                md5FilePath: data.data.filePath,
                fileExists: true,
                fileExistsFu: isFu && true,
                // needfilepath: filePath
                needfilepath: data.data.filePath,
              },
            });
          } else {
            yield put({
              type: `${namespace}/updateStates`,
              payload: {
                needfilepath: filePath,
              },
            });
            yield put({
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
      const { data } = yield call(
        apis.presignedUploadUrl,
        payload,
        '',
        'uploadfile',
      );
      if (data.code == REQUEST_SUCCESS) {
        yield put({
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
    //上传到minIO
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
      } = yield select((state) => state[namespace]);
      try {
        yield call(async (url) => {
          let response = await fetch(url, {
            method: 'PUT',
            body: fileChunkedList[index],
          });
          return response;
        }, payload.url);

        yield put({
          type: `${namespace}/updateStates`,
          payload: {
            isStop: false,
            isContinue: false,
            nowMessage: '正在上传...',
          },
        });

        if (fileChunkedList.length - 1 != index) {
          // 此处为暂停判断器
          if (uploadFlag) {
            yield put({
              type: 'presignedUploadUrl',
              payload: {
                namespace: namespace,
                filePath: `${needfilepath}.${index + 1}`,
              },
            });
            yield put({
              type: `${namespace}/updateStates`,
              payload: {
                index: index + 1,
              },
            });
          } else {
            yield put({
              type: `${namespace}/updateStates`,
              payload: {
                nowMessage: '已暂停',
              },
            });
          }
        } else {
          yield put({
            type: `${namespace}/updateStates`,
            payload: {
              isStop: true,
              isContinue: true,
              isCancel: true,
            },
          });
          if (fileSize > CHUNK_SIZE) {
            yield put({
              type: 'getFileMerage',
              payload: {
                namespace: namespace,
                filePath: needfilepath,
                fileName: fileName,
              },
            });
          } else {
            yield put({
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
      const { data } = yield call(
        apis.getFileMerage,
        payload,
        '',
        'uploadfile',
      );
      const { fileSize, md5, fileName } = yield select(
        (state) => state[namespace],
      );

      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: `${namespace}/updateStates`,
          payload: {
            merageFilepath: data.data,
            isStop: true,
            isContinue: true,
          },
        });

        yield put({
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
      const { data } = yield call(
        apis.storingFileInformation,
        payload,
        '',
        'uploadfile',
      );
      const { isFu } = yield select((state) => state[namespace]);

      if (data.code == REQUEST_SUCCESS) {
        uploadSuccess && uploadSuccess(payload.filePath);
        yield put({
          type: `${namespace}/updateStates`,
          payload: {
            fileExists: false,
            fileExistsFu: isFu && false,
            fileStorageId: data.data.fileStorageId,
            htmlFileStorageId: data.data.fileStorageId,
          },
        });
        // if (isFu) {
        //   yield put({
        //     type: 'getDownFileUrl',
        //     payload: {
        //       namespace: namespace,
        //       fileStorageId: data.data.fileStorageId,
        //     },
        //   });
        // }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // //获取下载地址url
    // *getDownFileUrl({ payload, callback }, { call, put, select }) {
    //   let namespace = payload.namespace;

    //   const { data } = yield call(apis.getDownFileUrl, payload);
    //   if (data.code == REQUEST_SUCCESS) {
    //     yield put({
    //       type: `${namespace}/updateStates`,
    //       payload: {
    //         noticeHtmlUrl: data.data.fileUrl,
    //         fileExistsFu: false,
    //       },
    //     });
    //     callback && callback(data.data.fileUrl);
    //   } else if (data.code != 401 && data.code != 419 && data.code !=403) {
    //     message.error(data.msg);
    //   }
    // },
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
