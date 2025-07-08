import { Tabs, Popover, Dropdown, Menu, Spin,Result,Button } from 'antd';
import React, { useEffect,useRef,useState, useCallback, Suspense, useMemo, lazy } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import styles from './index.less';
import { v4 as uuidv4 } from 'uuid';
import { getDvaApp } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import { ErrorBoundary } from "react-error-boundary"
import { createRoot } from "react-dom/client"

const IM = lazy(() => import('../pages/IM'));
const AllWork = lazy(() => import('../pages/allWork'));
const DynamicPage = lazy(() => import('../pages/dynamicPage/componments/formModeling'));
const FormShow = lazy(() => import('../componments/formPreview/index'));
const Index = lazy(() => import('../pages/index/index'));
const AddressList = lazy(() => import('../pages/addressBook/componments/addressList'));
const BackLogo = lazy(() => import('../pages/backlogo/components/backlogo'));
const BudgetPage = lazy(() => import('../pages/budgetPage/index'));
const CalendarMg = lazy(() => import('../pages/calendarMg/componments/calendarMg'));
const CirculateWork = lazy(() => import('../pages/circulateWork/componments/circulateWork'));
const DesktopLayout = lazy(() => import('../pages/desktopLayout/componments/desktopLayout'));
const CustomPage = lazy(() => import('../pages/customPage'));
const ExportList = lazy(() => import('../pages/exportList/componments/exportList'));
const ImportList = lazy(() => import('../pages/importList/componments/importList'));
const FastDesktop = lazy(() => import('../pages/fastDesktop/componments/fastDesktop'));
const FusionDesktop = lazy(() => import('../pages/fusionDesktop/componments/fusionDesktop'));
const Information = lazy(() => import('../pages/information/componments/information'));
const InformationAdd = lazy(() => import('../pages/information/add/componments/informationModal'));
const InformationModify = lazy(() => import('../pages/information/modify/modify'));
const InformationList = lazy(() => import('../pages/informationList/componments/informationList'));
const InformationListDetail = lazy(() => import('../pages/informationList/detail/detail'));
const Meteorological = lazy(() => import('../pages/meteorological'));
const MonitorWork = lazy(() => import('../pages/monitorWork/componments/list'));
const NoticePage = lazy(() => import('../pages/noticePage/components/noticePage'));
const Notification = lazy(() => import('../pages/notification/componments/notification'));
const NotificationList = lazy(() => import('../pages/notificationList/componments/notificationList'));
const PdfPreview = lazy(() => import('../pages/pdfPreview/index'));
const PersonInfo = lazy(() => import('../pages/personInfo/componments/personInfo'));
const PersonWork = lazy(() => import('../pages/personWork/componments/personWork'));
const PreviewPrint = lazy(() => import('../pages/previewPrint/print'));
const PublicDisk = lazy(() => import('../pages/publicDisk/componments/publicDisk'));
const SendWork = lazy(() => import('../pages/sendWork/componments/sendWork'));
const SignDisk = lazy(() => import('../pages/signDisk/componments/signDisk'));
const Tabletest = lazy(() => import('../pages/tabletest/index'));
const TraceWork = lazy(() => import('../pages/traceWork/componments/list'));
const TrustWork = lazy(() => import('../pages/trustWork/componments/list'));
const TrustedWork = lazy(() => import('../pages/trustedWork/componments/list'));
const AsyncWaitMatter = lazy(() => import('../pages/waitMatter/componments/waitMatter'));
const AsyncDoneWork = lazy(() => import('../pages/doneWork/componments/doneWork'));
const FlowDetails = lazy(() => import('../componments/flowDetails/flowDetails'));
const WorkTrust = lazy(() => import('../pages/workTrust/componments/list'));
const SubProcessArrange = lazy(()=>import('../pages/subProcessArrange/components/subProcessArrange'))
const OverprintManage = lazy(()=>import('../pages/overprintManage'))
const WpsPintDesign = lazy(()=>import('../pages/overprintManage/components/onDesign'))
const WpsRedTemplate = lazy(()=>import('../pages/wpsRedTemplate/index'))
const ANY = lazy(() => import('../pages/[any]'));
const MicroPage = lazy(() => import('../pages/microPage'));
const ChartPage = lazy(() => import('../pages/chartPage'));
const AsyncWaitMatterCma = lazy(() => import('../pages/waitMatterCma/componments/waitMatter'));

const { TabPane } = Tabs;
function TabsContainer({
  desktopType,
  tableConfig,
  tabActivityKey,
  tabMenus,
  setState,
  dispatch
}) {
  useEffect(() => {
    if (tabActivityKey === '/' && document.getElementById(`dom_container-panel-/`)) {
      document.getElementById(`dom_container-panel-/`).style.overflow = 'auto';
    } 
  }, [tabActivityKey, document.getElementById(`dom_container-panel-/`)]);
  
  const id = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo')).id
  : '';
  const deskIndex = localStorage.getItem(`desktopType${id}`) || 0;

  const onEdit =useCallback((targetKey, action) => {
    if (action == 'remove') {
      dropTab(targetKey)
    }
  }, [tabMenus, tabActivityKey]);
  const dropTab = useCallback((targetKey) => {
    if (targetKey == '/') {
      return;
    }

    const root = createRoot(document.getElementById(`dom_container-panel-${targetKey}`))
    localStorage.setItem('currentButtonId', '');
    let tmpCurrentIndex = _.findIndex(tabMenus, { key: targetKey });
    let curNode = tabMenus?.[tmpCurrentIndex];
    const params = GETURLPARAMS(curNode?.href);
    const callbackFn = () => {
      if (targetKey == '/desktopLayout' || tabMenus.length == 2) {
        dispatch({
          type: 'desktopLayout/updateStates',
          payload: {
            refreshTag: uuidv4(),
          },
        });
      }
      if (targetKey == '/desktopLayout' && tabMenus.length == 2) {
        dispatch({
          type: 'desktopLayout/updateStates',
          payload: {
            singleTag: uuidv4(),
          },
        });
      }

      if (tabMenus.length == 1) {
        setState({ tabActivityKey: '/'})
      }

      let array = tabMenus.filter((item)=>{return item.key!=targetKey})//删除
      if(targetKey==tabActivityKey){//删除的页签是当前选中的
        //点击“x“关闭中间的页签，页面定位到被关闭的页签后面的页签；
        let node = tabMenus[tmpCurrentIndex + 1];
        if (!node) {
          //点击“x“关闭最后一个页签，页面定位到前一个页签；
          node = tabMenus[tmpCurrentIndex - 1];
        }
        setState({ tabMenus: array,tabActivityKey: node?.key})
        // 重设hash
        window.localStorage.setItem('currentHash',node?.href);
      }else{//删除的页签非当前选中的
        setState({ tabMenus: array})
      }
      const returnModel = (namespace) => {
        let obj = _.find(getDvaApp()._models, { namespace: namespace }) || {}; //获取当前路径下的model
        return obj;
      };
      //这部分应该是用来初始化model数据的
      if (curNode?.href.split('?')[0].split('/')[2] == 'flowDetails') {
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
      if (curNode?.key=="/workTrust"||curNode?.key=='/addressBook'||curNode?.key=='/notification'||curNode?.key=='/notificationList') {
        const nameSpace=curNode.key.split('/')[1]
        let model = returnModel(nameSpace);
        getDvaApp()._store.dispatch({
          //初始化model state中的值
          type: `${nameSpace}/updateStates`,
          payload: {
            ...model.state,
          },
        });
      }
      if(curNode?.key=='/information'){
        let model = returnModel('information');
        getDvaApp()._store.dispatch({
          //初始化model state中的值
          type: `information/updateStates`,
          payload: {
            ...model.state,
          },
        });
      }
      if(curNode?.key=='/publicDisk'){
        let model = returnModel('publicDisk');
        getDvaApp()._store.dispatch({
          //初始化model state中的值
          type: `publicDisk/updateStates`,
          payload: {
            ...model.state,
          },
        });
      }
      if(curNode?.key=='/signDisk'){
        let model = returnModel('signDisk');
        getDvaApp()._store.dispatch({
          //初始化model state中的值
          type: `signDisk/updateStates`,
          payload: {
            ...model.state,
          },
        });
      }
      if(curNode?.key=='/calendarMg'){
        let model = returnModel('calendarMg');
        getDvaApp()._store.dispatch({
          //初始化model state中的值
          type: `calendarMg/updateStates`,
          payload: {
            ...model.state,
          },
        });
      }
      if(curNode?.key=='/backlogo'){
        let model = returnModel('backlogo');
        getDvaApp()._store.dispatch({
          //初始化model state中的值
          type: `backlogo/updateStates`,
          payload: {
            ...model.state,
          },
        });
      }
    };

    // if (
    //   targetKey.includes('/formShow')&&params.title!='查看'
    // ) {
    //   //console.log('ssss=====',document.getElementById(`header_${targetKey}`),document.getElementById(`header_${targetKey}`).getAttribute('mainTableId'));
    //   //TODO: mainTableId暂时不知道怎么取
    //   let mainTableId = document.getElementById(`header_${targetKey}`)?.getAttribute('mainTableId');
    //   if (
    //     mainTableId
    //   ) {
    //     dispatch({//崔晶说去掉
    //       //关闭表单页签清空发票redis缓存
    //       type: 'user/deleteICRedis',
    //       payload: {
    //         mainTableId:mainTableId
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
    callbackFn();
    root.unmount()
  }, [tabMenus, tabActivityKey]);

  const changeTabs = useCallback((activeKey) =>{
    if (activeKey === '/' || activeKey === '/desktopLayout') {
      dispatch({
        type: 'desktopLayout/updateStates',
        payload: {
          refreshTag: uuidv4(),
        },
      });
    }
    dispatch({
      type:'msgNotice/updateStates',
      payload:{
        isShowModal:false
      }
    })
    //切换获取href
    let infos = tabMenus.filter((item)=>{return item.key==activeKey})
    let tmpCurrentIndex = _.findIndex(tabMenus, { key: activeKey });
    let curNode = tabMenus?.[tmpCurrentIndex];
    const params = GETURLPARAMS(curNode?.href);
    // params?.menuId && localStorage.setItem('menuId', params?.menuId);
    params?.bizSolId && localStorage.setItem('bizSolId', params?.bizSolId);
    params?.listId && localStorage.setItem('listId', params?.listId);
    localStorage.setItem('currentButtonId', '');
    localStorage.setItem('currentHash',infos?.[0]?.href);
    //localStorage.setItem('maxDataruleCode', params?.maxDataruleCode);//去掉已经存在页签属性中了
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
    return initialPanes[deskIndex].show ? (
      <div
        onClick={()=>changeTabs(initialPanes[deskIndex].content)}
      >
        {initialPanes[deskIndex].title}
      </div>
    ) : null;
  };
  const tabsArr = ['/','/fusionDesktop','/fastDesktop'];
  const leftExtra = () =>{
    return  <div className={tabsArr.includes(tabActivityKey)?styles.edit_home_active:styles.edit_home}>{renderSingleTab()}</div>
  }

  const menu = (
    <Menu className={styles.menus_all}>
      <Menu.Item
        onClick={dropTab.bind(this,tabActivityKey)}
      >
        关闭当前标签页
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          const flag = tabMenus.findIndex((item)=>{return item.key==tabActivityKey})
          const obj = {
            key:'/',
            title: '个人桌面',
            href: '/'
            }
          if(tabMenus?.[flag]?.key=='/'){//当前选中为个人桌面
            setState({
              tabMenus: [
                obj
              ]
            })
          }else{
            setState({
              tabMenus: [
                obj,
                tabMenus?.[flag]
              ]
            })
          }

        }}
      >
        关闭其他标签页
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setState({
            tabMenus: [{
              key:'/',
              title: '个人桌面',
              href: '/'
            }],
            tabActivityKey: '/'
           })
        }}
      >
        关闭全部标签页
      </Menu.Item>
    </Menu>
  );
  const renderContainer = useCallback((key,href, tabIndex) =>{
    // console.log('renderContiner',key,href);
    const params = GETURLPARAMS(href);
    console.log('params==',params);
    let search = href.includes('?')?'?'+href.split('?')[1]:'';
    let nweKey =  `${key}_${href}`
    if(href.includes('uuId')){
      let newHref = ''
      href.split('?')[1].split('&').forEach((item)=>{
        if(item.split('=')[0]!='uuId'){
          newHref += `&${item}`
        }
      })
      nweKey =  `${key}_${newHref}`
    }
    const mapPathToComponent = {
      '/': <Index/>,
      '/IM': <IM key={`${key}_${href}`} location={{query:{...params},pathname:key,search:search}}/>,
      '/allWork': <AllWork key={`${key}_${href}`} location={{query:{...params},pathname:key,search:search}}/>,
      '/doneWork': <AsyncDoneWork key={`${key}_${href}`} location={{query:{...params},pathname:key,search:search}}/>,
      '/dynamicPage': <DynamicPage key={`${newKey}`} location={{query:{...params},pathname:"/dynamicPage",search:search}}/>,
      // '/dynamicPage/flowDetails': <DynamicPageFlowDetails location={{query:{...params},pathname:"/dynamicPage/flowDetails",search:search}}/>,
      '/formShow':<FormShow key={`${key}_${href}`} location={{query:{...params},pathname:"/formShow",search:search}} isUpdataAuth={true} targetKey={key}/>,
      '/onlyFormShow':<FormShow key={`${key}_${href}`} location={{query:{...params},pathname:"/onlyFormShow",search:search}} isUpdataAuth={false}/>,
      '/addressBook':<AddressList key={`${key}_${href}`} location={{query:{...params},pathname:"/addressBook",search:search}} />,
      '/backlogo':<BackLogo key={`${key}_${href}`} location={{query:{...params},pathname:"/backlogo",search:search}} />,
      '/budgetPage':<BudgetPage key={`${key}_${href}`} location={{query:{...params},pathname:"/budgetPage",search:search}}/>,
      '/calendarMg':<CalendarMg key={`${key}_${href}`} location={{query:{...params},pathname:"/calendarMg",search:search}}/>,
      '/circulateWork':<CirculateWork key={`${key}_${href}`} location={{query:{...params},pathname:"/circulateWork",search:search}}/>,
      '/desktopLayout':<DesktopLayout key={`${key}_${href}`} location={{query:{...params},pathname:"/desktopLayout",search:search}}/>,
      '/customPage':<CustomPage key={`${key}_${href}`} location={{query:{...params},pathname:"/customPage",search:search}}/>,
      '/exportList':<ExportList key={`${key}_${href}`} location={{query:{...params},pathname:"/exportList",search:search}}/>,
      '/importList':<ImportList key={`${key}_${href}`} location={{query:{...params},pathname:"/importList",search:search}}/>,
      '/waitMatter':<AsyncWaitMatter key={`${key}_${href}`} location={{query:{...params},pathname:key,search:search}}/>,
      '/trustWork':<TrustWork key={`${key}_${href}`} location={{query:{...params},pathname:key,search:search}}/>,
      '/trustedWork':<TrustedWork key={`${key}_${href}`} location={{query:{...params},pathname:key,search:search}}/>,
      '/fastDesktop':<FastDesktop key={`${key}_${href}`} location={{query:{...params},pathname:"/fastDesktop",search:search}}/>,
      '/fusionDesktop':<FusionDesktop key={`${key}_${href}`} location={{query:{...params},pathname:"/fusionDesktop",search:search}}/>,
      '/information':<Information key={`${key}_${href}`} location={{query:{...params},pathname:"/information",search:search}}/>,
      '/information/add':<InformationAdd key={`${key}_${href}`}location={{query:{...params},pathname:"/information/add",search:search}}/>,
      '/information/modify':<InformationModify key={`${key}_${href}`} location={{query:{...params},pathname:"/information/modify",search:search}}/>,
      '/informationList':<InformationList key={`${key}_${href}`} location={{query:{...params},pathname:"/informationList",search:search}}/>,
      '/informationList/detail':<InformationListDetail key={`${key}_${href}`} location={{query:{...params},pathname:"/informationList/detail",search:search}}/>,
      '/meteorological':<Meteorological key={`${key}_${href}`} location={{query:{...params},pathname:"/meteorological",search:search}}/>,
      '/cccf':<Meteorological key={`${key}_${href}`} location={{query:{...params},pathname:"/cccf",search:search}}/>,
      '/monitorWork':<MonitorWork key={`${key}_${href}`} location={{query:{...params},pathname:key,search:search}}/>,
      '/noticePage':<NoticePage key={`${key}_${href}`} location={{query:{...params},pathname:"/noticePage",search:search}}/>,
      '/notification':<Notification key={`${key}_${href}`} location={{query:{...params},pathname:"/notification",search:search}}/>,
      '/notificationList':<NotificationList key={`${key}_${href}`} location={{query:{...params},pathname:"/notificationList",search:search}}/>,
      '/pdfPreview':<PdfPreview key={`${key}_${href}`} location={{query:{...params},pathname:"/pdfPreview",search:search}}/>,
      '/personInfo':<PersonInfo key={`${key}_${href}`} location={{query:{...params},pathname:"/personInfo",search:search}}/>,
      '/personWork':<PersonWork key={`${key}_${href}`} location={{query:{...params},pathname:"/personWork",search:search}}/>,
      '/previewPrint':<PreviewPrint key={`${key}_${href}`} location={{query:{...params},pathname:"/previewPrint",search:search}}/>,
      '/publicDisk':<PublicDisk key={`${key}_${href}`} location={{query:{...params},pathname:"/publicDisk",search:search}}/>,
      '/sendWork':<SendWork key={`${key}_${href}`} location={{query:{...params},pathname:key,search:search}}/>,
      '/signDisk':<SignDisk key={`${key}_${href}`} location={{query:{...params},pathname:"/signDisk",search:search}}/>,
      '/tabletest':<Tabletest key={`${key}_${href}`} location={{query:{...params},pathname:"/tabletest",search:search}}/>,
      '/traceWork':<TraceWork key={`${key}_${href}`} location={{query:{...params},pathname:key,search:search}}/>,
      '/flowDetails':<FlowDetails key={`${key}_${href}`} location={{query:{...params},pathname:"/flowDetails",search:search}}/>,
      '/workTrust':<WorkTrust key={`${key}_${href}`} location={{query:{...params},pathname:"/workTrust",search:search}}/>,
      '/subProcessArrange':<SubProcessArrange key={`${key}_${href}`} location={{query:{...params},pathname:"/workTrust",search:search}}/>,
      '/any':<ANY key={`${key}_${href}`} location={{query:{...params},pathname:"/any",search:search}}/>,
      '/microPage':<MicroPage key={`${key}_${href}`} location={{query:{...params},pathname:"/microPage",search:search}}/>,
      '/chartPage':<ChartPage key={`${key}_${href}`} location={{query:{...params},pathname:"/chartPage",search:search}}/>,
      '/overprintManage': <OverprintManage key={`${key}_${href}`} location={{query:{...params},pathname:"/overprintManage",search:search}}/>,
      '/overprintManage/wpsPintDesign': <WpsPintDesign key={`${key}_${href}`} location={{query:{...params},pathname:"/overprintManage/wpsPintDesign",search:search}}/>,
      '/wpsRedTemplate': <WpsRedTemplate key={`${key}_${href}`} location={{query:{...params},pathname:"/wpsRedTemplate",search:search}}/>,
      '/waitMatterCma':<AsyncWaitMatterCma key={`${key}_${href}`} location={{query:{...params},pathname:key,search:search}}/>,
    }
    let newKey = key
    if(key.includes('/flowDetails')){
      newKey = '/flowDetails';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/formShow')){
      newKey = '/formShow';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/onlyFormShow')){
      newKey = '/onlyFormShow';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/dynamicPage')){//动态的时候
      newKey = '/dynamicPage';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/chartPage')){//图表的时候
      newKey = '/chartPage';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/waitMatterCma')){//气象待办事项
      newKey = '/waitMatterCma';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/waitMatter')){
      newKey = '/waitMatter';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/sendWork')){
      newKey = '/sendWork';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/doneWork')){
      newKey = '/doneWork';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/sendWork')){
      newKey = '/sendWork';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/noticePage')){
      newKey = '/noticePage';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/business_cma')){//气象
      newKey = '/meteorological';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/business_cccf')){//消防
      newKey = '/cccf';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/business_controls')){//内控
      newKey = '/budgetPage';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/main')||key.includes('/business_oa')){//支撑
      newKey = '/microPage';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/previewPrint')){
      newKey = '/previewPrint';
      return  mapPathToComponent[newKey];
    }else if(key.includes('/overprintManage/wpsPintDesign')){
      newKey = '/overprintManage/wpsPintDesign';
      return  mapPathToComponent[newKey];
    }else if(!mapPathToComponent[newKey]){
      newKey = '/any';
      return mapPathToComponent[newKey]
    }else{
      return mapPathToComponent[newKey]
    }

  }, [tabMenus, tabActivityKey])
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
          // styles.edit_card_tab
          classnames(
          styles.edit_card_tab,
          (!tableConfig && desktopType == 1) ||
            (desktopType == 1 &&
              tableConfig &&
              tableConfig.TABLE_FAST.substr(0, 1) == 1)
            ? styles.table_fast
            : null,
          )
        }
        tabBarGutter={0}
        id="dom_container"
        items={tabMenus?.map((tabMenu, index)=>({
          key: tabMenu.key,
          label: <div title={tabMenu.href.includes('/formShow')?decodeURIComponent(tabMenu.title):tabMenu.title} className="menu_lable" menuId={tabMenu.menuId} maxDataruleCode={tabMenu.maxDataruleCode}>{tabMenu.href.includes('/formShow')?decodeURIComponent(tabMenu.title):tabMenu.title}</div>,
          children: (
            <Suspense fallback={<Spin loading={true}/>}>
              <ErrorBoundary fallback={
                <Result
                  status="500"
                  title=""
                  subTitle="Sorry, something went wrong."
                  extra={<Button type="primary" onClick={dropTab.bind(this,tabActivityKey)}>关闭当前页面</Button>}
               />
              }>
              {renderContainer(tabMenu.key,tabMenu.href,index)}
              </ErrorBoundary>
            </Suspense>
          ),
          // closable: (tabMenu.key === "/fastDesktop" || tabMenu.key === "/fusionDesktop") ?  false : true,
        }))}
        popupClassName={'more_menu_list'}
      >
      </Tabs>
    </div>
  );
}

export default TabsContainer
