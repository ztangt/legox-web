import ProLayout,{
DefaultFooter,
SettingDrawer
} from '@ant-design/pro-layout';
import { connect } from 'dva';
import React,{ createContext } from 'react';
import { history,Outlet ,useOutletContext} from 'umi';
import RightContent from '../componments/GlobalHeader/RightContent';
import PortalHeader from '../componments/portalHeader';
import IconFont from '../Icon_manage';
import ColumnBacklog from '../pages/index/componments/columnBacklog';
import ColumnFollow from '../pages/index/componments/columnFollow';
import ColumnProfile from '../pages/index/componments/columnProfile';
import styles from './index.less';
import TabContainer from './tabContainer';
import { v4 as uuidv4 } from 'uuid';
import { Spin } from 'antd';
import ModifyPwd from '../componments/modifyPwd';
import { parse } from 'query-string';
import business_logo_new from '../public/assets/business_logo_new.png';
import {getUrlParams,renderHTML,getUrlParamValue} from '../../src/util/util';
import cls from 'classnames'
let key = -1;
export const MyContext = createContext();

@connect(({ user }) => ({
  user,
}))
export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    const id = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).id
      : '';
    this.state = {
      settings: localStorage.getItem('skinPeeler_business')
        ? JSON.parse(localStorage.getItem('skinPeeler_business'))
        : {
            fixSiderbar: true,
            fixedHeader: true,
            navTheme: 'light',
            primaryColor: '', // 默认取第一个颜色
            layout: 'mix',
            contentWidth: 'Fluid',
            splitMenus: false,
            menuHeaderRender: undefined,
            menu: {
              locale: true,
            },
            headerHeight: 48,
            title: '',
          },
      firstLogo: '',
      menuArray: [],
      isShow: false,
      selectedKeys: [],
      // openKeys: [],
      collapsed: true,
      tabActivityKey: '/',
      tabMenus: [
        {
          key: '/',
          title: '',
          // title: '个人桌面',
          href: '/',
        },
      ],
      bussinessCopyright: localStorage.getItem('copyRight') | '',
      tableConfig: JSON.parse(localStorage.getItem('tableConfig')),
      desktopType: localStorage.getItem(`desktopType${id}`) || 0,
      currentPathname: history.location.pathname,
      colorList: [],
      theme: 'dark'
    };
  }

  isCloseFooter(config) {
    let footer = document.querySelector('.regional-footer');
    // console.log('config', config);
    const isSet = config.footerRender == false ? false : true;
    // footer?.className.includes('ant-switch-checked')||
    let isChecked = isSet;
    // console.log('isChecked', isChecked);
    if (isChecked) {
      // 开启页脚
      localStorage.setItem('isShowFooter', true);
    } else {
      // 关闭页脚
      localStorage.setItem('isShowFooter', false);
    }
    footer?.addEventListener('click', () => {
      if (isChecked) {
        footer.classList.remove('ant-switch-checked');
      } else {
        footer.classList.add('ant-switch-checked');
      }
    });
  }
  changeRealDarkText() {
    let realDark = document.getElementsByClassName(
      'ant-pro-setting-drawer-block-checkbox-item-realDark',
    )[0];
    if (realDark) {
      realDark?.addEventListener('mouseover', () => {
        setInterval(() => {
          let tooltipInner =
            document.getElementsByClassName('ant-tooltip-inner')[0];
          if (tooltipInner) {
            tooltipInner.innerHTML = '暗色菜单风格';
          }
        }, 100);
      });
    }
  }
  onSettingChange(config) {
    if (localStorage.getItem('skinPeeler_business') && JSON.parse(localStorage.getItem('skinPeeler_business'))?.layout !== config?.layout) {
      this.props.dispatch({
        type: 'desktopLayout/updateStates',
        payload: {
          refreshTag: uuidv4(),
        },
      });
    }
    this.setState({ settings: config });
    localStorage.setItem('skinPeeler_business', JSON.stringify(config));
    this.changeRealDarkText();
    this.isCloseFooter(config);
    if(config?.layout=='top'){
      this.setState({theme: 'light'})
    }else{
      this.setState({theme: 'dark'})
    }
  }
  onChangeLayout(currentIndex) {
    const defaultSettings = this.state.settings;
    defaultSettings.splitMenus = false
    defaultSettings.menuHeaderRender = undefined // 设置默认
    defaultSettings.colorWeak = false
    if (currentIndex == 1) {
      defaultSettings.layout = 'top';
      this.setState({ settings: defaultSettings });
    } else {
      defaultSettings.layout = 'mix';
      this.setState({ settings: defaultSettings });
    }
  }

  onSetMixLayout() {
    const defaultSettings = this.state.settings;
    defaultSettings.layout = 'mix';
    this.setState({ settings: defaultSettings });
  }
  onGetTencentConfig(location,dispatch){

      dispatch({
        type: 'user/getTentantId',
        payload: {
          tenantMark: location,
        },
        callback:(tenantId)=>{
          dispatch({
            type: 'user/getLoginConfig',
            payload: {
              tenantId
            },
            callback:(backColor)=>{
              const local = localStorage.getItem('skinPeeler_business')? JSON.parse(localStorage.getItem('skinPeeler_business')):''
              if(local&&(!local.primaryColor)){
                const defaultSettings = this.state.settings;
                defaultSettings.primaryColor = backColor[0].color
                this.setState({
                  settings: defaultSettings
                })
              }
              this.setState({
                colorList: backColor
              })
            }
          })
        }
      })
  }
  componentDidMount() {
    const { user, dispatch } = this.props;
    const location = window.location.pathname.split('/')[1]
   
    // const { desktopTypeByModel } = user;
    // const id = localStorage.getItem('userInfo')
    //   ? JSON.parse(localStorage.getItem('userInfo')).id
    //   : '';
    // const desktopType =
    //   desktopTypeByModel || localStorage.getItem(`desktopType${id}`) || 0;
    // const defaultSettings = this.state.settings;
    // if (desktopType == 1) {
    //   defaultSettings.layout = 'top';
    //   this.setState({ settings: defaultSettings });
    //   let url = window.location.href;
    //   if (url.indexOf('layout=mix')) {
    //     location.href = url.replace('layout=mix', 'layout=top');
    //   }
    // }
    // if (desktopType == 0 || desktopType == 2) {
    //   defaultSettings.layout = 'mix';
    //   this.setState({ settings: defaultSettings });
    //   let url = window.location.href;
    //   if (url.indexOf('layout=top')) {
    //     location.href = url.replace('layout=top', 'layout=mix');
    //   }
    // }

    this.setState({ firstLogo: localStorage.getItem('firstLogo')});
    // if (event.key == 'firstLogo') {
    //   this.setState({ firstLogo: event.newValue });
    // }
    // setTimeout(()=>{
    //   this.getMenusObj(dispatch)
    // },100)
    if (window.location.href.includes('/business_application')) {
      this.onGetTencentConfig(location,dispatch)
      // if (history.location.pathname != '/business_application/portal') {
        if(!history.location.pathname.includes('/business_application/mobile')){
          dispatch({
            type: 'user/getMenusObj',
          });
        }
        dispatch({
          type: 'user/getDictInfoList',
          payload: {},
        });
        dispatch({
          type: 'user/getCurrentUserInfo',
          payload: {},
        });
      // }
      GETTABS = () => {
        return this.state.tabMenus;
      };
      GET_TAB_ACTIVITY_KEY = () => {
        return this.state.tabActivityKey;
      };
      UPDATETABS = (item) => {
        Promise.resolve().then(() => {
          this.setState(item);
        });
      };
      const footer = document.getElementById('pro_layout_footer')
      if(footer&&!footer?.childNodes?.length){
        const element = renderHTML(localStorage.getItem('bussinessCopyright'));
        footer.appendChild(element.cloneNode(true));
      }
    }

    if (
      history.location.pathname.startsWith('/business_application') &&
      history.location.pathname !== '/business_application' &&
      !history.location.pathname.startsWith('/business_application/mobile') &&
      !history.location.pathname.startsWith('/business_application/portal')
    ) {
      const params = new URLSearchParams(history.location.search);
      const query = {};

      for (let p of params) {
        query[p[0]] = p[1];
      }

      let tmpInfo = historyPush(
        {
          pathname: history.location.pathname.replace(
            '/business_application',
            '',
          ),
          query,
        },
        '',
        true,
      );
      tmpInfo.then((data)=>{
        this.setState({ ...data });
      })
    }
    history.listen(({ location }) => {
      if (this.state.currentPathname != location.pathname) {
        this.setState({ currentPathname: location.pathname });
      }
    });
    setTimeout(()=>{
      const documentTitle = window.localStorage.getItem('pageName')||''
      document.title = documentTitle
    },400)
  }
  // getMenusObj(dispatch){
  //   dispatch({
  //     type:'user/getMenusObj'
  //   })
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('nextProps', nextProps,prevState,this);
    const { dispatch } = nextProps;
    const { menus,registerId } = nextProps.user;
    if(registerId&&registerId!=prevState?.registerId
      // ||identityId!=prevState?.identityId
      ){
      if(!history.location.pathname.includes('/business_application/mobile')){
        dispatch({
          type: 'user/getMenusObj',
        });
      }
      dispatch({
        type: 'user/getDictInfoList',
        payload: {},
      });
      dispatch({
        type: 'user/getCurrentUserInfo',
        payload: {},
      });
    }
    // if (
    //   !history.location.pathname.includes('/business_application') &&
    //   !history.location.pathname.includes('/login')
    // ) {
      if(window.location.href.includes('/business_application/mobile') && window.location.href.includes('userToken')){
        window.localStorage.setItem('userToken',parse(history.location.search).userToken)
      }
    if (!localStorage.getItem('userToken')) {
      if (window.location.href.includes('portal')) {
        location.href = '#/portalLogin';
      } else {
        location.href = '#/login';
      }
      return;
    }
    if(window.location.href.includes('/business_application/mobile')){//手机端不掉其他接口了
      return
    }
    let key = menuKey
    if (
      (history.location.pathname.includes('/business_application') &&
      history.location.pathname != '/business_application/portal' &&
      menus.length == 0 &&
      menuKey == -1)||
      registerId!=prevState?.registerId
      // ||identityId!=prevState?.identityId
      // && !loading.effects['user/getUserMenus']
    ) {
      menuKey = key + 1;
      let payload =  {
        sysPlatType: 'FRONT',
      }
      if(localStorage.getItem('registerId')&&localStorage.getItem('menuType')){
        payload = {
          type: localStorage.getItem('menuType'),
          registerId: localStorage.getItem('registerId')
        }
      }
      dispatch({
        type: 'user/getUserMenus',
        payload,
        callback: (data) => {
          if (data.code == '419' || data.code == '401' || data.code == '403') {
            menuKey = -1;
          } else if (data.code != 200 || data.data.menus.length == 0) {
            menuKey = 0;
          }
        },
      });
    } 
    if(menus.length!=0){
      menuKey = -1;
    }
    // else {
    //   key = -1;
    // }
    // }
    return {registerId};
    // return null;
  }

  //当前的mune显示问题
  // locationFn = () => {
  //   const { bizSolId, listId, formId, title, url, pageId } = history.location.query;
  //   const { pathname, search } = history.location;

  //   if (
  //     pathname == '/dynamicPage' ||
  //     pathname == '/dynamicPage/formShow' ||
  //     pathname == '/dynamicPage/flowDetails'
  //   ) {
  //     return {
  //       pathname: `/dynamicPage/${bizSolId}/${listId}/${formId}`,
  //     };
  //   } else if (
  //     pathname == '/notification/addNotice' &&
  //     title == 'view'
  //   ) {
  //     return {
  //       pathname: `/notificationList`,
  //     };
  //   } else if (pathname == '/budgetPage') {
  //     return {
  //       pathname: `/business_controls/${url}`,
  //     };
  //   } else if (pathname == '/meteorological') {
  //     let url = url;
  //     const params = pageId;

  //     if (params) {
  //       url = `${url}/${pageId}`;
  //     }
  //     return {
  //       pathname: `/business_cma/${url}`,
  //     };
  //   }
  //   else {
  //     return history.location;
  //   }
  // };
  setMenuItem = (item) => {
    if (!localStorage.getItem('sysMenuName')) {
      localStorage.setItem(
        'sysMenuName',
        JSON.stringify([
          { name: item.menuName, path: item.path, menuCode: item.menuCode ,dataRuleCode:item.dataRuleCode,menuId:item.menuId},
        ]),
      );
    } else {
      let sysMenuName = localStorage.getItem('sysMenuName');
      let newSysMenu = JSON.parse(sysMenuName);
      const i = _.findIndex(newSysMenu, { path: item.path });
      if (i >= 0) {
        newSysMenu.splice(i, 1);
      }
      if (newSysMenu.length >= 3) {
        newSysMenu.splice(newSysMenu.length - 1, 1);
        newSysMenu.unshift({
          name: item.menuName,
          path: item.path,
          menuCode: item.menuCode,
          dataRuleCode:item.dataRuleCode,
          menuId:item.menuId
        });
      } else {
        newSysMenu.unshift({
          name: item.menuName,
          path: item.path,
          menuCode: item.menuCode,
          dataRuleCode:item.dataRuleCode,
          menuId:item.menuId
        });
      }
      localStorage.setItem('sysMenuName', JSON.stringify(newSysMenu));
    }

  };
  setControlsPage(item) {
    this.addVisitedApp(item);
    this.getDataRuleCode(item, (maxDataruleCode) => {
      let arr = item.path?.split('/');
      arr = arr.filter((item) => item);
      const menuId = item.menuId;
      localStorage.setItem('menuId', menuId);
      localStorage.setItem('currentButtonId', '');
      debugger
      if (arr[0] == 'business_cma') {
        if (arr[2]) {
          // 气象
          historyPush({
            pathname: `/meteorological`,
            query: {
              microAppName: arr[0],
              pageId: arr[2], // 配置动态路由增加页面复用区分页面路由
              maxDataruleCode,
              url: arr[1], //url都放在最后一个，方便子项目的参数解析
              menuId:item.menuId
            },
            title: item.menuName,
            key: item.path,
          });
          return;
        }
        // 气象
        historyPush({
          pathname: `/meteorological`,
          query: {
            microAppName: arr[0],
            maxDataruleCode,
            url: arr[1], //url都放在最后一个，方便子项目的参数解析
            menuId:item.menuId
          },
          title: item.menuName,
          key: item.path,
        });
      }else if (arr[0] == 'business_cccf') {
        if (arr[2]) {
          // 消防
          historyPush({
            pathname: `/cccf`,
            query: {
              microAppName: arr[0],
              pageId: arr[2], // 配置动态路由增加页面复用区分页面路由
              maxDataruleCode,
              url: arr[1], //url都放在最后一个，方便子项目的参数解析
              menuId:item.menuId
            },
            title: item.menuName,
            key: item.path,
          });
          return;
        }
        // 消防
        historyPush({
          pathname: `/cccf`,
          query: {
            microAppName: arr[0],
            maxDataruleCode,
            url: arr[1], //url都放在最后一个，方便子项目的参数解析
            menuId:item.menuId
          },
          title: item.menuName,
          key: item.path,
        });
      } else if (arr[0] == 'main'||arr[0] == 'business_oa') {
        console.log('arr', arr);
        // 支撑
        historyPush({
          pathname: `/microPage`,
          query: {
            microAppName: arr[0],
            maxDataruleCode,
            url: arr[1], //url都放在最后一个，方便子项目的参数解析
            menuId:item.menuId
          },
          title: item.menuName,
          key: item.path,
        });
      } else {
        historyPush({
          pathname: `/budgetPage`,
          query: {
            microAppName: arr[0],
            maxDataruleCode,
            menuId: item.menuId,
            url: arr[1], //url都放在最后一个，方便子项目的参数解析
            menuId:item.menuId
          },
          title: item.menuName,
        });
      }
    });
  }

  getDataRuleCode(item, callback) {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getIdentityDatarule',
      payload: {
        menuId: item.menuId,
      },
      callback: (maxDataruleCode) => {
        const maxDataruleCodes = JSON.parse(
          localStorage.getItem('maxDataruleCodes') || '{}',
        );
        maxDataruleCodes[item.path] = maxDataruleCode;
        window.localStorage.setItem(
          'maxDataruleCodes',
          JSON.stringify(maxDataruleCodes),
        );
        callback && callback(maxDataruleCode|| 'UNDEFINED_NULL');
      },
    });
  }


  convertToObject(x) {
    const decodedX = decodeURIComponent(x);
    const params = new URLSearchParams(decodedX);
    const obj = {};
    for (const [key, value] of params) {
      obj[key] = value;
    }
    return obj;
  }

  //最近应用
  addVisitedApp(item) {
    const { dispatch } = this.props;
    const { menuId, menuName, menuCode, menuIcon, menuLink } = item;
    dispatch({
      type: 'user/addApp',
      payload: {
        menuId,
        menuName,
        menuLink,
        menuIcon: menuCode || menuIcon,
      },
    });
  }

  setDynamicPageLink(item) {
    this.addVisitedApp(item);
    this.getDataRuleCode(item, (maxDataruleCode) => {
      if(item.openType!='POP'){
        document.getElementById('pro-layout').setAttribute('menuid',item.menuId)
      }
      // window.localStorage.setItem('maxDataruleCode', maxDataruleCode);
      //localStorage.setItem('menuId', item.menuId);
      localStorage.setItem('currentButtonId', '');
      if (item.path.includes('chartPage')) {
        let arr = item.path?.split('/');
        if(item.openType=='POP'){//打开新窗口
          if(item.menuSource=='OUT'){
            window.open(item.menuLink);
          }else{
            let tmpUrl = `${window.location.origin}${window.location.pathname}`+
            `#/business_application/chartPage`+`
            ?id=${ arr?.[2]}&&maxDataruleCode=${maxDataruleCode}&&menuId=${item.menuId}`;
            window.open(tmpUrl);
          }
        }else{
          historyPush({
            pathname: '/chartPage',
            query: {
              id: arr?.[2],
              maxDataruleCode,
              menuId: item.menuId,
            },
            title: item.menuName,
          });
        }
      } else if (item.path.includes('?')) {
        let arr = item.path?.split('?');
        let obj = this.convertToObject(arr?.[1]);
        if(item.openType=='POP'){//打开新窗口
          if(item.menuSource=='OUT'){
            window.open(`${window.location.origin}${window.location.pathname}#/business_application${item.menuLink}`);
          }else{
            let tmpUrl = '';
            if(arr?.[1]){
              tmpUrl = `${window.location.origin}${window.location.pathname}`+
              `#/business_application${item.menuLink}`+`
              ?${arr?.[1]}&&maxDataruleCode=${maxDataruleCode}&&menuId=${item.menuId}`;
            }else{
              tmpUrl = `${window.location.origin}${window.location.pathname}`+
              `#/business_application${item.menuLink}`+`
              ?maxDataruleCode=${maxDataruleCode}&&menuId=${item.menuId}`;
            }
            window.open(tmpUrl);
          }
        }else{
          historyPush({
            pathname: item.menuLink,
            query: {
              ...obj,
              maxDataruleCode,
              menuId: item.menuId,
            },
            title: item.menuName,
          });
        }
      } else {
        if(item.openType=='POP'){//打开新窗口
          if(item.menuSource=='OUT'){
            window.open(`${window.location.origin}${window.location.pathname}#/business_application${item.menuLink}`);
          }else{
            let tmpUrl = `${window.location.origin}${window.location.pathname}#/business_application${item.path || item.redirect}?maxDataruleCode=${maxDataruleCode}&&menuId=${item.menuId}`;
            window.open(tmpUrl);
          }
        }else{
          historyPush({
            pathname: item.path || item.redirect,
            query: {
              maxDataruleCode,
              menuId: item.menuId,
            },
            title: item.menuName,
          });
        }
      }
      this.setMenuItem(item);
    });
  }

  setDynamicPage(bizSolId, listId, formId, otherBizSolId, item) {
    this.addVisitedApp(item);
    const { dispatch } = this.props;
    this.getDataRuleCode(item, (maxDataruleCode) => {
      localStorage.setItem('dataRuleCode', item.dataRuleCode);
      if(item.openType!='POP'){
        document.getElementById('pro-layout').setAttribute('menuid',item.menuId);
      }
      localStorage.setItem('currentMenuName', item.menuName);
      // localStorage.setItem('menuId', item.menuId);
      localStorage.setItem('currentButtonId', '');
      localStorage.setItem('bizSolId', bizSolId);
      localStorage.setItem('listId', listId);
      this.setMenuItem(item);
      if (bizSolId == 0) {
        if(item.openType=='POP'){
          if(item.menuSource=='OUT'){
            window.open(item.menuLink);
          }else{
            let tmpUrl = `${window.location.origin}${window.location.pathname}`+
            `#/business_application/dynamicPage`+
            `?bizSolId=${bizSolId}&&listId=${listId}&&formId=${formId}`+
            `&&otherBizSolId=${otherBizSolId}&&maxDataruleCode=${maxDataruleCode}`+
            `&&menuId=${item.menuId}&&title=${item.menuName}`;
            window.open(tmpUrl);
          }
        }else{
          historyPush({
            pathname: '/dynamicPage',
            query: {
              bizSolId,
              listId,
              formId,
              otherBizSolId,
              maxDataruleCode,
              menuId: item.menuId,
            },
            title: item.title,
            key: item.menuLink,
          });
        }
      } else {
        dispatch({
          type: 'user/getUrlByBSId',
          payload: {
            bizSolId,
          },
          callback: (url) => {
            if (url) {
              let arr = url.split('/');
              arr = arr.filter((item) => item);
              if(item.openType=='POP'){
                if(item.menuSource=='OUT'){
                  window.open(item.menuLink);
                }else{
                  let tmpUrl = `${window.location.origin}${window.location.pathname}`+
                  `#/business_application/dynamicPage`+
                  `?bizSolId=${bizSolId}&&microAppName=${arr[0]}&&url=${arr[1]}`+
                  `&&maxDataruleCode=${maxDataruleCode}`+
                  `&&menuId=${item.menuId}&&title=${item.menuName}`;
                  window.open(tmpUrl);
                }
              }else{
                historyPush({
                  pathname: `/dynamicPage`,
                  query: {
                    bizSolId,
                    microAppName: arr[0],
                    url: arr[1],
                    maxDataruleCode,
                    menuId: item.menuId,
                  },
                  title: item.title,
                });
              }
            } else {
              if(item.openType=='POP'){
                if(item.menuSource=='OUT'){
                  window.open(item.menuLink);
                }else{
                  let tmpUrl = `${window.location.origin}${window.location.pathname}`+
                  `#/business_application/dynamicPage`+
                  `?bizSolId=${bizSolId}&&listId=${listId}&&formId=${formId}&&otherBizSolId=${otherBizSolId}`+
                  `&&maxDataruleCode=${maxDataruleCode}`+
                  `&&menuId=${item.menuId}&&title=${item.menuName}`;
                  window.open(tmpUrl);
                }
              }else{
                historyPush({
                  pathname: '/dynamicPage',
                  query: {
                    bizSolId,
                    listId,
                    formId,
                    otherBizSolId,
                    maxDataruleCode,
                    menuId: item.menuId,
                  },
                  title: item.title,
                  key: item.menuLink,
                });
              }
            }
          },
        });
      }
    });
  }

  // 进入气象首页
  onGoCmaHome() {
    return;
    historyPush({
      pathname: `/meteorological`,
      query: {
        microAppName: 'business_cma',
        url: 'cmaHome',
      },
    });
  }

  render() {
    const {
      settings,
      routerTabs,
      firstLogo,
      menuArray,
      isShow,
      selectedKeys,
      collapsed,
      tabMenus,
      tabActivityKey,
      bussinessCopyright,
      tableConfig,
      desktopType,
      colorList,
      theme
    } = this.state;
    const { dispatch, user, registerId, identityId } = this.props;
    console.log("userrss",user,"settings",settings)
    /**
     * localStorage.getItem('skinPeeler_business')
        ? JSON.parse(localStorage.getItem('skinPeeler_business'))
        : {
            fixSiderbar: true,
            fixedHeader: true,
            navTheme: 'light',
            primaryColor:'', // 默认取第一个颜色
            layout: 'mix',
            contentWidth: 'Fluid',
            splitMenus: false,
            menuHeaderRender: undefined,
            menu: {
              locale: true,
            },
            headerHeight: 48,
            title: '',
          },
     *
     *
    */
    const { menus, desktopTypeByModel } = user;
    const isShowFooter = true;
    const query = parse(history.location.search);
    if (window.location.href.includes('/support')) {
      return <Outlet context={{ location: { ...history.location, query } }} />;
    }
    //气象的工资分解页面需要不带菜单
    if(window.location.href.includes('url=personSalaryBreakdown')){
      return <Outlet context={{ location: { ...history.location, query } }}/>;
    }

    if (
      window.location.href.includes('/mobile') ||
      window.location.href.includes('/customPage') ||
      window.location.href.includes('/mobile') ||
      window.location.href.includes('pdfPreview')||
      window.location.href.includes('filePreview')||
      window.location.href.includes('excelPreview')||
      window.location.href.includes('wpsRedTemplate')
    ) {
      return <Outlet />;
    }
    if (
      window.location.href.includes('portal') &&
      history.location.pathname != '/business_application' &&
      history.location.pathname != '/portalLogin'

    ) {
      return (
        <div className={styles.widthZero}>
          <ProLayout
            siderWidth={0}
            fixSiderbar
            collapsed={false}
            logo={() => (
              <img
                onClick={this.onGoCmaHome.bind(this)}
                src={localStorage.getItem('secondLogo') || business_logo_new}
              ></img>
            )}
            rightContentRender={(item) => (
              <>
                <RightContent />
                <br />
                {window.location.href.includes('portal') &&
                history.location.pathname != '/business_application/portal' ? (
                  <PortalHeader
                    setState={(item) => {
                      this.setState(item);
                    }}
                  />
                ) : (
                  ''
                )}
              </>
            )}
            footerRender={() => null}
            {...settings}
            className={
              window.location.href.includes('portal') &&
              history.location.pathname != '/business_application/portal'
                ? styles.portal_layout
                : styles.layout
            }
          >
            <div id={'dom_container'} style={{ height: '100%', width: '100%' }}>
              <Outlet context={{ location: { ...history.location, query } }} />
            </div>
          </ProLayout>
        </div>
      );
    }
    return (
      <Spin
        spinning={false}
        id={
          window.location.href.includes('portal')
            ? 'pro-portal-layout'
            : 'pro-layout'
        }
        menuid={getUrlParamValue(window.location.href,'menuId')}
      >
        <MyContext.Provider value={this.state.collapsed}>
          <ProLayout
            siderWidth={210}
            collapsed={collapsed}
            onCollapse={() => {
              this.setState({ collapsed: !collapsed });
            }}
            className={
              cls(window.location.href.includes('portal')
                ? styles.portal_noraml_layout
                : styles.layout,
                theme=='dark'&& settings.layout!='top'?'layout_dark':'')
            }
            menuDataRender={() => menus}
            title=" "
            menuProps={{
              theme,
              expandIcon: (props) => {
                if (props?.isOpen) {
                  return (
                    <IconFont
                      type={`icon-zhankaixiala`}
                      style={{ fontSize: 14}}
                      className={'layout_icon'}
                    />
                  );
                } else {
                  return (
                    <IconFont
                      type={`icon-zhankaishouqi`}
                      style={{ fontSize: 14}}
                      className={'layout_icon'}
                    />
                  );
                }
              },
              selectedKeys,
              subMenuCloseDelay: 0.5,
              onSelect: ({ item, key, keyPath, selectedKeys, domEvent }) => {
                this.setState({ selectedKeys });
              },
              inlineIndent: 16,
            }}
            fixSiderbar
            logo={() => (
              <img
                onClick={this.onGoCmaHome.bind(this)}
                src={
                  window.location.href.includes('portal')
                    ? localStorage.getItem('secondLogo') || business_logo_new
                    : firstLogo || business_logo_new
                }
              ></img>
            )}
            rightContentRender={(item) => (
              <>
                <RightContent
                  onChangeLayout={this.onChangeLayout.bind(this)}
                  onSetMixLayout={this.onSetMixLayout.bind(this)}
                />
                {window.location.href.includes('portal') &&
                history.location.pathname != '/business_application/portal' ? (
                  <PortalHeader
                    setState={(item) => {
                      this.setState(item);
                    }}
                  />
                ) : (
                  ''
                )}
              </>
            )}
            onMenuHeaderClick={(e) => console.log(e)}
            menuItemRender={(item, dom) => {
              this.props.dispatch({
                type:'msgNotice/updateStates',
                payload:{
                  isShowModal:false,
                }
              })
              if (item.path?.includes('dynamicPage')) {
                let bizSolId = 0,
                  listId = 0,
                  formId = 0,
                  otherBizSolId = '';
                const index = item.path.indexOf('?otherBizSolId');
                if (index > -1) {
                  otherBizSolId = item.path.slice(index + 15);
                  item.path = item.path.slice(0, index);
                }
                const arr = item.path.split('/');
                bizSolId = arr[2];
                listId = arr[3] || 0;
                formId = arr[4] || 0;

                return (
                  <a
                    onClick={this.setDynamicPage.bind(
                      this,
                      bizSolId,
                      listId,
                      formId,
                      otherBizSolId,
                      item,
                    )}
                    title={item.menuName?.length > 8 ? item.menuName : ''}
                  >
                    <div
                      className={styles.menuItem}
                      style={{
                        color:
                          theme == 'dark'?'#FFF':
                          item.parentId && item.parentId != '0'
                            ? '#666'
                            : '#333' /*marginLeft: item.parentId=='0'?-10:''*/,
                      }}
                    >
                      <p
                        className={styles.menuicon}
                        style={{
                          marginRight:
                            item.parentId && item.parentId != '0' ? '8px' : '',
                          fontSize:
                            item.parentId && item.parentId != '0'
                              ? '16px'
                              : '18px',
                        }}
                      >
                        {item.pro_layout_parentKeys &&
                          item.pro_layout_parentKeys.length > 0 &&
                          item.icon}
                      </p>
                      <p style={{ marginBottom: 0 }}>{dom}</p>
                    </div>
                  </a>
                );
              } else if (
                item.path?.includes('business_controls') ||
                item.path?.includes('business_cma') ||
                item.path?.includes('business_cccf') ||
                item.path?.includes('main')||
                item.path?.includes('business_oa')
              ) {
                return (
                  <a
                    onClick={this.setControlsPage.bind(this, item)}
                    title={item.menuName?.length > 8 ? item.menuName : ''}
                  >
                    <div
                      className={styles.menuItem}
                      style={{
                        color:
                          theme == 'dark'?'#FFF':
                          item.parentId && item.parentId != '0'
                            ? '#666'
                            : '#333' /**marginLeft: item.parentId=='0'?-10:''*/,
                      }}
                    >
                      <p
                        className={styles.menuicon}
                        style={{
                          marginRight:
                            item.parentId && item.parentId != '0' ? '8px' : '',
                          fontSize:
                            item.parentId && item.parentId != '0'
                              ? '16px'
                              : '18px',
                        }}
                      >
                        {item.pro_layout_parentKeys &&
                          item.pro_layout_parentKeys.length > 0 &&
                          item.icon}
                      </p>
                      {/* <p className={styles.menuicon} >
                      {item.pro_layout_parentKeys }
                    </p> */}
                      <p style={{ marginBottom: 0 }}>{dom}</p>
                    </div>
                  </a>
                );
              } else {
                return (
                  <a
                    onClick={this.setDynamicPageLink.bind(this, item)}
                    title={item.menuName?.length > 8 ? item.menuName : ''}
                  >
                    <div
                      className={styles.menuItem}
                      style={{
                        color:
                          theme == 'dark'?'#FFF':
                          item.parentId && item.parentId != '0'
                            ? '#666'
                            : '#333' /**marginLeft: item.parentId=='0'?-10:''*/,
                      }}
                    >
                      <p
                        className={styles.menuicon}
                        style={{
                          marginRight:
                            item.parentId && item.parentId != '0' ? '8px' : '',
                          fontSize:
                            item.parentId && item.parentId != '0'
                              ? '16px'
                              : '18px',
                          // display: settings.splitMenus?'none':'block'
                        }}
                      >
                        {item.pro_layout_parentKeys &&
                          item.pro_layout_parentKeys.length > 0 &&
                          item.icon}
                      </p>
                      <p style={{ marginBottom: 0 }}>{dom}</p>
                    </div>
                  </a>
                );
              }
            }}
            subMenuItemRender={(item, dom) => {
              const defaultSettings = this.state.settings;
              const ant =  document.querySelector('.ant-menu.ant-menu-dark')
              if(defaultSettings&&defaultSettings.layout == 'mix'){
                if(ant){
                  ant.style.background = '#333'
                }
              }
              return (
                <div
                  className={styles.menuItem}
                  style={{
                    color:
                      theme == 'dark'?'#FFF':
                      item.parentId && item.parentId != '0'
                        ? '#666'
                        : '#333' /**marginLeft: item.parentId=='0'?-10:''*/,
                  }}
                >
                  <p
                    className={styles.menuicon}
                    style={{
                      marginRight:
                        item.parentId && item.parentId != '0' ? '8px' : '',
                      fontSize:
                        item.parentId && item.parentId != '0' ? '16px' : '18px',
                    }}
                  >
                    {item.pro_layout_parentKeys &&
                      item.pro_layout_parentKeys.length > 0 &&
                      item.icon}
                  </p>
                  <p style={{ marginBottom: 0 }}>{dom}</p>
                </div>
              );
            }}
            {...settings}
            footerRender={()=><div id='pro_layout_footer' className={styles.layout_footer}></div>}
            // footerRender={() =>
            //   bussinessCopyright == 'null' || isShowFooter == 'false' ? (
            //     ''
            //   ) : (
            //     <DefaultFooter
            //       copyright={
            //         // '北京锐元同联科技有限公司'
            //         !bussinessCopyright
            //           ? '北京锐元同联科技有限公司'
            //           : bussinessCopyright
            //       }
            //       links={[]}
            //       style={{ whiteSpace: 'pre-wrap' }}
            //     />
            //   )
            // }
          >
            <div className={styles.fast_wrap} id="fast_wrap">
              {(!tableConfig &&
                (desktopTypeByModel == 1 || desktopType == 1)) ||
              ((desktopTypeByModel == 1 || desktopType == 1) &&
                tableConfig &&
                tableConfig.TABLE_FAST.substr(0, 1) == 1) ? (
                <div className={styles.left_wrap}>
                  <div
                    className={styles.column_content}
                    style={{ height: '20%' }}
                    // style={{ height: 'calc(20% - 6px)' }}
                  >
                    <ColumnProfile />
                  </div>
                  <div className={styles.column_content}>
                    <ColumnBacklog limit={5} showHeader={true} />
                  </div>
                  <div className={styles.column_content}>
                    <ColumnFollow limit={5} showHeader={true} />
                  </div>
                </div>
              ) : null}
              {menus.length ? (
                <TabContainer
                  tableConfig={tableConfig}
                  desktopType={desktopTypeByModel || desktopType}
                  tabActivityKey={tabActivityKey}
                  tabMenus={tabMenus}
                  setState={(item) => {
                    this.setState(item);
                  }}
                  dispatch={this.props.dispatch}
                  registerId={registerId}
                  identityId={identityId}
                />
              ) : null}
            </div>
          </ProLayout>
        </MyContext.Provider>
        <SettingDrawer
          enableDarkTheme={false}
          getContainer={() => document.getElementById('pro-layout')}
          settings={settings}
          hideHintAlert={true}
          hideCopyButton={true}
          onSettingChange={this.onSettingChange.bind(this)}
          disableUrlParams={true}
          colorList={colorList}
          className={'setting_drawer'}
        />
        <ModifyPwd />
      </Spin>
    );
  }
}
// export default Layout;
