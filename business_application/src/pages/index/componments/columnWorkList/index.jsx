/**
 * @author zhangww
 * @description 栏目-工作事项
 */
import { useSize } from 'ahooks';
import { message,Table,Tabs } from 'antd';
import { connect } from 'dva';
import { useEffect,useRef,useState } from 'react';
import { history } from 'umi';
import bg1 from '../../../../public/assets/cybg.svg';
import bg0 from '../../../../public/assets/dbbg.svg';
import bg2 from '../../../../public/assets/gzbg.svg';

import { ReactComponent as CY } from '../../../../public/assets/cy.svg';
import { ReactComponent as DB } from '../../../../public/assets/db.svg';
import { ReactComponent as GZ } from '../../../../public/assets/gz.svg';

import { BIZSTATUS } from '../../../../service/constant';
import { dataFormat } from '../../../../util/util';
import { ReactComponent as EDIT } from '../../bianji.svg';
import { ReactComponent as MORE } from "../../gengduo.svg";
import { ReactComponent as REFRE } from "../../shuaxin.svg";

import OneKeyApprove from '../oneKeyApprove';
import styles from './index.less';

const { TabPane } = Tabs;

function Index({ dispatch, columnWorkList, user, desktopLayout }) {
  const { menus } = user;
  const refList = useRef(null);
  const size = useSize(refList);

  const bgArr = [bg0, bg1, bg2];
  const iconArr = [<DB />, <CY />, <GZ />];
  const colorArr = ['rgb(2,43,158)', 'rgb(162,71,13)', 'rgb(23,105,80)'];
  // const shadowArr = ['0px 6px 15px 0px #D9DDED', '0px 6px 15px 0px #E6DDD2', '0px 6px 15px 0px #C8E7DE'];
  // const colorArr = ['#EFEFFF', '#FCF2E6', '#DAF4EC'];
  const { radioList, todoCount, traceCount, circulateCount } = columnWorkList;
  console.log('Tabs radioList', radioList);
  const { refreshTag } = desktopLayout;

  const [activeKey, setActiveKey] = useState('1');
  const [activeList, setActiveList] = useState([]);
  const [activeColumns, setActiveColumns] = useState([]);
  const [radioValue, setRadioValue] = useState('');

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  
  // 一键审批弹窗是否显示
  const [oneKeyApprove, setOneKeyApprove] = useState({ show: false, data: {} });

  const payload = {
    workRuleId: radioValue,
    start: 1,
    limit: 20,
  };

  const tabPaneObj = [
    {
      key: '1',
      title: '待办事项',
      count: todoCount,
    },
    {
      key: '2',
      title: '传阅事项',
      count: circulateCount,
    },
    {
      key: '3',
      title: '跟踪事项',
      count: traceCount,
    },
  ];

  const columns1 = [
    {
      title: '序号',
      width: '10%',
      dataIndex: 'key',
      render: (text, record, index) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            const {
              bizSolId,
              bizInfoId,
              bizTaskId,
              bizTitle,
              mainTableId,
            } = record;
            var maxDataruleCodes = JSON.parse(
              localStorage.getItem('maxDataruleCodes') || '{}',
            );
            var maxDataruleCode =
              maxDataruleCodes[history.location.pathname] || '';
            historyPush({
              pathname: `waitMatter/formShow`,
              query: {
                bizSolId,
                bizInfoId,
                bizTaskId,
                title: bizTitle,
                id: mainTableId,
                maxDataruleCode,
              },
            });
          }}
        >
          {index + 1}
        </div>
      ),
    },
    {
      title: '标题',
      dataIndex: 'bizTitle',
      key: 'bizTitle',
      ellipsis: true,
      width: '40%',
      render: (text, record, index) => (
        <a
          style={{ cursor: 'pointer' }}
          onClick={() => {
            const {
              bizSolId,
              bizInfoId,
              bizTaskId,
              bizTitle,
              mainTableId,
            } = record;
            var maxDataruleCodes = JSON.parse(
              localStorage.getItem('maxDataruleCodes') || '{}',
            );
            var maxDataruleCode =
              maxDataruleCodes[history.location.pathname] || '';
            historyPush({
              pathname: `/waitMatter/formShow`,
              query: {
                bizSolId,
                bizInfoId,
                bizTaskId,
                title: bizTitle,
                id: mainTableId,
                maxDataruleCode,
              },
            });
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '办理类型',
      dataIndex: 'bizSolName',
      key: 'bizSolName',
      ellipsis: true,
      width: '16%',
    },
    {
      title: '拟稿人',
      dataIndex: 'draftUserName',
      key: 'draftUserName',
      ellipsis: true,
      width: '16%',
    },
    {
      title: '送办时间',
      dataIndex: 'startTime',
      ellipsis: true,
      width: '18%',
      render: (text) => {
        return dataFormat(text);
      },
    },
  ];

  const columns2 = [
    {
      title: '序号',
      width: '10%',
      dataIndex: 'key',
      render: (text, record, index) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            const {
              bizSolId,
              bizInfoId,
              bizTaskId,
              taskStatus,
              bizTitle,
              mainTableId,
            } = record;
            if (taskStatus != '2') {
              dispatch({
                type: `circulateWork/setCirculate`,
                payload: {
                  bizTaskIds: bizTaskId,
                  title: bizTitle,
                  id: mainTableId,
                },
                isShowMessge: false,
              });
            }
            var maxDataruleCodes = JSON.parse(
              localStorage.getItem('maxDataruleCodes') || '{}',
            );
            var maxDataruleCode =
              maxDataruleCodes[history.location.pathname] || '';
            historyPush({
              pathname: `/circulateWork/formShow`,
              query: {
                bizSolId,
                bizInfoId,
                title: bizTitle,
                id: mainTableId,
                maxDataruleCode,
              },
            });
          }}
        >
          {index + 1}
        </div>
      ),
    },
    {
      title: '标题',
      dataIndex: 'bizTitle',
      key: 'bizTitle',
      width: '40%',
      ellipsis: true,
      render: (text, record, index) => (
        <a
          style={{ cursor: 'pointer' }}
          onClick={() => {
            const {
              bizSolId,
              bizInfoId,
              bizTaskId,
              taskStatus,
              bizTitle,
              mainTableId,
            } = record;
            if (taskStatus != '2') {
              dispatch({
                type: `circulateWork/setCirculate`,
                payload: {
                  bizTaskIds: bizTaskId,
                  title: bizTitle,
                },
                isShowMessge: false,
              });
            }
            var maxDataruleCodes = JSON.parse(
              localStorage.getItem('maxDataruleCodes') || '{}',
            );
            var maxDataruleCode =
              maxDataruleCodes[history.location.pathname] || '';
            historyPush({
              pathname: `/circulateWork/formShow`,
              query: {
                bizSolId,
                bizInfoId,
                title: bizTitle,
                maxDataruleCode,
                id: mainTableId,
              },
            });
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '办理类型',
      dataIndex: 'bizSolName',
      key: 'bizSolName',
      ellipsis: true,
      width: '16%',
    },
    {
      title: '传阅人',
      dataIndex: 'ruserName',
      key: 'ruserName',
      ellipsis: true,
      width: '16%',
    },
    {
      title: '送办时间',
      dataIndex: 'startTime',
      ellipsis: true,
      width: '18%',
      render: (text) => {
        return dataFormat(text);
      },
    },
  ];

  const columns3 = [
    {
      title: '序号',
      width: 50,
      dataIndex: 'key',
      render: (text, record, index) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            const { bizSolId, bizInfoId, bizTitle, mainTableId } = record;
            var maxDataruleCodes = JSON.parse(
              localStorage.getItem('maxDataruleCodes') || '{}',
            );
            var maxDataruleCode =
              maxDataruleCodes[history.location.pathname] || '';
            historyPush({
              pathname: `/traceWork/formShow`,
              query: {
                bizSolId,
                bizInfoId,
                title: bizTitle,
                id: mainTableId,
                maxDataruleCode,
              },
            });
          }}
        >
          {index + 1}
        </div>
      ),
    },
    {
      title: '标题',
      dataIndex: 'bizTitle',
      key: 'bizTitle',
      ellipsis: true,
      render: (text, record, index) => (
        <a
          style={{ cursor: 'pointer' }}
          onClick={() => {
            const { bizSolId, bizInfoId, bizTitle, mainTableId } = record;
            var maxDataruleCodes = JSON.parse(
              localStorage.getItem('maxDataruleCodes') || '{}',
            );
            var maxDataruleCode =
              maxDataruleCodes[history.location.pathname] || '';
            historyPush({
              pathname: `/traceWork/formShow`,
              query: {
                bizSolId,
                bizInfoId,
                title: bizTitle,
                id: mainTableId,
                maxDataruleCode,
              },
            });
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '办理类型',
      dataIndex: 'bizSolName',
      key: 'bizSolName',
      ellipsis: true,
    },
    {
      title: '当前办理环节',
      dataIndex: 'bizStatus',
      key: 'bizStatus',
      ellipsis: true,
      render: (text) => {
        return BIZSTATUS[text];
      },
    },
    {
      title: '当前办理人',
      dataIndex: 'ruserName',
      key: 'ruserName',
      ellipsis: true,
      render: (text, record) => {
        return record.bizStatus == 2 ? '-' : text;
      },
    },
    {
      title: '送办时间',
      dataIndex: 'startTime',
      ellipsis: true,
      width: 120,
      render: (text) => {
        return dataFormat(text);
      },
    },
  ];

  // 打开一键审批
  const oneKeyApproveOpen = () => {
    if (selectedRows.length === 0) {
      message.warning('请选择要审批的单据');
      return
    }
    // 截取当前任务前5个，取 bizTaskId
    let data = {
      taskIds: [],
      approveTask: {},
    };
    selectedRows.forEach((item) => {
      data.taskIds.push(item.bizTaskId);
      data.approveTask[item.bizTaskId] = {
        bizTaskId: item.bizTaskId,
        bizTitle: item.bizTitle,
        bizInfoId: item.bizInfoId,
        bizSolId: item.bizSolId,
        procDefId: item.procDefId,
        formDeployId: item.formDeployId,
        mainTableId: item.mainTableId,
      };
    });
    setOneKeyApprove({ show: true, data });
  };

  // 关闭一键审批弹窗
  const oneKeyApproveClose = (isReload) => {
    if (isReload) {
      reloadList();
    }
    setOneKeyApprove({ show: false, data: {} });
  };

  const operations = (
    <div>
      {/* 一键审批 */}
      {activeKey === '1' ? (
        <span className={styles.right_icon} onClick={oneKeyApproveOpen}>
          <EDIT />
        </span>
      ) : null}
      {/* 刷新 */}
      <span className={styles.right_icon} onClick={reloadList}>
        <REFRE />
      </span>

      {/* 更多 */}
      <span className={styles.right_icon} onClick={linkToAny}>
        <MORE />
      </span>
    </div>
  );

  useEffect(() => {
    getRules();
    getList('');
    setRadioValue('');
  }, [refreshTag]);
  useEffect(() => {
    switch (activeKey) {
      case '1':
        dispatch({
          type: 'columnWorkList/getTodoWork',
          payload,
          callback: (list) => {
            setActiveList(list);
            setActiveColumns(columns1);
          },
        });
        break;
      case '2':
        dispatch({
          type: 'columnWorkList/getCirculateWork',
          payload,
          callback: (list) => {
            const res = list && list?.filter((item) => item.taskStatus == 0);
            setActiveList(res);
            setActiveColumns(columns2);
          },
        });
        break;
      case '3':
        dispatch({
          type: 'columnWorkList/getTraceWork',
          payload,
          callback: (list) => {
            setActiveList(list);
            setActiveColumns(columns3);
          },
        });
        break;
      default:
        break;
    }
  }, [radioValue, activeKey]);

  function getRules() {
    dispatch({
      type: 'columnWorkList/getWorkRule',
    });
  }

  function getList(workRuleId) {
    dispatch({
      type: 'columnWorkList/getTodoWork',
      payload: {
        workRuleId,
        start: 1,
        limit: 20,
      },
      callback: (list) => {
        setActiveList(list);
        setActiveColumns(columns1);
      },
    });
    dispatch({
      type: 'columnWorkList/getCirculateWork',
      payload: {
        workRuleId,
        start: 1,
        limit: 20,
      },
    });
    dispatch({
      type: 'columnWorkList/getTraceWork',
      payload: {
        workRuleId,
        start: 1,
        limit: 20,
      },
    });
  }

  function reloadList() {
    setSelectedRowKeys([])
    setSelectedRows([])
    switch (activeKey) {
      case '1':
        dispatch({
          type: 'columnWorkList/getTodoWork',
          payload,
          callback: (list) => {
            setActiveList(list);
            setActiveColumns(columns1);
          },
        });
        break;
      case '2':
        dispatch({
          type: 'columnWorkList/getCirculateWork',
          payload,
          callback: (list) => {
            setActiveList(list);
            setActiveColumns(columns2);
          },
        });
        break;
      case '3':
        dispatch({
          type: 'columnWorkList/getTraceWork',
          payload,
          callback: (list) => {
            setActiveList(list);
            setActiveColumns(columns3);
          },
        });
        break;
      default:
        break;
    }
  }

  function linkToAny() {
    switch (activeKey) {
      case '1':
        let tmp = menus?.filter(
          (i) => !i.hideInMenu,
        );
        tmp =
          menus?.filter(
            (i) => i.children?.length,
          ) || [];
        let pathname = '/waitMatter';
        for (let i = 0; i < tmp.length; i++) {
          for (let j = 0; j < tmp[i].children.length; j++) {
            const element = tmp[i].children[j];
            if (
              element.path?.indexOf('/waitMatter') > -1 &&
              !element['extraParams']
            ) {
              pathname = element.path;
              break;
            }
          }
        }
        historyPush({pathname});
        break;
      case '2':
        historyPush({pathname:'/circulateWork'});
        break;
      case '3':
        historyPush({pathname:'/traceWork'});
        break;
      default:
        break;
    }
  }

  function tabOnChange(i) {
    setActiveKey(i);
  }

  const onClickRow = (record) => {
    const { bizSolId, bizInfoId, bizTaskId, taskStatus, bizTitle, mainTableId } = record;
    return {
      onClick: () => {
        var maxDataruleCodes = JSON.parse(
          localStorage.getItem('maxDataruleCodes') || '{}',
        );
        var maxDataruleCode = maxDataruleCodes[history.location.pathname] || '';
        switch (activeKey) {
          case '1':
            historyPush({
              pathname: `waitMatter/formShow`,
              query: {
                bizSolId,
                bizInfoId,
                bizTaskId,
                title: bizTitle,
                id: mainTableId,
                maxDataruleCode,
              },
            });
            break;
          case '2':
            if (taskStatus != '2') {
              dispatch({
                type: `circulateWork/setCirculate`,
                payload: {
                  bizTaskIds: bizTaskId,
                  title: bizTitle,
                },
                isShowMessge: false,
              });
            }
            historyPush({
              pathname: `/circulateWork/formShow`,
              query: {
                bizSolId,
                bizInfoId,
                title: bizTitle,
                maxDataruleCode,
                id: mainTableId,
              },
            });
            break;
          case '3':
            historyPush({
              pathname: `/traceWork/formShow`,
              query: {
                bizSolId,
                bizInfoId,
                title: bizTitle,
                id: mainTableId,
                maxDataruleCode,
              },
            });
            break;
          default:
            break;
        }
      },
    };
  };

  const onChange = (e) => {
    setRadioValue(e);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
  };

  // 扩充通用功能：1.区分表格奇偶行
  const getRowClassName = (record, index) => {
    let className = '';
    className = index % 2 === 0 ? 'oddRow' : 'evenRow';
    return className;
  };

  return (
    <>
      <div className={styles.workList} ref={refList}>
        <div className={styles.header}>
          {tabPaneObj.map((item, index) => {
            return (
              <div
                className={styles.matter}
                key={item.key}
                onClick={() => tabOnChange(item.key)}
                style={{
                  background: `url(${bgArr[index]})`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  // boxShadow: shadowArr[index],
                }}
              >
                <div>
                  {iconArr[index]}
                </div>
                <div style={{marginTop: 2}}>
                  <h1>{item.title}</h1>
                  <p>{item.count}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.tabs}>
          <Tabs tabBarExtraContent={operations} onChange={onChange} activeKey={radioValue}>
            {radioList.map((item) => {
              return (
                <TabPane tab={item.groupName} key={item.workRuleId}></TabPane>
              );
            })}
          </Tabs>
        </div>
        <Table
            rowClassName={getRowClassName} 
            style={{ marginTop: -14 }}
            size="small"
            dataSource={activeList}
            columns={activeColumns}
            rowSelection={{
              ...rowSelection,
            }}
            rowKey='bizTaskId'
            // onRow={onClickRow}
            scroll={{y: size?.height - 180}}
            pagination={false}
          />
      </div>
      {oneKeyApprove.show ? (
        <OneKeyApprove
          onClose={oneKeyApproveClose}
          data={oneKeyApprove.data}
          modalType={'fast'}
        />
      ) : null}
    </>
  );
}

export default connect(({ columnWorkList, user, desktopLayout }) => ({
  columnWorkList,
  user,
  desktopLayout,
}))(Index);
