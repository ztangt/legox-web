import IconLeft from '@/Icon-left'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer, useField } from '@formily/react'
import { InputNumber } from 'antd'
import { InputNumberProps } from 'antd/lib/input-number'
import classnames from 'classnames'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
export const Year: DnFC<InputNumberProps> = observer((props) => {
  const field = useField()
  var style = {
    ...props.style,
  }
  if (!field.editable) {
    style = {
      ...props.style,
      color: '#333333',
    }
  }
  return (
    <InputNumber
      {...props}
      style={style}
      placeholder={props.disabled ? '' : props.placeholder}
      className={classnames(styles.year, props.redClassName)}
      disabled={!field.editable}
      step={1}
      min={1000}
      max={9999}
      precision={0}
      value={field.authType == 'NONE' ? '' : props.value}
    />
  )
})
//createBehavior 创建组件的行为，locals 信息、propsSchema 可修改属性
Year.Behavior = createBehavior({
  name: 'Year',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Year', //组件
  designerProps: {
    droppable: true,
    propsSchema: createFieldSchema(AllSchemas.Year),
  },
  designerLocales: AllLocales.Year, //语言
})
//createResource 创建资源基础信息，用于左侧拖拽组件
Year.Resource = createResource({
  icon: <IconLeft type="icon-nianfen" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      sourceName: '年份',
      props: {
        type: 'string',
        title: '年份',
        'x-decorator': 'FormItem',
        'x-component': 'Year', //组件
        'x-component-props': {
          allowClear: true,
          style: {
            ...initStyle?.style,
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
