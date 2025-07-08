import { connect } from 'dva';
import {Row,Col,Input} from 'antd';
import { formatNew } from '../../../util/util.js';
import _ from "lodash";
import styles from './detail.less'

const {TextArea} = Input
function Detail({detailsObj}){ 

      //  const { org,onCancel,loading } =this.props;
    let titleStyle = {
        'fontSize':'15px',
        'fontWeight':'600',
        'lineHeight':'30px'
    }
    let itemStyle = {
        'fontSize':'12px',
        'lineHeight':'25px'
    }
    return (
        <div>
            {detailsObj.id && (<div>
            <p style={{...titleStyle}}>流程定义明细</p>
            <div>
                <Row style={{...itemStyle}}>
                    <Col span={4} className={styles.textAlign}>流程定义名称：</Col>
                    <Col span={18}>{decodeURI(detailsObj.modelName)}</Col>
                </Row>
                <Row style={{...itemStyle}}>
                    <Col span={4} className={styles.textAlign}>编码：</Col>
                    <Col span={8}>{detailsObj.modelKey}</Col>
                    <Col span={4} className={styles.textAlign}>版本号：</Col>
                    <Col span={8}>{detailsObj.version}</Col>
                </Row>
                <Row style={{...itemStyle}}>
                    <Col span={4} className={styles.textAlign}>状态：</Col>
                    <Col span={8}>{detailsObj.modelStatus == 1 ? '已发布' : '草稿'}</Col>
                    <Col span={4} className={styles.textAlign}>是否主版本：</Col>
                    <Col span={8}>{detailsObj.version == detailsObj.versionNumber ? '是' : '否'}</Col>
                </Row>
                <Row style={{...itemStyle}}>
                    <Col span={4} className={styles.textAlign}>流程模型ID：</Col>
                    <Col span={18}>{detailsObj.id}</Col>
                </Row>
                <Row style={{...itemStyle}}>
                    <Col span={4} className={styles.textAlign}>流程定义ID：</Col>
                    <Col span={18}>{detailsObj.procDefId}</Col>
                </Row>
                <Row style={{...itemStyle}}>
                    <Col span={4} className={styles.textAlign}>流程部署ID：</Col>
                    <Col span={18}>{detailsObj.deployId}</Col>
                </Row>
                <Row style={{...itemStyle}}>
                    <Col span={4} className={styles.textAlign}>描述：</Col>
                    <Col span={18}>
                        <TextArea className={styles.textArea} value={detailsObj.description} style={{width:380}} readOnly bordered={false} autoSize></TextArea>
                    </Col>
                </Row>
            </div>
            <p style={{...titleStyle}}>修改记录</p>
            <div>
                <Row style={{...itemStyle}}>
                    <Col span={4} className={styles.textAlign}>创建人：</Col>
                    <Col span={8}>{detailsObj.createUserName}</Col>
                    <Col span={4} className={styles.textAlign}>创建时间：</Col>
                    <Col span={8}>{formatNew(detailsObj.createTime)}</Col>
                </Row>
                <Row style={{...itemStyle}}>
                    <Col span={4} className={styles.textAlign}>更新人：</Col>
                    <Col span={8}>{detailsObj.updateUserName}</Col>
                    <Col span={4} className={styles.textAlign}>更新时间：</Col>
                    <Col span={8}>{formatNew(detailsObj.updateTime)}</Col>
                </Row>
            </div>
        </div>)}
        </div>
        
        
    )
    
  }


  
export default (connect(({workflowEngine})=>({
    ...workflowEngine,
  }))(Detail));
