import MyIcon from '@/Icon'
import { useWorkbench } from '@/designable/react'
import { usePrefixCls } from '@/formily/antd/__builtins__'
import {
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  MenuOutlined,
  PlusOutlined,
  UpOutlined,
} from '@ant-design/icons'
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon'
import { ArrayField } from '@formily/core'
import {
  ExpressionScope,
  JSXComponent,
  Schema,
  useField,
  useFieldSchema,
} from '@formily/react'
import { clone, isValid } from '@formily/shared'
import { Button, Dropdown, Menu, MenuProps, message } from 'antd'
import { ButtonProps } from 'antd/lib/button'
import cls from 'classnames'
import _ from 'lodash'
import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useState,
} from 'react'
import { SortableHandle } from 'react-sortable-hoc'
import { useModel } from 'umi'
import { read, utils, writeFileXLSX } from 'xlsx'
import Upload from '../../../components/upload/index'
import { DELETE_CODE_LIST } from '../../../service/constant'
import { returnValue } from '../../../utils/utils'
import styles from './style.less'

export interface IArrayBaseAdditionProps extends ButtonProps {
  title?: string
  method?: 'push' | 'unshift'
  defaultValue?: any
}
export interface IArrayBaseImportitionProps extends ButtonProps {
  title?: string
}
export interface IArrayBaseContext {
  props: IArrayBaseProps
  field: ArrayField
  schema: Schema
}

export interface IArrayBaseItemProps {
  index: number
  record: any
}

export type ArrayBaseMixins = {
  Importition?: React.FC<React.PropsWithChildren<IArrayBaseImportitionProps>>
  Addition?: React.FC<React.PropsWithChildren<IArrayBaseAdditionProps>>
  Remove?: React.FC<React.PropsWithChildren<AntdIconProps & { index?: number }>>
  Copy?: React.FC<React.PropsWithChildren<AntdIconProps & { index?: number }>>
  MoveUp?: React.FC<React.PropsWithChildren<AntdIconProps & { index?: number }>>
  MoveDown?: React.FC<
    React.PropsWithChildren<AntdIconProps & { index?: number }>
  >
  SortHandle?: React.FC<
    React.PropsWithChildren<AntdIconProps & { index?: number }>
  >
  Index?: React.FC
  useArray?: () => IArrayBaseContext
  useIndex?: (index?: number) => number
  useRecord?: (record?: number) => any
  Edit?: React.FC<React.PropsWithChildren<AntdIconProps & { index?: number }>>
  View?: React.FC<React.PropsWithChildren<AntdIconProps & { index?: number }>>
}

export interface IArrayBaseProps {
  disabled?: boolean
  onAdd?: (index: number) => void
  onRemove?: (index: number) => void
  onCopy?: (index: number) => void
  onMoveDown?: (index: number) => void
  onMoveUp?: (index: number) => void
}

type ComposedArrayBase = React.FC<React.PropsWithChildren<IArrayBaseProps>> &
  ArrayBaseMixins & {
    Item?: React.FC<React.PropsWithChildren<IArrayBaseItemProps>>
    mixin?: <T extends JSXComponent>(target: T) => T & ArrayBaseMixins
  }

const ArrayBaseContext = createContext<IArrayBaseContext>(null)

const ItemContext = createContext<IArrayBaseItemProps>(null)

const useArray = () => {
  return useContext(ArrayBaseContext)
}

const useIndex = (index?: number) => {
  const ctx = useContext(ItemContext)
  return ctx ? ctx.index : index
}

const useRecord = (record?: number) => {
  const ctx = useContext(ItemContext)
  return ctx ? ctx.record : record
}
const getSchemaDefaultValue = (schema: Schema, id) => {
  if (schema?.type === 'array') return []
  if (schema?.type === 'object')
    return {
      ID: id,
    }
  if (schema?.type === 'void') {
    for (let key in schema.properties) {
      const value = getSchemaDefaultValue(schema.properties[key], id)
      if (isValid(value)) return value
    }
  }
}

const getDefaultValue = (defaultValue: any, schema: Schema, id) => {
  if (isValid(defaultValue)) return clone(defaultValue)
  if (Array.isArray(schema?.items))
    return getSchemaDefaultValue(schema.items[0], id)
  return getSchemaDefaultValue(schema.items, id)
}

export const ArrayBase: ComposedArrayBase = memo(
  (props) => {
    const field = useField<ArrayField>()
    const schema = useFieldSchema()
    console.log('ArrayBaseArrayBase123')

    return (
      <ArrayBaseContext.Provider value={{ field, schema, props }}>
        {props.children}
      </ArrayBaseContext.Provider>
    )
  },
  (prevProps, nextProps) => {
    console.log('prevProps.children', prevProps.children, nextProps.children)

    if (prevProps.children == nextProps.children) {
      return true
    } else {
      return false
    }
  }
)

ArrayBase.Item = ({ children, ...props }) => {
  console.log('ArrayBaseArrayBaseItem')
  return (
    <ItemContext.Provider value={props}>
      <ExpressionScope value={{ $record: props.record, $index: props.index }}>
        {children}
      </ExpressionScope>
    </ItemContext.Provider>
  )
}

const SortHandle = SortableHandle((props: any) => {
  const prefixCls = usePrefixCls('formily-array-base')
  return (
    <MenuOutlined
      {...props}
      className={cls(`${prefixCls}-sort-handle`, props.className)}
      style={{ ...props.style }}
    />
  )
}) as any

ArrayBase.SortHandle = (props) => {
  const array = useArray()
  if (!array) return null
  if (array.field?.pattern !== 'editable') return null
  return <SortHandle {...props} />
}

ArrayBase.Index = (props) => {
  const index = useIndex()
  const prefixCls = usePrefixCls('formily-array-base')
  return (
    <span {...props} className={`${prefixCls}-index`}>
      {index + 1}
    </span>
  )
}

ArrayBase.Addition = (props) => {
  const self = useField()
  const array = useArray()
  const prefixCls = usePrefixCls('formily-array-base')
  const { getFormDataId } = useModel('array-table')

  if (!array) return null
  if (
    array.field?.pattern !== 'editable' &&
    array.field?.pattern !== 'disabled'
  )
    return null
  console.log('self?.disabled', self?.disabled)

  return (
    <Button
      type="dashed"
      block
      {...props}
      disabled={self?.disabled}
      className={cls(`${prefixCls}-addition`, props.className)}
      onClick={(e) => {
        if (array?.props?.disabled) return
        if (props.onPreClick) {
          let pre = props.onPreClick(e)
          if (!pre) {
            return
          }
        }
        getFormDataId({}, (data) => {
          if (data?.data?.id) {
            const defaultValue = getDefaultValue(
              props.defaultValue,
              array.schema,
              data?.data?.id
            )
            if (props.method === 'unshift') {
              array.field?.unshift?.(defaultValue)
              array.props?.onAdd?.(0)
            } else {
              array.field?.push?.(defaultValue)
              array.props?.onAdd?.(array?.field?.value?.length - 1)
            }
          }
        })

        if (props.onClick) {
          props.onClick(e)
        }
      }}
      icon={<PlusOutlined />}
    >
      {props.title || self.title}
    </Button>
  )
}
ArrayBase.Importition = (props) => {
  const { getDictType, getDictTypeList, getALLDictTypeList } = useModel(
    'basicData'
  )
  const { getFormDataId } = useModel('array-table')
  const [basicList, setBasicList] = useState([])
  const { location } = useModel('@@qiankunStateFromMaster')

  const self = useField()
  const array = useArray()
  const prefixCls = usePrefixCls('formily-array-base')
  let obj = new Object()
  let columnsNameObj = new Object()
  let columnsTitleObj = new Object()
  let columnsType = []
  const masterProps = useModel('@@qiankunStateFromMaster')
  let dictsList = JSON.parse(window.sessionStorage.getItem('dictsList'))
  if (location?.pathname?.includes('formDesigner')) {
    dictsList = useModel('designable')['dictsList']
  }
  useEffect(() => {
    setBasicList(dictsList)
    // getALLDictTypeList({}, (list) => {
    //   setBasicList(list)
    // })
    // getFormDataId({}, (data) => {
    //   obj['ID'] = data?.data?.id
    // })
  }, [])

  columnsNameObj['ID'] = 'ID'
  columnsTitleObj['ID'] = 'ID'
  array?.schema?.items?.reduceProperties((buf, columnSchema) => {
    columnSchema?.reduceProperties((buf, schema) => {
      if (
        schema?.['x-component']?.includes('ArrayTable.Index') || //过滤掉序号
        schema?.['x-component']?.includes('ArrayTable.Remove') ||
        schema?.['x-component']?.includes('ArrayTable.Copy') ||
        schema?.['x-component']?.includes('ArrayTable.MoveDown') ||
        schema?.['x-component']?.includes('ArrayTable.MoveUp') ||
        schema?.['x-component']?.includes('ArrayTable.SortHandle') || //过滤掉操作列
        schema?.['x-component']?.includes('ArrayTable.Edit') ||
        schema?.['x-component']?.includes('Invoice') //过滤掉票据控件
      ) {
        return
      } else {
        obj[schema?.['title'] || [schema?.['name']]] = ''
        columnsNameObj[schema?.['name']] = [schema?.['title']] || [
          schema?.['name'],
        ]
        columnsTitleObj[schema?.['title']] = [schema?.['name']]
        columnsType.push({
          name: schema?.['name'],
          title: schema?.['title'],
          columnType: schema?.['x-component'],
          codeTable: schema?.['x-component-props']?.['codeTable'],
          showModel: schema?.['x-component-props']?.['showModel'], //select
          selectModal: schema?.['x-component-props']?.['selectModal'], //checkbox
          format: schema?.['x-component-props']?.['format'], //checkbox
          props: schema?.['x-component-props'],
        })
      }
    })
  }, [])

  const onMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key == 'download') {
      //模板下载

      if (Object.keys(obj)?.length < 1) {
        message.error('当前子表单无列信息！')
        return
      }
      const ws = utils.json_to_sheet([obj])
      const wb = utils.book_new()
      utils.book_append_sheet(wb, ws, 'Data')
      writeFileXLSX(
        wb,
        array?.schema?.title
          ? `${array?.schema?.title}模板数据.xlsx`
          : '模板数据.xlsx'
      )
      return
    }
  }
  const importForm = async (file) => {
    if (array?.schema?.['x-component-props']?.loading) {
      message.error('正在导入数据，请稍后再次尝试！')
      return
    }
    if (Object.keys(obj)?.length < 1) {
      message.error('当前子表单无列信息！')
      return
    }
    array?.field?.setComponentProps({ loading: true })
    let reader = new FileReader()
    let wb
    let ws
    let jsonData
    reader.readAsArrayBuffer(file) //读取文件
    reader.onload = function (e) {
      let data = e.target.result
      wb = read(data) // parse the array buffer
      //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
      //wb.Sheets[Sheet名]获取第一个Sheet的数据
      ws = wb.Sheets[wb.SheetNames[0]]
      //从工作表创建一个 JS 对象数组
      jsonData = utils.sheet_to_json(ws)
      if (
        !array?.schema?.['x-component-props']?.isLargerData &&
        jsonData?.length > 100
      ) {
        message.error('导入数据量过大!')
        return
      }
      for (let index = 0; index < jsonData.length; index++) {
        const element = jsonData[index]
        Object.keys(element).map((key) => {
          if (columnsTitleObj[key]) {
            let columnobj = _.find(columnsType, { title: key })
            let value = returnValue(
              columnobj,
              element[key],
              element,
              true,
              basicList,
              columnobj?.props
            )
            //将已有的Name值替换为Code 以便于放置表单数据
            element[columnsTitleObj[key]] = value
            if (columnsNameObj[key] != key) {
              delete element[key]
            }
          } else {
            delete element[key]
          }
        })
        delete element['ID']
      }

      jsonData = array?.field?.value?.concat(jsonData)
      if (props.onSufImportClick) {
        props.onSufImportClick(jsonData)
      } else {
        array?.field?.setValue(jsonData)
      }
      array?.field?.setComponentProps({ loading: false, isEditingIndex: 0 })
    }
  }

  const exportForm = () => {
    if (
      self?.disabled ||
      array.field?.pattern !== 'editable' ||
      array?.props?.disabled
    )
      return
    //导出
    let subFormData = _.cloneDeep(array?.field?.value)
    if (subFormData.length <= 0) {
      message.error('当前子表单无数据！')
      return
    }
    let jsonData = []
    for (let index = 0; index < subFormData.length; index++) {
      const element = subFormData[index]
      let values = {}
      Object.keys(element).map((key) => {
        if (key == 'ID') {
          delete element['ID']
          return
        }
        if (columnsNameObj[key]) {
          let columnobj = _.find(columnsType, { name: key })

          let value = returnValue(
            columnobj,
            element[key],
            element,
            false,
            basicList,
            columnobj?.props
          )
          element[columnsNameObj[key]] = value //将已有的code值替换为Name显示
          if (columnsNameObj[key] != key) {
            delete element[key]
          }
        } else {
          delete element[key]
        }
      })
      Object.keys(obj).map((key) => {
        values[key] = element[key]
      })
      jsonData.push(values)
    }
    if (props?.onPreExportClick) {
      jsonData = props?.onPreExportClick(jsonData)
    }
    const ws = utils.json_to_sheet(jsonData)
    //创建工作簿
    const wb = utils.book_new()
    //将工作表数据附加到工作簿
    utils.book_append_sheet(wb, ws, 'Data')
    writeFileXLSX(
      wb,
      array?.schema?.title
        ? `${array?.schema?.title}导出数据.xlsx`
        : '导出数据.xlsx'
    )
  }
  const menu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item key="import">
        <Upload
          disabled={array?.props?.disabled}
          typeName={'sub'}
          nameSpace="upload"
          mustFileType="xlsx"
          requireFileSize={50}
          buttonContent={<div>导入数据</div>}
          uploadSuccess={importForm}
          isImportExcel={true}
        />
      </Menu.Item>
      <Menu.Item key="download">模板下载</Menu.Item>
    </Menu>
  )

  if (!array) return null
  if (
    array.field?.pattern !== 'editable' &&
    array.field?.pattern !== 'disabled'
  )
    return null
  return (
    <>
      <Dropdown
        {...props}
        disabled={self?.disabled}
        overlay={
          location?.pathname?.includes('formDesigner') &&
          useWorkbench()?.type == 'DESIGNABLE' ? (
            <></>
          ) : (
            menu
          )
        }
      >
        <Button
          {...props}
          type="primary"
          disabled={self?.disabled}
          className={cls(
            `${prefixCls}-addition`,
            styles.bt_import,
            props.className
          )}
        >
          导入
        </Button>
      </Dropdown>
      <Button
        {...props}
        type="primary"
        disabled={self?.disabled}
        className={cls(
          `${prefixCls}-addition`,
          styles.bt_import,
          props.className
        )}
        onClick={exportForm.bind(this)}
      >
        导出
      </Button>
    </>
  )
}

ArrayBase.Remove = React.forwardRef((props, ref) => {
  const index = useIndex(props.index)
  const self = useField()
  const array = useArray()
  const prefixCls = usePrefixCls('formily-array-base')
  const { cutomHeaders, location, bizInfo } = useModel(
    '@@qiankunStateFromMaster'
  )
  const { deleteInvoiceRef } = useModel('invoice')
  if (!array) return null
  //if (array.field?.pattern !== 'editable') return null
  return (
    <DeleteOutlined
      {...props}
      className={cls(
        `${prefixCls}-remove`,
        // self?.disabled || array.field?.pattern !== 'editable'
        //   ? `${prefixCls}-remove-disabled`
        //   : '',
        styles.array_icon,
        props.className
      )}
      ref={ref}
      disabled={self?.disabled || array.field?.pattern !== 'editable'}
      onClick={(e) => {
        if (self?.disabled || array.field?.pattern !== 'editable') return
        e.stopPropagation()
        array?.field?.setComponentProps({ loading: true })
        let subTableDataId = array.field?.value?.[index]?.[`ID`] //当前行的id
        if (!array.field.componentProps.isLargerData) {
          let formCode = array.field?.props?.name //当前发票的code
          let payload = {
            mainTableId: cutomHeaders?.mainTableId,
            bizInfoId: location.query.bizInfoId,
            bizSolId: location.query.bizSolId,
            formCode,
            subTableDataId,
          }
          array?.schema?.items?.reduceProperties((buf, columnSchema) => {
            columnSchema?.reduceProperties((buf, schema) => {
              if (schema?.['x-component'] == 'Invoice') {
                let columnCode = schema?.['name']
                deleteInvoiceRef(
                  {
                    ...payload,
                    columnCode,
                  },
                  () => {}
                )
              }
            })
          })
        }
        array.field?.remove?.(index)
        array.props?.onRemove?.(index)
        if (props.onClick) {
          props.onClick(e)
        }
        array?.field?.setComponentProps({ loading: false })
      }}
    />
  )
})

ArrayBase.Copy = React.forwardRef((props, ref) => {
  const index = useIndex(props.index)
  const self = useField()
  const array = useArray()
  const prefixCls = usePrefixCls('formily-array-base')
  const { getFormDataId } = useModel('array-table')

  if (!array) return null
  if (array.field.componentProps.isLargerData) return null
  //if (array.field?.pattern !== 'editable') return null
  return (
    <CopyOutlined
      {...props}
      className={cls(
        `${prefixCls}-remove`,
        // self?.disabled
        //   ? `${prefixCls}-remove-disabled`
        //   : '',
        styles.array_icon,
        props.className
      )}
      disabled={self?.disabled || array.field?.pattern !== 'editable'}
      ref={ref}
      onClick={(e) => {
        if (
          self?.disabled ||
          array.field?.pattern !== 'editable' ||
          array?.props?.disabled
        )
          return
        e.stopPropagation()
        getFormDataId({}, (data) => {
          if (data?.data?.id) {
            let startIndex = index + 1
            let obj = _.cloneDeep(array.field?.value?.[index]) //获取复制行的值
            //删除不需要的字段
            DELETE_CODE_LIST.forEach((element) => {
              delete obj[element]
            })
            array?.schema?.items?.reduceProperties((buf, columnSchema) => {
              columnSchema?.reduceProperties((buf, schema) => {
                if (schema?.['x-component'] == 'Invoice') {
                  let columnCode = schema?.['name']
                  delete obj[columnCode] //删除票据值
                }
              })
            })
            // array.field?.push?.({
            //   ...obj,
            //   ID: data?.data?.id,
            // }) //添加一条数据
            // array.field?.move?.(array.field?.length - 1, startIndex) //移动该数据到复制行下面
            // array.field?.insert(index + 1, { ...obj, ID: data?.data?.id })
            if (props.onCopyClick) {
              props.onCopyClick({ ...obj, ID: data?.data?.id }, index)
            } else {
              array.field?.insert(index + 1, { ...obj, ID: data?.data?.id })
            }
            // array.props?.onCopy?.(index)
            // if (props.onClick) {
            //   props.onClick(e)
            // }
          }
        })
      }}
    />
  )
})
ArrayBase.MoveDown = React.forwardRef((props, ref) => {
  const index = useIndex(props.index)
  const self = useField()
  const array = useArray()
  const prefixCls = usePrefixCls('formily-array-base')
  if (!array) return null
  if (array.field.componentProps.isLargerData) return null
  //if (array.field?.pattern !== 'editable') return null
  return (
    <DownOutlined
      {...props}
      className={cls(
        `${prefixCls}-move-down`,
        // self?.disabled || array.field?.pattern !== 'editable'
        //   ? `${prefixCls}-move-down-disabled`
        //   : '',
        styles.array_icon,
        props.className
      )}
      ref={ref}
      disabled={self?.disabled || array.field?.pattern !== 'editable'}
      onClick={(e) => {
        if (self?.disabled || array.field?.pattern !== 'editable') return
        e.stopPropagation()
        array.field?.moveDown?.(index)
        array.props?.onMoveDown?.(index)
        if (props.onClick) {
          props.onClick(e)
        }
      }}
    />
  )
})

ArrayBase.MoveUp = React.forwardRef((props, ref) => {
  const index = useIndex(props.index)
  const self = useField()
  const array = useArray()
  const prefixCls = usePrefixCls('formily-array-base')
  if (!array) return null
  if (array.field.componentProps.isLargerData) return null
  //if (array.field?.pattern !== 'editable') return null
  return (
    <UpOutlined
      {...props}
      className={cls(
        `${prefixCls}-move-up`,
        // self?.disabled ||array.field?.pattern !== 'editable'
        //   ? `${prefixCls}-move-up-disabled`
        //   : '',
        styles.array_icon,
        props.className
      )}
      ref={ref}
      disabled={self?.disabled || array.field?.pattern !== 'editable'}
      onClick={(e) => {
        if (self?.disabled || array.field?.pattern !== 'editable') return
        e.stopPropagation()
        array?.field?.moveUp(index)
        array?.props?.onMoveUp?.(index)
        if (props.onClick) {
          props.onClick(e)
        }
      }}
    />
  )
})
ArrayBase.Edit = React.forwardRef((props, ref) => {
  const index = useIndex(props.index)
  const self = useField()
  const array = useArray()
  const prefixCls = usePrefixCls('formily-array-base')
  const { getFormDataId } = useModel('array-table')

  if (!array) return null
  if (
    array.field.componentProps.isLargerData &&
    array.field.componentProps.isShowLineEdit
  )
    return null
  //if (array.field?.pattern !== 'editable') return null
  return (
    <EditOutlined
      {...props}
      className={cls(
        `${prefixCls}-remove`,
        // self?.disabled
        //   ? `${prefixCls}-remove-disabled`
        //   : '',
        styles.array_icon,
        props.className
      )}
      // disabled={self?.disabled || array.field?.pattern !== 'editable'}
      ref={ref}
      onClick={(e) => {
        // if (self?.disabled || array.field?.pattern !== 'editable') return
        e.stopPropagation()
        if (props.onClick) {
          props.onClick(index, e)
        }
      }}
    />
  )
})
ArrayBase.View = React.forwardRef((props, ref) => {
  const index = useIndex(props.index)
  const self = useField()
  const array = useArray()
  const prefixCls = usePrefixCls('formily-array-base')
  const { getFormDataId } = useModel('array-table')

  if (!array) return null
  //if (array.field?.pattern !== 'editable') return null
  return (
    <MyIcon
      type="icon-chakan"
      {...props}
      className={cls(
        `${prefixCls}-remove`,
        // self?.disabled
        //   ? `${prefixCls}-remove-disabled`
        //   : '',
        styles.array_icon,
        props.className
      )}
      // disabled={self?.disabled || array.field?.pattern !== 'editable'}
      ref={ref}
      onClick={(e) => {
        // if (self?.disabled || array.field?.pattern !== 'editable') return
        e.stopPropagation()
        if (props.onClick) {
          props.onClick(index, e)
        }
      }}
    />
  )
})
ArrayBase.useArray = useArray
ArrayBase.useIndex = useIndex
ArrayBase.useRecord = useRecord
ArrayBase.mixin = (target: any) => {
  target.Index = ArrayBase.Index
  target.SortHandle = ArrayBase.SortHandle
  target.Addition = ArrayBase.Addition
  target.Remove = ArrayBase.Remove
  target.Copy = ArrayBase.Copy
  target.MoveDown = ArrayBase.MoveDown
  target.MoveUp = ArrayBase.MoveUp
  target.useArray = ArrayBase.useArray
  target.useIndex = ArrayBase.useIndex
  target.useRecord = ArrayBase.useRecord
  target.Importition = ArrayBase.Importition
  target.View = ArrayBase.View
  target.Edit = ArrayBase.Edit
  return target
}

export default ArrayBase
