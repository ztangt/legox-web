import { history } from 'umi';
import apis from 'api';
import { message, notification } from 'antd';
import { REQUEST_SUCCESS } from '../service/constant';
import { data } from 'jquery';
import { Base64 } from 'js-base64';
import { toTeantMark } from '../util/loginUtil'
import moment from 'moment';
const Model = {
  namespace: 'user',
  state: {
    curUserInfo: [],
    tenantId: '',
    verifyVisible: false,
    loginConfigInfo: {},
    dictType: {},
    logos: {},
    copyRight: '',
    basesetInfo: {},
    isShowDownloadPlugin: false,
    isError: false,
    identitys: [],
    selectedKeys: [],
    clientType: '',
    refreshToken: '',
    menus: [],
    key: -1,
    contact: {},
    contactVisiable: false,
    teantList: [], //租户列表
    identityIdO: '',
    registerList: [],
    registerModal: false,//选择系统弹窗
  },
  subscriptions: {
    setup({ dispatch, history }) {
      console.log('history11',history);
      history.listen((location) => {
        // if (window.location.href.includes('/jumpPage')) {
        //   return;
        // }
        // if (window.location.href.includes('/mobileCode')) {
        //   return;
        // }
        // if (window.location.href.includes('/login')) {
        //   if (
        //     //当前访问租户与存在租户相同 且存在usertoken 根据当前登录平台跳转到相应页面
        //     window.location.pathname.split('/')[1] ==
        //       (window.localStorage.getItem('tenantMark') || mark) &&
        //     window.localStorage.getItem('userToken') &&
        //     window.localStorage.getItem('clientType')
        //   ) {
        //     if (
        //       window.location.href.includes('/business_application') ||
        //       window.location.href.includes('/support')
        //     ) {
        //     } else {
        //       window.location.href = `#/${
        //         window.localStorage.getItem('clientType') == 'PC'
        //           ? 'support'
        //           : 'business_application'
        //       }`;
        //     }
        //   } else {
        //     //无token状态
        //     // window.localStorage.setItem('userToken', '');
        //     window.localStorage.setItem('selfLogin', '0');
        //     window.localStorage.setItem('userAccount', '');
        //     window.localStorage.setItem('tenantMark', '');
        //     window.localStorage.setItem('tenantId', '');
        //     window.localStorage.setItem('clientType', '');
        //     window.localStorage.setItem('visible', false);
        //     window.localStorage.setItem('firstLogo', ''); //首页logo
        //     // 遍历localstorage中的所有键值对
        //     for (let i = 0; i < window.localStorage.length; i++) {
        //       const key = window.localStorage.key(i);
        //       // 检查键是否包含'desktopType'
        //       if (key.includes('desktopType')) {
        //         // 删除包含'desktopType'的键值对
        //         window.localStorage.removeItem(key);
        //       }
        //     }
        //     mark = '';
        //     getTeantMark();
        //   }
        // }

        if (location.pathname == '/unset') {
          window.localStorage.setItem('userToken', '');
          window.localStorage.setItem('clientType', '');
        }
        // if (
        //   window.localStorage.getItem('clientType') == 'FRONT' &&
        //   !location.pathname.includes('/business_application')
        // ) {
        //   window.location.href = '#/business_application';
        // }
        // function getTeantMark() {
        //   // if(!window.location.href.includes('/login')){
        //   //   window.location.href = '#/login';
        //   // }
        //   if (!window.location.pathname.split('/')[1]) {
        //     window.location.href = '#/unset';
        //     return;
        //   }
        //   mark = window.location.pathname.split('/')[1];
        //   window.localStorage.setItem(
        //     'tenantMark',
        //     window.location.pathname.split('/')[1],
        //   );
        //   dispatch({
        //     type: 'getTentant',
        //     payload: {
        //       tenantMark: window.location.pathname.split('/')[1],
        //     },
        //   });
        // }
        function closeAllTabs() {
          // 关闭最后一个标签页退出登录
          window.onbeforeunload = () => {
            let numbers = window.localStorage.getItem('numbers');

            const sesTime = window.sessionStorage.getItem('sesTime');

            const localTime = window.localStorage.getItem('localTime');

            //当localTime 没有值，并且sesTime === localTime，减去当前页。

            if (
              localTime != 'NaN' &&
              localTime != null &&
              sesTime === localTime
            ) {
              numbers = parseInt(numbers) - 1;

              window.localStorage.setItem('numbers', numbers);
            }
          };

          window.onload = () => {
            let time = '';

            let numbers = window.localStorage.getItem('numbers'); //计算打开的标签页数量

            const sesTime = window.sessionStorage.getItem('sesTime');

            const localTime = window.localStorage.getItem('localTime'); //首次登录的时间

            //当numbers无值或者小于0时，为numbers 赋值0

            if (numbers == 'NaN' || numbers === null || parseInt(numbers) < 0) {
              numbers = 0;
            }

            //sesTime || localTime 没有值，并且numbers为0时，清除localStorage里的登录状态，退出到登录页面

            if (
              (sesTime === null ||
                sesTime === 'NaN' ||
                localTime === null ||
                localTime === 'NaN') &&
              parseInt(numbers) === 0
            ) {
              //localStorage.clear();

              sessionStorage.clear();

              //为localTime和sesTime赋值，记录第一个标签页的时间

              time = new Date().getTime();

              window.sessionStorage.setItem('sesTime', time);

              window.localStorage.setItem('localTime', time);

              // router.push('/login');
            }

            //当time ，localTime 有值，并且sesTime != localTime时，为sesTime赋值

            if (
              !time &&
              localTime != 'NaN' &&
              localTime != null &&
              sesTime != localTime
            ) {
              window.sessionStorage.setItem('sesTime', localTime);
            }

            //最后保存当前是第几个标签页

            numbers = parseInt(numbers) + 1;

            window.localStorage.setItem('numbers', numbers);
          };
        }
        // closeAllTabs();
        document.onreadystatechange = function () {
          if (document.readyState === 'loading') {
          }
          if (
            document.readyState === 'complete' ||
            document.readyState === 'interactive'
          ) {
            mark = localStorage.getItem('tenantMark');
            if((!window.location.hash||window.location.hash=='#/')&&!window.localStorage.getItem('userToken')){
              window.location.href='#/login'
              return
            }
            if(!window.location.href.includes('/login')&&window.location.hash){
              toTeantMark(dispatch);
            }
          }
        };
        // function toTeantMark() {
        //   if (window.localStorage?.length == 0) {
        //     getTeantMark(); //获取租户
        //     return;
        //   }

        //   if (window.localStorage.getItem('unset') == 'true') {
        //     //localstorage中 （租户是否存在） unset为true 不存在
        //     if (
        //       //当前访问租户是否与存在租户相同 不同：获取租户 相同：跳转到404页面
        //       window.location.pathname.split('/')[1] !=
        //         window.localStorage.getItem('tenantMark') ||
        //       !window.localStorage.getItem('tenantMark')
        //     ) {
        //       localStorage.setItem('identityId','')
        //       localStorage.setItem('registerCode','')
        //       getTeantMark(); //获取租户
        //     } else if (
        //       window.location.pathname.split('/')[1] ==
        //       window.localStorage.getItem('tenantMark')
        //     ) {
        //       window.location.href = '#/unset';
        //     }
        //   } else {
        //     var tenantMark = window.localStorage.getItem('tenantMark') || mark;
        //     if (
        //       //当前访问租户与存在租户相同 且存在usertoken 根据当前登录平台跳转到相应页面
        //       window.location.pathname.split('/')[1] == tenantMark &&
        //       window.localStorage.getItem('userToken') &&
        //       window.localStorage.getItem('clientType')
        //     ) {
        //       if (
        //         window.location.href.includes('/business_application') ||
        //         window.location.href.includes('/support')||
        //         window.location.href.includes('/mobile')
        //       ) {
        //       } else {

        //         window.location.href = `#/${
        //           window.localStorage.getItem('clientType') == 'PC'
        //             ? 'support'
        //             : 'business_application'
        //         }`;
        //       }
        //     } else if (
        //       window.location.pathname.split('/')[1] == tenantMark &&
        //       !window.localStorage.getItem('userToken')
        //     ) {
        //       //当前访问租户与存在租户相同 但无usertoken  跳转至登录页
        //       // window.location.href = '#/login';
        //       getTeantMark();
        //     } else if (
        //       //当前访问租户与存在租户不同 重新获取租户
        //       window.location.pathname.split('/')[1] != tenantMark ||
        //       !tenantMark
        //     ) {
        //       localStorage.setItem('identityId','')
        //       localStorage.setItem('registerCode','')
        //       getTeantMark();
        //     }
        //   }
        // }
      });
    },
  },
  effects: {
    //获取当前用户的信息
    *getCurrentUserInfo({ payload, isSys }, { call, put }) {
      const { data } = yield call(apis.getCurrentUserInfo, payload, '', 'user');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            curUserInfo: data.data,
            identityIdO: data.data?.identityId,
          },
        });
        window.localStorage.setItem('userName', data.data.userName);
        window.localStorage.setItem('userInfo', JSON.stringify(data.data));
        window.localStorage.setItem('orgRefUserId', data.data.orgRefUserId); //岗人ID
        window.localStorage.setItem('identityId', data.data.identityId); //岗人ID
        window.localStorage.setItem('postId', data.data.postId || ''); //岗人ID
        window.localStorage.setItem('pwdChangeTime', data.data.pwdChangeTime); //密码修改时间
        window.localStorage.setItem('isMergeTodo', data.data.isMergeTodo); //待办数据

        const days = window.localStorage.getItem('pwexpireDays'); //提前几天提醒
        const validDays = window.localStorage.getItem('pwvalidDays'); //有效期天数
        const alert = (msg) => {
          if (window.localStorage.getItem('isModifyPwexpire') == 0) {
            notification['warning']({
              message: '提示',
              description: msg,
              duration: 5,
            });
            return;
          }
          if (window.localStorage.getItem('isModifyPwexpire') == 1) {
            window.localStorage.setItem('visible', true);
            return;
          }
        };
        if (
          window.localStorage.getItem('pwvalidType') == 'VALID_PERIOD' &&
          isSys == 0
        ) {
          //密码有有效期
          if (
            Number(data.data.pwdChangeTime) +
              24 * 60 * 60 * Number(validDays) <=
            moment().format('X')
          ) {
            //密码已失效
            alert(<span>您的密码已失效,请记得修改密码哦!</span>);
            return;
          }
          if (
            Number(data.data.pwdChangeTime) +
              24 * 60 * 60 * Number(validDays - days) <=
            moment().format('X')
          ) {
            //密码还有几天失效
            alert(<span>您的密码还有{days}天失效,请记得修改密码哦!</span>);
            return;
          }
        }
      } else {
        message.error(data.msg);
      }
    },
    //登录
    *login({ payload, tenantMark, target, callback }, { call, put, select }) {
      // payload.grantType='password';
      const { data } = yield call(apis.login, payload, '', 'user');
      const { curUserInfo } = yield select((state) => state.user);
      if((data.code == 419 || data.code == 401)){ //jumppage页面419 ,401时sso登陆
        callback&&callback()
      }
      if (data.code == REQUEST_SUCCESS) {
        message.success('登录成功!');
        window.localStorage.setItem('registerCode',data.data.loginRegisterCode)
        window.localStorage.setItem('registerId',data.data.loginRegisterID)
        localStorage.setItem('waitData','0');
        if (process.env.NODE_ENV == 'development') {
          window.localStorage.setItem('env', 'api/api');
        } else {
          window.localStorage.setItem('env', '/api');
        }
        const randomWord = (num) => {
          let str = '',
            arr = [
              '0',
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              'a',
              'b',
              'c',
              'd',
              'e',
              'f',
              'g',
              'h',
              'i',
              'j',
              'k',
              'l',
              'm',
              'n',
              'o',
              'p',
              'q',
              'r',
              's',
              't',
              'u',
              'v',
              'w',
              'x',
              'y',
              'z',
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
              'O',
              'P',
              'Q',
              'R',
              'S',
              'T',
              'U',
              'V',
              'W',
              'X',
              'Y',
              'Z',
            ];
          let pos;
          for (let i = 0; i < num; i++) {
            pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
          }
          return str;
        };
        // IDENTITYID = data.data?.identityId || '';
        //将userToken存入localStorage中
        window.localStorage.setItem('userToken', data.data.userToken);
        window.localStorage.setItem('refreshToken', data.data.refreshToken);
        window.localStorage.setItem('clientType', data.data.clientType);
        window.localStorage.setItem('refreshTokenTime', 0);
        curUserInfo['password'] &&
          window.localStorage.setItem(
            'pkeys',
            randomWord(11) + Base64.encode(curUserInfo['password']),
          );
        window.localStorage.setItem('sockUrl', data.data.sockUrl);
        window.localStorage.setItem('wsUrl', data.data.wsUrl);
        if (tenantMark) {
          //没有teantMark，存储tenantMark
          window.localStorage.setItem('tenantMark', tenantMark);
          window.localStorage.setItem('tenantId', payload?.tenantId);
        }
        debugger;
        console.log('sockUrlsockUrl:', data.data);
        yield put({
          type: 'updateStates',
          payload: {
            clientType: data.data.clientType,
            refreshToken: data.data.refreshToken,
            menus: [],
            key: -1,
            registerModal: false
          },
        });

        let sysPlatType = 'PC';
        if(target&&tenantMark){
          // window.localStorage.setItem('target',target);
          location.href = `/${tenantMark}/#/${target}`
        }else{
          if (payload.toState && payload.toState == 'PC') {
            //第一次登录的时候跳转到首页
            sysPlatType = 'PC';
            if (tenantMark) {
              //jumpage 页面的登录无租户标识或者租户标识不匹配，需要在路由中添加
              location.href = `/${tenantMark}/#/support`;
            } else {
              location.href = '#/support';
            }
            yield put({
              //获取当前登录用户信息
              type: 'getCurrentUserInfo',
              payload: {},
              isSys: 1,
            });
          }
        }

        if (data.data.loginOSType.includes('FRONT')) {
          sysPlatType = 'FRONT';
          // location.href = '#/business_application';
          // 业务平台 获取桌面布局类型 需要先获取主题设置在进行页面跳转
          // yield put({
          //   //获取某注册系统信息
          //   type: 'getRegisterByCode',
          //   payload: {
          //     registerCode: sysPlatType,
          //     afterReq: true,
          //   },
          // });
          yield put({
            type: 'getBaseset',
            payload: {
              registerId: data.data.loginRegisterID,
              afterReq: true,
            },
            tenantMark,
            target,
          });
          yield put({
            type: 'getLogo', //获取首页logo
            payload: {
              registerId: data.data.loginRegisterID,
              tabTypeCode: 'PAGETAB_FIRSTLOGO',
              start: 1,
              limit: 10,
              isEnable: 1,
            },
          });
          if(window.location.href.includes('portal')){
            debugger;
            yield put({
              type: 'getLogo', //获取门户logo
              payload: {
                registerId: data.data.id,
                tabTypeCode: 'PAGETAB_SCENELOGO',
                start: 1,
                limit: 10,
                isEnable: 1,
              },
            });
          }
          yield put({
            //获取某注册系统信息
            type: 'getDictInfoName',
          });

          yield put({
            //登录成功后获取密码方案
            type: 'getPasswordPolicy',
            payload: {},
          });
          // yield put({
          //   //获取当前登录用户信息
          //   type: 'getCurrentUserInfo',
          //   payload: {},
          //   isSys: 0,
          // });
        } else {
          sysPlatType = 'PC';
          if (target) {
            // location.href = target
          } else {
            if (tenantMark) {
              //jumpage 页面的登录无租户标识或者租户标识不匹配，需要在路由中添加
              location.href = `${tenantMark}/#/support`;
            } else {
              location.href = '#/support';
            }
          }
          yield put({
            //获取当前登录用户信息
            type: 'getCurrentUserInfo',
            payload: {},
            isSys: 1,
          });
        }

        if (!data.data.loginOSType.includes('FRONT')) {
          // yield put({
          //   //获取某注册系统信息
          //   type: 'getRegisterByCode',
          //   payload: {
          //     registerCode: sysPlatType,
          //   },
          // });
          yield put({
            type: 'getBaseset',
            payload: {
              registerId: data.data.loginRegisterID,
              // afterReq: true,
            },
          });
          yield put({
            type: 'getLogo', //获取首页logo
            payload: {
              registerId: data.data.loginRegisterID,
              tabTypeCode: 'PAGETAB_FIRSTLOGO',
              start: 1,
              limit: 10,
            },
          });
        }
      } else if (data.code != 401) {
        if(location.href.includes('jumpPage'&&data.code == 419)){//jumppage页面419不提示
          return
        }
        message.error(data.msg, 5);
        window.localStorage.setItem('selfLogin', '0');
        yield put({
          type: 'updateStates',
          payload: {
            verifyVisible: false,
            registerModal: false
          },
        });
      }
    },
    //获取全部枚举详细信息的中文名称
    *getDictInfoName({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getDictInfoName, payload);
        if (data.code == 200) {
          window.localStorage.setItem(
            'dictInfoName',
            JSON.stringify(data.data.dicts),
          );
        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
        throw new Error(e);
      } finally {
      }
    },
    //登出
    *logout({ payload }, { call, put }) {
      const { data } = yield call(apis.logout, payload, '', 'user');
      if (data.code == REQUEST_SUCCESS) {
        //将userToken存入localStorage中
        window.localStorage.setItem('userToken', '');
        window.localStorage.setItem('selfLogin', '0');
        window.localStorage.setItem('userAccount', '');
        window.localStorage.setItem('tenantId', '');
        setItem('menus', '');
        window.localStorage.setItem('menusList', '');
        window.localStorage.setItem('clientType', '');
        window.localStorage.setItem('refreshToken', '');
        window.localStorage.setItem('identityId', data.identityId); //岗人id
        window.localStorage.setItem('registerCode',data.registerCode)
        window.localStorage.setItem('visible',false)//取消强制提醒弹窗
        //跳转到首页
        location.href = '#/login';
        window.location.reload();
      } else if (data.code != 401) {
        message.error(data.msg, 5);
      }
    },
    //通过访问地址获取租户
    *getTentant({ payload }, { call, put }) {
      const { data } = yield call(apis.getTentant, payload, '', 'user');

      if (data.code == REQUEST_SUCCESS) {
        if (data.data) {
          window.localStorage.setItem('tenantMark', payload.tenantMark);
          window.localStorage.setItem('tenantId', data.data.tenantId);
          window.localStorage.setItem('unset', false);
          //租户id相同 且只在其他页面
          if (
            data.data.tenantId == localStorage.tenantId &&
            window.location.pathname?.split('/') > 2 &&
            window.location.pathname?.split('/')?.[2] &&
            window.location.hash &&
            window.location.hash?.split('/') > 2
          ) {
            return;
          }
          if (!window.location.href.includes('/login')&&history.location.pathname!='/portalLogin') {
            window.location.href = '#/login';
            window.localStorage.setItem('userToken', '');
          }
          yield put({
            type: 'updateStates',
            payload: {
              tenantId: data.data.tenantId,
            },
          });

          yield put({
            type: 'getLoginConfig',
            payload: {
              tenantId: data.data.tenantId,
            },
          });
        } else {
          location.href = '#/unSet';
          window.localStorage.setItem('unset', true);
        }
      } else if (data.code != 401) {
        message.error(data.msg, 5);
      }
    },
    //获取登录配置信息
    *getLoginConfig({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getLoginConfig, payload);
      if (data.code == REQUEST_SUCCESS) {
        // location.href='#/login';
        yield put({
          type: 'updateStates',
          payload: {
            loginConfigInfo: data.data,
            dictTypes: JSON.parse(data.data.dictTypeInfoJson), //登录方案
            logos: JSON.parse(data.data.logosJson), //登录logo
            contact: JSON.parse(data.data.contactPerson), //联系人
            copyRight: data.data.copyRight?data.data.copyRight:'北京锐元同联科技有限公司', //版权信息
          },
        });
        window.localStorage.setItem('pageName',data.data.pageName||'')
        window.localStorage.setItem('minioUrl', data.data.minioUrl);
        window.localStorage.setItem(
          'logos',
          JSON.stringify(data.data.logosJson),
        );
        window.localStorage.setItem('copyRight', data.data.copyRight?data.data.copyRight:'北京锐元同联科技有限公司');
        window.localStorage.setItem('configJson', data.data.configJson);

      } else {
        message.error(data.msg);
      }
    },
    //获取系统配置信息
    *getSystemBaseset({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getSystemBaseset, payload);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            basesetInfo: data.data,
          },
        });
      } else {
        message.error(data.msg);
      }
    },
    //获取登录用户身份列表
    *getUserDentityList({ payload }, { call, put }) {
      const { data } = yield call(apis.getUserDentityList, payload, '', 'user');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            identitys: data.data.identitys,
          },
        });
        yield put({
          type: 'login',
          payload: {
            clientType: 'PC',
            fromState: 'pc',
            toState: 'FRONT',
            grantType: 'refresh_token',
            refreshToken: window.localStorage.getItem('refreshToken'),
          },
        });
      } else if (data.code != 401) {
        message.error(data.msg, 5);
      }
    },
    // //获取当前身份菜单及按钮
    // *getUserMenus({ payload }, { call, put, select }) {
    //   const { data } = yield call(apis.getUserMenus, payload, '', 'user');
    //   const { key } = yield select((state) => state.user);
    //   if (data.code == REQUEST_SUCCESS) {
    //     const loop = (array,menusList) => {
    //       for (let index = 0; index < array.length; index++) {
    //         const element = array[index];
    //         array[index]['name'] = element.menuName;
    //         array[index]['icon'] = element.menuIcon;
    //         array[index]['routes'] = element.children;
    //         if (!element.path) {
    //           delete element.path;
    //         }
    //         menusList.push(array[index]);
    //         if (element.children && element.children.length != 0) {
    //           array[index]['redirect'] = element.children[0].path;
    //           loop(element.children,menusList);
    //         }
    //       }
    //       return {tree:array,list:menusList};
    //     };
    //     if (data.data.menus.length != 0) {

    //       let menus = loop(data.data.menus,[]);
    //       let menusA = menus['tree'];
    //       let menusList = menus['list'];
    //       yield put({
    //         type: 'updateStates',
    //         payload: {
    //           menus: menusA,
    //           key: key + 1,
    //         },
    //       });
    //       window.localStorage.setItem('menus', JSON.stringify(menusA));
    //       window.localStorage.setItem('menusList', JSON.stringify(menusList));
    //     } else {
    //       window.localStorage.setItem('menus', '');
    //       window.localStorage.setItem('menusList', '');
    //     }
    //   } else if (data.code != 401) {
    //     message.error(data.msg, 5);
    //   }
    // },
    //获取插件分类列表
    *getPlugType({ payload, callback }, { call, put, select }) {
      const { tenantId } = yield select((state) => state.user);
      try {
        payload.tenantId = window.localStorage.getItem('tenantId') || tenantId;
        const { data } = yield call(apis.getPlugTypeList, payload);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data);
        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //获取插件列表
    *getPlugList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getPlugList, payload);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data);
        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //获取下载路径
    *getDownFileUrl({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getDownFileUrl, payload);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data);
        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //文件下载接口
    *downloadFile({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.downloadFile, payload);
        if (data.code == REQUEST_SUCCESS) {
          window.location.href = data.data.fileUrl;
        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //获取密码方案
    *getPasswordPolicy({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getPasswordPolicy, payload);
        if (data.code == REQUEST_SUCCESS) {
          window.localStorage.setItem(
            'isModifyPwexpire',
            data.data.isModifyPwexpire,
          ); //密码过期提醒类型CLOSE：关闭 ALERT：提醒UPDATE：强制修改
          window.localStorage.setItem('pwexpireDays', data.data.pwexpireDays); //过期前多少天提醒
          window.localStorage.setItem('pwvalidDays', data.data.pwvalidDays); //有效期天数
          window.localStorage.setItem('pwvalidType', data.data.pwvalidType); //密码有效期类型VALID_PERIOD：有效期限VALID_FOREVER：永久有效
          window.localStorage.setItem('pwstrongType', data.data.pwstrongType); //密码强度类型LOW：低MIDDLE：中HIGH：高CUSTOM：自定义
          window.localStorage.setItem(
            'pwstrongRegular',
            data.data.pwstrongRegular,
          ); //自定义正则表达式
          window.localStorage.setItem(
            'pwstrongRegularMemo',
            data.data.pwstrongRegularMemo,
          ); //正则说明
          window.localStorage.setItem('pwalertType', data.data.pwalertType); //密码提醒类型CLOSE：关闭ALERT：提醒UPDATE：强制修改

          //检验当前密码是否符合密码检验
          const pwstrongType = data.data.pwstrongType; //密码强度
          const pwd = Base64.decode(
            window.localStorage.getItem('pkeys')?.slice(11),
          ); //当前用户密码
          const pwstrongRegular = data.data.pwstrongRegular; //自定义密码规则
          const pwalertType = data.data.pwalertType; //密码提醒类型
          const strongRegex = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[!@#\$%\^&\*])[0-9A-Za-z!@#\$%\^&\*)]{8,16}$/;
          const mediumRegex = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])[0-9A-Za-z]{8,15}$/;
          const lowRegex = /^[0-9_a-zA-Z]{3,10}$/;
          const alert = () => {
            //判断密码是否符合当前密码强度
            if (
              pwstrongType == 'LOW' &&
              !lowRegex.test(pwd) &&
              !mediumRegex.test(pwd) &&
              !strongRegex.test(pwd)
            ) {
              return true;
            } else if (
              pwstrongType == 'MIDDLE' &&
              !mediumRegex.test(pwd) &&
              !strongRegex.test(pwd)
            ) {
              return true;
            } else if (pwstrongType == 'HIGH' && !strongRegex.test(pwd)) {
              return true;
            } else if (pwstrongType == 'CUSTOM' && !pwstrongRegular.test(pwd)) {
              return true;
            } else {
              return false;
            }
          };
          if (pwalertType == 'ALERT' && alert()) {
            notification['warning']({
              message: '提示',
              description: '您的密码不符合密码策略',
              duration: 5,
            });
            return;
          }
          if (pwalertType == 'UPDATE' && alert()) {
            window.localStorage.setItem('visible', true);
            return;
          }
        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *updatePassword({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.updatePassword, payload);
        if (data.code == REQUEST_SUCCESS) {
          notification['success']({
            message: '提示',
            description: <span>密码修改成功,3秒后将自动跳转登录页面!</span>,
            duration: 3,
          });
          setTimeout(() => {
            location.href = '#/login';
            window.localStorage.setItem('userToken', '');
          }, 3000);
        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    *getRegisterByCode({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getRegisterByCode, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getBaseset',
            payload: {
              registerId: data.data.id,
              afterReq: payload.afterReq,
            },
          });
          yield put({
            type: 'getLogo', //获取首页logo
            payload: {
              registerId: data.data.id,
              tabTypeCode: 'PAGETAB_FIRSTLOGO',
              start: 1,
              limit: 10,
            },
          });
          if(window.location.href.includes('portal')){
            debugger;
            yield put({
              type: 'getLogo', //获取门户logo
              payload: {
                registerId: data.data.id,
                tabTypeCode: 'PAGETAB_SCENELOGO',
                start: 1,
                limit: 10,
                isEnable: 1
              },
            });
          }
         
        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getBaseset(
      { payload, callback, tenantMark, target },
      { call, put, select },
    ) {
      try {
        const { data } = yield call(apis.getBaseset, payload);
        if (data.code == REQUEST_SUCCESS) {
          window.localStorage.setItem('abilityCodes', data.data.abilityCodes); //能力 (顶部图标)
          window.localStorage.setItem('personConfig', data.data.personConfig); //功能操作
          window.localStorage.setItem('tableConfig', data.data.tableConfig); //主题设置
          window.localStorage.setItem('supportCopyright', data.data.copyRight?data.data.copyRight:'北京锐元同联科技有限公司'); //支撑平台首页版权
          window.localStorage.setItem(
            'bussinessCopyright',
            data.data.copyRight?data.data.copyRight:'北京锐元同联科技有限公司',
          ); //业务平台首页版权
          window.localStorage.setItem('isModifyCopyRight', data.data.isModifyCopyRight?data.data.isModifyCopyRight:1); //版权是否可修改 1是 0否	
          // 业务平台 获取桌面布局类型 需要先获取主题设置在进行页面跳转
          if (payload.afterReq) {
            const id = window.localStorage.getItem('userInfo')
              ? JSON.parse(window.localStorage.getItem('userInfo')).id
              : '';
            const desktopType =
              window.localStorage.getItem(`desktopType${id}`) || 0;

            const tableConfig =
              data?.data?.tableConfig &&
              data?.data?.tableConfig != null &&
              JSON.parse(data.data.tableConfig);

            // 开发类型 与已有不一致  需要重置
            if (tableConfig) {
              if (
                (tableConfig.TABLE_FAST.substr(0, 1) == 0 &&
                  desktopType == 1) ||
                (tableConfig.TABLE_MIX.substr(0, 1) == 0 && desktopType == 2)
              ) {
                window.localStorage.setItem(`desktopType${id}`, 0);
              }
            }
            if (target) {
              // location.href = target
            } else {
              if (tenantMark) {
                // location.pathname = `/${tenantMark}`
                if(history.location.pathname=='/portalLogin'){
                  location.href = `/${tenantMark}/#/business_application/portal`
                }else{
                  //jumpage 页面的登录无租户标识或者租户标识不匹配，需要在路由中添加
                  location.href =
                  desktopType == 3 ||
                  (tableConfig?.TABLE_CUSTOM?.substr(0, 1) == 1 &&
                    tableConfig?.TABLE_CUSTOM?.substr(2, 1) == 1)
                    ? `/${tenantMark}/#/business_application/customPage`
                    : `/${tenantMark}/#/business_application`;
                }
              } else {
                if(history.location.pathname=='/portalLogin'){
                  location.href = `#/business_application/portal`
                }else{
                  location.href =
                  desktopType == 3 ||
                  (tableConfig?.TABLE_CUSTOM?.substr(0, 1) == 1 &&
                    tableConfig?.TABLE_CUSTOM?.substr(2, 1) == 1)
                    ? '#/business_application/customPage'
                    : '#/business_application';
                }
              }
            }
          }
        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getLogo({ payload, callback }, { call, put, select }) {
      //获取首页logo
      try {
        const { data } = yield call(apis.getLogo, payload);
        if (data.code == REQUEST_SUCCESS) {
          if (data.data.list.length != 0) {
            let flag = data.data.list.findIndex((item) => {
              return item.isEnable == 1;
            });
            if(payload.tabTypeCode == 'PAGETAB_SCENELOGO'){//门户logo
              window.localStorage.setItem(
                'secondLogo',
                data.data.list[flag].logoUrl,
              ); //首页logo
            }else{
              window.localStorage.setItem(
                'firstLogo',
                data.data.list[flag].logoUrl,
              ); //首页logo
            }
          }
        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getTenants({ payload, callback }, { call, put, select }) {
      //获取租户
      try {
        const { data } = yield call(apis.getTenants, payload);
        if (data.code == REQUEST_SUCCESS) {
          if (data?.data?.list.length != 0) {
            callback && callback(data?.data?.list);
            yield put({
              type: 'updateStates',
              payload: {
                teantList: data?.data?.list,
              },
            });
          }
        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //通过访问地址获取租户
    *getMobileTentant({ payload,callback }, { call, put }) {
      const { data } = yield call(apis.getTentant, payload, '', 'user');

      if (data.code == REQUEST_SUCCESS) {
        callback&&callback(data.data)
      } else if (data.code != 401) {
        message.error(data.msg, 5);
      }
    },
    *getRegisters({ payload, callback }, { call, put, select }) {
      //获取注册系统
      try {
        const { data } = yield call(apis.getRegisters, payload);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data?.data);
          if (data?.data?.registers.length != 0) {
            yield put({
              type: 'updateStates',
              payload: {
                registerList: data?.data?.registers,
              },
            });
          }
        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
  },
  reducers: {
    updateStates(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default Model;
