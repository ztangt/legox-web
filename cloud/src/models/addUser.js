import { ApartmentOutlined,AppstoreOutlined,BankOutlined} from '@ant-design/icons';
import {message,} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS,NODE_TYPE } from '../service/constant';
import uploader from '../service/uploaderRequest';
export default {
  namespace: 'addUser',
  state: {
    signImageUrl:'',//手写签批头像
    imageUrl:'',//头像
    doImgUploaderId:'',//头像Id
    signDoImgUploaderId:'',//手写签批Id
    picUrl:{},
    uploadType:'',
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
     minioTurePicture:'',
     minioTureSignature:'',
     minioFalsePicture:'',
     minioFalseSignature:'',
     ///////////
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
          dispatch({
            type:'updateStates',
            payload:{
              currentPathname: history.location.pathname
            }
          })
      });
    }
  },
  effects: {
    //获取上传的 图片路径
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
    //上传
    *uploader({ payload,callback }, { call, put, select }) {
        try {
          let action = "POST sys/fileStorage/uploaderFile";
          uploader(action,payload).then(data => {
            if(data.data.code==REQUEST_SUCCESS){
              callback&&callback(data.data.data);
            }else{
              message.error(data.data.msg,5)
            }
          })
        } catch (e) {
          console.log('e',e)
        } finally {
        }
  
      },
      
            //获取头像下载地址url
    *getPictureDownFileUrl({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDownFileUrl, payload);
      const { picUrl } = yield select(state => state.addUser);
      if (data.code == 200) {
        picUrl['picturePath'] = data.data.fileUrl
        yield put({
          type: 'updateStates',
          payload: {
              picUrl
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取签名下载地址url
    *getSignatureDownFileUrl({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDownFileUrl, payload);
      const { picUrl } = yield select(state => state.addUser);
      if (data.code == 200) {
        picUrl['signaturePath'] = data.data.fileUrl
        yield put({
          type: 'updateStates',
          payload: {
              picUrl
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
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
