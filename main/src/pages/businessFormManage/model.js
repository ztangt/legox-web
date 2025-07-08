import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'

export default {
    namespace: 'businessFormManage',
    state: {
        limit: 10,
        currentPage: 1,
        returnCount: 0,
        searchWord: '',
        businessFormTable: [],
        businessFormTree: [],
        formVersionsTable: [],
        fvReturnCount: 0,
        fvCurrentPage: 0,
        isShowAddURLModal: false,
        isShowCatVersionInfo: false,
        isShowAddApplicationCategory: false,
        start: 1,
        treeSearchWord: '',
        buttonModal: false,
        buttonGroups: [],
        //选择按钮模版
        buttonLimit:10,
        buttonReturnCount:0,
        buttonCurrentPage: 1,
        copyBusinessFormTree:[],
        buttonSearchValue:'',
        selectedNodeId:'',
        selectedDataIds:[],
        treeData:[],
        currentNode:[],
        expandedKeys:[],
        selectedDatas:[],
        originalData:[],
        selectNodeType:[],
        leftNum:212,
    },
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            // history.listen(location => {
            //     if (history.location.pathname === '/businessFormManage') {
            //         dispatch({
            //             type: 'businessFormManageStates',
            //             payload: {
            //                 pathname: history.location.pathname,
            //             }
            //         })
            //     }
            // });
        }
    },
    effects: {
        // 保存业务应用类别
        *addSysCtlg({ payload }, { call, put, select }) {
            const { data } = yield call(apis.addSysCtlg, payload);

            if (data.code == REQUEST_SUCCESS) {

            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }

        },
        // 修改业务应用类别
        *updateSysCtlg({ payload }, { call, put, select }) {

            const { data } = yield call(apis.updateSysCtlg, payload);

            if (data.code == REQUEST_SUCCESS) {

            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }

        },
        // 删除业务应用类别
        *delSysCtlg({ payload }, { call, put, select }) {
            const { data } = yield call(apis.delSysCtlg, payload);

            if (data.code == REQUEST_SUCCESS) {

            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }

        },
        // 增加业务应用类别区分单位操作权限
        *updateSysCtlgPermission({ payload }, { call, put, select }) {
            const { data } = yield call(apis.updateSysCtlgPermission, payload);

            if (data.code == REQUEST_SUCCESS) {

            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }

        },
        // 获取单个业务应用类别权限
        *getSysCtlgPermission({ payload }, { call, put, select }) {

            const { data } = yield call(apis.getSysCtlgPermission, payload);

            if (data.code == REQUEST_SUCCESS) {

            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }

        },
        // 获取业务应用类别树
        *getSysCtlgTree({ payload }, { call, put, select }) {
            const { data } = yield call(apis.getSysCtlgTree, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        businessFormTree: data.data.list,
                        copyBusinessFormTree:data.data.list,

                    }
                })

            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 分页获取表单版本列表
        *getFormVersions({ payload }, { call, put, select }) {

            const { data } = yield call(apis.getFormVersions, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        formVersionsTable: data.data.list,
                        fvReturnCount: data.data.returnCount,
                        fvCurrentPage: data.data.currentPage
                    }
                })

            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 分页获取表单版本列表
        *getVersionList({ payload }, { call, put, select }) {
            console.log('getVersionListeeeeee');
            const { data } = yield call(apis.getVersionList, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        formVersionsTable: data.data.list,
                    }
                })

            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 新增业务表单
        *addBusinessForm({ payload, callback }, { call, put, select }) {

            const { data } = yield call(apis.addBusinessForm, payload);

            if (data.code == REQUEST_SUCCESS) {
                message.success('新增成功')
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }

        },
        // 修改业务表单
        *updateBusinessForm({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.updateBusinessForm, payload);

            if (data.code == REQUEST_SUCCESS) {
                message.success('修改成功')
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }

        },
        // 删除业务表单
        *delBusinessForm({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.delBusinessForm, payload);

            if (data.code == REQUEST_SUCCESS) {
                message.success('删除成功');
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 根据业务应用类别ID查询业务表单
        *getBusinessForm({ payload }, { call, put, select }) {
            const { data } = yield call(apis.getBusinessForm, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        businessFormTable: data.data.list,
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
        *getButtonGroups({ payload,callback }, { call, put, select }) {
            try {
                const {data} = yield call(apis.getButtonGroups, payload);
                if(data.code==REQUEST_SUCCESS){
                yield put({
                    type:"updateStates",
                    payload:{
                        buttonGroups:data.data.list,
                        buttonReturnCount:data.data.returnCount,
                        buttonCurrentPage:data.data.currentPage,
                    }
                })

                callback&&callback();
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }
        },

        // 保存归属单位
        *saveBelongOrg({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.saveBelongOrg, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('保存成功');
                callback&&callback()
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },

        // 查询归属单位
        *queryBelongOrg({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.queryBelongOrg, payload);
            // 过滤重复数据
            const dataList = data.data.list.filter((item, index, dataList) => {
                return dataList.findIndex(t => t.orgId === item.orgId) === index;
            })
            let selectedOrgIds = [];
            dataList.map((item)=>{
                selectedOrgIds.push(item.orgId);
            })
            dataList.forEach((item) => {
                item.nodeId = item.orgId;
                item.nodeName = item.orgName;
                item.parentId = item.parentOrgId;
                item.parentName = item.parentOrgName;
            });
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        selectedDataIds: selectedOrgIds,
                        selectedDatas: dataList
                    }
                })
                callback&&callback()
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },

        // updateStates ==> layoutG/updateStates
        // *updateStates({ payload }, { call, put, select }) {
        //     const {
        //         searchObj
        //     } = yield select(state => state.layoutG), {
        //         pathname
        //     } = yield select(state => state.businessFormManage);

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
            console.log('3452345323523');
            return {
                ...state,
                ...action.payload
            }
        }
    }
}
