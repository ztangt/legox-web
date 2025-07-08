import { LoadTemplate } from '@/designable/antd/common/LoadTemplate'
import {
  createFormGridColumnSchema,
  createFormGridSchema,
} from '@/designable/antd/components/Field'
import { TreeNode, createBehavior, createResource } from '@/designable/core'
import {
  DnFC,
  DroppableWidget,
  useNodeIdProps,
  useTreeNode,
} from '@/designable/react'
import { FormGrid as FormilyGird } from '@/formily/antd'
import { useField } from '@formily/react'
import { observer } from '@formily/reactive-react'
import React from 'react'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import './styles.less'
type formilyGrid = typeof FormilyGird

export const FormGrid: DnFC<React.ComponentProps<formilyGrid>> & {
  GridColumn?: React.FC<React.ComponentProps<formilyGrid['GridColumn']>>
} = observer((props) => {
  const node = useTreeNode()
  const nodeId = useNodeIdProps()
  const field = useField()
  // if(window.location.href.includes('/appDesigner')&&field?.props?.maxColumns!=1){//app设计 设置最大列为1
  //   field.setComponentProps({
  //     maxColumns: 1
  //   })
  // }
  if (node.children.length === 0) return <DroppableWidget {...props} />
  Object.keys(node.children).forEach((key, index) => {
    //初始化 计算一些重叠的边框线
    // if (node.children[key].props['x-component'] == 'FormGrid.GridColumn') {
    //   //当前子控件为网格
    //   if ((index + 1) % Number(props?.maxColumns) == 1) {
    //     //当前节点在第一列 有左边框
    //     node.children[key].props['x-component-props']['style'][
    //       'borderLeftStyle'
    //     ] = 'soild'
    //   } else {
    //     //当前节点不在第一列 无左边框
    //     node.children[key].props['x-component-props']['style'][
    //       'borderLeftStyle'
    //     ] = 'none'
    //   }
    //   if ((index + 1) / Number(props?.maxColumns) > 1) {
    //     //当前节点不在第一行 无上边框
    //     node.children[key].props['x-component-props']['style'][
    //       'borderTopStyle'
    //     ] = 'none'
    //   } else {
    //     //当前节点在第一行 有上边框
    //     node.children[key].props['x-component-props']['style'][
    //       'borderTopStyle'
    //     ] = 'soild'
    //   }
    // }
  })
  return (
    <div {...nodeId} className="dn-grid">
      <FormilyGird {...props}>{props.children}</FormilyGird>
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addGridColumn'),
            icon: 'AddColumn',
            onClick: () => {
              const column = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'FormGrid.GridColumn',
                  'x-component-props': {
                    style: {
                      ...initStyle?.gridColumnStyle,
                    },
                  },
                },
              })
              node.append(column)
            },
          },
        ]}
      />
    </div>
  )
})

FormGrid.GridColumn = observer(({ gridSpan, gridColumn, ...props }) => {
  return (
    <DroppableWidget
      {...props}
      data-grid-span={gridSpan}
      style={{ ...props.style, gridRowEnd: `span ${gridColumn || 1}` }}
    >
      {props.children}
    </DroppableWidget>
  )
})

FormGrid.Behavior = createBehavior(
  {
    name: 'FormGrid',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormGrid',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] !== 'FormGrid',
      allowAppend: (
        target,
        source //只可添加网格栏
      ) =>
        source.every(
          (node) => node.props['x-component'] == 'FormGrid.GridColumn'
        ),
      propsSchema: createFormGridSchema(AllSchemas.FormGrid),
    },
    designerLocales: AllLocales.FormGrid,
  },
  {
    name: 'FormGrid.GridColumn',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormGrid.GridColumn',
    designerProps: {
      droppable: true,
      resizable: {
        width(node) {
          const span = Number(node.props['x-component-props']?.gridSpan ?? 1)
          return {
            plus: () => {
              if (span + 1 > 12) return
              node.props['x-component-props'] =
                node.props['x-component-props'] || {}
              node.props['x-component-props'].gridSpan = span + 1
            },
            minus: () => {
              if (span - 1 < 1) return
              node.props['x-component-props'] =
                node.props['x-component-props'] || {}
              node.props['x-component-props'].gridSpan = span - 1
            },
          }
        },
      },
      resizeXPath: 'x-component-props.gridSpan',
      resizeStep: 1,
      resizeMin: 1,
      resizeMax: 12,
      allowDrop: (node) => node.props['x-component'] === 'FormGrid',
      allowAppend: (
        target,
        source //只可添加一个控件
      ) => target.children.length === 0,
      propsSchema: createFormGridColumnSchema(AllSchemas.FormGrid.GridColumn),
    },
    designerLocales: AllLocales.FormGridColumn,
  }
)

FormGrid.Resource = createResource({
  icon: 'GridSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 2,
          style: {
            ...initStyle?.containerStyle,
          },
        },
      },
      children: [
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'FormGrid.GridColumn',
            'x-component-props': {
              style: {
                ...initStyle?.gridColumnStyle,
              },
            },
          },
        },
      ],
    },
  ],
})
