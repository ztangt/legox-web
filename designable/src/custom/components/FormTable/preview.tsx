import { LoadTemplate } from '@/designable/antd/common/LoadTemplate'
import {
  createFormTableColumnSchema,
  createFormTableSchema,
} from '@/designable/antd/components/Field'
import { useDropTemplate } from '@/designable/antd/hooks'
import { matchComponent } from '@/designable/antd/shared'
import { TreeNode, createBehavior, createResource } from '@/designable/core'
import {
  DnFC,
  DroppableWidget,
  TreeNodeWidget,
  useNodeIdProps,
  useTreeNode,
} from '@/designable/react'
import { observer } from '@formily/reactive-react'
import cls from 'classnames'
import React, { Fragment } from 'react'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
import './styles.less'
interface FormTableProps {
  columns?: Number
  lines: Number
}
interface Column {}
interface Thread {}
export const FormTable: DnFC<FormTableProps> & {
  Thread?: React.FC<Thread>
  Column?: React.FC<Column>
} = observer((props) => {
  const node = useTreeNode()
  const nodeId = useNodeIdProps()
  const designer = useDropTemplate('FormTable', (source) => {
    return [
      new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'FormTable.Column',
          'x-component-props': {
            ...initStyle?.tableColumnStyle,
          },
        },
        children: source,
      }),
    ]
  })
  const parseThreads = (parent: TreeNode) => {
    const threads: TreeNode[] = []
    parent.children.forEach((node) => {
      if (matchComponent(node, 'FormTable.Thread')) {
        threads.push(node)
      }
    })
    return threads
  }

  const parseColumns = (parent: TreeNode) => {
    const columns: TreeNode[] = []
    parent.children.forEach((node) => {
      if (matchComponent(node, 'FormTable.Column')) {
        columns.push(node)
      }
    })
    return columns
  }

  const threads = parseThreads(node)
  let rowSpan = 1,
    rowSpanFlag = -1,
    reowSapnColumnFlag = -1
  const renderColumns = (tr, index) => {
    let columns = parseColumns(tr)
    let colSpan = 1,
      colSpanFlag = -1
    return columns?.map((td, flag) => {
      const props = td.props['x-component-props'] || {}
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
        !td?.children.length //单元格中无内容
      ) {
        return
      }
      console.log(
        'rowSpanFlag',
        rowSpan,
        rowSpanFlag,
        index,
        td?.children.length,
        flag
      )

      if (
        rowSpan > 1 && //纵跨行数大于1
        index > rowSpanFlag && //当前单元格所处下标大于上一个合并单元格下标
        rowSpanFlag + rowSpan > index && //当前单元格所处下标大于上一个合并单元格下标
        reowSapnColumnFlag == flag && //需要合并的单元格与当前单元格位于一列
        !td?.children.length //单元格中无内容
      ) {
        return
      }
      td.children.map((child, index) => {
        if (child?.props?.['x-decorator-props']) {
          //添加默认值
          td.children[index].props['x-decorator-props'].bordered = false
        }
      })
      console.log('props?.style?.width', props?.style?.width)
      if (window.location.href.includes('/appDesigner')) {
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
              {React.createElement(
                'div',
                {
                  [designer.props.nodeIdAttrName]: td.id,
                  style: {
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                  },
                },
                td.children.length ? (
                  <TreeNodeWidget node={td} />
                ) : (
                  <DroppableWidget node={td} style={{ width: '100%' }} />
                )
              )}
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
          {React.createElement(
            'div',
            {
              [designer.props.nodeIdAttrName]: td.id,
              style: {
                display: 'flex',
                height: '100%',
                width: '100%',
              },
            },
            td.children.length ? (
              <TreeNodeWidget node={td} />
            ) : (
              <DroppableWidget node={td} style={{ width: '100%' }} />
            )
          )}
        </td>
      )
    })
  }
  const renderThreads = () => {
    return threads.map((tr, index) => {
      if (window.location.href.includes('/appDesigner')) {
        //app 一行一列
        return renderColumns(tr, index)
      }
      return <tr key={index}>{renderColumns(tr, index)}</tr>
    })
  }

  if (node.children.length === 0) return <DroppableWidget {...props} />
  return (
    <div
      {...nodeId}
      className={cls(
        `formtale_${nodeId?.['data-designer-node-id']}`,
        styles.formTable
      )}
    >
      <table
        {...props}
        style={{ width: '100%', ...props?.style, tableLayout: 'fixed' }}
      >
        <tbody style={{ width: '100%' }}>{renderThreads()}</tbody>
      </table>
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addThread'),
            icon: 'AddPanel',
            onClick: () => {
              const tableThread = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'FormTable.Thread',
                  'x-component-props': {},
                },
              })
              if (node.children?.length) {
                let max = node.children.reduce((prev, next) => {
                  //最大列数的行
                  return prev?.children.length > next?.children.length
                    ? prev
                    : next
                })
                let maxLength = window.location.href.includes('/appDesigner')
                  ? 1
                  : max?.children?.length || 1 //最大行中节点长度
                for (let index = 0; index < maxLength; index++) {
                  tableThread.append(
                    new TreeNode({
                      //当前行追加最大列个数
                      componentName: 'Field',
                      props: {
                        type: 'void',
                        'x-component': 'FormTable.Column',
                        'x-component-props': {
                          style: {
                            ...initStyle?.tableColumnStyle,
                          },
                        },
                      },
                    })
                  )
                }
                // for (let index = 0; index < node.children.length; index++) {
                //   let trNode = node.children[index]
                //   let trLength = trNode?.children?.length;//行中节点长度
                //   if(trLength&&(trLength < maxLength)){
                //     for (let flag = 0; flag < maxLength - trLength; flag++) {
                //       node.children[index].append(new TreeNode({
                //         componentName: 'Field',
                //         props: {
                //           type: 'void',
                //           'x-component': 'FormTable.Column',
                //           'x-component-props': {
                //                 ...initStyle?.tableColumnStyle,

                //           },
                //         },
                //       }))
                //     }
                //   }
                // }
              }
              node.append(tableThread)
            },
          },
          {
            title: node.getMessage('addColumn'),
            icon: 'AddPanel',
            onClick: () => {
              if (window.location.href.includes('/appDesigner')) {
                return
              }
              for (let index = 0; index < threads.length; index++) {
                threads?.[index]?.append(
                  new TreeNode({
                    //已有的行 每行增加一列
                    componentName: 'Field',
                    props: {
                      type: 'void',
                      'x-component': 'FormTable.Column',
                      'x-component-props': {
                        ...initStyle?.tableColumnStyle,
                      },
                    },
                  })
                )
              }
            },
          },
        ]}
      />
    </div>
  )
})
FormTable.Thread = (props) => {
  return <Fragment>{props.children}</Fragment>
}

FormTable.Column = observer(({ ...props }) => {
  return <Fragment>{props.children}</Fragment>
})

FormTable.Behavior = createBehavior(
  {
    name: 'FormTable',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormTable',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] !== 'FormTable',
      allowAppend: (
        target,
        source //只可添加网格栏
      ) =>
        source.every((node) => node.props['x-component'] == 'FormTable.Thread'),
      propsSchema: createFormTableSchema(AllSchemas.FormTable),
    },
    designerLocales: AllLocales.FormTable,
  },
  {
    name: 'FormTable.Thread',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormTable.Thread',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] === 'FormTable.Column',
      allowAppend: (
        target,
        source //只可添加一个控件
      ) =>
        source.every((node) => node.props['x-component'] == 'FormTable.Column'),
    },
    designerLocales: AllLocales.FormTableThread,
  },
  {
    name: 'FormTable.Column',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormTable.Column',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] !== 'FormTable',
      allowAppend: (
        target,
        source //只可添加一个控件
      ) =>
        target.children.length === 0 &&
        source.every((node) => node.props['x-component'] != 'FormTable'),
      propsSchema: createFormTableColumnSchema(AllSchemas.FormTable.Column),
    },
    designerLocales: AllLocales.FormTableColumn,
  }
)

FormTable.Resource = createResource({
  icon: 'GridSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormTable',
        'x-component-props': {
          style: {
            ...initStyle?.tableContainerStyle,
          },
        },
      },
      children: [
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'FormTable.Thread',
            'x-component-props': {
              style: {},
            },
          },
          children: [
            {
              componentName: 'Field',
              props: {
                type: 'void',
                'x-component': 'FormTable.Column',
                'x-component-props': {
                  style: {
                    ...initStyle?.tableColumnStyle,
                  },
                },
              },
            },
          ],
        },
      ],
    },
  ],
})
