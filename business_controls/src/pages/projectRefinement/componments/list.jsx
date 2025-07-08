import { useModel } from '@umijs/max';
import { Form, Modal, message } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import Table from '../../../components/columnDragTable';
import IPagination from '../../../components/public/iPagination';
import { scriptEvent } from '../../../util/performScript';
import styles from '../index.less';
import { projectColumns } from './contant';
import ListSearch from './listSearch';
function List({ dispatch, projectForm, budgetStage, projectRefinement }) {
  const [columns, setColumns] = useState(
    _.cloneDeep(projectColumns[budgetStage] || projectColumns['0']),
  );
  const [formExtra] = Form.useForm();
  let buttonId = ''; //用于页面跳转需要的参数
  const [buttonDisable, setButtonDisable] = useState(false);
  const {
    buttonList,
    sctiptMap,
    location,
    openEvent,
    // openFormDetail,
    baseConfirm,
    baseMessage,
    baseModalComponments,
    baseIframeModalComponments,
    openNewPage,
    steptsModalComponments,
    parentDispatch,
    menus,
    CONFIRM,
    MESSAGE,
    QS,
    LOCATIONHASH,
    UUID,
    fetchAsync,
    DATAFORMAT,
  } = useModel('@@qiankunStateFromMaster');
  const {
    currentPage,
    returnCount,
    projectList,
    limit,
    selectedRows,
    selectedRowKeys,
    listSearchWord,
    currentNode,
    currentOrgNode,
    usedYear,
  } = projectRefinement;
  useEffect(() => {
    //得到按钮操作位置是否有列上的，有的话需要在列上显示
    if (buttonList && typeof buttonList == 'object') {
      let tmpColButtonList = [];
      Object.keys(buttonList).map((item) => {
        buttonList[item] &&
          buttonList[item].map((info) => {
            if (info.showRow == 1 || info.showRow == 2) {
              tmpColButtonList.push(info);
            }
          });
      });
      if (tmpColButtonList.length) {
        columns.push({
          title: '操作',
          dataIndex: 'id',
          key: 'id',
          width: 100,
          render: (text, record, index) => {
            return (
              <div className="table_operation">
                {tmpColButtonList.map((item) => {
                  return (
                    <span
                      onClick={() => {
                        buttonFn(item, record);
                      }}
                    >
                      {item.buttonName}
                    </span>
                  );
                })}
              </div>
            );
          },
        });
      }
      // setColumns(_.cloneDeep(columns))
    }
  }, []);
  const changePage = (size, limit) => {
    //TODO
    dispatch({
      type: 'projectRefinement/updateStates',
      payload: {
        limit,
      },
    });
  };
  // 按钮逻辑处理
  const buttonFn = async (obj, rowInfo, e, sctipts, isGroup) => {
    debugger;
    const { buttonCode, id, buttonName } = obj;
    localStorage.setItem('currentButtonId', id);
    localStorage.setItem('currentButtonName', buttonName);
    setButtonDisable(true);
    setTimeout(() => {
      setButtonDisable(false);
    }, 1000);
    buttonId = id;
    // if (!rowInfo && selectedInfo.length === 1) {
    //   //为选中的第一行
    //   rowInfo = selectedInfo[0];
    // }
    try {
      // scriptEvent 为按钮前置、中置、后置事件列表
      let fnList = await scriptEvent(sctipts ? sctipts[id] : sctiptMap[id]);
      let isNull = fnList.filter((i) => i);
      if (!isNull || (isNull.length === 0 && !isGroup)) {
        switch (buttonCode) {
          case 'add':
            openFormDetail();
            break;
          case 'delete':
            handleDelete(rowInfo);
            break;
          case 'update':
            openFormDetail({}, {}, rowInfo.BIZ_ID, rowInfo, 'update');
            break;
          default:
            break;
        }
      } else {
        fnList.forEach((item) => {
          // 送交特殊逻辑判断
          if (item.includes('onRule(true)')) {
            let newItem = '';
            let pattern1 = /onRule\(true\)/g;
            let replaceStr1 = '//onRule(true)';
            if (pattern1.test(item)) {
              newItem = item.replace(new RegExp(pattern1, 'g'), replaceStr1);
            }
            let fn = eval(newItem);
            fn();
          } else {
            let fn = eval(item);
            // 兼容列操作
            fn(rowInfo ? [rowInfo] : '');
          }
        });
      }
    } catch (e) {
      console.log('按钮事件', e);
    }
  };
  console.log('selectedRows===', selectedRows);
  //打开表单
  function openFormDetail() {
    debugger;
    console.log('arguments===', arguments);
    if (arguments.length === 0) {
      //新增
      openEvent({});
    } else if (arguments.length === 1) {
      //新增
      openEvent(arguments[0]);
    } else if (arguments.length === 5) {
      //修改
      if (arguments[3] && typeof Object.keys(arguments[3]).length) {
        openEvent({}, {}, arguments[3]?.BIZ_ID, arguments[3]);
      } else {
        if (selectedRows.length === 1) {
          openEvent({}, {}, selectedRows?.[0]?.BIZ_ID, selectedRows?.[0]);
        } else {
          message.warning('请选择一条数据');
        }
      }
    } else if (arguments.length === 6) {
      //查看
      openEvent(
        arguments[0],
        arguments[1],
        arguments[2],
        arguments[3],
        arguments[4],
      );
    } else {
      // null
    }
  }
  //删除T
  const handleDelete = (rowInfo) => {
    if (!rowInfo && !selectedRowKeys.length) {
      message.warning('请选择一条要删除的数据');
      return;
    }
    Modal.confirm({
      title: '',
      content: '确认要删除？',
      onOk() {
        dispatch({
          type: 'projectRefinement/deleteBudget',
          payload: {
            ids: rowInfo ? rowInfo.ID : selectedRowKeys.join(','),
            budgetStage: budgetStage,
          },
          callback: (data) => {
            //重新获取列表
            dispatch({
              type: 'projectRefinement/getBudPreProjectList',
              payload: {
                ...projectForm.getFieldsValue(),
                searchWord: listSearchWord,
                budgetStage: budgetStage,
                parentId: rowInfo.parentId,
                treeType: rowInfo.treeType,
                orgId: rowInfo.ORG_ID,
                usedYear: usedYear,
                start: 0,
                limit,
              },
            });
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  //导出
  const exportProject = (rowInfo) => {
    dispatch({
      type: 'projectRefinement/exportProject',
      payload: {
        ids: rowInfo
          ? rowInfo.ID
          : selectedRowKeys.length
          ? selectedRowKeys.join(',')
          : '',
        budgetStage,
        usedYear,
      },
    });
  };
  //结转
  const finishTurn = (rowInfo) => {
    //结转
    dispatch({
      type: 'projectRefinement/finishTurn',
      payload: {
        budgetStage,
        usedYear,
        ids: rowInfo
          ? rowInfo.ID
          : selectedRowKeys.length
          ? selectedRowKeys.join(',')
          : '',
      },
    });
  };
  //推动细化
  const pushRefineProject = (rowInfo) => {
    dispatch({
      type: 'projectRefinement/pushRefineProject',
      payload: {
        projectIds: rowInfo
          ? rowInfo.ID
          : selectedRowKeys.length
          ? selectedRowKeys.join(',')
          : '',
        usedYear,
      },
    });
  };
  return (
    <>
      <ListSearch
        formHigh={projectForm}
        formExtra={formExtra}
        dispatch={dispatch}
        budgetStage={budgetStage}
        buttonList={buttonList}
        buttonFn={buttonFn}
        buttonDisable={buttonDisable}
      />
      <div className={styles.pro_list}>
        <Table
          dataSource={projectList}
          pagination={false}
          columns={columns}
          rowKey={'ID'}
          scroll={{ y: 'calc(100% - 88px)' }}
          onRow={(record) => {
            return {
              onClick: (event) => {
                dispatch({
                  type: 'projectRefinement/updateStates',
                  payload: {
                    selectedRowKeys: [record.ID],
                    selectedRows: [record],
                  },
                });
              }, // 点击行
            };
          }}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              dispatch({
                type: 'projectRefinement/updateStates',
                payload: {
                  selectedRowKeys: selectedRowKeys,
                  selectedRows: selectedRows,
                },
              });
            },
          }}
        />
        <IPagination
          current={currentPage}
          pageSize={limit}
          total={returnCount}
          onChange={changePage.bind(this)}
        />
      </div>
    </>
  );
}
export default connect(({ projectRefinement }) => ({
  projectRefinement,
}))(List);
