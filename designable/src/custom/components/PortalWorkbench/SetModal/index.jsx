/**
 * @author zhangww
 * @description 自定义常用菜单modal
 */
import IconFont from '@/Icon-font'
import { Modal } from 'antd'
import classnames from 'classnames'
import { isInIconFont } from '../../../../utils/utils'
import styles from './index.less'

function Index({
  title,
  containerId,
  isFif,
  isFast,
  isFusion,
  generalJson,
  currentIndex,
  isSetModalVisible,
  allAppList,
  selectKeys,
  onClickSingleApp,
  onHideModal,
  onOkModal,
  desktopType,
}) {
  return (
    <Modal
      bodyStyle={{ overflow: 'auto' }}
      width={800}
      title={title}
      open={isSetModalVisible}
      onOk={onOkModal}
      onCancel={onHideModal}
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById('dom_container')
      }}
    >
      <div className={styles.zdy_modal}>
        {allAppList.map((item, index1) => {
          return item?.children?.length ? (
            <div key={item.id}>
              <h1>{item.menuName}</h1>
              <ul>
                {item?.children?.map((info, index2) => {
                  return (
                    <li
                      onClick={() => onClickSingleApp(info, index1, index2)}
                      key={info.id}
                    >
                      <IconFont type={`icon-${isInIconFont(info)}`} />
                      <p>{info.menuName}</p>
                      {isFif && (
                        <span
                          className={classnames(
                            styles.checkbox,
                            selectKeys.includes(info.id)
                              ? styles.checked
                              : styles.unchecked
                          )}
                        ></span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null
        })}
      </div>
    </Modal>
  )
}

export default Index
