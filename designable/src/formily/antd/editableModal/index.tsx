import React, { useLayoutEffect, useRef, useState } from 'react'
import { isVoidField, Field } from '@formily/core'
import { useField, observer } from '@formily/react'
import { Popover, Modal, Input, Button } from 'antd'
import { EditOutlined, CloseOutlined, MessageOutlined } from '@ant-design/icons'
import { BaseItem, IFormItemProps } from '../form-item'
import { ModalProps } from 'antd/lib/modal'
import { useClickAway, usePrefixCls } from '../__builtins__'
import cls from 'classnames'
/**
 * 默认Inline展示
 */

type IModalProps = ModalProps

type ComposedEditableModal = React.FC<
  React.PropsWithChildren<IFormItemProps>
> & {
  Modal?: React.FC<
    React.PropsWithChildren<IModalProps & { title?: React.ReactNode }>
  >
}

const useParentPattern = () => {
  const field = useField<Field>()
  return field?.parent?.pattern || field?.form?.pattern
}
export const EditableModal: ComposedEditableModal = observer((props) => {
  return 'TODO' //TODO
})

EditableModal.Modal = observer((props) => {
  const field = useField<Field>()
  const pattern = useParentPattern()
  const [visible, setVisible] = useState(false)
  const prefixCls = usePrefixCls('formily-editable')
  return (
    <>
      <Modal
        {...props}
        title={props.title || field.title}
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
        onOk={() => {
          setVisible(false)
        }}
      >
        {props.children}
      </Modal>
      <a
        onClick={() => {
          setVisible(true)
        }}
      >
        查看
      </a>
    </>
  )
})

export default EditableModal
