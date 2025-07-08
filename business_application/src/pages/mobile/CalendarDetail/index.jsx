import react,{useState,useCallback,useRef,useEffect } from 'react'
import dayjs from 'dayjs'
import {history,connect,useSearchParams } from 'umi';
import {TextArea,ActionSheet,DatePicker,Toast} from 'antd-mobile/es'
import {dataFormat} from '../../../util/util'
import goNext from '../../../../public/assets/pullDown.svg'
import styles from './index.less'

const CalendarDetail = ({dispatch,mobileCalendarDetail,mobileCalendar})=>{
    const {curUserInfo} = mobileCalendar
    const {calendarTheme,calendarAddress,importValue,calendarDetailData,
        remindTypeTimeValue,remindTypeValue,textAreaValue} = mobileCalendarDetail
    const [visibleImportance,setVisibleImportance] = useState(false)
    const [visibleTimeMsg,setVisibleTimeMsg] = useState(false)
    const [visibleRemindType,setVisibleRemindType] = useState(false)
    const [visibleStartTime,setVisibleStartTime] = useState(false)
    const [visibleEndTime,setVisibleEndTime] = useState(false)
    const [actionType,setActionType] = useState('')
    const [actionImportValue,setActionImportValue] = useState('')
    const [actionMsgTimeValue,setActionMsgTimeValue] = useState('')
    const [actionRemindTypeValue,setActionRemindTypeValue] = useState('无')
    const [timeType,setTimeType] = useState('')
    const [startTime,setStartTime] = useState('')
    const [endTime,setEndTime] = useState('')
    const [searchParams] = useSearchParams()
    const startTimeRef = useRef(0)
    const endTimeRef = useRef(0)
    const textAreaRef = useRef('')
    // 小写 hh是12小时制，大写HH是24小时制
    useEffect(()=>{
        getCurInfo()
        const startTime = searchParams.get('id')?dayjs(searchParams.get('startTime')*1000).format('YYYY/MM/DD HH:mm:ss'):dayjs(searchParams.get('time')).startOf('day').format('YYYY/MM/DD HH:mm:ss')
        const endTime = searchParams.get('id')?dayjs(searchParams.get('endTime')*1000).format('YYYY/MM/DD HH:mm:ss'): dayjs(searchParams.get('time')).endOf('day').format('YYYY/MM/DD HH:mm:ss')
        setStartTime(startTime)
        setEndTime(endTime)
        if(searchParams.get('id')){
            // setEditValue()
            textAreaRef.current = textAreaValue
            getSingleDate()
        }else{
            localStorage.removeItem('calendarTheme')
            localStorage.removeItem('calendarAddress')
            localStorage.removeItem('editAddress')
            localStorage.removeItem('editTheme')
        }
    },[])
    // 编辑获取单个日程
    const getSingleDate = ()=>{
        const address = localStorage.getItem('editAddress')
        const theme =  localStorage.getItem('editTheme')
        dispatch({
            type: 'mobileCalendarDetail/getSchedule',
            payload: {
                scheduleId: searchParams.get('id'),
                address,
                theme
            }
        })
    }
    // 设置编辑值
    // const setEditValue = ()=>{
    //     dispatch({
    //         type: 'mobileCalendarDetail/updateStates',
    //         payload: {
    //             calendarTheme: calendarTheme||searchParams.get('scheduleTitle')
    //         }
    //     })
    // }   

    const getCurInfo = ()=>{
        dispatch({
            type: 'mobileCalendar/getCurrentUserInfo',
        })
    }

    const typeStartValue = ()=>{
        let timeValue = ''
        if(searchParams.get('id')){
            timeValue= new Date(searchParams.get('startTime')*1000)
            // new Date(searchParams.get('endTime')*1000)
        }else{
            timeValue= new Date(dayjs(searchParams.get('time')).startOf('day'))
        }
        // new Date(dayjs(searchParams.get('time')).endOf('day'))
        return timeValue
    }
    const typeEndValue = ()=>{
        let timeValue = ''
        if(searchParams.get('id')){
            timeValue= new Date(searchParams.get('endTime')*1000)
        }else{
            timeValue= new Date(dayjs(searchParams.get('time')).endOf('day'))
        }
        return timeValue
    }
      
    // 去主题会议室填写等
    const selectType = (type)=>{
        const theme =  localStorage.getItem('calendarTheme')
        const address = localStorage.getItem('calendarAddress')
        historyPush({
            pathname: '/mobile/CalendarInput',
            query: {
               type,
               id: searchParams.get('id')||'',
               theme:searchParams.get('id')? theme||calendarTheme:calendarTheme,
               address:searchParams.get('id')? address||calendarAddress:calendarAddress,
            }
        })
    }
    // 关闭
    const visibleClose = (type)=>{
        if(type == 'import'){
            setVisibleImportance(false)
        }
        if(type == 'msgTime'){
            setVisibleTimeMsg(false)
        }
        if(type == 'remindType'){
            setVisibleRemindType(false)
        }
    }
    // 选择重要性
    const selectAction = (type)=>{
        setActionType(type)
        if(type == 'import'){
            setVisibleImportance(true)
        }
        if(type == 'msgTime'){
            setVisibleTimeMsg(true)
        }
        if(type == 'remindType'){
            setVisibleRemindType(true)
        }
    }
    // onAction
    const onActionSheet = (action)=>{
        if(actionType=='import'){
            setActionImportValue(action)
            dispatch({
                type: 'mobileCalendarDetail/updateStates',
                payload: {
                    importValue: action
                }
            })
        }
        if(actionType == 'msgTime'){
            setActionMsgTimeValue(action)
            dispatch({
                type: 'mobileCalendarDetail/updateStates',
                payload: {
                    remindTypeTimeValue: action
                }
            })
        } 
        if(actionType == 'remindType'){
            setActionRemindTypeValue(action)
            dispatch({
                type: 'mobileCalendarDetail/updateStates',
                payload: {
                    remindTypeValue: action
                }
            })
        }
        
    }

    // 重要性
    const actionsImportConfig = [
        {
            text: '高', key: 'SCHEDULE__HIGH'
        },
        {
            text: '中', key: 'SCHEDULE__MIDDLE',
        },
        {
            text: '低', key: 'SCHEDULE__LOW'
        }
    ]
    // 提醒时间
    const actionsMsgTimeConfig = [
        {
            text: '提前30分钟', key: 'SCHEDULE__HALF__HOUR'
        },
        {
            text: '提前1小时', key: 'SCHEDULE__HOUR'
        },
        {
            text: '提前2小时', key: 'SCHEDULE__TWO__HOUR'
        }
    ]
    // 提醒方式
    const actionsRemindTypeConfig = [
        {
            text: '无', key: 'SCHEDULE__NO'
        },
        {
            text: '系统消息', key: 'SCHEDULE__SYS'
        },
        {
            text: '短信', key: 'SCHEDULE__MSG'
        },
        {
            text: '邮件',key: 'SCHEDULE__EMAIL'
        },
        {
            text: '微信', key: 'SCHEDULE__WCHAT'
        }
    ]

    const labelRenderer = useCallback((type, data) => {
        switch (type) {
          case 'year':
            return data
          case 'month':
            return data + '月'
          case 'day':
            return data + '日'
          case 'hour':
            return data + '时'
          case 'minute':
            return data + '分'
          case 'second':
            return data + '秒'
          default:
            return data
        }
      }, [])
      // 更改时间
      const onClickChangeTime = (type)=>{
        setTimeType(type)
        if(type == 'start'){
            setVisibleStartTime(true)
        }
        if(type == 'end'){
            setVisibleEndTime(true)
        }
      }

    // 所有actionSheet共用
    const actionSheetType = (visible,actionConfig,type,cancelText='')=>{
        return (
            <ActionSheet
            cancelText={cancelText}
            visible={visible}
            actions={actionConfig}
            onClose={() => visibleClose(type)}
            onAction={action=>onActionSheet(action)}
            closeOnAction={true}
            getContainer={() =>{
                return document.getElementById('calendar_detail')||false;s
            }}
            />
        )
    }
    // 关闭时间
    const onTimeClose = (type)=>{
        if(type == 'start'){
            setVisibleStartTime(false)
        }
        if(type == 'end'){
            setVisibleEndTime(false)
        }
    }
    // 确认选中picker
    const confirmPicker = (val)=>{
        const date = new Date(val)
        const timeStamp = date.getTime()

        const time = dataFormat(timeStamp/1000,'YYYY/MM/DD HH:mm:ss')
        if(timeType == 'start'){
            // startTimeRef.current = val
            // if(startTimeRef.current){
            //     const start = timeChange(startTimeRef.current)
            //     const end = timeChange(endTimeRef.current)
            //     if(searchParams.get('id')){
            //         console.log("timeType9988",timeType,start.timeStamp/1000,"eeeee",searchParams.get('endTime'))
            //         if((start.timeStamp/1000)>=Number(searchParams.get('endTime'))){
            //             Toast.show({
            //                 content: '开始时间不能超过结束时间',
            //                 maskClickable: false,
            //             })
            //             return false
            //         }
            //     }else{
            //         if(end.timeStamp&&start.timeStamp>=end.timeStamp){
            //             Toast.show({
            //                 content: '开始时间不能超过结束时间',
            //                 maskClickable: false,
            //             })
            //             return false
            //         }
            //     }
            // }
            setStartTime(time)
        }
        if(timeType == 'end'){
            // endTimeRef.current = val
            // const start = timeChange(startTimeRef.current)
            // const end = timeChange(endTimeRef.current)
            // if(searchParams.get('id')){
            //     console.log(1111,start.timeStamp/1000,searchParams.get('endTime'))
            //     // if(start.timeStamp>=end.timeStamp||(start.timeStamp/1000)>=Number(searchParams.get('endTime'))){
            //     //     Toast.show({
            //     //         content: '开始时间不能超过结束时间',
            //     //         maskClickable: false,
            //     //     })
            //     //     return false
            //     // }
            // }else{
            //     if(start.timeStamp&&start.timeStamp>=end.timeStamp){
            //         Toast.show({
            //             content: '开始时间不能超过结束时间',
            //             maskClickable: false,
            //         })
            //         return false
            //     }
            // }
            
            setEndTime(time)
        }
    }
    const timeChange = (time)=>{
        const date = new Date(time)
        const timeStamp = date.getTime()
        return {
            timeStamp
        }   
    }
    // textArea
    const onChangeTextArea = (val)=>{
        textAreaRef.current = val
        dispatch({
            type: 'mobileCalendarDetail/updateStates',
            payload: {
                textAreaValue: val
            }
        })
    }


    // 所有datePicker共用
    const datePickerAction = (visible,type,value)=>{
        // console.log("valuepicker",value)
        // value={value}
        // min={new Date(dayjs().startOf('day'))}
        return (
            <DatePicker defaultValue={value}  visible={visible}  getContainer={ ()=> document.getElementById('calendar_detail')||false} onConfirm={val=>confirmPicker(val)}  onClose={()=>onTimeClose(type)} precision='second'  renderLabel={labelRenderer} ></DatePicker>
        )
    }
    // 选择相关人
    const relationUser = ()=>{
        // 
       const obj = JSON.parse(localStorage.getItem('relation'))||''
        historyPush({
            pathname: '/mobile/UserChoice',
            query: {
                checkUserId:searchParams.get('id')? obj.relationId||calendarDetailData.relUser: obj?obj.relationId:'',
                checkUserName: searchParams.get('id')? obj.relationName||calendarDetailData.relUserName:obj? obj.relationName:''
            }
        })
    }
    const objJson = JSON.parse(localStorage.getItem('relation'))||''
    // 保存
    const onSave = ()=>{

        const theme =  localStorage.getItem('calendarTheme')
        const address = localStorage.getItem('calendarAddress')
         
        if(searchParams.get('id')){
            if(!theme&&!calendarTheme){
                Toast.show({
                    content: '主题不能为空',
                    maskClickable: false,
                })
                return false
            }
        }else{
            if(!calendarTheme){
                Toast.show({
                    content: '主题不能为空',
                    maskClickable: false,
                })
                return false
            }
        }
        
        if(timeChange(startTime).timeStamp>=timeChange(endTime).timeStamp){
            Toast.show({
                content: '开始时间不能超过结束时间',
                maskClickable: false,
            })
            return false
        }
        if(textAreaRef.current.length>500){
            Toast.show({
                content: '日程详情最大输入500字',
                maskClickable: false
            })
            return false
        }
        if(searchParams.get('id')){
            dispatch({
                type: 'mobileCalendarDetail/changeSchedule',
                payload: {
                    id: searchParams.get('id'),
                    relUser: objJson.relationId||calendarDetailData.relUser,
                    relUserName: objJson.relationName|| calendarDetailData.relUserName,
                    scheduleTitle:theme||calendarTheme,
                    schedulePlace:address||calendarAddress,
                    importance: importValue? importValue.key:'',
                    remindType: remindTypeValue.key||'SCHEDULE__NO',
                    remindTimeType: remindTypeTimeValue?remindTypeTimeValue.key:'',
                    scheduleContent: textAreaRef.current,
                    startTime: timeChange(startTime).timeStamp/1000,
                    endTime: timeChange(endTime).timeStamp/1000
                },
                callback: ()=>{
                    history.go(-1)
                }
            })
   
        }else{
            dispatch({
                type: 'mobileCalendarDetail/addSchedule',   
                payload: {
                    relUser: objJson.relationId||curUserInfo&&curUserInfo.identityId,
                    relUserName: objJson.relationName||curUserInfo&&curUserInfo.userName,
                    scheduleTitle: calendarTheme,
                    schedulePlace: calendarAddress,
                    importance: importValue? importValue.key:'',
                    remindType: remindTypeValue.key||'SCHEDULE__NO',
                    remindTimeType: remindTypeTimeValue?remindTypeTimeValue.key:'',
                    scheduleContent: textAreaRef.current,
                    startTime: timeChange(startTime).timeStamp/1000,
                    endTime: timeChange(endTime).timeStamp/1000
                },
                callback:()=>{
                    history.go(-1);
                }
            })
        }   
    }
    // console.log("calendarAddress111",textAreaValue)
    const theme =  localStorage.getItem('calendarTheme')
    const address = localStorage.getItem('calendarAddress')
    return (
        <div className={styles.calendar_detail} id="calendar_detail">
          <div className={styles.detail}>
            <div className={styles.theme} onClick={()=>selectType('theme')}>
               <div className={styles.theme_name}>
                <span>主题</span><span className={styles.validate}>*</span>
               </div>
               <div className={styles.theme_input}>
                <span className={styles.name}>{searchParams.get('id')?theme||calendarTheme&&calendarTheme:calendarTheme&&calendarTheme}</span><span className={styles.select}>
                <img src={goNext} />
                </span>
               </div>
            </div>
            <div className={styles.relation_user} onClick={()=>relationUser()}>
                <div className={styles.relation_name}>
                    <span>相关人</span>
                    <span className={styles.validate}>*</span>
                </div>
                <div className={styles.user_select}>
                    <span className={styles.name}>{searchParams.get('id')?objJson&&objJson.relationName||calendarDetailData.relUserName:objJson&&objJson.relationName||curUserInfo&&curUserInfo.userName}</span><span className={styles.select}>
                    <img src={goNext} />
                    </span>
                </div>
            </div> 
            <div className={styles.address} onClick={()=>selectType('address')}>
                <div className={styles.address_name}>
                    地点
                </div>
                <div className={styles.address_select} >
                    <span className={styles.name}>{searchParams.get('id')?address||calendarAddress:calendarAddress&&calendarAddress}</span><span className={styles.select}>
                    <img src={goNext} />
                    </span>
                </div>
            </div>
            <div className={styles.importance}  onClick={()=>selectAction('import')}>
                <div>重要性</div>
                <div className={styles.importance_select}>
                    <span className={styles.name}>{importValue&&importValue.text}</span><span className={styles.select}>
                    <img src={goNext} />
                    </span>
                </div>
            </div>
            <div className={styles.starTime} onClick={()=>onClickChangeTime('start')}>
                <div className={styles.starTime_name}>
                    <span>开始时间</span>
                    <span className={styles.validate}>*</span>
                </div>
                <div className={styles.time_select}>
                    <span>{startTime}</span>
                    <span className={styles.select}>
                        <img src={goNext} />
                    </span>
                </div>
            </div>
            <div className={styles.endTime} onClick={()=>onClickChangeTime('end')}>
                <div className={styles.end_name}>
                    <span>结束时间</span>
                    <span className={styles.validate}>*</span>
                </div>
                <div className={styles.time_select}>
                    <span>{endTime}</span>
                    <span className={styles.select}>
                        <img src={goNext} />
                    </span>
                </div>
            </div>
            <div className={styles.message_type} onClick={()=>selectAction('remindType')}>
                <div>提醒方式</div>
                <div className={styles.message_select}>
                    <span>{remindTypeValue.text||'无'}</span>
                    <span className={styles.select}>
                        <img src={goNext} />
                    </span>
                </div>
            </div>
            <div className={styles.message_time} onClick={()=>selectAction('msgTime')}>
                <div>提醒时间</div>
                <div className={styles.time_select}>
                    <span>{remindTypeTimeValue&&remindTypeTimeValue.text}</span> 
                    <span className={styles.select}>
                    <img src={goNext} />
                    </span>
                </div>
            </div>
            <div className={styles.scheduler_detail}>  
                <div>日程详情</div>
                <div className={styles.text_input}>
                    <TextArea 
                        placeholder='请输入内容'
                        value={textAreaValue}
                        onChange={val=>onChangeTextArea(val)}
                        rows={4}></TextArea>
                </div>    
            </div>
          </div>
          {
            actionSheetType(visibleImportance,actionsImportConfig,'import','取消')
          }
          {
            actionSheetType(visibleTimeMsg,actionsMsgTimeConfig,'msgTime','取消')
          }
          {
            actionSheetType(visibleRemindType,actionsRemindTypeConfig,'remindType','取消')
          }
          {
            datePickerAction(visibleStartTime,'start',typeStartValue())
          }
          {
            datePickerAction(visibleEndTime,'end',typeEndValue())
          }
          <div className={styles.save} onClick={onSave}>保存</div>
        </div>
    )
}

export default connect(({mobileCalendarDetail,mobileCalendar})=>({mobileCalendarDetail,mobileCalendar}))(CalendarDetail)