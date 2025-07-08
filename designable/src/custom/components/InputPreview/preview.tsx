import MyIcon from '@/Icon'
import { LoadingOutlined } from '@ant-design/icons'
import { connect, mapProps } from '@formily/react'
import { Input as AntdInput } from 'antd'
import { InputProps, TextAreaProps } from 'antd/lib/input'
import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import styles from './index.less'
type ComposedInput = React.FC<React.PropsWithChildren<InputProps>> & {
  TextArea?: React.FC<React.PropsWithChildren<TextAreaProps>>
}

export const InputPreview: ComposedInput = connect(
  AntdInput,
  mapProps((props, field) => {
    const [value, setValue] = useState<any>()
    useEffect(() => {
      setValue(props.value)
    }, [props.value])
    return {
      ...props,
      className: classnames(
        styles.input_preview,
        props.className,
        props.redClassName
      ),
      value: field.authType == 'NONE' ? '' : props.value,
      placeholder: props.disabled ? '' : props.placeholder,
      onClick: () => {},
      suffix: (
        <>
          {field?.['loading'] || field?.['validating'] || props?.suffix ? (
            <span>
              {field?.['loading'] || field?.['validating'] ? (
                <LoadingOutlined />
              ) : (
                props.suffix
              )}
            </span>
          ) : null}
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
      ),
    }
  })
  //mapReadPretty(PreviewText.Input)
)

//Input.TextArea = connect(AntdInput.TextArea, mapReadPretty(PreviewText.Input))
InputPreview.TextArea = connect(
  AntdInput.TextArea,
  mapProps((props, field) => {
    return {
      ...props,
      style: field.editable
        ? { ...props.style }
        : { ...props.style, background: '#f5f5f5' },
      value: props.authType == 'NONE' ? '' : props.value,
    }
  })
)
export default InputPreview
