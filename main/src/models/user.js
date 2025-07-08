import { history } from 'umi';
import apis from 'api';
import { message, notification } from 'antd';
import { REQUEST_SUCCESS } from '../service/constant';
import { data } from 'jquery';
import moment from 'moment';
import IconFont from '../../Icon_manage';
import iconData from '../../public/icon_manage/iconfont.json';
const Model = {
  namespace: 'user',
  state: {
    curUserInfo: [],
    tenantId: '',
    verifyVisible: false,
    loginConfigInfo: {},
    dictType: {},
    logos: {},
    copyRight: {},
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
    modalVisible: false,
    meunList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (history.location.pathname == '/') {
          // dispatch({
          //   type: 'updateStates',
          //   payload: {
          //     key: 0,
          //   },
          // });
        }
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
          },
        });
        window.localStorage.setItem('userName', data.data.userName);
        window.localStorage.setItem('userInfo', JSON.stringify(data.data));
        window.localStorage.setItem('orgRefUserId', data.data.orgRefUserId); //岗人ID
        window.localStorage.setItem('identityId', data.data.identityId); //岗人ID
        window.localStorage.setItem('pwdChangeTime', data.data.pwdChangeTime); //密码修改时间
        window.localStorage.setItem('isMergeTodo', data.data.isMergeTodo); //待办数据

        const days = window.localStorage.getItem('pwexpireDays'); //提前几天提醒
        const validDays = window.localStorage.getItem('pwvalidDays'); //有效期天数
        const alert = msg => {
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
    *login({ payload }, { call, put, select }) {
      // payload.grantType='password';
      const { data } = yield call(apis.login, payload, '', 'user');
      const { curUserInfo } = yield select(state => state.user);
      if (data.code == REQUEST_SUCCESS) {
        message.success('登录成功!');
        //将userToken存入localStorage中
        window.localStorage.setItem('userToken', data.data.userToken);
        window.localStorage.setItem('refreshToken', data.data.refreshToken);
        window.localStorage.setItem('clientType', data.data.clientType);
        window.localStorage.setItem('refreshTokenTime', 0);
        window.localStorage.setItem('pkeys', curUserInfo['password']);

        yield put({
          type: 'updateStates',
          payload: {
            clientType: data.data.clientType,
            refreshToken: data.data.refreshToken,
            // menus: [],
            key: -1,
          },
        });

        let sysPlatType = 'PC';
        if (payload.toState && payload.toState == 'PC') {
          //第一次登录的时候跳转到首页
          sysPlatType = 'PC';
          location.href = '#/';
          yield put({
            //获取当前登录用户信息
            type: 'getCurrentUserInfo',
            payload: {},
            isSys: 1,
          });
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
          yield put({
            //登录成功后获取密码方案
            type: 'getPasswordPolicy',
            payload: {},
          });
          yield put({
            //获取当前登录用户信息
            type: 'getCurrentUserInfo',
            payload: {},
            isSys: 0,
          });
        } else {
          sysPlatType = 'PC';
          location.href = '#/';
          yield put({
            //获取当前登录用户信息
            type: 'getCurrentUserInfo',
            payload: {},
            isSys: 1,
          });
        }

        if (!data.data.loginOSType.includes('FRONT')) {
          yield put({
            //获取某注册系统信息
            type: 'getRegisterByCode',
            payload: {
              registerCode: sysPlatType,
            },
          });
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
        window.localStorage.setItem('selfLogin', '0');
        yield put({
          type: 'updateStates',
          payload: {
            verifyVisible: false,
          },
        });
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
        window.localStorage.setItem('menus', '');
        window.localStorage.setItem('clientType', '');
        window.localStorage.setItem('refreshToken', '');
        window.localStorage.setItem('identityId', data.identityId); //岗人id

        //跳转到首页
        location.href = '#/login';
        window.localStorage.setItem('userToken', '');
        window.location.reload();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    //通过访问地址获取租户
    *getTentant({ payload }, { call, put }) {
      const { data } = yield call(apis.getTentant, payload, '', 'user');
      if (data.code == REQUEST_SUCCESS) {
        if (data.data) {
          yield put({
            type: 'updateStates',
            payload: {
              tenantId: data.data.tenantId,
            },
          });
          window.localStorage.setItem('tenantId', data.data.tenantId);
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
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    //获取登录配置信息
    *getLoginConfig({ payload,callback }, { call, put, select }) {
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
            copyRight: data.data.copyRight, //版权信息
          },
        });
        callback&&callback(data.data)
        window.localStorage.setItem('minioUrl', data.data.minioUrl);
        window.localStorage.setItem(
          'logos',
          JSON.stringify(data.data.logosJson),
        );
        window.localStorage.setItem('copyRight', data.data.copyRight);
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
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    //获取当前身份菜单及按钮
    *getUserMenus({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getUserMenus, payload, '', 'user');
      const { key } = yield select(state => state.user);
      callback && callback(data);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            meunList: data.data.menus,
          },
        });
        const loop = (array,menusList) => {
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            array[index]['name'] = element.menuName;
            // array[index]['icon'] = <IconFont type={`icon-${element.menuIcon}`}/>;
            var codeFlag = iconData.glyphs.findIndex(item => {
              return item.font_class == element.menuCode;
            });
            var iconFlag = iconData.glyphs.findIndex(item => {
              return item.font_class == element.menuIcon;
            });

            if (!element.path) {
              // array[index]['path'] = element.menuCode;
              array[index]['routes'] = element.children;
              array[index]['icon'] =
                iconFlag != -1 ? (
                  <IconFont type={`icon-${element.menuIcon}`} />
                ) : codeFlag != -1 ? (
                  <IconFont type={`icon-${element.menuCode}`} />
                ) : (
                  <IconFont type={`icon-default`} />
                );
              delete element.path;
            } else {
              array[index]['icon'] =
                iconFlag != -1 ? (
                  <IconFont type={`icon-${element.menuIcon}`} />
                ) : codeFlag != -1 ? (
                  <IconFont type={`icon-${element.menuCode}`} />
                ) : (
                  <IconFont type={`icon-default`} />
                );
            }
            array[index]['routes'] = element.children;

            if (element.children && element.children.length != 0) {
              array[index]['redirect'] = element.children[0].path;
              loop(element.children,menusList);
            }
            console.log('element===',element);
            menusList.push(element);
          }
          return array;
        };
        if (data.data.menus.length != 0) {
          //将值变成平铺
          let menusList = [];
          let menusA = loop(data.data.menus,menusList);
          localStorage.setItem('menusList',JSON.stringify(menusList))
          console.log('menusList==',menusList);
          menusA.push({
            name: '首页',
            path: '/',
            key: '/',
            hideInMenu: true,
          });
          yield put({
            type: 'updateStates',
            payload: {
              menus: menusA,
              key: key + 1,
              menusUrlList:menusList
            },
          });

          window.localStorage.setItem('menus', JSON.stringify(menusA));
        } else {
          window.localStorage.setItem('menus', '');
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        callback && callback(data);
        message.error(data.msg, 5);
      }
    },
    *getMenusObj({},{call, put, select }){
      const { data } = yield call(apis.getMenusObj,{},'getMenusObj','user');
      if(data.code==REQUEST_SUCCESS){
        yield put({
          type:'updateStates',
          payload:{
            menuObj:data.data.menus
          }
        })
        GETMENUOBJ=()=>{
          return data.data.menus;
        }
      }else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    //获取插件分类列表
    *getPlugType({ payload, callback }, { call, put, select }) {
      try {
        payload.tenantId = window.localStorage.getItem('tenantId');
        const { data } = yield call(apis.getPlugTypeList, payload);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
          const pwd = window.localStorage.getItem('pkeys'); //当前用户密码
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
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getBaseset({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getBaseset, payload);
        if (data.code == REQUEST_SUCCESS) {
          window.localStorage.setItem('abilityCodes', data.data.abilityCodes); //能力 (顶部图标)
          window.localStorage.setItem('personConfig', data.data.personConfig); //功能操作
          window.localStorage.setItem('tableConfig', data.data.tableConfig); //主题设置
          window.localStorage.setItem('supportCopyright', data.data.copyRight); //支撑平台首页版权
          window.localStorage.setItem(
            'bussinessCopyright',
            data.data.copyRight,
          ); //业务平台首页版权
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


            location.href =
              desktopType == 3 ||
              (tableConfig?.TABLE_CUSTOM?.substr(0, 1) == 1 &&
                tableConfig?.TABLE_CUSTOM?.substr(2, 1) == 1)
                ? '#/business_application/customPage'
                : '#/business_application';


          }
        } else if (data.code != 401) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log('e',e);
      } finally {
      }
    },
    *getLogo({ payload, callback }, { call, put, select }) {
      //获取首页logo
      try {
        const { data } = yield call(apis.getLogo, payload);
        if (data.code == REQUEST_SUCCESS) {
          if (data.data.list.length != 0) {
            let flag = data.data.list.findIndex(item => {
              return item.isEnable == 1;
            });
            window.localStorage.setItem(
              'firstLogo',
              data.data.list[flag].logoUrl,
            ); //首页logo
          }
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getIdentityDatarule({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getIdentityDatarule, payload);
      if (data.code == 200) {
        callback && callback(data?.data?.maxDataruleCode);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
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
