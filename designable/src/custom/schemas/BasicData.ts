import { ISchema } from '@formily/react'

export const BasicData: ISchema = {
  type: 'object',
  properties: {
    codeTable: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'TreeSelect',
      'x-component-props': {
        showSearch: true,
        allowClear: true,
        treeNodeFilterProp: 'title',
        popupClassName: 'basic_data_popup',
      },
      'x-reactions': {
        fulfill: {
          run:
            "$props({onChange(value,lable,extra){$form.values['x-component-props']['showModel'] = 'select';if(extra.allCheckedNodes[0].node.props.enumType==1){$form.getFieldState('x-component-props.showModel',state=>{  state.setComponentProps({disabled:true});})}else{$form.getFieldState('x-component-props.showModel',state=>{  state.setComponentProps({disabled:false});})}}})",
        },
      },
    },
    showModel: {
      type: 'string',
      enum: [
        { label: '下拉', value: 'select' },
        { label: '平铺', value: 'tiled' },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      default: 'select',
    },
    selectModal: {
      type: 'string',
      'x-decorator': 'FormItem',
      enum: [
        { label: '复选', value: 'checkBox' },
        { label: '单选', value: 'radio' },
      ],
      'x-component': 'Radio.Group',
      default: 'radio',
    },
  },
}
