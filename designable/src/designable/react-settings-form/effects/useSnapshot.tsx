import { Operation, TreeNode } from '@/designable/core'
import { onFieldInputValueChange } from '@formily/core'
import { TreeNodeProps } from 'antd'

let timeRequest = null

export const useSnapshot = (operation: Operation, node: TreeNode) => {
  onFieldInputValueChange('*', (field, form) => {
    //TODO: 可通过node.props['x-component']判断当前组件 （ArrayTable、DatePicker...）
    //form.values  获取当前配置表单值
    //field.title 字段标题   field.props.name  字段编码名称

    console.log('field', field, form, form.values, node)
    clearTimeout(timeRequest)
    timeRequest = setTimeout(() => {
      operation.snapshot('update:node:props')
      operation.snapshot('update:node:configProps')
    }, 1000)
  })
}
