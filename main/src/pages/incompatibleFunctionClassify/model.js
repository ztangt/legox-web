import { message } from 'antd';
import apis from 'api';
const {getFunctionClassifyList,postAddFunctionType,deleteFunctionType,isEnableFunctionType,
    putFunctionType,bindPostFunctionType,findBindResource} = apis
import { REQUEST_SUCCESS } from '../../service/constant'


export default {
    namespace: 'functionClassifySpace',
    state: {
        currentPage: 1,
        currentHeight: 0,
        returnCount: 0,
        curLimit: 10,
        limit: 10,
        currentNode: {},
        searchWord:'',
        tableList: [],
        selectedKey:[], // 选中id
        selectedRows:[],//选中行
        selectedMenuLeft: [], // 选中之后剩余的全部
        currentMenuList:[],// 当前选中的列表
        // selectedKey1570343816345485313:[], // 支撑平台
        // selectedKey1570343816345485315:[], // 微协同
        // selectedKey1712722584384057345:[], // 测试系统
        // selectedKey1570343816345485314: [], // 业务平台
    },  
    effects: {
        // 查询已经绑定的资源
        *findBindResource({ payload, callback }, { call, put, select }){
            const {data} = yield call(findBindResource,payload,'','functionClassifySpace')
            if(data.code== REQUEST_SUCCESS){
                const current =data.data&&data.data.curMenuList? data.data.curMenuList.map(item=>{
                    item.id = item.menuId
                    return item
                }):[]
                const currentMenu = data.data&&data.data.curMenuList?current:[]
              // 全部
              const menu = data.data&&data.data.allMenuList?data.data.allMenuList:[]
                // current
                const currentMenuId = currentMenu.map(item=>item.menuId)
                // all
                const menuId = menu.map(item=>item.menuId)
                callback&&callback(menu,currentMenu)
                const menuArrLeft = [] // 剩余id
                console.log("currentMenuId",currentMenuId)
                menuId.forEach(item=>{
                    // 如果当前为空也要禁止操作
                    if(currentMenuId.length==0){
                        menuArrLeft.push(item)
                    }
                    // 只有当前的不为空的时候才能够禁止点击
                    if(currentMenuId.length>0){
                        if(!currentMenuId.includes(item)){
                            menuArrLeft.push(item)
                        }
                    }
                })   
                console.log("menuArrLeft=00",menuArrLeft)
                yield put({
                    type:'updateStates',
                    payload:{
                        // selectedKey: menuIds||[],
                        selectedMenuLeft: [...new Set(menuArrLeft)],
                        currentMenuList: currentMenu
                    }
                })
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }    
        },

        // 获取列表
        *getFunctionClassifyList({ payload, callback }, { call, put, select }){
            const {data} = yield call(getFunctionClassifyList,payload,'','functionClassifySpace')
            if(data.code == REQUEST_SUCCESS){
                const list = data.data.list&&data.data.list.length>0&&data.data.list.map((item,index)=>{
                    item.number = index+1
                    return item
                })||[]
                yield put({
                    type: 'updateStates',
                    payload: {
                        returnCount: data.data.returnCount,
                        tableList: list,
                        currentPage: data.data.currentPage
                    }
                })
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
            
        },
        // 新增
        *postAddFunctionType({ payload, callback }, { call, put, select }){
            const {data} = yield call (postAddFunctionType,payload,'','functionClassifySpace')
            if(data.code == REQUEST_SUCCESS){ 
                callback&&callback(data)
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 删除
        *deleteFunctionType({ payload, callback }, { call, put, select }){
            const {data} = yield call(deleteFunctionType,payload,'','functionClassifySpace')
            if(data.code == REQUEST_SUCCESS){
                message.success('删除成功')
                callback&&callback(data)
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 是否启用
        *isEnableFunctionType({ payload, callback }, { call, put, select }){
            const {data} = yield call(isEnableFunctionType,payload,'','functionClassifySpace')
            if(data.code == REQUEST_SUCCESS){
                callback&&callback(data)
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 编辑职能分类
        *putFunctionType({ payload, callback }, { call, put, select }){
            const {data} = yield call(putFunctionType,payload,'','functionClassifySpace')
            if(data.code == REQUEST_SUCCESS){
                callback&&callback(data)
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 绑定模块资源
        *bindPostFunctionTypeSave({ payload, callback }, { call, put, select }){
            const {data} = yield call(bindPostFunctionType,payload,'bindPostFunctionTypeSave','functionClassifySpace')
            if(data.code == REQUEST_SUCCESS){
                callback&&callback(data)
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

