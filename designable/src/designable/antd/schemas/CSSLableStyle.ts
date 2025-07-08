import { ISchema } from '@formily/react'

export const CSSSLabelStyle: ISchema = {
  type: 'void',
  properties: {
    'labelStyle.width': {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
    },
    'labelStyle.height': {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
    },
    // 'labelStyle.display': {
    //   'x-component': 'DisplayStyleSetter',
    // },
    'labelStyle.background': {
      'x-component': 'BackgroundStyleSetter',
    },
    'labelStyle.boxShadow': {
      'x-component': 'BoxShadowStyleSetter',
    },
    'labelStyle.font': {
      'x-component': 'FontStyleSetter',
    },
    'labelStyle.margin': {
      'x-component': 'BoxStyleSetter',
    },
    'labelStyle.padding': {
      'x-component': 'BoxStyleSetter',
    },
    'labelStyle.borderRadius': {
      'x-component': 'BorderRadiusStyleSetter',
    },
    'labelStyle.border': {
      'x-component': 'BorderStyleSetter',
    },
    'labelStyle.opacity': {
      'x-decorator': 'FormItem',
      'x-component': 'Slider',
      'x-component-props': {
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
  },
}
