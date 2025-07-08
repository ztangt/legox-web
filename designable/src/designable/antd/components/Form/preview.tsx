import { createBehavior, createResource } from '@/designable/core'
import { DnFC, usePrefix } from '@/designable/react'
import { Form as FormilyForm } from '@/formily/antd'
import { createForm } from '@formily/core'
import { observer } from '@formily/react'
import React, { useMemo } from 'react'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import './styles.less'

export const Form: DnFC<React.ComponentProps<typeof FormilyForm>> = observer(
  (props) => {
    const prefix = usePrefix('designable-form')
    const form = useMemo(
      () =>
        createForm({
          designable: true,
        }),
      []
    )
    return (
      <FormilyForm
        {...props}
        style={{ ...props.style }}
        className={prefix}
        form={form}
      >
        {props.children}
      </FormilyForm>
    )
  }
)
var properties = {
  ...(AllSchemas.FormLayout.properties as any),
  // style: AllSchemas.CSSStyle,
}
if (
  window.location.href.includes('/portalDesigner') ||
  window.location.href.includes('/chartDesigner')
) {
  properties = {
    ...(AllSchemas.FormPortalLayout.properties as any),
  }
}

Form.Behavior = createBehavior({
  name: 'Form',
  selector: (node) => node.componentName === 'Form',
  designerProps(node) {
    return {
      draggable: !node.isRoot,
      cloneable: !node.isRoot,
      deletable: !node.isRoot,
      droppable: true,
      propsSchema: {
        type: 'object',
        properties,
      },
      defaultProps: {
        labelCol: window.location.href.includes('/portalDesigner') ? 0 : 6,
        wrapperCol: window.location.href.includes('/portalDesigner') ? 24 : 18,
      },
    }
  },
  designerLocales: AllLocales.Form,
})

Form.Resource = createResource({
  title: { 'zh-CN': '表单', 'en-US': 'Form' },
  icon: 'FormLayoutSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'object',
        'x-component': 'Form',
      },
    },
  ],
})
