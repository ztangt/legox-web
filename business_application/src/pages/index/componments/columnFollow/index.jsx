/**
 * @author zhangww
 * @description 栏目-跟踪事项
 */

import React, { useEffect, useRef } from 'react';
import { history } from 'umi';
import { connect } from 'dva';
import { useSize } from 'ahooks';
import styles from './index.less';
import { BIZSTATUS } from "../../../../service/constant";
import { dataFormat } from "../../../../util/util";
import { Table, Badge } from 'antd';
// import { RedoOutlined, EllipsisOutlined } from '@ant-design/icons';
import { ReactComponent as MORE } from "../../gengduo.svg";
import { ReactComponent as REFRE } from "../../shuaxin.svg";

function Index({ dispatch, columnFollow, limit = 10, showHeader = false }) {

  const { list, count } = columnFollow;
  console.log('columnFollow:',list);

  const refFollow = useRef(null);
  const size = useSize(refFollow);

  useEffect(() => {
    getList();
  }, []);

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      // width: '150px',
      ellipsis: true,
      render: (text, record, index) =>
        <div className={styles.title} title={record.bizTitle}>
          <a className={styles[`color${index}`]}>{index + 1}</a>
          <span>{record.bizTitle}</span>
        </div>,
    },
    // {
    //   title: '标题',
    //   dataIndex: 'bizTitle',
    //   key: 'bizTitle',
    //   ellipsis: true,
    // },
    {
      title: '状态',
      dataIndex: 'bizStatus',
      key: 'bizStatus',
      // width: '50px',
      ellipsis: true,
      render: (text) => {
        return BIZSTATUS[text];
      },
    },
    {
      title: 'draftUserName',
      dataIndex: 'draftUserName',
      key: 'draftUserName',
      // width: '50px',
      ellipsis: true,
      render: (text, record) => {
        return record.bizStatus == 2 ? '-' : text;
      },
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
      render: (text, record, index) =>
        <div className={styles.title}>
          <a className={styles[`color${index}`]}>{index + 1}</a>
          <span>{record.bizTitle}</span>
        </div>,
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

  function getList() {
    dispatch({
      type: 'columnFollow/getTraceWork',
      payload: {
        start: 1,
        limit,
      }
    })
  }

  function linkToTraceWork() {
    historyPush({pathname:'/traceWork'});
  }

  const onClickRow = (record) => {
    var maxDataruleCodes = JSON.parse(
      localStorage.getItem('maxDataruleCodes') || '{}',
    );
    var maxDataruleCode = maxDataruleCodes[history.location.pathname]||'';
    const {
      bizSolId,
      bizInfoId,
      bizTitle,
      mainTableId
    } = record;
    return {
      onClick: () => {
        historyPush({
          pathname: `/traceWork/formShow`,
          query:{
            bizSolId,
            bizInfoId,
            title: bizTitle,
            id: mainTableId,
            maxDataruleCode
          }
        })
      },
    };
  }

  return (
    <div className={styles.follow} ref={refFollow}>
      <div className={styles.nav}>
        <b>跟踪事项</b><Badge showZero count={count} offset={[2, -2]}/>
        <span className={styles.right_icon} onClick={linkToTraceWork}>
          <MORE />
        </span>
        <span className={styles.right_icon} onClick={getList}>
          <REFRE />
        </span>
      </div>
      <div className={styles.list}>
        <Table
          size="small"
          showHeader={showHeader}
          dataSource={list}
          columns={showHeader ? columnsOther : columns}
          onRow={onClickRow}
          scroll={{y: size?.height - 46}}
          pagination= {false}
        />
      </div>
    </div>
  );
}

export default connect(({
  columnFollow,
}) => ({
  columnFollow,
}))(Index);
