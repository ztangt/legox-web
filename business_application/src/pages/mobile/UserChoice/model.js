import { Toast  } from 'antd-mobile/es';
import apis from 'api';
const {getAddress} = apis

export default { 
    namespace: 'userChoiceSpace',
    state: {
        choiceList: [], // 选择人员
        currentPage: 1,
        returnCount: 0,
        searchWord: '',
        // checkListKey: [], // 选中人员因为是单选所以注销
        checkRelationId: '',//相关人
    },
    effects: {
        // 获取用户人员列表
        *getAddress({ payload, callback }, { call, put, select }){
            const {data} = yield call(getAddress,payload,'','userChoiceSpace')
            const {choiceList} = yield select(state=>state.userChoiceSpace)
            if(data.code ==200){
                yield put({
                    type: 'updateStates',
                    payload: {
                        choiceList:payload.start>1? choiceList.concat(data.data.list):data.data.list,
                        currentPage: data.data.currentPage,
                        returnCount: data.data.returnCount,
                    }
                })

            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
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