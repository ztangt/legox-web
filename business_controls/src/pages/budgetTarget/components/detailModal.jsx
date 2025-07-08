import React, { useContext, useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import { history, useModel } from 'umi';
import { Modal, Table } from 'antd';
import { dataFormat } from '../../../util/util';

function DetailModal({ dispatch, budgetTarget, currentYear = '2022' }) {
  const { detailList, normCode } = budgetTarget;
  const { location: locationFromQK, openEvent } = useModel(
    '@@qiankunStateFromMaster',
  );
  const { url, title } = locationFromQK.query;

  useEffect(() => {
    getDetailList();
  }, []);
  const getDetailList = () => {
    dispatch({
      type: 'budgetTarget/getDetailList',
      payload: {
        normCode,
        currentYear,
      },
    });
  };
  const handelCanel = () => {
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        isShowDetailModal: false,
      },
    });
  };

  const onTitleClick = (v) => {
    if (v?.sourceBizId) {
      openEvent({}, {}, v?.sourceBizId, v, 'new');
      // dispatch({
      //   type: 'budgetTarget/updateStates',
      //   payload: {
      //     isShowDetailModal: false,
      //   },
      // });
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '说明',
      dataIndex: 'history',
      key: 'history',
      ellipsis: true,
      width: 200,
      render: (text, record, idx) => {
        return (
          <div>
            <a onClick={() => onTitleClick(record)}>{record.sourceBizTitle}</a>
            {JSON.parse(record?.history).map((item, index) => {
              return (
                <p
                  key={index}
                  title={`${item.columnName}:${item.fromVal}->${item.toVal}`}
                >
                  {item.columnName === '登记创建' && item.toVal === ''
                    ? `${item.columnName}`
                    : `${item.columnName}:${item.fromVal}->${item.toVal}`}
                </p>
              );
            })}
          </div>
        );
      },
    },
    {
      title: '业务类型',
      dataIndex: 'sourceMenuName',
      key: 'sourceMenuName',
      ellipsis: true,
      width: 100,
    },
    {
      title: '操作人',
      dataIndex: 'operateIdentityName',
      key: 'operateIdentityName',
      ellipsis: true,
      width: 100,
    },
    {
      title: '操作时间',
      dataIndex: 'operateIdentityTime',
      key: 'operateIdentityTime',
      ellipsis: true,
      width: 100,
      render: (text) => {
        return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
      },
    },
  ];
  return (
    <Modal
      title="调整记录"
      visible={!title && url == 'budgetTarget' ? true : false}
      onCancel={handelCanel}
      maskClosable={false}
      mask={false}
      centered
      width={1000}
      bodyStyle={{ height: 500 }}
      getContainer={() => {
        return document.getElementById('budgetTarget_id');
      }}
      onOk={handelCanel}
    >
      <Table
        columns={columns}
        dataSource={detailList}
        bordered
        scroll={{ x: '100%', y: 400 }}
      />
    </Modal>
  );
}
export default connect(({ budgetTarget }) => ({ budgetTarget }))(DetailModal);
