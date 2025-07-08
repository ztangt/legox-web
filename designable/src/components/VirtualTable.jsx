import classNames from 'classnames'
import ResizeObserver from 'rc-resize-observer'
import { useEffect, useRef, useState } from 'react'
import { VariableSizeGrid as Grid } from 'react-window'
import ColumnDragTable from './columnDragTable'

// 虚拟列表 引入虚拟滚动方案 实现高性能表格
const VirtualTable = (props) => {
  const { columns, scroll } = props
  const [tableWidth, setTableWidth] = useState(0)
  const widthColumnCount = columns.filter(({ width }) => !width).length
  const mergedColumns = columns.map((column) => {
    if (column.width) {
      return column
    }
    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    }
  })
  const gridRef = useRef()
  const [connectObject] = useState(() => {
    const obj = {}
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft
        }
        return null
      },
      set: (scrollLeft) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({
            scrollLeft,
          })
        }
      },
    })
    return obj
  })
  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    })
  }
  useEffect(() => resetVirtualGrid, [tableWidth])
  const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
    ref.current = connectObject
    const totalHeight = rawData.length * 32
    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={mergedColumns.length}
        columnWidth={(index) => {
          const { width } = mergedColumns[index]
          return totalHeight > scroll.y && index === mergedColumns.length - 1
            ? width - scrollbarSize - 1
            : width
        }}
        height={scroll.y}
        rowCount={rawData.length}
        rowHeight={() => 32}
        width={tableWidth}
        onScroll={({ scrollLeft }) => {
          onScroll({
            scrollLeft,
          })
        }}
      >
        {({ columnIndex, rowIndex, style }) => (
          <div
            className={classNames('virtual-table-cell', {
              'virtual-table-cell-last':
                columnIndex === mergedColumns.length - 1,
            })}
            style={style}
          >
            {rawData[rowIndex][mergedColumns[columnIndex].dataIndex]}
          </div>
        )}
      </Grid>
    )
  }
  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width)
      }}
    >
      <ColumnDragTable
        {...props}
        // className="virtual-table"
        columns={mergedColumns}
        pagination={false}
        components={{
          body: renderVirtualList,
        }}
      />
    </ResizeObserver>
  )
}

export default VirtualTable
