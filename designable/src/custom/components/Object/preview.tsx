import React from 'react'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { Container } from '@/designable/antd/common/Container'
import { AllLocales } from '@/designable/antd/locales'
import { initStyle } from '../../../service/constant'

// import { observer } from '@formily/react'
// import { DroppableWidget } from '@/designable/react'
// import {Modal,Input} from 'antd';
// import { useState } from 'react'
export const ObjectContainer: DnFC<any> = Container
ObjectContainer.Behavior = createBehavior({
  name: 'Object',
  extends: ['Field'],
  selector: (node) => node.props.type === 'object',
  designerProps: {
    droppable: true,
    propsSchema: createFieldSchema(),
  },
  designerLocales: AllLocales.ObjectLocale,
})

ObjectContainer.Resource = createResource({
  icon: 'ObjectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'object',
        'x-decorator': 'EditableModal.Modal',
      },
    },
  ],
})
