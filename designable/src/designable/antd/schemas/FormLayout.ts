import { ISchema } from '@formily/react'

// let reg = /^[a-zA-Z\u4e00-\u9fa5]{1}.*$/
// let regAll = /^[a-zA-Z0-9_\u4e00-\u9fa5]*$/
// var regCode = /^[A-Z][A-Z0-9_]*$/

// registerValidateRules({
//   checkForm(value) {
//     if (value && !reg.test(value)) {
//       3
//       return '汉字、字母开头,支持（汉字、字母、数字、下划线）'
//     } else if (value && !regAll.test(value)) {
//       return '汉字、字母开头,支持（汉字、字母、数字、下划线）'
//     } else {
//       return ''
//     }
//   },
//   checkFormCode(value) {
//     if (value && !regCode.test(value)) {
//       return '字母开头，支持（大写字母、数字，下划线）'
//     } else {
//       return ''
//     }
//   },
// })
export const FormLayout: ISchema = {
  type: 'object',
  properties: {
    ctlgId: {
      type: 'String',
      'x-decorator': 'FormItem',
      'x-component': 'TreeSelect',
      enum: [],
      'x-component-props': {
        defaultValue: '',
        showSearch: true,
        treeNodeFilterProp: 'title',
      },
      'x-validator': [{ required: true }],
      'x-disabled': '',
    },
    formName: {
      type: 'String',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-validator': [
        { checkForm: true },
        { max: 40, message: '最多输入40个字符' },
        { required: true },
      ],
      'x-disabled': '',
    },
    formCode: {
      type: 'String',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-validator': [
        { checkFormCode: true },
        { max: 40, message: '最多输入40个字符' },
        { required: true },
      ],
      'x-disabled': '',
    },
    bussinessTemplateCode: {
      type: 'String',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-disabled': '',
    },
    dsId: {
      type: 'String',
      'x-decorator': 'FormItem',
      'x-component': 'TreeSelect',
      'x-disabled': '',
      'x-component-props': {
        defaultValue: '',
        showSearch: true,
      },
    },
    tableId: {
      type: 'String',
      'x-decorator': 'FormItem',
      'x-component': 'TreeSelect',
      'x-disabled': '',
      'x-component-props': {
        defaultValue: '',
        showSearch: true,
        allowClear: true,
      },
    },
    labelCol: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    wrapperCol: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    labelWidth: {
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
    },
    wrapperWidth: {
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
    },
    // colon: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    //   'x-component-props': {
    //     defaultChecked: false,
    //   },
    // },
    // feedbackLayout: {
    //   type: 'string',
    //   enum: ['loose', 'terse', 'popover', 'none', null],
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Select',
    //   'x-component-props': {
    //     defaultValue: 'popover',
    //   },
    // },
    // size: {
    //   type: 'string',
    //   enum: ['large', 'small', 'default', null],
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Select',
    //   'x-component-props': {
    //     defaultValue: 'default',
    //   },
    // },
    // layout: {
    //   type: 'string',
    //   enum: ['vertical', 'horizontal', 'inline', null],
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Select',
    //   'x-component-props': {
    //     defaultValue: 'horizontal',
    //   },
    // },
    tooltipLayout: {
      type: 'string',
      enum: ['icon', 'text', null],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'icon',
      },
    },
    // labelAlign: {
    //   type: 'string',
    //   enum: ['left', 'right', null],
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Select',
    //   'x-component-props': {
    //     defaultValue: 'right',
    //   },
    // },
    // wrapperAlign: {
    //   type: 'string',
    //   enum: ['left', 'right', null],
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Select',
    //   'x-component-props': {
    //     defaultValue: 'left',
    //   },
    // },
    // labelWrap: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    // },
    // wrapperWrap: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    // },

    // fullness: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    // },
    // inset: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    // },
    // shallow: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    //   'x-component-props': {
    //     defaultChecked: true,
    //   },
    // },
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

export const FormPortalLayout: ISchema = {
  type: 'object',
  properties: {
    labelCol: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    wrapperCol: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    labelWidth: {
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
    },
    wrapperWidth: {
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
    },
  },
}
