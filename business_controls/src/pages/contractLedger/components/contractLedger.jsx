import { Spin, Tabs } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import BasicsTable from '../../../components/basicsTable';
import IPagination from '../../../components/public/iPagination';
import AdvanceSearch from './advanceSearch.jsx';
import { tableColumns, tabsItems } from './config.jsx';
import style from './contractLedger.less';
import DetailModel from './detailModel.jsx';
import ExecuteList from './executeList.jsx';

function ContractLedger({ dispatch, contractLedger, loading }) {
  const {
    start,
    limit,
    returnCount,
    list,
    purchaseMethodOptions,
    contractTypeOptions,
    contractStateOptions,
    contractNumber,
  } = contractLedger;
  const [detailModelVis, setDetailModelVis] = useState(false);
  const [executeState, setExecuteState] = useState('');

  const [contractNum, setContractNum] = useState('');

  const [tabVal, setTabVal] = useState('');

  const [tableMaxHeight, setTableMaxHeight] = useState(300);

  const [searchVal, setSearchVal] = useState({});

  useEffect(() => {
    dispatch({
      type: 'contractLedger/getContractLedgerList',
      payload: {
        start: 1,
        limit: 10,
        logicCode: 'HT100001',
      },
    });

    dispatch({
      type: 'contractLedger/getPurchaseMethodDictType',
      payload: {
        dictTypeId: 'HTGLCGFS',
        showType: 'ALL',
        isTree: '1',
        searchWord: '',
      },
    });

    dispatch({
      type: 'contractLedger/getContractStateDictType',
      payload: {
        dictTypeId: 'HTGLHTZT',
        showType: 'ALL',
        isTree: '1',
        searchWord: '',
      },
    });

    dispatch({
      type: 'contractLedger/getContractTypeDictType',
      payload: {
        dictTypeId: 'HTGLHTLX',
        showType: 'ALL',
        isTree: '1',
        searchWord: '',
      },
    });
  }, []);

  const onTabChange = (val) => {
    setTabVal(val);
    dispatch({
      type: 'contractLedger/updateStates',
      payload: {
        start: 1,
        limit: 10,
      },
    });

    dispatch({
      type: 'contractLedger/getContractLedgerList',
      payload: {
        start: 1,
        limit: 10,
        logicCode: 'HT100001',
        contractKindTldt_: val,
      },
    });
  };

  const onAdvanceChange = (bol) => {
    bol ? setTableMaxHeight(540) : setTableMaxHeight(300);
  };

  const onSearchValChange = (val) => {
    setSearchVal(val);
  };

  return (
    <div className={style.warp} id="contractLedger">
      {executeState ? (
        <ExecuteList
          executeState={executeState}
          setExecuteState={setExecuteState}
          contractNum={contractNum}
        />
      ) : (
        <>
          <Tabs items={tabsItems} onChange={onTabChange} />
          <AdvanceSearch
            tabVal={tabVal}
            onAdvanceChange={onAdvanceChange}
            onSearchValChange={onSearchValChange}
          />
          <Spin spinning={loading.global}>
            {/* <Table
              {...tableColumns({
                setDetailModelVis,
                dispatch,
                setExecuteState,
              })}
              dataSource={list}
              rowSelection={{
                onChange: (selectedRowKeys, selectedRows) => {
                  dispatch({
                    type: 'contractLedger/updateStates',
                    payload: {
                      selectedRowKeys,
                    },
                  });
                },
                type: 'checkbox',
              }}
              scroll={{
                y: `calc(100vh - ${tableMaxHeight}px)`,
                x: 'max-content',
              }}
            /> */}

            <BasicsTable
              // listHead="list_head"
              // container="dom_container"
              {...tableColumns({
                setDetailModelVis,
                dispatch,
                setExecuteState,
                purchaseMethodOptions,
                contractTypeOptions,
                contractStateOptions,
                setContractNum,
              })}
              dispatch={dispatch}
              bordered
              rowSelection={{
                onChange: (selectedRowKeys, selectedRows) => {
                  dispatch({
                    type: 'contractLedger/updateStates',
                    payload: {
                      selectedRowKeys,
                    },
                  });
                },
                type: 'checkbox',
              }}
              dataSource={list}
              pagination={false}
              scroll={{
                y: `calc(100vh - ${tableMaxHeight}px)`,
                x: 'max-content',
              }}
            />
          </Spin>
          <div className={style.pageWarp}>
            <IPagination
              current={start}
              total={returnCount}
              onChange={(page, size) => {
                dispatch({
                  type: 'contractLedger/updateStates',
                  payload: {
                    start: page,
                    limit: size,
                  },
                });
                dispatch({
                  type: 'contractLedger/getContractLedgerList',
                  payload: {
                    start: page,
                    limit: size,
                    ...searchVal,
                    contractNumber,
                    contractKindTldt_: tabVal,
                    logicCode: 'HT100001',
                  },
                });
              }}
              pageSize={limit}
              isRefresh={true}
              refreshDataFn={() => {
                dispatch({
                  type: 'contractLedger/updateStates',
                  payload: {
                    start: 1,
                    limit,
                  },
                });
                dispatch({
                  type: 'contractLedger/getContractLedgerList',
                  payload: {
                    start: 1,
                    limit,
                    ...searchVal,
                    contractNumber,
                    contractKindTldt_: tabVal,
                    logicCode: 'HT100001',
                  },
                });
              }}
            />
          </div>

          {detailModelVis && (
            <DetailModel
              detailModelVis={detailModelVis}
              setDetailModelVis={setDetailModelVis}
            />
          )}
        </>
      )}
    </div>
  );
}

export default connect(({ contractLedger, loading }) => ({
  contractLedger,
  loading,
}))(ContractLedger);
