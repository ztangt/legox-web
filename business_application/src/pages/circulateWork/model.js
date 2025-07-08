import { message } from 'antd';
import apis from 'api';
const limit=10;
export default {
  namespace: 'circulateWork',
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
        if (location.pathname === '/circulateWork') {
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
    *getCirculateWork({payload,callback,setState},{call,put,select}){
      const {data} = yield call(apis.getCirculateWork,payload,'','circulateWork');
      if(data.code==200){
        let unreadData=data.data.list.filter(item=>item.taskStatus=='0')
        let readData=data.data.list.filter(item=>item.taskStatus=='2')
            readData.sort((a,b)=> Number(b.endTime)-Number(a.endTime)
        )
        let res=unreadData.concat(readData)
        setState({
          allPage:data.data.allPage,
          currentPage:data.data.currentPage,
          list:res,
          listTitle:data.data.listTitle,
          returnCount:data.data.returnCount
        })
        callback&&callback(data.data.listTitle)
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //跟踪取消跟踪
    *traceWork({payload,params,callback},{call,put,select}){
      payload.headers=params
      const {data} = yield call(apis.traceWork,payload,'','circulateWork');
      if(data.code==200){
        message.success('设置成功');
        const {list}=yield select(state=>state.circulateWork)
        //将选中的id更新跟踪状态
        list.map((item)=>{
          if(payload.bizInfoIds.includes(item.bizInfoId)){
            item.isTrace=payload.traceType
          }
        })
        callback&&callback(list)
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //设置已阅
    *setCirculate({payload,isShowMessge,setState},{call,put,select}){
      const {data} = yield call(apis.setCirculate,payload,'','circulateWork');
      const {limit,list}=yield select(state=>state.circulateWork)
      if(data.code==200){
        if(isShowMessge){
          message.success('设置成功');
          yield put({
            type:'getCirculateWork',
            payload:{
              searchWord:'',
              start:1,
              limit,
              paramsJson:[],
              workRuleId:'',
            },
            setState:setState
          })
        }
        console.log('list=',list);
        console.log('payload.bizTaskIds=',payload.bizTaskIds);
        //将选中的id更新跟踪状态
        list.map((item)=>{
          if(payload.bizTaskIds.split(',').includes(item.bizTaskId)){
            item.taskStatus='2'
          }
        })
        let unreadData=list.filter(item=>item.taskStatus=='0')
        let readData=list.filter(item=>item.taskStatus=='2')
            readData.sort((a,b)=> Number(b.endTime)-Number(a.endTime)
        )
        let res=unreadData.concat(readData)
        setState({
          list:_.cloneDeep(res),
          selectedRowKeys:[]
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    }
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
