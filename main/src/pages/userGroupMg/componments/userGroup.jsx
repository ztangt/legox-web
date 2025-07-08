import { connect } from 'dva';
import React, { useState, useEffect } from 'react';

import { Input, Button, message, Modal, Table } from 'antd';
// import styles from '../../unitInfoManagement/index.less';
import styles from '../index.less';
import _ from 'lodash';
import { checkWOrd, dataFormat, getButton } from '../../../util/util.js';
import RelationUserInfo from '../componments/relationUserInfo';
import CTM from '../../../componments/commonTreeMg';
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import ADD from './addUsergroupForm';
// import org from '../../../../mock/org';
import IPagination from '../../../componments/public/iPagination';
import ColumnDragTable from '../../../componments/columnDragTable'
import searchIcon from '../../../../public/assets/search_black.svg'
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import GlobalModal from "@/componments/GlobalModal";
import RelevanceModal from "@/componments/relevanceModal/relevanceModal";

const org  = {}
function userGroup({
  dispatch,
  loading,
  ugs,
  returnCount,
  modalVisible,
  isShowRelationModal,
  ug,
  ugIds,
  searchWord,
  limit,
  currentPage,
  user,
  location,
  dataIdList,
  isShowOrgModal,
  selectedNodeId,
  selectedDataIds,
  currentNode,
  expandedKeys,
  treeSearchWord,
  selectedDatas,
  originalData,
  selectNodeType,
}) {
  var viewDetailsModalRef; //查看Modalref
  const { menus,menuObj } = user
  const [isInit, setIsInit] = useState(-1);
  const [inputValue,setInputValue] = useState('');
  const [isView,setIsView]=useState(false)
  useEffect(() => {
    if (isInit == -1) {
      dispatch({
        type: 'userGroupMg/init',
      });
    }
  }, isInit);
  useEffect(()=>{
    if(limit>0){
      dispatch({
        type: 'userGroupMg/getUgs',
        payload: {
            start: 1,
            limit:  limit,
            searchWord: '',
  
        }
      })
    }
  },[limit])

  const tableProps = {
    rowKey: 'id',
    scroll:{y: 'calc(100% - 45px)'},
    columns: [
      {
        title:'序号',
        width:ORDER_WIDTH,
        dataIndex:'index',
        render:(value,obj,index)=><span>{index+1}</span>
      },
      {
        title: '用户组名称',
        dataIndex: 'ugName',
        width:BASE_WIDTH,
        render: (text, record) => (
          <div className={styles.text} title={text} style={{width:BASE_WIDTH-16}}>
            {getButton(menus,'view')?<a
              onClick={() => {
                showDetails(record);
              }}
            >
              {text}
            </a>:text}
          </div>
        ),
      },

      {
        title: '用户组编码',
        dataIndex: 'ugCode',
        width:BASE_WIDTH,
        render: text => (
          <div className={styles.text} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: '用户组描述',
        dataIndex: 'ugDesc',
        width:BASE_WIDTH*2.5,
        render: text => (
          <div className={styles.text} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: '启用',
        dataIndex: 'isEnable',
        width: ORDER_WIDTH,
        render: text => (
          <div className={styles.text} title={text ? '是' : '否'}>
            {text ? '是' : '否'}
          </div>
        ),
      },
      // {
      //   title: '创建人',
      //   dataIndex: 'createUserName'
      // },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        width:BASE_WIDTH,
        render: text => (
          <div className={styles.text} title={dataFormat(text, 'YYYY-MM-DD')}>
            {dataFormat(text, 'YYYY-MM-DD')}
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width:BASE_WIDTH,
        render: (text, record) => {
          return (
            <div  className="table_operation">
              {getButton(menus,'update')&&<span onClick={onAdd.bind(this, record)} style={{ marginRight: 4 }}>
                修改
              </span>}
              {getButton(menus,'delete')&&<span onClick={onDelete.bind(this, record.id, false)}>删除</span>}
            </div>
          );
        },
      },
    ],
    dataSource: ugs,
    // loading: loading.global,
    pagination: false,
    rowSelection: {
      selectedRowKeys: ugIds,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'userGroupMg/updateStates',
          payload: {
            ugIds: selectedRowKeys,
          },
        });
      },
      getCheckboxProps: record => ({
        disabled: record.isSelected == 1,
      }),
    },
  };

  function getUgs(start, searchWord, limit) {
    setIsInit(1);
    dispatch({
      type: 'userGroupMg/getUgs',
      payload: {
        searchWord,
        start,
        limit,
      },
    });
  }

  function onSearchTable(value) {
    setInputValue(value);
    if (checkWOrd(value)) {
      message.error('查询条件不支持特殊字符，请更换其它关键字！');
      return;
    }
    getUgs(1, value, limit);
    searchWord = value;
    dispatch({
      type: 'userGroupMg/updateStates',
      payload: {
        searchWord: value,
      },
    });
  }

  function onAdd(ug) {
    // if(ugIds.length>0&&ug.id){
    //   message.error('请先取消批量操作!')
    //   return
    // }
    if (ug.ugId) {
      ug.isEnable = org.isEnable == 1 ? true : false;
    }
    if (JSON.stringify(ug) === '{}') {
      ug.isEnable = true;
    }

    dispatch({
      type: 'userGroupMg/updateStates',
      payload: {
        modalVisible: true,
        ug,
      },
    });
  }

  function onCancel() {
    setIsView(false)
    dispatch({
      type: 'userGroupMg/updateStates',
      payload: {
        modalVisible: false,
      },
    });
  }

  function onSubmit(values) {
    if (ug.id) {
      dispatch({
        type: 'userGroupMg/updateUg',
        payload: {
          id: ug.id,
          ...values,
        },
      });
    } else {
      dispatch({
        type: 'userGroupMg/addUg',
        payload: {
          ...values,
        },
      });
    }
  }

  function changePage(page,size) {
    console.log(page, size, '536536')
    dispatch({
      type: 'userGroupMg/updateStates',
      payload:{
        currentPage: page,
        limit: size,
        searchWord: inputValue,
      }
    })
    getUgs(page, inputValue, limit);
  }

  function onDelete(ugId, isBatch) {
    // if(ugIds.length>0&&!isBatch){
    //   message.error('请先取消批量操作!')
    //   return
    // }
    if (ugId) {
      Modal.confirm({
        title: '确认删除吗？',
        // content: '确认删除该用户组',
        okText: '删除',
        cancelText: '取消',
        mask:false,
        maskClosable:false,
        getContainer:(()=>{
          return document.getElementById('userGroupMg_container')
        }),
        onOk() {
          dispatch({
            type: 'userGroupMg/deleteUg',
            payload: {
              ugIds: ugId,
            },
          });
        },
      });
    } else {
      message.error('请选择数据进行删除');
    }
  }

  function onRelation(ugId, isBatch) {
    dispatch({
      type: 'userGroupMg/updateStates',
      payload: {
        selectedDataIds:[]
      },
    });
    if (ugIds.length != 1) {
      message.error('请选择一条进行关联');
      return;
    } else {
      // 获取回显;
      dispatch({
        type: 'userGroupMg/getUserByGroupId',
        payload: {
          userGroupId: ugIds[0].toString(),
        }
      });
      dispatch({
        type: 'userGroupMg/updateStates',
        payload: {
          isShowRelationModal: true,
        },
      });
    }
  }

  function onChangeSearchWord(e) {
    dispatch({
      type: 'userGroupMg/updateStates',
      payload: {
        searchWord: e.target.value,
      },
    });
  }

  function showDetails(record) {
    onAdd(record)
    setIsView(true)
    // viewDetailsModalRef.show([
    //   { key: '是否启用', value: record.isEnable, type: 1 },
    //   { key: '用户组编码', value: record.ugCode },
    //   { key: '用户组名称', value: record.ugName },
    //   { key: '创建时间', value: record.createTime, type: 2 },
    //   { key: '用户组描述', value: record.ugDesc, type: 3 },
    // ]);
  }
  const saveBelongOrg=()=>{
    if (ugIds.length > 0) {
      // 赋值列表选中数据
      dispatch({
        type: 'userGroupMg/updateStates',
        payload: {
          dataIdList: ugIds
        },
      });
      // 弹窗中的数据赋值空
      dispatch({
        type: 'userGroupMg/updateStates',
        payload: {
          selectedDataIds:[],
          selectedDatas:[]
        },
      });

      if (ugIds.length === 1) {
        // 查询回显数据
        dispatch({
          type: 'userGroupMg/queryBelongOrg',
          payload: {
            dataId: ugIds,
            menuId: menuObj[location.pathname].id
          },
          callback: () => {
            dispatch({
              type: 'userGroupMg/updateStates',
              payload: {
                isShowOrgModal: true
              }
            })
          }
        })
      } else {
        dispatch({
          type: 'userGroupMg/updateStates',
          payload: {
            isShowOrgModal: true
          }
        })
      }

    } else {
      message.error('请至少选择一条数据');
    }
  }
    // 单位树取消：隐藏弹窗
    const handleCancel = () => {
      dispatch({
        type: 'userGroupMg/updateStates',
        payload: {
          isShowOrgModal: false,
          dataIdList: []
        },
      });
    };
    // 单位树确认：获取到选中id
    const onOk = () => {
      if(menuObj[location.pathname] === undefined) {
        message.error('获取不到菜单ID和菜单编码')
        return;
      }
      let insertStr = [];
      for (i = 0; i < selectedDatas.length; i++) {
        const orgObj = selectedDatas[i];
        let belongObj = {'ORG_ID': orgObj.nodeId, 'ORG_NAME': orgObj.nodeName, 'PARENT_ORG_ID': orgObj.parentId, 'PARENT_ORG_NAME': orgObj.parentName}
        insertStr.push(belongObj);
      }
      dispatch({
        type: 'userGroupMg/saveBelongOrg',
        payload: {
          menuId: menuObj[location.pathname].id,
          menuCode: menuObj[location.pathname].menuCode,
          insertStr: JSON.stringify(insertStr),
          dataIds: dataIdList.toString()
        },
        callback: () => {
          dispatch({
            type: 'userGroupMg/updateStates',
            payload: {
              isShowOrgModal: false,
              dataIdList: []
            }
          })
        }
      })
    }

  return (
    <div
      id='userGroupMg_container'
      style={{ height: '100%', background: 'rgb(255, 255, 255)', padding: 8 }}
    >
      <div className={styles.other}  id='list_head'>
        <Input.Search
          className={styles.search}
          style={{ marginLeft: 0 }}
          placeholder={'请输入用户组名称、编码'}
          allowClear
          defaultValue={searchWord}
          onChange={onChangeSearchWord.bind(this)}
          onSearch={value => {
            onSearchTable(value);
          }}
          enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
        />
        <div className={styles.bt_gp}>
          {getButton(menus,'add')&&<Button type='primary' onClick={onAdd.bind(this, {})}>新增</Button>}
          {getButton(menus,'delete')&&<Button onClick={onDelete.bind(this, ugIds.toString(), true)}>删除</Button>}
          {getButton(menus,'relevanceButton')&&<Button onClick={onRelation.bind(this, ugIds.toString(), true)}>
            关联用户信息
          </Button>}
          {<Button onClick={saveBelongOrg}>归属单位</Button>}
        </div>
      </div>
      <ViewDetailsModal
        title="查看用户组"
        containerId="userGroupMg_container"
        ref={ref => {
          viewDetailsModalRef = ref;
        }}
      ></ViewDetailsModal>
      {modalVisible && (
        <ADD
          loading={loading.global}
          ug={ug}
          setValues={values => {
            dispatch({
              type: 'userGroupMg/updateStates',
              payload: {
                ug: { ...ug, ...values },
              },
            });
          }}
          onCancel={onCancel.bind(this)}
          onSubmit={onSubmit.bind(this)}
          isView={isView}
        />
      )}
      <div className={styles.userGroup_table}>
        <ColumnDragTable taskType="MONITOR" modulesName="userGroupMg" {...tableProps} />
      </div>
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
              onChange={changePage}
              refreshDataFn={() => {changePage(1,limit)}}
            />
        </div>
      {isShowRelationModal && <RelationUserInfo />}
      {isShowOrgModal &&
          <GlobalModal
              title="关联单位"
              visible={true}
              onOk={onOk}
              onCancel={handleCancel}
              widthType={3}
              maskClosable={false}
              // bodyStyle={{ height: '445px', padding: '0px' }}
              mask={false}
              okText="确认"
              cancelText="关闭"
              getContainer={() => {
                return document.getElementById('userGroupMg_container')||false;
              }}
          >
            <RelevanceModal nameSpace="userGroupMg" spaceInfo={
              {selectedNodeId,
              selectedDataIds,
              currentNode,
              expandedKeys,
              treeSearchWord,
              selectedDatas,
              originalData,
              selectNodeType,}} orgUserType="ORG" containerId="userGroupMg_container"  />
            <div style={{color:'red', fontSize: 14, position:"fixed", marginTop: 38 }}>注:多条配置,无法回显,确认覆盖更新,请谨慎!</div>
          </GlobalModal>
        }
    </div>
  );
}
export default connect(({ userGroupMg, loading, user }) => ({
  ...userGroupMg,
  loading,
  user
}))(userGroup);
