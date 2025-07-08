import { Toast  } from 'antd-mobile/es';
import apis from 'api';
const {getNoticeViewList,putNoticeCollect,delNoticeCollect,addViewsNotice,getNoticeCollectList} = apis

export default { 
    namespace: 'announcementSpace',
    state: {
        announceList: [],
        currentPage: 1,
        returnCount: 0,
        searchValue: '',
        activeClassify: '1',
        activeTime: '1',
        activeIsRead: '',
    },
    effects: {
        // 获取收藏公告列表
        *getNoticeCollectList({ payload, callback }, { call, put, select }){
            const {data} = yield call(getNoticeCollectList,payload,'','announcementSpace')
            const {announceList} = yield select(state=>state.announcementSpace)
            if(data.code == 200){
                yield put({
                    type: 'updateStates',
                    payload: {
                        currentPage: data.data.currentPage,
                        announceList: payload.start>1?announceList.concat(data.data.list):data.data.list,
                        returnCount: data.data.returnCount,
                    }
                })
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                data.msg&&Toast.show({
                    content: data.msg
                });
            }
        },
        // 点击增加浏览和是否已读
        *addViewsNotice({ payload, callback }, { call, put, select }){
            const {data} = yield call(addViewsNotice,payload,'','announcementSpace')
            if(data.code == 200){
                callback&&callback()
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                data.msg&&Toast.show({
                    content: data.msg
                });
            }
        },
        // 取消收藏
        *delNoticeCollect({ payload, callback }, { call, put, select }){
            const {data} = yield call(delNoticeCollect,payload, '', 'announcementSpace')
            if(data.code == 200){
                Toast.show({
                    content:'已取消收藏'
                });
                callback&&callback()
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                data.msg&&Toast.show({
                    content: data.msg
                });
            }
        },
        // 收藏通知公告
        *putNoticeCollect({ payload, callback }, { call, put, select }){
            const {data} = yield call(putNoticeCollect,payload, '', 'announcementSpace')
            if(data.code == 200){
                Toast.show({
                    content:'收藏成功'
                });
                callback&&callback()
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                data.msg&&Toast.show({
                    content: data.msg
                });
            }
        },  
        // 获取通知公告列表
       *getNoticeViewList({ payload, callback }, { call, put, select }){
            const {data} = yield call(getNoticeViewList,payload, '', 'announcementSpace')
            const {announceList} = yield select(state=>state.announcementSpace)
            if(data.code == 200){
                yield put({
                    type: 'updateStates',
                    payload: {
                        currentPage: data.data.currentPage,
                        announceList: payload.start>1?announceList.concat(data.data.list):data.data.list,
                        returnCount: data.data.returnCount,
                    },
                  })
                  callback&&callback()
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                data.msg&&Toast.show({
                    content: data.msg
                });
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
      }

}