import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../../../service/constant';

export default {
  namespace: 'columnCalendar',
  state: {
    currentDate: new Date(),
    todayDate: new Date(),
    holidaysList: [],
    calendarList: [],
    currentView: 'month',
    currentDayList: [],
    oneDayList: [],
    selectData: null,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
      });
    },
  },
  effects: {
    *getOneSchedule({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getSchedules, payload, '', 'columnCalendar');
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              selectData: payload.startTime,
              oneDayList: data.data.list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getHolidays({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getHolidays, payload, '', 'columnCalendar');
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              holidaysList: data.data.list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //切换当然日期
    *changeCurrentDay({ payload }, { call, put, select }) {
      const currentDate = payload.currentDate;
      const { calendarList, todayDate } = yield select(
        (state) => state.columnCalendar,
      );
      const [startTime, endTime] = getDayStartDateAndingRange(todayDate);
      const currentDayList = [];
      calendarList.forEach((element) => {
        if (
          (element.startTime >= startTime && element.startTime <= endTime) ||
          (element.endTime >= startTime && element.endTime <= endTime) ||
          (element.startTime <= startTime && element.endTime >= endTime)
        ) {
          currentDayList.push(element);
        }
      });
      yield put({
        type: 'updateStates',
        payload: {
          currentDayList,
          currentDate,
        },
      });
    },
    //根据currentDate时间获取数据
    *getSchedulesByDate({ payload }, { call, put, select }) {
      let currentDay = new Date(payload.currentDate.toLocaleDateString());
      const { startTime, endTime } = yield select(
        (state) => state.columnCalendar,
      );
      const [curStartTime, curEndTime] = getMonthStartDateAndDateRange(currentDay)
      yield put({
        type: 'updateStates',
        payload: {
          startTime: curStartTime,
          endTime: curEndTime,
          currentDate: currentDay,
        },
      });
      yield put({
        type: 'changeCurrentDay',
        payload: {
          currentDate: currentDay,
        },
      });
      //如果开始时间和结束时间在当前开始时间和结束时间内 直接返回不请求
      if (
        !payload.needUpdate &&
        startTime != 0 &&
        curStartTime >= startTime &&
        curEndTime <= endTime
      ) {
        return;
      }

      payload.startTime = curStartTime;
      payload.endTime = curEndTime;
      payload.limit = 1000;
      payload.start = 1;
      try {
        const { data } = yield call(apis.getSchedules, payload, 'getSchedulesByDate', 'columnCalendar');
        if (data.code == REQUEST_SUCCESS) {
          var calendarList = data.data.list;
          calendarList.forEach((element) => {
            element.title = element.scheduleTitle;
            element.start = new Date(element.startTime * 1000);
            element.end = new Date(element.endTime * 1000);
          });
          yield put({
            type: 'updateStates',
            payload: {
              calendarList,
            },
          });
          yield put({
            type: 'changeCurrentDay',
            payload: {
              currentDate: currentDay,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
  },
  reducers: {
    updateStates(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

function getDayStartDateAndingRange(currentDay) {
  let startDate = new Date(currentDay.toLocaleDateString());
  let oneDayLong = 24 * 60 * 60 * 1000;
  let startTime = startDate.getTime();
  let endTime = startDate.getTime() + oneDayLong;
  let weekRange = [parseInt(startTime / 1000), parseInt(endTime / 1000) - 1];
  return weekRange;
}

/**
 * 获得本周的开始日期和结束日期
 */
function getWeekStartDateAndingRange(now) {
  var curTime = new Date(now.toLocaleDateString());
  let oneDayLong = 24 * 60 * 60 * 1000;
  const days = curTime.getDay() ? curTime.getDay() : 7;
  //当前周一0点
  let mondayTime = curTime.getTime() - (days - 1) * oneDayLong;
  //下个周一0点
  let sundayTime = curTime.getTime() + (8 - days) * oneDayLong;
  let weekRange = [parseInt(mondayTime / 1000), parseInt(sundayTime / 1000)];
  return weekRange;
}

/**
 *获得本月的开始日期和结束日期
 */
function getMonthStartDateAndDateRange(now) {
  let oneDayLong = 24 * 60 * 60 * 1000;
  let year = now.getFullYear();
  let monthStartDate = new Date(year, now.getMonth(), 1); //当前月1号
  let nextMonthStartDate = new Date(year, now.getMonth() + 1, 1); //下个月1号
  let days =
    (nextMonthStartDate.getTime() - monthStartDate.getTime()) / oneDayLong; //计算当前月份的天数
  let monthing = new Date(year, now.getMonth(), days);
  let monthRange = [
    parseInt(monthStartDate.valueOf() / 1000),
    parseInt(monthing.valueOf() / 1000),
  ];
  return monthRange;
}
