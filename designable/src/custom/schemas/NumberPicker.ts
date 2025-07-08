import { ISchema } from '@formily/react'

export const NumberPicker: ISchema = {
  type: 'object',
  properties: {
    formatter: {
      type: 'string',
      enum: [
        'SECDECIMAL',
        'THUSSECDECIMAL',
        'FOURDECIMAL',
        'THUSFOURDECIMAL',
        'SIXDECIMAL',
        'THUSSIXDECIMAL',
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    addonBefore: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    addonAfter: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    // bordered: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    //   'x-component-props': {
    //     defaultChecked: true,
    //   },
    // },
    statistical: {
      type: 'string',
      enum: ['', 'sum', 'avg', 'max', 'min', 'count'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: '',
      },
    },
    isTotal: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
  },
}
