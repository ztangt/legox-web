import IconLeft from '@/Icon-left'
import { creatPortalFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer } from '@formily/react'
import { MicroAppWithMemoHistory } from 'umi'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'

export const PortalCustom: DnFC<any> = observer((props) => {
  // const masterProps = useModel('@@qiankunStateFromMaster')
  // const { location } = masterProps

  return (
    <div className={styles.custom} {...props}>
      {props?.microname && props?.microurl ? (
        <MicroAppWithMemoHistory
          name={props?.microname}
          url={props?.microurl}
        />
      ) : (
        <MicroAppWithMemoHistory name={'business_cma'} url={'/demo0'} />
      )}
    </div>
  )
})
PortalCustom.Behavior = createBehavior({
  name: 'PortalCustom',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalCustom',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalCustom),
  },
  designerLocales: AllLocales.PortalCustom,
})

PortalCustom.Resource = createResource({
  icon: <IconLeft type="icon-shurukuang" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalCustom',
        'x-decorator': 'FormItem',
        'x-component': 'PortalCustom',
        'x-component-props': {
          style: {
            height: '400px',
            padding: '8px',
            // lineHeight: '200px',
            // ...initStyle?.style,
            // minHeight: '200px',
            // minWidth: '200px',
            // borderStyle: 'none',
          },
        },
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],
          fulfill: {
            run:
              "var microname = ''; //子系统名称 如:  business_cma\nvar microurl = '' //页面路由名称 如:  /demo1\n$props({\n  microname,\n  microurl,\n})",
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
