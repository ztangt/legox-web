import IconLeft from '@/Icon-left'
import { creatPortalFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer } from '@formily/react'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'

export const PortalTitle: DnFC<any> = observer((props) => {
  return (
    <div className={styles.left} {...props}>
      <a></a>
      <span style={{ marginTop: 8 }}>{props?.title || '自定义标题'}</span>
    </div>
  )
})
PortalTitle.Behavior = createBehavior({
  name: 'PortalTitle',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalTitle',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalTitle),
  },
  designerLocales: AllLocales.PortalTitle,
})

PortalTitle.Resource = createResource({
  icon: <IconLeft type="icon-shurukuang" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalTitle',
        'x-decorator': 'FormItem',
        'x-component': 'PortalTitle',
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],
          fulfill: {
            run: "var title = '自定义标题';\n $props({\n  title,\n })",
          },
        },
        'x-component-props': {
          style: {
            height: '32px',
            padding: '8px 0 0 8px',
            // lineHeight: '200px',
            // ...initStyle?.style,
            // minHeight: '200px',
            // minWidth: '200px',
            // borderStyle: 'none',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            // ...initStyle?.labelStyle,
            width: '0px',
          },
        },
      },
    },
  ],
})
