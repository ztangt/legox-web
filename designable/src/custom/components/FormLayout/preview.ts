import React from 'react'
import { FormLayout as FormilyFormLayout } from '@/formily/antd'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { withContainer } from '@/designable/antd/common/Container'
import { createContainerSchema } from '@/designable/antd/components/Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { initStyle } from '../../../service/constant'
export const FormLayout: DnFC<React.ComponentProps<typeof FormilyFormLayout>> =
  withContainer(FormilyFormLayout)

FormLayout.Behavior = createBehavior({
  name: 'FormLayout',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'FormLayout',
  designerProps: {
    droppable: true,
    propsSchema: createContainerSchema(AllSchemas.FormLayout),
  },
  designerLocales: AllLocales.FormLayout,
})

FormLayout.Resource = createResource({
  icon: 'FormLayoutSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          maxColumns: 2,
          style: {
            ...initStyle?.containerStyle,
          },
        },
      },
    },
  ],
})
