import { connect } from 'dva';
import React, { useState } from 'react';
import CalendarView from './calendarView';
import styles from './calendarView.less';
import { DatePicker, Select, Button, Radio, Input,message,Modal,Tabs } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import CalendarList from './calendarList';
import { dateAdd } from '../../../util/util';
import moment from 'moment';
import { history } from 'umi';
import { parse } from 'query-string';
import AddCalendar from './addCalendar';
import { useEffect } from 'react';
import high_search from '../../../../public/assets/high_search.svg'
const { Option } = Select;
function CalendarMg({
  dispatch,
  currentView,
  currentDate,
  holidaysList,
  isShowAddCalendar,
  selectedRowKeys,
  location,
  isFirst,
}) {
  const query = parse(history.location.search);
  const [searchWord, setSearchWord] = useState('');
  useEffect(()=>{
     //进入界面刷新数据
     let date =  new Date();
     if (query.sys == "portal" && query.portalTitle !== '工作台') {
      date = new Date(query.date) 
     } else if (location.query.date) { 
      date = new Date(location.query.date) 
     }
     dispatch({
      type: 'calendarMg/getSchedulesByDate',
      payload: { currentDate: date },
     });
     
     dispatch({
       type: 'calendarMg/getHolidays',
       payload: {
         year: date.getFullYear(),
         start: 1,
         limit: 1000,
       },
     });
  },[])

  const onChangeValue = (e) => {
    setSearchWord(e.target.value);
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        searchWord: e.target.value,
      },
    });
  };

  const onSearchTable = (value) => {
    dispatch({
      type: 'calendarMg/getSchedulesByPage',
      payload: {
        start: 1,
        limit: 10,
        searchWord: value,
      },
    });
    dispatch({
      type: 'calendarMg/updateStates',
      payload:{
        start:1,
        limit: 10
      }
    })
  };

  const changeCurrentView = (e, val) => {
    // if (e.target.value == 'agenda' && isFirst) {
    // }
    //首次点击刷新列表
    dispatch({
      type: 'calendarMg/getSchedulesByPage',
      payload: {
        start: 1,
        limit: 10,
      },
    });
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        currentView: val ? val : e.target.value,
        isFirst: false,
      },
    });
  };
  console.log("curerntView",currentView)
  const changeCurrentDate = (newDate) => {
    dispatch({
      type: 'calendarMg/getSchedulesByDate',
      payload: {
        currentDate: newDate,
      },
    });
  };

  const showAddCalendar = () => {
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        isShowAddCalendar: true,
      },
    });
  };
  const deleteSchedules = () => {
    if (selectedRowKeys.length == 0){
      message.warning('还没有选择条目')
      return;
    } 
    Modal.confirm({
      title: '确定要删除吗?',
      onOk() {
        const scheduleIds = selectedRowKeys.join(',');
        dispatch({
          type: 'calendarMg/deleteSchedule',
          payload: {
            scheduleIds,
          },
          callback(){
            message.success('删除成功')
          }
        });
      }
    })
  };

  function onLeftClick() {
    currentView == 'month'
      ? changeCurrentDate(dateAdd('m', -1, currentDate))
      : changeCurrentDate(dateAdd('w', -1, currentDate));
  }

  function onRightClick() {
    currentView == 'month'
      ? changeCurrentDate(dateAdd('m', 1, currentDate))
      : changeCurrentDate(dateAdd('w', 1, currentDate));
  }
  const buttonStyle = {width: '48px', textAlign: 'center',height:'32px',lineHeight:'32px' };
  return (
    <div
      id="calendarMgDiv"
      className={styles.calendarMgDiv}
      style={{ overflow: 'hidden', background: '#FFFFFF' }}
    >
      {isShowAddCalendar && <AddCalendar></AddCalendar>}
      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '60%',
            padding: currentView=='week'?'8px 0 8px 8px': currentView !='agenda'?'8px 0 0 8px': '8px 0 0 0',
            borderRight: currentView !== 'agenda' && '1px solid #ddd',
          }}
        >
          {currentView == 'agenda' ? null : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div style={{display:'flex'}}>
                <LeftOutlined
                  style={{
                    margin: '0px 8px 0 2px',
                    cursor: 'pointer',
                    color: '#999999',
                  }}
                  onClick={onLeftClick}
                />
                <DatePicker
                  className={styles.datePicker}
                  onChange={(date, dateString) => {
                    if (date) changeCurrentDate(date.toDate());
                  }}
                  picker={currentView}
                  value={moment(currentDate)}
                />
                <RightOutlined
                  style={{
                    margin: '0px 5px 0 8px',
                    cursor: 'pointer',
                    color: '#999999',
                  }}
                  onClick={onRightClick}
                />
              <div className={styles.button_box}>
                {currentView == 'month' ? (
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
                ) : (
                  <></>
                )}
                <Button
                  className={styles.today_button}
                  onClick={() => {
                    changeCurrentDate(new Date());
                  }}
                >
                  今天
                </Button>

                <Radio.Group value={currentView} onChange={changeCurrentView}>
                  <Radio.Button value="month" style={buttonStyle}>
                    月
                  </Radio.Button>
                  <Radio.Button value="week" style={buttonStyle}>
                    周
                  </Radio.Button>
                  {/* <Radio.Button value="agenda" style={buttonStyle}>
                    列表
                  </Radio.Button> */}
                </Radio.Group>
              </div>
              </div>
              <div className={styles.footer_build} style={{fontSize:window.devicePixelRatio==1?'14px':'12px' }}>
                [创建类型]
                <div className={styles.bg_text}>
                  <div className={styles.person}></div>
                  <div>
                    本人创建
                  </div>
                  <div className={styles.other_to_help}></div>
                  <div>
                    他人代建
                  </div>
                  <div className={styles.to_help_other}></div>
                  <div>
                    代他人创建
                  </div>             
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {currentView == 'agenda' ? (
        <div style={{ marginTop: '0px',height:'calc(100% - 16px)'}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              paddingRight: '8px',
              marginBottom: '0px',
            }}
          >
            <Input.Search
              style={{ width: '226px', marginLeft: 8 }}
              value={searchWord}
              placeholder={'请输入主题'}
              allowClear
              onChange={onChangeValue}
              className={styles.searchInput}
              onSearch={(value) => {
                onSearchTable(value);
              }}
              enterButton={
                <img
                  src={high_search}
                  style={{ margin: '0 8px 2px 0' }}
                />
              }
            />
            <div style={{ marginBottom: 8 }}>
              <Button className={styles.button_width} onClick={showAddCalendar}>新增</Button>
              <Button className={styles.button_width} onClick={deleteSchedules} style={{ marginLeft: '8px' }}>
                删除
              </Button>
              <Button
                onClick={(e) => changeCurrentView(e, 'month')}
                style={{ marginLeft: '8px' }}
                className={styles.button_width}
              >
                返回
              </Button>
            </div>
          </div>
          <CalendarList></CalendarList>
        </div>
      ) : (
        <CalendarView changeCurrentView={changeCurrentView}></CalendarView>
      )}
    </div>
  );
}
export default connect(({ calendarMg, layoutG, loading }) => ({
  ...calendarMg,
  ...layoutG,
  loading,
}))(CalendarMg);
