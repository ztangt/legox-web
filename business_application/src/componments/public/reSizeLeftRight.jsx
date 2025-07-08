/**
 * 拖动可以改变左右的宽度
 * @author wangxn
 */
import React, { useState,useRef, useEffect } from 'react';
import styles from './reSizeLeftRight.less';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { LeftOutlined,CaretRightOutlined } from '@ant-design/icons';
import { useLocation } from 'umi';
import {useSize} from 'ahooks';
import {toPoint} from '../../util/util';
import {connect} from 'dva'
import expandIcon from '../../../public/assets/expandIcon.svg'
const ReSizeLeftRight = (props) => {
  const location = useLocation();
  const id = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')).id
    : '';
  const desktopType = localStorage.getItem(`desktopType${id}`) || 0;
  const [vNum, setVNum] = useState(props.vNum);
  const [isVResize, setIsVResize] = useState(false);
  const { vLeftNumLimit, isShowRight, lineTop, leftHeight,dispatch,isExpandLeft } = props;
  const ref = useRef(null);
  const size = useSize(ref);
  const [isShowLeft,setIsShowLeft]=useState(false)
  useEffect(()=>{
    if(size?.width){
      let vNumWidth = typeof props.vNum=='string'&&props.vNum.includes('%')?toPoint(props.vNum)*size?.width:props.vNum;
      setVNum(vNumWidth);
      if(isExpandLeft){
        dispatch({
          type: `${props.suffix}/updateStates`,
          payload:{
            leftNum:vNumWidth
          }
        })
      }
    }
  },[size?.width])
  useEffect(()=>{
  if(props.suffix=='notification'||props.suffix=='notificationList'){
    closeFn()
  }
  },[])
  const closeFn=()=>{
    setIsShowLeft(true)
    setVNum(0)
    const left_container=document.getElementById(`h_resize_container_${props.suffix}_${props.level}`)
    left_container.style.display='none'
    const line=document.getElementById(`split_line_${props.suffix}_${props.level}`)
    line.style.display='none'
      dispatch({
        type: `${props.suffix}/updateStates`,
        payload:{
          leftNum:0
        }
      })
  }
  const openFn=()=>{
    setIsShowLeft(false)
    setVNum(252)
    dispatch({
      type: `${props.suffix}/updateStates`,
      payload:{
        leftNum:252
      }
    })
    const left_container=document.getElementById(`h_resize_container_${props.suffix}_${props.level}`)
    left_container.style.display='block'
    const line=document.getElementById(`split_line_${props.suffix}_${props.level}`)
    line.style.display='block'
  }
  /**
   * 开始拖动垂直调整块
   */
  const vResizeDown = () => {
    setIsVResize(true);
  };
  /**
   * 拖动垂直调整块
   */
  const vResizeOver = (e) => {
    let containerWidth = document.getElementById(
      `v_resize_container_${props.suffix}_${props.level}`,
    ).offsetWidth;
    const vRigthNumLimit = props.vRigthNumLimit; //最小的右侧宽度
    const hEle = document.getElementById(
      `h_resize_container_${props.suffix}_${props.level}`,
    );
    let resizeOffsetInfo = getEleOffset(hEle);
    if (
      isVResize &&
      vNum >= vLeftNumLimit &&
      containerWidth - vNum >= vRigthNumLimit
    ) {
      let newValue = e.clientX - resizeOffsetInfo.clientLeft;
      if (newValue < vLeftNumLimit) {
        newValue = vLeftNumLimit;
      }
      if (newValue > containerWidth - vRigthNumLimit) {
        newValue = containerWidth - vRigthNumLimit;
      }
      setVNum(newValue);
      if(isExpandLeft){
        setTimeout(()=>{
          dispatch({
            type: `${props.suffix}/updateStates`,
            payload:{
              leftNum:newValue
            }
          })
        },100)
      }
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

  const excludePath = () => {
    if (location.pathname === '/information') {
      return false;
    }
    return true;
  };
  return (
    <div
      className={styles.container}
      style={{
        height: props.height,
        // left: desktopType == 1 && excludePath() ? '345px' : '0',
        paddingLeft: `${props.paddingNum}px`,
        top:`${props.top}`,
        width:'100%'
        // paddingRight:`${props.paddingNum}px`,
      }}
      onMouseMove={props.canResize?vResizeOver:null}
      onMouseUp={stopResize}
      onMouseLeave={stopResize}
      id={`v_resize_container_${props.suffix}_${props.level}`}
      ref={ref}
    >
      <div
        className={styles.left}
        style={
          isShowRight
            ? { width:vNum, paddingRight: `${props.paddingNum}px`, height: leftHeight }
            : { width: '100%', paddingRight: `${props.paddingNum}px` }
        }
        id={`h_resize_container_${props.suffix}_${props.level}`}
      >
        {props.leftChildren}
      </div>
      <div
        style={
          isShowRight
            ? { left: vNum + props.paddingNum, top: `${lineTop}px`,height:`calc(100% - ${lineTop}px)`}
            : { display: 'none' }
        }
        draggable={false}
        onMouseDown={vResizeDown}
        className={styles.v_resize}
        id={`split_line_${props.suffix}_${props.level}`}
      >
        {!isShowLeft&&isExpandLeft&&<b className={styles.drag_bt}><img src={expandIcon}  onClick={closeFn.bind(this)}/></b>}
        {/* <b className={styles.drag_bt}><LeftOutlined /></b> */}
      </div>
      {isShowLeft&&isExpandLeft&&<b className={styles.drag_expand}><img src={expandIcon} onClick={openFn.bind(this)}  /></b>}
      <div
        style={isShowRight ? { marginLeft: vNum } : { display: 'none' }}
        className={classnames(
          styles.tree_dom,
          props.isLayout ? styles.desktop : null,
        )}
      >
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
   * lineTop
   */
  lineTop: PropTypes.number,
  /**
   * leftHeight
   */
  leftHeight: PropTypes.string,
  /**
   * 整体内容的top
   */
  top:PropTypes.string,
  //可以拖拽
  canResize: PropTypes.bool,
   /**
   * 左侧是否可展开收起
   */
  isExpandLeft:PropTypes.bool
};
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
  leftHeight: '100%',
  canResize: true,
  top:'unset',
  isExpandLeft:false
};
export default connect (({})=>({}))(ReSizeLeftRight);
