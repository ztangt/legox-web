import { connect } from 'dva';
import {Row,Col} from 'antd';
import _ from "lodash";
import BpmnView from '../../applyModelConfig/componments/bpmnView'
import styles from './detail.less'


function Flowchart({detailsObj,nodeRecord}){ 
  
  return (
      <div style={{width:'1000px',height:'440px'}}>
          {detailsObj.id && (<BpmnView key={detailsObj.xmlStr} query={{bizSolId:nodeRecord.id}}  newFlowImg={detailsObj.xmlStr}/>)}
      </div>
  )
    
  }
  
export default (connect(({workflowEngine})=>({
    ...workflowEngine,
  }))(Flowchart));
