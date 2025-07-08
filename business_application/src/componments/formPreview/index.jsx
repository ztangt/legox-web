import { useMemo, useState,useCallback, useEffect } from 'react';
import FormShow from './preview';
import Tabs from "../TLTabs/index";
import styles from './tabForm.less';
import FormModeling from '../../pages/dynamicPage/componments/formModeling';
import {connect} from 'umi';
// const items = [
//   {
//     label: `Tab 2`,
//     content: `()=>{
//       updateExtraQuery({
//         bizSolId:'1574956822232674306',
//         type:'list'
//       },activeKey)
//     }`,
//   },
//   {
//     label: `Tab 3`,
//     content: `()=>{
//       updateExtraQuery({
//         bizSolId:'1575371723883257857',
//         type:'form'
//       },activeKey)
//     }`,
//   },
// ];
function TabForm({location,isUpdataAuth,dispatch,targetKey,onDetail}){
  const [allExtraQuery,setAllExtraQuery]=useState({})
  const [tabItems,setTabItems] = useState([]);
  const updateExtraQuery=(obj,key)=>{
    let tmpinfo = _.clone(allExtraQuery);
    tmpinfo[key] = obj;
    setAllExtraQuery(tmpinfo)
  }
  const onChange=(activeKey)=>{
    if(activeKey!='FORM'&&activeKey!='ANNEX'&&!allExtraQuery[activeKey]){
      tabItems.map((item,index)=>{
        let tmpKey = (index+2).toString();
        if(tmpKey==activeKey){
          let fn = eval(item.content);
          fn();
        }
      })
    }
  }
  useEffect(()=>{
    dispatch({
      type:"formShow/getFormTabs",
      payload:{
        bizSolId:location.query.bizSolId
      },
      callback:(list)=>{
        console.log('list==',list);
        list.map((item)=>{
          fetch(item.eventUrl)
          .then((res) => res.text())
          .then((text) => {
            item.content = text;
          });
        })
        setTimeout(()=>{
          setTabItems(list)
        },50)
      }
    })
  },[])
  return (
    <FormShow
      location={location}
      isUpdataAuth={isUpdataAuth}
      onTabChange={onChange}
      tabItems={tabItems}
      allExtraQuery={allExtraQuery}
      targetKey={targetKey}
      onDetail={onDetail}
    />
  )
}
//export default TabForm;
export default connect(
  ({ formShow}) => {
    return { formShow};
  },
)(TabForm);
