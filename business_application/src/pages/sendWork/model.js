import { message } from 'antd';
import apis from 'api';
const limit=10;
export default {
  namespace: 'sendWork',
  state: {
    limit: 10,
    allPages: 0,
    returnCount: 0,
    currentPage: 0,
    listTitle:{},
    searchWord:'',
    list:[],
    searchColumnCodes:[],
    ctlgTree:[],
    businessList:[],
    workRules:[],
    listColumnCodes:[],
    headerParams:{},
    rowId:'',
    tableData:[],
    isShowDetail:false,//撤回任务详情
    selectedRowKeys:[],
    isConfirm:false
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        if (location.pathname === '/sendWork') {
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
    //待办事项
    *getSendWork({payload,callback},{call,put,select}){
      if(!payload.actName){
        delete payload.actName
      }
      const {data} = yield call(apis.getSendWork,payload,'','sendWork');
      if(data.code==200){

        yield put({
          type:'updateStates',
          payload:{
            ...data.data
          }
        })
        callback&&callback(data.data)
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //跟踪取消跟踪
    *traceWork({payload,params,callback},{call,put,select}){
      payload.headers=params
      const {data} = yield call(apis.traceWork,payload,'','sendWork');
      if(data.code==200){
        message.success('设置成功');
        const {list} = yield select(state=>state.sendWork);
        //将选中的id更新跟踪状态
        list.map((item)=>{
          if(payload.bizInfoIds.includes(item.bizInfoId)){
            item.isTrace=payload.traceType
          }
        })
        callback&&callback(list);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //撤销
    // *recoverBizInfo({payload},{call,put,select}){
    //   payload.headers=payload.params
    //   const {data} = yield call(apis.recoverBizInfo,{bizInfoId:payload.bizInfoId},'','sendWork');
    //   if(data.code==200){
    //     message.success('撤回成功');
    //     //重新获取列表
    //     const {limit,searchWord,paramsJson,workRuleId,currentPage,list,groupCode} = yield select(state=>state.sendWork);
    //     let start = currentPage;
    //     if(list.length==1&&currentPage!=1){
    //       start=currentPage-1;
    //     }
    //     yield put({
    //       type:"getSendWork",
    //       payload:{
    //         searchWord,
    //         paramsJson:JSON.stringify(paramsJson),
    //         start:1,
    //         limit,
    //         workRuleId:groupCode=='R0000'?'':workRuleId
    //       }
    //     })
    //   }else if (data.code != 401 && data.code != 419 && data.code !=403) {
    //     message.error(data.msg);
    //   }
    // },
    //撤回详情
    *recallTask({payload,callback,headerParams},{call,put,select}){
      payload.headers={
        bizSolId:headerParams.bizSolId,
        mainTableId:headerParams.mainTableId,
        deployFormId:headerParams.formDeployId?headerParams.formDeployId:'',
        bizInfoId:headerParams.bizInfoId?headerParams.bizInfoId:'',
      }
      const {data}=yield call(apis.recallTask,payload,'','sendWork')
      if(data.code==200){
        let  newList=[]
        data.data.list.forEach((item,index)=>{
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
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     isShowDetail:data.data.list.length==1&&data.data.list[0].simple?false:true,
        //     tableData:tableData,
        //   }
        // })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //撤回
    *recoverTask({payload,callback,headerParams},{call,put,select}){
      payload.headers={
        bizSolId:headerParams.bizSolId,
        mainTableId:headerParams.mainTableId,
        deployFormId:headerParams.formDeployId?headerParams.formDeployId:'',
        bizInfoId:headerParams.bizInfoId?headerParams.bizInfoId:'',
      }
      const {data}=yield call(apis.recoverTask,payload,'','sendWork')
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
