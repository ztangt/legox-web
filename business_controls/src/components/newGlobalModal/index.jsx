import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import back from '../../../public/assets/back.svg';
import max_img from '../../../public/assets/max.svg';
import min_img from '../../../public/assets/min.svg';
import {
  MODAL_PADDING_FOOTER,
  MODAL_PADDING_HEADER,
  MODAL_PADDING_TOP,
} from '../../util/constant';
import styles from './index.less';
/**使用此组件无需使用bodyStyle等，可在项目中自行查找
 * 外部传参根据宽度尺寸判断
 * @widthType 宽度类型 必需传入
 * @top 距离顶部高度
 * @modalType layout和page、fast等几种 弹窗类型 默认走page页面内弹窗，layout包含nav头部的弹窗，像身份选择、主题门户
 * fast 弹窗： 不包含nav头和底部的弹窗 快捷桌面（弹窗）/个人桌面（一键审批弹窗），page: 日程弹窗等
 * 注意外部挂载id,
 * @incomingWidth 加入宽度，宽度从外部传入，实例：incomingWidth=300等，只支持数字，否则无法计算，宽度可以由外部传入控制 可不传
 * @incomingHeight 加入高度不能使用百分比，无法计算：incomingHeight字段可外部传入高度,如果内容少底部空白过多可自定义高度，只支持数字，否则无法计算，插拔式可选择 可不传
 * @containerId 对于页面弹窗和fast快捷桌面设置 外部挂载id，页面挂载有问题，需要挂载在非dom_container时使用 可不传
 * */
let content,
  contentLeft = 0,
  contentRight = 0,
  modal_type = 'page';
const GlobalModal = (props) => {
  const [changStatus, setChangeStatus] = useState('middle');
  const [largeHeight, setLargeHeight] = useState(0);
  const [largeWidth, setLargeWidth] = useState(0);
  const [moveTop, setMoveTop] = useState(props.top);
  const [moveLeft, setMoveLeft] = useState(0);
  // 是否移动
  const [isMove, setIsMove] = useState(false);
  const [centerComputed, setCenterComputed] = useState({
    left: 0,
    top: 0,
  });
  /*
     1：基本弹窗
     2： 内容相对较多
     3： 内容非常多
     4： 小的有内容的弹窗
     5: 导出等有内容的小弹窗
     6: 主题门户专用
     都是内容弹窗，删除等弹窗不包含
    **/
  const baseWidth = {
    1: props.incomingWidth || 600,
    2: props.incomingWidth || 800,
    3: props.incomingWidth || 1000,
    4: 400,
    5: 500,
    6: 750,
  };
  const baseHeight = {
    1: props.incomingHeight || 433,
    2: props.incomingHeight || 553,
    3: props.incomingHeight || 653,
    4: 254,
    5: 254,
    6: 190,
  };
  const [modalWidth, setModalWidth] = useState(
    JSON.parse(JSON.stringify(baseWidth)),
  );
  const [modalHeight, setModalHeight] = useState(
    JSON.parse(JSON.stringify(baseHeight)),
  );

  // 获取屏幕高度
  useEffect(() => {
    const clientHeight = getClient().clientHeight;
    const clientWidth = getClient().clientWidth;
    /**
     * 目前四种类型区分内容，一种layout类型，fast:快捷桌面,page:页面内
     * full 是全局弹窗 最大弹窗 还需修改些样式
     *
     */
    const types = {
      full: () => {
        setLargeHeight(
          clientHeight - MODAL_PADDING_HEADER - MODAL_PADDING_FOOTER,
        );
      },
      layout: () => {
        setLargeHeight(
          clientHeight -
            MODAL_PADDING_HEADER -
            MODAL_PADDING_FOOTER -
            MODAL_PADDING_TOP * 2,
        );
        setLargeWidth(clientWidth - MODAL_PADDING_TOP * 2);
      },
      fast: () => {
        setLargeHeight(
          clientHeight - MODAL_PADDING_HEADER - MODAL_PADDING_FOOTER,
        );
      },
      page: () => {
        setLargeHeight(
          clientHeight -
            MODAL_PADDING_TOP -
            MODAL_PADDING_HEADER -
            MODAL_PADDING_FOOTER,
        );
      },
    };
    types[modal_type]();

    // 自动设置居中
    const left = getClient().left;
    // 需要减去padding+header的头部距离
    const top = getClient().top;
    setMoveLeft(left);
    setMoveTop(top);
    setCenterComputed({
      left,
      top,
    });
  }, [props.visible]);
  useEffect(() => {
    const modal_body = getModalBody().modal_body;
    // 如果时多层弹窗获取当前弹窗的内容
    if (modal_body) {
      modal_body.style.display = 'block';
      computedContent();
    }
    return () => {
      // 关闭还原
      setIsMove(true);
      const left = getClient().left;
      const top = getClient().top;
      setMoveTop(top);
      setMoveLeft(left);
      setModalWidth(baseWidth);
      const curHeight = getClient().getClient_().curHeight;
      setModalHeight(curHeight);
      setChangeStatus('middle');
    };
  }, [
    props.visible,
    props.widthType,
    document.getElementsByClassName('ant-modal-content'),
  ]);
  useEffect(() => {
    const curHeight = getClient().getClient_().curHeight;
    setModalHeight(curHeight);
  }, [props.widthType]);
  // 获取页面高度/宽度
  const getClient = () => {
    modal_type = props.modalType || 'page';
    // 动态获取页面高度
    const getDynamicHeight = (client) => {
      const clientHeight = client;
      let nowClientHeight =
        typeof clientHeight == 'number' &&
        clientHeight - MODAL_PADDING_HEADER - MODAL_PADDING_FOOTER;
      nowClientHeight =
        nowClientHeight - (props.modalType == 'fast' ? 0 : MODAL_PADDING_TOP);
      const curHeight = JSON.parse(JSON.stringify(baseHeight));
      if (baseHeight[props.widthType] > nowClientHeight && nowClientHeight) {
        const nowHeight = Object.assign(curHeight, {
          [props.widthType]: nowClientHeight,
        });
        return {
          curHeight: nowHeight,
        };
      }
      return {
        curHeight,
      };
    };
    // 获取当前区域、判断如果弹窗高度超出当前页面高度使用当前页面高度
    const getClient_ = () => {
      const clientHeight = document.getElementById(props.containerId)
        ? document.getElementById(props.containerId).clientHeight
        : document.getElementById('dom_container')?.clientHeight - 48;
      const clientWidth = document.getElementById(props.containerId)
        ? document.getElementById(props.containerId).clientWidth
        : document.getElementById('dom_container')?.clientWidth - 48;
      const nowTop =
        clientHeight - (props.modalType == 'fast' ? 0 : MODAL_PADDING_TOP);
      const left = clientWidth / 2 - baseWidth[props.widthType] / 2;
      const top =
        (nowTop - getDynamicHeight(clientHeight).curHeight[props.widthType]) /
          2 -
        (MODAL_PADDING_HEADER + MODAL_PADDING_FOOTER) / 2;
      return {
        left,
        top,
        clientHeight,
        clientWidth,
        curHeight: getDynamicHeight(clientHeight).curHeight,
      };
    };
    // full 和layout类型的不做处理
    const matches = {
      full: () => {
        const clientHeight = document.getElementById('pro-layout')
          ?.clientHeight;
        const clientWidth = document.getElementById('pro-layout')?.clientWidth;
        const left = clientWidth / 2 - baseWidth[props.widthType] / 2;
        const top = clientHeight / 2 - baseHeight[props.widthType] / 2;
        return {
          left,
          top,
          clientWidth: clientWidth,
          clientHeight: clientHeight,
        };
      },
      layout: () => {
        const clientAllHeight = document.querySelector('.ant-layout-content')
          ?.clientHeight;
        const clientAllWidth = document.querySelector('.ant-layout-content')
          ?.clientWidth;
        const left = clientAllWidth / 2 - baseWidth[props.widthType] / 2;
        const top =
          (clientAllHeight - baseHeight[props.widthType]) / 2 -
          (MODAL_PADDING_FOOTER + MODAL_PADDING_HEADER) / 2;
        return {
          left,
          top,
          clientWidth: clientAllWidth,
          clientHeight: clientAllHeight,
        };
      },
      fast: () => {
        return getClient_();
      },
      page: () => {
        return getClient_();
      },
    };
    return {
      clientWidth: matches[modal_type]().clientWidth,
      clientHeight: matches[modal_type]().clientHeight,
      left: matches[modal_type]().left,
      top: matches[modal_type]().top,
      getClient_,
    };
  };
  // 获取弹窗body
  const getModalBody = () => {
    const classList = document.getElementsByClassName('ant-modal-body');
    // 处理多层弹窗 最小化还原问题
    const modal_body = document.getElementsByClassName('ant-modal-body')[
      classList.length - 1
    ];
    return {
      modal_body,
    };
  };
  const changeSize = (status) => {
    setChangeStatus(status);
    status_progress()[status]();
  };
  const status_progress = () => {
    getModalBody().modal_body.style.display = 'block';
    // 状态变化
    const status = {
      large: () => {
        let changeHeight,
          changeWidth,
          top = 0,
          left = 0;
        changeWidth = Object.assign(
          { ...modalWidth },
          { [props.widthType]: '100%' },
        );
        changeHeight = Object.assign(
          { ...modalHeight },
          { [props.widthType]: largeHeight },
        );
        // 公共弹窗类型单独配置
        if (props.modalType == 'layout') {
          // 统一添加16px边框
          top = 16;
          left = 16;
          changeWidth = Object.assign(
            { ...modalWidth },
            { [props.widthType]: largeWidth },
          );
        }

        setModalWidth(changeWidth);
        setModalHeight(changeHeight);
        // 设置最大化初始位置
        setMoveTop(top);
        setMoveLeft(left);
      },
      middle: () => {
        const curHeight = getClient().getClient_().curHeight;
        setModalWidth(baseWidth);
        setModalHeight(curHeight);
        setMoveTop(centerComputed.top);
        setMoveLeft(centerComputed.left);
      },
      small: () => {
        const changeWidth = Object.assign(
          { ...modalWidth },
          { [props.widthType]: 260 },
        );
        const changeHeight = Object.assign(
          { ...modalHeight },
          { [props.widthType]: 0 },
        );
        getModalBody().modal_body.style.display = 'none';
        setModalWidth(changeWidth);
        setModalHeight(changeHeight);
        // 设置最小化初始位置
        setMoveTop(0);
        setMoveLeft(0);
      },
    };
    return status;
  };
  // 底部footer 部分
  const footerChange = () => {
    const footer =
      changStatus == 'small' ? null : props.footer || props.footer == null ? (
        props.footer
      ) : (
        <div>
          <Button onClick={props.onCancel}>{props.cancelText}||取消</Button>
          <Button onClick={props.onOk}>{props.okText}||确定</Button>
        </div>
      );
    return footer;
  };
  // 计算content 弹窗内容
  const computedContent = () => {
    const classList = document.getElementsByClassName('ant-modal-content');
    // 处理多层弹窗
    content = document.getElementsByClassName('ant-modal-content')[
      classList.length - 1
    ];
    contentLeft = content.getBoundingClientRect().left;
    // 因为padding-top/padding-left/padding-right 宽度一样，这里减去padding-left和padding-right
    // 添加不同类型弹窗
    const get_same_fn = () => getClient().clientWidth - content.offsetWidth;
    const lay_modal = {
      layout: get_same_fn(),
      page: get_same_fn() - MODAL_PADDING_TOP * 2,
      fast: get_same_fn(),
      full: get_same_fn(),
    };
    contentRight = lay_modal[modal_type];
  };
  const onMouseDown = (e) => {
    e.preventDefault();
    if (changStatus == 'large') {
      return;
    }
    if (isMove) {
      // 移动重新计算处理多层弹窗，关闭上层，移动下层问题
      computedContent();
      // 弹窗内容里才能进行移动
      const modal_left = content.getBoundingClientRect().left;
      const modal_right = content.getBoundingClientRect().right;
      const modal_top = content.getBoundingClientRect().top;
      const modal_bottom = content.getBoundingClientRect().bottom;

      if (
        e.clientX >= modal_left &&
        e.clientX <= modal_right &&
        e.clientY >= modal_top &&
        e.clientY <= modal_bottom
      ) {
        setIsMove(true);
      }
    }

    // 记录初始移动的鼠标位置
    const startPosX = e.clientX;
    const startPosY = e.clientY;
    // 添加鼠标移动事件
    document.onmousemove = (e) => {
      let cx = e.clientX - startPosX + moveLeft,
        cy = e.clientY - startPosY + moveTop;
      // 设置范围边界
      // 左侧
      if (cx <= 0) {
        cx = 0;
      }
      // 上边
      if (cy < 0) {
        cy = 0;
      }
      // 右侧
      if (cx > contentRight) {
        cx = contentRight;
      }
      // 底部
      if (getClient().clientHeight - cy < content.offsetHeight) {
        const client = getClient().clientHeight - content.offsetHeight;
        const footer_cy = {
          layout: () => client,
          fast: () => client,
          page: () => client - MODAL_PADDING_TOP,
          full: () => client,
        };
        cy = footer_cy[modal_type]();
      }
      setMoveTop(cy);
      setMoveLeft(cx);
    };
    // 鼠标放开时去掉移动事件
    document.onmouseup = function (e) {
      document.onmousemove = null;
      setIsMove(true);
      if (
        e.clientX > getClient().clientWidth ||
        e.clientY < 0 ||
        e.clientX < 0 ||
        e.clientY > getClient().clientHeight
      ) {
        document.onmousemove = null;
      }
    };
  };

  // 标题部位状态显示
  const titleChange = () => {
    return (
      <div className={styles.title_change} onMouseDown={onMouseDown}>
        {props.title || '信息'}
        <div className={styles.title_text}>
          {changStatus == 'middle' &&
            !window.location.href.includes('/mobile') && (
              <span
                className={styles.small}
                onClick={() => changeSize('small')}
              >
                <img src={min_img} alt="" />
              </span>
            )}
          {changStatus == 'middle' && (
            <span onClick={() => changeSize('large')}>
              <img src={max_img} alt="" />
            </span>
          )}
          {(changStatus == 'large' || changStatus == 'small') && (
            <span className={styles.back} onClick={() => changeSize('middle')}>
              <img src={back} alt="" />
            </span>
          )}
        </div>
      </div>
    );
  };
  // 样式控制
  const styleChange = () => {
    return {
      position: 'absolute',
      top: changStatus ? moveTop : props.top ? props.top : {},
      overflow: 'hidden',
      left: moveLeft,
    };
  };
  return (
    <Modal
      style={styleChange()}
      wrapClassName="dragBox"
      {...props}
      getContainer={
        typeof props.getContainer == 'function'
          ? props.getContainer
          : () => false
      }
      destroyOnClose={true}
      title={titleChange()}
      footer={footerChange()}
      width={modalWidth[props.widthType]}
      bodyStyle={{ height: modalHeight[props.widthType], ...props.bodyStyle }}
    >
      {props.children}
    </Modal>
  );
};

export default GlobalModal;
