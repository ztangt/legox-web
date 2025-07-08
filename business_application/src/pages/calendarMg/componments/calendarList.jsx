import { connect } from 'dva';
import React,{useState} from 'react';
import { Table,Modal } from 'antd';
import { dataFormat } from '../../../util/util';
import IPagination from '../../../componments/public/iPagination';
import ColumnDragTable from '../../../componments/columnDragTable';
import styles from '../index.less'
const { confirm } = Modal;

function CalendarList({
  dispatch,
  loading,
  schedulesList,
  selectedRowKeys,
  currentPage,
  returnCount,
  start,
  limit,
  searchWord,
}) {
  const [curStart,setCurStart] = useState(1)
  const tableProps = {
    rowKey: 'id',
    dataSource: schedulesList,
    columns: [
      {
        title: '序号',
        render: (text, record, index) => <div>{index + 1}</div>,
        width: 60
      },
      {
        title: '主题',
        dataIndex: 'scheduleTitle',
        key: 'scheduleTitle',
        render: (text)=> <span title={text}>{text}</span>
      },
      {
        title: '相关人',
        dataIndex: 'relUserName',
        key: 'relUserName',
        render: (text)=><span title={text}>{text}</span>
      },
      {
        title: '创建人',
        dataIndex: 'createUserName',
        key: 'createUserName',
        render: (text)=><span title={text}>{text}</span>
      },
      {
        title: '地点',
        dataIndex: 'schedulePlace',
        key: 'schedulePlace',
        render: (text)=><span title={text}>{text}</span>
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (text) => {
          return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '结束时间',
        key: 'endTime',
        dataIndex: 'endTime',
        render: (text) => {
          return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 80,
        render: (text, record) => (
          <>
            <a
            style={{marginRight:8}}
              onClick={() => {
                let users = [...record?.relUser?.split(',')];
                var selectNodeUser = [];
                let names = [...record?.relUserName?.split(',')];
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
                    needDelete:false,
                    changeCalendarInfo: record,
                    relUserName: record.relUserName,
                    relUser: record.relUser,
                    selectNodeUser,
                    checkedKeys: users,
                  },
                });
              }}
            >
              修改
            </a>
            <a onClick={()=>deleteItem(record)}>
              删除
            </a>
          </>
        ),
      },
    ],

    rowSelection: {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'calendarMg/updateStates',
          payload: {
            selectedRowKeys: selectedRowKeys,
          },
        });
      },
    },
  };
  // 删除项
  const deleteItem =(record)=>{
    confirm({
      title: '确定删除吗？',
      onOk() {
        dispatch({
          type: 'calendarMg/deleteSchedule',
          payload: {
            scheduleIds:record.id
          },
          callback:()=>{
            getSchedules(curStart,limit)
          }
        });
      }
    });
  }

  function getSchedules(start, limit) {
    dispatch({
      type: 'calendarMg/getSchedulesByPage',
      payload: {
        start,
        limit,
        searchWord,
      },
    });
  }

  //换页
  function changePage(start, limit) {
    getSchedules(start, limit);
    setCurStart(start)
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        start,
        limit
      }
    })
  }
  return (
    <div className={styles.calendar_table}>
      <ColumnDragTable
        {...tableProps}
        loading={loading.global}
        taskType = 'MONITOR'
        pagination={false}
        scroll={{ y: 'calc(100% - 120px)'}}
      />
      <IPagination
        // style={{ bottom: 8 }}
        current={Number(currentPage)}
        total={Number(returnCount)}
        onChange={changePage}
        pageSize={limit}
        isRefresh={true}
        refreshDataFn={() => {
          getSchedules(1, limit);
        }}
      />
    </div>
  );
}
export default connect(({ calendarMg, layoutG, loading }) => ({
  ...calendarMg,
  ...layoutG,
  loading,
}))(CalendarList);
