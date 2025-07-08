/**
 * @author zhangww
 * @description 自定义常用菜单modal
 */
import styles from './index.less';
import IconFont from '../../../Icon_manage';
import classnames from 'classnames';
import _ from 'lodash';
import { Modal } from 'antd';

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
}) {
  console.log('allAppList1:', allAppList);

  return (
    <Modal
      width={'80%'}
      bodyStyle={{ height: '600px', overflow: 'auto' }}
      title={title}
      visible={isSetModalVisible}
      onOk={onOkModal}
      onCancel={onHideModal}
      centered
      getContainer={() => {
        return document.getElementById(containerId)||false;
      }}
    >
      <div className={styles.zdy_modal}>
        {allAppList.map((item1, index1) => {
          return (
            <>
              <h1>{item1.menuName}</h1>
              <ul>
                {item1?.children?.map((item2, index2) => {
                  return (
                    <li onClick={() => onClickSingleApp(item2, index1, index2)}>
                      {item2.iconName ? <IconFont type={`icon-${item2.iconName}`}/> : <IconFont type='icon-default'/> }
                      <p>{item2.menuName}</p>
                      {isFast && (
                        <span
                          className={classnames(
                            styles.checkbox,
                            generalJson[currentIndex][
                              'currentMenuKeys'
                            ].includes(item2.menuId)
                              ? styles.checked
                              : styles.unchecked,
                          )}
                        ></span>
                      )}
                      {isFusion && (
                        <span
                          className={classnames(
                            styles.checkbox,
                            item2.selected ? styles.checked : styles.unchecked,
                          )}
                        ></span>
                      )}
                      {isFif && (
                        <span
                          className={classnames(
                            styles.checkbox,
                            selectKeys.includes(item2.menuId)
                              ? styles.checked
                              : styles.unchecked,
                          )}
                        ></span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          );
        })}
      </div>
    </Modal>
  );
}

export default Index;
