import { message } from 'antd';
import apis from 'api';
import { CHUNK_SIZE, REQUEST_SUCCESS } from '../service/constant';
export default {
  namespace: 'wangeditor',
  state: {
    getFileMD5Message: {}, //md5返回的文件信息
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
  },
  subscriptions: {},
  effects: {
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