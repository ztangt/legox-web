import IconFont from '@/Icon-font'
import IconLeft from '@/Icon-left'
import { creatPortalFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer } from '@formily/react'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import LeftTitle from '../../../public/leftTitle'
import { isInIconFont } from '../../../utils/utils'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'

export const PortalApp: DnFC<any> = observer((props) => {
  const { setState, appList, getAppList } = useModel('portalPreview')
  const [rows, setRows] = useState(0)

  useEffect(() => {
    // 设计页 无需请求 给个默认展示数据
    if (window.location.href?.includes('business_application')) {
      getAppList({})
    } else {
      setState({
        appList: defaultList,
      })
    }
  }, [])

  // TODO
  const defaultList = [
    {
      menuId: '1557205370345144321',
      menuName: '待办事项待办事项待办事项',
      menuLink: '/waitMatter',
      menuIcon: 'default',
    },
    {
      menuId: '1557205370340950019',
      menuName: '传阅事项',
      menuLink: '/circulateWork',
      menuIcon: 'default',
    },
    {
      menuId: '1557205370345144321',
      menuName: '待办事项',
      menuLink: '/waitMatter',
      menuIcon: 'default',
    },
    {
      menuId: '1557205370340950019',
      menuName: '传阅事项',
      menuLink: '/circulateWork',
      menuIcon: 'default',
    },
  ]
  function onLinkClick(item) {
    if (
      window.location.href?.includes('business_application') &&
      !window.location.href?.includes('portalDesigner')
    ) {
      window.localStorage.setItem('portalQuery', JSON.stringify(item))
      setTimeout(() => {
        window.location.href = `#/business_application?sys=portal&portalTitle=工作台&portalPosition=sys`
      }, 0)
    }
  }

  // const onResize = () => {
  //   let oneWidth = document.getElementById('app_list').offsetWidth
  //   setRows((oneWidth - 16 - 8 ) / 120)
  // }

  // useEffect(() => {
  //   window.addEventListener('resize', onResize)
  //   return () => {
  //     window.removeEventListener('resize', onResize)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (document.getElementById('app_list')?.offsetWidth) {
  //     // let width = appList.length * 120 + 16 + (appList.length - 1) * 16;
  //     let oneWidth = document.getElementById('app_list').offsetWidth
  //     setRows((oneWidth - 16 - 8 ) / 120)
  //   }
  // }, [document.getElementById('app_list')?.offsetWidth])
  return (
    <div className={styles.app_list} {...props} id="app_list">
      <LeftTitle title="最近应用"></LeftTitle>
      <ul style={{ height: `calc(${props.style.height} - 40px)` }}>
        {appList.map((item, index) => (
          <li
            className={styles.app}
            key={index}
            onClick={() => {
              onLinkClick(item)
            }}
          >
            <IconFont
              type={`icon-${isInIconFont(item)}`}
              className={
                styles[`color_${index % 5}`]
                // styles[`color_${item.menuId?.replace(/[^\d]/g, '') % 5}`]
              }
            />
            <i title={item.menuName}>{item.menuName}</i>
          </li>
        ))}
      </ul>
    </div>
  )
})
PortalApp.Behavior = createBehavior({
  name: 'PortalApp',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalApp',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalApp),
  },
  designerLocales: AllLocales.PortalApp,
})

PortalApp.Resource = createResource({
  icon: <IconLeft type="icon-shurukuang" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalApp',
        'x-decorator': 'FormItem',
        'x-component': 'PortalApp',
        'x-component-props': {
          style: {
            height: '400px',
            padding: '8px',
            // lineHeight: '200px',
            // ...initStyle?.style,
            // minHeight: '360px',
            // minWidth: '415px',
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
