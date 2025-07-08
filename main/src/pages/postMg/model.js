import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'
import { env } from '../../../../project_config/env'
import { parse } from 'query-string';
import {history} from 'umi'
const {  getPosts, addPost, deletePost, updatePost,importPost,importPostResult,getDownFileUrl,findPermissionAuth,postExport,postSort,postEnable } = apis;
export default {
  namespace: 'postMg',
  state: {
    // 使用公用upload组件 所需的全部初始数据（有的用不到，酌情删减）
    fileUrl:'',
    selectTreeUrl: [],//面包屑路径
    uploadFlag: true, //上传暂停器
    nowMessage: '', //提示上传进度的信息
    md5: '', //文件的md5值，用来和minio文件进行比较
    fileChunkedList: [], //文件分片完成之后的数组
    fileName: '', //文件名字
    fileNames: '',  //文件前半部分名字
    fileStorageId: '', //存储文件信息到数据库接口返回的id
    typeNames: '', //文件后缀名
    optionFile: {}, //文件信息
    fileSize: '', //文件大小，单位是字节
    getFileMD5Message: {}, //md5返回的文件信息
    success: '', //判断上传路径是否存在
    v: 1, //计数器
    needfilepath: '', //需要的minio路径
    isStop: true,  //暂停按钮的禁用
    isContinue: false, //继续按钮的禁用
    isCancel: false, //取消按钮的禁用
    index: 0, //fileChunkedList的下标，可用于计算上传进度
    merageFilepath: '',  //合并后的文件路径
    typeName: '', //层级
    fileExists: '', //判断文件是否存在于minio服务器中，相关modal中监听判断fileExists状态进行后续分别操作
    md5FileId: '', //md5查询到的文件返回的id
    md5FilePath: '', //md5查询到的文件返回的pathname 
    ///////////

    posts: [],//岗位列表
    currentPage: 1,
    returnCount: 0,
    modalVisible: false,//弹窗状态
    psot: {},//当前岗位信息
    searchWord: '',
    postIds: '',
    treeData: [], 
    treeSearchWord:'', 
    currentNode: {}, 
    expandedKeys: [],
    limit: 10,
    isShowImportPostModel:false,
    isShowExportPostModel:false,
    importData: {},
    isView:false,
    leftNum:220,
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
        // if(history.location.pathname=='/postMg'){
        //   const query = parse(history.location.search);
        //   const { currentNodeId, currentNodeType, currentPage, searchWord, isInit,limit} = query
        //   if(isInit=='1'){
        //     dispatch({
        //       type: 'updateStates',
        //       payload:{
        //         posts: [],//岗位列表
        //         returnCount: 0,
        //         modalVisible: false,//弹窗状态
        //         psot: {},//当前岗位信息
        //         postIds: '',
        //       }
        //     })
        //   }
        //   let deptId = ''
        //   let orgId = ''
        //   if(currentNodeType=='ORG'){
        //     orgId = currentNodeId
        //     deptId = ''
        //   }else{
        //     deptId = currentNodeId
        //     orgId  = ''
        //   }
        //   if(currentNodeId&&currentNodeId!='undefined'){
        //     dispatch({
        //       type: 'getPosts',
        //       payload:{
        //         deptId,
        //         orgId,
        //         start: currentPage,
        //         limit: limit?limit:10,
        //         searchWord
        //       }
        //     })
        //   }
        // }
        
      });
    }
  },
  effects: {
    
    *getPosts({ payload }, { call, put, select }) {
      try {
        const {data} = yield call(getPosts, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              postIds: [],
              posts: data.data.list,
              returnCount: data.data.returnCount,
              currentPage: data.data.currentPage
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }

    },
    *getSortPosts({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getPosts, payload);
        if(data.code==REQUEST_SUCCESS){
          callback && callback(data.data.list);
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }

    },
    *updatePost({ payload }, { call, put, select }) {

      try {
        const {data} = yield call(updatePost, payload);
        const {currentNode,currentPage,searchWord,limit} = yield select(state=>state.postMg)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              modalVisible: false
            }
          })
          let orgId = currentNode.key;
          let deptId = currentNode.key;
          yield put({
            type: 'getPosts',
            payload:{
              deptId,
              orgId,
              start: currentPage,
              limit: limit,
              searchWord
            }
          })

        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }

    },
    *addPost({ payload }, { call, put, select }) {
      try {
        const {data} = yield call(addPost, payload);
        const {currentNode,limit,currentPage} = yield select(state=>state.postMg)
        if(data.code==REQUEST_SUCCESS){
          let deptId = currentNode.key;
          let orgId = currentNode.key;
          yield put({
            type: 'getPosts',
            payload:{
              orgId,
              start: currentPage,
              limit: limit,
            }
          })
          yield put({
            type: 'updateStates',
            payload:{
              modalVisible: false
            }
          })
          
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *deletePost({ payload }, { call, put, select }) {
      try {
        const {data} = yield call(deletePost, payload);
        const {currentNode,currentPage,searchWord,limit,posts} = yield select(state=>state.postMg)
        if(data.code==REQUEST_SUCCESS){
          let deptId = currentNode.key;
          let orgId = currentNode.key;
          if (posts.length == 1 && currentPage != 1){
            yield put({
              type: 'getPosts',
              payload:{
                deptId,
                orgId,
                start: currentPage-1,
                limit: limit,
                searchWord
              }
            })
          }else{
            yield put({
              type: 'getPosts',
              payload:{
                deptId,
                orgId,
                start: currentPage,
                limit: limit,
                searchWord
              }
            })
          }
          
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    // 文件上传接口
    *uploaderFile({ payload, callback }, { call, put, select }) {
        yield fetch(`${env}/public/fileStorage/uploaderFile`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + window.localStorage.userToken,
            },
            body: payload.importFormData,
        }).then(res => {
            res.json().then((data) => {
                if (data.code == 200) {
                    callback && callback(data.data);
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            }).catch((err) => {
              // 将 err 转换为字符串类型
              const errorMessage = err instanceof Error ? err.message : String(err);
              message.error(errorMessage);
            })
        })
    },

    //岗位信息导入
    *importPost({ payload, callback }, { call, put, select }) {
        const { data } = yield call(importPost, payload);
        if (data.code == REQUEST_SUCCESS) {
            callback&&callback(data.data.importId)
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
            message.error(data.msg);
        }
    },

    //岗位信息导入结果查看
    *importPostResult({ payload, callback }, { call, put, select }) {
        const { data } = yield call(importPostResult, payload);
        if (data.code == REQUEST_SUCCESS) {
            callback&&callback(true,data)
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
            callback&&callback(false,data)
        }
    },
     //获取上传的文件路径
     *getDownFileUrl({ payload, callback }, { call, put, select }) {
        try {
            const { data } = yield call(getDownFileUrl, payload);
            if (data.code == REQUEST_SUCCESS) {
                callback && callback(data.data.fileUrl);
            } else {
                message.error(data.msg, 5)
            }
        } catch (e) {
        } finally {
        }

    },
    *findPermissionAuth({ payload, callback }, { call, put, select }) {
      const { data } = yield call(findPermissionAuth, payload);
      if (data.code == REQUEST_SUCCESS) {
          callback&&callback(data)
      } 
    },
    *postExport({ payload, callback }, { call, put, select }) {
      const { data } = yield call(postExport, payload);
      if (data.code == REQUEST_SUCCESS) {
        callback&&callback(data.data)
      } 
    },
    *postSort({ payload, callback }, { call, put, select }) {
      const { data } = yield call(postSort, payload);
      if (data.code == REQUEST_SUCCESS) {
        callback&&callback()
      } 
    },
    *postEnable({ payload, callback }, { call, put, select }) {
      const { data } = yield call(postEnable, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success('操作成功');
        callback&&callback()
      } 
    },
    
  },
  reducers: {
    updateStates(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
