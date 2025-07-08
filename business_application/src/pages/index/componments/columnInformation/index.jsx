/**
 * @author zhangww
 * @description 栏目-资讯公告
 */

import React, { useEffect, useRef } from 'react';
import { useSize } from 'ahooks';
import { history } from 'umi';
import { connect } from 'dva';
import styles from './index.less';
// import "./index.css";
import { Carousel } from 'antd';
import img from "../../../../public/assets/login_banner1.jpg";
import { ReactComponent as LeftOutlined } from '../../../../public/assets/left.svg';
import { ReactComponent as RightOutlined } from '../../../../public/assets/right.svg';
import { ReactComponent as InformationIcon } from '../../../../public/assets/zxgg.svg';
import { ReactComponent as MORE } from "../../gengduo.svg";
import { ReactComponent as REFRE } from "../../shuaxin.svg";

function Index({ dispatch, columnInformation, desktopLayout }) {

  const { list, isLoop } = columnInformation;
  const { refreshTag } = desktopLayout;

  const refCar = useRef(null);
  const size = useSize(refCar);

  useEffect(() => {
    console.log('size.height',size?.height);
  }, [size?.height]);

  useEffect(() => {
    getList();
  }, [refreshTag]);

  function getList() {
    dispatch({
      type: 'columnInformation/getInformation',
      payload: {
        start: 1,
        limit: 100
      }
    })
  }

  function linkToInformation() {
    historyPush({pathname:'/informationList'});
  }

  const onClickRow = (item) => {
    let information_id = item.informationId;
    let url = item.linkUrl;
    if (url) {
      dispatch({
        type: 'informationList/getInformationComment',
        payload: {
          informationId: information_id,
        },
      });
      if (url.indexOf('https://') > -1 || url.indexOf('http://') > -1) {
         window.open(url, '_blank');
      } else {
        window.open(`http://${url}`, '_blank');
      }
    } else {
      const serializedState = JSON.stringify(information_id);
      localStorage.setItem('information_id', serializedState);
      historyPush({
        pathname: `/informationList/detail`,
        query:{
          title:"详情",
          information_id
        }
      })
    }
  }

  const contentStyle = {
    marginTop: '-200px',
    height: size? `${(size?.height - 60)}px` : '300px',
    color: '#fff',
    lineHeight: size? `${(size?.height - 60)}px` : '300px',
    textAlign: 'center',
  }

  const styleDefaults = {
    height: 300,
    color: "white",
    fontSize: 100,
    textAlign: "center"
  };

  return (
    <div className={styles.follow} ref={refCar}>
      <div className={styles.nav}>
        <InformationIcon className={styles.icon}/>
        <b>资讯公告</b>
        <span className={styles.right_icon} onClick={linkToInformation}>
          <MORE />
        </span>
        <span className={styles.right_icon} onClick={getList}>
          <REFRE />
        </span>
      </div>
      {/* style={{ minHeight: size? (size?.height - 55) : 300 }} */}
      <div className={styles.list}>
        <Carousel
          arrows
          dots={false}
          prevArrow={<LeftOutlined />}
          nextArrow={<RightOutlined />}
          autoplay={isLoop}
          autoplaySpeed={10000}
        > 
          {list.map((item, index)=> {
            return(
              <div className={styles.carousel} onClick={()=>onClickRow(item)}>
                <img src={item.fileStorageUrl || img} style={{width: '100%', borderRadius: 8, height: size? (size?.height - 60) : 300}}/>
                <div className={styles.bottom}>
                  <p>{item.informationFileName}</p>
                </div>
              </div>
            )
          })}
        </Carousel>
      </div>
    </div>
  );
}

export default connect(({
  columnInformation,
  desktopLayout
}) => ({
  columnInformation,
  desktopLayout
}))(Index);

