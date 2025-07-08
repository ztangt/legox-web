import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';

const {
  getContractFilesList,
  getContractFileFjList,
  getFileStorageZip,
  getDictType,
} = apis;

export default {
  namespace: 'contractFiles',
  state: {
    start: 1,
    limit: 10,
    list: [],
    returnCount: 0,
    allPage: 0,
    currentPage: 1,
    selectedRowKeys: '',
    fileList: [],
    contractId: '',
    contractNumber: '',
    detailSelectedRowKeys: '',
    detailSelectedRows: [],
    purchaseMethodOptions: [],
    contractStateOptions: [],
    contractTypeOptions: [],
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        if (location.pathname === '/contractFiles') {
          // dispatch({
          //   type: 'getContractFilesList',
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
    // 获取合同管理档案列表
    *getContractFilesList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          getContractFilesList,
          payload,
          '',
          'contractFiles',
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
    // 获取附件列表
    *getContractFileFjList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          getContractFileFjList,
          payload,
          '',
          'contractFiles',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              fileList: data.data?.list.length > 0 ? data.data?.list : [],
            },
          });

          callback && callback(data.data?.list);
        } else if (data.code != 401 && data.code != 302 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 下载
    *getFileStorageZip({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          getFileStorageZip,
          payload,
          '',
          'contractFiles',
        );
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data || '');
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
        const { data } = yield call(getDictType, payload, '', 'contractFiles');

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
        const { data } = yield call(getDictType, payload, '', 'contractFiles');

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
        const { data } = yield call(getDictType, payload, '', 'contractFiles');

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
