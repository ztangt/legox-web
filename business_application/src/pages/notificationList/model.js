import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import { message } from 'antd'

const {
  userExport,
  getNoticeViewList,
  putNoticeCollect,
  getNoticeCollectList,//收藏列表，
  delNoticeCollect,//删除收藏
} = apis;

export default {
  namespace: 'notificationList',
  state: {
    returnCount: 0,
    modalList: {},
    viewData: [],
    isView:'',
    limit:0,
    noticeName:'',
    list: [],
    allPage:0,
    currentPage: 1,
    startTime:'',
    endTime:'',
    selectedRowKeys:[],
    currentHeight: 0,
    leftNum:20,
    noticeTypeList:[],
    noticeTypeId:''
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
      });
    },
  },
  effects: {

    // if (data.code == REQUEST_SUCCESS) {

    // }
    // else if (data.code != 401 && data.code != 419 && data.code !=403) {
    //   message.error(data.msg, 5)
    // }

    *getNoticeViewList({ payload }, { call, put, select }) {
      const { data } = yield call(getNoticeViewList, payload,'','notificationList')
      if (data.code == REQUEST_SUCCESS) {
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
    //批量收藏通知公告
    *putNoticeCollect({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(putNoticeCollect, payload,'','notificationList')
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload:{
            selectedRowKeys:[]
          }
        })
        message.success('收藏成功')
        const { limit, noticeName, list, currentPage, isView,  startTime,endTime,noticeTypeId } = yield select(state => state.notificationList);
        if (list.length == payload.noticeIds.split(',').length && currentPage != 1) {
          // if(isView==2){
          //   yield put({
          //     type: 'getNoticeViewList',
          //     payload:{
          //       start: currentPage,
          //       limit: limit,
          //       noticeName: noticeName,
          //       isView: isView=='2'?'':isView,
          //       startTime: startTime,
          //       endTime:endTime,
          //     }
          //   })
          // }
          yield put({
            type: 'getNoticeViewList',
            payload: {
              start: currentPage - 1,
              limit: limit,
              noticeName: noticeName,
              isView: isView=='2'?'':isView,
              startTime: startTime,
              endTime:endTime,
              noticeTypeId,
            }
          })

        }
        else{
          yield put({
            type: 'getNoticeViewList',
            payload:{
              start: currentPage,
              limit: limit,
              noticeName: noticeName,
              isView: isView=='2'?'':isView,
              startTime: startTime,
              endTime:endTime,
              noticeTypeId,
            }
          })
        }
      }
      else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5)
      }
    },
    //获取收藏的通知公告全部列表
    *getNoticeCollectList({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(getNoticeCollectList, payload,'','notificationList')
      if (data.code == REQUEST_SUCCESS) {
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
    *delNoticeCollect({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(delNoticeCollect, payload,'','notificationList')
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload:{
            selectedRowKeys:[]
          }
        })
        message.success('取消收藏')
        const { limit, noticeName, list, currentPage, startTime,endTime,noticeTypeId } = yield select(state => state.notificationList);
        if (list.length == payload.noticeIds.split(',').length && currentPage != 1) {
          yield put({
            type: 'getNoticeCollectList',
            payload: {
              start: currentPage - 1,
              limit: limit,
              noticeName: noticeName,
              startTime: startTime,
              endTime:endTime,
              noticeTypeId,
            }
          })

        }
        else{
          yield put({
            type: 'getNoticeCollectList',
            payload:{
              start: currentPage,
              limit: limit,
              noticeName: noticeName,
              startTime: startTime,
              endTime:endTime,
              noticeTypeId
            }
          })
        }
      }
      else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5)
      }
    },
    // 查询通知公告类别列表
    *getNoticeTypeList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getNoticeTypeList, payload,'','notificationList');
      console.log(data,'data---');
      if (data.code == REQUEST_SUCCESS) {
        let noticeTypeList = [];
        data.data.list.forEach((item) => {
          noticeTypeList.push({
            title: item.noticeTypeName,
            key: item.noticeTypeId,
            code:item.noticeTypeCode,
            children: null,
          });
        });
        yield put({
          type: 'updateStates',
          payload: {
            noticeTypeList: data.data.list.length
              ? noticeTypeList
              : [],
          },
        });
        console.log(data.data.list,'data.data.list');
      
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      } else {
        message.warning('没有数据');
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