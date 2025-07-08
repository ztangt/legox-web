import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Table, Modal, message, Input } from 'antd';
import IPagination from '../../../componments/public/iPagination';
import AddScene from './addScene';
import { BASE_WIDTH, ORDER_WIDTH } from '../../../util/constant';
import {dataFormat} from '../../../util/util'
import styles from '../index.less';

function SceneConfig({ dispatch, sceneConfig }) {
  const {
    tableData,
    currentPage,
    returnCount,
    limit,
    isShowAddModal,
    searchWord,
    selectedRowIds,
  } = sceneConfig;
  const { confirm } = Modal;
  const { Search } = Input;
  useEffect(() => {
    getSceneList(1, 10, '');
  }, []);
  //接口列表
  const getSceneList = (start, limit, searchWord) => {
    dispatch({
      type: 'sceneConfig/getSceneList',
      payload: {
        start,
        limit,
        searchWord,
      },
    });
  };
  // 启用
  const startOrStopUse = (isEnable, ids) => {
    let text = isEnable ? '启用' : '停用';
    if (ids.length <= 0) {
      message.error(`请选择要${text}的数据`);
    } else {
      confirm({
        title: `确认${text}吗?`,
        content: '',
        okText: text,
        cancelText: '取消',
        mask: false,
        getContainer: () => {
          return document.getElementById('sceneConfig_container');
        },
        onOk: () => {
          dispatch({
            type: 'sceneConfig/sceneEnable',
            payload: {
              isEnable,
              sceneIds: ids.join(','),
            },
            callback: ()=>{
              getSceneList(currentPage, limit, searchWord);
            }
          });
        },
      });
    }

  }

  
  //删除
  const deleteScene = ids => {
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
          return document.getElementById('sceneConfig_container');
        },
        onOk: () => {
          dispatch({
            type: 'sceneConfig/delScene',
            payload: {
              sceneIds: ids.join(','),
            },
            callback: ()=>{
              getSceneList(currentPage, limit, searchWord);
            }
          });
        },
      });
    }
  };

  const onDesign = (record) => {
    const {sceneId, sceneStylePath} = record;
    // let path = `/support/designer/portalDesigner?sceneId=${sceneId}&sceneStylePath=${sceneStylePath}`;
    let path = `/support/designer/portalDesigner?sceneId=${sceneId}&sceneStylePath=${sceneStylePath}`;
    window.open(`#${path}`, '_blank');
  };
  
  const tableProps = {
    rowKey: 'sceneId',
    columns: [
      {
        title: '序号',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: ORDER_WIDTH,
      },
      {
        title: '场景名称',
        dataIndex: 'sceneName',
        width: BASE_WIDTH,
        render: (text, record, index) => (
          <a 
            style={{cursor: 'pointer'}} 
            onClick={() => {
              addScene(record.id, '查看');
            }
          }>
            {text}
          </a>
        )
      },
      {
        title: '场景编号',
        dataIndex: 'sceneCode',
        width: BASE_WIDTH,
      },
      {
        title: '是否启用',
        dataIndex: 'isEnable',
        width: ORDER_WIDTH,
        render: text => {
          return text == 1 ? '是' : '否';
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: BASE_WIDTH,
        ellipsis: true,
        render: text => (
          <div className={styles.text} title={text}>
            {dataFormat(text, 'YYYY-MM-DD HH:mm')}
          </div>
        )
      },
      {
        title: '操作',
        dataIndex: 'sceneId',
        fixed: 'right',
        width: 160,
        render: (text, record) => {
          return (
            <>
              <a
                onClick={() => {
                  addScene(text);
                }}
              >
                修改
              </a>
              <a
                style={{ marginLeft: 8 }}
                onClick={() => {
                  deleteScene([text]);
                }}
              >
                删除
              </a>
              <a
                style={{ marginLeft: 8 }}
                onClick={() => {
                  onDesign(record)
                }}
              >
                场景布局
              </a>
            </>
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
          type: 'sceneConfig/updateStates',
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
      type: 'sceneConfig/updateStates',
      payload: {
        limit: size,
        currentPage: nextPage,
      },
    });
    getSceneList(nextPage, size, '');
  };
  //新增
  const addScene = (id, type) => {
    if (id) {
      dispatch({
        type: 'sceneConfig/getSceneSingle',
        payload: {
          sceneId: id,
        },
      });
    }
    dispatch({
      type: 'sceneConfig/updateStates',
      payload: {
        modalTitle: type,
        isShowAddModal: true,
      },
    });
  };
  //搜索
  const onSearch = value => {
    getSceneList(currentPage, limit, value);
  };
  const changeInput = e => {
    dispatch({
      type: 'sceneConfig/updateStates',
      payload: {
        searchWord: e.target.value,
      },
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Search
          onChange={changeInput}
          onSearch={onSearch}
          style={{ width: 220 }}
          value={searchWord}
          allowClear
          placeholder="请输入场景名称"
        />
        <div className={styles.header_button}>
          <Button
            onClick={() => {
              addScene('');
            }}
          >
            新增
          </Button>
          <Button
            onClick={() => {
              deleteScene(selectedRowIds);
            }}
          >
            删除
          </Button>
          <Button
            onClick={() => {
              startOrStopUse(1,selectedRowIds);
            }}
          >
            启用
          </Button>
          <Button
            onClick={() => {
              startOrStopUse(0,selectedRowIds);
            }}
          >
            停用
          </Button>
        </div>
      </div>
      <div className={styles.table}>
        <Table {...tableProps} scroll={{ y: 'calc(100vh - 290px)' }} />
      </div>
      <IPagination
        current={Number(currentPage)}
        total={returnCount}
        onChange={changePage}
        pageSize={limit}
        isRefresh={true}
        refreshDataFn={() => {
          getSceneList(1, limit, searchWord)
        }}
      />
      {isShowAddModal && <AddScene documentId="sceneConfig_container"/>}
    </div>
  );
}
export default connect(({ sceneConfig }) => ({ sceneConfig }))(SceneConfig);
