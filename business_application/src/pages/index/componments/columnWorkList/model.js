import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../../../service/constant';

export default {
  namespace: 'columnWorkList',
  state: {
    todoList: [],
    radioList: [],
    traceList: [],
    circulateList: [],
    todoCount: 0,
    traceCount: 0,
    circulateCount: 0,
    isRefreshWorkList:false,
    requestTime:1000*1800,//半小时
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
      });
    },
  },
  effects: {
    *getWorkRule({payload, callback},{call,put,select}){
      const {data} = yield call(apis.getWorkRule,payload,'','columnWorkList');
      if(data.code == REQUEST_SUCCESS){
        let tmp = data.data?.list || [];
        //首项添加全部前端写死
        tmp.unshift({
          title: '全部',
          groupName: '全部',
          groupCode:'R0000',
          workRuleId: '1777887666778166122355665'
        })
        tmp.forEach(element => {
          element.value = element.groupCode === 'R0000' ? '' : element.workRuleId;
          element.workRuleId = element.groupCode === 'R0000' ? '' : element.workRuleId;
          // element.value = element.workRuleId;
          element.label = element.groupName;
        });

        yield put({
          type:'updateStates',
          payload:{
            radioList: tmp
          }
        })
        callback&&callback(tmp)
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getTodoWork({payload, callback},{call,put,select}){
      const {data} = yield call(apis.getTodoWork,payload,'','columnWorkList');
      if(data.code == REQUEST_SUCCESS){
        if (!payload.workRuleId) {
          localStorage.setItem('waitData',data.data.returnCount);
          yield put({
            type:'updateStates',
            payload:{
              todoCount: data.data.returnCount,
            }
          })
        }
        callback&&callback(data.data.list);
        yield put({
          type:'updateStates',
          payload:{
            todoList: data.data.list,
          }
        })

      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getTraceWork({payload, callback},{call,put,select}){
      const {data} = yield call(apis.getTraceWork,payload,'','columnWorkList');
      if(data.code == REQUEST_SUCCESS){
        if (!payload.workRuleId) {
          yield put({
            type:'updateStates',
            payload:{
              traceCount: data.data.returnCount,
            }
          })
        }
        callback&&callback(data.data.list);
        yield put({
          type:'updateStates',
          payload:{
            traceList: data.data.list,
          }
        })

      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getCirculateWork({payload, callback},{call,put,select}){
      const {data} = yield call(apis.getCirculateWork,payload,'','columnWorkList');
      if(data.code==200){
        if (!payload.workRuleId) {
          yield put({
            type:'updateStates',
            payload:{
              circulateCount: data.data?.list?.filter(item=>item.taskStatus==0).length,
            }
          })
        }
        callback&&callback(data.data.list);
        yield put({
          type:'updateStates',
          payload:{
            circulateList: data.data.list,
          }
        })

      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
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
