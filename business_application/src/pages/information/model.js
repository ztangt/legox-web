import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';

const {
  addInformation,
  getInformation,
  updateInformation,
  delInformation,
  updateInformationMove,
  updateInformationOperation,
  addInformationAuthority,
  getInformationAuthority,
  delInformationAuthority,
  addInformationComment,
  getInformationComment,
  getInformationCommentList,
  delInformationCommentList,
  addInformationType,
  updateInformationType,
  delInformationType,
  getInformationType,
  uploadFile,
  upInformationLoopList,
  getSomeoneInformation,
  getDownloadFileUrl,
  releaseInformationCancel
} = apis;

export default {
  namespace: 'information',
  state: {
    informationType: [], //资讯公告
    access: [], //权限
    comment: {}, //评论
    commentLists: [], //评论管理列表
    informationTypeList: [], //资讯公告类别列表
    upFileList: '', //文件上传
    informationId: '', //新保存资讯公告id
    defaultTypeId: '', //默认选择分类id
    informationCurrentPage: 0,
    currentLoop: 0,
    commentsCurrent: 1,
    start: 1, //
    limit: 10,
    userInfo: {},
    informations: {},
    informationTexts: '',
    fileStorageIds: '',
    informationTypeLists: [], //移动分类列表
    commentReturnCount: 0, //评论列表总条数
    loopList: [], //轮播列表
    loopListCount: 0, //轮播总数
    informationJson: [], //轮播排序
    oldSelectedDatas: [],
    oldSelectedDataIds: [],
    returnCount: 0,
    selectedNodeId: '',
    selectedDataIds: [],
    treeData: [],
    currentNode: [],
    expandedKeys: [],
    treeSearchWord: '',
    selectedDatas: [],
    originalData: [],
    selectNodeType: '',
    isCommentModalVisible: false,
    isDelCommentVisible: false,
    commentStart: 1,
    commentLimit: 10,
    commentListIds: [],
    commentListes: [],
    isModalVisible: false,
    typeId: '',
    buttonState: 0,
    selectedRows: [],
    selectedRowKeys: [],
    selectedRowKeysCurrent:[],
    typeName: '全部类别',
    isMoveModalVisible: false,
    isLoopModalVisible: false,
    loopStart: 1,
    loopLimit: 10,
    isShowModalVisible: false,
    accessList: [],
    commentRows: [],
    controlDisabled: true,
    radioSeeValue: 1,
    radioCommentValue: 1,
    isRelvanceModal: false,
    userRelvanceModal: false,
    toInformationTypeId: '', //咨询分类目标id
    leftNum:252,
  },
  subscriptions: {},
  effects: {
    // 添加资讯公告
    *addInformation({ payload, callback }, { call, put, select }) {
      const { data } = yield call(addInformation, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            informationId: data.data.informationId,
          },
        });
        // message.success(data.msg);
        callback && callback(data.data.informationId);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 查询资讯公告
    *getInformation({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getInformation, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            informationType: data.data.list ? data.data.list : [],
            returnCount: data.data.returnCount,
            informationCurrentPage: data.data.currentPage,
          },
        });
        callback && callback(data.data.list);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //查询轮播列表
    *getLoopInformation({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getInformation, payload,'getLoopInformation','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            loopList: data.data.list ? data.data.list : [],
            loopListCount: data.data.returnCount,
            currentLoop: data.data.currentPage,
          },
        });
        callback && callback(data.data.list ? data.data.list : []);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 修改资讯公告
    *updateInformation({ payload, callback }, { call, put, select }) {
      const { data } = yield call(updateInformation, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback(data.code);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 批量删除资讯公告
    *delInformation({ payload, callback }, { call, put, select }) {
      const { data } = yield call(delInformation, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        message.success(data.msg);
        yield put({
          type: 'updateStates',
          payload: {
            selectedRows: [],
            selectedRowKeys: [],
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 移动资讯公告
    *updateInformationMove({ payload, callback }, { call, put, select }) {
      const { data } = yield call(updateInformationMove, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        message.success('移动成功');
        callback && callback(data.code, data.msg);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 批量发布，置顶，轮播资讯公告
    *updateInformationOperation({ payload, callback }, { call, put, select }) {
      const { data } = yield call(updateInformationOperation, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback(data.code);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error('置顶失败');
      }
    },
    //取消发布
    *releaseInformationCancel({ payload, callback }, { call, put, select }){
      const { data } = yield call(releaseInformationCancel, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        callback && callback(data.code);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 添加资讯公告权限
    *addInformationAuthority({ payload, callback }, { call, put, select }) {
      const { data } = yield call(addInformationAuthority, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback(data.code);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 查询资讯公告权限
    *getInformationAuthority({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getInformationAuthority, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        let selectDatas = [];
        let selectedDataIds = [];
        if (data.data.list.length > 0) {
          data.data.list.forEach((item) => {
            if (item.authId != 123123) {
              selectDatas.push({
                nodeId: item.authId,
                nodeName: item.authName,
              });
              selectedDataIds.push(item.authId);
            }
          });
        }
        yield put({
          type: 'updateStates',
          payload: {
            access: data.data.list,
            selectedDatas: selectDatas,
            oldSelectedDatas: selectDatas,
            selectedDataIds: selectedDataIds,
            oldSelectedDataIds: selectedDataIds,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 删除资讯公告权限
    *delInformationAuthority({ payload, callback }, { call, put, select }) {
      const { data } = yield call(delInformationAuthority, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 新增评论或者回复评论
    *addInformationComment({ payload, callback }, { call, put, select }) {
      const { data } = yield call(addInformationComment, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 去评论页面
    *getInformationComment({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getInformationComment, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            comment: data.data,
          },
        });
        callback && callback(data.code);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 查询评论管理列表
    *getInformationCommentList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getInformationCommentList, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            commentLists: data.data.list,
            commentReturnCount: data.data.returnCount,
            commentsCurrent: data.data.currentPage,
          },
        });
        callback&&callback(data.data.list)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 批量删除资讯公告评论
    *delInformationCommentList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(delInformationCommentList, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback(data.code, data.msg);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 添加资讯公告类别
    *addInformationType({ payload, callback }, { call, put, select }) {
      const { data } = yield call(addInformationType, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback(data.code);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 修改资讯公告类别
    *updateInformationType({ payload, callback }, { call, put, select }) {
      const { data } = yield call(updateInformationType, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback(data.code);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 删除资讯公告类别
    *delInformationType({ payload, callback }, { call, put, select }) {
      const { data } = yield call(delInformationType, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback(data.code);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 查询资讯公告类别列表
    *getInformationType({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getInformationType, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        let informationTypeList = [];
        data.data.list.forEach((item) => {
          informationTypeList.push({
            title: item.informationTypeName,
            key: item.informationTypeId,
            code:item.informationTypeCode,
            children: null,
          });
        });
        yield put({
          type: 'updateStates',
          payload: {
            informationTypeLists: data.data.list,
            informationTypeList: data.data.list.length
              ? informationTypeList
              : [],
            defaultTypeId: data.data.list.length
              ? data.data.list[0].informationTypeId
              : '',
          },
        });
        callback &&
          callback(
            data.data.list.length ? data.data.list[0].informationTypeId : '',
          );
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      } else {
        message.warning('没有数据');
      }
    },
    // 资讯公告轮播排序
    *upInformationLoopList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(upInformationLoopList, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 上传文件
    *uploadFile({ payload, callback }, { call, put, select }) {
      const { data } = yield call(uploadFile, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            fileStorageIds: data.data,
          },
        });
        callback && callback(data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 查询某一个资讯公告
    *getSomeoneInformation(
      { payload, callback, query },
      { call, put, select },
    ) {
      const { data } = yield call(getSomeoneInformation, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            informations: data.data,
            informationTexts: data.data.informationText,
            fileStorageIds: data.data.fileStorageId,
          },
        });
        callback && callback(data.data.fileStorageId);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 获取下载地址url
    *getDownloadFileUrl({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getDownloadFileUrl, payload,'','information');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            fileUrl: data.data.fileUrl,
          },
        });
        callback && callback(data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
