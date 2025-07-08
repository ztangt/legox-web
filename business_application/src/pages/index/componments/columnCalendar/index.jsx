/**
 * @author zhangww
 * @description 栏目-日程管理
 */

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { Button, DatePicker, Select } from 'antd';
import { connect } from 'dva';
import LunarCalendar from 'lunar-calendar';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React, { useEffect, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { history } from 'umi';
import BlockUrl from '../../../../../public/assets/block.png';
import Empty from '../../../../../public/assets/empty.png';
import PackupUrl from '../../../../../public/assets/packup.png';
import { dataFormat, dateAdd } from '../../../../util/util';
import { ReactComponent as MORE } from '../../gengduo.svg';
import styles from './index.less';
moment.locale('zh-cn');
const localizer = momentLocalizer(moment);

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

function Index({ dispatch, columnCalendar }) {
  const {
    todayDate,
    currentDate,
    holidaysList,
    calendarList,
    oneDayList,
    selectData,
  } = columnCalendar;
  const totalCalendarList = [...calendarList];
  const DnDCalendar = withDragAndDrop(Calendar);

  const ref = useRef(null);
  const size = useSize(ref);

  const refCa = useRef(null);
  const sizeCa = useSize(refCa);

  // const [showList, setShowList] = useState(false);

  useEffect(() => {
    let date = new Date();
    dispatch({
      type: 'columnCalendar/getSchedulesByDate',
      payload: { currentDate: date },
    });
    dispatch({
      type: 'columnCalendar/getHolidays',
      payload: {
        year: date.getFullYear(),
        start: 1,
        limit: 1000,
      },
    });
  }, []);

  // useEffect(() => {
  //   console.log('123321',document.getElementsByClassName('rbc-date-cell')?.[0]?.offsetWidth);
  // }, [document.getElementsByClassName('rbc-date-cell')?.[0]?.offsetWidth]);

  const changeCurrentDate = (newDate) => {
    dispatch({
      type: 'columnCalendar/getSchedulesByDate',
      payload: {
        currentDate: newDate,
      },
    });
  };

  function onLeftClick() {
    changeCurrentDate(dateAdd('m', -1, currentDate));
  }

  function onRightClick() {
    changeCurrentDate(dateAdd('m', 1, currentDate));
  }

  const onMouseDown = (event) => {
    console.log('onMouseDown', event);
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
      lsStr = '七夕';
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

  const DateHeaderWrapper = ({ label, date }) => {
    if (dayLabelArr.includes(label)) {
      label = label.split('')[1];
    }
    const cellDay = dataFormat(date / 1000, 'YYYY-MM-DD');
    const selectDay = moment(todayDate).format('YYYY-MM-DD');
    const selectDate = dataFormat(selectData, 'YYYY-MM-DD');

    // console.log('===========');
    // console.log(cellDay);
    // console.log(selectDate);
    // console.log(dataFormat(selectData, 'YYYY-MM-DD'));

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
          <div
            className="flex_column text_center font_size_12"
            style={{ position: 'relative' }}
          >
            {cellDay === selectDate && <div className="inner_border"></div>}
            <div
              className={styles.green_dot}
              style={{
                right:
                  document.getElementsByClassName('rbc-date-cell')?.[0]
                    ?.offsetWidth /
                    2 -
                  30,
                top:
                  document.getElementsByClassName('rbc-date-cell')?.[0]
                    ?.offsetHeight /
                    2 -
                  24,
              }}
            >
              <span style={{ color: '#FFFFFF' }}>休</span>
            </div>
            <div>
              {cellDay === selectDay ? (
                <span className="cell_day_label_select desktop_wh">
                  {label}
                </span>
              ) : (
                <span
                  className="cell_day_label desktop_fs"
                  style={{ color: data.isRed ? '#DF3D37' : '' }}
                >
                  {label}
                </span>
              )}
              <span style={{ color: '#666666' }}>{data.lunarDay}</span>
            </div>
          </div>
        );
      }
      // for (let j = 0; j < holidaysList[i].changeDate?.split(',').length; j++) {
      //   if (
      //     cellDay ===
      //     dataFormat(holidaysList[i].changeDate?.split(',')[j], 'YYYY-MM-DD')
      //   ) {
      //     return (
      //       <div className="flex_column font_size_12">
      //         <span style={{ color: '#5793F4' }}>班</span>
      //         {cellDay === selectDay ? (
      //           <span className="cell_day_label_select desktop_wh">{label}</span>
      //         ) : (
      //           <span
      //             className="cell_day_label desktop_fs"
      //             style={{ color: data.isRed ? '#DF3D37' : '' }}
      //           >
      //             {label}
      //           </span>
      //         )}
      //         <span style={{ color: '#666666' }}>{data.lunarDay}</span>
      //       </div>
      //     );
      //   }
      // }
    }
    return (
      <div
        className="flex_column text_center font_size_10"
        style={{ position: 'relative' }}
      >
        <div>
          {cellDay === selectDate && <div className="inner_border"></div>}
          {cellDay === selectDay && <div className="inner_bg"></div>}
          {cellDay === selectDay ? (
            <span className="cell_day_label_select desktop_wh">{label}</span>
          ) : (
            <span
              className="cell_day_label desktop_fs"
              style={{ color: data.isRed ? '#DF3D37' : '' }}
            >
              {label}
            </span>
          )}
          <span style={{ position: 'relative', color: '#666666' }}>
            {data.lunarDay}
          </span>
        </div>
      </div>
    );
  };

  const EventColorWrapper = (props) => {
    const { children } = props;
    const customDiv = (
      <div
        className="plan_main"
        style={{
          left:
            document.getElementsByClassName('rbc-date-cell')?.[0]?.offsetWidth /
              2 -
            6,
          bottom:
            document.getElementsByClassName('rbc-date-cell')?.[0]
              ?.offsetHeight /
              2 -
            22,
        }}
      >
        <p className="dot_main"></p>
      </div>
    );

    const eventDiv = React.cloneElement(children.props.children, {}, customDiv);
    const wrapper = React.cloneElement(children, {}, eventDiv);
    return <div>{wrapper}</div>;
  };
  function linkToAny() {
    historyPush({
      pathname: '/calendarMg',
    });
  }
  function onPackUpClick() {
    dispatch({
      type: 'columnCalendar/updateStates',
      payload: {
        selectData: null,
      },
    });
  }

  function getDayStartDateAndingRange(currentDay) {
    let startDate = new Date(currentDay.toLocaleDateString());
    let oneDayLong = 24 * 60 * 60 * 1000;
    let startTime = startDate.getTime();
    let endTime = startDate.getTime() + oneDayLong;
    let weekRange = [parseInt(startTime / 1000), parseInt(endTime / 1000) - 1];
    return weekRange;
  }

  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.header}>
        <div style={{ marginRight: 8 }}>
          <LeftOutlined
            style={{
              margin: '8px 8px 0 2px',
              cursor: 'pointer',
              color: '#999999',
            }}
            onClick={onLeftClick}
          />
          <DatePicker
            allowClear={false}
            className={styles.datePicker}
            onChange={(date, dateString) => {
              if (date) changeCurrentDate(date.toDate());
            }}
            picker="month"
            value={moment(currentDate)}
          />
          <RightOutlined
            style={{
              margin: '8px 0 0 8px',
              cursor: 'pointer',
              color: '#999999',
            }}
            onClick={onRightClick}
          />
        </div>
        <div>
          <Select
            style={{ width: 100, borderRadius: 4 }}
            defaultValue="假期安排"
            onChange={(value) => {
              changeCurrentDate(new Date(value * 1000));
            }}
          >
            {holidaysList.map((item) => {
              return (
                <Option value={item.startDate} key={item.id}>
                  {item.holidayDesc}
                </Option>
              );
            })}
          </Select>
          <Button
            className={styles.today_button}
            onClick={() => {
              changeCurrentDate(new Date());
            }}
          >
            今天
          </Button>
          {/* 更多 */}
          <span className={styles.right_icon} onClick={linkToAny}>
            <MORE />
          </span>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.left} ref={refCa}>
          <DnDCalendar
            selectable
            localizer={localizer}
            elementProps={{
              onContextMenu: onMouseDown,
            }}
            events={totalCalendarList}
            view="month"
            popup={true}
            style={{
              minHeight: size
                ? size?.height -
                  (history.location.search.includes('sys=') ? 90 : 40)
                : 270,
            }}
            date={currentDate}
            onView={() => {}}
            onNavigate={() => {}}
            onSelectSlot={(slotInfo) => {
              if (slotInfo.action == 'click') {
                const [startTime, endTime] = getDayStartDateAndingRange(
                  slotInfo.start,
                );
                dispatch({
                  type: 'columnCalendar/getOneSchedule',
                  payload: {
                    startTime,
                    endTime,
                    limit: 100,
                    start: 1,
                  },
                });
                // setShowList(true)
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
        {selectData && (
          <>
            <div className={styles.middle}>
              <div className={styles.wrapper} onClick={onPackUpClick}>
                <img className={styles.thumbnail} src={PackupUrl} />
              </div>
            </div>
            <div className={styles.right}>
              <h1>{dataFormat(selectData, 'MM月DD日')}</h1>
              <ul
                style={{ height: size?.height - 130 }}
                className={oneDayList.length === 0 ? 'flex_column' : ''}
              >
                {oneDayList.length === 0 && (
                  <div className={styles.empty}>
                    <img src={Empty} />
                    <h4 style={{ marginLeft: 8 }}>暂无日程</h4>
                  </div>
                )}
                {oneDayList.map((item, index) => {
                  return (
                    <li style={{ marginBottom: 0 }}>
                      <p>{item.scheduleTitle}</p>
                      <img
                        src={BlockUrl}
                        style={{ marginRight: 8, marginTop: -2 }}
                      />
                      <span>
                        {dataFormat(item.startTime, 'YYYY年MM月DD日 HH:mm')}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default connect(({ columnCalendar }) => ({
  columnCalendar,
}))(Index);
