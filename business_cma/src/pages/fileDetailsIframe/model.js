import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
    namespace: 'fileDetailsIframe',
    state: {
        fileList: [],
        isShowModal: false,
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
        modulesList: [], //模块选择码表数据
    },
    effects: {
        *getFileDatails({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getFileDatails, payload, 'getFileDatails', 'fileDetailsIframe');
                console.log(data.data, 'data==');
                if (data.code == 200) {
                    if (data.data.PROFILE) {
                        const newData = [];
                        for (const key in data.data.PROFILE) {
                            if (Object.hasOwnProperty.call(data.data.PROFILE, key)) {
                                data.data.PROFILE[key].forEach((item, index) => {
                                    item['PROJECT_NAME'] = key;
                                    item['NUMBER'] = index + 1;
                                    item['rowspan'] = 1;
                                    if (data.data.PROFILE[key].length > 1) {
                                        if (index == 0) {
                                            item['rowspan'] = data.data.PROFILE[key].length;
                                        } else {
                                            item['rowspan'] = 0;
                                        }
                                    }
                                });
                                data.data.PROFILE[key].forEach((item) => {
                                    item.key = Math.random().toString(36).slice(2);
                                    newData.push(item);
                                });
                            }
                        }
                        yield put({
                            type: 'updateStates',
                            payload: {
                                fileList: newData,
                            },
                        });
                    }
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        *getFileZip({ payload }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getFileZip, payload, 'getFileZip', 'fileDetailsIframe');
                if (data.code == REQUEST_SUCCESS) {
                    window.open(data.data);
                    message.success('下载成功');
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        *getAllProfileInfoList({ payload }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.getAllProfileInfoList,
                    payload,
                    'getAllProfileInfoList',
                    'fileDetailsIframe',
                );
                if (data.code == 200) {
                    if (data.data.PROFILE) {
                        const newData = [];
                        for (const key in data.data.PROFILE) {
                            if (Object.hasOwnProperty.call(data.data.PROFILE, key)) {
                                data.data.PROFILE[key].forEach((item, index) => {
                                    item['PROJECT_NAME'] = key;
                                    item['NUMBER'] = index + 1;
                                    item['rowspan'] = 1;
                                    if (data.data.PROFILE[key].length > 1) {
                                        if (index == 0) {
                                            item['rowspan'] = data.data.PROFILE[key].length;
                                        } else {
                                            item['rowspan'] = 0;
                                        }
                                    }
                                });
                                data.data.PROFILE[key].forEach((item) => {
                                    item.key = Math.random().toString(36).slice(2);
                                    newData.push(item);
                                });
                            }
                        }
                        yield put({
                            type: 'updateStates',
                            payload: {
                                fileList: newData,
                            },
                        });
                    }
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        //获取码表数据
        *getBaseDataCodeTable({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.getBaseDataCodeTable,
                    payload,
                    'getBaseDataCodeTable',
                    'fileDetailsIframe',
                );
                if (data.code == REQUEST_SUCCESS) {
                    console.log(data, 'data==');
                    yield put({
                        type: 'updateStates',
                        payload: {
                            modulesList: data.data.list,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        //上传
        *saveArchivesFile({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.saveArchivesFile, payload, 'saveArchivesFile', 'fileDetailsIframe');
                if (data.code == REQUEST_SUCCESS) {
                    console.log(data, 'data');
                    callback && callback();
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            } finally {
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
