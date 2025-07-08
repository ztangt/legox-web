/**
 * 拖动可以改变左右的宽度
 * @author wangxn
 */
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useLocation } from 'umi'
import styles from './reSizeLeftRight.less'

const ReSizeLeftRight = (props) => {
  const location = useLocation()
  const id = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')).id
    : ''
  const desktopType = localStorage.getItem(`desktopType${id}`) || 0
  const [vNum, setVNum] = useState(props.vNum)
  const [isVResize, setIsVResize] = useState(false)
  const { vLeftNumLimit, isShowRight } = props
  /**
   * 开始拖动垂直调整块
   */
  const vResizeDown = () => {
    setIsVResize(true)
  }
  /**
   * 拖动垂直调整块
   */
  const vResizeOver = (e) => {
    let containerWidth = document.getElementById(
      `v_resize_container_${props.suffix}_${props.level}`
    ).offsetWidth
    const vRigthNumLimit = props.vRigthNumLimit //最小的右侧宽度
    const hEle = document.getElementById(
      `h_resize_container_${props.suffix}_${props.level}`
    )
    let resizeOffsetInfo = getEleOffset(hEle)
    if (
      isVResize &&
      vNum >= vLeftNumLimit &&
      containerWidth - vNum >= vRigthNumLimit
    ) {
      let newValue = e.clientX - resizeOffsetInfo.clientLeft
      if (newValue < vLeftNumLimit) {
        newValue = vLeftNumLimit
      }
      if (newValue > containerWidth - vRigthNumLimit) {
        newValue = containerWidth - vRigthNumLimit
      }
      setVNum(newValue)
    }
  }
  /**
   * 获取元素的偏移信息
   */
  const getEleOffset = (ele) => {
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
      width: ele.offsetWidth,
    }
  }
  /**
   * 只要鼠标松开或者离开区域，那么就停止resize
   */
  const stopResize = () => {
    setIsVResize(false)
  }

  const excludePath = () => {
    if (location.pathname === '/information') {
      return false
    }
    return true
  }
  return (
    <div
      className={styles.container}
      style={{
        height: props.height,
        left: desktopType == 1 && excludePath() ? '345px' : '0',
        paddingLeft: `${props.paddingNum}px`,
        // paddingRight:`${props.paddingNum}px`,
      }}
      onMouseMove={vResizeOver}
      onMouseUp={stopResize}
      onMouseLeave={stopResize}
      id={`v_resize_container_${props.suffix}_${props.level}`}
    >
      <div
        className={styles.left}
        style={
          isShowRight
            ? { width: vNum, paddingRight: `${props.paddingNum}px` }
            : { width: '100%', paddingRight: `${props.paddingNum}px` }
        }
        id={`h_resize_container_${props.suffix}_${props.level}`}
      >
        {props.leftChildren}
      </div>
      <div
        style={
          isShowRight
            ? {
                left: vNum + props.paddingNum,
                top: `${props.lineTop}px`,
                height: `calc(100% - ${props.lineTop}px)`,
              }
            : { display: 'none' }
        }
        draggable={false}
        onMouseDown={vResizeDown}
        className={styles.v_resize}
      >
        {/* <b className={styles.drag_bt}><LeftOutlined /></b> */}
      </div>
      <div
        style={isShowRight ? { marginLeft: vNum } : { display: 'none' }}
        className={classnames(
          styles.tree_dom,
          props.isLayout ? styles.desktop : null
        )}
      >
        {props.rightChildren}
      </div>
    </div>
  )
}
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
   * 右侧最小宽度
   */
  vRigthNumLimit: PropTypes.number,
  /**
   * 容器高度
   */
  height: PropTypes.string,
  /**
   * 最小的左侧宽度
   */
  vLeftNumLimit: PropTypes.number,
  /**
   * 默认的左侧宽度
   */
  vNum: PropTypes.number,
  /**
   * 默认是否显示右侧
   */
  isShowRight: PropTypes.bool,
  /**
   * 层级，用于左中右
   */
  level: PropTypes.number,
  /**
   * 是否为桌面布局页
   */
  isLayout: PropTypes.bool,
  /**
   * 后缀用于区分页面的id
   */
  suffix: PropTypes.string,
  /**
   * 左侧是否需要padding
   */
  paddingNum: PropTypes.number,
  /**
   * 上面有那种title的需要，一般是title的高度
   */
  lineTop: PropTypes.number,
}
ReSizeLeftRight.defaultProps = {
  //最小的左侧宽度
  vLeftNumLimit: 220,
  /**
   * 右侧最小宽度
   */
  vRigthNumLimit: 500,
  height: '100%',
  vNum: 252,
  isShowRight: true,
  level: 1,
  isLayout: false,
  suffix: 'diy',
  paddingNum: 0,
  lineTop: 0,
}
export default ReSizeLeftRight
