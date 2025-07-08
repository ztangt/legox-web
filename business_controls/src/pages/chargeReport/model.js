import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';
import { NORM_STATE } from '../../util/constant';

export default {
  namespace: 'chargeReport',
  state: {
    currentYear: String(new Date().getFullYear()),
    returnCount: 0,
    allPage: 1,
    currentPage: 1,
    start: 1,
    limit: 0,
    currentHeight: 0,
    sizeFlag: false,
    searchWord: '',
    normCode: '',
    reportList: [],
    isShowReleveModal: false,
    selectedDataIds: [],
    selectedDatas: [],
    formType: '',
    orgUserType: '',
    dictInfo: {},
    dictInfoList: {},
  },
  subscriptions: {},
  effects: {
    *getDictType({ payload, callback }, { call, put, select }) {
      const { cutomHeaders } = yield select((state) => state.chargeReport);
      payload.headers = cutomHeaders; //需要在headers中添加参数
      const { data } = yield call(
        apis.getDictType,
        payload,
        '',
        'chargeReport',
      );
      if (data.code == REQUEST_SUCCESS) {
        let dictInfo = {};
        data.data.list.forEach((element) => {
          dictInfo[element.dictInfoCode] = element.dictInfoName;
        });
        console.log('getDictType', dictInfo);
        yield put({
          type: 'updateStates',
          payload: {
            dictInfoList: data.data.list,
            dictInfo,
          },
        });
      } else {
        message.error(data.msg);
      }
    },
    *exportFile({ payload, callback }, { call, put, select }) {
      const { cutomHeaders } = yield select((state) => state.chargeReport);
      payload.headers = cutomHeaders; //需要在headers中添加参数
      const { data } = yield call(apis.exportFile, payload, '', 'chargeReport');
      if (data.code == REQUEST_SUCCESS) {
        callback && callback();
      } else {
        message.error(data.msg);
      }
    },
    *getReportList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getReportList,
          payload,
          '',
          'chargeReport',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              reportList: data.data.list,
              returnCount: data.data.returnCount,
              allPage: data.data.allPage,
              currentPage: data.data.currentPage,
            },
          });
        } else {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
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
