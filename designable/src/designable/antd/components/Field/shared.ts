import { registerValidateRules } from '@formily/core'
import { ISchema } from '@formily/json-schema'

import { ReactionsSetter, ValidatorSetter } from '@/designable/setters'
import { AllSchemas } from '../../schemas'
let reg = /^[a-zA-Z\u4e00-\u9fa5]{1}.*$/
let regAll = /^[a-zA-Z0-9_\u4e00-\u9fa5]*$/
let regCode = /^[A-Z][A-Z0-9_]*$/
let regNumber = /^[1-9]+[0-9]*$/

registerValidateRules({
  checkForm(value) {
    if (value && !reg.test(value)) {
      return '汉字、字母开头,支持（汉字、字母、数字、下划线）'
    } else if (value && !regAll.test(value)) {
      return '汉字、字母开头,支持（汉字、字母、数字、下划线）'
    } else {
      return ''
    }
  },
  checkFormCode(value, rule, ctx) {
    debugger
    String.prototype.endsWith = function (endStr) {
      let d = this.length - endStr.length
      return d >= 0 && this.lastIndexOf(endStr) == d
    }
    const type = ctx?.form?.values['x-component']
    if (value && !regCode.test(value)) {
      return '字母开头，支持（大写字母、数字，下划线）'
    } else if (
      value &&
      !value.endsWith('NAME_') &&
      (type == 'PersonTree' ||
        type == 'DeptTree' ||
        type == 'OrgTree' ||
        type == 'PullData')
    ) {
      return '不符合命名格式,需添以NAME_结尾'
    } else if (value && !value.endsWith('TLDT_') && type == 'BasicData') {
      return '不符合命名格式,需添以TLDT_结尾'
    } else {
      return ''
    }
  },
  checkNumber(value) {
    if (value && !regNumber.test(value)) {
      return '只能输入正整数'
    } else {
      return ''
    }
  },
})

export const createFieldConfigSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    'field-config-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      properties: {
        tableId: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'TreeSelect',
          'x-component-props': {
            showSearch: true,
            allowClear: true,
          },
        },
        columnId: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            showSearch: true,
          },
        },
        columnName: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': [
            { checkForm: true },
            { max: 40, message: '最多输入40个字符' },
            { required: true },
          ],
        },
        columnCode: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': [
            { checkFormCode: true },
            { max: 40, message: '最多输入40个字符' },
            { required: true },
          ],
        },
        columnLength: {
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          'x-validator': [{ checkNumber: true }, { required: true }],
          'x-component-props': {},
        },
        columnDecLength: {
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          'x-validator': [{ checkNumber: true }],
        },
        columnType: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          enum: [
            'SINGLETEXT',
            'MULTITEXT',
            'DICTCODE',
            'MONEY',
            'DATE',
            'ANNEX',
            'ASSOCIADTEDDOC',
            'OPINION',
            'DATAPULL',
            'QRCODE',
            'BARCODE',
            'BASEDATACODE',
            'PERSONTREE',
            'DEPTTREE',
            'ORGTREE',
            'BUSINESSCONTROL',
            'NUMBER',
            'DEPARTURETRAVEL',
            'BILL',
          ],
          'x-component-props': {},
          'x-disabled': 'disabled',
          'x-valiue': '',
        },
      },
    },
  }
}
export const createComponentLabelStylechema = () =>
  // component: ISchema,
  // decorator: ISchema
  {
    return {
      'label-style-group': {
        type: 'void',
        'x-component': 'CollapseItem',
        'x-component-props': { defaultExpand: false },
        'x-reactions': {
          fulfill: {
            state: {
              visible: '{{!!$form.values["x-decorator"]}}',
            },
          },
        },
        properties: {
          'x-decorator-props.labelStyle': AllSchemas.CSSSLabelStyle,
        },
      },
    }
  }
export const createComponentWrapStylechema = (
  component: ISchema,
  decorator: ISchema
) => {
  return {
    'wrapper-style-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-decorator"]}}',
          },
        },
      },
      properties: {
        'x-decorator-props.wrapperStyle': AllSchemas.CSSSWrapperStyle,
      },
    },
  }
}
export const createComponentStylechema = () =>
  // component: ISchema,
  // decorator: ISchema
  {
    return {
      'component-style-group': {
        type: 'void',
        'x-component': 'CollapseItem',
        'x-component-props': { defaultExpand: false },
        'x-reactions': {
          fulfill: {
            state: {
              visible: '{{!!$form.values["x-component"]}}',
            },
          },
        },
        properties: {
          'x-component-props.style': AllSchemas.CSSStyle,
        },
      },
    }
  }
export const createComponentSpaceStylechema = (
  component: ISchema,
  decorator: ISchema
) => {
  return {
    'component-style-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-component"]}}',
          },
        },
      },
      properties: {
        'x-component-props.style': AllSchemas.SpaceCSSStyle,
      },
    },
  }
}

export const createDecoratorStylechema = (
  component: ISchema,
  decorator: ISchema
) => {
  return {
    'decorator-style-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-decorator"]}}',
          },
        },
      },
      properties: {
        'x-decorator-props.style': AllSchemas.CSSStyle,
      },
    },
  }
}
export const createComponentSchema = (
  component: ISchema,
  decorator: ISchema
) => {
  return {
    'component-group': component && {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-component"]}}',
          },
        },
      },
      properties: {
        'x-component-props': component,
      },
    },
  }
}

export const createDecoratorSchema = (
  component: ISchema,
  decorator: ISchema
) => {
  return {
    'decorator-group': decorator && {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-decorator"]}}',
          },
        },
      },
      properties: {
        'x-decorator-props': decorator,
      },
    },
  }
}
export const createFieldGroupSchema = (
  component: ISchema,
  decorator: ISchema,
  extraFieldProps?: any
) => {
  return {
    'field-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      properties: {
        title: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-reactions': {
            fulfill: {
              state: {
                value: '{{$form.values["columnName"]}}',
              },
            },
          },
          'x-disabled': 'disabled',
          'x-display': 'hidden',
        },
        name: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-reactions': {
            fulfill: {
              state: {
                value: '{{$form.values["columnCode"]}}',
              },
            },
          },
          'x-disabled': 'disabled',
          // 'x-component-props':{
          //   hidden: true
          // },
          // 'x-display': 'hidden'
          'x-decorator-props': {
            style: {
              display: 'none',
            },
          },
        },
        // description: {
        //   type: 'string',
        //   'x-decorator': 'FormItem',
        //   'x-component': 'Input.TextArea',
        // },
        // 'x-display': {
        //   type: 'string',
        //   enum: ['visible', 'hidden'],
        //   'x-decorator': 'FormItem',
        //   'x-component': 'Select',
        //   'x-component-props': {
        //     defaultValue: 'visible',
        //   },
        // },
        display: {
          type: 'string',
          enum: ['visible', 'hidden'],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            defaultValue: 'visible',
          },
          'x-reactions': {
            fulfill: {
              run:
                "$effect(()=>{\n  $form.values['x-decorator-props'] = {...$form.values['x-decorator-props'],className:$self.value=='hidden'?'decorator_hidden':''}\n},[$self.value])",
            },
          },
        },
        // 'x-pattern': {
        //   type: 'string',
        //   enum: ['editable', 'disabled', 'readOnly', 'readPretty', ''],
        //   'x-decorator': 'FormItem',
        //   'x-component': 'Select',
        //   'x-component-props': {
        //     defaultValue: 'editable',
        //   },
        // },
        // default: {
        //   'x-decorator': 'FormItem',
        //   'x-component': 'ValueInput',
        // },
        // enum: {
        //   'x-decorator': 'FormItem',
        //   'x-component': DataSourceSetter,
        // },
        'x-reactions': {
          'x-decorator': 'FormItem',
          'x-component': ReactionsSetter,
        },
        'x-validator': {
          type: 'array',
          'x-component': ValidatorSetter,
        },
        // required: {
        //   type: 'boolean',
        //   'x-decorator': 'FormItem',
        //   'x-component': 'Switch',
        // },
        ...extraFieldProps,
      },
    },
  }
}
export const createFieldSchema = (
  component?: ISchema,
  extraFieldProps?: any,
  decorator: ISchema = AllSchemas.FormItem
): ISchema => {
  return {
    type: 'object',
    properties: {
      ...createFieldConfigSchema(component, decorator),
      ...createFieldGroupSchema(component, decorator, extraFieldProps),
      ...createComponentSchema(component, decorator),
      ...createDecoratorSchema(component, decorator),
      ...createComponentStylechema(),
      // ...createDecoratorStylechema(component, decorator),
      ...createComponentLabelStylechema(),
      // ...createComponentWrapStylechema(component, decorator),
    },
  }
}

export const createVoidFieldSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    type: 'object',
    properties: {
      ...createFieldGroupSchema(component, decorator),
      ...createComponentSchema(component, decorator),
      ...createComponentStylechema(),
      ...createDecoratorSchema(component, decorator),
    },
  }
}

export const createSpaceSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    type: 'object',
    properties: {
      // ...createFieldGroupSchema(component, decorator),
      ...createComponentSchema(component, decorator),
      ...createComponentSpaceStylechema(component, decorator),
      // ...createDecoratorSchema(component, decorator),
    },
  }
}

export const createOperationFieldSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    type: 'object',
    properties: {
      // ...createComponentSchema(component, decorator),
      ...createComponentStylechema(),
    },
  }
}

export const createFieldGroupReactionSchema = () => {
  return {
    'field-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      properties: {
        'x-reactions': {
          'x-decorator': 'FormItem',
          'x-component': ReactionsSetter,
        },
      },
    },
  }
}

export const createOperationConmponentFieldSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    type: 'object',
    properties: {
      ...createFieldGroupReactionSchema(),
      ...createComponentStylechema(),
    },
  }
}

export const createArraySchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
): ISchema => {
  return {
    type: 'object',
    properties: {
      ...createFieldConfigSchema(component, decorator),
      ...createFieldGroupSchema(component, decorator),
      ...createComponentSchema(component, decorator),
      // ...createComponentStylechema(component, decorator),
    },
  }
}

export const createArrayColumnFieldGroupSchema = (
  component: ISchema,
  decorator: ISchema,
  extraFieldProps?: any
) => {
  return {
    'field-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      properties: {
        'x-display': {
          type: 'string',
          enum: ['visible', 'hidden'],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            defaultValue: 'visible',
          },
        },
      },
    },
  }
}
export const createArrayColumnSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    type: 'object',
    properties: {
      ...createComponentSchema(component, decorator),
      ...createArrayColumnFieldGroupSchema(component, decorator),
      // ...createComponentStylechema(component, decorator),
    },
  }
}
export const createComponentFormGridStylechema = (
  component: ISchema,
  decorator: ISchema
) => {
  return {
    'component-style-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-component"]}}',
          },
        },
      },
      properties: {
        'x-component-props.style': AllSchemas.CSSFormGridStyle,
      },
    },
  }
}

export const createComponentFormGridColumnStylechema = (
  component: ISchema,
  decorator: ISchema
) => {
  return {
    'component-style-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-component"]}}',
          },
        },
      },
      properties: {
        'x-component-props.style': AllSchemas.CSSFormGridColumnStyle,
      },
    },
  }
}
export const createComponentFormTableColumnsylechema = (
  component: ISchema,
  decorator: ISchema
) => {
  return {
    'component-style-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-component"]}}',
          },
        },
      },
      properties: {
        'x-component-props.style': AllSchemas.CSSFormTableColumnStyle,
      },
    },
  }
}
export const createContainerSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    type: 'object',
    properties: {
      ...createComponentSchema(component, decorator),
      ...createComponentFormGridStylechema(component, decorator),
      // ...createComponentStylechema(component, decorator),
    },
  }
}
export const createFormTableColumnSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    type: 'object',
    properties: {
      ...createComponentSchema(component, decorator),
      ...createComponentFormTableColumnsylechema(component, decorator),
      // ...createComponentStylechema(component, decorator),
    },
  }
}
export const createContainerObjectSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    type: 'object',
    properties: {
      ...createComponentSchema(component, decorator),
    },
  }
}
export const createFormTableSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    type: 'object',
    properties: {
      ...createComponentFormGridStylechema(component, decorator),
    },
  }
}
export const createFormGridSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    type: 'object',
    properties: {
      ...createComponentSchema(component, decorator),
      ...createComponentFormGridStylechema(component, decorator),
    },
  }
}
export const createFormGridColumnSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    type: 'object',
    properties: {
      ...createComponentSchema(component, decorator),
      ...createComponentFormGridColumnStylechema(component, decorator),
    },
  }
}

export const createStylechema = () => {
  return {
    'component-style-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: true },
      properties: {
        'x-component-props.style': AllSchemas.CSSStyle,
      },
    },
  }
}
export const createLabelStylechema = () => {
  return {
    'label-style-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      properties: {
        'x-decorator-props.labelStyle': AllSchemas.CSSSLabelStyle,
      },
    },
  }
}
export const createFieldCSSSchema = () => {
  return {
    type: 'object',
    properties: {
      ...createStylechema(),
      ...createLabelStylechema(),
    },
  }
}

export const creatPortalFieldSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    type: 'object',
    properties: {
      // ...createComponentSchema(component, decorator),
      ...createFieldGroupReactionSchema(),
      ...createComponentStylechema(),
    },
  }
}
export const createContainerFormTabpaneSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  return {
    type: 'object',
    properties: {
      ...createComponentSchema(component, decorator),
      // 'field-group': {
      //   type: 'void',
      //   'x-component': 'CollapseItem',
      //   'x-component-props': {
      //     style: {
      //       display: 'none',
      //     },
      //   },
      //   properties: {
      //     name: {
      //       type: 'string',
      //       'x-decorator': 'FormItem',
      //       'x-component': 'Input',
      //       'x-reactions': {
      //         fulfill: {
      //           state: {
      //             value: '{{$form.values["x-component-props"]["tabId"]}}',
      //           },
      //         },
      //       },
      //       'x-disabled': 'disabled',
      //       'x-decorator-props': {
      //         style: {
      //           display: 'none',
      //         },
      //       },
      //     },
      //   },
      // },
    },
  }
}
