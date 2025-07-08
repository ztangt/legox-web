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
    *getFileMD5(
      { payload, uploadSuccess, updateState, parentState, hisLocation },
      { call, put, select },
    ) {
      let namespace = payload.namespace;
      let file = payload.file;
      delete payload.file;
      delete payload.namespace;
      const { data } = yield call(
        apis.getFileMD5,
        payload,
        'getFileMD5',
        'uploadfile',
      );
      let index = '';
      let isFu = '';
      if (parentState) {
        index = parentState.index;
        isFu = parentState.isFu;
      } else if (hisLocation?.pathname == '/dynamicPage') {
        const { bizSolId, listId } = hisLocation.query;
        const { stateObj } = yield select((state) => state.dynamicPage);
        index = stateObj[`${bizSolId}-${listId}`].index;
        isFu = stateObj[`${bizSolId}-${listId}`].isFu;
      } else {
        index = yield select((state) => state[namespace])[index];
        isFu = yield select((state) => state[namespace])[isFu];
      }
      const { filePath, isPresigned } = payload;
      if (data.code == REQUEST_SUCCESS) {
        if (updateState) {
          updateState({
            getFileMD5Message: data.data,
          });
        } else {
          yield put({
            type: `${namespace}/updateStates`,
            payload: {
              getFileMD5Message: data.data,
            },
          });
        }
        const namespaceArr = ['notification','informationModal']
        if (namespaceArr.includes(namespace)) {
          if (data.data.have == 'Y') {
            const { uploadList } = yield select((state) => state[namespace]);
            yield put({
              type: `${namespace}/updateStates`,
              payload: {
                uploadList: uploadList.concat(data.data),
              },
            });
          }
        }
        // new
        // 传参isPresigned	？ YES（小于40M）
        if (isPresigned) {
          // 存在，返回对应minio路径及主键
          if (data.have === 'Y') {
            uploadSuccess &&
              uploadSuccess(
                data.data.filePath,
                data.data.fileId,
                file,
                data.data?.fileFullPath,
              );
            if (updateState) {
              updateState({
                fileExists: true,
                fileExistsFu: isFu && true,
                md5FileId: data.data.fileId,
                md5FilePath: data.data.filePath,
                // needfilepath: filePath
                needfilepath: data.data.filePath,
              });
            } else {
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
            }
            // 返回值have=N  ？不存在
            // 直接获取presignedUploadUrl，上传到指定url（前端自己传），再调用public/fileStorage/saveFileStorag（保存到数据库）
          } else {
            if (updateState) {
              updateState({
                needfilepath: filePath,
              });
            } else {
              yield put({
                type: `${namespace}/updateStates`,
                payload: {
                  needfilepath: filePath,
                },
              });
            }
            yield put({
              type: 'uploadStore',
              payload: {
                namespace: namespace,
                url: `${data.data.presignedUploadUrl}`,
                file: file,
              },
              uploadSuccess: uploadSuccess && uploadSuccess,
              updateState,
              parentState,
              hisLocation,
            });
          }
          // 传参isPresigned	？ NO（大于40M，需调用预上传接口）
        } else {
          // 存在，返回对应minio路径及主键
          if (data.have === 'Y') {
            uploadSuccess && uploadSuccess(data.data.filePath, '', file);
            if (updateState) {
              updateState({
                md5FileId: data.data.fileId,
                md5FilePath: data.data.filePath,
                fileExists: true,
                fileExistsFu: isFu && true,
                // needfilepath: filePath
                needfilepath: data.data.filePath,
              });
            } else {
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
            }
          } else {
            if (updateState) {
              updateState({
                needfilepath: filePath,
              });
            } else {
              yield put({
                type: `${namespace}/updateStates`,
                payload: {
                  needfilepath: filePath,
                },
              });
            }
            yield put({
              type: 'presignedUploadUrl',
              payload: {
                namespace: namespace,
                filePath: `${data.data.filePath}.${index}`,
                file: file,
              },
              uploadSuccess: uploadSuccess && uploadSuccess,
              updateState,
              parentState,
              hisLocation,
            });
          }
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //文件预上传
    *presignedUploadUrl(
      { payload, uploadSuccess, updateState, parentState, hisLocation },
      { call, put },
    ) {
      let namespace = payload.namespace;
      let file = payload.file;
      delete payload.file;
      delete payload.namespace;
      const { data } = yield call(
        apis.presignedUploadUrl,
        payload,
        'presignedUploadUrl',
        'uploadfile',
      );
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'uploadStore',
          payload: {
            namespace: namespace,
            url: `${data.data.presignedUploadUrl}`,
            file: file,
          },
          uploadSuccess: uploadSuccess,
          updateState,
          parentState,
          hisLocation
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //上传到minIO
    *uploadStore(
      { payload, uploadSuccess, updateState, parentState, hisLocation },
      { call, put, select },
    ) {
      let namespace = payload.namespace;
      let file = payload.file;
      delete payload.file;
      delete payload.namespace;
      let stateObj = [];
      let bizSolId = '';
      let listId = '';
      if (hisLocation?.pathname == '/dynamicPage') {
        let formShowState = yield select((state) => state.dynamicPage);
        stateObj = formShowState.stateObj;
        let tmpInfo = hisLocation.query;
        bizSolId = tmpInfo.bizSolId;
        listId = tmpInfo.listId;
      }
      const {
        fileName,
        fileChunkedList,
        index,
        md5,
        needfilepath,
        uploadFlag,
        fileSize,
      } = parentState
        ? parentState
        : (hisLocation&&hisLocation.pathname == '/dynamicPage')
        ? stateObj[`${bizSolId}-${listId}`]
        : yield select((state) => state[namespace]);
      try {
        yield call(async (url) => {
          let response = await fetch(url, {
            method: 'PUT',
            body: fileChunkedList[index],
          });
          return response;
        }, payload.url);
        if (updateState) {
          updateState({
            isStop: false,
            isContinue: false,
            nowMessage: '正在上传...',
          });
        } else {
          yield put({
            type: `${namespace}/updateStates`,
            payload: {
              isStop: false,
              isContinue: false,
              nowMessage: '正在上传...',
            },
          });
        }

        if (fileChunkedList.length - 1 != index) {
          // 此处为暂停判断器
          if (uploadFlag) {
            yield put({
              type: 'presignedUploadUrl',
              payload: {
                namespace: namespace,
                filePath: `${needfilepath}.${index + 1}`,
              },
              updateState,
              parentState,
            });
            if (updateState) {
              updateState({
                index: index + 1,
              });
            } else {
              yield put({
                type: `${namespace}/updateStates`,
                payload: {
                  index: index + 1,
                },
              });
            }
          } else {
            if (updateState) {
              updateState({
                nowMessage: '已暂停',
              });
            } else {
              yield put({
                type: `${namespace}/updateStates`,
                payload: {
                  nowMessage: '已暂停',
                },
              });
            }
          }
        } else {
          if (updateState) {
            updateState({
              isStop: true,
              isContinue: true,
              isCancel: true,
            });
          } else {
            yield put({
              type: `${namespace}/updateStates`,
              payload: {
                isStop: true,
                isContinue: true,
                isCancel: true,
              },
            });
          }

          if (fileSize > CHUNK_SIZE) {
            yield put({
              type: 'getFileMerage',
              payload: {
                namespace: namespace,
                filePath: needfilepath,
                fileName: fileName,
              },
              updateState,
              parentState,
              hisLocation,
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
                file: file,
                fileFullPath: payload?.url,
              },
              uploadSuccess: uploadSuccess,
              updateState,
              parentState,
            });
          }
        }
      } catch (e) {
        message.error(e);
      }
    },
    // 根据文件路径合并文件
    *getFileMerage(
      { payload, updateState, parentState, hisLocation },
      { call, put, select },
    ) {
      let namespace = payload.namespace;
      delete payload.namespace;
      const { data } = yield call(
        apis.getFileMerage,
        payload,
        'getFileMerage',
        'uploadfile',
      );
      let stateObj = {};
      let bizSolId = '';
      // let bizInfoId = '';
      // let currentTab = '';
      // let bizTaskId = '';
      let listId = '';

      // if (history.location.pathname == '/dynamicPage/formShow') {
      //   let formShowState = yield select((state) => state.formShow);
      //   stateObj = formShowState.stateObj;
      //   const { stateInfo } = yield select(
      //     (state) => state.designableBiz,
      //   );
      //   const cutomHeaders = parentState
      //   const bizModal = stateInfo?.[cutomHeaders?.mainTableId]?.bizModal
      //   const bizModalProps = stateInfo?.[cutomHeaders?.mainTableId]?.bizModalProps
      //   let tmpInfo =
      //     bizModal && bizModalProps?.bizSolId
      //       ? bizModalProps
      //       : history.location.query;
      //   bizSolId = tmpInfo.bizSolId;
      //   bizInfoId = tmpInfo.bizInfoId;
      //   currentTab = tmpInfo.currentTab;
      //   bizTaskId = tmpInfo.bizTaskId;
      // }
      if (hisLocation?.pathname == '/dynamicPage') {
        let formShowState = yield select((state) => state.dynamicPage);
        stateObj = formShowState.stateObj;
        let tmpInfo = hisLocation.query;
        bizSolId = tmpInfo.bizSolId;
        listId = tmpInfo.listId;
      }

      const { fileSize, md5, fileName } = parentState
        ? parentState
        : (hisLocation&&hisLocation.pathname == '/dynamicPage')
        ? stateObj[`${bizSolId}-${listId}`]
        : yield select((state) => state[namespace]);

      if (data.code == REQUEST_SUCCESS) {
        if (updateState) {
          updateState({
            merageFilepath: data.data,
            isStop: true,
            isContinue: true,
          });
        } else {
          yield put({
            type: `${namespace}/updateStates`,
            payload: {
              merageFilepath: data.data,
              isStop: true,
              isContinue: true,
            },
          });
        }

        yield put({
          type: 'storingFileInformation',
          payload: {
            namespace: namespace,
            fileName: fileName,
            fileSize: fileSize,
            filePath: data.data,
            fileEncryption: md5,
          },
          updateState,
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //存储文件信息到数据库接口
    *storingFileInformation(
      { payload, uploadSuccess, updateState },
      { call, put, select },
    ) {
      let namespace = payload.namespace;
      let file = payload.file;
      let fileFullPath = payload.fileFullPath;
      delete payload.fileFullPath;
      delete payload.file;
      delete payload.namespace;
      const { data } = yield call(
        apis.storingFileInformation,
        payload,
        'storingFileInformation',
        'uploadfile',
      );
      const { isFu } = yield select((state) => state[namespace]);

      if (data.code == REQUEST_SUCCESS) {
        uploadSuccess &&
          uploadSuccess(
            payload.filePath,
            data.data.fileStorageId,
            file,
            fileFullPath,
            data.data.fileFullPath,
          );
        if (updateState) {
          updateState({
            fileExists: false,
            fileExistsFu: isFu && false,
            fileStorageId: data.data.fileStorageId,
            htmlFileStorageId: data.data.fileStorageId,
            index: 0,
          });
        } else {
          yield put({
            type: `${namespace}/updateStates`,
            payload: {
              fileExists: false,
              fileExistsFu: isFu && false,
              fileStorageId: data.data.fileStorageId,
              htmlFileStorageId: data.data.fileStorageId,
              index: 0,
            },
          });
        }
        if (namespace == 'notification') {
          const { unUploadList } = yield select((state) => state.notification);
          yield put({
            type: `${namespace}/updateStates`,
            payload: {
              unUploadList: unUploadList.concat(data.data),
            },
          });
        }
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
