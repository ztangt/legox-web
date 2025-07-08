import { message } from 'antd';
import apis from 'api';
import dayjs from 'dayjs';
import { LH_STATE } from './components/config';

export default {
    namespace: 'budgetLedger',
    state: {
        funCode: '', //功能分类编码
        fundCode: '', //资金来源编码

        tableList: [], //基础数据表格列表
        budgetUnitList: [], //预算单位列表

        list: [],
        returnCount: 0,
        allPage: 1,
        currentPage: 1,
        start: 1,
        limit: 0,
        currentHeight: 0,
        formData: {
            usedYear: dayjs().year(),
        },

        rangVisible: false, //选择控件显示
        rangType: '', //控件类型
        formType: '',
        //这是树形结构的数据
        selectedNodeId: '',
        currentNode: [],
        expandedKeys: [],
        treeSearchWord: '',
        originalData: [],
        selectedDataIds: [],
        selectedDatas: [],

        detailModal: false, //调整记录
        normCode: '', //调整记录需要参数

        cutomHeaders: {},
        isShowCarryModal: false,

        isShowImportModal: false, //导入弹窗
        importData: {},
        importType: '',

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
        showAdvSearch: false,
    },
    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.more_budget_getLedgerList, payload, 'getList', 'budgetLedger');
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: data?.data?.list || [],
                            // returnCount: data.data.returnCount * 1,
                            // allPage: data.data.allPage * 1,
                            // currentPage: data.data.currentPage * 1,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            }
        },
        *getChildList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.more_budget_getLedgerList, payload, 'getChildList', 'budgetLedger');
                if (data.code == 200) {
                    let list = data?.data?.list || [];
                    callback && callback(list);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            }
        },

        //获取功能分类编码
        *getFunCode({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.more_getLogicCode,
                    { logicCode: 'FT_CMA_900004' },
                    'getFunCode',
                    'budgetLedger',
                );
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            funCode: data.data,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },

        //获取资金来源编码
        *getFundCode({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.more_getLogicCode,
                    { logicCode: 'FT_CMA_900007' },
                    'getFundCode',
                    'budgetLedger',
                );
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            fundCode: data.data,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },

        //获取基础数据表格列表
        *getTableList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getBudgetProjectTree, payload, 'getTableList', 'budgetLedger');
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            tableList: data.list,
                        },
                    });

                    let res = data.data;
                    //判断是否是树形结构的数据
                    let resData = {
                        ...res,
                        list: (res.list || []).map((item) => {
                            if (item.isParent == 1) {
                                item['children'] = [];
                            }
                            return item;
                        }),
                    };
                    callback && callback(resData);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },

        //获取调整记录
        *getDetailList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getNormHistory, payload, 'getDetailList', 'budgetLedger');
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            detailList: data.data.list,
                        },
                    });
                }
            } catch (e) {
                console.log(e);
            }
        },
        //修改
        *checkNorm({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.checkNorm, payload, '', 'budgetLedger');
                if (data.code == 200) {
                    callback && callback(data.data);
                }
            } catch (e) {
                console.log(e);
            }
        },
        //删除(无流程)
        *delFormData({ payload, callback }, { call, put, select }) {
            const { cutomHeaders } = yield select((state) => state.budgetLedger);
            payload.headers = cutomHeaders; //需要在headers中添加参数
            const { data } = yield call(apis.delFormData, payload, '', 'budgetLedger');
            if (data.code == 200) {
                callback && callback(data);
            } else {
                message.error(data.msg);
            }
        },

        //启用停用
        *powerNorm({ payload, callback }, { call, put, select }) {
            const { cutomHeaders } = yield select((state) => state.budgetLedger);
            payload.headers = cutomHeaders; //需要在headers中添加参数
            try {
                const { data } = yield call(apis.powerNorm, payload, '', 'budgetLedger');
                if (data.code == 200) {
                    callback && callback();
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            }
        },
        //按列表转结
        *annualCarryForward({ payload, callback }, { call, put, select }) {
            const { cutomHeaders } = yield select((state) => state.budgetLedger);
            payload.headers = cutomHeaders; //需要在headers中添加参数
            try {
                const { data } = yield call(apis.annualCarryForward, payload, '', 'budgetLedger');
                if (data.code == 200) {
                    message.success('结转成功');
                    callback && callback();
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            }
        },
        //按照项目转结
        *getBudgetProjectTree({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getBudgetProjectTree, payload, '', 'budgetLedger');
                const { treeData } = yield select((state) => state.budgetLedger);
                const loop = (array, children) => {
                    for (var i = 0; i < array.length; i++) {
                        array[i]['title'] = `[${array[i]['OBJ_CODE']}]${array[i]['OBJ_NAME']}（${
                            LH_STATE[array[i]['FINISH_TURN_TLDT_']]
                        }）`;
                        array[i]['key'] = array[i]['OBJ_CODE'];
                        array[i]['value'] = array[i]['OBJ_CODE'];
                        if (array[i]['FINISH_TURN_TLDT_'] == 1) {
                            array[i]['disabled'] = true;
                        }
                        if (payload.parentCode == array[i]['OBJ_CODE']) {
                            children.map((itemChild) => {
                                itemChild['title'] = `[${itemChild['OBJ_CODE']}]${itemChild['OBJ_NAME']}（${
                                    LH_STATE[itemChild['FINISH_TURN_TLDT_']]
                                }）`;
                                itemChild['key'] = itemChild['OBJ_CODE'];
                                itemChild['value'] = itemChild['OBJ_CODE'];
                                if (itemChild['FINISH_TURN_TLDT_'] == 1) {
                                    itemChild['disabled'] = true;
                                }
                            });
                            array[i]['children'] = children;
                        }
                        if (array[i].children && array[i].children.length != 0) {
                            loop(array[i].children, children);
                        } else {
                            if (array[i].isParent == 1) {
                                array[i]['children'] = [{ key: '-1' }];
                            } else {
                                array[i]['isLeaf'] = true;
                            }
                        }
                    }
                    return array;
                };
                if (data.code == 200) {
                    let sourceTree = treeData;
                    if (data.data.list.length !== 0) {
                        if ((sourceTree && sourceTree.length == 0) || !payload.parentCode) {
                            sourceTree = data.data.list;
                        }
                        sourceTree = loop(sourceTree, data.data.list);
                        yield put({
                            type: 'updateStates',
                            payload: { treeData: sourceTree },
                        });
                    }
                }
            } catch (e) {
                console.log(e);
            }
        },

        *getProjectBizSolId({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getProjectBizSolId, payload, '', 'budgetLedger');
                if (data.code == 200) {
                    callback && callback(data.data);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            }
        },
        //导出
        *exportFile({ payload, callback }, { call, put, select }) {
            const { cutomHeaders } = yield select((state) => state.budgetLedger);
            payload.headers = cutomHeaders; //需要在headers中添加参数
            const { data } = yield call(apis.exportFile, payload, '', 'budgetLedger');
            if (data.code == 200) {
                callback && callback();
            } else {
                message.error(data.msg);
            }
        },
        *importExcel({ payload, callback }, { call, put, select }) {
            const { cutomHeaders } = yield select((state) => state.budgetLedger);
            if (cutomHeaders) {
                payload.headers = cutomHeaders; //需要在headers中添加参数
            }
            const { data } = yield call(apis.importExcel, payload, '', 'budgetLedger');
            if (data.code == 200) {
                callback && callback(data?.data?.importId);
            } else {
                message.error(data.msg);
            }
        },
        *refreshImportExcel({ payload, callback }, { call, put, select }) {
            const { cutomHeaders } = yield select((state) => state.budgetLedger);
            if (cutomHeaders) {
                payload.headers = cutomHeaders; //需要在headers中添加参数
            }
            const { data } = yield call(apis.refreshImportExcel, payload, '', 'budgetLedger');
            if (data.code == 200) {
                callback && callback(true, data);
            } else {
                callback && callback(false, data);
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
