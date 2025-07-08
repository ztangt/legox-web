import { message } from 'antd';
import apis from 'api';
const {
    getCurrentYearListTreeData,
    getListTreeChildrenData,
    postSuperReportImport,
    downloadSuperReport,
    exportWordReport,
    importReportNotification,
    publishExportWordRelease,
} = apis;

export default {
    namespace: 'executionDynamics',
    state: {
        treeData: [],
        currentNode: {},
        expandedKeys: [],
        monitorTreeList: [],
        // /////////////////////////////////////////////////// 上传文件
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
        importLoading: false,
        fileData: {},
        downloadFilePath: '',
        baseCode: '', //objCode
        baseName: '', // orgName
        getOrgCode: '', // orgCode
    },
    effects: {
        // 发布
        *publishExportWordRelease({ payload, callback }, { call, put, select }) {
            const { data } = yield call(publishExportWordRelease, payload, '', 'executionDynamics');
            console.log('publishData', data);
            if (data.code == 200) {
                message.success('发布成功');
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        // 执行动态导入
        *importReportNotification({ payload, callback }, { call, put, select }) {
            const { data } = yield call(importReportNotification, payload, '', 'executionDynamics');
            console.log('data99', data);
            if (data.code == 200) {
                message.success('导入成功');
                callback && callback(data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 执行动态导出
        *exportWordReport({ payload, callback }, { call, put, select }) {
            const { data } = yield call(exportWordReport, payload, '', 'executionDynamics');
            if (data.code == 200) {
                callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 下载
        *downloadSuperReport({ payload, callback }, { call, put, select }) {
            const { data } = yield call(downloadSuperReport, payload, '', 'executionDynamics');
            if (data.code == 200) {
                callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 上传导入
        *postSuperReportImport({ payload, callback }, { call, put, select }) {
            const { data } = yield call(postSuperReportImport, payload, '', 'executionDynamics');
            console.log('data==99', data);
            if (data.code == 200) {
                message.success('导入成功');
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 获取左侧ncc单位树数据
        *getLeftNccTreeData({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                getCurrentYearListTreeData,
                {
                    ...payload,
                },
                'getLeftNccTreeData',
                'executionDynamics',
            );
            if (data.code == 200) {
                const list = data.data.list;
                const objCode = list.length > 0 ? JSON.parse(list[0].json).OBJ_CODE : '';
                const orgName = list.length > 0 ? JSON.parse(list[0].json).OBJ_NAME : '';
                const orgCode = list.length > 0 ? JSON.parse(list[0].json).ORG_CODE : '';
                yield put({
                    type: 'updateStates',
                    payload: {
                        monitorTreeList: currentYearList(list, payload),
                        baseCode: objCode,
                        baseName: orgName,
                        getOrgCode: orgCode,
                    },
                });
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 获取子级别
        *getLeftNccTreeChildren({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                getListTreeChildrenData,
                {
                    ...payload,
                },
                'getLeftNccTreeChildren',
                'executionDynamics',
            );
            const { monitorTreeList } = yield select((state) => state.executionDynamics);
            const treeListData = monitorTreeList;
            if ((data.code = 200)) {
                const list = data.data.list;
                const curList = JSON.parse(JSON.stringify(currentYearList(list, payload)));
                const loop = (array, children, payload) => {
                    for (var i = 0; i < array.length; i++) {
                        if (payload.nodeId == array[i]['nodeId']) {
                            array[i]['children'] = children;
                            // array[i]['children'] = _.concat(children, list);
                        }
                        if (array[i].children && array[i].children.length != 0) {
                            loop(array[i].children, children, payload);
                        } else {
                            array[i]['children'] = [];
                        }
                    }
                    return array;
                };
                yield put({
                    type: 'updateStates',
                    payload: {
                        monitorTreeList: loop(treeListData, curList, payload),
                    },
                });
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
// currentYearList
const currentYearList = (list, payload) => {
    for (let i = 0; i < list.length; i++) {
        list[i]['title'] = `${list[i]['nodeName']}`;
        list[i]['key'] = list[i]['nodeId'];
        list[i]['value'] = list[i]['nodeId'];
        if (payload.searchWord) {
            list[i]['isParent'] = 0;
        } else {
            if (list[i]['isParent'] == 1) {
                if (payload.listModel?.treeImg) {
                    list[i]['icon'] = <IconFont type={`icon-${payload.listModel?.treeImg}`} />;
                }
                list[i]['children'] = [{ key: '-1' }];
            } else {
                if (payload.listModel?.treeLastImg) {
                    list[i]['icon'] = <IconFont type={`icon-${payload.listModel?.treeLastImg}`} />;
                }
            }
        }
    }
    return list;
};
