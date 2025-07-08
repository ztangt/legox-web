// import { Toast } from 'antd';
import { env } from '../../../project_config/env';
import querystring from 'querystring';
import { isArray,cloneDeep } from 'lodash';
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

export default async function request(apiName, body) {
    const storage = window.localStorage;
    const apiArray = apiName.split(' ');
    let method = 'POST';//请求方式默认值
    let action = apiName;
    if(apiArray.length>1){
      method = apiArray[0];
      action = apiArray[1];
    }

    let data={};
    let response;
    let options={
        method:method,
        headers: {
           // 'content-type': `multipart/form-data`,
              'Authorization': 'Bearer '+storage.userToken_cloud,
        },
        body:body,
    }
    try {
        response = await fetch(`${env}/${action}`, options);
        checkStatus(response);
        data = await response.json();
    } catch (e) {
        console.log(e);
    }

    if(data.code=='401'){
        //将userToken存入localStorage中
        window.localStorage.setItem("userToken_cloud",'');
        //跳转到首页
        location.href='#/login';
    }
    return {data};
 }
