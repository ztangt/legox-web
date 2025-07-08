import axios from 'axios';
// import { Toast } from 'antd';
import { env } from '../../project_config/env';
import qs from 'querystring';
const microApp = window.location.hash.split('/')?.[1];
function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  // Toast.fail('服务器异常', 1)
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export default async function request(action, options) {
  if (!window.localStorage.getItem('userToken')) {
    return;
  }
  //环境
  // console.log(`method: ${options.method}`, {action: `${action}`, params: options.body});
  let data = {};
  let response;
  try {
    response = await axios({
      url: `${env}/${action}`,
      ...options,
    });
    checkStatus(response);
    data = await response.data;
  } catch (e) {
    console.log(e);
  }
  // console.log(`RESPONSE:${action}`, data);
  if (data.code == '419' || data.code == '403') {
    //将userToken存入localStorage中
    window.localStorage.setItem('userToken', '');
    //跳转到首页
    location.href = '#/login';
    window.location.reload();
  }else if(data.code == '401'){
    return new Promise(async(resolve, reject) => {
      var refreshTokenTime = window.localStorage.getItem('refreshTokenTime');
      //一分钟之内不在请求auth/login这个接口，直接替换token再次请求
      if (new Date().getTime() - Number(refreshTokenTime) < 1000 * 60){
        await resolveTimeout(100);
        try {
          response = await axios({
            url: `${env}/${action}`,
            ...options,
            headers:{
              ...options.headers,
              'Authorization': 'Bearer '+window.localStorage.getItem('userToken'),
            },
          })
          checkStatus(response);
          data = await response.data;
          resolve({data});
        } catch (e) {
          console.log(e);
          reject(e)
        }
      }else{
        //refreshTokenTime放在前面避免等待的时候其他接口也请求login
        window.localStorage.setItem('refreshTokenTime', new Date().getTime());
        var refreshToken = window.localStorage.getItem('refreshToken');
        let loginPayload = {
          clientType: 'PC',
          grantType: 'refresh_token',
        };
        loginPayload.refreshToken =  refreshToken;
        //请求login
        let loginOptions = {
          method: 'POST',
        };
        loginOptions.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          "TL-micro-app":microApp
        };
        loginOptions.body = qs.stringify(loginPayload);
        loginOptions.data = loginPayload;
        await request('auth/login', loginOptions).then(async(reData)=>{
          if(reData.data.code == 200){
            const reUserToken = reData.data.data.userToken;
            window.localStorage.setItem('userToken', reUserToken);
            window.localStorage.setItem(
              'refreshToken',
              reData.data.data.refreshToken,
            );
            try {
              response = await axios({
                url: `${env}/${action}`,
                ...options,
                headers:{
                  ...options.headers,
                  'Authorization': 'Bearer '+window.localStorage.getItem('userToken'),
                },
              })
              checkStatus(response);
              data = await response.data;
              resolve({data});
            } catch (e) {
              console.log(e);
              reject(e)
            }
          }else{
            resolve({reData});
          }
        })
      }
    })
  }
  return { data };
}
function resolveTimeout( delay) {
  return new Promise((resolve) => setTimeout(() => resolve(), delay));
}
