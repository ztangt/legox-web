import React from 'react'
import {
  transformToSchema,
  transformToTreeNode,
} from '@/designable/transformer/src'
import { TreeNode, ITreeNode } from '@/designable/core'
import { MonacoInput } from '@/designable/react-settings-form'
import { useModel } from 'umi'

export interface ISchemaEditorWidgetProps {
  tree: TreeNode
  onChange?: (tree: ITreeNode) => void
}

export const SchemaEditorWidget: React.FC<ISchemaEditorWidgetProps> = (
  props
) => {
  const { settingForm } = useModel('designable')
  return (
    <MonacoInput
      {...props}
      value={JSON.stringify(
        transformToSchema(props.tree, settingForm),
        null,
        2
      )}
      onChange={(value) => {
        props.onChange?.(transformToTreeNode(JSON.parse(value)))
      }}
      language="json"
    />
  )
}
