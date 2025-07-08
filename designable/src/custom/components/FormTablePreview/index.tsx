import { Schema, SchemaKey } from '@formily/json-schema'
import {
  RecursionField,
  observer,
  useField,
  useFieldSchema,
} from '@formily/react'
import { TabPaneProps } from 'antd/lib/tabs'
import cls from 'classnames'
import React, { Fragment } from 'react'
import styles from './index.less'
export interface IFormTab {
  activeKey: string
  setActiveKey(key: string): void
}

export interface FormTableProps {
  className?: any
  style?: any
}

export interface FormTableColumnProps extends TabPaneProps {
  colSpan: number
  rowSpan: number
}

type ComposedFormTable = React.FC<React.PropsWithChildren<FormTableProps>> & {
  Column: React.FC<React.PropsWithChildren<FormTableColumnProps>>
}

const useThreads = () => {
  const threadsField = useField()
  const schema = useFieldSchema()
  const threads: { name: SchemaKey; props: any; schema: Schema }[] = []
  schema.mapProperties((schema, name) => {
    const field = threadsField.query(threadsField.address.concat(name)).take()
    if (field?.display === 'none' || field?.display === 'hidden') return
    if (schema['x-component']?.indexOf('FormTable.Thread') > -1) {
      threads.push({
        name,
        props: {
          key: schema?.['x-component-props']?.key || name,
          ...schema?.['x-component-props'],
        },
        schema,
      })
    }
  })
  return threads
}
const useColumns = (schema) => {
  const columnsField = useField()
  const columns: { name: SchemaKey; props: any; schema: Schema }[] = []
  schema.mapProperties((schema, name) => {
    const field = columnsField.query(columnsField.address.concat(name)).take()
    if (field?.display === 'none' || field?.display === 'hidden') return
    if (schema['x-component']?.indexOf('FormTable.Column') > -1) {
      columns.push({
        name,
        props: {
          key: schema?.['x-component-props']?.key || name,
          ...schema?.['x-component-props'],
        },
        schema,
      })
    }
  })
  return columns
}
let rowSpan = 1,
  rowSpanFlag = -1,
  reowSapnColumnFlag = -1
const renderColumns = (schema, index) => {
  let columns = useColumns(schema)
  let colSpan = 1,
    colSpanFlag = -1
  return columns?.map(({ props, schema, name }, flag) => {
    if (props?.rowSpan > 1) {
      rowSpan = props?.rowSpan
      rowSpanFlag = index
      reowSapnColumnFlag = flag
    }
    if (props?.colSpan > 1) {
      colSpan = props?.colSpan
      colSpanFlag = flag
    }
    if (
      colSpan > 1 && //横跨行数大于1
      flag > colSpanFlag && //当前单元格所处下标大于上一个合并单元格下标
      colSpanFlag + colSpan > flag && //当前单元格下标在合并单元格的范围内
      !schema?.properties //单元格中有内容
    ) {
      return
    }
    if (
      rowSpan > 1 && //纵跨行数大于1
      index > rowSpanFlag && //当前单元格所处下标大于上一个合并单元格下标
      rowSpanFlag + rowSpan > index && //当前单元格所处下标大于上一个合并单元格下标
      reowSapnColumnFlag == flag && //需要合并的单元格与当前单元格位于一列
      !schema?.properties //单元格中有内容
    ) {
      return
    }
    if (
      window.location.href.includes('/appDesigner') ||
      window.location.href.includes('/mobile')
    ) {
      //app 一行一列
      return (
        <tr>
          <td
            {...props}
            colSpan={1}
            rowSpan={1}
            key={flag}
            style={{
              width: `100%`,
              ...props?.style,
              // maxWidth: 1,
            }}
          >
            <RecursionField schema={schema} name={name} />
          </td>
        </tr>
      )
    }
    return (
      <td
        {...props}
        key={flag}
        style={{
          width: `${(
            (1 / columns?.length) *
            100 *
            (props.colSpan || 1)
          ).toFixed(2)}%`,
          ...props?.style,
          // maxWidth: 1,
        }}
      >
        <RecursionField schema={schema} name={name} />
      </td>
    )
  })
}
const renderThreads = () => {
  const threads = useThreads()
  return threads.map(({ props, schema, name }, key) => {
    if (
      window.location.href.includes('/appDesigner') ||
      window.location.href.includes('/mobile')
    ) {
      //app 一行一列
      return renderColumns(schema, key)
    }
    return <tr key={key}>{renderColumns(schema, key)}</tr>
  })
}

export const FormTablePreview: ComposedFormTable = (observer(
  ({ ...props }: FormTableProps) => {
    return (
      <table
        {...props}
        className={cls(styles.formtable_container, props?.className)}
      >
        <tbody style={{ width: '100%' }}>{renderThreads()}</tbody>
      </table>
    )
  }
) as unknown) as ComposedFormTable

const Column: React.FC<React.PropsWithChildren<FormTableColumnProps>> = ({
  children,
}) => {
  return <Fragment>{children}</Fragment>
}

FormTablePreview.Column = Column
// FormTab.createFormTab = createFormTab

export default FormTablePreview
