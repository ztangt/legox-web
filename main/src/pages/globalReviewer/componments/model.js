export default {
  namespace: 'relationUserModel',
  state: {
    currentNode: {},
    treeData: [],
    expandedKeys: [],
    treeSearchWord: '',
    selectedRowKeys: [],
    selectedDataIds: [],
    selectedNodeId: '',
    selectedDatas: [],
    originalData: [],
    selectNodeType: [],
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen(location => {
        if (history.location.pathname === '/') {
          //进入界面刷新数据
        }
      });
    },
  },
  effects: {
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
