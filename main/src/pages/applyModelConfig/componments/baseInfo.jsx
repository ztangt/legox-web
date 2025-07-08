/**
 * 基本信息
*/
import styles from './baseInfo.less';
import {useEffect} from 'react'
import {Input} from 'antd';
const {TextArea}=Input;
function BaseInfo({dispatch,bizSolInfo}){

  return (
    <div className={styles.info_warp}>
      <p className={styles.title}>业务方案基本信息</p>
      <div className={styles.info_content}>
        <ul>
          <li>
            <span className={styles.label}>业务应用名称：</span>
            <span>{bizSolInfo.bizSolName}</span>
          </li>
          <li>
            <span className={styles.label}>业务应用编码：</span>
            <span>{bizSolInfo.bizSolCode}</span>
          </li>
          <li>
            <span className={styles.label}>业务应用bizSoldId：</span>
            <span>{bizSolInfo.bizSolId}</span>
          </li>
          <li>
            <span className={styles.label}>所属业务分类：</span>
            <span>{bizSolInfo.ctlgName}</span>
          </li>
          <li>
            <span className={styles.label}>有无流程：</span>
            <span>{bizSolInfo.bpmFlag?'有':'无'}</span>
          </li>
          {bizSolInfo.bpmFlag==false&&<li>
            <span className={styles.label}>是否基础数据：</span>
            <span>{bizSolInfo.basicDataFlag?'是':'否'}</span>
          </li>}
          {/* <li>
            <span className={styles.label}>业务模版：</span>
            <span>{bizSolInfo.bizSolTemplate}</span>
          </li> */}
        </ul>
        <p className={styles.desc}>
          <span className={styles.label}>描述：</span>
          <TextArea value={bizSolInfo.remark} style={{width:200}} readOnly bordered={false} autoSize></TextArea>
        </p>
      </div>
    </div>
  )
}
export default BaseInfo;
