import { message } from 'antd';
import apis from 'api';
export default {
  namespace: 'boxUploadfile',
  state: {
  },
  subscriptions: {},
  effects: {
    // 根据文件md5查询是否存在该文件
    *getFileMD5(
      {payload,callback,nextState},{ call, put, select },
    ) {
      const { data } = yield call(
        apis.getFileMD5,
        payload
      );
      if (data.code == 200) {
        callback(data.data, payload, nextState)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //文件预上传
    *presignedUploadUrl(
      {payload,callback,nextState},
      { call, put },
    ) {
      const { data } = yield call(
        apis.presignedUploadUrl,
        payload
      );
      if (data.code == 200) {
        callback(data.data, payload?.file, nextState)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 根据文件路径合并文件
    *getFileMerage(
      {payload,callback,nextState},
      { call, put, select },
    ) {
      const { data } = yield call(
        apis.getFileMerage,
        payload
      );
      if (data.code == 200) {
        callback(data.data, nextState)
      }  else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //存储文件信息到数据库接口
    *storingFileInformation(
      {payload,callback,nextState},
      { call, put, select },
    ) {
      const { data } = yield call(
        apis.storingFileInformation,
        payload
      );
      if (data.code == 200) {
        callback(payload, data.data, nextState)
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
