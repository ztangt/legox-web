import React, { Fragment, useState } from 'react'
import { observer } from '@formily/react'
import { Button, Steps } from 'antd'
import { StepsProps, StepProps } from 'antd/lib/steps'
import { TreeNode, createBehavior, createResource } from '@/designable/core'
import {
  useNodeIdProps,
  useTreeNode,
  TreeNodeWidget,
  DroppableWidget,
  DnFC,
} from '@/designable/react'
import { LoadTemplate } from '../../../designable/antd/common/LoadTemplate'
import { useDropTemplate } from '../../../designable/antd/hooks'
import {
  createContainerSchema,
  createContainerObjectSchema,
} from '../../../designable/antd'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import {
  createEnsureTypeItemsNode,
  findNodeByComponentPath,
  matchComponent,
  queryNodesByComponentPath,
} from '../../../designable/antd/shared'
import { initStyle } from '../../../service/constant'
import './index.less'

const ensureObjectItemsNode = createEnsureTypeItemsNode('object')
const parseSteps = (parent: TreeNode) => {
  const steps: TreeNode[] = []
  parent.children.forEach((node) => {
    if (matchComponent(node, 'FormStep.StepPane')) {
      steps.push(node)
    }
  })
  return steps
}

const getCorrectActiveKey = (activeKey: number, steps: TreeNode[]) => {
  if (steps.length === 0) return
  if (activeKey) return activeKey
  return steps.length - 1
}

export const FormStep: DnFC<StepsProps> & {
  StepPane?: React.FC<StepProps>
  Operation?: React.FC<StepsProps>
} = observer((props) => {
  const [activeKey, setActiveKey] = useState<number>(0)
  const nodeId = useNodeIdProps()
  const node = useTreeNode()
  const designer = useDropTemplate('FormStep', (source) => {
    return [
      new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'FormStep.StepPane',
          'x-component-props': {
            title: `Unnamed Title`,
          },
        },
        children: source,
      }),
    ]
  })
  const steps = parseSteps(node)
  const renderTabs = () => {
    if (!node.children?.length) return <DroppableWidget />
    return (
      <>
        <Steps
          {...props}
          current={activeKey}
          onChange={(key) => {
            setActiveKey(key)
          }}
        >
          {steps.map((step, key) => {
            const props = step.props['x-component-props'] || {}
            return (
              <Steps.Step
                {...props}
                style={{ ...props.style }}
                key={key}
                title={
                  <span
                    data-content-editable="x-component-props.title"
                    data-content-editable-node-id={step.id}
                  >
                    {props.title}
                  </span>
                }
              />
            )
          })}
        </Steps>
        {steps.map(
          (step, key) =>
            key == activeKey &&
            React.createElement(
              'div',
              {
                [designer.props.nodeIdAttrName]: step?.id,
                style: {
                  // padding: '16px 0',
                },
              },
              step?.children.length ? (
                <TreeNodeWidget node={step} />
              ) : (
                <DroppableWidget node={step} />
              )
            )
        )}
        {
          // React.createElement(
          //   'div',
          //   {
          //     style: {
          //       padding: '16px 0',
          //     },
          //   },
          //   steps?.[activeKey]?.children.length ? (
          //     <TreeNodeWidget node={steps?.[activeKey]} />
          //   ) : (
          //     <DroppableWidget node={steps?.[activeKey]} />
          //   )
          //   )
        }
      </>
    )
  }
  const operations = queryNodesByComponentPath(node, [
    'FormStep',
    'FormStep.Operation',
  ])
  return (
    <div {...nodeId}>
      {renderTabs()}
      {operations?.map((child) => {
        return <TreeNodeWidget node={child} key={child.id} />
      })}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addStep'),
            icon: 'AddPanel',
            onClick: () => {
              const stepPane = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'FormStep.StepPane',
                  'x-component-props': {
                    title: `Unnamed Title`,
                  },
                },
              })
              node.append(stepPane)
              setActiveKey(steps.length)
            },
          },
          {
            title: node.getMessage('addOperation'),
            icon: 'AddOperation',
            onClick: () => {
              const oldAdditionNode = findNodeByComponentPath(node, [
                'FormStep',
                'FormStep.Operation',
              ])
              if (!oldAdditionNode) {
                const additionNode = new TreeNode({
                  componentName: 'Field',
                  props: {
                    type: 'void',
                    title: '导入/导出',
                    'x-component': 'FormStep.Operation',
                    'x-component-props': {
                      formStep: '{{formStep}}',
                      style: {
                        ...initStyle?.containerStyle,
                        margin: '0px 0px 16px 0px',
                      },
                    },
                  },
                })
                ensureObjectItemsNode(node).insertAfter(additionNode)
              }
            },
          },
        ]}
      />
    </div>
  )
})

FormStep.StepPane = (props) => {
  return <Fragment>{props.children}</Fragment>
}
FormStep.Operation = (props) => {
  return (
    <div className="button_group">
      <Button disabled type="primary" style={{ marginRight: 8 }}>
        上一步
      </Button>
      <Button disabled type="primary">
        下一步
      </Button>
    </div>
  )
}

FormStep.Behavior = createBehavior(
  {
    name: 'FormStep',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormStep',
    designerProps: {
      droppable: true,
      allowAppend: (target, source) =>
        target.children.length === 0 ||
        source.every(
          (node) => node.props['x-component'] === 'FormStep.StepPane'
        ),
      propsSchema: createContainerSchema(AllSchemas.FormStep),
    },
    designerLocales: AllLocales.FormStep,
  },
  {
    name: 'FormStep.StepPane',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormStep.StepPane',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] === 'FormStep',
      propsSchema: createContainerObjectSchema(AllSchemas.FormStep.StepPane),
    },
    designerLocales: AllLocales.FormStepPane,
  },
  {
    name: `FormStep.Operation`,
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === `FormStep.Operation`,
    designerProps: {
      allowDrop(parent) {
        return parent.props['x-component'] === `FormStep.Operation`
      },
      // propsSchema: createOperationFieldSchema(AllSchemas[name].Addition),
    },
    // designerLocales: AllLocales.ArrayAddition,
  }
)

FormStep.Resource = createResource({
  icon: 'TabSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormStep',
        'x-component-props': {
          formStep: '{{formStep}}',
          style: {
            ...initStyle?.containerStyle,
            margin: '0px 0px 16px 0px',
          },
        },
      },
    },
  ],
})
