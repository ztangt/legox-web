import React, { useState,useRef,useEffect } from 'react';
import { connect } from 'dva';
import {Space,Button,Modal} from 'antd';
import styles from '../index.less';
import FormInfo from './../componments/formInfo';
import { history,useSelector } from 'umi';
import CustomCanvasDraw from '../componments/customCanvas';
import CustomPropertyPanel from '../../../componments/CustomPropertyPanel';
import CustomContext from '../../../componments/CustomPropertyPanel/components/context'
import { parse } from 'query-string';

// import Log from './../../../util/Log'
import {
    CloseOutlined
  } from '@ant-design/icons';

function WorkflowDesign ({query,dispatch,onCloseModal,setParentState,isReused,parentState,loading,onCancel,modelerSrcId,index,modelerUserToken,user}){
    const [modeler,setModeler] = useState(null)
    const [isShow,setIsShow] = useState(null)
    const { getBpmnInfo } = useSelector(({upBpmnFile})=>({...upBpmnFile}));
    const {bizSolId,procDefId} = query
    const [controlForm,setControlForm] = useState(
        {
            processId: "",
            processName: "",
            simulation: true,
            labelEditing: false,
            labelVisible: false,
            prefix: "flowable",
            headerButtonSize: "mini",
            events: ["element.click", "element.contextmenu"],
          }
    )
    function handleIframePostMessage(event){
        console.log(event,"event===>!")
        // index++;
        // if(index == 1){
            let {processDefinitionId} = event;
            console.log('procDefId------回来',procDefId)
            dispatch({
                type:"applyModelConfig/getProcessNewDiagram",
                payload:{
                    procDefId:processDefinitionId
                },
                callback:(data)=>{
                  //这个需要放到applyModelConfig去监听，然后存入state中
                  setParentState({
                      newFlowImg:data.newFlowImg,
                      version: data.version,
                      workflowDesignModal:false,
                      procDefId:processDefinitionId
                  })
                }
            })
    }
    const initModeler=(modeler)=>{
        setTimeout(() => {
            setModeler(modeler)
            const canvas = modeler.get("canvas");
            const rootElement = canvas.getRootElement();
            // console.log(rootElement,"rootElement")
          }, 10);
    }
    //初始
     useEffect(() => {
        //  window.addEventListener('message', handleIframePostMessage,false)
     },[]);
     useEffect(()=>{
        //流程设计进入、区分流程复用
        if(query.isFlow){
            dispatch({
                type: 'applyModelConfig/addBpmnFlow',
                payload: {
                    modelKey: query.bizSolCode,
                    modelName: query.bizSolName,
                    ctlgId: query.ctlgId
                }
            })
        }

     },[])
     let customModeler = modeler
    return (
        <div style={{width:'100%',height:'100%',position:'fixed',top:'0',left:'0',zIndex:'1000',backgroundColor:'rgba(0,0,0,0.45)'}}>
            <div style={{width:'100%',height:'100%',backgroundColor:'#fff'}}>
                <p style={{height:'30px',borderBottom:'1px solid #ccc',lineHeight:'30px',textAlign:'right',paddingRight:'10px'}}>
                    {/* <CloseOutlined onClick={submit} /> */}
                </p>
                <div style={{height:'calc(100% - 30px)',display:'flex',justifyContent: 'space-between'}}>

                    <CustomCanvasDraw query={query} isReused={isReused} onCloseModal={onCloseModal} type="applyModalConfig" handleIframePostMessage={handleIframePostMessage}  modelerSrcId={getBpmnInfo}  location={query} modeler={initModeler}/>
                    <CustomContext.Provider value={query}>
                    <CustomPropertyPanel  bpmnModeler={customModeler} prefix={controlForm.prefix}/>
                    </CustomContext.Provider>
                </div>
            </div>
        </div>
    )
}




export default connect(({loading,layoutG,applyModelConfig,upBpmnFile,user})=>{return {loading,layoutG,applyModelConfig,user,upBpmnFile}})(WorkflowDesign);





