import { Toast  } from 'antd-mobile/es';
import apis from 'api';
const {
    getNotice,  
    getDownFileUrl, //下载文件
    getCurrentUserInfo,
    } = apis

export default { 
    namespace: 'mobileAnnounceDetail',
    state: {
        announceDetail: {},
        curUserInfo: {},
        fileUrl: '' // 下载链接
    },
    effects: {
        // 获取用户信息
      *getCurrentUserInfo({ payload, callback }, { call, put, select }){
        const {data} = yield call(getCurrentUserInfo,payload,'','mobileCalendar')
        yield put({
          type: 'updateStates',
          payload: {
            curUserInfo: data.data,
          },
        });
      },
        //获取下载地址url
        *getDownFileUrl({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getDownFileUrl, payload,'','mobileAnnounceDetail');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        fileUrl: data.data.fileUrl,
                    },
                });
                callback && callback(data.data.fileUrl);
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                data.msg&&Toast.show({
                    content: data.msg
                });
            }
        },

        // 查看通知公告
        *getNotice({ payload, callback }, { call, put, select }){
            const {data} = yield call(getNotice,payload,'','mobileAnnounceDetail')
            if(data.code == 200){
                yield put({
                    type: 'updateStates',
                    payload :{
                        announceDetail: data.data
                    }
                })
                callback&&callback(data.data)
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