import { ISchema } from '@formily/react'
export const DatePicker: ISchema = {
  type: 'object',
  properties: {
    format: {
      type: 'string',
      enum: [
        'YYYY-MM-DD',
        'YYYY-MM-DD HH:mm:ss',
        'YYYY-MM-DD HH:mm',
        'YYYY年MM月DD日 HH时',
        'YYYY-MM',
        'YYYY',
        'MM-DD',
        'MM',
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        // default: '',
      },
      'x-value': 'YYYY-MM-DD',
    },
    // bordered: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    //   'x-component-props': {
    //     defaultChecked: true,
    //   },
    // },
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}
