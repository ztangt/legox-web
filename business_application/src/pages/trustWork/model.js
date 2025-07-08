import { message } from 'antd';
import apis from 'api';
const limit=10;
export default {
  namespace: 'trustWork',
  state: {
    limit: 10,
    allPages: 0,
    returnCount: 0,
    currentPage: 0,
    searchWord:'',
    list:[],
    listTitle:{},
    searchColumnCodes:[],
    workRules:[],
    listColumnCodes:[],
    ctlgTree:[],
    businessList:[],
    selectedBizSolIds:[]
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        // if (location.pathname === '/trustWork') {
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
    *getTrustWork({payload,callback,setState},{call,put,select}){
      const {data} = yield call(apis.getTrustWork,payload,'','trustWork');
      if(data.code==200){
        setState({
          allPage:data.data.allPage,
          currentPage:data.data.currentPage,
          list:data.data.list.sort((a,b)=>Number(b.trustStartTime)-Number(a.trustStartTime)),
          listTitle:data.data.listTitle,
          returnCount:data.data.returnCount
        })
        callback&&callback(data.data.listTitle)
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //跟踪取消跟踪
    *traceWork({payload,params,setState,state},{call,put,select}){
      payload.headers=params
      const {data} = yield call(apis.traceWork,payload,'','trustWork');
      if(data.code==200){
        message.success('设置成功');
        const {list} = state;
        //将选中的id更新跟踪状态
        list.map((item)=>{
          if(payload.bizInfoIds.includes(item.bizInfoId)){
            item.isTrace=payload.traceType
          }
        })
        console.log(list,'list');
        setState({
          list
        })
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
