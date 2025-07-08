import { message } from 'antd';
import apis from 'api';
const limit=10;
export default {
  namespace: 'waitMatterCma',
  state: {
    limit: 10,
    allPages: 0,
    currentHeight: 0,
    returnCount: 0,
    currentPage: 0,
    listTitle:{},
    searchWord:'',
    list:[],
    searchColumnCodes:[],
    ctlgTree:[],
    businessList:[],
    workRules:[],
    listColumnCodes:[]
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        if (location.pathname === '/waitMatterCma') {
          // dispatch({
          //   type:'updateStates',
          //   payload:{
          //     limit:limit
          //   }
          // })
        }
      });
    },
  },
  effects: {
    //待办事项
    *getTodoWork({payload,callback},{call,put,select}){
      if(!payload.actName){
        delete payload.actName
      }
      const {data} = yield call(apis.getTodoWork,payload,'','waitMatterCma');
      if(data.code==200){
        localStorage.setItem('waitData',data.data.returnCount);
        callback&&callback(data.data);
        // yield put({
        //   type:'updateStates',
        //   payload:{
        //     ...data.data,
        //   }
        // })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //跟踪取消跟踪
    *traceWork({payload,params,callback},{call,put,select}){
      payload.headers=params
      const {data} = yield call(apis.traceWork,payload,'','waitMatterCma');
      if(data.code==200){
        message.success('设置成功');
        const {list} = yield select(state=>state.waitMatter);
        //将选中的id更新跟踪状态
        list.map((item)=>{
          if(payload.bizInfoIds.includes(item.bizInfoId)){
            item.isTrace=payload.traceType
          }
        })
        callback(list);
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
