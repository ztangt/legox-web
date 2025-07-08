import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Table, Modal, message, Input } from 'antd';
import IPagination from '../../../componments/public/iPagination';
import AddInterface from './addInterface';
import { BASE_WIDTH, ORDER_WIDTH } from '../../../util/constant';
import copy from 'copy-to-clipboard';
import styles from '../index.less';
import ColumnDragTable from '../../../componments/columnDragTable'
import searchIcon from '../../../../public/assets/search_black.svg'
function interfaceManagement({ dispatch, interfaceManagement }) {
  const {
    tableData,
    currentPage,
    returnCount,
    limit,
    isShowAddInterface,
    search,
    selectedRowIds,
  } = interfaceManagement;
  const { confirm } = Modal;
  const { Search } = Input;
  useEffect(() => {
    if(limit>0){
      getApiManageList(1, limit, '');
    }
  }, [limit]);
  //接口列表
  const getApiManageList = (start, limit, search) => {
    dispatch({
      type: 'interfaceManagement/getApiManageList',
      payload: {
        start,
        limit,
        search,
      },
    });
  };
  //删除接口
  const deleteInterface = ids => {
    if (ids.length <= 0) {
      message.error('请选择要删除的数据');
    } else {
      confirm({
        title: '确认删除吗?',
        content: '',
        okText: '删除',
        cancelText: '取消',
        mask: false,
        getContainer: () => {
          return document.getElementById('interfaceManagement_container');
        },
        onOk: () => {
          dispatch({
            type: 'interfaceManagement/deleteApiManage',
            payload: {
              ids: ids.join(','),
            },
          });
        },
      });
    }
  };
  //复制url
  const copyUrl = url => {
    if (url && copy(url)) {
      message.success('复制成功');
    }
  };
  const tableProps = {
    rowKey: 'id',
    columns: [
      {
        title: '序号',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: ORDER_WIDTH,
      },
      {
        title: '接口名称',
        dataIndex: 'name',
        width: BASE_WIDTH,
        ellipsis:true,
        render:(text)=><span style={{cursor:'pointer'}}>{text}</span>
      },
      {
        title: '接口方式',
        dataIndex: 'apiMethod',
        width: BASE_WIDTH,
      },
      {
        title: '接口路径',
        dataIndex: 'apiUrl',
        width: BASE_WIDTH * 2.5,
        ellipsis: true,
        render: text => (
          <span
            title={text}
            className={styles.title}
            onClick={() => {
              copyUrl(text);
            }}
          >
            {text}
          </span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'id',
        fixed: 'right',
        width: BASE_WIDTH,
        render: text => {
          return (
            <div className='table_operation'>
              <a
                onClick={() => {
                  addInterface(text);
                }}
              >
                修改
              </a>
              <a
                onClick={() => {
                  deleteInterface([text]);
                }}
              >
                删除
              </a>
            </div>
          );
        },
      },
    ],
    dataSource: tableData,
    pagination: false,
    rowSelection: {
      selectedRowKeys: selectedRowIds,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, 'selectedRowKeys');
        dispatch({
          type: 'interfaceManagement/updateStates',
          payload: {
            selectedRowIds: selectedRowKeys,
          },
        });
      },
    },
  };
  //分页
  const changePage = (nextPage, size) => {
    dispatch({
      type: 'interfaceManagement/updateStates',
      payload: {
        limit: size,
        currentPage: nextPage,
      },
    });
    getApiManageList(nextPage, size, '');
  };
  //新增
  const addInterface = id => {
    console.log(id);
    if (id) {
      dispatch({
        type: 'interfaceManagement/getDetailApiManage',
        payload: {
          apiId: id,
        },
      });
    }
    dispatch({
      type: 'interfaceManagement/updateStates',
      payload: {
        isShowAddInterface: true,
      },
    });
  };
  //搜索
  const onSearch = value => {
    getApiManageList(currentPage, limit, value);
  };
  const changeInput = e => {
    dispatch({
      type: 'interfaceManagement/updateStates',
      payload: {
        search: e.target.value,
      },
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.header} id='list_head'>
        <Search
          onChange={changeInput}
          onSearch={onSearch}
          style={{ width: 220 }}
          value={search}
          allowClear
          placeholder="请输入接口名称/接口路径"
          enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
        />
        <div className={styles.header_button}>
          <Button
            onClick={() => {
              addInterface('');
            }}
          >
            新增
          </Button>
          <Button
            onClick={() => {
              deleteInterface(selectedRowIds);
            }}
          >
            删除
          </Button>
        </div>
      </div>
      <div className={styles.table}>
        <ColumnDragTable taskType="MONITOR" modulesName="interfaceManagement" {...tableProps} scroll={{ y: 'calc(100% - 45px)' }} />
      </div>
      <IPagination
        current={Number(currentPage)}
        total={returnCount}
        onChange={changePage}
        pageSize={limit}
      />
      {isShowAddInterface && <AddInterface />}
    </div>
  );
}
export default connect(({ interfaceManagement }) => ({ interfaceManagement }))(
  interfaceManagement,
);
