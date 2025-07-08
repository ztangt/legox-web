import React from 'react'
import { Space as FormilySpace } from '@/formily/antd'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { createSpaceSchema } from '@/designable/antd/components/Field'
import { withContainer } from '@/designable/antd/common/Container'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { initStyle } from '../../../service/constant'

export const Space: DnFC<React.ComponentProps<typeof FormilySpace>> =
  withContainer(FormilySpace)

Space.Behavior = createBehavior({
  name: 'Space',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Space',
  designerProps: {
    droppable: true,
    inlineChildrenLayout: true,
    propsSchema: createSpaceSchema(AllSchemas.Space),
  },
  designerLocales: AllLocales.Space,
})

Space.Resource = createResource({
  icon: 'SpaceSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Space',
        'x-component-props': {
          style: {
            ...initStyle?.spaceStyle,
          },
        },
      },
    },
  ],
})
