import { ISchema } from '@formily/react'

export const CSSSWrapperStyle: ISchema = {
  type: 'void',
  properties: {
    'wrapperStyle.width': {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
    },
    'wrapperStyle.height': {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
    },
    // 'wrapperStyle.display': {
    //   'x-component': 'DisplayStyleSetter',
    // },
    'wrapperStyle.background': {
      'x-component': 'BackgroundStyleSetter',
    },
    'wrapperStyle.boxShadow': {
      'x-component': 'BoxShadowStyleSetter',
    },
    'wrapperStyle.font': {
      'x-component': 'FontStyleSetter',
    },
    'wrapperStyle.margin': {
      'x-component': 'BoxStyleSetter',
    },
    'wrapperStyle.padding': {
      'x-component': 'BoxStyleSetter',
    },
    'wrapperStyle.borderRadius': {
      'x-component': 'BorderRadiusStyleSetter',
    },
    'wrapperStyle.border': {
      'x-component': 'BorderStyleSetter',
    },
    'wrapperStyle.opacity': {
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
