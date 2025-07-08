import { message } from 'antd';
import apis from 'api';
const { getCategoryList, getMessageList, putMessage } = apis
export default {
  namespace: 'backlogo',
  state: {
    categoryData: [],
    list: [],
    returnCount: 0,
    allPage:0,
    currentPage: 1,
    selectedRowKeys: [],
    searchWord:'',
    category: '',
    limit:10,
    unreadLength:null,
    currentHeight: 0,
    isModalVisible:false,
    sysItem:null,
    currentType:'',
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
      });
    },
  },
  effects: {
    //左侧分类
    *getCategoryList({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(getCategoryList, payload,'','backlogo')
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            categoryData: data.data.list
          }
        })
      }
      else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5)
      }

    },
    *getMessageList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getMessageList, payload,'','backlogo')
      if (data.code == 200) {
        if(!data.data.list){
          yield put({
            type: 'updateStates',
            payload: {
              list:[],
              allPage: 1,
              returnCount: 0,
              currentPage: 1
            }
          })
        }
        yield put({
          type: 'updateStates',
          payload: {
            ...data.data
          }
        })
      }
      else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5)
      }

    },
    //读取消息
    *putMessage({ payload, callback }, { call, put, select }) {
      const { data } = yield call(putMessage, payload,'','backlogo')
      const { categoryData } = yield select(state => state.backlogo)
      if (data.code == 200) {
        yield put({
          type:'getCategoryList',
        })
        yield put({
          type: 'updateStates',
          payload: {
            selectedRowKeys:[],
            unreadLength:categoryData?.filter(item => item.msgStatus == 0).reduce((pre, cur) => {
              return pre + Number(cur.num)
          }, 0),
          }
        })
        callback&&callback()
      }
      else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5)
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
