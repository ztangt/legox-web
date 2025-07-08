import {message} from 'antd'
import apis from 'api'
import {REQUEST_SUCCESS} from '../../service/constant'

export default {
    namespace:'systemAccess',
    state:{
        allPage:0,
        currentPage:0,
        returnCount:0,
        list:[],//列表数据
        selectedRowKeys:'',
        limit:0,
        searchWord:'',
        detailData:{},//详细信息
        isShow:false,
    },
    subscriptions:{
        setup({dispatch,history},{call,select}){
            // history.listen(location=>{
            //     if(history.location.pathname==='/systemAccess'){
            //         dispatch({
            //             type:'updateStates',
            //             payload:{
            //                 pathname:history.location.pathname
            //             }
            //         })
            //     }
            // })
        }
    },
    effects:{
        *getSystemAccessList({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.getSystemAccessList,payload)
                console.log(data,'data');
                if(data.code==REQUEST_SUCCESS){
                    yield put({
                        type:'updateStates',
                        payload:{
                            ...data.data
                        }
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg, 5)
                  }
            }catch(e){

            }finally{}
        },
        //删除
        *deleteSystemAccess({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.deleteSystemAccess,payload)
                console.log(data);
                if(data.code==REQUEST_SUCCESS){
                    const {list}=yield select(state=>state.systemAccess)
                    const res=list.filter(item=>item.id!==payload.id)
                    yield put({
                        type:'updateStates',
                        payload:{
                            list:res,
                            returnCount:res.length,
                            selectedRowKeys:'',
                        }
                    })
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg, 5)
                  }
                
            }catch(e){

            }finally{}
        },
        //删除多条
        *deleteSysIds({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.deleteSysIds,payload)
                if(data.code==REQUEST_SUCCESS){
                    const {list}=yield select(state=>state.systemAccess)
                    payload.ids.split(',').forEach(item => {
                        list.splice(list.findIndex(val => val === item), 1)
                    });
                    yield put({
                        type:'updateStates',
                        payload:{
                            list:list,
                            returnCount:list.length,
                            selectedRowKeys:'',
                        }
                    })
                }
            }catch(e){

            }finally{}
        },
        //查看单条系统信息
        *getDatailSystem({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.getDatailSystem,payload)
                if(data.code==REQUEST_SUCCESS){
                    yield put({
                        type:'updateStates',
                        payload:{
                            detailData:data.data
                        }
                    })
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg, 5)
                  }
            }catch(e){

            }finally{

            }
        },
        *addSystemAccess({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.addSystemAccess,payload)
                const {currentPage,limit,searchWord}=yield select(state=>state.systemAccess)
                if(data.code==REQUEST_SUCCESS){
                    yield put({
                        type:'getSystemAccessList',
                        payload:{
                            start:currentPage,
                            limit,
                            searchWord
                        }
                    })
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg, 5)
                  }
            }catch(e){

            }finally{}
        },
        *updateSystemAccess({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.updateSystemAccess,payload)
                const {currentPage,limit,searchWord}=yield select(state=>state.systemAccess)
                if(data.code==REQUEST_SUCCESS){
                    yield put({
                        type:'getSystemAccessList',
                        payload:{
                            start:currentPage,
                            limit,
                            searchWord
                        }
                    })
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg, 5)
                  }
            }catch(e){

            }finally{}
        }
    },
    reducers:{
        updateStates(state,action){
            return {
                ...state,
                ...action.payload
            }
        }
    }

}