import { history } from 'umi';
import apis from 'api';
import { message,notification } from 'antd';
import { REQUEST_SUCCESS } from '../service/constant'
import { parse } from 'query-string';

const Model = {
  namespace: 'user',
  state: {
    curUserInfo:[]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        console.log('history',history,location);
        const query = parse(history.location.search);

        if(!window.localStorage.getItem('userToken_cloud')&&history.location.pathname!='/'){
          // history.push('/login')
        }

        if(window.location.href.includes('/login'&&!window.location.hash.includes('cloud'))){
            localStorage.clear() //防止其他租户的信息还在
        }
      //   else if(localStorage.getItem('clientType')=='PC'&&!(window.location.href.includes('/cloud/applyConfig')||window.location.href.includes('/cloud/designer/formDesigner'))){//当前存
      //     dispatch({
      //       type: 'login',
      //       payload: {
      //         clientType: 'CLOUD',
      //         grantType: 'refresh_token'
      //       }
      //     })
      //   }
      })
    }
  },
  effects: {
    //获取当前用户的信息
    *getCurrentUserInfo({payload}, { call, put }) {
      const {data} = yield call(apis.getCurrentUserInfo, payload,'','user');
      if(data.code==REQUEST_SUCCESS){
        yield put({
          type:'updateStates',
          payload:{
            curUserInfo:data.data
          }
        })
        window.localStorage.setItem('userName_cloud',payload.data.data.userName);

      }else if(data.code!=401){
        message.error(data.msg);
      }
    },
    //登录
    *login({payload,callback}, { call, put }) {
      payload.grantType=(window.location.href.includes('/cloud/applyConfig')||window.location.href.includes('/cloud/designer/formDesigner'))?'refresh_token':'password';
      const {data} = yield call(apis.login, payload,'','user');
      const query = parse(history.location.search);
      if(data.code==REQUEST_SUCCESS){
        //将userToken存入localStorage中
        window.localStorage.setItem("clientType_cloud",data.data.clientType);
        if((window.location.href.includes('/cloud/applyConfig')||window.location.href.includes('/cloud/designer/formDesigner'))){
          var teantToken = window.localStorage.getItem("teantToken_cloud")
          var tokenArr = JSON.parse(teantToken||'[]') 
          var curTeantTokenIndex = _.findIndex(tokenArr,{tenantId: query.tenantId}) //查找当前点击的租户token信息
          var curTeantToken = {
              userToken:data.data.userToken,
              refreshToken: data.data.refreshToken,
              refreshTokenTime: 0,
              tenantId: query.tenantId
          }
          if(curTeantTokenIndex!=-1){
            tokenArr[curTeantTokenIndex] = curTeantToken
          }else{
            tokenArr?.push(curTeantToken)
          }
          localStorage.setItem('teantToken_cloud',JSON.stringify(tokenArr))
          return
        }
        window.localStorage.setItem("userToken_cloud",data.data.userToken);
        window.localStorage.setItem("refreshToken_cloud",data.data.refreshToken);
        window.localStorage.setItem("refreshTokenTime_cloud",0);
        window.localStorage.setItem('userAccount_cloud',payload.oldUserAccount);
        //获取用户信息
        // yield put({
        //   type:'getCurrentUserInfo',
        //   payload:{

        //   }
        // })
        //跳转
        callback&&callback();
        location.href='#/';
      }else if(data.code!=401){
        message.error(data.msg,5)
      }
    },
    //登出
    *logout({payload}, { call, put }) {
      const {data} = yield call(apis.logout, payload,'','user');
      if(data.code==REQUEST_SUCCESS){
        //将userToken存入localStorage中
        window.localStorage.setItem("userToken_cloud",'');
        window.localStorage.setItem("selfLogin_cloud",'0')
        //跳转到首页
        location.href='#/login';
      }else if(data.code!=401){
        message.error(data.msg,5)
      }
    },
    *updatePassword({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.updatePassword, payload);
        if (data.code == 200) {
          notification['success']({
            message: '提示',
            description: <span>密码修改成功,3秒后将自动跳转登录页面!</span>,
            duration: 3
          });
          setTimeout(() => {
            location.href = '#/login'
          },3000)


        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
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
export default Model;
