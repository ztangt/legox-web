import _ from 'lodash'
export const fetchResource = (url) => {
  return fetch(url).then(async (res) => {
    return await res.text()
  })
}

export const getCleanScript = (script) => {
  return String(script).slice(20, -2)
}

// 获取脚本列表
export const fetchedScriptList = async (scriptUrlList = []) => {
  if (Array.isArray(scriptUrlList) && scriptUrlList.length === 0) {
    return []
  }

  let list = scriptUrlList.filter((i) => i)

  return await Promise.all(list.map(async (item) => await fetchResource(item)))
}

// 执行js脚本
export const performScriptForFunction = (scriptText) => {
  if (!scriptText) {
    return
  }

  let text = `return ${scriptText}()`

  return new Function(text)
}

export const scriptEvent = async (scriptUrlList) => {
  const fnList = await fetchedScriptList(scriptUrlList)
  return fnList

  // let resFn = [];

  // if (fnList.length > 0) {
  //   // 遍历脚本列表
  //   for (let i = 0; i < fnList.length; i++) {
  //     let fn = performScriptForFunction(fnList[i]);
  //     resFn.push(fn);
  //   }
  // }

  // return resFn;
}
