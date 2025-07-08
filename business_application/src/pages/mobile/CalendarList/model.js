import { Toast  } from 'antd-mobile/es';
import dayjs from 'dayjs'
import apis from 'api';
const {getSchedules,getCurrentUserInfo} = apis

export default { 
    namespace: 'mobileCalendar',
    state: {
        schedulesList:[], 
        currentList: [], //选中日程列表
        currentPage: 1,
        returnCount: 0,
        curUserInfo: {},
        currentDate: ''
    },
    effects: {
      // 获取用户信息
      *getCurrentUserInfo({ payload, callback }, { call, put, select }){
        const {data} = yield call(getCurrentUserInfo,payload,'','mobileCalendar')
        yield put({
          type: 'updateStates',
          payload: {
            curUserInfo: data.data,
          },
        });
      },
      // 查询当天的日期列表内容
      *changeCurrentDay({ payload }, { call, put, select }) {
        const currentDate = payload.currentDate;
        const { schedulesList } = yield select(
          (state) => state.mobileCalendar,
        );
        const [startTime, endTime] = getDayStartDateAndingRange(currentDate);
        const currentDayList = [];
        schedulesList.forEach((element) => {
          if (
            (element.startTime >= startTime && element.startTime <= endTime) ||
            (element.endTime >= startTime && element.endTime <= endTime) ||
            (element.startTime <= startTime && element.endTime >= endTime)
          ) {
            currentDayList.push(element);
          }
        });
        // console.log("currentDate11",currentDate,"current",startTime,"timee",endTime,"currentDayList",currentDayList,schedulesList)
        yield put({
          type: 'updateStates',
          payload: {
            currentList: currentDayList
          }
        })
      },
      // 获取日历列表
      *getSchedules({ payload, callback }, { call, put, select }){
        const curDate = new Date(payload.currentDate)
        const showType = payload.showType
        delete payload.showType
        delete payload.currentDate
        const [curStartTime, curEndTime] = showType =='week'?getWeekStartDateAndingRange(curDate):getMonthStartDateAndDateRange(curDate)
        payload.startTime = curStartTime;
        payload.endTime = curEndTime;
        const {data} = yield call(getSchedules,payload,'','mobileCalendar')
        const {schedulesList} = yield select(state=>state.mobileCalendar)
        if(data.code == 200){
          yield put({
            type: 'updateStates',
            payload:{ 
              currentPage: data.data.currentPage,
              schedulesList: payload.start>1?schedulesList.concat(data.data.list):data.data.list,
              returnCount: data.data.returnCount,
            }
          })
          yield put({
            type: 'changeCurrentDay',
            payload: {
              currentDate: curDate,
            },
          });

        }else if (data.code != 401 && data.code != 419 && data.code != 403) {
            data.msg&&Toast.show({
                content: data.msg
            });
        }
      }
    },
    reducers: {
        updateStates(state, action) {
          return {
            ...state,
            ...action.payload,
          };
        },
      }

}
//获取当天日期
function getDayStartDateAndingRange(currentDay) {
  // let startDate = new Date(currentDay.toLocaleDateString());
  // let oneDayLong = 24 * 60 * 60 * 1000;
  // let startTime = startDate.getTime();
  // let endTime = startDate.getTime() + oneDayLong;
  const startDate = dayjs(currentDay).startOf('day')
  const endDate = dayjs(currentDay).endOf('day');
  const startTime = new Date(startDate).getTime()
  const endTime = new Date(endDate).getTime()
  let weekRange = [parseInt(startTime / 1000), parseInt(endTime / 1000)];
  return weekRange;
}

/**
 * 获得本周的开始日期和结束日期
 */
function getWeekStartDateAndingRange(now) {
  const startTime = dayjs(now).startOf('week')
  const endTime = dayjs(now).endOf('week')
  let weekRange = [parseInt(startTime / 1000), parseInt(endTime / 1000)];
  return weekRange;
}

/**
 *获得本月的开始日期和结束日期
 */
function getMonthStartDateAndDateRange(now) {
  const start = dayjs(now).startOf('month')
  const end = dayjs(now).endOf('month')
  const monthStartTime = new Date(start).getTime()
  const monthEndTime = new Date(end).getTime()
  
  let monthRange = [
    parseInt(monthStartTime / 1000),
    parseInt(monthEndTime / 1000),
  ];
  return monthRange;
}