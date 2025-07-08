
import _ from "lodash";

export default {
  namespace: 'unitRole',
  state: {
    currentNode:{},
    treeData: [],
    expandedKeys: [],
    treeSearchWord:'',
    leftNum:220,
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
        if(history.location.pathname=='/unitRole'){
          
        }
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
