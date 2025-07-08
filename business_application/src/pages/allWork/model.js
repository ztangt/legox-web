import { message } from 'antd';
import apis from 'api';
const limit=10;
export default {
  namespace: 'allWork',
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
    selectedBizSolIds:[],
    isShowCateModal:false,
    selectedRowKeys:[],
    categorList:[]
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        if (location.pathname === '/allWork') {
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
    *getAllWork({payload,callback,setState},{call,put,select}){
      const {data} = yield call(apis.getAllWork,payload,'','allWork');
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
      const {data} = yield call(apis.traceWork,payload,'','allWork');
      if(data.code==200){
        message.success('设置成功');
        const {list} = state;
        //将选中的id更新跟踪状态
        list.map((item)=>{
          if(payload.bizInfoIds.includes(item.bizInfoId)){
            item.isTrace=payload.traceType
          }
        })
        console.log('list=',list);
        setState({
          list
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getWorkCategory({payload,callback,setState,state},{call,put,select}){
      const {data} = yield call(apis.getWorkCategory,payload,'','allWork');
      if(data.code==200){
        setState({
          categorList:data.data.list
        })
        callback&&callback()
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *addCollWork({payload,setState},{call,put,select}){
      const {data} = yield call(apis.addCollWork,payload,'','allWork');
      if(data.code==200){
        message.success('归档成功');
        setState({
          selectedRowKeys:[],
          checkedKeys:[],
          isShowCateModal:false
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
