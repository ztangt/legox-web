import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
  namespace: 'globalReviewer',
  state: {
    currentNode: {},
    treeData: [],
    expandedKeys: [],
    treeSearchWord: '',
    selectedRowKeys: [],
    dataSource: [],
    isShowAddGlobalReviewer: false,
    currentGlobalReviewer: {},
    currentPage: 1,
    returnCount: 0,
    limit: 10,
    //关联用户
    isShowRelationModal: false,
    selectedDataIds: [],
    selectedNodeId: '',
    selectedDatas: [],
    originalData: [],
    selectNodeType: [],
    searchWord: '',
    leftNum:220,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      // history.listen(location => {
      //   if (history.location.pathname === '/holidaysManage') {
      //     //进入界面刷新数据
      //   }
      // });
    },
  },
  effects: {
    *getGlobalReviewerList({ payload, callback }, { call, put, select }) {
      try {
        const { currentPage, limit, currentNode } = yield select(
          state => state.globalReviewer,
        );
        if (currentNode.orgKind == 'ORG') {
          payload.orgId = currentNode.id;
        } else {
          payload.deptId = currentNode.id;
        }
        if (!payload.limit) {
          payload.limit = limit;
        }
        if (!payload.start) {
          payload.start = currentPage;
        }
        const { data } = yield call(apis.getGlobalReviewerList, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              dataSource: data.data.list,
              currentPage: data.data.currentPage,
              returnCount: data.data.returnCount,
              limit: payload.limit,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addGlobalReviewer({ payload, callback }, { call, put, select }) {
      try {
        const { currentNode } = yield select(state => state.globalReviewer);
        if (currentNode.nodeType == 'ORG') {
          payload.checkerCreateOrgId = currentNode.nodeId;
        } else {
          payload.checkerCreateDeptId = currentNode.nodeId;
        }
        const { data } = yield call(apis.addGlobalReviewer, payload);
        if (data.code == REQUEST_SUCCESS) {
          if( currentNode.id){
            yield put({
              type: 'getGlobalReviewerList',
              payload: {},
            });
          }
          
          yield put({
            type: 'updateStates',
            payload: { isShowAddGlobalReviewer: false },
          });
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *changeGlobalReviewer({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.changeGlobalReviewer, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getGlobalReviewerList',
            payload: {},
          });
          yield put({
            type: 'updateStates',
            payload: { isShowAddGlobalReviewer: false,currentGlobalReviewer:{} },
          });
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    *removeGlobalReviewer({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.removeGlobalReviewer, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getGlobalReviewerList',
            payload: {},
          });
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    *getGlobalReviewerIdentity({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getGlobalReviewerIdentity, payload);

        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data);
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    *saveGlobalReviewerIdentity({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.saveGlobalReviewerIdentity, payload);

        if (data.code == REQUEST_SUCCESS) {
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
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
