import { connect } from 'dva';
import { Input, Space, Button, Table, Modal, message, Menu, Dropdown } from 'antd';
import ADD from './addForm.jsx';
import _ from 'lodash';
import IPagination from '../../../componments/public/iPagination.jsx';
import copy from 'copy-to-clipboard';
import { useEffect } from 'react'
import ColumnDragTable from '../../../componments/columnDragTable/index.jsx';
import { ORDER_WIDTH, BASE_WIDTH } from '../../../util/constant.js'
import styles from '../index.less';
import searchIcon from '../../../../public/assets/search_black.svg'

function FunManage({
  dispatch,
  loading,
  addModal,
  addObj,
  funList,
  parentIds,
  user,
  currentPage,
  limit,
  returnCount,
  searchValue,
}) {

  const GROUPTYPE = {
    1: '按钮类',
    2: '列表类',
    3: '控件类',
    4: '规则类',
    5: '其他类',
  };

  useEffect(() => {
    if (limit > 0) {
      dispatch({
        type: 'funManage/getFuncLibList',
        payload: {
          searchValue,
          limit,
          start: currentPage,
          // funcRefType: 1,
        },
      });
    }

  }, [currentPage, limit])

  // useEffect(() => {
  //   if (!addModal) {
  //     dispatch({
  //       type: 'funManage/updateStates',
  //       payload: {
  //         loading: false,
  //       },
  //     });
  //   }

  // }, [addModal])

  const tableProps = {
    rowKey: 'id',
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
        width: ORDER_WIDTH,
        render: (text, record, index) => <div>{index + 1}</div>,
      },
      {
        title: '函数名称',
        dataIndex: 'funcName',
        width: BASE_WIDTH,
        render: (text, obj) => (
          <a
            style={{ display: 'inline-block', width: BASE_WIDTH }}
            onClick={() => {
              showDetails(obj);
            }}
            title={text}
            className={styles.buttonName}
          >
            {text}
          </a>
        ),
      },
      {
        title: '函数编码',
        dataIndex: 'funcCode',
        width: BASE_WIDTH,
      },
      {
        title: '函数引用类型',
        dataIndex: 'funcRefType',
        width: BASE_WIDTH,
        render: (text, record) => {
          return (
            <div>
              <span>{GROUPTYPE[text]}</span>
            </div>
          );
        },
      },
      {
        title: '函数描述',
        dataIndex: 'funcDec',
        width: BASE_WIDTH * 2.5,
        render:(text)=><span style={{ display: 'inline-block',width:BASE_WIDTH*2.5 -16}} title={text} className={styles.buttonName}>{text}</span>

      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: BASE_WIDTH * 1.5,
        render: (text, record) => {
          return (
            <div>
              <Space>
                <a onClick={() => onAdd(record)}>修改</a>
                <a onClick={onDelete.bind(this, record.id)}>删除</a>
              </Space>
            </div>
          );
        },
      },
    ],
    dataSource: funList,
    loading: loading,
    pagination: false,
    scroll: { y: 'calc(100% - 45px)' },
    rowSelection: {
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'funManage/updateStates',
          payload: {
            parentIds: selectedRowKeys,
          },
        });
      },
      type: 'checkbox',
    },
  };
  
  function showDetails(addObj) {
    dispatch({
      type: 'funManage/updateStates',
      payload: {
        addModal: true,
        addObj,
        isShow: true,
      },
    });
  }
  function getTextByJs(arr) {
    var str = '';
    for (var i = 0; i < arr.length; i++) {
      str += arr[i] + ',';
    }
    if (str.length > 0) {
      str = str.substr(0, str.length - 1);
    }
    return str;
  }
  //新增或者修改
  const onAdd = addObj => {
    dispatch({
      type: 'funManage/updateStates',
      payload: {
        addModal: true,
        addObj,
      },
    });
  };
  //导出
  const exportApply=(ids)=>{
    dispatch({
      type:'funManage/exportApplyCorrelation',
      payload:{
        funcLibIds:ids.join(',')
      }
    })
  }
  //删除
  function onDelete(id) {
    let ids = '';
    if (id) {
      ids = id;
    } else {
      if (parentIds.length == 0) {
        message.error('请最少选择一条数据');
        return;
      } else {
        ids = getTextByJs(JSON.parse(JSON.stringify(parentIds)));
      }
    }
    Modal.confirm({
      title: '确认删除吗？',
      content: '',
      okText: '删除',
      cancelText: '取消',
      mask: false,
      onOk() {
        dispatch({
          type: 'funManage/delFuncLib',
          payload: {
            funcLibIds: ids,
          },
          callback: () => {
            //清空
            dispatch({
              type: 'funManage/updateStates',
              payload: {
                parentIds: [],
              },
            });
          },
        });
      },
      getContainer: () => {
        return document.getElementById('funManage_container');
      },
    });
  }
  function onCancel() {
    dispatch({
      type: 'funManage/updateStates',
      payload: {
        addModal: false,
        isShow: false,
      },
    });
  }

  
  // const onAddSubmit = _.debounce(updateGroupChange, 100, { maxWait: 1000 })


  //新增或修改 回调
  function onAddSubmit(values) {
    dispatch({
      type: 'funManage/updateStates',
      payload: {
        loading: true,
      },
    });
    // values.thenEvent=values.thenEventPath
    // delete values.thenEventPath
    // 如果有addObj.buttonId则为编辑
    if (addObj.id) {
      values['id'] = addObj.id;
      dispatch({
        type: 'funManage/updateFuncLib',
        payload: values,
        callback: function () {
          dispatch({
            type: 'funManage/updateStates',
            payload: {
              addModal: false,
              loading: false,
            },
          });
        },
      });
    } else {
      console.log(values);
      // 新增
      dispatch({
        type: 'funManage/saveFuncLib',
        payload: values,
        callback: function () {
          dispatch({
            type: 'funManage/updateStates',
            payload: {
              addModal: false,
              loading: false,
              addObj: {},
            },
          });
        },
      });
    }
  }

  function onSearchTable(value) {
    dispatch({
      type: 'funManage/updateStates',
      payload: {
        currentPage: 1,
        searchValue: value,
      },
    });

    dispatch({
      type: 'funManage/getFuncLibList',
      payload: {
        searchValue: value,
        limit,
        start: 1,
      },
    });
  }

  return (
    <div
      id="fun_manage"
      className={styles.funManage}
    >
      <div className={styles.other} id='list_head'>
        <Input.Search
          className={styles.search}
          placeholder={'请输入函数名称'}
          allowClear
          onSearch={value => {
            onSearchTable(value);
          }}
          enterButton={<img src={searchIcon} style={{ marginRight: 8, marginTop: -3, marginLeft: 2 }} />}
        />
        <Space>
          {/* {getButton(menus, 'add') && ( */}
          <Button
            type="primary"
            onClick={() => onAdd({})}
            className={styles.fontSize7}
          >
            新增
          </Button>
          {/* )} */}
          {/* {getButton(menus, 'delete') && ( */}
          <Button
            onClick={onDelete.bind(this, '')}
            className={styles.fontSize7}
          >
            删除
          </Button>
          <Button 
            onClick={()=>{exportApply(parentIds)}}
            className={styles.fontSize7}
          >
            导出
          </Button>
          {/* )} */}
        </Space>
      </div>
      <div style={{ height: 'calc(100% - 80px)' }}>
        <ColumnDragTable taskType="MONITOR" modulesName="funManage" {...tableProps}/>
      </div>
      <IPagination
        current={currentPage}
        total={returnCount}
        onChange={(page, size) => {
          dispatch({
            type: 'funManage/updateStates',
            payload: {
              currentPage: page,
              limit: size,
            },
          });
        }}
        pageSize={limit}
        isRefresh={true}
        refreshDataFn={() => {
          dispatch({
            type: 'funManage/updateStates',
            payload: {
              currentPage: 1
            }
          })
          dispatch({
            type: 'funManage/getFuncLibList',
            payload: {
              searchValue,
              start: 1,
              limit,
            },
          });
        }}
      />
      {/* 新增 */}
      {addModal && (
        <ADD
          addObj={addObj}
          setValues={values => {
            dispatch({
              type: 'funManage/updateStates',
              payload: {
                addObj: { ...addObj, ...values },
              },
            });
          }}
          loading={loading}
          onCancel={onCancel.bind(this)}
          onAddSubmit={onAddSubmit.bind(this)}
        />
      )}
    </div>
  );
}
export default connect(({ funManage, user }) => ({
  ...funManage,
  user,
}))(FunManage);
