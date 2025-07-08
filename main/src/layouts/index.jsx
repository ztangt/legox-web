import React, { useState } from 'react';
import { connect } from 'dva';
import { Link, history,Routes,Outlet } from 'umi';
import ProLayout, {
  SettingDrawer,
  DefaultFooter,
} from '@ant-design/pro-layout';
import defaultProps from './_defaultProps';
import styles from './index.less';
import RightContent from '../componments/GlobalHeader/RightContent';
import AliveTabs from '../componments/AliveTabs';
import { Spin, message } from 'antd';
import ModifyPwd from '../componments/modifyPwd';
import MenuItem from '../componments/MenuItem';
// import { useBeforeunload } from 'react-beforeunload';
import { Beforeunload } from 'react-beforeunload';
// import { useAliveController } from 'react-activation';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import IconFont from '../../Icon_manage';
import TabContainer from './tabContainer'
import { parse } from 'query-string';
import {renderHTML} from '../util/util'
MENU_KEY = -1;
const colorList = [
  { key: 'blue', color: '#1890ff' },
  { key: 'green', color: '#31A669' },
  { key: 'red', color: '#EA4A44' },
];
@connect(({ user, loading }) => ({
  user,
  loading,
}))
class Layout extends React.Component {
  constructor(props){
    super(props);
    var tabs = [{
      key:'/',
      title: '首页',
      href: '/',
      pathname: '/'
    }]
    var curKey = '/'
    const query = parse(history.location.search);    
    var  pathname = history.location.pathname
    if(pathname.includes('/support')){
      pathname = pathname.split('/support')[1]
    }
    // pathname = pathname.split("/")[1]
    if(pathname!='/'&&history.location.pathname!='/support'){
      curKey = GET_KEY(pathname,query)
      const title = GET_TITLE(pathname,query,curKey)
      const params = GET_PARAMS(query)
      console.log('curKey',curKey,title,params);
      tabs = [
        ...tabs,
        {
          key:curKey,
          title,
          href: window.location.href.split('support')[1],
          pathname: pathname,
          // query: params
          query,
          menuId:query.menuId,
          maxDataruleCode:query.maxDataruleCode
        }
      ]
    }
    this.state = {
    settings: localStorage.getItem('skinPeeler_support')
      ? JSON.parse(localStorage.getItem('skinPeeler_support'))
      : {
          fixSiderbar: true,
          fixedHeader: true,
          navTheme: 'light',
          primaryColor: '#1890ff',
          layout: 'mix',
          contentWidth: 'Fluid',
          splitMenus: false,
          title: '',
        },
    props: {
      settings: localStorage.getItem('skinPeeler_support')
        ? JSON.parse(localStorage.getItem('skinPeeler_support'))
        : {
            fixSiderbar: true,
            fixedHeader: true,
            navTheme: 'light',
            primaryColor: '#1890ff',
            layout: 'mix',
            contentWidth: 'Fluid',
            splitMenus: false,
            title: '',
          },
    },
    firstLogo: window.localStorage.getItem('firstLogo'),
    selectedKeys: [],
    openKeys: [],
    tabActivityKey:curKey,
    tabMenus:tabs,
  };
  }

  getMenu = (menus, dispatch) => {
    if (menus.length == 0 && MENU_KEY == -1) {
      MENU_KEY = MENU_KEY + 1;
      dispatch({
        type: 'user/getUserMenus',
        payload: {
          sysPlatType: 'PC',
        },
        callback: data => {
          if (data.code != 200 || data.data.menus.length == 0) {
            MENU_KEY = 0;
          }
        },
      });
    }
    if (menus.length != 0) {
      MENU_KEY = -1;
    }
  };


  isCloseFooter(config) {
    let footer = document.querySelector('.regional-footer');
    const isSet = config.footerRender == false ? false : true;
    // footer?.className.includes('ant-switch-checked')||
    let isChecked = isSet;
    if (isChecked) {
      // 开启页脚
      window.localStorage.setItem('isShowFooter', true);
    } else {
      // 关闭页脚
      window.localStorage.setItem('isShowFooter', false);
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
          let tooltipInner = document.getElementsByClassName(
            'ant-tooltip-inner',
          )[0];
          if (tooltipInner) {
            tooltipInner.innerHTML = '暗色菜单风格';
          }
        }, 100);
      });
    }
  }
  onSettingChange(config) {
    this.setState({ settings: config });
    localStorage.setItem('skinPeeler_support', JSON.stringify(config));
    this.changeRealDarkText();
    this.isCloseFooter(config);
  }



  componentDidMount() {
    const { user, dispatch } = this.props;
    const { settings } = this.state;
    if(window.location.href.includes('/cloud')){
      return
    }
    // settings['title'] = user.loginConfigInfo.pageName
    this.setState({
      settings,
    });

    // var root = document.getElementById('root-master').parentNode;
    // let beforeTime = 0;
    // let uploadTime = 0;
    // root.onbeforeunload = function(){
    //     // beforeTime = new Date().getTime();
    // }

    // root.onunload = function(){

    //   // if((uploadTime-beforeTime)<=5){//如果是关闭按钮，登出
    //     window.localStorage.clear();
    //   // }
    // }

    const id = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).id
      : '';
    const desktopType = localStorage.getItem(`desktopType${id}`) || 0;
    const defaultSettings = this.state.settings;
    if (desktopType == 1) {
      defaultSettings.layout = 'mix';
      this.setState({ settings: defaultSettings });
      // let url = window.location.href;
      // if (url.indexOf('layout=top')) {
      //   location.href = url.replace('layout=top','layout=mix');
      // }
    }
    // console.log("1234:",desktopType);

    window.addEventListener('storage', event => {
      if (event.key == 'firstLogo') {
        this.setState({ firstLogo: event.newValue });
      }
    });
    if(window.location.href.includes('/business_application')){
      return
    }
    GETTABS=()=>{
      return this.state.tabMenus
    }
    GET_TAB_ACTIVITY_KEY=()=>{
      return this.state.tabActivityKey
    }
    UPDATETABS=(item)=>{
      Promise.resolve().then(()=>{
        this.setState(item);
      });
    }
    // this.getMenu(user?.menus,dispatch)
    dispatch({
      type: 'user/getMenusObj',
    });
    if(!window.location.href.includes('tenantSettings')){
      const tenantId = window.localStorage.getItem('tenantId');
      dispatch({
        type: 'user/getLoginConfig',
        payload: {
          tenantId
        },
        callback(value){
          document.title = value.pageName
        }
      })
    }  
  }
  // shouldComponentUpdate(props, state) {
  //   return (
  //     JSON.stringify(props.user.menus) !=
  //       JSON.stringify(this.props.user.menus) ||
  //     JSON.stringify(state.settings) != JSON.stringify(this.state.settings) ||
  //     JSON.stringify(state.firstLogo) != JSON.stringify(this.state.firstLogo) ||
  //     // JSON.stringify(state.isShow)!=JSON.stringify(this.state.isShow)||
  //     JSON.stringify(state.selectedKeys) !=
  //       JSON.stringify(this.state.selectedKeys) ||
  //     JSON.stringify(state.openKeys) != JSON.stringify(this.state.openKeys) ||
  //     JSON.stringify(state.collapsed) != JSON.stringify(this.state.collapsed) ||
  //     props.children != this.props.children
  //   );
  //   //  props.user.collapsed!= this.props.collapsed
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    const footer = document.getElementById('pro_layout_footer')
    if(footer&&!footer?.childNodes?.length){
      const element = renderHTML(localStorage.getItem('supportCopyright'));
      footer.appendChild(element.cloneNode(true));
    } 
    const { dispatch } = nextProps;
    // console.log('this',nextProps)
    const { loginConfigInfo, menus } = nextProps.user;
    const { settings } = prevState.props;
    if(window.location.href.includes('/cloud')){
      return
    } 
    // if (loginConfigInfo.pageName != settings.title
    //   ) {
    //     settings['title']= loginConfigInfo.pageName
    // 	return {
    //     settings,
    // 		props : {
    // 			settings,
    // 		}
    // 	}
    // }
    if (history.location.pathname.includes('/login')) {
      MENU_KEY = -1;
    }
    if (
      !history.location.pathname.includes('/business_application') &&
      !history.location.pathname.includes('/login') &&
      !history.location.pathname.includes('/unSet') &&
      !history.location.pathname.includes('/designer/formDesigner')
    ) {
      if (!localStorage.getItem('userToken')) {
        location.href = '#/login';
        window.localStorage.setItem('userToken', '');
        return;
      }
      console.log('key', MENU_KEY, menus.length);
      // debugger;
      // if (menus.length == 0 && key == -1) {
      if (menus.length == 0 && MENU_KEY == -1) {
          if (
          window.location.href.includes('/cloud/applyConfig') ||
          window.location.href.includes('/cloud/designer/formDesigner')||
          window.location.href.includes('/business_application')
        ) {
          return;
        }
        // debugger;

        MENU_KEY = MENU_KEY + 1;
        dispatch({
          type: 'user/getUserMenus',
          payload: {
            sysPlatType: 'PC',
          },
          callback: data => {
            if (
              data.code == '419' ||
              data.code == '401' ||
              data.code == '403'
            ) {
              MENU_KEY = -1;
            } else if (data.code != 200 || data.data.menus.length == 0) {
              MENU_KEY = 0;
            }
          },
        });
      }
      if (menus.length != 0) {
        MENU_KEY = -1;
      }
    }

    return null;
  }

  //当前的mune显示问题
  // locationFn = () => {
  //   if (history.location.pathname == '/applyModelConfig') {
  //     return {
  //       pathname: `/applyModel`,
  //     };
  //   } else {
  //     return history.location;
  //   }
  // };
  getDataRuleCode(item, callback) {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getIdentityDatarule',
      payload: {
        menuId: item.menuId,
      },
      callback,
    });
  }
  setDynamicPageLink(item) {
    this.getDataRuleCode(item, maxDataruleCode => {
      localStorage.setItem('menuId', item.menuId);
      localStorage.setItem('currentButtonId', '');
      var maxDataruleCodes = JSON.parse(
        localStorage.getItem('maxDataruleCodes') || '{}',
      );
      maxDataruleCodes[item.path] = maxDataruleCode;
      window.localStorage.setItem(
        'maxDataruleCodes',
        JSON.stringify(maxDataruleCodes),
      );
      // window.localStorage.setItem('maxDataruleCode', maxDataruleCode);
      if(item.path.includes('/business_application')){
        let arr = item.path?.split('/');
        arr = arr.filter((item) => item);
        let bizSolId = 0,
        listId = 0,
        formId = 0,
        otherBizSolId = '';
        const index = item.path.indexOf('?otherBizSolId');
        if (index > -1) {
          otherBizSolId = item.path.slice(index + 15);
          item.path = item.path.slice(0, index);
        }
        bizSolId = arr[2];
        listId = arr[3] || 0;
        formId = arr[4] || 0;
        if(bizSolId){
          if(item.openType=='POP'){//打开新窗口
            let tmpUrl = `${window.location.origin}${window.location.pathname}`+
            `#/support/microPage`+`
            ?maxDataruleCode=${maxDataruleCode}`+
            `&&url=${arr[1]}&&bizSolId=${bizSolId}&&listId=${listId}&&formId=${formId}&&otherBizSolId=${otherBizSolId}`+
            `&&title=${item.menuName}&&menuId=${item.menuId}`;
            window.open(tmpUrl);
          }else{
            historyPush({
              pathname: `/microPage`,
              query: {
                microAppName: arr[0],
                maxDataruleCode,
                menuId: item.menuId,
                url: arr[1],//url都放在最后一个，方便子项目的参数解析
                bizSolId,
                listId,
                formId,
                otherBizSolId,
                title: item.menuName,
                menuId: item.menuId,
              },
              title: item.menuName,
              key: item.path,
            });
          }
        }else{
          if(item.openType=='POP'){//打开新窗口
            let tmpUrl = `${window.location.origin}${window.location.pathname}`+
            `#/support/microPage`+`
            ?microAppName=${arr[0]}&&maxDataruleCode=${maxDataruleCode}`+
            `&&menuId=${item.menuId}&&url=${arr[1]}`;
            window.open(tmpUrl);
          }else{
            historyPush({
              pathname: `/microPage`,
              query: {
                microAppName: arr[0],
                maxDataruleCode,
                menuId: item.menuId,
                url: arr[1],//url都放在最后一个，方便子项目的参数解析
              },
              title: item.menuName,
              key: item.path,
            });
          }
        }
        return
      }
      if(item.openType=='POP'){//打开新窗口
        let tmpUrl = `${window.location.origin}${window.location.pathname}`+`#/support${item.path || item.redirect}`+`?maxDataruleCode=${maxDataruleCode}&&menuId=${item.menuId}`;
        window.open(tmpUrl);
      }else{
        historyPush({
          pathname: item.path || item.redirect,
          query: {
            maxDataruleCode,
            menuId: item.menuId,
          },
          title: item.menuName,
          key: item.path,
        });
      }
    });
  }

  render() {
    let {
      settings,
      routerTabs,
      firstLogo,
      selectedKeys,
      openKeys,
      tabActivityKey,
      tabMenus
    } = this.state;
    const { children, domId, user, loading, dispatch,route } = this.props;
    const { logos, menus } = user;
    const supportCopyright = window.localStorage.getItem('copyRight');

    const isShowFooter = window.localStorage.getItem('isShowFooter');
    let headerLogo = window.localStorage.getItem('firstLogo');
    if (!headerLogo) {
      // headerLogo = window.localStorage.getItem('firstLogo')
      headerLogo = require('../../public/assets/icap_logo.png');
    }
    console.log("history==00", history)
    if (
      history.location.pathname === '/login' ||
      history.location.pathname.includes('/designer') ||
      history.location.pathname.includes('/business_application') ||
      history.location.pathname.includes('/modifyPwd') ||
      history.location.pathname.includes('/cloud') ||
      history.location.pathname.includes('/unSet') ||
      window.location.href.includes('/cloud/applyConfig') ||
      window.location.href.includes('/cloud/designer/formDesigner')
      ||window.location.href.includes('designFlowable')||
      window.location.href.includes('/business_application')

    ) {
      // debugger;
      return (
        <>
          <Outlet/>
          <ModifyPwd />
        </>
      );
    }
    // 如果为打印模板界面
    if (history.location.pathname.includes('/templateEditor')) {
      return (
        <Spin
          spinning={false}
          id="pro-layout"
          key={menus}
          style={{
            height: '100vh',
          }}
        >
          <ProLayout
            siderWidth={210}
            className={styles.layout}
            // location={this.locationFn()}
            fixSiderbar
            logo={
              headerLogo
                ? headerLogo
                : require('../../public/assets/logo_tonglian.png')
            }
            rightContentRender={() => <RightContent />}
            onMenuHeaderClick={e => console.log(e)}
            title="  "
            menuRender={() => null}
            {...settings}
            footerRender={() =>
              supportCopyright == 'null' || isShowFooter == 'false' ? (
                ''
              ) : (
                <DefaultFooter
                  copyright={
                    supportCopyright &&
                    supportCopyright.length > 0 &&
                    supportCopyright != 'undefined'
                      ? supportCopyright
                      : '北京锐元同联科技有限公司'
                  }
                  links={[]}
                  style={{ whiteSpace: 'pre-wrap' }}
                />
              )
            }
          >
             <Outlet/>
          </ProLayout>
          <SettingDrawer
            enableDarkTheme={true}
            getContainer={() => document.getElementById('pro-layout')}
            settings={settings}
            hideHintAlert={true}
            onSettingChange={this.onSettingChange.bind(this)}
            disableUrlParams={true}
          />
          <ModifyPwd />
        </Spin>
      );
    }

    return (
      <Spin
        spinning={false}
        id="pro-layout"
        key={menus}
        style={{
          height: '100vh',
        }}
      >
        <ProLayout
          siderWidth={210}
          className={styles.layout}
          menuDataRender={() => menus}
          // location={history.location}
          // location={this.locationFn()}
          fixSiderbar
          logo={
            headerLogo
              ? headerLogo
              : require('../../public/assets/logo_tonglian.png')
          }
          menuProps={{
            expandIcon: props => {
              if (props?.isOpen) {
                return (
                  <IconFont
                    type={`icon-zhankaixiala`}
                    style={{ fontSize: 14 }}
                    className={'layout_icon'}
                  />
                );
              } else {
                return (
                  <IconFont
                    type={`icon-zhankaishouqi`}
                    style={{ fontSize: 14 }}
                    className={'layout_icon'}
                  />
                );
              }
            },
            selectedKeys,
            openKeys,
            subMenuCloseDelay: 0.5,
            onOpenChange: openKeys => {
              this.setState({ openKeys });
            },
            onSelect: ({ item, key, keyPath, selectedKeys, domEvent }) => {
              this.setState({ selectedKeys });
            },
            inlineIndent: 16
          }}
          rightContentRender={() => <RightContent />}
          onMenuHeaderClick={e => console.log(e)}
          menuItemRender={(item, dom) => {
            return (
              <a
                // to={item.path || item.redirect}
                onClick={this.setDynamicPageLink.bind(this, item)}
                title={item.menuName?.length>8?item.menuName:''}
              >
                <div
                  className={styles.menuItem}
                  style={{
                    color:
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
              </a>
            );
          }}
          subMenuItemRender={(item, dom) => {
            return (
              <div
                className={styles.menuItem}
                style={{
                  color:
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
          title="  "
          {...settings}
          footerRender={()=><div id='pro_layout_footer' className={styles.layout_footer}></div>}
          // footerRender={() =>
          //   supportCopyright == 'null' || isShowFooter == 'false' ? (
          //     ''
          //   ) : (
          //     <DefaultFooter
          //       copyright={
          //         supportCopyright &&
          //         supportCopyright.length > 0 &&
          //         supportCopyright != 'undefined'
          //           ? supportCopyright
          //           : '北京锐元同联科技有限公司'
          //       }
          //       links={[]}
          //       style={{ whiteSpace: 'pre-wrap' }}
          //     />
          //   )
          // }
        >
          {/* <AliveTabs
            setState={value => {
              this.setState(value);
            }}
          />
          {children} */}
          <TabContainer
            tabActivityKey={tabActivityKey}
            tabMenus={tabMenus}
            setState={(item)=>{
              this.setState(item)
            }}
            dispatch={this.props.dispatch}
            globalRoute={this.props.route}
          />

        </ProLayout>
        <SettingDrawer
          enableDarkTheme={true}
          getContainer={() => document.getElementById('pro-layout')}
          settings={settings}
          hideHintAlert={true}
          onSettingChange={this.onSettingChange.bind(this)}
          disableUrlParams={true}
          colorList={colorList}
        />
        <ModifyPwd />
      </Spin>
    );
  }
}

export default Layout;
