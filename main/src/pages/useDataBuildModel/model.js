import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'
import { env } from '../../../../project_config/env'
export default {
    namespace: 'useDataBuildModel',
    state: {
        limit: 10,
        currentPage: 1,
        returnCount: 0,
        searchWord: '',
        getExportUrl: '',
        fileStorageId: '',
        datasourceTree: [],
        datasourceTable: [],
        getIndexTable: [],
        getDataSourceList: [],
        getFieldForm: {},
        getPhysicalForm: {},
        getDataSourceForm: {},
        isShowAddFieldModal: false,
        isShowCreateIndexModal: false,
        isShowTableCopyModal: false,
        isShowAddIndexModal: false,
        isShowImportModal: false,
        isShowAddPhysicalTableModal: false,
        isShowAddLinkDataSourceModal: false,
        leftNum:212,
    },
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            // debugger
            // history.listen(location => {
            //     console.log(history,'history');
            //     if (history.location.pathname .split('/support')?.[1]=='/useDataBuildModel' ) {
            //         dispatch({
            //             type: 'updateStates',
            //             payload: {
            //                 pathname: history.location.pathname.split('/support')?.[1],
            //             }
            //         })
            //         dispatch({
            //             type: 'getDatasourceTree',
            //         })
            //     }
            // });
        }
    },
    effects: {
        // 获取数据源树
        *getDatasourceTree({ payload,callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.getDatasourceTree, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        datasourceTree:data.data.list,
                    }
                })
                callback&&callback(data.data.list)
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 获取字段列表
        *getDatasourceField({ payload }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.getDatasourceField, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        datasourceTable: data.data.list,
                        currentPage: data.data.currentPage,
                        allPage: data.data.allPage,
                        returnCount: data.data.returnCount,
                        limit: payload.limit,
                    }
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 创建索引
        *addDatasourceIndexes({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.addDatasourceIndexes, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('创建成功');
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 修改索引
        *updateDatasourceIndexes({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.updateDatasourceIndexes, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('修改成功');
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 删除索引
        *delDatasourceIndexes({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.delDatasourceIndexes, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('删除成功');
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 根据TABLE_ID获取已创建表索引
        *getDatasourceIndexes({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.getDatasourceIndexes, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        getIndexTable: data.data
                    }
                })
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 根据ID获取字段
        *getDatasourceTableField({ payload }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.getDatasourceTableField, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        getFieldForm: data.data
                    }
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 添加字段
        *addDatasourceTableField({ payload }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.addDatasourceTableField, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('添加成功');
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 修改字段
        *updateDatasourceTableField({ payload }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.updateDatasourceTableField, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('修改成功');
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 删除字段
        *delDatasourceTableField({ payload }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.delDatasourceTableField, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('删除成功');
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 根据ID获取物理表
        *getDatasourceTable({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.getDatasourceTable, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        getPhysicalForm: data.data
                    }
                })
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 添加物理表
        *addDatasourceTable({ payload }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.addDatasourceTable, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('添加成功');
                yield put({
                    type: 'getDatasourceTree',
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 修改物理表
        *updateDatasourceTable({ payload }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.updateDatasourceTable, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('修改成功');
                yield put({
                    type: 'getDatasourceTree',
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 删除物理表
        *delDatasourceTable({ payload }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.delDatasourceTable, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('删除成功');
                yield put({
                    type: 'getDatasourceTree',
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 复制物理表
        *addDatasourceTableCopy({ payload , callback}, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.getDataSourceList, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                  type: 'updateStates',
                  payload: {
                    getDataSourceList: data.data.list,
                    sourceData: payload
                  }
                })
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        *tableCopyExecute({ payload }, { call, put, select }) {
        //   const {
        //     searchObj
        //   } = yield select(state => state.layoutG), {
        //     pathname
        //   } = yield select(state => state.useDataBuildModel), {

        //   } = searchObj[pathname];
          const { data } = yield call(apis.addDatasourceTableCopy, payload);
          if (data.code == REQUEST_SUCCESS) {
            message.success('复制成功');
            yield put({
              type: 'getDatasourceTree',
            })
            yield put({
              type: 'updateStates',
              payload: {
                isShowTableCopyModal: false,
              }
            })
          } else if (data.code != 401 && data.code != 419 && data.code !=403) {
            message.error(data.msg);
          }
        },
        // 导出物理表
        *getDatasourceTableExport({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.getDatasourceTableExport, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('导出成功');
                yield put({
                    type: 'updateStates',
                    payload: {
                        getExportUrl: data.data
                    }
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 导入物理表
        *addDatasourceTableImport({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.addDatasourceTableImport, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('导入成功');
                callback && callback()
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 根据ID获取数据源
        *getDatasource({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.getDatasource, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        getDataSourceForm: data.data,
                    }
                })
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 添加数据源
        *addDatasource({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.addDatasource, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('添加成功');
                yield put({
                    type: 'getDatasourceTree',
                })
                yield put({
                    type: 'updateStates',
                    payload: {
                        isShowAddLinkDataSourceModal: false,
                    }
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 修改数据源
        *updateDatasource({ payload }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.updateDatasource, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('修改成功');
                yield put({
                    type: 'getDatasourceTree',
                })
                yield put({
                    type: 'updateStates',
                    payload: {
                        isShowAddLinkDataSourceModal: false,
                    }
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 删除数据源
        *delDatasource({ payload }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.delDatasource, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('删除成功');
                yield put({
                    type: 'getDatasourceTree',
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 数据源测试接口
        *addDatasourceTest({ payload ,callback}, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.addDatasourceTest, payload);
            if (data.code == REQUEST_SUCCESS) {
                if (data.data) {
                    message.success('连接成功');
                    callback&&callback(data.data)
                } else {
                    message.error('连接失败');
                }
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 文件上传接口
        *uploaderFile({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.useDataBuildModel), {

            // } = searchObj[pathname];
            yield fetch(`${env}/public/fileStorage/uploaderFile`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + window.localStorage.userToken,
                },
                body: payload.importFormData,
            }).then(res => {
                res.json().then((data) => {
                    if (data.code == 200) {
                        message.success('导入成功');
                        callback && callback(data.data);
                    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                        message.error(data.msg);
                    }
                }).catch((err) => {
                    // 将 err 转换为字符串类型
                    const errorMessage = err instanceof Error ? err.message : String(err);
                    message.error(errorMessage);
                })
            })
        },
        // // updateStates ==> layoutG/updateStates
        // *updateStates({ payload }, { call, put, select }) {
        //     const {
        //         searchObj
        //     } = yield select(state => state.layoutG), {
        //         pathname
        //     } = yield select(state => state.useDataBuildModel);

        //     for (var key in payload) {
        //         searchObj[pathname][key] = payload[key]
        //     }
        //     yield put({
        //         type: "layoutG/updateStates",
        //         payload: {
        //             searchObj: searchObj
        //         }
        //     })
        // }
    },
    reducers: {
        updateStates(state, action) {
            return {
                ...state,
                ...action.payload
            }
        }
    }
}
