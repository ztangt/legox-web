import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../service/constant';
const { getRegister } = apis;
export default {
  namespace: 'registerTree',
  state: {
    treeData: [],//系统树
    
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
    *getRegister({ payload,callback,pathname }, { call, put, select }) {
      try {
        const {data} = yield call(getRegister, {...payload},'','registerTree');
        const {treeData} = yield select(state=>state.layoutG.searchObj[pathname])
        const  loop = (array)=>{
          for(var i=0;i<array.length;i++){
            array[i]['title'] = array[i]['registerName']
            array[i]['key'] = array[i]['id']
            array[i]['value'] = array[i]['id']
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
        }else{
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
