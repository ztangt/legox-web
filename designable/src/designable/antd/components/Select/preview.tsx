import React from 'react'
import { Select as FormilySelect } from '@/formily/antd'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Select: DnFC<React.ComponentProps<typeof FormilySelect>> =
  FormilySelect

Select.Behavior = createBehavior({
  name: 'Select',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Select',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Select),
  },
  designerLocales: AllLocales.Select,
})

Select.Resource = createResource({
  icon: 'SelectSource',
  title: 'select', //这是后期更改，与自定义的组件title冲突
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Select',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
      },
    },
  ],
})
