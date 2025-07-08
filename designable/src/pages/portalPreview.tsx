import {
  BaseChart,
  FormTablePreview as FormTable,
  PortalApp,
  PortalBar,
  PortalCalendar,
  PortalCustom,
  PortalFocus,
  PortalNotice,
  PortalPie,
  PortalProfile,
  PortalTitle,
  PortalTodo,
  PortalWorkbench,
} from '@/custom/components'
import { Form, FormGrid, FormItem, FormLayout } from '@/formily/antd'
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import React, { useEffect, useMemo } from 'react'
import { useModel } from 'umi'
import './preview.less'
const Text: React.FC<{
  value?: string
  content?: string
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p'
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode
  return React.createElement(tagName, props, value || content)
}
const Preview = () => {
  const SchemaField = createSchemaField({
    components: {
      FormGrid,
      Text,
      BaseChart,
      FormItem,
      FormLayout,
      PortalNotice,
      PortalTodo,
      PortalBar,
      PortalPie,
      PortalTitle,
      PortalCustom,
      PortalWorkbench,
      PortalFocus,
      PortalProfile,
      PortalApp,
      PortalCalendar,
      FormTable,
    },
  })

  const { sceneLayoutJson, getSceneLayout, sceneDefaultLayoutJson } = useModel(
    'portalPreview'
  )

  useEffect(() => {
    getSceneLayout({})
  }, [])

  // var layoutJson = sceneDefaultLayoutJson
  // if (Object.keys(sceneLayoutJson).length) {
  //   layoutJson = sceneLayoutJson
  // }
  const { form: formProps, schema } = Object.keys(sceneLayoutJson).length
    ? sceneLayoutJson
    : sceneDefaultLayoutJson
  // const { form: formProps, schema } = layoutJson

  const form = useMemo(() => {
    //组合初始数据
    let creactFrom = createForm({
      editable: false,
    })
    return creactFrom
  }, [])

  form.id = formProps?.formCode

  const formRender = useMemo(() => {
    return (
      <Form
        {...formProps}
        form={form}
        className="preview_warp portal_wrap"
        style={{ background: '#F7F7F7', overflowY: 'hidden' }}
        // style={{ marginLeft: '10px' }}
      >
        <SchemaField schema={schema} />
      </Form>
    )
  }, [schema])
  return <>{formRender}</>
}
export default Preview
