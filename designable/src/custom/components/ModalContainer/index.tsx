import React, { useLayoutEffect, useRef, useState } from 'react'
import { Field } from '@formily/core'
import { useField, observer } from '@formily/react'
import { Modal } from 'antd'
import { IFormItemProps } from '../../../formily/antd/form-item'
import { ModalProps } from 'antd/lib/modal'
import { useModel } from 'umi'
import GlobalModal from '@/public/GlobalModal'
type IModalProps = ModalProps

type ComposedEditableModal = React.FC<
  React.PropsWithChildren<IFormItemProps>
> & {
  Modal?: React.FC<
    React.PropsWithChildren<IModalProps & { title?: React.ReactNode }>
  >
}

export const ModalContainer: ComposedEditableModal = observer((props) => {
  const masterProps = useModel('@@qiankunStateFromMaster')
  let { targetKey } = masterProps
  const field = useField<Field>()
  //此处的props需是子组件的decoratorProps
  return (
    <>
      {props.visible && (
        <GlobalModal
          {...props}
          title={props.title || field.title}
          open={props.visible}
          onCancel={() => {
            if (props.onCancel) {
              props.onCancel()
              return
            }
            field.setDecoratorProps({
              visible: false,
            })
          }}
          onOk={(e) => {
            if (props.onOk) {
              props.onOk(e)
              return
            }
            field.setDecoratorProps({
              visible: false,
            })
          }}
          getContainer={() => {
            return document.getElementById(`formShow_container_${targetKey}`)
          }}
          mask={false}
          maskClosable={false}
          widthType={'3'}
          bodyStyle={{ height: 'calc(100%*0.8px - 87px)', overflow: 'auto' }}
          className={'preview_warp'}
        >
          {props.children}
        </GlobalModal>
      )}
    </>
  )
})

export default ModalContainer
