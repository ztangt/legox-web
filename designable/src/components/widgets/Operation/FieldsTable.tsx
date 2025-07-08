import _ from 'lodash'
import { MenuOutlined } from '@ant-design/icons'
import NumberModal from './NumberModal'
import DateModal from './DateModal'
import { Table, Button, Popconfirm, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { arrayMoveImmutable } from 'array-move'
import { useModel } from 'umi'
import React, { useState, useEffect } from 'react'
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc'

// interface DataType {
//   key: string
//   index: number
//   type: string
//   result: string
//   expression: string
//   handler: string
//   convert: string
// }

const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
))

const dateTypes = new Map([
  ['DATE', '日期'],
  ['NUMBER', '数字'],
])

const triggerTypes = new Map([
  ['onBlur', '失去焦点'],
  ['onChange', 'change'],
  ['click', '点击'],
])

const SortableItem = SortableElement(
  (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />
)
const SortableBody = SortableContainer(
  (props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />
)

function FieldsTable({ onSetList }) {
  const columns = [
    {
      title: '运算类型',
      dataIndex: 'optType',
      className: 'drag-visible',
      render: (_, record) => <span>{dateTypes.get(record.optType)}</span>,
    },
    {
      title: '结果字段',
      dataIndex: 'resultColumnName',
      render: (_, record) => (
        <span>
          {record.resultFormName}:{record.resultColumnName}
        </span>
      ),
    },
    {
      title: '表达式',
      dataIndex: 'expressionCn',
    },
    {
      title: '触发事件',
      dataIndex: 'triggerType',
      render: (_, record) => (
        <span>{triggerTypes.get(record.triggerType)}</span>
      ),
    },
    {
      title: '小写转大写',
      dataIndex: 'toggleCase',
      render: (_, record) => <span>{record.toggleCase ? '是' : '否'}</span>,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: '操作',
      dataIndex: 'control',
      render: (_, record) => (
        <>
          <a onClick={() => handleEdit(record)}>修改</a>
          {/* <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
          <a>删除</a>
        </Popconfirm> */}
        </>
      ),
    },
  ]
  const { deployFormId } = useModel('designable')
  const { operationList, getOperation, getTableColumnsFn, setState } =
    useModel('operation')

  const [dateModal, setDateModal] = useState(false)
  const [numberData, setNumberData] = useState({})
  const [numberModal, setNumberModal] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  useEffect(() => {
    if (deployFormId) {
      getOperation({ deployFormId })
      getTableColumnsFn({ deployFormId, type: 'YES' })
    }
  }, [deployFormId])

  const handleEdit = (record) => {
    console.log(record)
    setNumberData(record)
    if (record.optType === 'NUMBER') {
      setNumberModal(true)
    } else {
      setDateModal(true)
    }
  }

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const dataSource = _.cloneDeep(operationList)
      const newData = arrayMoveImmutable(
        dataSource.slice(),
        oldIndex,
        newIndex
      ).filter((el: DataType) => !!el)
      setState({ operationList: newData })
    }
  }

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  )

  const DraggableBodyRow: React.FC<any> = ({
    className,
    style,
    ...restProps
  }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const dataSource = _.cloneDeep(operationList || [])
    const index = dataSource.findIndex(
      (x) => x.index === restProps['data-row-key']
    )
    return <SortableItem index={index} {...restProps} />
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  function onNumberSave(values, data) {
    onSetList(values, data)
    setNumberModal(false)
  }

  function onDateSave(values, data) {
    onSetList(values, data)
    setDateModal(false)
  }

  function onDelClick() {
    if (!selectedRowKeys.length) {
      message.warning('请选择删除的数据')
      return
    }
    let tmp = _.cloneDeep(operationList || [])
    tmp = tmp.filter((item) => !selectedRowKeys.includes(item.index))
    setState({ operationList: tmp })
  }

  return (
    <>
      {numberModal && (
        <NumberModal
          numberData={numberData}
          onSubmit={onNumberSave}
          onCancel={() => {
            setNumberModal(false)
            setNumberData({})
          }}
          loading={false}
        ></NumberModal>
      )}
      {dateModal && (
        <DateModal
          numberData={numberData}
          onSubmit={onDateSave}
          onCancel={() => {
            setDateModal(false)
          }}
          loading={false}
        ></DateModal>
      )}
      <div style={{ marginBottom: 15 }}>
        <Button
          onClick={() => {
            setNumberModal(true)
            setNumberData({})
          }}
        >
          新增数字运算
        </Button>
        <Button
          onClick={() => {
            setDateModal(true)
            setNumberData({})
          }}
          style={{ margin: '0 10px' }}
        >
          新增日期运算
        </Button>
        <Button onClick={() => onDelClick()}>删除</Button>
      </div>
      <Table
        pagination={false}
        rowSelection={rowSelection}
        dataSource={operationList}
        columns={columns}
        rowKey="index"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
    </>
  )
}

export default FieldsTable
