import { useEffect, useState, useMemo } from 'react';
import styles from './index.less';
import { history, MicroAppWithMemoHistory, connect } from 'umi';
import { useSetState } from 'ahooks';
import './index.less';
import { CheckOutline, CloseOutline, AaOutline } from 'antd-mobile-icons';
import { Spin } from 'antd';
import IconFont from '../../Icon_manage';
import { dataFormat } from '../../util/util';
import moment from 'moment';
import {
  SearchBar,
  Space,
  IndexBar,
  List,
  Footer,
  Popup,
  Toast,
  Tabs,
  Empty,
  PullToRefresh,
  FloatingBubble
} from 'antd-mobile/es';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TIMES_FILTER, MAKEACTION, COLOR, MSG_TYPE, MESSAGE_INFO_TYPE,IMPORTANCE,IMPORTANCE_COLOR, SCHEDULETYPE,SCHEDULETYPE_COLOR,NOTICE_TYPE } from '../../service/constant';
import bj from '../../../public/assets/已办结.svg'
import * as dd from 'dingtalk-jsapi';

function Index({ location, dispatch, category, limit, messageList, loading }) {
  const {
    currentPage,
    list,
    returnCount,
    msgType
  } = messageList;
  const [searchWord, setSearchWord] = useState('');

  useEffect(() => {
    // title传值例子
    // window.uni && window.uni.postMessage({data: {title: '标题X'}});
  }, []);

  useEffect(() => {
    if(category=='DAILY'&&msgType!='DAILY_NOTICE'){
      localStorage.removeItem('calendarTheme')
      localStorage.removeItem('calendarAddress')
      localStorage.removeItem('editAddress')
      localStorage.removeItem('editTheme')
    }
  }, [category,msgType]);
  useEffect(() => {
    setSearchWord('')
    dispatch({
      type: 'messageList/updateStates',
      payload:{
        msgType: category=='MATTER'?'MATTER_TODO,MATTER_CIRCULATE':''
      }
    });
    getMessageList('', 1, limit,category=='MATTER'?'MATTER_TODO,MATTER_CIRCULATE':'');
  }, [category]);
  useEffect(()=>{
    window.addEventListener('popstate', onBack);
    return ()=>{
      window.removeEventListener('popstate', onBack);
    }
  })
  function onBack(event){
    if(event.singleSpaTrigger&&event.singleSpaTrigger=='pushState'){
    }else{
      // history.push({
      //   pathname: `/mobile`,
      // });
    }
  }
  //加载更多
  function loadMore() {
    getMessageList(
      searchWord,
      Number(currentPage) + 1,
      limit,
      msgType
    );
  }
  //获取工作事项列表
  const getMessageList = (
    searchWord,
    start,
    limit,
    msgType
  ) => {
    if(start==1){
      document?.getElementById('scrollableDiv')?.scrollTo(0, 0)
    }
    var payload = {
      searchWord,
      start,
      limit,
      category,
      msgType
    };
    dispatch({
      type: 'messageList/getMessageList',
      payload
    });
  };

  //耗时计算
  const returnTime = (l) => {
    if (!l.startTime) {
      return '';
    }
    let timeDiff = 0;
    if (!l.endTime) {
      timeDiff = moment().format('X') - l.startTime;
    } else {
      timeDiff = l.endTime - l.startTime;
    }
    // 小时
    let timeH = Math.floor(timeDiff / 3600);
    // 分钟
    let timeMinute = Math.floor((timeDiff % 3600) / 60);
    return `${timeH}小时/${timeMinute}分钟`;
  };



  //搜索
  const onSearch = (value) => {
    setSearchWord(value);
    getMessageList(value, 1, limit,msgType);
  };

  //跳转至表单详情页
  const toDetail = (item) => {
    if(item.msgStatus==0){//未读改为已读
      dispatch({//改为已读
        type: 'messageList/putMessage',
        payload:{
          msgIds: item.msgId
        }
      });
    }
    if(category=='MATTER'){//事项
      let obj = JSON.parse(item.targetParam)
      if (item.msgType=='MATTER_CIRCULATE') {
        dispatch({
          type: `workList/setCirculate`,
          payload: {
            bizTaskIds: obj.bizTaskId
          }
        })
      }
      let query = {
        bizSolId: obj.bizSolId,
        bizInfoId: obj.bizInfoId,
        title: obj.bizTitle,
        isTrace: obj.isTrace, //是否跟踪
        workType: item.msgType=='MATTER_CIRCULATE'?'CIRCULATE':'TODO', //工作事项列表类型
        id: obj.mainTableId,
        // isMessage: 1,
        category,
      };
      if (item.msgType == 'MATTER_TODO') {
        query = {
          ...query,
          bizTaskId: obj.bizTaskId,
        };
      }
      historyPush({
        pathname: `/mobile/formDetail`,
        query,
      });
    }else if(category=='SYS'){//系统 
      // localStorage.setItem('msgInfo',JSON.stringify(item))
      historyPush({
        pathname: `/mobile/sysMsgInfo`,
        query:{
          msgId: item.msgId,
          // msgType: item.msgType,//超期提醒(SYS_OVERDUE_WARNING)、催办提醒(SYS_URGING_WARNING)、授权到期提醒(SYS_AUTH_WARNING)
        }
      });
    }else if(item.msgType=='DAILY_NOTICE'){//通知公告
      let obj = JSON.parse(item.targetParam)
      dispatch({
        type: 'announcementSpace/addViewsNotice',
        payload: {
            noticeId: obj.noticeId
        },
        callback:()=>{
            historyPush({
              pathname: `/mobile/AnnounceDetail`,
              query:{
                // msgId: item.msgId,
                id: obj.noticeId,
              }
            });
        }
      })
    }else if(item.msgType=='DAILY_SCHEDULE'){//日程
      let obj = JSON.parse(item.targetParam)
      historyPush({
        pathname: `/mobile/CalendarDetail`,
        query:{
          startTime: obj.startTime,
          endTime: obj.endTime,
          id: obj.scheduleId
        }
      });
    }
    
  };
  function renderItemInfo(msg){
    let targetParam = JSON.parse(msg.targetParam||'{}')
    if(category=='SYS'){
      targetParam = msg
    }
    return <>
      {
        MESSAGE_INFO_TYPE[msg.msgType||msgType]?.map((item)=>{
          let text = targetParam[item.key]
          if(item.key=='time'){
            text = returnTime(targetParam);
          }else if(item.key?.includes('Time')){
            text = dataFormat(
              targetParam[item.key],
              `YYYY年MM月DD日 HH:mm:ss`,
            )
          }else if(item.key=='msgTitle'){
            text = msg[item.key]
          }
          if(item.title=='标题'){
            return <h1 className={styles.title}>
                      <span className={styles[msg?.msgType=='DAILY_NOTICE'?'title_span_h':'title_span']}>{text}</span>
                      {msg.msgStatus == 0 &&(
                        <div className={styles.title_info}>{'未读'}</div>
                      )}
                      {msg.msgStatus !== 0 &&(
                        <div className={styles.title_info_success}>
                          {'已读'}
                        </div>
                      )}
                    </h1>
          }

          if(item.key=='importance'){//日程
            return <div className={styles.status}>
              {targetParam.importance?<div 
                className={styles.status_info} 
                // style={{background:IMPORTANCE_COLOR[targetParam.importance]}}
                >
                {IMPORTANCE[targetParam.importance]}
              </div>:''}
              <div 
                className={styles[`status_info_${targetParam.scheduleType}`]}>
                  {SCHEDULETYPE[targetParam.scheduleType]}
              </div>
            </div>
          }
          if(item.key=='msgTitle'&&!item.title&&msg?.msgType=='DAILY_NOTICE'){//通知公告
            return <p className={styles.info}>
                        <i className={styles.msg_title}>{text}</i>
                   </p>
          }
          return <p className={styles.info}>
                    {category=='MATTER'&&item.title=='已耗时'?<span style={msg.warning && {background: COLOR[msg.warning]}} className={styles.warning}></span>:''}  
                    {item.title&&<i style={{width: 'unset'}}>{item.title}：</i>}
                    {/* {item.title&&<i style={category=='SYS'||msg?.msgType=='DAILY_NOTICE'?{width: 'unset'}:{}}>{item.title}：</i>} */}
                    {text&&<b>{text}</b>}
                 </p>
        })
      }
    </>  
  }
  function onChangeTab(key){
    dispatch({
      type: 'messageList/updateStates',
      payload: {
        msgType: key,
      },
    });
    getMessageList(searchWord, 1, limit,key);
  }
  return (
    <Spin spinning={loading.effects['messageList/getMessageList']}>
      {/* {dd.env.platform !== 'notInDingTalk'&&<FloatingBubble
        magnetic='x'
        style={{
          '--background':'var(--ant-primary-color)',
          '--border-radius': '3.57rem 0 0 3.57rem',
          '--size': '2.79rem',
          '--initial-position-right': '0rem',
          '--initial-position-top': '3.43rem',
          '--height-size': '1.75rem',
        }}
        onClick={onBack}
      >
        返回
      </FloatingBubble>} */}
    <div className={styles.container}>
      <div className={styles.search_header}>
        <SearchBar
          placeholder="请输入搜索内容"
          className={styles.search}
          onSearch={onSearch.bind(this)}
          onClear={onSearch.bind(this, '')}
        />
      </div>
      <Tabs
        className={styles.tabs_list}
        activeKey={msgType}
        onChange={onChangeTab.bind(this)}
        activeLineMode={'fixed'}
      >
        <Tabs.Tab title={'全部'} key={category=='MATTER'?'MATTER_TODO,MATTER_CIRCULATE':''} />
        {MSG_TYPE[category]?.length != 0 &&
          MSG_TYPE[category]?.map((item) => {
            return <Tabs.Tab title={item.title} key={item.key} />;
          })}
      </Tabs>
      <div
        className={styles.tab_container}
        id="scrollableDiv"
        style={msgType != 'MATTER_CIRCULATE' && category=='MATTER'? { height: `calc(100% - 6.86rem - 2.92rem)` } : {height: `calc(100% - 6.86rem)`}}s
      >
        {list&&list?.length == 0 ? (
          <Empty
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
            imageStyle={{ width: 128 }}
            description="暂无数据"
          />
        ) : (
          <PullToRefresh
            onRefresh={() => {
              getMessageList(
                searchWord,
                1,
                limit,
                msgType
              )
            }
            }
          >
            <InfiniteScroll
              dataLength={list.length}
              next={loadMore}
              hasMore={list?.length < returnCount}
              loader={<Spin className="spin_div" />}
              endMessage={
                list?.length == 0 ? (
                  ''
                ) : (
                  <span className="footer_more">没有更多啦</span>
                )
              }
              scrollableTarget="scrollableDiv"
            >
              <div className={styles.tab_list_container}>
                {list.length != 0 &&
                  list?.map((l, index) => {
                    let targetParam = JSON.parse(l.targetParam||'{}')
                    return (
                      <div className={styles.tab_list_item} key={index}>
                        {/* <div className={styles.tab_list_item_left}>
                          <IconFont
                            type={
                              `icon-waitMatter`
                              // type == 'TODO'
                              //   ? `icon-waitMatter`
                              //   : `icon-${type.toLowerCase()}Work`
                            }
                            className={styles.left_icon}
                          />
                        </div> */}
                        <div
                          className={styles.tab_list_item_right}
                          onClick={toDetail.bind(this, l)}
                          style={{
                            backgroundImage:
                            targetParam?.bizStatus == '2' && msgType != 'TODO'&&category=='MATTER'
                                ? `url(${bj})`
                                : '',
                          }}
                        >
                          {category=='MATTER'?<p className={styles.type}>
                            <span>
                              {targetParam?.bizSolName}{' '}
                              {targetParam?.makeAction && MAKEACTION[targetParam?.makeAction] && (
                                <i>{MAKEACTION[targetParam?.makeAction]}</i>
                              )}
                            </span>
                            <a
                              style={
                                l.warning && {
                                  color: COLOR[l.warning],
                                }
                              }
                            >
                              {targetParam?.actName}
                            </a>
                          </p>:''}
                          {/* {l.msgType=='DAILY_NOTICE'?<p className={styles.type}>
                            <span>
                              {NOTICE_TYPE[JSON.parse(l.targetParam)?.noticeTypeCode]}{' '}
                              {l.msgStatus == 0 &&(
                                <div className={styles.title_info}>{'未读'}</div>
                              )}
                              {l.msgStatus !== 0 &&(
                                <div className={styles.title_info_success}>
                                  {'已读'}
                                </div>
                              )}
                            </span>
                            
                          </p>:''} */}
                          
                            {renderItemInfo(l)}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </InfiniteScroll>
          </PullToRefresh>

        )}
      </div>
      {msgType != 'MATTER_CIRCULATE' && category=='MATTER'&&(
        <div className={styles.footer}>
          <div className={styles.footer_item}>
            <i />
            正常
          </div>
          <div className={styles.footer_item}>
            <i />
            即将超期
          </div>
          <div className={styles.footer_item}>
            <i />
            已超期
          </div>
          <div className={styles.footer_item}>
            <i />
            无预警
          </div>
        </div>
      )}
    </div>
    </Spin>
  );
}
export default connect(({ messageList, loading }) => {
  return { messageList, loading };
})(Index);
