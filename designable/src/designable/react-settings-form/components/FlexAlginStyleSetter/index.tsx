import { IconWidget, usePrefix } from '@/designable/react'
import { Radio } from '@/formily/antd'
import { Field, observer, useField } from '@formily/react'
import cls from 'classnames'
import React from 'react'
import { InputItems } from '../InputItems'
import './styles.less'
export interface IFlexAlginStyleSetterProps {
  className?: string
  style?: React.CSSProperties
}

export const FlexAlginStyleSetter: React.FC<IFlexAlginStyleSetterProps> = observer(
  (props) => {
    const field = useField()
    const prefix = usePrefix('flex-style-setter')
    return (
      <div className={cls(prefix, props.className)} style={props.style}>
        <InputItems vertical>
          <Field
            name="alignItems"
            basePath={field.address.parent()}
            dataSource={[
              {
                label: <IconWidget infer="FlexAlignItemsCenter" />,
                value: 'center',
              },
              {
                label: <IconWidget infer="FlexAlignItemsStart" />,
                value: 'flex-start',
              },
              {
                label: <IconWidget infer="FlexAlignItemsEnd" />,
                value: 'flex-end',
              },
              {
                label: <IconWidget infer="FlexAlignItemsStretch" />,
                value: 'stretch',
              },
              {
                label: <IconWidget infer="FlexAlignItemsBaseline" />,
                value: 'baseline',
              },
            ]}
            reactions={(field) => {
              field.decorator[1].title = `Align Items : ${field.value || ''}`
            }}
            decorator={[InputItems.Item]}
            component={[Radio.Group, { optionType: 'button' }]}
          />
        </InputItems>
      </div>
    )
  }
)
