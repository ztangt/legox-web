import { message } from 'antd';
import apis from 'api';
import { history } from 'umi';
import { CHUNK_SIZE, REQUEST_SUCCESS } from '../service/constant';
export default {
    namespace: 'uploadfile',
    state: {
        getFileMD5Message: {}, //md5返回的文件信息
    },
    effects: {
        // 根据文件md5查询是否存在该文件
        *getFileMD5({ payload, uploadSuccess }, { call, put, select }) {
            let namespace = payload.namespace;
            let file = payload.file;
            delete payload.file;
            delete payload.namespace;
            const { data } = yield call(apis.getFileMD5, payload, '', 'uploadfile');
            let index = '';
            let isFu = '';
            if (history.location.pathname == '/dynamicPage/formShow') {
                const { stateObj } = yield select((state) => state.formShow);
                const { stateInfo } = yield select((state) => state.designableBiz);
                const cutomHeaders =
                    stateObj[getParam()?.bizSolId + '_' + getParam()?.bizInfoId + '_' + getParam()?.currentTab]
                        ?.cutomHeaders;
                const bizModal = stateInfo?.[cutomHeaders?.mainTableId]?.bizModal;
                const bizModalProps = stateInfo?.[cutomHeaders?.mainTableId]?.bizModalProps;
                let loQuery = history.location?.query || {};
                const { bizSolId, bizInfoId, currentTab, bizTaskId } =
                    bizModal && bizModalProps?.bizSolId ? bizModalProps : loQuery;
                index = stateObj[bizSolId + '_' + bizInfoId + '_' + currentTab].index;
                isFu = stateObj[bizSolId + '_' + bizInfoId + '_' + currentTab].isFu;
            } else if (history.location.pathname == '/dynamicPage') {
                const { bizSolId = '', listId = '' } = history.location?.query || {};
                const { stateObj } = yield select((state) => state.dynamicPage);
                index = stateObj[`${bizSolId}-${listId}`].index;
                isFu = stateObj[`${bizSolId}-${listId}`].isFu;
            } else {
                index = yield select((state) => state[namespace])[index];
                isFu = yield select((state) => state[namespace])[isFu];
            }
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
                            uploadSuccess(data.data.filePath, data.data.fileId, file, data.data?.fileFullPath);
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
                                file: file,
                            },
                            uploadSuccess: uploadSuccess && uploadSuccess,
                        });
                    }
                    // 传参isPresigned	？ NO（大于40M，需调用预上传接口）
                } else {
                    // 存在，返回对应minio路径及主键
                    if (data.have === 'Y') {
                        console.log(2222, data.data.filePath, '', file);
                        uploadSuccess && uploadSuccess(data.data.filePath, '', file);
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
                                file: file,
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
            let file = payload.file;
            delete payload.file;
            delete payload.namespace;
            const { data } = yield call(apis.presignedUploadUrl, payload, '', 'uploadfile');
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'uploadStore',
                    payload: {
                        namespace: namespace,
                        url: `${data.data.presignedUploadUrl}`,
                        file: file,
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
            let file = payload.file;
            delete payload.file;
            delete payload.namespace;
            let stateObj = [];
            let bizSolId = '';
            let bizInfoId = '';
            let currentTab = '';
            let bizTaskId = '';
            let listId = '';
            if (history.location.pathname == '/dynamicPage/formShow') {
                let formShowState = yield select((state) => state.formShow);
                stateObj = formShowState.stateObj;
                const { stateInfo } = yield select((state) => state.designableBiz);
                const cutomHeaders =
                    stateObj[getParam()?.bizSolId + '_' + getParam()?.bizInfoId + '_' + getParam()?.currentTab]
                        ?.cutomHeaders;
                const bizModal = stateInfo?.[cutomHeaders?.mainTableId]?.bizModal;
                const bizModalProps = stateInfo?.[cutomHeaders?.mainTableId]?.bizModalProps;
                let loQuery = history.location?.query || {};
                let tmpInfo = bizModal && bizModalProps?.bizSolId ? bizModalProps : loQuery;
                bizSolId = tmpInfo.bizSolId;
                bizInfoId = tmpInfo.bizInfoId;
                currentTab = tmpInfo.currentTab;
                bizTaskId = tmpInfo.bizTaskId;
            }

            if (history.location.pathname == '/dynamicPage') {
                let formShowState = yield select((state) => state.dynamicPage);
                stateObj = formShowState.stateObj;
                let tmpInfo = history.location?.query || {};
                bizSolId = tmpInfo.bizSolId;
                listId = tmpInfo.listId;
            }
            const { fileName, fileChunkedList, index, md5, needfilepath, uploadFlag, fileSize } =
                history.location.pathname == '/dynamicPage/formShow'
                    ? stateObj[bizSolId + '_' + bizInfoId + '_' + currentTab]
                    : history.location.pathname == '/dynamicPage'
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
                                file: file,
                                fileFullPath: payload?.url,
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
            const { data } = yield call(apis.getFileMerage, payload, '', 'uploadfile');
            let stateObj = {};
            let bizSolId = '';
            let bizInfoId = '';
            let currentTab = '';
            let bizTaskId = '';
            let listId = '';

            if (history.location.pathname == '/dynamicPage/formShow') {
                let formShowState = yield select((state) => state.formShow);
                stateObj = formShowState.stateObj;
                const { stateInfo } = yield select((state) => state.designableBiz);
                const cutomHeaders =
                    stateObj[getParam()?.bizSolId + '_' + getParam()?.bizInfoId + '_' + getParam()?.currentTab]
                        ?.cutomHeaders;
                const bizModal = stateInfo?.[cutomHeaders?.mainTableId]?.bizModal;
                const bizModalProps = stateInfo?.[cutomHeaders?.mainTableId]?.bizModalProps;
                let loQuery = history.location?.query || {};
                let tmpInfo = bizModal && bizModalProps?.bizSolId ? bizModalProps : loQuery;
                bizSolId = tmpInfo.bizSolId;
                bizInfoId = tmpInfo.bizInfoId;
                currentTab = tmpInfo.currentTab;
                bizTaskId = tmpInfo.bizTaskId;
            }
            if (history.location.pathname == '/dynamicPage') {
                let formShowState = yield select((state) => state.dynamicPage);
                stateObj = formShowState.stateObj;
                let tmpInfo = history.location?.query || {};
                bizSolId = tmpInfo.bizSolId;
                listId = tmpInfo.listId;
            }

            const { fileSize, md5, fileName } =
                history.location.pathname == '/dynamicPage/formShow'
                    ? stateObj[bizSolId + '_' + bizInfoId + '_' + currentTab]
                    : history.location.pathname == '/dynamicPage'
                    ? stateObj[`${bizSolId}-${listId}`]
                    : yield select((state) => state[namespace]);

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
            let file = payload.file;
            let fileFullPath = payload.fileFullPath;
            delete payload.fileFullPath;
            delete payload.file;
            delete payload.namespace;
            const { data } = yield call(apis.storingFileInformation, payload, '', 'uploadfile');
            const { isFu } = yield select((state) => state[namespace]);

            if (data.code == REQUEST_SUCCESS) {
                // console.log(3333, payload.filePath, '', file, fileFullPath);
                uploadSuccess && uploadSuccess(payload.filePath, '', file, fileFullPath, data.data.fileFullPath);
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
