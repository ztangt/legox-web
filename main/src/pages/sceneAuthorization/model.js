import {message} from 'antd'
import apis from 'api'
const {getSceneList,getScenePost,sceneRefPost} = apis
import {REQUEST_SUCCESS} from '../../service/constant'


export default {
    namespace: 'sceneConfigSpace',
    state:{
        currentPage: 1,
        returnCount: 0,
        limit: 10,
        selectedNodeId:'',//办理人配置选人需要字段
        selectedDataIds:[],
        selectedDatas: [],
        currentNode:{},
        expandedKeys:[],
        treeSearchWord:"",
        originalData:[],
        selectNodeType:'',
        sceneList:[], // 场景列表
        postId: '' // 岗位id
    },
    effects:{
        // 关联岗位id
        *sceneRefPost({ payload, callback }, { call, put, select }){
            const {data} = yield call(sceneRefPost,payload,'','sceneConfigSpace')
            if(data.code ==REQUEST_SUCCESS){
                 callback&&callback()   
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 根据场景获取岗位id
        *getScenePost({ payload, callback }, { call, put, select }){
            const {data} = yield call(getScenePost,payload,'','sceneConfigSpace')
            if(data.code == REQUEST_SUCCESS){
                callback&&callback()
                if(data.data.list&&data.data.list.length>0){
                    const postIdArr = data.data.list
                    yield put({
                        type: 'updateStates',
                        payload: {
                            postId: postIdArr.join(','),
                            selectedDataIds: postIdArr
                        }
                    })
                }else{
                    yield put({
                        type: 'updateStates',
                        payload: {
                            postId:'',
                            selectedDataIds: []
                        }
                    })
                }
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }   
            
        },
        // 场景列表
        *getSceneList({ payload, callback }, { call, put, select }){
            const {data} = yield call(getSceneList,payload,'','sceneConfigSpace')
            
            if(data.code ==REQUEST_SUCCESS){
                const list = data.data.list&&data.data.list.length>0&&data.data.list.map((item,index)=>{
                    item.number = index+1
                    return item
                })||[]
                yield put({
                    type: 'updateStates',
                    payload: {
                        sceneList: list,
                        currentPage: data.data.currentPage,
                        returnCount: data.data.returnCount
                    }
                })
            }else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        }
    },
    reducers:{
        updateStates(state,action){
            return {
                ...state,
                ...action.payload
            }
        }
    }
}
