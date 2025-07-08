import GlobalModal from '@/public/GlobalModal'
import { setColumnCodeValue } from '@/utils/formUtil'
import { useField, useForm } from '@formily/react'
import { useSetState } from 'ahooks'
import { Input, InputNumber, Select, Table, message } from 'antd'
import _ from 'lodash'
import { useEffect } from 'react'
import { useModel } from 'umi'
import IPagination from '../../../components/IPagination'
import ColumnDragTable from '../../../components/columnDragTable'
import { renderHtml } from '../../../utils/listFormatUtil'
import styles from './index.less'

function Index(props) {
  const { isMultipleTree, columnCode, setPullDataModal, returnValue } = props
  const masterProps = useModel('@@qiankunStateFromMaster')
  const { location, bizInfo, targetKey } = masterProps
  const { bizSolId } = location.query
  const form = useForm()
  const field = useField()
  const pathSegments = field.path.segments

  interface State {
    tableStyleInfo?: any
    pullDataList?: any
    pullDatacurrentPage?: any
    pullDataCurrentSize?: any
    pullDataTotalCount?: any
    bizSolList?: any
    dataDriveInfoId?: any
    isBase?: any
    pullData?: any
    dictInfos?: any
    mainIds: any
    searchWord: any
    mainRows: any
    crossFlag: any
    year: any
  }
  const [state, setState] = useSetState<State>({
    bizSolList: [],
    pullDataList: [],
    tableStyleInfo: {},
    pullDatacurrentPage: 1,
    pullDataCurrentSize: 10,
    dataDriveInfoId: '',
    pullDataTotalCount: 0,
    isBase: 0,
    dictInfos: [],
    mainIds: [],
    searchWord: '',
    mainRows: [],
    crossFlag: 0,
    year: new Date().getFullYear(),
  })
  const {
    bizSolList,
    pullDataList,
    tableStyleInfo,
    pullDatacurrentPage,
    pullDataCurrentSize,
    dataDriveInfoId,
    pullDataTotalCount,
    isBase,
    dictInfos,
    mainIds,
    mainRows,
    searchWord,
    crossFlag,
    year,
  } = state
  const {
    getPullDataDriveInfos,
    getPullStyle,
    getPullDataList,
    getPullData,
    getDictType,
  } = useModel('preview')
  const mCode = 'TLDT_'

  useEffect(() => {
    if (!bizInfo?.formDeployId) {
      return
    }
    const { TITLES, IDS, BIZIDS, SOLIDS, DRIVEINFOID } = returnValue()
    getPullDataDriveInfos(
      {
        deployFormId: bizInfo?.formDeployId,
        bizSolId,
        tableColumn: columnCode,
        procDefId: bizInfo?.procDefId || 0,
      },
      (data) => {
        let infoId = DRIVEINFOID?.length
          ? DRIVEINFOID?.[0]
          : data.data.bizSolList[0].dataDriveInfoId
        let isBaseInfo = dataDriveInfoId
          ? isBase
          : data.data.bizSolList[0].isBase
        setState({
          bizSolList: data.data.bizSolList,
          dataDriveInfoId: infoId,
          crossFlag: data.data.crossFlag,
        })
        getPullStyleFn(infoId)
        getPullDataListFn(infoId, 1, 10, Number(isBaseInfo))
      }
    )

    getDictType(
      {
        dictTypeCode: 'SYS_YEAR',
        showType: 'ALL',
        searchWord: '',
        isTree: '1',
      },
      (data) => {
        setState({
          dictInfos: data.data,
        })
      }
    )
    let array = []
    for (let index = 0; index < IDS?.length; index++) {
      const element = IDS?.[index]
      array.push({
        TITLE: TITLES?.[index],
        ID: element,
        BIZID: BIZIDS?.[index],
        SOLID: SOLIDS?.[index],
        DRIVEINFOID: DRIVEINFOID?.[index],
      })
    }

    setState({ mainRows: array, mainIds: IDS })
  }, [])

  //获取拉取样式
  function getPullStyleFn(dataDriveInfoId) {
    getPullStyle(
      {
        dataDriveInfoId,
      },
      (data) => {
        setState({
          tableStyleInfo: data.data,
        })
      }
    )
  }

  function successOnOk() {
    let selectIds = []
    selectIds = selectIds.concat(mainIds)
    if (isMultipleTree == 'radio' && selectIds?.length > 0) {
      selectIds = [selectIds.pop()]
    }
    if (selectIds.length == 0) {
      message.error('至少选择一条单据信息')
      return
    }
    let BIZIDs = []
    let IDS = []
    let SOLIDS = []
    let TITLES = []
    let DRIVEINFOID = []
    for (let flag = 0; flag < mainRows.length; flag++) {
      const element = mainRows[flag]
      IDS.push(element.ID)
      BIZIDs.push(element.BIZ_ID)
      SOLIDS.push(element.SOL_ID)
      element.TITLE = element?.TITLE?.replaceAll(',', '%')
      TITLES.push(element.TITLE)
      DRIVEINFOID.push(element?.DRIVEINFOID)
      // mainRows[flag]['DRIVEINFOID'] = dataDriveInfoId
    }
    const valueObj = {
      [`${columnCode}`]: TITLES.toString(),
      [`${columnCode?.split('NAME_')?.[0]}ID_`]: IDS.toString(),
      [`${columnCode?.split('NAME_')?.[0]}BIZID_`]: BIZIDs.toString(),
      [`${columnCode?.split('NAME_')?.[0]}SOLID_`]: SOLIDS.toString(),
      [`${
        columnCode?.split('NAME_')?.[0]
      }DRIVEINFOID_`]: DRIVEINFOID.toString(),
    }

    getPullData(
      {
        //获取拉取数据
        dataDriveInfoId,
        mainIds: selectIds
          .filter((item) => {
            return item
          })
          .toString(),
        sourceJson: JSON.stringify(mainRows),
      },
      (data) => {
        setPullDataModal(false)
        // if(data.code == 200){
        setColumnCodeValue(
          form,
          pathSegments,
          columnCode,
          valueObj,
          true,
          () => {}
        )

        // if (pathSegments.length > 1) {
        //   //子表里面
        //   const codeIndex = pathSegments[pathSegments.length - 2]
        //   const parentCode = pathSegments[pathSegments.length - 3]
        //   const tableValue = form.values[parentCode]
        //   tableValue[codeIndex] = valueObj
        //   form.setValues({ [parentCode]: _.cloneDeep(tableValue) })
        // } else {
        //   //主表
        //   form.setValues(valueObj)
        // }
        console.log('form.values', form.values)

        // }
        if (data.data.dataList) {
          for (let index = 0; index < data.data.dataList.length; index++) {
            const formData = data.data.dataList[index]
            if (formData.formCode == 0) {
              //主表
              form.setValues({ ...formData.data[0] })
            } else {
              //浮动表
              // const subValue = form?.values?.[formData.formCode] || [] //当前子表数据
              // for (let i = 0; i < formData.data.length; i++) {
              //   //循环子表数据  防止覆盖已有数据
              //   const subData = formData.data[i]
              //   subValue[i] = {
              //     ...subValue?.[i],
              //     ...subData,
              //   }
              // }
              // form.setValues({ [formData.formCode]: subValue })
              form.setValues({ [formData.formCode]: formData.data })
            }
          }
        }
      }
    )
    // props?.onOk()
  }
  function onOk() {
    if (props?.preOnOK) {
      props.preOnOK(() => successOnOk(), mainRows)
    } else {
      successOnOk()
    }
    // props?.onOk()
  }

  function onCancel() {
    setPullDataModal(false)
  }

  function onSelectBiz(value, option) {
    if (crossFlag == 0 && (mainRows?.length != 0 || mainIds?.length != 0)) {
      //不跨应用选中且已有选中数据
      message.error('当前非跨应用选中,请取消数据选中后重新选择!')
      return
    }
    setState({
      dataDriveInfoId: value,
      isBase: Number(option.key.split('|')[1]),
    })
    getPullStyleFn(value) //获取拉取数据列表样式
    getPullDataListFn(
      value,
      1,
      pullDataCurrentSize,
      Number(option.key.split('|')[1]),
      searchWord
    )
  }

  //获取拉取数据
  function getPullDataListFn(
    dataDriveInfoId?: any,
    start?: any,
    limit?: any,
    isBase?: any,
    searchInfo?: any,
    year?: any
  ) {
    getPullDataList(
      {
        dataDriveInfoId,
        start,
        limit,
        isBase: Number(isBase),
        searchInfo,
        year:
          tableStyleInfo?.yearCutColumn && tableStyleInfo.yearCutFlag && year
            ? JSON.stringify({
                columnCode: tableStyleInfo?.yearCutColumn,
                value: year,
              })
            : '',
        option: props?.option || '',
      },
      (data) => {
        // const dicts = JSON.parse(localStorage.getItem('dictInfoName'))
        // data.data.list?.map((item, index) => {
        //   const keyArr = Object.keys(item)
        //   for (let i = 0; i < keyArr.length; i++) {
        //     if (keyArr[i].indexOf(mCode) > -1) {
        //       if (item[`${keyArr[i]}`].indexOf(',') > -1) {
        //         const arr = item[`${keyArr[i]}`].split(',')
        //         let str = ''
        //         for (let j = 0; j < arr.length; j++) {
        //           str += dicts[arr[j]] + ','
        //         }
        //         item[`${keyArr[i]}`] = str.substring(0, str.length - 1)
        //       } else {
        //         item[`${keyArr[i]}`] = dicts[item[`${keyArr[i]}`]]
        //       }
        //     }
        //   }
        // })
        setState({
          pullDataList: data.data.list,
          pullDatacurrentPage: data.data.currentPage,
          pullDataTotalCount: data.data.returnCount,
        })
      }
    )
  }

  function onChange(e) {
    setState({ searchWord: e.target.value })
  }

  function onSearch(value) {
    getPullDataListFn(
      dataDriveInfoId,
      1,
      pullDataCurrentSize,
      isBase,
      value,
      year
    )
  }

  function getList(list, tableStyleInfo) {
    let newList = []
    tableStyleInfo?.columnSort?.split(',')?.forEach((element) => {
      //根绝排序字段集合 整合列集合
      let column = _.find(list, (item) => {
        return item.columnCode == element
      })
      if (column) {
        newList.push(column)
      }
    })
    let fixedList = _.filter(newList, (item) => {
      return item.fixedFlag == 1
    })
    let unFixedList = _.filter(newList, (item) => {
      return !item.fixedFlag
    })
    newList = _.concat(fixedList, unFixedList)

    return newList
  }

  function getTotal(pageData, code) {
    let total = 0
    pageData.forEach((item) => {
      let re = /^[0-9]+.?[0-9]*/ //判断字符串是否为数字
      if (re.test(item[code])) {
        total += Number(item[code])
      }
    })
    return total
  }

  const onPressEnter = (e) => {
    e.stopPropagation()
    setState({ year: e.target.value })
    getPullDataListFn(
      dataDriveInfoId,
      1,
      pullDataCurrentSize,
      isBase,
      searchWord,
      e.target.value
    )
  }
  //改变年
  const changeYear = (value) => {
    if (value) {
      setState({ year: value })
      getPullDataListFn(
        dataDriveInfoId,
        1,
        pullDataCurrentSize,
        isBase,
        searchWord,
        value
      )
    } else {
      message.error('年度不允许清空')
    }
  }
  const paginationProps = {
    current: pullDatacurrentPage,
    refreshDataFn: () => {
      getPullDataListFn(
        dataDriveInfoId,
        pullDatacurrentPage,
        pullDataCurrentSize,
        isBase,
        searchWord,
        year
      )
    },
    isRefresh: true,
    pageSize: pullDataCurrentSize,
    total: pullDataTotalCount,
    onChange: (page, size) => {
      getPullDataListFn(dataDriveInfoId, page, size, isBase, searchWord, year)
      setState({
        pullDatacurrentPage: page,
        pullDataCurrentSize: size,
      })
    },
  }
  const tableProps = tableStyleInfo && {
    tableLayout: 'fixed',
    taskType: 'ALL',
    summary: (pageData) => {
      return (
        <>
          {tableStyleInfo.columnList &&
            tableStyleInfo.columnList.length != 0 &&
            _.filter(tableStyleInfo.columnList, (item) => {
              return item.sumFlag == 1
            }).length != 0 && (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <p style={{ textAlign: 'center' }}>合计</p>
                  </Table.Summary.Cell>
                  {getList(tableStyleInfo.columnList, tableStyleInfo).map(
                    (item, index) => {
                      return (
                        <Table.Summary.Cell key={index} index={index + 1}>
                          {item.sumFlag == 1
                            ? item.showStyle == 'MONEY'
                              ? renderHtml(
                                  item,
                                  getTotal(
                                    pageData,
                                    item.columnCode.toUpperCase()
                                  ),
                                  tableStyleInfo.newlineFlag,
                                  'alignStyle'
                                )
                              : getTotal(
                                  pageData,
                                  item.columnCode.toUpperCase()
                                )
                            : ''}
                        </Table.Summary.Cell>
                      )
                    }
                  )}
                </Table.Summary.Row>
              </>
            )}
        </>
      )
    },
    scroll: pullDataList?.length ? { y: 'calc(100% - 40px)', x: 'auto' } : {},
    bordered:
      tableStyleInfo.tableStyle && tableStyleInfo.tableStyle == 'TABLE'
        ? true
        : false,
    dataSource: pullDataList,
    columns:
      tableStyleInfo.columnList &&
      tableStyleInfo.columnList.length != 0 &&
      getList(tableStyleInfo.columnList, tableStyleInfo).map((item, index) => {
        return {
          title: item.columnName,
          dataIndex: item.columnCode.toUpperCase(),
          sorter:
            item.sortFlag && item.sortFlag == 1
              ? (a, b) =>
                  a[item.columnCode.toUpperCase()] -
                  b[item.columnCode.toUpperCase()]
              : false,
          align:
            item.alignStyle == 'MIDDLE'
              ? 'center'
              : item.alignStyle == 'RIGHT'
              ? 'right'
              : 'left',
          width: item.width
            ? `calc(${item.width}${item.sortFlag == 1 ? '+32px' : ''})`
            : 'auto',
          fixed: item.fixedFlag ? true : false,
          className: item.width ? '' : styles.is_overflow,
          render: (text) => (
            <>
              {renderHtml(item, text, tableStyleInfo.newlineFlag, 'alignStyle')}
            </>
          ),
        }
      }),
    rowKey: 'ID',
    locale: '暂无数据,请先选择拉取方案',
    rowSelection: {
      selectedRowKeys:
        isMultipleTree == 'checkbox'
          ? mainIds
          : mainIds?.length != 0
          ? [mainIds[mainIds.length - 1]]
          : [],
      type: 'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {},
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        let IDS = mainIds || []
        let ARRAY = mainRows || []
        if (!selected) {
          //取消选择
          IDS = IDS.filter((item) => {
            return item != record.ID
          })
          ARRAY = ARRAY.filter((item) => {
            return item && item.ID != record.ID
          })
        } else {
          IDS = IDS.concat(record.ID)
          record['DRIVEINFOID'] = dataDriveInfoId
          ARRAY = ARRAY.concat([record])
        }
        if (isMultipleTree == 'radio') {
          let IDSPOP = IDS.pop()
          let ARRAYPOP = ARRAY.pop()
          IDS = IDSPOP ? [IDSPOP] : []
          ARRAY = ARRAYPOP ? [ARRAYPOP] : []
        }
        setState({ mainIds: IDS, mainRows: ARRAY })
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        let IDS = mainIds || []
        let ARRAY = mainRows || []
        if (!selected) {
          changeRows.map((crs) => {
            IDS = IDS.filter((item) => {
              return item != crs.ID
            })
            ARRAY = ARRAY.filter((item) => {
              return item && item.ID != crs.ID
            })
          })

          //取消全选
        } else {
          //全选
          IDS = IDS.concat(
            changeRows.map((item, index) => {
              changeRows[index]['DRIVEINFOID'] = dataDriveInfoId
              return item?.ID
            })
          )
          ARRAY = ARRAY.concat(changeRows)
          // setState({
          //   mainIds: selectedRows.map((item,index) => {
          //     // selectedRows[index] = dataDriveInfoId
          //     return item?.ID
          //   }),
          //   mainRows: selectedRows,
          // })
        }
        if (isMultipleTree == 'radio') {
          IDS = [IDS.pop()]
          ARRAY = [ARRAY.pop()]
        }
        setState({ mainIds: IDS, mainRows: ARRAY })
      },
    },
    pagination: false,
  }
  return (
    <GlobalModal
      widthType={'2'}
      width={'95%'}
      open={true}
      title={'单据信息选择'}
      onCancel={onCancel.bind(this)}
      maskClosable={false}
      mask={false}
      onOk={onOk.bind(this)}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
    >
      <div style={{ position: 'relative', height: '100%' }}>
        <div className={styles.search}>
          <Input.Search
            className={styles.pull_input}
            value={searchWord}
            onChange={onChange.bind(this)}
            onSearch={onSearch.bind(this)}
            placeholder="请输入搜索词"
            allowClear
          />
          {tableStyleInfo.yearCutFlag == 1 && (
            <InputNumber
              className={styles.pull_input}
              min={1000}
              max={9999}
              value={year}
              defaultValue={year}
              onChange={changeYear}
              onStep={changeYear}
              onPressEnter={onPressEnter}
            />
          )}
          <Select
            className={styles.pullSearch}
            onChange={onSelectBiz.bind(this)}
            value={dataDriveInfoId}
            placeholder="请选择拉取方案"
          >
            {bizSolList.map((item) => (
              <Select.Option
                value={item.dataDriveInfoId}
                key={`${item.dataDriveInfoId}|${item.isBase}`}
              >
                {item.sourceBizSol}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ height: 'calc(100% - 88px)' }}>
          <ColumnDragTable {...tableProps} />
        </div>
        {tableStyleInfo.pageFlag == 1 ? (
          <IPagination {...paginationProps} />
        ) : (
          ''
        )}
      </div>
    </GlobalModal>
  )
}

export default Index
