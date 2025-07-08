//组件属性
import { ISchema } from '@formily/react'

export const UserSelect: ISchema & { Addition?: ISchema } = {
  type: 'object',
  properties: {
    limitorg: {
      type: 'string',
      enum: [
        { label: '当前单位', value: 'CURRENTORGCHILD' },
        { label: '所有单位', value: 'ALLORGS' },
        { label: '指定单位（可多选）', value: 'ORGS' },
        { label: '当前单位（含下级）', value: 'CURRENTORG' },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      default: 'CURRENTORGCHILD',
    },
    OrgTreeNAME_: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'OrgTree',
      'x-visible': 'false',
      'x-component-props': {
        //组件的属性
        limitorg: 'ALLORGS',
      },
    },
    OrgTreeID_: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        //组件的属性
        style: {
          display: 'none',
        },
      },
    },
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    selectButtonType: {
      type: 'string',
      enum: [
        { label: '是', value: 'checkBox' },
        { label: '否', value: 'radio' },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      default: 'radio',
    },
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
