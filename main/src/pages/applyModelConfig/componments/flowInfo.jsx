import React, { useState, useRef, useEffect,Fragment} from 'react';
import { connect } from 'dva';
import { Space, Button, message,Spin } from 'antd';
import styles from '../index.less';
import FormInfo from './formInfo';
import BpmnView from './bpmnView'
import VERSIONSCUT from './versionsCut';
import SyncVersionCfg from './syncVersionCfg';
import FlowReuse from './flowReuse'
import DesignFlowModal from './designFlowModal'
function FlowInfo({ query,dispatch,parentState,setParentState }) {
  const bizSolId = query.bizSolId;
  let { bizSolInfo, newFlowImg, procDefId, versionsCutModal, flowReuseModel, version, bizFromInfo, versionList, selectVersionId, 
    syncVersionCfgData,flowStatus} =parentState;
  const [hasBpmnId, setHasBpmnId] = useState(null);
  const [isShowBpmnModal,setIsShowBpmnModal] = useState(false)
  const [isReused,setIsReused] = useState(false) // 是否是流程复用
  const ref=useRef();
  useEffect(()=>{
    if(ref?.current){
      ref?.current.addEventListener('click', function(event) {
        if(!flowStatus){
          setTimeout(()=>{//加这个的原因是这样就不会对复选框有影响了
            setParentState({
              flowStatus:true
            })
          },1)
        }
      });
      ref?.current.addEventListener('change', function(event) {
        if(!flowStatus){
          setTimeout(()=>{
            setParentState({
              flowStatus:true
            })
          },1)
        }
      });
      ref?.current.addEventListener('keyup', function(event) {
        if(!flowStatus){
          setTimeout(()=>{
            setParentState({
              flowStatus:true
            })
          },1)
        }
      });
      return ()=>{
        ref?.current?.removeEventListener('click', function(){
  
        });
        ref?.current?.removeEventListener('change', function(){
  
        });
        ref?.current?.removeEventListener('keyup', function(){
  
        });
      }
    }
  },[])
  function workflowDesignClick() {
    if (bizSolInfo.bpmFlag) {
      dispatch({
        type: 'upBpmnFile/addBpmnFlow',
        payload: {
          modelKey: bizSolInfo.bizSolCode,
          modelName: bizSolInfo.bizSolName,
          ctlgId: bizSolInfo.ctlgId
        },
        callback: value => {
          setHasBpmnId(value)
          setIsShowBpmnModal(true)
          setIsReused(false)
          //window.open(`#/support/applyModelConfig/designFlowable?bizSolCode=${query.bizSolCode}&bizSolId=${query.bizSolId}&bizSolName=${query.bizSolName}&ctlgId=${query.ctlgId}&isFlow=${true}&procDefId=${procDefId}`)
          // history.push({
          //   pathname:`/applyModelConfig/designFlowable?bizSolCode=${query.bizSolCode}&bizSolId=${query.bizSolId}&bizSolName=${query.bizSolName}&ctlgId=${query.ctlgId}&isFlow=${true}&procDefId=${procDefId}`
          // })
          // history.push({
          //   pathname: '/applyModelConfig/designFlowable',
          //   search: {
          //     bizSolCode: query.bizSolCode,
          //     bizSolId: query.bizSolId,
          //     bizSolName: query.bizSolName,
          //     ctlgId: query.ctlgId,
          //     isFlow: true, //点击设计跳转标识，区分流程复用
          //     procDefId:procDefId
          //   }
          // })
        }
      })
    }
  }
  // 关闭弹窗
  const onCloseModal = ()=>{
    setIsShowBpmnModal(false)
  }
  function versionsCutClick() {
    dispatch({
      type: 'applyModelConfig/getHistoryList',
      payload: {
        key: bizSolInfo.bizSolCode
      },
      callback: function (historyList) {
        setParentState({
          historyList,
          versionsCutModal:true
        })
      }
    })

  }
  // 流程复用
  function workFlowDesignReuse() {
    setParentState({
      flowReuseModel: true
    })
  }
  // save流程复用
  const saveReuse= (isReuse)=>{
    setIsShowBpmnModal(true)
    setIsReused(isReuse)
  }


  // 版本配置同步
  function syncVersionCfg() {
    if (selectVersionId == 'edit') {
      return message.warning('请先保存当前配置');
    }
    let list = versionList.filter(item => {
     return  item.formDeployId == bizFromInfo.formDeployId && item.procDefId != bizFromInfo.procDefId
    });
    if (list.length == 0) {
      return message.warning('没有可同步的版本');
    }
    setParentState({
      syncVersionCfgData: {
        showModal: true,
        list: list
      }
    })
  }
  console.log("procDefId=0",procDefId)
  return (
    <div ref={ref}>
      {bizSolInfo.bpmFlag ?
        <div className={styles.flowWarp}>
          <div className={styles.other}>
            <p style={{ fontSize: '16px' }}><span style={{ fontWeight: '900' }}>流程定义名称：</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{decodeURI(bizSolInfo.bizSolName)}流程版本图-版本{version && `（${version}）`}</span></p>
            <Space>
              <Button className={styles.fontSize7} onClick={workflowDesignClick.bind(this)}>流程设计</Button>
              <Button className={styles.fontSize7} onClick={workFlowDesignReuse.bind(this)}>流程复用</Button>
              <Button className={styles.fontSize7} onClick={versionsCutClick.bind(this)}>版本切换</Button>
              <Button className={styles.fontSize7} onClick={syncVersionCfg.bind(this)}>版本配置同步</Button>
            </Space>
          </div>
          <div style={{ minHeight: '200px' }}>
            <div style={{ minHeight: "180px",height:"180px", width: "90%", margin: '10px 5%', border: '1px solid #ccc' }}>
              {procDefId && procDefId != '0'&&newFlowImg ?
                <BpmnView key={newFlowImg} newFlowImg={newFlowImg} query={query}/>
                : <p style={{ textAlign: 'center', lineHeight: '180px', fontSize: '20px' }}>请先设计流程或者流程复用</p>
              }
            </div>
          </div>
        </div> : ''
      }
      <FormInfo query={query} setParentState={setParentState} parentState={parentState}/>
      {
        flowReuseModel && <FlowReuse query={query} saveReuse={saveReuse}  setParentState={setParentState} parentState={parentState}/>
      }
      {versionsCutModal && (<VERSIONSCUT //版本切换
        query={query}
        setParentState={setParentState}
        parentState={parentState}
      />)}

      {/* 同步版本配置模态框 */}
      {syncVersionCfgData?.showModal ? (<SyncVersionCfg query={query} setParentState={setParentState} parentState={parentState}/>) : null}
      {isShowBpmnModal&&<DesignFlowModal query={query} isReused={isReused} onCloseModal={onCloseModal} setParentState={setParentState} parentState={parentState}/>}
    </div>
  )
}
export default connect(({ applyModelConfig, layoutG }) => ({
  applyModelConfig,
  layoutG
}))(FlowInfo);

