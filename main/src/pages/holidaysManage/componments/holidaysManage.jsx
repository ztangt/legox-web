import { connect } from 'dva';
import React, {useEffect} from 'react';
import { Table, Space, Modal, message } from 'antd';
import { dataFormat, getButton } from '../../../util/util';
import IPagination from '../../../componments/public/iPagination';
import moment from 'moment';
import { DatePicker, Button } from 'antd';
import AddHoliday from './addHoliday';
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import ColumnDragTable from '../../../componments/columnDragTable';
import styles from '../index.less'

function HolidaysManage({
  dispatch,
  loading,
  currentYear,
  holidaysList,
  selectedRowKeys,
  isShowAddHoliday,
  currentPage,
  returnCount,
  limit,
  user,
}) {
  var viewDetailsModalRef; //查看Modalref
  const { menus } = user;
  useEffect(() => {
    dispatch({
      type: 'holidaysManage/getHolidays',
      payload: {
        start: 0,
        limit: 10,
      },
    });
  }, []);
  const tableProps = {
    rowKey: 'id',
    dataSource: holidaysList,
    columns: [
      {
        title: '序号',
        width: 60,
        render: (text, record, index) => <div>{index + 1}</div>,
      },
      {
        title: '年度',
        dataIndex: 'year',
        key: 'year',
        width: 80,
      },
      {
        title: '节假日',
        dataIndex: 'holidayDesc',
        key: 'holidayDesc',
      },
      // {
      //   title: '日期',
      //   dataIndex: 'holidayDate',
      //   key: 'holidayDate',
      //   render: text => {
      //     return dataFormat(text, 'YYYY-MM-DD');
      //   },
      // },
      {
        title: '假期起',
        dataIndex: 'startDate',
        key: 'startDate',
        render: text => {
          return dataFormat(text, 'YYYY-MM-DD');
        },
      },
      {
        title: '假期止',
        key: 'endDate',
        dataIndex: 'endDate',
        render: text => {
          return dataFormat(text, 'YYYY-MM-DD');
        },
      },
      {
        title: '天数',
        dataIndex: 'holidayDate',
        key: 'holidayDate',
        width: 80,
        render: (text, record) => {
          return dateDiffIncludeToday(
            dataFormat(record.startDate, 'YYYY-MM-DD'),
            dataFormat(record.endDate, 'YYYY-MM-DD'),
          );
        },
      },
      {
        title: '调班日期',
        dataIndex: 'changeDate',
        key: 'changeDate',
        render: text => {
          var changeDateList = [];
          text.split(',').forEach(element => {
            changeDateList.push(dataFormat(element, 'YYYY-MM-DD'));
          });
          return changeDateList.join(',');
        },
      },
      {
        title: '设置人',
        dataIndex: 'setUserName',
        key: 'setUserName',
      },
      {
        title: '设置时间',
        key: 'createTime',
        dataIndex: 'createTime',
        render: text => {
          return dataFormat(text, 'YYYY-MM-DD');
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <Space className={styles.actions}>
            {(
              <a
                onClick={() => {
                  showDetails(record);
                }}
              >
                查看
              </a>
            )}
            {(
              <a
                onClick={() => {
                  changeHoliday(record);
                }}
              >
                修改
              </a>
            )}
            {(
              <a
                onClick={() => {
                  deleteHoliday(record.id);
                }}
              >
                删除
              </a>
            )}
          </Space>
        ),
      },
    ],
    pagination: false,
    rowSelection: {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'holidaysManage/updateStates',
          payload: {
            selectedRowKeys,
          },
        });
      },
    },
  };

  function getHolidaysList(start, limit) {
    dispatch({
      type: 'holidaysManage/getHolidays',
      payload: {
        start,
        limit,
        year: currentYear.getFullYear(),
      },
    });
  }

  //修改
  function changeHoliday(currentHoliday) {
    dispatch({
      type: 'holidaysManage/updateStates',
      payload: {
        isShowAddHoliday: true,
        currentHoliday,
      },
    });
  }

  function deleteHoliday(id) {
    Modal.confirm({
      title: '确认删除吗？',
      content: '',
      okText: '删除',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'holidaysManage/deleteHoliday',
          payload: {
            ids: id,
          },
        });
      },
    });
  }

  function deleteHolidays() {
    if(selectedRowKeys.length==0){
      message.warning('至少选择一条数据')
      return 
    }
    Modal.confirm({
      title: '确认删除吗？',
      content: '',
      okText: '删除',
      cancelText: '取消',
      onOk() {
        var ids = selectedRowKeys.join(',');
        dispatch({
          type: 'holidaysManage/deleteHoliday',
          payload: {
            ids,
          },
        });
      },
    });
  }

  function showAddHoliday() {
    dispatch({
      type: 'holidaysManage/updateStates',
      payload: {
        isShowAddHoliday: true,
      },
    });
  }

  //换页
  function changePage(start, limit) {
    getHolidaysList(start, limit);
  }

  function dateDiffIncludeToday(startDateString, endDateString) {
    var separator = '-'; //日期分隔符
    var startDates = startDateString.split(separator);
    var endDates = endDateString.split(separator);
    var startDate = new Date(startDates[0], startDates[1] - 1, startDates[2]);
    var endDate = new Date(endDates[0], endDates[1] - 1, endDates[2]);
    return parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24) + 1; //把相差的毫秒数转换为天数
  }

  function showDetails(record) {
    var changeDateList = [];
    record.changeDate.split(',').forEach(element => {
      changeDateList.push(dataFormat(element, 'YYYY-MM-DD'));
    });
    viewDetailsModalRef.show([
      { key: '节假日名称', value: record.holidayDesc },
      { key: '年度', value: record.year },
      { key: '开始时间', value: dataFormat(record.startDate, 'YYYY-MM-DD') },
      { key: '结束时间', value: dataFormat(record.endDate, 'YYYY-MM-DD') },
      {
        key: '天数',
        value: dateDiffIncludeToday(
          dataFormat(record.startDate, 'YYYY-MM-DD'),
          dataFormat(record.endDate, 'YYYY-MM-DD'),
        ),
      },
      // { key: '日期', value: dataFormat(record.holidayDate, 'YYYY-MM-DD') },
      { key: '创建时间', value: record.setTime, type: 2 },
      { key: '调班日期', value: changeDateList.join(',') },
    ]);
  }

  return (
    <div style={{height:'100%',position:'relative'}} id="holidaysManageDiv">
      {isShowAddHoliday ? <AddHoliday></AddHoliday> : <></>}
      <ViewDetailsModal
        title="查看节假日"
        containerId="holidaysManageDiv"
        ref={ref => {
          viewDetailsModalRef = ref;
        }}
      ></ViewDetailsModal>
      <div style={{ display: 'flex', margin: 8 }}>
        <div style={{ width: '60%' }}>
          <DatePicker
            onChange={(date, dateString) => {
              dispatch({
                type: 'holidaysManage/updateStates',
                payload: {
                  currentYear: date.toDate(),
                },
              });
              dispatch({
                type: 'holidaysManage/getHolidays',
                payload: {
                  start: currentPage,
                  limit,
                  year: date.toDate().getFullYear(),
                },
              });
            }}
            picker="year"
            value={moment(currentYear)}
            allowClear={false}
          />
        </div>
        <div
          style={{
            width: '40%',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div>
            {(
              <Button type="primary" onClick={showAddHoliday}>
                新增
              </Button>
            )}
            {(
              <Button style={{ marginLeft: 8 }} onClick={deleteHolidays}>
                删除
              </Button>
            )}
          </div>
        </div>
      </div>
      <ColumnDragTable
        {...tableProps}
        taskType ='MONITOR'
        // loading={loading.global}
        scroll={{ y: 'calc(100vh - 280px)' }}
      />
      <div
        style={{
          position: 'absolute',
          width: '800px',
          height: '52px',
          bottom: '13px',
          right: 0,
        }}
      >
        {/* <IPagination
          current={currentPage}
          total={returnCount}
          onChange={changePage}
          pageSize={limit}
        /> */}

        <IPagination
          current={Number(currentPage)}
          total={Number(returnCount)}
          onChange={changePage}
          pageSize={limit}
          isRefresh={true}
          refreshDataFn={() => {
            getHolidaysList(1, limit);
          }}
        />
      </div>
    </div>
  );
}
export default connect(({ holidaysManage, layoutG, loading, user }) => ({
  ...holidaysManage,
  ...layoutG,
  loading,
  user,
}))(HolidaysManage);
