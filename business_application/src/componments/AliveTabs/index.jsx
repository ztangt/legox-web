
import { useHistory, useLocation, getDvaApp } from 'umi';
import { Tabs, Popover, Dropdown, Menu } from 'antd';
import defaultMenu from './_defaultMenu';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import _ from 'lodash';
import defaultSpace from './_defaultNameSpace';
import styles from './index.less';
import { DownOutlined } from '@ant-design/icons';
import { getButton, getUrlParams } from '../../util/util';
function KeepAliveTabs({
  dispatch,
  menus,
  onChangeLayout,
  desktopLayout,
  formShow,
  setState,
}) {
  const { showDesktopTab } = desktopLayout;
  const { TabPane } = Tabs;
  const history = useHistory();
  const location = useLocation();
  const bizSolId = location.query.bizSolId;
  const bizInfoId = location.query.bizInfoId;
  const currentTab = location.query.currentTab; //用于区别新打开的新增页
  const { stateObj } = formShow;
  // 无tab路由添加白名单
  const white_space = ['/business_cma/cmaHome', 'customPage'];
  var search =
    location.search.includes('?') || !location.search
      ? location.search
      : `?${location.search}`;
  // var searchLength = search?.split('?')?.[1]?.split('&')?.length
  // // if(searchLength==1&&search?.includes('maxDataruleCode')){
  // //   search = ''
  // // }
  // // console.log('search',search);
  const teantMark = window.location.pathname.split('/')[1];
  const getCachingNodes = []
  const dropScope = ()=>{}
  const refresh = () =>{}
  const refreshScope = () =>{}
  const clear = () =>{}

  let cachingNodes = getCachingNodes();
  // 添加白名单中没有tabs的页面关闭问题
  cachingNodes = cachingNodes.filter(
    (item) => !white_space.includes(item.pathname),
  );
  const tableConfig = JSON.parse(localStorage.getItem('tableConfig'));

  function dropTab(targetKey) {
    const callbackFn = () => {
      //targetKey = `${targetKey}${search}`
      // if (targetKey == '/desktopLayout') {
      //   dispatch({
      //     type: 'desktopLayout/updateStates',
      //     payload: {
      //       showDesktopTab: false,
      //     },
      //   });
      //   historyPush('/');
      //   // window.location.reload();
      //   return;
      // }
      if (targetKey == '/') {
        return;
      }
      if (cachingNodes.length == 1) {
        historyPush('/');
      }
      const pathname = search
        ? `${location.pathname}${search}`
        : location.pathname; //如果有参数需拼接参数匹配
      // console.log('targetKey=', targetKey);
      // console.log('cachingNodes=', cachingNodes);
      //node.name.split('?')[0]这种情况是为了formShow
      const curNodes = cachingNodes.filter(
        // (node) => node.name.split('?')[0] == targetKey,
        (node) => node.name == targetKey,
      );
      let curNode = curNodes[0];
      if (pathname === targetKey || pathname.includes(targetKey)) {
        //pathname相等
        dropScope(targetKey);
        // console.log("targetKey",targetKey)
        // debugger;
        //点击“x“关闭中间的页签，页面定位到被关闭的页签后面的页签；
        //let node = cachingNodes.filter((node) => node.name !== targetKey).pop();
        let tmpCurrentIndex = _.findIndex(cachingNodes, { name: targetKey });
        // debugger;
        let node = cachingNodes[tmpCurrentIndex + 1];
        if (!node) {
          //点击“x“关闭最后一个页签，页面定位到前一个页签；
          node = cachingNodes[tmpCurrentIndex - 1];
        }
        historyPush(
          node?.search
            ? `${node.name}${node.search}`
            : node
            ? node.name
            : showDesktopTab
            ? '/desktopLayout'
            : '/',
        );
        // }
      } else {
        //debugger;
        dropScope(targetKey);
      }
      const returnModel = (namespace) => {
        var obj = _.find(getDvaApp()._models, { namespace: namespace }) || {}; //获取当前路径下的model
        // if(JSON.stringify(obj)=='{}'){
        //   returnModel(location.pathname.split('/')[1])
        // }else{
        return obj;
        // }
      };
      let namespace = defaultSpace[targetKey] || targetKey.split('/')[1];

      if (!namespace) {
        namespace = location.pathname.split('/')[1];
      }
      if (
        curNode?.name.split('?')[0].split('/')[2] != 'formShow' &&
        curNode?.name.split('?')[0].split('/')[2] != 'flowDetails' &&
        curNode?.name.split('?')[0].split('/')[2] != 'noticePage'
      ) {
        // let model = returnModel(namespace)
        // getDvaApp()._store.dispatch({//初始化model state中的值
        //   type: `${model.namespace}/updateStates`,
        //   payload:{
        //     ...model.state,
        //   }
        // })
      } else if (curNode?.name.split('?')[0].split('/')[2] == 'formShow') {
        //let tmpTargetKey = targetKey+search;
        const node = cachingNodes.filter((node1) => {
          return node1.name == targetKey;
        });
        // console.log('node[0]=', node[0]);
        const params = getUrlParams(node[0].name);
        // console.log('params=', params);
        const bizSolId = params.bizSolId;
        const bizInfoId = params.bizInfoId;
        const currentTab = params.currentTab; //用于区别新打开的新增页
        // console.log('history.location=', history.location);
        let model = returnModel('formShow');
        // console.log(
        // "model.state.stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab]=",
        //   model.state.stateObj[bizSolId + '_' + bizInfoId + '_' + currentTab],
        // );
        getDvaApp()._store.dispatch({
          //初始化model state中的值
          type: `formShow/updateStates`,
          payload: {
            ...model.state,
            bizSolId,
            bizInfoId,
            currentTab,
          },
          isClear: true,
        });
      } else if (curNode?.name.split('?')[0].split('/')[2] == 'flowDetails') {
        const node = cachingNodes.filter((node) => node.name == targetKey);
        const params = getUrlParams(node[0].name);
        const bizInfoId = params.bizInfoId;
        let model = returnModel('flowDetails');
        getDvaApp()._store.dispatch({
          //初始化model state中的值
          type: `flowDetails/updateStates`,
          payload: {
            ...model.state,
            bizInfoId,
          },
          isClear: true,
        });
      }
    };
    callbackFn();
    // if (
    //   targetKey.includes('dynamicPage/formShow') &&
    //   location.query?.title != '查看'
    // ) {
    //   const node = cachingNodes.filter((node1) => {
    //     return node1.name == targetKey;
    //   });
    //   // console.log('node[0]=', node[0]);
    //   const params = getUrlParams(node[0].name);
    //   // console.log('params=', params);
    //   const tmpBizSolId = params.bizSolId;
    //   const tmpBizInfoId = params.bizInfoId;
    //   const tmpCurrentTab = params.currentTab; //用于区别新打开的新增页
    //   if (
    //     stateObj[tmpBizSolId + '_' + tmpBizInfoId + '_' + tmpCurrentTab]
    //       ?.cutomHeaders?.mainTableId
    //   ) {
    //     dispatch({
    //       //关闭表单页签清空发票redis缓存
    //       type: 'user/deleteICRedis',
    //       payload: {
    //         mainTableId:
    //           stateObj[tmpBizSolId + '_' + tmpBizInfoId + '_' + tmpCurrentTab]
    //             ?.cutomHeaders?.mainTableId,
    //       },
    //       callback: () => {},
    //     });
    //     callbackFn();
    //   } else {
    //     callbackFn();
    //   }
    // } else {
    //   callbackFn();
    // }
    // console.log("cachingNodes",cachingNodes)
  }

  function onEdit(targetKey, action) {
    if (action == 'remove') {
      dropTab(targetKey);
    }
  }
  const changeTabs = (name) => {
    var maxDataruleCodes = JSON.parse(
      localStorage.getItem('maxDataruleCodes') || '{}',
    );
    var maxDataruleCode = maxDataruleCodes[location.pathname];
    if (
      (name &&
        (name.includes('formShow') ||
          name.includes('noticePage') ||
          name.includes('information/add') ||
          name.includes('information/modify') ||
          name.includes('informationlist/detail'))) ||
      name == '/' ||
      name == '/desktop'
    ) {
      historyPush(name);
      return;
    }
    if (name?.includes('maxDataruleCode')) {
      historyPush(name);
    } else if (name?.includes('?') && !name?.includes('maxDataruleCode')) {
      historyPush(`${name}&maxDataruleCode=${maxDataruleCode}`);
    } else if (!name?.includes('?')) {
      historyPush(`${name}?maxDataruleCode=${maxDataruleCode}`);
    }
    setState({ selectedKeys: [] });
  };

  const menu = (
    <Menu className={styles.menus_all}>
      <Menu.Item
        onClick={() => {
          dropTab(`${location.pathname}${search}`);
        }}
      >
        关闭当前标签页
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          if (location.pathname !== '/desktopLayout') {
            dispatch({
              type: 'desktopLayout/updateStates',
              payload: {
                showDesktopTab: false,
              },
            });
          }
          //window.location.replace(`/${teantMark}/#/business_application${location.pathname}${search}`);
          // if(location.pathname.includes('formShow')){
          //   window.location.replace(`/${teantMark}/#/business_application${location.pathname}${search}`);
          // }else{
          //   window.location.replace(`/${teantMark}/#/business_application${location.pathname}`);
          // }
          //refresh();
          clear();
          //添加当前路径
        }}
      >
        关闭其他标签页
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          //refreshScope('/');
          historyPush('/');
          //window.location.replace(`/${teantMark}#/business_application`);
          clear();
          dispatch({
            type: 'desktopLayout/updateStates',
            payload: {
              showDesktopTab: false,
            },
          });
        }}
      >
        关闭全部标签页
      </Menu.Item>
    </Menu>
  );
  const homeChangeTabs = (name) => {
    changeTabs(name);
  };
  const renderSingleTab = () => {
    const initialPanes = [
      {
        title: '个人桌面',
        content: '/',
        key: 'desktop-1',
        show:
          !tableConfig || (tableConfig && tableConfig.TABLE_PERSON.substr(0, 1))
            ? 1
            : 0,
      },
      {
        title: '快捷桌面',
        content: '/fastDesktop',
        key: 'desktop-2',
        show:
          !tableConfig || (tableConfig && tableConfig.TABLE_FAST.substr(0, 1))
            ? 1
            : 0,
      },
      {
        title: '融合桌面',
        content: '/fusionDesktop',
        key: 'desktop-3',
        show:
          !tableConfig || (tableConfig && tableConfig?.TABLE_MIX?.substr(0, 1))
            ? 1
            : 0,
      },
      {
        title: '个人桌面',
        content: '/',
        key: 'desktop-4',
        show:
          !tableConfig ||
          (tableConfig && tableConfig?.TABLE_CUSTOM?.substr(0, 1))
            ? 1
            : 0,
      },
    ];
    // TODO setup type
    const id = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).id
      : '';
    const index = localStorage.getItem(`desktopType${id}`) || 0;
    debugger
    return initialPanes[index].show ? (
      <div
        // tab={initialPanes[index].title}
        // key={initialPanes[index].content}
        // closable={false}
        onClick={() => homeChangeTabs(initialPanes[index].content)}
      >
        {initialPanes[index].title}
      </div>
    ) : null;
  };
  const renderDesktopTab = () => {
    return showDesktopTab ? (
      <TabPane tab="桌面布局" key="/desktopLayout"></TabPane>
    ) : null;
  };
  const loopGetTab = (menus, node, defaultMenu) => {
    let tab = '';
    for (let index = 0; index < menus.length; index++) {
      const children = menus[index] && menus[index].routes;
      const i = _.findIndex(children, { path: node.name }); //从菜单中查找
      if (i != -1) {
        tab = children[i].name;
        break;
      } else {
        let flag = -1;
        for (let i = 0; i < children?.length; i++) {
          if (children[i]?.path && node?.pathname) {
            if (node.pathname.includes('dynamicPage')) {
              if (node.pathname.indexOf(children[i].path) > -1) {
                flag = i;
                continue;
              }
            } else {
              if (children[i].path === node.pathname) {
                flag = i;
                continue;
              }
              if (children[i].path.includes('?')) {
                if (children[i].path.split('?')?.[0] === node.pathname) {
                  flag = i;
                  continue;
                }
              }
            }
          }
        }
        if (flag != -1) {
          tab = children[flag].name;
          break;
        } else {
          tab = defaultMenu[node.name]
            ? defaultMenu[node.name]
            : defaultMenu[
                !node.pathname?.includes('/')
                  ? `${'/' + node.pathname}`
                  : node.pathname
              ]; //从配置菜单中查找
          if (!tab && children?.length) {
            // console.log('node==', node);
            tab = loopGetTab(children, node, defaultMenu);
            if (tab) {
              break;
            }
          }
          //break;
        }
      }
    }
    // console.log('tab====', tab);
    return tab;
  };



  return (
    <div className={styles.edit_card_tab} style={{ display: 'flex' }}>
      {/* <div className={styles.edit_home}>{renderSingleTab()}</div> */}
      <Tabs
        type="editable-card"
        onEdit={onEdit.bind(this)}
        onChange={changeTabs}
        activeKey={search ? `${location.pathname}${search}` : location.pathname}
      >
        {/* {renderSingleTab()} */}
        {/* {renderDesktopTab()} */}
        {menus &&
          cachingNodes.map((node) => {
            let tab = '';
            if (node.name.includes('informationList')) {
              tab = '资讯公告栏';
            } else if (
              (node.name &&
                (node.name.includes('formShow') ||
                  node.name.includes('onlyFromShow') ||
                  node.name.includes('noticePage') ||
                  node.name.includes('information/add') ||
                  node.name.includes('information/modify') ||
                  node.name.includes('informationlist/detail')))
            ) {
              tab = node.title;
              if (node.title == 'view') {
                tab = '查看';
              }
            } else {
              if (menus.length == 0) {
                tab = defaultMenu[node.name]
                  ? defaultMenu[node.name]
                  : defaultMenu[node.pathname]; //从配置菜单中查找
              } else if (node.name.includes('notificationList')) {
                tab = '通知公告栏';
              } else {
                const menusList = menus.filter((i) => !i.hideInMenu);
                let firstKey = -1;
                for (let i = 0; i < menusList?.length; i++) {
                  if (menusList[i]?.path && node?.pathname) {
                    if (node.pathname.includes('dynamicPage')) {
                      if (node.pathname.indexOf(menusList[i].path) > -1) {
                        firstKey = i;
                        continue;
                      }
                    } else {
                      if (menusList[i].path === node.pathname) {
                        firstKey = i;
                        continue;
                      }
                      if (menusList[i].path.includes('?')) {
                        if (
                          menusList[i].path.split('?')?.[0] === node.pathname
                        ) {
                          firstKey = i;
                          continue;
                        }
                      }
                    }
                  }
                }
                if (firstKey != -1) {
                  tab = menus[firstKey].name;
                } else {
                  //二级及其以下
                  tab = loopGetTab(menus, node, defaultMenu);
                  // 下钻页面
                  if (node.name.includes('title=')) {
                    // console.log('tab333====', tab, menus, node, defaultMenu);
                    const url = node.name;
                    const params = new URLSearchParams(url.slice(url.indexOf("?") + 1));
                    const nameValue = params.get("title");
                    tab = nameValue
                  }
                }
              }
            }

            return <TabPane tab={tab} key={node.name}></TabPane>;
          })}
      </Tabs>

      {cachingNodes && cachingNodes.length > 0 && (
        <Dropdown overlay={menu}>
          <div className={styles.close_button}>
            关闭
            <DownOutlined style={{ marginLeft: 3 }} />
          </div>
        </Dropdown>
      )}
    </div>
  );
}

export default connect(({ desktopLayout, formShow }) => ({
  desktopLayout,
  formShow,
}))(KeepAliveTabs);
