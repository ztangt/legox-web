import {Form,Button} from 'antd';
import {connect,history,useOutletContext} from 'umi';
import { useState } from 'react';
import DETAILS from '../../../componments/flowDetails/flowDetails';
function Index({location,dispatch,flowDetails,loading}){
  const search = location.search.includes('?') || !location.search ? location.search : `?${location.search}`
  return (
      <DETAILS location={location|| useOutletContext()?.location}/>
  )
}
export default connect(({formShow,loading})=>{return {formShow,loading}})(Index);
