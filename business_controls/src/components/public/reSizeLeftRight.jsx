/**
 * 拖动可以改变左右的宽度
 * @author wangxn
 */
import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './reSizeLeftRight.less';

//const vLeftNumLimit=220;//最小的左侧宽度
const ReSizeLeftRight = (props) => {
  const [vNum, setVNum] = useState(props.vNum || 240);
  const [isVResize, setIsVResize] = useState(false);
  /**
   * 开始拖动垂直调整块
   */
  const vResizeDown = () => {
    setIsVResize(true);
  };
  console.log('props.level=', props.level);
  /**
   * 拖动垂直调整块
   */
  const vResizeOver = (e) => {
    let containerWidth = document.getElementById(
      `v_resize_container_${props.level}`,
    ).offsetWidth;
    // console.log('containerWidth=',containerWidth);
    const vRigthNumLimit = props.vRigthNumLimit; //最小的右侧宽度
    const hEle = document.getElementById(`h_resize_container_${props.level}`);
    let resizeOffsetInfo = getEleOffset(hEle);
    if (
      isVResize &&
      vNum >= props.vLeftNumLimit &&
      containerWidth - vNum >= vRigthNumLimit
    ) {
      let newValue = e.clientX - resizeOffsetInfo.clientLeft;
      if (newValue < props.vLeftNumLimit) {
        newValue = props.vLeftNumLimit;
      }
      if (newValue > containerWidth - vRigthNumLimit) {
        newValue = containerWidth - vRigthNumLimit;
      }
      setVNum(newValue);
    }
  };
  /**
   * 获取元素的偏移信息
   */
  const getEleOffset = (ele) => {
    var clientTop = ele.offsetTop;
    var clientLeft = ele.offsetLeft;
    let current = ele.offsetParent;
    while (current !== null) {
      clientTop += current.offsetTop;
      clientLeft += current.offsetLeft;
      current = current.offsetParent;
    }
    return {
      clientTop,
      clientLeft,
      height: ele.offsetHeight,
      width: ele.offsetWidth,
    };
  };
  /**
   * 只要鼠标松开或者离开区域，那么就停止resize
   */
  const stopResize = () => {
    setIsVResize(false);
  };
  return (
    <div
      className={styles.container}
      style={{ height: props.height }}
      onMouseMove={vResizeOver}
      onMouseUp={stopResize}
      onMouseLeave={stopResize}
      id={`v_resize_container_${props.level}`}
    >
      <div
        className={styles.left}
        style={{ width: vNum - 26 }}
        id={`h_resize_container_${props.level}`}
      >
        {props.leftChildren}
      </div>
      <div
        style={{ left: vNum - 26 }}
        draggable={false}
        onMouseDown={vResizeDown}
        className={styles.v_resize}
      >
        {/* <b className={styles.drag_bt}>
          <LeftOutlined />
        </b> */}
      </div>
      <div style={{ marginLeft: vNum - 26 }} className={styles.tree_dom}>
        {props.rightChildren}
      </div>
    </div>
  );
};
ReSizeLeftRight.propTypes = {
  /**
   * 左侧的组件
   * @type {boolean}
   */
  leftChildren: PropTypes.element,
  /**
   * 右侧的组件
   */
  rightChildren: PropTypes.element,
  /**
   * 做侧最小宽度
   */
  vLeftNumLimit: PropTypes.number,
  /**
   * 右侧最小宽度
   */
  vRigthNumLimit: PropTypes.number,
  /**
   * 容器高度
   */
  height: PropTypes.string,
  /**
   * 层级，用于左中右
   */
  level: PropTypes.number,
};
ReSizeLeftRight.defaultProps = {
  /**
   * 右侧最小宽度
   */
  vRigthNumLimit: 500,
  height: '100%',
  level: 1,
  vLeftNumLimit: 200,
};
export default ReSizeLeftRight;
