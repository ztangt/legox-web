import { GlobalRegistry } from '@/designable/core'
import { ISchema } from '@formily/react'

export const Card: ISchema & { Addition?: ISchema } = {
  type: 'object',
  properties: {
    // title: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    // },
    extra: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    type: {
      type: 'boolean',
      enum: [
        { label: '内置', value: 'inner' },
        { label: '默认', value: '' },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        defaultValue: '',
        optionType: 'button',
      },
    },
    // bordered: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    //   'x-component-props': {
    //     defaultChecked: true,
    //   },
    // },
  },
}
