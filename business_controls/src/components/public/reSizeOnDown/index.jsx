/**
 * 拖动可以改变上下高度(加展开收起功能)
 * @author wangxn
 */
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
// import classnames from 'classnames';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
// import { useLocation } from 'umi';
import { useSize } from 'ahooks';
import { connect } from 'dva';
import { toPoint } from '../../../util/util';
// import expandIcon from '../../../public/assets/expandIcon.svg'
const Index = (props) => {
  const { hOnNumLimit, hDownNumLimit } = props;

  const [hNum, setHNum] = useState(props.hNum); //默认的第二部分高度
  const [isHResize, setIsHResize] = useState(false);
  const [resizeOffsetInfo, setResizeOffsetInfo] = useState({
    clientTop: 0,
  });
  const [onIsShow, setOnIsShow] = useState(true); //上部分是否显示
  const [downIsShow, setDownIsShow] = useState(true); //下部分是否显示
  const ref = useRef(null);
  const size = useSize(ref);
  useEffect(() => {
    //设置初始或者组件变更告诉设置的第一部分高度值
    if (size?.height) {
      let hNumHeight =
        typeof props.hNum == 'string' && props.hNum.includes('%')
          ? toPoint(props.hNum) * size?.height
          : props.hNum;
      setHNum(hNumHeight);
      const hEle = document.getElementById('h_resize_container');
      setResizeOffsetInfo(getEleOffset(hEle));
    }
  }, [size?.height]);
  /**
   * 开始拖动水平调整块
   */
  const hResizeDown = () => {
    setIsHResize(true);
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
   * 拖动水平调整块
   */
  const hResizeOver = (e) => {
    if (
      isHResize &&
      hNum >= hDownNumLimit &&
      resizeOffsetInfo.height - hNum >= hOnNumLimit
    ) {
      let newValue =
        resizeOffsetInfo.clientTop + resizeOffsetInfo.height - e.clientY;
      if (newValue < hDownNumLimit) {
        newValue = hDownNumLimit;
      }
      if (newValue > resizeOffsetInfo.height - hOnNumLimit) {
        newValue = resizeOffsetInfo.height - hOnNumLimit;
      }
      setHNum(newValue);
    }
  };
  /**
   * 只要鼠标松开或者离开区域，那么就停止resize
   */
  const stopResize = () => {
    setIsHResize(false);
  };
  //上下部分的展开收起
  const isExpendUp = (type) => {
    if (type == 'on') {
      if (downIsShow) {
        setOnIsShow(false);
      } else {
        setDownIsShow(true);
      }
    } else {
      if (onIsShow) {
        setDownIsShow(false);
      } else {
        setOnIsShow(true);
      }
    }
  };
  return (
    <div
      id="h_resize_container"
      style={{ height: props.height }}
      className={styles.h_resize_container}
      onMouseMove={hResizeOver}
      onMouseUp={stopResize}
      onMouseLeave={stopResize}
      ref={ref}
    >
      <div
        style={{
          bottom: downIsShow ? hNum + 1 : 1,
          height: downIsShow
            ? `calc(${props.height} - ${hNum + 1}px)`
            : `calc(${props.height} - 1px)`,
          display: onIsShow ? 'block' : 'none',
        }}
        className={styles.h_top}
      >
        <div className={styles.content}>{props.onRender}</div>
        <div className={styles.h_icon} onClick={isExpendUp.bind(this, 'on')}>
          <UpOutlined style={{ fontSize: '12px', color: '#999999' }} />
        </div>
      </div>
      <div
        style={{
          bottom: onIsShow
            ? downIsShow
              ? hNum
              : 0
            : resizeOffsetInfo.height - 1,
        }}
        draggable={false}
        onMouseDown={hResizeDown}
        className={styles.h_resize}
      ></div>
      <div
        style={{
          height: onIsShow ? hNum : resizeOffsetInfo.height - 1,
          display: downIsShow ? 'block' : 'none',
        }}
        className={styles.h_bottom}
      >
        <div className={styles.h_icon}>
          <DownOutlined
            style={{ fontSize: '12px', color: '#999999' }}
            onClick={isExpendUp.bind(this, 'down')}
          />
        </div>
        <div className={styles.content}>{props.downRender}</div>
      </div>
    </div>
  );
};
Index.propTypes = {
  /**
   * 上面的组件
   * @type {boolean}
   */
  onRender: PropTypes.element,
  /**
   * 下面的组件
   */
  downRender: PropTypes.element,
  /**
   * 上面最小高度
   */
  hOnNumLimit: PropTypes.number,
  /**
   * 下面最小高度
   */
  hOnNumLimit: PropTypes.number,
  /**
   * 默认的下面高度
   */
  hNum: PropTypes.number || PropTypes.string,
  /**
   * 容器的高度
   */
  height: PropTypes.string,
};
Index.defaultProps = {
  //最小的上部分高度
  hOnNumLimit: 100,
  /**
   * 下部分最小高度
   */
  hDownNumLimit: 100,
  height: '100%',
  hNum: '50%',
};
export default connect(({}) => ({}))(Index);
