import IconLeft from '@/Icon-left'
import { creatPortalFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { RightOutlined } from '@ant-design/icons'
import { observer } from '@formily/react'
import { useEffect } from 'react'
import { useModel } from 'umi'
import LeftTitle from '../../../public/leftTitle'
import { dataFormat } from '../../../utils/utils'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'

export const PortalNotice: DnFC<any> = observer((props) => {
  const { setState, noticeList, getNoticeViewList } = useModel('portalPreview')

  useEffect(() => {
    // 设计页 无需请求 给个默认展示数据
    if (window.location.href?.includes('business_application')) {
      getNoticeViewList({ start: 1, limit: 10 })
    } else {
      setState({
        noticeList: defaultList,
      })
    }
  }, [])

  const defaultList = [
    {
      noticeTitle:
        '通知1通知1通知1通知1通知1通知1通知1通知1通知1通知1通知1通知1通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
    {
      noticeTitle: '通知1',
      releaseTime: '1694742900',
    },
  ]

  function linkToTraceWork() {
    if (
      window.location.href?.includes('business_application') &&
      !window.location.href?.includes('portalDesigner')
    ) {
      window.location.href = `#/business_application/notificationList?sys=portal&portalTitle=通知公告`
    }
    // TODO
    // historyPush({ pathname: '/notificationList' });
  }

  const onShowIntroClick = (val) => {
    if (
      window.location.href?.includes('business_application') &&
      !window.location.href?.includes('portalDesigner')
    ) {
      window.location.href = `#/business_application/noticePage?sys=portal&portalTitle=查看&title=查看&id=${val.noticeId}`
    }
  }

  return (
    <div className={styles.container} {...props}>
      <div className={styles.top}>
        <LeftTitle title="通知公告"></LeftTitle>
        <div className={styles.right} onClick={linkToTraceWork}>
          <h6>查看全部</h6>
          {/* <p>查看全部</p> */}
          <RightOutlined />
        </div>
      </div>
      <div className={styles.list}>
        <ul style={{ height: `calc(${props.style.height} - 55px)` }}>
          {noticeList.map((item, index) => {
            return (
              <li
                key={item?.id || index}
                onClick={() => onShowIntroClick(item)}
              >
                <span className={styles.title} title={item.noticeTitle}>
                  {item.noticeTitle}
                </span>
                <span className={styles.date}>
                  {dataFormat(item.releaseTime)}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
})
PortalNotice.Behavior = createBehavior({
  name: 'PortalNotice',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalNotice',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalNotice),
  },
  designerLocales: AllLocales.PortalNotice,
})

PortalNotice.Resource = createResource({
  icon: <IconLeft type="icon-shurukuang" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalNotice',
        'x-decorator': 'FormItem',
        'x-component': 'PortalNotice',
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
