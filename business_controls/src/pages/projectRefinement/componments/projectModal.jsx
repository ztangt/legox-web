import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import GlobalModal from '../../../components/newGlobalModal';
import IPagination from '../../../components/public/iPagination';
import { reGetDataSource } from '../../../util/tableTree';
function ProjectModal({
  onOk,
  onCancel,
  dispatch,
  projectRefinement,
  logicCode,
  modalInfo,
}) {
  const { usedYear } = projectRefinement;
  const [disabled, setDisabled] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [bizSolId, setBizSolId] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [returnCount, setReturnCount] = useState(0);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    //获取bizsolid
    dispatch({
      type: 'projectRefinement/getBizSolIdByLogicCode',
      payload: {
        logicCode,
        limit,
        usedYear,
      },
      callback: (data) => {
        setDataSource(data.list);
        setCurrentPage(data.currentPage);
        setReturnCount(data.returnCount);
      },
    });
  }, []);
  const columns = [
    {
      title: '编码',
      dataIndex: 'OBJ_CODE',
      key: 'OBJ_CODE',
    },
    {
      title: '名称',
      dataIndex: 'OBJ_NAME',
      key: 'OBJ_NAME',
    },
  ];
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onSelect: (record, selected) => {
      if (selected) {
        //选中
        setSelectedRowKeys([record['OBJ_CODE']]);
        setSelectedRows([record]);
      } else {
        setSelectedRowKeys([]);
        setSelectedRows([]);
      }
    },
    getCheckboxProps: (record) => ({
      disabled: record.isParent == 1,
    }),
  };
  //树形列表的展开
  const onExpand = (start, expanded, record) => {
    const callback = (list, data, limit) => {
      let newDataSource = reGetDataSource(
        start,
        columns,
        id,
        record,
        dataSource,
        list,
        data?.currentPage || 0,
        data?.returnCount || 0,
        limit,
      );
      setDataSource(_.cloneDeep(newDataSource));
      if (expanded) {
        if (start == 1) {
          //只有第一次展开的时候才记录展开的key,点击更多不做操作
          const tmp = cloneDeep(expandedRowKeys);
          tmp.push(record[id]);
          setExpandedRowKeys(tmp);
        }
      }
    };
    if (expanded) {
      //请求接口
      dispatch({
        type: 'projectRefinement/getBudgetProjectTree',
        payload: {
          bizSolId,
          parentCode: record.OBJ_CODE,
          start: 1,
          limit: 1000,
          usedYear,
        },
        callback: (data) => {
          callback(data.list, data, 1000);
        },
      });
    } else {
      //删除本级及下级节点
      let deleteIds = [];
      const loopRecord = (data, deleteIds) => {
        data &&
          data.map((item) => {
            deleteIds.push(item['OBJ_CODE']);
            if (item.children && item.children.length) {
              deleteIds = loopRecord(item.children, deleteIds);
            }
          });
        return deleteIds;
      };
      deleteIds.push(record['OBJ_CODE']);
      deleteIds = loopRecord(record.children, deleteIds);
      const newExpandedRowKeys = expandedRowKeys.filter(
        (i) => !deleteIds.includes(i),
      );
      setExpandedRowKeys(newExpandedRowKeys);
    }
  };
  //点击行选择
  const clickSelect = (record) => {
    if (record.isParent == 1) {
      return;
    }
    let selected = selectedRowKeys.includes(record['OBJ_CODE']);
    if (!selected) {
      //选中
      setSelectedRowKeys([record['OBJ_CODE']]);
      setSelectedRows([record]);
    } else {
      setSelectedRowKeys([]);
      setSelectedRows([]);
    }
  };
  //分页
  const changePage = (nextpage, size) => {
    //TODO请求接口
    setLimit(size);
  };
  return (
    <GlobalModal
      open={true}
      widthType={3}
      title="信息"
      onOk={(e) => {
        setDisabled(true);
        setTimeout(() => {
          setDisabled(false);
        }, 1000);
        onOk(selectedRowKeys, selectedRows, modalInfo);
      }}
      okButtonProps={{ disabled: disabled }}
      // wrapClassName={styles.table_modal}
      onCancel={() => {
        onCancel();
      }}
      okText="确定"
      cancelText="取消"
      bodyStyle={{ padding: '0px' }}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById(`projectRefinement`);
      }}
      containerId={'projectRefinement'}
    >
      <div style={{ height: `100%` }}>
        <ColumnDragTable
          columns={columns}
          dataSource={dataSource}
          rowKey={'OBJ_CODE'}
          rowSelection={{
            ...rowSelection,
            checkStrictly: true,
            hideSelectAll: true,
          }}
          scroll={{ y: 'calc(100% - 40px)', x: 'auto' }}
          bordered={true}
          pagination={false}
          expandable={{ expandedRowKeys, onExpand: onExpand.bind(this, 1) }}
          onRow={(record) => {
            return {
              onClick: (event) => {
                clickSelect(record);
              }, // 点击行
            };
          }}
          listHead="table_modal"
        />
      </div>
      <>
        <div
          style={{
            borderTop: '1px solid #F0F0F0',
            position: 'relative',
            height: '52px',
          }}
        >
          {dataSource.length ? (
            <IPagination
              current={currentPage}
              total={returnCount}
              onChange={changePage.bind(this)}
              pageSize={limit}
              style={{ width: '100%', bottom: 'unset', float: 'right' }}
            />
          ) : (
            ''
          )}
        </div>
      </>
    </GlobalModal>
  );
}
export default connect(({ projectRefinement }) => ({
  projectRefinement,
}))(ProjectModal);
