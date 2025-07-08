import { history } from 'umi';
import apis from 'api';
import { message } from 'antd';
const Model = {
  namespace: 'importAccredit',
  state: {
    step:1,
    uploadUserInfo:[]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
      })
    }
  },
  effects: {
    //是否授权
    *isExistLicense({payload,callback}, { call, put }) {
      const {data} = yield call(apis.isExistLicense, payload,'','importAccredit');
      if(data.code==200){
        if(typeof callback=='function'){
          callback(data.data)
        }
      }else if(data.code!=401){
        message.error(data.msg);
      }
    },
    //上传文件
    *uploadFile({payload,callback}, { call, put }) {
      const {data} = yield call(apis.uploadCloudFile, payload,'','importAccredit');
      if(data.code==200){
        message.success('上传成功');
        if(typeof callback=='function'){
          callback(data.data)
          // callback({
          //   "authInfo": {
          //     "tenantNum": 99,
          //     "telPhone": "18515130838",
          //     "authStartTime": "0",
          //     "authExpiryTime": "0",
          //     "cloudId": "1594606156179939329",
          //     "userAccount": "8603"
          //   },
          //   "importResult": true
          // });
        }
      }else if(data.code!=401){
        message.error(data.msg);
      }
    }
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
export default Model;
