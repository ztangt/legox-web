import { DoubleRightOutlined, DownOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Row,
  Select,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { connect, history, useModel } from 'umi';
import ImportModal from '../../components/ImportModal/importModal';
import BasicsTable from '../../components/basicsTable';
import IPagination from '../../components/public/iPagination';
import TargetModal from '../../components/targetModal';
import {
  BASE_WIDTH,
  BUDGET_TYPE,
  NORM_STATE,
  ORDER_WIDTH,
  YES_NO,
} from '../../util/constant';
import { fetchAPI, scriptEvent } from '../../util/performScript';
import { formattingMoney } from '../../util/util';
import CarryModal from './components/carryModal';
import DetailModal from './components/detailModal';
import ExportModal from './components/exportModal';
import RelevanceRangModal from './components/relevanceRangModal';
import styles from './index.less';
// import MyIcon from '../../../Icon';
import SetCol from '../../components/setCol';
import TableModal from '../../components/tabelModal/tabelModal';
import {
  advancedSearch,
  getDataSource,
  headerButtons,
  onExpand,
  onOk,
  tabelProps,
} from './components/tableConstant';
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const defCurrentYear = String(new Date().getFullYear());

const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 16,
  },
};

//  TODO
// const start = 1;
function BudgetTarget({ dispatch, budgetTarget, targetWarning }) {
  const { location, openEvent, openNewPage, menus } = useModel(
    '@@qiankunStateFromMaster',
  );

  const { bizSolId, uuId, url, menuId } = location.query;

  const allColumnsList = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      width: ORDER_WIDTH,
      fixed: 'left',
      render: (text, record, index) => (
        <a
          onClick={
            openFormDetail.bind(this, {}, {}, record.BIZ_ID, record, 'Y') // 点击行
          }
        >
          {index + 1}
        </a>
      ),
    },
    {
      key: 'NORM_CODE',
      dataIndex: 'NORM_CODE',
      title: '指标编码',
      width: BASE_WIDTH,
      render: (text, record) => (
        <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
          {text}
        </span>
      ),
    },
    {
      key: 'BUDGET_ORG_NAME_',
      dataIndex: 'BUDGET_ORG_NAME_',
      title: '预算单位',
      width: BASE_WIDTH * 1.5,
      render: (text, record) => (
        <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
          {text}
        </span>
      ),
    },
    {
      key: 'PROJECT_NAME',
      dataIndex: 'PROJECT_NAME',
      title: '项目',
      width: BASE_WIDTH * 1.5,
      render: (text, record) => (
        <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
          {text}
        </span>
      ),
    },
    {
      key: 'ECONOMIC_SUBJECT_NAME',
      dataIndex: 'ECONOMIC_SUBJECT_NAME',
      title: '经济科目',
      width: BASE_WIDTH * 1.5,
      render: (text, record) => (
        <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
          {text}
        </span>
      ),
    },
    {
      key: 'CR_BUDGET',
      dataIndex: 'CR_BUDGET',
      title: '管控总额度',
      width: BASE_WIDTH,
      align: 'right',
      render: (text, record) => (
        <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
          {formattingMoney(text)}
        </span>
      ),
    },
    {
      key: 'FREEZE_BUDGET',
      dataIndex: 'FREEZE_BUDGET',
      title: '冻结金额',
      width: BASE_WIDTH,
      align: 'right',
      render: (text, record) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            onOpenNewPage('FREEZE_BUDGET', record.NORM_CODE, record.ID);
          }}
        >
          {formattingMoney(text)}
        </a>
      ),
    },
    {
      key: 'EXECUTE_BUDGET',
      dataIndex: 'EXECUTE_BUDGET',
      title: '执行金额',
      width: BASE_WIDTH,
      align: 'right',
      render: (text, record) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            onOpenNewPage('EXECUTE_BUDGET', record.NORM_CODE, record.ID);
          }}
        >
          {formattingMoney(text)}
        </a>
      ),
    },
    {
      key: 'ACTUAL_BUDGET',
      dataIndex: 'ACTUAL_BUDGET',
      title: '指标余额',
      width: BASE_WIDTH,
      align: 'right',
      render: (text, record) => (
        <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
          {formattingMoney(text)}
        </span>
      ),
    },
    {
      key: 'AVL_BUDGET',
      dataIndex: 'AVL_BUDGET',
      title: '指标可用额度',
      width: BASE_WIDTH,
      align: 'right',
      render: (text, record) => (
        <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
          {formattingMoney(text)}
        </span>
      ),
    },
    {
      key: 'WAY_FREEZE_BUDGET',
      dataIndex: 'WAY_FREEZE_BUDGET',
      title: '在途冻结',
      width: BASE_WIDTH,
      align: 'right',
      render: (text, record) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            onOpenNewPage('WAY_FREEZE_BUDGET', record.NORM_CODE, record.ID);
          }}
        >
          {formattingMoney(text)}
        </a>
      ),
    },
    {
      key: 'WAY_EXEC_BUDGET',
      dataIndex: 'WAY_EXEC_BUDGET',
      title: '在途执行',
      width: BASE_WIDTH,
      align: 'right',
      render: (text, record) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            onOpenNewPage('WAY_EXEC_BUDGET', record.NORM_CODE, record.ID);
          }}
        >
          {formattingMoney(text)}
        </a>
      ),
    },
    {
      key: 'MANAGE_DEPT_NAME_',
      dataIndex: 'MANAGE_DEPT_NAME_',
      title: '管理部门',
      width: BASE_WIDTH,
      render: (text, record) => (
        <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
          {text}
        </span>
      ),
    },
    {
      key: 'CR_BUDGET_TYPE_TLDT_',
      dataIndex: 'CR_BUDGET_TYPE_TLDT_',
      title: '控制方式',
      width: BASE_WIDTH,
      render: (text, record) => (
        <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
          {BUDGET_TYPE?.[text] || ''}
        </span>
      ),
    },
    {
      key: 'NORM_STATE_TLDT_',
      dataIndex: 'NORM_STATE_TLDT_',
      title: '指标状态',
      width: BASE_WIDTH,
      render: (text, record) => (
        <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
          {NORM_STATE[text]}
        </span>
      ),
    },
    {
      key: 'IS_ENABLE_TLDT_',
      dataIndex: 'IS_ENABLE_TLDT_',
      title: '是否启用',
      width: BASE_WIDTH,
      render: (text, record) => (
        <span className={!record.isSatisfyWarning ? styles.redColor : ''}>
          {YES_NO[text]}
        </span>
      ),
    },
    // {
    //   key: 'normCode',
    //   dataIndex: 'normCode',
    //   title: (
    //     <div className="flex flex_justify_between">
    //         <div>调整记录</div>
    //         <SetCol
    //             allCols={allColumns}
    //             selectColumnCode={selectColumnCode}
    //             changeColVisiblePop={changeColVisiblePop}
    //             taskType=""
    //             colVisiblePop={colVisiblePop}
    //             saveCols={saveCols}
    //             id="budgetTarget_id"
    //         />
    //     </div>
    // ),
    //   fixed: 'right',
    //   width: BASE_WIDTH,
    //   render: (text, record) => (
    //     <a
    //       onClick={(e) => {
    //         e.stopPropagation();
    //         onShowDetail(record.NORM_CODE);
    //       }}
    //     >
    //       详情
    //     </a>
    //   ),
    // },
  ];
  const [form] = Form.useForm();
  let {
    currentYear,
    start,
    limit,
    currentHeight,
    sizeFlag,
    currentPage,
    returnCount,
    normList,
    isShowDetailModal,
    isShowCarryModal,
    isShowReleveModal,
    orgUserType,
    selectedDataIds,
    selectedDatas,
    cutomHeaders,
    isShowImportModal,
    importType,
    importData,
    importLoading,
    fileType,
    columns,
    allColumns,
  } = budgetTarget;
  const { editCount, isShowEditModal } = targetWarning;

  // TODO 导出列
  const exportColumns = '';

  const [exportVisible, setExportVisible] = useState(false); //导出弹框
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedRowKeyIds, setSelectedRowKeyIds] = useState([]);
  const [sctiptMap, setSctiptMap] = useState({});
  const [buttonList, setButtonList] = useState([]);
  const [isTree, setIsTree] = useState(false);
  const [nCode, setNCode] = useState('');

  const [showMore, setShowMore] = useState(false);
  const [isTableModal, setIsTableModal] = useState(false);
  const [colVisiblePop, setColVisiblePop] = useState(false); //设置列的设置弹框
  const [selectColumnCode, setSelectColumnCode] = useState(
    allColumnsList.map((item) => item.key),
  ); //选中的列
  //设置初始化的表格列表头
  useEffect(() => {
    let columnsList = [...allColumnsList];
    let selectArr = [...allColumnsList].map((item) => item.key);
    if (localStorage.getItem('BudgetTarget_Controls_SetCol')) {
      selectArr = localStorage
        .getItem('BudgetTarget_Controls_SetCol')
        .split(',');
      //按照选中的顺序排序
      let newColumns = [];
      selectArr.forEach((item) => {
        let columnsItem = columnsList.find(
          (columnsItem) => columnsItem.key == item,
        );
        if (columnsItem) {
          newColumns.push(columnsItem);
        }
      });
      columnsList = [...newColumns];
    }
    setSelectColumnCode(selectArr);
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        allColumns: [...allColumnsList],
        columns: [...columnsList],
      },
    });
  }, []);

  const changeColVisiblePop = () => {
    if (!colVisiblePop) {
      let selectKeys = columns.map((item) => item.key);
      //选中的排在最前面
      const newAllColumns = allColumnsList.sort((a, b) => {
        // 检查 a 的 key 是否在 B 中
        const aKeyIndex = selectKeys.indexOf(a.key);
        // 检查 b 的 key 是否在 B 中
        const bKeyIndex = selectKeys.indexOf(b.key);
        // 如果 a 在 B 中，但 b 不在 B 中，则 a 排在前面
        if (aKeyIndex !== -1 && bKeyIndex === -1) {
          return -1;
        }
        // 如果 a 不在 B 中，但 b 在 B 中，则 b 排在前面
        if (aKeyIndex === -1 && bKeyIndex !== -1) {
          return 1;
        }
        // 否则，保持原始顺序
        return 0;
      });
      dispatch({
        type: 'budgetTarget/updateStates',
        payload: {
          allColumns: [...newAllColumns],
        },
      });
    }
    setColVisiblePop(!colVisiblePop);
  };

  const saveCols = (colSelectKey, colSelect) => {
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        columns: [...colSelect],
      },
    });
    setSelectColumnCode(colSelectKey);
    localStorage.setItem('BudgetTarget_Controls_SetCol', colSelectKey);
    setColVisiblePop(false);
  };
  columns = [
    ...columns,
    {
      key: 'normCode',
      dataIndex: 'normCode',
      title: (
        <div className="flex flex_justify_between">
          <div>调整记录</div>
          <SetCol
            allCols={allColumns}
            selectColumnCode={selectColumnCode}
            changeColVisiblePop={changeColVisiblePop}
            taskType=""
            colVisiblePop={colVisiblePop}
            saveCols={saveCols}
            id="budgetTarget_id"
          />
        </div>
      ),
      fixed: 'right',
      width: BASE_WIDTH,
      render: (text, record) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            onShowDetail(record.NORM_CODE);
          }}
        >
          详情
        </a>
      ),
    },
  ];

  useEffect(() => {
    limit &&
      url === 'budgetTarget' &&
      getNormList(bizSolId, isTree, currentYear, start, limit, nCode);
  }, [isTree, editCount, currentYear, uuId, limit]);
  useEffect(() => {
    //得倒角色功能授权授权的按钮
    if (menus) {
      //按钮
      let buttonList = [];
      let newButtonList = loopGetButtonList(menus, []);
      if (newButtonList.length) {
        buttonList = newButtonList[0];
        const groupButtonList = _.groupBy(
          _.orderBy(buttonList, ['groupName'], ['desc']),
          'groupName',
        );
        const sctiptMap =
          buttonList &&
          buttonList.reduce((pre, cur) => {
            pre[cur.id] = [cur.thenEvent];
            return pre;
          }, {});
        setSctiptMap(sctiptMap);
        setButtonList(groupButtonList);
      }
    }
  }, [menus]);

  function updateLimit(height) {
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        limit: Math.floor(height / 40),
      },
    });
  }

  function updateSizeFlag(sizeFlag) {
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        sizeFlag,
      },
    });
  }

  //获取按钮
  const loopGetButtonList = (tree, buttonList) => {
    tree.map((item) => {
      if (item.children && item.children.length) {
        loopGetButtonList(item.children, buttonList);
      } else if (item.bizSolId == bizSolId || item.menuId == menuId) {
        buttonList.push(item.buttonList);
      }
    });
    return buttonList;
  };

  const getNormList = (
    bizSolId,
    isTree,
    usedYear,
    start,
    limit,
    normCode = '',
    parentId = '',
    budgetOrgId_ = '',
    registerIdentityId = '',
    usedDept_ = '',
    projectTypeCode = '',
    projectCode = '',
    funcSubjectCode = '',
    economicSubjectCode = '',
    moneySourceTldt_ = '',
    crBudget = '',
    calculateType = '',
  ) => {
    dispatch({
      type: 'budgetTarget/getNormList',
      payload: {
        bizSolId,
        isTree: isTree ? 1 : 0,
        usedYear,
        start,
        limit,
        parentId,
        budgetOrgId_,
        registerIdentityId,
        normCode,
        usedDept_,
        projectTypeCode,
        projectCode,
        funcSubjectCode,
        economicSubjectCode,
        moneySourceTldt_,
        crBudget,
        calculateType,
      },
    });
  };

  //按列表结转
  const carryList = () => {
    if (selectedRowKey.length) {
      for (let i = 0; i < selectedRow.length; i++) {
        if (selectedRow[i].NORM_STATE_TLDT_ == 2) {
          message.warning('选中指标中包含已结转的数据，请重新选择！');
          return;
        }
      }
      dispatch({
        type: 'budgetTarget/annualCarryForward',
        payload: {
          bizSolId,
          ids: selectedRowKeyIds.toString(),
          usedYear: currentYear,
          carryForwardType: 0,
        },
        callback: () => {
          getNormList(bizSolId, isTree, currentYear, start, limit);
          setSelectedRowKey([]);
          setSelectedRow([]);
        },
      });
    } else {
      message.warning('请至少选择一条数据');
    }
  };

  //按项目结转（打开弹窗）
  const carryProject = () => {
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        isShowCarryModal: true,
      },
    });
  };

  //预警设置（打开弹窗）
  const warningSet = () => {
    console.log('warningSet', selectedRowKey);
    if (selectedRowKey.length) {
      dispatch({
        type: 'targetWarning/updateStates',
        payload: {
          isShowEditModal: true,
          selectedRowKey: selectedRowKeyIds,
          selectedRow,
        },
      });
    } else {
      message.warning('请至少选择一条数据');
    }
  };
  //预警设置（reset）
  const resetKeys = () => {
    setSelectedRowKey([]);
    setSelectedRow([]);
    dispatch({
      type: 'targetWarning/updateStates',
      payload: {
        selectedRowKey: [],
        selectedRow: [],
      },
    });
  };

  // 启用
  const startUse = () => {
    if (selectedRowKey.length === 0) {
      message.warning('请至少选择一条数据');
    } else {
      let obj = {
        ID: selectedRowKeyIds,
        BIZ_SOL_ID: bizSolId,
        IS_ENABLE_TLDT_: 1,
        UPDATE_TIME: selectedRow[0].UPDATE_TIME || '',
      };
      let updateStr = JSON.stringify(obj);
      powerNorm(updateStr, '启用');
    }
  };

  // 停用
  const stopUse = () => {
    if (selectedRowKey.length === 0) {
      message.warning('请至少选择一条数据');
    } else {
      let obj = {
        ID: selectedRowKeyIds,
        BIZ_SOL_ID: bizSolId,
        IS_ENABLE_TLDT_: 0,
        UPDATE_TIME: selectedRow[0].UPDATE_TIME || '',
      };
      let updateStr = JSON.stringify(obj);
      powerNorm(updateStr, '停用');
    }
  };

  // 收回
  const regainItem = () => {
    if (selectedRowKey.length === 0) {
      message.warning('请至少选择一条数据');
    } else {
      let obj = {
        ID: selectedRowKeyIds,
        BIZ_SOL_ID: bizSolId,
        NORM_STATE_TLDT_: 0,
        UPDATE_TIME: selectedRow[0].UPDATE_TIME || '',
      };
      let updateStr = JSON.stringify(obj);
      powerNorm(updateStr, '收回');
    }
  };

  // 取消收回
  const cancelRegainItem = () => {
    if (selectedRowKey.length === 0) {
      message.warning('请至少选择一条数据');
    } else {
      let obj = {
        ID: selectedRowKeyIds,
        BIZ_SOL_ID: bizSolId,
        NORM_STATE_TLDT_: 1,
        UPDATE_TIME: selectedRow[0].UPDATE_TIME || '',
      };
      let updateStr = JSON.stringify(obj);
      powerNorm(updateStr, '取消收回');
    }
  };

  // 注释
  function powerNorm(updateStr, describe) {
    dispatch({
      type: 'budgetTarget/powerNorm',
      payload: {
        updateStr,
      },
      callback: function () {
        message.success(`${describe}成功`);
        getNormList(bizSolId, isTree, currentYear, start, limit);
        setSelectedRowKey([]);
        setSelectedRow([]);
      },
    });
  }

  function openFormDetail() {
    console.log('--------:', selectedRow, arguments, arguments.length);
    if (arguments.length === 0) {
      console.log(
        'arguments.length === 0--------:',
        selectedRow,
        arguments,
        arguments.length,
      );
      //新增
      openEvent({});
    } else if (arguments.length === 1) {
      console.log(
        'arguments.length === 1--------:',
        selectedRow,
        arguments,
        arguments.length,
      );
      //新增
      openEvent(arguments[0]);
    } else if (arguments.length === 5) {
      console.log(
        'arguments.length === 5--------:',
        selectedRow,
        arguments,
        arguments.length,
      );
      //修改
      if (selectedRow.length === 1) {
        console.log('arguments.length === 5--------:', selectedRow);
        dispatch({
          type: 'budgetTarget/checkNorm',
          payload: {
            normId: selectedRow?.[0].ID,
          },
          callback: (data) => {
            if (data) {
              message.warning('此指标已被使用，无法修改');
              console.log('此指标已被使用，无法修改===');
            } else {
              console.log(
                'openEvent({}, {}, selectedRow?.[0]?.BIZ_ID, selectedRow?.[0]);=====',
              );
              openEvent({}, {}, selectedRow?.[0]?.BIZ_ID, selectedRow?.[0]);
            }
          },
        });
        console.log('dispatch later ===');
      } else {
        message.warning('请选择一条数据');
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

  const fetchCheckAPI = async (method, url, body) => {
    const storage = window.localStorage;

    let options = {
      method: method,
      headers: {
        Authorization: 'Bearer ' + storage.userToken,
      },
    };

    if (method != 'GET') {
      options.body = body;
    }

    let fetchUrl = method === 'GET' ? `${url}/${body}` : url;

    await fetchAPI(fetchUrl, options)
      .then((res) => {
        let titleText = res.data ? '此指标已被使用，无法修改' : '此指标未使用';

        confirm({
          title: titleText,
          content: '',
          onOk() {},
          onCancel() {},
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const buttonFn = async (code, id, rowInfo, e) => {
    try {
      // console.log('selectedRow',selectedRow);
      let normId = selectedRow.length ? selectedRow?.[0].ID : '';
      // scriptEvent 为按钮前置、中置、后置事件列表
      let fnList = await scriptEvent(sctiptMap[id]);
      let isNull = fnList.filter((i) => i);
      console.log('buttonFn:', fnList, isNull);
      if (!isNull || isNull.length === 0) {
        console.log('PSBG');
        // switch (code) {
        // case 'add':
        //   openFormDetail();
        //   break;
        // case 'delete':
        //   handleDelete(rowInfo);
        //   break;
        // case 'update':
        //   openFormDetail(rowInfo.BIZ_ID, rowInfo);
        //   break;
        //   default:
        //     break;
        // }
      } else {
        fnList.forEach((item) => {
          // 送交特殊逻辑判断
          if (!item.includes('onRule(true)')) {
            // 执行脚本
            let fn = eval(item);
            fn();
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onPressEnter = (e) => {
    e.stopPropagation();
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        currentYear: e.target.value,
      },
    });
  };

  const onYearChange = (currentYear) => {
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        currentYear,
      },
    });
  };

  const onSearchClick = (value) => {
    console.log(`onSearchClick --- ${value}`);
    setNCode(value);
    getNormList(bizSolId, isTree, currentYear, start, limit, value);
  };

  const onSelectChange = (selectedRowKey, selectedRows, info) => {
    setSelectedRowKey(selectedRowKey);
    setSelectedRow(selectedRows);
    let ids = [];
    let bzids = [];
    let deployFormIds = [];
    const array = selectedRowKey;
    array.forEach((item) => {
      const tmp = item.split('-');
      ids.push(tmp[0]); // ID
      bzids.push(tmp[1]); // BIZ_ID
      deployFormIds.push(tmp[2]); // DEPLOY_FORM_ID
    });
    setSelectedRowKeyIds(ids);
    setCutomHeaders(ids.toString(), bzids.toString(), deployFormIds.toString());
    window.localStorage.setItem('normId', selectedRows?.[0]?.ID);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKey,
    defaultSelectedRowKeys: selectedRowKey,
    onChange: onSelectChange,
  };

  const handleDelete = () => {
    if (selectedRowKey.length === 1) {
      confirm({
        title: '',
        content: '确认要删除？',
        onOk() {
          dispatch({
            type: 'budgetTarget/checkNorm',
            payload: {
              normId: selectedRow?.[0].ID,
            },
            callback: (data) => {
              if (data) {
                message.warning('此指标已被使用，无法删除');
              } else {
                dispatch({
                  type: 'budgetTarget/delFormData',
                  payload: {
                    bizSolId,
                    ids: selectedRowKeyIds.join(','),
                  },
                  callback: () => {
                    getNormList(bizSolId, isTree, currentYear, start, limit);
                  },
                });
              }
            },
          });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      message.error('请选择一条要删除的单据');
    }
  };

  const onFinish = (values) => {
    console.log(form.getFieldValue(`budgetOrgId_id`));
    console.log(form.getFieldValue(`usedDept_id`));
    console.log(form.getFieldValue(`registerIdentityIdid`));
    console.log('Success:', values);
    const {
      normCode,
      projectTypeCode,
      projectCode,
      funcSubjectCode,
      economicSubjectCode,
      moneySourceTldt_,
      guankong,
      crBudget,
      calculateType,
    } = values;
    getNormList(
      bizSolId,
      isTree,
      currentYear,
      start,
      limit,
      normCode,
      '', //parentId
      form.getFieldValue(`budgetOrgId_id`), // budgetOrgId_
      form.getFieldValue(`registerIdentityIdid`), // registerIdentityId
      form.getFieldValue(`usedDept_id`), //usedDept_,
      projectTypeCode,
      projectCode,
      funcSubjectCode,
      economicSubjectCode,
      moneySourceTldt_,
      guankong.crBudget,
      guankong.calculateType,
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  function onShowDetail(normCode) {
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        normCode,
        isShowDetailModal: true,
      },
    });
  }

  function onOpenNewPage(type, normCode, id) {
    switch (type) {
      case 'FREEZE_BUDGET':
        console.log('冻结');
        // openNewPage('FREEZE_BUDGET', normCode, 'FREEZE');
        history.push({
          pathname: '/freezeOrExec',
          query: {
            id,
            normCode,
            moneyType: 'FREEZE',
            currentYear,
          },
        });
        break;
      case 'EXECUTE_BUDGET':
        console.log('执行');
        history.push({
          pathname: '/freezeOrExec',
          query: {
            id,
            normCode,
            moneyType: 'EXECUTE',
            currentYear,
          },
        });
        break;
      case 'WAY_FREEZE_BUDGET':
        console.log('在途冻结');
        history.push({
          pathname: '/wayList',
          query: {
            id,
            normCode,
            moneyType: 'WAY_FREEZE',
            currentYear,
          },
        });
        break;
      case 'WAY_EXEC_BUDGET':
        console.log('在途执行');
        history.push({
          pathname: '/wayList',
          query: {
            id,
            normCode,
            moneyType: 'WAY_EXECUTE',
            currentYear,
          },
        });
        break;
      default:
        break;
    }
  }

  const buttonMenu = (group) => {
    return (
      <Menu>
        {group.map((item) => {
          if (item.buttonCode != 'update') {
            return (
              <Menu.Item
                key={item.buttonCode}
                onClick={() => {
                  buttonFn(item.buttonCode, item.id, '');
                }}
              >
                <span>{item.buttonName}</span>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );
  };

  const setShowModal = (orgUserType, formType) => {
    console.log(orgUserType, formType, form.getFieldValue(`${formType}id`));
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        formType,
        isShowReleveModal: true,
        selectedDataIds: form.getFieldValue(`${formType}id`)
          ? form.getFieldValue(`${formType}id`).split(',')
          : [],
        orgUserType,
      },
    });
  };

  const changePage = (nextPage, size) => {
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        start: nextPage,
        limit: size,
      },
    });
    getNormList(bizSolId, isTree, currentYear, nextPage, size);
  };

  const onExport = async (fileType) => {
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        fileType,
      },
    });
    setExportVisible(true);
  };

  function refreshList() {
    getNormList(bizSolId, isTree, currentYear, start, limit);
  }

  const onImportClick = (importType) => {
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        isShowImportModal: true,
        importType,
      },
    });
  };

  function onDownLoadTemplate() {
    fetch(
      `${window.localStorage.getItem(
        'env',
      )}/setup/bizSol/bussinessForm/import-template-downpath/${bizSolId}`,
      {
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
        },
      },
    ).then((response) => {
      response.json().then((res) => {
        if (res.code == 200) {
          if (res.data.downPath) {
            window.open(res.data.downPath);
          }
        } else {
          message.error(res.msg);
        }
      });
    });
  }

  function onImportCancel() {
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        isShowImportModal: false,
        importData: {},
      },
    });
  }

  const setCutomHeaders = (mainTableId, bizInfoId, deployFormId) => {
    // 必传字段：bizSolId, mainTableId,
    // 选传字段：deployFormId, bizInfoId
    cutomHeaders.bizSolId = bizSolId;
    if (mainTableId) {
      cutomHeaders.mainTableId = mainTableId;
    }
    if (bizInfoId) {
      cutomHeaders.bizInfoId = bizInfoId;
    }
    if (deployFormId) {
      cutomHeaders.deployFormId = deployFormId;
    }
    dispatch({
      type: 'budgetTarget/updateStates',
      payload: {
        cutomHeaders,
      },
    });
  };

  // <Button onClick={()=>onImportClick('NORM_BUDGET_IMPORT')}>导入</Button>

  return (
    <>
      <div className={styles.container} id="budgetTarget_id">
        <div className={styles.list_head} id="list_head">
          <div className={styles.header}>
            <div className={styles.button_group}>
              <InputNumber
                min={1000}
                max={9999}
                style={{ width: 80, height: 32, marginRight: 8 }}
                value={currentYear}
                defaultValue={currentYear}
                onChange={onYearChange}
                onStep={onYearChange}
                onPressEnter={onPressEnter}
              />
              {/* <Select
                defaultValue={currentYear}
                style={{ width: 80, height: 32, marginRight: 8 }}
                onChange={onYearChange}
              >
                <Option value={defCurrentYear - 1}>{defCurrentYear - 1}</Option>
                <Option value={defCurrentYear}>{defCurrentYear}</Option>
              </Select> */}
              <Search
                placeholder="请输入指标编码查询"
                onSearch={onSearchClick}
                allowClear
                style={{ width: 200 }}
              />
              {/* <Button onClick={() => setShowMore(true)}>高级查询</Button> */}
              <>
                <span
                  className={styles.high_level}
                  onClick={() => {
                    setShowMore(!showMore);
                  }}
                >
                  高级
                </span>
                <DoubleRightOutlined
                  onClick={() => {
                    setShowMore(!showMore);
                  }}
                  rotate={90}
                  style={{ fontSize: '8px', marginTop: 12 }}
                />
              </>
            </div>
            <div className={styles.search}>
              {buttonList &&
                Object.keys(buttonList).map((key) => {
                  if (!key || key == 'null') {
                    return buttonList[key].map((item) => {
                      if (item.buttonCode != 'update')
                        return (
                          <Button
                            className={styles.mbr_4}
                            onClick={() => {
                              buttonFn(item.buttonCode, item.id, '');
                            }}
                            key={item.buttonCode}
                          >
                            {item.buttonName}
                          </Button>
                        );
                    });
                  } else {
                    return (
                      <Dropdown
                        overlay={buttonMenu(buttonList[key])}
                        placement="bottom"
                      >
                        <Button className={styles.dropButton}>
                          {key}
                          <DownOutlined />
                        </Button>
                      </Dropdown>
                    );
                  }
                })}
            </div>
          </div>
          {showMore && (
            <div className={styles.more} id="more">
              <Form
                form={form}
                name="basic"
                colon={false}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className={styles.high_form}
                style={{ width: '100%' }}
              >
                <Row
                  gutter={{
                    xs: 8,
                    sm: 16,
                    md: 24,
                    lg: 32,
                  }}
                >
                  <Col span={8}>
                    <Form.Item label="预算单位" name="budgetOrgId_">
                      <Input
                        onClick={() => setShowModal('ORG', 'budgetOrgId_')}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="指标编码" name="normCode">
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="使用部门" name="usedDept_">
                      <Input
                        onClick={() => setShowModal('DEPT', 'usedDept_')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row
                  gutter={{
                    xs: 8,
                    sm: 16,
                    md: 24,
                    lg: 32,
                  }}
                >
                  <Col span={8}>
                    <Form.Item label="项目分类" name="projectTypeCode">
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="项目" name="projectCode">
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="资金来源" name="moneySourceTldt_">
                      <Select
                        placeholder="请选择"
                        allowClear
                        style={{
                          width: '100%',
                        }}
                      >
                        <Option value="0">财政批复</Option>
                        <Option value="1">上年结转</Option>
                        <Option value="2">收入资金</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row
                  gutter={{
                    xs: 8,
                    sm: 16,
                    md: 24,
                    lg: 32,
                  }}
                >
                  <Col span={8}>
                    <Form.Item label="功能科目" name="funcSubjectCode">
                      {/* <Input
                        onClick={() => setIsTableModal(true)}
                        // addonAfter={
                        //   <MyIcon
                        //     type="icontongyong"
                        //     onClick={() => {
                        //       setIsTableModal(true);
                        //     }}
                        //   />
                        // }
                      /> */}
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="经济科目" name="economicSubjectCode">
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="管控总额度">
                      <Input.Group compact>
                        <Form.Item name={['guankong', 'calculateType']} noStyle>
                          <Select
                            allowClear
                            placeholder="请选择"
                            style={{
                              width: '25%',
                              marginRight: 8,
                            }}
                          >
                            <Option value="1">等于</Option>
                            <Option value="2">大于等于</Option>
                            <Option value="3">小于等于</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item name={['guankong', 'crBudget']} noStyle>
                          <InputNumber
                            style={{
                              width: '70%',
                            }}
                            placeholder="请输入额度"
                          />
                        </Form.Item>
                      </Input.Group>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="登记人" name="registerIdentityId">
                      <Input
                        onClick={() =>
                          setShowModal('USER', 'registerIdentityId')
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item {...tailLayout}>
                  <Button htmlType="submit">查询</Button>
                  <Button
                    onClick={() => form.resetFields()}
                    style={{ margin: '0 30px' }}
                  >
                    重置
                  </Button>
                  <Button onClick={() => setShowMore(false)}>取消</Button>
                </Form.Item>
              </Form>
            </div>
          )}
        </div>
        <div>
          {/* <SlidersTwoTone
          style={{ fontSize: 22, cursor: 'pointer' }}
          onClick={() => setIsTree(!isTree)}
        /> */}
          <BasicsTable
            listHead="list_head"
            container="dom_container"
            modulesName="budgetTarget"
            key={showMore}
            dispatch={dispatch}
            rowKey={(record) =>
              `${record.ID}-${record.BIZ_ID}-${record.DEPLOY_FORM_ID}`
            }
            bordered
            rowSelection={rowSelection}
            columns={columns}
            dataSource={normList}
            pagination={false}
            scroll={
              normList.length
                ? {
                    y: currentHeight,
                  }
                : {}
            }
            // onRow={(record, index) => {
            //   return {
            //     onClick: openFormDetail.bind(
            //       this,
            //       {},
            //       {},
            //       record.BIZ_ID,
            //       record,
            //       'Y',
            //     ), // 点击行
            //   };
            // }}
          />
        </div>
        <IPagination
          current={Number(currentPage)}
          total={returnCount}
          onChange={changePage}
          pageSize={limit}
          isRefresh={true}
          // sizeFlag={sizeFlag}
          // setFlagFn={updateSizeFlag}
          refreshDataFn={() => {
            getNormList(bizSolId, isTree, currentYear, start, limit);
          }}
        />
        {isShowDetailModal && <DetailModal currentYear={currentYear} />}
        {isShowCarryModal && (
          <CarryModal bizSolIdOther={bizSolId} currentYear={currentYear} />
        )}
        {isShowEditModal && (
          <TargetModal
            WHETHER_WARNING_TLDT_="1"
            containerId="budgetTarget_controlsid"
            bizSolId={bizSolId}
            resetKeys={resetKeys}
          />
        )}
        {isShowReleveModal && (
          <RelevanceRangModal orgUserType={orgUserType} form={form} />
        )}
        {exportVisible && (
          <ExportModal
            usedYear={currentYear}
            bizSolId={bizSolId}
            fileType={fileType}
            columns={exportColumns}
            selectedRowKeys={selectedRowKeyIds}
            setExportVisible={setExportVisible}
          ></ExportModal>
        )}
        {isShowImportModal && (
          <ImportModal
            usedYear={currentYear}
            bizSolId={bizSolId}
            importData={importData}
            importType={importType}
            importLoading={importLoading}
            refreshList={refreshList.bind(this)}
            onCancel={onImportCancel.bind(this)}
          />
        )}
      </div>
      {isTableModal && (
        <TableModal
          tableModalParams={{
            getDataSource,
            tabelProps,
            advancedSearch,
            onOk,
            onExpand,
            headerButtons,
          }}
          setIsTableModal={setIsTableModal}
          formModelingName={'budgetTarget_id'}
        />
      )}
    </>
  );
}
export default connect(({ budgetTarget, targetWarning }) => ({
  budgetTarget,
  targetWarning,
}))(BudgetTarget);
