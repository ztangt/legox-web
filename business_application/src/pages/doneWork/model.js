import { message } from 'antd';
import apis from 'api';
const limit=10;
export default {
  namespace: 'doneWork',
  state: {
    limit: 10,
    allPages: 0,
    returnCount: 0,
    currentPage: 0,
    listTitle:{},
    searchWord:'',
    list:[],
    searchColumnCodes:[],
    workRules:[],
    listColumnCodes:[],
    workRuleId:'',
    isShowDetail:false,//撤回任务详情
    selectedRowKeys:[],
    tableData:[],
    rowId:'',
    headerParams:{},
    isConfirm:false
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        if (location.pathname === '/doneWork') {
          // dispatch({
          //   type:'updateStates',
          //   payload:{
          //     limit:limit
          //   }
          // })
        }
      });
    },
  },
  effects: {
    *getDoneWork({payload,callback},{call,put,select}){
      if(!payload.actName){
        delete payload.actName
      }
      const {data} = yield call(apis.getDoneWork,payload,'','doneWork');
      if(data.code==200){
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     ...data.data
        //   }
        // })
        callback&&callback(data.data)
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //撤销
    *recoverBizInfo({payload},{call,put,select}){
      const {data} = yield call(apis.recoverBizInfo,payload,'','doneWork');
      if(data.code==200){
        message.success('撤回成功');
        //重新获取列表
        const {limit,searchWord,paramsJson,workRuleId,currentPage,list,groupCode} = yield select(state=>state.doneWork);
        let start = currentPage;
        if(list.length==1&&currentPage!=1){
          start=currentPage-1;
        }
        yield put({
          type:"getDoneWork",
          payload:{
            searchWord,
            paramsJson:JSON.stringify(paramsJson),
            start:1,
            limit,
            workRuleId:groupCode=='R0000'?'':workRuleId
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
     //跟踪取消跟踪
     *traceWork({payload,params,callback},{call,put,select}){
      payload.headers=params
      const {data} = yield call(apis.traceWork,payload,'','doneWork');
      if(data.code==200){
        message.success('设置成功');
        const {list} = yield select(state=>state.doneWork);
        //将选中的id更新跟踪状态
        list.map((item)=>{
          if(payload.bizInfoIds.includes(item.bizInfoId)){
            item.isTrace=payload.traceType
          }
        })
        callback&&callback(list);
        // yield put({
        //   type:"updateStates",
        //   payload:{
        //     list:list
        //   }
        // })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //撤回详情
    *recallTask({payload,headerParams,callback},{call,put,select}){
      payload.headers={
        bizSolId:headerParams.bizSolId,
        mainTableId:headerParams.mainTableId,
        deployFormId:headerParams.formDeployId?headerParams.formDeployId:'',
        bizInfoId:headerParams.bizInfoId?headerParams.bizInfoId:'',
      }
      const {data}=yield call(apis.recallTask,payload,'','doneWork')
      if(data.code==200){
        data.data.list.forEach((item,index)=>{
          // debugger
          item.flowTasks?.forEach((val,ind)=>{
            if(ind==0){
              val.colSpan=item.flowTasks.length
            }
            val.stepName=item.actName
            val.bizTaskId=item.bizTaskId
            val.key='flowTasks'+'_'+item.bizTaskId
          })
          item.circulateTasks?.forEach((val,ind)=>{
            val.stepName=item.actName
            val.bizTaskId=item.bizTaskId
            val.colSpan=1
            val.key=val.id+'_'+item.bizTaskId
          })
          item.returnTasks?.forEach((val,ind)=>{
            val.stepName=item.actName
            val.bizTaskId=item.bizTaskId
            val.colSpan=1
            val.key=val.id+'_'+item.bizTaskId
          })
          item.newList = [].concat(item.circulateTasks?item.circulateTasks:[],item.returnTasks?item.returnTasks:[],item.flowTasks?item.flowTasks:[])
        })
        let tableData = []
        data.data.list.forEach(item=>{
          item.newList?.forEach(val=>{
            tableData.push(val)
          })

        })
        callback&&callback(data.data.list,tableData,data.data.list.length==1&&data.data.list[0].simple?false:true)
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //撤回
    *recoverTask({payload,headerParams,callback},{call,put,select}){
      payload.headers={
        bizSolId:headerParams.bizSolId,
        mainTableId:headerParams.mainTableId,
        deployFormId:headerParams.formDeployId?headerParams.formDeployId:'',
        bizInfoId:headerParams.bizInfoId?headerParams.bizInfoId:'',
      }
      const {data}=yield call(apis.recoverTask,payload,'','doneWork')
      if(data.code==200){
        message.success('撤回成功')
        callback&&callback()
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
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
    },
  },
};
