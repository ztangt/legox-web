import MyIcon from '@/Icon'
import IconLeft from '@/Icon-left'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { Input as FormilyInput } from '@/formily/antd'
import { observer, useField } from '@formily/react'
import { Input } from 'antd'
import classnames from 'classnames'
import { useEffect, useState } from 'react'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
export const NumberInput: DnFC<
  React.ComponentProps<typeof FormilyInput>
> = observer((props) => {
  const field = useField()
  const [value, setValue] = useState(props.value)
  useEffect(() => {
    if (props.value && isNaN(props.value)) {
      setValue(0)
      field.setValue(0)
    } else if (typeof props.value == 'string') {
      setValue(Number(props.value))
      field.setValue(Number(props.value))
    } else if (!props.value) {
      setValue(0)
      field.setValue(0)
    } else {
      setValue(props.value)
      field.setValue(props.value)
    }
  }, [props.value])
  const changeValue = (e) => {
    setValue(e.target.value)
    field.setValue(e.target.value)
  }
  return (
    <Input
      {...props}
      className={classnames(styles.number, props.className, props.redClassName)}
      value={field.authType == 'NONE' ? '' : value}
      onChange={changeValue}
      placeholder={props.disabled ? '' : props.placeholder}
      suffix={
        <>
          {props?.onClick ? (
            !props.disabled ? (
              <MyIcon
                type="icon-tongyong"
                onClick={props.onClick}
                style={{ color: '#333333' }}
              />
            ) : (
              <MyIcon
                type="icon-chakan"
                onClick={props.onClick}
                style={{ color: '#333333' }}
              />
            )
          ) : null}
        </>
      }
    />
  )
})
NumberInput.Behavior = createBehavior({
  name: 'NumberInput',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'NumberInput',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.NumberInput),
  },
  designerLocales: AllLocales.NumberInput,
})

NumberInput.Resource = createResource({
  icon: <IconLeft type="icon-shujushurukuang" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '数字',
        'x-decorator': 'FormItem',
        'x-component': 'NumberInput',
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
