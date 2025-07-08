import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import { connect } from 'dva';
import styles from './index.less';
import { Table, Button, Modal } from 'antd';
import BasicsTable from '../../components/basicsTable';
import { BIZSTATUS, ORDER_WIDTH } from '../../util/constant';
import { dataFormat, formattingMoney } from '../../util/util';
import IPagination from '../../components/public/iPagination';

const { confirm } = Modal;

function Index({ location, dispatch, wayList }) {
  const { location: locationFromQK, openEvent, openNewPage } = useModel(
    '@@qiankunStateFromMaster',
  );

  const { formList, start, limit, currentPage, returnCount } = wayList;
  const { normCode, moneyType, currentYear } = history.location.query;
  // const normCode = location.query.normCode;
  // const moneyType = location.query.moneyType;
  const [resList, setResList] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState('');
  useEffect(() => {
    if (normCode && moneyType) {
      getList(start, limit);
    }
  }, [normCode, moneyType]);

  const columns = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      width: ORDER_WIDTH,
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '标题',
      dataIndex: 'sourceBizTitle',
      key: 'sourceBizTitle',
      ellipsis: true,
    },
    {
      title: '单据号',
      dataIndex: 'documentNumber',
      key: 'documentNumber',
      ellipsis: true,
    },
    {
      title: '单据类型',
      dataIndex: 'sourceMenuName',
      key: 'sourceMenuName',
      ellipsis: true,
    },
    ,
    {
      title: '金额',
      dataIndex: 'sumMoney',
      key: 'sumMoney',
      ellipsis: true,
      render: (text) => {
        return formattingMoney(text);
      },
    },
    {
      title: '单据状态',
      dataIndex: 'bizStatus',
      key: 'bizStatus',
      ellipsis: true,
      render: (text) => {
        return BIZSTATUS[text];
      },
    },
    {
      title: '登记人',
      dataIndex: 'draftUserName',
      key: 'draftUserName',
      ellipsis: true,
    },
    {
      title: '登记部门',
      dataIndex: 'draftDeptName',
      key: 'draftDeptName',
      ellipsis: true,
    },
    {
      title: '登记时间',
      dataIndex: 'draftTime',
      key: 'draftTime',
      ellipsis: true,
      render: (text) => {
        return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  function getList(start, limit) {
    dispatch({
      type: 'wayList/getNormOnwayList',
      payload: {
        start,
        limit,
        normCode,
        moneyType,
        currentYear,
      },
    });
  }

  function openFormDetail() {
    openEvent(
      arguments[0],
      arguments[1],
      arguments[2]?.sourceBizId,
      arguments[2],
      arguments[3],
    );
  }

  const changePage = (nextPage, size) => {
    dispatch({
      type: 'freezeOrExec/updateStates',
      payload: {
        start: nextPage,
        limit: size,
      },
    });
    getList(nextPage, size);
  };

  return (
    <div className={styles.container}>
      <div className={styles.control}>
        <Button onClick={() => history.push(`/budgetTarget`)}>返回</Button>
      </div>
      <div className={styles.list}>
        <BasicsTable
          bordered
          dispatch={dispatch}
          dataSource={formList}
          columns={columns}
          pagination={false}
          onRow={(record) => {
            return {
              onClick: openFormDetail.bind(this, {}, {}, record, 'new'), // 点击行
            };
          }}
        />
      </div>
      <IPagination
        current={Number(currentPage)}
        total={returnCount}
        onChange={changePage}
        pageSize={limit}
      />
    </div>
  );
}

export default connect(({ wayList }) => ({
  wayList,
}))(Index);
