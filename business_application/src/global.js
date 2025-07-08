import {message} from 'antd';
import qs from 'querystring';
import {getMenuTitle} from './util/util';
import DefaultMenu from "./componments/AliveTabs/_defaultMenu";
import {history} from 'umi';
import { fetchAsync } from './util/globalFn'
global.STATE401 = false;//false是没有401的状态，true是有401的状态（用于refreshUsertoken）
global.ACTIONS401 = [];//返回401状态的action请求及参数
global.MODELERIP = 'http://192.168.1.47:8088/';//流程设置需要设置服务ip
global.MESSAGE=message;
global.GMESSAGE=message;
global.QS = qs
global.menuKey = -1;
// var pathname = window.location.pathname.split('/')[1];
// global.setItem = async (tabel,keyValues,keysWhere) =>{//修改
//   let db = new Dexie('legox_web');
//   if(!db.isOpen()){
//     let str_keys = 'id++';
//     Object.keys(keyValues).map((key)=>{
//       str_keys=str_keys+','+key
//     })
//     Object.keys(keysWhere).map((key)=>{
//       str_keys=str_keys+','+key
//     })
//     db.version(1).stores({
//       [tabel]: str_keys,
//     });
//    await db.open();
//   }
//   console.log('keysWhere==',keysWhere);
//   await db[tabel].get(keysWhere).then(data=>{
//     console.log('data=====',data);
//     if(data){
//       debugger;
//       db[tabel].update(data.id,{...keyValues,...keysWhere})
//     }else{
//       debugger;
//       db[tabel].add({...keyValues,...keysWhere});
//     }
//   })
// }
// global.getItem = (tabel,keyValues) =>{//获取
//   let db = new Dexie('legox_web');
//   if(!db.isOpen()){
//     let str_keys = 'id++';
//     Object.keys(keyValues).map((key)=>{
//       str_keys=str_keys+','+key
//     })
//     db.version(1).stores({
//       [tabel]: str_keys,
//     });
//     db.open();
//   }
//   return db[tabel].get({...keyValues});
// }

/**
 * 拼接对象为请求字符串
 * @param {Object} obj - 待拼接的对象
 * @returns {string} - 拼接成的请求字符串
 */
global.encodeSearchParams=(obj)=>{
  const params = []

  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    // 如果值为undefined我们将其置空
    if (typeof value === 'undefined') {
      value = ''
    }
    // 对于需要编码的文本（比如说中文）我们要进行编码
    params.push([key, encodeURIComponent(value)].join('='))
  })

  return params.join('&')
}
/**
 * 获取页签的key
 * @param {*} params
 * @param {*} closeKey
 * @returns
 */
global.getTabKey=(params)=>{
  let tmpkey = params.pathname;
  if(params.pathname.includes('dynamicPage')&&!params.pathname.includes('dynamicPage/formShow')){
    tmpkey = `/dynamicPage/${params?.query?.bizSolId || 0}/${params?.query?.listId || 0}/${params?.query?.formId || 0}`
  }else if(params.pathname.includes('formShow')){
    tmpkey = `/formShow/${params.query?.bizInfoId}/${params.query?.bizSolId}/${params.query?.currentTab}/${params.query?.id}`
  }else if(params.pathname.includes('flowDetails')){
    tmpkey = `/flowDetails/${params.query?.bizInfoId}`
  }else if(params.pathname.includes('budgetPage')){
    tmpkey = `/${params.query?.microAppName}/${params.query?.url}`
  }else if(params.pathname.includes('meteorological')){
    tmpkey = params.key || `/${params.query?.microAppName}/${params.query?.url}`
    if(params.query?.url=='contractAmount'){//合同余额
      tmpkey = `/${params.query?.microAppName}/${params.query?.url}/${params.query?.contractId}`
    }
  }else if(params.pathname.includes('microPage')){
    tmpkey = params.key || `/${params.query?.microAppName}/${params.query?.url}`
  }else if(params.pathname.includes('noticePage')){
    tmpkey = `${params.pathname}/${params.query?.id}/${params.query?.title}`
  }else if(params.pathname.includes('previewPrint')){
    tmpkey = `${params.pathname}/${params.query?.mainTableId}`
  }else if(params.pathname.includes('wpsPintDesign')){
    tmpkey = `${params.pathname}/${params.query?.id}`
  }
  return tmpkey;
}
/**
 * 页面跳转
 * @param {object} params {pathname:'*',query:{}}跳转的页面
 * @param {string} closeKey 要关闭的页签key
 */
global.historyPush=async(params,closeKey,isReturn)=>{
  let searchParams = '';
  if(params?.pathname.includes('/formShow')|| params?.pathname.includes('/mobile/formDetail')){
    //标题有可能包含？这个时候需要对标题编码
    if(params?.query?.title){
      params.query.title = encodeURIComponent(params.query.title);
    }
  }
  if(params.query){
    Object.keys(params.query).map((key)=>{
      if(searchParams){
        searchParams = searchParams+'&'+key+'='+params.query[key];
      }else{
        searchParams = '?'+key+'='+params.query[key];
      }
    })
    // if(!params.query.menuId){
    //   searchParams = searchParams+'&'+'menuId='+localStorage.getItem('menuId');
    // }
  }
  // 气象监控平台 & 回首页   || params?.pathname === '/'
  if(params?.pathname?.includes('customPage')){
    history.push({
      pathname: params.pathname,
    })
    return
  } 
  if(window.location.hash.includes('mobile')){
    history.push({
      pathname: params.pathname,
      search: searchParams
    })
    return
  }
  console.log('params===',params);
  console.time('historyPush');
  let newTabMenus = [ ...GETTABS() ];
  if ((params?.pathname?.includes('fastDesktop') || params?.pathname?.includes('fusionDesktop')) && newTabMenus[0].key == '/') {
    newTabMenus = newTabMenus.filter(item => item.key != '/'); //
  }
  if(closeKey){
    newTabMenus = newTabMenus.filter(item => item.key != closeKey); // 删除
  }
  //页签的key
  let tmpkey = getTabKey(params);
  window.localStorage.setItem('currentHash',`${params.pathname}${searchParams}`);
  let flag = newTabMenus.findIndex(o => o.key == tmpkey);
  console.log('flag===',flag);
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
      // 2023.10.12 dynamicPage qihan  params.pathname.includes('/dynamicPage')||
      if(params.pathname.includes('/formShow')||params.pathname.includes("/noticePage")||params.pathname.includes("/personInfo")||params.pathname.includes("/backlogo")){
        // pathname = `/formShow/${params.query?.bizInfoId}/${params.query?.bizSolId}/${params.query?.currentTab}`;
        title = params.query?.title;
      }else if(params.pathname.includes('/flowDetails')){
        title='办理详情';
      } else{
        //通过DefaultMenu或者menus获取title
        await getItem('menusList').then((data)=>{
          const menusList = data?JSON.parse(data):[];
          title = getMenuTitle(menusList,tmpkey,params.query) || DefaultMenu[params.pathname] || params.query?.title
        })
      }
    }
    //增加menuId\maxDataruleCode，为接口请求获取用
    let tmpMenuId = '';
    let tmpMaxDataruleCode = '';
    if(params?.query?.menuId){
      tmpMenuId = params.query.menuId;
      tmpMaxDataruleCode = params.query.maxDataruleCode;
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
      let tmpPathName = params.pathname;
      if(tmpPathName=='/microPage'){//跳转到子应用的时候
        tmpPathName = "/"+params.query['microAppName']+"/"+params.query['url'];
      }
      let menuInfo = params?.pathname&&menuObj?menuObj[tmpPathName]:{};
      tmpMenuId =menuInfo&&Object.keys(menuInfo).length?menuInfo['id']:'';
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
      menuId:tmpMenuId,
      maxDataruleCode:tmpMaxDataruleCode=='UNDEFINED_NULL'?'':tmpMaxDataruleCode,
      href:`${params.pathname}${searchParams}`
    })
    if(typeof isReturn!='undefined'&&isReturn){
      return {
        tabActivityKey:tmpkey,
        tabMenus:newTabMenus,
      }
    }else{
      UPDATETABS({
        tabActivityKey:tmpkey,
        tabMenus:newTabMenus,
      })
    }
  }
  console.timeEnd('historyPush');
}

// Object.defineProperty(window.location, 'hash', {
//   get: () => {
//     return this._hash
//   },
//   set: (newHash) => {
//     this._hash = newHash;
//   }
// })

global.HISTROY=()=>{
  let urlString = window.localStorage.getItem('currentHash')
  const url = new URL(urlString, window.location.origin);
  const pathname = url.pathname;
  const queryParameters = Object.fromEntries(url.searchParams.entries());
  return {
    location: {
      pathname,
      query: queryParameters
    }
  }
};

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
global.UPDATETABS = ()=>{

}
global.GETTABS = ()=>{

}
global.GET_TAB_ACTIVITY_KEY = () =>{

}
//获取menuObj
global.GETMENUOBJ = ()=>{

}