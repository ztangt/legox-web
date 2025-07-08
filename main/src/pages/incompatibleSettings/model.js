import { message } from 'antd';
import apis from 'api';
const {getSysRoles,getIncompatibleList,addIncompatible,getIncompatibleRefList,updateIncompatible,
    deleteIncompatible,getFunctionClassifyList} = apis
import { REQUEST_SUCCESS } from '../../service/constant'

export default {
    namespace: 'incompatibleSettingsSpace',
    state: {
        currentPage: 1,
        rulesCurrentPage: 1,
        currentHeight: 0,
        returnCount: 0,
        returnCountList: 0,
        limit:10,
        curLimit: 10,
        jobLimit: 10,
        ruleLimit: 10,
        allPage: 0,
        currentNode:{},
        treeData: [],
        expandedKeys: [],
        treeSearchWord:'',
        roleList: [], // 角色
        selectedChoseArr: [], // 角色选中数组
        selectedRowKey: [], // 角色选中keys
        selectedChoseJobArr: [], // 职业列表回显
        selectedRowKeyArr: [], // 职业选中key
        tableIncompatibleList: [], // 列表
        functionList: [], // 职能分类列表
        functionStart: 1,
        functionReturnCount: 0,
        selectedModalType: 0, // 选中默认的业务 
    },
    effects: {
        // 获取功能分类列表
        *getFunctionClassifyList({ payload, callback }, { call, put, select }){
            const {data} = yield call(getFunctionClassifyList,payload,'','incompatibleSettingsSpace')
            
            if(data.code = REQUEST_SUCCESS){
                const list = data.data.list&&data.data.list.length>0&&data.data.list.map((item,index)=>{
                    item.number = index+1
                    return item
                })||[]
                yield put({
                    type: 'updateStates',
                    payload: {
                        functionList: list,
                        functionStart: data.data.currentPage,
                        functionReturnCount: data.data.returnCount
                    }
                })
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },    
        // 删除不相容规则
        *deleteIncompatible({ payload, callback }, { call, put, select }){
            const {data} = yield call(deleteIncompatible,payload,'','incompatibleSettingsSpace')
            if(data.code == REQUEST_SUCCESS){
                message.success('删除成功')
                callback&&callback(data)
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },    
        // 编辑保存
        *editSave({ payload, callback }, { call, put, select }){
            const {data} = yield call(updateIncompatible,payload,'','incompatibleSettingsSpace')
            if(data.code == REQUEST_SUCCESS){
                callback&&callback(data)
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },  
        // 获取编辑列表
        *getIncompatibleRefList({ payload, callback }, { call, put, select }){
            const type = payload.selectedModalType
            delete  payload.selectedModalType
            const {data} = yield call(getIncompatibleRefList,payload,'','incompatibleSettingsSpace')
            if(data.code == REQUEST_SUCCESS){
                if(type !=1){
                    const arr = data.data.refObjList&&data.data.refObjList.map(item=>{
                        return {
                            id: item.roleId,
                            roleName: item.roleName,
                            roleCode: item.roleCode
                        }
                    })
                    const arrKey =  data.data.refObjList&&data.data.refObjList.map(item=>item.roleId)
                    yield put({
                        type: 'updateStates',
                        payload: {
                            selectedChoseArr: arr||[],
                            selectedRowKey: arrKey||[]
                        }
                    })
                }
                // 编辑 职能分类
                if(type == 1){
                    const arr = data.data.refObjList&&data.data.refObjList.map(item=>{
                        return {
                            id: item.roleId,
                            functionTypeName: item.roleName,
                            functionTypeCode: item.roleCode
                        }
                    })
                    const arrKey =  data.data.refObjList&&data.data.refObjList.map(item=>item.roleId)
                    yield put({
                        type: 'updateStates',
                        payload:{ 
                            selectedChoseJobArr: arr||[],
                            selectedRowKeyArr: arrKey||[]
                        }
                    })
                }

            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 新增
        *addIncompatible({ payload, callback }, { call, put, select }){
            const {data} = yield call(addIncompatible,payload,'','incompatibleSettingsSpace')
            if(data.code == REQUEST_SUCCESS){
                callback&&callback(data)
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 获取不相容规则列表
        *getIncompatibleList({ payload, callback }, { call, put, select }){
            const {data} = yield call(getIncompatibleList,payload,'','incompatibleSettingsSpace')
            if(data.code == REQUEST_SUCCESS){
                yield put({
                    type: 'updateStates',
                    payload: {
                        tableIncompatibleList: data.data.list,
                        returnCountList: data.data.returnCount,
                        currentPage: data.data.currentPage
                    }
                })
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        *getSysRoles({ payload, callback }, { call, put, select }){
            const {data} = yield call(getSysRoles,payload,'','incompatibleSettingsSpace')
            if(data.code == REQUEST_SUCCESS){
                yield put({
                    type: 'updateStates',
                    payload: {
                        roleList: data.data.list,
                        returnCount: data.data.returnCount,
                        rulesCurrentPage: data.data.currentPage
                    }
                })
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
            
        }
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