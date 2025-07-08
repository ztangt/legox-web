import { Modal, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import { useModel } from 'umi';
import BasicsTable from '../../../components/basicsTable';
import { tableDetailColumns } from './config.jsx';

function DetailModel({
  detailModelVis,
  setDetailModelVis,
  dispatch,
  contractLedger,
  loading,
}) {
  const { location, openEvent, openNewPage } = useModel(
    '@@qiankunStateFromMaster',
  );

  const { bizSolId, uuId, url } = location.query;

  const { contractId, detailList } = contractLedger;

  const openFormDetail = (...rest) => {
    //查看
    openEvent && openEvent(rest[0], rest[1], rest[2], rest[3], rest[4]);
  };

  const getDetailList = () => {
    dispatch({
      type: 'contractLedger/getLedgerAdjustList',
      payload: {
        contractId,
      },
    });
  };

  useEffect(() => {
    getDetailList();
  }, []);

  return (
    <Modal
      visible={detailModelVis}
      footer={false}
      width={900}
      title={'详情'}
      onCancel={() => {
        setDetailModelVis(false);
      }}
      mask={false}
      maskClosable={false}
      centered
      getContainer={() => {
        return document.getElementById('contractLedger') || false;
      }}
    >
      <Spin spinning={loading.global}>
        <BasicsTable
          // listHead="list_head"
          // container="dom_container"
          {...tableDetailColumns({ openFormDetail })}
          dispatch={dispatch}
          bordered
          dataSource={detailList}
          pagination={false}
        />
      </Spin>

      {/* <Table {...tableDetailColumns({})} dataSource={detailList} /> */}
    </Modal>
  );
}

export default connect(({ contractLedger, loading }) => ({
  contractLedger,
  loading,
}))(DetailModel);
