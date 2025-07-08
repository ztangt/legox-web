import IconLeft from '@/Icon-left'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer, useFieldSchema } from '@formily/react'
import { useModel } from '@umijs/max'
import { useCallback } from 'react'
import { MicroAppWithMemoHistory } from 'umi'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
export const InsertControl: DnFC<any> = observer((props) => {
  const { location, cutomHeaders, targetKey, bizInfo, deployFormId } = useModel(
    '@@qiankunStateFromMaster'
  )
  const fieldScme: any = useFieldSchema()
  let columnCode: string = fieldScme ? fieldScme.name : ''
  const renderUrl = useCallback(() => {
    if (props.url?.includes('http')) {
      return (
        <iframe
          id="frame"
          src={props.url}
          title="iframe"
          width="100%"
          height="100%"
          scrolling="auto"
          frameborder={0}
        ></iframe>
      )
    } else if (props.url && props?.microname) {
      return (
        <MicroAppWithMemoHistory
          url={props.url}
          name={props?.microname}
          cutomHeaders={cutomHeaders}
          location={location}
          targetKey={targetKey}
          deployFormId={deployFormId}
          bizInfo={bizInfo}
          formColumnsCode={columnCode}
          props={props}
          cache
        />
      )
    } else {
      return <div style={{ color: '#999999' }}>请输入要嵌入的页面地址</div>
    }
  }, [props.url, props?.microname])
  return <div {...props}>{renderUrl()}</div>
})
InsertControl.Behavior = createBehavior({
  name: 'InsertControl',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'InsertControl',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.InsertControl),
  },
  designerLocales: AllLocales.InsertControl,
})

InsertControl.Resource = createResource({
  icon: <IconLeft type="icon-shurukuang" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '自定义页面',
        'x-decorator': 'FormItem',
        'x-component': 'InsertControl',
        'x-component-props': {
          allowClear: true,
          style: {
            ...initStyle?.style,
            height: 'auto',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
            width: '0px',
            display: 'none',
          },
        },
      },
    },
  ],
})
