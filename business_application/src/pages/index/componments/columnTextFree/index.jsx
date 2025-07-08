/**
 * @author zhangww
 * @description 文字栏目
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSize } from 'ahooks';
import { connect } from 'dva';
import styles from './index.less';
import IconFont from '../../../../Icon_manage';
import { Table, Tabs, Badge, Carousel } from 'antd';
import { MicroAppWithMemoHistory, history } from 'umi';
import { dataFormat } from '../../../../util/util';
import img from "../../../../public/assets/login_banner1.jpg";
import new_img from '../../../../../public/assets/new.svg'
import { ReactComponent as LeftOutlined } from '../../../../public/assets/left.svg';
import { ReactComponent as RightOutlined } from '../../../../public/assets/right.svg';

const { TabPane } = Tabs;

function Index({ desktopLayout, id, val }) {
  console.log('文字栏目', val);
  const [list, setList] = useState([]);
  const [activeKey, setActiveKey] = useState('0');
  const [childJson, setChildJson] = useState(val?.sectionChildJson ? JSON.parse(val.sectionChildJson) : []);

  const ref = useRef(null);
  const size = useSize(ref);

  console.log('size.height:',size?.height);

  const handleMouseOver = () => {
    if (document.querySelector('.ant-carousel .slick-prev')) {
      document.querySelector('.ant-carousel .slick-prev').style.opacity = '1';
    }
    if (document.querySelector('.ant-carousel .slick-next')) {
      document.querySelector('.ant-carousel .slick-next').style.opacity = '1';
    }
  };

  const handleMouseOut = () => {
    if (document.querySelector('.ant-carousel .slick-prev')) {
      document.querySelector('.ant-carousel .slick-prev').style.opacity = '0';
    }
    if (document.querySelector('.ant-carousel .slick-next')) {
      document.querySelector('.ant-carousel .slick-next').style.opacity = '0';
    }
  };

  const dataSource = [
    {
      title: '消防产品合格评定中心开展审计工作专题培训',
      time: '1708411896',
      linkJump: 'out',
      linkUrl: 'https://www.baidu.com',
      imgUrl: 'https://img0.baidu.com/it/u=1902255866,1311544265&fm=253&fmt=auto&app=138&f=JPEG?w=707&h=500',

    },
    {
      title: '消防产品合格评定中心开展审计工作专题培训',
      time: '1708411896',
      linkJump: 'inner',
      linkUrl: 'business_cma/demo0?menuId=110&title=消防1',
      imgUrl: 'https://img0.baidu.com/it/u=3918292214,656026654&fm=253&fmt=auto&app=138&f=JPEG?w=705&h=500',
    },
    {
      title: '消防产品合格评定中心开展审计工作专题培训',
      time: '1708411896',
      linkJump: 'inner',
      linkUrl: 'business_cma/demo1?menuId=120&title=消防2',
      imgUrl: '',
    },
  ]

  useEffect(() => {
    getList(activeKey);
  }, [activeKey]);

  // useEffect(() => {
  //   let otherTab = document.getElementsByClassName('ant-tabs-tab');//包含了当前的active
  //   for (let j in otherTab){
  //       if (otherTab.hasOwnProperty(j)){
  //           let i = otherTab[j]
  //           if (i.className.includes('ant-tabs-tab-active')){//当前点击的
  //               i.style.backgroundColor = '#E03D3E';
  //               i.style.color = '#fff'
  //           }
  //            else {//其他默认的样式
  //               i.style.backgroundColor = '#fafafa';
  //               i.style.color = 'rgba(0, 0, 0, 0.65)'
  //           }
  //       }
  //   }
  // }, [document.getElementsByClassName('ant-tabs-tab')]);

  // 传参格式
  function buildQueryString(params) {
    const queryString = Object.keys(params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
      )
      .join('&');
    return queryString ? `?${queryString}` : '';
  }

  function convertToObject(x) {
    if (!x) {
      return {}
    }
    const decodedX = decodeURIComponent(x);
    const params = new URLSearchParams(decodedX);
    const obj = {};
    for (const [key, value] of params) {
      obj[key] = value;
    }
    return obj;
  }

  function getList(activeKey) {
    try {
      let baseUrl = '';
      let arr = childJson[activeKey].api.split('?')
      let url = arr[0]
      let params = arr[1]
      let obj = convertToObject(params)
      // let tmp = url.split('/').filter((item) => item)
      if (childJson[activeKey].api.indexOf('http') < 0) {
        baseUrl = `${window.localStorage.getItem('env')}`;
      }
      const body = {
        start: 1,
        limit: 30,
        subType: childJson[activeKey]?.code,
      }
      fetch(
        `${baseUrl}${url}${buildQueryString({
          ...obj,
          ...body,
        })}`,
        {
          method: 'get',
          headers: {
            Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
          },
        },
      ).then((response) => {
        response.json().then((data) => {
          if (data.code == 200) {
            setList(data?.data?.list)
          } else {
            setList([])
          }
        });
      });
    } catch (error) {
      console.log('error:', error);
    }

  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      width: 12,
      render: (text, obj, index) => (
        <div className={styles.list_title}>
          <a></a>
        </div>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      render: (text, obj, index) => (
        <div style={{ display: 'inline-flex', width: '100%' }}>
          <span
            className={styles.noticeTitle}
            title={text}
          >
            {text}
          </span>
          {obj.isNew == 1 ? (
            <img style={{ marginLeft: 8 }} src={new_img} />
          ) : (
            ''
          )}
        </div>
      ),
    },
    // {
    //   title: '发布人',
    //   dataIndex: 'author',
    //   ellipsis: true,
    //   width: 100,
    // },
    {
      title: '时间',
      dataIndex: 'time',
      render: (text) => {
        return <span className={styles.date}>{dataFormat(text)}</span>;
      },
      width: 110,
      align: 'right',
    },
  ];

  function tabOnChange(i) {
    console.log(i);
    setActiveKey(i);
  }

  const onClickMore = () => {
    let url = childJson[activeKey]?.link
    if (url.indexOf('http://') > -1) {
      window.open(url, '_blank');
    } else {
      pushSeries(url);

    }
  }

  function parseParams(params) {
    if (params) {
      var paramsArray = params?.split('&');
      var result = {};
      paramsArray.forEach(function (param) {
        var keyValue = param.split('=');
        result[keyValue[0]] = keyValue[1];
      });
      return result;
    } else {
      return {}
    }
  }

  //选中行
  const selectRow = (record) => {
    return {
      onClick: () => {
        onClickCarlRow(record)
      }
    }
  }

  const onClickCarlRow = (item) => {
    const { linkJump, linkUrl } = item
    if (linkJump === 'out') {
      window.open(linkUrl, '_blank');
    } else {
      pushSeries(linkUrl);
    }
  }

  function parseFraction(input) {
    // 找到第一个斜杠的位置
    const slashIndex = input.indexOf('/');

    if (slashIndex === -1) {
      // 如果没有斜杠，直接返回原始字符串作为第一个部分，第二个部分为空字符串
      return [input.trim(), ''];
    } else {
      // 分割字符串成两部分，并去除两边的空格
      const part1 = input.slice(0, slashIndex).trim();
      const part2 = input.slice(slashIndex + 1).trim();
      return [part1, part2];
    }
  }

  function pushSeries(linkUrl) {
    // /business_application/noticePage?title=查看&id=1803253693575929857&path=/notification
    const paths = ['business_controls', 'business_cma', 'business_oa', 'main']
    let arr = linkUrl.split('?')
    let url = arr[0]
    // let tmp = url.split('/').filter((item) => item)
    let microAppName = parseFraction(url)[0];
    let pageName = parseFraction(url)[1];
    let params = parseParams(arr?.[1])
    if (paths.includes(microAppName)) {
      if (microAppName == 'business_cma') {
        // 气象
        historyPush({
          pathname: `/meteorological`,
          query: {
            microAppName,
            ...params,
            url: pageName, //url都放在最后一个，方便子项目的参数解析
          },
          title: params?.title || '查看',
        });
      } else if (microAppName == 'main' || microAppName == 'business_oa') {
        console.log('arr', arr);
        // 支撑
        historyPush({
          pathname: `/microPage`,
          query: {
            microAppName,
            ...params,
            url: pageName, //url都放在最后一个，方便子项目的参数解析
          },
          title: params?.title || '查看',
        });
      } else {
        historyPush({
          pathname: `/budgetPage`,
          query: {
            microAppName,
            ...params,
            url: pageName, //url都放在最后一个，方便子项目的参数解析
          },
          title: params?.title || '查看',
        });
      }

    } else if (microAppName == 'business_application') {
      // 这没办法  咨询公告得干👇🏻这个 
      if (pageName === 'informationList/detail') {
        let information_id = params.information_id;
        const serializedState = JSON.stringify(information_id);
        localStorage.setItem('information_id', serializedState);
      }
      historyPush({
        pathname: `/${pageName}`,
        query: {
          ...params,
        },
        title: params?.title || '查看',
      });
    }
  }


  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.header}>
        <div className={styles.title}>
          <IconFont type={val?.deskSectionIcon ? `icon-${val?.deskSectionIcon}` : 'icon-default'} style={{ fontSize: 16, margin: '0 8px 0 12px', color: '#FFFFFF' }} />
          <span className={styles.lm}>{val?.deskSectionName}</span>
        </div>
        <div className={styles.more}>
          <span onClick={() => onClickMore()}>更多</span>
        </div>
      </div>
      <div className={styles.nav}>
        <Tabs onChange={tabOnChange} activeKey={activeKey}>
          {childJson.map((item, index) => {
            return <TabPane tab={item.name || '未命名'} key={index}></TabPane>;
          })}
        </Tabs>
      </div>
      <div className={styles.main}>
        {
          (val?.sectionPresent == 2 && list.length > 0) &&
          <div className={styles.left}>
            <Carousel
              arrows
              dots={false}
              prevArrow={<LeftOutlined onMouseOver={handleMouseOver} />}
              nextArrow={<RightOutlined onMouseOver={handleMouseOver} />}
              // autoplaySpeed={10000}
              autoplay
            >
              {list.map((item, index) => {
                return (
                  <div className={styles.carousel} onClick={() => onClickCarlRow(item)} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                    <img src={item.imgUrl || img} style={{ width: '100%', borderRadius: 8, height: size?.height  - 98 }} />
                    <div className={styles.bottom}>
                      <p title={item.title}>{item.title}</p>
                    </div>
                  </div>
                )
              })}
            </Carousel>
          </div>
        }

        <div className={styles.right}>
          <Table
            style={{ marginTop: -16 }}
            size="small"
            showHeader={false}
            dataSource={list}
            columns={columns}
            onRow={selectRow}
            scroll={{ y: size?.height  - 98 }}
            pagination={false}
          />
        </div>
      </div>
    </div>
  )
}

export default connect(({ desktopLayout }) => ({
  desktopLayout,
}))(Index);
