import MyIcon from '@/Icon'
import { createVoidFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer } from '@formily/react'
import { Steps } from 'antd'
import { SelectProps } from 'antd/lib/select'
import classnames from 'classnames'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import { initStyle } from '../../../service/constant'
import { dataFormat } from '../../../utils/utils'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
const MOBILEDETAILTASKSTATUS = {
  BACK: '驳回',
  RECOVER: '撤回',
  RETURN: '转办',
  TRUSTED: '委托',
  ACTIVATE: '流程激活',
}
//组件的属性，可以用antd组件的属性，也可以自定义属性
// interface ExtraProps  extends SelectProps{
//   orgUserType: string;
// }
//observer（当一个组件内部使用了 observable 对象，而你希望组件响应 observable 对象的变化时）
export const FlowDetails: DnFC<SelectProps> = observer((props) => {
  const [tasks, setTasks] = useState([])
  const { getBpmnDetail } = useModel('preview')
  const { bizInfo } = useModel('@@qiankunStateFromMaster')
  useEffect(() => {
    if (window.location.href.includes('/mobile')) {
      getBpmnDetail(
        {
          bizInfoId: bizInfo.bizInfoId,
          procDefId: bizInfo.procDefId,
          hasCirculate: false,
        },
        (data: any) => {
          setTasks(data?.tasks || [])
        }
      )
    }
  }, [])
  const titleRender = (item: any) => {
    return (
      <>
        <p>{item.actName}</p>
        <p>{item.ruserName}</p>
        <p>{dataFormat(item.endTime, 'YYYY-MM-DD HH:mm:ss')}</p>
      </>
    )
  }
  const taskStatus = (text: any) => {
    return text == 0
      ? '未收未办'
      : text == 1
      ? '已收未办'
      : text == 2
      ? '已收已办'
      : text == 3
      ? '已追回'
      : ''
  }
  const descriptionRender = (item: any) => {
    return (
      <div className={styles.description}>
        <p className={styles.desc_title}>
          <span style={{ color: '#F35050' }}>
            {item.endTime
              ? MOBILEDETAILTASKSTATUS[item.makeAction]
              : taskStatus(item.taskStatus)}
          </span>
          {item.signList && item.signList.length ? (
            <label className={styles.desc_t_right}>
              {_.find(item.signList, function (o) {
                return !!o.messageImgUrl
              }) ? (
                <>
                  <span>文字签批</span>
                  <span>手写签批</span>
                </>
              ) : (
                <span style={{ marginRight: '0px' }}>文字签批</span>
              )}
            </label>
          ) : null}
        </p>
        {item.signList && item.signList.length ? (
          <ul className={styles.desc_content}>
            {item.signList.map((item) => {
              return (
                <li style={{ listStyleType: 'disc' }}>
                  {item.messageText}
                  {item.messageImgUrl ? (
                    <img src={item.messageImgUrl} width={30} />
                  ) : (
                    ''
                  )}
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    )
  }
  const items = () => {
    if (tasks.length) {
      return tasks.map((item, index) => {
        return {
          title: titleRender(item),
          description: descriptionRender(item),
          status: 'process',
          icon: (
            <div
              className={
                item.endTime
                  ? classnames(styles.item_icon)
                  : classnames(styles.item_icon, styles.item_icon_red)
              }
            >
              <span className={styles.icon}>{index + 1}</span>
            </div>
          ),
        }
      })
    } else {
      return []
    }
  }
  return (
    <>
      {window.location.href.includes('/mobile') ? (
        <div className={styles.mobile_detail} {...props}>
          <p style={{ fontWeight: '600', fontSize: '16px' }}>流程详情</p>
          <Steps
            size={'small'}
            current={0}
            direction="vertical"
            items={items()}
          />
        </div>
      ) : (
        <p {...props}>流程详情</p>
      )}
    </>
  )
})
//createBehavior 创建组件的行为，locals 信息、propsSchema 可修改属性
FlowDetails.Behavior = createBehavior({
  name: 'FlowDetails',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'FlowDetails', //组件
  designerProps: {
    propsSchema: createVoidFieldSchema(AllSchemas.FlowDetails),
  },
  designerLocales: AllLocales.FlowDetails, //语言
})
//createResource 创建资源基础信息，用于左侧拖拽组件
FlowDetails.Resource = createResource({
  icon: (
    <MyIcon
      type="icon-bumenshu"
      className="custom-icon"
      style={{ color: '#333333' }}
    />
  ),
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '办理详情',
        'x-component': 'FlowDetails', //组件
        'x-component-props': {
          style: {
            ...initStyle?.style,
            margin: '12px 8px 12px 12px',
            padding: '0px 0px 0px 0px',
            border: 'unset',
            height: 'auto',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
          },
        },
      },
    },
  ],
})
