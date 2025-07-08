import apis from '@/service'
import { useSetState } from 'ahooks'
import { message } from 'antd'

interface State {
  loading?: any
  currentDate?: Date
  todayDate: Date
  holidaysList: Array<any>
  calendarList: Array<any>
  currentView: String
  currentDayList: Array<any>
}
export default () => {
  const [state, setState] = useSetState<State>({
    loading: false,
    currentDate: new Date(),
    todayDate: new Date(),
    holidaysList: [],
    calendarList: [],
    currentView: 'month',
    currentDayList: [],
  })
  //获取节假日
  const getHolidays = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getHolidays(payload, () => {
      getHolidays(payload)
    })
    if (data.code == 200) {
      setState({
        holidaysList: data.data.list,
        loading: false,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }
  //查询日程
  const getSchedules = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getSchedules(payload, () => {
      getSchedules(payload)
    })
    if (data.code == 200) {
      const calendarList = data.data.list
      calendarList.forEach((element) => {
        element.title = element.scheduleTitle
        element.start = new Date(element.startTime * 1000)
        element.end = new Date(element.endTime * 1000)
      })
      setState({
        calendarList,
        loading: false,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  return {
    ...state,
    setState,
    getHolidays,
    getSchedules,
  }
}
