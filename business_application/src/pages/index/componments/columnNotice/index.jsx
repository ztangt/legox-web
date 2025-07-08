/**
 * @author zhangww
 * @description 栏目-通知公告
 */

// import { EllipsisOutlined, RedoOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import { ReactComponent as NoticeIcon } from '../../../../public/assets/tzgg.svg';
import { dataFormat } from '../../../../util/util';
import { ReactComponent as MORE } from '../../gengduo.svg';
import { ReactComponent as REFRE } from '../../shuaxin.svg';

import styles from './index.less';

let timer = null;

function Index({ dispatch, columnNotice, desktopLayout, notification }) {
  const { list, count } = columnNotice;
  const { refreshTag } = desktopLayout;

  useEffect(() => {
    getList();
  }, [refreshTag]);

  function getList() {
    dispatch({
      type: 'columnNotice/getNoticeViewList',
      payload: {
        start: 1,
        limit: 20,
      },
    });
    dispatch({
      type: 'notification/updateStates',
      payload: {
        noticeHtmlValue: '',
      },
    });
  }

  function linkToTraceWork() {
    historyPush({ pathname: '/notificationList' });
  }
  const onShowIntroClick = (val) => {
    dispatch({
      type: 'notification/addViewsNotice',
      payload: {
        noticeId: val.noticeId,
      },
    });
    historyPush({
      pathname: '/noticePage',
      query: {
        title: '查看',
        id: val.noticeId,
      },
    });
  };
  const [isScrolle, setIsScrolle] = useState(true); // 滚动速度，值越小，滚动越快
  const speed = 30;
  const warper = useRef();
  const childDom1 = useRef();
  const childDom2 = useRef();

  const follow = useRef(follow);
  const size = useSize(follow);

  // 开始滚动
  // useEffect(() => {
  //   console.log('warperwarper',warper.current.scrollTop);
  //   // 多拷贝一层，让它无缝滚动
  //   if (warper.current.clientHeight < childDom1.current.clientHeight) {
  //     childDom2.current.innerHTML = childDom1.current.innerHTML;
  //   }
  //   if (isScrolle && warper.current !== null) {
  //     timer = setInterval(
  //       () =>
  //         warper.current.scrollTop >= childDom1.current.scrollHeight
  //           ? (warper.current.scrollTop = 0)
  //           : warper.current.scrollTop++,
  //       speed,
  //     );
  //   }
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isScrolle]);

  // useEffect(() => {
  //   // 修复
  //   setTimeout(() => {
  //     setIsScrolle(false);
  //     setIsScrolle(true);
  //   }, 100);
  // }, []);

  const hoverHandler = (flag) => setIsScrolle(flag);

  return (
    <div className={styles.follow} id="columnNotice_id" ref={follow}>
      <div className={styles.nav}>
        <NoticeIcon className={styles.icon} />
        <b>通知公告</b>
        <span className={styles.right_icon} onClick={linkToTraceWork}>
          <MORE />
        </span>
        <span className={styles.right_icon} onClick={getList}>
          <REFRE />
        </span>
      </div>
      <div className={styles.list}>
        <>
          <div
            className={styles.parent}
            ref={warper}
            style={{ height: size?.height ? size?.height - 40 : 'auto' }}
          >
            <div className={styles.child} ref={childDom1}>
              {list.map((item, index) => (
                <li
                  key={item.id}
                  onMouseOver={() => hoverHandler(false)}
                  onMouseLeave={() => hoverHandler(true)}
                  onClick={() => onShowIntroClick(item)}
                >
                  <span className={styles.num}>{item.noticeTitle}</span>
                  <span className={styles.state}>
                    {item.noticeTypeCodeName}
                  </span>
                  <span className={styles.release}>{item.releaseUserName}</span>
                  <span className={styles.date}>
                    {dataFormat(item.releaseTime)}
                  </span>
                </li>
              ))}
            </div>
            <div className={styles.child} ref={childDom2}></div>
          </div>
        </>
      </div>
    </div>
  );
}

export default connect(({ columnNotice, notification, desktopLayout }) => ({
  columnNotice,
  notification,
  desktopLayout,
}))(Index);
