import { ISchema } from '@formily/react'

export const FormStep: ISchema & { StepPane?: ISchema } = {
  type: 'object',
  properties: {
    size: {
      type: 'string',
      enum: ['large', 'small', 'default', null],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'default',
      },
    },
  },
}

FormStep.StepPane = {
  type: 'object',
  properties: {
    // step: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    // },
  },
}
