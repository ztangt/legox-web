import React,{useState} from 'react';
import CTM from '../../../componments/commonTreeMg';
import IPagination from '../../../componments/public/iPagination';
import AddGlobalReviewer from './addGlobalReviewer';
import { dataFormat, getButton } from '../../../util/util';
// import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import ReviewerModal from './reviewerModal';
import { connect } from 'umi';
import { Button, message, Modal, Space, Table, Input } from 'antd';
import RelationUserModal from './relationUserModal';
import ColumnDragTable from '../../../componments/columnDragTable';
import styles from '../index.less'

function GlobalReviewer({
  dispatch,
  treeData,
  expandedKeys,
  treeSearchWord,
  currentNode,
  selectedRowKeys,
  dataSource,
  isShowAddGlobalReviewer,
  currentPage,
  returnCount,
  limit,
  user,
  isShowRelationModal,
  searchWord,
  leftNum
}) {
  var viewDetailsModalRef; //查看Modalref
  const { menus } = user;
  const [showViewer,setShowViewer] = useState(false) // 显示查看弹窗  
  const [recordViewer,setRecordViewer] = useState({}) // record

  function returnISExend(item) {
    // 所有公共的可以编辑
    if(item.checkerProperty == 'PUBLIC'){
      return false
    }
    // 列表中数据 checkerCreateOrgId 的值与左侧树中选中的组织机构ID 一样则可被勾选，不一样则不可被勾选
    if (item.checkerCreateOrgId === currentNode.nodeId) {
      return false;
    }
    return true;
  }
  const tableProps = {
    rowKey: 'id',
    dataSource: dataSource,
    pagination: false,
    columns: [
      {
        title: '序号',
        width: 40,
        render: (text, record, index) => <div>{index + 1}</div>,
      },

      {
        title: '审核人名称',
        dataIndex: 'checkerName',
        key: 'checkerName',
        width: 150,
        ellipsis: true,
        render: (text, record) => {
          return (
            <>
                <a
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    showDetails(record);
                  }}
                >
                  {text}
                </a>
            </>
          );
        },
      },
      {
        title: '描述',
        dataIndex: 'checkerDesc',
        key: 'checkerDesc',
        ellipsis: true,
        width: 120,
      },
      {
        title: '属性',
        dataIndex: 'checkerProperty',
        key: 'checkerProperty',
        width: 50,
        render: text => {
          if (text == 'PUBLIC') {
            return '公共';
          } else {
            return '私有';
          }
        },
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 80,
        render: text => {
          return dataFormat(text, 'YYYY-MM-DD');
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 120,
        render: (text, record) => (
          <Space className={styles.space_actions}>
            <a
              // disabled={returnISExend(record)}
              onClick={() => {
                onChange(record);
              }}
            >
              修改
            </a>
            <a
              // disabled={returnISExend(record)}
              onClick={() => {
                onDelete(record.id);
              }}
            >
              删除
            </a>
            <a
              onClick={() => {
                onRelation(record);
              }}
            >
              关联用户
            </a>
            {/* {getButton(menus, 'update') && (
            <a
              onClick={() => {
                onChange(record);
              }}
            >
              修改
            </a>
            )} */}
            {/* {getButton(menus, 'delete') && (
            <a
              onClick={() => {
                onDelete(record.id);
              }}
            >
              删除
            </a>
            )} */}

            {/* {getButton(menus, 'relevanceButton') &&
            <a
              onClick={() => {
                onRelation(record);
              }}
            >
              关联用户
            </a>
            } */}
          </Space>
        ),
      },
    ],

    rowSelection: {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'globalReviewer/updateStates',
          payload: {
            selectedRowKeys,
          },
        });
      },
      // getCheckboxProps: record => ({
      //   disabled: returnISExend(record),
      // }),
    },
  };

  function onChange(record) {
    dispatch({
      type: 'globalReviewer/updateStates',
      payload: {
        isShowAddGlobalReviewer: true,
        currentGlobalReviewer: record,
      },
    });
  }

  function onDelete(checkerId) {
    if (!checkerId || checkerId.length == 0) {
      message.error('请至少选择一条信息进行删除!');
      return;
    }
    Modal.confirm({
      title: '确认删除吗？',
      content: '',
      okText: '删除',
      cancelText: '取消',
      mask: false,
      onOk() {
        dispatch({
          type: 'globalReviewer/removeGlobalReviewer',
          payload: { checkerId: checkerId.toString() },
        });
        dispatch({
          type: 'globalReviewer/updateStates',
          payload: { selectedRowKeys: [] },
        });
      },
      getContainer: () => {
        return document.getElementById('globalReviewer_container');
      },
    });
  }

  function onAddButtonClick() {
    // 去除校验、不选也可改
    // if (!currentNode.nodeId) {
    //   message.error('请先选择单位'); `
    //   return;
    // }
    dispatch({
      type: 'globalReviewer/updateStates',
      payload: { isShowAddGlobalReviewer: true },
    });
  }

  function onChangePage(nextPage, size) {
    dispatch({
      type: 'globalReviewer/getGlobalReviewerList',
      payload: {
        start: nextPage,
        limit: size,
        searchword: searchWord,
      },
    });
  }

  function onRelation(record) {
    dispatch({
      type: 'globalReviewer/updateStates',
      payload: {
        isShowRelationModal: true,
        currentGlobalReviewer: record,
      },
    });
  }

  function showDetails(record) {
    //获取当前关联用户 进行回显
    // dispatch({
    //   type: 'globalReviewer/getGlobalReviewerIdentity',
    //   payload: {
    //     checkerId: record.id,
    //     orgId: currentNode.nodeId,
    //     start: 1,
    //     limit: 1000,
    //   },
    //   callback: data => {
    //     debugger;
    //     var usersList = [];
    //     data.list.forEach(element => {
    //       var infoList = element.identityFullName.split('/');
    //       usersList.push(infoList[3]);
    //     });
    //     record.relationUser = usersList.join(',');
    //     onShow(record);
    //   },
    // });
    onShow(record);
  }
  function onShow(record) {
    console.log('shoshosho');
    setShowViewer(true)
    setRecordViewer(record)
    // viewDetailsModalRef.show([
    //   { key: '审核人名称', value: record.checkerName },
    //   {
    //     key: '属性',
    //     value: record.checkerProperty == 'PUBLIC' ? '公共' : '私有',
    //   },
    //   { key: '描述', value: record.checkerDesc, type: '3' },

    //   {
    //     key: '创建时间',
    //     value: record.createTime,
    //     type: '2',
    //   },
    // ]);
  }
  // 查看弹窗关闭
  function onCancel(){
    setShowViewer(false)
  }

  //搜索词
  const onChangeSearchWord = e => {
    console.log(e.target.value);
    dispatch({
      type: 'globalReviewer/updateStates',
      payload: {
        searchWord: e.target.value,
      },
    });
    if (!e.target.value) {
      dispatch({
        type: 'globalReviewer/getGlobalReviewerList',
        payload: {
          start: 1,
          limit: limit,
          searchword: '',
          orgId: currentNode.key,
        },
      });
    }
  };

  //搜索
  const onSearchTable = value => {
    if (!currentNode.key) {
      message.error('请选择所属单位/部门');
      return;
    }
    if (checkWOrd(value)) {
      message.error('搜索词中包含特殊字符！');
      return;
    }

    if (value) {
      dispatch({
        type: 'globalReviewer/getGlobalReviewerList',
        payload: {
          orgId: currentNode.key,
          start: 1,
          limit: limit,
          searchword: value,
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


  return (
    <div style={{ height: '100%' }} id="globalReviewer" className={styles.global_viewer}>
      <CTM
        leftNum={leftNum}
        treeData={treeData}
        expandedKeys={expandedKeys}
        treeSearchWord={treeSearchWord}
        currentNode={currentNode}
        nodeType={'ORG_'}
        plst={'请输入单位/部门名称、编码'}
        moudleName={"globalReviewer"}
        getData={node => {
          dispatch({
            type: 'globalReviewer/updateStates',
            payload: {
              searchWord: '',
              limit: 10,
            },
          });
          dispatch({
            type: 'globalReviewer/getGlobalReviewerList',
            payload: {
              orgId: node.orgKind == 'DEPT' ? '' : node.key,
              start: 1,
              limit: limit,
              searchword: '',
            },
          });
        }}
      >
        <Input.Search
          style={{ float: 'left',paddingLeft:8, width: 200 }}
          placeholder={'请输入审核人名称'}
          allowClear
          value={searchWord}
          onChange={onChangeSearchWord.bind(this)}
          onSearch={value => {
            onSearchTable(value);
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
            <Button type="primary" onClick={onAddButtonClick}>
              新增
            </Button>
            <Button onClick={onDelete.bind(this, selectedRowKeys)}>删除</Button>
            {/* <Button type="primary">删除</Button> */}
          </Space>
        </div>

        <ColumnDragTable className={styles.box_table} {...tableProps} taskType ='MONITOR' style={{ marginTop: '10px' }}  scroll={{ y: 'calc(100% - 165px)' }}/>

        <IPagination
          current={Number(currentPage)}
          total={Number(returnCount)}
          onChange={onChangePage}
          pageSize={limit}
          isRefresh={true}
          refreshDataFn={() => {
            dispatch({
              type: 'globalReviewer/getGlobalReviewerList',
              payload: {
                start: 1,
                limit: limit,
                searchword: searchWord,
              },
            });
          }}
        />
      </CTM>
      {isShowAddGlobalReviewer && <AddGlobalReviewer currentNode={currentNode}/>}
      {isShowRelationModal && <RelationUserModal />}
      {showViewer&&<ReviewerModal 
        onCancel={onCancel}
        containerId="globalReviewer_container"
        record={recordViewer}
      />}
      {/* <ViewDetailsModal
        title="查看审核人"
        containerId="globalReviewer_container"
        ref={ref => {
          viewDetailsModalRef = ref;
        }}
      ></ViewDetailsModal> */}
    </div>
  );
}

export default connect(({ globalReviewer, loading, user }) => ({
  ...globalReviewer,
  loading,
  user,
}))(GlobalReviewer);
