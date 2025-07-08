import { useModel } from '@umijs/max';
import { Button, Input, message, Table } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../components/columnDragTable';
import IndicatorModal from './components/IndicatorModal';
import LookInfo from './components/lookInfo';
import styles from './index.less';
const Index = ({ performanceIndicators, dispatch }) => {
  const {
    dataSource,
    isShowPerforman,
    listSelectedRowKeys,
    listSelectedRows,
    isShowLookInfo,
  } = performanceIndicators;
  const [allNum, setAllNum] = useState(0);
  // const [isShowPerforman, setIsShowPerforman] = useState(false)
  // const [listSelectedRowKeys, setListSelectedRowKeys] = useState([])
  // const [listSelectedRows, setListSelectedRows] = useState([])
  // const [isShowLookInfo, setIsShowLookInfo] = useState(false)
  const {
    location,
    cutomHeaders,
    formColumnsCode,
    bizInfo,
    deployFormId,
    props,
  } = useModel('@@qiankunStateFromMaster');
  useEffect(() => {
    //将dataSource赋值给state中的dataSource
    if (
      !location?.pathname?.includes('formDesigner') &&
      cutomHeaders?.mainTableId
    ) {
      //请求获取指标数据
      dispatch({
        type: 'performanceIndicators/getPerfromanceList',
        payload: {
          mainTableId: cutomHeaders?.mainTableId,
        },
        callback: (num) => {
          setAllNum(num);
        },
      });
    }
  }, [cutomHeaders]);
  // useEffect(() => {
  //   field.setDataSource(dataSource)
  // }, [dataSource])
  const columns = [
    {
      title: '代码',
      dataIndex: 'listCode',
      key: 'listCode',
      width: '60',
      render: (text, record, index) => (
        <span>{record.performanceCode?.split('')?.join('.')}</span>
      ),
    },
    {
      title: '指标名称',
      dataIndex: 'performanceName',
      key: 'performanceName',
      render: (text, record) => {
        let blankSpace = <span></span>;
        let listCodes = record.listCode.split('.');
        if (listCodes.length == 2) {
          blankSpace = <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>;
        } else if (listCodes.length == 3) {
          blankSpace = (
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          );
        }
        return (
          <p>
            {blankSpace}
            {text}
          </p>
        );
      },
    },
    {
      title: '指标类型',
      dataIndex: 'performanceType',
      key: 'performanceType',
    },
    {
      title: '指标方向',
      dataIndex: 'performanceDirect',
      key: 'performanceDirect',
    },
    {
      title: '指标值',
      dataIndex: 'performanceValue',
      key: 'performanceValue',
      render: (text, record, index) => {
        let tmpInfo = _.filter(dataSource, { parentId: record.performanceId });
        if (tmpInfo.length) {
          //父节点的不能编辑
          return <div>{text}</div>;
        } else {
          return (
            <Input
              defaultValue={text}
              onBlur={changePerformanceValue.bind(
                this,
                record,
                index,
                'performanceValue',
              )}
            />
          );
        }
      },
    },
    {
      title: '计量单位',
      dataIndex: 'unitOfMeasurement',
      key: 'unitOfMeasurement',
    },
    {
      title: '分值（权重）',
      dataIndex: 'score',
      key: 'score',
      render: (text, record, index) => {
        let tmpInfo = _.filter(dataSource, { parentId: record.performanceId });
        if (tmpInfo.length) {
          //父节点的不能编辑
          return <div>{text}</div>;
        } else {
          return (
            <Input
              defaultValue={text}
              onBlur={changePerformanceValue.bind(this, record, index, 'score')}
            />
          );
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      render: (text, record, index) => {
        let tmpInfo = _.filter(dataSource, { parentId: record.performanceId });
        if (tmpInfo.length) {
          //父节点的不能编辑
          return <div>{text}</div>;
        } else {
          return (
            <Input
              defaultValue={text}
              onBlur={changePerformanceValue.bind(this, record, index, 'memo')}
            />
          );
        }
      },
    },
  ];
  console.log('dataSource==', dataSource);
  //改变指标值
  const changePerformanceValue = (record, index, type, e) => {
    let value = e.target.value;
    if (type == 'score') {
      debugger;
      //如果是分值的话，更改分之则改变父的分值
      let listCodes = record.listCode.toString().split('.');
      let tmpParentInfo = { parentId: '' };
      dataSource.map((item) => {
        if (item.performanceId == record.parentId) {
          item.score =
            parseFloat(item.score || '0') +
            parseFloat(value || '0') -
            parseFloat(record.score || '0');
          if (item.parentId != '0') {
            tmpParentInfo = item;
          }
        }
      });
      if (listCodes.length == 3) {
        //是三级的时候同时也需要更新一级的
        dataSource.map((item) => {
          if (item.performanceId == tmpParentInfo.parentId) {
            item.score =
              parseFloat(item.score || '0') +
              parseFloat(value || '0') -
              parseFloat(record.score || '0');
          }
        });
      }
      let tmpAllNum =
        allNum - parseFloat(record.score || '0') + parseFloat(value);
      setAllNum(tmpAllNum);
    }
    dataSource[index][type] = value;
    dispatch({
      type: 'performanceIndicators/tmpSavePer',
      payload: {
        mainTableId: cutomHeaders?.mainTableId,
        code: formColumnsCode,
        bizSolId: bizInfo.bizSolId,
        formDeployId: deployFormId,
        list: JSON.stringify(dataSource),
      },
      callback: () => {
        dispatch({
          type: 'performanceIndicators/updateStates',
          payload: {
            dataSource: JSON.parse(JSON.stringify(dataSource)),
          },
        });
      },
    });
  };
  const showPerforman = () => {
    dispatch({
      type: 'performanceIndicators/updateStates',
      payload: {
        isShowPerforman: true,
      },
    });
  };
  //点击行为选中状态
  const clickRow = (record) => {
    dispatch({
      type: 'performanceIndicators/updateStates',
      payload: {
        listSelectedRowKeys: [record.performanceId],
        listSelectedRows: [record],
      },
    });
  };
  const lookInfoFn = () => {
    if (!listSelectedRowKeys.length) {
      message.error('请选择要查看的指标');
      return;
    }
    dispatch({
      type: 'performanceIndicators/updateStates',
      payload: {
        isShowLookInfo: true,
      },
    });
  };
  return (
    <div className={styles.per_ind_warp}>
      <div className={styles.w_button}>
        <Button onClick={showPerforman.bind(this)}>指标挑选</Button>
        <Button onClick={props?.add?.bind(this)}>新增</Button>
        <Button onClick={lookInfoFn.bind(this)}>查看</Button>
      </div>
      <ColumnDragTable
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey={'performanceId'}
        onRow={(record) => {
          return {
            onClick: clickRow.bind(this, record), // 点击行
          };
        }}
        rowSelection={{
          selectedRowKeys: listSelectedRowKeys,
          hideSelectAll: true,
          onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys.length == 0) {
              dispatch({
                type: 'performanceIndicators/updateStates',
                payload: {
                  listSelectedRowKeys: [],
                  listSelectedRows: [],
                },
              });
            } else if (selectedRowKeys.length == 1) {
              dispatch({
                type: 'performanceIndicators/updateStates',
                payload: {
                  listSelectedRowKeys: selectedRowKeys,
                  listSelectedRows: selectedRows,
                },
              });
            } else {
              dispatch({
                type: 'performanceIndicators/updateStates',
                payload: {
                  listSelectedRowKeys: [selectedRowKeys[1]],
                  listSelectedRows: [selectedRows[1]],
                },
              });
            }
          },
        }}
        summary={(pageData) => {
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={7}>
                  合计
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <span>{allNum}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
      {isShowPerforman && (
        <IndicatorModal setAllNum={setAllNum} allNum={allNum} />
      )}
      {isShowLookInfo && <LookInfo />}
    </div>
  );
};
export default connect(({ performanceIndicators, loading }) => ({
  performanceIndicators,
  loading,
}))(Index);
