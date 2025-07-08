import IconLeft from '@/Icon-left'
import { creatPortalFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { observer } from '@formily/react'
import { useSize } from 'ahooks'
import { Button, DatePicker, Select } from 'antd'
import LunarCalendar from 'lunar-calendar'
import moment from 'moment'
import 'moment/locale/zh-cn'
import React, { useEffect, useRef } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useModel } from 'umi'
import LeftTitle from '../../../public/leftTitle'
import { dataFormat, dateAdd } from '../../../utils/utils'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'

moment.locale('zh-cn')
const localizer = momentLocalizer(moment)
// const localizer = momentLocalizer(moment, {
//   dayFormat: (date, culture, localizer) => localizer.format(date, 'D', culture),
//   firstOfWeek: 0, // 0 表示周日为一周的第一天
// });

const dayLabelArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09']
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
]
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
]

export const PortalCalendar: DnFC<any> = observer((props) => {
  const {
    getHolidays,
    getSchedules,
    setState,
    todayDate,
    currentDate,
    holidaysList,
    calendarList,
  } = useModel('portalCalendar')

  useEffect(() => {
    let date = new Date()
    getHolidays({ year: date.getFullYear(), start: 1, limit: 1000 })
  }, [])

  const totalCalendarList = [...calendarList]
  const DnDCalendar = withDragAndDrop(Calendar)

  const ref = useRef(null)
  const size = useSize(ref)

  console.log('size:', size)

  useEffect(() => {
    if (window.location.href?.includes('business_application')) {
      const [startTime, endTime] = getDayStartDateAndingRange(todayDate)
      getSchedules({
        startTime,
        endTime,
        limit: 1000,
        start: 1,
      })
    }
  }, [])

  function getDayStartDateAndingRange(currentDay) {
    let startDate = new Date(currentDay.toLocaleDateString())
    let oneDayLong = 24 * 60 * 60 * 1000
    let startTime = startDate.getTime()
    let endTime = startDate.getTime() + oneDayLong
    let weekRange = [parseInt(startTime / 1000), parseInt(endTime / 1000) - 1]
    return weekRange
  }

  /**
   *获得本月的开始日期和结束日期
   */
  function getMonthStartDateAndDateRange(now) {
    let oneDayLong = 24 * 60 * 60 * 1000
    let year = now.getFullYear()
    let monthStartDate = new Date(year, now.getMonth(), 1) //当前月1号
    let nextMonthStartDate = new Date(year, now.getMonth() + 1, 1) //下个月1号
    let days =
      (nextMonthStartDate.getTime() - monthStartDate.getTime()) / oneDayLong //计算当前月份的天数
    let monthing = new Date(year, now.getMonth(), days)
    let monthRange = [
      parseInt(monthStartDate.valueOf() / 1000),
      parseInt(monthing.valueOf() / 1000),
    ]
    return monthRange
  }

  const changeCurrentDate = (newDate) => {
    let currentDay = new Date(newDate.toLocaleDateString())
    setState({ currentDate: currentDay })
    const [curStartTime, curEndTime] = getMonthStartDateAndDateRange(currentDay)
    // 设计页 无需请求日程
    if (window.location.href?.includes('business_application')) {
      getSchedules({
        startTime: curStartTime,
        endTime: curEndTime,
        limit: 1000,
        start: 1,
      })
    }
  }

  function onLeftClick() {
    changeCurrentDate(dateAdd('m', -1, currentDate))
  }

  function onRightClick() {
    changeCurrentDate(dateAdd('m', 1, currentDate))
  }

  const onMouseDown = (event) => {
    console.log('onMouseDown', event)
  }

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
      504758
    )
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
      '冬至'
    )
    var tmp1 = new Date(
      31556925974.7 * (yyyy - 1900) +
        sTermInfo[mm * 2 + 1] * 60000 +
        Date.UTC(1900, 0, 6, 2, 5)
    )
    var tmp2 = tmp1.getUTCDate()
    var solarTerms = ''
    if (tmp2 == dd) {
      solarTerms = solarTerm[mm * 2 + 1]
    }
    tmp1 = new Date(
      31556925974.7 * (yyyy - 1900) +
        sTermInfo[mm * 2] * 60000 +
        Date.UTC(1900, 0, 6, 2, 5)
    )
    tmp2 = tmp1.getUTCDate()
    if (tmp2 == dd) {
      solarTerms = solarTerm[mm * 2]
    }
    return solarTerms
  }

  function sloarToLunar(sy, sm, sd, date) {
    let jqStr = getJQ(sy, sm, sd) // 获取节气信息
    let dateArray = moment(date).format('YYYY-MM-DD').split('-')
    let getWeek = new Date(
      dateArray[0],
      parseInt(dateArray[1] - 1),
      dateArray[2]
    ).getDay()
    // return "星期" + "日一二三四五六".charAt(date.getDay());
    //获取农历以及节假日信息，并做优先级判断
    let lsStr
    if (LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarFestival) {
      if (
        lunarFestivalArr.includes(
          LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarFestival
        )
      ) {
        lsStr = LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarFestival
      } else {
        lsStr = LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarDayName
      }
    } else if (LunarCalendar.solarToLunar(sy, sm + 1, sd).solarFestival) {
      if (
        solarFestivalArr.includes(
          LunarCalendar.solarToLunar(sy, sm + 1, sd).solarFestival.split(' ')[0]
        )
      ) {
        lsStr = LunarCalendar.solarToLunar(sy, sm + 1, sd).solarFestival.split(
          ' '
        )[0]
      } else {
        lsStr = LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarDayName
      }
    } else {
      lsStr = LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarDayName
    }
    if (sm == 6 && sd == 1) {
      lsStr = '建党节'
    }
    if (sm == 5 && sd == 1) {
      lsStr = '儿童节'
    }
    if (lsStr === '七夕情人节') {
      lsStr = '七夕'
    }
    return {
      lunarDay: jqStr ? jqStr : lsStr,
      isRed: getWeek == 0 || getWeek == 6,
    }
  }

  function solarToLunarDate(date) {
    let sy, sm, sd
    sy = date.getFullYear()
    sm = date.getMonth()
    sd = date.getDate()
    let l = LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarMonthName
    let r = LunarCalendar.solarToLunar(sy, sm + 1, sd).lunarDayName
    return `${l}${r}`
  }

  const DateHeaderWrapper = ({ label, date }) => {
    if (dayLabelArr.includes(label)) {
      label = label.split('')[1]
    }
    const cellDay = dataFormat(date / 1000, 'YYYY-MM-DD')
    const selectDay = moment(todayDate).format('YYYY-MM-DD')
    const data = sloarToLunar(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date
    )

    return (
      <div className="flex_column font_size_12">
        {cellDay === selectDay ? (
          <p
            className="cell_day_label_design desktop_fs_design color_white"
            style={{
              height: '50%',
              marginBottom: window.location.href?.includes(
                'business_application'
              )
                ? 5
                : 15,
            }}
          >
            {label}
          </p>
        ) : (
          // <p className="cell_day_label_design_select desktop_wh" style={{height: '50%'}}>{label}</p>
          <p
            className="cell_day_label_design desktop_fs_design"
            style={{
              height: '50%',
              color: data.isRed ? '#DF3D37' : '',
              marginBottom: window.location.href?.includes(
                'business_application'
              )
                ? 5
                : 15,
            }}
          >
            {label}
          </p>
        )}
        <p
          style={{
            height: '50%',
            color: cellDay === selectDay ? '#FFFFFF' : '#666666',
          }}
        >
          {data.lunarDay}
        </p>
      </div>
    )
  }

  const EventColorWrapper = (props) => {
    const { children } = props
    const customDiv = (
      <div
        className="plan_main"
        style={{
          left:
            document.getElementsByClassName('rbc-date-cell')?.[0]?.offsetWidth /
              2 -
            6,
        }}
      >
        <p className="dot_main"></p>
      </div>
    )

    const eventDiv = React.cloneElement(children.props.children, {}, customDiv)
    const wrapper = React.cloneElement(children, {}, eventDiv)
    return <div>{wrapper}</div>
  }

  return (
    <div className={styles.container} ref={ref} {...props}>
      <LeftTitle title="日程管理"></LeftTitle>
      <div className={styles.header}>
        <Select
          style={{ width: 100, borderRadius: 6, border: '1px solid #e7e7e7' }}
          defaultValue="假期安排"
          onChange={(value: any) => {
            changeCurrentDate(new Date(value * 1000))
          }}
        >
          {holidaysList.map((item) => {
            return (
              <Select.Option value={item.startDate} key={item.id}>
                {item.holidayDesc}
              </Select.Option>
            )
          })}
        </Select>
        <div style={{ display: 'flex' }}>
          <LeftOutlined
            style={{
              // margin: '8px 8px 0 2px',
              cursor: 'pointer',
              color: '#999999',
            }}
            onClick={onLeftClick}
          />
          <DatePicker
            className={styles.datePicker}
            onChange={(date, dateString) => {
              if (date) changeCurrentDate(date.toDate())
            }}
            picker="month"
            value={moment(currentDate)}
          />
          <RightOutlined
            style={{
              // margin: '8px 5px 0 8px',
              cursor: 'pointer',
              color: '#999999',
            }}
            onClick={onRightClick}
          />
        </div>
        <Button
          className={styles.today_button}
          onClick={() => {
            changeCurrentDate(new Date())
          }}
        >
          今天
        </Button>
      </div>
      <div className={styles.main}>
        <DnDCalendar
          selectable
          localizer={localizer}
          elementProps={{
            onContextMenu: onMouseDown,
          }}
          events={totalCalendarList}
          view="month"
          popup={true}
          style={{ minHeight: `calc(${props.style.height} - 80px)` }}
          date={currentDate}
          onView={() => {}}
          onNavigate={() => {}}
          onSelectSlot={(slotInfo) => {
            if (slotInfo.action == 'click') {
              if (
                window.location.href?.includes('business_application') &&
                !window.location.href?.includes('portalDesigner')
              ) {
                window.location.href = `#/business_application/calendarMg?sys=portal&portalTitle=日程管理&date=${slotInfo.start}&portalPosition=first`
              }
              // historyPush({
              //   pathname: '/calendarMg',
              //   query: {
              //     date: slotInfo.start,
              //   },
              // })
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
  )
})
PortalCalendar.Behavior = createBehavior({
  name: 'PortalCalendar',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalCalendar',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalCalendar),
  },
  designerLocales: AllLocales.PortalCalendar,
})

PortalCalendar.Resource = createResource({
  icon: <IconLeft type="icon-shurukuang" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalCalendar',
        'x-decorator': 'FormItem',
        'x-component': 'PortalCalendar',
        'x-component-props': {
          style: {
            height: '400px',
            padding: '8px',
            // lineHeight: '200px',
            // ...initStyle?.style,
            // minHeight: '200px',
            // minWidth: '200px',
            // borderStyle: 'none',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            // ...initStyle?.labelStyle,
            width: '0px',
          },
        },
      },
    },
  ],
})
