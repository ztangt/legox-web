//组件属性
import { ISchema } from '@formily/react'

export const PerformanceIndicator: ISchema & { Addition?: ISchema } = {
  type: 'object',
  properties: {
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
