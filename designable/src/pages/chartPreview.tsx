import {
  BaseChart,
  Button,
  FormTablePreview as FormTable,
  Input,
  PortalBar,
  PortalBarCoordinate,
  PortalBarLand,
  PortalBarStacked,
  PortalCustom,
  PortalLine,
  PortalLineSmooth,
  PortalPie,
  PortalPieDouble,
  PortalPieHollow,
  PortalTitle,
  Year,
  YearPicker,
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
      Input,
      BaseChart,
      FormItem,
      FormLayout,
      PortalBar,
      PortalBarLand,
      PortalBarStacked,
      PortalBarCoordinate,
      PortalPie,
      PortalPieDouble,
      PortalPieHollow,
      PortalLine,
      PortalLineSmooth,
      PortalTitle,
      PortalCustom,
      YearPicker,
      Year,
      Button,
      FormTable,
    },
  })
  const { location } = useModel('@@qiankunStateFromMaster')

  const { sceneLayoutJson, getChartBean } = useModel('chartPreview')
  console.log()

  const { form: formProps, schema } = sceneLayoutJson

  useEffect(() => {
    getChartBean({ id: location.query.id })
  }, [])

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
        className="preview_warp"
        style={{ background: '#F7F7F7' }}
        // style={{ marginLeft: '10px' }} , overflowY: 'hidden'
      >
        <SchemaField schema={schema} />
      </Form>
    )
  }, [schema])
  return <>{formRender}</>
}
export default Preview
