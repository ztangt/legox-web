import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import moment from 'moment';
import 'moment/locale/zh-cn';
import _ from "lodash";
import {history} from 'umi';
import {env} from '../../../../project_config/env'
moment.locale('zh-cn');

export default {
  namespace: 'manageModel',
  state: {
      tableData:[],
      returnCount:0,
      currentPage:1,
      selectedRowKeys:[],
      limit:10,
      searchWord:'',
      tenantList:[],
      isShowDetails:false,
      selectedDeatailRowKeys:[],
      isShowButton:'',
      ctlgTree:[],
      selectedRows:[],
      isAddLinkDataSource:false,
      id:'',
      dataOrigin:[],
      tenantDetailList:[],
      
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
        if(history.location.pathname==='/manageModel'){
            // dispatch({
            //     type:'getSolmodelList',
            //     payload:{
            //         start:1,
            //         limit:10,
            //         searchWord:''
            //     }
            // })
        }
      });
    }
  },
  effects: {
   *getSolmodelList({payload,callback},{call,put,select}){
        const {data}=yield call(apis.getSolmodelList,payload)
        if(data.code==REQUEST_SUCCESS){
            console.log(data,'data--');
            yield put({
                type:'updateStates',
                payload:{
                    tableData:data.data.list,
                    returnCount:data.data.returnCount,
                    currentPage:data.data.currentPage
                }
            })
            callback&&callback()
        }else if(data.code != 401 && data.code != 419 && data.code !=403){
            message.error(data.msg);
        }
   },
   //删除模型
   *deleteSolmodel({payload,callback},{call,put,select}){
        const {data}=yield call(apis.deleteSolmodel,payload)
        const {currentPage,limit,searchWord}=yield select((state)=>state.manageModel)
        if(data.code==REQUEST_SUCCESS){
            message.success('删除成功')
            yield put ({
                type:'updateStates',
                payload:{
                    selectedRowKeys:[]
                }
            })
            yield put({
                type:'getSolmodelList',
                payload:{
                    start:currentPage,
                    limit,
                    searchWord,
                }
            })
        }else if(data.code != 401 && data.code != 419 && data.code !=403){
            message.error(data.msg);
        }
   },
   //获取租户信息列表(分页查询)
   *getTenantList({payload,callback},{call,put,select}){
        const {data}=yield call(apis.getTenantList,payload)
        const {selectedRows}=yield select(state=>state.manageModel)
        if(data.code==REQUEST_SUCCESS){
            yield put({
                type:'updateStates',
                payload:{
                    tenantList:data.data.list.filter(item=>item.id!==selectedRows[0].tenantId)
                }
            })
            callback&&callback(data.data.list)
        }else if(data.code != 401 && data.code != 419 && data.code !=403){
            message.error(data.msg);
        }
   },
   //获取业务应用类别树
   *getCtlgTree({ payload }, { call, put, select }) {
    const {data} = yield call(apis.getCtlgTree, payload);
    if(data.code==200){
      //默认为第一个
      yield put({
        type:"updateStates",
        payload:{
          ctlgTree:data.data.list,
        }
      })
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  //下发应用模型接口
  *sendSolmodel({payload,callback},{call,put,select}){
    const {data}=yield call(apis.sendSolmodel,payload)
    if(data.code==200){

    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  //获取数据源
  *getDatasourceTree({payload,callback},{call,put,select}){
    const {data}=yield call(apis.getDatasourceTree,payload)
    if(data.code==200){
      yield put({
        type:'updateStates',
        payload:{
          dataOrigin:data.data.list
        }
      })
      console.log(data,'data--127');
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  // 数据源测试接口
  *addDatasourceTest({ payload }, { call, put, select }) {
    const { data } = yield call(apis.addDatasourceTest, payload);
    if (data.code == REQUEST_SUCCESS) {
        if (data.data) {
            message.success('连接成功');
        } else {
            message.error('连接失败');
        }
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
    }
},
  // 添加数据源
  *addDatasource({ payload, callback }, { call, put, select }) {
    const { data } = yield call(apis.addDatasource, payload);
    if (data.code == REQUEST_SUCCESS) {
        message.success('添加成功');
        // yield put({
        //     type: 'getDatasourceTree',
        // })
        yield put({
            type: 'updateStates',
            payload: {
              isAddLinkDataSource: false,
            }
        })
        callback&&callback()
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
    }
  },
  //获取应用建模表数据
  *getSolmodelTableData({payload,callback},{call,put,select}){
      const { data } = yield call(apis.getSolmodelTableData, payload);
      if (data.code == REQUEST_SUCCESS) {
        const {tenantDetailList}=yield select(state=>state.manageModel)
        for (let index = 0; index < tenantDetailList.length; index++) {
          const element = tenantDetailList[index];
          element.children=data.data.list?data.data.list:[]
        }
        yield put({
          type: 'updateStates',
          payload: {
            tenantDetailList,
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
    },
    //获取表集合
    *getTenantDatasource({payload,callback},{call,put,select}){
      const {data}=yield call(apis.getTenantDatasource,payload)
      if(data.code==REQUEST_SUCCESS){
        const {tenantDetailList}=yield select(state=>state.manageModel)
        for (const key in data.data.data) {
          if (Object.hasOwnProperty.call(data.data.data, key)) {
            for (let index = 0; index < tenantDetailList.length; index++) {
              const item = tenantDetailList[index];
              if(key==item['id']){
                item.tableDatasource=data.data.data[key]
                item.newtableDatasource=data.data.data[key]
              } 
            }
          }
        }
        console.log(tenantDetailList,'tenantDetailList');
        yield put({
          type: 'updateStates',
          payload: {
            tenantDetailList,
          }
        })
        
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
    }
    },
    //创建表
    *addSourceTable({payload,callback},{call,put,select}){
      const { data } = yield call(apis.addSourceTable, payload);
      if (data.code == REQUEST_SUCCESS) {
        callback&&callback(data.data)
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
    },
    //校验字段一致性
    *validatorDatasource({payload,callback},{call,put,select}){
      const { data } = yield call(apis.validatorDatasource, payload);
      if (data.code == REQUEST_SUCCESS) {
        callback&&callback(data.data)
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
    }
  },

  reducers: {
    updateStates(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
