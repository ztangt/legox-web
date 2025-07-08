import React from 'react'
import { Card as AntdCard } from 'antd'

import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { createContainerSchema } from '@/designable/antd/components/Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { initStyle } from '../../../service/constant'
import styles from './index.less'
export const Card: DnFC<React.ComponentProps<typeof AntdCard>> = (props) => {
  return (
    <AntdCard
      {...props}
      className={styles.card_container}
      title={
        <span data-content-editable="x-component-props.title">
          {props.title}
        </span>
      }
    >
      {props.children}
    </AntdCard>
  )
}

Card.Behavior = createBehavior({
  name: 'Card',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Card',
  designerProps: {
    droppable: true,
    propsSchema: createContainerSchema(AllSchemas.Card),
  },
  designerLocales: AllLocales.Card,
})

Card.Resource = createResource({
  icon: 'CardSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          title: 'Title',
          style: {
            ...initStyle?.containerStyle,
          },
        },
      },
    },
  ],
})
