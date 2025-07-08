import { message, Modal } from 'antd'
import qs from 'querystring'
import { v4 as uuidv4 } from 'uuid'
import request from '../service/request'
export const CONFIRM = Modal.confirm
export const MESSAGE = message
export const QS = qs
export const LOCATIONHASH = () => {
  return window.localStorage.getItem('currentHash')
}
export const UUID = () => {
  return uuidv4()
} //随机数
//这个是为了在按钮，配置相应器，规则定义中写fetch，等待数据返回在往下进行
//暂时写到全局，会有点影响内存，暂时不知道影响大不大
export const fetchAsync = async(action,params) =>{
  //获取来源的menuId
  //获取当前激活页签的lable的menuId属性
  let activeNode = document.getElementById(`dom_container`)?.getElementsByClassName('ant-tabs-tab-active')?.[0];
  let  menuId=  activeNode?.getElementsByClassName('menu_lable')[0]?.getAttribute('menuId')||'';
  const maxDataruleCode = activeNode?.getElementsByClassName('menu_lable')[0]?.getAttribute('maxDataruleCode')||'';
  const buttonId =
  window.localStorage.getItem('currentButtonId') || '';
  const listId =
  window.localStorage.getItem('listId') || '';
  const bizSolId =
  window.localStorage.getItem('bizSolId') || '';
  let options = {};
  options.body = qs.stringify(params.body);
  options.data = params.body
  return request(
    action,
    {
      ...params,
      ...options,
      headers:{
        Authorization: "Bearer " + window.localStorage.getItem("userToken"),
        'Content-Type': 'application/x-www-form-urlencoded',
        menuId,
        buttonId,
        identityId: IDENTITYID,
        Datarulecode: maxDataruleCode, //放到上面，应为有的接口需要自定义dataRuleCode
        'TL-micro-app': 'business_application',
        bizSolId,
        listId,
        ...params.headers
      }
    }
  );
}
