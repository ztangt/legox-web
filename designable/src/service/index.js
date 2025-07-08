/**
 * request统一拼装，参数拼装
 */
import { cloneDeep, isEmpty } from 'lodash'
import pathToRegexp from 'path-to-regexp'
import qs from 'querystring'
import { getKeyValue } from '../utils'
import api from './api'
import request from './request'
const microApp = window.location.href.includes('mobile')
  ? 'business_application'
  : window.location.hash.includes('support')
  ? 'support'
  : 'business_application'
//401刷新userToken的操作
// const refreshTokenFn = (callback, payload, key) => {
//   //没有在call请求加入typeName参数则取api的键(model中effects函数名与typeName相同的时候可以不传)
//   // if (typeof typeName == 'undefined' || !typeName) {
//   //   typeName = key
//   // }
//   //挂起等待更新userToken(保存在ACTIONS401)
//   console.log('ACTIONS401=', ACTIONS401)
//   ACTIONS401.push({
//     //typeName,
//     payload,
//     callback,
//   })
//   console.log('STATE401=', STATE401)
//   //获取上次刷新usertoken的时间，如果在一分钟之内则不请求刷新请求，直接再次请求401的接口
//   var refreshTokenTime = window.localStorage.getItem('refreshTokenTime')
//   if (
//     window.location.href.includes('/cloud/applyConfig') ||
//     window.location.href.includes('/cloud/designer/formDesigner')
//   ) {
//     var teantToken = window.localStorage.getItem('teantToken')
//     var tokenArr = JSON.parse(teantToken || '[]')
//     var curTeantToken =
//       _.find(tokenArr, { tenantId: getQuery().tenantId }) || {} //查找当前点击的租户token信息
//     refreshTokenTime = curTeantToken?.refreshTokenTime
//   }
//   if (new Date().getTime() - refreshTokenTime < 1000 * 60) {
//     //开始请求挂起的action
//     ACTIONS401.map((item, index) => {
//       item.callback && item.callback()
//       //ACTIONS401.splice(index,1);
//       //item.typeName(payload, callback)
//     })
//     ACTIONS401 = []
//   } else if (!STATE401) {
//     STATE401 = true
//     let loginPayload = {
//       clientType: 'PC',
//       grantType: 'refresh_token',
//     }
//     var refreshToken = window.localStorage.getItem('refreshToken')
//     if (
//       window.location.href.includes('/cloud/applyConfig') ||
//       window.location.href.includes('/cloud/designer/formDesigner')
//     ) {
//       var teantToken = window.localStorage.getItem('teantToken')
//       var tokenArr = JSON.parse(teantToken || '[]')
//       var curTeantToken =
//         _.find(tokenArr, { tenantId: getQuery().tenantId }) || {} //查找当前点击的租户token信息
//       refreshToken = curTeantToken?.refreshToken || ''
//       loginPayload.tenantId = curTeantToken?.tenantId || ''
//       loginPayload.clientType = 'CLOUD'
//     }
//     loginPayload.refreshToken = refreshToken
//     let options = {
//       method: 'POST',
//     }
//     options.headers = {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'TL-micro-app': microApp,
//     }
//     options.body = qs.stringify(loginPayload)
//     options.data = loginPayload
//     const returnData = request('auth/login', options)
//     returnData.then((reData) => {
//       console.log('reData=', reData)
//       if (reData.data.code == 200) {
//         const reUserToken = reData.data.data.userToken

//         if (
//           window.location.href.includes('/cloud/applyConfig') ||
//           window.location.href.includes('/cloud/designer/formDesigner')
//         ) {
//           var curTeantTokenIndex = _.findIndex(tokenArr, {
//             tenantId: getQuery().tenantId,
//           }) //查找当前点击的租户token信息

//           if (curTeantTokenIndex != -1) {
//             tokenArr[curTeantTokenIndex][
//               'getQuery().tenantIdTime'
//             ] = new Date().getTime()
//             tokenArr[curTeantTokenIndex]['userToken'] = reUserToken
//             tokenArr[curTeantTokenIndex]['refreshToken'] =
//               reData.data.data.refreshToken
//           }
//           localStorage.setItem('teantToken', JSON.stringify(tokenArr))
//         } else {
//           window.localStorage.setItem('refreshTokenTime', new Date().getTime())
//           window.localStorage.setItem('userToken', reUserToken)
//           window.localStorage.setItem(
//             'refreshToken',
//             reData.data.data.refreshToken
//           )
//         }
//         console.log('ACTIONS401=', ACTIONS401)
//         //开始请求挂起的action
//         ACTIONS401.map((item) => {
//           callback && callback()
//           //ACTIONS401.splice(index,1);
//           //item.typeName(payload, callback)
//         })
//         ACTIONS401 = []
//         STATE401 = false
//       } else {
//         ACTIONS401 = []
//         STATE401 = false
//         message.error(reData.data.msg)
//         if (reData.data.code == 419 || reData.data.code == 403) {
//           //刷新token有错误直接登出
//           if (window.location.href.includes('portal')) {
//             location.href = '#/portalLogin'
//           } else {
//             location.href = '#/login'
//           }
//           window.localStorage.setItem('userToken', '')
//         }
//       }
//     })
//   }
// }
const gen = (apiName, key) => {
  /**
   * payload  参数
   * typeName model中effects函数名与typeName相同的时候可以不传
   * serviceName 微服务名
   */
  return function (payload, callback, serviceName) {
    const apiArray = apiName.split(' ')

    let method = 'GET' //请求方式默认值

    let action = apiName
    if (apiArray.length > 1) {
      method = apiArray[0]
      action = apiArray[1]
    }
    const actionArray = apiArray[1].split('/')
    if (actionArray.length > 0 && serviceName) {
      //替换微服务名
      // actionArray[0] = serviceName
      // action = actionArray.toString().replaceAll(',','/');
      action = action.replace(actionArray[0], serviceName)
    }
    //处理action和参数
    const clonePayload = cloneDeep(payload)
    const match = pathToRegexp.parse(action)
    action = pathToRegexp.compile(action)(payload)

    for (const item of match) {
      if (item instanceof Object && item.name in clonePayload) {
        delete clonePayload[item.name]
      }
    }
    let options = {
      method,
    }
    const storage = window.localStorage

    if (method === 'GET') {
      if (action == 'sys/tenant/mark' || action == 'sys/tenant/config/login') {
        options.headers = {
          'TL-micro-app': microApp,
        }
      } else {
        options.headers = {
          Authorization: 'Bearer ' + storage.userToken,
          'TL-micro-app': microApp,
        }
      }

      if (clonePayload && clonePayload.pageInfo) {
        clonePayload['pageInfo'] = JSON.stringify(clonePayload.pageInfo)
      }
      action = `${action}${isEmpty(clonePayload) ? '' : '?'}${qs.stringify(
        clonePayload
      )}`
      options.params = {}
    } else {
      options.body = qs.stringify(clonePayload)
      options.data = clonePayload
      if (action == 'auth/login') {
        options.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          'TL-micro-app': microApp,
        }
      } else {
        options.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + storage.userToken,
          'TL-micro-app': microApp,
        }
      }
      options.body = qs.stringify(clonePayload)
      if (
        action == 'form/release' ||
        (action == 'form/form' && method == 'PUT') ||
        (action == 'public/bizRelAtt/column' && method == 'POST')
      ) {
        options.headers['Content-Type'] = 'application/json'
        options.body = JSON.stringify(payload)
      }
    }
    if (!window.localStorage.getItem('dataRuleCode') == 'undefined') {
      options.headers = {
        ...options.headers,
        RuleCode: window.localStorage.getItem('dataRuleCode'),
      }
    }
    if (
      window.location.href.includes('/cloud/applyConfig') ||
      window.location.href.includes('/cloud/designer/formDesigner')
    ) {
      var userToken = storage.userToken_cloud
      var teantToken = window.localStorage.getItem('teantToken_cloud')
      var tokenArr = JSON.parse(teantToken || '[]')
      var curTeantToken =
        _.find(tokenArr, { tenantId: getKeyValue('tenantId') }) || {} //查找当前点击的租户token信息
      userToken = curTeantToken?.userToken || ''
      options.headers = {
        ...options.headers,
        Authorization: 'Bearer ' + userToken,
      }
    }
    const returnData = request(action, options)
    // returnData.then((data) => {
    //   if (data.data.code == '401') {
    //     refreshTokenFn(callback, payload, key)
    //   }
    // })
    return returnData
  }
}
const apis = {}
for (const key in api) {
  apis[key] = gen(api[key], key)
}
let apiNames = Object.keys(api)
// console.log(apis,apis);
// apiNames.map((name, index)=>[gen(api[name]))
export default apis
