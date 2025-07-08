import GlobalModal from '@/public/GlobalModal'
import Table from '@/public/columnDragTable'
import { loopDataSource, loopPushData } from '@/utils/tableTree'
import { useModel } from '@umijs/max'
import _ from 'lodash'
import { useEffect } from 'react'
function IndicatorModal({ setIsShowPerforman }) {
  const {
    treeDataSource,
    setState,
    getPerformanceTree,
    expandedRowKeys,
    selectedRowKeys,
    dataSource,
    selectedRowData,
  } = useModel('performanceIndicator')
  const { targetKey } = useModel('@@qiankunStateFromMaster')
  const dictsList = JSON.parse(window.sessionStorage.getItem('dictsList'))
  console.log('dictsList=', dictsList)
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
      //render:(text)=><div>{getDictName('PERFORMANCE_TYPE_TLDT_',text)}</div>
    },
    {
      title: '指标方向',
      dataIndex: 'PERFORMANCE_DIRECT_TLDT_',
      key: 'PERFORMANCE_DIRECT_TLDT_',
      //render:(text)=><div>{getDictName('PERFORMANCE_DIRECT_TLDT_',text)}</div>
    },
    {
      title: '计量单位',
      dataIndex: 'UNIT_OF_MEASUREMENT',
      key: 'UNIT_OF_MEASUREMENT',
    },
  ]
  //获取码表的名称
  const getDictName = (code: string, dictInfoCode: string) => {
    if (dictsList && dictsList.length) {
      let tmpInfos = dictsList[code].dictInfos
      let info = tmpInfos.filter((i) => i.dictInfoCode == dictInfoCode)
      return info?.[0]?.dictInfoName || ''
    } else {
      return ''
    }
  }
  useEffect(() => {
    setState({
      expandedRowKeys: [],
    })
    //获取指标树
    getPerformanceTree(
      {
        parentId: 0,
      },
      (data: any) => {
        debugger
        //获取选中过的数据
        let tmpSelectedRowKeys = dataSource.map((item: any) => {
          return item.performanceId
        })
        //增加一个排序用于列表中显示(政府规定只能有三级，所以按三级写，如果有多级还得改)（这个用于勾选父子问题）
        data.map((item: any, index: number) => {
          item.parentId = '0'
          item.firstParentInfo = ''
          item.sendcodeparentInfo = ''
        })
        setState({
          treeDataSource: loopDataSource(data),
          selectedRowKeys: tmpSelectedRowKeys,
          selectedRowData: _.cloneDeep(dataSource),
        })
      }
    )
  }, [])
  //展开
  const onExpand = (expanded: boolean, record: any) => {
    if (expanded) {
      //获取子数据
      getPerformanceTree(
        {
          parentId: record.id,
        },
        (data: any) => {
          //增加一个排序用于列表中显示
          data.map((item: any, index: number) => {
            item.parentId = record.id
            if (record.firstParentInfo) {
              item.firstParentInfo = record.firstParentInfo
              item.sendcodeparentInfo = record
            } else {
              item.firstParentInfo = record
            }
          })
          data = loopDataSource(data)
          let newTreeData = loopPushData(
            treeDataSource,
            data,
            record.id,
            1,
            'id'
          )
          setState({
            treeDataSource: _.cloneDeep(newTreeData),
          })
        }
      )
      expandedRowKeys.push(record.id)
      setState({
        expandedRowKeys,
      })
    } else {
      //移除
      let tmpExpandedRowKeys = expandedRowKeys.filter((i) => i != record.id)
      setState({
        expandedRowKeys: tmpExpandedRowKeys,
      })
    }
  }
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onSelect: (record: any, selected: any, selectedRows: any) => {
      debugger
      if (selected) {
        selectedRowKeys.push(record.id)
        //父关联子所以这个时候需要加入parentId
        if (
          record.firstParentInfo &&
          !selectedRowKeys.includes(record.firstParentInfo.id)
        ) {
          selectedRowKeys.push(record.firstParentInfo.id)
          selectedRowData.push(record.firstParentInfo)
        }
        if (
          record.sendcodeparentInfo &&
          !selectedRowKeys.includes(record.sendcodeparentInfo.id)
        ) {
          selectedRowKeys.push(record.sendcodeparentInfo.id)
          selectedRowData.push(record.sendcodeparentInfo)
        }
        selectedRowData.push(record)
        setState({
          selectedRowKeys: _.cloneDeep(selectedRowKeys),
          selectedRowData,
        })
      } else {
        //父取消子节点也需要取消
        let removeIds = [record.id]
        if (record.IS_PARENT) {
          //为一级
          selectedRowData.map((item) => {
            if (item.parentId == record.id) {
              removeIds.push(item.id)
            }
          })
          selectedRowData.map((item) => {
            if (removeIds.includes(item.parentId)) {
              removeIds.push(item.id)
            }
          })
        } else {
          selectedRowData.map((item) => {
            if (item.parentId == record.id) {
              removeIds.push(item.id)
            }
          })
        }
        //移除
        let newSelectedRowData = selectedRowData.filter(
          (i) => !removeIds.includes(i.id)
        )
        let newSelectedRowKeys = selectedRowKeys.filter(
          (i) => !removeIds.includes(i)
        )

        setState({
          selectedRowKeys: newSelectedRowKeys,
          selectedRowData: newSelectedRowData,
        })
      }
    },
  }
  //插入数据到表中
  const insertData = () => {
    debugger
    selectedRowData.map((item: any) => {
      item.performanceName = item.PERFORMANCE_NAME
      item.performanceType = item.PERFORMANCE_TYPE_TLDT_
      item.performanceDirect = item.PERFORMANCE_DIRECT_TLDT_
      item.unitOfMeasurement = item.UNIT_OF_MEASUREMENT
    })
    //排序插入
    let newDataSource = _.orderBy(selectedRowData, 'GRADE', 'asc')
    newDataSource = _.groupBy(newDataSource, 'parentId')
    let tmpDataSource = []
    Object.keys(newDataSource).map((item) => {
      newDataSource[item].map((chiItem: any, index: number) => {
        if (item == '0') {
          tmpDataSource.push({
            performanceCode: chiItem.PERFORMANCE_CODE,
            performanceName: chiItem.PERFORMANCE_NAME,
            performanceType: chiItem.PERFORMANCE_TYPE_TLDT_,
            performanceDirect: chiItem.PERFORMANCE_DIRECT_TLDT_,
            unitOfMeasurement: chiItem.UNIT_OF_MEASUREMENT,
            listCode: (index + 1).toString(),
            performanceId: chiItem.ID,
            isParent: chiItem.IS_PARENT,
            parentId: chiItem.parentId,
            ...chiItem,
            children: null,
            firstParentInfo: '',
            sendcodeparentInfo: '',
          })
        } else {
          //获取父节点的listCode
          let parentInfo = tmpDataSource.filter(
            (i) => i.performanceId == chiItem.parentId
          )
          let parentListCode = parentInfo?.[0]?.listCode || '0'
          let tmpIndex = index + 1
          tmpDataSource.push({
            performanceCode: chiItem.PERFORMANCE_CODE,
            performanceName: chiItem.PERFORMANCE_NAME,
            performanceType: chiItem.PERFORMANCE_TYPE_TLDT_,
            performanceDirect: chiItem.PERFORMANCE_DIRECT_TLDT_,
            unitOfMeasurement: chiItem.UNIT_OF_MEASUREMENT,
            listCode: parentListCode + '.' + tmpIndex,
            performanceId: chiItem.ID,
            isParent: chiItem.IS_PARENT,
            parentId: chiItem.parentId,
            ...chiItem,
            children: null,
            firstParentInfo: '',
            sendcodeparentInfo: '',
          })
        }
      })
    })
    tmpDataSource = _.orderBy(tmpDataSource, 'listCode')
    console.log('tmpDataSource==', tmpDataSource)
    setState({
      dataSource: tmpDataSource,
    })
    setIsShowPerforman(false)
  }
  const onCancel = () => {
    setIsShowPerforman(false)
  }
  console.log('treeDataSource===', treeDataSource)
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
          document.getElementById(`formShow_container_${targetKey}`) ||
          document.getElementById(`formShow_container`)
        )
      }}
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
  )
}
export default IndicatorModal
