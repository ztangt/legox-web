import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
  namespace: 'sceneConfig', //命名空间
  state: {
    modalTitle: '',
    allPage: 0,
    currentPage: 1,
    returnCount: 0,
    limit: 10,
    tableData: [],
    searchWord: '',
    isShowAddModal: false,
    paramsData: [],
    selectedRowKeys: [],
    detailData: {},
    selectedRowIds: [],
    paramsDataOther: [],
    selectedRowKeysOther: [],
    //////////
    minioTureLogo: '',
    minioTureBack: '',
    minioFalseLogo: '',
    minioFalseBack: '',
    uploadFlag: true, //上传暂停器
    nowMessage: '', //提示上传进度的信息
    md5: '', //文件的md5值，用来和minio文件进行比较
    fileChunkedList: [], //文件分片完成之后的数组
    fileName: '', //文件名字
    fileNames: '', //文件前半部分名字
    fileStorageId: '', //存储文件信息到数据库接口返回的id
    typeNames: '', //文件后缀名
    optionFile: {}, //文件信息
    fileSize: '', //文件大小，单位是字节
    getFileMD5Message: {}, //md5返回的文件信息
    success: '', //判断上传路径是否存在
    v: 1, //计数器
    needfilepath: '', //需要的minio路径
    isStop: true, //暂停按钮的禁用
    isContinue: false, //继续按钮的禁用
    isCancel: false, //取消按钮的禁用
    index: 0, //fileChunkedList的下标，可用于计算上传进度
    merageFilepath: '', //合并后的文件路径
    typeName: '', //层级
    fileExists: '', //判断文件是否存在于minio服务器中，相关modal中监听判断fileExists状态进行后续分别操作
    md5FileId: '', //md5查询到的文件返回的id
    md5FilePath: '', //md5查询到的文件返回的pathname
    uploadType: '',
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen(location => {
        // if (location.pathname === '/sceneConfig') {
        //   dispatch({
        //     type: 'updateStates',
        //     payload: {
        //       pathname: location.pathname,
        //     },
        //   });
        // }
      });
    },
  },
  effects: {
    //获取单场景
    *getSceneSingle({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getSceneSingle, payload);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            detailData: data.data
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //新增
    *addScene({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.addScene, payload);
      if (data.code == REQUEST_SUCCESS) {
        const { searchWord, currentPage, limit } = yield select(
          state => state.sceneConfig,
        );
        yield put({
          type: 'getSceneList',
          payload: {
            start: currentPage,
            limit,
            searchWord,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //修改
    *updateScene({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.updateScene, payload);
      if (data.code == REQUEST_SUCCESS) {
        const { searchWord, currentPage, limit } = yield select(
          state => state.sceneConfig,
        );
        yield put({
          type: 'getSceneList',
          payload: {
            start: currentPage,
            limit,
            searchWord,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //启用停用
    *sceneEnable({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.sceneEnable, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success(payload.isEnable ? '启用成功' : '停用成功')
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //删除接口
    *delScene({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.delScene, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success('删除成功')
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取下载地址url
    *getDownFileUrl({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDownFileUrl, payload);
      const { detailData } = yield select(state => state.sceneConfig);
      if (data.code == REQUEST_SUCCESS) {
        detailData['firstLogoUrl'] = data.data.fileUrl;
        yield put({
          type: 'updateStates',
          payload: {
            detailData,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //列表
    *getSceneList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getSceneList, payload);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            tableData: data.data.list,
            returnCount: data.data.returnCount,
            currentPage: data.data.currentPage,
          },
        });
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
