import { connect } from 'dva';
import React, { useState,useEffect } from 'react';
import { Input,Button,message,Radio,Select, Form,TreeSelect} from 'antd';
import FirstDesign from './firstDesign';
import SecondDesign from '../../../componments/moudleDesign/secondDesign';
import moudleDesign from './model'
import { history,getDvaApp } from 'umi'
import { parse } from 'query-string';
import _ from 'lodash'
const { SHOW_PARENT } = TreeSelect;
function firstDesign({stateInfo}){
    const query = parse(history.location.search);
    console.log('queryquery',query);
    const {step}  = stateInfo;
    // const index =  _.findIndex(getDvaApp()._models,{namespace: `moudleDesign_${_.replace(window.location.hash, '#/support/listMoudles/moudleDesign?moudleId=', '')}`})
    const index =  _.findIndex(getDvaApp()._models,{namespace: `moudleDesign_${query.moudleId}`})
   if(index==-1&&window.location.hash.includes('/moudleDesign')){
    getDvaApp().model({...moudleDesign,namespace: `moudleDesign_${query.moudleId}`})
   }

   if(step==1){
    return <FirstDesign stateInfo={stateInfo} dataName={'listMoudleInfo'}/>
   }else if(step==2){
    return <SecondDesign 
                containerId={`moudleDesign_container_${query.moudleId}_${query.ctlgId}`} 
                namespace={`moudleDesign_${query.moudleId}`} 
                stateInfo={stateInfo}
                dataName={'listMoudleInfo'}
                tableColumnName={'columnList'}
            />
   }else{
    return null
   }
    
}

export default connect((state)=>({
    'stateInfo':{...state[`moudleDesign_${parse(history.location.search).moudleId}`]}
}))(firstDesign);