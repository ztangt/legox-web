import { connect } from 'dva';
import { Modal, Input,Button,message,Form,Row,Col,Switch,Select} from 'antd';
import _ from "lodash";
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import GlobalModal from './GlobalModal';
function ViewOrgPic ({dispatch,list,onCancel,module}){
    const MyNodeComponent = ({node}) => {
      let commonStyle = {
        width:'125px',
        margin:'0 auto',
        padding:'4px',
        borderRadius:'4px',
        color:'#fff',
        minHeight:'52px'
      }
      let deptStyle = {
        ...commonStyle,
        backgroundColor:'#006598'
      }
      let orgStyle ={
        ...commonStyle,
        backgroundColor:'#FAAD14'
      }
      return (
        <div className="initechNode" style={{width:'160px',margin:'0 auto',}}>
          <div style={node.orgKind == 'ORG' ? orgStyle : deptStyle} >{ node.orgName }</div>
        </div>
      );
    };
    return (
        <GlobalModal
            visible={true}
            footer={null}
            // width={'95%'}
            widthType={1}
            incomingWidth={1000}
            incomingHeight={500}
            title={'组织结构图'}
            onCancel={onCancel}
            centered
            bodyStyle={{overflow:'auto'}}
            maskClosable={false}
            mask={false}
            getContainer={() =>{
                return document.getElementById(`${module}_container`)||false
            }}
        >
          <OrgChart tree={list} NodeComponent={MyNodeComponent} />
    </GlobalModal>
    )
  }



export default (connect(({unitInfoManagement})=>({
    ...unitInfoManagement
  }))(ViewOrgPic));
