import { message } from 'antd';
import apis from 'api';
export default {
  namespace: 'personInfo',
  state: {
    userInfo: {},
    minioTurePicture: '',
    minioTureSignature: '',
    minioFalsePicture: '',
    minioFalseSignature: '',
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
    uploadType:''
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        // if (location.pathname === '/personInfo') {
        //   dispatch({
        //     type: 'getCurrentUserInfo'
        //   })
        // }
      });
    },
  },
  effects: {
    //获取登录用户信息
    *getCurrentUserInfo({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getCurrentUserInfo, payload,'getCurrentUserInfo','personInfo');
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            userInfo: data.data,
          }
        })
        yield put({
          type: 'user/updateStates',
          payload: {
            curUserInfo: data.data,
          },
        });
        window.localStorage.setItem('userInfo', JSON.stringify(data.data));
        window.localStorage.setItem('userName', data.data.userName);
        window.localStorage.setItem('orgRefUserId', data.data.orgRefUserId); //岗人ID
        window.localStorage.setItem('identityId', data.data.identityId); //岗人ID
        window.localStorage.setItem('pwdChangeTime', data.data.pwdChangeTime); //密码修改时间
        window.localStorage.setItem('isMergeTodo', data.data.isMergeTodo); //待办数据
        window.localStorage.setItem('pwdExprTime', data.data.pwdExprTime); //密码失效日期
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *updateUser({ payload }, { call, put, select }) {
      const { data } = yield call(apis.updateUser, payload,'updateUser','personInfo');
      if (data.code == 200) {
        message.success('修改成功！')
        yield put({
          type: 'getCurrentUserInfo',
          payload: {
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *uploadFile({ payload, callback }, { call, put, select }) {
      console.log('uploadFile');
      console.log(payload);
      const { data } = yield call(apis.uploadFile, payload);
      if (data.code == 200) {
        callback && callback(data.data)
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *presignedUploadUrl({ payload, callback }, { call, put, select }) {//预上传
      const { data } = yield call(apis.presignedUploadUrl, payload);
      if (data.code == 200) {
        callback && callback(data.data.presignedUploadUrl)
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取头像下载地址url
    *getPictureDownFileUrl({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDownFileUrl, payload,'getPictureDownFileUrl','personInfo');
      const { userInfo } = yield select(state => state.personInfo);
      if (data.code == 200) {
        // let userInfos = {};
        userInfo['picturePath'] = data.data.fileUrl
        yield put({
          type: 'updateStates',
          payload: {
            userInfo
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取签名下载地址url
    *getSignatureDownFileUrl({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDownFileUrl, payload,'getSignatureDownFileUrl','personInfo');
      const { userInfo } = yield select(state => state.personInfo);
      if (data.code == 200) {
        // let userInfos = {};
        userInfo['signaturePath'] = data.data.fileUrl
        yield put({
          type: 'updateStates',
          payload: {
            userInfo
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
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
