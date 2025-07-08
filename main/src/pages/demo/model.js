import { message } from 'antd'
import apis from 'api'
import { REQUEST_SUCCESS } from '../../service/constant'

export default {
    namespace: 'openSystemDemo',//命名空间
    state: {
        allPage: 0,
        currentPage: 0,
        returnCount: 0,
        list: [],//列表数据
        selectedRowKeys: '',
        limit: 10,
        searchWord: '',
        detailData: {},//详细信息
        isShow: false,
        paramsJson:'',
        selectCtlgId:'',
        ctlgTree:[],
        oldCtlgTree:[],
        fileChunkedList: [], // 文件上传用，文件列表
        index: 0,
        md5: '', // 文件上传用，md5格式
        fileName: '', // 文件名
        fileSize: 0, // 文件大小
        fileExists: '',
        filePath: '',
        md5FileId: '',
        md5FilePath: '',
        needfilepath: '',
        fileStorageId: '', //存储信息到数据库返回id
        getFileMD5Message: {}, //md5返回的文件信息
    },
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            history.listen(location => {
                if (history.location.pathname === '/openSystem') {
                    dispatch({
                        type: 'updateStates',
                        payload: {
                            pathname: history.location.pathname
                        }
                    })
                }
            })
        }
    },
    effects: {
        //获取业务应用类别树
    *getCtlgTree({ payload,callback }, { call, put, select }) {
        const {data} = yield call(apis.getCtlgTree, payload);
        if(data.code==200){
          //默认为第一个
          yield put({
            type:"updateStates",
            payload:{
              ctlgTree:data.data.list,
              oldCtlgTree:_.cloneDeep(data.data.list),
              selectCtlgId:data.data.list.length?data.data.list[0].nodeId:''
            }
          })
          callback&&callback(data.data.list)
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      },
       //通过类别获取业务应用
    *getBusinessList({ payload }, { call, put, select }) {
        const {data} = yield call(apis.getBusinessList, payload);
        if(data.code==200){
          yield put({
            type:"updateStates",
            payload:{
              ...data.data,
              businessList:data.data.list
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      },
        *getOpenSystemList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getOpenSystemList, payload)
                if (data.code == REQUEST_SUCCESS) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            ...data.data
                        }
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg)
                }
            } catch (e) {

            } finally { }

        },
        //删除
        *deleteOpenSystem({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.deleteOpenSystem,payload) 
                if(data.code==REQUEST_SUCCESS){
                    const {list}=yield select(state=>state.openSystem)
                    // payload.clientId.split(',').forEach(item=>{
                    //     list.splice(list.findIndex(val=>val=item),1)
                    // })
                    const res=list.filter(item=>item.id!==payload.clientId)
                    console.log(res,'res');
                    yield put({
                        type:'updateStates',
                        payload:{
                            list:res,
                            returnCount:res.length,
                            selectedRowKeys:''
                        }
                    })
                    message.success(data.msg)
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg)
                }
            }catch(e){

            }finally{}
        },
        //批量删除
        *deleteOpenSysIds({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.deleteOpenSysIds,payload)
                if(data.code==REQUEST_SUCCESS){
                    const {list}=yield select(state=>state.openSystem)
                    payload.ids.split(',').forEach(item => {
                        list.splice(list.findIndex(val => val === item), 1)
                    });
                    yield put({
                        type:'updateStates',
                        payload:{
                          selectedRowKeys:'',
                            list:list,
                           returnCount:list.length
                        }
                    })

                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg)
                }

            }catch(e){

            }finally{}
        },

        //新增
        *addOpenSystem({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.addOpenSystem,payload)
                if(data.code==REQUEST_SUCCESS){
                const {currentPage,limit,searchWord}=yield select(state=>state.openSystem)
                     yield put({
                       type:'getOpenSystemList',
                        payload:{
                            start:currentPage,
                            limit:limit,
                            searchWord:searchWord
                       }
                     })

                    message.success(data.msg)
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg)
                }
            }catch(e){

            }finally{}
        },
        //查看
        *getDetailOpenSystem({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.getDetailOpenSystem,payload)
                console.log(data,'data===');
                if(data.code==REQUEST_SUCCESS){
                    yield put({
                        type:'updateStates',
                        payload:{
                            detailData:data.data
                        }
                    })
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg)
                }
            }catch(e){

            }finally{}
        },
        //修改
        *updateOpenSystem({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.updateOpenSystem,payload)
                if(data.code==REQUEST_SUCCESS){
                    const {currentPage,limit,searchWord}=yield select(state=>state.openSystem)
                     yield put({
                       type:'getOpenSystemList',
                        payload:{
                            start:currentPage,
                            limit:limit,
                            searchWord:searchWord
                       }
                     })
                    message.success(data.msg)
                }
            }catch(e){

            }finally{

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