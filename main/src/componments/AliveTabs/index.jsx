// // import { useAliveController } from 'react-activation';
// import { useHistory, useLocation, getDvaApp, useSelector } from 'umi';
// import { Tabs, Popover, Dropdown, Menu } from 'antd';
// import defaultMenu from './_defaultMenu';
// import _ from 'lodash';
// import { connect } from 'dva';
// import defaultSpace from './_defaultNameSpace';
// import { DeleteRowOutlined } from '@ant-design/icons';
// import { jqueryUrl, getButton } from '../../util/util';
// import styles from './index.less';
// import { DownOutlined } from '@ant-design/icons';

// function KeepAliveTabs({ dispatch, desktopLayout,setState }) {
//   const { showDesktopTab } = desktopLayout;
//   const { TabPane } = Tabs;
//   const { menus } = useSelector(({ user }) => ({ ...user }));
//   const history = useHistory();
//   const location = useLocation();
//   var search =
//     location.search.includes('?') || !location.search
//       ? location.search
//       : `?${location.search}`;
//   var searchLength = search?.split('?')?.[1]?.split('&')?.length;
//   if (searchLength == 1 && search?.includes('maxDataruleCode')) {
//     search = '';
//   }
//   // console.log('search', search, searchLength);
//   const { getCachingNodes, dropScope, clear } = useAliveController();
//   const cachingNodes = getCachingNodes();
//   const teantMark = window.history.location.pathname.split('/')[1];

//   function dropTab(targetKey) {
//     if (targetKey == '/desktopLayout') {
//       dispatch({
//         type: 'desktopLayout/updateStates',
//         payload: {
//           showDesktopTab: false,
//         },
//       });
//       if (cachingNodes.length === 0) {
//         history.push('/');
//       } else {
//         history.push(cachingNodes[0].name);
//       }
//       // window.location.reload();
//       return;
//     }

//     console.log('targetKey', targetKey);
//     if (targetKey == '/') {
//       return;
//     }
//     if (cachingNodes.length == 1) {
//       history.push('/');
//     }
//     const pathname = search
//       ? `${history.location.pathname}${search}`
//       : history.location.pathname; //如果有参数需拼接参数匹配
//     if (pathname == targetKey) {
//       //pathname相等
//       dropScope(targetKey);
//       // 前往排除当前 node 后的最后一个 tab
//       let node = cachingNodes.filter(node => node.name !== targetKey).pop();

//       if (targetKey.includes('moudleDesign')) {
//         history.push('/listMoudles');
//       } else if (targetKey.includes('applyModelConfig')) {
//         history.push({
//           pathname: '/applyModel',
//         });
//       } else {
//         history.push(
//           node?.search
//             ? `${node.name}${node.search}`
//             : node
//             ? node.name
//             : showDesktopTab
//             ? '/desktopLayout'
//             : '/',
//         );
//       }
//     } else {
//       dropScope(targetKey);
//     }
//     const returnModel = namespace => {
//       var obj = _.find(getDvaApp()._models, { namespace: namespace }) || {}; //获取当前路径下的model

//       return obj;
//     };
//     let namespace = defaultSpace[targetKey] || targetKey.split('/')[1];
//     namespace = namespace.split('?')[0];
//     if (
//       namespace == 'userInfoManagement' &&
//       history.location.pathname == '/userInfoManagement/userView'
//       // namespace == 'userInfoManagement'
//     ) {
//       namespace = 'userView';
//     }
//     if (!namespace) {
//       namespace = history.location.pathname.split('/')[1];
//     }
//     if (targetKey.includes('moudleDesign')) {
//       namespace = `moudleDesign_${location.search.moudleId}`;
//     }

//     let model = returnModel(namespace);
//     if (namespace == 'applyModelConfig') {
//       getDvaApp()._store.dispatch({
//         //初始化model state中的值
//         type: `${model.namespace}/updateStatesInitial`,
//         payload: {
//           bizSolId: jqueryUrl(targetKey).bizSolId,
//         },
//       });
//     } else {
//       getDvaApp()._store.dispatch({
//         //初始化model state中的值
//         type: `${model.namespace}/updateStates`,
//         payload: {
//           ...model.state,
//         },
//       });
//     }
//      if(namespace == 'sysRole'||namespace == 'allRole'||namespace == 'unitRole'){
//       let model = returnModel('role');
//       getDvaApp()._store.dispatch({
//         //初始化model state中的值
//         type: `${model.namespace}/updateStates`,
//         payload: {
//         },
//         isClear:true,
//         currentPathName:targetKey
//       });
//     }
//   }

//   function onEdit(targetKey, action) {
//     if (action == 'remove') {
//       dropTab(targetKey);
//     }
//   }
//    const tabsChangeFn=(name)=>{
//     var maxDataruleCodes = JSON.parse(
//       localStorage.getItem('maxDataruleCodes') || '{}',
//     );
//     var maxDataruleCode = maxDataruleCodes[history.location.pathname];
//     if (name?.includes('maxDataruleCode')) {
//       history.push(name);
//     } else if (name?.includes('?') && !name?.includes('maxDataruleCode')) {
//       history.push(`${name}&maxDataruleCode=${maxDataruleCode}`);
//     } else if (!name?.includes('?')) {
//       history.push(`${name}?maxDataruleCode=${maxDataruleCode}`);
//     }
//     setState({selectedKeys:[]})
//   }
//   const changeTabs = name => {
//     tabsChangeFn(name)
//     dispatch({
//       type: 'user/updateStates',
//       payload: {
//         menus
//       },
//     });
//   };
//   const menu = (
//     <Menu>
//       <Menu.Item
//         onClick={() => {
//           dropTab(history.location.pathname);
//         }}
//       >

//         关闭当前标签页
//       </Menu.Item>
//       <Menu.Item
//         onClick={() => {
//           if (history.location.pathname !== '/desktopLayout') {
//             dispatch({
//               type: 'desktopLayout/updateStates',
//               payload: {
//                 showDesktopTab: false,
//               },
//             });
//           }
//           window.location.replace(
//             `/${teantMark}/#/support${history.location.pathname}`,
//           );
//           clear();
//         }}
//       >
//         关闭其他标签页
//       </Menu.Item>
//       <Menu.Item
//         onClick={() => {
//           window.location.replace(`/${teantMark}/#/support`);
//           clear();
//           dispatch({
//             type: 'desktopLayout/updateStates',
//             payload: {
//               showDesktopTab: false,
//             },
//           });
//         }}
//       >
//         关闭全部标签页
//       </Menu.Item>
//     </Menu>
//   );
//   const renderSingleTab = () => {
//     return <TabPane tab="首页" key="/" closable={false}></TabPane>;
//   };
//   const renderDesktopTab = () => {
//     return showDesktopTab ? (
//       <TabPane tab="桌面布局管理" key="/desktopLayout"></TabPane>
//     ) : null;
//   };
//   // 首页tab切换
//   const tabsHomeChange = (name)=>{
//     tabsChangeFn(name)
//   }

//   return (
//     <div className={styles.edit_card_tab} style={{ display: 'flex' }}>
//       <div className={styles.edit_home} onClick={()=>tabsHomeChange('/')}>
//         首页
//       </div>
//       <Tabs
//         type="editable-card"
//         onEdit={onEdit.bind(this)}
//         onChange={changeTabs}
//         activeKey={`${history.location.pathname}${search}`}
//       >
//         {/* {renderSingleTab()} */}
//         {renderDesktopTab()}

//         {menus &&
//           cachingNodes.map(node => {
//             let tab = '';
//             if(node.name &&
//               (node.name.includes('applyModelConfig'))){
//                 tab = node.title;
//             }else{
//               if (menus.length == 0) {
//                 tab = defaultMenu[node.name]
//                   ? defaultMenu[node.name]
//                   : defaultMenu[node.pathname]; //从配置菜单中查找
//               } else {
//                 //放在一级的时候(应用建模)
//                 const firstKey = _.findIndex(menus, { path: node.pathname }); //从菜单中查找
//                 if (firstKey != -1) {
//                   tab = menus[firstKey].name;
//                 } else {
//                   for (let index = 0; index < menus.length; index++) {
//                     const children = menus[index] && menus[index].routes;
//                     const i = _.findIndex(children, { path: node.name }); //从菜单中查找
//                     if (i != -1) {
//                       tab = children[i].name;
//                       break;
//                     } else {
//                       const flag = _.findIndex(children, { path: node.pathname });
//                       if (flag != -1) {
//                         tab = children[flag].name;
//                         break;
//                       } else {
//                         tab = defaultMenu[node.name]
//                           ? defaultMenu[node.name]
//                           : defaultMenu[node.pathname]; //从配置菜单中查找
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//             return <TabPane tab={tab} key={node.name}></TabPane>;
//           })}
//       </Tabs>
//       {cachingNodes && cachingNodes.length > 0 && (
//         <Dropdown overlay={menu}>
//           <div className={styles.close_button}>
//             关闭
//             <DownOutlined style={{ marginLeft: 3 }} />
//           </div>
//         </Dropdown>
//       )}
//     </div>
//   );
// }

// export default connect(({ desktopLayout }) => ({
//   desktopLayout,
// }))(KeepAliveTabs);
