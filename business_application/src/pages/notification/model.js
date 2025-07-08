import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';
import axios from 'axios';
const {
  getNoticeList,
  delNotice,
  addNotice,
  releaseNotice,
  uploadFile,
  updateNotice,
  getNotice,
  getNoticeView, //查询浏览记录
  addViewsNotice, //增加浏览次数,
  getDownFileUrl, //下载文件
} = apis;
const limit = 10;
export default {
  namespace: 'notification',
  state: {
    htmlFileStorageId:"",
    noticeHtmlValue: '',
    uploadFlag: true,
    nowMessage: '',
    md5: '',
    fileChunkedList: [],
    fileName: '',
    fileNames: '',
    fileStorageId: '',
    typeNames: '',
    optionFile: {},
    fileSize: '',
    getFileMD5Message: {},
    success: '',
    v: 1,
    needfilepath: '',
    isStop: true,
    isContinue: false,
    isCancel: false,
    index: 0,
    merageFilepath: '',
    typeName: '',
    fileExists: '',
    fileExistsFu: '', // 是否有富文本内容
    md5FilePath: '',
    md5FileId: '',
    fileData:[],
    returnCount: 0,
    list: [],
    allPage: 0,
    currentPage: 1,
    selectedNodeId: '',
    selectedDataIds: [],
    treeData: [],
    currentNode: [],
    expandedKeys: [],
    treeSearchWord: '',
    selectedDatas: [],
    originalData: [],
    selectNodeType: '',
    searchResult: {}, //查看通知公告信息
    userInfo: {},
    viewData: [], //浏览记录数据
    limit: 0,
    currentHeight: 0,
    selectedRowKeys: [],
    noticeName: '',
    isRelease: '',
    startTime: '',
    endTime: '',
    fileSelectedRowKeys: [],
    switchFlag: '',
    type: '',
    unUploadList:[],
    uploadList:[],
    noticeTypeData:[],//通知公告类型
    leftNum:0,
    noticeTypeList:[],
    defaultTypeId: '', //默认选择分类id
    noticeTypeId:'',
    currentNoticeTypeItem:{},//当前选中类型数据
    saveButtonLoading: false,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        console.log(location,'location');
        // if (location.pathname === '/noticePage'&&location.query.id) {
        //   dispatch({
        //     type: 'getNotice',
        //     payload: {
        //       noticeId: location.query.id
        //     },
        //     callBack: (data) => {
        //       if (data.noticeRange === 2) {
        //         dispatch({
        //           type: 'getNoticeView',
        //           payload: {
        //             noticeId: data.noticeId,
        //           },
        //         });
        //       }
        //       // 根据返回的链接获取富文本内容
        //       if (data.noticeHtmlUrl) {
        //         axios
        //           .get(data.noticeHtmlUrl)
        //           .then(function (res) {
        //             if (res.status == 200) {
        //               console.log(res.data.value,'noticeHtmlUrl==');
        //               dispatch({
        //                 type: 'updateStates',
        //                 payload: {
        //                   noticeHtmlValue: res.data.value,
        //                 },
        //               });
        //             }
        //           })
        //           .catch(function (error) {});
        //       }
        //      }
        //   })
        // }
      });
    },
  },
  effects: {
    *getNoticeList({ payload }, { call, put, select }) {
      const { data } = yield call(getNoticeList, payload,'','notification');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            ...data.data,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5);
      }
    },
    //删除
    *delNotice({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(delNotice, payload,'','notification');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            selectedRowKeys: [],
          },
        });
        const {
          limit,
          noticeName,
          list,
          currentPage,
          isRelease,
          startTime,
          endTime,
          noticeTypeId
        } = yield select((state) => state.notification);
        if (
          list.length == payload.noticeIds.split(',').length &&
          currentPage != 1
        ) {
          yield put({
            type: 'getNoticeList',
            payload: {
              start: currentPage - 1,
              limit,
              noticeName,
              isRelease,
              startTime,
              endTime,
              noticeTypeId
            },
          });
        } else {
          yield put({
            type: 'getNoticeList',
            payload: {
              start: currentPage,
              limit,
              noticeName,
              isRelease,
              startTime,
              endTime,
              noticeTypeId
            },
          });
        }
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5);
      }
    },
    //新增
    *addNotice({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(addNotice, payload,'','notification');
      const { noticeName, isRelease, startTime, endTime, limit ,currentPage,noticeTypeId} = yield select(
        (state) => state.notification,
      );
      if (data.code == REQUEST_SUCCESS) {
        if(payload.isRelease==1){
          message.success('保存并发布成功')
        }else{
          message.success('保存成功')
        }
        
        yield put({
          type: 'updateStates',
          payload:{
            selectedDatas:[],
            saveButtonLoading:false
          }
        }),
          // callBack(data.data.noticeId);
        yield put({
          type: 'getNoticeList',
          payload: {
            noticeName,
            isRelease,
            startTime,
            endTime,
            start: currentPage,
            limit,
            noticeTypeId
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5);
      }
    },
    //发布
    *releaseNotice({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(releaseNotice, payload,'','notification');
      if (data.code == REQUEST_SUCCESS) {
        message.success('发布成功');
        yield put({
          type: 'updateStates',
          payload: {
            selectedRowKeys: [],
          },
        });
        const {
          limit,
          noticeName,
          list,
          currentPage,
          isRelease,
          startTime,
          endTime,
          noticeTypeId
        } = yield select((state) => state.notification);
        if (
          list.length == payload.noticeId.split(',').length &&
          currentPage != 1
        ) {
          yield put({
            type: 'getNoticeList',
            payload: {
              start: currentPage - 1,
              limit,
              noticeName,
              isRelease,
              startTime,
              endTime,
              noticeTypeId
            },
          });
        } else {
          yield put({
            type: 'getNoticeList',
            payload: {
              start: currentPage,
              limit,
              noticeName,
              isRelease,
              startTime,
              endTime,
              noticeTypeId
            },
          });
        }
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5);
      }
    },
    //取消发布
    *releaseNoticeCancel({ payload, callBack }, { call, put, select }){
      const { data } = yield call(apis.releaseNoticeCancel, payload,'','notification');
      if (data.code == REQUEST_SUCCESS) {
        message.success('取消发布成功');
        yield put({
          type: 'updateStates',
          payload: {
            selectedRowKeys: [],
          },
        });
        const {
          limit,
          noticeName,
          list,
          currentPage,
          isRelease,
          startTime,
          endTime,
          noticeTypeId
        } = yield select((state) => state.notification);
        if (
          list.length == payload.noticeIds.split(',').length &&
          currentPage != 1
        ) {
          yield put({
            type: 'getNoticeList',
            payload: {
              start: currentPage - 1,
              limit,
              noticeName,
              isRelease,
              startTime,
              endTime,
              noticeTypeId
            },
          });
        } else {
          yield put({
            type: 'getNoticeList',
            payload: {
              start: currentPage,
              limit,
              noticeName,
              isRelease,
              startTime,
              endTime,
              noticeTypeId
            },
          });
        }
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5);
      }
    },
    //上传文件
    *uploadFile({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(uploadFile, payload,'','notification');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            userInfo: data.data,
          },
        });
        callBack(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5);
      }
    },
    //修改
    *updateNotice({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(updateNotice, payload,'','notification');
      const { noticeName, isRelease, startTime, endTime, limit ,currentPage,noticeTypeId} = yield select(
        (state) => state.notification,
      );
      if (data.code == REQUEST_SUCCESS) {
        if(payload.isRelease==1){
          message.success('保存并发布成功')
        }else{
          message.success('保存成功')
        }
        yield put({
          type: 'getNoticeList',
          payload: {
            noticeName,
            isRelease,
            startTime,
            endTime,
            start: currentPage,
            limit,
            noticeTypeId
          },
        });
        yield put({
          type: 'updateStates',
          payload:{
            selectedDatas:[],
            saveButtonLoading:false
          }
        }),
        callBack && callBack();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5);
      }
    },
    //查看通知
    *getNotice({ payload,extraParams, callBack }, { call, put, select }) {
      const { data } = yield call(getNotice, payload,'','notification');
      if (data.code == REQUEST_SUCCESS) {
        // yield put({
        //   type: 'updateStates',
        //   payload: {
        //     searchResult: data.data,
        //   },
        // });
        extraParams?.setState({
          searchResult: data.data,
          selectedDataIds:data.data.appointId?data.data.appointId.split(','):[]
      })
        callBack(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5);
      }
    },
    //查询浏览记录
    *getNoticeView({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(getNoticeView, payload,'','notification');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            viewData: data.data.list,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5);
      }
    },
    *addViewsNotice({ payload, callBack }, { call, put, select }) {
      const { data } = yield call(addViewsNotice, payload,'','notification');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
        });
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg, 5);
      }
    },
    //获取下载地址url
    *getDownFileUrl({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getDownFileUrl, payload,'','notification');
      if (data.code == REQUEST_SUCCESS) {
          yield put({
              type: 'updateStates',
              payload: {
                  fileUrl: data.data.fileUrl,
              },
          });
          callback && callback(data.data.fileUrl);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
    },
    //获取通知公告类型
    *getDictType({payload},{call,put}){
      const {data}=yield call(apis.getDictType,payload,'','notification')
      if(data.code==REQUEST_SUCCESS){
        yield put({
          type:'updateStates',
          payload:{
            noticeTypeData:data.data.list
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
    }
    },
    // 查询通知公告类别列表
    *getNoticeTypeList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getNoticeTypeList, payload,'','notification');
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
    //添加公告类型
    *addNoticeType({payload,callback},{call,put,select}){
      const {data}=yield call(apis.addNoticeType,payload,'','notification')
      const { noticeName, isRelease, startTime, endTime, limit ,currentPage,noticeTypeId} = yield select((state) => state.notification);
      if(data.code==REQUEST_SUCCESS){
        yield put({
          type:'getNoticeTypeList'
        })
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      } 
    },
    //修改公告类型
    *updateNoticeType({payload,callback},{call,put,select}){
      const {data}=yield call(apis.updateNoticeType,payload,'','notification')
      const { noticeName, isRelease, startTime, endTime, limit ,currentPage,noticeTypeId} = yield select((state) => state.notification);
      if(data.code==REQUEST_SUCCESS){
        yield put({
          type:'getNoticeTypeList'
        })
        yield put({
          type:'updateStates',
          payload:{
            noticeTypeId:payload.noticeTypeId
          }
        })
        yield put({
          type: 'getNoticeList',
          payload: {
            noticeName,
            isRelease,
            startTime,
            endTime,
            start: currentPage,
            limit,
            noticeTypeId
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      } 
    },
    //删除公告类型
    *deleteNoticeType({payload,callback},{call,put,select}){
      const {data}=yield call(apis.deleteNoticeType,payload,'','notification')
      const { noticeName, isRelease, startTime, endTime, limit ,currentPage,noticeTypeId} = yield select((state) => state.notification);
      if(data.code==REQUEST_SUCCESS){
        yield put({
          type:'getNoticeTypeList'
        })
        yield put({
          type:'updateStates',
          payload:{
            noticeTypeId:'',
            currentNoticeTypeItem:{},
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
