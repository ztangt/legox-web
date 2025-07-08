import { connect } from 'dva';
import {Row,Col,Modal} from 'antd';
import _ from "lodash";
import styles from './detail.less'


function Design({onCancel,designUrl}){
    console.log('designUrl',designUrl)
    return (
      <Modal
          visible={true}
          footer={false}
          width={'95%'}
          title={'设计'}
          onCancel={onCancel}
          // className={styles.add_form}
          mask={false}
          maskClosable={false}
          centered
          getContainer={() =>{
              return document.getElementById('workflowEngine_container')||false
          }}
      >

          <iframe src={designUrl} style={{width:'100%',height:'500px'}}></iframe>


      </Modal>
      )
  }



export default (connect(({workflowEngine})=>({
    ...workflowEngine,
  }))(Design));
