/**
 * request统一拼装，参数拼装
 */
import { cloneDeep, isEmpty } from 'lodash';
import pathToRegexp from 'path-to-regexp';
import qs from 'querystring';
import { getMaxDataRuleCode } from '../util/util';
import api from './api';
import request from './request';

const microApp = window.location.hash.split('/')?.[1];
//401刷新userToken的操作
// const refreshTokenFn = (typeName, namespace, payload, key) => {
//     //没有在call请求加入namespace参数则取pathname(model中pathname与namespace相同的时候可以不传)
//     if (typeof namespace == 'undefined') {
//         const arrPathName = history.location.pathname.split('/');
//         // console.log('arrPathName=', arrPathName);
//         if (arrPathName && arrPathName.length == 2) {
//             namespace = arrPathName[1];
//         }
//     }
//     //没有在call请求加入typeName参数则取api的键(model中effects函数名与typeName相同的时候可以不传)
//     if (typeof typeName == 'undefined' || !typeName) {
//         typeName = key;
//     }
//     const dispatch = getDvaApp()._store.dispatch;
//     //挂起等待更新userToken(保存在ACTIONS401)
//     // console.log('ACTIONS401=', ACTIONS401);
//     ACTIONS401.push({
//         namespace,
//         typeName,
//         payload,
//     });
//     // console.log('STATE401=', STATE401);
//     //获取上次刷新usertoken的时间，如果在一分钟之内则不请求刷新请求，直接再次请求401的接口
//     const refreshTokenTime = window.localStorage.getItem('refreshTokenTime');
//     if (new Date().getTime() - refreshTokenTime < 1000 * 60) {
//         //开始请求挂起的action
//         ACTIONS401.map((item) => {
//             dispatch({
//                 type: `${item.namespace}/${item.typeName}`,
//                 payload: item.payload,
//             });
//         });
//         ACTIONS401 = [];
//     } else if (!STATE401) {
//         STATE401 = true;
//         let loginPayload = {
//             clientType: 'PC',
//             grantType: 'refresh_token',
//         };
//         loginPayload.refreshToken = window.localStorage.getItem('refreshToken');
//         let options = {
//             method: 'POST',
//         };
//         options.headers = {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'TL-micro-app': microApp,
//         };
//         options.body = qs.stringify(loginPayload);
//         options.data = loginPayload;
//         const returnData = request('auth/login', options);
//         returnData.then((reData) => {
//             // console.log('reData=', reData);
//             if (reData.data.code == 200) {
//                 const reUserToken = reData.data.data.userToken;
//                 window.localStorage.setItem('userToken', reUserToken);
//                 window.localStorage.setItem('refreshToken', reData.data.data.refreshToken);
//                 window.localStorage.setItem('refreshTokenTime', new Date().getTime());
//                 // console.log('ACTIONS401=', ACTIONS401);
//                 //开始请求挂起的action
//                 ACTIONS401.map((item) => {
//                     dispatch({
//                         type: `${item.namespace}/${item.typeName}`,
//                         payload: item.payload,
//                     });
//                 });
//                 ACTIONS401 = [];
//                 STATE401 = false;
//             } else {
//                 ACTIONS401 = [];
//                 STATE401 = false;
//                 message.error(reData.data.msg);
//             }
//         });
//     }
// };
const gen = (apiName, key) => {
    return function (payload, typeName, namespace) {
        //form的接口需要在请求的时候headers需要增加参数
        let cutomHeaders = payload?.headers || {};
        // const menuId = localStorage.getItem('menuId');
        //获取来源的menuId
        //获取当前激活页签的lable的menuId属性
        let activeNode = document.getElementById(`dom_container`)?.getElementsByClassName('ant-tabs-tab-active')?.[0];
        let menuId = activeNode?.getElementsByClassName('menu_lable')[0]?.getAttribute('menuId') || '';
        let userInfo = localStorage.getItem('userInfo') || '{}';
        const orgId = JSON.parse(userInfo).orgId;

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
        let noHeader = [
            'sys/tenant/mark',
            'sys/tenant/config/login',
            'ods-app/monitorWarning/org/situation',
            'ods-app/monitorWarning/situation/piechart',
            'ods-app/monitorWarning/situation/info',
        ];
        if (method === 'GET') {
            if (noHeader.includes(action)) {
                options.headers = {};
            } else {
                options.headers = {
                    Authorization: 'Bearer ' + storage.userToken,
                    'TL-micro-app': microApp,
                    menuId,
                    orgId,
                    ...cutomHeaders, //TODO;验证吧，我真的不想加判断
                };
            }

            if (clonePayload && clonePayload.pageInfo) {
                clonePayload['pageInfo'] = JSON.stringify(clonePayload.pageInfo);
            }
            action = `${action}${isEmpty(clonePayload) ? '' : '?'}${qs.stringify(clonePayload)}`;
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
                };
                options.body = payload;
            } else if (
                (action == 'bpm/sign/batch' ||
                    action == 'bpm/sign/saveTemporarySign' ||
                    action == 'cma-app/medicalfee/medicalRegistration' ||
                    action == 'cma-app/medicalfee/medicalRegistration/print' ||
                    action == 'cma-app/medicalfee/drugExpense' ||
                    action == 'cma-app/medicalfee/serviceCharge' ||
                    action == 'cma-app/medicalfee/medicalRegistration' ||
                    action == 'cma-app/medicalfee/reimbursementCard' ||
                    action == 'cma-app/extract/insert' ||
                    action == 'cma-app/extract/modify' ||
                    action == 'cma-app/receive/insert' ||
                    action == 'cma-app/deposit/save' ||
                    action == 'cma-app/cashier/businessCard/businessCardSummary' || //加吧 也没别的办法了
                    action == 'cma-app/cashier/summaryExcel' || //加吧 也没别的办法了
                    action == 'cma-app/cashier/personCardReturn/collectionList' ||
                    action == 'cma-app/cashier/personCardReturn/exportCollects' ||
                    action == 'cma-app/cashier/personCardReturn/detailList' ||
                    action == 'cma-app/cashier/personCardReturn/exportDetails' ||
                    action == 'cma-app/deposit/saveBalance' ||
                    action == 'cma-app/manage/org' ||
                    action == 'bpm/bizTask/process-send') &&
                method != 'DELETE'
            ) {
                options.headers = {
                    Authorization: 'Bearer ' + storage.userToken,
                    'Content-Type': 'application/json',
                    'TL-micro-app': microApp,
                    orgId,
                    menuId,
                };
                options.body = payload;
            } else {
                options.headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: 'Bearer ' + storage.userToken,
                    'TL-micro-app': microApp,
                    orgId,
                    menuId,
                    ...cutomHeaders, //TODO;验证吧，我真的不想加判断
                };
            }
        }
        //修改maxDataruleCode的获取方式
        const maxDataruleCode = getMaxDataRuleCode();
        options.headers = {
            ...options.headers,
            Datarulecode: maxDataruleCode,
        };

        // returnData.then((data) => {
        //     if (data.data.code == '401') {
        //         refreshTokenFn(typeName, namespace, payload, key);
        //     }
        // });
        return request(action, options);
    };
};
const apis = {};
for (const key in api) {
    apis[key] = gen(api[key], key);
}
let apiNames = Object.keys(api);
// apiNames.map((name, index)=>[gen(api[name]))
export default apis;
