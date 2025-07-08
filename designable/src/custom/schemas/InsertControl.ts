import { ISchema } from '@formily/react'

export const InsertControl: ISchema = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    microname: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}
