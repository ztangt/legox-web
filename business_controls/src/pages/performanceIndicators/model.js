import { message } from 'antd';
import apis from 'api';

export default {
  namespace: 'performanceIndicators',
  state: {
    dataSource: [],
    treeDataSource: [],
    expandedRowKeys: [],
    selectedRowKeys: [],
    selectedRowData: [],
    performanceInfo: {},
    isShowPerforman: false,
    listSelectedRowKeys: [],
    listSelectedRows: [],
    isShowLookInfo: false,
  },
  subscriptions: {},
  effects: {
    *getPerfromanceList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getPerfromanceList, payload);
      if (data.code == 200) {
        let list = [];
        let allNum = 0;
        data.data.list &&
          data.data.list.map((item) => {
            item.PERFORMANCE_CODE = item.performanceCode;
            item.PERFORMANCE_NAME = item.performanceName;
            item.PERFORMANCE_TYPE_TLDT_ = item.performanceType;
            item.PERFORMANCE_DIRECT_TLDT_ = item.performanceDirect;
            item.UNIT_OF_MEASUREMENT = item.unitOfMeasurement;
            item.id = item.performanceId;
            item.IS_PARENT = item.isParent;
            item.GRADE = item.grade;
            if (item.isParent == '0') {
              allNum = allNum + parseFloat(item.score);
            }
            list.push(item);
          });
        callback && callback(allNum);
        yield put({
          type: 'updateStates',
          payload: {
            dataSource: list,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //查询绩效指标树
    *getPerformanceTree({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getPerformanceTree, payload);
      if (data.code == 200) {
        //需要将IS_PARENT转换成isParent才能用公用的方法
        data.data.list.map((item) => {
          item.isParent = item.IS_PARENT;
          item['performanceCode'] = item.PERFORMANCE_CODE; //增加一行performanceCode，不用一会小写一会大写混淆
          item['id'] = item.ID; //增加一行performanceCode，不用一会小写一会大写混淆
        });
        callback && callback(data.data.list);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getPerformanceInfo({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getPerformanceInfo, payload);
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            performanceInfo: data.data,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //临时保存绩效指标
    *tmpSavePer({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.tmpSavePer, payload);
      if (data.code == 200) {
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
