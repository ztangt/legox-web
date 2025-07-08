import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';

const {
  getSchedules,
  getSchedule,
  addSchedule,
  changeSchedule,
  deleteSchedule,
  getHolidays,
  getOrgChildren,
} = apis;
export default {
  namespace: 'calendarMg',
  state: {
    selectedNodeId: '',
    currentNode: [],
    treeSearchWord: '',
    searchWord: '',
    selectedDatas: [],
    originalData: [],
    selectNodeType: [],
    ugIds: '',
    selectedDataIds: [],
    isShowRelationModal: false, //关联用户信息弹窗状态
    currentView: 'month',
    currentDate: new Date(),
    todayDate: new Date(),
    endingDate: new Date(),
    schedulesList: [],
    calendarList: [],
    currentDayList: [],
    holidaysList: [],
    isFirst: true,
    startTime: 0,
    endTime: 0,
    start: 0,
    limit: 10,
    allPages: 0,
    returnCount: 0,
    currentPage: 0,
    selectedRowKeys: [],
    //添加日程
    isShowAddCalendar: false,
    changeCalendarInfo: {},
    //选相关人
    isShowSelectedUsers: false,
    treeData: [],
    expandedKeys: [],
    checkedKeys: [],
    selectNodeId: '',
    userList: [], //用户列表
    selectNodeUser: [],
    relUser: '', //相关人ID列表
    relUserName: '', //相关人姓名列表
    needDelete: true // 是否需要删除
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
    },
  },
  effects: {
    //分页获取日程
    *getSchedulesByPage({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(getSchedules, payload,'getSchedulesByPage','calendarMg');
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              returnCount: data.data.returnCount,
              currentPage: data.data.currentPage,
              allPages: data.data.allPages,
              limit: payload.limit,
              schedulesList: data.data.list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //根据currentDate时间获取数据
    *getSchedulesByDate({ payload }, { call, put, select }) {
      
      let currentDay = new Date(typeof payload.currentDate == 'object'?payload.currentDate.toLocaleDateString():payload.currentDate);
      const { currentView, startTime, endTime } = yield select(
        (state) => state.calendarMg,
      );

      const [curStartTime, curEndTime] =
        currentView == 'month'
          ? getMonthStartDateAndDateRange(currentDay)
          : getWeekStartDateAndingRange(currentDay);
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
        const { data } = yield call(getSchedules, payload,'getSchedulesByDate','calendarMg');
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
    //新增
    *addSchedule({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(addSchedule, payload,'addSchedule','calendarMg');
        const {searchWord} = yield select(state=>state.calendarMg)
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getSchedulesByPage',
            payload: {
              searchWord,
              start: 0,
              limit: 10,
            },
          });
          yield put({
            type: 'updateDataList',
            payload: {},
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //修改
    *changeSchedule({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(changeSchedule, payload,'changeSchedule','calendarMg');
        const { start,limit,searchWord } = yield select(
          (state) => state.calendarMg,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getSchedulesByPage',
            payload: {
              searchWord,
              start,
              limit
            },
          });
          yield put({
            type: 'updateDataList',
            payload: {},
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //删除
    *deleteSchedule({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(deleteSchedule, payload,'deleteSchedule','calendarMg');
        const {searchWord} = yield select(state=>state.calendarMg)
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getSchedulesByPage',
            payload: {
              searchWord,
              start: 0,
              limit: 10,
            },
          });
          yield put({
            type: 'updateDataList',
            payload: {},
          });
          callback&&callback(data)
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    *getHolidays({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(getHolidays, payload,'getHolidays','calendarMg');
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
        (state) => state.calendarMg,
      );
      // console.log("calendarList9990",calendarList,todayDate,payload)
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
    //根据currentView更新界面
    *updateDataList({ payload }, { call, put, select }) {
      const { currentView, limit, start, currentDate } = yield select(
        (state) => state.calendarMg,
      );
      yield put({
        type: 'updateStates',
        payload: {
          isShowAddCalendar: false,
          changeCalendarInfo: {},
          relUser: '', //相关人ID列表
          relUserName: '', //相关人姓名列表
          expandedKeys: [],
          checkedKeys: [],
          selectNodeId: '',
          userList: [], //用户列表
          selectNodeUser: [],
        },
      });
      // 刷新列表
      // yield put({
      //   type: 'getSchedulesByPage',
      //   payload: {
      //     limit,
      //     start,
      //   },
      // });
      // 刷新日历
      yield put({
        type: 'getSchedulesByDate',
        payload: {
          currentDate,
          needUpdate: true,
        },
      });
    },
    *getOrgChildren(
      { payload, callback, pathname, moudleName },
      { call, put, select },
    ) {
      try {
        const { data } = yield call(getOrgChildren, payload,'getOrgChildren','calendarMg');
        const { treeData, expandedKeys, userList, selectNodeId } = yield select(
          (state) => state.calendarMg,
        );
        const orgUserType = 'USER';
        const loop = (array, children) => {
          for (var i = 0; i < array.length; i++) {
            array[i]['title'] = array[i]['nodeName'];
            array[i]['key'] = array[i]['nodeId'];
            array[i]['value'] = array[i]['nodeId'];
            if (array[i]['nodeType'] != orgUserType) {
              array[i]['disableCheckbox'] = true;
            }
            if (payload.nodeId == array[i]['nodeId']) {
              if (selectNodeId == array[i]['nodeId']) {
                array[i]['children'] = _.concat(children, userList);
              } else {
                array[i]['children'] = children;
              }
              // if(selectNodeId == array[i]['nodeId']){
              //   array[i]['children'] = _.concat(array[i].children,userList);
              // }
            }
            if (array[i].children && array[i].children.length != 0) {
              loop(array[i].children, children);
            } else {
              if (array[i].isParent == 1) {
                array[i]['children'] = [{ key: '-1' }];
                array[i]['isLeaf'] = false;
              } else {
                array[i]['isLeaf'] = true;
              }
            }
          }
          return array;
        };
        if (data.code == 200) {
          let sourceTree = treeData;
          if (data.data.list.length != 0) {
            if (sourceTree && sourceTree.length == 0) {
              sourceTree = data.data.list;
            }
            sourceTree = loop(sourceTree, data.data.list);
            yield put({
              type: 'updateStates',
              payload: {
                treeData: sourceTree,
              },
            });
            if (!payload.nodeId) {
              //请求根节点时，清空已展开的节点
              yield put({
                type: 'updateStates',
                payload: {
                  expandedKeys: [],
                },
              });
            }
            callback && callback();
          }
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg, 5);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *queryUser({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.queryUser, payload,'queryUser','calendarMg');
      const { treeData, userList, selectNodeId, checkedKeys } = yield select(
        (state) => state.calendarMg,
      );

      let obj = {};
      const loop = (array, children) => {
        for (var i = 0; i < array.length; i++) {
          if (selectNodeId == array[i]['nodeId']) {
            if (array[i]['children']) {
              array[i]['children'] = _.concat(array[i].children, children);
            } else {
              array[i]['children'] = children;
            }
            array[i]['children'] = array[i]['children'].reduce(function (
              item,
              next,
            ) {
              obj[next.key] ? '' : (obj[next.key] = true && item.push(next));
              return item;
            },
            []);
          }
          if (array[i].children && array[i].children.length != 0) {
            loop(array[i].children, children);
          }
        }
        return array;
      };
      if (data.code == 200) {
        let list = data.data.list;
        // let newArr = [];
        for (let i = 0; i < list.length; i++) {
          list[i]['title'] = list[i]['userName'];
          list[i]['key'] = list[i]['orgRefUserId'];
          list[i]['value'] = list[i]['orgRefUserId'];
          list[i]['nodeName'] = list[i]['userName'];
          list[i]['nodeId'] = list[i]['orgRefUserId'];
          list[i]['nodeType'] = 'USER';
          // for(let j = 0;j<checkedKeys.length;j++){
          //   if(checkedKeys[j] == list[i].userId){
          //     newArr.push(list[i])
          //   }
          // }
        }
        let sourceTree = loop(treeData, list);
        yield put({
          type: 'updateStates',
          payload: {
            treeData: sourceTree,
            userList: list,
            //  selectNodeUser:newArr
          },
        });
        callback && callback();
      } else {
        message.error(data.msg);
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
