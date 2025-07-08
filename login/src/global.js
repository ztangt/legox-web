global.STATE401 = false;//false是没有401的状态，true是有401的状态（用于refreshUsertoken）
global.ACTIONS401 = [];//返回401状态的action请求及参数
global.MODELERIP = 'http://192.168.1.47:8088/';//流程设置需要设置服务ip
import GoDB from 'godb';
global.mark = ''
global.getItemValue = ''
global.legoxDB = {}
global.setItem = (key,value,tableName) =>{//修改
  legoxDB = new GoDB('legoxDB')
  legoxDB.table(tableName||'legoxDB').put({[key]:value,id:key})
}
global.getItem = (key,tableName) =>{//获取
    let id = key
    if(typeof legoxDB=='object'&&!Object.keys(legoxDB).length){
      return new Promise((resolve, reject) => {
        resolve(JSON.stringify([]))
      });
    }
    let table = legoxDB.table(tableName||'legoxDB')
    return table
    .get({id:id})
    .then((data)=>{
        // getItemValue = data
        return data[key]
    },(error)=>{//异常
        console.log('error',error);
        return
    })
}
global.removeItem = (key,tableName) =>{//删除
     legoxDB.table(tableName||'legoxDB').delete({id: key})
}
// global.clear = (tableName) =>{//清除
//     legoxDB.delete({id:1})
// }

// global.getDBItem = (key,tableName) =>{//获取
//     let id = key
//     let table = legoxDB.table(tableName||'legoxDB')
//     return table
//     .get({id:id})
//     .then((data)=>{
//         return data[key]
//     },(error)=>{//异常
//         console.log('error',error);
//         return
//     })
// }
// global.globalGetMenus = (key='menus') => {
//   if(getItemValue?.[key]){
//     return getItemValue?.[key];
//   }else{
//     getItem(key);
//     return getItemValue?.[key];
//   }
// }
global.confirmBoard = () => {}
global.IDENTITYID= ''
// const detectZoom = () => {
//   return window.outerWidth / window.innerWidth;
// }

// window.addEventListener('resize', () => {
//   const zoom = detectZoom();
//   if (zoom > 1 + Number.EPSILON) {
//     window.document.body.style = `width:${(zoom) * 100}%; height:${(zoom) * 100}%;`;
//   } else {
//     window.document.body.style = '';
//   }
// })
