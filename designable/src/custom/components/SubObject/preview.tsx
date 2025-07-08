import React from 'react'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC, useTreeNode } from '@/designable/react'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { Container } from '@/designable/antd/common/Container'
import { AllLocales } from '@/custom/locales'

export const SubObject: DnFC<React.ComponentProps<typeof Container>> = Container
// const currentNode = useTreeNode()
// console.log('currentNode',currentNode);

SubObject.Behavior = createBehavior({
  name: 'SubObject',
  extends: ['Field'],
  selector: (node) =>
    node?.props?.['x-component-props']?.['subContainerName'] === 'subObject',
  designerProps: {
    droppable: true,
    propsSchema: createFieldSchema(),
    allowAppend: (
      target,
      source //只可添加一个控件且不可再嵌套自增表格组件
    ) =>
      source.every(
        (node) =>
          node.props['x-component'] != 'ArrayTable' &&
          node.props['x-component'] != 'WriteSign' &&
          node.props['x-component'] != 'UploadFile' &&
          node.props['x-component'] != 'AttachmentBiz' &&
          // node.props['x-component'] != 'FormGrid' &&
          // node.props['x-component'] != 'FormLayout' &&
          // node.props['x-component'] != 'FormStep' &&
          // node.props['x-component'] != 'FormTab' &&
          // node.props['x-component'] != 'Card' &&
          // node.props['x-component'] != 'FromCollapse'&&
          !(
            node?.props?.['type'] == 'object' &&
            node?.props?.['x-component-props']?.['subContainerName'] ===
              'subObject'
          )
      ),
  },
  designerLocales: AllLocales.SubObject,
})

SubObject.Resource = createResource({
  icon: 'ObjectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'object',
        'x-component-props': {
          subContainerName: 'subObject',
        },
        'x-reactions': {
          fulfill: {
            // run:"$self.setDecorator('ModalContainer',{\nonCancel(){\n    $self.setDecoratorProps({visible: false})\n  },\n  onOk(){\n    $self.setDecoratorProps({visible: false})\n\n  }\n})\n$props({\n  \n})",
            run:
              "\n    try{\n      // $self.setDecorator('ModalContainer',{\n      // })\n    }catch(e){\n      console.log('e',e)\n    }",
          },
        },
      },
    },
  ],
})
