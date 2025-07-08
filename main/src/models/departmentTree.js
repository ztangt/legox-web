const { getCtlgTree } = apis;
import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../service/constant'
export default {
  namespace: 'departmentTree',
  state: {
    treeData: [],//应用类别
    expandId:'',
    expandedKeys: [],//展开keys
    currentNodeName: '',
    currentNodeId:'',
    autoExpandParent:false ,//父节点默认不展开
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
      });
    }
  },
  effects: {
    *getCtlgTree({ payload,callback,pathname }, { call, put, select }) {
      try {
        const {data} = yield call(getCtlgTree, {...payload},'','departmentTree');
        // const {treeData} = yield select(state=>state.departmentTree)
        const  loop = (array)=>{
          for(var i=0;i<array.length;i++){
            array[i]['title'] = array[i]['nodeName']
            array[i]['key'] = array[i]['nodeId']
            array[i]['value'] = array[i]['nodeId']
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children)
            }
          }
          return array
        }
        if(data.code==REQUEST_SUCCESS){
         let sourceTree = loop(data.data.list);
          yield put({
            type: 'updateStates',
            payload:{
              treeData: sourceTree
            }
          })
          callback&&callback(sourceTree);
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg,5)
        }
      } catch (e) {
        console.log(e);
      } finally {

      }
    },

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
