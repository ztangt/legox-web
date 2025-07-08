import React from 'react'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { createVoidFieldSchema } from '@/designable/antd/components/Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import cls from 'classnames'
import './styles.less'
import { initStyle } from '../../../service/constant'
import IconLeft from '@/Icon-left'
export interface IDesignableTextProps {
  value?: string
  content?: string
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p'
  style?: React.CSSProperties
  className?: string
}

export const Text: DnFC<IDesignableTextProps> = (props) => {
  const tagName = props.mode === 'normal' || !props.mode ? 'div' : props.mode
  return React.createElement(
    tagName,
    {
      ...props,
      className: cls(props.className, 'dn-text'),
      'data-content-editable': 'x-component-props.content',
    },
    props.content
  )
}

Text.Behavior = createBehavior({
  name: 'Text',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Text',
  designerProps: {
    propsSchema: createVoidFieldSchema(AllSchemas.Text),
  },
  designerLocales: AllLocales.Text,
})

Text.Resource = createResource({
  icon: <IconLeft type="icon-wenben" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        'x-component': 'Text',
        'x-component-props': {
          // contentEditable: true,
          style: {
            ...initStyle?.style,
            borderStyle: 'none',
            borderColor: 'rgba(255,255,255,1)',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
          },
        },
      },
    },
  ],
})
