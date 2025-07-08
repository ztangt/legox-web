/**
 * @author zhangww
 * @description 栏目-预算支出（TODO）
 */

import React from 'react';
import styles from './index.less';
import PieChart from '../../../../componments/ECharts/pieChart'

function Index() {

  const pieData = [
    {value: 1048, name: '预算'},
    {value: 735, name: '支出'},
  ]

  return (
    <div className={styles.budget}>
      <PieChart data={pieData}/>
    </div>
  );
}

export default Index;
