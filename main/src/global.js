import {history} from 'umi'
import { getMenuTitle,dataFormat } from './util/util';
import DefaultMenu from "./componments/AliveTabs/_defaultMenu";
import {fetchAsync} from './util/globalFn';
global.STATE401 = false;//false是没有401的状态，true是有401的状态（用于refreshUsertoken）
global.ACTIONS401 = [];//返回401状态的action请求及参数
global.MODELERIP = 'http://192.168.1.47:8088/';//流程设置需要设置服务ip
global.GET_TITLE=(pathname,query,key)=>{
  let title = ''
  if(pathname=='/applyModelConfig'){
    title = `${query?.bizSolName}配置`
  }if(pathname=='/microPage'){
    title = `${query?.title}`
  }else{
    //通过DefaultMenu或者menus获取title
    const menusList = window.localStorage.getItem('menusList')?JSON.parse(window.localStorage.getItem('menusList')):[];
    title = getMenuTitle(menusList,key,query) || DefaultMenu[pathname]
  }
  return title
}
global.GET_PARAMS = (query) =>{
  let searchParams = '';
  if(query){
    Object.keys(query).map((key)=>{
      if(searchParams){
        searchParams = searchParams+'&'+key+'='+query[key];
      }else{
        searchParams = '?'+key+'='+query[key];
      }
    })
  }
  return searchParams
}
global.GET_KEY = (pathname,query) =>{
  let tmpkey = pathname;
    if(pathname.includes('/userInfoManagement/userView')){
      tmpkey = `/userInfoManagement/userView/${query?.userId}/${query?.identityId}`
    }else if(pathname.includes('/applyModelConfig')){
      tmpkey = `/applyModelConfig/${query?.bizSolId}`
    }else if(pathname.includes('/moudleDesign')){
      tmpkey = `/listMoudles/moudleDesign/${query?.moudleId}`
    }
  return tmpkey
}
global.historyPush=async(params,closeKey)=>{
    let newTabMenus = [ ...GETTABS() ];
    if(closeKey){
      console.log('closeKey',closeKey);
      if(closeKey=='ALL'){
        newTabMenus = newTabMenus.filter(item => item.key=='/'); // 删除全部
      }else if(closeKey=='OTHER'){
        newTabMenus = newTabMenus.filter(item => item.key=='/'||item.key==params.key); // 删除其他
      }else{
        newTabMenus = newTabMenus.filter(item => item.key != closeKey); // 删除当前
      }
      console.log('newTabMenus',newTabMenus);
    }
    let searchParams = ''
    if(params.query){
      Object.keys(params.query).map((key)=>{
        if(searchParams){
          searchParams = searchParams+'&'+key+'='+params.query[key];
        }else{
          searchParams = '?'+key+'='+params.query[key];
        }
      })
    }
    //页签的key
    let tmpkey = GET_KEY(params.pathname,params.query)
    // let tmpkey = params.pathname;
    // if(params.pathname.includes('/userInfoManagement/userView')){
    //   tmpkey = params.key || `/userInfoManagement/userView/${params?.query?.userId}`
    // }else if(params.pathname.includes('/applyModelConfig')){
    //   tmpkey = `/applyModelConfig/${params.query?.bizSolId}`
    // }else if(params.pathname.includes('/moudleDesign')){
    //   tmpkey = `/moudleDesign/${params.query?.moudleId}`
    // }
    let flag = newTabMenus.findIndex(o => o.key == tmpkey);
    //存在就只改变选中状态
    if(flag!=-1){
      newTabMenus[flag].href =  `${params.pathname}${searchParams}`;
      UPDATETABS({
        tabActivityKey:tmpkey,
        tabMenus:newTabMenus,
      })
    }else{
      //不存在需要将跳转页面放入到页签中
      //页签的title
      let title = params.title || '';
      if(!title){
        if(params.pathname=='/applyModelConfig'){
          title = `${params.query.bizSolName}配置`
        }else{
          //通过DefaultMenu或者menus获取title
          const menusList = window.localStorage.getItem('menusList')?JSON.parse(window.localStorage.getItem('menusList')):[];
          title = getMenuTitle(menusList,tmpkey,params.query) || DefaultMenu[params.pathname]
        }
      }
      //增加menuId\maxDataruleCode，为接口请求获取用
      let tmpMenuId = '';
      let tmpMaxDataruleCode = '';
      if(params?.query?.menuId){
        tmpMenuId = params.query.menuId;
        tmpMaxDataruleCode = params.query?.maxDataruleCode||'';
      }else{
        //获取来源的menuId
        //获取当前激活页签的lable的menuId属性
        let activeNode = document.getElementById(`dom_container`)?.getElementsByClassName('ant-tabs-tab-active')?.[0];
        tmpMenuId =  activeNode?.getElementsByClassName('menu_lable')[0]?.getAttribute('menuId')||'';
        tmpMaxDataruleCode = activeNode?.getElementsByClassName('menu_lable')[0]?.getAttribute('maxDataruleCode')||'';
      }
      //如果URL和父节点都没有menuId,则通过registerIdMenu获取menuId
      if(!tmpMenuId){
        const menuObj = GETMENUOBJ();
        let menuInfo = params?.pathname&&menuObj?menuObj[params.pathname]:{};
        tmpMenuId =Object.keys(menuInfo).length?menuInfo['id']:'';
      }
      if(tmpMenuId&&!tmpMaxDataruleCode){
        //通过menuId获取maxDataruleCode
        await fetchAsync(`sys/datarule/identity?menuId=${tmpMenuId}`,{method:'GET'}).then((data)=>{
          if(data.data.code==200){
            tmpMaxDataruleCode = data.data.data.maxDataruleCode
          }else{
            message.error(data.data.msg);
          }
        })
      }
      newTabMenus.push({
        key: tmpkey,
        title: title,
        href:`${params.pathname}${searchParams}`,
        pathname: params.pathname,
        query: params.query,
        menuId:tmpMenuId,
        maxDataruleCode:tmpMaxDataruleCode,
      })
      UPDATETABS({
        tabActivityKey:tmpkey,
        tabMenus:newTabMenus,
      })

    }
    history.push({
      pathname: params.pathname,
      search: searchParams
    })

}
global.UPDATETABS = ()=>{

}
global.GETTABS = ()=>{

}
global.GET_TAB_ACTIVITY_KEY = () =>{

}
//解析url或者参数
global.GETURLPARAMS=(url)=>
{
  let params = {};
  let query = url&&url.split('?');
  if(query&&query.length>=2){
    let vars = query[1].split("&");
    for (let i=0;i<vars.length;i++) {
      let pair = vars[i].split("=");
      if(i==vars.length-1&&query.length>2){
        params[pair[0]] = `${pair[1]}?${query[2]}`
      }else{
        params[pair[0]] = pair[1]
      }

    }
  }

  return params;
}
global.dataFormat = dataFormat;

global.MENU_KEY = -1;
//获取menuObj
global.GETMENUOBJ = ()=>{

}