import MyIcon from '@/Icon'
import IconLeft from '@/Icon-left'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer } from '@formily/react'
import { Input as AntdInput } from 'antd'
import { InputProps } from 'antd/lib/input'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
export const Input: DnFC<InputProps> = observer((props) => {
  return (
    <AntdInput
      {...props}
      onClick={() => {}}
      suffix={
        <MyIcon
          type="icon-tongyong"
          onClick={props.disabled ? () => {} : props.onClick}
          style={!props.disabled ? { color: '#333333' } : { color: '#D9D9D9' }}
        />
      }
    />
  )
})
Input.Behavior = createBehavior({
  name: 'Input',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Input',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Input),
  },
  designerLocales: AllLocales.Input,
})

Input.Resource = createResource({
  icon: <IconLeft type="icon-shurukuang" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '单行输入',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          allowClear: true,
          style: {
            ...initStyle?.style,
            // padding: '2px 4px 2px 4px',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
          },
        },
      },
    },
  ],
})
