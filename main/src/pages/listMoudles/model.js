import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'

export default {
  namespace: 'listMoudles',
  state: {
    ctlgId: '',
    currentPage: 1,
    returnCount: 0,
    formlistModels: [],
    currentNode: {},
    treeData: [],
    dictTreeData: [],
    initialTreeData: [],
    treeDataByAdd: [],
    limit: 10,
    treeSearchWord: '',
    expandedKeys: [],
    autoExpandParent: true,
    listMoudle: {}, //列表建模对象
    addModal: false, //列表建模弹窗状态
    buttonList: [],
    isShowModal: false,
    selectedNodeId:'',
    selectedDataIds:[],
    selectedDatas:[],
    originalData:[],
    selectNodeType:[],
    leftNum:220,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen(location => {
        if (history.location.pathname === '/listMoudles') {
          // dispatch({
          //   type:'getCtlgTree',
          //   payload:{
          //     hasPermission: 0,
          //     type: 'ALL',
          //   }
          // })
        }
      });
    },
  },
  effects: {
    *getCtlgTree({ payload, callback }, { call, put, select }) {
      try {
        const loop = array => {
          for (var i = 0; i < array.length; i++) {
            array[i]['title'] = array[i]['nodeName'];
            array[i]['key'] = array[i]['nodeId'];
            array[i]['value'] = array[i]['nodeId'];
            if (array[i].children && array[i].children.length != 0) {
              loop(array[i].children);
            }
          }
          return array;
        };

        const { data } = yield call(apis.getCtlgTree, payload);
        if (data.code == REQUEST_SUCCESS) {
          //默认为第一个
          if (data.data.list.length) {
            let sourceTree = loop(data.data.list);
            yield put({
              type: 'updateStates',
              payload: {
                treeData: data.data.list,
                initialTreeData: data.data.list,
                treeDataByAdd: sourceTree,
                currentNode: {
                  key: data.data.list?.[0].nodeId,
                  title: data.data.list?.[0].nodeName,
                  nodeName: data.data.list?.[0].nodeName,
                },
              },
            });
            yield put({
              type: 'getFormListModel',
              payload: {
                ctlgId: data.data[0].nodeId,
                start: 1,
                limit: limit,
                searchWord: '',
              },
            });
          }
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getFormListModel({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getFormListModel, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              formlistModels: data.data.list,
              returnCount: data.data.returnCount,
              currentPage: data.data.currentPage,
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
    *addFormListModel({ payload, callback, node }, { call, put, select }) {
      try {
        const { data } = yield call(apis.addFormListModel, payload);
        const { currentPage, currentNode, limit } = yield select(
          state => state.listMoudles,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getFormListModel',
            payload: {
              start: currentPage,
              limit,
              ctlgId: node.key || currentNode.key,
            },
          });
          yield put({
            type: 'updateStates',
            payload: {
              addModal: false,
              currentNode: JSON.stringify(node) == '{}' ? currentNode : node,
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
    *updateFormListModel({ payload, callback, node }, { call, put, select }) {
      try {
        const { data } = yield call(apis.updateFormListModel, payload);
        const { currentPage, currentNode, limit } = yield select(
          state => state.listMoudles,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getFormListModel',
            payload: {
              start: currentPage,
              limit: limit,
              ctlgId: currentNode.key,
            },
          });
          yield put({
            type: 'updateStates',
            payload: {
              addModal: false,
              currentNode: currentNode,
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *deleteFormListModel({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.deleteFormListModel, payload);
        const { currentPage, currentNode, limit } = yield select(
          state => state.listMoudles,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getFormListModel',
            payload: {
              start: currentPage,
              limit: limit,
              ctlgId: currentNode.key,
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

    // 保存归属单位
    *saveBelongOrg({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.saveBelongOrg, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success('保存成功');
        callback&&callback()
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },

    // 查询归属单位
    *queryBelongOrg({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.queryBelongOrg, payload);
      // 过滤重复数据
      const dataList = data.data.list.filter((item, index, dataList) => {
        return dataList.findIndex(t => t.orgId === item.orgId) === index;
      })
      let selectedOrgIds = [];
      dataList.map((item)=>{
        selectedOrgIds.push(item.orgId);
      })
      dataList.forEach((item) => {
        item.nodeId = item.orgId;
        item.nodeName = item.orgName;
        item.parentId = item.parentOrgId;
        item.parentName = item.parentOrgName;
      });
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            selectedDataIds: selectedOrgIds,
            selectedDatas: dataList
          }
        })
        callback&&callback()
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
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
