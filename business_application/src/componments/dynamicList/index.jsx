import { useEffect, useState, useMemo } from 'react';
import styles from './index.less';
import { history, MicroAppWithMemoHistory, connect } from 'umi';
import { useSetState } from 'ahooks';
import './index.less';
import { CheckOutline, CloseOutline, AaOutline } from 'antd-mobile-icons';
import { Spin, FloatButton } from 'antd';
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
  Button,
  Tabs,
  Empty,
  PullToRefresh,
  FloatingBubble,
  SwipeAction
} from 'antd-mobile/es';
import InfiniteScroll from 'react-infinite-scroll-component';
import bj from '../../../public/assets/已办结.svg'
import zf from '../../../public/assets/已作废.svg'
import zb from '../../../public/assets/zb.png'
import df from '../../../public/assets/df.png'
import * as dd from 'dingtalk-jsapi';
import { BIZSTATUS, DYNAMIC_STATUS, DYNAMIC_TYPE } from  '../../service/constant'
import { parse } from 'query-string';
import {
  PlusOutlined
} from '@ant-design/icons';
function Index({ location, dispatch, limit, dynamicList, loading }) {
  const {
    activeStatusKey,
    allPage,
    currentPage,
    list,
    returnCount,
    listModel


  } = dynamicList;

  const query = parse(history.location.search);
  const [searchWord, setSearchWord] = useState('');
  const [paramsJson, setParamsJson] = useState([]);
  const [screenVisible, setScreenVisible] = useState(false);
  const [valueGroup, setValueGroup] = useState('');
  const [timeFilter, setTimeFilter] = useState('1');
  useEffect(() => {
    window.webUni && window.webUni.postMessage({data: {title: query?.title}});
    setTimeFilter('1')
    setParamsJson([])
    setSearchWord('')
    dispatch({
      type: `dynamicList/getListModelStyleInfo`,
      payload:{
        listModelId: query?.listModelId || 0 ,
        formId: query?.formId,
        menuId: query?.menuId,
        bizSolId: query?.bizSolId
      },
      callback:(listModel)=>{
        getListModelData('', 1, limit,listModel.listModelId,'');
      }
    });
    
  }, []);
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

  function onDelete(l){
    dispatch({
      type: `dynamicList/deleteBizInfo`,
      payload:{
        bizSolId: l.SOL_ID,
        // cutomHeaders,
        bizInfoIds: l.BIZ_ID 
      },
      callback:()=>{
        getListModelData('', 1, limit,listModel.listModelId,activeStatusKey);
      }
    });
    

  }
  //加载更多
  function loadMore() {
    getListModelData(
      searchWord,
      Number(currentPage) + 1,
      limit,
      listModel.listModelId,
      activeStatusKey
    );
  }
  //获取事项列表
  const getListModelData = (
    searchWord,
    start,
    limit,
    listModelId,
    activeStatusKey
  ) => {
    if(start==1){
      document?.getElementById('scrollableDiv')?.scrollTo(0, 0)
    }
    var payload = {
      dataRuleCode: query?.dataRuleCode,
      otherSolIds: query?.otherSolIds,
      bizSolId: query.bizSolId,
      listModelId: listModel?.listModelId ||listModelId,
      formId: query?.formId,
      listId: query?.listId,
      menuId: query?.bizSolId,
      start,
      limit,
      searchWord,
      year: '',
      nodeValue: '',
      seniorSearchInfo: activeStatusKey?JSON.stringify([{"type":"DICTCODE","columnCode":"BIZ_STATUS","value":activeStatusKey}]):'',
      pageSearch: '',
    };
    dispatch({
      type: `dynamicList/getListModelData`,
      payload,
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

  //筛选项点击
  const onNode = (item, type) => {
    if (!item) {
      //重置 初始化查询条件
      setValueGroup('');
      setParamsJson([]);
      getListModelData(searchWord, 1, limit,listModel.listModelId,activeStatusKey);
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
    getListModelData(value, 1, limit,listModel.listModelId,activeStatusKey);
  };




  // //筛选项面板
  // const returnScreen = () => {
  //   return (
  //     <>
  //       <div className={styles.screen_container_list}>
  //         <h1 className={styles.screen_title}> 业务类型</h1>
  //         {bizSolNameList.length != 0 && (
  //           <ul className={styles.screen_list}>
  //             {bizSolNameList.length &&
  //               bizSolNameList?.map((item, index) => (
  //                 <li
  //                   key={item}
  //                   onClick={onNode.bind(this, item, 'name')}
  //                   className={
  //                     styles[
  //                     item == valueGroup
  //                       ? 'screen_item_checked'
  //                       : 'screen_item'
  //                     ]
  //                   }
  //                 >
  //                   {item}
  //                 </li>
  //               ))}
  //           </ul>
  //         )}
  //         <h1 className={styles.screen_title}>时间排序</h1>
  //         <ul className={styles.screen_list}>
  //           {TIMES_FILTER?.map((item, index) => (
  //             <li
  //               key={item.value}
  //               onClick={onNode.bind(this, item, 'time')}
  //               className={
  //                 styles[
  //                 item.value == timeFilter
  //                   ? 'screen_item_checked'
  //                   : 'screen_item'
  //                 ]
  //               }
  //             >
  //               {item.name}
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //       <div className={styles.screen_footer}>
  //         <Button
  //           onClick={() => {
  //             onNode();
  //           }}
  //         >
  //           重置
  //         </Button>
  //         <Button
  //           onClick={() => {
  //             getListModelData(
  //               searchWord,
  //               1,
  //               limit,
  //               paramsJson,
  //               workRuleId,
  //               timeFilter,
  //               () => {
  //                 setScreenVisible(false);
  //               },
  //             );
  //           }}
  //           type="primary"
  //         >
  //           确定
  //         </Button>
  //       </div>
  //     </>
  //   );
  // };

  //跳转至表单详情页
  const toDetail = (obj) => {
    // let detailQuery = {
    //   bizSolId: obj?.SOL_ID,
    //   bizInfoId: obj?.BIZ_ID,
    //   title: obj?.TITLE,
    //   // isTrace: obj.isTrace, //是否跟踪
    //   // workType: type, //工作事项列表类型
    //   id: obj?.MAIN_TABLE_ID,
    //   buttonId: 0,
    //   maxDataruleCode: query.maxDataruleCode,
    //   menuId: query.menuId,
    // };
    let detailQuery = {
      bizSolId: obj?.SOL_ID,
      title: obj?.TITLE,
      buttonId: 0,
      maxDataruleCode: query.maxDataruleCode,
      menuId: query.menuId,
    }
    if(obj.BIZ_ID){
      detailQuery = {
        bizInfoId: obj?.BIZ_ID,
        id: obj?.MAIN_TABLE_ID,
        ...detailQuery,
      }
    }else{
     
    }
    // window.webUni && window.webUni.postMessage({data: {title: '标题X'}});
    // window.webUni && window.webUni.postMessage({data: {title: obj?.TITLE}});
    historyPush({
      pathname: `/mobile/formDetail`,
      query: detailQuery,
    });
  };

  function renderItemInfo(l){
    return <>
      {
        DYNAMIC_TYPE['NORMAL'].map((item)=>{
          let text = l[item.key]
          if(item.key=='time'){
            text = returnTime(l);
          }else if(item.key?.includes('Time')||item.key?.includes('TIME')){
            text = dataFormat(
              l[item.key],
              `YYYY年MM月DD日 HH:mm:ss`,
            )
          }
          if(item.title=='标题'){
            return <h1 className={styles.title}>
                      <span className={styles['title_span']}>{text}</span>
                    </h1>
          }
          return <p className={styles.info}>
                    <i style={{width: 'unset'}}>{item.title}：</i>
                    <b>{text}</b>
                 </p>
        })
      }
    </>
  }
  return (
    <Spin spinning={loading.effects[`dynamicList/getListModelData`]}>
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
      {/* <Popup
        position="right"
        visible={screenVisible}
        bodyStyle={{ width: '90%' }}
        onMaskClick={() => {
          setScreenVisible(false)
        }}
      >
        <div className={styles.screen_container}>{returnScreen()}</div>
      </Popup> */}
      <div className={styles.search_header}>
        <SearchBar
          placeholder="请输入搜索内容(按标题搜索)"
          className={styles.search}
          onSearch={onSearch.bind(this)}
          onClear={onSearch.bind(this, '')}
        />
        {/* <a
          className={styles.screen}
          onClick={() => {
            setScreenVisible(true);
          }}
        >
          筛选
        </a> */}
      </div>
      <Tabs
        className={styles.tabs_list}
        activeKey={activeStatusKey}
        onChange={(key) => {
          dispatch({
            type: 'dynamicList/updateStates',
            payload: {
              activeStatusKey: key,
            },
          });
          getListModelData(searchWord, 1, limit,listModel.listModelId,key);
        }}
        activeLineMode={'fixed'}
      >
        {DYNAMIC_STATUS?.length != 0 &&
          DYNAMIC_STATUS?.map((item) => {
            return <Tabs.Tab title={item.name} key={item.key} />;
          })}
      </Tabs>
      <div
        className={styles.tab_container}
        id="scrollableDiv"
        style={{ height: `calc(100% - 6.86rem)` }}
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
              getListModelData(
                searchWord,
                1,
                limit,
                listModel.listModelId,
                activeStatusKey
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
                        <SwipeAction
                          rightActions={[
                            {
                              key: 'delete',
                              text: '删除',
                              color: 'danger',
                              onClick: onDelete.bind(this,l)
                            },
                          ]}
                        >
                        <div
                          className={styles.tab_list_item_right}
                          onClick={toDetail.bind(this, l)}
                          style={{
                            backgroundImage:
                              l.BIZ_STATUS == '2' 
                                ? `url(${bj})`:
                                l.BIZ_STATUS == '4'?`url(${zf})`:
                                l.BIZ_STATUS == '0'?`url(${df})`:
                                l.BIZ_STATUS == '1'?`url(${zb})`
                                : '',
                          }}
                        >
                          {/* <p className={styles.type}>
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
                          </p> */}
                          {renderItemInfo(l)}
                        </div>
                        </SwipeAction>
                      </div>

                    );
                  })}
              </div>
            </InfiniteScroll>
          </PullToRefresh>

        )}
      </div>
    </div>
    <div className={styles.footer}><Button color={'primary'}  onClick={toDetail.bind(this, {SOL_ID: query.bizSolId,TITLE:'新增'})}>新增</Button></div>
    {/* <FloatingBubble
        magnetic='x'
        style={{
          '--background':'var(--ant-primary-color)',
          '--initial-position-right': '1rem',
          '--initial-position-bottom': '1rem',
          '--height-size': '3rem',
          '--size': '3rem'
        }}
        onClick={toDetail.bind(this, {SOL_ID: query.bizSolId,TITLE:'新增'})}
      >
        <PlusOutlined style={{'fontSize':'1.5rem'}}/>
      </FloatingBubble> */}

    </Spin>
  );
}
export default connect(({ dynamicList, loading }) => {
  return { dynamicList, loading };
})(Index);
