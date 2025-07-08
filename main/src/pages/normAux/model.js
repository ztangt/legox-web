import { message } from 'antd'
import apis from 'api'

export default {
  namespace: 'normAux',//命名空间
  state: {
    isShowAddModal: false,
    allPage: 0,
    currentPage: 1,
    returnCount: 0,
    list: [],//列表数据
    selectedRowKeys: '',
    limit: 10,
    search: '',
    lastKey: 1,
    modelTitle:'新增辅助核算项',
    detailData: {},//详细信息
    allTableData:[], // 所有的表
    dictData:[], // 所有的辅助核算项
    colData:[],// 表中的列
    initData: [
      {
        "key": 1,
        "columnCode": "",
        "auxCode": "",
      },
    ],
  },
  effects: {
    //获取登录审计日志
    *getNormAuxList({ payload }, { call, put, select }) {
      const {data} = yield call(apis.getNormAuxList, payload);
      if(data.code==200){
        yield put({
          type:"updateStates",
          payload:{
            list:data.data.list,
            returnCount: data.data.returnCount,
            currentPage: data.data.currentPage,
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getNormAuxTable({ payload, callback}, { call, put, select }) {
      try{
        const {data}=yield call(apis.getNormAuxTable,payload)
        if(data.code==200){
          yield put({
            type:'updateStates',
            payload:{
              allTableData:data.data.list?data.data.list:[]
            }
          })
          callback&&callback(data.data.list?data.data.list: [])
        }else if(data.code!==401){
          message.error(data.msg)
        }
      }catch(e){
        console.log(e);
      }finally{}
    },
    *getNormAuxDict({ payload, callback}, { call, put, select }) {
      try{
        const {data}=yield call(apis.getNormAuxDict,payload)
        if(data.code==200){
          yield put({
            type:'updateStates',
            payload:{
              dictData:data.data.list?data.data.list:[]
            }
          })
          callback&&callback(data.data.list?data.data.list: [])
        }else if(data.code!==401){
          message.error(data.msg)
        }
      }catch(e){
        console.log(e);
      }finally{}
    },
    *getNormAuxTableColumn({ payload, callback}, { call, put, select }) {
      try{
        const {data}=yield call(apis.getNormAuxTableColumn,payload)
        if(data.code==200){
          yield put({
            type:'updateStates',
            payload:{
              colData:data.data.list?data.data.list:[]
            }
          })
          callback&&callback(data.data.list?data.data.list: [])
        }else if(data.code!==401){
          message.error(data.msg)
        }
      }catch(e){
        console.log(e);
      }finally{}
    },
    *saveNormAux({ payload, callback}, { call, put, select }) {
      try{
        const {data}=yield call(apis.saveNormAux,payload)
        if(data.code==200){
          yield put({
            type:'updateStates',
            payload:{
              colData:data.data.list?data.data.list:[]
            }
          })
          callback&&callback(data.data.list?data.data.list: [])
        }else if(data.code!==401){
          message.error(data.msg)
        }
      }catch(e){
        console.log(e);
      }finally{}
    },
    *getByTableCode({ payload, callback}, { call, put, select }) {
      try{
        const {data}=yield call(apis.getByTableCode,payload)
        if(data.code==200){
          // 数据回填格式化处理
          const initData = data.data.list.map((item, index) => ({
            key: index + 1,
            columnCode: item.businessColCode,
            auxCode: item.auxLableCode,
            columnName: item.businessColName,
            auxName: item.auxLableName,
          }));

          yield put({
            type: 'updateStates',
            payload: {
              initData, // 回填表格数据
            }
          });
          callback && callback(data.data.list || []);
        }else if(data.code!==401){
          message.error(data.msg)
        }
      }catch(e){
        console.log(e);
      }finally{}
    },
    *deleteNormAuxByTableCode({ payload, callback}, { call, put, select }) {
      try{
        const {data}=yield call(apis.deleteNormAuxByTableCode,payload)
        if(data.code==200){
          callback && callback(data || []);
        }else if(data.code!==401){
          message.error(data.msg)
        }
      }catch(e){
        console.log(e);
      }finally{}
    },

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
