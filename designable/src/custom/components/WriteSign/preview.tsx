import IconLeft from '@/Icon-left'
import { AllLocales } from '@/custom/locales'
import { AllSchemas } from '@/custom/schemas'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer } from '@formily/react'
import { InputProps } from 'antd/lib/input'
import cls from 'classnames'
import { initStyle } from '../../../service/constant'
import WriteSignCn from './WriteSignCn'
import styles from './writeSign.less'
interface ExtraProps extends InputProps {
  optionType?: any //签批类型
  // maxLength?: any //最大长度
}
export const WriteSign: DnFC<ExtraProps> = observer((props) => {
  // const baseProps = _.clone(props)
  // delete baseProps['optionType']
  // delete baseProps['maxLength']

  return (
    <>
      {props.authType != 'NONE' ? (
        <WriteSignCn
          {...props}
          className={cls(props.className, props.redClassName)}
        />
      ) : (
        <div
          className={cls(
            styles.box,
            props?.readOnly ||
              props?.disabled ||
              !(props?.pattern == 'editable' || !props?.pattern)
              ? styles.box_disabled
              : '',
            props?.disabled ? styles.box_disabled_back : '',
            props.redClassName
          )}
          {...props}
        ></div>
      )}
    </>
  )
})

WriteSign.Behavior = createBehavior({
  name: 'WriteSign',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'WriteSign',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.WriteSign),
  },
  designerLocales: AllLocales.WriteSign,
})

WriteSign.Resource = createResource({
  icon: <IconLeft type="icon-shouxieqianpi" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '意见签批',
        'x-decorator': 'FormItem',
        'x-component': 'WriteSign',
        'x-component-props': {
          optionType: 'TEXTAREA',
          // allowClear: true,
          style: {
            ...initStyle?.style,
            height: '64px',
            lineHeight: '',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgba(212,212,212,0.92)',
            backgroundColor: 'rgba(255,255,255,1)',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
            height: '64px',
            lineHeight: '64px',
          },
        },
      },
    },
  ],
})
