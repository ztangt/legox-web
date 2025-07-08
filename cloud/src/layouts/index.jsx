import React, { useState ,Suspense,lazy,useCallback} from 'react';
import { connect } from 'dva';
import { Link,history,getDvaApp,Outlet } from 'umi';
import ProLayout, {  SettingDrawer } from '@ant-design/pro-layout';
import defaultProps from './_defaultProps';
import styles from './index.less'
import { Tabs,Spin } from 'antd';
import _ from 'lodash';
import RightContent from '../componments/GlobalHeader/RightContent';
import logo_img from '../../public/assets/logo.svg'
import newLogo from '../../public/assets/newLogo.jpg'
import { parse } from 'query-string';

const { TabPane } = Tabs;
const Index = lazy(() => import('../pages/index'));
const Tenement = lazy(() => import('../pages/tenement'));
const Organization = lazy(() => import('../pages/organization'));
const UserMg = lazy(() => import('../pages/userMg'));
const ManageModel = lazy(() => import('../pages/manageModel'));
const SendTask = lazy(() => import('../pages/sendTask'));
class Layout extends React.Component {

  state = {
    settings : {
      "fixSiderbar": true,
      "fixedHeader": true,
      "navTheme": "light",
      "primaryColor": "#1890ff",
      "layout": "mix",
      "contentWidth": "Fluid",
      "splitMenus": false,
      "title": '云管理平台',
    },

    routerTabs:[{key:'/',name:'首页',path:'/'}],
    routes:[],
    currentKey:''
  }
  componentDidMount(){
    if((window.location.href.includes('/cloud/applyConfig')||window.location.href.includes('/cloud/designer/formDesigner'))){
      const { dispatch } = this.props
      const query = parse(history.location.search);
      var teantToken = window.localStorage.getItem("teantToken_cloud")
      var tokenArr = JSON.parse(teantToken||'[]') 
      var curTeantToken = _.find(tokenArr,{tenantId: query.tenantId}) || {} //查找当前点击的租户token信息
      var userToken = curTeantToken?.userToken || ''
      if(!userToken){//找不到当前租户的token再登录租户
        dispatch({
          type: 'user/login',
          payload: {
            clientType: 'CLOUD',
            tenantId: query.tenantId,
            refreshToken: window.localStorage.getItem("refreshToken_cloud")
          }
        })
      }
      return
    }
    if(!window.localStorage.getItem('userToken_cloud')||(window.localStorage.getItem('userToken_cloud')&&window.localStorage.getItem('tenantId_cloud'))){
      // location.href="#/login";
      history.push('/login')
    }else {
      // location.herf="/";
      history.push(history.location.pathname)
    }
    //获取name的值
    this.getPathName(defaultProps,history.location.pathname);
    const {routerTabs,routes}=this.state;
    console.log('routerTabs=',routerTabs);
    if(history.location.pathname!=='/'){
      let name='';
      routes.map((item)=>{
        if(item.path==history.location.pathname){
          name=item.name
        }
      })
      if(name){
        routerTabs.push(
          {
            key: history.location.pathname,
            path:history.location.pathname,
            name:name
          },
        )
      }
      console.log('routerTabs=',routerTabs)
      this.setState({routerTabs:routerTabs,currentKey:history.location.pathname})
      // history.push(history.location.pathname)
    }else{
      this.setState({routerTabs:routerTabs,currentKey:history.location.pathname})
    }
  }
  componentWillReceiveProps(nextProps){
    console.log('nextProps111=',nextProps)
    if(!window.localStorage.getItem('userToken_cloud')) {
      this.setState({ routerTabs:[{key:'/',name:'首页',path:'/'}] })
    }
    // const pathname = '/userMg'||'/tenement'||'/organization';
    // const { searchObj } = nextProps;
    // searchObj[pathname].current = 1;
    // searchObj[pathname].currentPage = 1;
    // searchObj[pathname].limit = 10;
    // searchObj[pathname].pageSize = 10;
    // searchObj[pathname].pageSize = 10;
    // searchObj['/tenement'].currentPage = 1;
    // searchObj['/tenement'].limit = 10;
    // searchObj['/organization']['users'].limit = 10;
    this.setState({currentKey:nextProps.currentPathname})
    if(nextProps.currentPathname==history.location.pathname&&!this.state.routerTabs.filter(item=>item.path==nextProps.currentPathname).length){
      //获取name的值
      this.getPathName(defaultProps,nextProps.currentPathname);
      const {routerTabs,routes}=this.state;
      let name='';
      routes.map((item)=>{
        if(item.path==nextProps.currentPathname){
          name=item.name
        }
      })
      if(name){
        routerTabs.push({
          key: nextProps.currentPathname,
          path:nextProps.currentPathname,
          name:name
        })
      }
      console.log('routerTabs=',routerTabs);
      // this.setState({routerTabs:routerTabs})
    }
  }
  //循环获取name
  getPathName(data){
    const {routes}= this.state;
    data.map((item)=>{
      routes.push({
        path:item.path,
        name:item.name
      })
      if(item.routes&&item.routes.length){
        this.getPathName(item.routes)
      }
    })
    this.setState({routes:routes})
  }
  onSettingChange(config){
    this.setState({settings: config})
  }

   onMenuClick(item){
      const { dispatch,searchObj } = this.props;
      let {routerTabs}=this.state;
      if(typeof this.props.routerTabs!='undefined'&&this.props.routerTabs.length){
        routerTabs=[...routerTabs,...this.props.routerTabs];
      }
      console.log('routerTabs=',routerTabs);
      let flag = routerTabs.findIndex((r)=>{return r.path==item.path});
      if(routerTabs.length==0){
        routerTabs.push(item)
      }else{
        if(flag==-1){
          routerTabs.push(item)
        }

      }
      this.setState({routerTabs:routerTabs,currentKey:item.path});

  }

   onTabClick(key){
    const { dispatch, searchObj } = this.props
    let {routerTabs}=this.state;
    this.setState({currentKey:key})
    if(typeof this.props.routerTabs!='undefined'&&this.props.routerTabs.length){
      routerTabs=[...routerTabs,...this.props.routerTabs];
    }
    let path = key//当前点击的路由
    let url = path

    if(searchObj[path]){
      const  { currentPage, searchWord, currentNode} = searchObj[path]//路由上的搜索对象
      url = `${path}?currentPage=${currentPage}&searchWord=${searchWord}&currentNodeId=${currentNode?currentNode.key:''}&currentNodeType=${currentNode?currentNode.nodeType:''}`
      searchObj[key].isInit = 0
      dispatch({
        type: 'layoutG/updateStates',
        payload: {
          searchObj
        }
      })
    }


    if(key!=-1){
      history.replace(url);
    }
  }
  onRemove(key){
    console.log('key=',key);
    const { dispatch,searchObj } = this.props
    let {routerTabs}=this.state;
    // let flag = routerTabs.findIndex((r)=>{return r.path==key});
    if(typeof this.props.routerTabs!='undefined'&&this.props.routerTabs.length){
      routerTabs=[...routerTabs,...this.props.routerTabs];
    }
      if(key=='/'){
        return
      }
      // if(routerTabs.length==1){
      //   location.href="#/login";
      // }
      if(searchObj[key]){//删除以后恢复到初期值
        searchObj[key].currentPage = 1,
        searchObj[key].searchWord = ''
        searchObj[key].currentNode = {}
        searchObj[key].treeData =[]
        searchObj[key].expandId = ''
        searchObj[key].expandedKeys = []
        searchObj[key].treeSearchWord = ''
        searchObj[key].autoExpandParent = false
        searchObj[key].isInit = 1
        dispatch({
          type: 'layoutG/updateStates',
          payload: {
            searchObj
          }
        })
      }
      let reStateRouterTabs = this.state.routerTabs.filter(item=>item.path!=key); //过滤state中的值
      let rePropsRouterTabs = this.props.routerTabs.filter(item=>item.path!=key);//过滤props中的值
      if(reStateRouterTabs.length!=0||rePropsRouterTabs.length!=0){
        //let router  = routerTabs[key-1]
        console.log(rePropsRouterTabs,'rePropsRouterTabs');
        this.setState({routerTabs:reStateRouterTabs})
        dispatch({
          type: 'layoutG/updateStates',
          payload: {
            //currentKey: key-1,
            routerTabs:rePropsRouterTabs
          }
        })
        if(key==history.location.pathname){//如果删除path等于当前的则显示到跳转到后一个
          let goKey = '';
          routerTabs.map((item,index)=>{
            if(item.path==key){
              if(index==routerTabs.length-1){
                goKey=index-1
              }else{
                goKey=index+1
              }
            }
          })
          history.push(routerTabs[goKey].path);
        }
      }else{
        history.push('/login')
        // location.href='#/login'
      }
      const returnModel = (namespace) => {
        var obj = _.find(getDvaApp()._models, { namespace: namespace }) || {}; //获取当前路径下的model
        // if(JSON.stringify(obj)=='{}'){
        //   returnModel(history.location.pathname.split('/')[1])
        // }else{
        return obj;
        // }
      };
      let namespace =  key.split('/')[1];
      let model = returnModel(namespace);
      if (namespace == 'organization') {
        getDvaApp()._store.dispatch({
          //初始化model state中的值
          type: `${model.namespace}/updateStates`,
          payload: {
          },
          isClear:true
        });
      } 
      if (namespace&&namespace !== 'organization') {
        let model = returnModel(namespace);
        getDvaApp()._store.dispatch({
          //初始化model state中的值
          type: `${model.namespace}/updateStates`,
          payload: {
            ...model.state,
          },
        });
      }





  }

  onEdit(targetKey, action){
    if(action=='remove'){
      this.onRemove(targetKey)
    }
  }
   renderContainer = (key,tabIndex) =>{
    // console.log('renderContiner',key,href);
    let { settings,routerTabs,currentKey } = this.state
    // const params = href&&GETURLPARAMS(href);
    // console.log('params==',params);
    // let search = href&&href.includes('?')?'?'+href.split('?')[1]:'';
    const mapPathToComponent = {
      '/': <Index  key={`${key}`} location={{pathname:"/"}}/>,
      '/tenement': <Tenement key={`${key}`} location={{pathname:"/tenement"}}/>,
      '/userMg': <UserMg key={`${key}`} location={{pathname:"/userMg"}}/>,
      '/organization': <Organization key={`${key}`} location={{pathname:"/organization"}}/>,
      '/manageModel': <ManageModel key={`${key}`} location={{pathname:"/manageModel"}}/>,
      '/sendTask': <SendTask key={`${key}`} location={{pathname:"/sendTask"}}/>,

    }
    let newKey = key
    if(!mapPathToComponent[newKey]){
      newKey = '/any';
      return mapPathToComponent[newKey]
    }else{
      return  mapPathToComponent[newKey];
    }

  }



  render(){

    let { settings,routerTabs,currentKey } = this.state
    const { children,searchObj,location } = this.props
    if(typeof this.props.routerTabs!='undefined'&&this.props.routerTabs.length){
      routerTabs=[...routerTabs,...this.props.routerTabs];
    }
    if(window.localStorage.getItem('userToken_cloud')) {
      // history.push('/')
      // location.href="/";
    } else {
      history.push('/login')
      // location.href="/#login";
  
    }
    // debugger;

    if (history.location.pathname === '/login' || history.location.pathname === '/userAuthorization') {
      return <Outlet/>
    }
    // debugger;

    const menuDataRender=()=>{
      let menu = [];
      defaultProps.map((item)=>{
        if(item.path!='/'){
          menu.push(item);
        }
      })
      return menu
    }
    if(window.location.href.includes('/cloud/applyConfig')||
      window.location.href.includes('/cloud/designer/formDesigner')){
      return <Outlet/>
    }
    return (
      <div
        id="pro-layout"
        style={{
          height: '100vh',
          overflow:'hidden'
        }}
      >
        <ProLayout
          className={styles.layout}
          menuDataRender={()=>menuDataRender()}
          location={history.location}
          fixSiderbar
          logo={newLogo}
          rightContentRender={() => <RightContent />}
          onMenuHeaderClick={(e) => console.log(e)}
          menuItemRender={(item, dom) => {
            return(
             <Link  to={`${item.path}?isInit=${searchObj[item.path]?searchObj[item.path].isInit:0}`} onClick={this.onMenuClick.bind(this,item)}>{dom}</Link>

          )}}


          {...settings}
        >
        <div  className={styles.right_wrap}>
          <Tabs
            className={styles.edit_card_tab}
            type="editable-card"
            onChange={this.onTabClick.bind(this)}
            onEdit={this.onEdit.bind(this)}
            activeKey={currentKey}
            id="dom_container"
          >
           
            {routerTabs.map((pane,index) => <TabPane tab={pane.name} key={pane.path} closable={pane.path=="/"?false:true} >
               <Suspense fallback={<Spin loading={true}/>}>
               {this.renderContainer(pane.key,index)}
                          </Suspense>
              </TabPane>
            )}

            
          </Tabs>
        </div>
        {/* <div className={styles.container} id='dom_container'>
        <Outlet/>
        </div> */}
        </ProLayout>
        <SettingDrawer
          getContainer={() => document.getElementById('pro-layout')}
          settings={settings}
          hideHintAlert={true}
          onSettingChange={this.onSettingChange.bind(this)}
        />

      </div>
    );
  }
}


export default connect(({layoutG,tree})=>({
  ...layoutG,
  ...tree
}))(Layout);
