import {message} from 'antd';
import apis from 'api';
const limit=10;
export default {
  namespace: 'accreditLook',
  state: {
    searchWord:'',
    returnCount:0,
    currentPage:1,
    menus:[],
    registerList:[],
    leftNum:200,
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      // history.listen(location => {
      //   if (history.location.pathname === '/accreditLook') {
      //   }
      // });
    }
  },
  effects: {
    //获取注册系统列表
    *getRegister({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.getRegister, payload);
      if(data.code==200){
        yield put({
          type:"updateStates",
          payload:{
            registerList:data.data.list.filter(item=>item.createUserId=='1')//只展示初始注册系统
          }
        })
        callback(data.data.list)
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取菜单
    *getTenantLicense({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.getTenantLicense, payload);
      if(data.code==200){
        // yield put({
        //   type:"updateStates",
        //   payload:{
        //     menus:data.data.ability
        //   }
        // })
        callback&&callback(data.data.ability?data.data.ability:[])
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //上传文件
    *updateLicense({payload,callback}, { call, put }) {
      const {data} = yield call(apis.updateLicense, payload);
      if(data.code==200){
        message.success('上传成功');
        if(typeof callback=='function'){
          callback();
        }
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
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
