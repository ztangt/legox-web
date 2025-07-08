/**
 * 拖动可以改变左右的宽度(纯css)
 * @author wangxn
 */
import React,{useState} from 'react';
import _defaultProps from '../../layouts/_defaultProps';
import styles from './reSizeLeftRightCss.less';
const ReSizeLeftRightCss=(props)=>{
  console.log('props=',props);
  return (
    <div className={styles.column} style={{height:props.height}}>
      <div className={styles.column_left}>
        <div className={styles.resize_bar}></div>
          <div className={styles.resize_line}></div>
          <div className={styles.resize_save}>
            {props.leftChildren}
          </div>
      </div>
      <div className={styles.column_right}>
        {props.rightChildren}
      </div>
    </div>
  )
}
export default ReSizeLeftRightCss;
