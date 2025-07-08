/**
 * @author zhangww
 * @description 栏目-XX饼（TODO）
 */

import React from 'react';
import styles from './index.less';
// import ColumnChart from '../../../../componments/ECharts/columnChart'

function Index() {
  const data = {
    budget: [10,30,14,45,423],
    pay: [21,20,14,42,46],
    xAxis: ['劳务费','差旅费','会议费','培训费','招待费']
  }
  
  return (
    <div className={styles.budget} >
      {/* <ColumnChart data={data}/> */}
    </div>
  );
}

export default Index;
