import { Button, Input, Modal, Select, message } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import BasicsTable from '../../components/basicsTable';
import TargetModal from '../../components/targetModal';
import { BASE_WIDTH, ORDER_WIDTH } from '../../util/constant';
import { fetchAPI, scriptEvent } from '../../util/performScript';
import styles from './index.less';

const { confirm } = Modal;
const { Search } = Input;
const { Option } = Select;

//  usedYear 默认获取当前年
const usedYear = new Date().getFullYear();

function Index({ dispatch, targetWarning }) {
  // 引入qiankun主项目传参
  const { location, bizSolId, openEvent, menus } = useModel(
    '@@qiankunStateFromMaster',
  );

  const { normList, isShowEditModal, currentHeight } = targetWarning;
  const [selectedRowKey, setSelectedRowKey] = useState('');
  const [normCode, setNormCode] = useState('');
  const [selectedRow, setSelectedRow] = useState([]);
  const [sctiptMap, setSctiptMap] = useState({});
  const [buttonList, setButtonList] = useState([]);

  useEffect(() => {
    //  获取预警列表
    getWarningList(bizSolId, 1, 10);
  }, []);

  useEffect(() => {
    //  得倒角色功能授权授权的按钮
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
            pre[cur.id] = [cur.beforeEvent, cur.thenEvent, cur.afterEven];
            return pre;
          }, {});
        setSctiptMap(sctiptMap);
        setButtonList(groupButtonList);
        // console.log('sctiptMap:', sctiptMap, groupButtonList);
      }
    }
  }, [menus]);

  //  自定义请求
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

  //获取按钮
  const loopGetButtonList = (tree, buttonList) => {
    tree.map((item) => {
      if (item.children && item.children.length) {
        loopGetButtonList(item.children, buttonList);
      } else if (item.bizSolId == bizSolId) {
        buttonList.push(item.buttonList);
      }
    });
    return buttonList;
  };

  const getWarningList = (bizSolId, start, limit) => {
    dispatch({
      type: 'targetWarning/getWarningList',
      payload: {
        normCode,
        bizSolId,
        usedYear,
        start,
        limit,
      },
    });
  };

  // table 表头
  const columns = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      fixed: 'left',
      width: ORDER_WIDTH,
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '指标编码',
      dataIndex: 'NORM_CODE',
      key: 'NORM_CODE',
      width: BASE_WIDTH,
      ellipsis: true,
    },
    {
      title: '项目',
      dataIndex: 'PROJECT_NAME',
      key: 'PROJECT_NAME',
      width: BASE_WIDTH * 1.5,
      ellipsis: true,
    },
    {
      title: '一月比例',
      width: BASE_WIDTH,
      dataIndex: 'JAN_RATIO',
      key: 'JAN_RATIO',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{text ? `${Number(text)}%` : '-'}</span>
      ),
    },
    ,
    {
      title: '二月比例',
      width: BASE_WIDTH,
      dataIndex: 'FEB_RATIO',
      key: 'FEB_RATIO',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{text ? `${Number(text)}%` : '-'}</span>
      ),
    },
    {
      title: '三月比例',
      width: BASE_WIDTH,
      dataIndex: 'MAR_RATIO',
      key: 'MAR_RATIO',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{text ? `${Number(text)}%` : '-'}</span>
      ),
    },
    {
      title: '四月比例',
      width: BASE_WIDTH,
      dataIndex: 'APR_RATIO',
      key: 'APR_RATIO',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{text ? `${Number(text)}%` : '-'}</span>
      ),
    },
    {
      title: '五月比例',
      width: BASE_WIDTH,
      dataIndex: 'MAY_RATIO',
      key: 'MAY_RATIO',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{text ? `${Number(text)}%` : '-'}</span>
      ),
    },
    {
      title: '六月比例',
      width: BASE_WIDTH,
      dataIndex: 'JUN_RATIO',
      key: 'JUN_RATIO',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{text ? `${Number(text)}%` : '-'}</span>
      ),
    },
    {
      title: '七月比例',
      width: BASE_WIDTH,
      dataIndex: 'JUL_RATIO',
      key: 'JUL_RATIO',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{text ? `${Number(text)}%` : '-'}</span>
      ),
    },
    ,
    {
      title: '八月比例',
      width: BASE_WIDTH,
      dataIndex: 'AUG_RATIO',
      key: 'AUG_RATIO',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{text ? `${Number(text)}%` : '-'}</span>
      ),
    },
    {
      title: '九月比例',
      width: BASE_WIDTH,
      dataIndex: 'SEP_RATIO',
      key: 'SEP_RATIO',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{text ? `${Number(text)}%` : '-'}</span>
      ),
    },
    {
      title: '十月比例',
      width: BASE_WIDTH,
      dataIndex: 'OCT_RATIO',
      key: 'OCT_RATIO',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{text ? `${Number(text)}%` : '-'}</span>
      ),
    },
    {
      title: '十一月比例',
      width: BASE_WIDTH,
      dataIndex: 'NOV_RATIO',
      key: 'NOV_RATIO',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{text ? `${Number(text)}%` : '-'}</span>
      ),
    },
    {
      title: '十二月比例',
      width: BASE_WIDTH,
      dataIndex: 'DEC_RATIO',
      key: 'DEC_RATIO',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{text ? `${Number(text)}%` : '-'}</span>
      ),
    },
  ];

  // 年度切换
  const onYearChange = (value) => {
    console.log(`onYearChange --- ${value}`);
  };

  // 标编码查询
  const onSearchClick = (value) => {
    console.log(`onSearchClick --- ${value}`);
  };

  const rowSelection = {
    // 选中行keys
    selectedRowKeys: selectedRowKey,
    // 选中行onChange
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKey(selectedRowKeys);
      setSelectedRow(selectedRows);
    },
  };

  // 修改click
  function onEditClick() {
    if (selectedRowKey.length) {
      dispatch({
        type: 'targetWarning/updateStates',
        payload: {
          isShowEditModal: true,
          selectedRowKey,
          selectedRow,
        },
      });
    } else {
      message.error('请选择一条要修改的数据');
    }
  }

  // 删除click
  function onDelClick() {
    if (!selectedRowKey.length) {
      message.error('请至少选择一条要删除的单据');
      return;
    }
    confirm({
      title: '',
      content: '确认要删除？',
      onOk() {
        // 删除与后端商定 都传0
        const budgetNormRatioVos = {
          JAN_RATIO: 0,
          FEB_RATIO: 0,
          MAR_RATIO: 0,
          APR_RATIO: 0,
          MAY_RATIO: 0,
          JUN_RATIO: 0,
          JUL_RATIO: 0,
          AUG_RATIO: 0,
          SEP_RATIO: 0,
          OCT_RATIO: 0,
          NOV_RATIO: 0,
          DEC_RATIO: 0,
          WHETHER_WARNING_TLDT_: 0,
        };
        dispatch({
          type: 'targetWarning/saveWarning',
          payload: {
            ids: selectedRowKey.toString(),
            bizSolId,
            budgetNormRatioVos,
            // WHETHER_WARNING_TLDT_: 0,
          },
          callback: function () {
            dispatch({
              type: 'targetWarning/updateStates',
              payload: {
                isShowEditModal: false,
              },
            });
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 新增页面
  function openFormDetail() {
    openEvent();
  }

  return (
    <div className={styles.container} id="targetWarning_id">
      <div className={styles.header}>
        <div>
          <Select
            defaultValue={usedYear}
            style={{ width: 80, marginRight: 8 }}
            onChange={onYearChange}
          >
            <Option value="2022">2022</Option>
            <Option value="2023">2023</Option>
          </Select>
          <Search
            placeholder="请输入指标编码查询"
            onSearch={onSearchClick}
            allowClear
            style={{ width: 200 }}
          />
        </div>
        <div>
          <Button onClick={() => onEditClick()}>修改</Button>
          <Button onClick={() => onDelClick()}>删除</Button>
        </div>
      </div>
      <div className={styles.list}>
        <BasicsTable
          size="small"
          rowKey="ID"
          container="dom_container"
          modulesName="targetWarning"
          dispatch={dispatch}
          dataSource={normList}
          columns={columns}
          pagination={false}
          scroll={
            normList.length
              ? {
                  y: currentHeight,
                }
              : {}
          }
          rowSelection={{
            ...rowSelection,
          }}
        />
      </div>
      {isShowEditModal && <TargetModal />}
    </div>
  );
}

export default connect(({ targetWarning }) => ({
  targetWarning,
}))(Index);
