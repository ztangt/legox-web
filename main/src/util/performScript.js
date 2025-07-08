import _ from 'lodash';
// import { fetch as DvaFetch } from 'dva';
import { env } from '../../../project_config/env';

export const fetchResource = url => {
  return fetch(url,
    {headers:{
      'Cache-control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 0
    }}).then(async res => {
    return await res.text();
  });
};

export const getCleanScript = script => {
  return String(script).slice(script.indexOf(';') + 1, -2);
};

// 获取脚本列表
export const fetchedScriptList = async (scriptUrlList = []) => {
  if (Array.isArray(scriptUrlList) && scriptUrlList.length === 0) {
    return [];
  }

  let list = scriptUrlList.filter(i => i);

  return await Promise.all(list.map(async item => await fetchResource(item)));
};

// 执行js脚本
export const performScriptForFunction = scriptText => {
  if (!scriptText) {
    return;
  }

  let text = `return ${scriptText}()`;

  return new Function(text);
};

export const scriptEvent = async scriptUrlList => {
  const fnList = await fetchedScriptList(scriptUrlList);
  return fnList;

  // let resFn = [];

  // if (fnList.length > 0) {
  //   // 遍历脚本列表
  //   for (let i = 0; i < fnList.length; i++) {
  //     let fn = performScriptForFunction(fnList[i]);
  //     resFn.push(fn);
  //   }
  // }

  // return resFn;
};

export const fetchAPI = async (url, options) => {
  let res = await fetch(`${env}/${url}`, options);

  if (res.status >= 200 && res.status < 300) {
    let data = await res.json();

    if (data.code === '401') {
      //跳转到首页
      window.location.href = '#/login';
      window.localStorage.setItem('userToken', '');
    }

    return data;
  }

  return res;
};
