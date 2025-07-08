import { message } from 'antd';
import apis from 'api';
import _ from 'lodash';
const loop = (array, children, parentId, searchWord) => {
  debugger;
  for (var i = 0; i < array.length; i++) {
    array[i]['title'] = `${array[i]['orgName']}`;
    array[i]['key'] = array[i]['id'];
    array[i]['value'] = array[i]['id'];
    array[i]['nodeName'] = array[i]['orgName'];
    array[i]['nodeId'] = array[i]['id'];
    if (parentId && parentId == array[i]['id']) {
      array[i]['children'] = children;
    }
    if (array[i].children && array[i].children.length != 0) {
      loop(array[i].children, children, parentId, searchWord);
    } else {
      if (array[i].isParent == 1 && !searchWord) {
        array[i]['children'] = [{ key: '-1' }];
      } else {
        array[i]['isLeaf'] = true;
      }
    }
  }
  return array;
};
export default {
  namespace: 'orgTree',
  state: {},
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {});
    },
  },
  effects: {
    // 获取组织树
    *getBudPreOrgTree({ payload, state, callback }, { call, put, select }) {
      const { treeData } = state;
      const { data } = yield call(apis.getBudPreOrgTree, payload);
      if (data.code == 200) {
        if (data.data.list.length != 0) {
          let sourceTree = _.cloneDeep(treeData);
          if ((sourceTree && sourceTree.length == 0) || !payload.parentId) {
            sourceTree = data.data.list;
          }
          sourceTree = loop(
            sourceTree,
            data.data.list,
            payload.parentId,
            payload.searchWord,
          );
          callback && callback(sourceTree);
        } else {
          callback && callback([]);
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
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
