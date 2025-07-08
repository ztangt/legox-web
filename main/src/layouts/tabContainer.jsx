import { Tabs, Popover, Dropdown, Menu, Spin } from 'antd';
import React, { useEffect,useRef,useState, useCallback, Suspense, useMemo,lazy } from 'react';
import _ from 'lodash';
import styles from './index.less';
import { Route,connect,history,useMatch,Outlet,getDvaApp } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import defaultSpace from '../componments/AliveTabs/_defaultNameSpace'
import {dropCurrentTab} from '../util/util'
const Index = lazy(() => import('../pages/index'));
const AccreditLook = lazy(() => import('../pages/accreditLook'));
const AllRole = lazy(() => import('../pages/allRole'));
const ApplyCorrelation = lazy(() => import('../pages/applyCorrelation'));
const ApplyModel = lazy(() => import('../pages/applyModel'));
const ApplyModelConfig = lazy(() => import('../pages/applyModelConfig'));
// const ApplyModelFormAuth = lazy(() => import('../pages/applyModelFormAuth'));
const AuthorizedView = lazy(() => import('../pages/authorizedView'));
const BasicDataForm = lazy(() => import('../pages/basicDataForm'));
const BusinessFormManage = lazy(() => import('../pages/businessFormManage'));
const BusinessUseSort = lazy(() => import('../pages/businessUseSort'));
const ButtonLibrary = lazy(() => import('../pages/buttonLibrary'));
const ButtonSolution = lazy(() => import('../pages/buttonSolution'));
const Cloud = lazy(() => import('../pages/cloud'));
const ControlList = lazy(() => import('../pages/controlList'));
const ControlManagement = lazy(() => import('../pages/controlManagement'));
const DataDriven = lazy(() => import('../pages/dataDriven'));
const DataRuleMg = lazy(() => import('../pages/dataRuleMg'));
const Demo = lazy(() => import('../pages/demo'));
const DeptMg = lazy(() => import('../pages/deptMg'));
// const FormDesigner = lazy(() => import('../pages/designer/formDesigner'));
// const PortalDesigner = lazy(() => import('../pages/designer/portalDesigner'));
// const Desktop = lazy(() => import('../pages/desktop/[destop$]'));
const DesktopLayout = lazy(() => import('../pages/desktopLayout'));
const DesktopLayoutIndex = lazy(() => import('../pages/desktopLayoutIndex'));
const EntranceConfig = lazy(() => import('../pages/entranceConfig'));
const EventRegister = lazy(() => import('../pages/eventRegister'));
const FormEngine = lazy(() => import('../pages/formEngine'));
const FusionDesktop = lazy(() => import('../pages/fusionDesktop'));
const GlobalReviewer = lazy(() => import('../pages/globalReviewer'));
const HolidaysManage = lazy(() => import('../pages/holidaysManage'));
const IconConfig = lazy(() => import('../pages/iconConfig'));
const InterfaceManagement = lazy(() => import('../pages/interfaceManagement'));
const ListMoudles = lazy(() => import('../pages/listMoudles'));
const MoudleDesign = lazy(() => import('../pages/listMoudles/moudleDesign'));
const ModifyPwd = lazy(() => import('../pages/modifyPwd'));
const ModuleResourceMg = lazy(() => import('../pages/moduleResourceMg'));
const OpenSystem = lazy(() => import('../pages/openSystem'));
const PasswordMg = lazy(() => import('../pages/passwordMg'));
const PlatformCodeRules = lazy(() => import('../pages/platformCodeRules'));
const PluginManage = lazy(() => import('../pages/pluginManage'));
const PluginManageNoButton = lazy(() => import('../pages/pluginManageNoButton'));
const PostMg = lazy(() => import('../pages/postMg'));
const SysRole = lazy(() => import('../pages/sysRole'));
const SystemLayout = lazy(() => import('../pages/systemLayout'));
const SystemAccess = lazy(() => import('../pages/systemAccess'));
const TenantSettings = lazy(() => import('../pages/TenantSettings'));
const Test = lazy(() => import('../pages/test'));
const UnitInfoManagement = lazy(() => import('../pages/unitInfoManagement'));
const UnitRole = lazy(() => import('../pages/unitRole'));
const UseDataBuildModel = lazy(() => import('../pages/useDataBuildModel'));
const UserGroupMg = lazy(() => import('../pages/userGroupMg'));
const UserInfoManagement = lazy(() => import('../pages/userInfoManagement'));
const UserView = lazy(() => import('../pages/userInfoManagement/userView'));
const WorkflowEngine = lazy(() => import('../pages/workflowEngine'));
const WorkRule = lazy(() => import('../pages/workRule'));
const WriteSignStyle = lazy(() => import('../pages/writeSignStyle'));
const EditForm = lazy(() => import('../pages/EditForm'));
const OutSide = lazy(() => import('../pages/OutSide'));
const IncompatibleFunctionClassify = lazy(()=>import('../pages/incompatibleFunctionClassify'));
const IncompatibleRoleAlert = lazy(()=>import('../pages/incompatibleRoleAlert'));
const IncompatibleSettings = lazy(()=>import('../pages/incompatibleSettings'))
const ApplyPublish=lazy(()=>import('../pages/applyPublish'))
const ANY = lazy(() => import('../pages/[any]'));
const SceneConfig = lazy(() => import('../pages/sceneConfig'));
const SceneAuthorization = lazy(() => import('../pages/sceneAuthorization'));
const MicroPage = lazy(() => import('../pages/microPage'));
const ChartEngine = lazy(() => import('../pages/chartEngine'));
const LoginAuditLog = lazy(() => import('../pages/loginAuditLog'));
const BusinessOperationLog = lazy(() => import('../pages/businessOperationLog'));
const ManageOperationLog = lazy(() => import('../pages/manageOperationLog'));
const FunManage = lazy(() => import('../pages/funManage'));
const NormAux = lazy(() => import('../pages/normAux'));

function TabsContainer({
  tabActivityKey,
  tabMenus,
  setState,
  dispatch,
  // globalRoute,
  desktopLayout
}) {
  const { showDesktopTab } = desktopLayout;

  const onEdit =useCallback((targetKey, action) => {
    if (action == 'remove') {
      dropTab(targetKey)
    }
  }, [tabMenus, tabActivityKey]);

  const dropTab = useCallback((targetKey) => {
    // if (targetKey == '/desktopLayout') {
    //   dispatch({
    //     type: 'desktopLayout/updateStates',
    //     payload: {
    //       showDesktopTab: false,
    //     },
    //   });
    // }
    let tmpCurrentIndex = _.findIndex(tabMenus, { key: targetKey });
    // let curNode = tabMenus?.[tmpCurrentIndex];
    // const params = GETURLPARAMS(curNode?.href);
      if (targetKey == '/') {
        return;
      }
      if (tabMenus.length == 1) {
        setState({ tabActivityKey: '/'})
      }

      var array = tabMenus.filter((item)=>{return item.key!=targetKey})//删除
      if(targetKey==tabActivityKey){//删除的页签是当前选中的
        // //点击“x“关闭中间的页签，页面定位到被关闭的页签后面的页签；
        // let node = tabMenus[tmpCurrentIndex + 1];
        // if (!node) {
        //   //点击“x“关闭最后一个页签，页面定位到前一个页签；
        //   node = tabMenus[tmpCurrentIndex - 1];
        // }
        // console.log('array',array);
        // if (targetKey.includes('moudleDesign')) {
        //   historyPush({pathname: '/listMoudles'},targetKey);
        // } else if (targetKey.includes('applyModelConfig')) {
        //   historyPush({pathname: '/applyModel'},targetKey);
        // }else{
        //   historyPush({
        //     pathname: node.pathname,
        //     query: node.query,
        //     title: node.title,
        //     href: node.href,
        //     key: node.key
        //   },
        //   targetKey
        //   )
        // }
        dropCurrentTab(tabMenus,targetKey)
        // setState({ tabMenus: [...array],tabActivityKey: node?.key,selectedKeys: []})


      }else{//删除的页签非当前选中的
        setState({ tabMenus: [...array],selectedKeys: []})
      }
      const returnModel = namespace => {
        var obj = _.find(getDvaApp()._models, { namespace: namespace }) || {}; //获取当前路径下的model

        return obj;
      };
      let namespace = defaultSpace[targetKey] || targetKey.split('/')[1];
      namespace = namespace.split('?')[0];
      if (
        namespace == 'userInfoManagement' &&
        targetKey .includes('/userInfoManagement/userView')
        // namespace == 'userInfoManagement'
      ) {
        namespace = 'userView';
      }
      if (!namespace) {
        namespace = history.location.pathname.split('/')[1];
      }
      if (targetKey.includes('moudleDesign')) {
        namespace = `moudleDesign_${location.search.moudleId}`;
      }

      let model = returnModel(namespace);
      if (namespace == 'applyModelConfig') {
        // getDvaApp()._store.dispatch({
        //   //初始化model state中的值
        //   type: `${model.namespace}/updateStatesInitial`,
        //   payload: {
        //     bizSolId: jqueryUrl(targetKey).bizSolId,
        //   },
        // });
      } else {
        getDvaApp()._store.dispatch({
          //初始化model state中的值
          type: `${model.namespace}/updateStates`,
          payload: {
            ...model.state,
          },
        });
      }
       if(namespace == 'sysRole'||namespace == 'allRole'||namespace == 'unitRole'){
        let model = returnModel('role');
        getDvaApp()._store.dispatch({
          //初始化model state中的值
          type: `${model.namespace}/updateStates`,
          payload: {
          },
          isClear:true,
          currentPathName:targetKey
        });
      }

  }, [tabMenus, tabActivityKey]);
  const changeTabs = useCallback((activeKey) =>{
    var curTab = tabMenus.find((item)=>{return item.key==activeKey})
    if(!curTab){
      return
    }
    localStorage.setItem('currentButtonId', '');
    const maxDataruleCodes = JSON.parse(
      localStorage.getItem('maxDataruleCodes') || '{}',
    );
    var curTabQuery = curTab.query
    if(curTab.pathname!='/'&&curTab.pathname!='/support'){
      curTabQuery = {
        ...curTab.query,
        // maxDataruleCode//加上这个页面会刷新，href会改变
      }
    }
    const maxDataruleCode = maxDataruleCodes[curTab.pathname];
    historyPush({
      pathname: curTab.pathname,
      query: curTabQuery,
      title: curTab.title,
      key: curTab.key,
      href: curTab.href
    })
    setState({ tabActivityKey: activeKey,selectedKeys: []})
  }, [tabMenus, tabActivityKey])

  const rightExtra = useCallback(() =>{
    if(tabMenus && tabMenus.length > 0 ){
      return <Dropdown overlay={menu}>
      <div className={styles.close_button}>
        关闭
        <DownOutlined style={{ marginLeft: 3 }} />
      </div>
    </Dropdown>
    }
  }, [tabMenus, tabActivityKey])

  const renderSingleTab = () => {

    const initialPanes = [
      {
        title: '桌面布局管理',
        content: '/desktopLayout',
        key: 'desktop-1',
      },
      {
        title: '首页',
        content: '/',
        key: 'desktop-2',
      }
    ];

    return<div
           onClick={()=>changeTabs('/')}
         >
           首页
         </div>

  //   return showDesktopTab? (
  //     <div
  //       onClick={()=>changeTabs(initialPanes[0].content)}
  //     >
  //       {initialPanes[0].title}
  //     </div>
  //   ) : <div
  //       onClick={()=>changeTabs(initialPanes[1].content)}
  //     >
  //       {initialPanes[1].title}
  // </div>;
  };
  const leftExtra = () =>{
    return  <div className={tabActivityKey=='/'?styles.edit_home_active:styles.edit_home}>{renderSingleTab()}</div>
  }

  const menu = (
    <Menu className={styles.menus_all}>
      <Menu.Item
        onClick={()=>{dropTab(tabActivityKey)}}
      >
        关闭当前标签页
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          const flag = tabMenus.findIndex((item)=>{return item.key==tabActivityKey})
          historyPush({
            key:tabMenus?.[flag]?.key,
            pathname: tabMenus?.[flag]?.pathname,
            href:  tabMenus?.[flag]?.href,
            title:   tabMenus?.[flag]?.title,
            query: tabMenus?.[flag]?.query,
          },'OTHER')
          // const obj = {
          //   key:'/',
          //   title: '首页',
          //   href: '/',
          //   query: '/'
          //   }
          // if(tabMenus?.[flag]?.key=='/'){//当前选中为个人桌面
          //   setState({
          //     tabMenus: [
          //       obj
          //     ],
          //     selectedKeys: []
          //   })
          // }else{
          //   setState({
          //     tabMenus: [
          //       obj,
          //       tabMenus?.[flag]
          //     ],
          //     selectedKeys: []
          //   })
          // }

        }}
      >
        关闭其他标签页
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          historyPush({
            key:'/',
            pathname: '/',
            href: '/',
            title: '首页',
          },'ALL')
          // setState({
          //   tabMenus: [{
          //     key:'/',
          //     title: '首页',
          //     href: '/',
          //     query: '/'
          //   }],
          //   tabActivityKey: '/',
          //   selectedKeys: []
          //  })
        }}
      >
        关闭全部标签页
      </Menu.Item>
    </Menu>
  );

  const renderContainer = useCallback((key,href, tabIndex) =>{
    // console.log('renderContiner',key,href);

    const params = href&&GETURLPARAMS(href);
    // console.log('params==',params);
    let search = href&&href.includes('?')?'?'+href.split('?')[1]:'';
    console.log('key123',key,href);
    const mapPathToComponent = {
      '/': <Index/>,
      '/accreditLook': <AccreditLook key={`${key}_${href}`} location={{query:{...params},pathname:"/accreditLook",search:search}}/>,
      '/allRole': <AllRole key={`${key}_${href}`} location={{query:{...params},pathname:"/allRole",search:search}}/>,
      '/applyCorrelation': <ApplyCorrelation key={`${key}_${href}`} location={{query:{...params},pathname:"/applyCorrelation",search:search}}/>,
      '/applyModel': <ApplyModel key={`${key}_${href}`} location={{query:{...params},pathname:"/applyModel",search:search}}/>,
      '/applyModelConfig': <ApplyModelConfig key={`applyModelConfig_${tabIndex}`} location={{query:{...params},pathname:"/applyModelConfig",search:search}}/>,
      // '/applyModelFormAuth': <ApplyModelFormAuth key={`${key}_${href}`} location={{query:{...params},pathname:"/applyModelFormAuth",search:search}}/>,
      '/authorizedView': <AuthorizedView key={`${key}_${href}`} location={{query:{...params},pathname:"/authorizedView",search:search}}/>,
      '/basicDataForm': <BasicDataForm key={`${key}_${href}`} location={{query:{...params},pathname:"/basicDataForm",search:search}}/>,
      '/businessFormManage': <BusinessFormManage key={`${key}_${href}`} location={{query:{...params},pathname:"/businessFormManage",search:search}}/>,
      '/businessUseSort': <BusinessUseSort key={`${key}_${href}`} location={{query:{...params},pathname:"/businessUseSort",search:search}}/>,
      '/buttonLibrary': <ButtonLibrary key={`${key}_${href}`} location={{query:{...params},pathname:"/buttonLibrary",search:search}}/>,
      '/buttonSolution': <ButtonSolution key={`${key}_${href}`} location={{query:{...params},pathname:"/buttonSolution",search:search}}/>,
      '/cloud': <Cloud key={`${key}_${href}`} location={{query:{...params},pathname:"/cloud",search:search}}/>,
      '/controlList': <ControlList key={`${key}_${href}`} location={{query:{...params},pathname:"/controlList",search:search}}/>,
      '/controlManagement': <ControlManagement key={`${key}_${href}`} location={{query:{...params},pathname:"/controlManagement",search:search}}/>,
      '/dataDriven': <DataDriven key={`${key}_${href}`} location={{query:{...params},pathname:"/dataDriven",search:search}}/>,
      '/dataRuleMg': <DataRuleMg key={`${key}_${href}`} location={{query:{...params},pathname:"/dataRuleMg",search:search}}/>,
      // '/desktop': <Desktop key={`${key}_${href}`} location={{query:{...params},pathname:"/desktop",search:search}}/>,
      '/deptMg': <DeptMg key={`${key}_${href}`} location={{query:{...params},pathname:"/deptMg",search:search}}/>,
      '/desktopLayout': <DesktopLayout key={`${key}_${href}`} location={{query:{...params},pathname:"/desktopLayout",search:search}}/>,
      '/entranceConfig': <EntranceConfig key={`${key}_${href}`} location={{query:{...params},pathname:"/entranceConfig",search:search}}/>,
      '/eventRegister': <EventRegister key={`${key}_${href}`} location={{query:{...params},pathname:"/eventRegister",search:search}}/>,
      '/formEngine': <FormEngine key={`${key}_${href}`} location={{query:{...params},pathname:"/formEngine",search:search}}/>,
      '/fusionDesktop': <FusionDesktop key={`${key}_${href}`} location={{query:{...params},pathname:"/fusionDesktop",search:search}}/>,
      '/globalReviewer': <GlobalReviewer key={`${key}_${href}`} location={{query:{...params},pathname:"/globalReviewer",search:search}}/>,
      '/holidaysManage': <HolidaysManage key={`${key}_${href}`} location={{query:{...params},pathname:"/holidaysManage",search:search}}/>,
      '/iconConfig': <IconConfig key={`${key}_${href}`} location={{query:{...params},pathname:"/iconConfig",search:search}}/>,
      '/interfaceManagement': <InterfaceManagement key={`${key}_${href}`} location={{query:{...params},pathname:"/interfaceManagement",search:search}}/>,
      '/listMoudles': <ListMoudles key={`${key}_${href}`} location={{query:{...params},pathname:"/listMoudles",search:search}}/>,
      '/moudleDesign': <MoudleDesign key={`moudleDesign_${tabIndex}`} location={{query:{...params},pathname:"/listMoudles/moudleDesign",search:search}}/>,
      '/modifyPwd': <ModifyPwd key={`${key}_${href}`} location={{query:{...params},pathname:"/modifyPwd",search:search}}/>,
      '/moduleResourceMg': <ModuleResourceMg key={`${key}_${href}`} location={{query:{...params},pathname:"/moduleResourceMg",search:search}}/>,
      '/openSystem': <OpenSystem key={`${key}_${href}`} location={{query:{...params},pathname:"/openSystem",search:search}}/>,
      '/passwordMg': <PasswordMg key={`${key}_${href}`} location={{query:{...params},pathname:"/passwordMg",search:search}}/>,
      '/platformCodeRules': <PlatformCodeRules key={`${key}_${href}`} location={{query:{...params},pathname:"/platformCodeRules",search:search}}/>,
      '/pluginManage': <PluginManage key={`${key}_${href}`} location={{query:{...params},pathname:"/pluginManage",search:search}}/>,
      '/pluginManageNoButton': <PluginManageNoButton key={`${key}_${href}`} location={{query:{...params},pathname:"/pluginManageNoButton",search:search}}/>,
      '/postMg': <PostMg key={`${key}_${href}`} location={{query:{...params},pathname:"/postMg",search:search}}/>,
      '/sysRole': <SysRole key={`${key}_${href}`} location={{query:{...params},pathname:"/sysRole",search:search}}/>,
      '/systemLayout': <SystemLayout key={`${key}_${href}`} location={{query:{...params},pathname:"/systemLayout",search:search}}/>,
      '/systemAccess': <SystemAccess key={`${key}_${href}`} location={{query:{...params},pathname:"/systemAccess",search:search}}/>,
      '/tenantSettings': <TenantSettings key={`${key}_${href}`} location={{query:{...params},pathname:"/tenantSettings",search:search}}/>,
      '/test': <Test key={`${key}_${href}`} location={{query:{...params},pathname:"/test",search:search}}/>,
      '/unitInfoManagement': <UnitInfoManagement key={`${key}_${href}`} location={{query:{...params},pathname:"/unitInfoManagement",search:search}}/>,
      '/unitRole': <UnitRole key={`${key}_${href}`} location={{query:{...params},pathname:"/unitRole",search:search}}/>,
      '/useDataBuildModel': <UseDataBuildModel key={`${key}_${href}`} location={{query:{...params},pathname:"/useDataBuildModel",search:search}}/>,
      '/userGroupMg': <UserGroupMg key={`${key}_${href}`} location={{query:{...params},pathname:"/userGroupMg",search:search}}/>,
      '/userInfoManagement': <UserInfoManagement key={`${key}_${href}`} location={{query:{...params},pathname:"/userInfoManagement",search:search}}/>,
      '/userView': <UserView key={`userView_${tabIndex}`} location={{query:{...params},pathname:"/userInfoManagement/userView",search:search}}/>,
      '/workflowEngine': <WorkflowEngine key={`${key}_${href}`} location={{query:{...params},pathname:"/workflowEngine",search:search}}/>,
      '/workRule': <WorkRule key={`${key}_${href}`} location={{query:{...params},pathname:"/workRule",search:search}}/>,
      '/writeSignStyle': <WriteSignStyle key={`${key}_${href}`} location={{query:{...params},pathname:"/writeSignStyle",search:search}}/>,
      '/editForm': <EditForm key={`${key}_${href}`} location={{query:{...params},pathname:"/editForm",search:search}}/>,
      '/outSide': <OutSide key={`${key}_${href}`} location={{query:{...params},pathname:"/outSide",search:search}}/>,
      '/incompatibleFunctionClassify':<IncompatibleFunctionClassify key={`${key}_${href}`} location={{query:{...params},pathname:"/incompatibleFunctionClassify",search:search}}/>,
      '/incompatibleRoleAlert':<IncompatibleRoleAlert  key={`${key}_${href}`} location={{query:{...params},pathname:"/incompatibleRoleAlert",search:search}}/>,
      '/incompatibleSettings': <IncompatibleSettings key={`${key}_${href}`} location={{query:{...params},pathname:"/incompatibleRoleAlert",search:search}}/>,
      '/applyPublish': <ApplyPublish key={`${key}_${href}`} location={{query:{...params},pathname:"/applyPublish",search:search}}/>,
      '/any':<ANY key={`${key}_${href}`} location={{query:{...params},pathname:"/any",search:search}}/>,
      '/sceneConfig':<SceneConfig key={`${key}_${href}`} location={{query:{...params},pathname:"/sceneConfig",search:search}}/>,
      '/sceneAuthorization':<SceneAuthorization key={`${key}_${href}`} location={{query:{...params},pathname:"/sceneAuthorization",search:search}}/>,
      '/microPage':<MicroPage key={`${key}_${href}`} location={{query:{...params},pathname:"/microPage",search:search}}/>,
      '/chartEngine':<ChartEngine key={`${key}_${href}`} location={{query:{...params},pathname:"/chartEngine",search:search}}/>,
      '/loginAuditLog':<LoginAuditLog key={`${key}_${href}`} location={{query:{...params},pathname:"/loginAuditLog",search:search}}/>,
      '/businessOperationLog':<BusinessOperationLog key={`${key}_${href}`} location={{query:{...params},pathname:"/businessOperationLog",search:search}}/>,
      '/manageOperationLog':<ManageOperationLog key={`${key}_${href}`} location={{query:{...params},pathname:"/manageOperationLog",search:search}}/>,
      '/funManage':<FunManage key={`${key}_${href}`} location={{query:{...params},pathname:"/funManage",search:search}}/>,
    }
    let newKey = key
    if(key.includes('/userView')){
      newKey = '/userView';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/applyModelConfig')){
      newKey = '/applyModelConfig';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/workflowEngine')){
      newKey = '/workflowEngine'
      return  mapPathToComponent[newKey];
    }else if(key.includes('/moudleDesign')){
      newKey = '/moudleDesign';
      return  mapPathToComponent[newKey];
    }else if(!mapPathToComponent[newKey]){
      newKey = '/any';
      return mapPathToComponent[newKey]
    }else{
      return  mapPathToComponent[newKey];
    }

  }, [tabMenus, tabActivityKey])
  // const renderContainer = useCallback((key) =>{
  //   const globalRoute = useRouteData ()?.route
  //   var route = {}
  //   route = globalRoute.routes.find((item)=>{return key==item.path})
  //   if(key.includes('/userInfoManagement/userView')){
  //     route = globalRoute.routes.find((item)=>{return item.path?.includes('/userInfoManagement/userView')})
  //   }else if(key.includes('/applyModelConfig')){
  //     route = globalRoute.routes.find((item)=>{return item.path?.includes('applyModelConfig')})
  //   }else if(key.includes('/moudleDesign')){
  //     route = globalRoute.routes.find((item)=>{return item.path?.includes('/moudleDesign')})
  //   }
  //   // if(!route){
  //   //   route = globalRoute.routes.find((item)=>{return key=='/404'})
  //   // }
  //   return <Route key={key} component={route.component} exact />
  // }, [tabMenus, tabActivityKey])

  return (
    <div className={styles.right_wrap}>
      <Tabs
        type="editable-card"
        onEdit={onEdit}
        onChange={changeTabs}
        activeKey={tabActivityKey}
        hideAdd={true}
        tabBarExtraContent={{right: rightExtra(),left: leftExtra()}}
        className={
          styles.edit_card_tab}
        tabBarGutter={0}
        id="dom_container"
        items={tabMenus?.map((tabMenu, index)=>({
          key: tabMenu.key,
          label: <div title={tabMenu.title} className="menu_lable" menuId={tabMenu.menuId} maxDataruleCode={tabMenu.maxDataruleCode}>{tabMenu.title}</div>,
          children: (
            <Suspense fallback={<Spin loading={true}/>}>
              {renderContainer(tabMenu.key,tabMenu.href,index)}
            </Suspense>
          ),
        }))}
        popupClassName={'more_menu_list'}
      >
      </Tabs>
    </div>
  );
}

export default connect(({ desktopLayout }) => ({
  desktopLayout,
}))(TabsContainer);
