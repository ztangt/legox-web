import { ISchema } from '@formily/react'

export const ArrayTable: ISchema & { Addition?: ISchema; Column?: ISchema } = {
  type: 'object',
  properties: {
    bordered: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    showHeader: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    sticky: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    size: {
      type: 'string',
      enum: ['large', 'small', 'middle'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'small',
      },
    },
    tableLayout: {
      type: 'string',
      enum: ['auto', 'fixed'],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        defaultValue: 'auto',
        optionType: 'button',
      },
    },
    isModal: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: false,
      },
    },
    isLargerData: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: false,
      },
    },
    isShowLineEdit: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
      'x-visible': false,
      'x-value': true,
    },
  },
}

const Column: ISchema = {
  type: 'object',
  properties: {
    // title: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    // },
    align: {
      type: 'string',
      enum: ['left', 'right', 'center'],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        defaultValue: 'left',
        optionType: 'button',
        value: 'left',
      },
    },
    // colSpan: {
    //   type: 'number',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'NumberPicker',
    // },
    width: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    fixed: {
      type: 'string',
      enum: ['left', 'right', false],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        optionType: 'button',
      },
    },
    groupName: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-validator': [
        // { checkForm: true },
        { max: 40, message: '最多输入40个字符' },
        // { required: true },
      ],
    },
  },
}

const Addition: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        defaultValue: '添加行',
      },
    },
    // method: {
    //   type: 'string',
    //   enum: ['push', 'unshift'],
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Radio.Group',
    //   'x-component-props': {
    //     defaultValue: 'push',
    //     optionType: 'button',
    //   },
    // },
    // defaultValue: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'ValueInput',
    // },
  },
}

ArrayTable.Column = Column
ArrayTable.Addition = Addition
