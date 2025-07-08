import { Badge, Tabs } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../componments/columnDragTable';
import { BASE_WIDTH, ORDER_WIDTH } from '../../util/constant';
import { dataFormat } from '../../util/util';

import styles from './index.less';

function Index({ dispatch, todoList }) {
  const [activeKey, setActiveKey] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const { list, registers } = todoList;

  function getTodoList({ registerId, start = 1, limit = 10 }) {
    dispatch({
      type: 'todoList/getTodoList',
      payload: {
        registerId,
        start,
        limit,
      },
    });
  }

  useEffect(() => {
    dispatch({
      type: 'todoList/getRegister',
      callback: (arr) => {
        for (let i = 0; i < arr.length; i++) {
          dispatch({
            type: 'todoList/getTodoList',
            payload: {
              registerId: arr[i].registerId,
              start: 1,
              limit: 10,
              isFrist: i + 1,
            },
            callback: (count) => {
              arr[i].count = count;
              dispatch({
                type: 'todoList/updateStates',
                payload: {
                  registers: arr,
                },
              });
            },
          });
        }
      },
    });
  }, []);

  function tabOnChange(array) {
    let arr = array.split('-');
    setActiveIndex(arr[0]);
    setActiveKey(arr[1]);
    getTodoList({ registerId: arr[1], start: 1, limit: 10 });
  }

  const tableProps = {
    rowKey: 'id',
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: ORDER_WIDTH,
        render: (text, obj, index) => <div>{index + 1}</div>,
      },
      {
        title: '标题',
        dataIndex: 'bizTitle',
        width: BASE_WIDTH*2,
        render: (text, obj, index) => (
          <a
            onClick={() => {
              onLinkClick(obj);
            }}
          >
            {text}
          </a>
        ),
      },
      {
        title: '所属系统',
        dataIndex: 'fileTypeName',
        with: BASE_WIDTH,
        render: () => <>{registers[activeIndex]?.registerName}</>,
      },

      {
        title: '送办时间',
        dataIndex: 'startTime',
        with: BASE_WIDTH,
        render: (text) => {
          return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '拟稿人',
        dataIndex: 'draftUserName',
        with: BASE_WIDTH,
      },
    ],
    pagination: false,
    dataSource: list,
    taskType: 'MONITOR',
  };

  const items = registers.map((item, index) => {
    return {
      key: `${index}-${item.registerId}`,
      label: (
        <div>
          {item.registerName}
          <Badge showZero count={item.count} offset={[2, -2]} overflowCount={20}/>
        </div>
      ),
      children: (
        <div className={styles.table_wrapper}>
          <ColumnDragTable
            {...tableProps}
            // scroll={{ y: 'calc(100% - 750px)' }}
          />
        </div>
      ),
    };
  });

  const onLinkClick = (obj) => {
    window.location.href = `#/business_application?sys=portal&portalTitle=工作台&registerCode=${obj.registerCode}`;
    setTimeout(() => {
      historyPush({
        pathname: `/formShow`,
        query: {
          bizSolId: obj.bizSolId,
          bizInfoId: obj.bizInfoId,
          bizTaskId: obj.bizTaskId,
          title: obj.bizTitle,
          id: obj.mainTableId,
        },
      });
    }, 0);
  };

  return (
    <div className={styles.follow}>
      <div className={styles.header}>
        <Tabs
          activeKey={`${activeIndex}-${activeKey}`}
          onChange={tabOnChange}
          items={items}
        />
      </div>
    </div>
  );
}
export default connect(({ todoList }) => ({
  todoList,
}))(Index);
