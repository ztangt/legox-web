/**
 * @author zhangww
 * @description 个人首页
 */

import React from 'react';
import styles from './index.less';
import ColumnAll from "./componments/columnAll";

function Index() {

  return (
    <div className={styles.container}>
      <ColumnAll type="main"/>
    </div>
  );
}

export default Index;
