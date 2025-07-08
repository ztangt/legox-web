import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';

const {
  getContractLedgerList,
  getLedgerAdjustList,
  getExecuteList,
  getDictType,
  exportFile,
} = apis;

export default {
  namespace: 'contractLedger',
  state: {
    start: 1,
    limit: 10,
    list: [],
    returnCount: 0,
    allPage: 0,
    currentPage: 1,
    selectedRowKeys: [],
    detailList: [],
    detailAllPage: 0,
    detailCurrentPage: 1,
    detailReturnCount: 0,
    detailStart: 1,
    detailLimit: 10,
    contractId: '',
    contractNumber: '',
    executeStart: 1,
    executeLimit: 10,
    executeReturnCount: 1,
    executeList: [],
    purchaseMethodOptions: [],
    contractStateOptions: [],
    contractTypeOptions: [],
    cutomHeaders: {},
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        if (location.pathname === '/contractLedger') {
          // dispatch({
          //   type: 'getContractLedgerList',
          //   payload: {
          //     start: 1,
          //     limit: 10,
          //     logicCode: 'HT100001',
          //   },
          // });
          // dispatch({
          //   type: 'getPurchaseMethodDictType',
          //   payload: {
          //     dictTypeId: 'HTGLCGFS',
          //     showType: 'ALL',
          //     isTree: '1',
          //     searchWord: '',
          //   },
          // });
          // dispatch({
          //   type: 'getContractStateDictType',
          //   payload: {
          //     dictTypeId: 'HTGLHTZT',
          //     showType: 'ALL',
          //     isTree: '1',
          //     searchWord: '',
          //   },
          // });
          // dispatch({
          //   type: 'getContractTypeDictType',
          //   payload: {
          //     dictTypeId: 'HTGLHTLX',
          //     showType: 'ALL',
          //     isTree: '1',
          //     searchWord: '',
          //   },
          // });
        }
      });
    },
  },
  effects: {
    // 获取合同台账列表
    *getContractLedgerList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          getContractLedgerList,
          payload,
          '',
          'contractLedger',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              list: data.data?.list.length > 0 ? data.data.list : [],
              allPage: data.data.allPage,
              currentPage: data.data.currentPage,
              returnCount: data.data.returnCount,
            },
          });
        } else if (data.code != 401 && data.code != 302 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 获取详情列表
    *getLedgerAdjustList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          getLedgerAdjustList,
          payload,
          '',
          'contractLedger',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              detailList: data.data?.list.length > 0 ? data.data.list : [],
              detailAllPage: data.data.allPage,
              detailCurrentPage: data.data.currentPage,
              detailReturnCount: data.data.returnCount,
            },
          });
        } else if (data.code != 401 && data.code != 302 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 获取执行下钻列表
    *getExecuteList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          getExecuteList,
          payload,
          '',
          'contractLedger',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              executeReturnCount: data.data.returnCount,
              executeList: data.data?.list.length > 0 ? data.data.list : [],
            },
          });
        } else if (data.code != 401 && data.code != 302 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //获取枚举类型的详细信息
    *getPurchaseMethodDictType({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getDictType, payload, '', 'contractLedger');

        if (data.code == REQUEST_SUCCESS) {
          const newArr = (data.data.list || []).reduce((pre, cur) => {
            pre.push({
              value: cur.dictInfoCode,
              label: cur.dictInfoName,
            });
            return pre;
          }, []);
          yield put({
            type: 'updateStates',
            payload: {
              purchaseMethodOptions: newArr,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *getContractStateDictType({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getDictType, payload, '', 'contractLedger');

        if (data.code == REQUEST_SUCCESS) {
          const newArr = (data.data.list || []).reduce((pre, cur) => {
            pre.push({
              value: cur.dictInfoCode,
              label: cur.dictInfoName,
            });
            return pre;
          }, []);
          yield put({
            type: 'updateStates',
            payload: {
              contractStateOptions: newArr,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *getContractTypeDictType({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getDictType, payload, '', 'contractLedger');

        if (data.code == REQUEST_SUCCESS) {
          const newArr = (data.data.list || []).reduce((pre, cur) => {
            pre.push({
              value: cur.dictInfoCode,
              label: cur.dictInfoName,
            });
            return pre;
          }, []);
          yield put({
            type: 'updateStates',
            payload: {
              contractTypeOptions: newArr,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *exportFile({ payload, callback }, { call, put, select }) {
      // const { cutomHeaders } = yield select((state) => state.contractLedger);
      // payload.headers = cutomHeaders; //需要在headers中添加参数
      const { data } = yield call(exportFile, payload, '', 'contractLedger');
      if (data.code == REQUEST_SUCCESS) {
        callback && callback();
      } else {
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
