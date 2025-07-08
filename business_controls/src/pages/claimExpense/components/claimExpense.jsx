import { Button, Input, Modal, message } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import searchIcon from '../../../../public/assets/search.svg';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/public/iPagination';
import { dataFormat } from '../../../util/util';
import styles from '../index.less';
import AddModal from './addModal';
const { Search } = Input;
const { confirm } = Modal;
function claimExpense({ dispatch, claimExpense }) {
  const {
    list,
    selectedRowKeys,
    limit,
    currentPage,
    returnCount,
    searchWord,
    isShowAddModal,
    detailData,
    currentHeight,
  } = claimExpense;
  useEffect(() => {
    getPreexpenseList('', currentPage, limit);
  }, [limit]);
  const getPreexpenseList = (searchWord, start, limit) => {
    dispatch({
      type: 'claimExpense/getPreexpenseList',
      payload: {
        searchWord: searchWord,
        start: start,
        limit: limit,
      },
    });
  };
  const onSearch = (value) => {
    dispatch({
      type: 'claimExpense/updateStates',
      payload: {
        searchWord: value,
      },
    });
    getPreexpenseList(value, 1, limit);
  };
  const changePage = (nextPage, size) => {
    dispatch({
      type: 'claimExpense/updateStates',
      payload: {
        limit: size,
        currentPage: nextPage,
      },
    });
    getPreexpenseList(searchWord, nextPage, size);
  };
  const deleteClaimExpense = (ids) => {
    if (ids.length > 0) {
      confirm({
        content: '确认要删除吗？',
        mask: false,
        getContainer: () => {
          return document.getElementById('claimExpense_id');
        },
        onOk: () => {
          dispatch({
            type: 'claimExpense/deletePreexpense',
            payload: {
              preExpenseIds: ids.join(','),
            },
          });
        },
      });
    } else {
      message.warn('请选择一条数据');
    }
  };
  const addClaimExpense = (record) => {
    console.log(record);
    dispatch({
      type: 'claimExpense/getDictType',
      payload: {
        dictTypeId: 'CCLX',
        showType: 'ALL',
        isTree: '1',
        searchWord: '',
      },
    });
    if (record.preExpenseId) {
      dispatch({
        type: 'claimExpense/getOnePreexpense',
        payload: {
          preExpenseId: record.preExpenseId,
        },
      });
    }
    // setTimeout(() => {
    dispatch({
      type: 'claimExpense/updateStates',
      payload: {
        isShowAddModal: true,
        detailData: record,
      },
    });
    // }, 200);
  };
  const tableProps = {
    rowKey: 'preExpenseId',
    columns: [
      {
        title: '序号',
        dataIndex: 'number',
        width: 80,
        render: (text) => <span>{text}</span>,
      },
      {
        title: '业务应用',
        dataIndex: 'bizSolName',
      },
      {
        title: '超出类型',
        dataIndex: 'overstepTypeName',
      },
      {
        title: '允许超出金额',
        dataIndex: 'overstepFee',
      },
      {
        title: '允许超出比例(%)',
        dataIndex: 'overstepRatio',
        render: (text) => (
          <span>
            {text} {`${text ? '%' : ''}`}
          </span>
        ),
      },
      {
        title: '最后修改时间',
        dataIndex: 'updateTime',
        render: (text) => {
          return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '操作',
        dataIndex: 'preExpenseId',
        render: (text, record) => {
          return (
            <div className={styles.action}>
              <a
                onClick={() => {
                  addClaimExpense(record);
                }}
              >
                修改
              </a>
              <a
                onClick={() => {
                  deleteClaimExpense([text]);
                }}
              >
                删除
              </a>
            </div>
          );
        },
      },
    ],
    dataSource: list.map((item, index) => {
      item.number = index + 1;
      return item;
    }),
    pagination: false,
    rowSelection: {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'claimExpense/updateStates',
          payload: {
            selectedRowKeys,
          },
        });
      },
    },
  };
  return (
    <div className={styles.container} id="claimExpense_id">
      <div id="list_head">
        <div className={styles.header}>
          <div className={styles.search}>
            <Input.Search
              placeholder="请输入业务应用查询"
              onSearch={onSearch}
              allowClear
              enterButton={
                <img
                  src={searchIcon}
                  style={{ marginRight: 8, marginTop: -3, marginLeft: 4 }}
                />
              }
            />
          </div>
          <div className={styles.button}>
            <Button
              onClick={() => {
                addClaimExpense('');
              }}
            >
              新增
            </Button>
            <Button
              onClick={() => {
                deleteClaimExpense(selectedRowKeys);
              }}
            >
              删除
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.table}>
        <ColumnDragTable
          taskType="MONITOR"
          modulesName="claimExpense"
          {...tableProps}
          scroll={{ y: 'calc(100vh - 310px)' }}
        />
      </div>
      <IPagination
        current={Number(currentPage)}
        total={returnCount}
        onChange={changePage}
        pageSize={limit}
      />
      {isShowAddModal && <AddModal getPreexpenseList={getPreexpenseList} />}
    </div>
  );
}
export default connect(({ claimExpense }) => ({ claimExpense }))(claimExpense);
