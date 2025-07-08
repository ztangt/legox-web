import { connect } from 'dva';
import { Input, Space, Button, Table, Modal, message ,Menu,Dropdown} from 'antd';
import { getButton } from '../../../util/util.js';
import ADD from './addForm';
import { BUTTONCODES } from '../../../service/constant';
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import usePageMap from './usePageMap';
import IPagination from '../../../componments/public/iPagination';
import { DownOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import {useEffect} from 'react'
import ColumnDragTable from '../../../componments/columnDragTable/index.jsx';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import styles from '../index.less';
import searchIcon from '../../../../public/assets/search_black.svg'
import { parse } from 'query-string';
import { history } from 'umi'

function ButtonLibrary({
  dispatch,
  loading,
  addModal,
  addObj,
  buttonsList,
  parentIds,
  user,
  currentPage,
  limit,
  returnCount,
  searchValue,
  isView
}) {
  const { menus } = user;

  var viewDetailsModalRef; //查看Modalref
  const GROUPTYPE = {
    TABLE: '列表',
    FORM: '表单',
    PAGE: '页面',
  };
  const SOURCE = {
    PREFABRICATE: '系统预制',
    CUSTOM: '业务按钮', // 自定义
  };

  // const { getPageList } = usePageMap({
  //   list: buttonsList,
  //   page: currentPage,
  //   limit,
  // });
  useEffect(()=>{
    if(limit>0){
      dispatch({
        type: 'buttonLibrary/getButtons',
        payload: {
          searchValue: searchValue,
          buttonType: '',
          limit:limit,
          start:currentPage,
          buttonSourceName:'CUSTOM'
        },
      });
    }

  },[limit,currentPage])

  const tableProps = {
    rowKey: 'buttonId',
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
        width: ORDER_WIDTH,
        render: (text, record, index) => <div>{index + 1}</div>,
      },
      {
        title: '按钮展示名称',
        dataIndex: 'buttonName',
        width: BASE_WIDTH,
        render: (text, obj) => (
          <a
          title={text}
          style={{ display: 'inline-block',width:BASE_WIDTH -16}}
            onClick={() => {
              showDetails(obj);
            }}
            className={styles.buttonName}
          >
            {text}
          </a>
        ),
      },
      // {
      //   title: '绑定按钮',
      //   dataIndex: 'buttonCode',
      //   render: text => (
      //     <div>
      //       {text && BUTTONCODES.filter(item => item.key == text).length
      //         ? BUTTONCODES.filter(item => item.key == text)[0].name
      //         : ''}
      //     </div>
      //   ),
      // },
      {
        title: '按钮来源',
        dataIndex: 'buttonSourceName',
        width: BASE_WIDTH,
        render: (text, record) => {
          return (
            <div>
              <span>{SOURCE[text]}</span>
            </div>
          );
        },
      },
      {
        title: '按钮类型',
        dataIndex: 'buttonTypeName',
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
        title: '按钮描述',
        dataIndex: 'buttonDesc',
        width: BASE_WIDTH*2.5,
        render:(text)=><span style={{ display: 'inline-block',width:BASE_WIDTH*2.5 -16}} className={styles.buttonDesc}>{text}</span>
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: BASE_WIDTH*1.5,
        render: (text, record) => {
          return (
            <div className='table_operation'>
              {record.buttonSourceName != 'PREFABRICATE' ? (
                
                <>
                  {getButton(menus, 'update') && (
                    <a onClick={() => onAdd(record)}>修改</a>
                  )}
                  {getButton(menus, 'delete') && (
                    <a onClick={onDelete.bind(this, record.buttonId)}>删除</a>
                  )}
                <Dropdown overlay={OperatingMoreMenu.bind(this,record)} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  更多 <DownOutlined />
                </a>
              </Dropdown>
                </>
              ) : null}
            </div>
          );
        },
      },
    ],
    dataSource:buttonsList ,
    loading: loading.global,
    pagination: false,
    scroll: { y: 'calc(100% - 45px)' },
    rowSelection: {
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'buttonLibrary/updateStates',
          payload: {
            parentIds: selectedRowKeys,
          },
        });
      },
      type: 'checkbox',
      getCheckboxProps: record => ({
        disabled: record.buttonSourceName == 'CUSTOM' ? false : true,
      }),
    },
  };
  const OperatingMoreMenu = (record) => {
    return (<Menu onClick={(e)=>{onOperatingMoreClick(e,record)}}>
      {<Menu.Item key="复制ID">复制ID</Menu.Item>}

    </Menu>)
  }
  const onOperatingMoreClick = ({key},obj) => {
    if (key == '复制ID') {
      copy(obj.buttonId);
      message.success('ID复制成功！');
    }
  };
  function showDetails(record) {
    onAdd(record)
    dispatch({
      type:'buttonLibrary/updateStates',
      payload:{
        isView:true
      }
    })
    // viewDetailsModalRef.show([
    //   { key: '按钮展示名称', value: record.buttonName },
    //   {
    //     key: '绑定按钮',
    //     value:
    //       record.buttonCode &&
    //       BUTTONCODES.filter(item => item.key == record.buttonCode).length
    //         ? BUTTONCODES.filter(item => item.key == record.buttonCode)[0].name
    //         : '',
    //   },
    //   { key: '按钮类型', value: GROUPTYPE[record.buttonTypeName] },
    //   { key: '按钮图标', value: record.buttonIcon },
    //   { key: '按钮来源', value: SOURCE[record.buttonSourceName] },
    //   { key: '方法请求类型', value: record.methodTypeName },
    //   { key: '按钮描述', value: record.buttonDesc, type: 3 },
    //   { key: '事件名称', value: record.buttonEvent },
    // ]);
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
      type: 'buttonLibrary/updateStates',
      payload: {
        addModal: true,
        addObj,
      },
    });
  };
  //导出
  const exportData=(ids)=>{
    dispatch({
      type:'buttonLibrary/exportButtons',
      payload:{
        buttonIds:ids.join(',')
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
          type: 'buttonLibrary/deleteButtons',
          payload: {
            buttonIds: ids,
          },
          callback: () => {
            //清空
            dispatch({
              type: 'buttonLibrary/updateStates',
              payload: {
                parentIds: [],
              },
            });
          },
        });
      },
      getContainer: () => {
        return document.getElementById('buttonLibrary_container');
      },
    });
  }
  function onCancel() {
    dispatch({
      type: 'buttonLibrary/updateStates',
      payload: {
        addModal: false,
        isView:false
      },
    });
  }
  //新增或修改 回调
  function onAddSubmit(values) {
    values.thenEvent=values.thenEventPath
    delete values.thenEventPath
    // 如果有addObj.buttonId则为编辑
    if (addObj.buttonId) {
      values['buttonId'] = addObj.buttonId;
    const dataToAddOrUpdate = values
    // 构建请求配置对象
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
      },
      body: JSON.stringify(dataToAddOrUpdate) // 将参数转换为JSON字符串并放入requestBody
    };

    // 发送请求
    // fetch(`${window.localStorage.getItem('env',)}/sys/button`, requestOptions)
    //   .then(function(response) {
    //       if (!response.ok) {
    //           throw new Error('Network response was not ok');
    //       }
    //       return response.json();
    //   })
    //   .then(function(data) {
    //       if(data.code==200){
    //         dispatch({
    //           type: 'buttonLibrary/updateStates',
    //           payload: {
    //             addModal: false,
    //           },
    //         });
    //         dispatch({
    //           type: 'buttonLibrary/getButtons',
    //           payload: {
    //             searchValue,
    //             buttonType: '',
    //             start:currentPage,
    //             limit,
    //             buttonSourceName:'CUSTOM'
    //           },
    //         });
    //       }else{
    //         message.error(data.mag)
    //       }
    //   })
    //   .catch(function(error) {
    //       // 处理请求错误
    //       console.error(error);
    //   });
      dispatch({
        type: 'buttonLibrary/updateButtons',
        payload: values,
        callback: function() {
          dispatch({
            type: 'buttonLibrary/updateStates',
            payload: {
              addModal: false,
            },
          });
        },
      });
    } else {
    const dataToAddOrUpdate = values

    // 构建请求配置对象
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
      },
      body: JSON.stringify(dataToAddOrUpdate) // 将参数转换为JSON字符串并放入requestBody
    };

    // 发送请求
    // fetch(`${window.localStorage.getItem('env',)}/sys/button`, requestOptions)
    //   .then(function(response) {
    //       if (!response.ok) {
    //           throw new Error('Network response was not ok');
    //       }
    //       return response.json();
    //   })
    //   .then(function(data) {
    //       // 处理成功响应
    //       if(data.code==200){
    //         dispatch({
    //           type: 'buttonLibrary/updateStates',
    //           payload: {
    //             addModal: false,
    //             addObj: {},
    //           },
    //         });
    //         dispatch({
    //           type: 'buttonLibrary/getButtons',
    //           payload: {
    //             searchValue,
    //             buttonType: '',
    //             start:currentPage,
    //             limit,
    //             buttonSourceName:'CUSTOM'
    //           },
    //         });
    //       }else{
    //         message.error(data.mag)
    //       }
    //   })
    //   .catch(function(error) {
    //       // 处理请求错误
    //       console.error(error);
    //   });

      // 新增
      dispatch({
        type: 'buttonLibrary/addButtons',
        payload: values,
        callback: function() {
          dispatch({
            type: 'buttonLibrary/updateStates',
            payload: {
              addModal: false,
              addObj: {},
            },
          });
        },
      });
    }
  }

  function onSearchTable(value) {
    dispatch({
      type: 'buttonLibrary/updateStates',
      payload: {
        currentPage: 1,
      },
    });

    dispatch({
      type: 'buttonLibrary/getButtons',
      payload: {
        searchValue: value,
        buttonType: '',
        limit,
        start:1,
        buttonSourceName:'CUSTOM'
      },
    });
  }

  return (
    <div
      id="button_library"
      className={styles.buttonLibrary}
    >
      <div className={styles.other} id='list_head'>
        <Input.Search
          className={styles.search}
          placeholder={'请输入按钮名称、描述'}
          allowClear
          onSearch={value => {
            onSearchTable(value);
          }}
          enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
        />
        <Space>
          {getButton(menus, 'add') && (
            <Button
              type="primary"
              onClick={() => onAdd({})}
              className={styles.fontSize7}
            >
              新增
            </Button>
          )}
          {getButton(menus, 'delete') && (
            <Button
              onClick={onDelete.bind(this, '')}
              className={styles.fontSize7}
            >
              删除
            </Button>
          )}
          <Button
            onClick={()=>{exportData(parentIds)}}
            className={styles.fontSize7}
          >
            导出
          </Button>
        </Space>
      </div>
      <div style={{height:'calc(100% - 80px)'}}>
        <ColumnDragTable taskType="MONITOR" modulesName="buttonLibrary" {...tableProps} key={loading} />
      </div>
        <IPagination
          current={currentPage}
          total={returnCount}
          onChange={(page, size) => {
            dispatch({
              type: 'buttonLibrary/updateStates',
              payload: {
                currentPage: page,
                limit: size,
              },
            });
            // dispatch({
            //   type: 'buttonLibrary/getButtons',
            //   payload: {
            //     searchValue,
            //     buttonType: '',
            //     start:page,
            //     limit:size,
            //     buttonSourceName:'CUSTOM'
            //   },
            // });
          }}
          pageSize={limit}
          isRefresh={true}
          refreshDataFn={() => {
            dispatch({
              type:'buttonLibrary/updateStates',
              payload:{
                currentPage:1
              }
            })
            dispatch({
              type: 'buttonLibrary/getButtons',
              payload: {
                searchValue,
                buttonType: '',
                start:1,
                limit,
                buttonSourceName:'CUSTOM'
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
              type: 'buttonLibrary/updateStates',
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

      {/* <ViewDetailsModal
        title="查看按钮"
        containerId="button_library"
        ref={ref => {
          viewDetailsModalRef = ref;
        }}
      /> */}
    </div>
  );
}
export default connect(({ buttonLibrary, user }) => ({
  ...buttonLibrary,
  user,
}))(ButtonLibrary);
