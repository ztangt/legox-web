import { message } from 'antd';
import apis from 'api';
import { history,location } from 'umi';
import _ from 'lodash';
import { parse } from 'query-string';
export default {
  namespace: 'recover',
  state: {
    isShowDetail: false,
    tableData: [],
    returnCount: 0,
    currentPage: 1,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => { });
    },
  },
  effects: {
    //撤回详情
    *recallTask({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.recallTask, payload, '', 'recover')
      if (data.code == 200) {
        let newList = []
        data.data.list.forEach((item, index) => {
          item.flowTasks?.forEach((val, ind) => {
            if (ind == 0) {
              val.colSpan = item.flowTasks.length
            }
            val.stepName = item.actName
            val.bizTaskId = item.bizTaskId
            val.key = 'flowTasks' + '_' + item.bizTaskId
          })
          item.circulateTasks?.forEach((val, ind) => {
            val.stepName = item.actName
            val.bizTaskId = item.bizTaskId
            val.colSpan = 1
            val.key = val.id + '_' + item.bizTaskId
          })
          item.returnTasks?.forEach((val, ind) => {
            val.stepName = item.actName
            val.bizTaskId = item.bizTaskId
            val.colSpan = 1
            val.key = val.id + '_' + item.bizTaskId
          })
          item.newList = item.flowTasks?.concat(item.circulateTasks ? item.circulateTasks : [], item.returnTasks ? item.returnTasks : [])
        })
        let tableData = []
        data.data.list.forEach(item => {
          item.newList?.forEach(val => {
            tableData.push(val)
          })

        })
        yield put({
          type: 'updateStates',
          payload: {
            isShowDetail: true,
            tableData: tableData,
            returnCount: data.data.returnCount,
            currentPage: data.data.currentPage
          }
        })
        callback&&callback(tableData)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //撤回
    *recoverTask({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.recoverTask, payload, '', 'recover')
      if (data.code == 200) {
        message.success('撤回成功')
        // history.push({
        //   pathname: `/mobile/${history.location.query.workType}List`,
        // });
        const query = parse(history.location.search);
        if(query.category=='MATTER'){
          window.location.href = `#/business_application/mobile/MATTERMsgLIst`
        }else if(category=='SYS'){
          window.location.href = `#/business_application/mobile/SYSMsgLIst`
        }else{
          window.location.href = `#/business_application/mobile/${query?.workType}List`
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
