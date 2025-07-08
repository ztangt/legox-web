import { connect } from 'dva';
import { Input, Space, Button, Table, Modal, message } from 'antd';
import styles from '../index.less';
import { dataFormat, getButton } from '../../../util/util.js';
import { useEffect } from 'react';
import IPagination from '../../../componments/public/iPagination';
import ADD from './addForm';
import ASSOCIATED from './associatedButton';
import { GROUPTYPE } from '../../../service/constant';
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import {} from '@ant-design/icons';
import ColumnDragTable from '../../../componments/columnDragTable';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import searchIcon from '../../../../public/assets/search_black.svg'
import { parse } from 'query-string';
import { history } from 'umi'
function FormEngine({
  location,
  dispatch,
  loading,
  addModal,
  addObj,
  associatedModal,
  buttonGroupsList,
  returnCount,
  parentIds,
  buttonIds,
  searchWord,
  currentPage,
  limit,
  user,
  isView
}) {
  const { menus } = user;
  var viewDetailsModalRef; //查看Modalref
  const query = parse(history.location.search);
  useEffect(() => {
    if(limit>0){
      dispatch({
        type: 'buttonSolution/getButtonGroups',
        payload: {
          searchValue: searchWord,
          start: currentPage,
          limit,
        },
      });
    }
  }, [limit,currentPage]);
  const pathname = '/buttonSolution';
  const tableProps = {
    rowKey: 'groupId',
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        width: ORDER_WIDTH,
        render: (text, obj, index) => <span>{index + 1}</span>,
      },
      {
        title: '按钮方案名称',
        dataIndex: 'groupName',
        width:BASE_WIDTH,
        render: (text, obj) => (
          <a  title={text} style={{ display: 'inline-block',width:BASE_WIDTH -16}} className={styles.buttonName} onClick={showDetails.bind(this, obj)}>{text}</a>
        ),
      },
      {
        title: '方案编码',
        dataIndex: 'groupCode',
        width:BASE_WIDTH,
        ellipsis:true
      },
      {
        title: '方案类型',
        dataIndex: 'groupType',
        width:BASE_WIDTH,
        render: (text, record) => {
          return (
            <div>
              <span>
                {text && GROUPTYPE.filter(info => info.key == text).length
                  ? GROUPTYPE.filter(info => info.key == text)[0].name
                  : ''}
              </span>
            </div>
          );
        },
      },
      {
        title: '方案描述',
        dataIndex: 'groupDesc',
        width:BASE_WIDTH*2.5,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width:BASE_WIDTH*1.5,
        render: (text, record) => {
          return (
            <div className='table_operation'>
              <>
                {getButton(menus, 'update') && (
                  <a onClick={onAdd.bind(this, record)}>修改</a>
                )}
                {getButton(menus, 'delete') && (
                  <a onClick={onDelete.bind(this, record.groupId)}>删除</a>
                )}
                <a onClick={onAssociated.bind(this, record)}>关联按钮</a>
              </>
            </div>
          );
        },
      },
    ],
    dataSource: buttonGroupsList,
    loading: loading.global,
    scroll: { y: 'calc(100% - 45px)' },
    pagination: false,
    rowSelection: {
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'buttonSolution/updateStates',
          payload: {
            parentIds: selectedRowKeys,
          },
        });
      },
      type: 'checkbox',
    },
  };
  function showDetails(record) {
    onAdd(record)
    dispatch({
      type:'buttonSolution/updateStates',
      payload:{
        isView:true
      }
    })
    // viewDetailsModalRef.show([
    //   { key: '按钮方案名称', value: record.groupName },
    //   { key: '方案编码', value: record.groupCode },
    //   {
    //     key: '方案类型',
    //     value: record.groupType
    //       ? GROUPTYPE.filter(info => info.key == record.groupType)[0].name
    //       : '',
    //   },
    //   { key: '按钮描述', value: record.groupDesc, type: 3 },
    // ]);
  }
  function onAdd(addObj) {
    console.log('addObj', addObj);
    dispatch({
      type: 'buttonSolution/updateStates',
      payload: {
        addModal: true,
        addObj,
      },
    });
  }
  //新增或修改 回调
  function onAddSubmit(values, text) {
    if (text == '新增') {
      dispatch({
        type: 'buttonSolution/addButtonGroups',
        payload: {
          ...values,
        },
        callback: function() {
          dispatch({
            type: 'buttonSolution/updateStates',
            payload: {
              addModal: false,
            },
          });
        },
      });
    } else {
      values['groupId'] = addObj.groupId;
      dispatch({
        type: 'buttonSolution/updateButtonGroups',
        payload: {
          ...values,
        },
        callback: function() {
          dispatch({
            type: 'buttonSolution/updateStates',
            payload: {
              addModal: false,
            },
          });
        },
      });
    }
  }
  const onAssociated= async(addObj)=> {
    await dispatch({
      type: 'buttonSolution/getButtons',
      payload: {
        searchValue: '',
        buttonTypeName: addObj.groupType.split('_')[0],
        buttonSourceName:'CUSTOM'
      },
      callback:()=>{
        dispatch({
          type: 'buttonSolution/getButtonIds',
          payload: {
            buttonGroupId: addObj.groupId,
          },
        });
      }
    });
    await dispatch({
      type: 'buttonSolution/updateStates',
      payload: {
        associatedModal: true,
        isShowDefault: true,
        addObj,
        buttonIds: [],
      },
    });
    console.log('buttonIds-----打开', buttonIds);
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
          type: 'buttonSolution/deleteButtonGroups',
          payload: {
            buttonGroupIds: ids,
          },
          callback: () => {
            dispatch({
              type: 'buttonSolution/updateStates',
              payload: {
                parentIds: [],
              },
            });
          },
        });
      },
      getContainer: () => {
        return document.getElementById('buttonSolution_container');
      },
    });
  }

  function onCancel() {
    dispatch({
      type: 'buttonSolution/updateStates',
      payload: {
        addModal: false,
        associatedModal: false,
        isShowDefault: false,
        isView:false
      },
    });
  }

  function getButtonGroups(start, searchValue, limit) {
    dispatch({
      type: 'buttonSolution/updateStates',
      payload: {
        limit,
      },
    });
    dispatch({
      type: 'buttonSolution/getButtonGroups',
      payload: {
        searchValue,
        start,
        limit,
      },
    });
  }

  function onSearchTable(value) {
    getButtonGroups(1, value, limit);
    dispatch({
      type: 'buttonSolution/updateStates',
      payload: {
        searchWord: value,
        currentPage: 1,
      },
    });
  }

  return (
    <div  id="button_solution" className={styles.buttonSolution_content}>
      <div className={styles.other} id='list_head'>
        <Input.Search
          className={styles.search}
          placeholder={'请输入按钮方案名称、描述'}
          allowClear
          onSearch={value => {
            onSearchTable(value);
          }}
          enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
        />
        <Space>
          <Button
            type="primary"
            onClick={onAdd.bind(this, {})}
            className={styles.fontSize7}
          >
            新增
          </Button>
          {getButton(menus, 'delete') && (
            <Button
              onClick={onDelete.bind(this, '')}
              className={styles.fontSize7}
            >
              删除
            </Button>
          )}
        </Space>
      </div>
      <div style={{height:'calc(100% - 80px)'}}>
        <ColumnDragTable {...tableProps} taskType="MONITOR" modulesName="buttonSolution"/>
      </div>
        <IPagination
          current={currentPage}
          total={returnCount}
          onChange={(page, size) => {
            dispatch({
              type: 'buttonSolution/updateStates',
              payload: {
                currentPage: page,
                limit: size,
              },
            });
            // getButtonGroups(page, searchWord, size);
          }}
          pageSize={limit}
          isRefresh={true}
          refreshDataFn={() => {
            dispatch({
              type:'buttonSolution/updateStates',
              payload:{
                currentPage:1
              }
            })
            getButtonGroups(1, searchWord, limit);
          }}
        />

      {addModal && (
        <ADD //新增
          addObj={addObj}
          setValues={values => {
            dispatch({
              type: 'buttonSolution/updateStates',
              payload: {
                addObj: { ...addObj, ...values },
              },
            });
          }}
          loading={loading.global}
          onCancel={onCancel.bind(this)}
          onAddSubmit={onAddSubmit.bind(this)}
        />
      )}
      {associatedModal && (
        <ASSOCIATED //关联按钮
          addObj={addObj}
          loading={loading.global}
          onCancel={onCancel.bind(this)}
        />
      )}
      {/* <ViewDetailsModal
        title="查看按钮方案"
        containerId="button_solution"
        ref={ref => {
          viewDetailsModalRef = ref;
        }}
      /> */}
    </div>
  );
}
export default connect(({ buttonSolution, user }) => ({
  ...buttonSolution,
  user,
}))(FormEngine);
