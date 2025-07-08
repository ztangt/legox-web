import { Button, Modal, message } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import BasicsTable from '../../components/basicsTable';
import IPagination from '../../components/public/iPagination';
import calcFn from '../../util/calc';
import {
  BASE_WIDTH,
  BIZSTATUS,
  EXECSTATE,
  ORDER_WIDTH,
} from '../../util/constant';
import { dataFormat, formattingMoney } from '../../util/util';
import styles from './index.less';
const { confirm } = Modal;
// const currentYear = String(new Date().getFullYear());
// 事前 200 0064
// bizInfoId=1598200946440290306    BIZ_ID
// &bizSolId=1574739159329853442    bizSolId
// &currentTab=2
// &id=1598200946440290307   ID  MAIN_TABLE_ID
// &isBudget=&title=%E6%9F%A5%E7%9C%8B
// formShow?
// bizInfoId=1598200946440290306
// &bizSolId=1572763471588720642
// &currentTab=1
// &id=1598200946440290307
// &isBudget=Y
// &microAppName=business_controls
// &title=%E6%9F%A5%E7%9C%8B&url=budgetTarget

// 事后  200  0039
// bizInfoId=1598537682500468737
// &bizSolId=1581958347769278466
// &currentTab=1
// &id=1598537682500468738
// &isBudget=&title=查看

// moneyType: 'FREEZE',

function Index({ location, dispatch, freezeOrExec }) {
  const { location: locationFromQK, openEvent } = useModel(
    '@@qiankunStateFromMaster',
  );
  const bizSolId = locationFromQK.query.bizSolId;

  const { formList, start, limit, currentPage, returnCount } = freezeOrExec;
  const {
    mainTableId,
    normCode,
    moneyType,
    currentYear,
  } = history.location.query;
  // const normCode = location.query.normCode;
  // const moneyType = location.query.moneyType;
  // const mainTableId = location.query.id;
  const [resList, setResList] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  // useEffect(() => {
  //   findBizSolId(window.location.href);
  // }, []);
  useEffect(() => {
    if (normCode && moneyType) {
      getList(start, limit);
    }
  }, [normCode, moneyType]);

  // function findBizSolId(url) {
  //   let i1 = url.indexOf('bizSolId=');
  //   let str1 = url.substring(i1);
  //   let i2 = str1.indexOf('&');
  //   bizSolId = str1.substring(9, i2);
  // }

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
      width: BASE_WIDTH,
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
      dataIndex: 'money',
      key: 'money',
      ellipsis: true,
      render: (text) => {
        return formattingMoney(text);
      },
    },
    // 单据状态字段，0：待发；1：在办；2： 办结 BIZSTATUS
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

  const resColumns = [
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
      width: BASE_WIDTH,
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
      dataIndex: 'money',
      key: 'money',
      ellipsis: true,
      render: (text) => {
        return formattingMoney(text);
      },
    },
    {
      title: '单据状态',
      dataIndex: moneyType === 'FREEZE' ? 'execState' : 'freezeState',
      key: moneyType === 'FREEZE' ? 'execState' : 'freezeState',
      ellipsis: true,
      render: (text) => {
        return EXECSTATE[text];
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
      type:
        moneyType === 'FREEZE'
          ? 'freezeOrExec/getFreezeFormList'
          : 'freezeOrExec/getExecuteFormList',
      payload: {
        start,
        limit,
        normCode,
        currentYear,
      },
    });
  }

  const onExpand = (expanded, record) => {
    if (!expanded) return;
    const { sourceId, normCode, execState, freezeState, beforeId } = record;
    console.log('onExpand', record);
    // // TODO
    // return
    dispatch({
      type:
        moneyType === 'FREEZE'
          ? 'freezeOrExec/findNormExecuteInfoByBeforeId'
          : 'freezeOrExec/findNormFreeBySourceIdList',
      payload: {
        sourceId,
        beforeId,
        normCode,
        // 报销未完成 0，报销已完成 1，撤销 2
        execState: moneyType === 'FREEZE' ? 1 : execState,
        freezeState: moneyType !== 'FREEZE' ? '' : freezeState,
        currentYear,
      },
      callback: (data) => {
        setResList({ ...resList, [record.id]: data });
      },
    });
  };

  const expandedRowRender = (record, index, indent, expanded) => {
    const rowSelection = {
      selectedRowKeys: selectedRowKey,
      onChange: (selectedRowKeys, selectedRows) => {
        setSelectedRowKey(selectedRowKeys);
        setSelectedRows(selectedRows);
      },
    };
    return (
      <BasicsTable
        bordered
        dispatch={dispatch}
        columns={resColumns}
        dataSource={resList[record.id]}
        pagination={false}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        onRow={(record) => {
          return {
            onClick: openFormDetail.bind(this, {}, {}, record, 'new'), // 点击行
          };
        }}
      />
    );
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKey,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKey(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };
  function onBackMoney() {
    if (selectedRowKey.length) {
      confirm({
        title: '',
        content: '确认退回金额吗？',
        onOk() {
          dispatch({
            type:
              moneyType === 'FREEZE'
                ? 'freezeOrExec/rollbackNormFreezeMoney'
                : 'freezeOrExec/rollbackNormExecuteMoney',
            payload: {
              sourceId: selectedRowKey[0],
              normCode,
              currentYear,
              mainTableId,
              bizSolId,
              actId: selectedRows[0].actId,
              bizInfoId: selectedRows[0].bizInfoId,
            },
            callback: (data) => {
              console.log(data);
            },
          });
        },
        onCancel() {},
      });
    } else {
      message.warning('请选择单据');
    }
  }

  function openFormDetail() {
    openEvent(
      arguments[0],
      arguments[1],
      arguments[2]?.sourceBizId,
      arguments[2],
      arguments[3],
    );
    // console.log(arguments);
    // if (moneyType === 'FREEZE') {
    //   // sourceId
    //   openEvent(arguments[0], arguments[1]?.sourceBizId, arguments[2], arguments[3]);
    // } else {
    // }
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
  let curNum = 0;
  formList.forEach((item) => {
    curNum = calcFn.add(curNum, item.money);
  });
  return (
    <div className={styles.container}>
      <div className={styles.control}>
        <Button onClick={() => onBackMoney()}>退回金额</Button>
        <Button onClick={() => history.push(`/budgetTarget`)}>返回</Button>
        <div className={'ml20'}>
          <span>本页总金额</span>
          <span className="gPrimary ml5 mr20">{formattingMoney(curNum)}</span>
        </div>
      </div>
      <div className={styles.list}>
        <BasicsTable
          // size="small"
          dispatch={dispatch}
          bordered
          expandable={{
            expandedRowRender,
            onExpand,
            rowExpandable: (record) => record.isDirectBill != 1,
          }}
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
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

export default connect(({ freezeOrExec }) => ({
  freezeOrExec,
}))(Index);
