import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
  namespace: 'claimExpense',
  state: {
    returnCount: 0,
    allPage: 1,
    currentPage: 1,
    list: [], //超事前列表
    limit: 10,
    searchWord: '',
    selectedRowKeys: [],
    isShowAddModal: false,
    processList: [], //有流程应用
    detailData: {},
    typeList: [], //超出类型数据
    currentHeight: 0,
  },
  subscriptions: {},
  effects: {
    *getPreexpenseList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getPreexpenseList,
          payload,
          '',
          'claimExpense',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              ...data.data,
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
    //删除
    *deletePreexpense({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.deletePreexpense,
          payload,
          '',
          'claimExpense',
        );
        if (data.code == REQUEST_SUCCESS) {
          const { list, currentPage, limit, searchWord } = yield select(
            (state) => state.claimExpense,
          );
          if (
            list.length == payload.preExpenseIds.split(',').length &&
            currentPage != 1
          ) {
            yield put({
              type: 'getPreexpenseList',
              payload: {
                start: currentPage - 1,
                limit,
                searchWord,
              },
            });
          } else {
            yield put({
              type: 'getPreexpenseList',
              payload: {
                start: currentPage,
                limit,
                searchWord,
              },
            });
          }
          // payload.preExpenseIds.split(',').forEach((item, index) => {
          //   list.splice(
          //     list.findIndex((val) => val.preExpenseId == item),
          //     1,
          //   );
          // });
          yield put({
            type: 'updateStates',
            payload: {
              selectedRowKeys: '',
              // list: list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //获取有流程业务应用
    *getBasicdataFlagList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getBasicdataFlagList,
          payload,
          '',
          'claimExpense',
        );
        console.log(data, 'data');
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              processList: data.data,
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
    //新增
    *addPreexpense({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.addPreexpense,
          payload,
          '',
          'claimExpense',
        );
        if (data.code == REQUEST_SUCCESS) {
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //修改
    *updatePreexpense({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.updatePreexpense,
          payload,
          '',
          'claimExpense',
        );
        if (data.code == REQUEST_SUCCESS) {
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //获取枚举类型的详细信息
    *getDictType({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getDictType,
          payload,
          '',
          'claimExpense',
        );
        console.log(data.data.list, 'dictInfos');
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              typeList: data.data.list,
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
    //查询单条
    *getOnePreexpense({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getOnePreexpense,
          payload,
          '',
          'claimExpense',
        );
        yield put({
          type: 'updateStates',
          payload: {
            detailData: data.data,
          },
        });
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
