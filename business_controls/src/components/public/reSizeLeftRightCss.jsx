/**
 * 拖动可以改变左右的宽度(纯css)
 * @author wangxn
 */
import React, { useState } from 'react';
import styles from './reSizeLeftRightCss.less';
const ReSizeLeftRightCss = (props) => {
  console.log('props=', props);
  return (
    <div className={styles.column}>
      <div className={styles.column_left}>
        <div
          className={styles.resize_bar}
          style={{ maxWidth: props.maxWidth, minWidth: props.minWidth }}
        ></div>
        <div className={styles.resize_line} style={props.styleLine}></div>
        <div className={styles.resize_save}>{props.leftChildren}</div>
      </div>
      <div className={styles.column_right}>{props.rightChildren}</div>
    </div>
  );
};
export default ReSizeLeftRightCss;
