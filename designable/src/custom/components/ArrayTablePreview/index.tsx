import { usePrefixCls } from '@/formily/antd/__builtins__'
import GlobalModal from '@/public/GlobalModal'
import { returnValue } from '@/utils/utils'
import {
  ArrayField,
  FieldDisplayTypes,
  GeneralField,
  onFieldInit,
  onFieldValidateEnd,
} from '@formily/core'
import { Schema } from '@formily/json-schema'
import {
  ReactFC,
  RecursionField,
  observer,
  useField,
  useFieldSchema,
  useForm,
} from '@formily/react'
import { isArr } from '@formily/shared'
import { Badge, Button, Popover, Select, Table, message } from 'antd'
import { PaginationProps } from 'antd/lib/pagination'
import { SelectProps } from 'antd/lib/select'
import { ColumnProps, TableProps } from 'antd/lib/table'
import cls from 'classnames'
import _ from 'lodash'
import React, {
  Fragment,
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { useModel } from 'umi'
import { v4 as uuidv4 } from 'uuid'
import ColumnDragTable from '../../../components/columnDragTable'
import { STATISTICAL } from '../../../service/constant'
import { ArrayBase, ArrayBaseMixins } from '../array-base'
import './index.less'
import styles from './index.less'
const width = document.documentElement.clientWidth
const height = document.documentElement.clientHeight
interface ObservableColumnSource {
  field: GeneralField
  columnProps: ColumnProps<any>
  schema: Schema
  display: FieldDisplayTypes
  name: string
  title: string
  type: string
  statistical: string
  isTotal: Boolean
  width: string
  columnName: string
  fieldProps: any
  groupName: string
  sort: Number
}
interface IArrayTablePaginationProps extends PaginationProps {
  dataSource?: any[]
  children?: (
    dataSource: any[],
    pagination: React.ReactNode
  ) => React.ReactElement
}

interface IStatusSelectProps extends SelectProps<any> {
  pageSize?: number
}

type ComposedArrayTable = React.FC<React.PropsWithChildren<TableProps<any>>> &
  ArrayBaseMixins & {
    Column?: React.FC<React.PropsWithChildren<ColumnProps<any>>>
  }

interface PaginationAction {
  totalPage?: number
  pageSize?: number
  changePage?: (page: number) => void
}

const SortableRow = SortableElement((props: any) => <tr {...props} />)
const SortableBody = SortableContainer((props: any) => <tbody {...props} />)

const isColumnComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Column') > -1
}

const isOperationsComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Operations') > -1
}

const isAdditionComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Addition') > -1
}

const isImportitionComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Importition') > -1
}

const isExportitionComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Exportition') > -1
}

const useArrayTableSources = () => {
  const arrayField = useField()
  const schema = useFieldSchema()
  const parseSources = (schema: Schema): ObservableColumnSource[] => {
    if (
      isColumnComponent(schema) ||
      isOperationsComponent(schema) ||
      isAdditionComponent(schema) ||
      isImportitionComponent(schema) ||
      isExportitionComponent(schema)
    ) {
      if (!schema['x-component-props']?.['dataIndex'] && !schema?.['name'])
        return []
      let name = schema['x-component-props']?.['name'] || schema?.['name']
      let title = schema['x-component-props']?.['title'] || schema?.['title']
      let type = schema['x-component']
      let statistical = schema['x-component-props']?.['statistical']
      let isTotal = schema['x-component-props']?.['isTotal']
      let width = schema['x-component-props']?.width
      let columnName = schema?.['columnName']
      let display = schema?.['display']
      let fieldProps = {}
      let groupName = schema?.['x-component-props']?.groupName
      let sort = schema?.['x-index']
      console.log('schema==', schema)

      schema.reduceProperties((buf, schema) => {
        display = schema?.['display']
        type = schema?.['x-component']
        name = schema?.['x-component-props']?.['name'] || schema?.['name']
        title =
          title && title != 'Title'
            ? title
            : schema?.['title'] || schema?.['x-component-props']?.['title']
        columnName = schema?.['columnName']

        if (type.includes('ArrayTable.Move')) {
          name = '操作'
          title = '操作'
        } else if (type.includes('ArrayTable.Index')) {
          name = '序号'
          title = '序号'
        } else if (type.includes('ArrayTable.SortHandle')) {
          name = '排序'
          title = '排序'
        }
        statistical = schema?.['x-component-props']?.['statistical']
        isTotal = schema?.['x-component-props']?.['isTotal']
        // width = schema['x-component-props']?.['style']?.width
        fieldProps = schema?.['x-component-props']
      }, [])

      const field = arrayField.query(arrayField.address.concat(name)).take()
      const columnProps =
        field?.component?.[1] || schema['x-component-props'] || {}

      return [
        {
          columnName,
          width,
          statistical,
          isTotal,
          type,
          title,
          name,
          display: display || 'visible',
          field,
          schema,
          columnProps,
          fieldProps,
          groupName,
          sort,
        },
      ]
    } else if (schema.properties) {
      return schema.reduceProperties((buf, schema) => {
        return buf.concat(parseSources(schema))
      }, [])
    }
  }

  const parseArrayItems = (schema: Schema['items']) => {
    if (!schema) return []
    const sources: ObservableColumnSource[] = []
    const items = isArr(schema) ? schema : [schema]
    return items.reduce((columns, schema) => {
      const item = parseSources(schema)
      if (item) {
        return columns.concat(item)
      }
      return columns
    }, sources)
  }

  if (!schema) throw new Error('can not found schema object')

  return parseArrayItems(schema.items)
}

const returnColSpan = (display, sources, key) => {
  let colSpan = 0
  if (
    sources?.[key]?.title == '操作' ||
    sources?.[key]?.title == '排序' ||
    sources?.[key]?.title == '序号'
  ) {
    colSpan = 1
  }
  if (display == 'visible') {
    console.log(
      'sources?.[key + 1]?.display',
      key,
      sources?.[key + 1]?.title,
      sources?.[key + 1]?.display
    )

    if (sources?.[key + 1]?.display == 'visible') {
      //下一列为显示状态 不合并单元格
      colSpan = 1
    } else {
      //下一列为不显示状态 合并单元格
      let array = _.slice(sources, key + 1, sources.length) //截取当前列以后列数据

      let firstVIndex = array.findIndex((item) => {
        return item.display != 'visible'
      }) //第一个隐藏列
      if (firstVIndex == -1) {
        //未找到隐藏列 不合并单元格
        colSpan = 1
      } else {
        let firstUVIndex = array.findIndex((item) => {
          return item.display == 'visible'
        }) //第一个显示列
        console.log('firstUVIndex', firstUVIndex, firstVIndex, array)

        if (firstUVIndex == -1) {
          //未找到显示列 其余都为隐藏
          colSpan = array.length + 1
        } else {
          //下一个显示列距上一个显示列的个数  + 自身列 = 需要合并的列数
          colSpan = firstUVIndex - firstVIndex + 1
        }
      }
    }
  }
  console.log('colSpancolSpan', colSpan, sources)

  return colSpan
}
function onSaveRecord(record, index, props, field) {
  if (field?.pattern !== 'editable' || props?.disabled) {
    return
  }
  field.setComponentProps({ isEditingIndex: -1 })
  // record.isEdit = 0
  if (props?.onSaveRecord) {
    props.onSaveRecord(record, index)
  }
}
function onEditRecord(record, index, props, field) {
  if (field?.pattern !== 'editable' || props?.disabled) {
    return
  }
  if (
    props.isEditingIndex &&
    props.isEditingIndex != -1 &&
    props.isEditingIndex != index
  ) {
    message.error('当前表中有其他行正在编辑，请先保存！')
    return
  }
  field.setComponentProps({ isEditingIndex: index })
}
//表头分组
const useArrayTableGroupColumns = (
  dataSource: any[],
  sources: ObservableColumnSource[],
  props
) => {
  console.log('sources==', sources)

  var bufArray = []
  var undefinedGroup = []
  // Object.keys(sources)?.map((key) => {
  //   if(key!='undefined'){
  //     bufArray.push({
  //       title: key,
  //       children: useArrayTableColumns(dataSource,sources[key])
  //     })
  //   }else{
  //     undefinedGroup = useArrayTableColumns(dataSource,sources[key])//未设置表头分组的列
  //   }
  // })
  // return [...bufArray,...undefinedGroup]

  Object.keys(sources)?.map((key) => {
    if (key && key != 'undefined') {
      let groupObj = {} //不连续的分组重新分组
      function loopGroup(array) {
        for (let index = 0; index < array.length; index++) {
          const element = array[index] //当前item
          const nextElement = array?.[index + 1] //下一个item
          let preArray = _.dropRight(array, array.length - index - 1) //包括当前item以前的所有item数组
          if (nextElement) {
            if (nextElement && nextElement?.sort != Number(element.sort) + 1) {
              //当前item与下一个不连续
              let sufArray = _.drop(array, index + 1) //当前item以后的所有item数组
              groupObj[`${key}_${element.sort}`] = preArray //将前半截数组放入一个分组
              loopGroup(sufArray)
              return
            }
          } else {
            groupObj[`${key}_${element.sort}`] = preArray //当前item已是最后一个将前半截数组放入一个分组
          }
        }
      }
      loopGroup(sources[key])
      Object.keys(groupObj)?.map((groupObjKey) => {
        bufArray.push({
          sort: groupObj[groupObjKey][0]?.sort,
          title: key,
          children: useArrayTableColumns(
            dataSource,
            groupObj[groupObjKey],
            props
          ),
        })
      })
    } else {
      undefinedGroup = [
        ...undefinedGroup,
        ...useArrayTableColumns(dataSource, sources[key], props),
      ] //未设置表头分组的列
    }
  })
  return _.orderBy([...bufArray, ...undefinedGroup], ['sort'], ['asc'])
}
const useDesignTableColumns = (designColumns, columns) => {
  if (!columns || !columns.length) {
    return []
  }
  for (let index = 0; index < designColumns.length; index++) {
    const column = designColumns[index]
    if (column?.children && column?.children.length) {
      column.children = useDesignTableColumns(column?.children, columns)
    } else {
      let columnObj = _.find(columns, { dataIndex: column.dataIndex })
      designColumns[index] = columnObj || column
    }
  }
  return designColumns || []
}
const useArrayTableColumns = (
  dataSource: any[],
  sources: ObservableColumnSource[],
  props: TableProps<any>
): TableProps<any>['columns'] => {
  console.log('useArrayTableColumns', dataSource, sources)
  return sources.reduce(
    (
      buf,
      {
        columnName,
        width,
        type,
        title,
        name,
        columnProps,
        schema,
        display,
        field,
        fieldProps,
        groupName,
        sort,
      },
      key
    ) => {
      const columnField = useField()
        .query(`${useField().props?.name}.*.${name}`)
        .take()
      const arrayField = useField()
      let columnWidth =
        title?.length * 15 + 32 < 150 ? '150px' : `${title?.length * 15 + 32}px`
      if (width) {
        columnWidth = width + 16
      }
      if (title == '序号') {
        columnWidth = '50px'
      }
      if (title == '排序') {
        columnWidth = '100px'
      }
      if (title == '操作') {
        columnWidth = props.isLargerData ? '80px' : '160px'
      }
      if (type == 'BasicData') {
        const column = document.querySelector(`td.ant-table-cell.${name}`) //基础数据码表所在td节点
        const childNode = column?.childNodes?.[0]
        const checkNode = childNode?.querySelector('div.ant-checkbox-group') //复选框节点
        const offsetWidth = checkNode?.offsetWidth
        columnWidth = checkNode ? offsetWidth : columnWidth
      }
      if (type == 'DatePicker') {
        if (columnField?.componentProps?.format == 'YYYY-MM-DD HH:mm') {
          columnWidth = '180px'
        } else if (
          columnField?.componentProps?.format == 'YYYY-MM-DD HH:mm:ss'
        ) {
          columnWidth = '200px'
        }
      }

      // if (display !== 'visible') return buf
      if (
        !isColumnComponent(schema) ||
        (window.location.href.includes('/mobile') && title == '操作')
      )
        return buf
      return buf.concat({
        ...columnProps,
        sort,
        key,
        dataIndex: name,
        title: title || columnName || name,
        isRequired: columnField?.required,
        // align: 'left',
        fixed:
          title == '操作'
            ? 'right'
            : title == '排序' || title == '序号'
            ? 'left'
            : false,
        //colSpan: returnColSpan(display, sources, key),
        width: columnWidth,
        //id:display=='visible'?`${field.parent.props.name}_${key}`:'',
        className:
          display == 'visible'
            ? type == 'BasicData'
              ? cls(name, 'basic_td')
              : title == '操作' || title == '排序' || title == '序号'
              ? cls('operation')
              : ''
            : cls(`${field?.parent?.props?.name}_hidden`),
        render: (value: any, record: any) => {
          const index = dataSource.indexOf(record)
          let children = <></>
          if (
            // !useFieldSchema()['x-component-props'].isLargerData ||
            props.isEditingIndex == index ||
            !props.isLargerData ||
            title == '操作' ||
            title == '排序' ||
            title == '序号'
          ) {
            children = (
              <>
                <ArrayBase.Item index={index} record={record}>
                  <RecursionField
                    schema={schema}
                    name={index}
                    onlyRenderProperties
                  />
                </ArrayBase.Item>
                {props.isLargerData &&
                  title == '操作' &&
                  props.isShowLineEdit &&
                  props.isEditingIndex != index && (
                    <a
                      disabled={
                        field?.pattern !== 'editable' || props?.disabled
                      }
                      onClick={onEditRecord.bind(
                        this,
                        record,
                        index,
                        props,
                        arrayField
                      )}
                      className={styles.operation_a}
                    >
                      编辑
                    </a>
                  )}
                {props.isLargerData &&
                  title == '操作' &&
                  props.isShowLineEdit &&
                  props.isEditingIndex == index && (
                    <a
                      disabled={
                        field?.pattern !== 'editable' || props?.disabled
                      }
                      onClick={onSaveRecord.bind(
                        this,
                        record,
                        index,
                        props,
                        arrayField
                      )}
                      className={styles.operation_a}
                    >
                      保存
                    </a>
                  )}
              </>
            )
          } else {
            const columnObj = {
              name: name,
              title: title,
              columnType: type,
              codeTable: fieldProps?.['codeTable'],
              showModel: fieldProps?.['showModel'], //select
              selectModal: fieldProps?.['selectModal'], //checkbox
              format: fieldProps?.['format'], //checkbox
            }
            let dictsList = JSON.parse(
              window.sessionStorage.getItem('dictsList')
            )
            if (location?.pathname?.includes('formDesigner')) {
              dictsList = useModel('designable')['dictsList']
            }
            const value = returnValue(
              columnObj,
              record[name],
              record,
              false,
              dictsList,
              fieldProps
            )
            children = (
              <div className={styles.td_text} title={value}>
                {value}
              </div>
            )
          }
          const obj = {
            children: children,
            props: {},
          }
          //obj['props']['colSpan'] = returnColSpan(display, sources, key)
          //obj['props']['className'] = display == 'visible'?'':'tabel_hidden'
          return obj
        },
      })
    },
    []
  )
}

const useAddition = () => {
  const schema = useFieldSchema()
  return schema.reduceProperties((addition, schema, key) => {
    if (isAdditionComponent(schema)) {
      return <RecursionField schema={schema} name={key} />
    }
    return addition
  }, null)
}

const useImportition = () => {
  const schema = useFieldSchema()
  return schema.reduceProperties((addition, schema, key) => {
    if (isImportitionComponent(schema)) {
      return <RecursionField schema={schema} name={key} />
    }
    return addition
  }, null)
}

const useExportition = () => {
  const schema = useFieldSchema()
  return schema.reduceProperties((addition, schema, key) => {
    if (isExportitionComponent(schema)) {
      return <RecursionField schema={schema} name={key} />
    }
    return addition
  }, null)
}

const schedulerRequest = {
  request: null,
}

const StatusSelect: ReactFC<IStatusSelectProps> = observer(
  (props) => {
    const field = useField<ArrayField>()
    const prefixCls = usePrefixCls('formily-array-table')
    const errors = field.errors
    const parseIndex = (address: string) => {
      return Number(
        address
          .slice(address.indexOf(field.address.toString()) + 1)
          .match(/(\d+)/)?.[1]
      )
    }
    const options = props.options?.map(({ label, value }) => {
      const val = Number(value)
      const hasError = errors.some(({ address }) => {
        const currentIndex = parseIndex(address)
        const startIndex = (val - 1) * props.pageSize
        const endIndex = val * props.pageSize
        return currentIndex >= startIndex && currentIndex <= endIndex
      })
      return {
        label: hasError ? <Badge dot>{label}</Badge> : label,
        value,
      }
    })

    const width = String(options?.length).length * 15

    return (
      <Select
        value={props.value}
        onChange={props.onChange}
        options={options}
        virtual
        style={{
          width: width < 60 ? 60 : width,
        }}
        className={cls(`${prefixCls}-status-select`, {
          'has-error': errors?.length,
        })}
      />
    )
  },
  {
    scheduler: (update) => {
      clearTimeout(schedulerRequest.request)
      schedulerRequest.request = setTimeout(() => {
        update()
      }, 100)
    },
  }
)

const PaginationContext = createContext<PaginationAction>({})
const usePagination = () => {
  return useContext(PaginationContext)
}

const RowComp = (props: any) => {
  return <SortableRow index={props['data-row-key'] || 0} {...props} />
}

export const ArrayTablePreview: ComposedArrayTable = memo(
  observer((props: TableProps<any>) => {
    // const { setState } = useModel('array-table')
    // const { getBizFormData } = useModel('preview')
    console.log('useArrayTableSources2')

    const ref = useRef<HTMLDivElement>()
    const field = useField<ArrayField>()
    const prefixCls = usePrefixCls('formily-array-table')
    const sources = useArrayTableSources()
    // const pagination = isBool(props.pagination) ? {} : props.pagination
    const addition = useAddition()
    const importition = useImportition()
    const exportition = useExportition()
    const schema = useFieldSchema()
    const form = useForm()
    const dataSource = Array.isArray(field.value) ? field.value.slice() : []

    // const columns = useArrayTableColumns(dataSource, sources)
    // const [subSum, setSubSum] = useState(0)
    const [isLandscape, setIsLandscape] = useState(false)
    const [tableId, setTableId] = useState(uuidv4())
    // const [height, setHeight] = useState(
    //   document?.getElementById('formShow_container')?.offsetHeight - 87
    // )
    // const { location, cutomHeaders, bizInfo } = useModel(
    //   '@@qiankunStateFromMaster'
    // )
    const defaultRowKey = (record: any) => {
      return dataSource.indexOf(record)
    }
    // useEffect(()=>{
    //   if(columns?.length!=0&&!field.props.columns){
    //     field.setComponentProps({columns})
    //   }
    // },[columns])

    useEffect(() => {
      if ((props?.isModal && props?.isVisible) || !props?.isModal) {
        if (document.getElementById(`${tableId}_${field.props.name}`)) {
          let observer = new MutationObserver(domCallback)
          let observerOptions = {
            childList: true, // 观察目标子节点的变化，添加或者删除
            attributes: true, // 观察属性变动
            subtree: true, // 默认为 false，设置为 true 可以观察后代节点
          }
          observer.observe(
            document.getElementById(`${tableId}_${field.props.name}`),
            observerOptions
          )
        }
      }

      // window.addEventListener('keydown', onKeyDown) // 添加全局事件
      // return () => {
      //   window.removeEventListener('keydown', onKeyDown) // 销毁
      // }
    }, [props?.isVisible, props?.isModal, isLandscape])
    //显示隐藏
    const domCallback = (mutationList, observer) => {
      if (
        document
          .getElementById(`${tableId}_${field.props.name}`)
          ?.getElementsByTagName('colgroup')?.[0]
          ?.getElementsByTagName('col')?.length &&
        document
          .getElementById(`${tableId}_${field.props.name}`)
          .querySelectorAll(`.${field.props.name}_hidden`)
      ) {
        console.log(
          'aaa===',
          document
            .getElementById(`${tableId}_${field.props.name}`)
            .querySelectorAll(`.${field.props.name}_hidden`)
        )
        for (
          let i = 0;
          i <
          document
            .getElementById(`${tableId}_${field.props.name}`)
            .querySelectorAll(`.${field.props.name}_hidden`).length;
          i++
        ) {
          let cellIndex = document
            .getElementById(`${tableId}_${field.props.name}`)
            .querySelectorAll(`.${field.props.name}_hidden`)[i]?.cellIndex
          if (cellIndex >= 0) {
            if (
              // props.rowSelection &&
              document
                .getElementById(`${tableId}_${field.props.name}`)
                ?.getElementsByTagName('colgroup')?.[0]
                ?.getElementsByTagName('col')?.length > 1
            ) {
              //有复选框时会默认有一列col 当列数据还没加载到时配置宽度会出错
              if (
                document
                  .getElementById(`${tableId}_${field.props.name}`)
                  ?.getElementsByTagName('colgroup')?.[0]
                  ?.getElementsByTagName('col')?.[cellIndex]
              ) {
                document
                  .getElementById(`${tableId}_${field.props.name}`)
                  .getElementsByTagName('colgroup')[0]
                  .getElementsByTagName('col')[cellIndex].style.width = '0px'
              }
              if (
                document
                  .getElementById(`${tableId}_${field.props.name}`)
                  ?.getElementsByTagName('colgroup')?.[1]
                  ?.getElementsByTagName('col')?.[cellIndex]
              ) {
                document
                  .getElementById(`${tableId}_${field.props.name}`)
                  .getElementsByTagName('colgroup')[1]
                  .getElementsByTagName('col')[cellIndex].style.width = '0px'
              }
            }
            if (
              document
                .getElementById(`${tableId}_${field.props.name}`)
                ?.getElementsByTagName('thead')?.[0]
                ?.getElementsByTagName('tr')?.[0]
                ?.getElementsByTagName('th')
                ?.[cellIndex]?.getElementsByTagName('p')[0]
            ) {
              document
                .getElementById(`${tableId}_${field.props.name}`)
                .getElementsByTagName('thead')[0]
                .getElementsByTagName('tr')[0]
                .getElementsByTagName('th')
                [cellIndex].getElementsByTagName('p')[0].style.display = 'none'
            }
          }
        }
      }
    }
    form.addEffects(`sub_table_${field.props.name}`, () => {
      // onFormValuesChange((form) => {
      //   if (
      //     JSON.stringify(field?.componentProps?.valuesKey) !=
      //     JSON.stringify(form.values?.[field.props.name])
      //   ) {
      //     field.setComponentProps({
      //       valuesKey: form.values?.[field.props.name],
      //     })
      //   }
      // })
      onFieldValidateEnd(field.props.name, (field, form) => {
        field.setComponentProps({ isShowError: true })
      })
      onFieldInit(field.props.name, (field, form) => {
        // if(field.componentProps.columns){
        //   return
        // }
        // const columns = useArrayTableColumns(dataSource, sources)
        // field.setComponentProps({columns})
        field.setComponentProps({ isShowError: true }) //默认展示错误提示
      })
      // onFieldMount(field.props.name,(field,form)=>{
      //   console.log('field.valuefield.value',field.value,form.values);

      //   if (form.values?.[field.props.name]?.length&&location.query.bizInfoId) {
      //     getBizFormData(
      //       {
      //         //获取数据
      //         id: cutomHeaders?.mainTableId || '0',
      //         bizInfoId: location.query.bizInfoId,
      //         formCode: field.props.name,
      //         bizSolId: bizInfo.bizSolId,
      //       },
      //       (data) => {
      //         field.setValue(data?.data)
      //       }
      //     )
      // }
      // })
    })
    const addTdStyles = (node: HTMLElement) => {
      const helper = document.body.querySelector(`.${prefixCls}-sort-helper`)
      if (helper) {
        const tds = node.querySelectorAll('td')
        requestAnimationFrame(() => {
          helper.querySelectorAll('td').forEach((td, index) => {
            if (tds[index]) {
              td.style.width = getComputedStyle(tds[index]).width
            }
          })
        })
      }
    }
    const WrapperComp = useCallback(
      (props: any) => (
        <SortableBody
          useDragHandle
          lockAxis="y"
          helperClass={`${prefixCls}-sort-helper`}
          helperContainer={() => {
            return ref.current?.querySelector('tbody')
          }}
          onSortStart={({ node }) => {
            addTdStyles(node as HTMLElement)
          }}
          onSortEnd={({ oldIndex, newIndex }) => {
            field.move(oldIndex, newIndex)
          }}
          {...props}
        />
      ),
      []
    )

    const renderButton = () => {
      return props?.headerButtons?.map((item: any) => {
        return (
          <Button
            disabled={field?.pattern !== 'editable' || props?.disabled}
            style={{ marginRight: 10 }}
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
      })
    }

    // const ArrayColumnTable = memo(
    //   (props) => {
    //     const flag = sources.findIndex((item) => {
    //       return (
    //         item.type == 'NumberPicker' &&
    //         item.statistical &&
    //         (item.isTotal || item.isTotal == undefined)
    //       )
    //     })
    //     return (
    //       <>
    //         <ColumnDragTable
    //           tableLayout={'fixed'}
    //           taskType={'MONITOR'}
    //           className={styles.sub_table}
    //           bordered
    //           rowKey={defaultRowKey}
    //           {...props}
    //           onChange={() => {}}
    //           pagination={false}
    //           columns={useArrayTableColumns(dataSource, sources)}
    //           dataSource={dataSource}
    //           components={{
    //             body: {
    //               wrapper: WrapperComp,
    //               row: RowComp,
    //             },
    //           }}
    //           id={`${field.props.name}`}
    //           scroll={{ y: 'calc(100% - 100px)' }}
    //           summary={(pageData) => {
    //             // const flag = sources.findIndex(
    //             //   (item) => item.type == 'NumberPicker' && item.statistical
    //             // )
    //             let sum = 0
    //             const statisticsFn = (statistical, title, isTotal) => {
    //               const data = pageData.map((item) => {
    //                 if (item[title]) {
    //                   return Number(item[title])
    //                 } else {
    //                   return 0
    //                 }
    //               })
    //               if (data.length == 0) {
    //                 return
    //               }
    //               let statotal = 0
    //               switch (
    //                 statistical //计算值
    //               ) {
    //                 case 'sum':
    //                   statotal = _.sum(data)
    //                   break
    //                 case 'avg':
    //                   statotal = _.divide(_.sum(data), pageData.length)
    //                   break
    //                 case 'max':
    //                   statotal = _.max(data)
    //                   break
    //                 case 'min':
    //                   statotal = _.min(data)
    //                   break
    //                 case 'count':
    //                   statotal = pageData.length
    //                   break
    //                 default:
    //                   statotal = _.sum(data)
    //                   break
    //               }
    //               if (isTotal || isTotal == undefined) {
    //                 //是否计入合计，默认计入
    //                 sum = sum + statotal
    //                 field.setComponentProps({
    //                   subSum: sum,
    //                 })
    //                 // setSubSum(sum)
    //               }
    //               return `${
    //                 statistical ? STATISTICAL[statistical] : '合计'
    //               }: ${statotal?.toFixed(2)}`
    //             }
    //             const flag = sources.findIndex((item) => {
    //               return item.type == 'NumberPicker' && item.statistical
    //             })
    //             if (flag == -1 || pageData.length == 0) {
    //               return
    //             }
    //             const returnClassName = (index) => {
    //               if (props?.rowSelection?.selectedRowKeys) {
    //                 if (index == 0) {
    //                   return cls(
    //                     styles.second_td,
    //                     'ant-table-cell-fix-left-last'
    //                   )
    //                 } else if (index == 1) {
    //                   return cls(styles.third_td)
    //                 } else if (index == sources.length - 1) {
    //                   return cls(
    //                     'ant-table-cell-fix-right',
    //                     'ant-table-cell-fix-right-first',
    //                     styles.last_td
    //                   )
    //                 } else {
    //                   return ''
    //                 }
    //               } else {
    //                 if (index == sources.length - 1) {
    //                   return cls(
    //                     'ant-table-cell-fix-right',
    //                     'ant-table-cell-fix-right-first',
    //                     styles.last_td
    //                   )
    //                 } else {
    //                   return ''
    //                 }
    //               }
    //             }
    //             return (
    //               <>
    //                 <Table.Summary.Row key={pageData.length + 1}>
    //                   {props?.rowSelection?.selectedRowKeys && (
    //                     <Table.Summary.Cell
    //                       className={cls(
    //                         'ant-table-cell-fix-left',
    //                         styles.first_td
    //                       )}
    //                       index={-1}
    //                       key={-1}
    //                       colSpan={1}
    //                     />
    //                   )}

    //                   {sources.map((node, index) => {
    //                     return (
    //                       <Table.Summary.Cell
    //                         index={index}
    //                         key={index}
    //                         className={returnClassName(index)}
    //                         // colSpan={returnColSpan(node.display, sources, index)}
    //                       >
    //                         {node.type == 'NumberPicker' && node.statistical
    //                           ? statisticsFn(
    //                               node.statistical,
    //                               node.name,
    //                               node.isTotal
    //                             )
    //                           : ''}
    //                       </Table.Summary.Cell>
    //                     )
    //                   })}
    //                 </Table.Summary.Row>
    //                 {/* <Table.Summary.Row key={pageData.length + 2}>
    //               <Table.Summary.Cell
    //                 className={cls('ant-table-cell-fix-right', 'ant-table-cell-fix-right-first',styles.last_td)}
    //                 key={sources.length}
    //                 index={sources.length}
    //                 colSpan={
    //                   props?.rowSelection?.selectedRowKeys
    //                     ? sources.length + 1
    //                     : sources.length
    //                 }
    //                 align={'right'}
    //               >
    //                 {`总计：${sum}`}
    //               </Table.Summary.Cell>
    //             </Table.Summary.Row> */}
    //               </>
    //             )
    //           }}
    //           footer={
    //             flag == -1
    //               ? undefined
    //               : (pageData) => {
    //                   let subSum = field?.componentProps?.subSum
    //                   if (flag == -1 || pageData.length == 0) {
    //                     return null
    //                   }
    //                   return (
    //                     <div
    //                       className={styles.footer}
    //                     >{`总计：${subSum?.toFixed(2)}`}</div>
    //                   )
    //                 }
    //           }
    //         />
    //         {sources.map((column, key) => {
    //           //专门用来承接对Column的状态管理
    //           if (!isColumnComponent(column.schema)) return
    //           return React.createElement(RecursionField, {
    //             name: column.name,
    //             schema: column.schema,
    //             onlyRenderSelf: true,
    //             key,
    //           })
    //         })}
    //       </>
    //     )
    //   },
    //   (prevProps, nextProps) => {
    //     console.log(
    //       'ArrayColumnTableprops',
    //       prevProps.sources,
    //       nextProps.sources
    //     )

    //     if (
    //       JSON.stringify(prevProps.sources) == JSON.stringify(nextProps.sources)
    //     ) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   }
    // )
    const flag = sources.findIndex((item) => {
      return (
        item.type == 'NumberPicker' &&
        item.statistical &&
        (item.isTotal || item.isTotal == undefined)
      )
    })
    const ArrayBaseTable = (
      <ArrayBase>
        {importition}
        {exportition}
        {renderButton()}
        <ColumnDragTable
          tableLayout={'fixed'}
          taskType={'ALL'}
          className={styles.sub_table}
          bordered
          rowKey={'ID'}
          {...props}
          onChange={() => {}}
          pagination={props.isLargerData ? {} : false}
          // columns={useArrayTableColumns(dataSource, sources, props)}
          columns={
            props?.designColumns
              ? useDesignTableColumns(
                  props?.designColumns,
                  useArrayTableColumns(dataSource, sources, props)
                )
              : useArrayTableGroupColumns(
                  dataSource,
                  _.groupBy(sources, 'groupName'),
                  props
                )
          }
          dataSource={dataSource}
          components={{
            body: {
              wrapper: WrapperComp,
              row: RowComp,
            },
          }}
          id={`${tableId}_${field.props.name}`}
          scroll={{ y: 'calc(100% - 100px)' }}
          summary={(pageData) => {
            // const flag = sources.findIndex(
            //   (item) => item.type == 'NumberPicker' && item.statistical
            // )
            let sum = 0
            const statisticsFn = (statistical, title, isTotal) => {
              const data = dataSource.map((item) => {
                if (item[title]) {
                  return Number(item[title])
                } else {
                  return 0
                }
              })
              if (data.length == 0) {
                return
              }
              let statotal = 0
              switch (
                statistical //计算值
              ) {
                case 'sum':
                  statotal = _.sum(data)
                  break
                case 'avg':
                  statotal = _.divide(_.sum(data), pageData.length)
                  break
                case 'max':
                  statotal = _.max(data)
                  break
                case 'min':
                  statotal = _.min(data)
                  break
                case 'count':
                  statotal = pageData.length
                  break
                default:
                  statotal = _.sum(data)
                  break
              }
              if (isTotal || isTotal == undefined) {
                //是否计入合计，默认计入
                sum = sum + statotal
                // field.setComponentProps({
                //   subSum: sum,
                // })
                if (document.getElementById(`${tableId}_${field.props.name}`)) {
                  document
                    .getElementById(`${tableId}_${field.props.name}`)
                    .setAttribute('sum', sum)
                }
              }
              return (
                <div
                  id={`${targetKey}_${field.props.name}_${title}`}
                  total={
                    statistical == 'sum' || !statistical
                      ? statotal?.toFixed(2)
                      : ''
                  }
                  avg={statistical == 'avg' ? statotal?.toFixed(2) : ''}
                >{`${
                  statistical ? STATISTICAL[statistical] : '合计'
                }: ${statotal?.toFixed(2)}`}</div>
              )
            }
            const flag = sources.findIndex((item) => {
              return item.type == 'NumberPicker' && item.statistical
            })
            if (flag == -1 || pageData.length == 0) {
              return
            }
            const returnClassName = (index) => {
              if (props?.rowSelection?.selectedRowKeys) {
                if (index == 0) {
                  return cls(styles.second_td, 'ant-table-cell-fix-left-last')
                } else if (index == 1) {
                  return cls(styles.third_td)
                } else if (index == sources.length - 1) {
                  return cls(
                    'ant-table-cell-fix-right',
                    'ant-table-cell-fix-right-first',
                    styles.last_td
                  )
                } else {
                  return ''
                }
              } else {
                if (index == sources.length - 1) {
                  return cls(
                    'ant-table-cell-fix-right',
                    'ant-table-cell-fix-right-first',
                    styles.last_td
                  )
                } else {
                  return ''
                }
              }
            }
            return (
              <>
                <Table.Summary.Row key={pageData.length + 1}>
                  {props?.rowSelection?.selectedRowKeys && (
                    <Table.Summary.Cell
                      className={cls(
                        'ant-table-cell-fix-left',
                        styles.first_td
                      )}
                      index={-1}
                      key={-1}
                      colSpan={1}
                    />
                  )}

                  {sources.map((node, index) => {
                    return (
                      <Table.Summary.Cell
                        index={index}
                        key={index}
                        className={returnClassName(index)}
                        // colSpan={returnColSpan(node.display, sources, index)}
                      >
                        {node.type == 'NumberPicker' && node.statistical
                          ? statisticsFn(
                              node.statistical,
                              node.name,
                              node.isTotal
                            )
                          : ''}
                      </Table.Summary.Cell>
                    )
                  })}
                </Table.Summary.Row>
                {/* <Table.Summary.Row key={pageData.length + 2}>
                <Table.Summary.Cell
                  className={cls('ant-table-cell-fix-right', 'ant-table-cell-fix-right-first',styles.last_td)}
                  key={sources.length}
                  index={sources.length}
                  colSpan={
                    props?.rowSelection?.selectedRowKeys
                      ? sources.length + 1
                      : sources.length
                  }
                  align={'right'}
                >
                  {`总计：${sum}`}
                </Table.Summary.Cell>
              </Table.Summary.Row> */}
              </>
            )
          }}
          footer={
            flag == -1
              ? undefined
              : (pageData) => {
                  // let subSum = field?.componentProps?.subSum
                  let subSum =
                    document
                      .getElementById(`${tableId}_${field.props.name}`)
                      ?.getAttribute('sum') || 0
                  if (flag == -1 || pageData.length == 0) {
                    return null
                  }
                  return (
                    <div className={styles.footer}>{`总计：${Number(
                      subSum
                    )?.toFixed(2)}`}</div>
                  )
                }
          }
        />
        {sources.map((column, key) => {
          //专门用来承接对Column的状态管理
          if (!isColumnComponent(column.schema)) return
          return React.createElement(RecursionField, {
            name: column.name,
            schema: column.schema,
            onlyRenderSelf: true,
            key,
          })
        })}
        {/* <ArrayColumnTable sources={sources} dataSource={dataSource} /> */}
        {addition}
      </ArrayBase>
    )
    function onError() {
      field.setComponentProps({ isShowError: false })
    }
    const ArrayBsePreview = (
      <div ref={ref} className={prefixCls}>
        {/* {field?.errors?.length != 0 && props.isShowError ? ( */}
        {
          // field?.errors?.length != 0 ? (
          <Popover
            autoAdjustOverflow
            placement="topRight"
            overlayClassName={cls({
              [`popover-help`]: true,
              [styles.error_visible]: !(
                field?.errors?.length != 0 && props.isShowError
              ),
            })}
            content={
              <div
                className={cls({
                  [`ant-formily-item-error-help`]: true,
                  [`ant-formily-item-help`]: true,
                })}
                onClick={onError.bind(this)}
              >
                {/* {field.errors[0].messages[0]} */}
                {`*该表中${field.errors.length}个字段校验失败，请仔细查看`}
              </div>
            }
            open={true}
            getPopupContainer={() => ref.current}
          >
            {ArrayBaseTable}
          </Popover>
          // ) : (
          //   ArrayBaseTable
          // )
        }
      </div>
    )

    // const state = $observable({
    //   selectedRowKeys: []//已选中的key
    // })
    // $props({
    //     rowKey: 'UID',//默认为key值，可自定义keyCODE
    //     rowSelection:{
    //       selectedRowKeys: state.selectedRowKeys,
    //       type: 'checkbox',//radio单选  checkbox多选
    //       onChange: (selectedRowKeys, selectedRows) => {
    //         state.selectedRowKeys = selectedRowKeys
    //       },
    //       onSelectAll: (selected, selectedRows, changeRows) => {
    //         // if (!selected) {
    //         //   //取消全选
    //         //   state.selectedRowKeys = []
    //         //   state.selectedRows = []
    //         // } else {
    //         //   //全选
    //         //   state.selectedRowKeys = selectedRows.map((item) => {
    //         //       return item?.ID
    //         //   })
    //         //   state.selectedRows = selectedRows
    //         // }
    //       },
    //       onSelect: (record, selected, selectedRows, nativeEvent) => {
    //         if (!selected) {
    //           //取消选择
    //         } else {
    //         }
    //       },
    //     },
    //     onOk(){
    //       $self.query('SUB').take((field)=>{
    //         field.setComponentProps({
    //           isVisible: false
    //         })
    //       })
    //       $self.setComponentProps({//弹窗关闭
    //         isVisible: false
    //       })
    //     }
    // })
    // $props({
    //   onClick(){//绑定在具体某个控件不在子表配置
    //     $self.query('SUB').take((field)=>{//打开弹窗  SUB为自定义子表CODE
    //       field.setComponentProps({
    //         isVisible: true
    //       })
    //     })
    //   }
    // })
    const { targetKey } = useModel('@@qiankunStateFromMaster')
    if (props?.isModal) {
      if (!props?.isVisible) {
        return <div style={{ display: 'none' }}>{ArrayBsePreview}</div>
      }
      return (
        <GlobalModal
          widthType={'3'}
          open={props?.isVisible}
          title={props?.modalTitle}
          maskClosable={false}
          mask={false}
          getContainer={() => {
            return (
              document.getElementById(`formShow_container_${targetKey}`) ||
              document.getElementById(`formShow_container`)
            )
          }}
          onCancel={() => {
            field.setComponentProps({
              isVisible: false,
            })
          }}
          footer={
            props.editable || !props.disabled
              ? [
                  <Button
                    onClick={() => {
                      field.setComponentProps({
                        isVisible: false,
                      })
                    }}
                  >
                    取消
                  </Button>,
                  <Button type="primary" onClick={props?.onOk}>
                    确认
                  </Button>,
                ]
              : [
                  <Button
                    onClick={() => {
                      field.setComponentProps({
                        isVisible: false,
                      })
                    }}
                  >
                    取消
                  </Button>,
                ]
          }
        >
          <div
            id={`array_table_modal_${targetKey}`}
            style={{ width: '100%', height: '100%' }}
          >
            {ArrayBsePreview}
          </div>
        </GlobalModal>
      )
    }
    if (window.location.href.includes('mobile')) {
      if (isLandscape) {
        return (
          <GlobalModal
            widthType={'3'}
            open={true}
            title={'预览'}
            maskClosable={false}
            mask={false}
            getContainer={() => {
              return document.getElementById(`formShow_container_${targetKey}`)
            }}
            bodyStyle={{ padding: 5 }}
            className={'mobile_modal'}
            footer={false}
            onCancel={() => {
              setIsLandscape(false)
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
              document.documentElement.style.transform = 'unset'
              document.documentElement.style.width = `${width}px`
              document.documentElement.style.overflow = 'unset'
              document.documentElement.style.position = 'unset'
              document.getElementById(
                `formShow_container_${targetKey}`
              ).style.position = 'relative'
            }}
          >
            {ArrayBsePreview}
          </GlobalModal>
        )
      }
      return (
        <div>
          <a
            onClick={() => {
              // if (dd.env.platform !== 'notInDingTalk') {
              //   dd.ready(function () {
              //     dd.device.screen.rotateView({
              //       showStatusBar: true, // 否显示statusbar
              //       clockwise: true, // 是否顺时针方向
              //       onSuccess: function (result) {},
              //       onFail: function (err) {},
              //     })
              //   })
              // }
              setIsLandscape(true)
              document.documentElement.style.transform = 'rotate(90deg)'
              document.documentElement.style.width = `${height}px`
              document.documentElement.style.overflow = `hidden`
              document.documentElement.style.position = `relative`
              document.getElementById(
                `formShow_container_${targetKey}`
              ).style.position = 'static' //IOS safari浏览器中出现的z-index不生效的层级问题
            }}
            className={styles.landSecreen}
          >
            横屏展示
          </a>
          {ArrayBsePreview}
        </div>
      )
    }

    return ArrayBsePreview
  }),
  (prevProps, nextProps) => {
    console.log('ArrayTablePreviewProps', prevProps, nextProps)
    if (JSON.stringify(prevProps) == JSON.stringify(nextProps)) {
      return true
    } else {
      return false
    }
  }
)

ArrayTablePreview.displayName = 'ArrayTable'

ArrayTablePreview.Column = () => {
  return <Fragment />
}

ArrayBase.mixin(ArrayTablePreview)

const Addition: ArrayBaseMixins['Addition'] = (props) => {
  const array = ArrayBase.useArray()
  // const { totalPage = 0, pageSize = 10, changePage } = usePagination()
  return (
    <ArrayBase.Addition
      {...props}
      onClick={(e) => {
        // 如果添加数据后将超过当前页，则自动切换到下一页
        // const total = array?.field?.value.length || 0
        // if (total === totalPage * pageSize + 1 && isFn(changePage)) {
        //   changePage(totalPage + 1)
        // }
        props.onClick?.(e)
      }}
    />
  )
}

const Importition: ArrayBaseMixins['Importition'] = (props) => {
  const array = ArrayBase.useArray()
  const form = useForm()
  const schema = useFieldSchema()
  const formCode = array?.schema?.name //子表code
  return <ArrayBase.Importition {...props} onClick={(data) => {}} />
}

ArrayTablePreview.Addition = Addition
ArrayTablePreview.Importition = Importition
export default ArrayTablePreview
