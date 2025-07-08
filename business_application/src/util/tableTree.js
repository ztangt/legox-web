//需要解析columns，更多的那行需要合并单元格，并且render用与点击更多展开
export function moreColumns(columns, onMoreExpand) {
  let tmpColumns = []
  if (columns.length) {
    columns.map((item, index) => {
      item.onCell = (record) => {
        if (typeof record.isColSpan != 'undefined' && record.isColSpan) {
          if (index === 0) {
            return {
              colSpan: columns.length,
            }
          } else {
            return {
              colSpan: 0,
            }
          }
        } else {
          return {
            colSpan: 1,
          }
        }
      }
      if (index === 0) {
        item.render = (text, record, i) => {
          if (record.isColSpan) {
            return (
              <p
                style={{ color: '#1890ff', cursor: 'pointer' }}
                onClick={onMoreExpand?.bind(this, record)}
              >
                {text}
              </p>
            )
          } 
          else {
            return <span style={{ cursor: 'pointer' }}>
                    {text || i+1}
                  </span>
          }
        }
      }
      tmpColumns.push(item)
    })
  }
  return tmpColumns
}
//isParent包含子节点的时候。增加children
export const loopDataSource = (data) => {
  data &&
    data.map((item, index) => {
      // TODO
      if (item.isParent == 1 || item.IS_PARENT == 1) {
        //如果含有子节点增加children
        item.children = [
          {
            key: '1-1',
          },
        ]
      }
    })
  return data
}
//将获取到的数据push到dataSource中
export const loopPushData = (data, childData, targetId, start, id) => {
  data &&
    data.map((item) => {
      if (item[id] == targetId) {
      // debugger
        //如果start大于1，则来源于更多，需要去掉更多的数据然后将item.children与childData合并成新的children,
        //如果是start==1,则直接用childData赋值给item.children
        if (start == 1) {
          item.children = childData
      // debugger
          return
        } else {
          let tmpChildData = item.children.filter(
            (i) => typeof i.isColSpan == 'undefined'
          )
          item.children = _.concat(tmpChildData, childData)
      // debugger
        }
      } else if (
        item.children &&
        item.children.length &&
        item.children[0].key != '1-1'
      ) {
        loopPushData(item.children, childData, targetId, start, id)
      }
    })
  return data
}
/*
@整理数据源（展开的时候要是有分页则需要增加更多）
@start 第几页
@columns table的columns
@id table的rowKey
@parentRecord 展开的当前节点的信息
@dataSource table的dataSource
@list 展开接口获取到的list数据
@currentPage 展开接口获取到的currentPage
@returnCount 展开接口获取到的returnCount
@limit 请求接口的limit
*/
export function reGetDataSource(
  start,
  columns,
  id,
  parentRecord,
  dataSource,
  list,
  currentPage,
  returnCount,
  limit
) {
  let newData = loopDataSource(list)
  // debugger
  if (limit * Number(currentPage) < Number(returnCount)) {
    //如果小于，将更多作为一条数据，点击更多加载
    //获取自定义的columns第一个列，将更多赋值进去
    let firstCol = columns?.[0]?.dataIndex || ''
    if (firstCol) {
      newData.push({
        [id]: `more${parentRecord[id]}`,
        [firstCol]: '更多...',
        isColSpan: true, //用于更多的时候的合并单元格
        currentPage: currentPage, //用于更多的时候传值
        parentRecord: parentRecord, //用于更多的时候传值
      })
    }
  }
  //将childre写入
  let newDataSource = loopPushData(
    dataSource,
    newData,
    parentRecord[id],
    start,
    id
  )
  return newDataSource
}
