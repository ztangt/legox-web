import { message } from 'antd';
import apis from 'api';
import { history } from 'umi';
import _ from 'lodash';
export default {
  namespace: 'workList',
  state: {
    workRules: [],
    groupCode: '',
    workRuleId: '',
    allPage: 0,
    currentPage: 1,
    list: [],
    returnCount: 0,
    listTitle: [],
    bizSolNameList: [],
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {});
    },
  },
  effects: {
    *getTODOWork({ payload, callback, timeFilter }, { call, put, select }) {
      const { data } = yield call(apis.getTodoWork, payload,'','workList');
      const { list } = yield select((state) => state.workList);
      if (data.code == 200) {
        var newList = [];
        if (payload.start != 1) {
          newList = [...list, ...data.data.list];
        } else {
          newList = data.data.list;
        }
        // if (timeFilter == 'sort') {
        //   newList = newList.sort((a, b) => {
        //     return a.startTime - b.startTime;
        //   });
        // } else {
        //   newList = newList.sort((a, b) => {
        //     return b.startTime - a.startTime;
        //   });
        // }
        yield put({
          type: 'updateStates',
          payload: {
            ...data.data,
            list: newList,
            // list: payload.start != 1
            // ? [...list, ...data.data.list]
            // : data.data.list
          },
        });
        callback && callback(data.data.listTitle);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getDONEWork({ payload, callback, timeFilter }, { call, put, select }) {
      const { data } = yield call(apis.getDoneWork, payload,'','workList');
      const { list } = yield select((state) => state.workList);
      if (data.code == 200) {
        var newList = [];
        if (payload.start != 1) {
          newList = [...list, ...data.data.list];
        } else {
          newList = data.data.list;
        }
        // if (timeFilter == 'sort') {
        //   newList = newList.sort((a, b) => {
        //     return a.startTime - b.startTime;
        //   });
        // } else {
        //   newList = newList.sort((a, b) => {
        //     return b.startTime - a.startTime;
        //   });
        // }
        yield put({
          type: 'updateStates',
          payload: {
            ...data.data,
            list: newList,
            // list:
            //   payload.start != 1
            //     ? [...list, ...data.data.list]
            //     : data.data.list,
          },
        });
        callback && callback(data.data.listTitle);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //以发事项
    *getSENDWork({ payload, callback, timeFilter }, { call, put, select }) {
      const { data } = yield call(apis.getSendWork, payload,'','workList');
      const { list } = yield select((state) => state.workList);
      if (data.code == 200) {
        var newList = [];
        if (payload.start != 1) {
          newList = [...list, ...data.data.list];
        } else {
          newList = data.data.list;
        }
        // if (timeFilter == 'sort') {
        //   newList = newList.sort((a, b) => {
        //     return a.startTime - b.startTime;
        //   });
        // } else {
        //   newList = newList.sort((a, b) => {
        //     return b.startTime - a.startTime;
        //   });
        // }
        yield put({
          type: 'updateStates',
          payload: {
            ...data.data,
            list: newList,
            // list:
            //   payload.start != 1
            //     ? [...list, ...data.data.list]
            //     : data.data.list,
          },
        });
        callback && callback(data.data.listTitle);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //事项规则
    *getWorkRule({ payload, namespace, callback }, { call, put, select }) {
      const { data } = yield call(apis.getWorkRule, payload,'','workList');
      console.log('namespace=', namespace);
      if (data.code == 200) {
        let workRules = [];
        //去掉隐藏数据
        data.data.list.map((item) => {
          if (item.groupHide != 1) {
            workRules.push(item);
          }
        });
        yield put({
          type: `updateStates`,
          payload: {
            workRules: workRules,
            // groupCode: workRules.length ? workRules[0].groupCode : '',
            // workRuleId: workRules.length ? workRules[0].workRuleId : '',
          },
        });
        callback && callback(workRules);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //事项业务类型信息列表
    *getBizSolName({ payload, namespace, callback }, { call, put, select }) {
      const { data } = yield call(apis.getBizSolName, payload,'','workList');
      if (data.code == 200) {
        yield put({
          type: `updateStates`,
          payload: {
            bizSolNameList: data.data.list,
          },
        });
        //callback&&callback(workRules)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //所有事项
    *getALLWork({ payload, callback, timeFilter }, { call, put, select }) {
      const { data } = yield call(apis.getAllWork, payload,'','workList');
      const { list } = yield select((state) => state.workList);
      if (data.code == 200) {
        var newList = [];
        if (payload.start != 1) {
          newList = [...list, ...data.data.list];
        } else {
          newList = data.data.list;
        }
        yield put({
          type: 'updateStates',
          payload: {
            ...data.data,
            list: newList,
          },
        });
        callback && callback(data.data.listTitle);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //传阅事项
    *getCIRCULATEWork({ payload, callback, timeFilter }, { call, put, select }) {
      const { data } = yield call(apis.getCirculateWork, payload,'','workList');
      const { list } = yield select((state) => state.workList);
      if (data.code == 200) {
        var newList = [];
        if (payload.start != 1) {
          newList = [...list, ...data.data.list];
        } else {
          newList = data.data.list;
        }
        yield put({
          type: 'updateStates',
          payload: {
            ...data.data,
            list: newList,
          },
        });
        callback && callback(data.data.listTitle);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //跟踪事项
    *getTRACKWork({ payload, callback, timeFilter }, { call, put, select }) {
      const { data } = yield call(apis.getTraceWork, payload,'','workList');
      const { list } = yield select((state) => state.workList);
      if (data.code == 200) {
        var newList = [];
        if (payload.start != 1) {
          newList = [...list, ...data.data.list];
        } else {
          newList = data.data.list;
        }
        yield put({
          type: 'updateStates',
          payload: {
            ...data.data,
            list: newList,
          },
        });
        callback && callback(data.data.listTitle);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //委托事项
    *getTRUSTWork({ payload, callback, timeFilter }, { call, put, select }) {
      const { data } = yield call(apis.getTrustWork, payload,'','workList');
      const { list } = yield select((state) => state.workList);
      if (data.code == 200) {
        var newList = [];
        if (payload.start != 1) {
          newList = [...list, ...data.data.list];
        } else {
          newList = data.data.list;
        }
        yield put({
          type: 'updateStates',
          payload: {
            ...data.data,
            list: newList,
          },
        });
        callback && callback(data.data.listTitle);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //受委托事项
    *getBE_TRUSTWork({ payload, callback, timeFilter }, { call, put, select }) {
      const { data } = yield call(apis.getTrustedWork, payload,'','workList');
      const { list } = yield select((state) => state.workList);
      if (data.code == 200) {
        var newList = [];
        if (payload.start != 1) {
          newList = [...list, ...data.data.list];
        } else {
          newList = data.data.list;
        }
        yield put({
          type: 'updateStates',
          payload: {
            ...data.data,
            list: newList,
          },
        });
        callback && callback(data.data.listTitle);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //设置已阅
    *setCirculate({payload,isShowMessge,setState},{call,put,select}){
      const {data} = yield call(apis.setCirculate,payload,'','workList');
      if(data.code==200){
        
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
