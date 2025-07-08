import { message } from 'antd';
import apis from 'api';
const limit=10;
export default {
  namespace: 'workTrust',
  state: {
    limit:limit,
    list:[],
    returnCount:0,
    allPage:0,
    currentPage:0,
    selectedRowKeys:[],
    isShow:false,
    trustInfo:{},
    selectedNodeId:'',
    selectedDataIds:[],
    treeData:[],
    currentNode:[],
    expandedKeys:[],
    treeSearchWord:'',
    selectedDatas:[],
    originalData:[],
    selectNodeType:'',
    oldMenusApp:[],
    menusApp:[],
    currentHeight:0,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
      });
    },
  },
  effects: {
    //工作委托
    *getWorkTrust({payload},{call,put,select}){
      const {data} = yield call(apis.getWorkTrust,payload,'','workTrust');
      if(data.code==200){
        yield put({
          type:'updateStates',
          payload:{
            ...data.data
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //新增工作委托
    *addWorkTrust({payload},{call,put,select}){
      const {data} = yield call(apis.addWorkTrust,payload,'','workTrust');
      if(data.code==200){
        message.success('添加成功');
        const {limit,searchWord} = yield select(state=>state.workTrust);
        //重新获取列表
        yield put({
          type:"getWorkTrust",
          payload:{
            start:1,
            limit:limit,
            searchWord,
          }
        })
        yield put({
          type:"updateStates",
          payload:{
            searchWord:'',
            isShow:false,
            selectedDataIds:[]
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //修改
    *updateWorkTrust({payload},{call,put,select}){
      const {limit,trustInfo,searchWord} = yield select(state=>state.workTrust);
      const {data} = yield call(apis.updateWorkTrust,payload,'','workTrust');
      if(data.code==200){
        message.success('修改成功');
        //重新获取列表
        yield put({
          type:"getWorkTrust",
          payload:{
            start:1,
            limit:limit,
            searchWord,
          }
        })
        yield put({
          type:"updateStates",
          payload:{
            searchWord:'',
            isShow:false,
            selectedDataIds:[]
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getUserMenus({payload,callback},{call,put,select}){
      const {data} = yield call(apis.getWorkMenuList,payload,'getUserMenus','workTrust');
      if(data.code==200){
        let menusApp = [];
        //只要最末级
        data.data.menus.map((item)=>{
          // if(item.path){
            menusApp.push(item);
          // }
        })
        callback&&callback(menusApp);
        yield put({
          type:"updateStates",
          payload:{
            oldMenusApp:menusApp,
            menusApp:menusApp
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //删除
    *deleteTrust({payload},{call,put,select}){
      const {data} = yield call(apis.delTrust,payload,'deleteTrust','workTrust');
      if(data.code==200){
        message.success('删除成功');
        yield put({
          type:"updateStates",
          payload:{
            selectedRowKeys:[]
          }
        })
        const {limit,searchWord,list,currentPage} = yield select(state=>state.workTrust);
        //重新获取列表
        if(list.length==payload.ids.split(',').length&&currentPage!=1){
          yield put({
            type:"getWorkTrust",
            payload:{
              start:currentPage-1,
              limit:limit,
              searchWord:searchWord
            }
          })
        }else{
          yield put({
            type:"getWorkTrust",
            payload:{
              start:currentPage,
              limit:limit,
              searchWord:searchWord
            }
          })
        }
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
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
