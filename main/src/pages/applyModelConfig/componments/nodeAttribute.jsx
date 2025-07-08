import { connect } from 'dva';
import React, { useState,useRef,useEffect,useCallback } from 'react';
import { Modal,Button,message,Input,Space,Select,Tabs,Form,TreeSelect} from 'antd';
import NodeFormAuth from './nodeFormAuth';
import NodeAttAuth from './nodeAttAuth';
import _ from "lodash";
import styles from '../index.less';
import BASIC from './basicAttribute';
import TRANSACTOR from './transactor';
import ModalBindCode from './modalBindCode';
import ButtonAuth from './buttonAuth';
import Gateway from './gateway';
import GlobalModal from '../../../componments/GlobalModal';
import {MinusSquareOutlined,PlusSquareOutlined} from '@ant-design/icons';
const TabPane=Tabs.TabPane;
function NodeAttribute ({query,dispatch,loading,onCancel,parentState,setParentState}){
    const bizSolId = query.bizSolId;
    const {actId,codeList,nodeObj,nodeElement,nodeTabValue,authorityTab,preNodeTabValue,
      preAuthorityTab,nextAuthorityTab,nextNodeTabValue,nextActId,nodeTreeList,bizFromInfo}=parentState;
    const [form]=Form.useForm();
    useEffect(()=>{
      console.log('actId123=',actId);
      if(actId&&actId!='0'){
        initStateFn(actId)
      }
    },[actId])
    function initStateFn(actId){//节点改变初期话数据
      let arr = nodeElement.filter( x => actId == x.id)
      setParentState({
        nodeUser:{},
        actId:actId,
        nodeTabValue:arr&&arr[0].isDraft?'flow':'info',//第一个节点不显示基本属性
        nodeUserType:'host',
        authorityTab:'form',
        nodeObj:arr[0]
      })
    }
    console.log('procDefTreeList==',nodeTreeList);
    // const eventNodeType = '事件处理器';
    function operations() {//TODO
      // let 
      // //&&arr[i].type != 'SubProcess'&&arr[i].type != 'EndEvent'
      // let newList = list.filter(i=>i.type!='SubProcess'&&i.type!='EndEvent');
      //   const listItems = newList.map((item,i) =>{
      //       return (<Select.Option value={item.id} key={i}>{item.name}</Select.Option>)
      //   });
      //   return (
      //       <Select style={{width:'200px',float:"right"}} value={nodeObj.id} onChange={operationOnChange.bind(this)}>{listItems}</Select>
      //   );
      return (
        <TreeSelect
         treeData={nodeTreeList?.[0]?.children||[]}
         onSelect={operationOnChange.bind(this)}
         style={{width:'200px'}}
         defaultValue={actId}
         popupClassName={styles.operations}
         getPopupContainer={()=>{return document.getElementById(`node_attribute_${bizSolId}`)}}
         dropdownMatchSelectWidth={false}
         switcherIcon={(props)=>{
          console.log('props===',props)
          return (
            props.expanded ? (
              <MinusSquareOutlined
                style={{fontSize:'14px'}}
              />
            ) : (
              <PlusSquareOutlined
                style={{fontSize:'14px'}}
              />
            )
          )
         }}
        />
      )
    }
    const changeTab=(value)=>{
      if(value=='node'){//等于操作权限的时候需要下级页签便成第一个
        setParentState({
          preNodeTabValue:nodeTabValue,
          nextNodeTabValue:value,
          authorityTab:'form'
        })
      }else{
        setParentState({
          preNodeTabValue:nodeTabValue,
          nextNodeTabValue:value
        })
      }
    }
    function operationOnChange(selectedKeys,node){
      setParentState({
        preActId:actId,
        nextActId:node.actId,
      })
    }
    function onNodeCancel(){
      setParentState({
        nodeAttributeModal:false,
      })
    }
    //切换触发保存按钮的click事件
    function changeAuthority(tabValue){
      setParentState({
        preAuthorityTab:authorityTab,
        nextAuthorityTab:tabValue
      })
    }
    //切换页签的处理
    const changeAuthorityTab = ()=>{
      if(preAuthorityTab=='form'||preAuthorityTab=='button'||preAuthorityTab=='att'){//切换小的标签
        setParentState({
          preAuthorityTab:'',
          authorityTab:nextAuthorityTab,
          nextAuthorityTab:'',
          nodeChangeStatus:false//用于表单授权的内容是否有改变
        })
      }
    }
    const successChangeTab=()=>{//成功切换页签
      if(nextNodeTabValue){
        setParentState({
          nodeTabValue:nextNodeTabValue,
          nextNodeTabValue:'',
          preNodeTabValue:'',
          nodeChangeStatus:false//用于表单授权的内容是否有改变
        })
      }else if(nextActId){
        setParentState({
          actId:nextActId,
          nextActId:'',
          preActId:'',
          nodeChangeStatus:false//用于表单授权的内容是否有改变
        })
      }
    }
    return (
        <GlobalModal
            // getContainer={false}
            visible={true}
            widthType={3}
            title={`${nodeObj.name}-节点属性`}
            bodyStyle={{padding: '0px 8px 0px 8px',overflow:'hidden'}}
            onCancel={onCancel}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
              return document.getElementById(`code_modal_${bizSolId}`)||false
            }}
            footer={false}
        >
          {Object.keys(nodeObj).length&&!nodeObj.type.includes('Gateway')?
            <div className={`classNodeAttribute ${styles.nodeAttribute}`} style={{height:"100%"}} id={`node_attribute_${bizSolId}`}>
                <Tabs activeKey={nodeTabValue} onChange={changeTab} tabBarExtraContent={operations()} className={styles.form_auth} style={{height:"100%"}}>
                    {/* {nodeElement[0].id!=nodeObj.id?
                    <TabPane tab="基本属性" key="info">
                      {nodeTabValue=='info'&&
                        <BASIC
                          onNodeCancel={onNodeCancel}
                          location={location}
                          successChangeTab={successChangeTab}
                        />
                      }
                    </TabPane>
                    :null
                    } */}
                    {
                      nodeElement.map((item,index)=>{
                          if(item.id!==nodeObj.id&&item.isDraft){
                              return  <TabPane tab="基本属性" key="info">
                              {nodeTabValue=='info'&&
                                <BASIC
                                  onNodeCancel={onNodeCancel}
                                  query={query}
                                  successChangeTab={successChangeTab}
                                  parentState={parentState}
                                  setParentState={setParentState}
                                />
                              }
                            </TabPane>
                          }
                      })
                    }
                    <TabPane tab="办理人设置" key="flow">
                        {nodeTabValue=='flow'?
                          <TRANSACTOR
                            query={query}
                            onNodeCancel={onNodeCancel}
                            tabValue={nodeTabValue}
                            successChangeTab={successChangeTab}
                            parentState={parentState}
                            setParentState={setParentState}
                          /> :
                          ''
                        }

                    </TabPane>
                    <TabPane tab="操作权限" key="node" className={styles.opration_auth}>
                      <Tabs onChange={changeAuthority} activeKey={authorityTab}>
                        <TabPane tab="表单" key="form" style={{overflow:'auto'}} >
                        {nodeTabValue=='node'&&authorityTab=='form'?
                          <NodeFormAuth
                            bizSolId={bizSolId}
                            query={query}
                            changeAuthorityTab={changeAuthorityTab}
                            cancelNodeModal={onCancel}
                            successChangeTab={successChangeTab}
                            setParentState={setParentState}
                            parentState={parentState}
                          />
                          :null
                        }
                        </TabPane>
                        {bizFromInfo?.template?.includes('ANNEX')&&
                        <TabPane tab="关联文档" key="att">
                          {nodeTabValue=='node'&&authorityTab=='att'?
                            <>
                              <NodeAttAuth
                                bizSolId={bizSolId}
                                query={query}
                                changeAuthorityTab={changeAuthorityTab}
                                cancelNodeModal={onCancel}
                                successChangeTab={successChangeTab}
                                setParentState={setParentState}
                                parentState={parentState}
                              />
                            </>:
                            null
                          }
                        </TabPane>}
                        <TabPane tab="按钮" key="button" className={styles.node_button_auth}>
                          {nodeTabValue=='node'&&authorityTab=='button'?
                            <>
                              <ButtonAuth
                                query={query}
                                form={form}
                                actId={actId}
                                submitEvent={()=>{}}
                                changeAuthorityTab={changeAuthorityTab}
                                successChangeTab={successChangeTab}
                                parentState={parentState}
                                setParentState={setParentState}
                                style={{height:'calc(100% - 48px)'}}
                              />
                              <div className={styles.node_button}>
                                <Button type="priamry" loading={loading.global} className={styles.save} onClick={onCancel}>取消</Button>
                                <Button type="priamry" onClick={()=>{form.submit()}} loading={loading.global} type="primary" className={styles.save}>保存</Button>
                              </div>
                            </>:
                            null
                          }
                        </TabPane>
                      </Tabs>

                    </TabPane>
                    <TabPane tab="编号绑定" key="rule">
                    {nodeTabValue=='rule'&&<ModalBindCode
                          isNode={true}
                          query={query}
                          cancelNodeModal={onCancel}
                          tabValue={nodeTabValue}
                          successChangeTab={successChangeTab}
                          parentState={parentState}
                          setParentState={setParentState}
                        />}
                    </TabPane>
                </Tabs>
            </div>:
            (Object.keys(nodeObj).length&&nodeObj.type.includes('Gateway')?<Gateway
              query={query}
              cancelNodeModal={onCancel}
              operations={operations}
              successChangeTab={successChangeTab}
              nodeObj={nodeObj}
              parentState={parentState}
              setParentState={setParentState}
            />:'')
          }
        </GlobalModal>
    )
}



export default (connect(({applyModelConfig,layoutG,loading})=>({
    applyModelConfig,
    ...layoutG,
    loading
  }))(NodeAttribute));
