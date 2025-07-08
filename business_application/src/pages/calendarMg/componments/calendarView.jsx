import { connect } from 'dva';
import React, { useState } from 'react';
import { Table, Typography, Button } from 'antd';
import LunarCalendar from 'lunar-calendar';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import styles from './calendarView.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
import ColumnDragTable from '../../../componments/columnDragTable';
import { dataFormat } from '../../../util/util';
moment.locale('zh-cn');
const localizer = momentLocalizer(moment);
const { Text, Title } = Typography;

const dayLabelArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
const solarFestivalArr = [
  '元旦节',
  '情人节',
  '妇女节',
  '愚人节',
  '清明',
  '劳动节',
  '青年节',
  '母亲节',
  '儿童节',
  '父亲节',
  '建党节',
  '建军节',
  '教师节',
  '国庆节',
];
const lunarFestivalArr = [
  '除夕',
  '春节',
  '元宵节',
  '端午节',
  '七夕情人节',
  '中元节',
  '中秋节',
  '重阳节',
  '腊八节',
  '小年',
];

function CalendarView({
  changeCurrentView,
  dispatch,
  currentView,
  currentDate,
  todayDate,
  calendarList,
  currentDayList,
  holidaysList,
}) {
  const totalCalendarList = [...calendarList];
  const DnDCalendar = withDragAndDrop(Calendar);

  const [direction, setDirection] = useState('');

  const messages = {
    showMore: (total) => `+ ${total} 查看`,
  };

  const columns = [
    {
      title: '相关人',
      dataIndex: 'relUserName',
      key: 'relUserName',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '主题',
      dataIndex: 'scheduleTitle',
      key: 'scheduleTitle',
      align: 'left',
      ellipsis: true,
      render: (text) => {
        return <a style={{ color: '#588CE9' }}>{text}</a>;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      align: 'left',
      ellipsis: true,
      render: (text) => {
        return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '结束时间',
      key: 'endTime',
      dataIndex: 'endTime',
      align: 'left',
      ellipsis: true,
      render: (text) => {
        return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  function dateDiffIncludeToday(startDateString, endDateString) {
    var separator = '-'; //日期分隔符
    var startDates = startDateString.split(separator);
    var endDates = endDateString.split(separator);
    var startDate = new Date(startDates[0], startDates[1] - 1, startDates[2]);
    var endDate = new Date(endDates[0], endDates[1] - 1, endDates[2]);
    return parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24) + 1; //把相差的毫秒数转换为天数
  }

  const columnsDay = [
    {
      title: '节假日',
      dataIndex: 'holidayDesc',
      key: 'holidayDesc',
      align: 'left',
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      align: 'left',
      render: (text) => {
        return dataFormat(text, 'YYYY-MM-DD');
      },
    },
    {
      title: '结束日期',
      key: 'endDate',
      dataIndex: 'endDate',
      align: 'left',
      render: (text) => {
        return dataFormat(text, 'YYYY-MM-DD');
      },
    },
    {
      title: '天数',
      dataIndex: 'holidayDate',
      key: 'holidayDate',
      align: 'left',
      render: (text, record) => {
        return dateDiffIncludeToday(
          dataFormat(record.startDate, 'YYYY-MM-DD'),
          dataFormat(record.endDate, 'YYYY-MM-DD'),
        );
      },
    },
  ];

  const changeCurrentDate = (newDate) => {
    dispatch({
      type: 'calendarMg/getSchedulesByDate',
      payload: {
        currentDate: newDate,
      },
    });
  };

  function reduce1S(date) {
    return moment(new Date(date.toLocaleDateString()) - 1)._d;
  }

  const updateSAEDate = (v1, v2, v3) => {
    let currentDate, endingDate;
    // console.log(v1,v2);
    if (currentView == 'month' && !v3) {
      currentDate = v1;
      endingDate = reduce1S(v2);
      // moment(new Date(v2.toLocaleDateString()) - 1 )._d;
    } else {
      currentDate = v1;
      endingDate = v2;
    }
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        todayDate: currentDate,
        currentDate,
        endingDate,
      },
    });
  };

  const showCurrentSchedule = (schedule) => {
    // console.log('schedule:',schedule);
    if (
      schedule.scheduleType == 'HOLIDAY_CHANGE_DATE' ||
      schedule.scheduleType == 'HOLIDAY_DATE'
    ) {
      return;
    }
    let users = [...schedule?.relUser?.split(',')];
    var selectNodeUser = [];
    let names = [...schedule?.relUserName?.split(',')];
    names.forEach((element, index) => {
      var curUser = {};
      curUser.nodeId = users[index];
      curUser.nodeName = element;
      selectNodeUser.push(curUser);
    });
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        isShowAddCalendar: true,
        changeCalendarInfo: schedule,
        relUserName: schedule.relUserName,
        relUser: schedule.relUser,
        selectedDataIds: schedule.relUser.split(','),
        selectNodeUser,
        checkedKeys: users,
      },
    });
  };

  const addSchedule = () => {
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        isShowAddCalendar: true,
        relUserName: [],
      },
    });
  };

  const customDayPropGetter = (date) => {
    if (currentView !== 'month') return;
    for (let i = 0; i < holidaysList.length; i++) {
      if (
        date.valueOf() + 60 * 60 * 24 * 1000 >=
          holidaysList[i].startDate * 1000 &&
        date.valueOf() <= holidaysList[i].endDate * 1000
      ) {
        return {
          style: {
            backgroundColor: '#FFE3E4',
          },
        };
      }
      for (let j = 0; j < holidaysList[i].changeDate?.split(',').length; j++) {
        if (
          dataFormat(date / 1000, 'YYYY-MM-DD') ===
          dataFormat(holidaysList[i].changeDate?.split(',')[j], 'YYYY-MM-DD')
        ) {
          return {
            style: {
              backgroundColor: '#F5F5F5',
            },
          };
        }
      }
    }
  };

  function getJQ(yyyy, mm, dd) {
    var sTermInfo = new Array(
      0,
      21208,
      42467,
      63836,
      85337,
      107014,
      128867,
      150921,
      173149,
      195551,
      218072,
      240693,
      263343,
      285989,
      308563,
      331033,
      353350,
      375494,
      397447,
      419210,
      440795,
      462224,
      483532,
      504758,
    );
    var solarTerm = new Array(
      '小寒',
      '大寒',
      '立春',
      '雨水',
      '惊蛰',
      '春分',
      '清明',
      '谷雨',
      '立夏',
      '小满',
      '芒种',
      '夏至',
      '小暑',
      '大暑',
      '立秋',
      '处暑',
      '白露',
      '秋分',
      '寒露',
      '霜降',
      '立冬',
      '小雪',
      '大雪',
      '冬至',
    );
    var tmp1 = new Date(
      31556925974.7 * (yyyy - 1900) +
        sTermInfo[mm * 2 + 1] * 60000 +
        Date.UTC(1900, 0, 6, 2, 5),
    );
    var tmp2 = tmp1.getUTCDate();
    var solarTerms = '';
    if (tmp2 == dd) {
      solarTerms = solarTerm[mm * 2 + 1];
    }
    tmp1 = new Date(
      31556925974.7 * (yyyy - 1900) +
        sTermInfo[mm * 2] * 60000 +
        Date.UTC(1900, 0, 6, 2, 5),
    );
    tmp2 = tmp1.getUTCDate();
    if (tmp2 == dd) {
      solarTerms = solarTerm[mm * 2];
    }
    return solarTerms;
  }

  function sloarToLunar(sy, sm, sd, date) {
    let jqStr = getJQ(sy, sm, sd); // 获取节气信息
    let dateArray = moment(date).format('YYYY-MM-DD').split('-');
    let getWeek = new Date(
      dateArray[0],
      parseInt(dateArray[1] - 1),
      dateArray[2],
    ).getDay();
    // return "星期" + "日一二三四五六".charAt(date.getDay());
    //获取农历以及节假日信息，并做优先级判断
    let lsStr;
    if (LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarFestival) {
      if (
        lunarFestivalArr.includes(
          LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarFestival,
        )
      ) {
        lsStr = LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarFestival;
      } else {
        lsStr = LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarDayName;
      }
    } else if (LunarCalendar.solarToLunar(sy, sm + 1, sd).solarFestival) {
      if (
        solarFestivalArr.includes(
          LunarCalendar.solarToLunar(sy, sm + 1, sd).solarFestival.split(
            ' ',
          )[0],
        )
      ) {
        lsStr = LunarCalendar.solarToLunar(sy, sm + 1, sd).solarFestival.split(
          ' ',
        )[0];
      } else {
        lsStr = LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarDayName;
      }
    } else {
      lsStr = LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarDayName;
    }
    if (sm == 6 && sd == 1) {
      lsStr = '建党节';
    }
    if (sm == 5 && sd == 1) {
      lsStr = '儿童节';
    }
    if (lsStr === '七夕情人节') {
      lsStr = '七夕节';
    }
    return {
      lunarDay: jqStr ? jqStr : lsStr,
      isRed: getWeek == 0 || getWeek == 6,
    };
  }

  function solarToLunarDate(date) {
    let sy, sm, sd;
    sy = date.getFullYear();
    sm = date.getMonth();
    sd = date.getDate();
    let l = LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarMonthName;
    let r = LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarDayName;
    return `${l}${r}`;
  }

  function getWeek(dateString) {
    let dateArray = dateString.split('-');
    let date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
    return '星期' + '日一二三四五六'.charAt(date.getDay());
  }
  let numberDay = [] // 日期天数用来判断样式
  const DateHeaderWrapper = ({ label, date }) => {
    if (dayLabelArr.includes(label)) {
      label = label.split('')[1];
    }
    const cellDay = dataFormat(date / 1000, 'YYYY-MM-DD');
    numberDay.push(cellDay)  // useRef也可
    localStorage.setItem('numberDay',JSON.stringify(numberDay)) 
    const selectDay = moment(todayDate).format('YYYY-MM-DD');
    const data = sloarToLunar(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date,
    );  
    for (let i = 0; i < holidaysList.length; i++) {
      if (
        date.valueOf() + 60 * 60 * 24 * 1000 >=
          holidaysList[i].startDate * 1000 &&
        date.valueOf() <= holidaysList[i].endDate * 1000
      ) {
        return (
          <div className="flex_space_around view_space_around">
            <span className="is_relax" style={{ color: '#DF3D37' }}>休</span>
            {cellDay === selectDay ? (
              <span className="cell_day_label_select">{label}</span>
            ) : (
              <span
                className="cell_day_label"
                style={{ color: data.isRed ? '#DF3D37' : '' }}
              >
                {label}
              </span>
            )}
            <span style={{ color: '#666666' }}>{data.lunarDay}</span>
          </div>
        );
      }
      for (let j = 0; j < holidaysList[i].changeDate?.split(',').length; j++) {
        if (
          cellDay ===
          dataFormat(holidaysList[i].changeDate?.split(',')[j], 'YYYY-MM-DD')
        ) {
          return (
            <div className="flex_space_around view_space_around">
              <span className="is_relax" style={{ color: '#5793F4' }}>班</span>
              {cellDay === selectDay ? (
                <span className="cell_day_label_select">{label}</span>
              ) : (
                <span
                  className="cell_day_label"
                  style={{ color: data.isRed ? '#DF3D37' : '' }}
                >
                  {label}
                </span>
              )}
              <span style={{ color: '#666666' }}>{data.lunarDay}</span>
            </div>
          );
        }
      }
    }
    return (
      <div className="flex_space_around">
        {cellDay === selectDay ? (
          <span className="cell_day_label_select">{label}</span>
        ) : (
          <span
            className="cell_day_label"
            style={{ color: data.isRed ? '#DF3D37' : '' }}
          >
            {label}
          </span>
        )}
        <span style={{ color: '#666666' }}>{data.lunarDay}</span>
      </div>
    );
  };
  const onDragStart = (v) => {
    setDirection(v.direction);
  };
  const onEventDrop = (data) => {
    let curCalendarInfo = data.event;
    let startTime = data.start.valueOf() / 1000;
    let endTime = data.end.valueOf() / 1000;
    if (direction === 'UP') {
      endTime = data.event.end.valueOf() / 1000;
    }
    if (direction === 'DOWN') {
      startTime = data.event.start.valueOf() / 1000;
    }
    //更新时间
    dispatch({
      type: 'calendarMg/changeSchedule',
      payload: {
        ...curCalendarInfo,
        startTime: startTime,
        endTime: endTime,
      },
    });
  };
  const loopEvent = (child, index) => {
    console.log('child=', child);
    if (child.previousSibling != null) {
      return loopEvent(child.previousSibling, index + 1);
    } else {
      return index;
    }
  };
  const onMouseDown = (event) => {
    event.preventDefault();
    console.log('event:', event);
    if (
      event.button == 2 &&
      event.target.className.includes('cell_day_label')
    ) {
      //获取日期
      let year = moment(currentDate).year();
      let month = moment(currentDate).month() + 1;
      let outerText = '01';
      outerText = event.target.outerText;
      let start = `${year}-${month}-${outerText} 00:00:00`;
      let end = `${year}-${month}-${outerText} 23:59:59`;
      updateSAEDate(new Date(start), new Date(end), true);
      addSchedule();
    }
  };

  const eventStyleGetter = (event) => {
    const eventType = event.scheduleType;

    let backgroundColor = '#FEEAD1';
    switch (eventType) {
      //SELF自己日程
      case 'SELF':
        backgroundColor = '#40a9ff';
        break;
      // 绿色 代建他人日程
      case 'SELF_TO_OTHER':
        backgroundColor = '#b7eb8f';
        break;
      // OTHER_TO_SELF 他人代建日程
      case 'OTHER_TO_SELF':
        backgroundColor = '#ff7875';
        break;
    }
    const style = {
      backgroundColor,
      color: '#000',
    };
    return {
      style: style,
    };
  };

  const EventColorWrapper = (props) => {
    const { children, event } = props;
    const eventType = event.scheduleType;
    let eventColor = '#FEEAD1';
    let eventBorderColor = '#FF9520';

    switch (eventType) {
      case 'SELF':
        eventColor = '#87CEEB';
        eventBorderColor = '#FF9520';
        break;
      case 'SELF_TO_OTHER':
        eventColor = '#E0F7EA';
        eventBorderColor = '#07B854';
        break;
      case 'OTHER_TO_SELF':
        eventColor = '#FEEAD1';
        eventBorderColor = '#FF9520';
        break;
    }

    let objS = {};
    if (currentView == 'month') {
      objS = {
        style: {
          ...children.props.style,
          backgroundColor: eventColor,
          color: '#000',
        },
      };
    }

    const customDiv = (
      <div className="plan">
        <p className="dot"></p>
        <p className="ellipsis" title={`${event.scheduleTitle}`}>{`${dataFormat(
          event.startTime,
          'HH:mm',
        )} ${event.scheduleTitle}`}</p>
      </div>
    );

    const eventDiv = React.cloneElement(
      children.props.children,
      objS,
      customDiv,
    );
    const wrapper = React.cloneElement(children, {}, eventDiv);
    return <div>{wrapper}</div>;
  }; 
  const nowAllNumber = Array.from(new Set(JSON.parse(localStorage.getItem('numberDay')))).length/7
  return (
    <div
      style={{ display: 'flex', backgroundColor: '#fff',height:'calc(100% - 39px)' }}
      className={nowAllNumber==5?styles.calendarBox:styles.calendarView}
    >
      <div style={{ display: 'flex', width: '60%', flexDirection: 'column' ,height:'100%'}}>
        <div style={{height:'100%'}}>
          <DnDCalendar
            selectable
            localizer={localizer}
            messages={messages}
            elementProps={
              currentView == 'month'
                ? {
                    onContextMenu: onMouseDown,
                  }
                : {}
            }
            events={totalCalendarList}
            view={currentView}
            popup={true}
            style={{ height: currentView == 'week'?'100%':'100%',marginBottom:4 }}
            date={currentDate}
            // dayPropGetter={customDayPropGetter}
            eventPropGetter={(event) => eventStyleGetter(event)}
            onEventDrop={onEventDrop}
            onEventResize={onEventDrop}
            showMultiDayTimes={true}
            onDragStart={onDragStart}
            onSelectEvent={(event) => {
              showCurrentSchedule(event);
            }}
            onView={() => {}}
            onNavigate={() => {}}
            onSelectSlot={(slotInfo) => {
              if (
                slotInfo.action == 'click' ||
                slotInfo.action == 'doubleClick' ||
                slotInfo.action == 'select'
              ) {
                if (
                  currentView == 'week' &&
                  dataFormat(slotInfo.start.valueOf() / 1000, 'HH:mm:ss') ===
                    '00:00:00' &&
                  dataFormat(slotInfo.end.valueOf() / 1000, 'HH:mm:ss') ===
                    '00:00:00'
                ) {
                  return;
                }
                updateSAEDate(slotInfo.start, slotInfo.end);
                changeCurrentDate(slotInfo.start);
                addSchedule();
              }
            }}
            toolbar={false}
            components={{
              eventWrapper: EventColorWrapper,
              month: {
                dateHeader: DateHeaderWrapper,
              },
            }}
          />
        </div>
        
      </div>
      <div
        style={{
          width: '40%',
          backgroundColor: '#fff',
          height: '100%',
          marginTop: '-50px',
        }}
      >
        <Table
          title={() => {
            return (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 500,
                    color: '#000000',
                    paddingTop: 15
                  }}
                >
                  {`${moment(todayDate).format('YYYY年MM月DD日')}  ${getWeek(
                    moment(todayDate).format('YYYY-MM-DD'),
                  )} 农历${solarToLunarDate(todayDate)}`}
                </Text>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between',paddingRight:8 }}
                >
                  <Title
                    level={5}
                    style={{ margin: '10px 0 8px 8px', fontSize: '14px' }}
                  >
                    日程
                  </Title>
                  <Button style={{width: 48}} onClick={(e) => changeCurrentView(e, 'agenda')}>
                    全部
                  </Button>
                </div>
              </div>
            );
          }}
          size="small"
          dataSource={currentDayList}
          scroll={{ y: currentDayList.length > 0 ? 'calc(100% - 114px)' : '' }}
          pagination={false}
          style={{ height: '54%' }}
          columns={columns}
          rowKey="id"
          onRow={(record) => {
            return {
              onClick: (event) => {
                showCurrentSchedule(record);
              },
            };
          }}
        />
        <Table
          title={() => {
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Title
                  level={5}
                  style={{ margin: '8px 0 8px 8px', fontSize: '14px' }}
                >
                  节假日安排
                </Title>
              </div>
            );
          }}
          size="small"
          dataSource={holidaysList}
          scroll={{ y: holidaysList.length > 0 ? 'calc(100% - 82px)' : '' }}
          style={{ height: '54%' }}
          pagination={false}
          columns={columnsDay}
        />
      </div>
    </div>
  );
}

export default connect(({ calendarMg, layoutG }) => ({
  ...calendarMg,
  ...layoutG,
}))(CalendarView);
