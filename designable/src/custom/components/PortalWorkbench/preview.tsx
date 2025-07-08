import IconFont from '@/Icon-font'
import IconLeft from '@/Icon-left'
import { creatPortalFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import add_img from '@/public/assets/add.svg'
import { RightOutlined } from '@ant-design/icons'
import { observer } from '@formily/react'
import { Tabs } from 'antd'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import LeftTitle from '../../../public/leftTitle'
import { getParam } from '../../../utils/index'
import { isInIconFont } from '../../../utils/utils'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import SetModal from './SetModal'
import styles from './index.less'

export const PortalWorkbench: DnFC<any> = observer((props) => {
  const {
    setState,
    getRegister,
    getUserRegister,
    getMenu,
    getUserMenus,
    addWorkList,
    addFontWorkList,
    getWorkList,
    getWorkListBack,
    registers,
    menus,
    workList,
    workListBack,
    selectKeys,
  } = useModel('portalDesignable')

  const { sceneLayout } = useModel('portalPreview')

  const [modalVisible, setModalVisible] = useState(false)
  const [tabActivityKey, setTabActivityKey] = useState('')
  const [tabActivityCode, setTabActivityCode] = useState('')

  useEffect(() => {
    // 设计端和前台调用接口不同
    if (window.location.href?.includes('business_application')) {
      // 前台
      getUserRegister({}, (data) => {
        console.log(data)
        setTabActivityKey(data?.[0]?.id)
        setTabActivityCode(data?.[0]?.registerCode)
        getWorkList({
          registerId: data?.[0]?.id,
          sceneId: sceneLayout.sceneId,
        })
      })
    } else {
      // 设计端
      getRegister(
        {
          start: 1,
          limit: 100,
          registerFlag: 'PLATFORM_BUSS',
        },
        (data) => {
          setTabActivityKey(data?.[0]?.id)
          setTabActivityCode(data?.[0]?.registerCode)
          // getMenu({ registerId: data?.[0]?.id })
          getWorkListBack({
            registerId: data?.[0]?.id,
            sceneId: getParam().sceneId,
          })
        }
      )
    }
  }, [])

  function onLinkClick(item) {
    const query = item
    query.menuLink = query.path
    query.title = query.menuName
    if (
      window.location.href?.includes('business_application') &&
      !window.location.href?.includes('portalDesigner')
    ) {
      window.localStorage.setItem('portalQuery', JSON.stringify(query))
      setTimeout(() => {
        window.location.href = `#/business_application?sys=portal&portalTitle=工作台&portalPosition=sys&registerCode=${tabActivityCode}`
      }, 0)
    }
  }

  const renderChild = (infos) => {
    return (
      <ul
        style={{
          height: `calc(${props.style.height} - 116px)`,
          overflowY: 'auto',
        }}
      >
        {infos.map((info, index) => (
          <li
            className={styles.app}
            key={info.menuId || index}
            onClick={() => {
              onLinkClick(info)
            }}
          >
            <IconFont
              type={`icon-${isInIconFont(info)}`}
              style={{ color: '#1890FF' }}
            />
            <i title={info.menuName}>{info.menuName}</i>
          </li>
        ))}
        <li className={styles.app} style={{ lineHeight: '120px' }}>
          <img src={add_img} onClick={onShowSetModal} alt="" />
        </li>
      </ul>
    )
  }

  const items = registers.map((item) => {
    return {
      key: `${item.id}-${item.registerCode}`,
      label: item.registerName,
      children: (
        <>
          {renderChild(
            window.location.href?.includes('business_application')
              ? workList
              : workListBack
          )}
        </>
      ),
    }
  })

  const changeTabs = (array) => {
    let arr = array.split('-')
    setTabActivityKey(arr[0])
    setTabActivityCode(arr[1])
    // getMenu({ registerId: arr[0] })
    if (window.location.href?.includes('business_application')) {
      getWorkList({ registerId: arr[0], sceneId: sceneLayout.sceneId })
    } else {
      getWorkListBack({ registerId: arr[0], sceneId: getParam().sceneId })
    }
  }

  function onShowSetModal() {
    // if (window.location.href?.includes('business_application')) {
    getUserMenus({ type: 'ALL', registerId: tabActivityKey })
    setModalVisible(true)
    // }
  }

  function onBottomOkClick() {
    if (window.location.href?.includes('business_application')) {
      // 前台
      addFontWorkList(
        {
          registerId: tabActivityKey,
          commonMenus: selectKeys.toString(),
        },
        () => {
          setModalVisible(false)
          getWorkList({
            registerId: tabActivityKey,
            sceneId: sceneLayout.sceneId,
          })
        }
      )
    } else {
      // 后台
      addWorkList(
        {
          sceneId: getParam().sceneId || sceneLayout.sceneId,
          registerId: tabActivityKey,
          commonMenus: selectKeys.toString(),
        },
        () => {
          setModalVisible(false)
          getWorkListBack({
            registerId: tabActivityKey,
            sceneId: getParam().sceneId,
          })
        }
      )
    }
  }

  function onBottomHideClick() {
    setModalVisible(false)
  }

  Array.prototype.remove = function (val) {
    var index = this.indexOf(val)
    if (index > -1) {
      this.splice(index, 1)
    }
  }

  function onBottomSingClick(item) {
    const arr = _.clone(selectKeys)
    if (arr.includes(item.id)) {
      arr.remove(item.id)
    } else {
      arr.push(item.id)
    }
    setState({
      selectKeys: arr,
    })
  }

  function onIntoClick() {
    if (
      registers.length &&
      window.location.href?.includes('business_application') &&
      !window.location.href?.includes('portalDesigner')
    ) {
      window.location.href = `#/business_application?sys=portal&portalTitle=工作台&portalPosition=sys&registerCode=${tabActivityCode}`
    }
  }

  return (
    <div className={styles.container} {...props}>
      <LeftTitle title="工作台" />
      <div className={styles.main}>
        <Tabs
          type="card"
          onChange={changeTabs}
          activeKey={`${tabActivityKey}-${tabActivityCode}`}
          tabBarExtraContent={
            <div className={styles.right} onClick={() => onIntoClick()}>
              <h6 style={{ color: registers.length ? '#333333' : 'grey' }}>
                进入系统
              </h6>
              <RightOutlined />
            </div>
          }
          items={items}
        />
      </div>
      <SetModal
        title="工作台设置"
        containerId="root-master"
        isFif={true}
        isSetModalVisible={modalVisible}
        allAppList={menus}
        selectKeys={selectKeys}
        onOkModal={onBottomOkClick}
        onHideModal={onBottomHideClick}
        onClickSingleApp={onBottomSingClick}
      />
    </div>
  )
})
PortalWorkbench.Behavior = createBehavior({
  name: 'PortalWorkbench',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalWorkbench',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalWorkbench),
  },
  designerLocales: AllLocales.PortalWorkbench,
})

PortalWorkbench.Resource = createResource({
  icon: <IconLeft type="icon-shurukuang" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalWorkbench',
        'x-decorator': 'FormItem',
        'x-component': 'PortalWorkbench',
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
