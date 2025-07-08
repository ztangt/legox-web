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
  FloatingBubble,
  Button
} from 'antd-mobile/es';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TIMES_FILTER, MAKEACTION, COLOR, WORK_TYPE } from '../../service/constant';
import bj from '../../../public/assets/已办结.svg'
import zf from '../../../public/assets/已作废.svg'
import * as dd from 'dingtalk-jsapi';
function Index({ location, dispatch, type, limit, workList, loading }) {
  const {
    workRules,
    groupCode,
    workRuleId,
    allPage,
    currentPage,
    list,
    returnCount,
    listTitle,
    bizSolNameList,
  } = workList;
  const [searchWord, setSearchWord] = useState('');
  const [paramsJson, setParamsJson] = useState([]);
  const [screenVisible, setScreenVisible] = useState(false);
  const [valueGroup, setValueGroup] = useState('');
  const [timeFilter, setTimeFilter] = useState('1');
  console.log('workRuleId', workRuleId);
  useEffect(() => {
    dispatch({
      type: 'workList/updateStates',
      payload: {
        workRuleId: '',
      },
    });
    setValueGroup('')//初始化数据
    setTimeFilter('1')
    setParamsJson([])
    setSearchWord('')
    geteWorkList('', 1, limit, [], '', '1');

    dispatch({
      //获取筛选条件
      type: `workList/getWorkRule`,
      // payload: {
      //   searchWord: '',
      //   start: 1,
      //   limit: 1000,
      // },
      callback: (data) => { },
    });
    dispatch({
      type: `workList/getBizSolName`, //获取筛选biz集合
      payload: {},
    });
  }, [type]);
  useEffect(()=>{
    window.addEventListener('popstate', onBack);
    return ()=>{
      window.removeEventListener('popstate', onBack);

    }
  })
  function onBack(event){
    if(event.singleSpaTrigger&&event.singleSpaTrigger=='pushState'){
    }else{
      history.push({
        pathname: `/mobile`,
      });
    }
    
  }
  //加载更多
  function loadMore() {
    geteWorkList(
      searchWord,
      Number(currentPage) + 1,
      limit,
      paramsJson,
      workRuleId,
      timeFilter,
    );
  }
  //获取工作事项列表
  const geteWorkList = (
    searchWord,
    start,
    limit,
    paramsJson,
    workRuleId,
    timeFilter,
    callback,
  ) => {
    if(start==1){
      document?.getElementById('scrollableDiv')?.scrollTo(0, 0)
    }
    var payload = {
      searchWord,
      paramsJson: JSON.stringify(paramsJson),
      start,
      limit,
      workRuleId,
      sortType: timeFilter,
    };
    dispatch({
      type: `workList/get${type}Work`,
      payload,
      timeFilter,
      callback,
    });
    // switch (type) {
    //   case 'TODO':
    //     dispatch({
    //       type: 'workList/getTodoWork',
    //       payload,
    //       timeFilter,
    //       callback,
    //     });
    //     break;
    //   case 'SEND':
    //     dispatch({
    //       type: 'workList/getSendWork',
    //       payload,
    //       timeFilter,
    //       callback,
    //     });
    //     break;
    //   case 'DONE':
    //     dispatch({
    //       type: 'workList/getDoneWork',
    //       payload,
    //       timeFilter,
    //       callback,
    //     });
    //     break;
    //   default:
    //     break;
    // }
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

  //筛选项点击
  const onNode = (item, type) => {
    if (!item) {
      //重置 初始化查询条件
      setValueGroup('');
      setParamsJson([]);
      geteWorkList(searchWord, 1, limit, [], workRuleId, '1', () => {
        setScreenVisible(false);
      });
      setTimeFilter('1');

    } else {
      if (type == 'time') {
        setTimeFilter(item.value);
      } else {
        setValueGroup(item);
        setParamsJson([
          {
            columnCode: 'BIZ_SOL_NAME',
            isLike: 1,
            columnValue: item,
            beginTime: '',
            endTime: '',
          },
        ]);
      }
    }
  };

  //搜索
  const onSearch = (value) => {
    setSearchWord(value);
    geteWorkList(value, 1, limit, paramsJson, workRuleId, timeFilter);
  };

  //筛选项面板
  const returnScreen = () => {
    return (
      <>
        <div className={styles.screen_container_list}>
          <h1 className={styles.screen_title}> 业务类型</h1>
          {bizSolNameList.length != 0 && (
            <ul className={styles.screen_list}>
              {bizSolNameList.length &&
                bizSolNameList?.map((item, index) => (
                  <li
                    key={item}
                    onClick={onNode.bind(this, item, 'name')}
                    className={
                      styles[
                      item == valueGroup
                        ? 'screen_item_checked'
                        : 'screen_item'
                      ]
                    }
                  >
                    {item}
                  </li>
                ))}
            </ul>
          )}
          <h1 className={styles.screen_title}>时间排序</h1>
          <ul className={styles.screen_list}>
            {TIMES_FILTER?.map((item, index) => (
              <li
                key={item.value}
                onClick={onNode.bind(this, item, 'time')}
                className={
                  styles[
                  item.value == timeFilter
                    ? 'screen_item_checked'
                    : 'screen_item'
                  ]
                }
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.screen_footer}>
          <Button
            onClick={() => {
              onNode();
            }}
          >
            重置
          </Button>
          <Button
            onClick={() => {
              geteWorkList(
                searchWord,
                1,
                limit,
                paramsJson,
                workRuleId,
                timeFilter,
                () => {
                  setScreenVisible(false);
                },
              );
            }}
            type="primary"
          >
            确定
          </Button>
        </div>
      </>
    );
  };

  //跳转至表单详情页
  const toDetail = (obj) => {
    let query = {
      bizSolId: obj.bizSolId,
      bizInfoId: obj.bizInfoId,
      title: obj.bizTitle,
      isTrace: obj.isTrace, //是否跟踪
      workType: type, //工作事项列表类型
      id: obj.mainTableId
    };
    if (type == 'TODO') {
      query = {
        ...query,
        bizTaskId: obj.bizTaskId,
      };
    }
    if (type == 'CIRCULATE') {
      dispatch({
        type: `workList/setCirculate`,
        payload: {
          bizTaskIds: obj.bizTaskId
        }
      })
    }
    historyPush({
      pathname: `/mobile/formDetail`,
      query,
    });
  };

  function renderItemInfo(l){
    return <>
      {
        WORK_TYPE[type].map((item)=>{
          let text = l[item.key]
          if(item.key=='time'){
            text = returnTime(l);
          }else if(item.key?.includes('Time')){
            text = dataFormat(
              l[item.key],
              `YYYY年MM月DD日 HH:mm:ss`,
            )
          }
          return <p className={styles.info}>
                    {type=='TODO'&&item.title=='本环节耗时'?<span style={l.warning && {background: COLOR[l.warning]}} className={styles.warning}></span>:''}  
                    <i style={{width: 'unset'}}>{item.title}：</i>
                    {/* <i style={type!='TODO'?{width: '5rem'}:{}}>{item.title}：</i> */}
                    <b>{text}</b>
                 </p>
        })
      }
    </>
    
    {type == 'TODO' ? (
      <>
        <p className={styles.info}>
          <i>送交人：</i>
          <b>{l.draftUserName}</b>
        </p>
        <p className={styles.info}>
          <i>送交时间：</i>
          <b>
            {dataFormat(
              l.startTime,
              `YYYY年MM月DD日 HH:mm`,
            )}
          </b>
        </p>
        <p className={styles.info}>
          <i>本环节耗时：</i>
          <b>{returnTime(l)}</b>
        </p>
      </>
    ) : (
      <>
        <p className={styles.info}>
          <i style={{width: '5rem'}}>办理时间：</i>
          <b>
            {dataFormat(
              l.startTime,
              `YYYY年MM月DD日 HH:mm`,
            )}
          </b>
        </p>
        <p className={styles.info}>
          <i style={{width: '5rem'}}>送交人：</i>
          <b>{l.draftUserName}</b>
        </p>

        <p className={styles.info}>
          <i style={{width: '5rem'}}>拟稿时间：</i>
          <b>
            {dataFormat(
              l.draftTime,
              `YYYY年MM月DD日 HH:mm`,
            )}
          </b>
        </p>
      </>
    )}
    
  }
  console.log('loading.effects',loading.effects);
  return (
    <Spin spinning={loading.effects[`workList/get${type}Work`]}>
      {dd.env.platform !== 'notInDingTalk'&&<FloatingBubble
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
      </FloatingBubble>}
    <div className={styles.container}>
      <Popup
        position="right"
        visible={screenVisible}
        bodyStyle={{ width: '90%' }}
        onMaskClick={() => {
          setScreenVisible(false)
        }}
      >
        <div className={styles.screen_container}>{returnScreen()}</div>
      </Popup>
      <div className={styles.search_header}>
        <SearchBar
          placeholder="请输入搜索内容"
          className={styles.search}
          onSearch={onSearch.bind(this)}
          onClear={onSearch.bind(this, '')}
        />
        <a
          className={styles.screen}
          onClick={() => {
            setScreenVisible(true);
          }}
        >
          筛选
        </a>
      </div>
      <Tabs
        className={styles.tabs_list}
        activeKey={workRuleId}
        onChange={(key) => {
          dispatch({
            type: 'workList/updateStates',
            payload: {
              workRuleId: key,
            },
          });
          geteWorkList(searchWord, 1, limit, paramsJson, key, timeFilter);
        }}
        activeLineMode={'fixed'}
      >
        <Tabs.Tab title={'全部'} key={''} />
        {workRules?.length != 0 &&
          workRules?.map((item) => {
            return <Tabs.Tab title={item.groupName} key={item.workRuleId} />;
          })}
      </Tabs>
      <div
        className={styles.tab_container}
        id="scrollableDiv"
        style={type != 'TODO' ? { height: `calc(100% - 6.86rem)` } : {}}
      >
        {list.length == 0 ? (
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
              geteWorkList(
                searchWord,
                1,
                limit,
                paramsJson,
                workRuleId,
                timeFilter,
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
                    return (
                      <div className={styles.tab_list_item} key={index}>
                        {/* <div className={styles.tab_list_item_left}>
                          <IconFont
                            type={
                              type == 'TODO'
                                ? `icon-waitMatter`
                                : `icon-${type.toLowerCase()}Work`
                            }
                            className={styles.left_icon}
                          />
                        </div> */}
                        <div
                          className={styles.tab_list_item_right}
                          onClick={toDetail.bind(this, l)}
                          style={{
                            backgroundImage:
                              l.bizStatus == '2' && type != 'TODO'
                                ? `url(${bj})`:
                                l.bizStatus == '4'?`url(${zf})`
                                : '',
                          }}
                        >
                          <p className={styles.type}>
                            <span>
                              {l.bizSolName}{' '}
                              {l.makeAction && MAKEACTION[l.makeAction] && (
                                <i>{MAKEACTION[l.makeAction]}</i>
                              )}
                            </span>
                            <a
                              style={
                                l.warning && {
                                  color: COLOR[l.warning],
                                }
                              }
                            >
                              {l.actName}
                            </a>
                          </p>
                          <h1 className={styles.title}>
                            <span>{l.bizTitle}</span>
                            {l.taskStatus == '0' && (type == 'TODO' || type == 'CIRCULATE') && (
                              <div className={styles.title_info}>{'未读'}</div>
                            )}
                            {l.taskStatus !== '0' && (type == 'TODO' || type == 'CIRCULATE')&& (
                              <div className={styles.title_info_success}>
                                {'已读'}
                              </div>
                            )}
                          </h1>
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
      
      {type == 'TODO' && (
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
export default connect(({ workList, loading }) => {
  return { workList, loading };
})(Index);
