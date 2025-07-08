import IconLeft from '@/Icon-left'
import { creatPortalFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer } from '@formily/react'
import { useState } from 'react'
import head_img from '../../../public/assets/user_header.jpg'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'

export const PortalProfile: DnFC<any> = observer((props) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const { width, height } = { width: 415, height: 360 }
  const screenScale = () => {
    let ww = props.width / width
    let wh = props.height / height
    return ww < wh ? ww : wh
  }
  const getScale = screenScale()
  const [scale, setScale] = useState(getScale)

  return (
    <div
      className={styles.user_title}
      style={{
        transform: `scale(${scale}) translate(-50%, -50%)`,
        WebkitTransform: `scale(${scale}) translate(-50%, -50%)`,
        // width,
        // props.height
      }}
      {...props}
    >
      <p
        style={{
          marginBottom: 22,
          // marginBottom: window.location.href?.includes('business_application')
          //   ? 22
          //   : 0,
        }}
      >
        {userInfo.userName}，欢迎登录本门户
      </p>
      <div className={styles.user_info}>
        <img src={userInfo.picturePath ? userInfo.picturePath : head_img} />
        <ul>
          <li>账号：{userInfo.userAccount}</li>
          <li>部门：{userInfo.deptName}</li>
          <li>岗位：{userInfo.postName}</li>
        </ul>
      </div>
    </div>
  )
})
PortalProfile.Behavior = createBehavior({
  name: 'PortalProfile',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalProfile',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalProfile),
  },
  designerLocales: AllLocales.PortalProfile,
})

PortalProfile.Resource = createResource({
  icon: <IconLeft type="icon-shurukuang" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalProfile',
        'x-decorator': 'FormItem',
        'x-component': 'PortalProfile',
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
