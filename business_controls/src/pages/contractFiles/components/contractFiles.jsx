import { Spin, Tabs } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import BasicsTable from '../../../components/basicsTable';
import IPagination from '../../../components/public/iPagination';
import AdvanceSearch from './advanceSearch.jsx';
import { tableColumns, tabsItems } from './config.jsx';
import style from './contractFiles.less';
import FileDetailModel from './fileDetailModel.jsx';

function ContractFiles({ dispatch, contractFiles, loading }) {
  const {
    start,
    limit,
    returnCount,
    list,
    purchaseMethodOptions,
    contractTypeOptions,
    contractStateOptions,
    contractNumber,
  } = contractFiles;

  const { location, openEvent, openNewPage } = useModel(
    '@@qiankunStateFromMaster',
  );

  const { bizSolId, uuId, url } = location.query;

  const [detailModelVis, setDetailModelVis] = useState(false);

  const [tabVal, setTabVal] = useState('');

  const [tableMaxHeight, setTableMaxHeight] = useState(350);

  const [searchVal, setSearchVal] = useState({});

  useEffect(() => {
    dispatch({
      type: 'contractFiles/getContractFilesList',
      payload: {
        start: 1,
        limit: 10,
        logicCode: 'HT100001',
      },
    });

    dispatch({
      type: 'contractFiles/getPurchaseMethodDictType',
      payload: {
        dictTypeId: 'HTGLCGFS',
        showType: 'ALL',
        isTree: '1',
        searchWord: '',
      },
    });

    dispatch({
      type: 'contractFiles/getContractStateDictType',
      payload: {
        dictTypeId: 'HTGLHTZT',
        showType: 'ALL',
        isTree: '1',
        searchWord: '',
      },
    });

    dispatch({
      type: 'contractFiles/getContractTypeDictType',
      payload: {
        dictTypeId: 'HTGLHTLX',
        showType: 'ALL',
        isTree: '1',
        searchWord: '',
      },
    });
  }, []);

  const openFormDetail = (...rest) => {
    //查看
    openEvent && openEvent(rest[0], rest[1], rest[2], rest[3], rest[4]);
  };

  const onTabChange = (val) => {
    setTabVal(val);
    dispatch({
      type: 'contractFiles/updateStates',
      payload: {
        start: 1,
        limit: 10,
      },
    });
    dispatch({
      type: 'contractFiles/getContractFilesList',
      payload: {
        start: 1,
        limit: 10,
        logicCode: 'HT100001',
        contractKindTldt_: val,
      },
    });
  };

  const onAdvanceChange = (bol) => {
    bol ? setTableMaxHeight(540) : setTableMaxHeight(350);
  };

  const onSearchValChange = (val) => {
    setSearchVal(val);
  };

  return (
    <div className={style.warp} id="contractFiles">
      <Tabs items={tabsItems} onChange={onTabChange} />
      <AdvanceSearch
        tabVal={tabVal}
        onAdvanceChange={onAdvanceChange}
        onSearchValChange={onSearchValChange}
      />
      <Spin spinning={loading.global}>
        {/* <Table
          {...tableColumns({ setDetailModelVis, dispatch })}
          dataSource={list}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              dispatch({
                type: 'contractFiles/updateStates',
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
            contractTypeOptions,
            openFormDetail,
          })}
          dispatch={dispatch}
          bordered
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              dispatch({
                type: 'contractFiles/updateStates',
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
              type: 'contractFiles/updateStates',
              payload: {
                start: page,
                limit: size,
              },
            });
            dispatch({
              type: 'contractFiles/getContractFilesList',
              payload: {
                start: page,
                limit: size,
                contractNumber,
                ...searchVal,
                contractKindTldt_: tabVal,
                logicCode: 'HT100001',
              },
            });
          }}
          pageSize={limit}
          isRefresh={true}
          refreshDataFn={() => {
            dispatch({
              type: 'contractFiles/updateStates',
              payload: {
                start: 1,
                limit,
              },
            });
            dispatch({
              type: 'contractFiles/getContractFilesList',
              payload: {
                start: 1,
                limit,
                contractNumber,
                ...searchVal,
                contractKindTldt_: tabVal,
                logicCode: 'HT100001',
              },
            });
          }}
        />
      </div>

      {detailModelVis && (
        <FileDetailModel
          detailModelVis={detailModelVis}
          setDetailModelVis={setDetailModelVis}
        />
      )}
    </div>
  );
}

export default connect(({ contractFiles, loading }) => ({
  contractFiles,
  loading,
}))(ContractFiles);
