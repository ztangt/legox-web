import { message } from 'antd'
import apis from 'api'
import {DEFAULT_ALL_GROUP_CODE} from "@/service/constant";

export default {
  namespace: 'xxlJob',//命名空间
  state: {
    allPage: 0,
    currentPage: 0,
    returnCount: 0,
    list: [],//列表数据
    selectedRowKeys: '',
    limit: 10,
    search: '',
    detailData: {},//详细信息
    isShowAddModal: false,
    isShowJobModal: false,
    triggerJobId: '',
    setScheduleType: true,
    start: 0,
    length: 1000,
    jobGroup:'',
    triggerStatus:'-1',
    jobDesc:'',
    executorHandler:'',
    author:'',
    jobGroupList:[],
    defaultJobGroupId:0,
  },
  effects: {
    //任务详情列表
    *getXxlJobList({ payload, callback }, { call, put, select }) {
      const {data} = yield call(apis.getXxlJobList, payload);
      if(data.data!=null){
        yield put({
          type:"updateStates",
          payload:{
            list:data.data,
          }
        })
        callback && callback(data);
      }else{
        message.error("获取任务详情列表数据异常！");
      }
    },
    // 查询执行器列表
    *getjobGroup({ payload, callback }, { call, put, select }) {
      const {data} = yield call(apis.getXxlJobGroup, payload);
      if(data.code==200){
        callback && callback(data.data);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 添加任务
    *addJobInfo({ payload, callback }, { call, put, select }) {
      const {data} = yield call(apis.addJobInfo, payload);
      if(data.code==200){
        yield put({
          type:"updateStates",
          payload:{
            isShowAddModal: false,
          }
        })
        callback && callback(data);
      }else if(data.code == 500){
        message.error(data.msg);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 删除任务
    *removeJobInfo({ payload, callback }, { call, put, select }) {
      const {data} = yield call(apis.deleteJobInfo, payload);
      if(data.code==200){
        callback && callback(data);
      }else if(data.code == 500){
        message.error(data.msg);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 启动任务
    *startJob({ payload, callback }, { call, put, select }) {
      const {data} = yield call(apis.jobStart, payload);
      if(data.code==200){
        callback && callback(data);
      }else if(data.code == 500){
        message.error(data.msg);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 停止任务
    *stopJob({ payload, callback }, { call, put, select }) {
      const {data} = yield call(apis.jobStop, payload);
      if(data.code==200){
        callback && callback(data);
      }else if(data.code == 500){
        message.error(data.msg);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 任务执行一次
    *triggerJob({ payload, callback }, { call, put, select }) {
      const {data} = yield call(apis.jobTrigger, payload);
      if(data.code==200){
        callback && callback(data);
      }else if(data.code == 500){
        message.error(data.msg);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
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
