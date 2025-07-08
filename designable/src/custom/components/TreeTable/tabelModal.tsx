import ColumnDragTable from '@/public/columnDragTable'
import IPagination from '@/public/iPagination'
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Spin,
  Tag,
} from 'antd'
import type { TableRowSelection } from 'antd/es/table/interface'
import { cloneDeep } from 'lodash'
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useModel } from 'umi'
import styles from './index.less'
//import { fetch } from 'dva'
import high_search from '@/public/assets/high_search.svg'
import GlobalModal from '@/public/GlobalModal/index.jsx'
import { moreColumns } from '@/utils/tableTree'
import { DoubleRightOutlined } from '@ant-design/icons'
import _ from 'lodash'
import { env } from '../../../../project_config/env.js'
const { Search } = Input
// const advancedSearch= [
//   {
//     "searchParam":'year',
//     "searchType": "select",
//     "url": "sys/dictType/ZJLY?showType=ALL&searchWord=&isTree=1",
//     "name": "年度",
//     "ismultiple": true,
//     "fieldNames":{value:'dictInfoCode',label:'dictInfoName'}
//   },{
//     "searchParam":'name',
//       "searchType": "input",
//       "name": "名称",
//   },
//   {
//     "searchParam":'name1',
//       "searchType": "input",
//       "name": "名称1",
//   },
//   {
//     "searchParam":'name2',
//       "searchType": "date",
//       "name": "日期",
//       "showTime":false,//是否显示时间
//       "format":'YYYY-MM-DD'
//   },
//     {
//       "searchParam":'org',
//       "searchType": "select",
//       "url": "",
//       "name": "单位",
//       "ismultiple": true,
//       //"fieldNames":{value:'dictInfoCode',label:'dictInfoName'},
//       "option":[
//         { value: 'jack', label: 'Jack' },
//         { value: 'lucy', label: 'Lucy' },
//         { value: 'Yiminghe', label: 'yiminghe' },
//         { value: 'disabled', label: 'Disabled', disabled: true },
//       ]
//     }
// ]
const fetchOptions = {
  method: 'GET',
  headers: {
    Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
  },
}
function TableModal({
  props,
  setIsShowModal,
  field,
  dataSource,
  setDataSource,
  loopDataSource,
  selectedRowKeys,
  setSelectedRowKeys,
  id,
  selectedRows,
  setSelectedRows,
  expandedRowKeys,
  setExpandedRowKeys,
  onExpand,
  loopPushData,
}) {
  const { width, height } = props
  const [form] = Form.useForm()
  const [formHigh] = Form.useForm()
  const [columns, setColumns] = useState(props?.columns?.()?.['columns'] || [])
  const [pageSize, setPageSize] = useState<number>(
    props?.columns?.()?.['limit'] || 10
  ) //默认请求10条
  const [searchDataSource, setSearchDataSource] = useState({})
  const [params, setParams] = useState({})
  const [isShowHighSearch, setIsShowHighSearch] = useState(false)
  const [isReGetSelectData, setIsReGetSelectData] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const {
    setBizModalProps,
    setBizModal,
    setBizModalState,
    location,
    setTreeTableProps,
    targetKey,
  } = useModel('@@qiankunStateFromMaster')
  const advancedSearch = props.advancedSearch
  const highAdvancedSearch = props.highAdvancedSearch
  useEffect(() => {
    setExpandedRowKeys([])
    // setSelectedRows([])
    // setSelectedRowKeys([])
    setDataSource([])
    setExpandedRowKeys([])
    setParams({})
    props?.getYear?.()
    props?.getState?.()
    props?.getDataSource?.(1, pageSize, {})
    if (props.getSelectRows) {
      //用户设置了回显则重新获取选中
      selectedRowsFn()
    }
    return () => {
      setDataSource([])
    }
  }, [])
  useEffect(() => {
    //需要更新columns，要不render里面获取不到dataSource
    let tmpColumns = moreColumns(columns, onMoreExpand)
    setColumns(tmpColumns)
  }, [dataSource])
  const onMoreExpand = (record: any) => {
    onExpand(Number(record.currentPage) + 1, true, record.parentRecord)
  }
  //获取搜索的数据源
  useEffect(() => {
    advancedSearch?.map((item: any, index: number) => {
      if (item.searchType == 'select') {
        if (item.url) {
          fetch(`${env}/${item.url}`, fetchOptions).then((response) => {
            response.json().then((returnData) => {
              let data = returnData.data.list
              let tmpinfo = _.clone(searchDataSource)
              tmpinfo[index.toString()] = data
              setSearchDataSource(tmpinfo)
            })
          })
        } else {
          let tmpinfo = _.clone(searchDataSource)
          tmpinfo[index.toString()] = item.option
          setSearchDataSource(tmpinfo)
        }
      }
    })
  }, [])
  console.log('searchDataSource==', searchDataSource)
  //分页
  const changePage = (nextPage: number, size: number) => {
    setPageSize(size)
    props.getDataSource(nextPage, size, params)
    setExpandedRowKeys([])
  }
  //数据回显
  const selectedRowsFn = () => {
    const callback = (data: any) => {
      const tmpSelectedRowKeys = []
      data &&
        data.map((item: any) => {
          tmpSelectedRowKeys.push(item[id])
        })
      setSelectedRowKeys(tmpSelectedRowKeys)
      setSelectedRows(data)
    }
    props.getSelectRows && props.getSelectRows(callback)
  }
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys: selectedRowKeys,
    onSelect: (record: any, selected: any) => {
      setIsReGetSelectData(false)
      if (selected) {
        //选中
        if (props.selectionType == 'radio') {
          setSelectedRowKeys([record[id]])
          setSelectedRows([{ ...record, children: null }])
        } else {
          //分页也要获得当前的
          selectedRowKeys.push(record[id])
          setSelectedRowKeys(cloneDeep(selectedRowKeys))
          let tmpSelectedRows = cloneDeep(selectedRows)
          tmpSelectedRows.push(record)
          setSelectedRows(tmpSelectedRows)
        }
      } else {
        let tmpSelectedRowKeys = selectedRowKeys.filter(
          (i: any) => i != record[id]
        )
        let tmpSelectedRows = selectedRows.filter(
          (item: any) => item[id] != record[id]
        )
        setSelectedRowKeys(tmpSelectedRowKeys)
        setSelectedRows(tmpSelectedRows)
      }
    },
    onSelectAll: (selected, tmpSelectedRows, changeRows) => {
      if (selected) {
        //将当前页的数据全部写入
        changeRows.map((item) => {
          selectedRowKeys.push(item[id])
        })
        setSelectedRowKeys(cloneDeep(selectedRowKeys))
        let tmpRows = selectedRows.concat(changeRows)
        setSelectedRows(tmpRows)
      } else {
        let tmpRows = []
        let tmpKeys = []
        selectedRows.map((item) => {
          let isCancleRows = changeRows.filter(
            (changeItem) => changeItem[id] == item[id]
          )
          if (!isCancleRows.length) {
            tmpKeys.push(item[id])
            tmpRows.push(item)
          }
        })
        setSelectedRowKeys(tmpKeys)
        setSelectedRows(tmpRows)
      }
    },
    getCheckboxProps: (record) => ({
      disabled:
        (props.checkStrictly && record.isParent == 1) ||
        (typeof record.isColSpan != 'undefined' && record.isColSpan) ||
        levelDisabled(record),
    }),
  }
  const levelDisabled = (record: any) => {
    let allParentInfos = record.allParentInfos || []
    record.level = allParentInfos.length + 1
    if (props.noDisabledLevel && record.level != props.noDisabledLevel) {
      return true
    } else {
      return false
    }
  }
  //点击行选择
  const clickSelect = (record: any) => {
    if ((props.checkStrictly && record.isParent == 1) || record[id] == 'more') {
      return
    }
    //if(props.noDisabledLevel==1){
    let allParentInfos = record.allParentInfos || []
    record.level = allParentInfos.length + 1
    //}
    if (props.noDisabledLevel && record.level != props.noDisabledLevel) {
      return
    }
    setIsReGetSelectData(false)
    let selected = selectedRowKeys.includes(record[id])
    if (!selected) {
      //选中
      if (props.selectionType == 'radio') {
        setSelectedRowKeys([record[id]])
        setSelectedRows([{ ...record, children: null }])
      } else {
        //分页也要获得当前的
        selectedRowKeys.push(record[id])
        setSelectedRowKeys(cloneDeep(selectedRowKeys))
        let tmpSelectedRows = cloneDeep(selectedRows)
        tmpSelectedRows.push(record)
        setSelectedRows(tmpSelectedRows)
      }
    } else {
      let tmpSelectedRowKeys = selectedRowKeys.filter(
        (i: any) => i != record[id]
      )
      let tmpSelectedRows = selectedRows.filter(
        (item: any) => item[id] != record[id]
      )
      console.log('tmpSelectedRows==', tmpSelectedRows)
      setSelectedRowKeys(tmpSelectedRowKeys)
      setSelectedRows(tmpSelectedRows)
    }
  }
  //删除
  const deleteData = () => {
    if (!selectedRowKeys.length) {
      message.error('请选择要删除的对象')
      return
    }
    Modal.confirm({
      content: '确认要删除吗？',
      getContainer: () => {
        return document.getElementById(`formShow_container_${targetKey}`)
      },
      mask: false,
      maskClosable: false,
      onOk() {
        props?.deleteData?.(selectedRowKeys.join(','), () => {
          props.getDataSource(1, pageSize, params)
        })
      },
      onCancel() {},
    })
  }

  const onAdd = (type) => {
    if (type == 'UPDATE') {
      if (selectedRows?.length >= 0) {
        if (!selectedRows?.[0]?.BIZ_ID || !selectedRows?.[0]?.ID) {
          return
        }
      } else {
        message.error('请选择一条数据进行修改!')
      }
    } else {
      if (selectedRows?.length > 0) {
        message.error('新增时请取消数据勾选！')
        return
      }
    }
    setBizModalProps({
      bizSolId: props?.bizSolId,
      bizInfoId: selectedRows?.[0]?.['BIZ_ID'] || undefined,
      id: selectedRows?.[0]?.['ID'] || undefined,
      // currentTab: location.query?.currentTab,
    }) //设置参数同表单路由参数
    // setBizModalState() //初始化stae
    setTreeTableProps({
      ...props,
      setExpandedRowKeys: setExpandedRowKeys,
      pageSize,
      setIsReGetSelectData,
    })
    setBizModal(true) //打开弹窗
  }
  const advancedSearchRender = (info: any, index: number) => {
    let strIndex = index.toString()
    switch (info.searchType) {
      case 'input':
        return (
          <Input
            style={{ width: '200px' }}
            {...info}
            onPressEnter={searchFn.bind(this)}
          />
        )
      case 'select':
        return (
          <Select
            options={searchDataSource?.[strIndex] || []}
            style={{ width: '200px' }}
            {...info}
            fieldNames={info.fieldNames}
            defaultValue={info.defaultValue}
          />
        )
      case 'date':
        return (
          <DatePicker
            {...info}
            format={info.format}
            showTime={info.showTime}
            style={{ width: '200px' }}
          />
        )
      case 'range':
        return (
          <DatePicker.RangePicker
            {...info}
            format={info.format}
            showTime={info.showTime}
            style={{ width: '235px' }}
          />
        )
      default:
        return null
    }
  }
  //搜索
  const searchFn = () => {
    let highValues = {}
    if (isShowHighSearch) {
      highValues = formHigh.getFieldsValue(true)
    }
    let values = { ...form.getFieldsValue(true), ...highValues }
    console.log('values===', values)
    //清空展开
    setExpandedRowKeys([])
    //advancedSearchUrl
    //拼接参数
    let params = {}
    Object.keys(values).map((key) => {
      params[key] = values[key]
    })
    setParams(params)
    //开始搜索
    props.getDataSource(1, pageSize, params)
  }
  //高级搜索
  const getSearchFields = (advancedSearch: any) => {
    return (
      <>
        {advancedSearch?.map((item, index) => {
          return (
            <Form.Item name={item.searchParam} label={item.name}>
              {advancedSearchRender(item, index)}
            </Form.Item>
          )
        })}
      </>
    )
  }
  //计算搜索的高度
  const [searchHeight, setSearchHeight] = useState(0)
  const searchRef = useRef(null)
  const measuredRef = useCallback(
    (node) => {
      //let node = searchRef.current;
      console.log('node===', node)
      if (node !== null) {
        setSearchHeight(node.getBoundingClientRect().height)
      }
    },
    [isShowHighSearch]
  )
  useEffect(() => {
    window.addEventListener('resize', () => {
      measuredRef(document.getElementById('search'))
    })
    return () => {
      window.removeEventListener('resize', () => {
        document.getElementById('search')
      })
    }
  }, [])
  //搜索
  const searchRender = useMemo(() => {
    return (
      <div
        className={styles.search}
        ref={measuredRef}
        id="search"
        style={{ paddingTop: '8px' }}
      >
        <div className={styles.convention}>
          <div className={styles.left}>
            <Form form={form} colon={false} layout="inline">
              {getSearchFields(advancedSearch)}
              {advancedSearch ? (
                <img
                  src={high_search}
                  style={{ marginLeft: '-8px' }}
                  onClick={searchFn.bind(this)}
                />
              ) : null}
              {highAdvancedSearch && (
                <>
                  <span
                    className={styles.high_level}
                    onClick={() => {
                      setIsShowHighSearch(!isShowHighSearch)
                    }}
                  >
                    高级
                  </span>
                  <DoubleRightOutlined
                    onClick={() => {
                      setIsShowHighSearch(!isShowHighSearch)
                    }}
                    rotate={90}
                    style={{ fontSize: '8px', marginTop: 12 }}
                  />
                </>
              )}
            </Form>
          </div>
          <div className={styles.right}>
            {props?.showImport && <Button>导入</Button>}
            {props?.showDelete && (
              <Button onClick={deleteData.bind(this)}>删除</Button>
            )}
            {props?.showAdd && (
              <Button onClick={onAdd.bind(this, 'ADD')}>新增</Button>
            )}
            {props?.showUpdate && (
              <Button onClick={onAdd.bind(this, 'UPDATE')}>修改</Button>
            )}
            {props?.showCheck && (
              <Button
                onClick={() => {
                  props?.checkUser?.()
                }}
              >
                人员校验
              </Button>
            )}
            {props?.headerButtons?.map((item: any) => {
              return (
                <Button
                  type="primary"
                  onClick={() => {
                    try {
                      eval(item.click)
                    } catch (e) {
                      console.log('e=', e)
                    }
                  }}
                  title={item.title}
                >
                  {item.name}
                </Button>
              )
            })}
          </div>
        </div>
        {isShowHighSearch && (
          <div className={styles.high_search}>
            {highAdvancedSearch && (
              <>
                <Form
                  form={formHigh}
                  className={styles.high_form}
                  layout="inline"
                  colon={false}
                >
                  {getSearchFields(highAdvancedSearch)}
                </Form>
                <div className={styles.f_opration} id="set_opration">
                  <Button
                    onClick={() => {
                      searchFn()
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      formHigh.resetFields()
                      form.resetFields()
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    onClick={() => {
                      formHigh.resetFields()
                      setIsShowHighSearch(false)
                    }}
                  >
                    收起
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    )
  }, [Object.keys(searchDataSource)])
  //校验成功以后的回掉
  const callback = (tmpSelectedRows, e) => {
    if (props.onOk) {
      try {
        if (isReGetSelectData) {
          //修改按钮的时候选中数据需要更新
          if (props.isAwait) {
            props.onOk(
              tmpSelectedRows,
              () => {
                field.setComponentProps({
                  isShowModal: false,
                })
                setConfirmLoading(false)
                setIsShowModal(false)
              },
              e
            )
          } else {
            props.onOk(tmpSelectedRows, e)
          }
          if (!tmpSelectedRows.length) {
            //修改的选中数据没有的情况下有可能属于子表，则这个时候需要将选中的数据清空
            setSelectedRowKeys([])
            setSelectedRows([])
          } else {
            setSelectedRows(tmpSelectedRows)
          }
          setIsReGetSelectData(false)
        } else {
          if (props.isAwait) {
            props.onOk(
              tmpSelectedRows,
              () => {
                field.setComponentProps({
                  isShowModal: false,
                })
                setConfirmLoading(false)
                setIsShowModal(false)
              },
              e
            )
          } else {
            props.onOk(tmpSelectedRows, e)
          }
        }
      } catch (e) {
        console.log('e=', e)
      }
      if (!props.isAwait) {
        field.setComponentProps({
          isShowModal: false,
        })
        setConfirmLoading(false)
        setIsShowModal(false)
      }
    }
  }
  //确认按钮
  const onOk = (e) => {
    let tmpSelectedRows = []
    if (isReGetSelectData) {
      dataSource.map((item: any) => {
        if (selectedRowKeys.includes(item[id])) {
          tmpSelectedRows.push(item)
        }
      })
    } else {
      tmpSelectedRows = selectedRows
    }
    if (!props?.onCheck) {
      callback(tmpSelectedRows, e)
    } else {
      props.onCheck(tmpSelectedRows, callback, e)
    }
  }
  // const renderSelectedInfos = (selectedRows:any)=>{
  //   let tmpInfos = [];
  //   selectedRows.map((item:any)=>{
  //     tmpInfos.push({
  //       name:item.OBJ_NAME,
  //       id:item.ID
  //     })
  //   })
  //   return tmpInfos;
  // }
  //取消勾选
  const deleteSelected = (deleteId: string) => {
    debugger
    let tmpSelectedRowKeys = selectedRowKeys.filter((i: any) => i != deleteId)
    let tmpSelectedRows = selectedRows.filter(
      (item: any) => item[id] != deleteId
    )
    setSelectedRowKeys(tmpSelectedRowKeys)
    setSelectedRows(tmpSelectedRows)
  }
  return (
    <GlobalModal
      open={true}
      widthType={3}
      incomingWidth={width}
      incomingHeight={height}
      title="信息"
      onOk={(e) => {
        setDisabled(true)
        setConfirmLoading(true)
        // debugger
        setTimeout(() => {
          setDisabled(false)
        }, 1000)
        onOk(e)
      }}
      okButtonProps={{ disabled: disabled }}
      // wrapClassName={styles.table_modal}
      onCancel={() => {
        field.setComponentProps({
          isShowModal: false,
        })
        setIsShowModal(false)
        setConfirmLoading(false)
      }}
      okText="确定"
      cancelText="取消"
      bodyStyle={{ padding: '0px' }}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return (
          document.getElementById(`formShow_container_${targetKey}`) ||
          document.getElementById(`preview_warp`)
        )
      }}
      containerId={
        window.location.href?.includes('formDesigner')
          ? 'preview_warp'
          : `formShow_container_${targetKey}`
      }
      confirmLoading={confirmLoading}
    >
      <Spin spinning={confirmLoading}>
        {searchRender}
        <div
          style={{ height: `calc(100% - ${searchHeight + 53}px)` }}
          className={styles.content_warp}
          id="tree_table_modal"
        >
          <ColumnDragTable
            columns={columns}
            dataSource={dataSource}
            onMoreExpand={onMoreExpand.bind(this)}
            rowKey={id}
            rowSelection={{
              ...rowSelection,
              checkStrictly: true,
              hideSelectAll: props.selectionType == 'radio' ? true : false,
              fixed: 'left',
            }}
            scroll={{ y: 'calc(100% - 40px)', x: 'calc(100% - 50px)' }}
            bordered={true}
            pagination={false}
            expandable={{ expandedRowKeys, onExpand: onExpand.bind(this, 1) }}
            onRow={(record: any) => {
              return {
                onClick: (event) => {
                  clickSelect(record)
                }, // 点击行
              }
            }}
            listHead="table_modal"
          />
          <div style={{ height: '22px', margin: '8px' }}>
            <span>已选择：</span>
            {props.renderSelectedInfos
              ? props.renderSelectedInfos(selectedRows).map((item) => {
                  return (
                    <Tag closable onClose={deleteSelected.bind(this, item.id)}>
                      {item.name}
                    </Tag>
                  )
                })
              : null}
          </div>
        </div>
        <>
          <div
            style={{
              borderTop: '1px solid #F0F0F0',
              position: 'relative',
              height: '52px',
            }}
          >
            <div
              style={{
                float: 'left',
                width: '35%',
                paddingTop: '10px',
                paddingLeft: '16px',
              }}
            >
              {props.remind}
            </div>
            {field.data ? (
              <IPagination
                current={field.data.currentPage}
                total={field.data.returnCount}
                onChange={changePage.bind(this)}
                pageSize={pageSize}
                style={{ width: '60%', bottom: 'unset', float: 'right' }}
              />
            ) : (
              ''
            )}
          </div>
        </>
      </Spin>
    </GlobalModal>
  )
}
export default forwardRef(TableModal)
