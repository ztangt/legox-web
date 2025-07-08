/**
 * request统一拼装，参数拼装
 */
import { message } from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
import pathToRegexp from 'path-to-regexp';
import qs from 'querystring';
import { getDvaApp, history } from 'umi';
import api from './api';
import request from './request';
// import { sm2 } from 'sm-crypto';
const microApp = window.location.hash.split('/')?.[1];
//401刷新userToken的操作
// const refreshTokenFn = (typeName, namespace, payload, key) => {
//   //没有在call请求加入namespace参数则取pathname(model中pathname与namespace相同的时候可以不传)
//   if (typeof namespace == 'undefined') {
//     const arrPathName = history.location.pathname.split('/');
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
//   ACTIONS401.push({
//     namespace,
//     typeName,
//     payload,
//   });
//   console.log('STATE401=', STATE401);
//   //获取上次刷新usertoken的时间，如果在一分钟之内则不请求刷新请求，直接再次请求401的接口
//   const refreshTokenTime = window.localStorage.getItem('refreshTokenTime');
//   if (new Date().getTime() - refreshTokenTime < 1000 * 60) {
//     //开始请求挂起的action
//     ACTIONS401.map((item) => {
//       dispatch({
//         type: `${item.namespace}/${item.typeName}`,
//         payload: item.payload,
//       });
//     });
//     ACTIONS401 = [];
//   } else if (!STATE401) {
//     STATE401 = true;
//     let loginPayload = {
//       clientType: 'PC',
//       grantType: 'refresh_token',
//     };
//     loginPayload.refreshToken = window.localStorage.getItem('refreshToken');
//     let options = {
//       method: 'POST',
//     };
//     options.headers = {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'TL-micro-app': microApp,
//     };
//     options.body = qs.stringify(loginPayload);
//     options.data = loginPayload;
//     const returnData = request('auth/login', options);
//     returnData.then((reData) => {
//       console.log('reData=', reData);
//       if (reData.data.code == 200) {
//         const reUserToken = reData.data.data.userToken;
//         window.localStorage.setItem('userToken', reUserToken);
//         window.localStorage.setItem(
//           'refreshToken',
//           reData.data.data.refreshToken,
//         );
//         window.localStorage.setItem('refreshTokenTime', new Date().getTime());
//         console.log('ACTIONS401=', ACTIONS401);
//         //开始请求挂起的action
//         ACTIONS401.map((item) => {
//           dispatch({
//             type: `${item.namespace}/${item.typeName}`,
//             payload: item.payload,
//           });
//         });
//         ACTIONS401 = [];
//         STATE401 = false;
//       } else {
//         ACTIONS401 = [];
//         STATE401 = false;
//         message.error(reData.data.msg);
//       }
//     });
//   }
// };
const gen = (apiName, key) => {
  return function (payload, typeName, namespace) {
    let cutomHeaders = payload?.headers || {};
    payload?.headers && delete payload.headers;
    const apiArray = apiName.split(' ');
    let method = 'GET'; //请求方式默认值
    let action = apiName;
    if (apiArray.length > 1) {
      method = apiArray[0];
      action = apiArray[1];
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
          'TL-micro-app': microApp,
        };
      } else {
        options.headers = {
          Authorization: 'Bearer ' + storage.userToken,
          'TL-micro-app': microApp,
          ...cutomHeaders,
        };
      }

      if (clonePayload && clonePayload.pageInfo) {
        clonePayload['pageInfo'] = JSON.stringify(clonePayload.pageInfo);
      }
      action = `${action}${isEmpty(clonePayload) ? '' : '?'}${qs.stringify(
        clonePayload,
      )}`;
      options.params = {};
    } else {
      options.body = qs.stringify(clonePayload);
      options.data = clonePayload;

      if (action == 'auth/login') {
        options.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          'TL-micro-app': microApp,
        };
      } else if (action == 'public/fileStorage/uploaderFile') {
        options.headers = {
          Authorization: 'Bearer ' + storage.userToken,
          'TL-micro-app': microApp,
          // 'Content-Type': 'application/json'
        };
        options.body = payload;
      } else if (action == 'bpm/sign/batch') {
        options.headers = {
          Authorization: 'Bearer ' + storage.userToken,
          'Content-Type': 'application/json',
          'TL-micro-app': microApp,
        };
        options.body = payload;
      } else {
        options.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + storage.userToken,
          'TL-micro-app': microApp,
          ...cutomHeaders,
        };
      }
    }

    //修改maxDataruleCode的获取方式
    const maxDataruleCode =
      window.localStorage.getItem('maxDataruleCode') || '';
    // if (maxDataruleCode) {
    options.headers = {
      ...options.headers,
      Datarulecode: maxDataruleCode,
    };
    // }
    const returnData = request(action, options);
    // returnData.then((data) => {
    //   if (data.data.code == '401') {
    //     refreshTokenFn(typeName, namespace, payload, key);
    //   }
    // });
    return returnData;
  };
};
const apis = {};
for (const key in api) {
  apis[key] = gen(api[key], key);
}
let apiNames = Object.keys(api);
// apiNames.map((name, index)=>[gen(api[name]))
export default apis;
