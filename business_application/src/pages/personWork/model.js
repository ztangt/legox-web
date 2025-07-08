import { message } from 'antd';
import apis from 'api';
const limit=10;
export default {
  namespace: 'personWork',
  state: {
    limit: 10,
    allPages: 0,
    returnCount: 0,
    currentPage: 0,
    searchWord:'',
    list:[],
    searchColumnCodes:[],
    selectCategorId:'all',
    categorList:[],
    selectCategorInfo:{},
    isShowAddModal:false,
    isShowMoveModal:false,
    selectedRowKeys:[],
    noConditionList:[],//用于判断是否能够新增分类
    listTitle:{}
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        // if (location.pathname === '/sendWork') {
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
    *getWorkCategory({setState,state},{call,put,select}){
      const {data} = yield call(apis.getWorkCategory,'','personWork');
      if(data.code==200){
        setState({
          categorList:data.data.list,
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getCollectionWork({payload,setState,state},{call,put,select}){
      const {data} = yield call(apis.getCollectionWork,payload,'','personWork');
      if(data.code==200){
        console.log('payload.paramsJson=',JSON.parse(payload.paramsJson).length)
        if(!payload.searchWord&&!JSON.parse(payload.paramsJson).length){
          const {isShowAddModal,selectCategorInfo}=state;
          console.log('selectCategorInfo=',selectCategorInfo);
          if(Object.keys(selectCategorInfo).length&&!selectCategorInfo.children.length&&isShowAddModal&&data.data.list.length){
            message.error('下面有工作事项不能添加分类1')
          }
          setState({
            noConditionList:data.data.list
          })
        }
        setState({
          ...data.data
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *addCategory({payload,setState,state},{call,put,select}){
      const {data} = yield call(apis.addCategory,payload,'','personWork');
      if(data.code==200){
        message.success('保存成功');
        yield put({
          type:"getWorkCategory",
          setState,
          state
        })
        setState({
          selectCategorId:data.data.categoryId,
          isShowAddModal:false
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *updateCategory({payload,setState,state},{call,put,select}){
      const {data} = yield call(apis.updateCategory,payload,'','personWork');
      if(data.code==200){
        message.success('更新成功');
        const {categorList} = state;
        const loopTree=(tree,categoryName)=>{
          tree.map((item)=>{
            if(item.categoryId==payload.categoryId){
              item.categoryName = categoryName
            }else if(item.children&&item.children.length){
              loopTree(item.children,categoryName);
            }
          })
          return tree;
        }
        setState({
          categorList:loopTree(categorList,payload.categoryName),
          isShowAddModal:false
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *deleteCategory({payload,setState,state},{call,put,select}){
      const {data} = yield call(apis.deleteCategory,payload,'','personWork');
      if(data.code==200){
        message.success('删除成功');
        const {selectCategorId} = state;
        yield put({
          type:"getWorkCategory",
          setState,
          state
        })
        setState({
          selectCategorId:selectCategorId==payload.workCategoryId?'all':selectCategorId,
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *updateCollectionWork({payload,setState,state},{call,put,select}){
      const {data} = yield call(apis.updateCollectionWork,payload,'','personWork');
      if(data.code==200){
        message.success('移动成功');
        const {selectCategorId,searchWord,limit,paramsJson} = state;
        yield put({
          type:'getCollectionWork',
          payload:{
            searchWord,
            start:1,
            limit,
            categoryId:selectCategorId=='all'?'':selectCategorId,
            paramsJson:JSON.stringify(paramsJson)
          },
          setState,
          state
        })
        setState({
          selectedRowKeys:[],
          isShowMoveModal:false
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *deleteCollWork({payload,setState,state},{call,put,select}){
      const {data} = yield call(apis.deleteCollWork,payload,'','personWork');
      if(data.code==200){
        message.success('删除成功');
        const {selectCategorId,searchWord,limit,paramsJson} = state;
        yield put({
          type:'getCollectionWork',
          payload:{
            searchWord,
            start:1,
            limit,
            categoryId:selectCategorId=='all'?'':selectCategorId,
            paramsJson:JSON.stringify(paramsJson)
          },
          setState,
          state
        })
        setState({
          selectedRowKeys:[]
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
