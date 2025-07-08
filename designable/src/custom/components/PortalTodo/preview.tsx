import IconLeft from '@/Icon-left'
import { creatPortalFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { RightOutlined } from '@ant-design/icons'
import { observer } from '@formily/react'
import { Badge, Tabs } from 'antd'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import LeftTitle from '../../../public/leftTitle'
import { dataFormat } from '../../../utils/utils'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
const { TabPane } = Tabs

export const PortalTodo: DnFC<any> = observer((props) => {
  const [activeKey, setActiveKey] = useState('')

  const {
    setState,
    todoList,
    registers,
    getTodoList,
    getUserRegister,
  } = useModel('portalPreview')
  const { tabMenus, menus, historyPush, updateTab } = useModel(
    '@@qiankunStateFromMaster'
  )

  useEffect(() => {
    // 设计页 无需请求 给个默认展示数据
    if (window.location.href?.includes('business_application')) {
      // 前台
      getUserRegister({}, (arr) => {
        console.log(arr)
        for (let i = 0; i < arr.length; i++) {
          getTodoList(
            {
              registerId: arr[i].registerId,
              start: 1,
              limit: 10,
              isFrist: i + 1,
            },
            (count) => {
              arr[i].count = count
              setState({
                registers: arr,
              })
            }
          )
        }
      })
    } else {
      setState({
        todoList: defaultList,
        registers: defaultRegisters,
      })
    }
  }, [])
  const defaultList = [
    {
      bizTaskId: '1',
      bizTitle:
        '标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1',
      draftIdentityName:
        '拟稿人1拟稿人1拟稿人1拟稿人1拟稿人1拟稿人1拟稿人1拟稿人1拟拟稿人1拟稿人1拟稿人1拟稿人1拟稿人1拟稿人1拟稿人1拟稿人1拟稿人1稿人1',
      startTime: '1694742900',
    },
    {
      bizTaskId: '2',
      bizTitle: '标题1',
      draftIdentityName: '拟稿人1',
      startTime: '1694742900',
    },
    {
      bizTaskId: '3',
      bizTitle: '标题1',
      draftIdentityName: '拟稿人1',
      startTime: '1694742900',
    },
    {
      bizTaskId: '4',
      bizTitle: '标题1',
      draftIdentityName: '拟稿人1',
      startTime: '1694742900',
    },
    {
      bizTaskId: '1',
      bizTitle: '标题1',
      draftIdentityName: '拟稿人1',
      startTime: '1694742900',
    },
    {
      bizTaskId: '2',
      bizTitle: '标题1',
      draftIdentityName: '拟稿人1',
      startTime: '1694742900',
    },
    {
      bizTaskId: '3',
      bizTitle: '标题1',
      draftIdentityName: '拟稿人1',
      startTime: '1694742900',
    },
    {
      bizTaskId: '4',
      bizTitle: '标题1',
      draftIdentityName: '拟稿人1',
      startTime: '1694742900',
    },
  ]

  const defaultRegisters = [
    {
      registerId: '',
      registerName: '全部',
      count: 10,
    },
    {
      registerId: '1',
      registerName: '系统A',
      count: 3,
    },
    {
      registerId: '2',
      registerName: '系统B',
      count: 7,
    },
  ]

  function linkToDo() {
    if (
      window.location.href?.includes('business_application') &&
      !window.location.href?.includes('portalDesigner')
    ) {
      window.location.href = `#/business_application/todoList?sys=portal&portalTitle=待办事项&portalPosition=first`
    }
  }

  const linkToSingle = (obj) => {
    console.log(obj)
    if (
      window.location.href?.includes('business_application') &&
      !window.location.href?.includes('portalDesigner')
    ) {
      window.location.href = `#/business_application?sys=portal&portalTitle=工作台&portalPosition=sys&registerCode=${obj.registerCode}`
      setTimeout(() => {
        historyPush(menus, tabMenus, updateTab, {
          pathname: `/formShow`,
          query: {
            bizSolId: obj.bizSolId,
            bizInfoId: obj.bizInfoId,
            bizTaskId: obj.bizTaskId,
            title: obj.bizTitle,
            id: obj.mainTableId,
          },
        })
      }, 0)
    }
  }

  const operations = {
    left: null,
    right: (
      <div className={styles.right} onClick={linkToDo}>
        <h6>查看全部</h6>
        <RightOutlined />
      </div>
    ),
  }

  function tabOnChange(i) {
    setActiveKey(i)
    if (window.location.href?.includes('business_application')) {
      getTodoList({ registerId: i, start: 1, limit: 10 })
    }
  }

  const renderChild = () => {
    if (todoList.length) {
      return (
        <div className={styles.list}>
          <ul style={{ height: `calc(${props.style.height} - 100px)` }}>
            {todoList.map((info) => {
              return (
                <li onClick={() => linkToSingle(info)}>
                  <span className={styles.title} title={info.bizTitle}>
                    {info.bizTitle}
                  </span>
                  <span
                    className={styles.date}
                    title={dataFormat(info.startTime)}
                  >
                    {dataFormat(info.startTime)}
                  </span>
                  <span className={styles.person} title={info.draftUserName}>
                    {info.draftUserName || '-'}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )
    } else {
      return (
        <p>暂无数据</p>
        // <Result
        //   style={{width: 50, height: 50}}
        //   icon={<FolderTwoTone twoToneColor="#D9D9D9" />}
        //   title=""
        //   extra={null}
        // />
      )
    }
  }

  const items = registers.map((item) => {
    return {
      key: item.registerId,
      label: (
        <div>
          {item.registerName}
          <Badge
            showZero
            count={item.count}
            offset={[2, -2]}
            overflowCount={20}
          />
        </div>
      ),
      children: <>{renderChild()}</>,
    }
  })

  return (
    <div className={styles.follow} {...props}>
      <LeftTitle title="待办事项" />
      <div className={styles.header}>
        <Tabs
          activeKey={activeKey}
          tabBarExtraContent={operations}
          onChange={tabOnChange}
          items={items}
        />
      </div>
    </div>
  )
})
PortalTodo.Behavior = createBehavior({
  name: 'PortalTodo',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalTodo',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalTodo),
  },
  designerLocales: AllLocales.PortalTodo,
})

PortalTodo.Resource = createResource({
  icon: <IconLeft type="icon-shurukuang" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalTodo',
        'x-decorator': 'FormItem',
        'x-component': 'PortalTodo',
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
