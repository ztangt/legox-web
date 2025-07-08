import { useModel } from '@umijs/max';
import { connect } from 'dva';
import _ from 'lodash';
import { useEffect } from 'react';
import Table from '../../../components/columnDragTable';
import GlobalModal from '../../../components/newGlobalModal';
import { loopDataSource, loopPushData } from '../../../util/tableTree';
function IndicatorModal({
  performanceIndicators,
  dispatch,
  allNum,
  setAllNum,
}) {
  const {
    treeDataSource,
    expandedRowKeys,
    selectedRowKeys,
    dataSource,
    selectedRowData,
  } = performanceIndicators;
  const {
    targetKey,
    location,
    cutomHeaders,
    formColumnsCode,
    deployFormId,
    bizInfo,
  } = useModel('@@qiankunStateFromMaster');
  const columns = [
    {
      title: '指标名称',
      dataIndex: 'PERFORMANCE_NAME',
      key: 'PERFORMANCE_NAME',
    },
    {
      title: '指标类型',
      dataIndex: 'PERFORMANCE_TYPE_TLDT_',
      key: 'PERFORMANCE_TYPE_TLDT_',
    },
    {
      title: '指标方向',
      dataIndex: 'PERFORMANCE_DIRECT_TLDT_',
      key: 'PERFORMANCE_DIRECT_TLDT_',
    },
    {
      title: '计量单位',
      dataIndex: 'UNIT_OF_MEASUREMENT',
      key: 'UNIT_OF_MEASUREMENT',
    },
  ];
  useEffect(() => {
    dispatch({
      type: 'performanceIndicators/getPerformanceTree',
      payload: {
        parentId: 0,
      },
      callback: (data) => {
        //获取选中过的数据
        let tmpSelectedRowKeys = [];
        let tmpSelectedRowData = [];
        dataSource.map((item) => {
          item.OBJ_NAME = item.performanceName; //在展示页面用performanceName，弹框页面需要用OBJ_NAME
          tmpSelectedRowKeys.push(item.performanceId);
          tmpSelectedRowData.push(item);
        });
        //增加一个排序用于列表中显示(政府规定只能有三级，所以按三级写，如果有多级还得改)（这个用于勾选父子问题）
        data.map((item, index) => {
          item.parentId = '0';
          item.firstParentInfo = '';
          item.sendcodeparentInfo = '';
        });
        dispatch({
          type: 'performanceIndicators/updateStates',
          payload: {
            treeDataSource: loopDataSource(data),
            selectedRowKeys: tmpSelectedRowKeys,
            selectedRowData: tmpSelectedRowData,
            expandedRowKeys: [],
          },
        });
      },
    });
  }, []);
  //展开
  const onExpand = (expanded, record) => {
    if (expanded) {
      //获取子数据
      dispatch({
        type: 'performanceIndicators/getPerformanceTree',
        payload: {
          parentId: record.id,
        },
        callback: (data) => {
          //增加一个排序用于列表中显示
          data.map((item, index) => {
            item.parentId = record.id;
            if (record.firstParentInfo) {
              item.firstParentInfo = record.firstParentInfo;
              item.sendcodeparentInfo = record;
            } else {
              item.firstParentInfo = record;
            }
          });
          data = loopDataSource(data);
          let newTreeData = loopPushData(
            treeDataSource,
            data,
            record.id,
            1,
            'id',
          );
          dispatch({
            type: 'performanceIndicators/updateStates',
            payload: {
              treeDataSource: _.cloneDeep(newTreeData),
            },
          });
        },
      });
      expandedRowKeys.push(record.id);
      dispatch({
        type: 'performanceIndicators/updateStates',
        payload: {
          expandedRowKeys,
        },
      });
    } else {
      //移除
      let tmpExpandedRowKeys = expandedRowKeys.filter((i) => i != record.id);
      dispatch({
        type: 'performanceIndicators/updateStates',
        payload: {
          expandedRowKeys: tmpExpandedRowKeys,
        },
      });
    }
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onSelect: (record, selected, selectedRows) => {
      debugger;
      if (selected) {
        selectedRowKeys.push(record.id);
        //父关联子所以这个时候需要加入parentId
        if (
          record.firstParentInfo &&
          !selectedRowKeys.includes(record.firstParentInfo.id)
        ) {
          selectedRowKeys.push(record.firstParentInfo.id);
          selectedRowData.push(record.firstParentInfo);
        }
        if (
          record.sendcodeparentInfo &&
          !selectedRowKeys.includes(record.sendcodeparentInfo.id)
        ) {
          selectedRowKeys.push(record.sendcodeparentInfo.id);
          selectedRowData.push(record.sendcodeparentInfo);
        }
        selectedRowData.push(record);
        dispatch({
          type: 'performanceIndicators/updateStates',
          payload: {
            selectedRowKeys: _.cloneDeep(selectedRowKeys),
            selectedRowData,
          },
        });
      } else {
        //父取消子节点也需要取消
        let removeIds = [record.id];
        if (record.IS_PARENT) {
          //为一级
          selectedRowData.map((item) => {
            if (item.parentId == record.id) {
              removeIds.push(item.id);
            }
          });
          selectedRowData.map((item) => {
            if (removeIds.includes(item.parentId)) {
              removeIds.push(item.id);
            }
          });
        } else {
          selectedRowData.map((item) => {
            if (item.parentId == record.id) {
              removeIds.push(item.id);
            }
          });
        }
        //移除
        let newSelectedRowData = selectedRowData.filter(
          (i) => !removeIds.includes(i.id),
        );
        let newSelectedRowKeys = selectedRowKeys.filter(
          (i) => !removeIds.includes(i),
        );
        dispatch({
          type: 'performanceIndicators/updateStates',
          payload: {
            selectedRowKeys: newSelectedRowKeys,
            selectedRowData: newSelectedRowData,
          },
        });
      }
    },
  };
  //插入数据到表中
  const insertData = () => {
    debugger;
    selectedRowData.map((item) => {
      item.performanceName = item.OBJ_NAME;
      item.performanceType = item.PERFORMANCE_TYPE_TLDT_;
      item.performanceDirect = item.PERFORMANCE_DIRECT_TLDT_;
      item.unitOfMeasurement = item.UNIT_OF_MEASUREMENT;
    });
    //排序插入
    let newDataSource = _.orderBy(selectedRowData, 'GRADE', 'asc');
    newDataSource = _.groupBy(newDataSource, 'parentId');
    let tmpDataSource = [];
    Object.keys(newDataSource).map((item) => {
      newDataSource[item].map((chiItem, index) => {
        if (item == '0') {
          tmpDataSource.push({
            performanceCode: chiItem.PERFORMANCE_CODE,
            performanceName: chiItem.OBJ_NAME,
            performanceType: chiItem.PERFORMANCE_TYPE_TLDT_,
            performanceDirect: chiItem.PERFORMANCE_DIRECT_TLDT_,
            unitOfMeasurement: chiItem.UNIT_OF_MEASUREMENT,
            securityLevel: chiItem.SECURITY_LEVEL,
            listCode: chiItem.PERFORMANCE_CODE?.split('')?.join('.'),
            performanceId: chiItem.id,
            isParent: chiItem.IS_PARENT,
            parentId: chiItem.parentId,
            grade: chiItem.GRADE,
            ...chiItem,
            children: null,
            firstParentInfo: '',
            sendcodeparentInfo: '',
          });
        } else {
          //获取父节点的listCode
          let parentInfo = [];
          let tmpFirstId = '';
          tmpDataSource.map((i) => {
            if (i.performanceId == chiItem.parentId) {
              parentInfo.push(i);
              i.performanceValue = '';
              tmpFirstId = i.parentId;
              if (i.score && !chiItem.score) {
                allNum = allNum - parseFloat(i.score);
                i.score = '';
              }
              i.memo = '';
            }
          });
          //父节点的数据也需要清空
          if (tmpFirstId) {
            tmpDataSource.map((i) => {
              if (i.performanceId == tmpFirstId) {
                i.performanceValue = '';
                if (!chiItem.score) {
                  i.score = '';
                }
                i.memo = '';
              }
            });
          }
          // let parentInfo = tmpDataSource.filter(
          //   (i) => i.performanceId == chiItem.parentId,
          // );
          let parentListCode = parentInfo?.[0]?.listCode || '0';
          let tmpIndex = index + 1;
          tmpDataSource.push({
            performanceCode: chiItem.PERFORMANCE_CODE,
            performanceName: chiItem.OBJ_NAME,
            performanceType: chiItem.PERFORMANCE_TYPE_TLDT_,
            performanceDirect: chiItem.PERFORMANCE_DIRECT_TLDT_,
            unitOfMeasurement: chiItem.UNIT_OF_MEASUREMENT,
            securityLevel: chiItem.SECURITY_LEVEL,
            listCode: chiItem.PERFORMANCE_CODE?.split('')?.join('.'),
            performanceId: chiItem.id,
            isParent: chiItem.IS_PARENT,
            parentId: chiItem.parentId,
            grade: chiItem.GRADE,
            ...chiItem,
            children: null,
            firstParentInfo: '',
            sendcodeparentInfo: '',
          });
        }
      });
    });
    tmpDataSource = _.orderBy(tmpDataSource, 'listCode');
    setAllNum(allNum);
    dispatch({
      type: 'performanceIndicators/tmpSavePer',
      payload: {
        mainTableId: cutomHeaders?.mainTableId,
        code: formColumnsCode,
        bizSolId: bizInfo.bizSolId,
        formDeployId: deployFormId,
        list: JSON.stringify(tmpDataSource),
      },
      callback: () => {
        dispatch({
          type: 'performanceIndicators/updateStates',
          payload: {
            dataSource: tmpDataSource,
            isShowPerforman: false,
          },
        });
      },
    });
  };
  const onCancel = () => {
    dispatch({
      type: 'performanceIndicators/updateStates',
      payload: {
        isShowPerforman: false,
      },
    });
  };
  console.log('treeDataSource===', treeDataSource);
  return (
    <GlobalModal
      open={true}
      widthType={3}
      bodyStyle={{ padding: '0px' }}
      onOk={insertData.bind(this)}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return (
          document.getElementById(`formShow_container_${targetKey}`) || false
        );
      }}
      containerId={`formShow_container_${targetKey}`}
    >
      <Table
        dataSource={treeDataSource}
        columns={columns}
        expandable={{
          onExpand: onExpand.bind(this),
          expandedRowKeys: expandedRowKeys,
        }}
        scroll={{ y: 'calc(100% - 40px)' }}
        rowKey={'id'}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
    </GlobalModal>
  );
}
export default connect(({ performanceIndicators, loading }) => ({
  performanceIndicators,
  loading,
}))(IndicatorModal);
