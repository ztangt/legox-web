/**
 * @author zhangww
 * @description 栏目-待办事项
 */

import React, { useEffect, useState, useRef } from 'react';
import { history } from 'umi';
import { connect } from 'dva';
import styles from './index.less';
import { useSize } from 'ahooks';
import { dataFormat } from '../../../../util/util';
import { Table, Tabs, Badge } from 'antd';
// import { RedoOutlined, EllipsisOutlined } from '@ant-design/icons';
import { ReactComponent as MORE } from "../../gengduo.svg";
import { ReactComponent as REFRE } from "../../shuaxin.svg";
const { TabPane } = Tabs;

function Index({ dispatch, columnBacklog, desktopLayout, user, limit = 10, showHeader = false }) {
  const {
    list,
    circulateList,
    boList,
    count,
    boCount,
    circulateCount,
  } = columnBacklog;
  const { menus } = user
  const { refreshTag } = desktopLayout;


  const [activeKey, setActiveKey] = useState('1');

  const refTodoList = useRef(null);
  const size = useSize(refTodoList);


  useEffect(() => {
    getList();
    setActiveKey('1')
  }, [refreshTag]);

  // useEffect(() => {
  //   reloadList();
  // }, [activeKey]);

  function reloadList() {
    switch (activeKey) {
      case '1':
        dispatch({
          type: 'columnBacklog/getTodoWork',
          payload: {
            start: 1,
            limit,
          },
        });
        break;
      case '2':
        dispatch({
          type: 'columnBacklog/getCirculateWork',
          payload: {
            start: 1,
            limit,
          },
        });
        break;
      case '3':
        dispatch({
          type: 'columnBacklog/getBackWork',
          payload: {
            start: 1,
            limit,
            makeAction: 'BACK',
          },
        });
        break;
      default:
        break;
    }
  }

  function getList() {
    dispatch({
      type: 'columnBacklog/getTodoWork',
      payload: {
        start: 1,
        limit,
      },
      callback: () => {
        dispatch({
          type: 'columnBacklog/getCirculateWork',
          payload: {
            start: 1,
            limit,
          },
          callback: () => {
            dispatch({
              type: 'columnBacklog/getBackWork',
              payload: {
                start: 1,
                limit,
                makeAction: 'BACK',
              },
            });
          },
        });
      },
    });
  }

  const tabPaneObj = [
    {
      key: '1',
      title: (
        <div>
          待办事项
          <Badge showZero count={count} offset={[2, -2]} />
        </div>
      ),
    },
    {
      key: '2',
      title: (
        <div>
          传阅
          <Badge showZero count={circulateCount} offset={[2, -2]} />
        </div>
      ),
    },
    {
      key: '3',
      title: (
        <div>
          驳回
          <Badge showZero count={boCount} offset={[2, -2]} />
        </div>
      ),
    },
  ];

  const operations = {
    left: null,
    right: (
      <div>
        {/* <span>一键审批</span> */}
        <span className={styles.right_icon} onClick={reloadList}>
        <REFRE />
        </span>

        {/* 更多 */}
        <span className={styles.right_icon} onClick={linkToAny}>
          <MORE />
        </span>
        {/* <REFRE style={{ marginRight: 8 }} onClick={reloadList} className={styles.right_icon}/>
        <MORE style={{ cursor: 'pointer' }} onClick={linkToAny} className={styles.right_icon}/> */}
      </div>
    ),
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      ellipsis: true,
      render: (text, obj, index) => (
        <div className={styles.title}>
          <a className={styles[`color${index}`]}>{index + 1}</a>
          <span>{obj.bizTitle}</span>
        </div>
      ),
    },
    // {
    //   title: '标题',
    //   dataIndex: 'bizTitle',
    //   key: 'bizTitle',
    //   ellipsis: true,
    // },
    {
      title: '办理类型',
      dataIndex: 'bizSolName',
      key: 'bizSolName',
      ellipsis: true,
    },
    {
      title: '拟稿人',
      dataIndex: activeKey == '1' ? 'draftUserName' : 'ruserName',
      key: activeKey == '1' ? 'draftUserName' : 'ruserName',
      ellipsis: true,
    },
    {
      title: '送办时间',
      dataIndex: 'startTime',
      render: (text) => {
        return dataFormat(text);
      },
      ellipsis: true,
      align: 'right',
    },
  ];

  const columnsOther = [
    {
      title: '标题',
      dataIndex: 'key',
      ellipsis: true,
      render: (text, obj, index) => (
        <div className={styles.title}>
          <a className={styles[`color${index}`]}>{index + 1}</a>
          <span>{obj.bizTitle}</span>
        </div>
      ),
    },
    {
      title: '送办时间',
      dataIndex: 'startTime',
      render: (text) => {
        return dataFormat(text);
      },
      ellipsis: true,
      align: 'right',
    },
  ];

  function tabOnChange(i) {
    setActiveKey(i);
  }

  function linkToAny() {
    let tmp = menus?.filter(
      (i) => !i.hideInMenu,
    );
    tmp =
      menus?.filter(
        (i) => i.children?.length,
      ) || [];
    let pathname = '/waitMatter';
    for (let i = 0; i < tmp.length; i++) {
      for (let j = 0; j < tmp[i].children.length; j++) {
        const element = tmp[i].children[j];
        if (
          element.path?.indexOf('/waitMatter') > -1 &&
          !element['extraParams']
        ) {
          pathname = element.path;
          break;
        }
      }
    }
    switch (activeKey) {
      case '1':
        historyPush({
          pathname,
        });
        break;
      case '2':
        historyPush({
          pathname: '/circulateWork',
        });
        break;
      case '3':
        historyPush({
          pathname,
          state: {
            makeAction: 'BACK',
          },
        });
        break;
      default:
        break;
    }
  }

  const onClickRow = (record) => {
    var maxDataruleCodes = JSON.parse(
      localStorage.getItem('maxDataruleCodes') || '{}',
    );
    var maxDataruleCode = maxDataruleCodes[history.location.pathname];
    const { bizSolId, bizInfoId, bizTaskId, mainTableId, bizTitle } = record;
    return {
      onClick: () => {
        historyPush({
          pathname: `waitMatter/formShow`,
          query: {
            bizSolId,
            bizInfoId,
            bizTaskId,
            title: bizTitle,
            id: mainTableId,
            maxDataruleCode,
          },
        });
      },
    };
  };

  function getSingle(key) {
    switch (key) {
      case '1':
        return list;
      case '2':
        return circulateList;
      case '3':
        return boList;
      default:
        return list;
    }
  }

  return (
    <div className={styles.follow} ref={refTodoList}>
      <div className={styles.header}>
        <Tabs tabBarExtraContent={operations} onChange={tabOnChange} activeKey={activeKey}>
          {tabPaneObj.map((item, index) => {
            return <TabPane tab={item.title} key={item.key}></TabPane>;
          })}
        </Tabs>
      </div>
      <div className={styles.list}>
        <Table
          style={{ marginTop: -16 }}
          size="small"
          showHeader={showHeader}
          dataSource={getSingle(activeKey)}
          columns={showHeader ? columnsOther : columns}
          onRow={onClickRow}
          scroll={{y: size?.height - 46}}
          pagination={false}
        />
      </div>
    </div>
  );
}

export default connect(({ columnBacklog, desktopLayout, user }) => ({
  columnBacklog,
  desktopLayout,
  user
}))(Index);
