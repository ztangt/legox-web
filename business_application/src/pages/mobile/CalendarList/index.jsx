import react,{useRef,useEffect,useState} from 'react'
import {history,connect } from 'umi';
import {PullToRefresh,Empty} from 'antd-mobile/es'
import dayjs from 'dayjs'
import { Calendar } from 'react-calendar-h5'
import InfiniteScroll from 'react-infinite-scroll-component';
import { dataFormat } from '../../../util/util';
import styles from './index.less'

const CalendarList = ({dispatch,mobileCalendar})=>{
    const calendarRef = useRef(null)
    const calendarAllMonthRef = useRef('')
    const {currentList,currentPage,returnCount,curUserInfo} = mobileCalendar
    const [currentDate,setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'))
    const [selectDate,setSelectDate] = useState('')
    const [showType,setShowType] = useState('week') // 默认日期
    useEffect(()=>{
        getScheduleList(currentDate,showType,1)
        getCurrentInfo()
        localStorage.removeItem('calendarTheme')
        localStorage.removeItem('calendarAddress')
        localStorage.removeItem('editAddress')
        localStorage.removeItem('editTheme')
    },[])
    // 获取用户信息
    const getCurrentInfo = ()=>{
        dispatch({
            type: 'mobileCalendar/getCurrentUserInfo'
        })
    }
    // 获得日程列表
    const getScheduleList = (currentDate,showType,curPage)=>{
        dispatch({
            type: 'mobileCalendar/getSchedules',
            payload: {
                start: curPage||1,
                limit: 15,
                currentDate,
                showType
            }
        })
    }

    const configLevelType = {
        SCHEDULE__HIGH: '高',
        SCHEDULE__MIDDLE: '中',
        SCHEDULE__LOW: '低'
    }
    const configCreatorType = {
        SELF_TO_OTHER: '代他人创建',
        OTHER_TO_SELF: '他人代建',
        SELF: '本人创建'
    }
    // 加载更多
    const loadMore = ()=>{
        getScheduleList(currentDate,showType,Number(currentPage)+1)
    }

    // 日程跳转详情
    const goDetail = (item)=>{
       
        historyPush({
            pathname: '/mobile/CalendarDetail',
            query: {
                id: item.id,
                startTime: item.startTime,
                endTime: item.endTime,
            }
        })
    }
    
    // 获取选中当日日期
    const getSelectCurrentDay = (date)=>{
        setSelectDate(date)
        dispatch({
            type: 'mobileCalendar/changeCurrentDay',
            payload: {
                currentDate: new Date(date.currentDate)
            }
        })
    }
    // toggle类型
    const onToggleType = (type)=>{
        setShowType(type.showType)
        getScheduleList(currentDate,type.showType,1)
    }
    // 新建日程
    const onAdd = ()=>{
        dispatch({
            type: 'mobileCalendarDetail/updateStates',
            payload: {
                importValue: '',
                remindTypeTimeValue: '',
                remindTypeValue: '无',
                textAreaValue: '',
                calendarTheme: '',
                calendarAddress: '',
            }
        })
        localStorage.removeItem('relation');
        historyPush({
            pathname: '/mobile/CalendarDetail',
            query:{
                userName: curUserInfo&&curUserInfo.userName,
                time: calendarAllMonthRef.current||selectDate.currentDate
            }
        })
    }

    
    // console.log("calendarRef889",calendarRef)
    return (
        <div className={styles.calendar}>
            <div className={styles.calendar_picker}>
                <Calendar 
                    onDateClick={date => {
                        setCurrentDate(date.format('YYYY-MM-DD') )
                        
                    }}
                    onCurrent = {date=>{
                        getScheduleList(date,showType,1)
                    }}
                    onHandlerAllMonth = {date=>{
                        const handlerDate= date.format('YYYY/MM/DD')
                        calendarAllMonthRef.current = handlerDate
                        setTimeout(()=>{
                            setShowType(calendarRef.current.state.showType)
                            getScheduleList(date,calendarRef.current.state.showType,1)
                        },60)  
                    }}
                    showType={'week'}
                    ref={calendarRef}
                    markDates={[
                      { date: dayjs().format('YYYY-MM-DD'), markType: 'circle' },
                    //   { markType: 'dot', date: '2024-4-23' },
                    //   { markType: 'circle', date: '2024-4-22' },
                    //   { date: '2021-1-22' },
                    ]}
                    getCurrentDayFn = {
                        getSelectCurrentDay
                    }
                    onAdd = {onAdd}
                    onToggleShowType={onToggleType}
                    currentDate={currentDate}
                    onTouchEnd={(date) => {
                        getScheduleList(date,showType,1)
                    }}
                    disableWeekView={false}
                >
                </Calendar>
            </div>
            {
               currentList.length==0? <Empty
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
          <div className={styles.calendar_list} id="pullToRefresh" style={showType=='month'?{height:`calc(100% - 400px)`}:{}}>
                <PullToRefresh
                    onRefresh={() => {
                        getScheduleList(currentDate,showType,1)
                    }}>
                    <InfiniteScroll  
                        dataLength={currentList.length}
                        hasMore={currentList?.length < returnCount}
                        next={loadMore}
                        endMessage={
                            currentList?.length == 0 ? (
                            ''
                            ) : (
                            <span className="footer_more">没有更多啦</span>
                            )
                        }
                        //   loader={<Spin className="spin_div" />}
                        scrollableTarget="pullToRefresh"
                        >
                        {
                            currentList.map(item=>(
                                <div className={styles.calendar_item} key={item.id} onClick={()=>goDetail(item)}>
                                    <div className={styles.title}>{item.scheduleTitle}</div>
                                    <div className={styles.sign}>
                                    {item.importance&&<span className={styles.level}>{configLevelType[item.importance]}</span>}
                                    {item.scheduleType&&<span className={styles[`type_${item.scheduleType}`]}>{configCreatorType[item.scheduleType]}</span>}
                                    </div>
                                    <div className={styles.startTime}>
                                        开始时间: <span>{dataFormat(item.startTime,'YYYY-MM-DD HH:mm:ss')}</span>
                                    </div>
                                    <div className={styles.endTime}>
                                    结束时间: <span>{dataFormat(item.endTime,'YYYY-MM-DD HH:mm:ss')}</span> 
                                    </div>   
                                    <div className={styles.address}>
                                        地点: <span>{item.schedulePlace}</span>
                                    </div>
                                    <div className={styles.creator}>
                                    创建人: <span>{item.createUserName}</span>     
                                    </div>
                                    <div className={styles.relation}>
                                        相关人: <span>{item.relUserName}</span>
                                    </div>  
                                </div>
                            ))
                        }
                    </InfiniteScroll>
                </PullToRefresh>
            </div>
            }
            
        </div>
    )
}


export default connect(({mobileCalendar,mobileCalendarDetail})=>({mobileCalendar,mobileCalendarDetail}))(CalendarList)