import { ISchema } from '@formily/react'
import { defaultFormat } from 'moment'

export const TreeTable: ISchema & { TextArea?: ISchema } = {
  type: 'object',
  properties: {
    bizSolId: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        fieldNames: { label: 'bizSolName', value: 'bizSolId' },
        showSearch: true,
        optionFilterProp: 'bizSolName',
      },
    },
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    checkStrictly: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        options: [
          { label: '是', value: true },
          { label: '否', value: false },
        ],
        defaultValue: false,
      },
    },
    selectionType: {
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
    hiddenColumn: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    showSearch: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    showLook: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    showAdd: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    showUpdate: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    showDelete: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    showImport: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    showCheck: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    isMutliple: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
  },
}
