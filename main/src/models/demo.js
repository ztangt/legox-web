
export default {
  namespace: 'demo',
  state: {
    value: '',
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
      });
    }
  },
  effects: {
    
  },
  reducers: {
    updateStates(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
