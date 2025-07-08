import { Button, Input, Modal, message } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import searchIcon from '../../../../public/assets/search.svg';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/public/iPagination';
import ITree from '../../../components/public/iTree';
import ReSizeLeftRight from '../../../components/public/reSizeLeftRight';
import styles from '../index.less';
import AddModal from './addModal';
import BulkEditing from './bulkEditing';
import GradeModal from './gradeModal';
const { Search } = Input;
const { confirm } = Modal;
function travelExpense({ dispatch, travelExpense }) {
  const {
    list,
    returnCount,
    limit,
    currentPage,
    selectedRowKeys,
    searchWord,
    isShowAddModal,
    cityTree,
    cityCode,
    selectedCity,
    isShowGrade,
    searchCity,
    isShowBatch,
    selectId,
  } = travelExpense;
  console.log(selectedRowKeys, 'selectedRowKeys');
  useEffect(() => {
    // getTravelExpenseList('', '', 1, 10)
    getCityTreeList('');
  }, []);
  //获取城市树列表
  const getCityTreeList = (cityName) => {
    dispatch({
      type: 'travelExpense/getCityTreeList',
      payload: {
        cityName,
      },
    });
  };
  //获取差旅费列表
  const getTravelExpenseList = (cityCode, searchWord, start, limit) => {
    dispatch({
      type: 'travelExpense/getTravelExpenseList',
      payload: {
        cityCode,
        searchWord,
        start,
        limit,
      },
    });
  };

  // table配置项
  const tableProps = {
    // 主键
    rowKey: 'travelId',
    // 表头
    columns: [
      {
        title: '序号',
        dataIndex: 'number',
      },
      {
        title: '城市',
        dataIndex: 'cityName',
      },
      {
        title: '人员级别',
        dataIndex: 'gradeName',
      },
      {
        title: '出差标准',
        dataIndex: 'travelStandardFee',
      },
      {
        title: '旺季时间',
        dataIndex: 'hotTimeChoice',
        render: (text, record) => (
          <span className={styles.time} title={`${text}月`}>
            {text}
            {`${text ? '月' : ''}`}
          </span>
        ),
      },
      {
        title: '旺季标准',
        dataIndex: 'hotStandardFee',
      },
      {
        title: '公杂补助',
        dataIndex: 'incidentalSubsidyFee',
      },
      {
        title: '餐饮补助',
        dataIndex: 'foodSubsidyFee',
      },
      {
        title: '其他补助',
        dataIndex: 'otherSubsidyFee',
      },
      {
        title: '操作',
        dataIndex: 'travelId',
        render: (text, record) => {
          return (
            <div className={styles.operation}>
              <a
                onClick={() => {
                  onAdd(record);
                }}
              >
                修改
              </a>
              <a
                onClick={() => {
                  deleteTravelexpense([text]);
                }}
              >
                删除
              </a>
            </div>
          );
        },
      },
    ],
    // 数据源
    dataSource: list.map((item, index) => {
      item.number = index + 1;
      return item;
    }),
    // 分页
    pagination: false,
    // pagination: {
    //   total: returnCount,
    //   pageSize: limit,
    //   showQuickJumper: true,
    //   showSizeChanger: true,
    //   current: Number(currentPage),
    //   showTotal: (total) => {
    //     return `共 ${total} 条`;
    //   },
    //   onChange: (page, size) => {
    //     dispatch({
    //       type: 'travelExpense/updateStates',
    //       payload: {
    //         limit: size,
    //       },
    //     });
    //     getTravelExpenseList(cityCode, '', page, size);
    //   },
    // },
    // 行操作
    rowSelection: {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, 'selectedRowKeys');
        dispatch({
          type: 'travelExpense/updateStates',
          payload: {
            selectedRowKeys,
          },
        });
      },
    },
  };

  //删除
  const deleteTravelexpense = (ids) => {
    if (ids.length > 0) {
      confirm({
        content: '确认要删除吗？',
        mask: false,
        maskClosable: false,
        getContainer: () => {
          return document.getElementById('travelExpense_container');
        },
        onOk: () => {
          dispatch({
            type: 'travelExpense/deleteTravelexpense',
            payload: {
              travelIds: ids.join(','),
            },
          });
        },
      });
    } else {
      message.warn('请选择一条数据');
    }
  };

  // page改变
  const changePage = (page, size) => {
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        limit: size,
        currentPage: page,
      },
    });
    getTravelExpenseList(cityCode, searchWord, page, size);
  };

  // 搜索词 onchange
  const changeValue = (e) => {
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        searchWord: e.target.value,
      },
    });
  };

  const onSearch = (value) => {
    console.log(value);
    getTravelExpenseList(cityCode, value, 1, limit);
  };

  const onAdd = (record) => {
    console.log(record, 'record==');
    if (!selectedCity) {
      message.warning('请选择城市');
    } else {
      dispatch({
        type: 'travelExpense/getDictType',
        payload: {
          dictTypeId: 'RYJB',
          showType: 'ALL',
          isTree: '1',
          searchWord: '',
        },
      });
      if (record.travelId) {
        dispatch({
          type: 'travelExpense/getOneTravelexpense',
          payload: {
            travelId: record.travelId,
          },
        });
      }
      setTimeout(() => {
        dispatch({
          type: 'travelExpense/updateStates',
          payload: {
            isShowAddModal: true,
            detailData: record,
          },
        });
      }, 200);
    }
  };

  // tree select event
  const selectData = (selectedKeys, node) => {
    console.log(selectedKeys, 'selectedKeys==');
    console.log(node, 'node');
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        selectedCity: node.node.cityName,
        cityCode: node.node.cityCode,
        selectId: selectedKeys[0],
      },
    });
    getTravelExpenseList(node.node.cityCode, '', 1, limit);
  };

  //级别维护
  const showGrade = () => {
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        isShowGrade: true,
      },
    });
    dispatch({
      type: 'travelExpense/getDictType',
      payload: {
        dictTypeId: 'RYJB',
        showType: 'ALL',
        isTree: '1',
        searchWord: '',
      },
    });
  };

  // 城市名称 change
  const changeCity = (e) => {
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        searchCity: e.target.value,
      },
    });
  };

  const onSearchCity = (value) => {
    console.log(value, 'value');
    if (!value) {
      dispatch({
        type: 'travelExpense/updateStates',
        payload: {
          selectId: [],
          list: [],
        },
      });
    }
    getCityTreeList(value);
  };

  // 修改
  const batchEdit = () => {
    console.log(selectedRowKeys, '123');
    if (!selectedCity) {
      message.warning('请选择城市');
    } else {
      if (selectedRowKeys.length == 1) {
        dispatch({
          type: 'travelExpense/getOneTravelexpense',
          payload: {
            travelId: selectedRowKeys.join(','),
          },
        });
      } else if (selectedRowKeys.length > 1) {
        message.error('请选择一条数据');
        return;
      }
      dispatch({
        type: 'travelExpense/getDictType',
        payload: {
          dictTypeId: 'RYJB',
          showType: 'ALL',
          isTree: '1',
          searchWord: '',
        },
      });
      setTimeout(() => {
        dispatch({
          type: 'travelExpense/updateStates',
          payload: {
            isShowBatch: true,
          },
        });
      }, 100);
    }
  };

  // tree set value
  const loop = (data) => {
    data.map((item) => {
      item['title'] = item.cityName;
      item['key'] = item.cityId;
      item['value'] = item.cityId;
      if (item.children) {
        loop(item.children);
      }
    });
    return data;
  };

  return (
    <div id="travelExpense_container" className={styles.container}>
      <ReSizeLeftRight
        leftChildren={
          <div className={styles.leftTree}>
            <Search
              placeholder="请输入城市名称查询"
              style={{ width: '200px', marginBottom: 8 }}
              onChange={changeCity}
              onSearch={onSearchCity}
              value={searchCity}
              allowClear
              enterButton={
                <img
                  src={searchIcon}
                  style={{ marginRight: 8, marginTop: -3, marginLeft: 4 }}
                />
              }
            />
            <ITree
              field={{
                titleName: 'cityName',
                key: 'cityId',
                children: 'children',
              }}
              isSearch={false}
              defaultExpandAll={false}
              onSelect={selectData}
              selectedKeys={selectId}
              expandedKeys={'0'}
              treeData={cityTree}
              autoExpandParent={true}
              showLine={true}
              showIcon={true}
              // defaultSelectedKeys={['veniam']}
            />
          </div>
        }
        rightChildren={
          <div className={styles.table_warp}>
            <div className={styles.header} id="list_head">
              <div className={styles.left}>
                <Search
                  placeholder="请输入城市名称查询"
                  style={{ width: '200px' }}
                  onChange={changeValue}
                  onSearch={onSearch}
                  value={searchWord}
                  allowClear
                  enterButton={
                    <img
                      src={searchIcon}
                      style={{ marginRight: 8, marginTop: -3, marginLeft: 4 }}
                    />
                  }
                />
              </div>
              <div className={styles.right}>
                <Button
                  onClick={() => {
                    onAdd('');
                  }}
                >
                  新增
                </Button>
                <Button
                  onClick={() => {
                    batchEdit();
                  }}
                >
                  修改
                </Button>
                <Button
                  onClick={() => {
                    deleteTravelexpense(selectedRowKeys);
                  }}
                >
                  删除
                </Button>
                <Button
                  onClick={() => {
                    showGrade();
                  }}
                >
                  级别
                </Button>
                {/* <Button>导入/导出</Button> */}
              </div>
            </div>
            <div
              className={styles.content}
              style={{ height: 'calc(100% - 100px)' }}
            >
              <ColumnDragTable
                taskType="MONITOR"
                modulesName="travelExpense"
                {...tableProps}
                scroll={list ? { y: 'calc(100% - 45px)' } : {}}
              />
              {/* <div className={styles.pagination}> */}
              {/* <Pagination
                  showQuickJumper
                  showSizeChanger
                  current={Number(currentPage)}
                  showTotal={(total) => `共${total} 条`}
                  defaultCurrent={1}
                  total={Number(returnCount)}
                  onChange={changePage}
                /> */}
              {/* </div> */}
            </div>
            <IPagination
              style={{ width: '80%' }}
              current={Number(currentPage)}
              total={returnCount}
              onChange={changePage}
              pageSize={limit}
            />
          </div>
        }
      />
      {isShowAddModal && <AddModal />}
      {isShowGrade && <GradeModal />}
      {isShowBatch && (
        <BulkEditing getTravelExpenseList={getTravelExpenseList} />
      )}
    </div>
  );
}
export default connect(({ travelExpense }) => ({ travelExpense }))(
  travelExpense,
);
