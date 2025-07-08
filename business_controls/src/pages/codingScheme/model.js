import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';

const {
  saveEncodingPlan,
  saveBaseEncodingPlan,
  getEncoding,
  finishTurn,
  getEncodingPlanList,
  getIsHaveBaseData,
} = apis;

export default {
  namespace: 'codingScheme',
  state: {
    codingPlanList: [], // 编码方案列表
    usedYear: String(new Date().getFullYear()), // 年
    codingPlanItem: [], // 当前的编码方案
    isHaveBaseDataList: [], // 当前层级是否有基础数据
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        if (location.pathname === '/codingScheme') {
          // dispatch({
          //   type: 'getCodingPlanList',
          //   payload: {
          //     usedYear: String(new Date().getFullYear()),
          //   },
          //   callback: (bizSolId) => {
          //     dispatch({
          //       type: 'getIsHaveBaseData',
          //       payload: {
          //         bizSolId,
          //         usedYear: String(new Date().getFullYear()),
          //       },
          //     });
          //   },
          // });
        }
      });
    },
  },
  effects: {
    // 获取编码方案列表
    *getCodingPlanList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          getEncodingPlanList,
          payload,
          '',
          'codingScheme',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              codingPlanList: data.data.list.length > 0 ? data.data.list : [],
              codingPlanItem:
                data.data.list.length > 0 ? [data.data.list[0]] : [],
            },
          });

          if (data.data.list.length > 0) {
            callback && callback(data.data.list[0]?.bizSolId);
          }
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 保存编码方案
    *saveCodingPlan({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          saveEncodingPlan,
          payload,
          '',
          'codingScheme',
        );
        const { usedYear } = yield select((state) => state.codingScheme);
        if (data.code == REQUEST_SUCCESS) {
          message.success('保存成功！');
          yield put({
            type: 'getCodingPlanList',
            payload: {
              usedYear,
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 编码方案结转
    *finishTurn({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(finishTurn, payload, '', 'codingScheme');
        const { usedYear } = yield select((state) => state.codingScheme);
        if (data.code == REQUEST_SUCCESS) {
          message.success('结转成功！');
          yield put({
            type: 'getCodingPlanList',
            payload: {
              usedYear,
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 基础数据结转
    *saveBaseEncodingPlan({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          saveBaseEncodingPlan,
          payload,
          '',
          'codingScheme',
        );
        const { usedYear } = yield select((state) => state.codingScheme);
        if (data.code == REQUEST_SUCCESS) {
          message.success('基础数据结转成功！');
          yield put({
            type: 'getCodingPlanList',
            payload: {
              usedYear,
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 判断是否含有基础数据
    *getIsHaveBaseData({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          getIsHaveBaseData,
          payload,
          '',
          'codingScheme',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              isHaveBaseDataList: data.data.list,
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
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
