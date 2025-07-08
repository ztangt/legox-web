import { connect } from 'dva';
import { Modal,Button,Row,Tabs} from 'antd';
import _ from "lodash";
import styles from '../index.less';
import DETAIL from './detail';
import FLOWCHART from './flowchart';
import DESIGN from './design'
import GlobalModal from '../../../componments/GlobalModal';

const { TabPane } = Tabs;

function DetailModal({onCancel,onChnageTab,detailsObj,nodeRecord,dispatch}){
    return (
        <GlobalModal
            visible={true}
            footer={false}
            widthType={3}
            title={'流程定义明细信息'}
            onCancel={onCancel}
            // className={styles.add_form}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById('workflowEngine_container')||false
            }}
        >
            <div className={styles.body}>
                <Tabs defaultActiveKey="1" onChange={onChnageTab}>
                    <TabPane tab="流程定义明细" key="流程定义明细">
                        <DETAIL  detailsObj={detailsObj}/>
                    </TabPane>
                    {detailsObj.modelStatus == 1 && (<TabPane tab="流程图" key="流程图">
                        <FLOWCHART nodeRecord={nodeRecord}/>
                    </TabPane>)}
                   
                    {detailsObj.modelStatus == 1 && (<TabPane tab="Activiti设计原码" key="Activiti设计原码">
                        {detailsObj.xmlStr}
                    </TabPane>)}
                </Tabs>
            </div>

            {/* <Row className={styles.bt_group}  >
            <Button  type="primary" htmlType="submit" loading={loading}>
                保存
            </Button>
            <Button onClick={onCancel} style={{marginLeft: 8}}>
                取消
            </Button>
            </Row> */}

    </GlobalModal>
    )

  }



export default (connect(({workflowEngine})=>({
    ...workflowEngine,
  }))(DetailModal));
