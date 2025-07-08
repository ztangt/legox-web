import { connect } from 'dva';
import { Table, Button, Tree, Modal, message } from 'antd';
import IPagination from '../../../componments/public/iPagination';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import styles from '../index.less';
// import AddPlugin from './addPlugin';
import { dataFormat, getButton } from '../../../util/util';
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
// import AddPluginType from './addPluginType';
import ColumnDragTable from '../../../componments/columnDragTable'
function PluginManage({
  dispatch,
  loading,
  rightList,
  limit,
  returnCount,
  currentPage,
  curPlugType,
  selectedRowKeys,
  isShowAddPlugin,
  isShowAddPlugType,
  selectNodeInfo,
  user,
  treeData,
  currentNodeId,
  allPage,
  leftNum
}) {
  const pathname = '/pluginManageNoButton';
  const [nodeTreeItem, setNodeTreeItem] = useState(null);
  const [rightSelectedRecord, setRightSelectedRecord] = useState({});
  const { menus } = user;
  var viewDetailsModalRef; //查看Modalref
  useEffect(()=>{
    dispatch({
      type: 'pluginManageNoButton/getPlugTypeList',
      payload: {},
      callback: (data, plugTypeId) => {
        dispatch({
          type: 'getPlugList',
          payload: { start: 1, limit: 10, plugTypeId },
        });
      },
    });
  },[])

  useEffect(() => {
    dispatch({
      type: 'pluginManageNoButton/getPlugTypeList',
      payload: {},
      callback: (data, plugTypeId) => {
        dispatch({
          type: 'pluginManageNoButton/getPlugList',
          payload: { start: 1, limit: 10, plugTypeId },
        });
      },
    });
  }, []);
  useEffect(() => {
    treeData.forEach(item => {
      if (item.plugTypeId == currentNodeId) {
        dispatch({
          type: 'pluginManageNoButton/updateStates',
          payload: {
            typeName: item.typeName,
          },
        });
      }
    });
  }, [currentNodeId]);

  //插件TableProps
  const tableProps = {
    rowKey: 'plugId',
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
        align: 'left',
        width: 60,
        render: (text, record, index) => <div>{index + 1}</div>,
      },
      {
        title: '插件名称',
        dataIndex: 'plugName',
        align: 'left',
        width: 120,
        ellipsis: true,
        render: (text, record) => {
          return (
            <div title={text}>
              {getButton(menus, 'view') ? (
                <a
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    showDetails(record);
                  }}
                >
                  {text}
                </a>
              ) : (
                text
              )}
            </div>
          );
        },
      },
      // {
      //   title: '分类',
      //   dataIndex: 'plugType',
      //   align: 'center',
      //   render: text => {
      //     return text == 'PLUG__PLUG' ? '插件' : '操作手册';
      //   },
      // },
      {
        title: '插件描述',
        width: 100,
        ellipsis: true,
        dataIndex: 'plugDes',
        align: 'left',
      },
      {
        title: '格式',
        dataIndex: 'plugFormat',
        align: 'left',
        width: 80,
      },
      {
        title: '是否启用',
        dataIndex: 'isEnable',
        align: 'left',
        width: 90,
        render: text => {
          return text == 1 ? '是' : '否';
        },
      },
      {
        title: '上传人',
        dataIndex: 'uploadUserName',
        align: 'left',
      },
      {
        title: '上传时间',
        dataIndex: 'createTime',
        align: 'left',
        render: text => {
          return dataFormat(text, 'YYYY-MM-DD');
        },
      },
      {
        title: '操作',
        align: 'left',
        fixed:'right',
        render: (text, record, index) => {
          return (
            <div className={styles.actions}>
              {/* {
               (
                <a
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    changePlugin(record);
                  }}
                >
                  修改
                </a>
              )}
              {(
                <a
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    deletePlugin(record.plugId);
                  }}
                >
                  删除
                </a>
              )} */}
              {(
                <a
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    downLoadFile(record);
                  }}
                >
                  下载
                </a>
              )}
              {/* {!(index == 0 && currentPage == 1) && (
                <a
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    movePlugin(record, 1);
                  }}
                >
                  ↑
                </a>
              )}
              {
                !(index == rightList.length - 1 && currentPage == allPage) && (
                  <a
                    style={{ marginLeft: '5px' }}
                    onClick={() => {
                      movePlugin(record, 0);
                    }}
                  >
                    ↓
                  </a>
                )} */}
            </div>
          );
        },
      },
    ],
    dataSource: rightList,
    rowSelection: {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'pluginManageNoButton/updateStates',
          payload: {
            selectedRowKeys: selectedRowKeys,
          },
        });
      },
    },
  };
    //下载文件
  const downLoadFile = ( record) => {
    dispatch({
      type: 'pluginManageNoButton/getDownFileUrl',
      payload: {
        fileStorageId: record.fileStorageId,
      },
      callback: (url) => {
        global.location.href = url;
      },
    });
  };

  function showDetails(record) {
    viewDetailsModalRef.show([
      { key: '插件名称', value: record.plugName },
      // {
      //   key: '插件类型',
      //   value: (record.plugType = 'PLUG__PLUG' ? '插件' : '操作手册'),
      // },
      { key: '插件格式', value: record.plugFormat },
      {
        key: '是否启用',
        value: (record.isEnable == 1 ? '启用' : '禁用'),
      },
      { key: '上传人', value: record.uploadUserName },

      { key: '插件描述', value: record.plugDes, type: 3 },
      {
        key: '上传时间',
        value: dataFormat(record.uploadCreatTime, 'YYYY-MM-DD'),
      },
    ]);
  }

  //改变分类类型
  function changePlugType(select) {
    if (select.length != 0) {
      dispatch({
        type: 'pluginManageNoButton/updateStates',
        payload: {
          currentNodeId: select[0],
        },
      });
      getPlugList(select[0], currentPage, limit);
    }
    setNodeTreeItem(null);
  }
  //换页
  function changePage(start, limit) {
    getPlugList(curPlugType, start, limit);
  }

  //获取插件列表
  function getPlugList(plugTypeId, start, limit) {
    dispatch({
      type: 'pluginManageNoButton/getPlugList',
      payload: {
        plugTypeId,
        start,
        limit,
      },
    });
  }
  //新增
  const addPluginManageFn = obj => {
    dispatch({
      type: 'pluginManageNoButton/updateStates',
      payload: {
        isShowAddPlugin: true,
      },
    });
  };
  //修改
  function changePlugin(changePlugInfo) {
    dispatch({
      type: 'pluginManageNoButton/updateStates',
      payload: {
        isShowAddPlugin: true,
        changePlugInfo,
      },
    });
  }

  //删除
  function deletePlugin(plugId) {
    if (!plugId) {
      message.error('请选择插件!');
      return;
    }
    Modal.confirm({
      title: '确认删除',
      content: '确认删除该插件',
      okText: '删除',
      cancelText: '取消',
      mask: false,
      onOk() {
        dispatch({
          type: 'pluginManageNoButton/deletePlug',
          payload: {
            plugId,
          },
        });
      },
      getContainer: () => {
        return document.getElementById('pluginManageNoButton_container');
      },
    });
  }

  //启用或者禁用插件
  function enablePlugin(enable) {
    if (selectedRowKeys.length == 0) {
      return message.error('请至少选择一个插件!');
    }
    const plugIds = selectedRowKeys.join(',');
    dispatch({
      type: 'pluginManageNoButton/enablePlug',
      payload: {
        plugIds,
        enable,
      },
    });
  }

  function movePlugin(plug, moveType) {
    const plugId = plug.plugId;
    moveType = moveType ? 'UP' : 'DOWN';
    const sort = plug.sort;
    console.log(plugId, moveType, sort);
    dispatch({
      type: 'pluginManageNoButton/movePlug',
      payload: {
        plugType: curPlugType,
        plugId,
        moveType,
        sort,
      },
    });
  }

  function onAddPlugType() {
    dispatch({
      type: 'pluginManageNoButton/updateStates',
      payload: {
        isShowAddPlugType: true,
        changePlugTypeInfo: {},
      },
    });
  }

  function onChangePlugType(node) {
    dispatch({
      type: 'pluginManageNoButton/updateStates',
      payload: {
        isShowAddPlugType: true,
        changePlugTypeInfo: node,
      },
    });
    setNodeTreeItem(null);
  }

  function onDeletePlugType(node) {
    if (rightList.length != 0) {
      message.error('该分类下含有数据,请清空再删除');
      return;
    }
    setNodeTreeItem(null);

    Modal.confirm({
      title: '确认删除该分类吗？',
      content: '',
      okText: '删除',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'pluginManageNoButton/removePlugType',
          payload: {
            plugTypeId: node.plugTypeId,
          },
        });
      },
    });
  }

  const leftRender = () => {
    return (
      <div className={styles.tree_left_header}>
        {/* {getButton(menus, 'add') && (
          <Button
            type="primary"
            onClick={onAddPlugType.bind(this, '')}
            className={styles.button_types}
          >
            新增分类
          </Button>
        )} */}
        <Tree
          titleRender={node => (
            <span key={node.plugTypeId} title={node.typeName} className={styles.tree_node}>
              {node.typeName}
              {/* <span className={styles.edit}>
                {(
                  <span
                    onClick={() => onChangePlugType(node)}
                    style={{ marginLeft: '5px' }}
                    title="修改"
                  >
                    <EditOutlined />
                  </span>
                )}
                {(
                  <span
                    onClick={() => onDeletePlugType(node)}
                    style={{ marginLeft: '5px' }}
                    title="删除"
                  >
                    <DeleteOutlined />
                  </span>
                )}
              </span> */}
            </span>
          )}
          treeData={treeData}
          selectedKeys={[currentNodeId]}
          onSelect={changePlugType}
          isSearch={false}
          defaultExpandAll={true}
          style={{ width: '100%' }}
        />
      </div>
    );
  };
  const rightRender = () => {
    return (
      <div className={styles.table_warp}>
        <div className={styles.header}>
          <div className={styles.left}></div>
          {/* <div className={styles.right}>
            {(
              <Button type="primary" onClick={addPluginManageFn.bind(this, '')}>
                新增
              </Button>
            )}
            {(
              <Button
                onClick={deletePlugin.bind(this, selectedRowKeys.toString())}
              >
                删除
              </Button>
            )}
            {(
              <Button
                onClick={() => {
                  enablePlugin(1);
                }}
              >
                启用
              </Button>
            )}
            { (
              <Button
                onClick={() => {
                  enablePlugin(0);
                }}
              >
                禁用
              </Button>
            )}
          </div> */}
        </div>
        <div className={styles.content}>
          <ColumnDragTable
            {...tableProps}
            taskType ='MONITOR'
            // columns={columns}
            // dataSource={businessList}
            // rowKey="plugin"
            scroll={{ y: 'calc(100% - 110px)' }}
            pagination={false}
            // loading={loading.global}
          />
          <IPagination
            current={currentPage}
            total={returnCount}
            onChange={changePage}
            pageSize={limit}
            isRefresh={true}
            refreshDataFn={() => {
              changePage(1, limit);
            }}
          />
        </div>
      </div>
    );
  };
  return (
    <div className={styles.container} id="add_plugin">
      <ReSizeLeftRight
        vNum={leftNum}
        suffix={'pluginManageNoButton'}
        isExpandLeft={true}
        leftChildren={leftRender()}
        rightChildren={rightRender()}
      />
      {/* {isShowAddPlugin ? <AddPlugin /> : ''}
      {isShowAddPlugType ? <AddPluginType /> : ''} */}
      <ViewDetailsModal
        title="查看插件"
        containerId="add_plugin"
        ref={ref => {
          viewDetailsModalRef = ref;
        }}
      ></ViewDetailsModal>
    </div>
  );
}

export default connect(({ pluginManageNoButton, layoutG, loading, user }) => ({
  ...pluginManageNoButton,
  ...layoutG,
  loading,
  user,
}))(PluginManage);
