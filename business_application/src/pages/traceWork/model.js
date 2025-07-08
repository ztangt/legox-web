import { message } from 'antd';
import apis from 'api';
const limit=10;
export default {
  namespace: 'traceWork',
  state: {
    limit: 10,
    allPages: 0,
    returnCount: 0,
    currentPage: 0,
    searchWord:'',
    list:[],
    listTitle:{},
    searchColumnCodes:[],
    ctlgTree:[],
    businessList:[],
    selectedBizSolIds:[],
    workRules:[],
    listColumnCodes:[]
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        // if (location.pathname === '/traceWork') {
        //   dispatch({
        //     type:'updateStates',
        //     payload:{
        //       limit:limit
        //     }
        //   })
        // }
      });
    },
  },
  effects: {
    *getTraceWork({payload,callback,setState,state},{call,put,select}){
      const {data} = yield call(apis.getTraceWork,payload,'','traceWork');
      if(data.code==200){
        setState({
          ...data.data
        })
        callback&&callback(data.data.listTitle)
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //跟踪取消跟踪
    *traceWork({payload,params,setState,state},{call,put,select}){
      payload.headers=params
      const {data} = yield call(apis.traceWork,payload,'','traceWork');
      if(data.code==200){
        message.success('设置成功');
        const {list,currentPage,returnCount,limit,searchWord} = state;
        //重新获取
        if(list.length==1&&currentPage!=1){
          yield put({
            type:'getTraceWork',
            payload:{
              searchWord:searchWord,
              start:currentPage-1,
              limit:limit
            },
            setState,
            state
          })
        }else{
          yield put({
            type:'getTraceWork',
            payload:{
              searchWord:searchWord,
              start:currentPage,
              limit:limit
            },
            setState,
            state
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
