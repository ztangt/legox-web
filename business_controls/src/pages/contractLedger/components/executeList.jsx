import { Button, Input, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import { useModel } from 'umi';
import searchIcon from '../../../../public/assets/high_search.svg';
import BasicsTable from '../../../components/basicsTable';
import IPagination from '../../../components/public/iPagination';
import { tableExecuteColumns } from './config.jsx';
import style from './executeList.less';

function ExecuteList({
  executeState,
  contractNum,
  setExecuteState,
  dispatch,
  contractLedger,
  loading,
}) {
  const { location, openEvent, openNewPage } = useModel(
    '@@qiankunStateFromMaster',
  );

  const { bizSolId, uuId, url } = location.query;

  const {
    executeStart,
    executeLimit,
    executeReturnCount,
    executeList,
  } = contractLedger;

  const openFormDetail = (...rest) => {
    //查看
    openEvent && openEvent(rest[0], rest[1], rest[2], rest[3], rest[4]);
  };

  const onSearch = (val) => {
    dispatch({
      type: 'contractLedger/getExecuteList',
      payload: {
        contractId: executeState,
        sourceBizTitle: val,
        start: executeStart,
        limit: executeLimit,
      },
    });
  };

  const getExecuteList = (page, size) => {
    dispatch({
      type: 'contractLedger/getExecuteList',
      payload: {
        contractId: executeState,
        // contractNum,
        start: page,
        limit: size,
      },
    });
  };

  useEffect(() => {
    getExecuteList(executeStart, executeLimit);
  }, []);

  return (
    <div className={style.warp}>
      <div className={style.searchWarp}>
        <div>
          <Input.Search
            className={style.searchInput}
            placeholder="请输入合同标题"
            allowClear
            size="middle"
            onSearch={onSearch}
            enterButton={
              <img src={searchIcon} style={{ margin: '0 8px 2px 0' }} />
            }
          />
        </div>

        <div>
          <Button
            style={{ marginLeft: '10px' }}
            onClick={() => {
              setExecuteState('');
            }}
          >
            返回
          </Button>
        </div>
      </div>
      <Spin spinning={loading.global}>
        {/* <Table
          {...tableExecuteColumns({ openFormDetail })}
          dataSource={executeList}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              //   dispatch({
              //     type: 'contractLedger/updateStates',
              //     payload: {
              //       selectedRowKeys,
              //     },
              //   });
            },
            type: 'checkbox',
          }}
        /> */}

        <BasicsTable
          // listHead="list_head"
          // container="dom_container"
          {...tableExecuteColumns({ openFormDetail })}
          dispatch={dispatch}
          bordered
          dataSource={executeList}
          pagination={false}
          scroll={{
            y: `calc(100vh - 400px)`,
            x: 'max-content',
          }}
        />
      </Spin>
      <div className={style.pageWarp}>
        <IPagination
          current={executeStart}
          total={executeReturnCount}
          onChange={(page, size) => {
            dispatch({
              type: 'contractLedger/updateStates',
              payload: {
                executeStart: page,
                executeLimit: size,
              },
            });

            getExecuteList(page, size);
          }}
          pageSize={executeLimit}
          isRefresh={true}
          refreshDataFn={() => {
            getExecuteList(executeStart, executeLimit);
          }}
        />
      </div>
    </div>
  );
}

export default connect(({ contractLedger, loading }) => ({
  contractLedger,
  loading,
}))(ExecuteList);
