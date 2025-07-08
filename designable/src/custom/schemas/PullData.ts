import { ISchema } from '@formily/react'

export const PullData: ISchema = {
  type: 'object',
  properties: {
    isMultipleTree: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        options: [
          { label: '是', value: 'checkbox' },
          { label: '否', value: 'radio' },
        ],
        defaultValue: 'radio',
      },
    },
  },
}
