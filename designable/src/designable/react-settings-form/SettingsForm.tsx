import React, { useEffect, useMemo } from 'react'
import { createForm, onFormValuesChange } from '@formily/core'
import { Form } from '@/formily/antd'
import { observer } from '@formily/react'
import { requestIdle, cancelIdle, clone } from '@/designable/shared'
import {
  createComponentStylechema,
  createFieldCSSSchema,
} from '@/designable/antd/components/Field'
import { AllSchemas } from '@/designable/antd/schemas'
import { AllLocales } from '@/designable/antd/locales'
import {
  usePrefix,
  useSelected,
  useOperation,
  useSelectedNode,
  useWorkbench,
  IconWidget,
  NodePathWidget,
} from '@/designable/react'
import { SchemaField } from './SchemaField'
import { ISettingFormProps } from './types'
import { SettingsFormContext } from './shared/context'
import { useLocales, useSnapshot } from './effects'
import { Empty } from 'antd'
import cls from 'classnames'
import './styles.less'
import _ from 'lodash'
const GlobalState = {
  idleRequest: null,
}

export const SettingsForm: React.FC<ISettingFormProps> = observer(
  (props) => {
    const workbench = useWorkbench()
    const currentWorkspace =
      workbench?.activeWorkspace || workbench?.currentWorkspace
    const currentWorkspaceId = currentWorkspace?.id
    const operation = useOperation(currentWorkspaceId)
    const node = useSelectedNode(currentWorkspaceId)
    const selected = useSelected(currentWorkspaceId)
    const prefix = usePrefix('settings-form')
    const schema = node?.designerProps?.propsSchema
    const nodes = operation.selection.selectedNodes //当前多选的组件及容器
    const nodesSchema = createFieldCSSSchema()
    // const selectionNode = nodes?.[0]
    // const selectionSchema = selectionNode?.designerProps?.propsSchema?.properties?.['component-style-group']

    const isEmpty = !(
      node &&
      node.designerProps?.propsSchema &&
      selected.length === 1
    )
    const form = useMemo(() => {
      return createForm({
        initialValues: node?.designerProps?.defaultProps,
        values: node?.props,
        effects(form) {
          useLocales(node)
          useSnapshot(operation, node)
          props.effects?.(form, node)
        },
      })
    }, [node, node?.props, schema, operation, isEmpty])
    const selectionForm = useMemo(() => {
      //创建选择的表单
      return createForm({
        // initialValues: selectionNode?.designerProps?.defaultProps,
        // values: selectionNode?.props,
        effects(selectionForm) {
          //取一个非第一层的节点，这样local内容就是全的
          var flag = nodes.findIndex((item) => {
            return item.depth != 0
          })
          useLocales(nodes?.[flag])
          // useSnapshot(operation, selectionNode)
          // props.effects?.(selectionForm, nodes)
        },
      })
    }, [nodes?.length])
    selectionForm.addEffects('select', () => {
      onFormValuesChange((form) => {
        console.log('form?.values', form?.values)

        for (
          let index = 0;
          index < operation.selection.selectedNodes.length; //不知道为什么直接取nodes，数组中只有一个值，暂时先。。
          index++
        ) {
          const element = operation.selection.selectedNodes[index]
          if (element.depth == 0) {
            //form 样式设置
            element.setProps({
              style: {
                ...element.props?.style,
                ...form?.values?.['x-component-props']?.style,
              },
            })
          } else {
            //容器、组件样式设置
            element.setProps({
              'x-component-props': {
                ...element.props['x-component-props'],
                style: {
                  ...element.props['x-component-props']?.style,
                  ...form?.values?.['x-component-props']?.style,
                },
              },
              'x-decorator-props': {
                ...element.props['x-decorator-props'],
                labelStyle: {
                  ...element.props['x-decorator-props']?.labelStyle,
                  ...form?.values?.['x-decorator-props']?.labelStyle,
                },
              },
            })
          }
        }
      })
    })
    const render = () => {
      if (!isEmpty) {
        return (
          <div
            className={cls(prefix, props.className)}
            style={props.style}
            key={nodes?.[0].id}
          >
            <SettingsFormContext.Provider value={props}>
              <Form
                form={form}
                colon={false}
                labelWidth={120}
                labelAlign="left"
                wrapperAlign="right"
                // feedbackLayout="popover"
                tooltipLayout="text"
              >
                <SchemaField
                  schema={schema}
                  components={props.components}
                  scope={{ $node: node, ...props.scope }}
                />
              </Form>
            </SettingsFormContext.Provider>
          </div>
        )
      }
      if (nodes.length > 1) {
        //多选设置样式
        return (
          <div
            className={cls(prefix, props.className)}
            style={props.style}
            key={'selection'}
          >
            <SettingsFormContext.Provider value={props}>
              <Form
                form={selectionForm}
                colon={false}
                labelWidth={120}
                labelAlign="left"
                wrapperAlign="right"
                // feedbackLayout="popover"
                tooltipLayout="text"
              >
                <SchemaField schema={nodesSchema} />
              </Form>
            </SettingsFormContext.Provider>
          </div>
        )
      }
      return (
        <div className={prefix + '-empty'}>
          <Empty />
        </div>
      )
    }

    return (
      <IconWidget.Provider tooltip>
        <div className={prefix + '-wrapper'}>
          {!isEmpty && <NodePathWidget workspaceId={currentWorkspaceId} />}
          <div className={prefix + '-content'}>{render()}</div>
        </div>
      </IconWidget.Provider>
    )
  },
  {
    scheduler: (update) => {
      cancelIdle(GlobalState.idleRequest)
      GlobalState.idleRequest = requestIdle(update, {
        timeout: 500,
      })
    },
  }
)
