import { history } from 'umi';
import apis from 'api';
import { message, notification } from 'antd';
import { REQUEST_SUCCESS } from '../service/constant';
// import moment from 'moment';
import IconFont from '../Icon_manage';
import iconData from '../../public/icon_manage/iconfont.json';
import dayjs from 'dayjs'

const Model = {
  namespace: 'user',
  state: {
    msgLength: 0,
    isShowIM: false,
    idenVisible: false,
    identitys: [],
    identityId: '',
    postId: '',
    userName: '',
    clientType: '',
    refreshToken: '',
    menus: [],
    curUserInfo: {},
    portalArr: [],
    leavePostMsg: [],
    collapsed: false,
    menuObj:{},
    desktopTypeByModel: 0,
    registerId:'',
    backColor: []// 主题背景色
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {});
    },
  },
  effects: {
    *getLoginConfig({payload,callback},{call,put}){
      const {data} = yield call(apis.getLoginConfig,payload,'getLoginConfig','user')
      if(data.code == REQUEST_SUCCESS){
        callback&&callback(JSON.parse(data.data.backColor))
        window.localStorage.setItem('baseColor',data.data.backColor[0].color)
        window.localStorage.setItem('wpsSdkJson',data.data.wpsSdkJson)
        yield put({
          type: 'updateStates',
          payload: {
            backColor: data.data.backColor
          }
        })
      }else {
        message.error(data.msg);
      }
    },
    // 获取登录配置
    *getTentantId({payload,callback},{call,put}){
      const {data} = yield call(apis.getTentant,payload,'getTentantId','user')
      if(data.code == REQUEST_SUCCESS){
        callback&&callback(data.data.tenantId)
      }else {
        message.error(data.msg);
      }
    },
    //获取当前用户的信息
    *getCurrentUserInfo({ payload,callback }, { call, put }) {
      const { data } = yield call(apis.getCurrentUserInfo, payload, 'getCurrentUserInfo', 'user');
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
        window.localStorage.setItem('postId', data.data.postId || ''); //岗人ID
        window.localStorage.setItem('pwdChangeTime', data.data.pwdChangeTime); //密码修改时间
        window.localStorage.setItem('isMergeTodo', data.data.isMergeTodo); //待办数据
        window.localStorage.setItem('pwdExprTime', data.data.pwdExprTime); //密码失效日期
        callback&&callback()
        const days = window.localStorage.getItem('pwexpireDays'); //提前几天提醒
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

        if (window.localStorage.getItem('pwvalidType') == 'VALID_PERIOD') {
          //密码有有效期
          console.log(
            'Number(data.data.pwdChangeTime)',
            Number(data.data.pwdChangeTime),
            Number(data.data.pwdChangeTime) + 24 * 60 * 60 * Number(days),
            dayjs().unix(),
            Number(data.data.pwdChangeTime) + 24 * 60 * 60 * Number(days) <=
            dayjs().unix(),
          );
          if (
            Number(data.data.pwdChangeTime) + 24 * 60 * 60 * Number(days) <=
            dayjs().unix()
          ) {
            //密码已失效

            alert(<span>您的密码已失效,请记得修改密码哦!</span>);
            return;
          }
          if (
            Number(data.data.pwdChangeTime) + 24 * 60 * 60 * Number(days) >
            dayjs().unix()
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
    *login({ payload,isChangeIdentity,callback,targetUrl,dispatch,registerId,isChangeIdentityMobile,isNotRefresh }, { call, put }) {
      const { data } = yield call(apis.login, payload, 'login', 'user');
      if (data.code == REQUEST_SUCCESS) {
        //将userToken存入localStorage中
        window.localStorage.setItem('userToken', data.data.userToken);
        window.localStorage.setItem('refreshToken', data.data.refreshToken);
        window.localStorage.setItem('clientType', data.data.clientType);
        window.localStorage.setItem('refreshTokenTime', 0);
        callback&&callback()
        let sysPlatType = 'PC';
        if (payload.toState && payload.toState == 'FRONT') {
          if(isChangeIdentityMobile){
            return
          }
          if(isChangeIdentity){//刷新身份的不再走下面逻辑
            // yield put({
            //   //获取当前登录用户信息
            //   type: 'getCurrentUserInfo',
            //   payload: {},
            //   callback:()=>{
            //     if(targetUrl){
            //       window.location.replace(targetUrl)
            //     }
            //     // window.location.reload();
            //   }
            // });
            // yield put({
            //   type: 'updateStates',
            //   payload: {
            //     registerId,
            //     identityId: payload?.identityId,
            //     idenVisible: false,
            //   },
            // });
            if(payload?.identityId&&!registerId&&!isNotRefresh){
              debugger
              window.location.reload();
            }
            return 
          }else{
            if(location.href.includes('/business_application?sys=portal')){
              location.href = '#/business_application?sys=portal&portalTitle=工作台';
            }else if(location.href.includes('/business_application/portal')){
              location.href = '#/business_application/portal';

            }else{
              location.href = '#/business_application';
            }
            sysPlatType = 'FRONT';
            // window.location.reload();
          }
        }
        if (payload.toState && payload.toState == 'PC') {
          location.href = '#/support';
          // window.location.reload();//先注释掉吧，忘记之前是为了改什么问题了
        }
        if(!isChangeIdentity){//切换前后平台 不再进行下面的操作，避免重复渲染， 切换身份需要获取菜单等接口
          return
        }
        if (payload.identityId) {
          yield put({
            type: 'getUserMenus',
            payload: {
              sysPlatType,
              identityId: payload.identityId,
            },
          });
        }

        yield put({
          type: 'updateStates',
          payload: {
            idenVisible: false,
            menus: [],
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
        });
        // yield put({
        //   //获取
        //   type: 'getRegisterByCode',
        //   payload: {
        //     registerCode: sysPlatType,
        //   },
        // });
        yield put({
          type: 'getBaseset',
          payload: {
            registerId: data.data.loginRegisterID,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
        window.localStorage.setItem('selfLogin', '0');
      }
    },
    //登出
    *logout({ payload }, { call, put }) {
      const { data } = yield call(apis.logout, payload, 'logout', 'user');
      if (data.code == REQUEST_SUCCESS) {
        //将userToken存入localStorage中
        window.localStorage.setItem('userToken', '');
        window.localStorage.setItem('selfLogin', '0');
        window.localStorage.setItem('userAccount', '');
        window.localStorage.setItem('tenantId', '');
        window.localStorage.setItem('clientType', '');
        window.localStorage.setItem('refreshToken', '');
        window.localStorage.setItem('secondLogo', '');
        const id = localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')).id
        : '';
        window.localStorage.setItem(`desktopType${id}`, 0);
        if(window.location.href.includes('portal')){
          location.href = '#/portalLogin'
        }else{
          location.href = '#/login';
        }
        //跳转到首页
        window.location.reload();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },

    //获取登录用户身份列表
    *getUserDentityList({ payload }, { call, put }) {
      const { data } = yield call(apis.getUserDentityList, payload, 'getUserDentityList', 'user');
      if (data.code == REQUEST_SUCCESS) {
        let newIdentitys = data.data.identitys&&data.data.identitys.filter((item) => { return item.dr == 0 })
        let currentData = data.data.identitys&&data.data.identitys.filter((item) => { return item.identityId == localStorage.getItem('identityId') })
        yield put({
          type: 'updateStates',
          payload: {
            identitys: newIdentitys,
            idenVisible: true,
            identityId: localStorage.getItem('identityId'),
            leavePostMsg:currentData,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    //获取当前身份菜单及按钮
    *getUserMenus({ payload, callback }, { call, put }) {
      const { data } = yield call(apis.getUserMenus, payload, 'getUserMenus', 'user');
      if (data.code == REQUEST_SUCCESS) {
        IDENTITYID = data.data?.identityId || '';
        
        const loop = (array,menusList) => {
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            array[index]['name'] = element.menuName;
            array[index]['key'] = element.menuId;
            array[index]['hideInMenu'] = element?.hidden==1?true:false
            // array[index]['icon'] = <IconFont type={`icon-${element.menuIcon}`}/>;
            var codeFlag = iconData.glyphs.findIndex((item) => {
              return item.font_class == element.menuCode;
            });
            var iconFlag = iconData.glyphs.findIndex((item) => {
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

              array[index]['iconName'] =
                iconFlag != -1
                  ? element.menuIcon
                  : codeFlag != -1
                  ? element.menuCode
                  : 'default';
            }
            array[index]['routes'] = element.children;
            menusList.push(array[index]);
            if (element.routes && element.routes.length != 0) {
              array[index]['redirect'] = element.children[0].path;
              loop(element.routes,menusList);
            }
          }
          return {tree:array,list:menusList};
        };
        callback && callback(data);

        if (data.data.menus.length != 0) {
          let tmpMenus = loop(data.data.menus,[]);
          let menus = tmpMenus['tree'];
          let menusList = tmpMenus['list'];
          menus.push({
            name: '个人桌面',
            path: '/',
            key: '/',
            hideInMenu: true,
          });
          function flatten(arr) {
            return [].concat(
              ...arr.map((item) => {
                if (item.children) {
                  let arr = [].concat(item, ...flatten(item.children));
                  // delete item.children;
                  return arr;
                }
                return [].concat(item);
              }),
            );
          }
          const menusArr = flatten(menus);
          let allmenusIdArr = [];
          let menusObj = {};
          let menusIconObj = {};
          let menusIdObj = {};
          for (let i = 0; i < menusArr.length; i++) {
            const element = menusArr[i];
            menusObj[element['menuId']] = element['iconName'];
            menusIconObj[element['menuId']] = element['menuImgUrl'];
            allmenusIdArr.push(element['menuId'])
          }
          const tmpArr = menusArr.filter((i) => i.path);

          // const hasLetter = (str) => {
          //   return /[a-zA-Z]/.test(str);
          // };

          for (let i = 0; i < tmpArr.length; i++) {
            const element = tmpArr[i];
            const arr = element?.path?.split('/');
            // if (!hasLetter(arr?.[2]) && !hasLetter(arr?.[3])) {
            menusIdObj[`${arr?.[2] || 0}-${arr?.[3] || 0}`] = element['menuId'];
            // }
          }

          setItem('menus', JSON.stringify(menus));
          setItem('menusList', JSON.stringify(menusList));//用于跳转获取name
          window.localStorage.setItem('allmenusIdArr', JSON.stringify(allmenusIdArr));
          window.localStorage.setItem(
            'bigIconKeyValArr',
            JSON.stringify(menusIconObj),
          );
          window.localStorage.setItem(
            'iconKeyValArr',
            JSON.stringify(menusObj),
          );
          window.localStorage.setItem(
            'menuIdKeyValArr',
            JSON.stringify(menusIdObj),
          );
          yield put({
            type: 'updateStates',
            payload: {
              menus,
            },
          });
        }else{
          yield put({
            type: 'updateStates',
            payload: {
              menus: []
            },
          });
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        callback && callback(data);
        message.error(data.msg, 5);
      }
    },
    //获取密码方案
    *getPasswordPolicy({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getPasswordPolicy, payload,'getPasswordPolicy','user');
        if (data.code == REQUEST_SUCCESS) {
          window.localStorage.setItem(
            'isModifyPwexpire',
            data.data.isModifyPwexpire,
          ); //密码过期提醒类型CLOSE：关闭 ALERT：提醒UPDATE：强制修改
          window.localStorage.setItem('pwvalidDays', data.data.pwvalidDays); //过期前多少天提醒
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
          const strongRegex =
            /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[!@#\$%\^&\*])[0-9A-Za-z!@#\$%\^&\*)]{8,16}$/;
          const mediumRegex =
            /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])[0-9A-Za-z]{8,15}$/;
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
    *getMenusObj({},{call, put, select }){
      const { data } = yield call(apis.getMenusObj,{},'getMenusObj','user');
      if(data.code==REQUEST_SUCCESS){
        yield put({
          type:'updateStates',
          payload:{
            menuObj:data.data.menus
          }
        })
        GETMENUOBJ=()=>{//这个用于historypush 中获取menuObj
          return data.data.menus;
        }
      }else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *updatePassword({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.updatePassword, payload,'updatePassword','user');
        if (data.code == REQUEST_SUCCESS) {
          notification['success']({
            message: '提示',
            description: <span>密码修改成功,3秒后将自动跳转登录页面!</span>,
            duration: 3,
          });
          setTimeout(() => {
            if (window.location.href.includes('portal')) {
              location.href = '#/portalLogin';
            } else {
              location.href = '#/login';
            }
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
        const { data } = yield call(apis.getRegisterByCode, payload,'getRegisterByCode','user');
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getBaseset',
            payload: {
              registerId: data.data.id,
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
        const { data } = yield call(apis.getBaseset, payload,'getBaseset','user');
        if (data.code == REQUEST_SUCCESS) {
          window.localStorage.setItem('abilityCodes', data.data.abilityCodes); //能力 (顶部图标)
          window.localStorage.setItem('personConfig', data.data.personConfig); //功能操作
          window.localStorage.setItem('tableConfig', data.data.tableConfig); //主题设置
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *mergeData({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.mergeData, payload,'mergeData','user');
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            //获取当前登录用户信息
            type: 'getCurrentUserInfo',
            payload: {},
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          window.localStorage.setItem(
            'isMergeTodo',
            payload.isMergeTodo == 1 ? 0 : 1,
          ); //待办数据合并状态
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getMessageList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getMessageList, payload,'getMessageList','user');
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            msgLength: data.data?.list?.filter((item) => item.msgStatus == 0)
              .length,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },

    *getUrlByBSId({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getUrlByBSId, payload,'getUrlByBSId','user');
      if (data.code == 200) {
        callback && callback(data.data.url);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *getIdentityDatarule({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getIdentityDatarule, payload,'getIdentityDatarule','user');
      if (data.code == 200) {
        callback && callback(data?.data?.maxDataruleCode);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *deleteICRedis({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.deleteICRedis, payload,'deleteICRedis','user');
      if (data.code == 200) {
        callback && callback(data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *getDictInfoList({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getDictInfoList, payload, 'getDictInfoList', 'user');
      if (data.code == 200) {
        window.sessionStorage.setItem('dictsList',JSON.stringify(data?.data?.dicts))
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getRegister({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getRegister, payload,'getRegister','user',{callback});
        if (data.code == REQUEST_SUCCESS) {
          callback&&callback(data)
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addApp({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.addApp, payload,'addApp','user');
        if (data.code == REQUEST_SUCCESS) {
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getSocketTest({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getSocketTest, payload,'getSocketTest','user',{callback});
        if (data.code == REQUEST_SUCCESS) {
          console.log('WS',data);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
