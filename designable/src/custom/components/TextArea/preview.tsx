import MyIcon from '@/Icon'
import IconLeft from '@/Icon-left'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer, useField } from '@formily/react'
import { Input } from 'antd'
import { InputProps } from 'antd/lib/input'
import classnames from 'classnames'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
export const TextArea: DnFC<InputProps> = observer((props) => {
  let field = useField()
  return (
    <div
      className={
        props?.onClick
          ? classnames(
              styles.textArea_warp,
              props.redClassName,
              styles.icon_text_area
            )
          : classnames(styles.textArea_warp, props.redClassName)
      }
      style={
        props.disabled
          ? props.autoSize
            ? {
                ...props.style,
                background: '#f5f5f5',
                minHeight: props.style.height,
                height: 'auto',
              }
            : { ...props.style, background: '#f5f5f5' }
          : props.autoSize
          ? { ...props.style, minHeight: props.style.height, height: 'auto' }
          : { ...props.style }
      }
    >
      <Input.TextArea
        {...props}
        placeholder={props.disabled ? '' : props.placeholder}
        allowClear
        value={field.authType == 'NONE' ? '' : props.value}
        onClick={() => {}}
        style={{}}
      />
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
    </div>
  )
})
TextArea.Behavior = createBehavior({
  name: 'TextArea',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'TextArea',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.TextArea),
  },
  designerLocales: AllLocales.TextArea,
})

TextArea.Resource = createResource({
  icon: <IconLeft type="icon-duohangshuru" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '多行输入',
        'x-decorator': 'FormItem',
        'x-component': 'TextArea',
        'x-component-props': {
          autoSize: false,
          style: {
            ...initStyle?.style,
            height: '48px',
            lineHeight: '',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
            height: '48px',
            lineHeight: '48px',
          },
        },
      },
    },
  ],
})
