import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Input, Button, Table, Space, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from '../index.less';
import AddEventModel from './addEventModel';
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import { getButton } from '../../../util/util';
import IPagination from '../../../componments/public/iPagination';
import ColumnDragTable from '../../../componments/columnDragTable'

function EventRegister({ dispatch, eventRegister, layoutG, user }) {
  const {
    returnCount, //总条目数
    limit,
    currentPage,
    searchWord,
    eventData, //列表数据
    isShowAddModal,
    eventId,
    tableData,
  } = eventRegister;
  console.log('returnCount', returnCount);
  var viewDetailsModalRef; //查看Modalref
  const [record, setRecord] = useState({});
  const { menus } = user;
  useEffect(() => {
    dispatch({
      type: 'eventRegister/getEventTableData',
      payload: {
        start: 1,
        limit: limit,
        searchWord: '',
      },
    });
  }, []);

  //枚举值详情修改
  const onEventModify = record => {
    setEventAddOrModify('modifyEvent');
    setRecord(record);
    dispatch({
      type: 'eventRegister/getDataDriverList',
      payload: {},
      callback: () => {
        dispatch({
          type: 'eventRegister/updateStates',
          payload: {
            isShowAddModal: true,
          },
        });
      },
    });
  };

  const onEventDelete = record => {
    Modal.confirm({
      title: '确认是否删除?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '删除',
      cancelText: '取消',
      onOk: async () => {
        await dispatch({
          type: 'eventRegister/deletaEventRegister',
          payload: {
            id: record.id,
            type: 'one', // 单个删除
          },
        });
        await dispatch({
          type: 'eventRegister/getEventTableData',
          payload: {
            start: 1,
            limit: limit,
            searchWord: '',
          },
        });
      },
    });
  };

  const [eventAddOrModify, setEventAddOrModify] = useState('');
  const tableProps = {
    rowKey: 'id',
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
        width: 60,
        render: (text, record, index) => <div>{index + 1}</div>,
      },
      {
        title: '事件名称',
        dataIndex: 'eventName',
        width: 250,
        render: (text, record) => (
          <div className={styles.text} title={text}>
            {getButton(menus, 'view') && (
              <a
                onClick={() => {
                  showDetails(record);
                }}
              >
                {text}
              </a>
            )}
          </div>
        ),
      },
      {
        title: '方法名称',
        dataIndex: 'eventMethod',
        width: 250,
        render: text => (
          <div className={styles.text} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 250,
        render: text => (
          <div className={styles.text} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 120,
        render: (text, record) => {
          return (
            <div className={styles.actions}>
              <Space>
                {getButton(menus, 'update') && (
                  <a
                    style={{ marginLeft: '5px' }}
                    onClick={() => {
                      onEventModify(record);
                    }}
                  >
                    修改
                  </a>
                )}
                {getButton(menus, 'delete') && (
                  <a
                    style={{ marginLeft: '5px' }}
                    onClick={() => {
                      onEventDelete(record);
                    }}
                  >
                    删除
                  </a>
                )}
              </Space>
            </div>
          );
        },
      },
    ],
    dataSource: eventData,
    pagination: false,
    rowSelection: {
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'eventRegister/updateStates',
          payload: {
            eventId: selectedRowKeys,
          },
        });
      },
    },
  };

  //搜索
  const onSearchTable = value => {
    if (checkWOrd(value)) {
      message.error('搜索词中包含特殊字符！');
      return;
    }
    if (value) {
      dispatch({
        type: 'eventRegister/getEventTableData',
        payload: {
          start: 1,
          limit: limit,
          searchWord: value,
        },
      });
    }
  };

  /**
   * 搜索框内容校验是否包含特殊字符
   * @param {*校验值} value
   */
  const checkWOrd = value => {
    let specialKey =
      "[`·~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
    for (let i = 0; i < value.length; i++) {
      if (specialKey.indexOf(value.substr(i, 1)) != -1) {
        return true;
      }
    }
    return false;
  };

  //事件注册新增
  const onEventAdd = () => {
    setEventAddOrModify('addEvent');
    // 获取数据驱动推送方案
    dispatch({
      type: 'eventRegister/getDataDriverList',
      payload: {},
      callback: () => {
        dispatch({
          type: 'eventRegister/updateStates',
          payload: {
            isShowAddModal: true,
          },
        });
      },
    });
  };

  //搜索词
  const onChangeSearchWord = e => {
    console.log(e.target.value);
    dispatch({
      type: 'eventRegister/updateStates',
      payload: {
        searchWord: e.target.value,
      },
    });
    if (!e.target.value) {
      dispatch({
        type: 'eventRegister/getEventTableData',
        payload: {
          start: 1,
          limit: limit,
          searchWord: '',
        },
      });
    }
  };

  //批量删除
  const onEventRegisterDelete = () => {
    if (eventId != '') {
      Modal.confirm({
        title: '确认是否删除?',
        icon: <ExclamationCircleOutlined />,
        content: '',
        okText: '删除',
        cancelText: '取消',
        onOk: async () => {
          await dispatch({
            type: 'eventRegister/deletaEventRegister',
            payload: {
              ids: eventId.join(","),
            },
          });
          await dispatch({
            type: 'eventRegister/getEventTableData',
            payload: {
              start: 1,
              limit: limit,
              searchWord: '',
            },
          });
        },
      });
    } else {
      message.error('请先勾选一条');
    }
  };

  function showDetails(record) {
    dispatch({
      type: 'eventRegister/getEventRegisterParams',
      payload: {
        eventId: record.id,
      },
    });
    viewDetailsModalRef.show([
      { key: '事件名称', value: record.eventName },
      { key: '方法名称', value: record.eventMethod },
      //    { key: '数据驱动推送', value: record.bpmFlag, type: 1 },

      { key: '备注', value: record.remark, type: 3 },
      { key: '创建时间', value: record.createTime, type: 2 },
    ]);
  }

  return (
    <div className={styles.container}>
      <div className={styles.other}>
        <Input.Search
          className={styles.search}
          placeholder={'请输入事件名称'}
          allowClear
          defaultValue={searchWord}
          onChange={onChangeSearchWord.bind(this)}
          onSearch={value => {
            onSearchTable(value);
          }}
        />
        <Space>
          <div className={styles.bt_gp}>
            {getButton(menus, 'add') && (
              <Button type="primary" onClick={onEventAdd}>
                新增
              </Button>
            )}
            {getButton(menus, 'delete') && (
              <Button onClick={onEventRegisterDelete}>删除</Button>
            )}
          </div>
        </Space>
      </div>
      <ColumnDragTable {...tableProps} taskType ='MONITOR' scroll={{ y:'calc(100% - 150px) '}} />

      <div
        style={{
          marginTop: '40px',
          paddingBottom: '10px',
        }}
      >
        <IPagination
          current={currentPage}
          total={returnCount}
          pageSize={limit}
          isRefresh={true}
          refreshDataFn={() => {
            dispatch({
              type: 'eventRegister/getEventTableData',
              payload: {
                start: 1,
                limit: limit,
                searchWord,
              },
            });
          }}
          onChange={(page, size) => {
            dispatch({
              type: 'eventRegister/getEventTableData',
              payload: {
                start: page,
                limit: size,
                searchWord,
              },
            });

            dispatch({
              type: 'eventRegister/updateStates',
              payload: {
                currentPage: page,
                limit: size,
              },
            });
          }}
        />
      </div>

      {isShowAddModal && (
        <AddEventModel eventAddOrModify={eventAddOrModify} record={record} />
      )}
      <ViewDetailsModal
        title="查看事件注册器"
        containerId="eventRegister_container"
        ref={ref => {
          viewDetailsModalRef = ref;
        }}
        data={tableData}
      ></ViewDetailsModal>
    </div>
  );
}
export default connect(({ eventRegister, layoutG, user }) => ({
  eventRegister,
  layoutG,
  user,
}))(EventRegister);
