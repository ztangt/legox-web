import { ISchema } from '@formily/react'

export const FormTable: ISchema & { Column?: ISchema } = {
  type: 'object',
  properties: {},
}

FormTable.Column = {
  type: 'object',
  properties: {
    colSpan: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        defaultValue: 1,
      },
    },
    rowSpan: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        defaultValue: 1,
      },
    },
  },
}
