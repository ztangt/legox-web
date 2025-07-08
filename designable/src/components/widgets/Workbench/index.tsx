import IconFont from '@/Icon-font'
import { PlusOutlined } from '@ant-design/icons'
import { Modal, Tabs } from 'antd'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import SetModal from '../../../custom/components/PortalWorkbench/SetModal'
import { getParam } from '../../../utils/index'
import { isInIconFont } from '../../../utils/utils'
import styles from './index.less'
function Index({ onCancel, onSubmit, loading }) {
  const {
    setState,
    getRegister,
    getMenu,
    addWorkList,
    getWorkListBack,
    registers,
    menus,
    workListBack,
    selectKeys,
  } = useModel('portalDesignable')
  const [modalVisible, setModalVisible] = useState(false)
  const [tabActivityKey, setTabActivityKey] = useState('')

  useEffect(() => {
    getRegister(
      {
        start: 1,
        limit: 100,
        registerFlag: 'PLATFORM_BUSS',
      },
      (data) => {
        setTabActivityKey(data?.[0]?.id)
        getMenu({ registerId: data?.[0]?.id })
        getWorkListBack({
          registerId: data?.[0]?.id,
          sceneId: getParam().sceneId,
        })
      }
    )
  }, [])

  const renderChild = (infos) => {
    return (
      <ul>
        {infos.map((info, index) => (
          <li
            className={styles.app}
            key={info.menuId || index}
            onClick={() => {
              // linkToAny(info.path);
            }}
          >
            <IconFont
              type={`icon-${isInIconFont(info)}`}
              style={{ color: '#1890FF' }}
            />
            <i>{info.menuName}</i>
          </li>
        ))}
        <li className={styles.app}>
          <PlusOutlined
            onClick={onShowSetModal}
            style={{ fontSize: 46, marginTop: 32, color: '#1890FF' }}
          />
        </li>
      </ul>
    )
  }

  const items = registers.map((item) => {
    return {
      key: item.id,
      label: item.registerName,
      children: <>{renderChild(workListBack)}</>,
    }
  })

  const changeTabs = (activeKey) => {
    setTabActivityKey(activeKey)
    getWorkListBack({ registerId: activeKey, sceneId: getParam().sceneId })
    getMenu({ registerId: activeKey })
  }

  function onShowSetModal() {
    setModalVisible(true)
  }

  function onBottomOkClick() {
    addWorkList(
      {
        sceneId: getParam().sceneId,
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

  return (
    <Modal
      open={true}
      footer={false}
      width={800}
      title={'工作台设置'}
      onCancel={onCancel}
      // maskClosable={false}
      // mask={false}
    >
      <div className={styles.container}>
        <div className={styles.main}>
          <Tabs
            type="card"
            onChange={changeTabs}
            activeKey={tabActivityKey}
            // tabBarExtraContent={
            //   <Button size="small" style={{ width: 90 }}>
            //     进入系统
            //     <RightOutlined />
            //   </Button>
            // }
            items={items}
          />
        </div>
        <SetModal
          title="应用添加"
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
    </Modal>
  )
}

export default Index
