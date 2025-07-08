import GlobalModal from '@/public/GlobalModal/index.jsx'
import ColumnDragTable from '@/public/columnDragTable'
import IPagination from '@/public/iPagination'
import { Empty } from 'antd'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import styles from './look.less'
// const data=[
//   {
//       "data":[
//           {
//               "DEPT_NAME":"null",
//               "ORG_ID":"1564518594660802562",
//               "DEPT_CODE":"null",
//               "ORG_NAME":"北京天九有限公司",
//               "BIZ_ID":"1573239117376954369",
//               "SRK":"123",
//               "DR":"0",
//               "POST_NAME":"null",
//               "CREATE_USER_ID":"1562365983094599681",
//               "SOL_ID":"1573142820095524866",
//               "MAIN_TABLE_ID":"1573239117376954370",
//               "ORG_CODE":"G100071",
//               "CREATE_IDENTITY_ID":"1564910334236454913",
//               "SORT":"0.0",
//               "TENANT_ID":"1557204233395175426",
//               "CREATE_USER_NAME":"王1",
//               "POST_CODE":"null",
//               "ID":"1573239117376954370",
//               "CREATE_TIME":"1663924420"
//           }
//       ],
//       "deployFormId":"1573141587481899010"
//   },
//   {
//       "data":[

//       ],
//       "deployFormId":"1573141587876163586"
//   }
// ]
// const columns = [[
//   '名称1',data[0].data[0].ORG_NAME,
//   '名称2',data[0].data[0].ORG_NAME,
// ],
// [
//   '名称3',data[0].data[0].ORG_NAME,
//   '名称4',data[0].data[0].ORG_NAME,
//   '名称6',data[0].data[0].ORG_NAME,
// ],
// [
//   '名称5',data[0].data[0].ORG_NAME,
// ]
// ]
function Look(props) {
  const {
    setIsShowLookModal,
    getDetailInfo,
    width,
    height,
    title,
    docWidth,
  } = props
  const masterProps = useModel('@@qiankunStateFromMaster')
  const { targetKey } = masterProps
  const [columns, setColumns] = useState<any>([])
  const [data, setData] = useState<any>([])
  const [pageSize, setPageSize] = useState<number>(10) //默认请求10条
  const [total, setTotal] = useState<number>(0) //默认请求10条
  const [current, setCurrent] = useState<number>(1) //默认请求10条
  //获取数组最大长度
  let length = 0
  columns.map((item) => {
    if (item.length > length) {
      length = item.length
    }
  })
  console.log('props.isMultiple', props)

  useEffect(() => {
    if (props.isMultiple) {
      getDetailInfo(callbackInfo, 1, 10)
    } else {
      getDetailInfo(callbackInfo, 1, 200)
    }
  }, [])
  const callbackInfo = (data, columns, total, current) => {
    setColumns(columns)
    setData(data)
    setCurrent(total)
    setTotal(current)
  }
  //分页
  const changePage = (nextPage: number, size: number) => {
    setPageSize(size)
    getDetailInfo(callbackInfo, nextPage, size)
  }
  return (
    <GlobalModal
      visible={true}
      title={title ? title : '项目信息查看面'}
      onOk={() => {
        setIsShowLookModal(false)
        if (window.location.href.includes('mobile')) {
          document.documentElement.style.transform = 'unset'
          document.documentElement.style.width = `${docWidth}px`
          document.documentElement.style.overflow = 'unset'
          document.documentElement.style.position = 'unset'
          document.getElementById(
            `formShow_container_${targetKey}`
          ).style.position = 'relative'
        }
      }}
      className={styles.look_warp}
      width={800}
      incomingWidth={width}
      incomingHeight={height}
      onCancel={() => {
        setIsShowLookModal(false)
        // if (dd.env.platform !== 'notInDingTalk') {
        //   dd.ready(function () {
        //     dd.device.screen.resetView({
        //       onSuccess: function (res) {
        //         // 调用成功时回调
        //         console.log(res)
        //       },
        //       onFail: function (err) {
        //         // 调用失败时回调
        //         console.log(err)
        //       },
        //     })
        //   })
        // }
        if (window.location.href.includes('mobile')) {
          document.documentElement.style.transform = 'unset'
          document.documentElement.style.width = `${docWidth}px`
          document.documentElement.style.overflow = 'unset'
          document.documentElement.style.position = `unset`
          document.getElementById(
            `formShow_container_${targetKey}`
          ).style.position = 'relative'
        }
      }}
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
      widthType={3}
      bodyStyle={{ padding: '0px' }}
      // bodyStyle={{
      //   height:
      //     columns.length == 0 || !props?.columns()?.['columns']
      //       ? '190px'
      //       : height,
      // }}
    >
      {props.isMultiple ? (
        <div style={{ position: 'relative', height: '100%' }}>
          <div style={{ height: 'calc(100% - 36px)' }}>
            {props?.columns()?.['columns'] ? (
              <ColumnDragTable
                columns={props?.columns()?.['columns'] || []}
                dataSource={data}
                rowKey={'id'}
                scroll={{ y: 'calc(100% - 100px)', x: 'auto' }}
                bordered={true}
                pagination={false}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
          {data ? (
            <IPagination
              current={current}
              total={total}
              onChange={changePage.bind(this)}
              pageSize={pageSize}
            />
          ) : (
            ''
          )}
        </div>
      ) : columns?.length != 0 ? (
        <table className={styles.table_warp} border="1px solid #666666">
          {columns.map((item, key) => {
            return (
              <tr key={key}>
                {item.map((child, i) => {
                  return (
                    <td
                      key={i}
                      className={
                        i % 2 != 0 ? styles.value_style : styles.title_style
                      }
                      colSpan={
                        item.length != length && i == item.length - 1
                          ? length - i
                          : 1
                      }
                    >
                      {child}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </table>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </GlobalModal>
  )
}
export default Look
