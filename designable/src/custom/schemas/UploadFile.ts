import { ISchema } from '@formily/react'

export const UploadFile: ISchema = {
  type: 'object',
  properties: {
    fileSizeMax: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Slider',
      'x-component-props': {
        tipFormatter: (value: any) => `${value}M`,
      },
      default: 35,
    },
    attachType: {
      type: 'string',
      enum: ['', 'DOC', 'PIC'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
    limitNumber: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {},
    },
  },
}
