import { ISchema } from '@formily/react'

export const WriteSign: ISchema = {
  type: 'object',
  properties: {
    optionType: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          { label: '意见富文本', value: 'TEXTAREA' },
          { label: '意见工具栏', value: 'OPTION' },
          { label: '意见签批', value: 'PICTURE' },
        ],
      },
    },
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '请输入意见',
      'x-component-props': {},
    },
  },
}
