import { connect } from 'dva';
import { history, useDispatch } from 'umi';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Input,
  Form,
  Select,
  Table,
  Button,
  message,
  InputNumber,
} from 'antd';
import styles from './index.less';
import GlobalModal from "../../componments/GlobalModal";
import IPagination from "../../componments/public/iPagination.jsx";

import _ from 'lodash';
const { Option } = Select;
const GROUPTYPE = {
  1: '按钮类',
  2: '列表类',
  3: '控件类',
  4: '规则类',
  5: '其他类',
};
const listColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    render: (text, obj, index) => <div>{index + 1}</div>,
  },
  {
    title: '函数名称',
    dataIndex: 'funcName',
  },
  {
    title: '函数编码',
    dataIndex: 'funcCode',
  },
  {
    title: '函数引用类型',
    dataIndex: 'funcRefType',
    render: text => <span>{GROUPTYPE[text]}</span>,
  },
  {
    title: '语言类型',
    dataIndex: 'funcLangType',
  },
];

function Index({
  dispatch,
  form,
  namespace,
  stateInfo,
  dataName,
  tableColumnName,
  type,
}) {
  const { selectedIndex, funList, funCurrentPage, funReturnCount, searchValue } = stateInfo;
  let obj;
  if (type === 'warning') {
    obj = stateInfo[dataName];
  } else {
    obj = stateInfo[dataName][tableColumnName][selectedIndex];
  }
  const [selectKey, setSelectKey] = useState(obj?.buttonId);
  const [selectRow, setSelectRow] = useState([]);

  const rowSelection = {
    selectedRowKeys: [selectKey],
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectKey(selectedRowKeys.toString());
      setSelectRow(selectedRows);
    },
  };

  const onSearchTable = value => {
    dispatch({
      type: `${namespace}/getFuncLibList`,
      payload: {
        limit: 10,
        start: 1,
        funcRefType: '2,5',
        searchValue: value,
      },
    });
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        searchValue: value,
      },
    });
  };

  const onCancel = () => {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        isShowButtonModal: false,
        isShowWarnModal: false,
      },
    });
  };

  //保存
  const saveList = () => {
    if (!selectKey.length) {
      return;
    }
    if (type === 'warning') {
      stateInfo[dataName]['buttonId'] =
        selectRow[0].id;
      stateInfo[dataName]['minioUrl'] =
        selectRow[0].relativeUrl;
      stateInfo[dataName]['buttonName'] =
        selectRow[0].funcName;
    } else {
      stateInfo[dataName][tableColumnName][selectedIndex]['buttonId'] =
        selectRow[0].id;
      stateInfo[dataName][tableColumnName][selectedIndex]['minioUrl'] =
        selectRow[0].relativeUrl;
      stateInfo[dataName][tableColumnName][selectedIndex]['handleName'] =
        selectRow[0].funcName;
    }
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        [dataName]: stateInfo[dataName],
        isShowButtonModal: false,
        isShowWarnModal: false,
      },
    });
  };

  //重置到form到chu
  return (
    <GlobalModal
      visible={true}
      widthType={1}
      incomingWidth={900}
      incomingHeight={560}
      bodyStyle={{ overflow:"hidden"}}
      title="函数详情"
      onCancel={onCancel}
      mask={false}
      maskClosable={false}
      centered
      getContainer={() => {
        return document.getElementById('lr_container');
      }}
      footer={[
        <Button key="cancle" onClick={onCancel}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={saveList}>
          保存
        </Button>,
      ]}
    >
      <>
        <Input.Search
          style={{ width: 200 }}
          placeholder={'请输入函数名称、描述'}
          allowClear
          onSearch={value => {
            onSearchTable(value);
          }}
        />
        <Table
          scroll={{ y: 450 }}
          bordered
          dataSource={funList}
          columns={listColumns}
          rowClassName="editable-row"
          pagination={false}
          rowKey="id"
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
        />
        <IPagination
        style={{right: 150, bottom: 8}}
        showSizeChanger={false}
        showQuickJumper={false}
        current={funCurrentPage}
        total={funReturnCount}
        onChange={(page, size) => {
          dispatch({
            type: `${namespace}/getFuncLibList`,
            payload: {
              limit: 10,
              start: page,
              funcRefType: '2,5',
              searchValue,
            },
          });
          dispatch({
            type: `${namespace}/updateStates`,
            payload: {
              funCurrentPage: page,
              // limit: size,
            },
          });
        }}
        pageSize={10}
        />
      </>
    </GlobalModal>
  );
}

export default Index;
