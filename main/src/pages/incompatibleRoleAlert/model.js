import { message } from 'antd';
import apis from 'api';
const {getIncompatibleWarnList,updateCurrentList} = apis
import { REQUEST_SUCCESS } from '../../service/constant'

export default {
    namespace: 'incompatibleWaring',
    state: {
        warningList: [],
        currentHeight: 0,
        searchWord: '',
        currentPage: 1,
        returnCount: 0,
        curLimit: 10
    },
    effects: {
        //更新当前列表
        *updateCurrentList({ payload, callback }, { call, put, select }){
            const {data} = yield call(updateCurrentList,payload,'','incompatibleSettingsSpace')
            console.log("data=009",data)
            if(data.code == REQUEST_SUCCESS){
                callback&&callback()
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 获取不相容预警列表   
        *getIncompatibleWarnList({ payload, callback }, { call, put, select }){
            const {data} = yield call(getIncompatibleWarnList,payload,'','incompatibleSettingsSpace')
            if(data.code == REQUEST_SUCCESS){
                yield put({
                    type: 'updateStates',
                    payload: {
                        warningList: data.data.list,
                        currentPage: data.data.currentPage,
                        returnCount: data.data.returnCount
                    }
                })
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
    },
    reducers: {
        updateStates(state, action) {
            return {
                ...state,
                ...action.payload
            }
        }
    }

}