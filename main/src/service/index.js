/**
 * request统一拼装，参数拼装
 */
import api from './api';
import request from './request';
import { cloneDeep, isEmpty } from 'lodash';
import pathToRegexp from 'path-to-regexp';
import qs from 'querystring';
import { getKeyValue } from '../util/util';
const microApp = 'support';
//401刷新userToken的操作
// const refreshTokenFn = (typeName, namespace, payload, key,extralParams={}) => {
//   //没有在call请求加入namespace参数则取pathname(model中pathname与namespace相同的时候可以不传)
//   if (typeof namespace == 'undefined') {
//     const arrPathName = history.location.pathname.includes('/support')?history.location.pathname.split('/support'):history.location.pathname.split('/');
//     console.log('arrPathName=', arrPathName);
//     if (arrPathName && arrPathName.length == 2) {
//       namespace = arrPathName[1];
//     }
//   }
//   //没有在call请求加入typeName参数则取api的键(model中effects函数名与typeName相同的时候可以不传)
//   if (typeof typeName == 'undefined' || !typeName) {
//     typeName = key;
//   }
//   const dispatch = getDvaApp()._store.dispatch;
//   //挂起等待更新userToken(保存在ACTIONS401)
//   console.log('ACTIONS401=', ACTIONS401);
//   if(namespace){//有的model的401单独写了，就不需要放在这了
//     ACTIONS401.push({
//       namespace,
//       typeName,
//       payload,
//       extralParams
//     });
//   }
//   console.log('STATE401=', STATE401);
//   //获取上次刷新usertoken的时间，如果在一分钟之内则不请求刷新请求，直接再次请求401的接口
//   var refreshTokenTime = window.localStorage.getItem('refreshTokenTime');
//   if (window.location.href.includes('/cloud/applyConfig')||window.location.href.includes('/cloud/designer/formDesigner')) {

//     var teantToken = window.localStorage.getItem('teantToken');
//     var tokenArr = JSON.parse(teantToken || '[]');
//     var curTeantToken =
//       _.find(tokenArr, { tenantId: getQuery().tenantId }) || {}; //查找当前点击的租户token信息
//       refreshTokenTime = curTeantToken?.refreshTokenTime
//   }
//   if (new Date().getTime() - Number(refreshTokenTime) < 1000 * 60) {

//     //开始请求挂起的action
//     ACTIONS401.map(item => {
//       dispatch({
//         type: `${item.namespace}/${item.typeName}`,
//         payload: item.payload,
//         ...item.extralParams
//       });
//     });
//     ACTIONS401 = [];
//   } else if (!STATE401) {

//     STATE401 = true;
//     let loginPayload = {
//       clientType: 'PC',
//       grantType: 'refresh_token',
//     };
//     var refreshToken = window.localStorage.getItem('refreshToken');
//   if (window.location.href.includes('/cloud/applyConfig')||window.location.href.includes('/cloud/designer/formDesigner')) {
//       var teantToken = window.localStorage.getItem('teantToken');
//       var tokenArr = JSON.parse(teantToken || '[]');
//       var curTeantToken =
//         _.find(tokenArr, { tenantId: getQuery().tenantId }) || {}; //查找当前点击的租户token信息
//       refreshToken = curTeantToken?.refreshToken || '';
//       loginPayload.tenantId = curTeantToken?.tenantId || '';
//       loginPayload.clientType = 'CLOUD';
//     }
//     loginPayload.refreshToken = refreshToken;
//     let options = {
//       method: 'POST',
//     };
//     options.headers = {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       "TL-micro-app":microApp
//     };
//     options.body = qs.stringify(loginPayload);
//     options.data = loginPayload;
//     const returnData = request('auth/login', options);
//     returnData.then(reData => {
//       console.log('reData=', reData);
//       if (reData.data.code == 200) {
//         const reUserToken = reData.data.data.userToken;
//       if (window.location.href.includes('/cloud/applyConfig')||window.location.href.includes('/cloud/designer/formDesigner')) {
//           var curTeantTokenIndex = _.findIndex(tokenArr,{tenantId: getQuery().tenantId}) //查找当前点击的租户token信息

//           if(curTeantTokenIndex!=-1){
//             tokenArr[curTeantTokenIndex]['refreshTokenTime'] = new Date().getTime()
//             tokenArr[curTeantTokenIndex]['userToken'] = reUserToken
//             tokenArr[curTeantTokenIndex]['refreshToken'] = reData.data.data.refreshToken
//           }
//           localStorage.setItem('teantToken',JSON.stringify(tokenArr))
//         }else{
//           window.localStorage.setItem('refreshTokenTime', new Date().getTime());
//           window.localStorage.setItem('userToken', reUserToken);
//           window.localStorage.setItem(
//             'refreshToken',
//             reData.data.data.refreshToken,
//           );
//         }
//         console.log('ACTIONS401=', ACTIONS401);
//         //开始请求挂起的action
//         ACTIONS401.map(item => {
//           dispatch({
//             type: `${item.namespace}/${item.typeName}`,
//             payload: item.payload,
//             ...item.extralParams
//           });
//         });
//         ACTIONS401 = [];
//         STATE401 = false;
//       } else {
//         ACTIONS401 = [];
//         STATE401 = false;
//         message.error(reData.data.msg);
//         if(reData.data.code == 419||reData.data.code == 403){
//           //刷新token有错误直接登出
//           if (window.location.href.includes('portal')) {
//             location.href = '#/portalLogin'
//           } else {
//             location.href = '#/login'
//           }
//           window.localStorage.setItem('userToken', '');
//         }
//       }
//     });
//   }
// };
const gen = (apiName, key) => {
  /**
   * payload  参数
   * typeName model中effects函数名与typeName相同的时候可以不传
   * namespace  model命名空间
   * serviceName 微服务名
   * 
   */
  return function(payload, typeName, namespace,extralParams,serviceName) {
    //有的接口请求需要自定义header的一部分内容
    let cutomHeaders = payload?.headers || {};
    payload?.headers && delete payload.headers;
    const apiArray = apiName.split(' ');

    let method = 'GET'; //请求方式默认值

    let action = apiName;
    if (apiArray.length > 1) {
      method = apiArray[0];
      action = apiArray[1];
    }
    const actionArray = apiArray[1].split('/');
    if (actionArray.length > 0 && serviceName) {
      //替换微服务名
      // actionArray[0] = serviceName
      // action = actionArray.toString().replaceAll(',','/');
      action = action.replace(actionArray[0], serviceName);
    }
    //处理action和参数
    const clonePayload = cloneDeep(payload);
    const match = pathToRegexp.parse(action);
    action = pathToRegexp.compile(action)(payload);

    for (const item of match) {
      if (item instanceof Object && item.name in clonePayload) {
        delete clonePayload[item.name];
      }
    }
    let options = {
      method,
    };
    const storage = window.localStorage;

    if (method === 'GET') {
      if (action == 'sys/tenant/mark' || action == 'sys/tenant/config/login') {
        options.headers = {
          "TL-micro-app":microApp,
        };
      } else {
        options.headers = {
          Authorization: 'Bearer ' + storage.userToken,
          "TL-micro-app":microApp
        };
      }

      if (clonePayload && clonePayload.pageInfo) {
        clonePayload['pageInfo'] = JSON.stringify(clonePayload.pageInfo);
      }
      action = `${action}${isEmpty(clonePayload) ? '' : '?'}${qs.stringify(
        clonePayload,
      )}`;
      options.params = {}

    } else {
      options.body = qs.stringify(clonePayload);
      options.data = clonePayload

      if (action == 'auth/login') {
        options.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
        };
      } else if (action == 'report/print/dataset/create/java-class') {
        options.headers = {
          Authorization: 'Bearer ' + storage.userToken,
          'Content-Type': 'application/json',
          "TL-micro-app":microApp
        };
        options.body = payload;
        console.log('options.body', options.body);
      }else if(method === 'POST' && action == 'report/apiManage/api'){
        options.headers = {
          Authorization: 'Bearer ' + storage.userToken,
          'Content-Type': 'application/json',
          "TL-micro-app":microApp
        };
        options.body = payload;
      }else if((method === 'POST'||method === 'PUT') && action == 'sys/button'){
          options.headers = {
            Authorization: 'Bearer ' + storage.userToken,
            'Content-Type': 'application/json',
            "TL-micro-app":microApp
          };
          options.body = payload;
      }
       else {
        var userToken = storage.userToken;
        options.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + userToken,
          "TL-micro-app":microApp
        };
      }
    }
  if (window.location.href.includes('/cloud/applyConfig')||window.location.href.includes('/cloud/designer/formDesigner')) {
      var userToken = storage.userToken_cloud;
      var teantToken = window.localStorage.getItem('teantToken_cloud');
      var tokenArr = JSON.parse(teantToken || '[]');
      var curTeantToken =
        _.find(tokenArr, { tenantId: getKeyValue('tenantId') }) || {}; //查找当前点击的租户token信息
      userToken = curTeantToken?.userToken || '';
      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + userToken,
      };
    }
    const buttonId =
    window.localStorage.getItem('currentButtonId') || '';
    let maxDataruleCode = '';
    let menuId = '';
    let activeNode = document.getElementById(`dom_container`)?.getElementsByClassName('ant-tabs-tab-active')?.[0]||"";
    if(activeNode){
      menuId =  activeNode?.getElementsByClassName('menu_lable')[0]?.getAttribute('menuId')||'';
      maxDataruleCode = activeNode?.getElementsByClassName('menu_lable')[0]?.getAttribute('maxDataruleCode')||'';
    }
    options.headers = {
      menuId,
      Datarulecode: maxDataruleCode, //放到上面，应为有的接口需要自定义dataRuleCode
      buttonId,
      ...options.headers,
      ...cutomHeaders//有的接口需要自定义header部分内容
    };
    const returnData = request(action, options);
    return returnData;
  };
};
const apis = {};
for (const key in api) {
  apis[key] = gen(api[key], key);
}
let apiNames = Object.keys(api);
// console.log(apis,apis);
// apiNames.map((name, index)=>[gen(api[name]))
export default apis;
