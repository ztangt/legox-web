import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { isVoidField } from '@formily/core'
import { connect, mapProps } from '@formily/react'
import { Popover, Tooltip } from 'antd'
import cls from 'classnames'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { pickDataProps, usePrefixCls } from '../__builtins__'
import { FormLayoutShallowContext, useFormLayout } from '../form-layout'

export interface IFormItemProps {
  className?: string
  style?: React.CSSProperties
  prefixCls?: string
  label?: React.ReactNode
  colon?: boolean
  tooltip?: React.ReactNode
  tooltipIcon?: React.ReactNode
  layout?: 'vertical' | 'horizontal' | 'inline'
  tooltipLayout?: 'icon' | 'text'
  labelStyle?: React.CSSProperties
  labelAlign?: 'left' | 'right'
  labelWrap?: boolean
  labelWidth?: number | string
  wrapperWidth?: number | string
  labelCol?: number
  wrapperCol?: number
  wrapperAlign?: 'left' | 'right'
  wrapperWrap?: boolean
  wrapperStyle?: React.CSSProperties
  fullness?: boolean
  addonBefore?: React.ReactNode
  addonAfter?: React.ReactNode
  size?: 'small' | 'default' | 'large'
  inset?: boolean
  extra?: React.ReactNode
  feedbackText?: React.ReactNode
  feedbackLayout?: 'loose' | 'terse' | 'popover' | 'none' | (string & {})
  feedbackStatus?: 'error' | 'warning' | 'success' | 'pending' | (string & {})
  feedbackIcon?: React.ReactNode
  getPopupContainer?: (node: HTMLElement) => HTMLElement
  asterisk?: boolean
  gridSpan?: number
  bordered?: boolean
}

type ComposeFormItem = React.FC<React.PropsWithChildren<IFormItemProps>> & {
  BaseItem?: React.FC<React.PropsWithChildren<IFormItemProps>>
}

const useFormItemLayout = (props: IFormItemProps) => {
  const layout = useFormLayout()
  return {
    ...props,
    layout: props.layout ?? layout.layout ?? 'horizontal',
    colon: props.colon ?? layout.colon,
    labelAlign:
      layout.layout === 'vertical'
        ? props.labelAlign ?? layout.labelAlign ?? 'left'
        : props.labelAlign ?? layout.labelAlign ?? 'right',
    labelWrap: props.labelWrap ?? layout.labelWrap,
    labelWidth: props.labelWidth ?? layout.labelWidth,
    wrapperWidth: props.wrapperWidth ?? layout.wrapperWidth,
    labelCol: props.labelCol ?? layout.labelCol,
    wrapperCol: props.wrapperCol ?? layout.wrapperCol,
    wrapperAlign: props.wrapperAlign ?? layout.wrapperAlign,
    wrapperWrap: props.wrapperWrap ?? layout.wrapperWrap,
    fullness: props.fullness ?? layout.fullness,
    size: props.size ?? layout.size,
    inset: props.inset ?? layout.inset,
    asterisk: props.asterisk,
    bordered: props.bordered ?? layout.bordered,
    feedbackIcon: props.feedbackIcon,
    feedbackLayout: props.feedbackLayout ?? layout.feedbackLayout ?? 'loose',
    tooltipLayout: props.tooltipLayout ?? layout.tooltipLayout ?? 'icon',
    tooltipIcon: props.tooltipIcon ?? layout.tooltipIcon ?? (
      <QuestionCircleOutlined />
    ),
  }
}

function useOverflow<
  Container extends HTMLElement,
  Content extends HTMLElement
>() {
  const [overflow, setOverflow] = useState(false)
  const containerRef = useRef<Container>()
  const contentRef = useRef<Content>()
  const layout = useFormLayout()
  const labelCol = JSON.stringify(layout.labelCol)
  function setOverflowFn() {
    setTimeout(() => {
      if (containerRef.current && contentRef.current) {
        const contentWidth = contentRef.current.getBoundingClientRect().width
        const containerWidth = containerRef.current.getBoundingClientRect()
          .width
        if (contentWidth && containerWidth && containerWidth < contentWidth) {
          if (!overflow) setOverflow(true)
        } else {
          if (overflow) setOverflow(false)
        }
      }
    })
  }
  useEffect(() => {
    setOverflowFn()
  }, [labelCol])
  const onResize = useCallback(() => {
    setOverflowFn()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [labelCol])
  return {
    overflow,
    containerRef,
    contentRef,
  }
}

const ICON_MAP = {
  error: <CloseCircleOutlined />,
  success: <CheckCircleOutlined />,
  warning: <ExclamationCircleOutlined />,
}

export const BaseItem: React.FC<React.PropsWithChildren<IFormItemProps>> = ({
  children,
  ...props
}) => {
  const [active, setActive] = useState(false)
  const formLayout = useFormItemLayout(props)

  const {
    label,
    style,
    layout,
    colon = true,
    addonBefore,
    addonAfter,
    asterisk,
    feedbackStatus,
    extra,
    feedbackText,
    fullness,
    feedbackLayout,
    feedbackIcon,
    getPopupContainer,
    inset,
    bordered = true,
    labelWidth,
    wrapperWidth,
    labelCol,
    wrapperCol,
    labelAlign,
    wrapperAlign = 'left',
    size,
    labelWrap,
    wrapperWrap,
    tooltipLayout,
    tooltip,
    tooltipIcon,
  } = formLayout
  const { containerRef, contentRef, overflow } = useOverflow<
    HTMLDivElement,
    HTMLSpanElement
  >()
  const labelStyle = { ...formLayout.labelStyle }
  const wrapperStyle = { ...formLayout.wrapperStyle }
  // 固定宽度
  let enableCol = false
  if (labelWidth || wrapperWidth) {
    if (labelWidth) {
      labelStyle.width = labelWidth === 'auto' ? undefined : labelWidth
      labelStyle.maxWidth = labelWidth === 'auto' ? undefined : labelWidth
    }
    if (wrapperWidth) {
      wrapperStyle.width = wrapperWidth === 'auto' ? undefined : wrapperWidth
      wrapperStyle.maxWidth = wrapperWidth === 'auto' ? undefined : wrapperWidth
    }
    // 栅格模式
  }
  if (labelCol || wrapperCol) {
    if (!labelStyle.width && !wrapperStyle.width && layout !== 'vertical') {
      enableCol = true
    }
  }

  const prefixCls = usePrefixCls('formily-item', props)
  const formatChildren =
    feedbackLayout === 'popover' ? (
      <Popover
        autoAdjustOverflow
        placement="topRight"
        overlayClassName="popover-help"
        content={
          <div
            onClick={() => {
              function onfocus(tags) {
                if (tags && tags.length) {
                  tags?.[0]?.focus()
                  return
                }
              }
              function onClick(tags) {
                if (tags && tags.length) {
                  // tags?.[0]?.children?.[0]
                  tags?.[0]?.click()
                  return
                }
              }
              const povertag = container.current?.getElementsByClassName(
                'ant-popover'
              )?.[0]
              povertag.style.display = 'none'
              // container.current?.getElementsByClassName('ant-popover')?.[0].style.display = 'none'
              //获取当前控件的焦点
              let tags = container?.current?.getElementsByTagName('input')
              onfocus(tags)
              tags = container?.current?.getElementsByTagName('textarea')
              onfocus(tags)
              tags = container?.current?.getElementsByClassName(
                'ant-select-arrow'
              )
              onClick(tags?.[0]?.children)
              tags = container?.current?.getElementsByClassName('click_suffix')
              onClick(tags)
            }}
            className={cls({
              [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
              [`${prefixCls}-help`]: true,
            })}
          >
            {feedbackStatus == 'error' ? '*' : ICON_MAP[feedbackStatus]}{' '}
            {feedbackText}
          </div>
        }
        open={!!feedbackText}
        getPopupContainer={
          getPopupContainer ? getPopupContainer : () => container.current
        }
        destroyTooltipOnHide={true}
      >
        {children}
      </Popover>
    ) : (
      children
    )

  const gridStyles: React.CSSProperties = {}

  const getOverflowTooltip = () => {
    if (overflow) {
      return (
        <div>
          <div>{label}</div>
          <div>{tooltip}</div>
        </div>
      )
    }
    return tooltip
  }

  const renderLabelText = () => {
    const labelChildren = (
      <div className={`${prefixCls}-label-content`} ref={containerRef}>
        <span ref={contentRef}>
          {asterisk && <span className={`${prefixCls}-asterisk`}>{'*'}</span>}
          <label>{label}</label>
        </span>
      </div>
    )

    if ((tooltipLayout === 'text' && tooltip) || overflow) {
      return (
        <Tooltip
          placement="top"
          align={{ offset: [0, 10] }}
          title={getOverflowTooltip()}
        >
          {labelChildren}
        </Tooltip>
      )
    }
    return labelChildren
  }

  const renderTooltipIcon = () => {
    if (tooltip && tooltipLayout === 'icon' && !overflow) {
      return (
        <span className={`${prefixCls}-label-tooltip-icon`}>
          <Tooltip placement="top" align={{ offset: [0, 2] }} title={tooltip}>
            {tooltipIcon}
          </Tooltip>
        </span>
      )
    }
  }

  const renderLabel = () => {
    if (!label) return null
    return (
      <div
        className={cls({
          [`${prefixCls}-label`]: true,
          [`${prefixCls}-label-tooltip`]:
            (tooltip && tooltipLayout === 'text') || overflow,
          [`${prefixCls}-item-col-${labelCol}`]: enableCol && !!labelCol,
        })}
        style={labelStyle}
      >
        {renderLabelText()}
        {renderTooltipIcon()}
        {label !== ' ' && (
          <span className={`${prefixCls}-colon`}>{colon ? ':' : ''}</span>
        )}
      </div>
    )
  }
  const container = useRef<HTMLDivElement>()

  return (
    <div
      {...pickDataProps(props)}
      style={{
        ...style,
        ...gridStyles,
      }}
      data-grid-span={props.gridSpan}
      className={cls({
        [`${prefixCls}`]: true,
        [`${prefixCls}-layout-${layout}`]: true,
        [`${prefixCls}-${feedbackStatus}`]: !!feedbackStatus,
        [`${prefixCls}-feedback-has-text`]: !!feedbackText,
        [`${prefixCls}-size-${size}`]: !!size,
        [`${prefixCls}-feedback-layout-${feedbackLayout}`]: !!feedbackLayout,
        [`${prefixCls}-fullness`]: !!fullness || !!inset || !!feedbackIcon,
        [`${prefixCls}-inset`]: !!inset,
        [`${prefixCls}-active`]: active,
        [`${prefixCls}-inset-active`]: !!inset && active,
        // [`${prefixCls}-label-align-${labelAlign}`]: true,
        [`${prefixCls}-control-align-${wrapperAlign}`]: true,
        [`${prefixCls}-label-wrap`]: !!labelWrap,
        [`${prefixCls}-control-wrap`]: !!wrapperWrap,
        [`${prefixCls}-bordered-none`]:
          bordered === false || !!inset || !!feedbackIcon,
        [props.className]: !!props.className,
      })}
      onFocus={() => {
        if (feedbackIcon || inset) {
          setActive(true)
        }
      }}
      onBlur={() => {
        if (feedbackIcon || inset) {
          setActive(false)
        }
      }}
    >
      {renderLabel()}
      <div
        className={cls({
          [`${prefixCls}-control`]: true,
          [`${prefixCls}-item-col-${wrapperCol}`]:
            enableCol && !!wrapperCol && label,
        })}
      >
        <div className={cls(`${prefixCls}-control-content`)}>
          {addonBefore && (
            <div className={cls(`${prefixCls}-addon-before`)}>
              {addonBefore}
            </div>
          )}
          <div
            ref={container}
            style={wrapperStyle}
            className={cls({
              [`${prefixCls}-control-content-component`]: true,
              [`${prefixCls}-control-content-component-has-feedback-icon`]: !!feedbackIcon,
            })}
          >
            <FormLayoutShallowContext.Provider value={undefined}>
              {formatChildren}
              {/* {children} */}
            </FormLayoutShallowContext.Provider>
            {feedbackIcon && (
              <div className={cls(`${prefixCls}-feedback-icon`)}>
                {feedbackIcon}
              </div>
            )}
          </div>
          {addonAfter && (
            <div className={cls(`${prefixCls}-addon-after`)}>{addonAfter}</div>
          )}
        </div>
        {!!feedbackText &&
          feedbackLayout !== 'popover' &&
          feedbackLayout !== 'none' && (
            <div
              className={cls({
                [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
                [`${prefixCls}-help`]: true,
                [`${prefixCls}-help-enter`]: true,
                [`${prefixCls}-help-enter-active`]: true,
              })}
            >
              {feedbackText}
            </div>
          )}
        {extra && <div className={cls(`${prefixCls}-extra`)}>{extra}</div>}
      </div>
    </div>
  )
}

// 适配
export const FormItem: ComposeFormItem = connect(
  BaseItem,
  mapProps((props, field) => {
    if (isVoidField(field))
      return {
        label: field.title || props.label,
        asterisk: props.asterisk,
        extra: props.extra || field.description,
      }
    if (!field) return props
    const takeFeedbackStatus = () => {
      if (field.validating) return 'pending'
      return field.decoratorProps.feedbackStatus || field.validateStatus
    }
    const takeMessage = () => {
      const split = (messages: any[]) => {
        return messages.reduce((buf, text, index) => {
          if (!text) return buf
          return index < messages.length - 1
            ? buf.concat([text, ', '])
            : buf.concat([text])
        }, [])
      }
      if (field.validating) return
      if (props.feedbackText) return props.feedbackText
      if (field.selfErrors.length) return split(field.selfErrors)
      if (field.selfWarnings.length) return split(field.selfWarnings)
      if (field.selfSuccesses.length) return split(field.selfSuccesses)
    }
    const takeAsterisk = () => {
      if (field.required && field.pattern !== 'readPretty') {
        return true
      }
      if ('asterisk' in props) {
        return props.asterisk
      }
      return false
    }
    return {
      label: props.label || field.title,
      feedbackStatus: takeFeedbackStatus(),
      feedbackText: takeMessage(),
      asterisk: takeAsterisk(),
      extra: props.extra || field.description,
    }
  })
)

FormItem.BaseItem = BaseItem

export default FormItem
