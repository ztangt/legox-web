import { useEffect, useState, useMemo } from 'react';
import {history,connect } from 'umi';
import {PullToRefresh,Empty} from 'antd-mobile/es'
import InfiniteScroll from 'react-infinite-scroll-component';
import Header from './components/Header'
import throttle from 'lodash/throttle' // 只引入需要的工具函数 ==> 打包文件变小了
import {timeStamp} from '../../../util/util'
import isCollect from '../../../../public/assets/isCollect.svg'
import noCollect from '../../../../public/assets/noCollect.svg'
import styles from './index.less'

// 通知公告
const Announcement = ({dispatch,announcementSpace})=>{
    let {currentPage,returnCount,searchValue,announceList,activeClassify,activeTime} = announcementSpace
    // const [announceList,setAnnounceList] = useState([])
    
    useEffect(()=>{
        getAnnounceList('',1)
    },[])

    // 获取通知公告列表
    const getAnnounceList = (noticeName='',curPage,isReset=false)=>{
        if(activeClassify==4&&!isReset){
            dispatch({
                type: 'announcementSpace/getNoticeCollectList',
                payload:{
                    start: curPage||1,
                    limit: 10,
                    noticeName: noticeName,
                    sortType: activeTime, 
                    startTime: '',
                    endTime: '',
                    isView: ''
                }
            })
        }
        
       if(activeClassify!=4||isReset==true) {
            const activeClass = {
                2: '0',
                3: '1'
            }
            dispatch({
                type: 'announcementSpace/getNoticeViewList',
                payload: {
                    start: curPage||1,
                    limit: 10,
                    noticeName: noticeName, 
                    sortType: isReset?1:activeTime,
                    startTime: '',
                    endTime: '',
                    isView: isReset?'':activeClass[activeClassify]||''
                },
            })
        }
    }

    const loadMore=()=> {
        getAnnounceList(searchValue,Number(currentPage)+1)
    }



    // 进详情页面
    const goDetail = (item)=>{
        // 是否已读
        dispatch({
            type: 'announcementSpace/addViewsNotice',
            payload: {
                noticeId: item.id
            },
            callback:()=>{
                historyPush({
                    pathname: '/mobile/AnnounceDetail',
                    query: {
                        id: item.id
                    }
                })
            }
        })
    }
    // 收藏
    const collectItem = (e,item)=>{
        e.stopPropagation();
        if(item.collectState!=1){
            dispatch({
                type: 'announcementSpace/putNoticeCollect',
                payload:{
                    noticeIds: item.id
                },
                callback:()=>{
                    getAnnounceList(searchValue,1)
                }
            })
        }else{
            dispatch({
                type: 'announcementSpace/delNoticeCollect',
                payload: {
                    noticeIds: item.id
                },
                callback:()=>{
                    getAnnounceList(searchValue,1)
                }
            })
        }
        
    }


    const statusMap = {
        0: '未读',
        1: '已读'
    }
    

    return (
        <div className={styles.announcement_box}>
            <Header getAnnounceList={getAnnounceList}></Header>
            {
                announceList.length==0?<Empty
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}
                imageStyle={{ width: 128 }}
                description="暂无数据"
          />: 
          <div className={styles.announce_pull} id="pullToRefresh">
          <PullToRefresh
           onRefresh={() => {
              getAnnounceList(searchValue,1)
            }}   
           >
              <InfiniteScroll  
                  dataLength={announceList.length}
                  hasMore={announceList?.length < returnCount}
                  next={loadMore}
                  endMessage={
                      announceList?.length == 0 ? (
                        ''
                      ) : (
                        <span className="footer_more">没有更多啦</span>
                      )
                    }
                  //   loader={<Spin className="spin_div" />}
                    scrollableTarget="pullToRefresh"
                  >
                  <div className={styles.announcement_list}>
                      <div className={styles.announcement_item}>
                          {
                              announceList.map(item=>(
                                  <div key={item.id}className={styles.item_card} onClick={()=>goDetail(item)}> 
                                      <div className={styles.title}>
                                          <p className={styles.theme}>{item.noticeTypeName}</p> {<span className={item.viewState==1?styles.alRead:styles.noRead}>{statusMap[item.viewState]}</span>}
                                      </div>
                                      <div className={styles.content}>
                                          {item.noticeTitle}
                                      </div>
                                      <div className={styles.time}>
                                         <span>发布时间：</span> {timeStamp(item.createTime*1000)}
                                      </div>
                                      <div className={styles.publish_person}>发布人：<span>{item.releaseUserName}</span></div>
                                      <div className={styles.is_collect} onClick={e=>collectItem(e,item)}>
                                          {item.collectState==1?<img src={isCollect} />:<img src={noCollect} />}
                                      </div>
                                  </div>
                              ))
                          }
                      </div>
                  </div>
              </InfiniteScroll>
          </PullToRefresh>
          </div>
            }
            
           
        </div>
    )
}


export default connect(({announcementSpace})=>({announcementSpace}))(Announcement)