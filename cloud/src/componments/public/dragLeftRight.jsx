/**
 * 拖动可以改变左右的宽度
 * @author wangxn
 */
import React,{useState} from 'react';
import styles from './dragLeftRight.less';
import PropTypes from 'prop-types';
import { LeftOutlined,PauseOutlined } from '@ant-design/icons';

const vLeftNumLimit=334;//最小的左侧宽度
const dragLeftRight=(props)=>{
  const [vNum,setVNum]=useState(1000);
  const [isVResize,setIsVResize]=useState(false);
  /**
  * 开始拖动垂直调整块
  */
 const vResizeDown = () => {
    setIsVResize(true);
  }
  /**
  * 拖动垂直调整块
  */
  const vResizeOver = (e) => {
    let containerWidth = document.getElementById(`v_resize_container_${props.suffix}_${props.level}`).offsetWidth;
    const vRigthNumLimit=props.vRigthNumLimit;//最小的右侧宽度
    const hEle = document.getElementById(`h_resize_container_${props.suffix}_${props.level}`)
    let resizeOffsetInfo = getEleOffset(hEle)
    if (isVResize && vNum >= vLeftNumLimit && (containerWidth - vNum >= vRigthNumLimit)) {
      let newValue = e.clientX - resizeOffsetInfo.clientLeft
      if (newValue < vLeftNumLimit) {
        newValue = vLeftNumLimit
      }
      if (newValue > containerWidth - vRigthNumLimit) {
        newValue = containerWidth - vRigthNumLimit
      }
      setVNum(newValue);
    }
  }
  /**
  * 获取元素的偏移信息
  */
  const getEleOffset=(ele)=> {
    var clientTop = ele.offsetTop
    var clientLeft = ele.offsetLeft
    let current = ele.offsetParent
    while (current !== null) {
      clientTop += current.offsetTop
      clientLeft += current.offsetLeft
      current = current.offsetParent
    }
    return {
      clientTop,
      clientLeft,
      height: ele.offsetHeight,
      width: ele.offsetWidth
    }
  }
  /**
  * 只要鼠标松开或者离开区域，那么就停止resize
  */
  const stopResize = () => {
    setIsVResize(false);
  }
  return (
    <div
      className={styles.container}
      onMouseMove={vResizeOver}
      onMouseUp={stopResize}
      onMouseLeave={stopResize}
      id={`v_resize_container_${props.suffix}_${props.level}`}
      style={props.style}
    >
      <div className={styles.left} style={{width:vNum-234}} id={`h_resize_container_${props.suffix}_${props.level}`}>
        {props.leftChildren}
      </div>
      <div style={{ left:vNum-234,top:props.lineTop }} draggable={false} onMouseDown={vResizeDown} className={styles.v_resize}>
        <b className={styles.drag_bt}>
            {/* <LeftOutlined /> */}
            <PauseOutlined />
        </b>
      </div>
      <div
        className={styles.tree_dom}
        style={{marginLeft:vNum-234}}
      >
        {props.rightChildren}
      </div>
    </div>
  )
}
dragLeftRight.propTypes = {
  /**
   * 左侧的组件
   * @type {boolean}
   */
  leftChildren: PropTypes.element,
  /**
   * 右侧的组件
   */
  rightChildren:PropTypes.element,
  /**
   * 右侧最小宽度
   */
  vRigthNumLimit:PropTypes.number,
  /**
   * 线的top
   */
  lineTop:PropTypes.string,
  /**
   * 层级，用于左中右
   */
  level: PropTypes.number,
  /**
   * 后缀用于区分页面的id
   */
  suffix: PropTypes.string,
}
dragLeftRight.defaultProps = {
  /**
   * 右侧最小宽度
   */
  vRigthNumLimit:100,
  lineTop:'0',
  level: 1,
  suffix: 'diy',
}
export default dragLeftRight;
