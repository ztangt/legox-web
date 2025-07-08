import { message } from 'antd';
import apis from 'api';
const limit=10;
export default {
  namespace: 'monitorWork',
  state: {
    limit: 10,
    allPages: 0,
    returnCount: 0,
    currentPage: 0,
    searchWord:'',
    list:[],
    searchColumnCodes:[],
    ctlgTree:[],
    businessList:[],
    selectedBizSolIds:[],
    workRules:[],
    listColumnCodes:[],
    selectedRowKeys:[],
    selectedNodeId:'',
    selectedDataIds:[],
    treeData:[],
    currentNode:[],
    expandedKeys:[],
    treeSearchWord:[],
    selectedDatas:[],
    originalData:[],
    selectNodeType:'',
    bizSigns: [],//签批意见
    adviceVisible: false,//签批意见
    signs: [],//意见
    activateNodes:[],
    listTitle:{},
    transferId:'',//转办行id
    handleList:{},//办理详情
    isTransfer:false,
    detailData:{},//转办详情
    headerParams:{},
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        if (location.pathname === '/monitorWork') {
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
    *getMonitorWork({payload,setState,state},{call,put,select}){
      const {data} = yield call(apis.getMonitorWork,payload,'','monitorWork');
      if(data.code==200){
        setState({
          ...data.data
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //撤销
    *cancleMonitor({payload,params,setState,state},{call,put,select}){
      payload.headers=params
    const {data} = yield call(apis.cancleMonitor,payload,'','monitorWork');
    if(data.code==200){
      message.success('撤销成功');
      //重新获取列表
      const {limit,searchWord} = state;
      yield put({
        type:"getMonitorWork",
        payload:{
          searchWord,
          start:1,
          limit
        },
        setState,
        state
      })
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
  //转办
  *transferTask({ payload,callback,state }, { call, put, select }) {
    const {headerParams} = state;
      payload.headers={
        bizSolId:headerParams.bizSolId,
        mainTableId:headerParams.mainTableId,
        deployFormId:headerParams.formDeployId?headerParams.formDeployId:'',
        bizInfoId:headerParams.bizInfoId?headerParams.bizInfoId:'',
      }
    const {data} = yield call(apis.transferTask, payload,'','monitorWork');
    if(data.code==200){
      message.success('转办成功');
      callback&&callback();
    }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      message.error(data.msg);
    }
  },
    //获取签批意见流程列表
    *getBizTaskSingns({ payload,params,setState,state }, { call, put, select }) {
      payload.headers=params
      const {data} = yield call(apis.getBizTaskSingns, payload,'','monitorWork');
      if(data.code==200){
        let bizSigns = [];
        if(data.data.list){
          for (let index = 0; index < data.data.list.length; index++) {
            const element = data.data.list[index];
            if(element.signList.length!=0){
              for (let flag = 0; flag < element.signList.length; flag++) {
                const sign = element.signList[flag];
                if(flag==0){
                  sign['colSpan'] = element.signList.length
                }
                sign['actName'] = element.actName
                sign['bizTaskId'] = element.bizTaskId
                sign['endTime'] = element.endTime
                sign['makeAction'] = element.makeAction
                sign['ruserName'] = element.ruserName
                sign['startTime'] = element.startTime
                sign['suserName'] = element.suserName
                sign['taskStatus'] = element.taskStatus
                bizSigns.push(sign)
              }
            }else{
              element['colSpan'] = 1
              bizSigns.push(element)
            }
          }
        }
        setState({
          bizSigns,
          signs: data.data,
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //意见修改
    *signBatch({ payload,callback,setState,state }, { call, put, select }) {
      const {data} = yield call(apis.signBatch, payload,'','monitorWork');
      if(data.code==200){
        setState({
          adviceVisible: false
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取激活节点
    *getActivateNodes({ payload,params,callback,setState,state }, { call, put, select }) {
      payload.headers=params
      const {data} = yield call(apis.getActivateNodes, payload,'','monitorWork');
      if(data.code==200){
        setState({
          activateNodes:data.data.list
        })
        callback&&callback();
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //激活节点
    *saveActivateNode({ payload,callback,setState,state }, { call, put, select }) {
      const {headerParams} = state;
      payload.headers={
        bizSolId:headerParams.bizSolId,
        mainTableId:headerParams.mainTableId,
        deployFormId:headerParams.formDeployId?headerParams.formDeployId:'',
        bizInfoId:headerParams.bizInfoId?headerParams.bizInfoId:'',
      }
      const {data} = yield call(apis.saveActivateNode, payload,'','monitorWork');
      if(data.code==200){
        message.success('激活成功');
        //重新获取数据
        const {searchWord,limit,paramsJson} = state;
        yield put({
          type:'getMonitorWork',
          payload:{
            searchWord,
            start:0,
            limit,
            paramsJson:JSON.stringify(paramsJson),
          },
          setState,
          state
        })
        callback&&callback();
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //挂起
    *monitorHangup({payload,params,setState,state},{call,put,select}){
      payload.headers=params
      const {data}=yield call(apis.monitorHangup,payload,'','monitorWork')
      if(data.code==200){
        //重新获取数据
        const {searchWord,limit,paramsJson} = state;
        yield put({
          type:'getMonitorWork',
          payload:{
            searchWord,
            start:0,
            limit,
            paramsJson:JSON.stringify(paramsJson),
          },
          setState,
          state
        })
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
        message.error(data.msg);
      }

    },
    //恢复
    *monitorRecover({payload,params,setState,state},{call,put,select}){
      payload.headers=params
      const {data}=yield call(apis.monitorRecover,payload,'','monitorWork')
      if(data.code==200){
        //重新获取数据
        const {searchWord,limit,paramsJson} = state;
        yield put({
          type:'getMonitorWork',
          payload:{
            searchWord,
            start:0,
            limit,
            paramsJson:JSON.stringify(paramsJson),
          },
          setState,
          state
        })
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
        message.error(data.msg);
      }

    },
    //终止
    *completeBiz({payload,params,setState,state},{call,put,select}){
      payload.headers=params
      const {data}=yield call(apis.completeBiz,payload,'','monitorWork')
      if(data.code==200){
        //重新获取数据
        const {searchWord,limit,paramsJson} = state;
        yield put({
          type:'getMonitorWork',
          payload:{
            searchWord,
            start:0,
            limit,
            paramsJson:JSON.stringify(paramsJson),
          },
          setState,
          state
        })
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
        message.error(data.msg);
      }

    },
    *getBpmnDetail({payload,params,setState,state},{call,put,select}){
      payload.headers=params
      const {data}=yield call(apis.getBpmnDetail,payload,'','monitorWork')
      if(data.code==200){
        setState({
          detailData:data.data
        })
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
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
