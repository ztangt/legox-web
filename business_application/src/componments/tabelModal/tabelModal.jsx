import {
  Modal,
  Table,
  Input,
  TreeSelect,
  message,
  Select,
  Form,
  DatePicker,
} from 'antd'
import {Button} from '@/componments/TLAntd';
import React, {
  Children,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
} from 'react'
import ColumnDragTable from '../columnDragTable/index'
import IPagination from '../public/iPagination'
import styles from './index.less'
import _ from 'loadsh';
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
function TableModal({location,tableModalParams,setIsTableModal,divId}) {
  const listId = location.query.listId;
  const bizSolId = location.query.bizSolId;
  const formModelingName = divId?divId:`formModeling${bizSolId}${listId}`

  const [form] = Form.useForm()
  const [pageSize, setPageSize] = useState(10) //默认请求10条
  const [searchDataSource, setSearchDataSource] = useState({})
  const [dataSource,setDataSource] = useState([]);
  const [params, setParams] = useState({})
  const [selectedRowKeys,setSelectedRowKeys] = useState([]);
  const [selectedRows,setSelectedRows] = useState([]);
  const {getDataSource,advancedSearch,tabelProps,onOk,getSelectRows} = tableModalParams;
  const [columns,setColumns] = useState([]);
  useEffect(()=>{
    let tmpColumns = tabelProps?.columns||[];
    tmpColumns.map((item)=>{
      if(item.renderButtons){
        item.render = (text,record,index)=>{
          return <>{item.renderButtons.map((item)=>{
            return <span {...item.props} onClick={()=>{item.props?.onClick?.(text,record,index)}}>{item.text}</span>
          })}</>
        }
      }
    })
    setColumns(tmpColumns);
  },[])
  const fetchOptions = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
  }
  const [height, setHeight] = useState(
    document.getElementById(formModelingName).offsetHeight * 0.8 - 87
  )
  const onResize = useCallback(() => {
    setHeight(
      Number(
        document.getElementById(formModelingName).offsetHeight * 0.8 - 87
      )
    )
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  useEffect(() => {
    console.log('ssss===',getDataSource,getSelectRows,typeof getSelectRows=='function')
    // setExpandedRowKeys([])
    //setDataSource([])
    //setExpandedRowKeys([])
    if(getDataSource){
      getDataSource?.(1, 10, {},setDataSource)
    }
    if (getSelectRows&&typeof getSelectRows=='function') {
      selectedRowsFn()
    }
  }, [])//应为一开始打开获取不到getDataSource
  //获取搜索的数据源
  useEffect(() => {
    advancedSearch?.map((item, index) => {
      if (item.searchType == 'select') {
        if (item.url) {
          fetch(`${window.localStorage.getItem(
            "env"
          )}/${item.url}`, fetchOptions).then((response) => {
            response.json().then((returnData) => {
              let data = returnData.data.list
              searchDataSource[index.toString()] = data
              setSearchDataSource(searchDataSource)
            })
          })
        } else {
          searchDataSource[index.toString()] = item.option
          setSearchDataSource(searchDataSource)
        }
      }
    })
    return () => {
      //清空
      setDataSource([])
      setSelectedRows([])
      setSelectedRowKeys([])
      setParams({})
    }
  }, [])
  //分页
  const changePage = (nextPage, size) => {
    setPageSize(size)
    getDataSource?.(nextPage, size, params,setDataSource)
  }
  // //数据回显
  const selectedRowsFn = () => {
    const callback = (data,keys) => {
      setSelectedRowKeys(keys)
      setSelectedRows(data)
    }
    getSelectRows(callback)
  }
  const rowSelection= {
    selectedRowKeys: selectedRowKeys,
    onSelect: (record, selected) => {
      console.log('record=', record)
      console.log('selected=', selected)
      console.log('selectedRowKeys=', selectedRowKeys)
      if (selected) {
        //选中
        if (tableModalParams?.selectionType == 'radio') {
          setSelectedRowKeys([record[tabelProps.rowKey]])
          setSelectedRows([{ ...record}])
        } else {
          //分页也要获得当前的
          selectedRowKeys.push(record[tabelProps.rowKey])
          setSelectedRowKeys(_.cloneDeep(selectedRowKeys))
          let tmpSelectedRows = _.cloneDeep(selectedRows)
          tmpSelectedRows.push(record)
          setSelectedRows(tmpSelectedRows)
        }
      } else {
        let tmpSelectedRowKeys = selectedRowKeys.filter(
          (i) => i != record[tabelProps.rowKey]
        )
        let tmpSelectedRows = selectedRows.filter(
          (item) => item[tabelProps.rowKey] == record[tabelProps.rowKey]
        )
        setSelectedRowKeys(tmpSelectedRowKeys)
        setSelectedRows(tmpSelectedRows)
      }
    },
    onSelectAll: (selected, tmpSelectedRows, changeRows) => {
      if (selected) {
        //将当前页的数据全部写入
        changeRows.map((item) => {
          selectedRowKeys.push(item[tabelProps.rowKey])
        })
        setSelectedRowKeys(_.cloneDeep(selectedRowKeys))
        let tmpRows = selectedRows.concat(changeRows)
        setSelectedRows(tmpRows)
      } else {
        let tmpRows = []
        let tmpKeys = []
        selectedRows.map((item) => {
          let isCancleRows = changeRows.filter(
            (changeItem) => changeItem[tabelProps.rowKey] == item[tabelProps.rowKey]
          )
          if (!isCancleRows.length) {
            tmpKeys.push(item[tabelProps.rowKey])
            tmpRows.push(item)
          }
        })
        setSelectedRowKeys(tmpKeys)
        setSelectedRows(tmpRows)
      }
    },
    getCheckboxProps: (record) => ({
      //disabled: props.checkStrictly && record.isParent == 1,
    }),
  }
  //高级搜索的渲染
  const advancedSearchRender = (info, index) => {
    let strIndex = index.toString()
    switch (info.searchType) {
      case 'input':
        return <Input style={{ width: '200px', height: '32px' }} />
      case 'select':
        return (
          <Select
            options={searchDataSource?.[strIndex] || []}
            style={{ width: '200px' }}
            fieldNames={info.fieldNames}
            defaultValue={info.defaultValue}
          />
        )
      case 'date':
        return <DatePicker format={info.format} showTime={info.showTime} />
      default:
        return null
    }
  }
  //计算表格高度
  const tabelHeigth = () => {
    let minHeight = 52
    if (advancedSearch && advancedSearch.length) {
      minHeight =
        minHeight + Math.ceil(advancedSearch.length / 3) * 48 + 20 + 28
    }
    // if (
    //   props?.showImport ||
    //   props?.showAdd ||
    //   props?.showUpdate ||
    //   props?.showCheck ||
    //   props?.headerButtons
    // ) {
    //   minHeight = minHeight + 28 + 10
    // }
    //advancedSearch&&advancedSearch.length?`calc(100% - ${Math.ceil(advancedSearch.length/3)*48+28+100}px)`:'calc(100% - 100px)'
    //let height = document.getElementById(formModelingName).offsetHeight * 0.8 - 87
    return `calc(100% - ${minHeight}px)`
  }
  return (
    <Modal
      visible={true}
      width={'95%'}
      title="信息"
      bodyStyle={{ padding: 0, height: height }}
      onOk={
        onOk
          ? () => {
              try {
                tableModalParams.onOk(selectedRows)
              } catch (e) {
                console.log('e=', e)
              }
            }
          : () => {}
      }
      wrapClassName={styles.table_modal}
      onCancel={() => {
        setIsTableModal(false)
      }}
      okText="确定"
      cancelText="取消"
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById(formModelingName) || false
      }}
    >
      {advancedSearch && advancedSearch.length ? (
        <div className={styles.search_warp}>
          <Form
            form={form}
            name="search"
            onFinish={(values) => {
              searchFn(values)
            }}
            autoComplete="off"
            layout="inline"
          >
            {advancedSearch?.map((item, index) => {
              return (
                <Form.Item name={item.searchParam} label={item.name}>
                  {advancedSearchRender(item, index)}
                </Form.Item>
              )
            })}
          </Form>
          <div className={styles.search_button}>
            <Button
              type="primary"
              onClick={() => {
                searchTabelFn(form.getFieldsValue(true))
              }}
            >
              搜索
            </Button>
          </div>
        </div>
      ) : (
        ''
      )}
      <div style={{ height: tabelHeigth() }}>
        {tableModalParams?.onExpand?
          <ColumnDragTable
            columns={columns}
            dataSource={dataSource?.list||[]}
            rowKey={tabelProps?.rowKey||'id'}
            rowSelection={{
              ...rowSelection,
              checkStrictly: true,
              hideSelectAll: tableModalParams?.selectionType == 'radio' ? true : false,
            }}
            scroll={{ y: 'calc(100% - 40px)', x: 'auto' }}
            bordered={true}
            pagination={false}
            expandable={{onExpand:tableModalParams.onExpand?.bind(this,dataSource,setDataSource)}}
          />:
          <ColumnDragTable
            columns={columns}
            dataSource={dataSource?.list||[]}
            rowKey={tabelProps?.rowKey||'id'}
            rowSelection={{
              ...rowSelection,
              checkStrictly: true,
              hideSelectAll: tableModalParams?.selectionType == 'radio' ? true : false,
            }}
            scroll={{ y: 'calc(100% - 40px)', x: 'auto' }}
            bordered={true}
            pagination={false}
          />
        }
      </div>
      <>
        <div
          style={{
            overflow: 'hidden',
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
            {tableModalParams?.remind}
          </div>
          {dataSource?.list?.length? (
            <IPagination
              current={dataSource?.currentPage}
              total={dataSource?.returnCount}
              onChange={changePage.bind(this)}
              pageSize={pageSize}
              style={{ width: '60%', bottom: 'unset', float: 'right' }}
            />
          ) : (
            ''
          )}
        </div>
      </>
    </Modal>
  )
}
export default TableModal
