import react,{useRef,useEffect} from 'react'
import {history,connect,useSearchParams  } from 'umi';
import {Input,Button} from 'antd-mobile'
import styles from './index.less'

const CalendarTheme = ({dispatch,mobileCalendarDetail})=>{
    const {importValue,remindTypeTimeValue,remindTypeValue,textAreaValue} = mobileCalendarDetail
    const [searchParams] = useSearchParams();
    const calendarThemeRef = useRef('')
    const calendarAddressRef = useRef('')
    
    useEffect(()=>{
        if(searchParams.get('id')){
            if(searchParams.get('type') == 'theme'){
                calendarThemeRef.current = searchParams.get('theme')
            }
            if(searchParams.get('type') == 'address'){
                calendarAddressRef.current = searchParams.get('address') 
            }
        } 
    },[])

    // 输入内容
    const calendarInput = (value)=>{
        if(searchParams.get('type') == 'theme'){
            calendarThemeRef.current = value
        }
        if(searchParams.get('type') == 'address'){
            calendarAddressRef.current = value 
        }
    }

    // back
    const onSave = ()=>{
        if(searchParams.get('type') == 'theme'){
            // localStorage.setItem('calendarTheme',calendarThemeRef.current||'')
            dispatch({
                type: 'mobileCalendarDetail/updateStates',
                payload: {
                    calendarTheme: calendarThemeRef.current||'',
                    importValue: importValue,
                    remindTypeTimeValue,
                    remindTypeValue,
                    textAreaValue
                }
            })
            if(searchParams.get('id')){
                localStorage.setItem('calendarTheme',calendarThemeRef.current||'')
                localStorage.setItem('editTheme','theme')
            }
        }
        if(searchParams.get('type') == 'address'){
            // localStorage.setItem('calendarAddress',calendarAddressRef.current||'')
            dispatch({
                type: 'mobileCalendarDetail/updateStates',
                payload: {
                    calendarAddress: calendarAddressRef.current||'',
                    importValue: importValue,
                    remindTypeTimeValue,
                    remindTypeValue,
                    textAreaValue
                }
            })
            if(searchParams.get('id')){
                localStorage.setItem('calendarAddress',calendarAddressRef.current||'')
                localStorage.setItem('editAddress','address')
            }
        }
        history.go(-1)
    }
    // console.log("calendarThemeRef.current",calendarThemeRef.current)
    return (
        <div className={styles.theme}>
            <Input placeholder='请输入内容'defaultValue={searchParams.get('type')=='theme'?searchParams.get('theme'):searchParams.get('address')} onChange={calendarInput} clearable />
            <Button Button block color='primary' size='large' className={styles.save} onClick={()=>onSave()}>保存</Button>
        </div>
    )
}

export default connect(({mobileCalendarDetail})=>({mobileCalendarDetail}))(CalendarTheme)