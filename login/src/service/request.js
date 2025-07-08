import axios from 'axios';
// import { Toast } from 'antd';
import { env } from '../../../project_config/env';
import querystring from 'querystring';
// import { EndOfLineState } from 'typescript';
// import { request } from '@@/plugin-request'

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

  //环境
  // console.log(`method: ${options.method}`, {action: `${action}`, params: options.body});
  let data={};
  let response;
  if(action=='sys/tenant/license/update'){
    const formdata = new FormData();
    let fileField = document.querySelector("input[type='file']");
    formdata.append('file', fileField.files[0]);
    options = {
      method:'PUT',
      headers:{
        'Authorization': 'Bearer '+window.localStorage.getItem('userToken'),
      },
      body:formdata
    }
  }

  try {
    
    // if(options.method=='GET'){
    //   response = await axios.get(
    //     `${env}/${action}`,options
    //   )
    // }else {
    //   const paramsData = options.data
    //   delete options.data
    //   delete options.body
    //   if(options.method=='POST'){
    //     response = await axios.post(`${env}/${action}`,paramsData,options)
    //   }else if(options.method=='DELETE'){
    //     response = await axios.delete(`${env}/${action}`,paramsData,options)
    //   }else if(options.method=='PUT'){
    //     response = await axios.put(`${env}/${action}`,paramsData,options)
    //   }
    // }

    response = await axios({
      url: `${env}/${action}`,
      ...options,
    })
    checkStatus(response);
    data =  response.data
  } catch (e) {
    console.log(e);
  }
  // console.log(`RESPONSE:${action}`, data);
  if((data.code=='419'||data.code=='403')&&window.localStorage.getItem('unset')!='true'&&!location.href.includes('jumpPage')){//jumpage页面419时就不跳转登陆页面了
    //将userToken存入localStorage中
    // window.localStorage.setItem("userToken",'');
    //跳转到首页
    //跳转到首页
    if(window.location.href.includes('portal')){
      location.href = '#/portalLogin'
    }else{
      location.href = '#/login';
    }
    window.localStorage.setItem('userToken', '');
    // window.location.reload();
  }
  return {data};

 }
