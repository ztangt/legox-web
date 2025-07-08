import React,{useState} from 'react';
import { connect } from 'dva';
import { history,useSelector } from 'umi';
import CustomCanvasDraw from '../../applyModelConfig/componments/customCanvas'
import CustomPropertyPanel from '../../../componments/CustomPropertyPanel'
import CustomContext from '../../../componments/CustomPropertyPanel/components/context'
import { parse } from 'query-string';
// import {
//     CloseOutlined
//   } from '@ant-design/icons';
  // 流程图设计

  const DesignFlow = ({location,dispatch,query,onCloseBpmnModal})=>{
    const [modeler,setModeler] = useState(null)
    // const query = parse(history.location.search);
    const {ctlgId} = query;
    const { getBpmnData } = useSelector(({upBpmnFile})=>({...upBpmnFile}));
    const prefix = 'flowable'
    const submit = ()=>{
        history.go(-1)
    }
    const initModeler=(modeler)=>{
        setTimeout(() => {
            setModeler(modeler)
            const canvas = modeler.get("canvas");
            const rootElement = canvas.getRootElement();
            // console.log(rootElement,"rootElement")
          }, 10);
    }
    const listReload=()=>{
        dispatch({
            type: 'workflowEngine/getModel',
            payload:{
              searchWord:"",
              ctlgId,
              start:1,
              limit:10
            }
          })
    }
    let customModeler = modeler
    return (
        <div style={{width: '100%',height: '100%',position:'fixed',top:'0',left:'0',zIndex:'1000',background:'#fff'}}>
            <p style={{height:'30px',borderBottom:'1px solid #ccc',lineHeight:'30px',textAlign:'right',paddingRight:'10px'}}>
                {/* <CloseOutlined onClick={submit} /> */}
            </p>
            <div style={{height:'calc(100% - 30px)',display:'flex',justifyContent: 'space-between'}}>
                <CustomCanvasDraw query={query} onCloseBpmnModal={onCloseBpmnModal} handleIframePostMessage={listReload}  isEngine={true}  location={query} modelerSrcId={getBpmnData} modeler={initModeler}/>
                <CustomContext.Provider value={query}>
                    <CustomPropertyPanel  bpmnModeler={customModeler} prefix={prefix}/>
                </CustomContext.Provider>
            </div>
        </div>         
    )
  }

  export default connect(({upBpmnFile,layoutG,user,workflowEngine})=>({
    ...layoutG,
    ...upBpmnFile,
    ...workflowEngine,
    user
  }))(DesignFlow);