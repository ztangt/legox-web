import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS, CHUNK_SIZE } from '../../../service/constant';
import { dataFormat } from '../../../util/util';

const {
    getDownloadFileUrl,
    getSomeoneInformation,
    uploadFile,
    updateInformation,
    updateInformationOperation,
    addInformation,
    getInformation,
    getDownFileUrl,
    storingFileInformation,
    getFileMerage,
    presignedUploadUrl,
    getUploadURLisReal,
    getFileMD5,
} = apis;

export default {
    namespace: 'informationModal',
    state: {
        uploadFlag: true, //上传暂停器
        nowMessage: '', //提示上传进度的信息
        md5: '', //文件的md5值，用来和minio文件进行比较
        fileChunkedList: [], //文件分片完成之后的数组
        fileName: '', //每片文件名字
        fileNames: '',  //文件前半部分名字
        fileStorageId: '', //存储文件信息到数据库接口返回的id
        typeNames: '', //文件后缀名
        optionFile: {}, //文件信息
        fileSize: '', //文件大小，单位是字节
        getFileMD5Message: {}, //md5返回的文件信息
        success: '', //判断上传路径是否存在
        v: 1, //计数器
        needfilepath: '', //需要的minio路径
        isStop: true,  //暂停按钮的禁用
        isContinue: false, //继续按钮的禁用
        isCancel: false, //取消按钮的禁用
        index: 0, //fileChunkedList的下标，可用于计算上传进度
        merageFilepath: '',  //合并后的文件路径
        typeName: '', //层级
        fileExists: '', //判断文件是否存在于minio服务器中，相关modal中监听判断fileExists状态进行后续分别操作
        md5FileId: '', //md5查询到的文件返回的id
        md5FilePath: '', //md5查询到的文件返回的pathname
        urlQuillSwitch: '',//富文本用来判断useEffect是否加载的开关
        fileUrlQull: '',//富文本图片上传minio后的url
        fileUrl: '',//图片url
        addFileUrl:"",
        informations: {},
        informationTexts: '',//文本
        typeId: '',//类别id
        buttonState: 0,//按钮状态
        start: 1,
        limit: 10,
        listValue: '',//搜索内容
        informationFileName: '',//资讯文件标题-add
        informationDesc: '',//资讯描述
        selectedKeysValue: 0,
        filePathIsReal: '',//文件路径有返回，没有则为空
        imageStorageURL: '',//走完存储文件信息到数据库接口返回的图片id,:'
        modifyInformationTitle:"",
        modifyInformationDescription:'',
        modifyInformationTexts:'',
        informationLink:'',
        informationOldText: '', // 旧链接
        linkUrl: '', // 外部链接
        htmlFileStorageId:'',
        uploadList: [],// minio上传列表
    },
    effects: {
        // 查询资讯公告
        *getInformation({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getInformation, payload,'getInformation','informationModal');
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        informationType: data.data.list ? data.data.list : [],
                        returnCount: data.data.returnCount,
                        informationCurrentPage: data.data.currentPage
                    },
                });
                callback && callback(data.data.list);
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 添加资讯公告
        *addInformation({ payload, callback }, { call, put, select }) {
            const { data } = yield call(addInformation, payload,'addInformation','informationModal');
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        informationId: data.data.informationId,
                    },
                });
                message.success(data.msg)
                callback && callback(data.data.informationId);
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 批量发布，置顶，轮播资讯公告
        *updateInformationOperation({ payload, callback }, { call, put, select }) {
            const { data } = yield call(updateInformationOperation, payload,'updateInformationOperation','informationModal');
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {},
                });
                message.success(data.msg);
                callback && callback(data.code, data.msg);
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 修改资讯公告
        *updateInformation({ payload, callback }, { call, put, select }) {
            const { data } = yield call(updateInformation, payload,'updateInformation','informationModal');
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {},
                });
                message.success('修改成功');
                callback && callback(data.code);
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 上传文件
        *uploadFile({ payload, callback }, { call, put, select }) {
            const { data } = yield call(uploadFile, payload,'uploadFile','informationModal');
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        fileStorageId: data.data
                    }
                });
                callback && callback(data);
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 查询某一个资讯公告
        *getSomeoneInformation({ payload, callback, query }, { call, put, select }) {
            const { data } = yield call(getSomeoneInformation, payload,'getSomeoneInformation','informationModal');
            console.log("data232122",data.data)
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        // informationFileName: data.data.informationFileName,
                        modifyInformationTitle:data.data.informationFileName,
                        // informationDesc: data.data.informationDesc,
                        modifyInformationDescription:data.data.informationDesc,
                        // informationTexts: data.data.informationText,
                        informationOldText:data.data.informationText,
                        informationLink:data.data.informationHtmlUrl,
                        informations: data.data,
                        fileStorageId: data.data.fileStorageId,
                    }
                });
                callback && callback(data.data.fileStorageId);
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        *getFileMD5({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getFileMD5, payload,'getFileMD5','informationModal');
            const { fileName, selectedKeysValue, md5, fileSize, typeName, typeNames, fileNames } = yield select(state => state.informationModal);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        filePathIsReal: data.filePath
                    }
                });
                callback();
                if (data.data == null) {
                    yield put({
                        type: 'getUploadURLisReal',
                        payload: {
                            filePath: `informationModal/${dataFormat(String(new Date().getTime()).slice(0, 10), 'YYYY-MM-DD')}${typeName == '' ? '' : '/' + typeName}/${fileName}`
                        }
                    });
                } else {
                    yield put({
                        type: 'storingFileInformation',
                        payload: {
                            fileName: fileName,
                            fileSize: fileSize,
                            filePath: data.data,
                            fileEncryption: md5
                        }
                    })
                }
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 判断上传路径是否存在
        *getUploadURLisReal({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getUploadURLisReal, payload,'getUploadURLisReal','informationModal');
            const { v, typeNames, filePathIsReal, fileChunkedList, typeName, fileName } = yield select(state => state.informationModal);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        success: data.success,
                        nowMessage: '正在与数据库建立连接...'
                    }
                });

                if (data.success == true) {
                    yield put({
                        type: 'getUploadURLisReal',
                        payload: {
                            filePath: `informationModal/${dataFormat(String(new Date().getTime()).slice(0, 10), 'YYYY-MM-DD')}${typeName == '' ? '' : '/' + typeName}/${fileName}${(v)}`
                        }
                    });
                    yield put({
                        type: 'updateStates',
                        payload: {
                            v: v + 1
                        }
                    });
                } else {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            nowMessage: '连接数据库成功，正在准备上传...',
                            needfilepath: `informationModal/${dataFormat(String(new Date().getTime()).slice(0, 10), 'YYYY-MM-DD')}${typeName == '' ? '' : '/' + typeName}/${fileName}`,
                        }
                    });
                    if (fileSize > CHUNK_SIZE) {
                        yield put({
                            type: 'presignedUploadUrl',
                            payload: {
                                filePath: `informationModal/${dataFormat(String(new Date().getTime()).slice(0, 10), 'YYYY-MM-DD')}${typeName == '' ? '' : '/' + typeName}/${fileName}/${0}`
                            }
                        });
                    } else {
                        yield put({
                            type: 'presignedUploadUrl',
                            payload: {
                                filePath: `informationModal/${dataFormat(String(new Date().getTime()).slice(0, 10), 'YYYY-MM-DD')}${typeName == '' ? '' : '/' + typeName}/${fileName}`
                            }
                        });
                    }
                }

            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        //文件预上传
        *presignedUploadUrl({ payload, callback }, { call, put, select }) {
            const { data } = yield call(presignedUploadUrl, payload,'presignedUploadUrl','informationModal');
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'uploadStore',
                    payload: {
                        url: `${data.data.presignedUploadUrl}`
                    }
                });
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        //上传到数据库
        *uploadStore({ payload, callback, feId }, { call, put, select }) {
            const { fileName, fileSize, md5, typeName, chunkId, fileChunkedList, file, index, needfilepath, typeNames, uploadFlag } = yield select(state => state.informationModal);

            try {
                yield call(async (url) => {
                    let response = await fetch(url, {
                        method: 'PUT',
                        body: fileChunkedList[index]
                    });
                    return response;
                }, payload.url);

                yield put({
                    type: 'updateStates',
                    payload: {
                        nowMessage: '正在上传...'
                    }
                });

                if (fileChunkedList.length - 1 != index) {
                    // 此处为暂停判断器
                    if (uploadFlag) {
                        yield put({
                            type: 'presignedUploadUrl',
                            payload: {
                                filePath: `${needfilepath}/${index + 1}`
                            }
                        });
                        yield put({
                            type: 'updateStates',
                            payload: {
                                index: index + 1
                            }
                        });
                    } else {
                        yield put({
                            type: 'updateStates',
                            payload: {
                                nowMessage: '已暂停'
                            }
                        });
                    }
                } else {
                    yield put({
                        type: 'informationModal/updateStates',
                        payload: {
                            isStop: true,
                            isContinue: true,
                            isCancel: true,
                        }
                    });
                    if (fileSize > CHUNK_SIZE) {
                        yield put({
                            type: 'getFileMerage',
                            payload: {
                                filePath: needfilepath,
                                fileName: fileName
                            },
                            // callback: (fileExists) => {
                            //     callback(fileExists);
                            // }
                        });
                    } else {
                        yield put({
                            type: 'storingFileInformation',
                            payload: {
                                fileName: fileName,
                                fileSize: fileSize,
                                filePath: needfilepath,
                                fileEncryption: md5
                            },
                            // callback: (fileExists) => {
                            //     callback(fileExists);
                            // }
                        });
                    }
                }
            } catch (e) {

            };
        },
        // 根据文件路径合并文件
        *getFileMerage({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getFileMerage, payload,'getFileMerage','informationModal');
            const { fileSize, fileNames, needfilepath, md5, fileName } = yield select(state => state.informationModal);

            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        merageFilepath: data.data,
                    }
                });

                yield put({
                    type: 'storingFileInformation',
                    payload: {
                        fileName: fileName,
                        fileSize: fileSize,
                        filePath: data.data.filePath,
                        fileEncryption: md5,
                        fileId: data.data.fileId
                    }
                });
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        //存储文件信息到数据库接口
        *storingFileInformation({ payload, callback }, { call, put, select }) {
            const { data } = yield call(storingFileInformation, payload,'storingFileInformation','informationModal');
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        fileStorageId: data.data.fileStorageId
                    }
                });
                yield put({
                    type: 'getDownFileUrl',
                    payload: {
                        fileStorageId: data.data.fileStorageId
                    }
                });
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        //获取下载地址url
        *getDownFileUrl({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getDownFileUrl, payload,'getDownFileUrl','informationModal');
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        fileUrl: data.data.fileUrl,
                    },
                });
                callback && callback(data.data.fileUrl);
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        ////////////////////////////////////////////////////////////////////////////////////////////////
        //富文本图片md5检测
        *getFileMD5_Quill({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getFileMD5, payload,'getFileMD5_Quill','informationModal');
            const { fileName, selectedKeysValue, md5, fileSize, typeName, fileNames } = yield select(state => state.informationModal);
            const { filePath, isPresigned } = payload;
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                      filePathIsReal: data.data.filePath,
                      getFileMD5Message: data.data,
                      needfilepath: filePath,
                    }
                });
                // callback();
                // new
                // 传参isPresigned	？ YES（小于40M）
                if (isPresigned) {
                  // 存在，返回对应minio路径及主键
                  if (data.have === 'Y') {
                    yield put({
                      type: 'getDownFileUrl_Quill',
                      payload: {
                          fileStorageId: data.data.fileId
                      }
                    })
                    // 返回值have=N  ？不存在
                    // 直接获取presignedUploadUrl，上传到指定url（前端自己传），再调用public/fileStorage/saveFileStorag（保存到数据库）
                  } else {
                    yield put({
                      type: 'uploadStore_Quill',
                      payload: {
                          url: `${data.data.presignedUploadUrl}`
                      }
                    });
                  }
                // 传参isPresigned	？ NO（大于40M，需调用预上传接口）
                } else {
                  // 存在，返回对应minio路径及主键
                  if (data.have === 'Y') {
                    yield put({
                      type: 'getDownFileUrl_Quill',
                      payload: {
                          fileStorageId: data.data.fileId
                      }
                    })
                  } else {
                    yield put({
                      type: 'presignedUploadUrl_Quill',
                      payload: {
                          filePath: `informationModal/${dataFormat(String(new Date().getTime()).slice(0, 10), 'YYYY-MM-DD')}${typeName == '' ? '' : '/' + typeName}/${fileName}/${0}`
                      }
                  });

                  }
                }
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        //富文本文件预上传
        *presignedUploadUrl_Quill({ payload, callback }, { call, put, select }) {
            const { data } = yield call(presignedUploadUrl, payload,'presignedUploadUrl_Quill','informationModal');
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'uploadStore_Quill',
                    payload: {
                        url: `${data.data.presignedUploadUrl}`
                    }
                });
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        //富文本上传到数据库
        *uploadStore_Quill({ payload, callback, feId }, { call, put, select }) {
            const { fileName, md5, fileSize, fileChunkedList, file, index, needfilepath, typeNames, uploadFlag } = yield select(state => state.informationModal);

            try {
                yield call(async (url) => {
                    let response = await fetch(url, {
                        method: 'PUT',
                        body: fileChunkedList[index]
                    });
                    return response;
                }, payload.url);

                yield put({
                    type: 'updateStates',
                    payload: {
                        nowMessage: '正在上传...'
                    }
                });

                if (fileChunkedList.length - 1 != index) {
                    // 此处为暂停判断器
                    if (uploadFlag) {
                        yield put({
                            type: 'presignedUploadUrl_Quill',
                            payload: {
                                filePath: `${needfilepath}/${index + 1}`
                            }
                        });
                        yield put({
                            type: 'updateStates',
                            payload: {
                                index: index + 1
                            }
                        });
                    } else {
                        yield put({
                            type: 'updateStates',
                            payload: {
                                nowMessage: '已暂停'
                            }
                        });
                    }
                } else {
                    if (fileSize > CHUNK_SIZE) {
                        yield put({
                            type: 'getFileMerage_Quill',
                            payload: {
                                filePath: needfilepath,
                                fileName: fileName
                            }
                        });
                    } else {
                        yield put({
                            type: 'storingFileInformation_Quill',
                            payload: {
                                fileName: fileName,
                                fileSize: fileSize,
                                filePath: needfilepath,
                                fileEncryption: md5
                            }
                        });
                    }
                }
            } catch (e) {

            };
        },
        // 富文本根据文件路径合并文件
        *getFileMerage_Quill({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getFileMerage, payload,'getFileMerage_Quill','informationModal');
            const { fileSize, fileNames, needfilepath, md5, fileName } = yield select(state => state.informationModal);

            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        merageFilepath: data.data,
                    }
                });

                yield put({
                    type: 'storingFileInformation_Quill',
                    payload: {
                        fileName: fileName,
                        fileSize: fileSize,
                        filePath: data.data,
                        fileEncryption: md5
                    }
                });
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        //富文本存储文件信息到数据库接口
        *storingFileInformation_Quill({ payload, callback }, { call, put, select }) {
            const { data } = yield call(storingFileInformation, payload,'storingFileInformation_Quill','informationModal');
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        fileStorageId: data.data.fileStorageId
                    }
                });
                yield put({
                    type: 'getDownFileUrl_Quill',
                    payload: {
                        fileStorageId: data.data.fileStorageId
                    }
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        //富文本获取下载地址url
        *getDownFileUrl_Quill({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getDownFileUrl, payload,'getDownFileUrl_Quill','informationModal');
            if (data.code == REQUEST_SUCCESS) {

                yield put({
                    type: 'updateStates',
                    payload: {
                        fileUrlQull: data.data.fileUrl,
                        urlQuillSwitch: true,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
    },
    reducers: {
        updateStates(state, action) {
            return {
                ...state,
                ...action.payload
            };
        }
    }
}
