import React, { Fragment, useState } from 'react'
import { observer } from '@formily/react'
import { Collapse } from 'antd'
import { CollapseProps, CollapsePanelProps } from 'antd/lib/collapse'
import { TreeNode, createBehavior, createResource } from '@/designable/core'
import {
  useTreeNode,
  useNodeIdProps,
  DroppableWidget,
  TreeNodeWidget,
  DnFC,
} from '@/designable/react'
import { toArr } from '@formily/shared'
import { LoadTemplate } from '@/designable/antd/common/LoadTemplate'
import { useDropTemplate } from '@/designable/antd/hooks'
import {
  createContainerSchema,
  createContainerObjectSchema,
} from '@/designable/antd/components/Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { matchComponent } from '@/designable/antd/shared'
import { initStyle } from '../../../service/constant'
import styles from './index.less'
const parseCollapse = (parent: TreeNode) => {
  const tabs: TreeNode[] = []
  parent.children.forEach((node) => {
    if (matchComponent(node, 'FormCollapse.CollapsePanel')) {
      tabs.push(node)
    }
  })
  return tabs
}

export const FormCollapse: DnFC<CollapseProps> & {
  CollapsePanel?: React.FC<CollapsePanelProps>
} = observer((props) => {
  const [activeKey, setActiveKey] = useState<string | string[]>([])
  const node = useTreeNode()
  const nodeId = useNodeIdProps()
  const designer = useDropTemplate('FormCollapse', (source) => {
    const panelNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormCollapse.CollapsePanel',
        'x-component-props': {
          header: `Unnamed Title`,
        },
      },
      children: source,
    })

    setActiveKey(toArr(activeKey).concat(panelNode.id))
    return [panelNode]
  })
  const panels = parseCollapse(node)
  const renderCollapse = () => {
    if (!node.children?.length) return <DroppableWidget />
    return (
      <Collapse
        {...props}
        activeKey={panels.map((tab) => tab.id)}
        className={styles.collapse_container}
      >
        {panels.map((panel) => {
          const props = panel.props['x-component-props'] || {}
          return (
            <Collapse.Panel
              {...props}
              style={{ ...props.style }}
              header={
                <span
                  data-content-editable="x-component-props.header"
                  data-content-editable-node-id={panel.id}
                >
                  {props.header}
                </span>
              }
              key={panel.id}
            >
              {React.createElement(
                'div',
                {
                  [designer.props.nodeIdAttrName]: panel.id,
                  style: {
                    padding: '16px 16px',
                  },
                },
                panel.children.length ? (
                  <TreeNodeWidget node={panel} />
                ) : (
                  <DroppableWidget />
                )
              )}
            </Collapse.Panel>
          )
        })}
      </Collapse>
    )
  }
  return (
    <div {...nodeId}>
      {renderCollapse()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addCollapsePanel'),
            icon: 'AddPanel',
            onClick: () => {
              const tabPane = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'FormCollapse.CollapsePanel',
                  'x-component-props': {
                    header: `Unnamed Title`,
                  },
                },
              })
              node.append(tabPane)
              const keys = toArr(activeKey)
              setActiveKey(keys.concat(tabPane.id))
            },
          },
        ]}
      />
    </div>
  )
})

FormCollapse.CollapsePanel = (props) => {
  return <Fragment>{props.children}</Fragment>
}

FormCollapse.Behavior = createBehavior(
  {
    name: 'FormCollapse',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormCollapse',
    designerProps: {
      droppable: true,
      allowAppend: (target, source) =>
        target.children.length === 0 ||
        source.every(
          (node) => node.props['x-component'] === 'FormCollapse.CollapsePanel'
        ),
      propsSchema: createContainerSchema(AllSchemas.FormCollapse),
    },
    designerLocales: AllLocales.FormCollapse,
  },
  {
    name: 'FormCollapse.CollapsePanel',
    extends: ['Field'],
    selector: (node) =>
      node.props['x-component'] === 'FormCollapse.CollapsePanel',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] === 'FormCollapse',
      propsSchema: createContainerObjectSchema(
        AllSchemas.FormCollapse.CollapsePanel
      ),
    },
    designerLocales: AllLocales.FormCollapsePanel,
  }
)

FormCollapse.Resource = createResource({
  icon: 'CollapseSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          style: {
            ...initStyle?.containerStyle,
          },
        },
      },
    },
  ],
})
