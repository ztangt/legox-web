import apis from 'api';
import { message } from 'antd';
const {
    getRedTemplate,
    deleteRedTemplate,
    addTemplate,
    updateTemplate,
    getTemplateOrgIds,
    getOrgByIds,
    enableTemplate,
    disableTemplate,
} = apis

export default {
    namespace: 'overprintTemplate',
    state: {
        redList: [], 
        start: 1,
        limit: 10,
        returnCount: 0,
        selectedRows: [],
        selectedRowsKeys: [],

        oldSelectedDatas: [],
        oldSelectedDataIds: [],
        selectedNodeId: '',
        selectedDataIds: [],
        treeData: [],
        currentNode: [],
        expandedKeys: [],
        treeSearchWord: '',
        selectedDatas: [],
        originalData: [],
        selectNodeType: '',
        selectedDataPrintKeys: '',
        selectedDataPrint: '',
        orgIdsArr: [],
    },
    effects: {
        // 模板禁用
        *disableTemplate({ payload, callback }, { call, put, select }){
            const {data} = yield call(disableTemplate,payload,'','overprintTemplate')
            if(data.code == 200){
                message.error('禁用成功')
                callback&&callback()
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            } 
        },
        // 模板启用
        *enableTemplate({ payload, callback }, { call, put, select }){
            const {data} = yield call(enableTemplate,payload,'','overprintTemplate')
            if(data.code == 200){
                message.error('启用成功')
                callback&&callback()
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            } 
        },
        // 根据id获取选中内容
        *getOrgByIds({ payload, callback }, { call, put, select }){
            const {data} = yield call(getOrgByIds,payload,'','overprintTemplate')
            if(data.code == 200){
                const list = data.data.orgs&&data.data.orgs.length>0&&data.data.orgs.map(item=>item.orgName).join(',')||''
                yield put({
                    type: 'updateStates',
                    payload: {
                        selectedDataPrint: list
                    }
                })
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            } 
        },
        // 获取模板的ids
        *getTemplateOrgIds({ payload, callback }, { call, put, select }){
            const {data} = yield call(getTemplateOrgIds,payload,'','overprintTemplate')
            const selectedKeys = data.data.list&&data.data.list.length>0&&data.data.list.join(',')||''
            if(data.code == 200){
                yield put({
                    type: 'getOrgByIds',
                    payload: {
                        orgIds: selectedKeys
                    }
                })
                yield put({
                    type: 'updateStates',
                    payload: {
                        selectedDataPrintKeys: selectedKeys
                    }
                })
                callback&&callback(data.data.list)
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }  
        },  
        // 编辑套红
        *editTemplate({ payload, callback }, { call, put, select }){
            const {data} = yield call(updateTemplate,payload,'','overprintTemplate')
            if(data.code == 200){
                callback&&callback()
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }  
        },
        // 新增套红
        *addTemplate({ payload, callback }, { call, put, select }){
            const {data} = yield call(addTemplate,payload,'','overprintTemplate')
            if(data.code == 200){
                callback&&callback()
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }    
        },
        //删除套红
        *deleteRedTemplate({ payload, callback }, { call, put, select }){
            const {data} = yield call(deleteRedTemplate,payload,'','overprintTemplate')
            if(data.code == 200){
                callback&&callback()

            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },    
        // 获取套红列表
        *getRedTemplate({ payload, callback }, { call, put, select }){
            const {data} = yield call(getRedTemplate,payload,'','overprintTemplate')
            
            if(data.code == 200){
                 data.data.list&&data.data.list.length>0&&data.data.list.forEach((element,index) => {
                    element.listNumber = index+1                
                });
                yield put({
                    type: 'updateStates',
                    payload: {
                        redList: data.data.list,
                        returnCount: data.data.returnCount,
                        start: data.data.currentPage
                    }
                })
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        }
    },
    reducers: {
        updateStates(state, action) {
            return {
            ...state,
            ...action.payload,
            };
        }
    }
}