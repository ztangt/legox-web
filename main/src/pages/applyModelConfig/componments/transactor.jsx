// 办理人设置
import { connect } from 'dva';
import React, { useState,useEffect } from 'react';
import { Modal,Button,Form,Input,Space,Select,Tabs} from 'antd';
import { dataFormat } from '../../../util/util.js';
import {CloseOutlined} from '@ant-design/icons';
import _ from "lodash";
import styles from '../index.less';
import { history } from 'umi';
import HOST from './hostCirculated';//主办传阅
import { parse } from 'query-string';
const TabPane=Tabs.TabPane;
function Transactor({dispatch,query,onNodeCancel,tabValue,successChangeTab,parentState,setParentState}){
  const bizSolId = query.bizSolId;
  const {nodeObj,nodeUser,nodeUserType,actId,procDefId,bizFromInfo,preNodeTabValue,preActId,nodeTabValue} = parentState;
  const [formHost] = Form.useForm();
  const [tabTransact,setTabTransact] = useState('org');
  const [emptyVisible,setEmptyVisible] = useState({})
  const [emptyFormVisible,setEmptyFormVisible] = useState({})
  useEffect(()=>{
    nodeUserFn(actId);
    return ()=>{//页签切换默认第一个
      setParentState({
        nodeUserType:'host'
      })
    }
  },[actId])
  useEffect(()=>{
    //校验是否能切换（办理人的值域为空的时候不能切换）
    if(preNodeTabValue=='flow'||(nodeTabValue=='flow'&&preActId==actId)){
      formHost.submit();
    }
  },[preNodeTabValue,preActId])
  function nodeUserFn(nodeId){ //办理人设置
    dispatch({
      type:"applyModelConfig/getNodeUser",
      payload:{
          bizSolId,
          procDefId,
          formDeployId:bizFromInfo.formDeployId,
          actId:nodeId
      },
      callback:(data)=>{
        setParentState({
          ...data
        })
      }
    })
  }
  const changeTab=(tabValue)=>{
    let isEmpty = false;
      if(tabValue=='host'){
        isEmpty = isEmptyFn(nodeUser.reader.org);
      }else{
        isEmpty = isEmptyFn(nodeUser.handler.org);
      }
      if(isEmpty){
        return;
      }else{
        setEmptyVisible({})
      }
      setTabTransact('org')
      setParentState({
        nodeUserType:tabValue
      })
  }
  //判断组织机构值域，为空的时候提示(每次切换页面的时候就需要做判断)
  const isEmptyFn = (orgs)=>{
    let newEmptyVisible = {};
    let isEmpty = false;
    if(orgs) {
      orgs.map((item,index)=>{
        if(item.orgType!="CURRENT_ORG"&&item.orgType!="CURRENT_DEPT"){
          if(!item.orgValue){
            console.log('index=',index);
            newEmptyVisible[index]=true;
            isEmpty = true;
          }else{
            newEmptyVisible[index]=false
          }
        }
      })
      setEmptyVisible(newEmptyVisible);
    }
    return isEmpty
  }
  //判断字段中获取的值域，为空的时候提示(每次切换页面的时候就需要做判断)
  const isEmptyFormFn = (forms)=>{
    let newEmptyVisible = {};
    let isEmpty = false;
    console.log('forms=',forms);
    forms.map((item,index)=>{
      if(!item.formColumnCode){
        newEmptyVisible[index]=true;
        isEmpty = true;
      }else{
        newEmptyVisible[index]=false
      }
    })
    setEmptyFormVisible(newEmptyVisible);
    return isEmpty
  }
  console.log('nodeObj==',nodeUserType,nodeObj,nodeUser);
  // const operations = <p style={{position:'absolute',top:'8px',left:'100px'}}>页签“组”取并集，“人”取首位 </p>
    return (
        <div className={`classNodeAttribute ${styles.nodeAttribute}`} style={{height:'100%'}}>
          {(nodeObj.isDraft && nodeUserType=='host' && Object.keys(nodeUser).length)?
          <HOST
                query={query}
                onNodeCancel={onNodeCancel}
                tabValue={tabValue}
                nodeUserFn={nodeUserFn}
                setEmptyVisible={setEmptyVisible}
                emptyVisible={emptyVisible}
                isEmptyFn={isEmptyFn}
                formHost={formHost}
                emptyFormVisible={emptyFormVisible}
                setEmptyFormVisible={setEmptyFormVisible}
                isEmptyFormFn={isEmptyFormFn}
                tabTransact={tabTransact}
                setTabTransact = {setTabTransact}
                successChangeTab={successChangeTab}
                parentState={parentState}
                setParentState={setParentState}
          />:null}

          {!nodeObj.isDraft ?
            <Tabs defaultActiveKey="host" activeKey={nodeUserType} onChange={changeTab}  style={{height:'100%'}}>
                <TabPane tab="主办" key="host">
                  {nodeUserType=='host'&&Object.keys(nodeUser).length?
                    <HOST
                      query={query}
                      onNodeCancel={onNodeCancel}
                      tabValue={tabValue}
                      nodeUserFn={nodeUserFn}
                      setEmptyVisible={setEmptyVisible}
                      emptyVisible={emptyVisible}
                      isEmptyFn={isEmptyFn}
                      formHost={formHost}
                      emptyFormVisible={emptyFormVisible}
                      setEmptyFormVisible={setEmptyFormVisible}
                      isEmptyFormFn={isEmptyFormFn}
                      tabTransact={tabTransact}
                      setTabTransact = {setTabTransact}
                      successChangeTab={successChangeTab}
                      parentState={parentState}
                      setParentState={setParentState}
                    />:null}
                </TabPane>
                <TabPane tab="传阅" key="circularize">
                {nodeUserType=='circularize'&&Object.keys(nodeUser).length?
                    <HOST
                    query={query}
                      onNodeCancel={onNodeCancel}
                      tabValue={tabValue}
                      nodeUserFn={nodeUserFn}
                      setEmptyVisible={setEmptyVisible}
                      emptyVisible={emptyVisible}
                      isEmptyFn={isEmptyFn}
                      formHost={formHost}
                      emptyFormVisible={emptyFormVisible}
                      setEmptyFormVisible={setEmptyFormVisible}
                      isEmptyFormFn={isEmptyFormFn}
                      tabTransact={tabTransact}
                      setTabTransact = {setTabTransact}
                      successChangeTab={successChangeTab}
                      parentState={parentState}
                      setParentState={setParentState}
                    />:null
                  }
                </TabPane>

            </Tabs>:null
          }
        </div>
    )
}



export default (connect(({applyModelConfig,layoutG,loading})=>({
    ...applyModelConfig,
    ...layoutG,
    loading
  }))(Transactor));
