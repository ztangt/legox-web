import { createVoidFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer } from '@formily/react'
import { Button as AntdButton } from 'antd'
import { ButtonProps } from 'antd/lib/button'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'

// //组件的属性，可以用antd组件的属性，也可以自定义属性
// interface ExtraProps extends ButtonProps {
//   modalRelation: string
//   modalRelationTitle: string
// }
export const Button: DnFC<ButtonProps> = observer((props) => {
  return (
    <>
      <AntdButton {...props} disabled={false}>
        {props.text}
      </AntdButton>
    </>
  )
})

Button.Behavior = createBehavior({
  name: 'Button',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Button',
  designerProps: {
    propsSchema: createVoidFieldSchema(AllSchemas.Button),
  },
  designerLocales: AllLocales.Button,
})

Button.Resource = createResource({
  icon: 'DatePickerSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'any',
        'x-component': 'Button',
        'x-component-props': {
          text: '按钮',
        },
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],
          fulfill: {
            run: '$effect(()=>{\n$self.disabled=false\n},[])\n',
          },
        },
      },
    },
  ],
})
