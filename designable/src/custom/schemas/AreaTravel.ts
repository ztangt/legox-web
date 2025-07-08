import { ISchema } from '@formily/react'

export const AreaTravel: ISchema = {
  type: 'object',
  properties: {
    travelUser: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}
