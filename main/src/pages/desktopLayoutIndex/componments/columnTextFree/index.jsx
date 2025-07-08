/**
 * @author zhangww
 * @description 自定义文字栏目
 */

import React from 'react';
import styles from './index.less';

export default function Index({val}) {
  return (
    <div className={styles.user_title}>
      <h1>{val || '自定义文字栏目'}</h1>
    </div>
  );
}